<template>
  <div class="page-container" ref="pageContainerRef">
    <div class="header-box">
      <button class="back-button" @click="handleBack">
        <el-icon color="#00ccff" :size="`${1.2}vw`">
          <ArrowLeft />
        </el-icon>
      </button>
      <span class="head-name">
        泊位占用监测
      </span>
      <div class="showTime h1_time"></div>
      <button class="fullScreenBut" @click="clickFullscreen">
        <el-icon color="#00ccff" :size="`${1.2}vw`">
          <FullScreen />
        </el-icon>
      </button>
    </div>

    <div class="mainbox">
      <div class="left">
        <div class="panel left_top" style="min-width: 6vw;">
          <div class="header-actions">
            <div class="actions-left">
              <p>核心指标看板</p>
            </div>
            <div class="actions-right">
              <div class="map-filter-group">
                <el-radio-group
                  v-model="timeFilterParams.range"
                  size="small"
                  @change="fetchOverviewData"
                  class="time-range-radio-group"
                >
                  <el-radio label="today">今日</el-radio>
                  <el-radio label="yesterday">昨日</el-radio>
                  <el-radio label="week">近7日</el-radio>
                </el-radio-group>
              </div>
            </div>
          </div>
          <div class="stats-cards">
            <div class="stat-card rate-card" :class="overviewData.city_occupy_rate > 80 ? 'danger-rate' : 'normal-rate'" @click="openRealTimeStatDialog">
              <div class="stat-title">全城占用泊位率</div>
              <div class="stat-value">{{ overviewData.city_occupy_rate }}%</div>
            </div>
            <div class="stat-card warning-card" :class="{ pulse: overviewData.warn_occupy_total > 0 }" @click="openRealTimeStatDialog">
              <div class="stat-title">预警占用泊位数</div>
              <div class="stat-value">{{ overviewData.warn_occupy_total }}</div>
              <div class="stat-desc">超时长占用: {{ overviewData.overtime_occupy_count }} 个</div>
            </div>
            <div class="stat-card abnormal-card" @click="openRealTimeStatDialog">
              <div class="stat-title">非机动占用数</div>
              <div class="stat-value">{{ overviewData.non_motor_occupy_count }}</div>
              <div class="stat-desc">处置合格率: {{ overviewData.dispose_qualified_rate }}%</div>
            </div>
            <div class="stat-card dispose-card" @click="openRealTimeStatDialog">
              <div class="stat-title">平均处置时长</div>
              <div class="stat-value">{{ overviewData.avg_dispose_duration }}分钟</div>
            </div>
          </div>
          <div class="panel-footer"></div>
          <el-dialog
            v-model="realTimeStatDialogVisible"
            width="50%"
            class="real-time-stat-dialog"
          >
            <div class="stat-detail">
              <div class="detail-section">
                <h3>停车实时统计表</h3>
                <el-descriptions column="2" border>
                  <el-descriptions-item label="全城占用泊位率">{{ realTimeStatData.city_occupy_rate }}%</el-descriptions-item>
                  <el-descriptions-item label="预警占用泊位数">{{ realTimeStatData.warn_occupy_total }}</el-descriptions-item>
                  <el-descriptions-item label="超时长占用数">{{ realTimeStatData.overtime_occupy_count }}</el-descriptions-item>
                  <el-descriptions-item label="非机动占用数">{{ realTimeStatData.non_motor_occupy_count }}</el-descriptions-item>
                  <el-descriptions-item label="处置合格率">{{ realTimeStatData.dispose_qualified_rate }}%</el-descriptions-item>
                  <el-descriptions-item label="平均处置时长">{{ realTimeStatData.avg_dispose_duration }}分钟</el-descriptions-item>
                  <el-descriptions-item label="全城空置泊位率">{{ realTimeStatData.city_vacant_rate }}%</el-descriptions-item>
                  <el-descriptions-item label="预警空置泊位数">{{ realTimeStatData.warn_vacant_count }}</el-descriptions-item>
                  <el-descriptions-item label="故障导致空置数">{{ realTimeStatData.fault_vacant_count }}</el-descriptions-item>
                  <el-descriptions-item label="规划调整空置数">{{ realTimeStatData.adjust_vacant_count }}</el-descriptions-item>
                  <el-descriptions-item label="核查合格率">{{ realTimeStatData.verify_qualified_rate }}%</el-descriptions-item>
                  <el-descriptions-item label="平均修复时长">{{ realTimeStatData.avg_repair_duration }}分钟</el-descriptions-item>
                  <el-descriptions-item label="复核合格率">{{ realTimeStatData.review_qualified_rate }}%</el-descriptions-item>
                  <el-descriptions-item label="全城故障泊位率">{{ realTimeStatData.city_fault_rate }}%</el-descriptions-item>
                  <el-descriptions-item label="传感器故障数">{{ realTimeStatData.sensor_fault_count }}</el-descriptions-item>
                  <el-descriptions-item label="设施损坏数">{{ realTimeStatData.facility_damage_count }}</el-descriptions-item>
                  <el-descriptions-item label="严重故障占比">{{ realTimeStatData.serious_fault_ratio }}%</el-descriptions-item>
                </el-descriptions>
              </div>
            </div>
            <template #footer>
              <el-button @click="realTimeStatDialogVisible = false">关闭</el-button>
            </template>
          </el-dialog>
        </div>
        <div class="panel left_bottom" style="min-width: 6vw;" ref="map">
          <div class="header-actions">
            <div class="actions-left">
              <p>全域数据地图</p>
            </div>
            <div class="actions-right">
              <div class="map-filter-group top-filter">
                <el-button
                  type="primary"
                  round
                  size="small"
                  @click="areaFilterDialogVisible = true"
                  class="filter-btn"
                >
                  区域筛选
                </el-button>
                <el-button
                  round
                  size="small"
                  @click="showParkResourceList"
                  class="map-btn"
                >
                  地图数据列表
                </el-button>
                <button
                  class="orbit-control-btn"
                  @click="handleOrbitAnimation"
                >
                  {{ mapCommonRef?.orbitStatus?.playing ? '暂停环绕' : '开始环绕' }}
                </button>
                <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('map')">
                  <el-icon color="#00ccff" :size="`${0.8}vw`"><FullScreen /></el-icon>
                </button>
              </div>
            </div>
          </div>
          <div class="header-actions">
            <div class="actions-right">
              <div class="map-filter-group">
                <div class="checkbox-group compact-group">
                  <el-checkbox-group
                    v-model="mapFilterParams.abnormalType"
                    size="small"
                    @change="fetchMapData"
                    class="checkbox-items"
                  >
                    <el-checkbox label="overtime_occupy">超时长占用</el-checkbox>
                    <el-checkbox label="non_motor_occupy">非机动占用</el-checkbox>
                    <el-checkbox label="device_fault">设备故障</el-checkbox>
                  </el-checkbox-group>
                </div>
                <div class="checkbox-group compact-group">
                  <el-checkbox-group
                    v-model="mapFilterParams.warnStatus"
                    size="small"
                    @change="fetchMapData"
                    class="checkbox-items"
                  >
                    <el-checkbox label="no_warn">无预警</el-checkbox>
                    <el-checkbox label="warning">预警中</el-checkbox>
                    <el-checkbox label="disposed">已处置</el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
            </div>
          </div>

          <el-dialog
            v-model="areaFilterDialogVisible"
            width="60%"
            class="filter-dialog"
            :close-on-click-modal="false"
          >
            <div class="filter-form">
              <el-form
                :model="tempMapFilterParams"
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

                <el-form-item label="所属网格">
                  <div class="tag-select-group grid-tag-group">
                    <div v-if="gridOptions.length > 0" class="tag-list">
                      <span
                        class="select-tag"
                        :class="{ active: !tempMapFilterParams.gridCode }"
                        @click="tempMapFilterParams.gridCode = ''"
                      >
                        全部网格
                      </span>
                      <span
                        v-for="item in gridOptions"
                        :key="item.value"
                        class="select-tag"
                        :class="{ active: tempMapFilterParams.gridCode === item.value }"
                        @click="tempMapFilterParams.gridCode = item.value"
                      >
                        {{ item.label }}
                      </span>
                    </div>
                    <div v-else class="empty-tip" :class="{ disabled: !selectedAreaLevel[selectedAreaLevel.length - 1] }">
                      {{ selectedAreaLevel[selectedAreaLevel.length - 1] ? '暂无网格数据' : '请先选择行政区划' }}
                    </div>
                  </div>
                </el-form-item>
              </el-form>
            </div>
            <template #footer>
              <el-button @click="resetMapFilter">重置</el-button>
              <el-button @click="areaFilterDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="confirmAreaFilter">确认筛选</el-button>
            </template>
          </el-dialog>
          <map-common
            ref="mapCommonRef"
            idName="chinaEcharts"
            :geometriesArray="geometriesArray"
          />
          <div class="panel-footer"></div>
          <el-dialog
            v-model="parkResourceVisible"
            width="70%"
            class="resource-dialog"
            title="地图数据列表"
          >
            <div style="width: 100%; overflow-x: auto;">
              <el-table
                :data="parkResourceDialogList"
                border
                size="small"
                style="width: 100%;"
                :empty-text="parkResourceDialogList.length === 0 ? '暂无地图数据' : ''"
              >
                <el-table-column prop="park_id" label="停车场ID" />
                <el-table-column prop="park_name" label="停车场名称" />
                <el-table-column prop="total_space" label="泊位总数" />
                <el-table-column prop="occupy_space" label="占用泊位数" />
                <el-table-column label="占用率">
                  <template #default="scope">
                    <span>{{ ((scope.row.occupy_space / scope.row.total_space) * 100).toFixed(1) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column prop="warn_occupy_count" label="预警泊位数" />
                <el-table-column prop="abnormal_type" label="异常类型">
                  <template #default="scope">
                    <el-tag :type="getAbnormalTypeTagType(scope.row.abnormal_type)">
                      {{ getAbnormalTypeName(scope.row.abnormal_type) }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="coord_x" label="坐标X" />
                <el-table-column prop="coord_y" label="坐标Y" />
                <el-table-column prop="region_name" label="区域名称" />
                <el-table-column prop="grid_name" label="网格名称" />
                <el-table-column prop="grid_id" label="网格ID" />
                <el-table-column prop="region_code" label="区域编码" />
                <el-table-column prop="warn_status" label="预警状态">
                  <template #default="scope">
                    <el-tag :type="getWarnStatusTagType(scope.row.warn_status)">
                      {{ getWarnStatusText(scope.row.warn_status) }}
                    </el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <template #footer>
              <el-button @click="parkResourceVisible = false">关闭</el-button>
            </template>
          </el-dialog>
        </div>
      </div>
      <div class="panel right" style="min-width: 4vw;" ref="warnTrack">
        <div class="header-actions">
          <div class="actions-left">
            <p>事件预警追踪</p>
          </div>
          <div class="actions-right">
            <div class="map-filter-group top-filter">
              <el-radio-group
                v-model="warnFilterParams.timeRange"
                size="small"
                @change="fetchWarnTrackData"
                class="time-range-radio-group"
              >
                <el-radio label="">所有时间</el-radio>
                <el-radio label="today">今日</el-radio>
                <el-radio label="yesterday">昨日</el-radio>
                <el-radio label="week">本周</el-radio>
              </el-radio-group>

              <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('warnTrack')">
                <el-icon color="#00ccff" :size="`${0.8}vw`">
                  <FullScreen />
                </el-icon>
              </button>
            </div>
          </div>
        </div>
        <div class="header-actions">
          <div class="actions-right">
            <div class="map-filter-group">
              <div class="checkbox-group compact-group">
                <el-checkbox-group
                  v-model="warnFilterParams.handleStatus"
                  size="small"
                  @change="fetchWarnTrackData"
                  class="checkbox-items"
                >
                  <el-checkbox label="unhandled">未处置</el-checkbox>
                  <el-checkbox label="handling">处置中</el-checkbox>
                  <el-checkbox label="completed">已完成</el-checkbox>
                  <el-checkbox label="closed">已关闭</el-checkbox>
                </el-checkbox-group>
              </div>
              <div class="checkbox-group compact-group">
                <el-checkbox-group
                  v-model="warnFilterParams.abnormalType"
                  size="small"
                  @change="fetchWarnTrackData"
                  class="checkbox-items"
                >
                  <el-checkbox label="overtime_occupy">超时长占用</el-checkbox>
                  <el-checkbox label="non_motor_occupy">非机动占用</el-checkbox>
                  <el-checkbox label="device_fault">设备故障</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </div>
        </div>
        <div class="panel-body table-scroll">
          <el-table
            ref="warnTable"
            :data="filteredWarnList"
            border
            size="small"
            style="width: 100%; max-width: 100%; table-layout: fixed;"
            @row-click="handleWarnRowClick"
            :empty-text="filteredWarnList.length === 0 ? '暂无预警数据' : ''"
          >
            <el-table-column prop="mon_id" label="预警ID" />
            <el-table-column prop="berth_name" label="泊位名称" />
            <el-table-column prop="abnormal_type" label="预警类型">
              <template #default="scope">
                <el-tag :type="getWarnTypeTagType(scope.row.abnormal_type)">
                  {{ getWarnTypeName(scope.row.abnormal_type) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="create_time" label="预警时间" />
            <el-table-column prop="handle_status" label="工单状态">
              <template #default="scope">
                <el-tag :type="getStatusTagType(scope.row.handle_status)">
                  {{ getStatusName(scope.row.handle_status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="dispose_progress" label="处置进度">
              <template #default="scope">
                <el-progress
                  :percentage="scope.row.dispose_progress"
                  size="small"
                  :color="getProgressColor(scope.row.dispose_progress)"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="panel-footer"></div>
        <el-dialog
          v-model="warnDetailVisible"
          width="50%"
          class="warn-dialog"
        >
          <div class="warn-detail">
            <div class="detail-section">
              <h3>预警工单详情</h3>
              <el-descriptions column="2" border>
                <el-descriptions-item label="预警ID">{{ currentWarn?.mon_id || '-' }}</el-descriptions-item>
                <el-descriptions-item label="泊位名称">{{ currentWarn?.berth_name || '-' }}</el-descriptions-item>
                <el-descriptions-item label="预警类型">{{ getWarnTypeName(currentWarn?.abnormal_type) }}</el-descriptions-item>
                <el-descriptions-item label="预警时间">{{ currentWarn?.create_time || '-' }}</el-descriptions-item>
                <el-descriptions-item label="工单状态">{{ getStatusName(currentWarn?.handle_status) }}</el-descriptions-item>
                <el-descriptions-item label="处置人">{{ currentWarn?.handler_name || '未分配' }}</el-descriptions-item>
                <el-descriptions-item label="处置进度">{{ currentWarn?.dispose_progress || 0 }}%</el-descriptions-item>
                <el-descriptions-item label="预计完成时间">{{ currentWarn?.est_complete_time || '未设置' }}</el-descriptions-item>
                <el-descriptions-item label="工单编号">{{ currentWo?.wo_no || '-' }}</el-descriptions-item>
                <el-descriptions-item label="处置部门">{{ currentWo?.dept_name || '-' }}</el-descriptions-item>
                <el-descriptions-item label="派发时间">{{ currentWo?.assign_time || '-' }}</el-descriptions-item>
                <el-descriptions-item label="完成时间">{{ currentWo?.complete_time || '-' }}</el-descriptions-item>
                <el-descriptions-item label="处置耗时">{{ currentWo?.handle_duration || 0 }}小时</el-descriptions-item>
                <el-descriptions-item label="工单ID">{{ currentWo?.dispose_wo_id || '-' }}</el-descriptions-item>
              </el-descriptions>
            </div>
          </div>
          <template #footer>
            <el-button @click="warnDetailVisible = false">关闭</el-button>
          </template>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, getCurrentInstance, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { ArrowLeft, FullScreen } from "@element-plus/icons-vue";
import screenFull from 'screenfull';
import MapCommon from "#/views/genchuan/industry/parkingmgmt/scene1501/berthOccupationMap.vue";

import {
  fetchAreaOptions,
  fetchGridOptionsByArea,
  fetchParkingOverview,
  fetchParkingRealTimeStat,
  fetchParkResourceList,
  fetchWarnTrackList,
  fetchBerthOccupyList,
  fetchDisposeWoStatus
} from '#/api/genchuan/industry/parkingmgmt/scene1501/berthOccupation.js';

const router = useRouter();
const instance = getCurrentInstance();
const pageContainerRef = ref(null);
const mapCommonRef = ref(null);

const overviewData = ref({
  city_occupy_rate: 0,
  warn_occupy_total: 0,
  overtime_occupy_count: 0,
  non_motor_occupy_count: 0,
  dispose_qualified_rate: 0,
  avg_dispose_duration: 0
});
const realTimeStatDialogVisible = ref(false);
const realTimeStatData = ref({});
const parkResourceList = ref([]);
const parkResourceDialogList = ref([]);
const geometriesArray = ref([]);
const parkResourceVisible = ref(false);
const timeFilterParams = ref({ range: 'today' });

const berthOccupyList = ref([]);
const currentWo = ref({});

const mapFilterParams = ref({
  areaCode: [],
  gridCode: '',
  abnormalType: [],
  warnStatus: []
});
const tempMapFilterParams = ref({
  areaCode: [],
  gridCode: ''
});
const areaOptions = ref([]);
const gridOptions = ref([]);
const areaFilterDialogVisible = ref(false);
const selectedAreaLevel = ref([]);

const warnTrackList = ref([]);
const warnFilterParams = ref({
  abnormalType: [],
  handleStatus: [],
  timeRange: '',
  region_code: ''
});
const warnDetailVisible = ref(false);
const currentWarn = ref(null);

const abnormalTypeList = ref([
  { value: 'overtime_occupy', label: '超时长占用' },
  { value: 'non_motor_occupy', label: '非机动占用' },
  { value: 'device_fault', label: '设备故障' }
]);
const warnStatusList = ref([
  { value: 'no_warn', label: '无预警' },
  { value: 'warning', label: '预警中' },
  { value: 'disposed', label: '已处置' }
]);

let timeTimer = null;
let overviewRefreshTimer = null;
let mapRefreshTimer = null;
let warnRefreshTimer = null;

const handleOrbitAnimation = () => {
  if (mapCommonRef.value && typeof mapCommonRef.value.toggleOrbitAnimation === 'function') {
    mapCommonRef.value.toggleOrbitAnimation();
  } else {
    ElMessage.warning('环绕功能暂未初始化完成');
  }
};

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

const selectAreaLevel = async (levelIndex, code) => {
  selectedAreaLevel.value = selectedAreaLevel.value.slice(0, levelIndex + 1);
  selectedAreaLevel.value[levelIndex] = code;

  const finalAreaCode = selectedAreaLevel.value[selectedAreaLevel.value.length - 1];
  tempMapFilterParams.value.areaCode = selectedAreaLevel.value;

  if (finalAreaCode && !getAreaChildren(finalAreaCode).length) {
    try {
      gridOptions.value = await fetchGridOptionsByArea(finalAreaCode);
    } catch (error) {
      gridOptions.value = [];
      ElMessage.error('网格数据加载失败');
    }
  } else {
    gridOptions.value = [];
    tempMapFilterParams.value.gridCode = '';
  }
};

const confirmAreaFilter = async () => {
  try {
    mapFilterParams.value.areaCode = [...tempMapFilterParams.value.areaCode];
    mapFilterParams.value.gridCode = tempMapFilterParams.value.gridCode;
    await fetchMapData();
    areaFilterDialogVisible.value = false;
    ElMessage.success('区域筛选条件已生效');
  } catch (error) {
    ElMessage.error('筛选失败，请重试');
  }
};

const resetMapFilter = () => {
  mapFilterParams.value = {
    areaCode: [],
    gridCode: '',
    abnormalType: [],
    warnStatus: []
  };
  tempMapFilterParams.value = { areaCode: [], gridCode: '' };
  selectedAreaLevel.value = [];
  gridOptions.value = [];
  fetchMapData();
  ElMessage.success('地图筛选条件已重置');
};

const fetchOverviewData = async () => {
  try {
    overviewData.value = await fetchParkingOverview(timeFilterParams.value);
  } catch (error) {
    console.error('获取核心指标失败:', error);
  }
};

const fetchMapData = async () => {
  try {
    const params = {
      regionCode: mapFilterParams.value.areaCode.length
        ? mapFilterParams.value.areaCode[mapFilterParams.value.areaCode.length - 1]
        : undefined,
      gridId: mapFilterParams.value.gridCode || undefined,
      abnormalType: mapFilterParams.value.abnormalType.length ? mapFilterParams.value.abnormalType.join(',') : undefined,
      warnStatus: mapFilterParams.value.warnStatus.length ? mapFilterParams.value.warnStatus.join(',') : undefined
    };
    const parkData = await fetchParkResourceList(params);
    parkResourceList.value = parkData;
    geometriesArray.value = parkData;
    const occupyData = await fetchBerthOccupyList(params);
    berthOccupyList.value = occupyData;
  } catch (error) {
    console.error('获取地图点位数据失败:', error);
    ElMessage.error('地图数据加载失败，请刷新页面重试');
  }
};

const fetchWarnTrackData = async () => {
  try {
    const requestParams = {
      region_code: warnFilterParams.value.region_code || undefined,
      abnormal_type: warnFilterParams.value.abnormalType.length ? warnFilterParams.value.abnormalType.join(',') : undefined,
      handle_status: warnFilterParams.value.handleStatus.length ? warnFilterParams.value.handleStatus.join(',') : undefined,
      time_range: warnFilterParams.value.timeRange || undefined
    };
    warnTrackList.value = await fetchWarnTrackList(requestParams);
  } catch (error) {
    console.error('获取预警追踪列表失败:', error);
    ElMessage.error('预警列表数据加载失败，请重试');
  }
};

const fetchAreaData = async () => {
  try {
    areaOptions.value = await fetchAreaOptions();
  } catch (error) {
    areaOptions.value = [];
    ElMessage.error('行政区划数据加载失败');
  }
};

const showParkResourceList = async () => {
  parkResourceVisible.value = true;
  try {
    parkResourceDialogList.value = await fetchParkResourceList({});
    berthOccupyList.value = await fetchBerthOccupyList({});
  } catch (error) {
    parkResourceDialogList.value = [];
    berthOccupyList.value = [];
    ElMessage.error('加载停车场数据失败：' + error.message);
  }
};

const openRealTimeStatDialog = async () => {
  try {
    realTimeStatData.value = await fetchParkingRealTimeStat(timeFilterParams.value);
    realTimeStatDialogVisible.value = true;
  } catch (error) {
    console.error('获取停车实时统计数据失败:', error);
    ElMessage.error('获取数据失败，请稍后重试');
  }
};

const getAbnormalTypeName = (type) => {
  if (!type) return '-';
  const item = abnormalTypeList.value.find(i => i.value === type);
  return item?.label || '未知异常';
};

const getAbnormalTypeTagType = (type) => {
  switch (type) {
    case 'overtime_occupy': return 'danger';
    case 'non_motor_occupy': return 'warning';
    case 'device_fault': return 'info';
    default: return 'success';
  }
};

const getWarnStatusText = (status) => {
  if (!status) return '-';
  const item = warnStatusList.value.find(i => i.value === status);
  return item?.label || '未知状态';
};

const getWarnStatusTagType = (status) => {
  switch (status) {
    case 'no_warn': return 'success';
    case 'warning': return 'danger';
    case 'disposed': return 'info';
    default: return 'info';
  }
};

const filteredWarnList = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStart = today.getTime();

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStart = yesterday.getTime();

  const weekStart = new Date(today);
  const day = today.getDay() || 7;
  weekStart.setDate(weekStart.getDate() - day + 1);
  weekStart.setHours(0, 0, 0, 0);
  const weekStartStart = weekStart.getTime();

  return warnTrackList.value.filter(item => {
    const matchType = !warnFilterParams.value.abnormalType.length || warnFilterParams.value.abnormalType.includes(item.abnormal_type);
    const matchStatus = !warnFilterParams.value.handleStatus.length || warnFilterParams.value.handleStatus.includes(item.handle_status);
    let matchTime = true;

    if (warnFilterParams.value.timeRange && item.create_time) {
      const warnDate = new Date(item.create_time);
      const warnTime = warnDate.getTime();

      switch (warnFilterParams.value.timeRange) {
        case 'today': matchTime = warnTime >= todayStart; break;
        case 'yesterday': matchTime = warnTime >= yesterdayStart && warnTime < todayStart; break;
        case 'week': matchTime = warnTime >= weekStartStart; break;
        default: matchTime = true;
      }
    }
    return matchType && matchStatus && matchTime;
  });
});

const getWarnTypeTagType = (type) => {
  switch (type) {
    case 'overtime_occupy': return 'danger';
    case 'non_motor_occupy': return 'warning';
    case 'device_fault': return 'info';
    default: return 'success';
  }
};

const getWarnTypeName = (type) => {
  if (!type) return '-';
  const item = abnormalTypeList.value.find(i => i.value === type);
  return item?.label || '未知类型';
};

const getStatusTagType = (status) => {
  switch (status) {
    case 'unhandled': return 'danger';
    case 'handling': return 'info';
    case 'completed': return 'success';
    case 'closed': return 'warning';
    default: return 'default';
  }
};

const getStatusName = (status) => {
  if (!status) return '-';
  switch (status) {
    case 'unhandled': return '未处置';
    case 'handling': return '处置中';
    case 'completed': return '已完成';
    case 'closed': return '已关闭';
    default: return '未知状态';
  }
};

const getProgressColor = (progress) => {
  progress = progress || 0;
  if (progress < 30) return '#ff4d6d';
  if (progress < 70) return '#f7931e';
  return '#38b000';
};

const clickFullscreen = () => {
  if (!screenFull.isEnabled) {
    ElMessage.warning('您的浏览器不支持全屏功能');
    return;
  }
  const targetEl = pageContainerRef.value;
  screenFull.isFullscreen ? screenFull.exit() : screenFull.request(targetEl);
};

let currentFullscreenPanel = null;

const handleFullscreenChange = () => {
  if (!screenFull.isFullscreen && currentFullscreenPanel) {
    currentFullscreenPanel.style.width = '';
    currentFullscreenPanel.style.maxWidth = '';
    currentFullscreenPanel.style.overflow = 'hidden';
    window.dispatchEvent(new Event('resize'));
    screenFull.off('change', handleFullscreenChange);
    currentFullscreenPanel = null;
  }
};

const togglePanelFullscreen = (panelRefName) => {
  if (!screenFull.isEnabled) {
    ElMessage.warning('您的浏览器不支持全屏功能');
    return;
  }
  const panel = instance?.refs[panelRefName];
  if (!panel) {
    ElMessage.error('未找到面板元素');
    return;
  }

  if (currentFullscreenPanel) {
    screenFull.off('change', handleFullscreenChange);
  }
  currentFullscreenPanel = panel;

  if (screenFull.isFullscreen && document.fullscreenElement === panel) {
    screenFull.exit();
  } else {
    screenFull.on('change', handleFullscreenChange);
    screenFull.request(panel).catch(err => {
      ElMessage.error(`全屏失败：${err.message}`);
    });
  }
};

const handleBack = () => {
  router.push('/');
};

const handleWarnRowClick = async (row) => {
  currentWarn.value = row;
  try {
    const woData = await fetchDisposeWoStatus({ mon_id: row.mon_id });
    currentWo.value = woData;
  } catch (error) {
    currentWo.value = {};
    console.error('获取工单详情失败:', error);
  }
  warnDetailVisible.value = true;
};

const initData = async () => {
  await Promise.all([
    fetchOverviewData(),
    fetchAreaData(),
    fetchMapData(),
    fetchWarnTrackData()
  ]);
};

watch([() => mapFilterParams.value], ([newVal]) => {
  fetchMapData();
  tempMapFilterParams.value.areaCode = [...newVal.areaCode];
  tempMapFilterParams.value.gridCode = newVal.gridCode;
  selectedAreaLevel.value = [...newVal.areaCode];
}, { deep: true, immediate: true });

const updateShowTime = () => {
  const dt = new Date();
  const y = dt.getFullYear();
  const mt = dt.getMonth() + 1;
  const day = dt.getDate();
  const h = dt.getHours().toString().padStart(2, '0');
  const m = dt.getMinutes().toString().padStart(2, '0');
  const s = dt.getSeconds().toString().padStart(2, '0');

  const showTimeEl = document.querySelector(".showTime");
  if (showTimeEl) {
    showTimeEl.innerHTML = `当前时间：${y}年${mt}月${day}日 ${h}时${m}分${s}秒`;
  }
};

onMounted(async () => {
  await initData();

  updateShowTime();
  timeTimer = setInterval(updateShowTime, 1000);

  overviewRefreshTimer = setInterval(fetchOverviewData, 30000);
  warnRefreshTimer = setInterval(fetchWarnTrackData, 30000);
  mapRefreshTimer = setInterval(fetchMapData, 300000);
});

onUnmounted(() => {
  if (timeTimer) clearInterval(timeTimer);
  if (overviewRefreshTimer) clearInterval(overviewRefreshTimer);
  if (mapRefreshTimer) clearInterval(mapRefreshTimer);
  if (warnRefreshTimer) clearInterval(warnRefreshTimer);
  screenFull.off('change', handleFullscreenChange);
  currentFullscreenPanel = null;
});
</script>

<style lang="scss" scoped>
@import '#/views/genchuan/industry/templatesstyle/common-styles.scss';
@import '#/views/genchuan/industry/templatesstyle/key-metrics-dashboard.scss';
@import '#/views/genchuan/industry/templatesstyle/global-data-map.scss';
@import '#/views/genchuan/industry/templatesstyle/event-alert-tracking.scss';

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
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: 2%;
}

.left_top {
  height: 25%;
  box-sizing: border-box;
}

.left_bottom {
  height: 75%;
  box-sizing: border-box;
}

.right {
  flex: 2;
  box-sizing: border-box;
}
</style>
