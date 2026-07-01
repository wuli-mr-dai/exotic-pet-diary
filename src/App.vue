<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BottomTab from '@/components/BottomTab.vue'
import PWAInstallPrompt from '@/components/PWAInstallPrompt.vue'

const route = useRoute()

const hideTabBarRoutes = [
  'Login', 'PetCreate', 'PetEdit', 'CheckinCalendar',
  'AiHistory', 'WikiDetail', 'Member', 'Poster', 'Settings'
]

const showTabBar = computed(() => {
  return !hideTabBarRoutes.includes(route.name as string)
})
</script>

<template>
  <div class="app-container">
    <router-view v-slot="{ Component }">
      <keep-alive include="Home,AiChat,Album,Mine,Wiki">
        <component :is="Component" />
      </keep-alive>
    </router-view>

    <BottomTab v-if="showTabBar" />
    <PWAInstallPrompt />
  </div>
</template>

<style lang="scss">
.app-container {
  min-height: 100vh;
  background: var(--van-background-2);
  padding-bottom: 50px;
}
</style>