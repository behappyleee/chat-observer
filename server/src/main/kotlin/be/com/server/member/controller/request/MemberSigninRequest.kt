package be.com.server.member.controller.request

data class MemberSigninRequest(
    val email: String,
    val password: String
)
