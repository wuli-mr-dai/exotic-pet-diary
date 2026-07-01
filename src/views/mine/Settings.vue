<template>
  <div class="settings-page">
    <van-nav-bar title="设置" left-arrow fixed placeholder @click-left="router.back" />

    <van-cell-group inset>
      <van-cell title="个人资料" is-link @click="showProfileEdit = true" />
    </van-cell-group>

    <van-cell-group inset style="margin-top: 12px">
      <van-cell title="通知设置" is-link />
      <van-cell title="提醒设置" is-link />
      <van-cell title="隐私设置" is-link />
    </van-cell-group>

    <van-cell-group inset style="margin-top: 12px">
      <van-cell title="关于我们" is-link />
      <van-cell title="用户协议" is-link />
      <van-cell title="隐私政策" is-link />
    </van-cell-group>

    <van-cell-group inset style="margin-top: 12px">
      <van-cell title="清除缓存" is-link @click="handleClearCache" />
      <van-cell title="当前版本" value="v1.0.0 MVP" />
    </van-cell-group>

    <!-- 编辑资料弹窗 -->
    <van-popup v-model:show="showProfileEdit" position="bottom" round :style="{ height: '50%' }">
      <div class="profile-edit">
        <h3>编辑个人资料</h3>
        <van-form @submit="saveProfile">
          <van-field
            v-model="profileForm.nickname"
            label="昵称"
            placeholder="请输入昵称"
            maxlength="20"
            :rules="[{ required: true, message: '请输入昵称' }]"
          />
          <van-field
            v-model="profileForm.avatarUrl"
            label="头像链接"
            placeholder="输入头像图片链接"
          />
          <van-field name="avatar" label="本地上传">
            <template #input>
              <van-uploader
                v-model="uploaderList"
                :max-count="1"
                accept="image/*"
                :after-read="onAvatarRead"
              />
            </template>
          </van-field>
          <div style="margin: 16px">
            <van-button block type="primary" native-type="submit">保存</van-button>
          </div>
        </van-form>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showSuccessToast, showDialog, showToast } from 'vant'
import { useAuthStore } from '@/stores/useAuthStore'

const router = useRouter()
const authStore = useAuthStore()

const showProfileEdit = ref(false)
const uploaderList = ref<any[]>([])

const profileForm = reactive({
  nickname: authStore.user?.nickname || '',
  avatarUrl: authStore.user?.avatarUrl || ''
})

function onAvatarRead(file: any) {
  profileForm.avatarUrl = file.content || file.url || ''
}

function saveProfile() {
  if (authStore.user) {
    authStore.user.nickname = profileForm.nickname
    authStore.user.avatarUrl = profileForm.avatarUrl
  }
  showProfileEdit.value = false
  showSuccessToast('保存成功')
}

async function handleClearCache() {
  try {
    await showDialog({
      title: '清除缓存',
      message: '确定要清除所有缓存数据吗？'
    })
    showToast('已清除')
  } catch {
    // cancelled
  }
}
</script>

<style scoped lang="scss">
.settings-page {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 30px;
}

.profile-edit {
  padding: 20px 0;

  h3 {
    text-align: center;
    font-size: 18px;
    margin: 0 0 12px;
  }
}
</style>