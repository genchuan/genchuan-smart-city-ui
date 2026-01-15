<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { ArrowLeft, FullScreen, Operation } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import screenFull from 'screenfull';

import {
  fetchParkingComplianceIndicators,
  fetchParkingDevelopmentIndicators,
  fetchParkingEfficiencyIndicators,
  fetchParkingOperationIndicators,
  fetchParkingResourceIndicators,
  fetchParkingRiskIndicators,
  fetchParkingServiceIndicators,
} from '#/api/genchuan/industry/parkingmgmt/overview/CoreBusinessMetrics.ts';

const pageContainerRef = ref<HTMLElement | null>(null);
let timeTimer: NodeJS.Timeout | null = null;
const router = useRouter();

// 定义各类型指标响应式数据（初始值与接口兜底数据一致）
const operationData = ref({
  parkingLotOpeningRate: 0,
  roadsideUtilizationRate: 0,
  deviceOnlineRate: 0,
  deviceIntegrityRate: 0,
  chargeResponseSuccessRate: 0,
  faultOccurrenceRate: 0,
  deviceOfflineCount: 0,
  deviceStartStopTimes: 0,
});

const resourceData = ref({
  totalRoadside: 0,
  availableRoadside: 0,
  idleRoadside: 0,
  roadsideTurnoverTimes: 0,
  totalDevice: 0,
  availableDevice: 0,
  sparePartInventory: 0,
  maintenanceStaff: 0,
  emergencyMaterial: 0,
});

const serviceData = ref({
  reservationSuccessRate: 0,
  entryResponseDuration: 0,
  paymentConvenienceRate: 0,
  userSatisfactionRate: 0,
  complaintRate: 0,
  complaintSettlementRate: 0,
  repetitiveComplaintRate: 0,
  oneTimeSettlementRate: 0,
});

const efficiencyData = ref({
  roadsideTurnoverRate: 0,
  orderProcessingDuration: 0,
  faultDisposalDuration: 0,
  workOrderClosedLoopRate: 0,
  collaborationDuration: 0,
  repetitiveDisposalRate: 0,
  dispatchResponseSpeed: 0,
  workOrderTimeoutRate: 0,
  perCapitaDisposalVolume: 0,
});

const complianceData = ref({
  chargeComplianceRate: 0,
  orderAccuracyRate: 0,
  rectificationCompletionRate: 0,
  servicePositiveCommentRate: 0,
  illegalParkingCount: 0,
  arrearsClearanceRate: 0,
});

const riskData = ref({
  fireHazard: 0,
  accidentOccurrenceRate: 0,
  earlyWarningDisposalRate: 0,
  rectificationClosedLoopRate: 0,
  highRiskAreaProportion: 0,
});

const developmentData = ref({
  lotGrowthSpeed: 0,
  roadsideExpansionCount: 0,
  serviceCoverageGrowthRate: 0,
  utilizationImprovementRate: 0,
  chargingServicePenetrationRate: 0,
  smartDeviceCoverageRate: 0,
});

// 面板全屏切换
const handleBack = () => {
  router.push('/');
};

const clickFullscreen = () => {
  if (!screenFull.isEnabled) {
    ElMessage.warning('您的浏览器不支持全屏功能');
    return;
  }
  const targetEl = pageContainerRef.value;
  screenFull.isFullscreen ? screenFull.exit() : screenFull.request(targetEl);
};

const updateShowTime = () => {
  const dt = new Date();
  const y = dt.getFullYear();
  const mt = dt.getMonth() + 1;
  const day = dt.getDate();
  const h = dt.getHours().toString().padStart(2, '0');
  const m = dt.getMinutes().toString().padStart(2, '0');
  const s = dt.getSeconds().toString().padStart(2, '0');

  const showTimeEl = document.querySelector('.showTime');
  if (showTimeEl) {
    showTimeEl.innerHTML = `${y}年${mt}月${day}日 ${h}时${m}分${s}秒`;
  }
};

