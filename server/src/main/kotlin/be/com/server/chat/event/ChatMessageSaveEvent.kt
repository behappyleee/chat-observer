package be.com.server.chat.event

data class ChatMessageSaveEvent(
    val chatRoomId: String,
    val senderId: String,
    val senderType: String,
    val content: String
)
