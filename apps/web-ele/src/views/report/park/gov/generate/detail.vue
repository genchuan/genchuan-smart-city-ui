<!-- detail.vue -->
<script setup>
import { defineProps, toRefs, computed, ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElMessage } from 'element-plus';
import { templateList, areaList } from './data';

const props = defineProps({
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  title: {
    type: String,
    default: '',
  },
});

const emit = defineEmits([
  'report-no-click',
  'area-click',
  'generate-submit',
]);

const { detailObj, title } = toRefs(props);

// ---------- 详情抽屉 ----------
const timeRangeDisplay = computed(() => {
  if (detailObj.value.start_date && detailObj.value.end_date) {
    return `${detailObj.value.start_date} 至 ${detailObj.value.end_date}`;
  }
  return '-';
});

const formatDataContent = (dataContent) => {
  if (!dataContent || typeof dataContent !== 'object') return [];
  return Object.entries(dataContent).map(([key, value]) => {
    let label = '';
    let displayValue = value;

    const labelMap = {
      total_entry: '入场车流量',
      total_income: '营收总额',
      order_count: '订单数',
      avg_utilization: '平均利用率',
      peak_hours: '高峰时段',
      complaint_count: '投诉数量',
      total_spaces: '车位总数',
      free_spaces: '空闲车位',
      turnover_rate: '车位周转率',
      maintenance_count: '维护次数',
      compliance_rate: '合规率',
      accident_count: '事故数量',
      inspection_completed: '巡检完成数',
      inspection_rate: '巡检率',
      predicted_entry: '预测车流量',
      predicted_income: '预测营收',
      congestion_index: '拥堵指数',
      peak_days: '高峰日期',
      recommendations: '建议措施',
      owner_usage_rate: '业主使用率',
      visitor_ratio: '访客占比',
      avg_duration: '平均停放时长',
      satisfaction_rate: '满意度',
      consumption_link_rate: '消费关联率',
      collection_rate: '收费率',
      arrears_amount: '欠费金额',
      electronic_rate: '电子收费率',
      violation_count: '违规次数',
      peak_traffic: '高峰车流量',
      capacity_assessment: '承载力评估',
      visitor_satisfaction: '游客满意度',
      emergency_space_usage: '急救车位使用率',
      avg_wait_time: '平均等候时间',
      medical_service_link: '医疗服务关联率',
      special_rate: '特殊需求满足率',
      school_peak_hours: '上下学高峰时段',
      parking_demand_index: '停车需求指数',
      safety_assessment: '安全评估',
    };

    label = labelMap[key] || key;

    if (typeof value === 'number') {
      if (key.includes('income') || key.includes('amount')) {
        displayValue = `¥${value.toLocaleString()}`;
      } else if (key.includes('rate') || key.includes('utilization')) {
        displayValue = typeof value === 'string' ? value : `${value}%`;
      }
    } else if (Array.isArray(value)) {
      displayValue = value.join('、');
    }

    return { label, value: displayValue };
  });
};

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    detailDrawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});

// ---------- 生成报表抽屉（配置与详情抽屉完全一致，仅开启底部按钮）----------
const generateFormData = ref({
  template_name: '',
  area_code: '',
  stat_period: '日',
  time_range: [],
});

const areaOptions = computed(() =>
  areaList().map((item) => ({
    label: item.label,
    value: item.value,
  })),
);

const periodOptions = [
  { label: '日', value: '日' },
  { label: '周', value: '周' },
  { label: '月', value: '月' },
  { label: '季度', value: '季度' },
  { label: '学期', value: '学期' },
];

const [GenerateDrawer, generateDrawerApi] = useVbenDrawer({
  // 关键修改：与详情抽屉相同的位置/尺寸配置
  modal: false,
  appendToMain: true,
  footer: true,          // 生成抽屉需要底部确认/取消按钮
  title: '生成政务报表',
  onConfirm: handleGenerateConfirm,
  onCancel: () => generateDrawerApi.close(),
});

function openGenerateDrawer() {
  generateFormData.value = {
    template_name: detailObj.value.template_name || '',
    area_code: detailObj.value.area_code || '',
    stat_period: detailObj.value.stat_period || '日',
    time_range:
      detailObj.value.start_date && detailObj.value.end_date
        ? [detailObj.value.start_date, detailObj.value.end_date]
        : [],
  };
  generateDrawerApi.open();
}

