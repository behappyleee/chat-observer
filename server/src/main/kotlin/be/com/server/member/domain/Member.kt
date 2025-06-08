package be.com.server.member.domain

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.JoinTable
import jakarta.persistence.ManyToMany
import jakarta.persistence.PrePersist
import jakarta.persistence.PreUpdate
import jakarta.persistence.Table
import jakarta.persistence.UniqueConstraint
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(
    name = "member",
    uniqueConstraints = [
        UniqueConstraint(name = "email", columnNames = ["email"])
    ]
)
class Member(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: String = UUID.randomUUID().toString(),

    @Column(length = 500, nullable = false)
    val email: String,

    @Column(length = 255, nullable = false)
    val password: String,

    /**
     * 0: 정상, 1: 탈퇴, 9: 정지
     */
    @Column(nullable = false)
    var status: Byte = 1,

    @Column(name = "created_at", nullable = false, columnDefinition = "datetime(6)")
    var createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "updated_at", nullable = false, columnDefinition = "datetime(6)")
    var updatedAt: LocalDateTime = LocalDateTime.now()
) {
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "member_authority",
        joinColumns = [JoinColumn(name = "member_id")],
        inverseJoinColumns = [JoinColumn(name = "authority_id")]
    )
    val authorities: Set<Authority> = mutableSetOf()

    @PrePersist
    fun onCreate() {
        createdAt = LocalDateTime.now()
        updatedAt = createdAt
    }

    @PreUpdate
    fun onUpdate() {
        updatedAt = LocalDateTime.now()
    }
}
