import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Pet } from '@/types'
import { mockPets } from '@/mock'
import { simulateDelay } from '@/mock'
import { generateId } from '@/utils/date'
import { showToast } from 'vant'

export const usePetStore = defineStore('pet', () => {
  const pets = ref<Pet[]>([...mockPets])
  const currentPetId = ref<string | null>(mockPets[0]?.id ?? null)

  const currentPet = computed(() => pets.value.find(p => p.id === currentPetId.value) ?? null)

  async function fetchPets(): Promise<void> {
    await simulateDelay(200)
    // mock 数据已在初始化时加载
  }

  function setCurrentPet(petId: string) {
    currentPetId.value = petId
  }

  async function createPet(data: Partial<Pet>): Promise<Pet> {
    await simulateDelay(500)
    const newPet: Pet = {
      id: generateId(),
      userId: 'u_001',
      name: data.name ?? '',
      species: data.species ?? 'hamster',
      breed: data.breed ?? '',
      birthday: data.birthday ?? '',
      gender: data.gender ?? 'unknown',
      avatarUrl: data.avatarUrl ?? '',
      photos: data.photos ?? [],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    pets.value.unshift(newPet)
    currentPetId.value = newPet.id
    showToast('宠物档案创建成功')
    return newPet
  }

  async function updatePet(petId: string, data: Partial<Pet>): Promise<void> {
    await simulateDelay(300)
    const idx = pets.value.findIndex(p => p.id === petId)
    if (idx !== -1) {
      pets.value[idx] = { ...pets.value[idx], ...data, updatedAt: new Date().toISOString() }
    }
    showToast('保存成功')
  }

  async function deletePet(petId: string): Promise<void> {
    await simulateDelay(300)
    const idx = pets.value.findIndex(p => p.id === petId)
    if (idx !== -1) {
      pets.value[idx] = { ...pets.value[idx], isActive: false }
    }
    if (currentPetId.value === petId) {
      const active = pets.value.find(p => p.isActive)
      currentPetId.value = active?.id ?? null
    }
    showToast('宠物已删除')
  }

  return {
    pets,
    currentPetId,
    currentPet,
    fetchPets,
    setCurrentPet,
    createPet,
    updatePet,
    deletePet
  }
})