<template>
  <div class="chat-input">
    <div class="file-list" v-if="files.length > 0">
      <div v-for="file in files" :key="file.id" class="file-card">
        <span>{{ file.name }}</span>
        <button @click="removeFile(file.id)">×</button>
      </div>
    </div>
    <div class="input-area">
      <textarea
        v-model="content"
        placeholder="输入业务消息、回车发送，支持直接上传表格，或者使用 / 调用核心技能。"
        @keydown="handleKeydown"
      />
      <div class="input-actions">
        <button @click="showSkills = true">Skills</button>
        <button @click="optimizePrompt">优化提示词</button>
        <input type="file" @change="handleFileUpload" style="display: none" ref="fileInput" />
        <button @click="$refs.fileInput.click()">上传</button>
        <button @click="sendMessage" :disabled="!canSend">发送</button>
      </div>
    </div>
    <SkillsPanel v-if="showSkills" @select="handleSkillSelect" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useChatStore } from '@/stores/chat'
import SkillsPanel from './SkillsPanel.vue'

const chatStore = useChatStore()
const content = ref('')
const files = ref([])
const showSkills = ref(false)
const fileInput = ref(null)

const canSend = computed(() => {
  return content.value.trim().length > 0 || files.value.length > 0
})

function handleKeydown(e) {
  if (e.key === 'Enter') {
    sendMessage()
  }
}

function handleFileUpload(e) {
  const file = e.target.files[0]
  // TODO: 检查文件大小和类型
  files.value.push({
    id: Date.now(),
    name: file.name,
    size: file.size,
    type: file.type
  })
}

function removeFile(id) {
  files.value = files.value.filter(f => f.id !== id)
}

function handleSkillSelect(skill) {
  content.value += '/' + skill.name
  showSkills.value = false
}

async function optimizePrompt() {
  const res = await fetch('/api/chat/optimize-prompt', {
    method: 'POST',
    body: JSON.stringify({ content: content.value })
  })
  const data = await res.json()
  content.value = data.optimized_content
}

async function sendMessage() {
  if (!canSend.value) return
  
  try {
    await chatStore.sendMessage({
      content: content.value,
      files: files.value
    })
    content.value = ''
    files.value = []
  } catch (e) {
    console.log(e)
  }
}
</script>

<style scoped>
.chat-input {
  padding: 16px;
  border-top: 1px solid #eee;
}
.textarea {
  width: 100%;
  min-height: 80px;
}
</style>
