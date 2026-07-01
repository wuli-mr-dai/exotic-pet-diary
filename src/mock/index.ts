/**
 * Mock 假数据模块 —— 模拟后端 Supabase 返回的数据
 */
import type { User, Pet, Checkin, AiChat, ChatMessage, WikiEntry, Reminder, CheckinStats, Species, CheckinType } from '@/types'
import { generateId, today, formatDate, formatTime } from '@/utils/date'

// ============================================================
// 当前Mock 用户
// ============================================================
export const mockUser: User = {
  id: 'u_001',
  phone: '138****5678',
  nickname: '小明的异宠世界',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=exoticpet',
  isMember: true,
  memberExpireAt: '2026-08-15T00:00:00Z',
  dailyAiCount: 1,
  lastAiDate: today(),
  createdAt: '2026-06-01T10:00:00Z',
  updatedAt: '2026-06-28T10:00:00Z'
}

// ============================================================
// Mock 宠物列表
// ============================================================
export const mockPets: Pet[] = [
  {
    id: 'p_001',
    userId: 'u_001',
    name: '团团',
    species: 'hamster' as Species,
    breed: '金丝熊',
    birthday: '2026-06-06',
    gender: '公',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=hamster1',
    photos: [
      'https://picsum.photos/400/400?random=10',
      'https://picsum.photos/400/400?random=11',
      'https://picsum.photos/400/400?random=12'
    ],
    isActive: true,
    createdAt: '2026-06-06T10:00:00Z',
    updatedAt: '2026-06-28T10:00:00Z'
  },
  {
    id: 'p_002',
    userId: 'u_001',
    name: '慢慢',
    species: 'turtle' as Species,
    breed: '巴西龟',
    birthday: '2026-05-15',
    gender: '未知',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=turtle1',
    photos: [
      'https://picsum.photos/400/400?random=20',
      'https://picsum.photos/400/400?random=21'
    ],
    isActive: true,
    createdAt: '2026-05-15T14:00:00Z',
    updatedAt: '2026-06-25T14:00:00Z'
  },
  {
    id: 'p_003',
    userId: 'u_001',
    name: '小绿',
    species: 'gecko' as Species,
    breed: '豹纹守宫',
    birthday: '2026-04-20',
    gender: '母',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=gecko1',
    photos: [
      'https://picsum.photos/400/400?random=30'
    ],
    isActive: true,
    createdAt: '2026-04-20T09:00:00Z',
    updatedAt: '2026-06-20T09:00:00Z'
  }
]

// ============================================================
// Mock 打卡记录
// ============================================================
const checkinTemplates = [
  { type: 'feeding' as CheckinType, label: '喂食', emoji: '🥘', value: '主粮 10g', time: '08:30' },
  { type: 'temperature' as CheckinType, label: '温度', emoji: '🌡', value: '25°C', time: '08:31' },
  { type: 'weight' as CheckinType, label: '体重', emoji: '⚖', value: '45g', time: '09:00' },
  { type: 'cleaning' as CheckinType, label: '清洁', emoji: '🧹', value: '更换垫材', time: '18:00' },
  { type: 'humidity' as CheckinType, label: '湿度', emoji: '💧', value: '55%', time: '08:30' },
  { type: 'shedding' as CheckinType, label: '蜕皮', emoji: '🦎', value: '蜕皮完成', time: '10:00' },
  { type: 'medicine' as CheckinType, label: '用药', emoji: '💊', value: '钙粉 0.5g', time: '20:00' },
  { type: 'molting' as CheckinType, label: '换羽', emoji: '🪶', value: '进行中', time: '11:00' }
]

export const mockCheckins: Checkin[] = []

// 生成过去30天的打卡数据
const todayDate = new Date()
for (let i = 0; i < 60; i++) {
  const d = new Date(todayDate)
  d.setDate(d.getDate() - Math.floor(i / 2))
  const dateStr = formatDate(d)

  // 每天1-3条打卡
  const count = (i % 4) + 1
  for (let j = 0; j < count; j++) {
    const template = checkinTemplates[(i + j) % checkinTemplates.length]
    const hour = 8 + j * 2
    const min = 15 + j * 15
    mockCheckins.push({
      id: generateId(),
      userId: 'u_001',
      petId: i % 3 === 0 ? 'p_002' : i % 3 === 1 ? 'p_003' : 'p_001',
      type: template.type,
      typeLabel: template.label,
      emoji: template.emoji,
      value: template.value,
      note: '',
      photoUrl: '',
      checkinDate: dateStr,
      checkinTime: `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`,
      createdAt: `${dateStr}T${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}:00Z`
    })
  }
}

