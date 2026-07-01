<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePetStore } from '@/stores/usePetStore'
import { SPECIES_LIST } from '@/utils/constants'
import type { Pet } from '@/types'

const router = useRouter()
const petStore = usePetStore()
const loading = ref(false)

const activePets = computed(() => petStore.pets.filter(p => p.isActive))

function getSpeciesInfo(pet: Pet) {
  return SPECIES_LIST.find(s => s.value === pet.species) ?? SPECIES_LIST[0]
}

function goDetail(petId: string) {
  router.push(`/pet/${petId}`)
}

function goCreate() {
  router.push('/pet/create')
}

onMounted(async () => {
  loading.value = true
  await petStore.fetchPets()
  loading.value = false
})
</script>

<template>
  <div class="pet-list-page">
    <van-nav-bar
      title="我的宠物"
      left-arrow
      @click-left="router.back"
      fixed
      placeholder
    >
      <template #right>
        <van-icon name="plus" size="22" @click="goCreate" />
      </template>
    </van-nav-bar>

    <div class="content-wrapper">
      <van-loading v-if="loading" class="loading-center" size="32" />

      <van-empty
        v-else-if="activePets.length === 0"
        image="search"
        description="还没有宠物档案"
      >
        <van-button type="primary" round size="small" @click="goCreate">
          添加第一只宠物
        </van-button>
      </van-empty>

      <div v-else class="pet-grid">
        <div
          v-for="pet in activePets"
          :key="pet.id"
          class="pet-card-item"
          @click="goDetail(pet.id)"
        >
          <div class="pet-avatar" :style="{ background: getSpeciesInfo(pet).color }">
            <img
              v-if="pet.avatarUrl"
              :src="pet.avatarUrl"
              alt="avatar"
              class="avatar-img"
            />
            <span v-else class="avatar-emoji">{{ getSpeciesInfo(pet).emoji }}</span>
          </div>
          <div class="pet-info">
            <div class="pet-name">{{ pet.name }}</div>
            <div class="pet-species">
              {{ getSpeciesInfo(pet).emoji }} {{ getSpeciesInfo(pet).label }}
              <template v-if="pet.breed"> · {{ pet.breed }}</template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pet-list-page {
  min-height: 100vh;
  background: var(--van-background-2);
}

.content-wrapper {
  padding: 16px;
}

.loading-center {
  display: flex;
  justify-content: center;
  padding-top: 100px;
}

.pet-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.pet-card-item {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: transform 0.15s;

  &:active {
    transform: scale(0.97);
  }
}

.pet-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-emoji {
  font-size: 36px;
}

.pet-info {
  text-align: center;
}

.pet-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--van-text-color);
}

.pet-species {
  font-size: 12px;
  color: var(--van-text-color-2);
  margin-top: 2px;
}
</style>