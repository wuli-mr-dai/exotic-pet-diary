<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { mockAiChats } from '@/mock'
import type { AiChat } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const historyList = ref<AiChat[]>([])
const activeNames = ref<string[]>([])

function loadHistory() {
  if (!authStore.user) return
  loading.value = true
  setTimeout(() => {
    historyList.value = mockAiChats.filter(c => c.userId === authStore.user!.id)
    loading.value = false
  }, 300)
}

function goBack() {
  router.back()
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  return d.toLocaleDateString('zh-CN')
}

loadHistory()
</script>

<template>
  <div class="ai-history-page">
    <van-nav-bar title="问答历史" left-arrow @click-left="goBack" fixed placeholder />
    <div class="history-content">
      <van-loading v-if="loading" type="spinner" class="loading-center" />
      <van-empty v-else-if="historyList.length === 0" description="暂无问答记录" />
      <van-collapse v-else v-model="activeNames" accordion>
        <van-collapse-item
          v-for="item in historyList"
          :key="item.id"
          :name="item.id"
        >
          <template #title>
            <div class="collapse-title">
              <van-tag type="primary" size="medium">{{ formatDate(item.createdAt) }}</van-tag>
              <span class="title-text">{{ item.question.slice(0, 30) }}{{ item.question.length > 30 ? '...' : '' }}</span>
            </div>
          </template>
          <div class="qa-detail">
            <div class="qa-question">
              <span class="qa-label">问：</span>
              <span>{{ item.question }}</span>
            </div>
            <div class="qa-answer">
              <span class="qa-label">答：</span>
              <span>{{ item.answer }}</span>
            </div>
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
    <div class="safe-bottom" />
  </div>
</template>

<style scoped lang="scss">
.ai-history-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.history-content {
  padding: 12px 16px;

  .loading-center {
    display: flex;
    justify-content: center;
    padding: 60px 0;
  }
}

.collapse-title {
  display: flex;
  align-items: center;
  gap: 8px;

  .title-text {
    font-size: 14px;
    color: #333;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.qa-detail {
  padding: 4px 0;

  .qa-question,
  .qa-answer {
    margin-bottom: 8px;
    font-size: 14px;
    line-height: 1.6;

    .qa-label {
      font-weight: bold;
      color: #4CAF50;
    }
  }

  .qa-question {
    color: #333;
  }

  .qa-answer {
    color: #666;
  }
}

.safe-bottom {
  height: env(safe-area-inset-bottom, 20px);
}
</style>