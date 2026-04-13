<script setup>
import {computed, defineProps, toRefs} from 'vue';
import {useVbenDrawer} from '@vben/common-ui';

const props = defineProps({
  detailObj: {type: Object, required: true, default: () => ({})},
  title: {type: String, default: ''},
});

const {detailObj, title} = toRefs(props);

const drawerTitle = computed(() => {
  const name = detailObj.value?.name || detailObj.value?.toiletName || '市场';
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
      <div class="detail-section">🏢 集贸市场基础信息</div>
      <div class="detail-card-row">
        <div class="detail-row-left">市场名称：</div>
        <div class="detail-row-right">{{ detailObj.name || detailObj.toiletName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">市场地址：</div>
        <div class="detail-row-right">{{ detailObj.address || detailObj.location || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">所属区域：</div>
        <div class="detail-row-right">{{ detailObj.areaName || detailObj.area || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">摊位数量：</div>
        <div class="detail-row-right">{{ detailObj.stallCount ?? '-' }}</div>
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
          <div class="detail-row-left">卫生达标率：</div>
          <div class="detail-row-right">{{ detailObj.hygieneRate ?? '-' }}%</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">收运完成率：</div>
          <div class="detail-row-right">{{ detailObj.wasteTransferRate ?? '-' }}%</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">污水处置合格率：</div>
          <div class="detail-row-right">{{ detailObj.sewageRate ?? '-' }}%</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">未完成任务数：</div>
          <div class="detail-row-right">{{ detailObj.unfinishedTaskCount ?? '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">保洁频次：</div>
          <div class="detail-row-right">{{ detailObj.cleaningFrequency || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">保洁时段：</div>
          <div class="detail-row-right">
            <span v-if="detailObj.cleaningTime && detailObj.cleaningTime.length">
              {{ detailObj.cleaningTime.join('；') }}
            </span>
            <span v-else>-</span>
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">保洁区域：</div>
          <div class="detail-row-right">{{ detailObj.cleaningArea || '-' }}</div>
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
          <div class="detail-row-left">垃圾类型：</div>
          <div class="detail-row-right">
            <span v-if="detailObj.garbageTypeLabels && detailObj.garbageTypeLabels.length">{{
                detailObj.garbageTypeLabels.join('、')
              }}</span>
            <span v-else-if="detailObj.garbageTypesName && detailObj.garbageTypesName.length">{{
                detailObj.garbageTypesName.join('、')
              }}</span>
            <span v-else-if="detailObj.garbageTypeIds && detailObj.garbageTypeIds.length">{{
                detailObj.garbageTypeIds.join(', ')
              }}</span>
            <span v-else>-</span>
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">收集容器数量：</div>
          <div class="detail-row-right">{{ detailObj.garbageContainerCount ?? '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">收运间隔：</div>
          <div class="detail-row-right">{{ detailObj.wasteTransferInterval || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">收运时段：</div>
          <div class="detail-row-right">{{ detailObj.wasteTransferTime || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">负责车辆：</div>
          <div class="detail-row-right">{{
              detailObj.vehicleName || detailObj.vehicleId || '-'
            }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">污水排放区域：</div>
          <div class="detail-row-right">{{ detailObj.sewageDischargeArea || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">污水处置方式：</div>
          <div class="detail-row-right">{{ detailObj.sewageDisposalWay || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">清理频次：</div>
          <div class="detail-row-right">{{ detailObj.sewageCleaningFrequency || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">问题描述：</div>
          <div class="detail-row-right">{{ detailObj.sewageProblemDesc || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">上次清理时间：</div>
          <div class="detail-row-right">{{ detailObj.lastSewageCleaningTime || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">下次清理时间：</div>
          <div class="detail-row-right">{{ detailObj.nextSewageCleaningTime || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">处置日志：</div>
          <div class="detail-row-right">{{ detailObj.sewageDisposalLog || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">核查时段：</div>
          <div class="detail-row-right">{{ detailObj.hygieneCheckTime || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">核查人员：</div>
          <div class="detail-row-right">{{ detailObj.checkName || detailObj.checkBy || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">核查日期：</div>
          <div class="detail-row-right">{{ detailObj.hygieneCheckDate || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">前期问题：</div>
          <div class="detail-row-right">{{ detailObj.previousProblem || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">达标项数：</div>
          <div class="detail-row-right">{{ detailObj.qualifiedItemCount ?? '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">不达标项数：</div>
          <div class="detail-row-right">{{ detailObj.unqualifiedItemCount ?? '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">整改要求：</div>
          <div class="detail-row-right">{{ detailObj.reformRequire || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">整改期限：</div>
          <div class="detail-row-right">{{ detailObj.reformDeadline || '-' }}</div>
        </div>
      </template>

      <!-- 模拟数据特有字段（各状态信息） -->
      <template v-else>
        <!-- 保洁待执行 -->
        <template v-if="detailObj.status === '保洁待执行'">
          <div class="detail-section">🧹 保洁计划信息</div>
          <div class="detail-card-row">
            <div class="detail-row-left">保洁频次：</div>
            <div class="detail-row-right">{{ detailObj.cleaningFrequency || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">保洁时段：</div>
            <div class="detail-row-right">{{ detailObj.cleaningTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">保洁区域：</div>
            <div class="detail-row-right">{{ detailObj.cleaningArea || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">负责人员：</div>
            <div class="detail-row-right">{{ detailObj.cleaner || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">保洁标准：</div>
            <div class="detail-row-right">{{ detailObj.cleaningStandard || '-' }}</div>
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
            <div class="detail-row-left">是否生效：</div>
            <div class="detail-row-right">{{ detailObj.isEffective ? '是' : '否' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">计划完成率：</div>
            <div class="detail-row-right">{{ detailObj.cleaningPlanCompleteRate ?? '-' }}%</div>
          </div>
        </template>

        <!-- 收运待执行 -->
        <template v-else-if="detailObj.status === '收运待执行'">
          <div class="detail-section">🚛 收运计划信息</div>
          <div class="detail-card-row">
            <div class="detail-row-left">垃圾类型：</div>
            <div class="detail-row-right">{{ detailObj.consumableName || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">收集容器数量：</div>
            <div class="detail-row-right">{{ detailObj.currentStock ?? '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">收运间隔：</div>
            <div class="detail-row-right">
              {{ detailObj.threshold ? detailObj.threshold + '小时' : '-' }}
            </div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">收运时段：</div>
            <div class="detail-row-right">{{ detailObj.lastSupplyTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">负责车辆：</div>
            <div class="detail-row-right">{{ detailObj.repairBy || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">负责人员：</div>
            <div class="detail-row-right">{{ detailObj.handler || '-' }}</div>
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
            <div class="detail-row-left">收运完成率：</div>
            <div class="detail-row-right">{{ detailObj.wasteTransferCompleteRate ?? '-' }}%</div>
          </div>
        </template>

        <!-- 污水待处置 -->
        <template v-else-if="detailObj.status === '污水待处置'">
          <div class="detail-section">💧 污水处置信息</div>
          <div class="detail-card-row">
            <div class="detail-row-left">问题编号：</div>
            <div class="detail-row-right">{{ detailObj.complaintId || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">污水排放区域：</div>
            <div class="detail-row-right">{{ detailObj.sewageDischargeArea || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">处置方式：</div>
            <div class="detail-row-right">{{ detailObj.complaintType || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">清理频次：</div>
            <div class="detail-row-right">{{ detailObj.sewageCleaningFrequency || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">负责人员：</div>
            <div class="detail-row-right">{{ detailObj.complaintName || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">上次清理时间：</div>
            <div class="detail-row-right">{{ detailObj.complaintTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">处置状态：</div>
            <div class="detail-row-right">{{ detailObj.handleStatus || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">下次清理时间：</div>
            <div class="detail-row-right">{{ detailObj.nextCleaningTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">处置合格率：</div>
            <div class="detail-row-right">{{ detailObj.sewageRate ?? '-' }}%</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">处置日志：</div>
            <div class="detail-row-right">{{ detailObj.disposalLog || '-' }}</div>
          </div>
        </template>

        <!-- 卫生待核查 -->
        <template v-else-if="detailObj.status === '卫生待核查'">
          <div class="detail-section">🔍 卫生核查信息</div>
          <div class="detail-card-row">
            <div class="detail-row-left">核查编号：</div>
            <div class="detail-row-right">{{ detailObj.repairId || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">核查时段：</div>
            <div class="detail-row-right">{{ detailObj.facilityType || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">核查人员：</div>
            <div class="detail-row-right">{{ detailObj.facilityLocation || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">核查日期：</div>
            <div class="detail-row-right">{{ detailObj.reportTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">前期问题：</div>
            <div class="detail-row-right">{{ detailObj.damageDesc || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">核查结果：</div>
            <div class="detail-row-right">{{ detailObj.repairStatus || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">达标项数：</div>
            <div class="detail-row-right">{{ detailObj.qualifiedItemCount ?? '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">不达标项数：</div>
            <div class="detail-row-right">{{ detailObj.unqualifiedItemCount ?? '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">卫生达标率：</div>
            <div class="detail-row-right">{{ detailObj.hygieneRate ?? '-' }}%</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">整改要求：</div>
            <div class="detail-row-right">{{ detailObj.reformRequire || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">整改期限：</div>
            <div class="detail-row-right">{{ detailObj.expectedCompleteTime || '-' }}</div>
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
            <div class="detail-row-left">卫生达标率：</div>
            <div class="detail-row-right">{{ detailObj.hygieneRate ?? '-' }}%</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">收运完成率：</div>
            <div class="detail-row-right">{{ detailObj.wasteTransferCompleteRate ?? '-' }}%</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">污水处置合格率：</div>
            <div class="detail-row-right">{{ detailObj.sewageRate ?? '-' }}%</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">统计周期：</div>
            <div class="detail-row-right">{{ detailObj.statPeriod || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">综合管理评分：</div>
            <div class="detail-row-right">{{ detailObj.manageScore ?? '-' }}</div>
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
