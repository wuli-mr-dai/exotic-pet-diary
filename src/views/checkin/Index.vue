<!--
  打卡页面 - Checkin/Index.vue
  功能：打卡类型选择网格 + 动态表单 + 打卡提交
-->
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  showToast,
  showSuccessToast,
  showFailToast,
  NavBar,
  Button,
  Field,
  Picker,
  Popup,
  DatePicker,
  Uploader
} from 'vant'
import type { UploaderFileListItem } from 'vant'
import { usePetStore } from '@/stores/usePetStore'
import { useCheckinStore } from '@/stores/useCheckinStore'
import { CHECKIN_TYPES, CHECKIN_FIELDS } from '@/utils/constants'
import { formatDate, formatTime } from '@/utils/date'
import type { CheckinType, CheckinTypeInfo } from '@/types'

const route = useRoute()
const router = useRouter()
const petStore = usePetStore()
const checkinStore = useCheckinStore()

// ---------- 状态 ----------
const selectedType = ref<CheckinType>('feeding')
const activeTypeInfo = computed<CheckinTypeInfo>(
  () => CHECKIN_TYPES.find(t => t.value === selectedType.value) ?? CHECKIN_TYPES[0]
)
const fields = computed(() => CHECKIN_FIELDS[selectedType.value] ?? [])

// 当前选中的宠物
const currentPet = computed(() => petStore.currentPet)
const petId = computed(() => {
  const paramId = route.query.petId as string | undefined
  return paramId || petStore.currentPetId || ''
})

// 表单数据
const formData = ref<Record<string, string>>({})

// 时间
const checkinDate = ref(formatDate(new Date()))
const checkinTime = ref(formatTime(new Date()))
const showDatePicker = ref(false)
const showTimePicker = ref(false)

// 照片
const photoList = ref<{ url: string }[]>([])

// Picker 弹窗
const showPicker = ref(false)
const pickerField = ref('')
const pickerOptions = ref<{ label: string; value: string }[]>([])

// 提交 loading
const submitting = ref(false)

// ---------- 方法 ----------
function selectType(type: CheckinType) {
  selectedType.value = type
  // 重置表单
  formData.value = {}
  fields.value.forEach(f => {
    if (f.name !== 'note') {
      formData.value[f.name] = ''
    }
  })
  formData.value.note = ''
}

function onFieldClick(field: { name: string; label: string; type: string; options?: { label: string; value: string }[] }) {
  if (field.type === 'picker' && field.options) {
    pickerField.value = field.name
    pickerOptions.value = field.options
    showPicker.value = true
  }
}

function onPickerConfirm({ selectedOptions }: { selectedOptions: { label: string; value: string }[] }) {
  if (selectedOptions.length > 0) {
    formData.value[pickerField.value] = selectedOptions[0].value
  }
  showPicker.value = false
}

function onDateConfirm({ selectedValues }: { selectedValues: string[] }) {
  const [year, month, day] = selectedValues
  checkinDate.value = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  showDatePicker.value = false
}

function onTimeConfirm({ selectedValues }: { selectedValues: string[] }) {
  const [hour, minute] = selectedValues
  checkinTime.value = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
  showTimePicker.value = false
}

async function onSubmit() {
  if (!petId.value) {
    showToast('请先选择宠物')
    return
  }
  submitting.value = true
  try {
    // 组装 value 字段
    let valueStr = ''
    const typeFields = CHECKIN_FIELDS[selectedType.value]
    if (typeFields) {
      const parts: string[] = []
      typeFields.forEach(f => {
        if (f.name !== 'note' && formData.value[f.name]) {
          parts.push(formData.value[f.name])
        }
      })
      valueStr = parts.join(' / ')
    }

    await checkinStore.createCheckin({
      petId: petId.value,
      type: selectedType.value,
      value: valueStr || undefined,
      note: formData.value.note || undefined,
      photoUrl: photoList.value.length > 0 ? photoList.value[0].url : undefined,
      checkinDate: checkinDate.value,
      checkinTime: checkinTime.value
    })
    showSuccessToast('打卡成功')
    // 重置
    formData.value = {}
    photoList.value = []
    checkinDate.value = formatDate(new Date())
    checkinTime.value = formatTime(new Date())
  } catch (e) {
    showFailToast('打卡失败，请重试')
  } finally {
    submitting.value = false
  }
}

function onGoBack() {
  router.back()
}

function afterRead(file: { content: string }) {
  // Mock: 直接用 base64 作为图片 URL
  photoList.value = [{ url: file.content }]
}
</script>

