<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElImage } from 'element-plus';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});

const { detailObj, title } = toRefs(props);

const drawerTitle = computed(() => {
  const name = detailObj.value?.planNo || '清扫计划';
  return title.value || `${name}详情`;
});

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 900,
  onCancel: () => detailDrawerApi.close(),
});

defineExpose({ open: () => detailDrawerApi.open(), close: () => detailDrawerApi.close() });

// 辅助函数：格式化数组
const formatArray = (arr) => {
  if (Array.isArray(arr)) return arr.join(', ');
  return arr || '-';
};

// 解析照片字段（JSON 数组或逗号分隔）
const parsePhotoList = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // 忽略解析错误
    }
    if (value.includes(',')) {
      return value.split(',').map(url => url.trim());
    }
    return [value];
  }
  return [];
};

// 上报照片列表（来自 checkPhotoUrl）
const reportPhotoList = computed(() => {
  return detailObj.value?.photoUrlList || parsePhotoList(detailObj.value?.checkPhotoUrl);
});

// 核查照片列表（来自 reviewPhotoUrl）
const reviewPhotoList = computed(() => {
  return parsePhotoList(detailObj.value?.reviewPhotoUrl);
});
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <!-- 基础信息（始终显示） -->
      <div class="detail-section">📋 清扫计划基础信息</div>
      <div class="detail-card-row">
        <div class="detail-row-left">清扫计划编号：</div>
        <div class="detail-row-right">{{ detailObj.planNo || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">清扫路段：</div>
        <div class="detail-row-right">{{ detailObj.roadName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">责任区域：</div>
        <div class="detail-row-right">{{ detailObj.areaName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">清扫频次：</div>
        <div class="detail-row-right">{{ detailObj.frequency || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">清扫时段：</div>
        <div class="detail-row-right">{{ detailObj.timePeriod || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">负责人员：</div>
        <div class="detail-row-right">{{ formatArray(detailObj.staffsName) }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">计划状态：</div>
        <div class="detail-row-right">{{ detailObj.planStatusName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">清扫工具：</div>
        <div class="detail-row-right">{{ formatArray(detailObj.toolsName) }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">清扫标准：</div>
        <div class="detail-row-right">{{ detailObj.standard || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">质量达标率：</div>
        <div class="detail-row-right">{{ detailObj.qualityRate ?? '-' }}%</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">问题处置数：</div>
        <div class="detail-row-right">{{ detailObj.problemCount ?? '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">考勤全勤率：</div>
        <div class="detail-row-right">{{ detailObj.attendanceRate ?? '-' }}%</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">是否生效：</div>
        <div class="detail-row-right">{{ detailObj.isEffective === '是' ? '是' : '否' }}</div>
      </div>

      <!-- 清扫待执行特有信息 -->
      <template v-if="detailObj.planStatusName === '未开始' || detailObj.planStatusName === '清扫待执行'">
        <div class="detail-section">🧹 清扫计划详情</div>
        <div class="detail-card-row">
          <div class="detail-row-left">创建人：</div>
          <div class="detail-row-right">{{ detailObj.creator || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">创建时间：</div>
          <div class="detail-row-right">{{ detailObj.createTime || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">更新时间：</div>
          <div class="detail-row-right">{{ detailObj.updateTime || '-' }}</div>
        </div>
      </template>

      <!-- 作业进行中特有信息 -->
      <template v-else-if="detailObj.planStatusName === '进行中' || detailObj.planStatusName === '作业进行中'">
        <div class="detail-section">🚜 作业实时信息</div>
        <div class="detail-card-row">
          <div class="detail-row-left">到岗时间：</div>
          <div class="detail-row-right">{{ detailObj.checkinTime || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">当前进度：</div>
          <div class="detail-row-right">{{ detailObj.progress ?? '-' }}%</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">作业状态：</div>
          <div class="detail-row-right">{{ detailObj.operationStatus || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">轨迹覆盖：</div>
          <div class="detail-row-right">{{ detailObj.trackCoverage || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">最新上报时间：</div>
          <div class="detail-row-right">{{ detailObj.lastReportTime || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">是否异常：</div>
          <div class="detail-row-right">{{ detailObj.isAbnormal === '是' ? '是' : '否' }}</div>
        </div>
      </template>

      <!-- 质量待核查信息（根据 reviewStatus 判断） -->
      <template v-if="detailObj.reviewStatus === '待核查' || detailObj.reviewStatus === '不达标'">
        <div class="detail-section">🔍 质量核查信息</div>
        <div class="detail-card-row">
          <div class="detail-row-left">作业完成时间：</div>
          <div class="detail-row-right">{{ detailObj.completeTime || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">上报照片：</div>
          <div class="detail-row-right">
            <div v-if="reportPhotoList.length" class="photo-list">
              <el-image
                v-for="(url, idx) in reportPhotoList"
                :key="idx"
                :src="url"
                :preview-src-list="reportPhotoList"
                fit="cover"
                style="width: 80px; height: 80px; border-radius: 4px; cursor: pointer;"
                :preview-teleported="true"
              />
            </div>
            <span v-else>-</span>
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">清扫工具：</div>
          <div class="detail-row-right">{{ formatArray(detailObj.toolsName) }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">核查照片：</div>
          <div class="detail-row-right">
            <div v-if="reviewPhotoList.length" class="photo-list">
              <el-image
                v-for="(url, idx) in reviewPhotoList"
                :key="idx"
                :src="url"
                :preview-src-list="reviewPhotoList"
                fit="cover"
                style="width: 80px; height: 80px; border-radius: 4px; cursor: pointer;"
                :preview-teleported="true"
              />
            </div>
            <span v-else>-</span>
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">核查状态：</div>
          <div class="detail-row-right">{{ detailObj.reviewStatus || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">核查人员：</div>
          <div class="detail-row-right">{{ detailObj.reviewByName || detailObj.reviewBy || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">核查时间：</div>
          <div class="detail-row-right">{{ detailObj.reviewTime || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">整改要求：</div>
          <div class="detail-row-right">{{ detailObj.reformRequire || '-' }}</div>
        </div>
      </template>

      <!-- 已完成信息（当计划状态为已完成且没有质量核查信息时显示） -->
      <template v-else-if="detailObj.planStatusName === '已完成'">
        <div class="detail-section">✅ 已完成任务信息</div>
        <div class="detail-card-row">
          <div class="detail-row-left">完成时间：</div>
          <div class="detail-row-right">{{ detailObj.completeTime || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">质量核查结果：</div>
          <div class="detail-row-right">{{ detailObj.reviewStatus || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">问题处置情况：</div>
          <div class="detail-row-right">{{ detailObj.problemHandleDesc || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">清扫完成率：</div>
          <div class="detail-row-right">{{ detailObj.completionRate ?? '-' }}%</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">质量达标率：</div>
          <div class="detail-row-right">{{ detailObj.qualityRate ?? '-' }}%</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">问题处置及时率：</div>
          <div class="detail-row-right">{{ detailObj.problemHandleRate ?? '-' }}%</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">统计周期：</div>
          <div class="detail-row-right">{{ detailObj.statPeriod || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">复盘意见：</div>
          <div class="detail-row-right">{{ detailObj.reviewDesc || '-' }}</div>
        </div>
      </template>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
@media (max-width: 768px) {
  .detail-row-left {
    width: 180px;
  }
  .detail-card {
    min-height: 600px;
    max-height: 80vh;
    padding: 15px;
  }
}

.detail-card {
  min-height: 750px;
  max-height: 85vh;
  padding: 20px;
  overflow-y: auto;
  background-color: #f9fafb;
  border-radius: 8px;
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
    padding-right: 8px;
    padding-left: 8px;
    margin-right: -8px;
    margin-left: -8px;
    background-color: #f5f7fa;
    border-radius: 4px;
    transition: all 0.2s ease;
  }
}

.detail-row-left {
  flex-shrink: 0;
  width: 200px;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  color: #606266;
}

.detail-row-right {
  flex: 1;
  padding-right: 10px;
  font-size: 14px;
  line-height: 18px;
  color: #303133;
  word-break: break-all;
}

.detail-section {
  font-weight: 600;
  font-size: 16px;
  margin: 16px 0 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid #e0e0e0;
  color: #6E7E91;

  &:first-child {
    margin-top: 0;
  }
}

.detail-card::-webkit-scrollbar {
  width: 6px;
}

.detail-card::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.detail-card::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 3px;
}

.detail-card::-webkit-scrollbar-thumb:hover {
  background: #c0c4cc;
}

.photo-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
