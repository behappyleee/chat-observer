package be.com.server.user.controller.request

import be.com.server.user.service.dto.UserSignupDto

data class UserSignupRequest(
    val name: String,
    val email: String,
    val password: String
)

fun UserSignupRequest.toUserSignupDto(): UserSignupDto =
    UserSignupDto(
        nickName = this.name,
        email = this.email,
        password = this.password
    )
