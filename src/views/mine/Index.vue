<template>
  <div class="mine-page">
    <!-- 用户信息卡片 -->
    <div class="user-card" @click="router.push('/mine/settings')">
      <van-image
        round
        width="60"
        height="60"
        fit="cover"
        :src="authStore.user?.avatarUrl || defaultAvatar"
      />
      <div class="user-info">
        <div class="user-name">{{ authStore.user?.nickname || '点击设置昵称' }}</div>
        <div class="user-phone">{{ maskPhone(authStore.user?.phone || '') }}</div>
      </div>
      <van-icon name="arrow" size="18" color="#c8c9cc" />
    </div>

    <!-- 会员卡片 -->
    <div class="member-card" @click="router.push('/member')">
      <div class="member-card-left">
        <span class="member-icon">👑</span>
        <span class="member-text">{{ memberStore.isMember ? '尊享会员' : '免费用户' }}</span>
      </div>
      <div class="member-card-right">
        <span v-if="memberStore.isMember" class="member-expire">有效期至 {{ memberStore.memberExpireAt }}</span>
        <span v-else class="member-upgrade">开通会员 →</span>
      </div>
    </div>

    <!-- 菜单列表 -->
    <van-cell-group inset>
      <van-cell
        title="我的宠物"
        icon="label-o"
        is-link
        :value="`${petStore.pets.length} 只`"
        @click="router.push('/pet/list')"
      />
      <van-cell
        title="打卡记录"
        icon="todo-list-o"
        is-link
        :value="`${checkinStore.checkins.length} 次`"
        @click="router.push('/checkin/calendar')"
      />
      <van-cell
        title="AI 问答历史"
        icon="chat-o"
        is-link
        @click="router.push('/ai/history')"
      />
      <van-cell
        title="我的收藏"
        icon="star-o"
        is-link
        :value="'0 条'"
      />
    </van-cell-group>

    <van-cell-group inset style="margin-top: 12px">
      <van-cell
        title="会员中心"
        icon="vip-card-o"
        is-link
        @click="router.push('/member')"
      />
      <van-cell
        title="设置"
        icon="setting-o"
        is-link
        @click="router.push('/mine/settings')"
      />
    </van-cell-group>

    <!-- 退出登录 -->
    <div class="logout-wrap">
      <van-button plain hairline type="danger" block round @click="handleLogout">
        退出登录
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { showDialog } from 'vant'
import { useAuthStore } from '@/stores/useAuthStore'
import { usePetStore } from '@/stores/usePetStore'
import { useMemberStore } from '@/stores/useMemberStore'
import { useCheckinStore } from '@/stores/useCheckinStore'

const router = useRouter()
const authStore = useAuthStore()
const petStore = usePetStore()
const memberStore = useMemberStore()
const checkinStore = useCheckinStore()

const defaultAvatar = 'https://picsum.photos/200/200?random=99'

function maskPhone(phone: string) {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

async function handleLogout() {
  try {
    await showDialog({
      title: '提示',
      message: '确定要退出登录吗？'
    })
    authStore.logout()
    router.push('/login')
  } catch {
    // cancelled
  }
}
</script>

<style scoped lang="scss">
.mine-page {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 50px;
}

.user-card {
  display: flex;
  align-items: center;
  padding: 20px 16px;
  background: #fff;
  gap: 12px;
  margin-bottom: 8px;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  color: #323233;
}

.user-phone {
  font-size: 13px;
  color: #969799;
  margin-top: 4px;
}

.member-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, #ffe066, #ffd43b);
  margin-bottom: 12px;
  margin: 0 8px 12px;
  border-radius: 12px;
}

.member-card-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.member-icon {
  font-size: 20px;
}

.member-text {
  font-size: 15px;
  font-weight: 600;
  color: #323233;
}

.member-card-right {
  font-size: 12px;
  color: #646566;
}

.member-upgrade {
  color: #ee0a24;
  font-weight: 500;
}

.logout-wrap {
  padding: 40px 16px;
}
</style>