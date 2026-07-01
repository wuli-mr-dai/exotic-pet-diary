<script setup lang="ts">
import { computed } from 'vue'
import type { Pet } from '@/types'
import { getSpeciesInfo } from '@/utils/constants'

const props = defineProps<{
  pet: Pet
  showCheckin?: boolean
  compact?: boolean
}>()

defineEmits<{
  click: []
  checkin: []
}>()

const speciesLabel = computed(() => getSpeciesInfo(props.pet.species).label)
const speciesEmoji = computed(() => getSpeciesInfo(props.pet.species).emoji)
const todayCheckins = computed(() => 0) // mock

function daysSince(date?: string): number {
  if (!date) return 0
  const diff = Date.now() - new Date(date).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}
</script>

<template>
  <div class="pet-card card" @click="$emit('click')">
    <div class="pet-card__header">
      <div class="pet-avatar">
        <img v-if="pet.avatarUrl" :src="pet.avatarUrl" alt="" />
        <span v-else class="avatar-placeholder">{{ speciesEmoji }}</span>
      </div>
      <div class="pet-info">
        <div class="pet-name">{{ pet.name }}</div>
        <div class="pet-meta">
          <span class="pet-species">{{ speciesLabel }}</span>
          <span class="pet-days">🌟 已陪伴 {{ daysSince(pet.createdAt) }} 天</span>
        </div>
      </div>
    </div>

    <div v-if="showCheckin !== false && !compact" class="pet-card__checkin">
      <div class="checkin-stat">
        <span class="stat-value">{{ todayCheckins }}/3</span>
        <span class="stat-label">今日打卡</span>
      </div>
      <van-button size="small" round type="primary" @click.stop="$emit('checkin')">
        去打卡 →
      </van-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pet-card {
  padding: 16px;
}

.pet-card__header {
  display: flex;
  align-items: center;
  gap: 12px;

  .pet-avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    overflow: hidden;
    background: var(--van-background-2);
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .avatar-placeholder {
      font-size: 32px;
    }
  }

  .pet-info {
    flex: 1;
    min-width: 0;

    .pet-name {
      font-size: 18px;
      font-weight: 600;
      color: var(--van-text-color);
    }

    .pet-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 4px;
      font-size: 12px;
      color: var(--van-text-color-2);

      .pet-species {
        background: #E8F5E9;
        color: var(--van-primary-color);
        padding: 2px 8px;
        border-radius: 10px;
      }
    }
  }
}

.pet-card__checkin {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--van-border-color);

  .checkin-stat {
    display: flex;
    align-items: baseline;
    gap: 4px;

    .stat-value {
      font-size: 20px;
      font-weight: 700;
      color: var(--van-primary-color);
    }

    .stat-label {
      font-size: 12px;
      color: var(--van-text-color-2);
    }
  }
}
</style>