// 按时间排序（最新的在前）
mockCheckins.sort((a, b) => b.createdAt.localeCompare(a.createdAt))

// ============================================================
// Mock AI 对话历史
// ============================================================
export const mockAiChats: AiChat[] = [
  {
    id: 'ai_001',
    userId: 'u_001',
    petId: 'p_001',
    question: '我的仓鼠不吃东西怎么办？',
    answer: '仓鼠食欲下降可能由以下原因引起：\n\n1. **环境温度过高**：仓鼠适宜温度在20-28°C，过热的天气会让它减少进食。建议将笼子放在通风凉爽处。\n\n2. **牙齿问题**：仓鼠门牙过长会导致进食困难，可以观察一下它的牙齿是否正常。\n\n3. **颊囊炎**：如果仓鼠颊囊发炎，会因疼痛而拒食。观察脸颊是否异常鼓起。\n\n4. **食物变质**：检查食物是否受潮发霉。\n\n建议措施：\n• 调整室温至适宜范围\n• 更换新鲜食物\n• 如果持续超过24小时不进食，建议尽快带去异宠医院检查\n\n⚠️ 以上建议仅供参考，不能替代专业兽医诊断。如宠物出现严重症状，请及时就医。',
    sources: [{ id: 'kb_001', question: '仓鼠不吃东西的原因', answer: '...' }],
    isHelpful: true,
    createdAt: '2026-06-28T15:30:00Z'
  },
  {
    id: 'ai_002',
    userId: 'u_001',
    petId: 'p_002',
    question: '龟壳变软是缺钙吗？',
    answer: '龟壳变软确实是缺钙的常见表现，但也要排查其他原因：\n\n1. **钙质不足**：缺乏钙质摄入或维生素D3不足导致钙无法吸收。需要补充钙粉和足够晒背（UVB灯）。\n\n2. **水质问题**：长期生活在偏酸性水质中会导致壳软化。建议保持水质中性或微碱性。\n\n3. **光照不足**：UVB灯老化（超过6个月）或照射时间不够会影响钙质合成。\n\n建议措施：\n• 在食物中定期添加爬宠专用钙粉\n• 确保每天有10-12小时UVB照射\n• 提供墨鱼骨等天然钙源\n• 定期检测水质pH值\n\n⚠️ 以上建议仅供参考，不能替代专业兽医诊断。如宠物出现严重症状，请及时就医。',
    sources: [],
    isHelpful: null,
    createdAt: '2026-06-27T10:00:00Z'
  },
  {
    id: 'ai_003',
    userId: 'u_001',
    petId: null,
    question: '兔子掉毛正常吗？',
    answer: '兔子掉毛分正常换毛和异常脱毛两种情况：\n\n**正常换毛**：\n• 春秋两季是换毛旺季\n• 全身均匀掉毛，新毛同时生长\n• 通常持续2-4周\n\n**异常脱毛（需要警惕）**：\n• 局部斑秃，皮肤发红或有皮屑 → 可能是螨虫或真菌感染\n• 频繁抓挠某处 → 可能有寄生虫\n• 下巴/颈部掉毛 → 可能是牙齿问题流口水导致\n• 怀孕母兔会拔自己腹部的毛做窝 → 正常生理行为\n\n**换毛期护理**：\n• 每天梳毛，防止毛球症\n• 提供足够的干草（提摩西草）帮助排毛\n• 可适量喂食木瓜酵素帮助溶解毛球\n\n⚠️ 以上建议仅供参考，不能替代专业兽医诊断。如宠物出现严重症状，请及时就医。',
    sources: [{ id: 'kb_002', question: '兔子换毛期护理', answer: '...' }],
    isHelpful: true,
    createdAt: '2026-06-25T20:00:00Z'
  }
]

