<script setup>
import {computed, defineProps, toRefs} from 'vue';
import {useVbenDrawer} from '@vben/common-ui';

const props = defineProps({
  detailObj: {type: Object, required: true, default: () => ({})},
  title: {type: String, default: ''},
});

const {detailObj, title} = toRefs(props);

const drawerTitle = computed(() => {
  const name = detailObj.value?.name || detailObj.value?.toiletName || '河道';
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
      <div class="detail-section">🌊 河道基础信息</div>
      <div class="detail-card-row">
        <div class="detail-row-left">河道名称：</div>
        <div class="detail-row-right">{{ detailObj.name || detailObj.toiletName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">责任河段：</div>
        <div class="detail-row-right">{{ detailObj.responsibilitySection || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">所属区域：</div>
        <div class="detail-row-right">{{ detailObj.areaName || detailObj.area || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">河道长度：</div>
        <div class="detail-row-right">{{
            (detailObj.length || detailObj.stallCount) ?? '-'
          }}公里
        </div>
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
          <div class="detail-row-left">保洁覆盖率：</div>
          <div class="detail-row-right">{{ detailObj.cleaningCoverage ?? '-' }}%</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">水质达标率：</div>
          <div class="detail-row-right">{{ detailObj.waterQualityRate ?? '-' }}%</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">垃圾打捞总量：</div>
          <div class="detail-row-right">{{ detailObj.wasteFishingVolume ?? '-' }}吨</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">问题办结率：</div>
          <div class="detail-row-right">{{ detailObj.problemCompleteRate ?? '-' }}%</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">保洁类型：</div>
          <div class="detail-row-right">{{ detailObj.cleaningTypeName || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">保洁频次：</div>
          <div class="detail-row-right">{{ detailObj.waterCleaningFrequency || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">保洁时段：</div>
          <div class="detail-row-right">{{ detailObj.cleaningTime || '-' }}</div>
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
          <div class="detail-row-left">保洁工具：</div>
          <div class="detail-row-right">
            <span v-if="detailObj.toolLabels && detailObj.toolLabels.length">{{
                detailObj.toolLabels.join('、')
              }}</span>
            <span v-else-if="detailObj.toolsName && detailObj.toolsName.length">{{
                detailObj.toolsName.join('、')
              }}</span>
            <span v-else-if="detailObj.toolIds && detailObj.toolIds.length">{{
                detailObj.toolIds.join(', ')
              }}</span>
            <span v-else>-</span>
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">垃圾打捞预估量：</div>
          <div class="detail-row-right">{{ detailObj.wasteFishingEstimate ?? '-' }}吨</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">监测类型：</div>
          <div class="detail-row-right">{{ detailObj.monitorTypeName || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">监测周期：</div>
          <div class="detail-row-right">{{ detailObj.waterQualityCycle || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">监测指标：</div>
          <div class="detail-row-right">
            <span v-if="detailObj.monitorIndicators && detailObj.monitorIndicators.length">{{
                detailObj.monitorIndicators.join('、')
              }}</span>
            <span v-else>-</span>
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">监测人员：</div>
          <div class="detail-row-right">{{
              detailObj.monitorName || detailObj.monitorBy || '-'
            }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">计划监测时间：</div>
          <div class="detail-row-right">{{ detailObj.planMonitorTime || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">监测状态：</div>
          <div class="detail-row-right">{{ detailObj.monitorStatusName || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">上次监测时间：</div>
          <div class="detail-row-right">{{ detailObj.lastMonitorTime || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">下次监测提醒：</div>
          <div class="detail-row-right">{{ detailObj.nextMonitorRemindTime || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">监测数据达标率：</div>
          <div class="detail-row-right">{{ detailObj.monitorDataQualifiedRate ?? '-' }}%</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">预警次数：</div>
          <div class="detail-row-right">{{ detailObj.warningCount ?? '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">问题类型：</div>
          <div class="detail-row-right">{{ detailObj.problemTypeName || '-' }}</div>
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
          <div class="detail-row-left">现场照片/视频：</div>
          <div class="detail-row-right">
            <span v-if="detailObj.problemMediaUrl">
              <a
                v-for="(url, idx) in (Array.isArray(detailObj.problemMediaUrl) ? detailObj.problemMediaUrl : parseJSON(detailObj.problemMediaUrl))"
                :key="idx" :href="url" target="_blank">附件{{ idx + 1 }} </a>
            </span>
            <span v-else>-</span>
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">责任部门：</div>
          <div class="detail-row-right">
            <span v-if="detailObj.deptLabel">{{ detailObj.deptLabel }}</span>
            <span v-else-if="detailObj.deptName">{{ detailObj.deptName }}</span>
            <span v-else>{{ detailObj.deptId || '-' }}</span>
          </div>
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
      </template>

      <!-- 模拟数据特有字段（各状态信息） -->
      <template v-else>
        <!-- 保洁待执行 -->
        <template v-if="detailObj.status === '保洁待执行'">
          <div class="detail-section">🧹 保洁计划信息</div>
          <div class="detail-card-row">
            <div class="detail-row-left">保洁类型：</div>
            <div class="detail-row-right">{{ detailObj.cleaningType || '-' }}</div>
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
            <div class="detail-row-left">负责人员：</div>
            <div class="detail-row-right">{{ detailObj.cleaner || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">保洁工具：</div>
            <div class="detail-row-right">{{ detailObj.cleaningTool || '-' }}</div>
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
            <div class="detail-row-left">垃圾打捞预估量：</div>
            <div class="detail-row-right">{{ detailObj.wasteFishingEstimate ?? '-' }}吨</div>
          </div>
        </template>

        <!-- 监测待执行 -->
        <template v-else-if="detailObj.status === '监测待执行'">
          <div class="detail-section">📊 监测计划信息</div>
          <div class="detail-card-row">
            <div class="detail-row-left">监测类型：</div>
            <div class="detail-row-right">{{ detailObj.consumableName || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">监测周期：</div>
            <div class="detail-row-right">{{
                detailObj.threshold ? detailObj.threshold + '天' : '-'
              }}
            </div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">监测指标：</div>
            <div class="detail-row-right">{{ detailObj.cleaningContent || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">监测人员：</div>
            <div class="detail-row-right">{{ detailObj.cleaner || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">计划监测时间：</div>
            <div class="detail-row-right">{{ detailObj.cleaningTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">监测状态：</div>
            <div class="detail-row-right">{{ detailObj.warningStatus || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">上次监测时间：</div>
            <div class="detail-row-right">{{ detailObj.lastSupplyTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">下次监测提醒：</div>
            <div class="detail-row-right">{{ detailObj.supplyCycle || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">监测数据达标率：</div>
            <div class="detail-row-right">{{ detailObj.monitorDataQualifiedRate ?? '-' }}%</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">预警次数：</div>
            <div class="detail-row-right">{{ detailObj.warningCount ?? '-' }}</div>
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
            <div class="detail-row-right">{{ detailObj.facilityLocation || '-' }}</div>
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
            <div class="detail-row-right">{{ detailObj.dispatchStatus || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">超时提醒：</div>
            <div class="detail-row-right">{{ detailObj.isTimeout ? '是' : '否' }}</div>
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
            <div class="detail-row-left">保洁覆盖率：</div>
            <div class="detail-row-right">{{ detailObj.cleaningRate ?? '-' }}%</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">水质达标率：</div>
            <div class="detail-row-right">{{ detailObj.facilityRate ?? '-' }}%</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">垃圾打捞总量：</div>
            <div class="detail-row-right">{{ detailObj.wasteFishingVolume ?? '-' }}吨</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">问题办结率：</div>
            <div class="detail-row-right">{{ detailObj.complaintRate ?? '-' }}%</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">统计周期：</div>
            <div class="detail-row-right">{{ detailObj.statPeriod || '-' }}</div>
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
