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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';

interface ChatRoom {
  id: string;
  customerName: string;
  lastMessage: string;
  timestamp: string;
  hasObserverMessage: boolean;
  observerMessage?: string;
  status: 'WAITING' | 'IN_PROGRESS' | 'CLOSED';
}

const ChatList = () => {
  const navigate = useNavigate();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await axios.get('http://localhost:8083/chats');
        setChatRooms(response.data);
      } catch (error) {
        console.error('채팅방 목록을 불러오는데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatRooms();
  }, []);

  const handleChatClick = async (chatId: string) => {
    try {
      await axios.get(`http://localhost:8083/chats/${chatId}`, {
        params: {
          userType: 'AGENT',
          userName: 'TEST_COUNTER', // 실제로는 로그인한 상담사 정보를 사용
        }
      })
      navigate(`/chat/${chatId}`);
    } catch (error) {
      console.error('채팅방 입장에 실패했습니다:', error);
      alert('채팅방 입장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography>로딩 중...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          상담 대기 목록
        </Typography>
        
        <Paper elevation={3}>
          <List>
            {chatRooms.length === 0 ? (
              <ListItem>
                <ListItemText 
                  primary="대기 중인 상담이 없습니다."
                  sx={{ textAlign: 'center' }}
                />
              </ListItem>
            ) : (
              chatRooms.map((chat, index) => (
                <React.Fragment key={chat.id}>
                  <ListItem
                    component="div"
                    onClick={() => handleChatClick(chat.id)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          chat.hasObserverMessage ? (
                            <Avatar
                              sx={{
                                width: 20,
                                height: 20,
                                bgcolor: '#ff9800',
                              }}
                            >
                              <VisibilityIcon sx={{ fontSize: 14 }} />
                            </Avatar>
                          ) : null
                        }
                      >
                        <Avatar>
                          <PersonIcon />
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={chat.customerName}
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {chat.lastMessage}
                          </Typography>
                          {chat.hasObserverMessage && chat.observerMessage && (
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                display: 'block',
                                mt: 0.5,
                                pl: 1,
                                borderLeft: '2px solid #ff9800',
                              }}
                            >
                              Observer: {chat.observerMessage}
                            </Typography>
                          )}
                        </>
                      }
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="caption" sx={{ mr: 1 }}>
                        {chat.timestamp}
                      </Typography>
                      <IconButton size="small">
                        <ChatIcon />
                      </IconButton>
                    </Box>
                  </ListItem>
                  {index < chatRooms.length - 1 && <Divider />}
                </React.Fragment>
              ))
            )}
          </List>
        </Paper>
      </Box>
    </Container>
  );
};

export default ChatList; 