// AI 对话消息（用于聊天界面展示）
export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg_001',
    role: 'assistant',
    content: '你好！🐹 我是你的异宠养宠顾问，精通仓鼠、兔子、龙猫、刺猬、蜜袋鼯、鹦鹉、守宫、玉米蛇、角蛙、龟、貂的日常养护和常见疾病。请问有什么可以帮你的？',
    timestamp: '2026-06-28T15:28:00Z',
    isTyping: false
  },
  {
    id: 'msg_002',
    role: 'user',
    content: '我的仓鼠不吃东西怎么办？',
    timestamp: '2026-06-28T15:29:00Z'
  },
  {
    id: 'msg_003',
    role: 'assistant',
    content: mockAiChats[0].answer,
    timestamp: '2026-06-28T15:30:00Z',
    isTyping: false
  }
]

// ============================================================
// Mock 百科列表
// ============================================================
export const mockWikiList: WikiEntry[] = [
  {
    id: 'w_001',
    species: 'hamster' as Species,
    breed: '金丝熊',
    title: '金丝熊饲养入门指南',
    content: `# 金丝熊饲养入门指南

## 笼具选择
金丝熊需要至少**60cm×40cm**的笼子，越大越好。笼底铺**5-10cm厚**的无尘木屑垫材。

## 食物
- 主粮：仓鼠专用粮（建议选择无添加糖的混合粮）
- 每日喂食量：约10g
- 蔬果每周1-2次，每次指甲盖大小
- **禁止喂食**：洋葱、大蒜、巧克力、牛油果

## 环境
- 适宜温度：20-28°C
- 避免阳光直射和空调直吹
- 夜间活跃，白天睡觉

## 常见疾病
- **湿尾症**：腹泻、尾部湿漉漉，死亡率高，需立即就医
- **颊囊炎**：颊囊发炎肿胀，需减少硬壳食物

## 寿命
平均2-3年`,
    coverUrl: 'https://picsum.photos/400/300?random=100',
    tags: ['入门', '金丝熊', '饲养'],
    viewCount: 1230,
    createdAt: '2026-06-01T00:00:00Z'
  },
  {
    id: 'w_002',
    species: 'turtle' as Species,
    breed: '巴西龟',
    title: '巴西龟饲养全攻略',
    content: `# 巴西龟饲养全攻略

## 环境设置
- 水陆两栖环境，水深以龟壳高度2-3倍为宜
- 设置晒背台，每天UVB灯照射10-12小时
- 水温保持24-28°C

## 喂食
- 幼龟每天喂1次，成龟每2-3天喂1次
- 食物：龟粮、小鱼虾、蔬菜叶
- 补钙：墨鱼骨或钙粉

## 常见疾病
- **白眼病**：眼睛浮肿发白，水质问题导致
- **腐甲**：龟壳变软、出现红斑
- **肺炎**：呼吸困难、张口呼吸

⚠️ 巴西龟是入侵物种，不可野外放生`,
    coverUrl: 'https://picsum.photos/400/300?random=101',
    tags: ['入门', '巴西龟', '饲养'],
    viewCount: 890,
    createdAt: '2026-06-02T00:00:00Z'
  },
  {
    id: 'w_003',
    species: 'gecko' as Species,
    breed: '豹纹守宫',
    title: '豹纹守宫新手必读',
    content: `# 豹纹守宫新手必读

## 环境
- 饲养箱：30cm×30cm×45cm以上
- 温度阶梯：热区28-32°C，冷区22-25°C
- 隐蔽洞穴至少2个

## 食物
- 活体昆虫：蟋蟀、面包虫、杜比亚蟑螂
- 喂食频率：幼体每天，成体每2-3天
- **必须粘钙粉+D3**，缺钙是常见问题

## 蜕皮
- 幼体每2-3周蜕皮一次
- 蜕皮困难会增加湿度或提供湿润洞穴
- 检查指端是否有残留皮

## 常见问题
- **拒食**：温度不对、即将蜕皮、压力大
- **卡皮**：湿度不足导致，尤其是脚趾`,
    coverUrl: 'https://picsum.photos/400/300?random=102',
    tags: ['入门', '豹纹守宫', '饲养'],
    viewCount: 1500,
    createdAt: '2026-06-03T00:00:00Z'
  },
  {
    id: 'w_004',
    species: 'rabbit' as Species,
    breed: '',
    title: '养兔必备知识',
    content: `# 养兔必备知识

## 饮食
- **无限量提摩西草**（或燕麦草）
- 兔粮每日约体重的3%
- 新鲜蔬菜每天一小把
- **24小时提供清洁饮水**

## 禁忌食物
- 牛油果（剧毒！）
- 巧克力、糖果
- 人类零食
- 洋葱、大蒜

## 居住
- 笼子至少80cm×60cm
- 每天至少2小时以上的放风时间
- 厕所固定在一个角落

## 健康观察
- 正常便便：圆形、干爽、碎裂
- 异常便便：变小、粘稠、串在一起
- 脚皮炎：脚底红肿脱毛

## 寿命
6-10年`,
    coverUrl: 'https://picsum.photos/400/300?random=103',
    tags: ['入门', '兔子', '饲养'],
    viewCount: 2000,
    createdAt: '2026-06-05T00:00:00Z'
  }
]

