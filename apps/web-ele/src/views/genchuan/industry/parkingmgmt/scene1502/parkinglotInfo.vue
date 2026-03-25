<template>
  <div class="page-container" ref="pageContainerRef">
    <div class="header-box">
      <button class="back-button" @click="handleBack">
        <el-icon color="#00ccff" :size="`${1.2}vw`">
          <ArrowLeft />
        </el-icon>
      </button>
      <span class="head-name">
        停车场信息管理
      </span>
      <div class="showTime h1_time"></div>
      <button class="fullScreenBut" @click="clickFullscreen">
        <el-icon color="#00ccff" :size="`${1.2}vw`">
          <FullScreen />
        </el-icon>
      </button>
    </div>

    <div class="mainbox">
      <div class="panel left">
        <div class="left_top">
          <div class="header-actions">
            <div class="actions-left">
              <p>资源类指标看板</p>
            </div>
            <div class="actions-right">
              <div class="filter-group">
                <el-radio-group
                  v-model="coreFilterParams.time_range"
                  size="small"
                  class="time-range-radio-group"
                  @change="fetchCoreData"
                >
                  <el-radio label="当前" value="current"/>
                  <el-radio label="上月" value="last_month"/>
                </el-radio-group>
              </div>
            </div>
          </div>
          <div class="indicator-cards">
            <!-- 第1行：停车场数量相关 -->
            <div class="indicator-card card-city-park" :class="getGroupStatusClass('city_park_total')">
              <div class="indicator-title">全城停车场总数</div>
              <div class="sub-indicators">
                <div class="sub-indicator-item">
                  <div class="sub-indicator-value">
                    {{ statData.city_park_total || 0 }}
                    <div class="unit">个</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="indicator-card card-pub-park" :class="getGroupStatusClass('pub_park_count')">
              <div class="indicator-title">公共停车场数</div>
              <div class="sub-indicators">
                <div class="sub-indicator-item">
                  <div class="sub-indicator-value">
                    {{ statData.pub_park_count || 0 }}
                    <div class="unit">个</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="indicator-card card-road-park" :class="getGroupStatusClass('road_park_count')">
              <div class="indicator-title">路侧停车场数</div>
              <div class="sub-indicators">
                <div class="sub-indicator-item">
                  <div class="sub-indicator-value">
                    {{ statData.road_park_count || 0 }}
                    <div class="unit">个</div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 第2行：停车场数量+泊位总数 -->
            <div class="indicator-card card-special-park" :class="getGroupStatusClass('special_park_count')">
              <div class="indicator-title">专用停车场数</div>
              <div class="sub-indicators">
                <div class="sub-indicator-item">
                  <div class="sub-indicator-value">
                    {{ statData.special_park_count || 0 }}
                    <div class="unit">个</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="indicator-card card-total-berth" :class="getGroupStatusClass('total_berth_count')">
              <div class="indicator-title">总泊位数</div>
              <div class="sub-indicators">
                <div class="sub-indicator-item">
                  <div class="sub-indicator-value">
                    {{ statData.total_berth_count || 0 }}
                    <div class="unit">个</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="indicator-card card-pub-berth" :class="getGroupStatusClass('pub_berth_count')">
              <div class="indicator-title">公共泊位数</div>
              <div class="sub-indicators">
                <div class="sub-indicator-item">
                  <div class="sub-indicator-value">
                    {{ statData.pub_berth_count || 0 }}
                    <div class="unit">个</div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 第3行：泊位数量+启用泊位率 -->
            <div class="indicator-card card-road-berth" :class="getGroupStatusClass('road_berth_count')">
              <div class="indicator-title">路侧泊位数</div>
              <div class="sub-indicators">
                <div class="sub-indicator-item">
                  <div class="sub-indicator-value">
                    {{ statData.road_berth_count || 0 }}
                    <div class="unit">个</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="indicator-card card-special-berth" :class="getGroupStatusClass('special_berth_count')">
              <div class="indicator-title">专用泊位数</div>
              <div class="sub-indicators">
                <div class="sub-indicator-item">
                  <div class="sub-indicator-value">
                    {{ statData.special_berth_count || 0 }}
                    <div class="unit">个</div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 启用泊位率：特殊处理百分比，保留脉冲动画 -->
            <div
              class="indicator-card card-enable-berth"
              :class="[getGroupStatusClass('enable_berth_rate'), { 'pulse-danger': qualifyWarnPulse }]"
            >
              <div class="indicator-title">启用泊位率</div>
              <div class="sub-indicators">
                <div class="sub-indicator-item">
                  <div class="sub-indicator-value">
                    {{ (statData.enable_berth_rate * 100 || 0).toFixed(2) }}
                    <div class="unit">%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="panel-footer"></div>
        </div>
        <div class="left_bottom">
          <div class="area-ratio-chart-wrapper" style="width: 100%; height: calc(100% - 40px);">
            <ChartPie3
              :data="convertedPieData"
              title="各区域资源占比"
              :baseFontScale="1"
            />
          </div>
          <div class="panel-footer"></div>
        </div>
      </div>
      <div class="right">
        <div class="panel right_top">
          <div class="header-actions">
            <div class="actions-left">
              <p>行业特色态势聚合</p>
            </div>
          </div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel right_bottom">
          <div class="header-actions">
            <div class="actions-left">
              <p>核心对象分布视图</p>
            </div>
            <div class="actions-right">
              <div class="filter-group">
                <el-button
                  type="primary"
                  round
                  size="small"
                  @click="areaFilterDialogVisible = true"
                  class="filter-btn"
                  style="margin-left: 0.5vw;"
                >
                  区域筛选
                </el-button>
              </div>
            </div>
          </div>
          <div class="panel-footer"></div>
          <el-dialog
            v-model="areaFilterDialogVisible"
            width="60%"
            class="filter-dialog"
            :close-on-click-modal="false"
          >
            <div class="filter-form">
              <el-form
                :model="tempResourceFilterParams"
                label-width="100px"
                class="filter-form-content"
              >
                <el-form-item label="行政区划">
                  <div class="tag-select-group area-tag-group">
                    <div class="tag-level">
                      <span class="level-title">省份/城市：</span>
                      <div class="tag-list">
                        <span
                          v-for="item in areaOptions"
                          :key="item.value"
                          class="select-tag"
                          :class="{ active: selectedAreaLevel[0] === item.value }"
                          @click="selectAreaLevel(0, item.value)"
                        >
                          {{ item.label }}
                        </span>
                      </div>
                    </div>

                    <div v-if="selectedAreaLevel[0] && getAreaChildren(selectedAreaLevel[0]).length" class="tag-level">
                      <span class="level-title">区县：</span>
                      <div class="tag-list">
                        <span
                          v-for="item in getAreaChildren(selectedAreaLevel[0])"
                          :key="item.value"
                          class="select-tag"
                          :class="{ active: selectedAreaLevel[1] === item.value }"
                          @click="selectAreaLevel(1, item.value)"
                        >
                          {{ item.label }}
                        </span>
                      </div>
                    </div>

                    <div v-if="selectedAreaLevel[1] && getAreaChildren(selectedAreaLevel[1]).length" class="tag-level">
                      <span class="level-title">街道/乡镇：</span>
                      <div class="tag-list">
                        <span
                          v-for="item in getAreaChildren(selectedAreaLevel[1])"
                          :key="item.value"
                          class="select-tag"
                          :class="{ active: selectedAreaLevel[2] === item.value }"
                          @click="selectAreaLevel(2, item.value)"
                        >
                          {{ item.label }}
                        </span>
                      </div>
                    </div>

                    <div v-if="areaOptions.length === 0" class="empty-tip">暂无行政区划数据</div>
                  </div>
                </el-form-item>

                <!-- 所属网格筛选模块 -->
                <el-form-item label="所属网格">
                  <div class="tag-select-group grid-tag-group">
                    <div v-if="gridOptions.length > 0" class="tag-list">
                      <!-- 全部网格选项 -->
                      <span
                        class="select-tag"
                        :class="{ active: !tempResourceFilterParams.gridCode }"
                        @click="tempResourceFilterParams.gridCode = ''"
                      >
                        全部网格
                      </span>
                      <!-- 具体网格选项 -->
                      <span
                        v-for="item in gridOptions"
                        :key="item.value"
                        class="select-tag"
                        :class="{ active: tempResourceFilterParams.gridCode === item.value }"
                        @click="tempResourceFilterParams.gridCode = item.value"
                      >
                        {{ item.label }}
                      </span>
                    </div>
                    <!-- 网格空提示 -->
                    <div v-else class="empty-tip" :class="{ disabled: !selectedAreaLevel[selectedAreaLevel.length - 1] }">
                      {{ selectedAreaLevel[selectedAreaLevel.length - 1] ? '暂无网格数据' : '请先选择行政区划' }}
                    </div>
                  </div>
                </el-form-item>
              </el-form>
            </div>
            <template #footer>
              <el-button @click="resetResourceFilter">重置</el-button>
              <el-button @click="areaFilterDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="confirmAreaFilter">确认筛选</el-button>
            </template>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, watch, computed, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import {ElMessage} from 'element-plus';