async function handleGenerateConfirm() {
  if (!generateFormData.value.template_name) {
    ElMessage.warning('请选择模板');
    return false;
  }
  if (!generateFormData.value.area_code) {
    ElMessage.warning('请选择行政区域');
    return false;
  }
  if (!generateFormData.value.stat_period) {
    ElMessage.warning('请选择统计周期');
    return false;
  }

  const submitData = {
    ...generateFormData.value,
    start_date: generateFormData.value.time_range?.[0] || '',
    end_date: generateFormData.value.time_range?.[1] || '',
  };

  emit('generate-submit', submitData);
  generateDrawerApi.close();
  return true;
}

defineExpose({
  open: () => detailDrawerApi.open(),
  close: () => detailDrawerApi.close(),
  openGenerateDrawer,
});
</script>

<template>
  <!-- 详情抽屉 -->
  <DetailDrawer :title="title || `报表详情 - ${detailObj.template_name}`">
    <div class="detail-card">
      <!-- 报表编号 -->
      <div class="detail-card-row">
        <div class="detail-row-left">报表编号:</div>
        <div class="detail-row-right">
          <el-tag
            type="primary"
            size="small"
            class="cursor-pointer"
            @click="$emit('report-no-click', detailObj)"
          >
            {{ detailObj.report_no }}
          </el-tag>
        </div>
      </div>
      <!-- 模板名称 -->
      <div class="detail-card-row">
        <div class="detail-row-left">模板名称:</div>
        <div class="detail-row-right">
          <el-tag type="primary" size="small">
            {{ detailObj.template_name }}
          </el-tag>
        </div>
      </div>
      <!-- 区域名称 -->
      <div class="detail-card-row">
        <div class="detail-row-left">区域名称:</div>
        <div class="detail-row-right">
          <el-tag type="success" size="small" @click="$emit('area-click', detailObj)">
            {{ detailObj.area_name }}
          </el-tag>
          <span class="ml-2 text-gray-500 text-xs">({{ detailObj.area_code }})</span>
        </div>
      </div>
      <!-- 统计周期 -->
      <div class="detail-card-row">
        <div class="detail-row-left">统计周期:</div>
        <div class="detail-row-right">
          <el-tag
            :type="
              detailObj.stat_period === '日'
                ? 'info'
                : detailObj.stat_period === '周'
                  ? 'warning'
                  : detailObj.stat_period === '月'
                    ? 'primary'
                    : 'success'
            "
            size="small"
          >
            {{ detailObj.stat_period }}
          </el-tag>
        </div>
      </div>
      <!-- 时间范围 -->
      <div class="detail-card-row">
        <div class="detail-row-left">时间范围:</div>
        <div class="detail-row-right">
          <el-tag type="info" size="small">
            {{ timeRangeDisplay }}
          </el-tag>
        </div>
      </div>
      <!-- 报表状态 -->
      <div class="detail-card-row">
        <div class="detail-row-left">报表状态:</div>
        <div class="detail-row-right">
          <el-tag
            :type="
              detailObj.report_status === '已生成'
                ? 'success'
                : detailObj.report_status === '生成中'
                  ? 'warning'
                  : 'danger'
            "
            size="small"
          >
            {{ detailObj.report_status }}
          </el-tag>
        </div>
      </div>
      <!-- 上报状态 -->
      <div class="detail-card-row">
        <div class="detail-row-left">上报状态:</div>
        <div class="detail-row-right">
          <el-tag
            :type="
              detailObj.upload_status === '已上报'
                ? 'success'
                : detailObj.upload_status === '待上报'
                  ? 'warning'
                  : 'info'
            "
            size="small"
          >
            {{ detailObj.upload_status }}
          </el-tag>
        </div>
      </div>

      <!-- 统计数据展示 -->
      <div class="detail-card-section">
        <div class="section-title">统计数据</div>
        <div class="data-content-grid">
          <div
            v-for="item in formatDataContent(detailObj.data_content)"
            :key="item.label"
            class="data-item"
          >
            <div class="data-item-label">{{ item.label }}:</div>
            <div class="data-item-value">
              <el-tag
                :type="
                  typeof item.value === 'string' && item.value.includes('¥')
                    ? 'success'
                    : typeof item.value === 'string' && item.value.includes('%')
                      ? 'primary'
                      : 'info'
                "
                size="small"
              >
                {{ item.value }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>

      <!-- 生成时间 -->
      <div class="detail-card-row">
        <div class="detail-row-left">生成时间:</div>
        <div class="detail-row-right">{{ detailObj.generate_time }}</div>
      </div>
      <!-- 操作人 -->
      <div class="detail-card-row">
        <div class="detail-row-left">操作人:</div>
        <div class="detail-row-right">{{ detailObj.operator }}</div>
      </div>

      <!-- 生成报表按钮（位于详情卡片底部） -->
      <div class="detail-card-row generate-btn-row">
        <el-button type="primary" size="small" @click="openGenerateDrawer">
          生成报表
        </el-button>
      </div>
    </div>
  </DetailDrawer>

  <!-- 生成报表抽屉（现在与详情抽屉同位置、同尺寸） -->
  <GenerateDrawer>
    <div class="detail-card">
      <!-- 模板名称（必填） -->
      <div class="detail-card-row">
        <div class="detail-row-left">
          <span class="required-star">*</span>模板名称:
        </div>
        <div class="detail-row-right">
          <el-select
            v-model="generateFormData.template_name"
            placeholder="请选择模板"
            clearable
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="item in templateList()"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>

      <!-- 行政区域（必填） -->
      <div class="detail-card-row">
        <div class="detail-row-left">
          <span class="required-star">*</span>行政区域:
        </div>
        <div class="detail-row-right">
          <el-select
            v-model="generateFormData.area_code"
            placeholder="请选择区域"
            clearable
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="item in areaOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>

      <!-- 统计周期（必填） -->
      <div class="detail-card-row">
        <div class="detail-row-left">
          <span class="required-star">*</span>统计周期:
        </div>
        <div class="detail-row-right">
          <el-select
            v-model="generateFormData.stat_period"
            placeholder="请选择周期"
            style="width: 100%"
          >
            <el-option
              v-for="item in periodOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>

      <!-- 时间范围（非必填） -->
      <div class="detail-card-row">
        <div class="detail-row-left">时间范围:</div>
        <div class="detail-row-right">
          <el-date-picker
            v-model="generateFormData.time_range"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </div>
      </div>
    </div>
  </GenerateDrawer>
</template>

<style scoped lang="scss">
/* ========== 基础卡片布局（完全复用模板配置详情的样式） ========== */
.detail-card {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  min-height: 300px;
}

.detail-card-row {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f5f7fa;
    border-radius: 4px;
    padding-left: 8px;
    padding-right: 8px;
    margin-left: -8px;
    margin-right: -8px;
    transition: all 0.2s ease;
  }
}

