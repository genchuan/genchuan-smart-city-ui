<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

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

defineExpose({open: () => detailDrawerApi.open(), close: () => detailDrawerApi.close()});

// 辅助函数：格式化数组
const formatArray = (arr) => {
  if (Array.isArray(arr)) return arr.join(', ');
  return arr || '-';
};
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <!-- 基础信息 -->
      <div class="detail-section">📋 清扫计划基础信息</div>
      <div class="detail-row"><span class="label">清扫计划编号：</span>{{ detailObj.planNo || '-' }}
      </div>
      <div class="detail-row"><span class="label">清扫路段：</span>{{ detailObj.roadName || '-' }}
      </div>
      <div class="detail-row"><span class="label">责任区域：</span>{{ detailObj.areaName || '-' }}
      </div>
      <div class="detail-row"><span class="label">清扫频次：</span>{{ detailObj.frequency || '-' }}
      </div>
      <div class="detail-row"><span class="label">清扫时段：</span>{{ detailObj.timePeriod || '-' }}
      </div>
      <div class="detail-row"><span
        class="label">负责人员：</span>{{ formatArray(detailObj.staffsName) }}
      </div>
      <div class="detail-row"><span class="label">计划状态：</span>{{
          detailObj.planStatusName || '-'
        }}
      </div>
      <div class="detail-row"><span
        class="label">清扫工具：</span>{{ formatArray(detailObj.toolsName) }}
      </div>
      <div class="detail-row"><span class="label">清扫标准：</span>{{ detailObj.standard || '-' }}
      </div>
      <div class="detail-row"><span class="label">质量达标率：</span>{{
          detailObj.qualityRate ?? '-'
        }}%
      </div>
      <div class="detail-row"><span class="label">问题处置数：</span>{{
          detailObj.problemCount ?? '-'
        }}
      </div>
      <div class="detail-row"><span
        class="label">考勤全勤率：</span>{{ detailObj.attendanceRate ?? '-' }}%
      </div>
      <div class="detail-row"><span
        class="label">是否生效：</span>{{ detailObj.isEffective === '是' ? '是' : '否' }}
      </div>

      <!-- 动态显示各状态特有信息 -->
      <template
        v-if="detailObj.planStatusName === '待执行' || detailObj.planStatusName === '清扫待执行'">
        <div class="detail-section">🧹 清扫计划详情</div>
        <div class="detail-row"><span class="label">创建人：</span>{{ detailObj.creator || '-' }}
        </div>
        <div class="detail-row"><span class="label">创建时间：</span>{{
            detailObj.createTime || '-'
          }}
        </div>
        <div class="detail-row"><span class="label">更新时间：</span>{{
            detailObj.updateTime || '-'
          }}
        </div>
      </template>

      <template
        v-else-if="detailObj.planStatusName === '执行中' || detailObj.planStatusName === '作业进行中'">
        <div class="detail-section">🚜 作业实时信息</div>
        <div class="detail-row"><span class="label">到岗时间：</span>{{
            detailObj.checkinTime || '-'
          }}
        </div>
        <div class="detail-row"><span class="label">当前进度：</span>{{ detailObj.progress ?? '-' }}%
        </div>
        <div class="detail-row"><span
          class="label">作业状态：</span>{{ detailObj.operationStatus || '-' }}
        </div>
        <div class="detail-row"><span
          class="label">轨迹覆盖：</span>{{ detailObj.trackCoverage || '-' }}
        </div>
        <div class="detail-row"><span
          class="label">最新上报时间：</span>{{ detailObj.lastReportTime || '-' }}
        </div>
        <div class="detail-row"><span
          class="label">是否异常：</span>{{ detailObj.isAbnormal === '是' ? '是' : '否' }}
        </div>
      </template>

      <template v-else-if="detailObj.planStatusName === '问题待处置'">
        <!-- 静态数据，字段可能不同 -->
        <div class="detail-section">⚠️ 问题信息</div>
        <div class="detail-row"><span class="label">问题编号：</span>{{ detailObj.problemId || '-' }}
        </div>
        <div class="detail-row"><span class="label">问题类型：</span>{{
            detailObj.problemType || '-'
          }}
        </div>
        <div class="detail-row"><span class="label">问题位置：</span>{{ detailObj.location || '-' }}
        </div>
        <div class="detail-row"><span class="label">上报人员：</span>{{ detailObj.reportBy || '-' }}
        </div>
        <div class="detail-row"><span class="label">上报时间：</span>{{
            detailObj.reportTime || '-'
          }}
        </div>
        <div class="detail-row"><span class="label">问题描述：</span>{{ detailObj.desc || '-' }}
        </div>
        <div class="detail-row"><span class="label">处置组：</span>{{ detailObj.team || '-' }}</div>
        <div class="detail-row"><span class="label">处置状态：</span>{{
            detailObj.handleStatus || '-'
          }}
        </div>
        <div class="detail-row"><span
          class="label">超时提醒：</span>{{ detailObj.isTimeout ? '超时' : '正常' }}
        </div>
      </template>

      <template v-else-if="detailObj.planStatusName === '质量待核查'">
        <div class="detail-section">🔍 质量核查信息</div>
        <div class="detail-row"><span
          class="label">作业完成时间：</span>{{ detailObj.completeTime || '-' }}
        </div>
        <div class="detail-row"><span class="label">上报照片：</span>
          <span v-if="detailObj.photoUrlList && detailObj.photoUrlList.length">
            <a v-for="(url, index) in detailObj.photoUrlList" :key="index" :href="url"
               target="_blank">照片{{ index + 1 }} </a>
          </span>
          <span v-else>-</span>
        </div>
        <div class="detail-row"><span
          class="label">清扫工具：</span>{{ formatArray(detailObj.toolsName) }}
        </div>
        <div class="detail-row"><span class="label">核查状态：</span>{{
            detailObj.reviewStatus || '-'
          }}
        </div>
        <div class="detail-row"><span
          class="label">核查人员：</span>{{ detailObj.reviewByName || detailObj.reviewBy || '-' }}
        </div>
        <div class="detail-row"><span class="label">核查时间：</span>{{
            detailObj.reviewTime || '-'
          }}
        </div>
        <div class="detail-row"><span
          class="label">整改要求：</span>{{ detailObj.reformRequire || '-' }}
        </div>
      </template>

      <template v-else-if="detailObj.planStatusName === '已完成'">
        <div class="detail-section">✅ 已完成任务信息</div>
        <div class="detail-row"><span class="label">完成时间：</span>{{
            detailObj.completeTime || '-'
          }}
        </div>
        <div class="detail-row"><span
          class="label">质量核查结果：</span>{{ detailObj.reviewStatus || '-' }}
        </div>
        <div class="detail-row"><span
          class="label">问题处置情况：</span>{{ detailObj.problemHandleDesc || '-' }}
        </div>
        <div class="detail-row"><span
          class="label">清扫完成率：</span>{{ detailObj.completionRate ?? '-' }}%
        </div>
        <div class="detail-row"><span
          class="label">质量达标率：</span>{{ detailObj.qualityRate ?? '-' }}%
        </div>
        <div class="detail-row"><span
          class="label">问题处置及时率：</span>{{ detailObj.problemHandleRate ?? '-' }}%
        </div>
        <div class="detail-row"><span class="label">统计周期：</span>{{
            detailObj.statPeriod || '-'
          }}
        </div>
      </template>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
.detail-card {
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  max-height: 70vh;
  overflow-y: auto;
}

.detail-section {
  font-weight: 600;
  font-size: 16px;
  margin: 16px 0 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid #e0e0e0;
}

.detail-row {
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;

  .label {
    width: 130px;
    flex-shrink: 0;
    font-weight: 500;
  }
}
</style>
