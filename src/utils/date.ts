/**
 * 日期工具函数
 */

/** 安全解析日期字符串（支持 YYYY-MM-DD 和 ISO 8601），避免时区偏移问题 */
function safeParse(date: Date | string): Date {
  if (date instanceof Date) return date
  // YYYY-MM-DD 格式：手动解析，始终使用本地时间午夜
  const match = date.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (match) {
    return new Date(+match[1], +match[2] - 1, +match[3])
  }
  // 其他格式（ISO 8601 等）：直接用浏览器解析
  return new Date(date)
}

/** 格式化为 YYYY-MM-DD */
export function formatDate(date: Date | string): string {
  const d = safeParse(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** 格式化为 HH:mm */
export function formatTime(date: Date | string): string {
  const d = safeParse(date)
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

/** 格式化为 YYYY-MM-DD HH:mm */
export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)} ${formatTime(date)}`
}

/** 相对时间（如"3天前"） */
export function timeAgo(date: Date | string): string {
  const now = Date.now()
  const target = safeParse(date).getTime()
  const diff = now - target
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '刚刚'
  if (mins < 60) return `${mins}分钟前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}小时前`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}天前`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}个月前`
  return `${Math.floor(months / 12)}年前`
}

/** 计算从某天到今天的天数 */
export function daysSince(date: Date | string): number {
  const now = new Date()
  const target = safeParse(date)
  return Math.floor((now.getTime() - target.getTime()) / 86400000) + 1
}

/** 获取今天的日期字符串 */
export function today(): string {
  return formatDate(new Date())
}

/** 获取当前时间字符串 */
export function now(): string {
  return formatDateTime(new Date())
}

/** 获取某月的天数 */
export function getMonthDayCount(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

/** 格式化日期为中文显示（如2026年6月29日） */
export function formatDateDisplay(date: Date | string): string {
  const d = safeParse(date)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

/** 获取某月第一天是星期几 (0=周日) */
export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month - 1, 1, 12).getDay()
}

/** 生成唯一ID */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}
