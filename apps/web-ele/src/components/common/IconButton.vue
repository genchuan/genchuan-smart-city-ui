<script setup>
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

// 定义组件 Props
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    default: '新增',
  },
  placement: {
    type: String,
    default: 'top',
  },
  iconName: {
    type: String,
    default: 'Plus',
  },
  color: {
    type: String,
    default: 'rgb(0, 107, 230)',
  },
  type: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
// 方式1：JS 形式声明自定义事件（无类型标注）
const emit = defineEmits(['click']);

// 手动触发自定义点击事件
const handleManualClick = (obj) => {
  // 触发自定义事件，可携带参数
  emit('click', obj);
};

// 获取图标组件
const iconComponent = () => {
  return ElementPlusIconsVue[props.iconName] || ElementPlusIconsVue.Plus;
};
</script>
<template>
  <el-popover
    :title="props.title"
    :content="props.content"
    :placement="props.placement"
  >
    <template #reference>
      <el-button
        :type="props.type"
        :disabled="props.disabled"
        class="genchuan-common-button"
        :class="props.disabled ? 'genchuan-common-disabled' : ''"
        @click="handleManualClick"
      >
        <el-icon
          class="common-icon"
          :color="props.disabled ? 'rgb(211, 210, 210)' : props.color"
        >
          <component
            :is="iconComponent()"
            :color="props.disabled ? 'rgb(211, 210, 210)' : props.color"
          />
        </el-icon>
      </el-button>
    </template>
  </el-popover>
</template>
<style lang="scss">
.genchuan-common-button {
  padding: 5px;
  border: none;
}
.genchuan-common-button:hover {
  border: none;
}
.vxe-tools--operate {
  .vxe-button.size--small.type--button.is--circle {
    border: none;
    .vxe-button--item:last-child {
      color: rgb(0, 107, 230);
    }
  }
}
.common-icon {
  width: 20px;
  height: 20px;
  cursor: pointer;
  padding: 2px;
}
.genchuan-common-disabled {
  .common-icon {
    cursor: not-allowed;
  }
}
.genchuan-common-disabled:hover {
  .common-icon {
    cursor: not-allowed;
  }
}
</style>
