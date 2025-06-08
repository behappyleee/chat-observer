package be.com.server.member.controller

import be.com.server.common.ApiEndpointVersion
import be.com.server.member.controller.request.GuestTokenRequest
import be.com.server.member.controller.request.MemberSigninRequest
import be.com.server.member.controller.response.MemberInfoResponse
import be.com.server.member.controller.response.TokenResponse
import be.com.server.member.service.MemberService
import be.com.server.member.service.dto.MemberSigninDto
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("${ApiEndpointVersion.V1_API_PREFIX}/members")
class MemberController(
    private val memberService: MemberService
) {
    @PostMapping("/signin")
    fun signin(
        @RequestBody memberSigninRequest: MemberSigninRequest
    ): TokenResponse {
        return memberService.signin(
            memberSigninDto = MemberSigninDto(
                email = memberSigninRequest.email,
                password = memberSigninRequest.password
            )
        ).let { TokenResponse(token = it) }
    }

    @PostMapping("/guest")
    fun issueGuestToken(
        @RequestBody guestTokenRequest: GuestTokenRequest
    ): TokenResponse {
        val token = memberService.createGuestToken(
            guestName = guestTokenRequest.name
        )
        return TokenResponse(token = token)
    }

    // 현재 세션 정보 조회 !
    @GetMapping("/me")
    fun getUser(): MemberInfoResponse {
        // TODO - User 세션 정보 넘겨주기 !
        return MemberInfoResponse(
            email = "TEST-EMAIL"
        )
    }

    companion object {
        private val logger = LoggerFactory.getLogger(MemberController::class.java)
    }
}
