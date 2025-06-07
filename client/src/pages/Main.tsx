import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Main = () => {
  const navigate = useNavigate();

  const handleCustomerChat = () => {
    navigate('/customer-chat', { 
      state: { userType: 'CUSTOMER' }
    });
  };

  const handleAgentChat = () => {
    navigate('/chat-list', { 
      state: { userType: 'AGENT' }
    });
  };

  const handleObserverChat = () => {
    navigate('/observer-chat', { 
      state: { userType: 'OBSERVER' }
    });
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4,
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            textAlign: 'center',
            mb: 6,
            color: 'primary.main',
          }}
        >
          채팅 상담 시스템
        </Typography>

        <Grid container spacing={3} sx={{ width: '100%' }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', height: '100%' }}>
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
                  <PersonIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h4" component="h2" gutterBottom>
                    고객 상담
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    로그인 없이 바로 상담을 시작하세요.
                    상담사와 실시간으로 대화하며 도움을 받을 수 있습니다.
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 4 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleCustomerChat}
                    sx={{ px: 4 }}
                  >
                    상담 시작하기
                  </Button>
                </CardActions>
              </Card>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', height: '100%' }}>
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
                  <SupportAgentIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h4" component="h2" gutterBottom>
                    상담사 상담
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    상담사로 로그인하여 고객 상담을 진행하세요.
                    실시간으로 고객의 문의에 답변할 수 있습니다.
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 4 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleAgentChat}
                    sx={{ px: 4 }}
                  >
                    로그인하기
                  </Button>
                </CardActions>
              </Card>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', height: '100%' }}>
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
                  <VisibilityIcon sx={{ fontSize: 60, color: '#ff9800', mb: 2 }} />
                  <Typography variant="h4" component="h2" gutterBottom>
                    Observer 상담
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Observer로 로그인하여 상담을 모니터링하세요.
                    상담사에게 실시간으로 조언을 제공할 수 있습니다.
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 4 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleObserverChat}
                    sx={{ 
                      px: 4,
                      bgcolor: '#ff9800',
                      '&:hover': {
                        bgcolor: '#f57c00',
                      },
                    }}
                  >
                    로그인하기
                  </Button>
                </CardActions>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Main; 