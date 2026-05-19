<script setup>
import { computed, onMounted, ref } from 'vue';

import { getSiteMgmtChart } from '#/api/genchuan/industry/industrialpark/investmentMgmt/resourceMgmt/siteMgmt';
import { dataList } from '../table/data';

import Map from '#/genchuan-components/Map/index.vue';

const props = defineProps({
  data: {
    type: Object,
    required: false,
    default: () => ({
      cards: [],
      siteMapList: [],
    }),
  },
});

const emit = defineEmits(['cardClick', 'markerClick', 'siteDetail']);

const statsData = ref({
  cards: [],
  siteMapList: [],
});

const mapData = ref([]);

/** 场地管理地图信息窗口配置（参照车位定位布局） */
const siteInfoWindowConfig = {
  title: 'siteCode',
  fields: [
    { key: 'siteCode', label: '场地编号' },
    { key: 'siteLocation', label: '场地位置' },
    { key: 'siteArea', label: '场地面积(㎡)' },
    { key: 'siteStatusName', label: '状态', bold: true },
    { key: 'rentInfo', label: '租金信息' },
  ],
};

/** 场地管理状态图标映射（0=空置blue, 1=洽谈orange, 2=已租green） */
const siteStatusKeyMap = {
  空置中: 'blue',
  洽谈中: 'orange',
  已出租: 'green',
};

const fetchStatsData = async () => {
  try {
    const response = await getSiteMgmtChart();
    const data = response?.data || response;

    if (data) {
      statsData.value.cards = [
        {
          title: '总场地数',
          value: data.totalCount || 0,
          color: '#4A90E2',
          type: 'totalCount',
        },
        {
          title: '空置数',
          value: data.emptyCount || 0,
          color: '#50E3C2',
          type: 'emptyCount',
        },
        {
          title: '洽谈数',
          value: data.talkCount || 0,
          color: '#FF9F40',
          type: 'talkCount',
        },
        {
          title: '已租数',
          value: data.rentedCount || 0,
          color: '#A17FE0',
          type: 'rentedCount',
        },
        {
          title: '空置率',
          value: `${((data.emptyRate || 0) * 100).toFixed(1)}%`,
          color: '#FF6B8B',
          type: 'emptyRate',
        },
      ];

      if (data.siteMapList && Array.isArray(data.siteMapList)) {
        mapData.value = data.siteMapList.map((item) => ({
          id: item.id,
          siteName: item.siteName || `场地${item.id}`,
          coordinate: `${item.lon},${item.lat}`,
          statusName: item.status,
          locationName: item.siteName || `场地${item.id}`,
          ...item,
        }));
      }
    } else {
      useMockData();
    }
  } catch (error) {
    console.error('获取统计数据失败:', error);
    useMockData();
  }
};

const useMockData = () => {
  statsData.value.cards = [
    { title: '总场地数', value: 56, color: '#4A90E2', type: 'totalCount' },
    { title: '空置数', value: 12, color: '#50E3C2', type: 'emptyCount' },
    { title: '洽谈数', value: 8, color: '#FF9F40', type: 'talkCount' },
    { title: '已租数', value: 36, color: '#A17FE0', type: 'rentedCount' },
    { title: '空置率', value: '21.4%', color: '#FF6B8B', type: 'emptyRate' },
  ];

/** 场地状态名称映射 */
const siteStatusNameMap = {
  0: '空置中',
  1: '洽谈中',
  2: '已出租',
};

  // 使用静态数据中的经纬度信息
  const staticList = dataList();
  mapData.value = staticList.map((item) => ({
    id: item.id,
    siteName: item.siteCode,
    coordinate: item.lngLat,
    statusName: siteStatusNameMap[item.siteStatus] || String(item.siteStatus),
    siteStatusName: siteStatusNameMap[item.siteStatus] || String(item.siteStatus),
    locationName: item.siteLocation,
    ...item,
  }));
};

const handleCardClick = (card) => {
  emit('cardClick', card.type);
};

/** 处理地图标记点击事件 - 打开场地详情 */
const handleMarkerClick = (markerData) => {
  emit('siteDetail', markerData);
};

onMounted(() => {
  fetchStatsData();
});
</script>

<template>
  <div class="site-mgmt-stats">
    <div class="stats-container">
      <div class="cards-area">
        <div
          v-for="(card, index) in statsData.cards"
          :key="`card-${index}`"
          class="stat-card"
          :style="{ borderLeftColor: card.color || '#4A90E2' }"
          @click="handleCardClick(card)"
        >
          <div class="card-header">
            <h3 class="card-title">{{ card.title }}</h3>
            <div
              class="card-indicator"
              :style="{ backgroundColor: card.color || '#4A90E2' }"
            ></div>
          </div>
          <div class="card-body">
            <div class="card-value">{{ card.value }}</div>
          </div>
        </div>
      </div>

      <div class="map-area">
        <Map
          :data="mapData"
          :info-window-config="siteInfoWindowConfig"
          :status-key-map="siteStatusKeyMap"
          @marker-click="handleMarkerClick"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.site-mgmt-stats {
  width: 100%;
}

.stats-container {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  height: auto;
  min-height: 280px;
  padding-bottom: 0.5rem;
  overflow: hidden;
}

.cards-area {
  display: flex;
  flex-shrink: 0;
  flex-flow: row wrap;
  gap: 4px;
  align-content: stretch;
  width: 480px;
  height: 280px;
  overflow: hidden;
}

.stat-card {
  box-sizing: border-box;
  display: flex;
  flex: 1 1 calc(33.333% - 3px);
  flex-direction: column;
  justify-content: center;
  min-height: 0;
  padding: 4px 8px;
  cursor: pointer;
  background-color: var(--el-bg-color, #fff);
  border-left: 4px solid;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
  transition: all 0.3s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgb(0 0 0 / 12%);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.card-title {
  margin: 0;
  font-size: 12px;
  font-weight: 500;
  color: #6e7e91;
}

.card-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.card-body {
  display: flex;
  flex-direction: column;
}

.card-value {
  font-size: 20px;
  font-weight: 600;
  color: #4a90e2;
}

.map-area {
  position: relative;
  display: flex;
  flex: 1 1 0;
  align-items: center;
  min-width: 0;
  height: 280px;
  padding: 4px;
  box-sizing: border-box;
}
</style>
