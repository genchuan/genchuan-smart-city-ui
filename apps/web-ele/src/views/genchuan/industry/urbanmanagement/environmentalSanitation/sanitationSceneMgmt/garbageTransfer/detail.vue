<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});

const { detailObj, title } = toRefs(props);

const drawerTitle = computed(() => {
  const name = detailObj.value?.toiletName || '转运站';
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
      <!-- 基础信息 -->
      <div class="detail-section">🏭 转运站基础信息</div>
      <div class="detail-row"><span class="label">转运站名称：</span>{{
          detailObj.toiletName || '-'
        }}
      </div>
      <div class="detail-row"><span class="label">转运站位置：</span>{{ detailObj.location || '-' }}
      </div>
      <div class="detail-row"><span class="label">所属区域：</span>{{ detailObj.area || '-' }}</div>
      <div class="detail-row"><span class="label">开放时段：</span>{{ detailObj.openHours || '-' }}
      </div>
      <div class="detail-row"><span class="label">压缩机数量：</span>{{
          detailObj.stallCount ?? '-'
        }}
      </div>
      <div class="detail-row"><span class="label">运营状态：</span>{{ detailObj.status || '-' }}
      </div>
      <div class="detail-row"><span class="label">负责人：</span>{{ detailObj.manager || '-' }}</div>
      <div class="detail-row"><span
        class="label">日转运量：</span>{{ detailObj.dailyTransferVolume ?? '-' }}吨
      </div>
      <div class="detail-row"><span
        class="label">设备正常运行率：</span>{{ detailObj.equipmentRate ?? '-' }}%
      </div>
      <div class="detail-row"><span
        class="label">环境达标率：</span>{{ detailObj.environmentRate ?? '-' }}%
      </div>
      <div class="detail-row"><span
        class="label">预警未处理数：</span>{{ detailObj.unhandledAlarmCount ?? '-' }}
      </div>
      <div class="detail-row"><span
        class="label">设备待维护数：</span>{{ detailObj.pendingMaintenanceCount ?? '-' }}
      </div>

      <!-- 动态显示各状态特有信息 -->
      <template v-if="detailObj.status === '车辆待进站'">
        <div class="detail-section">🚛 车辆预约信息</div>
        <div class="detail-row"><span class="label">预约编号：</span>{{ detailObj.reserveId || '-' }}
        </div>
        <div class="detail-row"><span class="label">车辆牌照：</span>{{
            detailObj.licensePlate || '-'
          }}
        </div>
        <div class="detail-row"><span class="label">垃圾品类：</span>{{
            detailObj.garbageType || '-'
          }}
        </div>
        <div class="detail-row"><span
          class="label">预计进站时间：</span>{{ detailObj.expectedTime || '-' }}
        </div>
        <div class="detail-row"><span
          class="label">垃圾重量：</span>{{ detailObj.garbageWeight ?? '-' }}吨
        </div>
        <div class="detail-row"><span
          class="label">预约状态：</span>{{ detailObj.reserveStatus || '-' }}
        </div>
        <div class="detail-row"><span class="label">排序序号：</span>{{ detailObj.sortNo ?? '-' }}
        </div>
        <div class="detail-row"><span class="label">创建时间：</span>{{
            detailObj.createTime || '-'
          }}
        </div>
        <div class="detail-row"><span class="label">处理人员：</span>{{ detailObj.handler || '-' }}
        </div>
      </template>

      <template v-else-if="detailObj.status === '作业进行中'">
        <div class="detail-section">⚙️ 作业进行中信息</div>
        <div class="detail-row"><span class="label">进站编号：</span>{{
            detailObj.operationId || '-'
          }}
        </div>
        <div class="detail-row"><span class="label">车辆牌照：</span>{{
            detailObj.licensePlate || '-'
          }}
        </div>
        <div class="detail-row"><span class="label">垃圾品类：</span>{{
            detailObj.garbageType || '-'
          }}
        </div>
        <div class="detail-row"><span class="label">进站时间：</span>{{ detailObj.entryTime || '-' }}
        </div>
        <div class="detail-row"><span
          class="label">垃圾重量：</span>{{ detailObj.garbageWeight ?? '-' }}吨
        </div>
        <div class="detail-row"><span
          class="label">关联点位：</span>{{ detailObj.relatedPoints || '-' }}
        </div>
        <div class="detail-row"><span
          class="label">核心设备状态：</span>{{ detailObj.equipmentStatus || '-' }}
        </div>
        <div class="detail-row"><span
          class="label">实时环境数据：</span>{{ detailObj.environmentData || '-' }}
        </div>
        <div class="detail-row"><span class="label">作业进度：</span>{{ detailObj.progress ?? '-' }}%
        </div>
        <div class="detail-row"><span class="label">转运去向：</span>{{
            detailObj.destination || '-'
          }}
        </div>
        <div class="detail-row"><span
          class="label">异常标记：</span>{{ detailObj.isAbnormal ? '是' : '否' }}
        </div>
      </template>

      <template v-else-if="detailObj.status === '预警待处理'">
        <div class="detail-section">⚠️ 预警信息</div>
        <div class="detail-row"><span class="label">预警编号：</span>{{ detailObj.alarmId || '-' }}
        </div>
        <div class="detail-row"><span
          class="label">关联转运站：</span>{{ detailObj.transferName || '-' }}
        </div>
        <div class="detail-row"><span class="label">预警类型：</span>{{ detailObj.alarmType || '-' }}
        </div>
        <div class="detail-row"><span class="label">发生时间：</span>{{ detailObj.alarmTime || '-' }}
        </div>
        <div class="detail-row"><span class="label">预警内容：</span>{{
            detailObj.alarmContent || '-'
          }}
        </div>
        <div class="detail-row"><span
          class="label">关联设备/区域：</span>{{ detailObj.relevantInfo || '-' }}
        </div>
        <div class="detail-row"><span class="label">处置状态：</span>{{
            detailObj.handleStatus || '-'
          }}
        </div>
        <div class="detail-row"><span class="label">责任人：</span>{{ detailObj.handler || '-' }}
        </div>
        <div class="detail-row"><span
          class="label">超时提醒：</span>{{ detailObj.isTimeout ? '是' : '否' }}
        </div>
        <div class="detail-row"><span
          class="label">处置进度：</span>{{ detailObj.handleProgress ?? '-' }}%
        </div>
      </template>

      <template v-else-if="detailObj.status === '设备待维护'">
        <div class="detail-section">🔧 设备维护信息</div>
        <div class="detail-row"><span
          class="label">维护编号：</span>{{ detailObj.maintenanceId || '-' }}
        </div>
        <div class="detail-row"><span
          class="label">关联转运站：</span>{{ detailObj.transferName || '-' }}
        </div>
        <div class="detail-row"><span
          class="label">设备名称：</span>{{ detailObj.equipmentName || '-' }}
        </div>
        <div class="detail-row"><span
          class="label">维护周期：</span>{{ detailObj.maintenanceCycle || '-' }}
        </div>
        <div class="detail-row"><span
          class="label">上次维护时间：</span>{{ detailObj.lastMaintenanceTime || '-' }}
        </div>
        <div class="detail-row"><span
          class="label">维护内容：</span>{{ detailObj.maintenanceContent || '-' }}
        </div>
        <div class="detail-row"><span class="label">责任人：</span>{{ detailObj.handler || '-' }}
        </div>
        <div class="detail-row"><span
          class="label">维护状态：</span>{{ detailObj.maintenanceStatus || '-' }}
        </div>
        <div class="detail-row"><span
          class="label">预计完成时间：</span>{{ detailObj.expectedCompleteTime || '-' }}
        </div>
        <div class="detail-row"><span
          class="label">超时提醒：</span>{{ detailObj.isTimeout ? '是' : '否' }}
        </div>
      </template>

      <template v-else-if="detailObj.status === '已完成'">
        <div class="detail-section">✅ 已完成任务信息</div>
        <div class="detail-row"><span class="label">任务类型：</span>{{ detailObj.taskType || '-' }}
        </div>
        <div class="detail-row"><span
          class="label">关联转运站：</span>{{ detailObj.transferName || '-' }}
        </div>
        <div class="detail-row"><span class="label">完成时间：</span>{{
            detailObj.completeTime || '-'
          }}
        </div>
        <div class="detail-row"><span class="label">处置人员：</span>{{ detailObj.handler || '-' }}
        </div>
        <div class="detail-row"><span class="label">处置结果：</span>{{
            detailObj.handleResult || '-'
          }}
        </div>
        <div class="detail-row"><span class="label">佐证材料：</span>
          <a v-if="detailObj.proofUrl" :href="detailObj.proofUrl" target="_blank">查看</a>
          <span v-else>-</span>
        </div>
        <div class="detail-row"><span
          class="label">任务耗时：</span>{{ detailObj.handleDuration || '-' }}
        </div>
        <div class="detail-row"><span
          class="label">进站总量：</span>{{ detailObj.totalEntryVolume ?? '-' }}吨
        </div>
        <div class="detail-row"><span
          class="label">设备完好率：</span>{{ detailObj.equipmentIntactRate ?? '-' }}%
        </div>
        <div class="detail-row"><span
          class="label">环境达标率：</span>{{ detailObj.environmentQualifiedRate ?? '-' }}%
        </div>
      </template>

      <!-- 时间信息（通用） -->
      <div class="detail-section">📅 时间信息</div>
      <div class="detail-row"><span class="label">创建时间：</span>{{ detailObj.createTime || '-' }}
      </div>
      <div class="detail-row"><span class="label">更新时间：</span>{{ detailObj.updateTime || '-' }}
      </div>
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
    color: #606266;
  }

  &:hover {
    background: #f5f7fa;
    border-radius: 4px;
    padding-left: 8px;
    margin-left: -8px;
  }
}
</style>
