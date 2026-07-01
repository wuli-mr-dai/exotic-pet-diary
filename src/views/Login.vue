<template>
  <div class="login-page">
    <div class="login-header">
      <div class="login-logo">🐹</div>
      <h1 class="login-title">异宠日记</h1>
      <p class="login-desc">记录每一刻的陪伴</p>
    </div>

    <div class="login-form">
      <van-form @submit="onLogin">
        <!-- 手机号 -->
        <van-field
          v-model="phone"
          type="tel"
          name="phone"
          label="手机号"
          placeholder="请输入手机号"
          maxlength="11"
          :rules="phoneRules"
        >
          <template #left-icon>
            <span class="phone-prefix">+86</span>
          </template>
        </van-field>

        <!-- 验证码 -->
        <van-field
          v-model="code"
          type="digit"
          name="code"
          label="验证码"
          placeholder="请输入验证码"
          maxlength="6"
          :rules="codeRules"
        >
          <template #button>
            <van-button
              size="small"
              type="primary"
              :disabled="countdown > 0"
              @click.prevent="sendCode"
            >
              {{ countdown > 0 ? `${countdown}s后重试` : '获取验证码' }}
            </van-button>
          </template>
        </van-field>

        <!-- 登录按钮 -->
        <div class="login-btn-wrapper">
          <van-button
            type="primary"
            block
            round
            native-type="submit"
            :loading="loading"
            loading-text="登录中..."
          >
            登录 / 注册
          </van-button>
        </div>
      </van-form>
    </div>

    <div class="login-agreement">
      登录即代表同意
      <span class="link" @click="onAgreement('user')">《用户协议》</span>
      和
      <span class="link" @click="onAgreement('privacy')">《隐私政策》</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useAuthStore } from '@/stores/useAuthStore'

const router = useRouter()
const authStore = useAuthStore()

const phone = ref('')
const code = ref('')
const loading = ref(false)
const countdown = ref(0)

const phoneRules = [
  { required: true, message: '请输入手机号' },
  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
]

const codeRules = [
  { required: true, message: '请输入验证码' }
]

let timer: ReturnType<typeof setInterval> | null = null

/** 发送验证码 */
async function sendCode() {
  if (!/^1[3-9]\d{9}$/.test(phone.value)) {
    showToast('请输入正确的手机号')
    return
  }
  // Mock: 模拟发送验证码
  try {
    await authStore.sendOtp(phone.value)
    countdown.value = 60
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0 && timer) {
        clearInterval(timer)
        timer = null
      }
    }, 1000)
  } catch {
    showToast('发送失败，请重试')
  }
}

/** 登录 */
async function onLogin() {
  if (!phone.value || !code.value) return
  loading.value = true
  try {
    const ok = await authStore.verifyOtp(phone.value, code.value)
    if (!ok) {
      showToast('验证码错误')
      loading.value = false
      return
    }
    // 检查是否有宠物，无则引导创建
    router.replace('/home')
  } catch {
    showToast('验证码错误（Mock: 使用 123456）')
  } finally {
    loading.value = false
  }
}

/** 协议查看 */
function onAgreement(_type: string) {
  showToast('协议内容（占位）')
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;

  .login-logo {
    font-size: 72px;
    margin-bottom: 12px;
  }

  .login-title {
    font-size: 28px;
    font-weight: 700;
    color: #2e7d32;
    margin: 0 0 8px;
  }

  .login-desc {
    font-size: 14px;
    color: #666;
    margin: 0;
  }
}

.login-form {
  width: 100%;
  max-width: 360px;

  :deep(.van-cell-group) {
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 20px;
  }

  .phone-prefix {
    color: #999;
    font-size: 14px;
    margin-right: 8px;
  }

  .login-btn-wrapper {
    margin-top: 20px;

    .van-button {
      height: 48px;
      font-size: 16px;
      font-weight: 600;
      background: linear-gradient(135deg, #43a047, #66bb6a);
      border: none;
    }
  }
}

.login-agreement {
  text-align: center;
  font-size: 12px;
  color: #999;
  margin-top: 24px;

  .link {
    color: #1976d2;
    cursor: pointer;
  }
}
</style>