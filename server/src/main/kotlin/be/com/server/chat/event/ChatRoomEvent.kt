package be.com.server.chat.event

object ChatRoomEvent {
    data class ChatRoomCreateEvent(
        val userType: String,
        val userName: String,
        val message: String
    )
}

// val roomId: String,
// val userType: String,
// val userName: String,
// val message: String,
// val createdAt: LocalDateTime = LocalDateTime.now()
