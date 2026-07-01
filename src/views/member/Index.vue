<template>
  <div class="member-page">
    <van-nav-bar title="会员中心" left-arrow fixed placeholder @click-left="goBack" />

    <!-- 头部身份卡 -->
    <div class="member-header" :class="{ 'is-member': memberStore.isMember }">
      <div class="member-badge">
        <span class="badge-icon">👑</span>
        <span class="badge-text">{{ memberStore.isMember ? '尊享会员' : '免费用户' }}</span>
      </div>
    <div class="member-expire" v-if="memberStore.isMember && memberStore.memberExpireAt">
        有效期至 {{ memberStore.memberExpireAt }}
      </div>
      <div class="member-progress" v-else>
        <p>开通会员，解锁全部功能</p>
      </div>
    </div>

    <!-- 会员权益对比 -->
    <div class="plan-compare">
      <h3>会员权益</h3>
      <div class="plan-table">
        <div class="plan-col">
          <div class="plan-label">免费版</div>
          <div class="plan-item">🐹 1 只宠物档案</div>
          <div class="plan-item">🤖 每日 3 次 AI 问答</div>
          <div class="plan-item">📷 基础打卡功能</div>
          <div class="plan-item">📚 品种百科</div>
          <div class="plan-item">🚫 海报带水印</div>
          <div class="plan-item">🚫 无数据导出</div>
        </div>
        <div class="plan-col pro">
          <div class="plan-label">会员版</div>
          <div class="plan-item">🐹🐹 多只宠物档案</div>
          <div class="plan-item">🤖 无限 AI 问答</div>
          <div class="plan-item">📷 高级打卡统计</div>
          <div class="plan-item">📚 品种百科</div>
          <div class="plan-item">✅ 海报无水印</div>
          <div class="plan-item">✅ PDF 数据导出</div>
        </div>
      </div>
    </div>

    <!-- 套餐选择 -->
    <div class="plans">
      <h3>选择套餐</h3>
      <van-cell
        v-for="plan in plans"
        :key="plan.value"
        :title="plan.label"
        :label="plan.desc"
        :value="'¥' + plan.price + '/' + plan.unit"
        is-link
        @click="selectPlan(plan)"
      />
    </div>

    <!-- 支付区域（手动确认模式） -->
    <div class="pay-section" v-if="selectedPlan">
      <van-divider>支付方式</van-divider>
      <div class="pay-qrcode">
        <van-image
          src="https://picsum.photos/200/200?random=88"
          width="200"
          height="200"
          fit="contain"
        />
        <p>请使用微信/支付宝扫码支付</p>
        <p class="pay-amount">¥{{ selectedPlan.price }}</p>
      </div>
      <van-uploader
        v-model="screenshots"
        :max-count="1"
        accept="image/*"
        :before-read="beforeReadScreenshot"
        upload-text="上传支付截图"
      />
      <van-button
        type="primary"
        block
        round
        :loading="submitting"
        :disabled="screenshots.length === 0"
        @click="submitPayment"
      >
        提交支付凭证
      </van-button>
      <p class="pay-notice">管理员确认后自动开通会员（通常 24 小时内）</p>
    </div>

    <!-- 已是会员 -->
    <div class="already-member" v-if="memberStore.isMember">
      <van-divider />
      <p class="thanks-text">🎉 感谢您的支持！会员专属功能已全部解锁</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showSuccessToast } from 'vant'
import { useMemberStore } from '@/stores/useMemberStore'

const router = useRouter()
const memberStore = useMemberStore()

const plans = [
  { value: 'monthly', label: '月度会员', desc: '适合体验试用', price: 9.9, unit: '月' },
  { value: 'quarterly', label: '季度会员', desc: '适合长期养护', price: 25, unit: '季度' },
  { value: 'yearly', label: '年度会员', desc: '最划算，每天不到 0.25 元', price: 88, unit: '年' }
]

const selectedPlan = ref<typeof plans[0] | null>(null)
const screenshots = ref<any[]>([])
const submitting = ref(false)

function goBack() {
  router.back()
}

function selectPlan(plan: typeof plans[0]) {
  selectedPlan.value = plan
  screenshots.value = []
}

function beforeReadScreenshot(file: File) {
  if (file.size > 5 * 1024 * 1024) {
    showToast('文件大小不能超过 5MB')
    return false
  }
  return true
}

async function submitPayment() {
  submitting.value = true
  // 模拟提交
  await new Promise(r => setTimeout(r, 1500))
  showSuccessToast('支付凭证已提交，等待管理员确认')
  screenshots.value = []
  selectedPlan.value = null
  submitting.value = false
}
</script>

<style scoped lang="scss">
.member-page {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 40px;
}

.member-header {
  background: linear-gradient(135deg, #f5f5f5, #e8e8e8);
  padding: 30px 20px;
  text-align: center;
  transition: 0.3s;

  &.is-member {
    background: linear-gradient(135deg, #ffe066, #ffd43b);
  }
}

.member-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.badge-icon {
  font-size: 36px;
}

.badge-text {
  font-size: 22px;
  font-weight: 700;
  color: #323233;
}

.member-expire {
  margin-top: 8px;
  font-size: 13px;
  color: #666;
}

.member-progress {
  margin-top: 8px;
  font-size: 14px;
  color: #969799;
}

.plan-compare {
  padding: 16px;

  h3 {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 12px;
    color: #323233;
  }
}

.plan-table {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.plan-col {
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  border: 2px solid transparent;

  &.pro {
    border-color: #ffd43b;
    background: #fffdf0;
  }
}

.plan-label {
  font-size: 15px;
  font-weight: 700;
  color: #323233;
  margin-bottom: 8px;
  text-align: center;
}

.plan-item {
  font-size: 12px;
  color: #646566;
  padding: 4px 0;
  border-bottom: 1px dashed #ebedf0;

  &:last-child {
    border-bottom: none;
  }
}

.plans {
  padding: 0 16px;

  h3 {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 8px;
    color: #323233;
  }

  :deep(.van-cell) {
    border-radius: 12px;
    margin-bottom: 8px;
  }
}

.pay-section {
  padding: 0 16px;
}

.pay-qrcode {
  text-align: center;
  margin-bottom: 16px;

  :deep(.van-image) {
    border-radius: 12px;
    border: 1px solid #ebedf0;
  }

  p {
    font-size: 13px;
    color: #646566;
    margin: 6px 0 0;
  }
}

.pay-amount {
  font-size: 24px !important;
  font-weight: 700;
  color: #ee0a24 !important;
}

.pay-notice {
  text-align: center;
  font-size: 11px;
  color: #c8c9cc;
  margin-top: 12px;
}

.already-member {
  padding: 16px;
}

.thanks-text {
  text-align: center;
  font-size: 14px;
  color: #323233;
}
</style>