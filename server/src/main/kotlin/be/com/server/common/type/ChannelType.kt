package be.com.server.common.type

enum class ChannelType(
    private val description: String
) {
    CUSTOMER(
        description = "고객 상담하는 전용 채널"
    ),
    OBSERVER(
        description = "OBSERVER 상담 전용 채널"
    )
}
