<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { showDialog } from 'vant'

const visible = ref(false)
const platform = ref<'ios' | 'android' | 'desktop'>('desktop')

onMounted(() => {
  const ua = navigator.userAgent
  const isIOS = /iPhone|iPad|iPod/.test(ua)
  const isAndroid = /Android/.test(ua)

  if (isIOS) {
    platform.value = 'ios'
  } else if (isAndroid) {
    platform.value = 'android'
  }

  // 首次访问显示引导
  const dismissed = localStorage.getItem('pwa-install-dismissed')
  if (!dismissed) {
    setTimeout(() => {
      showInstallGuide()
    }, 1500)
  }
})

function showInstallGuide() {
  visible.value = true
}

function close() {
  visible.value = false
  localStorage.setItem('pwa-install-dismissed', '1')
}
</script>

<template>
  <van-popup
    :show="visible"
    @update:show="visible = $event"
    round
    position="bottom"
    :style="{ padding: '24px' }"
  >
    <div class="pwa-guide">
      <div class="guide-icon">🐹</div>
      <h3 class="guide-title">添加到桌面，使用更方便！</h3>

      <div v-if="platform === 'ios'" class="guide-steps">
        <p>1. 点击底部 <van-icon name="share-o" /> 分享按钮</p>
        <p>2. 滑动找到「添加到主屏幕」</p>
        <p>3. 点击右上角「添加」完成</p>
      </div>

      <div v-else-if="platform === 'android'" class="guide-steps">
        <p>1. 点击浏览器右上角 <strong>⋮</strong> 按钮</p>
        <p>2. 选择「添加到主屏幕」</p>
        <p>3. 点击「添加」完成</p>
      </div>

      <div v-else class="guide-steps">
        <p>将网址添加到书签，方便下次快速访问</p>
      </div>

      <van-button type="primary" block round @click="close" class="guide-btn">
        知道了
      </van-button>
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.pwa-guide {
  text-align: center;
  padding: 10px 0;

  .guide-icon {
    font-size: 48px;
    margin-bottom: 10px;
  }

  .guide-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--van-text-color);
    margin-bottom: 10px;
  }

  .guide-steps {
    text-align: left;
    padding: 0 16px;
    margin: 12px 0;

    p {
      font-size: 14px;
      color: var(--van-gray-6);
      margin: 8px 0;
      line-height: 1.6;
    }
  }

  .guide-btn {
    margin-top: 16px;
  }
}
</style>