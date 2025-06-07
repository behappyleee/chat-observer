// 사용자 타입 정의
export type UserType = 'CUSTOMER' | 'AGENT' | 'OBSERVER';

// 채팅방 생성 요청 인터페이스
export interface ChatRoomCreateRequest {
  userType: UserType;
  userName: string;
  initialMessage: string;
}

// 채팅방 응답 인터페이스
export interface ChatRoomResponse {
  id: string;
  userType: UserType;
  userName: string;
  lastMessage: string;
  hasObserverMessage: boolean;
  observerMessage?: string;
  createdAt: string;
} 