import {ArrowLeft, FullScreen} from "@element-plus/icons-vue";
import screenFull from "screenfull";
import ChartPie3 from "#/views/genchuan/industry/templatesstatchart/ChartPie3.vue";

import {
  fetchParkResourceOverview,
  fetchAreaOptions,
  fetchGridOptionsByArea,
  fetchAreaResourceRatio
} from '#/api/genchuan/industry/parkingmgmt/scene1502/parkinglotInfo.js';

const router = useRouter();
const pageContainerRef = ref(null);
// 资源类指标数据
const statData = ref({});
const qualifyWarnPulse = ref(false);

// 时间筛选参数
const coreFilterParams = ref({
  time_range: 'current'
});

// 区域+网格筛选相关变量
const areaFilterDialogVisible = ref(false);
const areaOptions = ref([]);
const gridOptions = ref([]);
const selectedAreaLevel = ref([]);
const resourceFilterParams = ref({
  time_range: 'current',
  areaCode: [],
  gridCode: ''
});
const tempResourceFilterParams = ref({
  areaCode: [],
  gridCode: ''
});

// 核心：无任何模拟数据，初始化为空结构，完全由接口填充
const areaRatioRawData = ref({
  labels: [],
  data: []
});

// 格式转换：简洁格式 -> ChartPie3所需格式（无多余逻辑）
const convertedPieData = computed(() => {
  return {
    legend: areaRatioRawData.value.labels,
    series: [
      {
        name: "资源数",
        data: areaRatioRawData.value.data
      }
    ]
  };
});

