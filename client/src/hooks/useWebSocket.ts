import { useEffect, useRef, useCallback, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

interface WebSocketHook {
  sendMessage: (destination: string, body: any) => void;
  subscribe: (destination: string, callback: (message: any) => void) => void;
  disconnect: () => void;
  isConnected: boolean;
}

export const useWebSocket = (): WebSocketHook => {
  const stompClient = useRef<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const subscriptionCallbacks = useRef<Map<string, (message: any) => void>>(new Map());

  useEffect(() => {
    console.log('Initializing WebSocket connection...');
    const socket = new SockJS('http://localhost:8083/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('WebSocket connected successfully');
        setIsConnected(true);
        
        // 연결 성공 시 이전에 등록된 모든 구독을 설정
        subscriptionCallbacks.current.forEach((callback, destination) => {
          console.log('Setting up subscription for:', destination);
          client.subscribe(destination, (message) => {
            console.log('Received message from:', destination, message.body);
            try {
              const parsedMessage = JSON.parse(message.body);
              callback(parsedMessage);
            } catch (error) {
              console.error('Error parsing message:', error);
            }
          });
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
        setIsConnected(false);
      },
      onWebSocketError: (event) => {
        console.error('WebSocket error:', event);
        setIsConnected(false);
      },
      onWebSocketClose: (event) => {
        console.log('WebSocket closed:', event);
        setIsConnected(false);
      }
    });

    client.activate();
    stompClient.current = client;

    return () => {
      if (stompClient.current) {
        console.log('Disconnecting WebSocket...');
        stompClient.current.deactivate();
      }
    };
  }, []);

  const sendMessage = useCallback((destination: string, body: any) => {
    if (stompClient.current?.connected) {
      console.log('Sending message to:', destination, body);
      stompClient.current.publish({
        destination: `/pub${destination}`,
        body: JSON.stringify(body),
        headers: {
          'content-type': 'application/json'
        }
      });
    } else {
      console.error('WebSocket is not connected');
    }
  }, []);

  const subscribe = useCallback((destination: string, callback: (message: any) => void) => {
    console.log('Subscribing to:', destination);
    
    // 콜백을 Map에 저장
    subscriptionCallbacks.current.set(destination, callback);

    // 이미 연결되어 있다면 바로 구독 설정
    if (stompClient.current?.connected) {
      console.log('Setting up subscription for:', destination);
      const subscription = stompClient.current.subscribe(`/topic${destination}`, (message) => {
        console.log('Received message from:', destination, message.body);
        try {
          const parsedMessage = JSON.parse(message.body);
          callback(parsedMessage);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      });
      return subscription; // 구독 객체 반환
    } else {
      console.log('WebSocket not connected yet, subscription will be set up when connected');
    }
  }, []);

  const disconnect = useCallback(() => {
    if (stompClient.current) {
      console.log('Disconnecting WebSocket...');
      stompClient.current.deactivate();
      setIsConnected(false);
    }
  }, []);

  return { sendMessage, subscribe, disconnect, isConnected };
}; 