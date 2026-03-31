<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});

const { detailObj, title } = toRefs(props);

const drawerTitle = computed(() => {
  const name = detailObj.value?.name || detailObj.value?.toiletName || '城中村';
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

// 辅助函数：解析 JSON 字符串
const parseJSON = (str) => {
  if (!str) return [];
  try {
    return JSON.parse(str);
  } catch {
    return str.split(',').map(s => s.trim());
  }
};

// 判断是否为接口数据（通过是否存在 name 字段）
const isApiData = computed(() => detailObj.value.name !== undefined);
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <!-- 基础信息（兼容两种数据源） -->
      <div class="detail-section">🏘️ 城中村基础信息</div>
      <div class="detail-card-row">
        <div class="detail-row-left">城中村名称：</div>
        <div class="detail-row-right">{{ detailObj.name || detailObj.toiletName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">城中村地址：</div>
        <div class="detail-row-right">{{ detailObj.address || detailObj.location || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">所属区域：</div>
        <div class="detail-row-right">{{ detailObj.areaName || detailObj.area || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">责任区域数：</div>
        <div class="detail-row-right">
          {{ detailObj.responsibilityAreas ?? detailObj.stallCount ?? '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">道路保洁频次：</div>
        <div class="detail-row-right">{{ detailObj.roadCleaningFrequency || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">负责人：</div>
        <div class="detail-row-right">{{ detailObj.managerName || detailObj.manager || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">运营状态：</div>
        <div class="detail-row-right">{{
            detailObj.operationStatusName || detailObj.status || '-'
          }}
        </div>
      </div>

      <!-- 接口数据特有字段 -->
      <template v-if="isApiData">
        <div class="detail-card-row">
          <div class="detail-row-left">保洁达标率：</div>
          <div class="detail-row-right">{{ detailObj.cleaningRate ?? '-' }}%</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">问题处置完成率：</div>
          <div class="detail-row-right">{{ detailObj.problemRate ?? '-' }}%</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">复核通过率：</div>
          <div class="detail-row-right">{{ detailObj.reviewPassRate ?? '-' }}%</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">考核得分：</div>
          <div class="detail-row-right">{{ detailObj.assessmentScore ?? '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">责任区域名称：</div>
          <div class="detail-row-right">{{ detailObj.responsibilityAreaName || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">保洁标准：</div>
          <div class="detail-row-right">{{ detailObj.cleaningStandard || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">负责人员：</div>
          <div class="detail-row-right">
            <span v-if="detailObj.staffLabels && detailObj.staffLabels.length">{{
                detailObj.staffLabels.join('、')
              }}</span>
            <span v-else-if="detailObj.staffsName && detailObj.staffsName.length">{{
                detailObj.staffsName.join('、')
              }}</span>
            <span v-else-if="detailObj.staffIds && detailObj.staffIds.length">{{
                detailObj.staffIds.join(', ')
              }}</span>
            <span v-else>-</span>
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">问题位置：</div>
          <div class="detail-row-right">{{ detailObj.problemLocation || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">问题描述：</div>
          <div class="detail-row-right">{{ detailObj.problemDesc || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">上报人员：</div>
          <div class="detail-row-right">{{
              detailObj.reportName || detailObj.reportBy || '-'
            }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">上报时间：</div>
          <div class="detail-row-right">{{ detailObj.reportTime || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">现场照片：</div>
          <div class="detail-row-right">
            <span v-if="detailObj.problemPhotoUrl">
              <a
                v-for="(url, idx) in (Array.isArray(detailObj.problemPhotoUrl) ? detailObj.problemPhotoUrl : parseJSON(detailObj.problemPhotoUrl))"
                :key="idx" :href="url" target="_blank">照片{{ idx + 1 }} </a>
            </span>
            <span v-else>-</span>
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">责任部门：</div>
          <div class="detail-row-right">{{ detailObj.deptName || detailObj.deptId || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">处置责任人：</div>
          <div class="detail-row-right">{{
              detailObj.handleName || detailObj.handleBy || '-'
            }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">派单时间：</div>
          <div class="detail-row-right">{{ detailObj.dispatchTime || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">处置状态：</div>
          <div class="detail-row-right">{{ detailObj.handleStatusName || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">超时提醒：</div>
          <div class="detail-row-right">{{ detailObj.isTimeout || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">处置说明：</div>
          <div class="detail-row-right">{{ detailObj.handleDesc || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">整改照片：</div>
          <div class="detail-row-right">
            <span v-if="detailObj.reformPhotoUrl">
              <a
                v-for="(url, idx) in (Array.isArray(detailObj.reformPhotoUrl) ? detailObj.reformPhotoUrl : parseJSON(detailObj.reformPhotoUrl))"
                :key="idx" :href="url" target="_blank">照片{{ idx + 1 }} </a>
            </span>
            <span v-else>-</span>
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">复核人员：</div>
          <div class="detail-row-right">{{
              detailObj.reviewName || detailObj.reviewBy || '-'
            }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">复核时间：</div>
          <div class="detail-row-right">{{ detailObj.reviewTime || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">复核结果：</div>
          <div class="detail-row-right">{{ detailObj.reviewResultName || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">复核意见：</div>
          <div class="detail-row-right">{{ detailObj.reviewOpinion || '-' }}</div>
        </div>
      </template>

      <!-- 模拟数据特有字段（各状态信息） -->
      <template v-else>
        <!-- 保洁待执行 -->
        <template v-if="detailObj.status === '保洁待执行'">
          <div class="detail-section">🧹 保洁计划信息</div>
          <div class="detail-card-row">
            <div class="detail-row-left">责任区域：</div>
            <div class="detail-row-right">{{ detailObj.responsibilityArea || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">道路保洁频次：</div>
            <div class="detail-row-right">{{ detailObj.roadCleaningFrequency || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">保洁时段：</div>
            <div class="detail-row-right">{{ detailObj.cleaningTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">保洁标准：</div>
            <div class="detail-row-right">{{ detailObj.cleaningStandard || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">负责人员：</div>
            <div class="detail-row-right">{{ detailObj.staff || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">计划状态：</div>
            <div class="detail-row-right">{{ detailObj.planStatus || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">创建人：</div>
            <div class="detail-row-right">{{ detailObj.createBy || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">创建时间：</div>
            <div class="detail-row-right">{{ detailObj.createTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">更新时间：</div>
            <div class="detail-row-right">{{ detailObj.updateTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">计划完成率：</div>
            <div class="detail-row-right">{{ detailObj.cleaningPlanCompleteRate ?? '-' }}%</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">保洁达标率：</div>
            <div class="detail-row-right">{{ detailObj.cleaningRate ?? '-' }}%</div>
          </div>
        </template>

        <!-- 问题待处置 -->
        <template v-else-if="detailObj.status === '问题待处置'">
          <div class="detail-section">⚠️ 问题信息</div>
          <div class="detail-card-row">
            <div class="detail-row-left">问题编号：</div>
            <div class="detail-row-right">{{ detailObj.complaintId || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">问题类型：</div>
            <div class="detail-row-right">{{ detailObj.complaintType || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">问题位置：</div>
            <div class="detail-row-right">{{ detailObj.problemLocation || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">问题描述：</div>
            <div class="detail-row-right">{{ detailObj.complaintContent || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">上报人员：</div>
            <div class="detail-row-right">{{ detailObj.complaintName || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">上报时间：</div>
            <div class="detail-row-right">{{ detailObj.complaintTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">联系电话：</div>
            <div class="detail-row-right">{{ detailObj.phone || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">现场照片：</div>
            <div class="detail-row-right">
              <a v-if="detailObj.photoUrl" :href="detailObj.photoUrl" target="_blank">查看</a>
              <span v-else>-</span>
            </div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">责任部门：</div>
            <div class="detail-row-right">{{ detailObj.dept || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">处置责任人：</div>
            <div class="detail-row-right">{{ detailObj.handler || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">派单时间：</div>
            <div class="detail-row-right">{{ detailObj.dispatchTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">处置状态：</div>
            <div class="detail-row-right">{{ detailObj.handleStatus || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">超时提醒：</div>
            <div class="detail-row-right">{{ detailObj.isTimeout ? '是' : '否' }}</div>
          </div>
        </template>

        <!-- 处置待复核 -->
        <template v-else-if="detailObj.status === '处置待复核'">
          <div class="detail-section">🔍 复核信息</div>
          <div class="detail-card-row">
            <div class="detail-row-left">复核编号：</div>
            <div class="detail-row-right">{{ detailObj.repairId || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">问题类型：</div>
            <div class="detail-row-right">{{ detailObj.complaintType || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">问题位置：</div>
            <div class="detail-row-right">{{ detailObj.problemLocation || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">处置责任人：</div>
            <div class="detail-row-right">{{ detailObj.handleBy || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">处置时间：</div>
            <div class="detail-row-right">{{ detailObj.handleTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">处置说明：</div>
            <div class="detail-row-right">{{ detailObj.handleDesc || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">整改照片：</div>
            <div class="detail-row-right">
              <a v-if="detailObj.reformPhotoUrl" :href="detailObj.reformPhotoUrl"
                 target="_blank">查看</a>
              <span v-else>-</span>
            </div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">复核人员：</div>
            <div class="detail-row-right">{{ detailObj.reviewBy || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">复核时间：</div>
            <div class="detail-row-right">{{ detailObj.reviewTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">复核结果：</div>
            <div class="detail-row-right">{{ detailObj.reviewResult || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">复核意见：</div>
            <div class="detail-row-right">{{ detailObj.reviewOpinion || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">复核通过率：</div>
            <div class="detail-row-right">{{ detailObj.reviewPassRate ?? '-' }}%</div>
          </div>
        </template>

        <!-- 已完成 -->
        <template v-else-if="detailObj.status === '已完成'">
          <div class="detail-section">✅ 已完成任务信息</div>
          <div class="detail-card-row">
            <div class="detail-row-left">任务类型：</div>
            <div class="detail-row-right">{{ detailObj.taskType || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">完成时间：</div>
            <div class="detail-row-right">{{ detailObj.completeTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">处置人员：</div>
            <div class="detail-row-right">{{ detailObj.handler || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">处置结果：</div>
            <div class="detail-row-right">{{ detailObj.handleResult || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">佐证材料：</div>
            <div class="detail-row-right">
              <a v-if="detailObj.proofUrl" :href="detailObj.proofUrl" target="_blank">查看</a>
              <span v-else>-</span>
            </div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">保洁达标率：</div>
            <div class="detail-row-right">{{ detailObj.cleaningRate ?? '-' }}%</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">问题办结率：</div>
            <div class="detail-row-right">{{ detailObj.problemRate ?? '-' }}%</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">复核通过率：</div>
            <div class="detail-row-right">{{ detailObj.reviewPassRate ?? '-' }}%</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">统计周期：</div>
            <div class="detail-row-right">{{ detailObj.statPeriod || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">考核得分：</div>
            <div class="detail-row-right">{{ detailObj.assessmentScore ?? '-' }}</div>
          </div>
        </template>
      </template>

      <!-- 时间信息（通用） -->
      <div class="detail-section">📅 时间信息</div>
      <div class="detail-card-row">
        <div class="detail-row-left">创建时间：</div>
        <div class="detail-row-right">{{ detailObj.createTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">更新时间：</div>
        <div class="detail-row-right">{{ detailObj.updateTime || '-' }}</div>
      </div>
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
</style>
