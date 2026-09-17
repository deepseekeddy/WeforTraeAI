import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export const useChatStore = defineStore('chat', () => {
  const sessionId = ref<string>('')
  const messages = ref<ChatMessage[]>([])
  const loading = ref<boolean>(false)

  /**
   * 会话标题（PRD FR-01/FR-02 共用规则）：
   * - 取首条用户文本消息前 20 字，超长截断加省略号
   * - 有消息但无文本消息（如仅上传文件）时显示"文件对话"
   * - 无任何消息时显示"新对话"
   */
  const sessionTitle = computed(() => {
    const firstTextMsg = messages.value.find(
      (m) => m.role === 'user' && m.content && m.content.trim().length > 0
    )
    if (firstTextMsg) {
      const title = firstTextMsg.content.slice(0, 20)
      return firstTextMsg.content.length > 20 ? title + '…' : title
    }
    return messages.value.length > 0 ? '文件对话' : '新对话'
  })

  function setSessionId(id: string) {
    sessionId.value = id
  }

  function setMessages(msgs: ChatMessage[]) {
    messages.value = msgs
  }

  function addMessage(msg: ChatMessage) {
    messages.value.push(msg)
  }

  function clearChat() {
    sessionId.value = ''
    messages.value = []
  }

  return {
    sessionId,
    messages,
    loading,
    sessionTitle,
    setSessionId,
    setMessages,
    addMessage,
    clearChat
  }
})
