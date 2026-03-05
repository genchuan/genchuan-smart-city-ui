<!-- detail.vue -->
<script setup>
import { defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性
const props = defineProps({
  // 详情数据对象
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用详情对象的taskName）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 初始化抽屉实例
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    detailDrawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});

// 对外暴露打开抽屉的方法
defineExpose({
  open: () => detailDrawerApi.open(),
  close: () => detailDrawerApi.close(),
});
</script>

<template>
  <DetailDrawer :title="title || `设备运行详情 - ${detailObj.areaName} ${detailObj.deviceType}`">
    <div class="detail-card">
      <div class="detail-card-row">
        <div class="detail-row-left">统计日期:</div>
        <div class="detail-row-right">{{ detailObj.statDate }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">行政区域:</div>
        <div class="detail-row-right">
          <el-tag type="primary" size="small">
            {{ detailObj.areaName }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">设备类型:</div>
        <div class="detail-row-right">
          <el-tag
            :type="detailObj.deviceType === '摄像头' ? 'success' :
                   detailObj.deviceType === '道闸' ? 'primary' :
                   detailObj.deviceType === '地磁' ? 'warning' :
                   detailObj.deviceType === '充电桩' ? 'info' : ''"
            size="small"
          >
            {{ detailObj.deviceType }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">运行状态:</div>
        <div class="detail-row-right">
          <el-tag
            :type="detailObj.status === '在线' ? 'success' :
                   detailObj.status === '离线' ? 'danger' :
                   detailObj.status === '故障' ? 'warning' :
                   detailObj.status === '维护中' ? 'primary' : 'info'"
            size="small"
          >
            {{ detailObj.status }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">总设备数:</div>
        <div class="detail-row-right">
          <el-tag type="primary" size="small">
            {{ detailObj.totalDevice }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">在线设备数:</div>
        <div class="detail-row-right">
          <el-tag type="success" size="small">
            {{ detailObj.onlineDevice }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">正常运行数:</div>
        <div class="detail-row-right">
          <el-tag type="success" size="small">
            {{ detailObj.normalDevice }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">离线设备数:</div>
        <div class="detail-row-right">
          <el-tag type="danger" size="small">
            {{ detailObj.offlineDevice }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">故障设备数:</div>
        <div class="detail-row-right">
          <el-tag type="warning" size="small">
            {{ detailObj.faultDevice }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">在线率:</div>
        <div class="detail-row-right">
          <el-tag
            :type="parseFloat(detailObj.onlineRate) > 95 ? 'success' :
                   parseFloat(detailObj.onlineRate) > 90 ? 'primary' :
                   parseFloat(detailObj.onlineRate) > 85 ? 'warning' : 'danger'"
            size="small"
          >
            {{ detailObj.onlineRate }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">正常率:</div>
        <div class="detail-row-right">
          <el-tag
            :type="parseFloat(detailObj.normalRate) > 95 ? 'success' :
                   parseFloat(detailObj.normalRate) > 90 ? 'primary' :
                   parseFloat(detailObj.normalRate) > 85 ? 'warning' : 'danger'"
            size="small"
          >
            {{ detailObj.normalRate }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">故障率:</div>
        <div class="detail-row-right">
          <el-tag
            :type="parseFloat(detailObj.faultRate) < 1 ? 'success' :
                   parseFloat(detailObj.faultRate) < 2 ? 'primary' :
                   parseFloat(detailObj.faultRate) < 3 ? 'warning' : 'danger'"
            size="small"
          >
            {{ detailObj.faultRate }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">更新时间:</div>
        <div class="detail-row-right">{{ detailObj.updateTime }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">操作人:</div>
        <div class="detail-row-right">{{ detailObj.operator }}</div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
// 详情卡片整体样式
.detail-card {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  min-height: 300px; // 保证最小高度，避免内容过少时样式塌陷
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
    background-color: #f5f7fa;
    border-radius: 4px;
    padding-left: 8px;
    padding-right: 8px;
    margin-left: -8px;
    margin-right: -8px;
    transition: all 0.2s ease;
  }
}

// 左侧标签样式
.detail-row-left {
  width: 120px; // 固定宽度，保证对齐
  flex-shrink: 0; // 不收缩
  font-weight: 500; // 加粗突出标签
  color: #606266; // 灰色调，区分内容
  font-size: 14px;
  line-height: 18px; // 统一行高
}

// 右侧内容样式
.detail-row-right {
  flex: 1; // 剩余宽度自适应
  color: #303133; // 主文本色
  font-size: 14px;
  line-height: 18px;
  word-break: break-all; // 处理长文本换行
  padding-right: 10px;

  // 空值样式区分
  &:empty::before {
    content: '-';
    color: #c0c4cc;
  }
}

// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 100px;
  }
}
</style>
