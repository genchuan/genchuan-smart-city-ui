<template>
  <div class="page-container" ref="pageContainerRef">
    <div class="header-box">
      <button class="back-button" @click="handleBack">
        <el-icon color="#00ccff" :size="`${1.2}vw`">
          <ArrowLeft />
        </el-icon>
      </button>
      <span class="head-name">
        泊位故障监测
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
            <div class="stat-card rate-card" :class="overviewData.city_fault_rate > 3 ? 'danger-rate' : 'normal-rate'" @click="openRealTimeStatDialog">
              <div class="stat-title">全城故障泊位率</div>
              <div class="stat-value">{{ overviewData.city_fault_rate }}%</div>
            </div>
            <div class="stat-card warning-card" :class="{ pulse: overviewData.sensor_fault_count > 0 }" @click="openRealTimeStatDialog">
              <div class="stat-title">传感器故障数</div>
              <div class="stat-value">{{ overviewData.sensor_fault_count }}</div>
              <div class="stat-desc">设施损坏数: {{ overviewData.facility_damage_count }} 个</div>
            </div>
            <div class="stat-card abnormal-card" @click="openRealTimeStatDialog">
              <div class="stat-title">维修合格率</div>
              <div class="stat-value">{{ overviewData.repair_qualified_rate }}%</div>
              <div class="stat-desc">严重故障占比: {{ overviewData.serious_fault_ratio }}%</div>
            </div>
            <div class="stat-card dispose-card" @click="openRealTimeStatDialog">
              <div class="stat-title">平均修复时长</div>
              <div class="stat-value">{{ overviewData.avg_repair_duration }}分钟</div>
              <div class="stat-desc">核查合格率: {{ overviewData.verify_qualified_rate }}%</div>
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
                <el-button
                  round
                  size="small"
                  @click="showBerthFaultList"
                  class="map-btn"
                >
                  故障监测数据
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
                    v-model="mapFilterParams.faultType"
                    size="small"
                    @change="fetchMapData"
                    class="checkbox-items"
                  >
                    <el-checkbox label="车牌识别故障">车牌识别故障</el-checkbox>
                    <el-checkbox label="地感线圈故障">地感线圈故障</el-checkbox>
                    <el-checkbox label="泊位显示屏故障">泊位显示屏故障</el-checkbox>
                    <el-checkbox label="计费系统故障">计费系统故障</el-checkbox>
                    <el-checkbox label="道闸控制故障">道闸控制故障</el-checkbox>
                    <el-checkbox label="网络通信故障">网络通信故障</el-checkbox>
                  </el-checkbox-group>
                </div>
                <div class="checkbox-group compact-group">
                  <el-checkbox-group
                    v-model="mapFilterParams.faultLevel"
                    size="small"
                    @change="fetchMapData"
                    class="checkbox-items"
                  >
                    <el-checkbox label="轻微故障">轻微故障</el-checkbox>
                    <el-checkbox label="中度故障">中度故障</el-checkbox>
                    <el-checkbox label="严重故障">严重故障</el-checkbox>
                    <el-checkbox label="完全故障">完全故障</el-checkbox>
                  </el-checkbox-group>
                </div>
                <div class="checkbox-group compact-group">
                  <el-checkbox-group
                    v-model="mapFilterParams.repairProgress"
                    size="small"
                    @change="fetchMapData"
                    class="checkbox-items"
                  >
                    <el-checkbox label="0-30%">待维修</el-checkbox>
                    <el-checkbox label="30-70%">维修中</el-checkbox>
                    <el-checkbox label="70-100%">即将完成</el-checkbox>
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
          <berth-fault-map
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
                <el-table-column prop="fault_space_count" label="故障泊位数" />
                <el-table-column prop="fault_type" label="故障类型">
                  <template #default="scope">
                    <el-tag :type="getFaultTypeTagType(scope.row.fault_type)">
                      {{ scope.row.fault_type }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="fault_level" label="故障等级">
                  <template #default="scope">
                    <el-tag :type="getFaultLevelTagType(scope.row.fault_level)">
                      {{ scope.row.fault_level }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="repair_progress" label="维修进度"/>
                <el-table-column prop="coord_x" label="坐标X" />
                <el-table-column prop="coord_y" label="坐标Y" />
                <el-table-column prop="region_name" label="区域名称" />
                <el-table-column prop="grid_name" label="网格名称" />
                <el-table-column prop="grid_id" label="网格ID" />
                <el-table-column prop="region_code" label="区域编码" />
              </el-table>
            </div>
            <template #footer>
              <el-button @click="parkResourceVisible = false">关闭</el-button>
            </template>
          </el-dialog>
          <el-dialog
            v-model="berthFaultVisible"
            width="70%"
            class="berth-fault-dialog"
            title="故障监测数据"
          >
            <div style="width: 100%; overflow-x: auto;">
              <el-table
                :data="berthFaultDialogList"
                border
                size="small"
                style="width: 100%;"
                :empty-text="berthFaultDialogList.length === 0 ? '暂无故障监测数据' : ''"
              >
                <el-table-column prop="mon_id" label="监测ID" />
                <el-table-column prop="berth_id" label="泊位ID" />
                <el-table-column prop="berth_name" label="泊位名称" />
                <el-table-column prop="berth_pos" label="泊位位置" />
                <el-table-column prop="fault_status" label="故障状态">
                  <template #default="scope">
                    <el-tag :type="scope.row.fault_status === 'unhandled' ? 'danger' : 'warning'">
                      {{ scope.row.fault_status === 'unhandled' ? '未处理' : '处理中' }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="warn_status" label="预警状态">
                  <template #default="scope">
                    <el-tag :type="scope.row.warn_status === 'warning' ? 'warning' : 'success'">
                      {{ scope.row.warn_status === 'warning' ? '预警中' : '已处置' }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="repair_wo_id" label="维修工单ID" />
                <el-table-column prop="repair_time" label="维修时间" />
                <el-table-column prop="region_name" label="区域名称" />
                <el-table-column prop="grid_name" label="网格名称" />
                <el-table-column prop="fault_desc" label="故障描述" />
                <el-table-column prop="create_time" label="创建时间" />
              </el-table>
            </div>
            <template #footer>
              <el-button @click="berthFaultVisible = false">关闭</el-button>
            </template>
          </el-dialog>
        </div>
      </div>
      <div class="panel right" style="min-width: 4vw;">
        <div class="header-actions">
          <div class="actions-left">
            <p>故障预警视图</p>
          </div>
          <div class="actions-right">
            <div class="map-filter-group top-filter">
              <el-radio-group
                v-model="warnFilterParams.timeRange"
                size="small"
                @change="handleWarnTimeRangeChange"
                class="time-range-radio-group"
              >
                <el-radio label="">所有时间</el-radio>
                <el-radio label="today">今日</el-radio>
                <el-radio label="yesterday">昨日</el-radio>
                <el-radio label="week">本周</el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
        <div class="right_top" style="min-width: 4vw;">
          <div class="right_top_left" style="min-width: 2vw;">
            <ChartPie1
              :data="faultTypeData"
              :baseFontScale="1"
              title="故障类型分布"
              height="100%"
              :activeIndices="faultTypeActiveIndices"
              @pie-click="handleFaultTypePieClick"
            />
          </div>
          <div class="right_top_right" style="min-width: 2vw;">
            <ChartPie2
              :data="faultLevelData"
              :baseFontScale="1"
              title="故障等级分布"
              height="100%"
              :activeIndices="faultLevelActiveIndices"
              @pie-click="handleFaultLevelPieClick"
            />
          </div>
        </div>
        <div class="right_middle" style="min-width: 4vw;">
          <ChartBar1
            :xAxis="faultRegionXAxis"
            :series="faultRegionSeries"
            unit="起"
            title="故障区域分布"
            :baseFontScale="1"
            :activeIndices="faultRegionActiveIndices"
            @bar-click="handleFaultRegionBarClick"
          />
        </div>
        <div class="right_bottom table-scroll" style="min-width: 4vw;" ref="warnFault">
          <div class="header-actions">
            <div class="actions-left">
              <p>故障预警列表</p>
            </div>
            <div class="actions-right">
              <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('warnFault')">
                <el-icon color="#00ccff" :size="`${0.8}vw`">
                  <FullScreen />
                </el-icon>
              </button>
            </div>
          </div>
          <el-table
            ref="warnTable"
            :data="filteredFaultList"
            border
            size="small"
            style="width: 100%; max-width: 100%; table-layout: fixed;"
            @row-click="handleFaultRowClick"
            :empty-text="filteredFaultList.length === 0 ? '暂无故障预警数据' : ''"
          >
            <el-table-column prop="region_name" label="区域名称" />
            <el-table-column prop="untreated_fault_count" label="未处置故障数" />
            <el-table-column prop="fault_handle_progress" label="处置进度">
              <template #default="scope">
                <el-progress
                  :percentage="scope.row.fault_handle_progress"
                  size="small"
                  :color="getProgressColor(scope.row.fault_handle_progress)"
                  :show-text="false"
                />
              </template>
            </el-table-column>
            <el-table-column prop="serious_fault_detail" label="严重故障详情" width="300" />
          </el-table>
          <div class="panel-footer"></div>
          <el-dialog
            v-model="faultDetailVisible"
            width="50%"
            class="warn-dialog"
          >
            <div class="warn-detail">
              <div class="detail-section">
                <h3>故障工单详情</h3>
                <el-descriptions column="2" border>
                  <el-descriptions-item label="区域名称">{{ currentFault?.region_name || '-' }}</el-descriptions-item>
                  <el-descriptions-item label="故障类型">{{ currentFault?.fault_type || '-' }}</el-descriptions-item>
                  <el-descriptions-item label="故障等级">{{ currentFault?.fault_level || '-' }}</el-descriptions-item>
                  <el-descriptions-item label="未处置故障数">{{ currentFault?.untreated_fault_count || 0 }}</el-descriptions-item>
                  <el-descriptions-item label="处置进度">{{ currentFault?.fault_handle_progress || 0 }}%</el-descriptions-item>
                  <el-descriptions-item label="故障创建时间">{{ currentFault?.create_time || '-' }}</el-descriptions-item>
                  <el-descriptions-item label="严重故障详情" :span="2">
                    <div style="word-break: break-all; text-align: left;">{{ currentFault?.serious_fault_detail || '无' }}</div>
                  </el-descriptions-item>
                </el-descriptions>
              </div>
            </div>
            <template #footer>
              <el-button @click="faultDetailVisible = false">关闭</el-button>
            </template>
          </el-dialog>
        </div>
        <div class="panel-footer"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, getCurrentInstance, onMounted, onUnmounted, ref, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { ArrowLeft, FullScreen } from "@element-plus/icons-vue";
import screenFull from 'screenfull';
import BerthFaultMap from "#/views/genchuan/industry/parkingmgmt/scene1501/berthFaultMap.vue";

import ChartPie1 from "#/views/genchuan/industry/templatesstatchart/ChartPie1.vue";
import ChartPie2 from "#/views/genchuan/industry/templatesstatchart/ChartPie2.vue";
import ChartBar1 from "#/views/genchuan/industry/templatesstatchart/VerticalBar1.vue";

import {
  fetchAreaOptions,
  fetchGridOptionsByArea,
  fetchFaultOverview,
  fetchParkingRealTimeStat,
  fetchParkResourceList,
  fetchBerthFaultList,
  fetchFaultDistribution,
  fetchBerthFaultData
} from '#/api/genchuan/industry/parkingmgmt/scene1501/berthFault.js';

const router = useRouter();
const instance = getCurrentInstance();
const pageContainerRef = ref(null);
const mapCommonRef = ref(null);

const faultTypeData = ref({ legend: [], series: [{ name: '故障数', data: [] }] });
const faultLevelData = ref({ legend: [], series: [{ name: '故障数', data: [] }] });
const faultRegionXAxis = ref([]);
const faultRegionSeries = ref([{ name: '故障数', data: [] }]);

const faultTypeActiveIndices = ref([]);
const faultLevelActiveIndices = ref([]);
const faultRegionActiveIndices = ref([]);

const overviewData = ref({
  city_fault_rate: 0,
  sensor_fault_count: 0,
  facility_damage_count: 0,
  repair_qualified_rate: 0,
  avg_repair_duration: 0,
  serious_fault_ratio: 0,
  verify_qualified_rate: 0
});
const realTimeStatDialogVisible = ref(false);
const realTimeStatData = ref({});
const parkResourceList = ref([]);
const berthFaultDataList = ref([]);
const parkResourceDialogList = ref([]);
const berthFaultDialogList = ref([]);
const geometriesArray = ref([]);
const parkResourceVisible = ref(false);
const berthFaultVisible = ref(false);
const timeFilterParams = ref({ range: 'today' });

const mapFilterParams = ref({
  areaCode: [],
  gridCode: '',
  faultType: [],
  faultLevel: [],
  repairProgress: []
});
const tempMapFilterParams = ref({
  areaCode: [],
  gridCode: ''
});
const areaOptions = ref([]);
const gridOptions = ref([]);
const areaFilterDialogVisible = ref(false);
const selectedAreaLevel = ref([]);

const faultList = ref([]);
const warnFilterParams = ref({
  faultType: [],
  faultLevel: [],
  timeRange: '',
  selectedRegions: []
});
const faultDetailVisible = ref(false);
const currentFault = ref(null);

// 无用ref保留（不影响功能）
ref([
  { value: '车牌识别故障', label: '车牌识别故障' },
  { value: '地感线圈故障', label: '地感线圈故障' },
  { value: '泊位显示屏故障', label: '泊位显示屏故障' },
  { value: '计费系统故障', label: '计费系统故障' },
  { value: '道闸控制故障', label: '道闸控制故障' },
  { value: '网络通信故障', label: '网络通信故障' }
]);
ref([
  { value: '轻微故障', label: '轻微故障' },
  { value: '中度故障', label: '中度故障' },
  { value: '严重故障', label: '严重故障' },
  { value: '完全故障', label: '完全故障' }
]);

let timeTimer = null;
let overviewRefreshTimer = null;
let mapRefreshTimer = null;
let faultRefreshTimer = null;

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
    faultType: [],
    faultLevel: [],
    repairProgress: []
  };
  tempMapFilterParams.value = { areaCode: [], gridCode: '' };
  selectedAreaLevel.value = [];
  gridOptions.value = [];
  fetchMapData();
  ElMessage.success('地图筛选条件已重置');
};

const fetchOverviewData = async () => {
  try {
    overviewData.value = await fetchFaultOverview(timeFilterParams.value);
  } catch (error) {
    console.error('获取故障核心指标失败:', error);
  }
};

const fetchMapData = async () => {
  try {
    const params = {
      regionCode: mapFilterParams.value.areaCode.length
        ? mapFilterParams.value.areaCode[mapFilterParams.value.areaCode.length - 1]
        : undefined,
      gridId: mapFilterParams.value.gridCode || undefined,
      faultType: mapFilterParams.value.faultType.length ? mapFilterParams.value.faultType.join(',') : undefined,
      faultLevel: mapFilterParams.value.faultLevel.length ? mapFilterParams.value.faultLevel.join(',') : undefined,
      repairProgress: mapFilterParams.value.repairProgress.length ? mapFilterParams.value.repairProgress.join(',') : undefined
    };
    const parkData = await fetchParkResourceList(params);
    const faultData = await fetchBerthFaultData(params);
    parkResourceList.value = parkData;
    berthFaultDataList.value = faultData;
    geometriesArray.value = parkData;
  } catch (error) {
    console.error('获取故障地图点位数据失败:', error);
    ElMessage.error('地图数据加载失败，请刷新页面重试');
  }
};

const fetchFaultListData = async () => {
  try {
    const requestParams = {
      time_range: warnFilterParams.value.timeRange || undefined
    };
    faultList.value = await fetchBerthFaultList(requestParams);
  } catch (error) {
    console.error('获取故障预警列表失败:', error);
    ElMessage.error('故障列表数据加载失败，请重试');
  }
};

const fetchAllChartData = async () => {
  try {
    const distRes = await fetchFaultDistribution({ time_range: warnFilterParams.value.timeRange });

    const typeRes = distRes.type;
    faultTypeData.value = {
      legend: typeRes.labels,
      series: [{ name: '故障数', data: typeRes.data }]
    };

    const levelRes = distRes.level;
    faultLevelData.value = {
      legend: levelRes.labels,
      series: [{ name: '故障数', data: levelRes.data }]
    };

    const regionRes = distRes.region;
    faultRegionXAxis.value = regionRes.labels;
    faultRegionSeries.value = [{ name: '故障数', data: regionRes.data }];
  } catch (error) {
    console.error('获取图表数据失败:', error);
    ElMessage.error('图表数据加载失败，请重试');
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
    ElMessage.error('加载地图列表数据失败：' + error.message);
  }
};

const showBerthFaultList = async () => {
  berthFaultVisible.value = true;
  try {
    const params = {
      regionCode: mapFilterParams.value.areaCode.length
        ? mapFilterParams.value.areaCode[mapFilterParams.value.areaCode.length - 1]
        : undefined,
      gridId: mapFilterParams.value.gridCode || undefined,
      faultType: mapFilterParams.value.faultType.length ? mapFilterParams.value.faultType.join(',') : undefined,
      faultLevel: mapFilterParams.value.faultLevel.length ? mapFilterParams.value.faultLevel.join(',') : undefined
    };
    const faultData = await fetchBerthFaultData(params);
    berthFaultDialogList.value = faultData;
    console.log('故障监测数据加载成功:', faultData);
  } catch (error) {
    berthFaultDialogList.value = [];
    ElMessage.error('加载故障监测数据失败：' + error.message);
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

const getFaultTypeTagType = (type) => {
  switch (type) {
    case '车牌识别故障': return 'danger';
    case '地感线圈故障': return 'warning';
    case '泊位显示屏故障': return 'info';
    case '计费系统故障': return 'info';
    case '道闸控制故障': return 'danger';
    case '网络通信故障': return 'warning';
    default: return 'success';
  }
};

const getFaultLevelTagType = (level) => {
  switch (level) {
    case '轻微故障': return 'success';
    case '中度故障': return 'warning';
    case '严重故障': return 'danger';
    case '完全故障': return 'default';
    default: return 'info';
  }
};

const handleFaultTypePieClick = (index, data) => {
  const idx = faultTypeActiveIndices.value.findIndex(item => item === index);
  if (idx > -1) {
    faultTypeActiveIndices.value.splice(idx, 1);
    const typeIdx = warnFilterParams.value.faultType.findIndex(item => item === data.name);
    if (typeIdx > -1) {
      warnFilterParams.value.faultType.splice(typeIdx, 1);
    }
  } else {
    faultTypeActiveIndices.value.push(index);
    if (!warnFilterParams.value.faultType.includes(data.name)) {
      warnFilterParams.value.faultType.push(data.name);
    }
  }
};

const handleFaultLevelPieClick = (index, data) => {
  const idx = faultLevelActiveIndices.value.findIndex(item => item === index);
  if (idx > -1) {
    faultLevelActiveIndices.value.splice(idx, 1);
    const levelIdx = warnFilterParams.value.faultLevel.findIndex(item => item === data.name);
    if (levelIdx > -1) {
      warnFilterParams.value.faultLevel.splice(levelIdx, 1);
    }
  } else {
    faultLevelActiveIndices.value.push(index);
    if (!warnFilterParams.value.faultLevel.includes(data.name)) {
      warnFilterParams.value.faultLevel.push(data.name);
    }
  }
};

const handleFaultRegionBarClick = (index, regionName) => {
  const idx = faultRegionActiveIndices.value.findIndex(item => item === index);
  if (idx > -1) {
    faultRegionActiveIndices.value.splice(idx, 1);
    const regionIdx = warnFilterParams.value.selectedRegions.findIndex(item => item === regionName);
    if (regionIdx > -1) {
      warnFilterParams.value.selectedRegions.splice(regionIdx, 1);
    }
  } else {
    faultRegionActiveIndices.value.push(index);
    if (!warnFilterParams.value.selectedRegions.includes(regionName)) {
      warnFilterParams.value.selectedRegions.push(regionName);
    }
  }
};

const handleWarnTimeRangeChange = async () => {
  warnFilterParams.value.faultType = [];
  warnFilterParams.value.faultLevel = [];
  warnFilterParams.value.selectedRegions = [];

  await fetchAllChartData();
  await fetchFaultListData();
};

const filteredFaultList = computed(() => {
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

  return faultList.value.filter(item => {
    const matchType = !warnFilterParams.value.faultType.length || warnFilterParams.value.faultType.includes(item.fault_type);
    const matchLevel = !warnFilterParams.value.faultLevel.length || warnFilterParams.value.faultLevel.includes(item.fault_level);
    const matchRegion = !warnFilterParams.value.selectedRegions.length || warnFilterParams.value.selectedRegions.includes(item.region_name);
    let matchTime = true;
    if (warnFilterParams.value.timeRange && item.create_time) {
      const faultDate = new Date(item.create_time);
      const faultTime = faultDate.getTime();
      switch (warnFilterParams.value.timeRange) {
        case 'today': matchTime = faultTime >= todayStart; break;
        case 'yesterday': matchTime = faultTime >= yesterdayStart && faultTime < todayStart; break;
        case 'week': matchTime = faultTime >= weekStartStart; break;
        default: matchTime = true;
      }
    }
    return matchType && matchLevel && matchRegion && matchTime;
  });
});

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

const handleFaultRowClick = (row) => {
  currentFault.value = row;
  faultDetailVisible.value = true;
};

const initData = async () => {
  await Promise.all([
    fetchOverviewData(),
    fetchAreaData(),
    fetchMapData(),
    fetchFaultListData(),
    fetchAllChartData()
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
  await nextTick();
  await initData();
  updateShowTime();

  timeTimer = setInterval(updateShowTime, 1000);
  overviewRefreshTimer = setInterval(fetchOverviewData, 30000);
  faultRefreshTimer = setInterval(() => {
    fetchAllChartData();
    fetchFaultListData();
  }, 30000);
  mapRefreshTimer = setInterval(fetchMapData, 300000);
});

onUnmounted(() => {
  if (timeTimer) clearInterval(timeTimer);
  if (overviewRefreshTimer) clearInterval(overviewRefreshTimer);
  if (mapRefreshTimer) clearInterval(mapRefreshTimer);
  if (faultRefreshTimer) clearInterval(faultRefreshTimer);
  screenFull.off('change', handleFullscreenChange);
  currentFullscreenPanel = null;
});
</script>

<style lang="scss" scoped>
@import '#/views/genchuan/industry/templatesstyle/common-styles.scss';
@import '#/views/genchuan/industry/templatesstyle/key-metrics-dashboard.scss';
@import '#/views/genchuan/industry/templatesstyle/global-data-map.scss';
@import '#/views/genchuan/industry/templatesstyle/fault-warning-view.scss';

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
  box-sizing:
    border-box;
}

.left_bottom {
  height: 75%;
  box-sizing: border-box;
}

.right {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 2%;
  min-height: 0;
  box-sizing: border-box;
}

.right_top {
  flex: 3;
  box-sizing: border-box;
  display: flex;
  min-height: 0;
  border-bottom: 1px solid rgba(0, 204, 255, 0.1);
}

.right_top_left {
  flex: 1;
  height: 100%;
  box-sizing: border-box;
}

.right_top_right {
  flex: 1;
  height: 100%;
  box-sizing: border-box;
  border-left: 0.3vh solid #02a6b5;
}

.right_middle {
  flex: 3;
  box-sizing: border-box;
  min-height: 0;
}

.right_bottom {
  flex: 4;
  box-sizing: border-box;
  min-height: 0;
}
</style>
