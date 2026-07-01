<script setup lang="ts">
interface ThemeCardData {
  id: string
  petId: string
  name: string
  icon: string
  preview: string
  locked: boolean
  active: boolean
}

defineProps<{
  theme: ThemeCardData
}>()

const emit = defineEmits<{
  (e: 'action', theme: ThemeCardData): void
}>()
</script>

<template>
  <div
    class="theme-card"
    :class="{ 'theme-card--locked': theme.locked, 'theme-card--active': theme.active }"
    @click="emit('action', theme)"
  >
    <div class="theme-card-preview">
      <img v-if="theme.preview" :src="theme.preview" alt="" class="theme-card-bg" />
      <div v-else class="theme-card-placeholder">{{ theme.icon || '🎨' }}</div>
    </div>
    <div class="theme-card-info">
      <span class="theme-card-name">{{ theme.name }}</span>
      <span v-if="theme.locked" class="theme-card-lock">🔒</span>
      <span v-else-if="theme.active" class="theme-card-check">✅</span>
    </div>
  </div>
</template>

<style scoped>
.theme-card {
  flex-shrink: 0;
  width: 100px;
  background: var(--global-panel-bg, #ffffff);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.theme-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
}

.theme-card--active {
  border: 2px solid #4CAF50;
}

.theme-card--locked {
  opacity: 0.7;
}

.theme-card-preview {
  width: 100%;
  height: 70px;
  overflow: hidden;
  background: #f0f0f0;
}

.theme-card-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.theme-card-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
}

.theme-card-info {
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
}

.theme-card-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}
</style>