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
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useParams, useLocation } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import { UserType } from '../types/chat';
import { useWebSocket } from '../hooks/useWebSocket';

interface Message {
  id: string;
  sender: string;
  senderType: UserType;
  message: string;
  createdAt: string;
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUserType, setCurrentUserType] = useState<UserType>(
    location.state?.userType || 'CUSTOMER'
  );
  const [userName, setUserName] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendMessage, subscribe, isConnected } = useWebSocket();
  const subscriptionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isConnected && roomId) {
      console.log('Subscribing to messages for room:', roomId);
      
      const subscription = subscribe(`/chat/${roomId}`, (message) => {
        console.log('Raw message received:', message);
        const newMessage = message as Message;
        console.log('Parsed message:', newMessage);
        
        setMessages(prev => {
          const isDuplicate = prev.some(msg => 
            msg.message === newMessage.message && 
            msg.createdAt === newMessage.createdAt
          );
          
          if (isDuplicate) {
            console.log('Duplicate message, skipping');
            return prev;
          }
          
          console.log('Adding new message:', newMessage);
          return [...prev, newMessage];
        });
      });

      subscriptionRef.current = subscription;

      return () => {
        if (subscriptionRef.current) {
          console.log('Cleaning up subscription');
          subscriptionRef.current.unsubscribe();
        }
      };
    }
  }, [isConnected, roomId, subscribe]);

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
    return currentUserType === 'CUSTOMER' || currentUserType === 'AGENT';
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
        userType: currentUserType,
        userName: userName,
        message: newMessage.trim(),
        createdAt: new Date().toISOString(),
      };

      sendMessage(`/chats/${roomId}/message`, message);
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
    if (currentUserType === 'OBSERVER') {
      return renderMessageForObserver(message);
    }

    if (currentUserType === 'CUSTOMER' && message.senderType === 'OBSERVER') {
      return null;
    }

    return renderMessageForAgent(message);
  };

  const renderMessageForObserver = (message: Message) => {
    console.log('Rendering message:', message);
    
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
            marginLeft: 'auto',
            marginRight: '0',
          }
        : message.senderType === 'AGENT'
        ? {
            backgroundColor: '#e8f5e9',
            marginLeft: '0',
            marginRight: 'auto',
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

  const renderMessageForAgent = (message: Message) => {
    console.log('Rendering message:', message);
    
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
            marginLeft: 'auto',
            marginRight: '0',
          }
        : message.senderType === 'AGENT'
        ? {
            backgroundColor: '#e8f5e9',
            marginLeft: '0',
            marginRight: 'auto',
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

  return (
    <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Paper
        elevation={3}
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          mb: 2,
        }}
      >
        {messages.map((message, index) => (
          <div key={index}>{renderMessage(message)}</div>
        ))}
        <div ref={messagesEndRef} />
      </Paper>

      {canSendMessage() && (
        <Box sx={{ p: 2, backgroundColor: 'background.paper' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="메시지를 입력하세요..."
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
        </Box>
      )}
    </Container>
  );
};

export default ChatRoom; 