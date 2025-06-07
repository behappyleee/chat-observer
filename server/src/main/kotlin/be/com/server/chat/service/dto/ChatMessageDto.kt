package be.com.server.chat.service.dto

data class ChatMessageDto(
    val chatRoomId: String,
    val senderId: String,
    val senderType: String,
    val channelType: String,
    val content: String
)