// 批量获取所有指标数据
const fetchAllIndicators = async () => {
  try {
    // 并行请求所有接口，提升性能
    const [
      operationRes,
      resourceRes,
      serviceRes,
      efficiencyRes,
      complianceRes,
      riskRes,
      developmentRes,
    ] = await Promise.all([
      fetchParkingOperationIndicators(),
      fetchParkingResourceIndicators(),
      fetchParkingServiceIndicators(),
      fetchParkingEfficiencyIndicators(),
      fetchParkingComplianceIndicators(),
      fetchParkingRiskIndicators(),
      fetchParkingDevelopmentIndicators(),
    ]);

    // 赋值给响应式数据
    operationData.value = operationRes;
    resourceData.value = resourceRes;
    serviceData.value = serviceRes;
    efficiencyData.value = efficiencyRes;
    complianceData.value = complianceRes;
    riskData.value = riskRes;
    developmentData.value = developmentRes;
  } catch (error) {
    ElMessage.error('指标数据获取失败');
    console.error('指标数据请求异常：', error);
  }
};

onMounted(() => {
  updateShowTime();
  timeTimer = setInterval(updateShowTime, 1000);
  // 初始化获取指标数据
  fetchAllIndicators();
});

onUnmounted(() => {
  if (timeTimer) clearInterval(timeTimer);
});
</script>

