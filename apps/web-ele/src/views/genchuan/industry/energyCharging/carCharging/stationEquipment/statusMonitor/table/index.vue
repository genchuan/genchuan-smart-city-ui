<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer, useVbenModal } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import { ElImage, ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import { UploadFilled } from '@element-plus/icons-vue';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getDriveinList, exporStatusExcel, handleAbnormal } from '#/api/genchuan/industry/energyCharging/carCharging/stationEquipment/statusMonitor/index.js';
 
import { $t } from '#/locales';
import { formatTimestamp } from '#/utils';

import { useFormSchema, useGridColumns } from './data';
// 引入封装后的详情抽屉组件
import ParkDetailDrawer from './detail.vue';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
});

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    drawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 导出表格 */
async function handleExport() {
  const data = await exporStatusExcel();
  downloadFileFromBlobPart({
    fileName: '车辆状态监控记录.xls',
    source: data,
  });
}

async function handleDeleteBatch() {
  await confirm($t('确定删除这些数据吗？')).then(() => {
    checkedIds.value.forEach(async (v) => {
      // 这里需要实现删除逻辑
      console.log('删除数据', v);
    });
  });
  handleRefresh();
}

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}
// 快捷筛选变量
const filterStationName = ref('');
const filterLotCode = ref('');
const filterDeviceType = ref('');
const filterAlarmLevel = ref('');
const filterMonitorStatus = ref('');
const filterDisposeUser = ref('');

const dataObj = reactive({
  totalShow: false,
  detailObj: {}, // 保留详情对象用于传递给组件
  total: 0,
  currentPage: 1,
  pageSize: 10,
  imgUrl: '',
  serachObj: {},
  list: [],
});
const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};
// 表格数据获取
const getTableData = async (pageObj) => {
  const getParams = {
    pageNo: pageObj.page.currentPage,
    pageSize: pageObj.page.pageSize,
    ...dataObj.serachObj,
  };

  // 有值才传，没值不传递key
  if (filterStationName.value) {
    getParams.stationName = filterStationName.value;
  }
  if (filterLotCode.value) {
    getParams.lotCode = filterLotCode.value;
  }
  if (filterDeviceType.value) {
    getParams.deviceType = filterDeviceType.value;
  }
  if (filterAlarmLevel.value) {
    getParams.alarmLevel = filterAlarmLevel.value;
  }
  if (filterMonitorStatus.value) {
    getParams.monitorStatus = filterMonitorStatus.value;
  }
  if (filterDisposeUser.value) {
    getParams.disposeUser = filterDisposeUser.value;
  }

  const data = await getDriveinList(getParams); 
  dataObj.total = data.total;
  dataObj.list = data.list.map((v) => {
    return {
      ...v,
      auditTime: formatTimestamp(v.auditTime),
      createTime: formatTimestamp(v.createTime),
      disposeTime: formatTimestamp(v.disposeTime),
      monitorTime: formatTimestamp(v.monitorTime),
    };
  });
  return dataObj;
};

const [QueryForm, QueryFormApi] = useVbenForm({
  // 默认展开
  collapsed: false,
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  // 提交函数
  handleSubmit: onSubmit,
  // 垂直布局，label和input在不同行，值为vertical
  // 水平布局，label和input在同一行
  layout: 'horizontal',
  schema: useFormSchema()
    .filter((v) => v.isSearch)
    .map((v) => {
      delete v.rules;
      return {
        ...v,
      };
    }),
  // 是否可展开
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});
// 搜索表单查询
async function onSubmit() {
  dataObj.serachObj = await QueryFormApi.getValues();
  gridApi.reload();
  drawerApi.close();
}
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => getTableData({ page }),
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    pagerConfig: dataObj,
    toolbarConfig: {
      'class-name': 'common-tool-bar-config',
      refresh: true,
      search: true,
    },
    showOverflow: true,
  },
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
  showSearchForm: false,
});

const activeName = ref('');
// 修改打开详情的方法，调用组件的open方法
const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  // 通过ref调用组件的open方法
  parkDetailDrawerRef.value.open();
  console.log(row);
};
const handleClick = () => {
  dataObj.serachObj.plateType = activeName.value;
  gridApi.query();
};

