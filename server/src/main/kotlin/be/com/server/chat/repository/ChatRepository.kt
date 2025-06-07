package be.com.server.chat.repository

import be.com.server.chat.domain.ChatMessage
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ChatRepository : JpaRepository<ChatMessage, Long>
