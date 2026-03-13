<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性（燃气管网监测数据）
const props = defineProps({
  // 详情数据对象（燃气管网监测数据）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用详情对象的pipeRoad）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题，优先用管网路段，兜底显示默认值
const drawerTitle = computed(() => {
  const pipeRoad = detailObj.value?.pipeRoad || '燃气管网监测';
  return title.value || `${pipeRoad}详情`;
});

// 初始化抽屉实例（加宽适配燃气管网监测更多字段）
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 850, // 加宽到850px适配燃气管网监测字段
  onCancel() {
    detailDrawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});

// 对外暴露打开/关闭抽屉的方法
defineExpose({
  open: () => detailDrawerApi.open(),
  close: () => detailDrawerApi.close(),
});
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <!-- 燃气管网监测基础信息 -->
      <div class="detail-card-row">
        <div class="detail-row-left">管网路段:</div>
        <div class="detail-row-right">
          {{ detailObj.pipeRoad || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">所属区域:</div>
        <div class="detail-row-right">
          {{ detailObj.areaName || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">管网压力:</div>
        <div class="detail-row-right">
          {{ detailObj.pipePressure || '-' }} MPa
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">燃气浓度:</div>
        <div class="detail-row-right">
          {{ detailObj.gasConcentration || '-' }} %
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">监测设备编号:</div>
        <div class="detail-row-right">
          {{ detailObj.deviceCode || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">设备在线状态:</div>
        <div class="detail-row-right">
          {{ detailObj.deviceStatus || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">负责运维员:</div>
        <div class="detail-row-right">
          {{ detailObj.staffName || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">数据采集频率:</div>
        <div class="detail-row-right">
          {{ detailObj.collectFrequency || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">数据同步时长:</div>
        <div class="detail-row-right">
          {{ detailObj.syncDuration || '-' }} 秒
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">监测状态:</div>
        <div class="detail-row-right">{{ detailObj.monitorStatus || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">指标阈值范围:</div>
        <div class="detail-row-right">
          {{ detailObj.indexThresholdRange || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">最近数据更新时间:</div>
        <div class="detail-row-right">
          {{ detailObj.updateTime || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">分级预警规则匹配结果:</div>
        <div class="detail-row-right">
          <span
            :class="{
              'text-green-600': detailObj.warnLevelRule === 'Ⅰ级',
              'text-yellow-600': detailObj.warnLevelRule === 'Ⅱ级',
              'text-red-600': detailObj.warnLevelRule === 'Ⅲ级',
            }"
          >
            {{ detailObj.warnLevelRule || '-' }}
          </span>
        </div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 140px; // 小屏适配"预警等级阈值"等长标签
  }

  .detail-card {
    min-height: 600px;
    max-height: 80vh;
    padding: 15px;
  }
}

.detail-card {
  min-height: 650px; // 适配14个桥梁监测字段
  max-height: 85vh; // 提高最大高度，容纳更多内容
  padding: 20px;
  overflow-y: auto; // 内容过多时显示滚动条
  background-color: #f9fafb;
  border-radius: 8px;
}

// 每行的布局
.detail-card-row {
  display: flex;
  align-items: flex-start; // 顶部对齐，适配多行文本
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0; // 分隔线增强可读性

  // 最后一行去掉分隔线
  &:last-child {
    border-bottom: none;
  }

  // 鼠标悬浮高亮
  &:hover {
    padding-right: 8px;
    padding-left: 8px;
    margin-right: -8px;
    margin-left: -8px;
    background-color: #f5f7fa;
    border-radius: 4px;
    transition: all 0.2s ease;
  }
}

// 左侧标签样式
.detail-row-left {
  flex-shrink: 0; // 不收缩
  width: 160px; // 加宽到160px，适配"预警等级阈值"等超长标签
  font-size: 14px;
  font-weight: 500; // 加粗突出标签
  line-height: 18px; // 统一行高
  color: #606266; // 灰色调，区分内容
}

// 右侧内容样式
.detail-row-right {
  flex: 1; // 剩余宽度自适应
  padding-right: 10px;
  font-size: 14px;
  line-height: 18px;
  color: #303133; // 主文本色
  word-break: break-all; // 处理长文本换行（如指标阈值范围）
}

// 预警等级颜色样式
.text-green-600 {
  color: #10b981 !important; // Ⅰ级（正常）-绿色
}

.text-yellow-600 {
  color: #f59e0b !important; // Ⅱ级（注意）-黄色
}

.text-red-600 {
  color: #ef4444 !important; // Ⅲ级（危险）-红色
}

// 滚动条样式优化
.detail-card::-webkit-scrollbar {
  width: 6px;
}

.detail-card::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.detail-card::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 3px;
}

.detail-card::-webkit-scrollbar-thumb:hover {
  background: #c0c4cc;
}
</style>
