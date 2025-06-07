package be.com.server.chat.repository

import be.com.server.chat.domain.ChatMessage
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ChatMessageRepository : JpaRepository<ChatMessage, String> {
    fun findByChatRoomId(chatRoomId: String): List<ChatMessage>

    fun findByChatRoomIdAndSenderTypeInAndChannelType(chatRoomId: String, senderTypes: Set<String>, channelType: String): List<ChatMessage>
}
