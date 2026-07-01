import type { Species, SpeciesInfo, CheckinTypeInfo } from '@/types'

// ============================================================
// 品种列表常量
// ============================================================
export const SPECIES_LIST: SpeciesInfo[] = [
  { value: 'hamster', label: '仓鼠', emoji: '🐹', color: '#F4A460' },
  { value: 'rabbit', label: '兔子', emoji: '🐰', color: '#FFB6C1' },
  { value: 'chinchilla', label: '龙猫', emoji: '🐭', color: '#A9A9A9' },
  { value: 'hedgehog', label: '刺猬', emoji: '🦔', color: '#8B4513' },
  { value: 'sugar_glider', label: '蜜袋鼯', emoji: '🦝', color: '#DAA520' },
  { value: 'parrot', label: '鹦鹉', emoji: '🦜', color: '#32CD32' },
  { value: 'gecko', label: '守宫', emoji: '🦎', color: '#FFD700' },
  { value: 'corn_snake', label: '玉米蛇', emoji: '🐍', color: '#FF6347' },
  { value: 'pacman_frog', label: '角蛙', emoji: '🐸', color: '#00FF7F' },
  { value: 'turtle', label: '龟', emoji: '🐢', color: '#2E8B57' },
  { value: 'ferret', label: '貂', emoji: '🦦', color: '#8B0000' }
]

// ============================================================
// 打卡类型常量
// ============================================================
export const CHECKIN_TYPES: CheckinTypeInfo[] = [
  { value: 'feeding', label: '喂食', emoji: '🥘', color: '#FF9800' },
  { value: 'cleaning', label: '清洁', emoji: '🧹', color: '#2196F3' },
  { value: 'temperature', label: '温度', emoji: '🌡', color: '#F44336' },
  { value: 'humidity', label: '湿度', emoji: '💧', color: '#00BCD4' },
  { value: 'weight', label: '体重', emoji: '⚖', color: '#9C27B0' },
  { value: 'shedding', label: '蜕皮', emoji: '🦎', color: '#CDDC39' },
  { value: 'molting', label: '换羽', emoji: '🪶', color: '#795548' },
  { value: 'medicine', label: '用药', emoji: '💊', color: '#E91E63' },
  { value: 'other', label: '其他', emoji: '📝', color: '#607D8B' }
]

// ============================================================
// 会员计划
// ============================================================
export const MEMBER_PLANS = [
  { plan: 'monthly' as const, label: '月度会员', price: 9.9, originalPrice: 12.9, days: 30, badge: '' },
  { plan: 'quarterly' as const, label: '季度会员', price: 25, originalPrice: 38.7, days: 90, badge: '省14元' },
  { plan: 'yearly' as const, label: '年度会员', price: 88, originalPrice: 118.8, days: 365, badge: '推荐' }
]

// ============================================================
// 快捷提问（默认）
// ============================================================
export const DEFAULT_QUICK_QUESTIONS: string[] = [
  '我的仓鼠不吃东西怎么办？',
  '兔子拉肚子怎么处理？',
  '守宫蜕皮困难怎么办？',
  '龟壳变软是缺钙吗？',
  '鹦鹉掉毛正常吗？'
]

// 按品种的快捷提问
export const SPECIES_QUICK_QUESTIONS: Record<string, string[]> = {
  hamster: ['仓鼠湿尾症怎么治疗？', '仓鼠颊囊炎怎么办？', '仓鼠合笼要注意什么？'],
  rabbit: ['兔子便便变小了正常吗？', '兔子毛球症怎么办？', '兔子脚皮炎怎么处理？'],
  chinchilla: ['龙猫中暑怎么办？', '龙猫牙齿过长怎么办？', '龙猫火山灰浴多久一次？'],
  hedgehog: ['刺猬掉刺正常吗？', '刺猬疥螨怎么治疗？', '刺猬适宜温度是多少？'],
  sugar_glider: ['蜜袋鼯自残行为怎么办？', '蜜袋鼯HPW食谱怎么做？', '蜜袋鼯需要伴吗？'],
  parrot: ['鹦鹉啄羽症怎么办？', '鹦鹉不能吃哪些食物？', '鹦鹉剪羽要注意什么？'],
  gecko: ['守宫拒食怎么办？', '守宫钙粉怎么补？', '守宫温度怎么设置？'],
  corn_snake: ['玉米蛇吐食怎么办？', '玉米蛇喂食频率？', '玉米蛇卡皮怎么办？'],
  pacman_frog: ['角蛙冬眠怎么处理？', '角蛙红腿病怎么治疗？', '角蛙水质要求？'],
  turtle: ['龟白眼病怎么治疗？', '龟腐甲怎么办？', '龟晒背多久合适？'],
  ferret: ['貂体味太重怎么办？', '貂胰岛素瘤症状？', '貂需要打什么疫苗？']
}

