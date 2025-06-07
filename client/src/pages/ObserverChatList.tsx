import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  Box,
  Avatar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

interface ChatRoom {
  id: string;
  customerName: string;
  agentName: string;
  createdAt: string;
  lastMessage?: string;
}

const ObserverChatList = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 채팅방 목록 가져오기
    const fetchChatRooms = async () => {
      try {
        const response = await axios.get('/chats', {
          params: {
            userType: 'OBSERVER'
          }
        });        
        setChatRooms(response.data);
      } catch (error) {
        console.error('Failed to fetch chat rooms:', error);
      }
    };

    fetchChatRooms();
  }, []);

  const handleChatRoomClick = (roomId: string) => {
    navigate(`/chat/${roomId}`, {
      state: {
        userType: 'OBSERVER',
        isObserverRoom: true
      }
    });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          채팅방 목록
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <List>
          {chatRooms.map((room) => (
            <React.Fragment key={room.id}>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleChatRoomClick(room.id)}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        <PersonIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1">
                          {room.customerName} - {room.agentName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {room.lastMessage || '새로운 대화가 시작되었습니다.'}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(room.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </ListItemButton>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
          {chatRooms.length === 0 && (
            <ListItem>
              <ListItemText
                primary="현재 진행 중인 채팅방이 없습니다."
                sx={{ textAlign: 'center', color: 'text.secondary' }}
              />
            </ListItem>
          )}
        </List>
      </Paper>
    </Container>
  );
};

export default ObserverChatList; 