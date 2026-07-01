<script setup lang="ts">
defineProps<{
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
  isTyping?: boolean
}>()
</script>

<template>
  <div class="bubble-wrapper" :class="`bubble-wrapper--${role}`">
    <div class="bubble" :class="`bubble--${role}`">
      <template v-if="role === 'assistant'">
        <div class="bubble__avatar">🤖</div>
      </template>
      <div class="bubble__content">
        <div class="bubble__text">{{ content }}</div>
        <div v-if="timestamp" class="bubble__time">{{ timestamp }}</div>
        <span v-if="isTyping" class="bubble__typing">
          <i></i><i></i><i></i>
        </span>
      </div>
      <template v-if="role === 'user'">
        <div class="bubble__avatar">👤</div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bubble-wrapper {
  display: flex;
  padding: 6px 16px;

  &--user { justify-content: flex-end; }
  &--assistant { justify-content: flex-start; }
}

.bubble {
  display: flex;
  gap: 8px;
  max-width: 80%;
  align-items: flex-end;

  &--user { flex-direction: row-reverse; }

  .bubble__avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--van-background-2);
    font-size: 18px;
    flex-shrink: 0;
  }

  .bubble__content {
    border-radius: 12px;
    padding: 10px 14px;
    font-size: 14px;
    line-height: 1.5;
  }

  &--user .bubble__content {
    background: var(--van-primary-color);
    color: #fff;
    border-bottom-right-radius: 4px;
  }

  &--assistant .bubble__content {
    background: var(--van-background-2);
    color: var(--van-text-color);
    border-bottom-left-radius: 4px;
  }

  .bubble__time {
    font-size: 11px;
    margin-top: 4px;
    opacity: 0.6;
    text-align: right;
  }

  .bubble__typing {
    display: inline-flex;
    gap: 3px;
    padding: 4px 0;

    i {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--van-text-color-2);
      animation: typingBounce 1.4s infinite ease-in-out both;

      &:nth-child(1) { animation-delay: 0s; }
      &:nth-child(2) { animation-delay: 0.2s; }
      &:nth-child(3) { animation-delay: 0.4s; }
    }
  }
}

@keyframes typingBounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}
</style>