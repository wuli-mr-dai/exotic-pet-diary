import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Theme, ThemeSkin, ThemeRequirement } from '@/types'

export interface ThemeState {
  themeList: Theme[]
  unlockedThemes: Record<string, string[]>
  activeThemes: Record<string, string>
  skinMap: Record<string, ThemeSkin>
}

// 默认主题皮肤（内置，无需解锁）
const DEFAULT_THEME_SKINS: ThemeSkin[] = [
  {
    id: 'default',
    name: '默认',
    icon: '🎨',
    previewImage: '',
    variables: {
      '--global-panel-bg': '#ffffff'
    }
  },
  {
    id: 'dark',
    name: '暗夜',
    icon: '🌙',
    previewImage: '',
    variables: {
      '--global-panel-bg': '#2c2c2c'
    }
  },
  {
    id: 'forest',
    name: '森林',
    icon: '🌿',
    previewImage: '',
    variables: {
      '--global-panel-bg': '#e8f5e9'
    }
  },
  {
    id: 'ocean',
    name: '海洋',
    icon: '🌊',
    previewImage: '',
    variables: {
      '--global-panel-bg': '#e1f5fe'
    }
  },
  {
    id: 'sunset',
    name: '日落',
    icon: '🌅',
    previewImage: '',
    variables: {
      '--global-panel-bg': '#fff3e0'
    }
  }
]

export const useThemeStore = defineStore('theme', () => {
  // ============ State ============
  const themeList = ref<Theme[]>([])
  const unlockedThemes = ref<Record<string, string[]>>({})
  const activeThemes = ref<Record<string, string>>({})
  const skinMap = ref<Record<string, ThemeSkin>>({})
  const loaded = ref(false)

  // ============ Getters ============
  const getSkin = computed(() => {
    return (petId: string, themeId: string) => {
      const key = `${petId}_${themeId}`
      return skinMap.value[key] || null
    }
  })

  const getUnlockedThemes = computed(() => {
    return (petId: string) => unlockedThemes.value[petId] || []
  })

  const getActiveTheme = computed(() => {
    return (petId: string) => activeThemes.value[petId] || 'default'
  })

  // ============ Actions ============
  function init() {
    if (loaded.value) return

    // 初始化内置主题皮肤到 skinMap
    DEFAULT_THEME_SKINS.forEach(skin => {
      // '*' 通配符表示适用于所有宠物
      skinMap.value[`*_${skin.id}`] = skin
    })
    loadFromStorage()
    loaded.value = true
  }

  function isThemeUnlocked(petId: string, themeId: string): boolean {
    if (themeId === 'default') return true
    const unlocked = unlockedThemes.value[petId] || []
    return unlocked.includes(themeId)
  }

  function isThemeActive(petId: string, themeId: string): boolean {
    return (activeThemes.value[petId] || 'default') === themeId
  }

  function unlockTheme(petId: string, themeId: string): boolean {
    if (!unlockedThemes.value[petId]) {
      unlockedThemes.value[petId] = []
    }
    if (!unlockedThemes.value[petId].includes(themeId)) {
      unlockedThemes.value[petId].push(themeId)
    }
    saveToStorage()
    return true
  }

  function activateTheme(petId: string, themeId: string): boolean {
    if (!isThemeUnlocked(petId, themeId)) return false
    activeThemes.value[petId] = themeId
    saveToStorage()
    return true
  }

  function getThemesByPet(petId: string): Theme[] {
    // 返回内置主题列表
    if (themeList.value.length === 0) {
      themeList.value = DEFAULT_THEME_SKINS.map(skin => ({
        id: skin.id,
        petId: petId,
        name: skin.name,
        icon: skin.icon || '',
        previewImage: skin.previewImage || '',
        requirements: [] as ThemeRequirement[],
        unlockedAt: ''
      }))
    }
    return themeList.value
  }

  function getActiveThemesForMonth(_month: string): Set<string> {
    const active = new Set<string>()
    Object.values(activeThemes.value).forEach(themeId => {
      active.add(themeId)
    })
    return active
  }

  function saveToStorage() {
    try {
      const data = {
        unlockedThemes: unlockedThemes.value,
        activeThemes: activeThemes.value
      }
      localStorage.setItem('pet-theme-data', JSON.stringify(data))
    } catch (e) {
      console.error('保存主题数据失败', e)
    }
  }

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem('pet-theme-data')
      if (raw) {
        const data = JSON.parse(raw)
        if (data.unlockedThemes) unlockedThemes.value = data.unlockedThemes
        if (data.activeThemes) activeThemes.value = data.activeThemes
      }
    } catch (e) {
      console.error('加载主题数据失败', e)
    }
  }

  return {
    // state
    themeList,
    unlockedThemes,
    activeThemes,
    skinMap,
    loaded,
    // getters
    getSkin,
    getUnlockedThemes,
    getActiveTheme,
    // actions
    init,
    isThemeUnlocked,
    isThemeActive,
    unlockTheme,
    activateTheme,
    getThemesByPet,
    getActiveThemesForMonth,
    saveToStorage,
    loadFromStorage
  }
})