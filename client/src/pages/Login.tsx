import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'AGENT' | 'OBSERVER'>('AGENT');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Attempting login with:', { email, password, userType });
      
      const response = await axios.post('http://localhost:8083/api/v1/members/signin', {
        email,
        password
      });

      console.log('Login response:', response.data);
      const { token } = response.data;
      
      // 토큰을 localStorage에 저장
      localStorage.setItem('token', token);
      localStorage.setItem('userType', userType);
      
      // axios 기본 설정에 토큰 추가
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // 로그인 성공 후 채팅방 목록으로 이동
      navigate('/chat-rooms', {
        state: {
          userType,
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            상담사/옵저버 로그인
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="user-type" className="sr-only">사용자 유형</label>
              <select
                id="user-type"
                value={userType}
                onChange={(e) => setUserType(e.target.value as 'AGENT' | 'OBSERVER')}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              >
                <option value="AGENT">상담사</option>
                <option value="OBSERVER">옵저버</option>
              </select>
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">이메일</label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="이메일"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">비밀번호</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="비밀번호"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              로그인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 