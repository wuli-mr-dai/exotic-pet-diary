import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { simulateDelay } from '@/mock'
import { useAuthStore } from './useAuthStore'
import { showToast } from 'vant'

export const useMemberStore = defineStore('member', () => {
  const dailyAiCount = ref(1) // 今日已用次数
  const loading = ref(false)

  const maxFreeCount = 3
  const remainingAiCount = computed(() => Math.max(0, maxFreeCount - dailyAiCount.value))
  const isLimitReached = computed(() => remainingAiCount.value <= 0)

  // 从 AuthStore 派生会员状态
  const isMember = computed(() => {
    const auth = useAuthStore()
    return auth.user?.isMember ?? false
  })

  const memberExpireAt = computed(() => {
    const auth = useAuthStore()
    return auth.user?.memberExpireAt ?? null
  })

  async function fetchMemberStatus(): Promise<void> {
    await simulateDelay(200)
    const auth = useAuthStore()
    if (auth.user) {
      dailyAiCount.value = auth.user.dailyAiCount
    }
  }

  function decrementAiCount(): void {
    if (dailyAiCount.value < maxFreeCount) {
      dailyAiCount.value++
    }
    const auth = useAuthStore()
    if (auth.user) {
      auth.user.dailyAiCount = dailyAiCount.value
    }
  }

  async function submitPayment(_plan: string): Promise<boolean> {
    await simulateDelay(1500)
    showToast('付款凭证已提交，请等待管理员确认')
    return true
  }

  return {
    dailyAiCount,
    loading,
    remainingAiCount,
    isLimitReached,
    isMember,
    memberExpireAt,
    fetchMemberStatus,
    decrementAiCount,
    submitPayment
  }
})
