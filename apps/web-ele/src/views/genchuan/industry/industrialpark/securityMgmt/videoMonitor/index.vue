<script setup>
import { ref, computed, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
// 实时监控组件
import realTimeMonitor from './realTimeMonitor/index.vue';
import realTimeMonitorChart from './realTimeMonitor/components/chart.vue';
// 录像回放组件
import videoPlayback from './videoPlayback/index.vue';
import videoPlaybackChart from './videoPlayback/components/chart.vue';
// AI识别组件
import aiRecognition from './aiRecognition/index.vue';
import aiRecognitionChart from './aiRecognition/components/chart.vue';
import '#/components/page/index.scss';
// 设备管理组件
import cameraMgmt from './cameraMgmt/index.vue';
import cameraMgmtChart from './cameraMgmt/components/chart.vue';

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
  {
    label: 'AI识别',
    components: aiRecognition,
    chartComponent: aiRecognitionChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
  {
    label: '设备管理',
    components: cameraMgmt,
    chartComponent: cameraMgmtChart,
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

// AI识别组件引用
const aiRecognitionRef = ref(null);
const setAiRecognitionRef = (el) => {
  if (el) aiRecognitionRef.value = el;
};

// 设备管理组件引用
const cameraMgmtRef = ref(null);
const setCameraMgmtRef = (el) => {
  if (el) cameraMgmtRef.value = el;
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

// ========== AI识别图表事件 ==========
const onAiCardSelect = async (status) => {
  await nextTick();
  if (!aiRecognitionRef.value) {
    ElMessage.warning('AI识别列表组件未就绪');
    return;
  }
  aiRecognitionRef.value.clearFilters();
  if (status === 'alarm') {
    // 告警总数筛选告警状态
    aiRecognitionRef.value.handleFilterTagClick('alarmCount', null);
  }
};

const onAiPieSelect = async ({ field, value, type }) => {
  await nextTick();
  if (!aiRecognitionRef.value) {
    ElMessage.warning('AI识别列表组件未就绪');
    return;
  }
  aiRecognitionRef.value.clearFilters();
  if (type === 'type' && field === 'ruleType') {
    aiRecognitionRef.value.handleFilterTagClick('ruleType', value);
  } else if (type === 'accuracy' && field === 'ruleName') {
    aiRecognitionRef.value.handleFilterTagClick('ruleName', value);
  }
};

// ========== 设备管理图表事件 ==========
const onDeviceCardSelect = async (status) => {
  await nextTick();
  if (!cameraMgmtRef.value) {
    ElMessage.warning('设备管理列表组件未就绪');
    return;
  }
  cameraMgmtRef.value.clearFilters();
  if (status === 'online') {
    cameraMgmtRef.value.handleFilterTagClick('runStatus', '在线');
  } else if (status === 'offline') {
    cameraMgmtRef.value.handleFilterTagClick('runStatus', '离线');
  } else if (status === 'fault') {
    cameraMgmtRef.value.handleFilterTagClick('runStatus', '故障');
  }
};

const onDeviceBarSelect = async ({ field, value }) => {
  await nextTick();
  if (!cameraMgmtRef.value) {
    ElMessage.warning('设备管理列表组件未就绪');
    return;
  }
  cameraMgmtRef.value.handleFilterTagClick('area', value);
};

const currentTab = computed(() => tabArray.value.find(item => item.label === activeName.value) || tabArray.value[0]);
const currentChartComponent = computed(() => currentTab.value.chartComponent);
const currentArrowShow = computed(() => currentTab.value.arrowShow);
</script>

<template>
  <div class="common-index">
    <!-- 实时监控图表 -->
    <component
      v-if="currentArrowShow && activeName === '实时监控'"
      :is="currentChartComponent"
      @cardSelect="onRealCardSelect"
      @barSelect="onRealBarSelect"
      @markerSelect="onRealMarkerSelect"
    />
    <!-- 录像回放图表 -->
    <component
      v-if="currentArrowShow && activeName === '录像回放'"
      :is="currentChartComponent"
      @barSelect="onVideoBarSelect"
      @lineSelect="onVideoLineSelect"
    />
    <!-- AI识别图表 -->
    <component
      v-if="currentArrowShow && activeName === 'AI识别'"
      :is="currentChartComponent"
      @cardSelect="onAiCardSelect"
      @pieSelect="onAiPieSelect"
    />
    <!-- 设备管理图表 -->
    <component
      v-if="currentArrowShow && activeName === '设备管理'"
      :is="currentChartComponent"
      @cardSelect="onDeviceCardSelect"
      @barSelect="onDeviceBarSelect"
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
          v-else-if="item.label === '录像回放'"
          :is="item.components"
          :ref="setVideoPlaybackRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <component
          v-else-if="item.label === 'AI识别'"
          :is="item.components"
          :ref="setAiRecognitionRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <component
          v-else
          :is="item.components"
          :ref="setCameraMgmtRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
