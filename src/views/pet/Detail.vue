<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showDialog, showToast } from 'vant'
import { usePetStore } from '@/stores/usePetStore'
import { useCheckinStore } from '@/stores/useCheckinStore'
import { SPECIES_LIST } from '@/utils/constants'
import { formatDateDisplay } from '@/utils/date'
import type { Species } from '@/types'

const router = useRouter()
const route = useRoute()
const petStore = usePetStore()
const checkinStore = useCheckinStore()

const loading = ref(true)
const petId = route.params.id as string

const pet = computed(() => petStore.pets.find(p => p.id === petId) ?? null)

const speciesLabel = computed(() => {
  if (!pet.value) return ''
  const info = SPECIES_LIST.find(s => s.value === pet.value!.species)
  return info ? info.emoji + ' ' + info.label : pet.value.species
})

const genderDisplay = computed(() => {
  const map: Record<string, string> = { male: '公', female: '母', unknown: '未知' }
  return map[pet.value?.gender ?? 'unknown'] ?? '未知'
})

const daysSinceBirth = computed(() => {
  if (!pet.value?.birthday) return null
  const birth = new Date(pet.value.birthday)
  const diff = Date.now() - birth.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
})

const todayCheckins = computed(() => {
  if (!petId) return []
  return checkinStore.checkins.filter(c =>
    c.petId === petId && c.checkinDate === new Date().toISOString().split('T')[0]
  )
})

onMounted(() => {
  petStore.setCurrentPet(petId)
  loading.value = false
})

function goEdit() {
  router.push(`/pet/${petId}/edit`)
}

function goPoster() {
  router.push(`/poster/${petId}`)
}

async function handleDelete() {
  try {
    await showDialog({
      title: '确认删除',
      message: '删除后宠物档案将无法恢复，确定要删除吗？'
    })
    await petStore.deletePet(petId)
    router.replace('/pet/list')
  } catch {
    // 取消删除
  }
}
</script>

<template>
  <div class="pet-detail-page">
    <van-nav-bar
      title="宠物详情"
      left-arrow
      @click-left="router.back"
      fixed
      placeholder
    >
      <template #right>
        <van-icon name="edit" size="20" @click="goEdit" />
      </template>
    </van-nav-bar>

    <van-loading v-if="loading" class="loading-center" size="32" />

    <template v-else-if="pet">
      <!-- 头像区域 -->
      <div class="hero-section" :style="{ background: SPECIES_LIST.find(s => s.value === pet.species)?.color ?? '#ccc' }">
        <div class="hero-avatar">
          <img v-if="pet.avatarUrl" :src="pet.avatarUrl" alt="avatar" class="hero-img" />
          <span v-else class="hero-emoji">{{ SPECIES_LIST.find(s => s.value === pet.species)?.emoji ?? '🐾' }}</span>
        </div>
        <div class="hero-name">{{ pet.name }}</div>
        <div class="hero-species">{{ speciesLabel }}</div>
        <div v-if="daysSinceBirth !== null" class="hero-days">
          已经陪伴你 <strong>{{ daysSinceBirth }}</strong> 天
        </div>
      </div>

      <!-- 基本信息 -->
      <div class="info-section">
        <van-cell-group inset>
          <van-cell title="品种" :value="speciesLabel" />
          <van-cell v-if="pet.breed" title="细分品种" :value="pet.breed" />
          <van-cell title="性别" :value="genderDisplay" />
          <van-cell v-if="pet.birthday" title="生日" :value="pet.birthday" />
        </van-cell-group>
      </div>

      <!-- 今日打卡 -->
      <div class="section-title">今日打卡 ({{ todayCheckins.length }})</div>
      <div v-if="todayCheckins.length === 0" class="empty-note">今天还没有打卡记录</div>
      <div v-else class="checkin-list">
        <div v-for="c in todayCheckins" :key="c.id" class="checkin-item">
          <span class="checkin-emoji">{{ c.emoji }}</span>
          <span class="checkin-type">{{ c.typeLabel }}</span>
          <span v-if="c.value" class="checkin-value">{{ c.value }}</span>
        </div>
      </div>

      <!-- 操作区 -->
      <div class="action-section">
        <van-button type="primary" block round @click="goEdit">
          编辑档案
        </van-button>
        <van-button type="default" block round @click="goPoster" style="margin-top:10px">
          生成成长海报
        </van-button>
        <van-button type="danger" block round plain @click="handleDelete" style="margin-top:24px">
          删除宠物
        </van-button>
      </div>
    </template>

    <van-empty v-else image="search" description="宠物不存在" />
  </div>
</template>

<style scoped lang="scss">
.pet-detail-page {
  min-height: 100vh;
  background: var(--van-background-2);
  padding-bottom: 40px;
}

.loading-center {
  display: flex;
  justify-content: center;
  padding-top: 100px;
}

.hero-section {
  padding: 32px 16px 24px;
  text-align: center;
  color: #fff;
}

.hero-avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  margin: 0 auto 12px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-emoji {
  font-size: 44px;
}

.hero-name {
  font-size: 22px;
  font-weight: 700;
}

.hero-species {
  font-size: 14px;
  opacity: 0.9;
  margin-top: 4px;
}

.hero-days {
  font-size: 13px;
  opacity: 0.85;
  margin-top: 8px;
}

.info-section {
  margin-top: 16px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--van-text-color);
  padding: 16px 16px 8px;
}

.empty-note {
  font-size: 13px;
  color: var(--van-text-color-2);
  padding: 0 16px;
}

.checkin-list {
  padding: 0 16px;
}

.checkin-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid var(--van-border-color);
}

.checkin-emoji {
  font-size: 20px;
}

.checkin-type {
  font-size: 14px;
  color: var(--van-text-color);
}

.checkin-value {
  font-size: 13px;
  color: var(--van-text-color-2);
  margin-left: auto;
}

.action-section {
  padding: 24px 16px;
}
</style>