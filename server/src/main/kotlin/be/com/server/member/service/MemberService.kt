package be.com.server.member.service

import be.com.server.auth.component.JwtTokenProvider
import be.com.server.member.repository.MemberRepository
import be.com.server.member.service.dto.MemberSigninDto
import be.com.server.member.service.dto.MemberSignupDto
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service

@Service
class MemberService(
    private val memberRepository: MemberRepository,
    private val jwtTokenProvider: JwtTokenProvider,
    private val bCryptPasswordEncoder: BCryptPasswordEncoder
) {

    fun signup(memberSignupDto: MemberSignupDto) {}

    fun signin(memberSigninDto: MemberSigninDto): String {
        val member = memberRepository.findByEmail(email = memberSigninDto.email)
            ?: throw IllegalArgumentException("No user found with email: ${memberSigninDto.email}")

        if (!bCryptPasswordEncoder.matches(memberSigninDto.password, member.password)) {
            throw IllegalArgumentException("Passwords do not match")
        }

        val roles = member.authorities.map { it.name }.toList()
        return jwtTokenProvider.createToken(email = member.email, roles = roles)
    }
}
