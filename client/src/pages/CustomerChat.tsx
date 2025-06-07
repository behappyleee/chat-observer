import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../hooks/useWebSocket';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
} from '@mui/material';

interface ChatRoomResponse {
  id: string;
  customerName: string;
  lastMessage: string;
  hasObserverMessage: boolean;
  observerMessage?: string;
  createdAt: string;
}

const CustomerChat = () => {
  const navigate = useNavigate();
  const { sendMessage, subscribe, isConnected } = useWebSocket();
  const [customerName, setCustomerName] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (isConnected) {
      console.log('WebSocket is connected, setting up subscription...');
      subscribe('/chat/init', (response: ChatRoomResponse) => {
        console.log('Received chat room response:', response);
        setIsConnecting(false);
        if (response.id) {
          console.log('Navigating to chat room:', response.id);
          navigate(`/chat/${response.id}`);
        } else {
          console.error('No id in response');
          alert('채팅방 생성에 실패했습니다. 다시 시도해주세요.');
        }
      });
    }
  }, [subscribe, navigate, isConnected]);

  const handleStartChat = () => {
    if (!customerName.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }

    setIsConnecting(true);
    console.log('Sending chat room creation request...');
    
    sendMessage('/chats/create', {
      userType: 'CUSTOMER',
      userName: customerName.trim(),
      initialMessage: '안녕하세요, 상담이 필요합니다.',
    });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          고객 상담 시작
        </Typography>
        
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            상담을 시작하기 전에 이름을 입력해주세요
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="이름"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              disabled={isConnecting}
            />
            
            <Button
              variant="contained"
              onClick={handleStartChat}
              disabled={!customerName.trim() || isConnecting}
            >
              {isConnecting ? '연결 중...' : '상담 시작하기'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CustomerChat; 