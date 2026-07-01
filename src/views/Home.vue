<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import PetCard from '@/components/PetCard.vue'
import CheckinButton from '@/components/CheckinButton.vue'
import PetSelector from '@/components/PetSelector.vue'
import PWAInstallPrompt from '@/components/PWAInstallPrompt.vue'
import { usePetStore } from '@/stores/usePetStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { CHECKIN_TYPES, getSpeciesInfo } from '@/utils/constants'
import { daysSince } from '@/utils/date'
import { getTodayCheckins, getQuickQuestions } from '@/mock'
import type { Checkin } from '@/types'

const router = useRouter()
const petStore = usePetStore()
const authStore = useAuthStore()

const currentPet = computed(() => petStore.currentPet)
const daysCount = computed(() => currentPet.value ? daysSince(currentPet.value.birthday) : 0)

// 今日打卡
const todayCheckins = ref<Checkin[]>(getTodayCheckins(currentPet.value?.id || 'p_001'))
const todayCheckinTypes = computed(() => new Set(todayCheckins.value.map(c => c.type)))

// 快捷提问
const quickQuestions = computed(() => getQuickQuestions(currentPet.value?.species))

function handleCheckin(type: string) {
  if (!authStore.isLoggedIn) {
    router.push('/login')
    return
  }
  router.push({ path: '/checkin', query: { type } })
}

function handleAskAI(q: string) {
  sessionStorage.setItem('ai_quick_question', q)
  router.push('/ai/chat')
}

// 空宠物引导
const needAddPet = computed(() => authStore.isLoggedIn && petStore.pets.length === 0)

// PWA 安装引导
const showPWA = ref(true)
</script>

<template>
  <div class="home-page">
    <!-- 顶部 -->
    <div class="home-header">
      <div class="home-header__title">🐹 异宠日记</div>
      <div class="home-header__actions">
        <PetSelector
          v-if="petStore.pets.length > 0"
          :pets="petStore.pets"
          :active-id="petStore.currentPetId ?? ''"
          @change="petStore.setCurrentPet($event.id)"
          @add-pet="router.push('/pet/create')"
        >
          <span class="pet-switch-btn">
            {{ currentPet ? getSpeciesInfo(currentPet.species).emoji : '🐹' }}
            {{ currentPet?.name }}
            <van-icon name="arrow-down" size="12" />
          </span>
        </PetSelector>
        <span v-else class="add-pet-btn" @click="authStore.isLoggedIn ? router.push('/pet/create') : router.push('/login')">
          <van-icon name="plus" /> 添加宠物
        </span>
      </div>
    </div>

    <!-- 空宠物引导 -->
    <van-notice-bar v-if="needAddPet" mode="link" @click="router.push('/pet/create')">
      你还没有添加宠物，点击去添加你的第一只异宠宝贝吧！
    </van-notice-bar>

    <!-- 当前宠物卡片 -->
    <PetCard
      v-if="currentPet"
      :pet="currentPet"
      @click="router.push(`/pet/${currentPet.id}`)"
      @checkin="router.push('/checkin')"
    />

    <!-- 快捷打卡 -->
    <section class="home-section">
      <div class="section-title">⚡ 快捷打卡</div>
      <div class="quick-checkin-grid">
        <CheckinButton
          v-for="ct in CHECKIN_TYPES"
          :key="ct.value"
          :type="ct.value"
          :icon="ct.emoji"
          :label="ct.label"
          :color="ct.color"
          @click="handleCheckin($event)"
        />
      </div>
    </section>

    <!-- AI 养宠顾问入口 -->
    <section class="home-section">
      <div class="section-title">🤖 AI 养宠顾问</div>
      <div class="ai-entry-card" @click="router.push('/ai/chat')">
        <div class="ai-entry-card__question">
          {{ quickQuestions[0] || '来问问你的异宠问题吧' }}
        </div>
        <div class="ai-entry-card__action">
          询问AI <van-icon name="arrow" />
        </div>
      </div>
      <div class="quick-question-tags">
        <span
          v-for="q in quickQuestions.slice(1, 4)"
          :key="q"
          class="quick-tag"
          @click="handleAskAI(q)"
        >{{ q }}</span>
      </div>
    </section>

    <!-- PWA 安装引导 -->
    <PWAInstallPrompt v-if="showPWA" @close="showPWA = false" />
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  padding-bottom: 70px;
  min-height: 100vh;
  background: var(--van-background);
}

.home-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--van-background);

  &__title {
    font-size: 20px;
    font-weight: 700;
  }

  &__actions {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: var(--van-primary-color);
  }
}

.pet-switch-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  font-size: 14px;
}

.add-pet-btn {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.home-section {
  padding: 16px 16px 0;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 10px;
  color: var(--van-text-color);
}

.quick-checkin-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.ai-entry-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: linear-gradient(135deg, #E8F5E9, #C8E6C9);
  border-radius: 12px;
  cursor: pointer;

  &__question {
    font-size: 14px;
    color: #2E7D32;
  }

  &__action {
    font-size: 13px;
    color: var(--van-primary-color);
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

.quick-question-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;

  .quick-tag {
    padding: 6px 12px;
    border-radius: 16px;
    background: var(--van-background-2);
    font-size: 12px;
    cursor: pointer;

    &:active { opacity: 0.7; }
  }
}
</style>