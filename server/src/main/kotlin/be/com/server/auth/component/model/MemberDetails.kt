package be.com.server.auth.component.model

import be.com.server.member.domain.Member
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

class MemberDetails(
    private val user: Member,
    private val authorities: List<String>
) : UserDetails {

    override fun getAuthorities(): MutableCollection<out GrantedAuthority> =
        authorities.map { SimpleGrantedAuthority(it) }.toMutableList()

    override fun getUsername() = user.email
    override fun getPassword() = user.password
    override fun isAccountNonExpired() = true
    override fun isAccountNonLocked() = true
    override fun isCredentialsNonExpired() = true
    override fun isEnabled() = true
}
