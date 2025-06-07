package be.com.server.chat.event

object ChatMessageEvent {
    data class ChatMessageSaveEvent(
        val chatRoomId: String,
        val senderId: String,
        val senderType: String,
        val channelType: String,
        val content: String
    )
}
