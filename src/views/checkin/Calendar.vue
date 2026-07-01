<!--
  打卡日历页面 - Checkin/Calendar.vue
  功能：热力图日历 + 每日打卡记录 + 月度统计
-->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { NavBar } from 'vant'
import { usePetStore } from '@/stores/usePetStore'
import { useCheckinStore } from '@/stores/useCheckinStore'
import type { Checkin } from '@/types'

const router = useRouter()
const petStore = usePetStore()
const checkinStore = useCheckinStore()

// 当前年月
const curDate = new Date()
const curYear = ref(curDate.getFullYear())
const curMonth = ref(curDate.getMonth() + 1)
const todayStr = computed(() => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})

// 选中的日期
const selectedDate = ref('')

// 当月打卡数据
const monthCheckins = ref<Checkin[]>([])

// 获取该月所有天数
const daysInMonth = computed(() => {
  const y = curYear.value
  const m = curMonth.value
  const days = new Date(y, m, 0).getDate()
  const result: { day: number; dateStr: string; weekday: number; count: number }[] = []
  for (let d = 1; d <= days; d++) {
    const date = new Date(y, m - 1, d)
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    result.push({
      day: d,
      dateStr,
      weekday: date.getDay(),
      count: 0
    })
  }
  return result
})

// 当月第一天是星期几
const firstDayOfWeek = computed(() => {
  return new Date(curYear.value, curMonth.value - 1, 1).getDay()
})

// 按日期统计打卡次数
const checkinStats = computed(() => {
  const map: Record<string, number> = {}
  monthCheckins.value.forEach(c => {
    const d = c.checkinDate
    map[d] = (map[d] || 0) + 1
  })
  return map
})

// 合并日历天数和统计
const calendarDays = computed(() => {
  return daysInMonth.value.map(d => ({
    ...d,
    count: checkinStats.value[d.dateStr] || 0
  }))
})

// 选中日期的打卡记录
const selectedCheckins = computed(() => {
  if (!selectedDate.value) return []
  return monthCheckins.value.filter(c => c.checkinDate === selectedDate.value)
})

// 统计
const totalCount = computed(() => monthCheckins.value.length)
const continuousDays = computed(() => {
  // 简单的连续天数计算（从今天往前数）
  let count = 0
  const allDates = monthCheckins.value.map(c => c.checkinDate).sort().reverse()
  const uniqueDates = [...new Set(allDates)]
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    if (uniqueDates.includes(ds)) {
      count++
    } else {
      break
    }
  }
  return count
})

// 热度颜色
function heatColor(count: number): string {
  if (count === 0) return '#f0f0f0'
  if (count <= 2) return '#C8E6C9'
  if (count <= 5) return '#81C784'
  return '#4CAF50'
}

// 切换月份
function prevMonth() {
  if (curMonth.value === 1) {
    curYear.value--
    curMonth.value = 12
  } else {
    curMonth.value--
  }
  loadCheckins()
}

function nextMonth() {
  if (curMonth.value === 12) {
    curYear.value++
    curMonth.value = 1
  } else {
    curMonth.value++
  }
  loadCheckins()
}

function selectDate(dateStr: string) {
  selectedDate.value = dateStr
}

function onGoBack() {
  router.back()
}

async function loadCheckins() {
  const petId = petStore.currentPetId || ''
  if (!petId) return
  const startDate = `${curYear.value}-${String(curMonth.value).padStart(2, '0')}-01`
  const endDate = `${curYear.value}-${String(curMonth.value).padStart(2, '0')}-${new Date(curYear.value, curMonth.value, 0).getDate()}`
  monthCheckins.value = await checkinStore.getCheckinsByDateRange(petId, startDate, endDate)
}

onMounted(() => {
  selectedDate.value = todayStr.value
  loadCheckins()
})

const weekLabels = ['日', '一', '二', '三', '四', '五', '六']
</script>

