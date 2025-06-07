package be.com.server.chat.domain

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "chat_room")
class ChatRoom(
    @Id
    val id: String = UUID.randomUUID().toString(),

    @Column(name = "customer_id", nullable = false, columnDefinition = "char(36)")
    val customerId: String,

    @Column(name = "created_at", nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
)
