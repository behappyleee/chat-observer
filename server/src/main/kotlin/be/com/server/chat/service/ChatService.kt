package be.com.server.chat.service

import be.com.server.chat.domain.ChatMessage
import be.com.server.chat.domain.ChatRoom
import be.com.server.chat.repository.ChatMessageRepository
import be.com.server.chat.repository.ChatRoomRepository
import be.com.server.chat.service.dto.ChatMessageDto
import be.com.server.chat.service.dto.ChatRoomCreateDto
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class ChatService(
    private val chatMessageRepository: ChatMessageRepository,
    private val chatRoomRepository: ChatRoomRepository
) {
    fun createChatRoom(chatRoomCreateDto: ChatRoomCreateDto): ChatRoom {
        return chatRoomRepository.save(
            ChatRoom(
                customerId = chatRoomCreateDto.userName
            )
        )
    }

    fun getChatRooms(): List<ChatRoom> = chatRoomRepository.findAll()

    fun findChatRoomByIdOrThrow(chatRoomId: String): ChatRoom {
        return chatRoomRepository.findById(chatRoomId).orElseThrow {
            IllegalArgumentException("ChatRoom not found with id: $chatRoomId")
        }
    }

    fun findChatRoomMessagesBy(chatRoomId: String, userTypes: Set<String>, channelType: String): List<ChatMessage> {
        return chatMessageRepository.findByChatRoomIdAndSenderTypeInAndChannelType(
            chatRoomId = chatRoomId,
            senderTypes = userTypes,
            channelType = channelType
        )
    }

    fun saveChatMessage(chatMessageDto: ChatMessageDto): ChatMessage {
        return chatMessageRepository.save(
            ChatMessage(
                chatRoomId = chatMessageDto.chatRoomId,
                content = chatMessageDto.content,
                senderId = chatMessageDto.senderId,
                senderType = chatMessageDto.senderType,
                channelType = chatMessageDto.channelType
            )
        )
    }

    fun findChatRoomMessageByRoomId(roomId: String): List<ChatMessage> {
        return chatMessageRepository.findByChatRoomId(chatRoomId = roomId)
    }

    companion object {
        private val logger = LoggerFactory.getLogger(ChatService::class.java)
    }
}