<template>
  <div class="calendar-page">
    <van-nav-bar title="打卡日历" left-arrow @click-left="onGoBack" fixed placeholder />

    <!-- 月份切换 -->
    <div class="month-nav">
      <span class="nav-arrow" @click="prevMonth">◀</span>
      <span class="month-label">{{ curYear }}年 {{ curMonth }}月</span>
      <span class="nav-arrow" @click="nextMonth">▶</span>
    </div>

    <!-- 日历热力图 -->
    <div class="calendar-grid">
      <!-- 星期头 -->
      <div
        v-for="w in weekLabels"
        :key="w"
        class="week-header"
      >
        {{ w }}
      </div>

      <!-- 空白占位 -->
      <div
        v-for="i in firstDayOfWeek"
        :key="'empty-' + i"
        class="day-cell empty"
      />

      <!-- 日期格子 -->
      <div
        v-for="day in calendarDays"
        :key="day.dateStr"
        class="day-cell"
        :class="{
          today: day.dateStr === todayStr,
          selected: day.dateStr === selectedDate
        }"
        :style="{ background: heatColor(day.count) }"
        @click="selectDate(day.dateStr)"
      >
        <span class="day-num">{{ day.day }}</span>
      </div>
    </div>

    <!-- 热度图例 -->
    <div class="heat-legend">
      <span class="legend-label">少</span>
      <span class="legend-dot" style="background:#f0f0f0" />
      <span class="legend-dot" style="background:#C8E6C9" />
      <span class="legend-dot" style="background:#81C784" />
      <span class="legend-dot" style="background:#4CAF50" />
      <span class="legend-label">多</span>
    </div>

    <!-- 选中日期记录 -->
    <div v-if="selectedDate" class="selected-section">
      <h3 class="section-title">
        {{ selectedDate }}
        <span v-if="selectedDate === todayStr" class="today-badge">今天</span>
      </h3>

      <div v-if="selectedCheckins.length === 0" class="empty-hint">当天没有打卡记录</div>
      <div v-else class="checkin-list">
        <div
          v-for="item in selectedCheckins"
          :key="item.id"
          class="checkin-item"
        >
          <span class="ci-type">{{ item.typeLabel || item.type }}</span>
          <span class="ci-value" v-if="item.value">{{ item.value }}</span>
          <span class="ci-time">{{ item.checkinTime }}</span>
        </div>
      </div>
    </div>

    <!-- 月度统计 -->
    <div class="stats-section">
      <h3 class="section-title">📊 本月统计</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-num">{{ totalCount }}</span>
          <span class="stat-label">总打卡</span>
        </div>
        <div class="stat-item">
          <span class="stat-num">{{ continuousDays }}</span>
          <span class="stat-label">连续天数</span>
        </div>
        <div class="stat-item">
          <span class="stat-num">{{ calendarDays.filter(d => d.count > 0).length }}</span>
          <span class="stat-label">打卡天数</span>
        </div>
      </div>
      <div v-if="continuousDays >= calendarDays.filter(d => d.count > 0).length && totalCount > 0" class="full-badge">
        🎉 达成本月全勤！
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default { name: 'CheckinCalendarPage' }
</script>

<style lang="scss" scoped>
.calendar-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: env(safe-area-inset-bottom, 20px);
}

.month-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: #fff;
  gap: 20px;

  .nav-arrow {
    font-size: 16px;
    color: #4CAF50;
    cursor: pointer;
    padding: 4px 12px;
  }

  .month-label {
    font-size: 17px;
    font-weight: 600;
    color: #333;
    min-width: 120px;
    text-align: center;
  }
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
  padding: 0 12px;
  background: #fff;
}

.week-header {
  text-align: center;
  font-size: 12px;
  color: #999;
  padding: 6px 0;
}

.day-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  .day-num {
    font-size: 13px;
    color: #555;
    font-weight: 500;
  }

  &.today {
    box-shadow: inset 0 0 0 2px #4CAF50;
  }

  &.selected {
    box-shadow: inset 0 0 0 2px #FF9800;
  }

  &.empty {
    cursor: default;
    background: transparent !important;
  }
}

.heat-legend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  background: #fff;
  border-bottom: 8px solid #f5f7fa;
  margin-bottom: 8px;

  .legend-label {
    font-size: 11px;
    color: #999;
  }

  .legend-dot {
    width: 14px;
    height: 14px;
    border-radius: 3px;
    display: inline-block;
  }
}

.selected-section {
  background: #fff;
  margin: 0 12px 8px;
  border-radius: 12px;
  padding: 16px;

  .section-title {
    font-size: 15px;
    font-weight: 600;
    color: #333;
    margin: 0 0 12px;
  }

  .today-badge {
    font-size: 11px;
    color: #fff;
    background: #FF9800;
    padding: 2px 8px;
    border-radius: 10px;
    margin-left: 8px;
  }

  .empty-hint {
    color: #c8c9cc;
    font-size: 13px;
    text-align: center;
    padding: 12px;
  }
}

.checkin-list {
  .checkin-item {
    display: flex;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }

    .ci-type {
      font-size: 14px;
      color: #333;
      flex-shrink: 0;
    }

    .ci-value {
      font-size: 13px;
      color: #666;
      margin-left: 8px;
      flex: 1;
    }

    .ci-time {
      font-size: 12px;
      color: #999;
      flex-shrink: 0;
    }
  }
}

.stats-section {
  background: #fff;
  margin: 0 12px;
  border-radius: 12px;
  padding: 16px;

  .section-title {
    font-size: 15px;
    font-weight: 600;
    color: #333;
    margin: 0 0 16px;
  }
}

.stats-grid {
  display: flex;
  justify-content: space-around;
}

.stat-item {
  text-align: center;

  .stat-num {
    font-size: 28px;
    font-weight: 700;
    color: #4CAF50;
    display: block;
  }

  .stat-label {
    font-size: 12px;
    color: #999;
    margin-top: 4px;
  }
}

.full-badge {
  text-align: center;
  margin-top: 12px;
  font-size: 14px;
  color: #FF9800;
  font-weight: 600;
  padding: 8px;
  background: #FFF3E0;
  border-radius: 8px;
}
</style>