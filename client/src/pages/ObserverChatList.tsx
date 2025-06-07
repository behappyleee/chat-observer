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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
        const response = await axios.get('/api/chats/observer');
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
          Observer 채팅방 목록
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <List>
          {chatRooms.map((room) => (
            <React.Fragment key={room.id}>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleChatRoomClick(room.id)}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle1">
                          {room.customerName} - {room.agentName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(room.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    }
                    secondary={room.lastMessage || '새로운 대화가 시작되었습니다.'}
                  />
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