// ==================== 快捷筛选处理 ====================

// 处理所属场站点击
const handleStationClick = (stationName) => {
  filterStationName.value = filterStationName.value === stationName ? '' : stationName;
  gridApi.query();
};

// 处理所属车位点击
const handleLotClick = (lotCode) => {
  filterLotCode.value = filterLotCode.value === lotCode ? '' : lotCode;
  gridApi.query();
};

// 处理设备类型点击
const handleDeviceTypeClick = (deviceType) => {
  filterDeviceType.value = filterDeviceType.value === deviceType ? '' : deviceType;
  gridApi.query();
};

// 处理告警等级点击
const handleAlarmLevelClick = (alarmLevel) => {
  filterAlarmLevel.value = filterAlarmLevel.value === alarmLevel ? '' : alarmLevel;
  gridApi.query();
};

// 处理监测状态点击
const handleMonitorStatusClick = (monitorStatus) => {
  filterMonitorStatus.value = filterMonitorStatus.value === monitorStatus ? '' : monitorStatus;
  gridApi.query();
};

// 处理处置人员点击
const handleDisposeUserClick = (disposeUser) => {
  filterDisposeUser.value = filterDisposeUser.value === disposeUser ? '' : disposeUser;
  gridApi.query();
};

// 取消筛选
const handleCancelStationFilter = () => {
  filterStationName.value = '';
  gridApi.query();
};

const handleCancelLotFilter = () => {
  filterLotCode.value = '';
  gridApi.query();
};

const handleCancelDeviceTypeFilter = () => {
  filterDeviceType.value = '';
  gridApi.query();
};

const handleCancelAlarmLevelFilter = () => {
  filterAlarmLevel.value = '';
  gridApi.query();
};

const handleCancelMonitorStatusFilter = () => {
  filterMonitorStatus.value = '';
  gridApi.query();
};

const handleCancelDisposeUserFilter = () => {
  filterDisposeUser.value = '';
  gridApi.query();
};

const handleSerachShow = () => {
  drawerApi.open();
};
const handleFullShow = () => {
  screenfull.toggle();
};

// 定义组件ref，用于调用组件方法
const parkDetailDrawerRef = ref(null);
const dialogVisible = ref(false);
const openImg = (url) => {
  dataObj.imgUrl = url;
  dialogVisible.value = true;
};
// 异常处置弹窗相关
const abnormalDialogVisible = ref(false);
const abnormalForm = reactive({
  dispose_measure: '', // 处置措施
});

const abnormalFormRules = reactive({
  dispose_measure: [
    { required: true, message: '请输入处置措施', trigger: 'blur' },
    { min: 5, message: '处置措施长度不少于5个字', trigger: 'blur' },
  ],
});

const abnormalFormRef = ref(null);
const currentAbnormalRow = ref(null);

const openAbnormalDrawer = () => {
  // 重置表单
  abnormalForm.dispose_measure = '';
  abnormalFormRef.value?.resetFields();
  // 记录当前选中的行数据
  currentAbnormalRow.value = checkedIds.value.length > 0 ? checkedIds.value : null;
  // 打开弹窗
  abnormalDialogVisible.value = true;
};

const confirmAbnormalHandle = async () => {
  // 先校验表单
  try {
    await abnormalFormRef.value.validate();
  } catch {
    // 表单校验失败，终止操作
    ElMessage.warning('请完善处置措施后提交');
    return;
  }

  try {
    // 调用异常处置接口
    await handleAbnormal({
      ids: checkedIds.value,
      disposeMeasure: abnormalForm.dispose_measure,
    });
    // 提示成功
    ElMessage.success('异常处置操作已提交！');
    // 关闭弹窗
    abnormalDialogVisible.value = false;
    await handleRefresh();
  } catch (error) {
    // 接口调用失败处理
    ElMessage.error(`提交失败：${error.message || '请稍后重试'}`);
  }
};

// 单个设备处置弹窗相关
const disposeDialogVisible = ref(false);
const disposeForm = reactive({
  dispose_measure: '', // 处置措施
});