// 核心指标预警逻辑
const getGroupStatusClass = (field) => {
  if (!statData.value[field]) return 'normal';
  if (field === 'enable_berth_rate') {
    const warnThreshold = 0.8;
    return statData.value[field] < warnThreshold ? 'danger' : 'normal';
  }
  return 'normal';
};

// 计算属性：判断启用泊位率是否异常
const isQualifyRateAbnormal = computed(() => {
  if (statData.value.enable_berth_rate === undefined) {
    return false;
  }
  const warnThreshold = 0.8;
  return statData.value.enable_berth_rate < warnThreshold;
});

// 递归获取行政区划子节点
const getAreaChildren = (parentCode) => {
  const findItem = (list, code) => {
    for (const item of list) {
      if (item.value === code) return item.children || [];
      const res = findItem(item.children || [], code);
      if (res.length) return res;
    }
    return [];
  };
  return findItem(areaOptions.value, parentCode);
};

// 选择行政区划层级并加载网格
const selectAreaLevel = async (levelIndex, code) => {
  selectedAreaLevel.value = selectedAreaLevel.value.slice(0, levelIndex + 1);
  selectedAreaLevel.value[levelIndex] = code;
  tempResourceFilterParams.value.areaCode = selectedAreaLevel.value;
  const finalAreaCode = selectedAreaLevel.value[selectedAreaLevel.value.length - 1];
  const hasChildren = getAreaChildren(finalAreaCode).length > 0;

  if (finalAreaCode && !hasChildren) {
    try {
      gridOptions.value = await fetchGridOptionsByArea(finalAreaCode);
    } catch (error) {
      gridOptions.value = [];
      ElMessage.error('网格数据加载失败');
    }
  } else {
    gridOptions.value = [];
    tempResourceFilterParams.value.gridCode = '';
  }
};

