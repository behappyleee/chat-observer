package be.com.server.auth.service

import be.com.server.auth.component.model.MemberDetails
import be.com.server.member.repository.MemberRepository
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class CustomMemberDetailService(
    private val memberRepository: MemberRepository
) : UserDetailsService {
    override fun loadUserByUsername(email: String): UserDetails {
        val member = memberRepository.findByEmail(email)
            ?: throw UsernameNotFoundException("User not found")

        val authorities = member.authorities.map { it.name } // ex: ROLE_AGENT, ROLE_OBSERVER
        return MemberDetails(member, authorities)
    }
}
