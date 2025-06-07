package be.com.server.common.type

enum class Authority(
    val typeCode: String,
    private val description: String
) {
    ROLE_CUSTOMER(
        typeCode = "CUSTOMER",
        description = "Customers"
    ),
    ROLE_AGENT(
        typeCode = "AGENT",
        description = "고객 상담가 권한"
    ),
    ROLE_OBSERVER(
        typeCode = "OBSERVER",
        description = "상담가 옵저버 권한"
    )

    ;
    companion object {
        fun checkTypeCodeOrThrow(typeCode: String): Authority =
            entries.find { it.typeCode == typeCode } ?: throw IllegalArgumentException("unknown type code: $typeCode")
    }
}
