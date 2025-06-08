import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  Avatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';

const ObserverSignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Attempting observer login with:', { email, password });
      
      const response = await axios.post('http://localhost:8083/api/v1/members/signin', {
        email,
        password
      });

      console.log('Login response:', response.data);
      const { token } = response.data;
      
      // 토큰을 localStorage에 저장
      localStorage.setItem('token', token);
      localStorage.setItem('userType', 'OBSERVER');
      
      // axios 기본 설정에 토큰 추가
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      navigate('/observer-chat-list', { 
        state: { 
          userType: 'OBSERVER',
          userName: email.split('@')[0] // 이메일에서 사용자 이름 추출
        } 
      });
    } catch (error) {
      console.error('Login failed:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error details:', error.response?.data);
        alert(`로그인에 실패했습니다: ${error.response?.data?.message || '알 수 없는 오류가 발생했습니다.'}`);
      } else {
        alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'warning.main' }}>
            <VisibilityIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Observer 로그인
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="이메일 주소"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="비밀번호"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2,
                bgcolor: 'warning.main',
                '&:hover': {
                  bgcolor: 'warning.dark'
                }
              }}
            >
              로그인
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ObserverSignIn; 