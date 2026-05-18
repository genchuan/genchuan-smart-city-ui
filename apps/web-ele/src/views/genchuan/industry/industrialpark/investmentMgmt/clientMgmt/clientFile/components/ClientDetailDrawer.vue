<script setup>
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { ElTag } from 'element-plus';

import {
  getClientDemandTypeLabel,
  getClientIntentLevelLabel,
  getClientStatusLabel,
} from '../table/data';

const [Drawer, drawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  title: '客户详情',
});

const clientData = ref({});

/** 打开详情抽屉 */
function open(data) {
  clientData.value = data || {};
  drawerApi.setData(data).open();
}

/** 点击意向场地 - 跳转场地详情弹窗（预留接口） */
const handleIntentSiteClick = () => {
  if (clientData.value.intentSiteId) {
    console.log('跳转场地详情:', clientData.value.intentSiteId);
    // TODO: 调用场地详情弹窗
    // emit('intentSiteClick', clientData.value.intentSiteId);
  }
};

/** 点击跟进记录 - 跳转跟踪明细弹窗（预留接口） */
const handleTrackRecordClick = () => {
  if (clientData.value.trackRecord) {
    console.log('查看跟踪明细:', clientData.value.id);
    // TODO: 调用跟踪明细弹窗
    // emit('trackRecordClick', clientData.value.id);
  }
};

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
            <span class="detail-value">{{ clientData.id }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">客户姓名：</span>
            <span class="detail-value">{{ clientData.clientName }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">企业名称：</span>
            <span class="detail-value">{{ clientData.clientCompany || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">需求类型：</span>
            <span class="detail-value">
              {{ getClientDemandTypeLabel(clientData.demandType) }}
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">意向程度：</span>
            <span class="detail-value">
              {{ getClientIntentLevelLabel(clientData.intentLevel) }}
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">客户状态：</span>
            <span class="detail-value">
              <el-tag size="small" type="success">
                {{ getClientStatusLabel(clientData.clientStatus) }}
              </el-tag>
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">意向场地：</span>
            <span class="detail-value">
              {{ clientData.intentSiteName || '-' }}
              <el-button
                v-if="clientData.intentSiteId"
                type="primary"
                link
                size="small"
                @click="handleIntentSiteClick"
              >
                查看场地详情
              </el-button>
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">操作人：</span>
            <span class="detail-value">{{ clientData.handleUser || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">创建人：</span>
            <span class="detail-value">{{ clientData.creator || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">创建时间：</span>
            <span class="detail-value">{{ clientData._createTimeFormatted || '-' }}</span>
          </div>
        </div>
      </div>

      <!-- 卡片2：跟进记录 -->
      <div class="detail-card" v-if="clientData.trackRecord">
        <h4 class="section-title">📝 跟进记录</h4>
        <div class="policy-content">
          {{ clientData.trackRecord }}
        </div>
        <el-button
          type="primary"
          link
          size="small"
          style="margin-top: 8px;"
          @click="handleTrackRecordClick"
        >
          查看跟踪明细
        </el-button>
      </div>

      <!-- 卡片3：转化结果 -->
      <div class="detail-card" v-if="clientData.transformResult">
        <h4 class="section-title">✅ 转化结果</h4>
        <div class="policy-content">
          {{ clientData.transformResult }}
        </div>
      </div>

      <!-- 卡片4：系统信息 -->
      <div class="detail-card">
        <h4 class="section-title">系统信息</h4>
        <div class="detail-content">
          <div class="detail-item">
            <span class="detail-label">创建时间：</span>
            <span class="detail-value">{{ clientData._createTimeFormatted || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">更新时间：</span>
            <span class="detail-value">{{ clientData._updateTimeFormatted || '-' }}</span>
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
  overflow-y: auto;
  padding: 0;
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
  width: 100px;
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-regular, #606266);
  text-align: right;
  flex-shrink: 0;
}

.detail-value {
  flex: 1;
  font-size: 14px;
  color: var(--el-text-color-primary, #303133);
  text-align: left;
  word-break: break-all;
}

.section-title {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.policy-content {
  padding: 12px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--el-text-color-primary, #303133);
  background-color: #f5f7fa;
  border-radius: 4px;
  word-break: break-all;
  white-space: pre-wrap;
}
</style>
