<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const tabs = [
  { to: '/home', icon: 'home-o', label: '首页' },
  { to: '/ai/chat', icon: 'chat-o', label: 'AI问答' },
  { to: '/album', icon: 'photo-o', label: '相册' },
  { to: '/mine', icon: 'user-o', label: '我的' }
]

const active = computed(() => {
  if (route.path.startsWith('/ai')) return '/ai/chat'
  return tabs.find(t => route.path === t.to)?.to ?? '/home'
})

function onChange(tab: (typeof tabs)[0]) {
  console.log(tab,'----')
  router.push(tab)
}
</script>

<template>
  <van-tabbar :model-value="active" @change="onChange" :safe-area-inset-bottom="true">
    <van-tabbar-item
      v-for="tab in tabs"
      :key="tab.to"
      :name="tab.to"
      :icon="tab.icon"
    >
      {{ tab.label }}
    </van-tabbar-item>
  </van-tabbar>
</template>