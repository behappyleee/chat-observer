import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  IconButton,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Tab,
  Tabs,
  InputAdornment,
  Button,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import { UserType } from '../types/chat';
import { useWebSocket } from '../hooks/useWebSocket';
import axios from 'axios';

// axios 기본 설정
axios.defaults.baseURL = 'http://localhost:8083';

interface Message {
  id: string;
  sender: string;
  senderType: UserType;
  message: string;
  createdAt: string;
  channelType?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`chat-tabpanel-${index}`}
      aria-labelledby={`chat-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ChatRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUserType, setCurrentUserType] = useState<UserType>(
    location.state?.userType || 'CUSTOMER'
  );
  const [userName, setUserName] = useState<string>('');
  const [activeTab, setActiveTab] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendMessage, subscribe, isConnected } = useWebSocket();
  const subscriptionRef = useRef<any>(null);
  const isObserverRoom = location.state?.isObserverRoom;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (roomId) {
      // 채팅방 입장 시 이전 메시지 가져오기
      const fetchMessages = async () => {
        try {
          let url = `/chats/rooms/${roomId}`;
          
          // 탭에 따라 다른 userType과 channelType으로 필터링
          if (isObserverRoom) {
            // Observer 상담 탭일 때는 AGENT와 OBSERVER의 메시지만
            url += '?userType=AGENT&userType=OBSERVER&channelType=OBSERVER';
          } else {
            // 고객 상담 탭일 때는 CUSTOMER와 AGENT의 메시지만
            url += '?userType=CUSTOMER&userType=AGENT&channelType=CUSTOMER';
          }

          console.log('Fetching messages with URL:', url);
          const response = await axios.get(url);
          const messages = response.data.map((msg: any) => ({
            id: msg.id,
            sender: msg.senderId,
            senderType: msg.senderType,
            message: msg.message,
            createdAt: msg.createdAt,
            channelType: msg.channelType
          }));
          // 시간순으로 정렬 (오래된 순)
          messages.sort((a: Message, b: Message) => 
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          setMessages(messages);
        } catch (error) {
          console.error('Failed to fetch messages:', error);
        }
      };

      fetchMessages();

      // OBSERVER인 경우 고객 상담 종료 토픽 구독
      if (currentUserType === 'OBSERVER') {
        const exitTopic = `/topic/chat/${roomId}/customer/exit`;
        console.log('Subscribing to exit topic:', exitTopic);
        subscribe(exitTopic, async (message) => {
          try {
            console.log('Received exit message:', message);
            
            if (message.roomId === roomId) {
              const shouldDelete = window.confirm(
                '고객이 상담을 종료했습니다. 옵저버 와 나눈 대화 내용을 폐기 하시겠습니까?'
              );
              
              if (shouldDelete) {
                try {
                  await axios.delete(`/chats/rooms/${roomId}`);
                  console.log('대화 내용 폐기 완료');
                  setMessages([]); // 메시지 목록 초기화
                } catch (error) {
                  console.error('대화 내용 폐기 실패:', error);
                  alert('대화 내용 폐기에 실패했습니다.');
                }
              } else {
                console.log('대화 내용 보존');
              }
            }
          } catch (error) {
            console.error('Error processing exit message:', error);
          }
        });
      }
    }
  }, [roomId, isObserverRoom, currentUserType]);

  useEffect(() => {
    if (isConnected && roomId) {
      console.log('Subscribing to messages for room:', roomId);
      
      // Observer 채팅방일 때는 다른 topic으로 구독
      const topic = isObserverRoom ? `/chat/${roomId}/observer` : `/chat/${roomId}`;
      console.log('Subscribing to topic:', topic);
      
      const subscription = subscribe(topic, (message) => {
        console.log('Raw message received:', message);
        try {
          // 메시지가 문자열로 오는 경우를 처리
          const parsedMessage = typeof message === 'string' ? JSON.parse(message) : message;
          console.log('Parsed message:', parsedMessage);
          
          const newMessage: Message = {
            id: parsedMessage.id || String(Date.now()),
            sender: parsedMessage.userName || parsedMessage.sender,
            senderType: parsedMessage.userType || parsedMessage.senderType,
            message: parsedMessage.message,
            createdAt: parsedMessage.createdAt || new Date().toISOString(),
            channelType: parsedMessage.channelType
          };
          
          console.log('Processed new message:', newMessage);
          
          setMessages(prev => {
            const isDuplicate = prev.some(msg => 
              msg.message === newMessage.message && 
              msg.createdAt === newMessage.createdAt
            );
            
            if (isDuplicate) {
              console.log('Duplicate message, skipping');
              return prev;
            }
            
            console.log('Adding new message to state');
            // 새 메시지를 추가하고 시간순으로 정렬
            const updatedMessages = [...prev, newMessage].sort((a, b) => 
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
            return updatedMessages;
          });
        } catch (error) {
          console.error('Error processing message:', error);
        }
      });

      subscriptionRef.current = subscription;

      return () => {
        if (subscriptionRef.current) {
          console.log('Cleaning up subscription');
          subscriptionRef.current.unsubscribe();
        }
      };
    }
  }, [isConnected, roomId, isObserverRoom, subscribe]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    console.log('ChatRoom mounted with:', {
      roomId,
      currentUserType,
      isConnected,
      messages: messages
    });
  }, []);

  useEffect(() => {
    console.log('Messages updated:', messages);
  }, [messages]);

  useEffect(() => {
    switch (currentUserType) {
      case 'AGENT':
        setUserName('상담사');
        break;
      case 'CUSTOMER':
        setUserName('고객');
        break;
      case 'OBSERVER':
        setUserName('Observer');
        break;
    }
  }, [currentUserType]);

  useEffect(() => {
    if (!roomId) {
      console.error('Room ID is missing');
      return;
    }
    console.log('Current Room ID:', roomId);
  }, [roomId]);

  const canSendMessage = () => {
    return currentUserType === 'CUSTOMER' || currentUserType === 'AGENT' || currentUserType === 'OBSERVER';
  };

  const canViewAllMessages = () => {
    return currentUserType === 'OBSERVER';
  };

  const handleSendMessage = () => {
    if (!canSendMessage()) {
      console.log('현재 사용자 타입으로는 메시지를 보낼 수 없습니다.');
      return;
    }

    if (newMessage.trim() && isConnected) {
      const message = {
        roomId: roomId,
        userName: userName,
        userType: currentUserType,
        message: newMessage.trim(),
        createdAt: new Date().toISOString(),
        channelType: isObserverRoom ? 'OBSERVER' : 'CUSTOMER' // 채널 타입 추가
      };

      console.log('Sending message:', message);
      const topic = isObserverRoom ? `/chats/${roomId}/observer/message` : `/chats/${roomId}/message`;
      console.log('Sending to topic:', topic);
      
      sendMessage(topic, message);
      setNewMessage('');
    }
  };

  const getMessageStyle = (sender: string) => {
    switch (sender) {
      case 'customer':
        return {
          backgroundColor: '#f0f0f0',
          marginLeft: 'auto',
          marginRight: '0',
          maxWidth: '70%',
        };
      case 'agent':
        return {
          backgroundColor: '#e3f2fd',
          marginLeft: '0',
          marginRight: 'auto',
          maxWidth: '70%',
        };
      case 'observer':
        return {
          backgroundColor: '#fff3e0',
          marginLeft: '0',
          marginRight: 'auto',
          maxWidth: '70%',
          borderLeft: '4px solid #ff9800',
        };
      default:
        return {};
    }
  };

  const getSenderIcon = (sender: UserType) => {
    switch (sender) {
      case 'CUSTOMER':
        return <PersonIcon />;
      case 'AGENT':
        return <SupportAgentIcon sx={{ color: '#4caf50' }} />;
      case 'OBSERVER':
        return <VisibilityIcon sx={{ color: '#ff9800' }} />;
      default:
        return <PersonIcon />;
    }
  };

  const getSenderName = (sender: UserType) => {
    switch (sender) {
      case 'CUSTOMER':
        return '고객';
      case 'AGENT':
        return '상담사';
      case 'OBSERVER':
        return 'Observer';
      default:
        return '';
    }
  };

  const renderMessage = (message: Message) => {
    // Observer일 때는 모든 메시지를 표시
    if (currentUserType === 'OBSERVER') {
      const messageStyle = {
        display: 'flex',
        flexDirection: 'column',
        mb: 2,
        p: 2,
        borderRadius: 2,
        maxWidth: '70%',
        ...(message.senderType === 'CUSTOMER'
          ? {
              backgroundColor: '#e3f2fd',
              marginLeft: '0',
              marginRight: 'auto',
              border: '1px solid #1976d2',
            }
          : message.senderType === 'AGENT'
          ? {
              backgroundColor: '#e8f5e9',
              marginLeft: 'auto',
              marginRight: '0',
              border: '1px solid #4caf50',
            }
          : message.senderType === 'OBSERVER'
          ? {
              backgroundColor: '#fff3e0',
              marginLeft: '0',
              marginRight: 'auto',
              border: '1px solid #ffb74d',
            }
          : {
              backgroundColor: '#f5f5f5',
              marginLeft: '0',
              marginRight: 'auto',
            }),
      };

      return (
        <Box sx={messageStyle}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            {getSenderIcon(message.senderType)}
            <Typography variant="subtitle2" sx={{ ml: 1 }}>
              {message.sender}
            </Typography>
          </Box>
          <Typography>{message.message}</Typography>
          <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
            {new Date(message.createdAt).toLocaleTimeString()}
          </Typography>
        </Box>
      );
    }

    // 일반 사용자(고객/상담가)일 때는 기존 로직 유지
    const messageStyle = {
      display: 'flex',
      flexDirection: 'column',
      mb: 2,
      p: 2,
      borderRadius: 2,
      maxWidth: '70%',
      ...(message.senderType === 'CUSTOMER'
        ? {
            backgroundColor: '#e3f2fd',
            marginLeft: '0',
            marginRight: 'auto',
            border: '1px solid #1976d2',
          }
        : message.senderType === 'AGENT'
        ? {
            backgroundColor: '#e8f5e9',
            marginLeft: 'auto',
            marginRight: '0',
            border: '1px solid #4caf50',
          }
        : message.senderType === 'OBSERVER'
        ? {
            backgroundColor: '#fff3e0',
            marginLeft: '0',
            marginRight: 'auto',
            border: '1px solid #ffb74d',
          }
        : {
            backgroundColor: '#f5f5f5',
            marginLeft: '0',
            marginRight: 'auto',
          }),
    };

    return (
      <Box sx={messageStyle}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {getSenderIcon(message.senderType)}
          <Typography variant="subtitle2" sx={{ ml: 1 }}>
            {message.sender}
          </Typography>
        </Box>
        <Typography>{message.message}</Typography>
        <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
          {new Date(message.createdAt).toLocaleTimeString()}
        </Typography>
      </Box>
    );
  };

  const setUserType = (type: UserType) => {
    setCurrentUserType(type);
    switch (type) {
      case 'AGENT':
        setUserName('상담사');
        break;
      case 'CUSTOMER':
        setUserName('고객');
        break;
      case 'OBSERVER':
        setUserName('Observer');
        break;
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    if (currentUserType === 'AGENT' || currentUserType === 'OBSERVER') {
      if (newValue === 1) {
        // Observer 상담 탭 클릭 시 Observer 전용 채팅방으로 이동
        const observerRoomId = `${roomId}`;
        navigate(`/chat/${observerRoomId}`, { 
          state: { 
            userType: currentUserType,
            fromAgent: true,
            originalRoomId: roomId,
            isObserverRoom: true
          } 
        });
      } else {
        // 고객 상담 탭 클릭 시 원래 채팅방으로 이동
        const originalRoomId = location.state?.originalRoomId || roomId;
        navigate(`/chat/${originalRoomId}`, { 
          state: { 
            userType: currentUserType,
            fromObserver: true
          } 
        });
      }
    }
  };

  const handleEndConsultation = () => {
    if (!roomId || !isConnected) return;

    const exitMessage = {
      roomId: roomId,
      userName: userName,
      userType: currentUserType,
      message: "상담이 종료되었습니다.",
      createdAt: new Date().toISOString(),
      channelType: 'CUSTOMER'
    };

    console.log('Sending exit message:');
    const topic = `/chats/${roomId}/customer/exit`;
    console.log('Sending to topic:', topic);
    
    sendMessage(topic, exitMessage);
    alert('상담이 종료되었습니다.');
  };

  return (
    <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {(currentUserType === 'AGENT' || currentUserType === 'OBSERVER') && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs 
            value={isObserverRoom ? 1 : 0} 
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                color: 'text.secondary',
                '&.Mui-selected': {
                  color: isObserverRoom ? 'warning.main' : 'primary.main',
                },
              },
            }}
          >
            <Tab label="고객 상담" />
            <Tab label="Observer 상담" />
          </Tabs>
        </Box>
      )}

      <Paper
        elevation={3}
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          mb: 2,
          bgcolor: isObserverRoom ? '#fff3e0' : 'background.paper',
        }}
      >
        {messages.map((message, index) => (
          <div key={index}>{renderMessage(message)}</div>
        ))}
        <div ref={messagesEndRef} />
      </Paper>

      {canSendMessage() && (
        <Box sx={{ 
          p: 2, 
          backgroundColor: 'background.paper',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            alignItems: 'center',
            maxWidth: '1000px',
            width: '100%'
          }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={isObserverRoom ? "Observer에게 메시지를 입력하세요..." : "메시지를 입력하세요..."}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSendMessage} color="primary">
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {currentUserType === 'CUSTOMER' && (
              <Button
                variant="contained"
                color="error"
                size="large"
                onClick={handleEndConsultation}
                sx={{ 
                  height: '56px',
                  minWidth: '120px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold'
                }}
              >
                상담종료
              </Button>
            )}
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default ChatRoom;