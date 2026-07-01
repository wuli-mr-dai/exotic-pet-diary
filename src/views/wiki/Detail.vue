<template>
  <div class="wiki-detail-page">
    <van-nav-bar title="品种详情" left-arrow fixed placeholder @click-left="goBack" />

    <van-loading v-if="loading" class="loading-center" type="spinner" />

    <template v-else-if="detail">
      <!-- 封面图 -->
      <div class="detail-cover">
        <van-image :src="detail.coverUrl" fit="cover" />
      </div>

      <!-- 内容区 -->
      <div class="detail-body">
        <h1 class="detail-title">{{ detail.title }}</h1>
        <div class="detail-meta">
          <van-tag type="primary">{{ speciesLabel }}</van-tag>
          <van-tag
            v-for="tag in detail.tags"
            :key="tag"
            plain
            type="primary"
            size="medium"
          >
            {{ tag }}
          </van-tag>
          <span class="meta-text">{{ detail.viewCount }} 次浏览</span>
        </div>
        <van-divider />

        <!-- Markdown 内容（模拟渲染） -->
        <div class="detail-content" v-html="renderedContent" />
      </div>
    </template>

    <van-empty v-else description="百科内容未找到" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { SPECIES_LIST } from '@/utils/constants'
import { mockWikiList } from '@/mock'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const detail = ref<any>(null)

const speciesLabel = computed(() => {
  if (!detail.value) return ''
  const sp = SPECIES_LIST.find(s => s.value === detail.value.species)
  return sp ? `${sp.emoji} ${sp.label}` : detail.value.species
})

const renderedContent = computed(() => {
  if (!detail.value) return ''
  // 简单 Markdown 模拟渲染（换行→<br>，##标题→<h2>）
  return detail.value.content
    .replace(/## (.+)/g, '<h3>$1</h3>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>')
})

function goBack() {
  router.back()
}

onMounted(async () => {
  const id = route.params.id as string
  // 模拟加载
  await new Promise(r => setTimeout(r, 300))
  detail.value = mockWikiList.find(w => w.id === id) || null
  loading.value = false
})
</script>

<style scoped lang="scss">
.wiki-detail-page {
  min-height: 100vh;
  background: #fff;
  padding-bottom: 40px;
}

.loading-center {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}

.detail-cover {
  width: 100%;
  height: 200px;
  overflow: hidden;

  :deep(.van-image) {
    width: 100%;
    height: 100%;
  }
}

.detail-body {
  padding: 16px;
}

.detail-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 10px;
  line-height: 1.4;
}

.detail-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.meta-text {
  font-size: 12px;
  color: #969799;
  margin-left: 6px;
}

.detail-content {
  font-size: 15px;
  line-height: 1.8;
  color: #323233;

  h3 {
    font-size: 17px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 20px 0 10px;
  }
}
</style>