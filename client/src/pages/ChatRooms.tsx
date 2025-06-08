import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface ChatRoom {
  id: string;
  name: string;
  status: string;
  createdAt: string;
}

const ChatRooms = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const navigate = useNavigate();
  const userType = localStorage.getItem('userType');

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await axios.get('/chats/rooms');
        setChatRooms(response.data);
      } catch (error) {
        console.error('Failed to fetch chat rooms:', error);
      }
    };

    fetchChatRooms();
  }, []);

  const handleRoomClick = (roomId: string) => {
    navigate(`/chat/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-2xl font-bold mb-4">
                  {userType === 'AGENT' ? '상담사' : '옵저버'} 채팅방 목록
                </h2>
                <div className="space-y-4">
                  {chatRooms.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => handleRoomClick(room.id)}
                      className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <div className="font-semibold">{room.name}</div>
                      <div className="text-sm text-gray-500">
                        상태: {room.status}
                      </div>
                      <div className="text-sm text-gray-500">
                        생성일: {new Date(room.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRooms; 