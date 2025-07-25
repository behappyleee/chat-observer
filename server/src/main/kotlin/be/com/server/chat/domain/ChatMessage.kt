package be.com.server.chat.domain

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Lob
import jakarta.persistence.Table
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "chat_message")
class ChatMessage(
    @Id
    val id: String = UUID.randomUUID().toString(),

    @Column(name = "chat_room_id", nullable = false)
    val chatRoomId: String,

    @Column(name = "sender_id", nullable = false)
    val senderId: String,

    // TODO - Enum 으로 변경 하기 !
    @Column(name = "sender_type", nullable = false)
    val senderType: String,

    @Column(name = "channel_type", nullable = false)
    val channelType: String,

    @Lob
    @Column(nullable = false)
    val content: String,

    @Column(name = "created_at", nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
)
