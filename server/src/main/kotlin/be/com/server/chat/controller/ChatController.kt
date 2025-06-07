package be.com.server.chat.controller

import be.com.server.chat.controller.request.ChatRoomCreateRequest
import be.com.server.chat.controller.request.toChatMessageDto
import be.com.server.chat.controller.response.ChatResponse
import be.com.server.chat.controller.response.ChatRoomResponse
import be.com.server.chat.controller.response.toChatRoomResponse
import be.com.server.chat.event.ChatMessageSaveEvent
import be.com.server.chat.service.ChatService
import be.com.server.chat.service.dto.ChatRoomCreateDto
import org.slf4j.LoggerFactory
import org.springframework.context.ApplicationEventPublisher
import org.springframework.messaging.handler.annotation.DestinationVariable
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.stereotype.Controller

@Controller
class ChatController(
    private val chatService: ChatService,
    private val eventPublisher: ApplicationEventPublisher
) {
    // 메세지 저장이 필요할 듯 ... ?!
    @MessageMapping("/chats/create")
    @SendTo("/topic/chat/init")
    fun createChatRoom(chatRoomCreateRequest: ChatRoomCreateRequest): ChatRoomResponse =
        chatRoomCreateRequest.let {
            chatService.createChatRoom(
                chatRoomCreateDto = it.toChatMessageDto()
            )
        }.run { this.toChatRoomResponse(userType = chatRoomCreateRequest.userType) }

    @MessageMapping("/chats/{roomId}/message")
    @SendTo("/topic/chat/{roomId}")
    fun sendMessage(
        @DestinationVariable("roomId") roomId: String,
        message: ChatRoomCreateDto
    ): ChatResponse {
        eventPublisher.publishEvent(
            ChatMessageSaveEvent(
                chatRoomId = roomId,
                // TODO - SenderID 변경 하기 !!
                senderId = message.userName,
                senderType = message.userType,
                content = message.message
            )
        )

        return ChatResponse(
            id = message.roomId,
            sender = message.userName,
            senderType = message.userType,
            message = message.message
        )
    }

    @MessageMapping("/chats/{roomId}/observer/message")
    @SendTo("/topic/chat/{roomId}/observer")
    fun sendObserverMessage(
        @DestinationVariable("roomId") roomId: String,
        message: ChatRoomCreateDto
    ): ChatResponse {
        return ChatResponse(
            id = message.roomId,
            sender = message.userName,
            senderType = message.userType,
            message = message.message
        )
    }

    companion object {
        private val logger = LoggerFactory.getLogger(ChatController::class.java)
    }
}
