<script setup>
import { ref, computed, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
// 实时监控组件
import realTimeMonitor from './realTimeMonitor/index.vue';
import realTimeMonitorChart from './realTimeMonitor/components/chart.vue';
// 录像回放组件
import videoPlayback from './videoPlayback/index.vue';
import videoPlaybackChart from './videoPlayback/components/chart.vue';
import '#/components/page/index.scss';

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

const tabArray = ref([
  {
    label: '实时监控',
    components: realTimeMonitor,
    chartComponent: realTimeMonitorChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
  {
    label: '录像回放',
    components: videoPlayback,
    chartComponent: videoPlaybackChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
]);

const arrowChange = () => {
  tabArray.value.forEach((v) => {
    v.arrowShow = !v.arrowShow;
  });
};

const activeName = ref('实时监控');
const secondShow = ref(false);

// 实时监控组件引用
const realTimeMonitorRef = ref(null);
const setRealTimeMonitorRef = (el) => {
  if (el) realTimeMonitorRef.value = el;
};

// 录像回放组件引用
const videoPlaybackRef = ref(null);
const setVideoPlaybackRef = (el) => {
  if (el) videoPlaybackRef.value = el;
};

// 辅助：标准化状态（用于卡片筛选，实时监控）
const normalizeStatus = (status) => {
  if (!status) return '';
  if (status === 'online') return '正常';
  if (status === 'offline') return '离线';
  if (status === 'alarm') return '告警中';
  if (status === 'handle') return '已处置';
  return status;
};

// ========== 实时监控图表事件 ==========
const onRealCardSelect = async (status) => {
  await nextTick();
  if (!realTimeMonitorRef.value) {
    ElMessage.warning('实时监控列表组件未就绪');
    return;
  }
  realTimeMonitorRef.value.clearFilters();
  if (status === 'online') {
    realTimeMonitorRef.value.handleFilterTagClick('runStatus', '正常');
  } else if (status === 'offline') {
    realTimeMonitorRef.value.handleFilterTagClick('runStatus', '离线');
  } else if (status === 'alarm') {
    realTimeMonitorRef.value.handleFilterTagClick('alarmStatus', '告警中');
  }
};

const onRealBarSelect = async ({ field, value }) => {
  await nextTick();
  if (!realTimeMonitorRef.value) {
    ElMessage.warning('实时监控列表组件未就绪');
    return;
  }
  realTimeMonitorRef.value.handleFilterTagClick('area', value);
};

const onRealMarkerSelect = async (cameraName) => {
  await nextTick();
  if (!realTimeMonitorRef.value) {
    ElMessage.warning('实时监控列表组件未就绪');
    return;
  }
  realTimeMonitorRef.value.clearFilters();
  realTimeMonitorRef.value.handleFilterTagClick('cameraName', cameraName);
};

// ========== 录像回放图表事件 ==========
const onVideoBarSelect = async ({ field, value }) => {
  await nextTick();
  if (!videoPlaybackRef.value) {
    ElMessage.warning('录像回放列表组件未就绪');
    return;
  }
  videoPlaybackRef.value.clearFilters();
  if (field === 'videoTime') {
    // 这里需要转换日期为时间戳范围，简化为点击日期筛选当天
    videoPlaybackRef.value.handleFilterTagClick('videoTime', value);
  } else if (field === 'cameraName') {
    videoPlaybackRef.value.handleFilterTagClick('cameraName', value);
  }
};

const onVideoLineSelect = async ({ field, value }) => {
  await nextTick();
  if (!videoPlaybackRef.value) {
    ElMessage.warning('录像回放列表组件未就绪');
    return;
  }
  videoPlaybackRef.value.clearFilters();
  videoPlaybackRef.value.handleFilterTagClick('videoTime', value);
};

const currentTab = computed(() => tabArray.value.find(item => item.label === activeName.value) || tabArray.value[0]);
const currentChartComponent = computed(() => currentTab.value.chartComponent);
const currentArrowShow = computed(() => currentTab.value.arrowShow);
</script>

<template>
  <div class="common-index">
    <component
      v-if="currentArrowShow && activeName === '实时监控'"
      :is="currentChartComponent"
      @cardSelect="onRealCardSelect"
      @barSelect="onRealBarSelect"
      @markerSelect="onRealMarkerSelect"
    />
    <component
      v-if="currentArrowShow && activeName === '录像回放'"
      :is="currentChartComponent"
      @barSelect="onVideoBarSelect"
      @lineSelect="onVideoLineSelect"
    />
    <el-tabs v-model="activeName" class="common-tabs" type="card">
      <el-tab-pane v-for="item in tabArray" :key="item.label" :name="item.label">
        <template #label>
          <div class="table-first"><span>{{ item.label }}</span></div>
        </template>
        <component
          v-if="item.label === '实时监控'"
          :is="item.components"
          :ref="setRealTimeMonitorRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <component
          v-else
          :is="item.components"
          :ref="setVideoPlaybackRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
