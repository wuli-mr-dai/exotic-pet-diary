<template>
  <div class="poster-page">
    <van-nav-bar title="成长海报" left-arrow fixed placeholder @click-left="goBack" class="tab-bar" />
    <van-empty v-if="!pet" description="宠物不存在" />

    <template v-else>
      <!-- 海报预览区 -->
      <div class="poster-preview" ref="posterRef">
        <div class="poster-bg" :style="{ background: bgGradient }">
          <!-- 水印 -->
          <div class="poster-watermark" v-if="!memberStore.isMember">
            <span>异宠日记</span>
          </div>

          <!-- 宠物照片 -->
          <div class="poster-photo-wrap">
            <van-image
              :src="pet.avatarUrl || defaultAvatar"
              round
              width="120"
              height="120"
              fit="cover"
              class="poster-avatar"
            />
          </div>

          <!-- 宠物信息 -->
          <div class="poster-info">
            <h2 class="poster-name">{{ pet.name }}</h2>
            <p class="poster-species">{{ speciesLabel }}</p>
            <p class="poster-days">已经陪伴我 {{ daysWithPet }} 天</p>
          </div>

          <!-- 打卡统计 -->
          <div class="poster-stats">
            <div class="poster-stat-item">
              <span class="poster-stat-num">{{ checkinStore.checkins.length }}</span>
              <span class="poster-stat-label">总打卡</span>
            </div>
            <div class="poster-stat-item">
              <span class="poster-stat-num">5</span>
              <span class="poster-stat-label">连续打卡</span>
            </div>
          </div>

          <!-- 迷你热力图 -->
          <div class="poster-mini-calendar">
            <div
              v-for="day in 30"
              :key="day"
              class="mini-day-cell"
              :class="getMiniDayClass(day)"
            />
          </div>

          <!-- 底部 -->
          <div class="poster-footer">
            <span class="poster-logo">🐹 异宠日记</span>
            <span class="poster-url">exoticpet.cn</span>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="poster-actions">
        <van-button type="primary" block round icon="down" @click="savePoster">
          保存到相册
        </van-button>
        <van-button plain block round icon="share-o" @click="sharePoster" style="margin-top:10px">
          分享给朋友
        </van-button>
        <van-button
          v-if="!memberStore.isMember"
          plain
          hairline
          block
          round
          size="small"
          style="margin-top:8px;color:#c8c9cc"
        >
          💡 会员可去水印
        </van-button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast, showSuccessToast, showFailToast } from 'vant'
import { usePetStore } from '@/stores/usePetStore'
import { useCheckinStore } from '@/stores/useCheckinStore'
import { useMemberStore } from '@/stores/useMemberStore'
import { SPECIES_LIST } from '@/utils/constants'
import { daysSince } from '@/utils/date'
import html2canvas from 'html2canvas'

const router = useRouter()
const route = useRoute()
const petStore = usePetStore()
const checkinStore = useCheckinStore()
const memberStore = useMemberStore()

const posterRef = ref<HTMLElement | null>(null)

const pet = computed(() => {
  const pid = route.params.petId as string
  return petStore.pets.find(p => p.id === pid) || (petStore.pets.length > 0 ? petStore.pets[0] : null)
})

const speciesLabel = computed(() => {
  const sp = SPECIES_LIST.find(s => s.value === pet.value?.species)
  return sp ? `${sp.emoji} ${sp.label}` : pet.value?.species || ''
})

const bgGradient = computed(() => {
  const sp = SPECIES_LIST.find(s => s.value === pet.value?.species)
  const color = sp?.color || '#4CAF50'
  return `linear-gradient(135deg, ${color}44, ${color}22)`
})

const daysWithPet = computed(() => {
  if (!pet.value?.birthday) return 0
  return daysSince(pet.value.birthday)
})

const defaultAvatar = 'https://picsum.photos/200/200?random=5'

function getMiniDayClass(_day: number) {
  const r = Math.random()
  if (r > 0.6) return 'filled'
  if (r > 0.3) return 'half'
  return 'empty'
}

function goBack() {
  router.back()
}

async function savePoster() {
  showToast('正在生成海报...')
  await new Promise(r => setTimeout(r, 500))
  if (!posterRef.value) {
    showFailToast('生成失败，请重试')
    return
  }
  try {
    const canvas = await html2canvas(posterRef.value, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    })
    const blob = await new Promise<Blob | null>(r => canvas.toBlob(r, 'image/png'))
    if (!blob) {
      showFailToast('生成失败')
      return
    }
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `宠物海报_${pet.value?.name || 'unknown'}.png`
    a.click()
    URL.revokeObjectURL(url)
    showSuccessToast('保存成功')
  } catch {
    showFailToast('保存失败，请重试')
  }
}

async function sharePoster() {
  if (navigator.share) {
    try {
      await navigator.share({
        title: `我家${pet.value?.name || '宠物'}的成长日记`,
        text: `已经陪伴我 ${daysWithPet.value} 天啦！`,
        url: window.location.href
      })
    } catch {
      // cancelled
    }
  } else {
    await navigator.clipboard.writeText(window.location.href).then(() => {
      showSuccessToast('链接已复制，去分享吧')
    })
  }
}

onMounted(() => {
  petStore.fetchPets()
})
</script>

<style scoped lang="scss">
.poster-page {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 40px;
}

.poster-preview {
  padding: 16px;
  max-width: 375px;
  margin: 0 auto;
}

.poster-bg {
  border-radius: 16px;
  padding: 30px 20px;
  position: relative;
  overflow: hidden;
  min-height: 460px;
}

.poster-watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-20deg);
  font-size: 40px;
  color: rgba(255, 255, 255, 0.2);
  font-weight: 900;
  white-space: nowrap;
  pointer-events: none;
  z-index: 0;
}

.poster-photo-wrap {
  text-align: center;
  position: relative;
  z-index: 1;
}

.poster-avatar {
  border: 4px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.poster-info {
  text-align: center;
  margin: 16px 0;
  position: relative;
  z-index: 1;
}

.poster-name {
  font-size: 24px;
  font-weight: 700;
  color: #323233;
  margin: 0;
}

.poster-species {
  font-size: 14px;
  color: #646566;
  margin: 6px 0 0;
}

.poster-days {
  font-size: 18px;
  font-weight: 600;
  color: #ee0a24;
  margin: 12px 0 0;
}

.poster-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin: 20px 0;
  position: relative;
  z-index: 1;
}

.poster-stat-item {
  text-align: center;
}

.poster-stat-num {
  display: block;
  font-size: 28px;
  font-weight: 800;
  color: #323233;
}

.poster-stat-label {
  font-size: 12px;
  color: #969799;
}

.poster-mini-calendar {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 4px;
  padding: 0 20px;
  position: relative;
  z-index: 1;
}

.mini-day-cell {
  aspect-ratio: 1;
  border-radius: 3px;
  background: #e8e8e8;

  &.empty {
    background: #f0f0f0;
  }

  &.half {
    background: #b7eb8f;
  }

  &.filled {
    background: #52c41a;
  }
}

.poster-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 1;
}

.poster-logo {
  font-size: 13px;
  font-weight: 600;
  color: #646566;
}

.poster-url {
  font-size: 12px;
  color: #c8c9cc;
}

.poster-actions {
  padding: 0 16px;
  max-width: 375px;
  margin: 24px auto 0;
}
</style>