<template>
  <div class="page-container" ref="pageContainerRef">
    <div class="mainbox">
      <div class="top">
        <!-- 运行类指标面板 -->
        <div class="panel top-left">
          <div class="header-actions">
            <div class="actions-left">
              <p>运行类指标</p>
            </div>
            <div class="actions-right">
              <el-icon style="font-size: 1vw; color: #409eff">
                <Operation />
              </el-icon>
            </div>
          </div>
          <div class="operation-indicators">
            <div class="operation-indicators-item">
              <div class="stat-title">停车场开放率</div>
              <div class="stat-value">
                {{ (operationData.parkingLotOpeningRate * 100).toFixed(2) }}
              </div>
              <div class="stat-unit">%</div>
            </div>
            <div class="operation-indicators-item">
              <div class="stat-title">路侧泊位使用率</div>
              <div class="stat-value">
                {{ (operationData.roadsideUtilizationRate * 100).toFixed(2) }}
              </div>
              <div class="stat-unit">%</div>
            </div>
            <div class="operation-indicators-item">
              <div class="stat-title">设备在线率</div>
              <div class="stat-value">
                {{ (operationData.deviceOnlineRate * 100).toFixed(2) }}
              </div>
              <div class="stat-unit">%</div>
            </div>
            <div class="operation-indicators-item">
              <div class="stat-title">设备完好率</div>
              <div class="stat-value">
                {{ (operationData.deviceIntegrityRate * 100).toFixed(2) }}
              </div>
              <div class="stat-unit">%</div>
            </div>
            <div class="operation-indicators-item">
              <div class="stat-title">收费终端响应成功率</div>
              <div class="stat-value">
                {{ (operationData.chargeResponseSuccessRate * 100).toFixed(2) }}
              </div>
              <div class="stat-unit">%</div>
            </div>
            <div class="operation-indicators-item">
              <div class="stat-title">故障发生率</div>
              <div class="stat-value">
                {{ (operationData.faultOccurrenceRate * 100).toFixed(2) }}
              </div>
              <div class="stat-unit">%</div>
            </div>
            <div class="operation-indicators-item">
              <div class="stat-title">设备离线数</div>
              <div class="stat-value">
                {{ operationData.deviceOfflineCount }}
              </div>
              <div class="stat-unit">台</div>
            </div>
            <div class="operation-indicators-item">
              <div class="stat-title">设备启停次数</div>
              <div class="stat-value">
                {{ operationData.deviceStartStopTimes }}
              </div>
              <div class="stat-unit">次</div>
            </div>
          </div>
          <div class="panel-footer"></div>
        </div>

        <!-- 资源类指标面板 -->
        <div class="panel top-middle">
          <div class="header-actions">
            <div class="actions-left">
              <p>资源类指标</p>
            </div>
            <div class="actions-right">
              <el-icon style="font-size: 1vw; color: #409eff">
                <Operation />
              </el-icon>
            </div>
          </div>
          <div class="resource-indicators">
            <div class="resource-indicators-item">
              <div class="stat-title">总路侧泊位数</div>
              <div class="stat-value">{{ resourceData.totalRoadside }}</div>
              <div class="stat-unit">个</div>
            </div>
            <div class="resource-indicators-item">
              <div class="stat-title">可用路侧泊位数</div>
              <div class="stat-value">{{ resourceData.availableRoadside }}</div>
              <div class="stat-unit">个</div>
            </div>
            <div class="resource-indicators-item">
              <div class="stat-title">闲置路侧泊位数</div>
              <div class="stat-value">{{ resourceData.idleRoadside }}</div>
              <div class="stat-unit">个</div>
            </div>
            <div class="resource-indicators-item">
              <div class="stat-title">路侧泊位周转次数</div>
              <div class="stat-value">
                {{ resourceData.roadsideTurnoverTimes }}
              </div>
              <div class="stat-unit">次/日</div>
            </div>
            <div class="resource-indicators-item">
              <div class="stat-title">设备总数</div>
              <div class="stat-value">{{ resourceData.totalDevice }}</div>
              <div class="stat-unit">台</div>
            </div>
            <div class="resource-indicators-item">
              <div class="stat-title">可用设备数</div>
              <div class="stat-value">{{ resourceData.availableDevice }}</div>
              <div class="stat-unit">台</div>
            </div>
            <div class="resource-indicators-item">
              <div class="stat-title">备件库存数</div>
              <div class="stat-value">
                {{ resourceData.sparePartInventory }}
              </div>
              <div class="stat-unit">件</div>
            </div>
            <div class="resource-indicators-item">
              <div class="stat-title">运维人员数</div>
              <div class="stat-value">{{ resourceData.maintenanceStaff }}</div>
              <div class="stat-unit">人</div>
            </div>
            <div class="resource-indicators-item">
              <div class="stat-title">应急物资数</div>
              <div class="stat-value">{{ resourceData.emergencyMaterial }}</div>
              <div class="stat-unit">件</div>
            </div>
          </div>
          <div class="panel-footer"></div>
        </div>

        <!-- 服务类指标面板 -->
        <div class="panel top-right">
          <div class="header-actions">
            <div class="actions-left">
              <p>服务类指标</p>
            </div>
            <div class="actions-right">
              <el-icon style="font-size: 1vw; color: #409eff">
                <Operation />
              </el-icon>
            </div>
          </div>
          <div class="service-indicators">
            <div class="service-indicators-item">
              <div class="stat-title">预约成功率</div>
              <div class="stat-value">
                {{ (serviceData.reservationSuccessRate * 100).toFixed(2) }}
              </div>
              <div class="stat-unit">%</div>
            </div>
            <div class="service-indicators-item">
              <div class="stat-title">入场响应时长</div>
              <div class="stat-value">
                {{ serviceData.entryResponseDuration }}
              </div>
              <div class="stat-unit">秒</div>
            </div>
            <div class="service-indicators-item">
              <div class="stat-title">缴费便捷率</div>
              <div class="stat-value">
                {{ (serviceData.paymentConvenienceRate * 100).toFixed(2) }}
              </div>
              <div class="stat-unit">%</div>
            </div>
            <div class="service-indicators-item">
              <div class="stat-title">用户满意度</div>
              <div class="stat-value">
                {{ (serviceData.userSatisfactionRate * 100).toFixed(2) }}
              </div>
              <div class="stat-unit">%</div>
            </div>
            <div class="service-indicators-item">
              <div class="stat-title">投诉率</div>
              <div class="stat-value">
                {{ (serviceData.complaintRate * 100).toFixed(2) }}
              </div>
              <div class="stat-unit">%</div>
            </div>
            <div class="service-indicators-item">
              <div class="stat-title">投诉办结率</div>
              <div class="stat-value">
                {{ (serviceData.complaintSettlementRate * 100).toFixed(2) }}
              </div>
              <div class="stat-unit">%</div>
            </div>
            <div class="service-indicators-item">
              <div class="stat-title">重复投诉率</div>
              <div class="stat-value">
                {{ (serviceData.repetitiveComplaintRate * 100).toFixed(2) }}
              </div>
              <div class="stat-unit">%</div>
            </div>
            <div class="service-indicators-item">
              <div class="stat-title">一次办结率</div>
              <div class="stat-value">
                {{ (serviceData.oneTimeSettlementRate * 100).toFixed(2) }}
              </div>
              <div class="stat-unit">%</div>
            </div>
          </div>
          <div class="panel-footer"></div>
        </div>
      </div>

      <div class="bottom">
        <!-- 效率类指标面板 -->
        <div class="panel bottom-left1">
          <div class="header-actions">
            <div class="actions-left">
              <p>效率类指标</p>
            </div>
            <div class="actions-right">
              <el-icon style="font-size: 1vw; color: #409eff">
                <Operation />
              </el-icon>
            </div>
          </div>
          <div class="efficiency-indicators">
            <div class="efficiency-indicators-item">
              <div class="stat-title">路侧泊位周转率</div>
              <div class="stat-value">
                {{ efficiencyData.roadsideTurnoverRate.toFixed(2) }}
              </div>
              <div class="stat-unit">次/日</div>
            </div>
            <div class="efficiency-indicators-item">
              <div class="stat-title">订单处理时长</div>
              <div class="stat-value">
                {{ efficiencyData.orderProcessingDuration }}
              </div>
              <div class="stat-unit">分钟</div>
            </div>
            <div class="efficiency-indicators-item">
              <div class="stat-title">故障处置时长</div>
              <div class="stat-value">
                {{ efficiencyData.faultDisposalDuration.toFixed(1) }}
              </div>
              <div class="stat-unit">分钟</div>
            </div>
            <div class="efficiency-indicators-item">
              <div class="stat-title">工单闭环率</div>
              <div class="stat-value">
                {{ (efficiencyData.workOrderClosedLoopRate * 100).toFixed(2) }}
              </div>
              <div class="stat-unit">%</div>
            </div>
            <div class="efficiency-indicators-item">
              <div class="stat-title">跨部门协同耗时</div>
              <div class="stat-value">
                {{ efficiencyData.collaborationDuration.toFixed(1) }}
              </div>
              <div class="stat-unit">分钟</div>
            </div>
            <div class="efficiency-indicators-item">
              <div class="stat-title">重复处置率</div>
              <div class="stat-value">
                {{ (efficiencyData.repetitiveDisposalRate * 100).toFixed(2) }}
              </div>
              <div class="stat-unit">%</div>
            </div>
            <div class="efficiency-indicators-item">
              <div class="stat-title">调度响应速度</div>
              <div class="stat-value">
                {{ efficiencyData.dispatchResponseSpeed.toFixed(1) }}
              </div>
              <div class="stat-unit">分钟</div>
            </div>
            <div class="efficiency-indicators-item">
              <div class="stat-title">工单超时率</div>
              <div class="stat-value">
                {{ (efficiencyData.workOrderTimeoutRate * 100).toFixed(2) }}
              </div>
              <div class="stat-unit">%</div>
            </div>
            <div class="efficiency-indicators-item">
              <div class="stat-title">人均处置量</div>
              <div class="stat-value">
                {{ efficiencyData.perCapitaDisposalVolume }}
              </div>
              <div class="stat-unit">单/人</div>
            </div>
          </div>
          <div class="panel-footer"></div>
        </div>

        <!-- 合规类指标面板 -->
        <div class="panel bottom-left2">
          <div class="header-actions">
            <div class="actions-left">
              <p>合规类指标</p>
            </div>
            <div class="actions-right">
              <el-icon style="font-size: 1vw; color: #409eff">
                <Operation />
              </el-icon>
            </div>
          </div>
          <div class="compliance-indicators">
            <div class="compliance-indicators-item">
              <div class="stat-title">收费合规率</div>
              <div class="stat-value">
                {{ (complianceData.chargeComplianceRate * 100).toFixed(2) }}
              </div>
              <div class="stat-unit">%</div>
            </div>
            <div class="compliance-indicators-item">
              <div class="stat-title">订单准确率</div>
              <div class="stat-value">
                {{ (complianceData.orderAccuracyRate * 100).toFixed(2) }}
              </div>
              <div class="stat-unit">%</div>
            </div>
            <div class="compliance-indicators-item">
              <div class="stat-title">整改完成率</div>
              <div class="stat-value">
                {{
                  (complianceData.rectificationCompletionRate * 100).toFixed(2)
                }}
              </div>
              <div class="stat-unit">%</div>
            </div>
            <div class="compliance-indicators-item">
              <div class="stat-title">服务好评率</div>
              <div class="stat-value">
                {{
                  (complianceData.servicePositiveCommentRate * 100).toFixed(2)
                }}
              </div>
              <div class="stat-unit">%</div>
            </div>
            <div class="compliance-indicators-item">
              <div class="stat-title">违法违规停车次数</div>
              <div class="stat-value">
                {{ complianceData.illegalParkingCount }}
              </div>
              <div class="stat-unit">次</div>
            </div>
            <div class="compliance-indicators-item">
              <div class="stat-title">欠费结清率</div>
              <div class="stat-value">
                {{ (complianceData.arrearsClearanceRate * 100).toFixed(2) }}
              </div>
              <div class="stat-unit">%</div>
            </div>
          </div>
          <div class="panel-footer"></div>
        </div>

        <!-- 风险类指标面板 -->
        <div class="panel bottom-right1">
          <div class="header-actions">
            <div class="actions-left">
              <p>风险类指标</p>
            </div>
            <div class="actions-right">
              <el-icon style="font-size: 1vw; color: #409eff">
                <Operation />
              </el-icon>
            </div>
          </div>
          <div class="risk-indicators">
            <div class="risk-indicators-item">
              <div class="stat-title">火灾隐患数</div>
              <div class="stat-value">{{ riskData.fireHazard }}</div>
              <div class="stat-unit">处</div>
            </div>
            <div class="risk-indicators-item">
              <div class="stat-title">事故发生率</div>
              <div class="stat-value">
                {{ (riskData.accidentOccurrenceRate * 100).toFixed(3) }}
              </div>
              <div class="stat-unit">%</div>
            </div>
            <div class="risk-indicators-item">
              <div class="stat-title">预警处置率</div>
              <div class="stat-value">
                {{ (riskData.earlyWarningDisposalRate * 100).toFixed(2) }}
              </div>
              <div class="stat-unit">%</div>
            </div>
            <div class="risk-indicators-item">
              <div class="stat-title">安全整改闭环率</div>
              <div class="stat-value">
                {{ (riskData.rectificationClosedLoopRate * 100).toFixed(2) }}
              </div>
              <div class="stat-unit">%</div>
            </div>
            <div class="risk-indicators-item">
              <div class="stat-title">高风险区域占比</div>
              <div class="stat-value">
                {{ (riskData.highRiskAreaProportion * 100).toFixed(2) }}
              </div>
              <div class="stat-unit">%</div>
            </div>
          </div>
          <div class="panel-footer"></div>
        </div>

        <!-- 发展类指标面板 -->
        <div class="panel bottom-right2">
          <div class="header-actions">
            <div class="actions-left">
              <p>发展类指标</p>
            </div>
            <div class="actions-right">
              <el-icon style="font-size: 1vw; color: #409eff">
                <Operation />
              </el-icon>
            </div>
          </div>
          <div class="development-indicators">
            <div class="development-indicators-item">
              <div class="stat-title">停车场增长速度</div>
              <div class="stat-value">
                {{ (developmentData.lotGrowthSpeed * 100).toFixed(2) }}
              </div>
              <div class="stat-unit">%</div>
            </div>
            <div class="development-indicators-item">
              <div class="stat-title">路侧泊位扩容数量</div>
              <div class="stat-value">
                {{ developmentData.roadsideExpansionCount }}
              </div>
              <div class="stat-unit">个</div>
            </div>
            <div class="development-indicators-item">
              <div class="stat-title">服务覆盖增长率</div>
              <div class="stat-value">
                {{
                  (developmentData.serviceCoverageGrowthRate * 100).toFixed(2)
                }}
              </div>
              <div class="stat-unit">%</div>
            </div>
            <div class="development-indicators-item">
              <div class="stat-title">使用率提升率</div>
              <div class="stat-value">
                {{
                  (developmentData.utilizationImprovementRate * 100).toFixed(2)
                }}
              </div>
              <div class="stat-unit">%</div>
            </div>
            <div class="development-indicators-item">
              <div class="stat-title">充电服务渗透率</div>
              <div class="stat-value">
                {{
                  (
                    developmentData.chargingServicePenetrationRate * 100
                  ).toFixed(2)
                }}
              </div>
              <div class="stat-unit">%</div>
            </div>
            <div class="development-indicators-item">
              <div class="stat-title">智慧化设备覆盖率</div>
              <div class="stat-value">
                {{ (developmentData.smartDeviceCoverageRate * 100).toFixed(2) }}
              </div>
              <div class="stat-unit">%</div>
            </div>
          </div>
          <div class="panel-footer"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../../../templatesstyle/common';
