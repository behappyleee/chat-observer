package be.com.server.member.controller.request

import be.com.server.member.service.dto.MemberSignupDto

data class MemberSignupRequest(
    val name: String,
    val email: String,
    val password: String
)

fun MemberSignupRequest.toUserSignupDto(): MemberSignupDto =
    MemberSignupDto(
        nickName = this.name,
        email = this.email,
        password = this.password
    )