.detail-row-left {
  width: 120px;
  flex-shrink: 0;
  font-weight: 500;
  color: #606266;
  font-size: 14px;
  line-height: 18px;
}

.detail-row-right {
  flex: 1;
  color: #303133;
  font-size: 14px;
  line-height: 18px;
  word-break: break-all;
  padding-right: 10px;

  &:empty::before {
    content: '-';
    color: #c0c4cc;
  }
}

/* ========== 统计数据区域（适配新风格） ========== */
.detail-card-section {
  margin: 16px 0;
  padding: 0;
  background-color: transparent;
  border: none;

  .section-title {
    font-weight: 600;
    color: #303133;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #ebeef5;
    font-size: 15px;
  }
}

/* 网格布局：四列自适应 */
.data-content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

/* 数据项卡片：蓝色左竖条、柔和背景 */
.data-item {
  display: flex;
  flex-direction: column;
  padding: 8px 12px;
  background-color: #f0f9ff;
  border-radius: 4px;
  border-left: 3px solid #409eff;
  transition: all 0.2s;

  &:hover {
    background-color: #e6f7ff;
  }

  .data-item-label {
    font-size: 12px;
    color: #409eff;
    margin-bottom: 4px;
    font-weight: 500;
  }

  .data-item-value {
    font-size: 14px;
    color: #303133;
    line-height: 1.4;
  }
}

/* ========== 生成报表按钮行（右对齐，无边框） ========== */
.generate-btn-row {
  justify-content: flex-end;
  border-bottom: none;
  margin-top: 8px;
  padding-bottom: 0;

  &:hover {
    background-color: transparent;
    margin-left: 0;
    margin-right: 0;
  }
}

/* ========== 必填星号 ========== */
.required-star {
  color: #f56c6c;
  margin-right: 4px;
}

/* ========== 生成抽屉内表单控件宽度 ========== */
:deep(.el-select),
:deep(.el-date-editor) {
  width: 100% !important;
}

/* ========== 工具类 ========== */
.cursor-pointer {
  cursor: pointer;
}
.cursor-pointer:hover {
  opacity: 0.8;
}
.ml-2 {
  margin-left: 8px;
}
.text-gray-500 {
  color: #909399;
}
.text-xs {
  font-size: 12px;
}

/* ========== 响应式适配 ========== */
@media (max-width: 768px) {
  .detail-row-left {
    width: 100px;
  }

  .data-content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
