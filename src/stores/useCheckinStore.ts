import { defineStore } from 'pinia'
import { ref } from 'vue'
import { mockCheckins } from '@/mock'
import type { Checkin, CheckinType } from '@/types'
import { CHECKIN_TYPES } from '@/utils/constants'

export interface CheckinCreateInput {
  petId: string
  type: CheckinType
  value?: string
  note?: string
  photoUrl?: string
  checkinDate: string
  checkinTime: string
}

export const useCheckinStore = defineStore('checkin', () => {
  const checkins = ref<Checkin[]>(mockCheckins)
  const loading = ref(false)

  async function fetchCheckins() {
    loading.value = true
    // Mock: data already loaded, simulate delay
    await new Promise(r => setTimeout(r, 200))
    loading.value = false
    return checkins.value
  }

  async function fetchCheckinsByPet(petId: string) {
    loading.value = true
    await new Promise(r => setTimeout(r, 150))
    loading.value = false
    return checkins.value.filter(c => c.petId === petId)
  }

  async function fetchCheckinsByDate(petId: string, date: string) {
    return checkins.value.filter(c => c.petId === petId && c.checkinDate === date)
  }

  async function createCheckin(input: CheckinCreateInput) {
    loading.value = true
    await new Promise(r => setTimeout(r, 300))

    const typeInfo = CHECKIN_TYPES.find(t => t.value === input.type)
    const newCheckin: Checkin = {
      id: `checkin_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      userId: 'mock_user_001',
      petId: input.petId,
      type: input.type,
      typeLabel: typeInfo?.label ?? input.type,
      emoji: typeInfo?.emoji ?? '📝',
      value: input.value ?? '',
      note: input.note ?? '',
      photoUrl: input.photoUrl ?? '',
      checkinDate: input.checkinDate,
      checkinTime: input.checkinTime,
      createdAt: new Date().toISOString()
    }
    checkins.value.unshift(newCheckin)
    loading.value = false
    return newCheckin
  }

  async function deleteCheckin(id: string) {
    const idx = checkins.value.findIndex(c => c.id === id)
    if (idx !== -1) {
      checkins.value.splice(idx, 1)
    }
  }

  function getTodayCheckins(petId: string) {
    const today = new Date().toISOString().split('T')[0]
    return checkins.value.filter(c => c.petId === petId && c.checkinDate === today)
  }

  function getCalendarData(petId: string, year: number, month: number) {
    const prefix = `${year}-${String(month).padStart(2, '0')}`
    const monthCheckins = checkins.value.filter(
      c => c.petId === petId && c.checkinDate.startsWith(prefix)
    )
    const dateCountMap: Record<string, number> = {}
    monthCheckins.forEach(c => {
      dateCountMap[c.checkinDate] = (dateCountMap[c.checkinDate] || 0) + 1
    })
    return dateCountMap
  }

  async function getCheckinsByDateRange(petId: string, startDate: string, endDate: string) {
    await new Promise(r => setTimeout(r, 100))
    return checkins.value.filter(
      c => c.petId === petId && c.checkinDate >= startDate && c.checkinDate <= endDate
    )
  }

  return {
    checkins,
    loading,
    fetchCheckins,
    fetchCheckinsByPet,
    fetchCheckinsByDate,
    createCheckin,
    deleteCheckin,
    getTodayCheckins,
    getCalendarData,
    getCheckinsByDateRange
  }
})