// ============================================================
// 会员价格（单位：元）
// ============================================================
export const MEMBER_PRICE = 9.9

// ============================================================
// 每日免费 AI 次数上限
// ============================================================
export const DAILY_AI_LIMIT = 3

// ============================================================
// 打卡类型字段映射
// ============================================================
// ============================================================
// 辅助函数
// ============================================================

/** 根据 species value 获取品种信息 */
export function getSpeciesInfo(species: Species): SpeciesInfo {
  return SPECIES_LIST.find(s => s.value === species) || SPECIES_LIST[0]
}

/** 根据打卡类型 value 获取类型信息 */
export function getCheckinTypeInfo(type: string): CheckinTypeInfo {
  return CHECKIN_TYPES.find(c => c.value === type) || CHECKIN_TYPES[0]
}

// ============================================================
// 打卡类型字段映射
// ============================================================

export const CHECKIN_FIELDS: Record<string, { name: string; label: string; type: string; placeholder?: string; options?: { label: string; value: string }[] }[]> = {
  feeding: [
    { name: 'foodType', label: '食物类型', type: 'picker', options: [
      { label: '主粮', value: '主粮' },
      { label: '蔬果', value: '蔬果' },
      { label: '零食', value: '零食' },
      { label: '营养补充剂', value: '营养补充剂' }
    ]},
    { name: 'amount', label: '喂食量(克)', type: 'number', placeholder: '请输入喂食量' },
    { name: 'note', label: '备注', type: 'text', placeholder: '可填写额外说明' }
  ],
  cleaning: [
    { name: 'cleanItem', label: '清洁项目', type: 'picker', options: [
      { label: '笼子', value: '笼子' },
      { label: '垫材', value: '垫材' },
      { label: '厕所', value: '厕所' }
    ]},
    { name: 'note', label: '备注', type: 'text', placeholder: '可填写额外说明' }
  ],
  temperature: [
    { name: 'value', label: '温度(°C)', type: 'number', placeholder: '请输入温度' },
    { name: 'note', label: '备注', type: 'text', placeholder: '可填写额外说明' }
  ],
  humidity: [
    { name: 'value', label: '湿度(%)', type: 'number', placeholder: '请输入湿度' },
    { name: 'note', label: '备注', type: 'text', placeholder: '可填写额外说明' }
  ],
  weight: [
    { name: 'value', label: '体重(g)', type: 'number', placeholder: '请输入体重' },
    { name: 'note', label: '备注', type: 'text', placeholder: '可填写额外说明' }
  ],
  shedding: [
    { name: 'status', label: '蜕皮状态', type: 'picker', options: [
      { label: '开始', value: '开始' },
      { label: '进行中', value: '进行中' },
      { label: '完成', value: '完成' }
    ]},
    { name: 'note', label: '备注', type: 'text', placeholder: '可填写额外说明' }
  ],
  molting: [
    { name: 'status', label: '换羽状态', type: 'picker', options: [
      { label: '开始', value: '开始' },
      { label: '进行中', value: '进行中' },
      { label: '完成', value: '完成' }
    ]},
    { name: 'note', label: '备注', type: 'text', placeholder: '可填写额外说明' }
  ],
  medicine: [
    { name: 'drugName', label: '药品名称', type: 'text', placeholder: '请输入药品名称' },
    { name: 'dosage', label: '用量', type: 'text', placeholder: '请输入用量' },
    { name: 'note', label: '备注', type: 'text', placeholder: '可填写额外说明' }
  ],
  other: [
    { name: 'note', label: '内容', type: 'text', placeholder: '记录你想记录的内容' }
  ]
}