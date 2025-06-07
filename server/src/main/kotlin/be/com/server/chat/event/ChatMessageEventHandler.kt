package be.com.server.chat.event

import be.com.server.chat.service.ChatService
import be.com.server.chat.service.dto.ChatMessageDto
import org.springframework.context.event.EventListener
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Component

@Component
class ChatMessageEventHandler(
    private val chatService: ChatService
) {
    @Async
    @EventListener
    fun handleChatMessageHandler(chatMessageSaveEvent: ChatMessageSaveEvent) {
        chatService.saveChatMessage(
            chatMessageDto = ChatMessageDto(
                chatRoomId = chatMessageSaveEvent.chatRoomId,
                senderId = chatMessageSaveEvent.senderId,
                senderType = chatMessageSaveEvent.senderType,
                content = chatMessageSaveEvent.content
            )
        )
    }
}
