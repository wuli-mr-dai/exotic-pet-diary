<script setup lang="ts">
defineProps<{
  questions: string[]
  species?: string
}>()

defineEmits<{
  click: [question: string]
}>()
</script>

<template>
  <div class="quick-questions">
    <div class="quick-questions__title">💡 快捷提问</div>
    <div class="quick-questions__tags">
      <span
        v-for="q in questions"
        :key="q"
        class="quick-tag"
        @click="$emit('click', q)"
      >{{ q }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.quick-questions {
  padding: 8px 16px 12px;
}

.quick-questions__title {
  font-size: 13px;
  color: var(--van-text-color-2);
  margin-bottom: 8px;
}

.quick-questions__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.quick-tag {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 16px;
  background: var(--van-background-2);
  font-size: 13px;
  color: var(--van-text-color);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;

  &:active {
    background: var(--van-primary-color);
    color: #fff;
  }
}
</style>