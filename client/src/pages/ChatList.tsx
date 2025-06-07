import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Paper,
  Divider,
  IconButton,
  Badge,
  TextField,
  Button,
  ListItemButton,
  Chip,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';

interface ChatRoom {
  id: string;
  customerName: string;
  agentName: string;
  lastMessage: string;
  lastMessageTime: string;
  status: 'ACTIVE' | 'CLOSED';
}

const ChatList = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const userType = location.state?.userType || 'CUSTOMER';
  const userName = location.state?.userName || '';

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await axios.get('http://localhost:8083/chats', {
          params: {
            userType: userType
          }
        });
        setChatRooms(response.data);
      } catch (error) {
        console.error('채팅방 목록을 불러오는데 실패했습니다:', error);
      }
    };

    fetchChatRooms();
  }, [userType]);

  const handleChatClick = async (chatId: string) => {
    try {
      // 채팅방 정보 가져오기
      await axios.get(`http://localhost:8083/chats/${chatId}`, {
        params: {
          userType: userType,
          userName: userName
        }
      });

      navigate(`/chat/${chatId}`, { 
        state: { 
          userType: userType,
          userName: userName,
          isObserverRoom: userType === 'OBSERVER',
          originalRoomId: chatId
        } 
      });
    } catch (error) {
      console.error('채팅방 입장에 실패했습니다:', error);
      alert('채팅방 입장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        {userType === 'AGENT' ? '상담사' : userType === 'OBSERVER' ? 'Observer' : '고객'} 채팅 목록
      </Typography>
      <Paper elevation={3}>
        <List>
          {chatRooms.map((room, index) => (
            <React.Fragment key={room.id}>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleChatClick(room.id)}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1">
                          {room.customerName} ↔ {room.agentName}
                        </Typography>
                        <Chip
                          label={room.status === 'ACTIVE' ? '상담중' : '종료'}
                          color={room.status === 'ACTIVE' ? 'success' : 'default'}
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {room.lastMessage}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {room.lastMessageTime}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
              {index < chatRooms.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default ChatList; 