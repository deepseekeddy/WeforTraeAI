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

  /** 会话标题：取首条用户消息前 20 字，超长截断加省略号；无消息时显示"新对话" */
  const sessionTitle = computed(() => {
    const firstUserMsg = messages.value.find((m) => m.role === 'user')
    if (!firstUserMsg) return '新对话'
    const title = firstUserMsg.content.slice(0, 20)
    return firstUserMsg.content.length > 20 ? title + '…' : title
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
