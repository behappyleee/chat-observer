package be.com.server.chat.controller

import be.com.server.chat.controller.request.ChatMessageSendRequest
import be.com.server.chat.controller.request.ChatRoomCreateRequest
import be.com.server.chat.controller.response.ChatResponse
import be.com.server.chat.controller.response.ChatRoomResponse
import be.com.server.chat.controller.response.CustomerChatExitResponse
import be.com.server.chat.controller.response.toChatRoomResponse
import be.com.server.chat.event.ChatMessageEvent
import be.com.server.chat.service.ChatService
import be.com.server.chat.service.dto.ChatRoomCreateDto
import org.slf4j.LoggerFactory
import org.springframework.context.ApplicationEventPublisher
import org.springframework.messaging.handler.annotation.DestinationVariable
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.stereotype.Controller

@Controller
class ChatSocketController(
    private val chatService: ChatService,
    private val eventPublisher: ApplicationEventPublisher
) {
    @MessageMapping("/chats/create")
    @SendTo("/topic/chat/init")
    fun createChatRoom(chatRoomCreateRequest: ChatRoomCreateRequest): ChatRoomResponse {
        return chatService.createChatRoom(
            chatRoomCreateDto = ChatRoomCreateDto(
                userName = chatRoomCreateRequest.userName,
                userType = chatRoomCreateRequest.userType,
                message = chatRoomCreateRequest.initialMessage
            )
        ).toChatRoomResponse(userType = chatRoomCreateRequest.userType)
    }

    @MessageMapping("/chats/{roomId}/message")
    @SendTo("/topic/chat/{roomId}")
    fun sendMessage(
        @DestinationVariable("roomId") roomId: String,
        message: ChatMessageSendRequest
    ): ChatResponse {
        eventPublisher.publishEvent(
            ChatMessageEvent.ChatMessageSaveEvent(
                chatRoomId = roomId,
                // TODO - SenderID 변경 하기 !!
                senderId = message.userName,
                senderType = message.userType,
                channelType = message.channelType,
                content = message.message
            )
        )

        return ChatResponse(
            id = roomId,
            sender = message.userName,
            senderType = message.userType,
            message = message.message
        )
    }

    @MessageMapping("/chats/{roomId}/observer/message")
    @SendTo("/topic/chat/{roomId}/observer")
    fun sendObserverMessage(
        @DestinationVariable("roomId") roomId: String,
        message: ChatMessageSendRequest
    ): ChatResponse {
        eventPublisher.publishEvent(
            ChatMessageEvent.ChatMessageSaveEvent(
                chatRoomId = roomId,
                senderId = message.userName,
                senderType = message.userType,
                channelType = message.channelType,
                content = message.message
            )
        )

        return ChatResponse(
            id = roomId,
            sender = message.userName,
            senderType = message.userType,
            message = message.message
        )
    }

    @MessageMapping("/chats/{roomId}/customer/exit")
    @SendTo("/topic/chat/{roomId}/customer/exit")
    fun exitCustomer(
        @DestinationVariable("roomId") roomId: String
    ): CustomerChatExitResponse {
        return CustomerChatExitResponse(roomId = roomId)
    }

    companion object {
        private val logger = LoggerFactory.getLogger(ChatSocketController::class.java)
    }
}
