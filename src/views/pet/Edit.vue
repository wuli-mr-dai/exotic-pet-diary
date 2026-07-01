<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast, showDialog } from 'vant'
import { usePetStore } from '@/stores/usePetStore'
import { SPECIES_LIST } from '@/utils/constants'
import type { Species, Gender } from '@/types'

const router = useRouter()
const route = useRoute()
const petStore = usePetStore()

const petId = route.params.id as string
const pet = computed(() => petStore.pets.find(p => p.id === petId) ?? null)

const name = ref('')
const species = ref<Species>('hamster')
const breed = ref('')
const birthday = ref('')
const gender = ref<Gender>('unknown')
const avatarFiles = ref<any[]>([])
const loading = ref(false)
const pageLoading = ref(true)

const showSpeciesPicker = ref(false)
const showGenderPicker = ref(false)
const showBirthdayPicker = ref(false)
const currentDate = ref(new Date())

const selectedSpeciesInfo = computed(() =>
  SPECIES_LIST.find(s => s.value === species.value) ?? SPECIES_LIST[0]
)

const displayGender = computed(() => {
  const map: Record<Gender, string> = { male: '公', female: '母', unknown: '未知' }
  return map[gender.value]
})

const displayBirthday = computed(() => birthday.value || '请选择生日')

const genderOptions = [
  { text: '公', value: 'male' as Gender },
  { text: '母', value: 'female' as Gender },
  { text: '未知', value: 'unknown' as Gender }
]

onMounted(async () => {
  if (pet.value) {
    fillForm(pet.value)
    pageLoading.value = false
  } else {
    await petStore.fetchPets()
    if (pet.value) {
      fillForm(pet.value)
    }
    pageLoading.value = false
  }
})

function fillForm(p: typeof pet.value) {
  if (!p) return
  name.value = p.name
  species.value = p.species
  breed.value = p.breed ?? ''
  birthday.value = p.birthday ?? ''
  gender.value = p.gender ?? 'unknown'
  if (p.avatarUrl) {
    avatarFiles.value = [{ url: p.avatarUrl }]
  }
}

function onSpeciesSelect({ value }: { text: string; value: Species }) {
  species.value = value
  showSpeciesPicker.value = false
}

function onGenderSelect({ value }: { text: string; value: Gender }) {
  gender.value = value
  showGenderPicker.value = false
}

function onBirthdayConfirm({ selectedValues }: { selectedValues: string[] }) {
  birthday.value = selectedValues.join('-')
  showBirthdayPicker.value = false
}

async function handleSubmit() {
  if (!name.value.trim()) {
    showToast('请输入宠物名字')
    return
  }
  loading.value = true
  try {
    const avatar = avatarFiles.value.length > 0 ? avatarFiles.value[0].url || avatarFiles.value[0].content || '' : ''
    await petStore.updatePet(petId, {
      name: name.value.trim(),
      species: species.value,
      breed: breed.value.trim() || undefined,
      birthday: birthday.value || undefined,
      gender: gender.value,
      avatarUrl: avatar || undefined
    })
    showToast('保存成功')
    router.replace(`/pet/${petId}`)
  } catch {
    showToast('保存失败，请重试')
  } finally {
    loading.value = false
  }
}

async function handleDelete() {
  try {
    await showDialog({
      title: '确认删除',
      message: '删除后宠物档案将无法恢复，确定要删除吗？'
    })
    await petStore.deletePet(petId)
    router.replace('/pet/list')
  } catch {
    // 取消
  }
}
</script>

<template>
  <div class="edit-pet-page">
    <van-nav-bar
      title="编辑宠物"
      left-arrow
      @click-left="router.back"
      fixed
      placeholder
    />

    <van-loading v-if="pageLoading" class="loading-center" size="32" />

    <template v-else-if="pet">
      <div class="form-wrapper">
        <!-- 头像上传 -->
        <div class="avatar-section">
          <van-uploader
            v-model="avatarFiles"
            :max-count="1"
            :preview-full-image="true"
            accept="image/*"
          >
            <template #default>
              <div class="avatar-placeholder">
                <van-icon name="plus" size="24" />
                <span>更换头像</span>
              </div>
            </template>
          </van-uploader>
        </div>

        <!-- 宠物名字 -->
        <van-field
          v-model="name"
          label="宠物名字"
          placeholder="给你的小可爱起个名字"
          maxlength="20"
          :rules="[{ required: true, message: '请输入宠物名字' }]"
        />

        <!-- 品种选择 -->
        <van-field
          :model-value="selectedSpeciesInfo.emoji + ' ' + selectedSpeciesInfo.label"
          label="品种"
          readonly
          is-link
          placeholder="请选择品种"
          @click="showSpeciesPicker = true"
        />
        <van-popup v-model:show="showSpeciesPicker" round position="bottom">
          <van-picker
            :columns="SPECIES_LIST.map(s => ({ text: s.emoji + ' ' + s.label, value: s.value }))"
            :default-index="SPECIES_LIST.findIndex(s => s.value === species)"
            @confirm="onSpeciesSelect"
            @cancel="showSpeciesPicker = false"
          />
        </van-popup>

        <!-- 细分品种 -->
        <van-field
          v-model="breed"
          label="细分品种"
          placeholder="如：银狐仓鼠、垂耳兔（选填）"
          maxlength="30"
        />

        <!-- 性别选择 -->
        <van-field
          :model-value="displayGender"
          label="性别"
          readonly
          is-link
          placeholder="请选择性别"
          @click="showGenderPicker = true"
        />
        <van-popup v-model:show="showGenderPicker" round position="bottom">
          <van-picker
            :columns="genderOptions"
            :default-index="genderOptions.findIndex(g => g.value === gender)"
            @confirm="onGenderSelect"
            @cancel="showGenderPicker = false"
          />
        </van-popup>

        <!-- 生日选择 -->
        <van-field
          :model-value="displayBirthday"
          label="生日"
          readonly
          is-link
          placeholder="请选择生日"
          @click="showBirthdayPicker = true"
        />
        <van-popup v-model:show="showBirthdayPicker" round position="bottom">
          <van-datetime-picker
            v-model="currentDate"
            type="date"
            title="选择生日"
            :min-date="new Date(2000, 0, 1)"
            :max-date="new Date()"
            @confirm="onBirthdayConfirm"
            @cancel="showBirthdayPicker = false"
          />
        </van-popup>

        <!-- 提交按钮 -->
        <div class="submit-section">
          <van-button
            type="primary"
            block
            round
            :loading="loading"
            loading-text="保存中..."
            @click="handleSubmit"
          >
            保存修改
          </van-button>
          <van-button
            type="danger"
            block
            round
            plain
            style="margin-top: 24px"
            @click="handleDelete"
          >
            删除宠物
          </van-button>
        </div>
      </div>
    </template>

    <van-empty v-else image="search" description="宠物不存在" />
  </div>
</template>

<style scoped lang="scss">
.edit-pet-page {
  min-height: 100vh;
  background: var(--van-background-2);
}

.loading-center {
  display: flex;
  justify-content: center;
  padding-top: 100px;
}

.form-wrapper {
  padding: 16px 0;
}

.avatar-section {
  display: flex;
  justify-content: center;
  padding: 24px 0;

  .avatar-placeholder {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--van-background);
    border: 2px dashed var(--van-border-color);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--van-text-color-2);
    font-size: 12px;
    gap: 4px;
  }
}

.submit-section {
  padding: 32px 16px;
}
</style>