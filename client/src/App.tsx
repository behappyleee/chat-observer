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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/chat-list" element={<ChatList />} />
          <Route path="/chat/:roomId" element={<ChatRoom />} />
          <Route path="/customer-chat" element={<CustomerChat />} />
          <Route path="/observer-chat" element={<ObserverChat />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