const disposeFormRules = reactive({
  dispose_measure: [
    { required: true, message: '请输入处置措施', trigger: 'blur' },
    { min: 5, message: '处置措施长度不少于5个字', trigger: 'blur' },
  ],
});

const disposeFormRef = ref(null);
const currentDisposeRow = ref(null);

const handelOpenDisposeDrawer = (row) => {
  // 重置表单
  disposeForm.dispose_measure = '';
  disposeFormRef.value?.resetFields();
  // 记录当前操作的行数据
  currentDisposeRow.value = row;
  // 打开弹窗
  disposeDialogVisible.value = true;
};

const confirmDisposeHandle = async () => {
  // 先校验表单
  try {
    await disposeFormRef.value.validate();
  } catch {
    // 表单校验失败，终止操作
    ElMessage.warning('请完善处置措施后提交');
    return;
  }

  try {
    // 调用处置接口
    await handleAbnormal({
      ids: [currentDisposeRow.value.id],
      disposeMeasure: disposeForm.dispose_measure,
    });
    // 提示成功
    ElMessage.success('处置操作已提交！');
    // 关闭弹窗
    disposeDialogVisible.value = false;
    await handleRefresh();
  } catch (error) { 
    // 接口调用失败处理
    ElMessage.error(`提交失败：${error.msg || '请稍后重试'}`);
  }
}; 
</script>

