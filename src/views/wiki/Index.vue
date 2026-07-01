<template>
  <div class="wiki-list-page">
    <van-nav-bar title="品种百科" fixed placeholder />

    <!-- 搜索栏 -->
    <div class="search-bar">
      <van-search
        v-model="searchText"
        placeholder="搜索异宠品种..."
        shape="round"
        @search="onSearch"
      />
    </div>

    <!-- 品种分类 Tabs -->
    <van-tabs v-model="activeSpecies" animated sticky>
      <van-tab v-for="sp in speciesList" :key="sp.value" :title="sp.emoji + ' ' + sp.label">
        <div class="wiki-grid">
          <van-empty v-if="filteredList.length === 0" description="暂无该品种的百科内容" />
          <van-cell
            v-for="item in filteredList"
            :key="item.id"
            class="wiki-card"
            center
            is-link
            @click="goDetail(item.id)"
          >
            <template #icon>
              <van-image
                :src="item.coverUrl"
                width="80"
                height="60"
                fit="cover"
                radius="8"
                class="wiki-cover"
              />
            </template>
            <template #title>
              <span class="wiki-title">{{ item.title }}</span>
            </template>
            <template #label>
              <div class="wiki-tags">
                <van-tag
                  v-for="tag in item.tags"
                  :key="tag"
                  plain
                  type="primary"
                  size="small"
                >
                  {{ tag }}
                </van-tag>
              </div>
              <div class="wiki-meta">
                <span>{{ item.viewCount }} 次浏览</span>
                <span>{{ formatRelativeTime(item.createdAt) }}</span>
              </div>
            </template>
          </van-cell>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { SPECIES_LIST } from '@/utils/constants'
import { mockWikiList } from '@/mock'
import type { Species } from '@/types'

const router = useRouter()
const searchText = ref('')
const activeSpecies = ref(0)

const speciesList = SPECIES_LIST

const filteredList = computed(() => {
  const species = speciesList[activeSpecies.value]
  if (!species) return mockWikiList

  let list = mockWikiList.filter(w => w.species === species.value)
  if (searchText.value.trim()) {
    const kw = searchText.value.trim().toLowerCase()
    list = list.filter(
      w =>
        w.title.toLowerCase().includes(kw) ||
        w.tags.some(t => t.toLowerCase().includes(kw))
    )
  }
  return list
})

function onSearch() {
  // 搜索逻辑已在 computed 中处理
}

function goDetail(id: string) {
  router.push(`/wiki/${id}`)
}

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return '今天'
  if (days < 30) return `${days}天前`
  if (days < 365) return `${Math.floor(days / 30)}个月前`
  return `${Math.floor(days / 365)}年前`
}
</script>

<style scoped lang="scss">
.wiki-list-page {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 50px;
}

.search-bar {
  :deep(.van-search) {
    background: #f7f8fa;
  }
}

.wiki-grid {
  padding: 8px 12px;

  :deep(.van-empty) {
    padding: 40px 0;
  }
}

.wiki-card {
  margin-bottom: 10px;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;

  :deep(.van-cell__value) {
    flex: 1;
  }
}

.wiki-cover {
  flex-shrink: 0;
  margin-right: 12px;
  object-fit: cover;
}

.wiki-title {
  font-size: 15px;
  font-weight: 600;
  color: #323233;
}

.wiki-tags {
  display: flex;
  gap: 4px;
  margin: 4px 0;
}

.wiki-meta {
  display: flex;
  gap: 12px;
  font-size: 11px;
  color: #969799;
  margin-top: 4px;
}
</style>