// 确认区域筛选
const confirmAreaFilter = async () => {
  try {
    resourceFilterParams.value.areaCode = [...tempResourceFilterParams.value.areaCode];
    resourceFilterParams.value.gridCode = tempResourceFilterParams.value.gridCode;
    resourceFilterParams.value.time_range = coreFilterParams.value.time_range;
    await fetchCoreData();
    await fetchAreaRatioData(); // 仅调用接口，无模拟
    areaFilterDialogVisible.value = false;
    ElMessage.success('区域筛选条件已生效');
  } catch (error) {
    ElMessage.error('筛选失败，请重试');
  }
};

// 重置区域+网格筛选
const resetResourceFilter = () => {
  tempResourceFilterParams.value = {areaCode: [], gridCode: ''};
  selectedAreaLevel.value = [];
  gridOptions.value = [];
  resourceFilterParams.value.areaCode = [];
  resourceFilterParams.value.gridCode = '';
  fetchCoreData();
  fetchAreaRatioData(); // 仅调用接口，无模拟
  ElMessage.success('筛选条件已重置');
};

// 获取核心指标数据
const fetchCoreData = async () => {
  try {
    const requestParams = {
      time_range: coreFilterParams.value.time_range,
      regionCode: resourceFilterParams.value.areaCode.length
        ? resourceFilterParams.value.areaCode[resourceFilterParams.value.areaCode.length - 1]
        : undefined,
      gridId: resourceFilterParams.value.gridCode || undefined
    };
    const data = await fetchParkResourceOverview(requestParams); // 仅调用接口
    statData.value = data;
    qualifyWarnPulse.value = isQualifyRateAbnormal.value;
  } catch (error) {
    console.error('获取停车场资源类指标数据失败:', error);
    ElMessage.error('资源类指标数据加载失败，请刷新页面重试');
  }
};

// 获取区域占比饼图数据（仅调用接口，无任何模拟）
const fetchAreaRatioData = async () => {
  try {
    const requestParams = {
      time_range: coreFilterParams.value.time_range,
      regionCode: resourceFilterParams.value.areaCode.length
        ? resourceFilterParams.value.areaCode[resourceFilterParams.value.areaCode.length - 1]
        : undefined,
      gridId: resourceFilterParams.value.gridCode || undefined
    };
    const res = await fetchAreaResourceRatio(requestParams); // 仅调用接口，接收{labels, data}
    areaRatioRawData.value = res; // 完全由接口填充，无本地模拟
  } catch (error) {
    console.error('获取区域资源占比饼图数据失败:', error);
  }
};

// 加载行政区划数据
const fetchAreaData = async () => {
  try {
    areaOptions.value = await fetchAreaOptions();
  } catch (error) {
    areaOptions.value = [];
    ElMessage.error('行政区划数据加载失败');
  }
};

// 全屏切换
const clickFullscreen = () => {
  if (!screenFull.isEnabled) {
    ElMessage.warning('您的浏览器不支持全屏功能');
    return;
  }
  const targetEl = pageContainerRef.value;
  screenFull.isFullscreen ? screenFull.exit() : screenFull.request(targetEl);
};

// 返回首页
const handleBack = () => {
  router.push('/');
};

// 监听启用泊位率状态
watch(isQualifyRateAbnormal, (newVal) => {
  qualifyWarnPulse.value = newVal;
}, {immediate: true, deep: true});

// 监听时间筛选变化
watch(() => coreFilterParams.value.time_range, (newTimeRange) => {
  resourceFilterParams.value.time_range = newTimeRange;
  fetchCoreData();
  fetchAreaRatioData();
});

// 页面挂载
onMounted(async () => {
  await fetchAreaData();
  await fetchCoreData();
  await fetchAreaRatioData(); // 初始化加载接口数据

  // 30秒定时刷新（仅调用接口）
  setInterval(() => {
    fetchCoreData();
    fetchAreaRatioData();
  }, 30000);
});
</script>

<style lang="scss" scoped>
@import '#/views/genchuan/industry/templatesstyle/common-styles.scss';

// 通用页面布局
.page-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: url("../images/bg.jpg");
  background-size: 100% 100%;
  color: #fff;
  padding: 0 1vw;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