@import '../../../templatesstyle/operation-indicators';
@import '../../../templatesstyle/resource-indicators';
@import '../../../templatesstyle/service-indicators';
@import '../../../templatesstyle/efficiency-indicators';
@import '../../../templatesstyle/compliance-indicators';
@import '../../../templatesstyle/risk-indicators';
@import '../../../templatesstyle/development-indicators';

// 最外层容器
.page-container {
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  padding: 0 1vw;
  overflow: hidden;
  color: #fff;
  background: url('../../images/bg.jpg');
}

.header-box {
  position: relative;
  width: 100%;
  height: 10vh;
  font-size: 2.1vw;
  font-weight: bold;
  color: #0cf;
  background: url('../../images/head_bg.png') no-repeat;
  background-size: 100% 100%;

  .head-name {
    position: absolute;
    left: 50%;
    display: inline-block;
    line-height: 9vh;
    white-space: nowrap;
    transform: translateX(-50%);
  }
}

.panel {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding: 0.5vw;
  background: url('../../images/line(1).png') rgb(255 255 255 / 4%);
  border: 0.2vh solid rgb(25 186 139 / 17%);
}

.mainbox {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0.6vw;
  height: 89vh;
  margin: 0 auto;
}

.top {
  display: flex;
  gap: 0.6vw;
  height: 49%;
}

.top-left {
  flex: 1;
}

.top-middle {
  flex: 1;
}

.top-right {
  flex: 1;
}

.bottom {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6vw;
  height: 49%;
}

.bottom-left1 {
  flex: 3;
  min-width: 200px;
}

.bottom-left2 {
  flex: 2;
  min-width: 200px;
}

.bottom-right1 {
  flex: 2;
  min-width: 200px;
}

.bottom-right2 {
  flex: 2;
  min-width: 200px;
}
</style>