<template>
  <div class="park-lot-table-new">
    <!-- 异常处置弹窗（包含处置措施输入） -->
    <el-dialog
      title="异常处置"
      v-model="abnormalDialogVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="abnormalForm" :rules="abnormalFormRules" ref="abnormalFormRef" label-width="100px">
        <el-form-item label="处置措施" prop="dispose_measure">
          <el-input
            type="textarea"
            v-model="abnormalForm.dispose_measure"
            placeholder="请输入异常处置的具体措施（必填）"
            rows="4"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="abnormalDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAbnormalHandle">确认提交</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 单个设备处置弹窗（包含处置措施输入） -->
    <el-dialog
      title="设备处置"
      v-model="disposeDialogVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="disposeForm" :rules="disposeFormRules" ref="disposeFormRef" label-width="100px">
        <el-form-item label="处置措施" prop="dispose_measure">
          <el-input
            type="textarea"
            v-model="disposeForm.dispose_measure"
            placeholder="请输入设备处置的具体措施（必填）"
            rows="4"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="disposeDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmDisposeHandle">确认提交</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 使用封装后的详情抽屉组件 -->
    <ParkDetailDrawer 
      ref="parkDetailDrawerRef"
      :detail-obj="dataObj.detailObj"
      title="详情"
    />

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <Grid> 

      <!-- 快捷筛选标签 -->
      <template #table-title>
        <div
          class="tabel-tabs"
          style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center"
        >
          <!-- 所属场站筛选标签 -->
          <ElTag
            v-if="filterStationName"
            type="primary"
            closable
            @close="handleCancelStationFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            所属场站：{{ filterStationName }}
          </ElTag>
          <!-- 所属车位筛选标签 -->
          <ElTag
            v-if="filterLotCode"
            type="success"
            closable
            @close="handleCancelLotFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            所属车位：{{ filterLotCode }}
          </ElTag>
          <!-- 设备类型筛选标签 -->
          <ElTag
            v-if="filterDeviceType"
            type="warning"
            closable
            @close="handleCancelDeviceTypeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            设备类型：{{ filterDeviceType }}
          </ElTag>
          <!-- 告警等级筛选标签 -->
          <ElTag
            v-if="filterAlarmLevel"
            type="info"
            closable
            @close="handleCancelAlarmLevelFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            告警等级：{{ filterAlarmLevel }}
          </ElTag>
          <!-- 监测状态筛选标签 -->
          <ElTag
            v-if="filterMonitorStatus"
            type="primary"
            closable
            @close="handleCancelMonitorStatusFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            监测状态：{{ filterMonitorStatus }}
          </ElTag>
          <!-- 处置人员筛选标签 -->
          <ElTag
            v-if="filterDisposeUser"
            type="success"
            closable
            @close="handleCancelDisposeUserFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            处置人员：{{ filterDisposeUser }}
          </ElTag>
        </div>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
         <IconButton content="异常处置" 
            :disabled="isEmpty(checkedIds)"
             icon-name="bell" 
             @click="openAbnormalDrawer" 
          /> 
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExport"
          />
          <IconButton
            content="批量删除"
            icon-name="delete"
            color="#F56C6C"
            :disabled="isEmpty(checkedIds)"
            @click="handleDeleteBatch"
          />
          <IconButton
            content="搜索"
            icon-name="search"
            @click="handleSerachShow"
          />
          <IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
        </div>
      </template>

      <template #device_code="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.deviceCode }}
        </el-text>
      </template>

      <!-- 所属场站插槽 - 点击筛选 -->
      <template #station_name="{ row }">
        <el-text
          @click="handleStationClick(row.stationName)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.stationName }}
        </el-text>
      </template>

      <!-- 所属车位插槽 - 点击筛选 -->
      <template #lot_code="{ row }">
        <el-text
          @click="handleLotClick(row.lotCode)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.lotCode }}
        </el-text>
      </template>

      <!-- 设备类型插槽 - 点击筛选 -->
      <template #device_type="{ row }">
        <el-tag
          :type="row.deviceType === '充电桩' ? 'primary' : 'info'"
          @click="handleDeviceTypeClick(row.deviceType)"
          style="cursor: pointer"
        >
          {{ row.deviceType }}
        </el-tag>
      </template>

      <!-- 告警等级插槽 - 点击筛选 -->
      <template #alarm_level="{ row }">
        <el-tag
          :type="row.alarmLevel === '严重' ? 'danger' : row.alarmLevel === '一般' ? 'warning' : 'success'"
          @click="handleAlarmLevelClick(row.alarmLevel)"
          style="cursor: pointer"
        >
          {{ row.alarmLevel }}
        </el-tag>
      </template>

      <!-- 监测状态插槽 - 点击筛选 -->
      <template #monitor_status="{ row }">
        <el-tag
          :type="row.monitorStatus === '异常' ? 'danger' : row.monitorStatus === '处置中' ? 'warning' : 'success'"
          @click="handleMonitorStatusClick(row.monitorStatus)"
          style="cursor: pointer"
        >
          {{ row.monitorStatusName || row.monitorStatus }}
        </el-tag>
      </template>

      <!-- 处置人员插槽 - 点击筛选 -->
      <template #dispose_user="{ row }">
        <el-text
          @click="handleDisposeUserClick(row.disposeUser)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.disposeUser || '-' }}
        </el-text>
      </template>

      <template #driveInPhoto="{ row }">
        <ElImage
          style="width: 100px; height: 100px"
          :src="row.driveInPhoto"
          @click="openImg(row.driveInPhoto)"
        />
      </template>

      <template #driveOutPhoto="{ row }">
        <ElImage
          style="width: 100px; height: 100px"
          :src="row.driveOutPhoto"
          @click="openImg(row.driveOutPhoto)"
        />
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools"> 
             <IconButton
            content="刷新"
            icon-name="refresh"
            @click="handleRefresh(row)"
          /> 
          <IconButton
            content="处置"
            icon-name="bell"
            @click="handelOpenDisposeDrawer(row)"
          /> 
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />  
        </div>
      </template>

      <template #bottom>
        <div class="common-total" @click="changeTotalShow"></div>
      </template>
    </Grid>
  </div>
</template>

<style scoped>
.park-img-center {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 700px;
  height: 700px;
}

/* 批量查看表格样式优化 */
:deep(.el-table) {
  --el-table-header-text-color: #303133;
  --el-table-row-hover-bg-color: #f5f7fa;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

/* 证据列表样式 */
.evidence-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  padding: 8px 0;
}

.evidence-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.evidence-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.evidence-name {
  font-size: 12px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.evidence-type {
  font-size: 11px;
  color: #999;
}

.no-evidence {
  color: #999;
  font-size: 12px;
  text-align: center;
  padding: 8px 0;
}
</style>
