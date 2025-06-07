package be.com.server.chat.service

import be.com.server.chat.domain.ChatMessage
import be.com.server.chat.repository.ChatRepository
import be.com.server.chat.service.dto.ChatMessageDto
import be.com.server.chat.service.dto.ChatRoomCreateDto
import be.com.server.chat.service.dto.ChatRoomDto
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.util.concurrent.ConcurrentHashMap

@Service
class ChatService(
    private val chatRepository: ChatRepository,
) {
    // ChatRoom DB 에 저장 ... ?!
    private val chatRooms: MutableMap<String, ChatRoomDto> = ConcurrentHashMap()

    fun createChatRoom(chatRoomCreateDto: ChatRoomCreateDto): ChatRoomDto {
        return ChatRoomDto(
            sender = chatRoomCreateDto.userName
        ).apply { chatRooms[this.roomId] = this }
    }

    // UserType 에 따라 Chatting Room 반환 하기 !
    fun getAllChatRooms(): List<ChatRoomDto> {
        return chatRooms.values.toList()
    }

    fun findByIdOrThrow(chatRoomId: String): ChatRoomDto {
        return chatRooms[chatRoomId]
            ?: throw IllegalArgumentException("ChatRoom not found: $chatRoomId")
    }

    fun saveChatMessage(chatMessageDto: ChatMessageDto): ChatMessage {
        return chatRepository.save(
            ChatMessage(
                chatRoomId = chatMessageDto.chatRoomId,
                content = chatMessageDto.content,
                senderId = chatMessageDto.senderId,
                senderType = chatMessageDto.senderType,
            )
        )
    }

    companion object {
        private val logger = LoggerFactory.getLogger(ChatService::class.java)
    }
}
