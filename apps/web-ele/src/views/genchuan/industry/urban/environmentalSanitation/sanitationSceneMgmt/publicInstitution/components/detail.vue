<script setup>
import {computed, defineProps, toRefs} from 'vue';
import {useVbenDrawer} from '@vben/common-ui';

const props = defineProps({
  detailObj: {type: Object, required: true, default: () => ({})},
  title: {type: String, default: ''},
});

const {detailObj, title} = toRefs(props);

const drawerTitle = computed(() => {
  const name = detailObj.value?.name || detailObj.value?.toiletName || '机构';
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
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <!-- 基础信息（兼容两种数据源） -->
      <div class="detail-section">🏢 机构基础信息</div>
      <div class="detail-card-row">
        <div class="detail-row-left">机构名称：</div>
        <div class="detail-row-right">{{ detailObj.name || detailObj.toiletName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">机构类型：</div>
        <div class="detail-row-right">
          {{ detailObj.institutionTypeName || detailObj.institutionType || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">机构地址：</div>
        <div class="detail-row-right">{{ detailObj.address || detailObj.location || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">所属区域：</div>
        <div class="detail-row-right">{{ detailObj.areaName || detailObj.area || '-' }}</div>
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

      <!-- 接口数据特有字段（当有 name 字段时认为来自接口） -->
      <template v-if="detailObj.name !== undefined">
        <div class="detail-card-row">
          <div class="detail-row-left">保洁达标率：</div>
          <div class="detail-row-right">{{ detailObj.cleaningRate ?? '-' }}%</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">问题办结率：</div>
          <div class="detail-row-right">{{ detailObj.problemRate ?? '-' }}%</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">垃圾清运量：</div>
          <div class="detail-row-right">{{ detailObj.wasteVolume ?? '-' }}kg</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">核查通过率：</div>
          <div class="detail-row-right">{{ detailObj.inspectionPassRate ?? '-' }}%</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">保洁标准：</div>
          <div class="detail-row-right">{{ detailObj.cleaningStandard || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">保洁频次：</div>
          <div class="detail-row-right">{{ detailObj.cleaningFrequency || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">保洁时段：</div>
          <div class="detail-row-right">{{ detailObj.cleaningTime || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">保洁人员：</div>
          <div class="detail-row-right">
            <span v-if="detailObj.cleanersName && detailObj.cleanersName.length">
              {{ detailObj.cleanersName.join(', ') }}
            </span>
            <span v-else>-</span>
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">责任区域：</div>
          <div class="detail-row-right">{{ detailObj.responsibilityArea || '-' }}</div>
        </div>
      </template>

      <!-- 动态显示各状态特有信息（基于模拟数据） -->
      <template v-if="detailObj.status === '保洁待执行'">
        <div class="detail-section">🧹 保洁计划信息</div>
        <div class="detail-card-row">
          <div class="detail-row-left">保洁标准：</div>
          <div class="detail-row-right">{{ detailObj.cleaningStandard || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">保洁频次：</div>
          <div class="detail-row-right">{{ detailObj.cleaningFrequency || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">保洁时段：</div>
          <div class="detail-row-right">{{ detailObj.cleaningTime || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">保洁内容：</div>
          <div class="detail-row-right">{{ detailObj.cleaningContent || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">保洁人员：</div>
          <div class="detail-row-right">{{ detailObj.cleaner || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">责任区域：</div>
          <div class="detail-row-right">{{ detailObj.responsibilityArea || '-' }}</div>
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
      </template>

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
          <div class="detail-row-left">派单状态：</div>
          <div class="detail-row-right">{{ detailObj.dispatchStatus || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">责任人：</div>
          <div class="detail-row-right">{{ detailObj.handler || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">超时提醒：</div>
          <div class="detail-row-right">{{ detailObj.isTimeout ? '是' : '否' }}</div>
        </div>
      </template>

      <template v-else-if="detailObj.status === '核查待验收'">
        <div class="detail-section">🔍 核查信息</div>
        <div class="detail-card-row">
          <div class="detail-row-left">核查编号：</div>
          <div class="detail-row-right">{{ detailObj.repairId || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">关联任务：</div>
          <div class="detail-row-right">{{ detailObj.taskId || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">任务类型：</div>
          <div class="detail-row-right">{{ detailObj.facilityType || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">任务描述：</div>
          <div class="detail-row-right">{{ detailObj.damageDesc || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">上报人员：</div>
          <div class="detail-row-right">{{ detailObj.reportBy || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">上报时间：</div>
          <div class="detail-row-right">{{ detailObj.reportTime || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">上报结果：</div>
          <div class="detail-row-right">{{ detailObj.reportResult || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">现场照片：</div>
          <div class="detail-row-right">
            <a v-if="detailObj.photoUrl" :href="detailObj.photoUrl" target="_blank">查看</a>
            <span v-else>-</span>
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">核查人员：</div>
          <div class="detail-row-right">{{ detailObj.repairBy || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">核查状态：</div>
          <div class="detail-row-right">{{ detailObj.repairStatus || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">预计完成时间：</div>
          <div class="detail-row-right">{{ detailObj.expectedCompleteTime || '-' }}</div>
        </div>
      </template>

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
          <div class="detail-row-left">任务耗时：</div>
          <div class="detail-row-right">{{ detailObj.handleDuration || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">保洁达标率：</div>
          <div class="detail-row-right">{{ detailObj.cleaningQualifiedRate ?? '-' }}%</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">问题办结率：</div>
          <div class="detail-row-right">{{ detailObj.problemCompleteRate ?? '-' }}%</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">核查通过率：</div>
          <div class="detail-row-right">{{ detailObj.inspectionPassRate ?? '-' }}%</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">统计周期：</div>
          <div class="detail-row-right">{{ detailObj.statPeriod || '-' }}</div>
        </div>
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
