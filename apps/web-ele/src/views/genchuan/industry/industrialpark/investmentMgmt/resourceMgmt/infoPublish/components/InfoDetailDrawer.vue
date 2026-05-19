<script setup>
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { ElTag } from 'element-plus';

import { getInfoStatusLabel, getInfoStatusTagType } from '../table/data';

const [Drawer, drawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  title: '信息详情',
});

const infoData = ref({});

/** 打开详情抽屉 */
function open(row) {
  if (row) {
    infoData.value = row;
    drawerApi.open();
  }
}

defineExpose({ open });
</script>

<template>
  <Drawer>
    <div class="detail-container">
      <!-- 卡片1：基础信息 -->
      <div class="detail-card">
        <div class="detail-content">
          <div class="detail-item">
            <span class="detail-label">ID：</span>
            <span class="detail-value">{{ infoData.id }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">信息标题：</span>
            <span class="detail-value">{{ infoData.infoTitle }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">信息类型：</span>
            <span class="detail-value">{{ infoData.infoType }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">发布时间：</span>
            <span class="detail-value">{{
              infoData._publishTimeFormatted || '-'
            }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">咨询数：</span>
            <span class="detail-value">{{ infoData.consultCount }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">响应率：</span>
            <span class="detail-value">{{ infoData.responseRate }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">信息状态：</span>
            <span class="detail-value">
              <ElTag :type="getInfoStatusTagType(infoData.infoStatus)">
                {{ getInfoStatusLabel(infoData.infoStatus) }}
              </ElTag>
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">政策配置：</span>
            <span class="detail-value">{{ infoData.policyConfig || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">响应人：</span>
            <span class="detail-value">{{ infoData.responseUser || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">操作人：</span>
            <span class="detail-value">{{
              infoData.handleUserName || '-'
            }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">创建人：</span>
            <span class="detail-value">{{ infoData.creator }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">创建时间：</span>
            <span class="detail-value">{{
              infoData._createTimeFormatted || infoData.createTime
            }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">更新时间：</span>
            <span class="detail-value">{{
              infoData._updateTimeFormatted || infoData.updateTime
            }}</span>
          </div>
        </div>
      </div>

      <!-- 卡片2：政策配置详情 -->
      <div class="detail-card" v-if="infoData.policyConfig">
        <h4 class="section-title">政策配置详情</h4>
        <div class="policy-content">
          {{ infoData.policyConfig }}
        </div>
      </div>

      <!-- 卡片3：系统信息 -->
      <div class="detail-card">
        <h4 class="section-title">系统信息</h4>
        <div class="detail-content">
          <div class="detail-item">
            <span class="detail-label">创建时间：</span>
            <span class="detail-value">{{
              infoData._createTimeFormatted || infoData.createTime
            }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">更新时间：</span>
            <span class="detail-value">{{
              infoData._updateTimeFormatted || infoData.updateTime
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </Drawer>
</template>

<style scoped>
.detail-container {
  box-sizing: border-box;
  height: 100%;
  padding: 0;
  overflow-y: auto;
}

.detail-card {
  padding: 16px;
  margin-bottom: 12px;
  background-color: var(--el-bg-color, #fff);
  border: 1px solid var(--el-border-color-light, #ebeef5);
  border-radius: 4px;
  box-shadow: 0 1px 4px 0 rgb(0 0 0 / 8%);
}

.detail-card + .detail-card {
  margin-top: 12px;
}

.detail-content {
  display: flex;
  flex-direction: column;
}

.detail-item {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 4px 0;
}

.detail-label {
  flex-shrink: 0;
  width: 120px;
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-regular, #606266);
  text-align: right;
}

.detail-value {
  flex: 1;
  font-size: 14px;
  color: var(--el-text-color-primary, #303133);
  text-align: left;
  word-break: break-all;
}

.section-title {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.policy-content {
  padding: 12px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--el-text-color-primary, #303133);
  word-break: break-all;
  white-space: pre-wrap;
  background-color: #f5f7fa;
  border-radius: 4px;
}
</style>
