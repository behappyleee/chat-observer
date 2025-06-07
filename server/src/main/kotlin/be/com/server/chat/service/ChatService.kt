package be.com.server.chat.service

import be.com.server.chat.service.dto.ChatRoomCreateDto
import be.com.server.chat.service.dto.ChatRoomDto
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.util.concurrent.ConcurrentHashMap

@Service
class ChatService {
    private val chatRooms: MutableMap<String, ChatRoomDto> = ConcurrentHashMap()

    fun createChatRoom(chatRoomCreateDto: ChatRoomCreateDto): ChatRoomDto {
        return ChatRoomDto(
            sender = chatRoomCreateDto.userName
        ).apply { chatRooms[this.roomId] = this }
    }

    fun getAllChatRooms(): List<ChatRoomDto> {
        return chatRooms.values.toList()
    }

    fun findByIdOrThrow(chatRoomId: String): ChatRoomDto {
        return chatRooms[chatRoomId]
            ?: throw IllegalArgumentException("ChatRoom not found: $chatRoomId")
    }

    companion object {
        private val logger = LoggerFactory.getLogger(ChatService::class.java)
    }
}