// 头部盒子样式
.header-box {
  width: 100%;
  height: 10vh;
  position: relative;
  background: url("../images/head_bg.png") no-repeat;
  background-size: 100% 100%;
  color: #00ccff;
  font-size: 2.1vw;
  font-weight: bold;
  box-sizing: border-box;

  .head-name {
    display: inline-block;
    line-height: 9vh;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;

    .title-icon {
      width: 2vw;
      height: 2vw;
      object-fit: contain;
      vertical-align: middle;
      margin-right: 0.5vw;
      filter: drop-shadow(0 0 3px rgba(0, 198, 255, 0.5));
    }
  }
}

// 面板通用样式
.panel {
  position: relative;
  height: 100%;
  border: 0.2vh solid rgba(25, 186, 139, 0.17);
  background: url("../images/line(1).png") rgba(255, 255, 255, .04);
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 0.5vw;
  box-sizing: border-box;
}

.left {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 2%;
}

.left_top {
  height: 60%;
  box-sizing: border-box;
}

.left_bottom {
  height: 40%;
  box-sizing: border-box;
}

.right {
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: 2%;
}

.right_top {
  height: 50%;
  box-sizing: border-box;
}

.right_bottom {
  height: 50%;
  box-sizing: border-box;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5vw;

  .filter-select {
    color: #fff;
    background: rgba(0, 30, 60, 0.5);

    :deep(.el-input__wrapper) {
      background: transparent;
      border: none;
      box-shadow: none;
    }

    :deep(.el-input__placeholder) {
      color: #ccefff;
    }

    :deep(.el-select-dropdown) {
      background: rgba(0, 30, 60, 0.8);
      border: 1px solid #00ccff;

      .el-option {
        color: #fff;

        &:hover {
          background: rgba(0, 204, 255, 0.2);
        }

        &.selected {
          background: rgba(0, 204, 255, 0.3);
        }
      }
    }
  }
}

// 3×3网格布局
.indicator-cards {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 0.6vw;
  padding: 1vh 0.5vw;
  flex: 1;
  height: calc(100% - 60px);
}

.indicator-card {
  height: 100%;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  border: 1px solid transparent;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
    border-color: rgba(255, 255, 255, 0.3);
  }

  .indicator-title {
    font-size: 0.8vw;
    font-weight: 600;
    margin-bottom: 1vh;
    color: #90ffc4;
    text-align: center;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  .sub-indicator-value {
    font-size: 1vw;
    font-weight: 700;
    color: #f0f9ff;
    line-height: 1.3;
    display: flex;
    flex-direction: row;
    align-items: baseline;
    justify-content: center;

    .unit {
      font-size: 0.7vw;
      color: #ccefff;
      margin-top: 0;
      margin-left: 0.3vw;
      text-align: center;
    }
  }
}

