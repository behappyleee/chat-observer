package be.com.server.user.service.dto

data class UserSignupDto(
    val nickName: String,
    val email: String,
    val password: String,
)
