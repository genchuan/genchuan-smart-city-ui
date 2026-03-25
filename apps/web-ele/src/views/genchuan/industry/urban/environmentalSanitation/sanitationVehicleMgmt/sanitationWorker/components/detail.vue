<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});

const { detailObj, title } = toRefs(props);

const drawerTitle = computed(() => {
  const name = detailObj.value?.userName || detailObj.value?.toiletName || '人员';
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

// 判断是否为接口数据（通过是否存在 userName 字段）
const isApiData = computed(() => detailObj.value.userName !== undefined);
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <!-- 基础信息（兼容两种数据源） -->
      <div class="detail-section">👤 人员基础信息</div>
      <div class="detail-card-row">
        <div class="detail-row-left">人员姓名：</div>
        <div class="detail-row-right">{{ detailObj.userName || detailObj.toiletName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">岗位类型：</div>
        <div class="detail-row-right">{{ detailObj.jobTypeName || detailObj.location || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">所属班组：</div>
        <div class="detail-row-right">{{ detailObj.teamName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">负责区域：</div>
        <div class="detail-row-right">{{ detailObj.areaName || detailObj.area || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">联系方式：</div>
        <div class="detail-row-right">{{ detailObj.phone || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">入职时间：</div>
        <div class="detail-row-right">{{
            detailObj.entryTime ? new Date(detailObj.entryTime).toLocaleDateString() : (detailObj.openHours || '-')
          }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">人员状态：</div>
        <div class="detail-row-right">{{
            detailObj.personStatusName || detailObj.status || '-'
          }}
        </div>
      </div>

      <!-- 接口数据特有字段 -->
      <template v-if="isApiData">
        <div class="detail-card-row">
          <div class="detail-row-left">累计考勤天数：</div>
          <div class="detail-row-right">{{ detailObj.totalAttendanceDays ?? '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">平均考核得分：</div>
          <div class="detail-row-right">{{ detailObj.averageScore ?? '-' }}分</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">作业完成率：</div>
          <div class="detail-row-right">{{ detailObj.workCompletionRate ?? '-' }}%</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">未完成任务数：</div>
          <div class="detail-row-right">{{ detailObj.unfinishedTaskCount ?? '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">全勤率：</div>
          <div class="detail-row-right">{{ detailObj.fullAttendanceRate ?? '-' }}%</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">所属部门：</div>
          <div class="detail-row-right">{{ detailObj.deptName || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">角色：</div>
          <div class="detail-row-right">{{ detailObj.roleName || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">技能标签：</div>
          <div class="detail-row-right">{{ detailObj.skillTags || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">最近作业轨迹：</div>
          <div class="detail-row-right">{{ detailObj.lastWorkTrace || '-' }}</div>
        </div>
      </template>

      <!-- 模拟数据特有字段（各状态信息） -->
      <template v-else>
        <!-- 待排班 -->
        <template v-if="detailObj.status === '待排班'">
          <div class="detail-section">📅 排班计划信息</div>
          <div class="detail-card-row">
            <div class="detail-row-left">所属班组：</div>
            <div class="detail-row-right">{{ detailObj.openHours || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">负责区域：</div>
            <div class="detail-row-right">{{ detailObj.area || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">排班周期：</div>
            <div class="detail-row-right">{{ detailObj.stallCount || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">作业时段：</div>
            <div class="detail-row-right">{{ detailObj.cleaningTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">排班状态：</div>
            <div class="detail-row-right">{{ detailObj.dispatchStatus || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">换班申请状态：</div>
            <div class="detail-row-right">{{ detailObj.handler || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">换班申请数：</div>
            <div class="detail-row-right">{{ detailObj.swapApplyCount ?? '-' }}</div>
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

        <!-- 待考勤 -->
        <template v-else-if="detailObj.status === '待考勤'">
          <div class="detail-section">⏰ 考勤记录</div>
          <div class="detail-card-row">
            <div class="detail-row-left">所属班组：</div>
            <div class="detail-row-right">{{ detailObj.openHours || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">打卡日期：</div>
            <div class="detail-row-right">{{ detailObj.stallCount || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">到岗打卡时间：</div>
            <div class="detail-row-right">{{ detailObj.cleaningTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">离岗打卡时间：</div>
            <div class="detail-row-right">{{ detailObj.cleaningContent || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">打卡状态：</div>
            <div class="detail-row-right">{{ detailObj.cleaner || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">打卡位置：</div>
            <div class="detail-row-right">{{ detailObj.photoUrl || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">考勤时长：</div>
            <div class="detail-row-right">{{ detailObj.cleaningRate ?? '-' }}小时</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">异常类型：</div>
            <div class="detail-row-right">{{ detailObj.repairBy || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">异常说明：</div>
            <div class="detail-row-right">{{ detailObj.warningCount || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">审核状态：</div>
            <div class="detail-row-right">{{ detailObj.repairStatus || '-' }}</div>
          </div>
        </template>

        <!-- 考核待审核 -->
        <template v-else-if="detailObj.status === '考核待审核'">
          <div class="detail-section">📊 考核信息</div>
          <div class="detail-card-row">
            <div class="detail-row-left">所属班组：</div>
            <div class="detail-row-right">{{ detailObj.openHours || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">负责区域：</div>
            <div class="detail-row-right">{{ detailObj.area || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">考核周期：</div>
            <div class="detail-row-right">{{ detailObj.stallCount || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">考勤得分：</div>
            <div class="detail-row-right">{{ detailObj.cleaningRate ?? '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">作业质量得分：</div>
            <div class="detail-row-right">{{ detailObj.complaintRate ?? '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">问题处置得分：</div>
            <div class="detail-row-right">{{ detailObj.warningCount ?? '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">初始总分：</div>
            <div class="detail-row-right">{{ detailObj.facilityRate ?? '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">佐证材料：</div>
            <div class="detail-row-right">
              <a v-if="detailObj.proofUrl" :href="detailObj.proofUrl" target="_blank">查看</a>
              <span v-else>-</span>
            </div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">考核人员：</div>
            <div class="detail-row-right">{{ detailObj.repairBy || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">审核时间：</div>
            <div class="detail-row-right">{{ detailObj.reportTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">最终总分：</div>
            <div class="detail-row-right">{{ detailObj.repairStatus || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">考核等级：</div>
            <div class="detail-row-right">{{ detailObj.expectedCompleteTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">考核意见：</div>
            <div class="detail-row-right">{{ detailObj.damageDesc || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">班组考核通过率：</div>
            <div class="detail-row-right">{{ detailObj.teamPassRate ?? '-' }}%</div>
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
            <div class="detail-row-left">所属班组：</div>
            <div class="detail-row-right">{{ detailObj.openHours || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">负责区域：</div>
            <div class="detail-row-right">{{ detailObj.area || '-' }}</div>
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
            <div class="detail-row-left">班组考勤率：</div>
            <div class="detail-row-right">{{ detailObj.cleaningRate ?? '-' }}%</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">平均考核分：</div>
            <div class="detail-row-right">{{ detailObj.complaintRate ?? '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">优秀人员占比：</div>
            <div class="detail-row-right">{{ detailObj.warningCount ?? '-' }}%</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">统计周期：</div>
            <div class="detail-row-right">{{ detailObj.statPeriod || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">综合管理评分：</div>
            <div class="detail-row-right">{{ detailObj.satisfaction ?? '-' }}</div>
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
