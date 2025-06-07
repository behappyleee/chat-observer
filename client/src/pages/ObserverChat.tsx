import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../hooks/useWebSocket';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  IconButton,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface ChatRoom {
  id: string;
  customerName: string;
  lastMessage: string;
  timestamp: string;
  hasObserverMessage: boolean;
  observerMessage?: string;
}

interface Message {
  id: string;
  sender: 'customer' | 'agent' | 'observer';
  content: string;
  timestamp: string;
}

const ObserverChat = () => {
  const navigate = useNavigate();
  const { sendMessage, subscribe, isConnected } = useWebSocket();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [observerName, setObserverName] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (isConnected) {
      // 활성화된 채팅방 목록 구독
      subscribe('/chat/rooms', (response: ChatRoom[]) => {
        console.log('Received chat rooms:', response);
        setChatRooms(response);
      });

      // 선택된 채팅방의 메시지 구독
      if (selectedRoom) {
        subscribe(`/chat/${selectedRoom}/messages`, (response: Message) => {
          console.log('Received message:', response);
          setMessages(prev => [...prev, response]);
        });
      }
    }
  }, [subscribe, isConnected, selectedRoom]);

  const handleStartObserving = () => {
    if (!observerName.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }

    setIsConnecting(true);
    console.log('Starting observation...');
    
    sendMessage('/observer/connect', {
      userType: 'OBSERVER',
      userName: observerName.trim(),
      initialMessage: 'Observer가 연결되었습니다.',
    });
  };

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoom(roomId);
    setMessages([]); // 메시지 목록 초기화
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedRoom) return;

    const message = {
      roomId: selectedRoom,
      content: newMessage.trim(),
      sender: 'observer',
    };

    sendMessage('/observer/message', message);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isConnected) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Observer 상담 시작
          </Typography>
          
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              상담을 모니터링하기 전에 이름을 입력해주세요
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Observer 이름"
                value={observerName}
                onChange={(e) => setObserverName(e.target.value)}
                disabled={isConnecting}
              />
              
              <Button
                variant="contained"
                onClick={handleStartObserving}
                disabled={!observerName.trim() || isConnecting}
                sx={{
                  bgcolor: '#ff9800',
                  '&:hover': {
                    bgcolor: '#f57c00',
                  },
                }}
              >
                {isConnecting ? '연결 중...' : '모니터링 시작하기'}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        {/* 채팅방 목록 */}
        <Paper elevation={3} sx={{ width: 300, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            활성화된 채팅방
          </Typography>
          <List>
            {chatRooms.map((room) => (
              <React.Fragment key={room.id}>
                <ListItem
                  sx={{
                    cursor: 'pointer',
                    backgroundColor: selectedRoom === room.id ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                  onClick={() => handleRoomSelect(room.id)}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={room.customerName}
                    secondary={room.lastMessage}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Paper>

        {/* 채팅 메시지 영역 */}
        <Paper elevation={3} sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
          {selectedRoom ? (
            <>
              <Box sx={{ flex: 1, overflow: 'auto', mb: 2 }}>
                {messages.map((message) => (
                  <Box
                    key={message.id}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      mb: 2,
                      ...(message.sender === 'observer'
                        ? {
                            backgroundColor: '#fff3e0',
                            marginLeft: 'auto',
                            marginRight: '0',
                            maxWidth: '70%',
                          }
                        : message.sender === 'agent'
                        ? {
                            backgroundColor: '#e3f2fd',
                            marginLeft: '0',
                            marginRight: 'auto',
                            maxWidth: '70%',
                          }
                        : {
                            backgroundColor: '#f5f5f5',
                            marginLeft: '0',
                            marginRight: 'auto',
                            maxWidth: '70%',
                          }),
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                        {message.sender === 'observer' ? (
                          <VisibilityIcon />
                        ) : message.sender === 'agent' ? (
                          <SupportAgentIcon />
                        ) : (
                          <PersonIcon />
                        )}
                      </Avatar>
                      <Typography variant="caption" color="text.secondary">
                        {message.sender === 'observer'
                          ? 'Observer'
                          : message.sender === 'agent'
                          ? '상담사'
                          : '고객'}{' '}
                        • {message.timestamp}
                      </Typography>
                    </Box>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: 'inherit',
                      }}
                    >
                      <Typography>{message.content}</Typography>
                    </Paper>
                  </Box>
                ))}
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="상담사에게 조언을 입력하세요..."
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#ff9800',
                      },
                      '&:hover fieldset': {
                        borderColor: '#f57c00',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ff9800',
                      },
                    },
                  }}
                />
                <IconButton
                  onClick={handleSendMessage}
                  sx={{
                    alignSelf: 'flex-end',
                    color: '#ff9800',
                    '&:hover': {
                      color: '#f57c00',
                    },
                  }}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <Typography variant="h6" color="text.secondary">
                모니터링할 채팅방을 선택해주세요
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default ObserverChat; 