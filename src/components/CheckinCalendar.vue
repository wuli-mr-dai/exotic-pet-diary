<script setup lang="ts">
import { ref, computed } from 'vue'
import { getMonthDayCount, getFirstDayOfMonth } from '@/utils/date'

const props = defineProps<{
  petId: string
  year?: number
  month?: number
}>()

defineEmits<{
  dateClick: [date: string]
}>()

const currentYear = ref(props.year ?? new Date().getFullYear())
const currentMonth = ref(props.month ?? new Date().getMonth() + 1)

const monthLabel = computed(() => `${currentYear.value}年 ${currentMonth.value}月`)

const daysInMonth = computed(() => getMonthDayCount(currentYear.value, currentMonth.value))
const firstDay = computed(() => getFirstDayOfMonth(currentYear.value, currentMonth.value))

// mock 打卡数据：日期 -> 打卡次数
const checkinMap: Record<string, number> = {
  '2026-06-22': 3, '2026-06-21': 5, '2026-06-20': 2,
  '2026-06-19': 6, '2026-06-18': 1, '2026-06-17': 4,
  '2026-06-15': 2, '2026-06-14': 3, '2026-06-12': 5
}

function getDateKey(day: number): string {
  const m = String(currentMonth.value).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${currentYear.value}-${m}-${d}`
}

function getHeatClass(day: number): string {
  const count = checkinMap[getDateKey(day)] ?? 0
  if (count >= 6) return 'heat--high'
  if (count >= 3) return 'heat--mid'
  if (count >= 1) return 'heat--low'
  return ''
}

function prevMonth() {
  if (currentMonth.value === 1) {
    currentMonth.value = 12
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

function nextMonth() {
  if (currentMonth.value === 12) {
    currentMonth.value = 1
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

const blanks = computed(() => Array(firstDay.value).fill(null))
const days = computed(() => Array.from({ length: daysInMonth.value }, (_, i) => i + 1))
</script>

<template>
  <div class="checkin-calendar">
    <div class="calendar-header">
      <span class="month-label">{{ monthLabel }}</span>
      <div class="month-nav">
        <van-button size="small" icon="arrow-left" @click="prevMonth" />
        <van-button size="small" icon="arrow" @click="nextMonth" />
      </div>
    </div>

    <div class="weekdays">
      <span v-for="w in ['日','一','二','三','四','五','六']" :key="w">{{ w }}</span>
    </div>

    <div class="calendar-grid">
      <div v-for="(_, i) in blanks" :key="'b' + i" class="day-cell day-cell--empty" />
      <div
        v-for="d in days"
        :key="d"
        class="day-cell"
        :class="getHeatClass(d)"
        @click="$emit('dateClick', getDateKey(d))"
      >
        <span class="day-num">{{ d }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.checkin-calendar {
  padding: 12px 16px;
  background: var(--van-background);
  border-radius: 12px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  .month-label {
    font-size: 16px;
    font-weight: 600;
  }

  .month-nav {
    display: flex;
    gap: 8px;
  }
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-size: 12px;
  color: var(--van-text-color-2);
  margin-bottom: 8px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.day-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  background: var(--van-background-2);
  transition: all 0.15s;

  &:active {
    opacity: 0.7;
  }

  &.heat--low { background: #C8E6C9; }
  &.heat--mid { background: #81C784; }
  &.heat--high { background: #388E3C; color: #fff; }
}

.day-cell--empty {
  background: transparent;
  pointer-events: none;
}

.day-num {
  font-weight: 500;
}
</style>