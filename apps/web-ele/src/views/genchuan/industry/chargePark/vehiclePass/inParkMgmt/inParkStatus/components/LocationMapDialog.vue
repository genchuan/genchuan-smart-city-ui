<script setup>
import { ref, computed } from 'vue';
import Map from '#/genchuan-components/Map/index.vue';

const dialogVisible = ref(false);
const currentData = ref(null);

const mapData = computed(() => {
  if (!currentData.value) return [];

  const lon = currentData.value.lon || 117.6589;
  const lat = currentData.value.lat || 24.5123;

  return [{
    id: currentData.value.id,
    locationName: `${currentData.value.carNo} - ${currentData.value.spaceName}`,
    coordinate: `${lon},${lat}`,
    statusName: currentData.value.status,
    spaceName: currentData.value.spaceName,
    stationName: currentData.value.stationName,
    carNo: currentData.value.carNo,
  }];
});

const markerIcons = {
  normal: '/static/imgs/dataHub/map/marker-blue.png',
  warning: '/static/imgs/dataHub/map/marker-orange.png',
  danger: '/static/imgs/dataHub/map/marker-red.png',
};

const statusIconMap = {
  green: 'normal',
  orange: 'warning',
  red: 'danger',
};

const statusKeyMap = {
  '正常在停': 'green',
  '超时长在停': 'orange',
  '异常状态': 'red',
};

const infoWindowConfig = {
  title: 'locationName',
  fields: [
    { key: 'carNo', label: '车牌号', bold: true },
    { key: 'spaceName', label: '车位名称' },
    { key: 'stationName', label: '场站名称' },
    { key: 'statusName', label: '状态', bold: true },
  ],
};

const open = (data) => {
  currentData.value = data;
  dialogVisible.value = true;
};

const close = () => {
  dialogVisible.value = false;
  currentData.value = null;
};

defineExpose({
  open,
  close,
});
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="`车辆定位 - ${currentData?.carNo || ''}`"
    width="900px"
    :close-on-click-modal="false"
  >
    <div class="location-map-container">
      <div class="map-info">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="车牌号">
            {{ currentData?.carNo }}
          </el-descriptions-item>
          <el-descriptions-item label="车位名称">
            {{ currentData?.spaceName }}
          </el-descriptions-item>
          <el-descriptions-item label="场站名称">
            {{ currentData?.stationName }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="statusKeyMap[currentData?.status] === 'green' ? 'success' : statusKeyMap[currentData?.status] === 'orange' ? 'warning' : 'danger'">
              {{ currentData?.status }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="map-wrapper">
        <Map
          :data="mapData"
          :marker-icons="markerIcons"
          :status-icon-map="statusIconMap"
          :status-key-map="statusKeyMap"
          :info-window-config="infoWindowConfig"
          :locate-focus-key="1"
        />
      </div>
    </div>
    <template #footer>
      <el-button @click="close">关闭</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.location-map-container {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .map-info {
    padding: 12px;
    background-color: hsl(var(--muted));
    border-radius: 8px;
  }

  .map-wrapper {
    min-height: 500px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
  }
}
</style>
