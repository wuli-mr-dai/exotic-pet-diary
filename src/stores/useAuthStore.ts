import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { mockUser } from '@/mock'
import { simulateDelay } from '@/mock'
import { showToast } from 'vant'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoggedIn = computed(() => user.value !== null)
  const isMember = computed(() => user.value?.isMember ?? false)

  // ---- 模拟登录：发送验证码 ----
  async function sendOtp(phone: string): Promise<boolean> {
    await simulateDelay(800)
    console.log(`[Mock] 验证码已发送到 ${phone}`)
    showToast('验证码已发送（Mock: 123456）')
    return true
  }

  // ---- 模拟登录：验证验证码 ----
  async function verifyOtp(phone: string, token: string): Promise<boolean> {
    await simulateDelay(1000)
    // Mock 验证：任意6位数字都通过
    if (token.length < 4) {
      showToast('验证码错误')
      return false
    }
    user.value = {
      ...mockUser,
      phone
    }
    showToast('登录成功')
    return true
  }

  // ---- 登出 ----
  async function logout(): Promise<void> {
    await simulateDelay(200)
    user.value = null
    showToast('已退出登录')
  }

  // ---- 手动设置用户（开发调试用） ----
  function setMockLoggedIn() {
    user.value = { ...mockUser }
  }

  return {
    user,
    isLoggedIn,
    isMember,
    sendOtp,
    verifyOtp,
    logout,
    setMockLoggedIn
  }
})