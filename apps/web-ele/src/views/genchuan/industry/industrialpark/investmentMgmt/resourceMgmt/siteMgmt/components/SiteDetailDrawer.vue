<script setup>
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { ElImage, ElTag } from 'element-plus';
import { DICT_TYPE } from '@vben/constants';
import { getDictObj} from '@vben/hooks';
import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';

import { getSiteStatusConfig, getSiteStatusTagType } from '../table/data';

const [Drawer, drawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  title: '场地详情',
});

const siteData = ref({});

/** 打开详情抽屉 */
function open(row) {
  if (row) {
    siteData.value = row;
    drawerApi.open();
  }
}

defineExpose({ open });
</script>

<template>
  <Drawer>
    <div class="detail-container">
      <!-- 基础信息卡片 -->
      <div class="detail-card">
        <div class="detail-content">
          <div class="detail-item">
            <span class="detail-label">场地编号：</span>
            <span class="detail-value">{{ siteData.siteCode }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">场地位置：</span>
            <span class="detail-value">{{ siteData.siteLocation }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">场地面积(㎡)：</span>
            <span class="detail-value">{{ siteData.siteArea }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">租金信息：</span>
            <span class="detail-value">{{ siteData.rentInfo }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">配套设施：</span>
            <span class="detail-value">{{ siteData.facility }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">场地状态：</span>
            <span class="detail-value">
              <el-tag :type="getSiteStatusTagType(siteData.siteStatus)">
                {{ getSiteStatusConfig(siteData.siteStatus).label }}
              </el-tag>
            </span>
          </div>
          <div class="detail-item" v-if="siteData.siteStatus === 1 || siteData.siteStatus === 2">
            <span class="detail-label">预约客户：</span>
            <span class="detail-value">{{ siteData.orderClientName || '-' }}</span>
          </div>
          <div class="detail-item" v-if="siteData.siteStatus === 2">
            <span class="detail-label">签约企业：</span>
            <span class="detail-value">{{ siteData.signCompanyName || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">操作人：</span>
            <span class="detail-value">{{ siteData.handleUserName || '-' }}</span>
          </div>
        </div>
      </div>

      <!-- 照片和平面图卡片 -->
      <div class="detail-card" v-if="siteData.photos || siteData.floorPlan">
        <!-- 照片展示 -->
        <div v-if="siteData.photos" style="margin-bottom: 16px;">
          <h4 class="section-title">照片</h4>
          <div class="image-gallery">
            <ElImage
              v-for="(photo, index) in siteData.photos.split(',')"
              :key="index"
              :src="photo"
              :preview-src-list="siteData.photos.split(',')"
              :initial-index="index"
              fit="cover"
              class="gallery-image"
              :z-index="3000"
            />
          </div>
        </div>

        <!-- 平面图 -->
        <div v-if="siteData.floorPlan">
          <h4 class="section-title">平面图</h4>
          <div class="floor-plan-container">
            <ElImage
              :src="siteData.floorPlan"
              :preview-src-list="[siteData.floorPlan]"
              fit="contain"
              class="floor-plan-image"
              :z-index="3000"
            />
          </div>
        </div>
      </div>

      <!-- 系统信息卡片（可选显示） -->
      <div class="detail-card">
        <div class="detail-content">
          <div class="detail-item">
            <span class="detail-label">创建人：</span>
            <span class="detail-value">{{ siteData.creator }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">创建时间：</span>
            <span class="detail-value">{{ siteData._createTimeFormatted || siteData.createTime }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">更新时间：</span>
            <span class="detail-value">{{ siteData._updateTimeFormatted || siteData.updateTime }}</span>
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
  width: 120px;
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

.image-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}

.gallery-image {
  width: 100%;
  height: 150px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #dcdfe6;
}

.gallery-image:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.floor-plan-container {
  display: flex;
  justify-content: center;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.floor-plan-image {
  max-width: 100%;
  max-height: 400px;
  cursor: pointer;
  border-radius: 4px;
}
</style>
