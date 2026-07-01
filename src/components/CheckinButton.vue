<script setup lang="ts">
import type { CheckinType } from '@/types'

defineProps<{
  type: CheckinType
  icon: string
  label: string
  color: string
}>()

defineEmits<{
  click: [type: CheckinType]
}>()
</script>

<template>
  <div class="checkin-btn" :style="{ '--btn-color': color }" @click="$emit('click', type)">
    <span class="checkin-btn__icon">{{ icon }}</span>
    <span class="checkin-btn__label">{{ label }}</span>
  </div>
</template>

<style lang="scss" scoped>
.checkin-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  border-radius: 12px;
  background: var(--van-background);
  border: 1px solid var(--van-border-color);
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
  min-width: 60px;

  &:active {
    transform: scale(0.96);
    background: var(--btn-color, var(--van-primary-color));
    border-color: var(--btn-color, var(--van-primary-color));

    .checkin-btn__icon,
    .checkin-btn__label {
      color: #fff;
    }
  }
}

.checkin-btn__icon {
  font-size: 28px;
  margin-bottom: 4px;
}

.checkin-btn__label {
  font-size: 12px;
  color: var(--van-text-color);
}
</style>