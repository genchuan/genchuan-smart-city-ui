<script setup>
defineProps({
  title: String,
  withBackground: {
    type: Boolean,
    default: true,
  },
  withPadding: {
    type: Boolean,
    default: true,
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div
    class="report-section"
    :class="{ 'with-background': withBackground, 'with-padding': withPadding }"
  >
    <div v-if="title || $slots.actions" class="section-header">
      <h3 v-if="title" class="section-title">{{ title }}</h3>
      <div v-if="$slots.actions" class="section-actions">
        <slot name="actions"></slot>
      </div>
    </div>

    <div class="section-content">
      <slot></slot>
    </div>

    <div v-if="$slots.footer" class="section-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<style scoped>
.report-section {
  margin-bottom: 12px;
}

.report-section.with-background {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgb(0 0 0 / 10%);
}

.report-section.with-padding {
  padding: 12px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.section-content {
  width: 100%;
}

.section-footer {
  padding-top: 10px;
  margin-top: 10px;
  border-top: 1px solid #ebeef5;
}
</style>
