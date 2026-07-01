<template>
  <div class="album-page">
    <van-nav-bar title="成长相册" fixed placeholder class="tab-bar" />

    <!-- 宠物选择 -->
    <div class="pet-select-bar">
      <PetSelector
        :pets="petStore.pets"
        :active-id="petStore.currentPetId || ''"
        @change="onPetChange"
      />
    </div>

    <!-- 主题卡片区域 -->
    <div class="theme-cards-section" v-if="themeCards.length > 0">
      <div class="theme-cards-grid">
        <ThemeCard
          v-for="card in themeCards"
          :key="card.id"
          :theme="card"
          @action="onThemeCardAction"
        />
      </div>
    </div>

    <van-empty v-if="petStore.pets.length === 0" description="还未添加宠物，去添加吧" />
    <!-- 时间线 -->
    <div class="timeline" v-else>
      <van-steps direction="vertical" :active="999" class="timeline-steps">
        <van-step v-for="item in timelineItems" :key="item.id" class="timeline-step">
          <!-- 自定义圆点图标 -->
          <template #inactive-icon>
            <div class="timeline-dot" :style="{ background: item.color || '#ccc' }">
              <span class="timeline-dot-emoji">{{ item.emoji || '📝' }}</span>
            </div>
          </template>

          <!-- 主体卡片 -->
          <div class="timeline-card">
            <div class="timeline-header">
              <span class="timeline-date">{{ formatDate(item.date) }}</span>
              <van-tag plain type="primary" size="small">
                {{ item.typeLabel }}
              </van-tag>
            </div>

            <div class="timeline-body">
              <div class="timeline-value" v-if="item.value">{{ item.value }}</div>
              <div class="timeline-note" v-if="item.note">{{ item.note }}</div>
            </div>

            <van-image
              v-if="item.photoUrl"
              :src="item.photoUrl"
              fit="cover"
              radius="8"
              class="timeline-photo"
              lazy-load
              error-icon="photo-o"
            />

            <div v-if="item.stats" class="timeline-stats">
              <div class="stat-item">
                <span class="stat-num">{{ item.stats.totalCheckins }}</span>
                <span class="stat-label">总打卡</span>
              </div>
              <div class="stat-item">
                <span class="stat-num">{{ item.stats.streakDays }}</span>
                <span class="stat-label">连续天数</span>
              </div>
              <div class="stat-item">
                <span class="stat-num">{{ item.stats.daysWithPet }}</span>
                <span class="stat-label">陪伴天数</span>
              </div>
            </div>
          </div>
        </van-step>
      </van-steps>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount } from 'vue'
import { usePetStore } from '@/stores/usePetStore'
import { useCheckinStore } from '@/stores/useCheckinStore'
import { useThemeStore } from '@/stores/useThemeStore'
import { CHECKIN_TYPES } from '@/utils/constants'
import { formatDateDisplay } from '@/utils/date'
import PetSelector from '@/components/PetSelector.vue'
import type { Pet } from '@/types'

const petStore = usePetStore()
const checkinStore = useCheckinStore()
const themeStore = useThemeStore()

// 主题卡片数据
const themeCards = computed(() => {
  const petId = petStore.currentPetId
  if (!petId) return []
  const themes = themeStore.getThemesByPet(petId)
  return themes.map((t) => ({
    id: t.id,
    petId: petId,
    name: t.name,
    icon: t.icon || '',
    preview: t.previewImage || '',
    locked: !themeStore.isThemeUnlocked(petId, t.id),
    active: themeStore.isThemeActive(petId, t.id)
  }))
})

// 处理主题卡片操作
function onThemeCardAction(themeCard: { id: string; petId: string; locked: boolean }) {
  if (themeCard.locked) {
    const success = themeStore.unlockTheme(themeCard.petId, themeCard.id)
    if (!success) {
      alert('条件不满足，无法解锁主题')
    }
  } else {
    themeStore.activateTheme(themeCard.petId, themeCard.id)
  }
}

onBeforeMount(() => {
  themeStore.init()
})

const timelineItems = computed(() => {
  const petId = petStore.currentPetId
  if (!petId) return []
  const checkins = checkinStore.checkins.filter(c => c.petId === petId)
  if (checkins.length === 0) return []

  const items = checkins.map(c => {
    const typeConf = CHECKIN_TYPES.find(t => t.value === c.type)
    return {
      id: c.id,
      date: c.checkinDate,
      emoji: typeConf?.emoji || '📝',
      color: typeConf?.color || '#607D8B',
      typeLabel: typeConf?.label || c.type,
      value: c.value,
      note: c.note,
      photoUrl: c.photoUrl,
      stats: null as any
    }
  })

  // 在最后添加统计卡片
  const avgCheckinsPerDay = checkins.length > 0 ? Math.round(checkins.length / Math.max(1, items.length / 3)) : 0
  items.push({
    id: 'stats',
    date: new Date().toISOString(),
    emoji: '📊',
    color: '#722ED1',
    typeLabel: '数据概览',
    value: '',
    note: '',
    photoUrl: '',
    stats: {
      totalCheckins: checkins.length,
      streakDays: 3,
      daysWithPet: 23
    }
  })

  return items
})

function onPetChange(_pet: Pet) {
  // handled by PetSelector
}

function formatDate(d: string) {
  return formatDateDisplay(new Date(d))
}
</script>

<style scoped lang="scss">
.album-page {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 50px;
}

.tab-bar {
  position: sticky;
  z-index:999;
}

.pet-select-bar {
  padding: 8px 12px;
  background: #fff;
  margin-bottom: 8px;
}

.timeline {
  padding: 0 12px;

  :deep(.van-step) {
    margin-bottom: 0;
  }

  :deep(.van-step__circle) {
    background: transparent;
    overflow: visible;
    width: auto;
    height: auto;
    border-radius: 0;
  }

  :deep(.van-step__title) {
    display: block;
  }

  :deep(.van-step__line) {
    left: -15px;
    border-color: #ebedf0;
  }
}

.timeline-dot {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}

.timeline-dot-emoji {
  font-size: 16px;
  line-height: 1;
  pointer-events: none;
}

.timeline-card {
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.timeline-date {
  font-size: 13px;
  color: #969799;
  font-weight: 500;
}

.timeline-body {
  margin: 8px 0;
}

.timeline-value {
  font-size: 15px;
  font-weight: 600;
  color: #323233;
}

.timeline-note {
  font-size: 13px;
  color: #646566;
  margin-top: 4px;
}

.timeline-photo {
  width: 100%;
  height: 150px;
  object-fit: cover;
  margin-top: 8px;
  border-radius: 8px;
}

.timeline-stats {
  display: flex;
  justify-content: space-around;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #ebedf0;
}

.stat-item {
  text-align: center;
}

.stat-num {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: #722ED1;
}

.stat-label {
  font-size: 11px;
  color: #969799;
  margin-top: 2px;
}
</style>