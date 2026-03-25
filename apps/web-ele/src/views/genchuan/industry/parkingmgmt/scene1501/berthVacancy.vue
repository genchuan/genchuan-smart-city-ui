<template>
  <div class="page-container" ref="pageContainerRef">
    <div class="header-box">
      <button class="back-button" @click="handleBack">
        <el-icon color="#00ccff" :size="`${1.2}vw`">
          <ArrowLeft />
        </el-icon>
      </button>
      <span class="head-name">
        泊位空置监测
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
                  <el-radio label="month">近30日</el-radio>
                </el-radio-group>
              </div>
            </div>
          </div>
          <div class="stats-cards">
            <div class="stat-card rate-card" :class="overviewData.city_vacant_rate > 40 ? 'danger-rate' : 'normal-rate'" @click="openRealTimeStatDialog">
              <div class="stat-title">全城空置泊位率</div>
              <div class="stat-value">{{ overviewData.city_vacant_rate }}%</div>
            </div>
            <div class="stat-card warning-card" :class="{ pulse: overviewData.warn_vacant_count > 0 }" @click="openRealTimeStatDialog">
              <div class="stat-title">预警空置泊位数</div>
              <div class="stat-value">{{ overviewData.warn_vacant_count }}</div>
              <div class="stat-desc">故障导致空置: {{ overviewData.fault_vacant_count }} 个</div>
            </div>
            <div class="stat-card abnormal-card" @click="openRealTimeStatDialog">
              <div class="stat-title">规划调整空置数</div>
              <div class="stat-value">{{ overviewData.adjust_vacant_count }}</div>
              <div class="stat-desc">核查合格率: {{ overviewData.verify_qualified_rate }}%</div>
            </div>
            <div class="stat-card dispose-card" @click="openRealTimeStatDialog">
              <div class="stat-title">平均修复时长</div>
              <div class="stat-value">{{ overviewData.avg_repair_duration }}分钟</div>
              <div class="stat-desc">复核合格率: {{ overviewData.review_qualified_rate }}%</div>
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
                <div class="checkbox-group compact-group">
                  <el-checkbox-group
                    v-model="mapFilterParams.checkResult"
                    size="small"
                    @change="fetchMapData"
                    class="checkbox-items"
                  >
                    <el-checkbox label="normal">正常</el-checkbox>
                    <el-checkbox label="fault">故障</el-checkbox>
                    <el-checkbox label="adjust">规划调整</el-checkbox>
                  </el-checkbox-group>
                </div>
                <div class="vacant-duration-filter">
                  <el-input
                    v-model="mapFilterParams.minDuration"
                    size="small"
                    placeholder="空置时长≥(分钟)"
                    type="number"
                    style="width: 120px;"
                    @change="fetchMapData"
                  />
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
                <el-table-column prop="free_space" label="空闲泊位数" />
                <el-table-column prop="vacant_space" label="空置泊位数" />
                <el-table-column prop="vacant_endure" label="空置时长" />
                <el-table-column prop="warn_status" label="预警状态">
                  <template #default="scope">
                    <el-tag :type="getWarnStatusTagType(scope.row.warn_status)">
                      {{ getWarnStatusText(scope.row.warn_status) }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="check_result" label="核查结果">
                  <template #default="scope">
                    <el-tag :type="getCheckResultTagType(scope.row.check_result)">
                      {{ getCheckResultText(scope.row.check_result) }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="coord_x" label="坐标X" />
                <el-table-column prop="coord_y" label="坐标Y" />
                <el-table-column prop="region_name" label="区域名称" />
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
            <p>异常预警视图</p>
          </div>
          <div class="actions-right">
            <div class="map-filter-group top-filter">
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
                  v-model="warnFilterParams.warnStatus"
                  size="small"
                  @change="fetchWarnTrackData"
                  class="checkbox-items"
                >
                  <el-checkbox label="no_warn">无预警</el-checkbox>
                  <el-checkbox label="warning">预警中</el-checkbox>
                  <el-checkbox label="disposed">已处置</el-checkbox>
                  <el-checkbox label="closed">已关闭</el-checkbox>
                </el-checkbox-group>
              </div>
              <div class="checkbox-group compact-group">
                <el-checkbox-group
                  v-model="warnFilterParams.repairStatus"
                  size="small"
                  @change="fetchWarnTrackData"
                  class="checkbox-items"
                >
                  <el-checkbox label="unhandled">未处理</el-checkbox>
                  <el-checkbox label="repairing">维修中</el-checkbox>
                  <el-checkbox label="completed">已完成</el-checkbox>
                  <el-checkbox label="not_need">无需维修</el-checkbox>
                </el-checkbox-group>
              </div>
              <div class="checkbox-group compact-group">
                <el-checkbox-group
                  v-model="warnFilterParams.reviewResult"
                  size="small"
                  @change="fetchWarnTrackData"
                  class="checkbox-items"
                >
                  <el-checkbox label="pending">待复核</el-checkbox>
                  <el-checkbox label="pass">复核通过</el-checkbox>
                  <el-checkbox label="reject">复核驳回</el-checkbox>
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
            <el-table-column prop="berth_id" label="泊位ID" />
            <el-table-column prop="berth_pos" label="泊位位置" />
            <el-table-column prop="vacant_endure" label="空置时长" />
            <el-table-column prop="warn_status" label="预警状态">
              <template #default="scope">
                <el-tag :type="getWarnStatusTagType(scope.row.warn_status)">
                  {{ getWarnStatusText(scope.row.warn_status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="check_result" label="核查结果">
              <template #default="scope">
                <el-tag :type="getCheckResultTagType(scope.row.check_result)">
                  {{ getCheckResultText(scope.row.check_result) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="repair_status" label="维修状态">
              <template #default="scope">
                <el-tag :type="getRepairStatusTagType(scope.row.repair_status)">
                  {{ getRepairStatusText(scope.row.repair_status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="review_result" label="复核结果">
              <template #default="scope">
                <el-tag :type="getReviewResultTagType(scope.row.review_result)">
                  {{ getReviewResultText(scope.row.review_result) }}
                </el-tag>
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
              <h3>空置预警工单详情</h3>
              <el-descriptions column="2" border>
                <el-descriptions-item label="泊位ID">{{ currentWarn?.berth_id || '-' }}</el-descriptions-item>
                <el-descriptions-item label="泊位位置">{{ currentWarn?.berth_pos || '-' }}</el-descriptions-item>
                <el-descriptions-item label="空置时长(分钟)">{{ currentWarn?.vacant_endure || 0 }}</el-descriptions-item>
                <el-descriptions-item label="预警状态">{{ getWarnStatusText(currentWarn?.warn_status) }}</el-descriptions-item>
                <el-descriptions-item label="核查结果">{{ getCheckResultText(currentWarn?.check_result) }}</el-descriptions-item>
                <el-descriptions-item label="维修状态">{{ getRepairStatusText(currentWarn?.repair_status) }}</el-descriptions-item>
                <el-descriptions-item label="维修人">{{ currentWarn?.repair_name || '未分配' }}</el-descriptions-item>
                <el-descriptions-item label="复核结果">{{ getReviewResultText(currentWarn?.review_result) }}</el-descriptions-item>
                <el-descriptions-item label="预计恢复时间">{{ currentWarn?.est_recover_time || '未设置' }}</el-descriptions-item>
                <el-descriptions-item label="维修工单ID">{{ currentRepairWo?.repair_wo_id || '-' }}</el-descriptions-item>
                <el-descriptions-item label="工单编号">{{ currentRepairWo?.wo_no || '-' }}</el-descriptions-item>
                <el-descriptions-item label="维修部门">{{ currentRepairWo?.dept_name || '-' }}</el-descriptions-item>
                <el-descriptions-item label="派单时间">{{ currentRepairWo?.assign_time || '-' }}</el-descriptions-item>
                <el-descriptions-item label="维修耗时(小时)">{{ currentRepairWo?.repair_duration || 0 }}</el-descriptions-item>
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
import MapCommon from "#/views/genchuan/industry/parkingmgmt/scene1501/berthVacancyMap.vue";

import {
  fetchAreaOptions,
  fetchGridOptionsByArea,
  fetchParkingOverview,
  fetchParkingRealTimeStat,
  fetchParkResourceList,
  fetchWarnTrackList,
  fetchBerthVacantList,
  fetchRepairWoStatus
} from '#/api/genchuan/industry/parkingmgmt/scene1501/berthVacancy.js';

const router = useRouter();
const instance = getCurrentInstance();
const pageContainerRef = ref(null);
const mapCommonRef = ref(null);

const overviewData = ref({
  city_vacant_rate: 0,
  warn_vacant_count: 0,
  fault_vacant_count: 0,
  adjust_vacant_count: 0,
  verify_qualified_rate: 0,
  avg_repair_duration: 0,
  review_qualified_rate: 0
});
const realTimeStatDialogVisible = ref(false);
const realTimeStatData = ref({});
const parkResourceList = ref([]);
const parkResourceDialogList = ref([]);
const geometriesArray = ref([]);
const parkResourceVisible = ref(false);
const timeFilterParams = ref({ range: 'today' });

const berthVacantList = ref([]);
const currentRepairWo = ref({});

const mapFilterParams = ref({
  areaCode: [],
  gridCode: '',
  warnStatus: [],
  checkResult: [],
  minDuration: ''
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
  warnStatus: [],
  repairStatus: [],
  reviewResult: [],
  region_code: ''
});
const warnDetailVisible = ref(false);
const currentWarn = ref(null);

const warnStatusList = ref([
  { value: 'no_warn', label: '无预警' },
  { value: 'warning', label: '预警中' },
  { value: 'disposed', label: '已处置' },
  { value: 'closed', label: '已关闭' }
]);
const checkResultList = ref([
  { value: 'normal', label: '正常' },
  { value: 'fault', label: '故障' },
  { value: 'adjust', label: '规划调整' }
]);
const repairStatusList = ref([
  { value: 'unhandled', label: '未处理' },
  { value: 'repairing', label: '维修中' },
  { value: 'completed', label: '已完成' },
  { value: 'not_need', label: '无需维修' }
]);
const reviewResultList = ref([
  { value: 'pending', label: '待复核' },
  { value: 'pass', label: '复核通过' },
  { value: 'reject', label: '复核驳回' }
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
    warnStatus: [],
    checkResult: [],
    minDuration: ''
  };
  tempMapFilterParams.value = {
    areaCode: [],
    gridCode: ''
  };
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
      warnStatus: mapFilterParams.value.warnStatus.length ? mapFilterParams.value.warnStatus.join(',') : undefined,
      checkResult: mapFilterParams.value.checkResult.length ? mapFilterParams.value.checkResult.join(',') : undefined,
      minDuration: mapFilterParams.value.minDuration || undefined
    };
    const parkData = await fetchParkResourceList(params);
    parkResourceList.value = parkData;
    geometriesArray.value = parkData;
    berthVacantList.value = await fetchBerthVacantList(params);
  } catch (error) {
    console.error('获取地图点位数据失败:', error);
    ElMessage.error('地图数据加载失败，请刷新页面重试');
  }
};

const fetchWarnTrackData = async () => {
  try {
    const requestParams = {
      region_code: warnFilterParams.value.region_code || undefined,
      warn_status: warnFilterParams.value.warnStatus.length ? warnFilterParams.value.warnStatus.join(',') : undefined,
      repair_status: warnFilterParams.value.repairStatus.length ? warnFilterParams.value.repairStatus.join(',') : undefined,
      review_result: warnFilterParams.value.reviewResult.length ? warnFilterParams.value.reviewResult.join(',') : undefined
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
  } catch (error) {
    parkResourceDialogList.value = [];
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
    case 'closed': return 'warning';
    default: return 'info';
  }
};

const getCheckResultText = (result) => {
  if (!result) return '-';
  const item = checkResultList.value.find(i => i.value === result);
  return item?.label || '未知结果';
};

const getCheckResultTagType = (result) => {
  switch (result) {
    case 'normal': return 'success';
    case 'fault': return 'danger';
    case 'adjust': return 'warning';
    default: return 'info';
  }
};

const getRepairStatusText = (status) => {
  if (!status) return '-';
  const item = repairStatusList.value.find(i => i.value === status);
  return item?.label || '未知状态';
};

const getRepairStatusTagType = (status) => {
  switch (status) {
    case 'unhandled': return 'danger';
    case 'repairing': return 'info';
    case 'completed': return 'success';
    case 'not_need': return 'warning';
    default: return 'default';
  }
};

const getReviewResultText = (result) => {
  if (!result) return '-';
  const item = reviewResultList.value.find(i => i.value === result);
  return item?.label || '未知结果';
};

const getReviewResultTagType = (result) => {
  switch (result) {
    case 'pending': return 'warning';
    case 'pass': return 'success';
    case 'reject': return 'danger';
    default: return 'info';
  }
};

const filteredWarnList = computed(() => {
  return warnTrackList.value.filter(item => {
    const matchWarnStatus = !warnFilterParams.value.warnStatus.length || warnFilterParams.value.warnStatus.includes(item.warn_status);
    const matchRepairStatus = !warnFilterParams.value.repairStatus.length || warnFilterParams.value.repairStatus.includes(item.repair_status);
    const matchReviewResult = !warnFilterParams.value.reviewResult.length || warnFilterParams.value.reviewResult.includes(item.review_result);
    return matchWarnStatus && matchRepairStatus && matchReviewResult;
  });
});

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
  warnDetailVisible.value = true;
  if (row.mon_id) {
    try {
      currentRepairWo.value = await fetchRepairWoStatus({ mon_id: row.mon_id });
    } catch (error) {
      console.error('获取维修工单状态失败:', error);
      currentRepairWo.value = {};
    }
  } else {
    currentRepairWo.value = {};
  }
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

.vacant-duration-filter {
  margin-left: 0.8vw;
}
</style>