// ============================================================
// Mock 提醒设置
// ============================================================
export const mockReminders: Reminder[] = [
  {
    id: 'r_001',
    userId: 'u_001',
    petId: 'p_001',
    type: 'feeding',
    time: '08:00',
    repeatType: 'daily',
    days: [],
    isActive: true,
    createdAt: '2026-06-06T10:00:00Z'
  },
  {
    id: 'r_002',
    userId: 'u_001',
    petId: 'p_001',
    type: 'cleaning',
    time: '18:00',
    repeatType: 'weekly',
    days: [1, 4],
    isActive: true,
    createdAt: '2026-06-06T10:00:00Z'
  }
]

// ============================================================
// Mock 打卡统计
// ============================================================
export const mockCheckinStats: CheckinStats = {
  totalCount: 88,
  consecutiveDays: 22,
  completionRate: 0.85,
  monthlyData: Array.from({ length: 30 }, (_, i) => ({
    date: formatDate(new Date(2026, 5, i + 1)),
    count: (i % 5) + 1
  }))
}

// ============================================================
// Mock 辅助函数
// ============================================================

/** 模拟网络延迟 */
export function simulateDelay(ms = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/** 获取指定宠物的打卡记录 */
export function getCheckinsByPet(petId: string): Checkin[] {
  return mockCheckins.filter(c => c.petId === petId)
}

/** 获取指定日期的打卡记录 */
export function getCheckinsByDate(petId: string, date: string): Checkin[] {
  return mockCheckins.filter(c => c.petId === petId && c.checkinDate === date)
}

/** 获取今日打卡记录 */
export function getTodayCheckins(petId: string): Checkin[] {
  return getCheckinsByDate(petId, today())
}

/** 获取指定品种的百科 */
export function getWikiBySpecies(species: Species): WikiEntry[] {
  return mockWikiList.filter(w => w.species === species)
}

/**
 * Mock AI 智能回答（根据问题关键词返回不同回答）
 */
export function mockAiAnswer(question: string, pet?: { name: string; species: string } | null): string {
  const q = question.toLowerCase()
  const petName = pet?.name ?? '你的宠物'
  const emoji = pet?.species ? getSpeciesEmoji(pet.species) : '🐹'

  if (q.includes('不吃') || q.includes('拒食') || q.includes('不吃东西')) {
    return `${petName}食欲下降可能由以下原因引起：\n\n1. **环境不适**：温度过高或过低都会影响进食。请确认饲养环境温度是否在适宜范围。\n\n2. **食物变质**：检查食物是否受潮、发霉或过期。\n\n3. **压力过大**：新环境、噪音、频繁打扰都可能导致拒食。\n\n4. **口腔/牙齿问题**：检查口腔是否有异常。\n\n建议措施：\n• 调整环境温度\n• 更换新鲜食物\n• 给予安静环境\n• 持续超过24小时不进食，请及时就医\n\n⚠️ 以上建议仅供参考，不能替代专业兽医诊断。如宠物出现严重症状，请及时就医。`
  }

  if (q.includes('拉肚') || q.includes('腹泻') || q.includes('便便') || q.includes('软便')) {
    return `关于${petName}的消化问题：\n\n**可能原因**：\n1. 食物不洁或突然更换\n2. 环境温度偏低导致消化不良\n3. 细菌或寄生虫感染\n4. 应激反应\n\n**紧急处理**：\n• 暂停喂蔬果等高水分食物\n• 提供温暖环境\n• 补充水分防止脱水\n• 观察精神状态\n\n⚠️ 如伴随精神萎靡、拒食超过12小时，请立即就医！以上建议仅供参考，不能替代专业兽医诊断。`
  }

  if (q.includes('温度') || q.includes('冷') || q.includes('热') || q.includes('中暑')) {
    return `关于${petName}的温度管理：\n\n异宠对温度非常敏感，不同品种有不同需求：\n\n• **仓鼠/兔子/龙猫**：适宜20-25°C，龙猫尤其怕热（>28°C可能中暑）\n• **守宫/爬宠**：需要温度阶梯，热区28-32°C，冷区22-25°C\n• **龟**：水温24-28°C，必须设置晒背台\n• **蜜袋鼯**：22-28°C\n\n**夏季降温技巧**：\n• 冰冻矿泉水瓶放在笼子旁边\n• 陶瓷板/铝板散热\n• 保持通风\n\n⚠️ 以上建议仅供参考，不能替代专业兽医诊断。`
  }

  if (q.includes('脱皮') || q.includes('蜕皮') || q.includes('卡皮')) {
    return `${petName}蜕皮/脱皮问题：\n\n**蜕皮困难常见原因**：\n1. 湿度不足（最常见）\n2. 营养不良（缺钙/维生素）\n3. 环境温度不对\n\n**处理建议**：\n• 提高环境湿度（喷水/湿润洞穴）\n• 提供温水浅浴（爬宠）\n• 检查是否有残留皮（尤其是脚趾、尾尖）\n• 补充爬宠专用钙粉+维生素D3\n\n⚠️ 切勿用手强行撕掉未脱落的皮！以上建议仅供参考，不能替代专业兽医诊断。`
  }

  // 默认回答
  return `关于"${question}"，作为你的异宠顾问，我给出以下建议：\n\n1. 首先观察${petName}的整体精神状态、食欲是否正常。\n2. 检查饲养环境：温度、湿度、清洁度是否达标。\n3. 如有具体症状（如拉稀、红肿、拒食超过24小时），建议尽快联系异宠专科兽医。\n\n你可以告诉我更详细的症状，我会给你更具体的建议～\n\n⚠️ 以上建议仅供参考，不能替代专业兽医诊断。如宠物出现严重症状，请及时就医。`
}

/** 获取品种 emoji */
function getSpeciesEmoji(species: string): string {
  const map: Record<string, string> = {
    hamster: '🐹',
    rabbit: '🐰',
    chinchilla: '🐭',
    hedgehog: '🦔',
    sugar_glider: '🦝',
    parrot: '🦜',
    gecko: '🦎',
    corn_snake: '🐍',
    pacman_frog: '🐸',
    turtle: '🐢',
    ferret: '🦦'
  }
  return map[species] ?? '🐹'
}

/** 按品种获取快捷提问 */
export function getQuickQuestions(species?: Species): string[] {
  const all: Record<string, string[]> = {
    hamster: ['我的仓鼠不吃东西怎么办？', '仓鼠垫材多久换一次？', '仓鼠湿尾症怎么处理？', '仓鼠可以合笼养吗？'],
    rabbit: ['兔子掉毛正常吗？', '兔子可以洗澡吗？', '兔子便便不正常是什么原因？', '兔子需要绝育吗？'],
    chinchilla: ['龙猫夏天需要降温吗？', '龙猫用什么洗澡砂？', '龙猫牙齿过长怎么办？'],
    hedgehog: ['刺猬掉刺正常吗？', '刺猬洗澡用什么？', '刺猬不吃东西怎么办？'],
    sugar_glider: ['蜜袋鼯需要同伴吗？', '蜜袋鼯吃什么？', '蜜袋鼯自残行为怎么办？'],
    parrot: ['鹦鹉羽毛蓬松是病了吗？', '鹦鹉可以吃什么水果？', '鹦鹉啄羽怎么办？'],
    gecko: ['守宫不吃饭怎么办？', '守宫蜕皮困难怎么处理？', '守宫需要什么样的温度？'],
    corn_snake: ['玉米蛇多久喂一次？', '玉米蛇吐食怎么办？', '玉米蛇需要冬眠吗？'],
    pacman_frog: ['角蛙不吃东西怎么办？', '角蛙水质要求？', '角蛙可以冬眠吗？'],
    turtle: ['我的龟壳变软了怎么办？', '乌龟白眼病怎么治？', '龟需要每天喂食吗？', '乌龟冬眠要注意什么？'],
    ferret: ['貂需要打疫苗吗？', '貂体味太重怎么办？', '貂日常需要多少活动量？'],
  }
  if (species && all[species]) return all[species]
  return all['hamster']
}