// 9个卡片独立样式
.card-city-park.normal {
  background: linear-gradient(135deg, rgba(0, 168, 255, 0.3) 30%, #00528a 100%);
}

.card-city-park.danger {
  background: linear-gradient(135deg, #ff4d4d 30%, #00528a 100%);
  border-top-color: #ff4d4d;
}

.card-pub-park.normal {
  background: linear-gradient(135deg, rgba(255, 153, 0, 0.3) 30%, #8a4400 100%);
}

.card-pub-park.danger {
  background: linear-gradient(135deg, #ff4d4d 30%, #8a4400 100%);
  border-top-color: #ff4d4d;
}

.card-road-park.normal {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.3) 30%, #4a2394 100%);
}

.card-road-park.danger {
  background: linear-gradient(135deg, #ff4d4d 30%, #4a2394 100%);
  border-top-color: #ff4d4d;
}

.card-special-park.normal {
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.3) 30%, #8a2323 100%);
}

.card-special-park.danger {
  background: linear-gradient(135deg, #ff3333 30%, #8a2323 100%);
  border-top-color: #ff3333;
}

.card-total-berth.normal {
  background: linear-gradient(135deg, rgba(0, 255, 213, 0.3) 30%, #008a78 100%);
}

.card-total-berth.danger {
  background: linear-gradient(135deg, #ff4d4d 30%, #008a78 100%);
  border-top-color: #ff4d4d;
}

.card-pub-berth.normal {
  background: linear-gradient(135deg, rgba(52, 211, 153, 0.3) 30%, #1a7848 100%);
}

.card-pub-berth.danger {
  background: linear-gradient(135deg, #ff4d4d 30%, #1a7848 100%);
  border-top-color: #ff4d4d;
}

.card-road-berth.normal {
  background: linear-gradient(135deg, rgba(255, 214, 10, 0.3) 30%, #8a781a 100%);
}

.card-road-berth.danger {
  background: linear-gradient(135deg, #ff4d4d 30%, #8a781a 100%);
  border-top-color: #ff4d4d;
}

.card-special-berth.normal {
  background: linear-gradient(135deg, rgba(167, 139, 250, 0.3) 30%, #6a4c93 100%);
}

.card-special-berth.danger {
  background: linear-gradient(135deg, #ff4d4d 30%, #6a4c93 100%);
  border-top-color: #ff4d4d;
}

.card-enable-berth.normal {
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.3) 30%, #238a46 100%);
}

.card-enable-berth.danger {
  background: linear-gradient(135deg, #ff4d4d 30%, #238a46 100%);
  border-top-color: #ff4d4d;
}

// 启用泊位率危险脉冲动画
@keyframes pulse-danger {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 77, 77, 0.7);
  }
  100% {
    box-shadow: 0 0 0 15px rgba(255, 77, 77, 0);
  }
}

.pulse-danger {
  animation: pulse-danger 1s infinite;
}

// 饼图容器样式
.area-ratio-chart-wrapper {
  padding: 0.5vw 1vw;
  box-sizing: border-box;
}

// 筛选弹窗样式
.filter-dialog {
  --el-dialog-bg-color: #ffffff;
  --el-dialog-border-color: #e8e8e8;
  --el-dialog-title-color: #1f2937;
  --el-dialog-text-color: #374151;
  --el-dialog-header-border-color: #e8e8e8;
  --el-dialog-footer-border-color: #e8e8e8;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  :deep(.el-dialog__header) {
    border-bottom: 1px solid #e8e8e8;
    padding: 16px 20px;
  }

  :deep(.el-dialog__title) {
    color: #1f2937;
    font-size: 1vw;
    font-weight: 600;
  }

  :deep(.el-dialog__body) {
    padding: 20px;
    color: #374151;
    background: #ffffff;
  }

  :deep(.el-dialog__footer) {
    border-top: 1px solid #e8e8e8;
    padding: 12px 20px;
    background: #f9fafb;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
}

.filter-form-content {
  :deep(.el-form-item__label) {
    color: #1f2937;
    font-size: 0.9vw;
    font-weight: 600;
  }

  :deep(.el-form-item) {
    margin-bottom: 1.5vw;
  }
}

.tag-select-group {
  width: 100%;
  margin-top: 0.5vw;

  &.area-tag-group {
    .tag-level {
      margin-bottom: 0.8vw;
      padding-bottom: 0.5vw;
      border-bottom: 1px solid #e8e8e8;

      &:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
      }

      .level-title {
        display: inline-block;
        color: #1f2937;
        font-size: 0.8vw;
        margin-right: 0.8vw;
        font-weight: 600;
      }
    }
  }

  &.grid-tag-group {
    margin-top: 0.8vw;
  }

  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6vw;
    align-items: center;
  }

  .select-tag {
    display: inline-block;
    padding: 0.4vw 1vw;
    background: #f9fafb;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    color: #374151;
    font-size: 0.75vw;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-color: #00ccff;
      color: #00ccff;
      background: #f0f9ff;
      transform: translateY(-1px);
    }

    &.active {
      background: #e0f2fe;
      border-color: #00ccff;
      color: #0284c7;
      font-weight: 500;
      box-shadow: 0 0 8px rgba(0, 198, 255, 0.15);
    }
  }

  .empty-tip {
    color: #6b7280;
    font-size: 0.75vw;
    padding: 1vw 0;
    text-align: left;

    &.disabled {
      color: #9ca3af;
      opacity: 0.8;
    }
  }
}

.filter-btn {
  --el-button-bg-color: rgba(0, 198, 255, 0.2);
  --el-button-border-color: #00ccff;
  --el-button-text-color: #ffffff;
  --el-button-hover-bg-color: rgba(0, 198, 255, 0.4);
  --el-button-hover-border-color: #00ccff;
  font-size: 0.8vw;
  height: auto;
}
</style>
