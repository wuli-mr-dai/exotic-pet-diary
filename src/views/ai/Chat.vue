<template>
  <div class="ai-chat-page">
    <van-nav-bar title="AI 养宠顾问" fixed placeholder>
      <template #right>
        <van-icon name="clock-o" size="20" @click="goHistory" />
      </template>
    </van-nav-bar>

    <!-- 对话区域 -->
    <div class="chat-body" ref="chatBodyRef">
      <!-- 欢迎语 -->
      <div class="welcome-area" v-if="messages.length === 0">
        <div class="welcome-icon">🐹</div>
        <p class="welcome-text">你好！我是你的异宠顾问～</p>
        <p class="welcome-sub">可以问我关于仓鼠、兔子、守宫等异宠的任何养护问题</p>
      </div>

      <!-- 消息列表 -->
      <AiChatBubble
        v-for="msg in messages"
        :key="msg.id"
        :role="msg.role"
        :content="msg.content"
        :timestamp="msg.timestamp"
        :is-typing="msg.isTyping"
      />

      <!-- 加载状态 -->
      <div class="typing-indicator" v-if="isAiTyping">
        <van-loading type="spinner" size="16" />
        <span>AI 正在回答...</span>
      </div>
    </div>

    <!-- 快捷提问 -->
    <div class="quick-questions" v-if="messages.length < 3">
      <QuickQuestion
        :questions="quickQuestions"
        @select="askQuickQuestion"
      />
    </div>

    <!-- 次数提示（仅非会员） -->
    <div class="quota-bar" v-if="!memberStore.isMember">
      <span>💡 今日剩余 <strong>{{ memberStore.remainingAiCount }}</strong> / {{ maxFreeCount }} 次免费问答</span>
      <van-button size="small" type="primary" round @click="goMember">开通会员 无限问答 →</van-button>
    </div>

    <!-- 输入框 -->
    <div class="input-bar">
      <van-field
        v-model="inputText"
        placeholder="输入你的问题..."
        :disabled="isAiTyping"
        @keyup.enter="sendMessage"
      />
      <van-button
        type="primary"
        size="small"
        :loading="isAiTyping"
        :disabled="!inputText.trim()"
        @click="sendMessage"
      >
        发送
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showDialog } from 'vant'
import type { ChatMessage } from '@/types'
import { useAuthStore } from '@/stores/useAuthStore'
import { usePetStore } from '@/stores/usePetStore'
import { useMemberStore } from '@/stores/useMemberStore'
import { simulateDelay, mockAiAnswer, getQuickQuestions } from '@/mock'
import AiChatBubble from '@/components/AiChatBubble.vue'
import QuickQuestion from '@/components/QuickQuestion.vue'

const router = useRouter()
const authStore = useAuthStore()
const petStore = usePetStore()
const memberStore = useMemberStore()

const maxFreeCount = 3
const inputText = ref('')
const messages = ref<ChatMessage[]>([])
const isAiTyping = ref(false)
const chatBodyRef = ref<HTMLElement | null>(null)

const quickQuestions = ref<string[]>(getQuickQuestions(petStore.currentPet?.species))

// ---- 滚动到底部 ----
async function scrollToBottom() {
  await nextTick()
  if (chatBodyRef.value) {
    chatBodyRef.value.scrollTop = chatBodyRef.value.scrollHeight
  }
}

// ---- 构建消息对象 ----
function buildMessage(role: 'user' | 'assistant', content: string): ChatMessage {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    role,
    content,
    timestamp: new Date().toISOString()
  }
}

// ---- 发送消息 ----
async function sendMessage() {
  const text = inputText.value.trim()
  if (!text || isAiTyping.value) return

  // 检查登录
  if (!authStore.isLoggedIn) {
    showDialog({
      title: '提示',
      message: '请先登录后再使用 AI 问答功能'
    }).then(() => {
      router.push('/login')
    })
    return
  }

  // 检查次数（非会员）
  if (!memberStore.isMember && memberStore.isLimitReached) {
    showDialog({
      title: '今日免费次数已用完',
      message: '开通会员享无限 AI 问答，仅需 9.9 元/月'
    }).then(() => {
      router.push('/member')
    })
    return
  }

  // 添加用户消息
  messages.value.push(buildMessage('user', text))
  inputText.value = ''
  await scrollToBottom()

  // Mock AI 回答
  isAiTyping.value = true
  await simulateDelay(1500 + Math.random() * 1000)
  isAiTyping.value = false

  const answer = mockAiAnswer(text, petStore.currentPet)
  messages.value.push(buildMessage('assistant', answer))

  // 更新次数
  if (!memberStore.isMember) {
    memberStore.decrementAiCount()
  }

  await scrollToBottom()
}

// ---- 快捷提问 ----
function askQuickQuestion(question: string) {
  inputText.value = question
  sendMessage()
}

// ---- 跳转 ----
function goHistory() {
  router.push('/ai/history')
}

function goMember() {
  router.push('/member')
}

onMounted(async () => {
  await memberStore.fetchMemberStatus()
})
</script>

<style scoped lang="scss">
.ai-chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f7f8fa;
}

.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.welcome-area {
  text-align: center;
  padding: 40px 16px;
}

.welcome-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.welcome-text {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
  margin: 0 0 6px;
}

.welcome-sub {
  font-size: 13px;
  color: #969799;
  margin: 0;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  color: #969799;
  font-size: 12px;
}

.quick-questions {
  padding: 0 16px 8px;
}

.quota-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: #fffbe6;
  border-top: 1px solid #ffe58f;
  font-size: 12px;
  color: #ad6800;
  gap: 8px;

  strong {
    color: #d48806;
  }
}

.input-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #fff;
  border-top: 1px solid #ebedf0;

  :deep(.van-field) {
    flex: 1;
    background: #f7f8fa;
    border-radius: 20px;
    padding: 6px 12px;
  }

  :deep(.van-button) {
    flex-shrink: 0;
  }
}
</style>