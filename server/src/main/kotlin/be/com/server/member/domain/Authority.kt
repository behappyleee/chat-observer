package be.com.server.member.domain

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "authority")
class Authority(
    @Id
    @Column(name = "id", columnDefinition = "char(36)")
    val id: String = UUID.randomUUID().toString(),

    @Column(name = "name", nullable = false, unique = true, length = 50)
    val name: String,

    @Column(name = "description", nullable = false, length = 255)
    val description: String,

    @Column(name = "created_at", nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "updated_at", nullable = false)
    val updatedAt: LocalDateTime = LocalDateTime.now()
)
