import React from 'react';
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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';

interface ChatRoom {
  id: string;
  customerName: string;
  lastMessage: string;
  timestamp: string;
}

const mockChatRooms: ChatRoom[] = [
  {
    id: '1',
    customerName: '김철수',
    lastMessage: '안녕하세요, 상담이 필요합니다.',
    timestamp: '10:30',
  },
  {
    id: '2',
    customerName: '이영희',
    lastMessage: '제품 사용법에 대해 문의드립니다.',
    timestamp: '09:45',
  },
];

const ChatList = () => {
  const navigate = useNavigate();

  const handleChatClick = (chatId: string) => {
    navigate(`/chat/${chatId}`);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          채팅 목록
        </Typography>
        <Paper elevation={3}>
          <List>
            {mockChatRooms.map((chat, index) => (
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
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={chat.customerName}
                    secondary={chat.lastMessage}
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
                {index < mockChatRooms.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>
    </Container>
  );
};

export default ChatList; 