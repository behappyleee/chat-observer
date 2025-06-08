import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Main from './pages/Main';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import ChatList from './pages/ChatList';
import ChatRoom from './pages/ChatRoom';
import CustomerChat from './pages/CustomerChat';
import ObserverChat from './pages/ObserverChat';
import ObserverSignIn from './pages/ObserverSignIn';
import ObserverChatList from './pages/ObserverChatList';
import ChatRooms from './pages/ChatRooms';
import Login from './pages/Login';
import axios from 'axios';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// 인증이 필요한 라우트를 보호하는 컴포넌트
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" />;
  }

  // axios 기본 설정에 토큰 추가
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/chat-list" element={<ChatList />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/chat-rooms"
            element={
              <ProtectedRoute>
                <ChatRooms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:roomId"
            element={
              <ProtectedRoute>
                <ChatRoom />
              </ProtectedRoute>
            }
          />
          <Route path="/chat/:roomId/observer" element={<ChatRoom />} />
          <Route path="/customer-chat" element={<CustomerChat />} />
          <Route path="/observer-chat" element={<ObserverChat />} />
          <Route path="/observer-signin" element={<ObserverSignIn />} />
          <Route path="/observer-chat-list" element={<ObserverChatList />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
