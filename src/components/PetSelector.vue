<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Pet } from '@/types'
import { SPECIES_LIST } from '@/utils/constants'

const props = defineProps<{
  pets: Pet[]
  activeId: string
}>()

const emit = defineEmits<{
  change: [pet: Pet]
  addPet: []
}>()

const show = ref(false)

const actions = computed(() =>
  props.pets.map(p => {
    const info = SPECIES_LIST.find(s => s.value === p.species)
    return {
      name: `${info?.emoji ?? '🐾'} ${p.name} · ${info?.label ?? ''}`,
      value: p.id,
    }
  })
)

function onSelect(item: { value: string }) {
  const pet = props.pets.find(p => p.id === item.value)
  if (pet) emit('change', pet)
}
</script>

<template>
  <div class="pet-selector-trigger" @click="show = true">
    <slot />
  </div>
  <van-action-sheet
    v-model:show="show"
    title="选择宠物"
    :actions="actions"
    cancel-text="取消"
    close-on-click-action
    @select="onSelect"
  >
    <template #extra>
      <div class="ps-extra">
        <van-button size="small" icon="plus" type="primary" round @click="show = false; emit('addPet')">
          添加宠物
        </van-button>
      </div>
    </template>
  </van-action-sheet>
</template>

<style lang="scss" scoped>
.pet-selector-trigger {
  display: inline-flex;
  cursor: pointer;
}
.ps-extra {
  padding: 12px 16px 16px;
  text-align: center;
}
</style>