<template>
  <div class="checkin-page">
    <!-- 顶部导航 -->
    <van-nav-bar title="📝 今日打卡" left-arrow @click-left="onGoBack" fixed placeholder />

    <!-- 当前宠物显示 -->
    <div v-if="currentPet" class="current-pet-bar">
      <span class="pet-emoji">{{ currentPet.species ? '' : '🐹' }}</span>
      <span class="pet-name">{{ currentPet.name }}</span>
    </div>
    <div v-else class="current-pet-bar empty">
      <span>请先在首页选择宠物</span>
    </div>

    <!-- 打卡类型选择网格 -->
    <div class="type-grid">
      <div
        v-for="item in CHECKIN_TYPES"
        :key="item.value"
        class="type-item"
        :class="{ active: selectedType === item.value }"
        :style="{ '--type-color': item.color }"
        @click="selectType(item.value)"
      >
        <span class="type-emoji">{{ item.emoji }}</span>
        <span class="type-label">{{ item.label }}</span>
      </div>
    </div>

    <!-- 动态表单区域 -->
    <div class="form-section">
      <div class="form-header">
        <span class="header-emoji">{{ activeTypeInfo.emoji }}</span>
        <span class="header-label">{{ activeTypeInfo.label }}打卡</span>
      </div>

      <!-- 动态字段 -->
      <div class="form-fields">
        <template v-for="field in fields" :key="field.name">
          <!-- Pick 选择器类型 -->
          <div
            v-if="field.type === 'picker'"
            class="form-field picker-field"
            @click="onFieldClick(field)"
          >
            <span class="field-label">{{ field.label }}</span>
            <span class="field-value" :class="{ placeholder: !formData[field.name] }">
              {{ formData[field.name] || '请选择' }}
            </span>
            <span class="field-arrow">›</span>
          </div>

          <!-- 数字输入 -->
          <van-field
            v-else-if="field.type === 'number'"
            :key="field.name + '_input'"
            v-model="formData[field.name]"
            :label="field.label"
            :placeholder="field.placeholder || ''"
            type="digit"
          />

          <!-- 文本输入 -->
          <van-field
            v-else
            :key="field.name + '_input'"
            v-model="formData[field.name]"
            :label="field.label"
            :placeholder="field.placeholder || ''"
            type="text"
          />
        </template>
      </div>

      <!-- 照片上传 -->
      <div class="photo-section">
        <span class="photo-label">📸 添加照片（可选）</span>
        <van-uploader
          v-model="photoList"
          :max-count="1"
          :after-read="afterRead"
          accept="image/*"
        />
      </div>

      <!-- 时间选择 -->
      <div class="time-row">
        <div class="time-item" @click="showDatePicker = true">
          <span class="time-label">📅 日期</span>
          <span class="time-value">{{ checkinDate }}</span>
        </div>
        <div class="time-item" @click="showTimePicker = true">
          <span class="time-label">🕐 时间</span>
          <span class="time-value">{{ checkinTime }}</span>
        </div>
      </div>

      <!-- 提交按钮 -->
      <van-button
        type="primary"
        block
        round
        :loading="submitting"
        loading-text="打卡中..."
        @click="onSubmit"
      >
        ✓ 保存打卡
      </van-button>
    </div>

    <!-- picker 弹窗 -->
    <van-popup v-model:show="showPicker" round position="bottom">
      <van-picker
        :columns="pickerOptions"
        @confirm="onPickerConfirm"
        @cancel="showPicker = false"
        value-key="label"
      />
    </van-popup>

    <!-- 日期选择器 -->
    <van-popup v-model:show="showDatePicker" round position="bottom">
      <van-date-picker
        :model-value="checkinDate.split('-')"
        @confirm="onDateConfirm"
        @cancel="showDatePicker = false"
      />
    </van-popup>

    <!-- 时间选择器 -->
    <van-popup v-model:show="showTimePicker" round position="bottom">
      <van-date-picker
        type="time"
        :model-value="checkinTime.split(':')"
        @confirm="onTimeConfirm"
        @cancel="showTimePicker = false"
      />
    </van-popup>
  </div>
</template>

<script lang="ts">
export default { name: 'CheckinIndex' }
</script>

<style lang="scss" scoped>
.checkin-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: env(safe-area-inset-bottom, 20px);
}

.current-pet-bar {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #ebedf0;
  font-size: 14px;

  .pet-emoji {
    font-size: 20px;
    margin-right: 6px;
  }

  .pet-name {
    font-weight: 600;
    color: #333;
  }

  &.empty {
    color: #999;
  }
}

// 类型选择网格
.type-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 12px 16px;
  background: #fff;
  margin-bottom: 8px;
}

.type-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 4px;
  border-radius: 10px;
  background: #f5f7fa;
  border: 2px solid transparent;
  transition: all 0.2s;
  cursor: pointer;

  .type-emoji {
    font-size: 24px;
    margin-bottom: 4px;
  }

  .type-label {
    font-size: 11px;
    color: #666;
  }

  &.active {
    border-color: var(--type-color);
    background: color-mix(in srgb, var(--type-color) 10%, #fff);
    .type-label {
      color: var(--type-color);
      font-weight: 600;
    }
  }
}

// 表单区域
.form-section {
  background: #fff;
  margin: 0 12px;
  border-radius: 12px;
  padding: 16px;
}

.form-header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ebedf0;
  padding-bottom: 12px;
  margin-bottom: 12px;

  .header-emoji {
    font-size: 22px;
    margin-right: 8px;
  }

  .header-label {
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }
}

.form-fields {
  :deep(.van-field) {
    background: #f9fafb;
    border-radius: 8px;
    margin-bottom: 8px;
  }
}

.picker-field {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;

  .field-label {
    font-size: 14px;
    color: #333;
    flex-shrink: 0;
    margin-right: 12px;
  }

  .field-value {
    flex: 1;
    text-align: right;
    color: #333;
    font-size: 14px;

    &.placeholder {
      color: #c8c9cc;
    }
  }

  .field-arrow {
    font-size: 18px;
    color: #c8c9cc;
    margin-left: 8px;
  }
}

.photo-section {
  margin: 12px 0;

  .photo-label {
    font-size: 13px;
    color: #666;
    display: block;
    margin-bottom: 8px;
  }
}

.time-row {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;

  .time-item {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 12px;
    background: #f9fafb;
    border-radius: 8px;
    cursor: pointer;

    .time-label {
      font-size: 13px;
      color: #666;
      margin-right: 6px;
    }

    .time-value {
      font-size: 14px;
      color: #333;
      font-weight: 500;
    }
  }
}

:deep(.van-button--primary) {
  background: #4CAF50;
  border-color: #4CAF50;
  height: 44px;
  font-size: 16px;
}
</style>