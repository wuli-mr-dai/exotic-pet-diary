// 宠物数据
export interface Pet {
  id: string
  name: string
  avatar?: string
  createdAt: string
}

// 打卡类型
export interface CheckinType {
  value: string
  label: string
  emoji: string
  color: string
}

// 打卡数据
export interface Checkin {
  id: string
  petId: string
  type: string
  checkinDate: string
  note?: string
  value?: string
  photoUrl?: string
  createdAt: string
}

// 日记
export interface PetDiary {
  id: string
  petId: string
  date: string // YYYY-MM-DD
  content: string
  mood?: string
  title?: string
  image?: string
  photoUrl?: string
  stickers?: any[]
  items?: any[]
  themeId?: string
  puzzleId?: string
  createdAt: string
  updatedAt: string
}

// 主题需求
export interface ThemeRequirement {
  type: string
  value: number
}

// 主题
export interface Theme {
  id: string
  petId: string
  name: string
  icon: string
  previewImage: string
  requirements: ThemeRequirement[]
  unlockedAt: string
}

// 主题皮肤
export interface ThemeSkin {
  id: string
  name: string
  icon?: string
  previewImage?: string
  variables: Record<string, string>
  // css 类名，可选
  className?: string
}

// 谜题
export interface Puzzle {
  id: string
  petId: string
  date: string
  image: string
  pieces: number
  completed: boolean
  createdAt: string
}

// 统计
export interface Stats {
  totalCheckins: number
  streakDays: number
  daysWithPet: number
}

export interface AlbumRecord {
  id: string
  petId: string
  date: string
  type: string
  data: Record<string, any>
  createdAt: string
}