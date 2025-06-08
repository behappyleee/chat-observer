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
import axios from 'axios';

interface ChatRoomResponse {
  id: string;
  customerName: string;
  lastMessage: string;
  hasObserverMessage: boolean;
  observerMessage?: string;
  createdAt: string;
}

const CustomerChat = () => {
  const [customerName, setCustomerName] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const navigate = useNavigate();
  const { connect, isConnected, sendMessage, subscribe } = useWebSocket();

  useEffect(() => {
    if (isConnected) {
      console.log('WebSocket is connected, setting up subscription...');
      subscribe('/chat/init', (response: ChatRoomResponse) => {
        console.log('Received chat room response:', response);
        setIsConnecting(false);
        if (response.id) {
          console.log('Navigating to chat room:', response.id);
          navigate(`/chat/${response.id}`, {
            state: {
              userType: 'CUSTOMER',
              userName: customerName
            }
          });
        } else {
          console.error('No id in response');
          alert('채팅방 생성에 실패했습니다. 다시 시도해주세요.');
        }
      });
    }
  }, [subscribe, navigate, isConnected, customerName]);

  const handleStartChat = async () => {
    if (!customerName.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }

    setIsConnecting(true);
    try {
      // 게스트 토큰 발급
      const tokenResponse = await axios.post('http://localhost:8083/api/v1/members/guest', {
        name: customerName
      });

      const { token } = tokenResponse.data;
      
      // 토큰을 localStorage에 저장
      localStorage.setItem('token', token);
      localStorage.setItem('userType', 'CUSTOMER');
      
      // axios 기본 설정에 토큰 추가
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // WebSocket 연결
      await connect();

      // WebSocket을 통해 채팅방 생성 요청
      sendMessage('/chats/create', {
        userType: 'CUSTOMER',
        userName: customerName.trim(),
        initialMessage: '안녕하세요, 상담이 필요합니다.',
      });
    } catch (error) {
      console.error('채팅 시작 실패:', error);
      alert('채팅을 시작하는데 실패했습니다. 다시 시도해주세요.');
      setIsConnecting(false);
    }
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
              label="고객 이름"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              disabled={isConnecting}
            />
            
            <Button
              variant="contained"
              onClick={handleStartChat}
              disabled={!customerName.trim() || isConnecting}
              sx={{
                bgcolor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
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