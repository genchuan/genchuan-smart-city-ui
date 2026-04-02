<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import { ElLoading, ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  exportOrderAlarm,
  getOrderAlarmDetail,
  getOrderAlarmPage,
  updateOrderAlarm,
} from '#/api/genchuan/industry/energyCharging/carCharging/faultAlarm/orderAlarm';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { $t } from '#/locales';

import CompleteDialog from '../components/CompleteDialog.vue';
import HandleDialog from '../components/HandleDialog.vue';
import RemarkDialog from '../components/RemarkDialog.vue';
import VerifyDialog from '../components/VerifyDialog.vue';
import {
  detailFields,
  formatTimestamp,
  getAbnormalTypeTagType,
  getAlarmStatusTagType,
  getHandleMeasureTagType,
  getVerifyResultTagType,
  textObj,
  useFormSchema,
  useGridColumns,
  useSearchFormSchema,
} from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  showStats: {
    type: Boolean,
    default: false,
  },
  toggleStats: {
    type: Function,
    default: () => {},
  },
});

const getTitle = computed(() => {
  return formData.value?.id ? textObj.editText : textObj.addText;
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

const detailDrawerRef = ref(null);
const formData = ref();

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    formDrawerApi.close();
  },
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    const values = await formApi.getValues();
    try {
      await updateOrderAlarm({ ...values, id: formData.value.id });
      ElMessage.success($t('ui.actionMessage.editSuccess'));
      formDrawerApi.close();
      handleRefresh();
    } catch (error) {
      console.error(error);
      ElMessage.error('编辑失败');
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
      if (formData.value?.id) {
        await formApi.setValues(formData.value);
      } else {
        formApi.resetForm();
      }
    }
  },
});

// 弹窗组件引用
const verifyDialogRef = ref(null);
const handleDialogRef = ref(null);
const completeDialogRef = ref(null);
const remarkDialogRef = ref(null);

/** 刷新表格 - 同时清除所有快捷筛选 */
function handleRefresh() {
  // 清除所有快捷筛选变量
  filterPlateNo.value = '';
  filterAbnormalType.value = '';
  filterAlarmStatus.value = '';
  filterCreatorName.value = '';
  filterAlarmTime.value = '';
  filterHandleTime.value = '';
  filterCreateTime.value = '';
  gridApi.query();
}

/** 导出表格 */
async function handleExport() {
  try {
    const data = await exportOrderAlarm();
    downloadFileFromBlobPart({ fileName: '订单告警表.xls', source: data });
    ElMessage.success('导出成功');
  } catch (error) {
    ElMessage.error('导出失败');
    console.error(error);
  }
}

/** 创建 - 已屏蔽 */
function handleCreate() {
  // 功能已屏蔽
  ElMessage.info('新增功能暂未开放');
}

/** 编辑 */
async function handleEdit(row) {
  formDrawerApi.setData({
    title: textObj.editText,
    ...row,
  });
  formDrawerApi.open();
}

/** 删除 - 已屏蔽 */
async function handleDelete(row) {
  // 功能已屏蔽
  ElMessage.info('删除功能暂未开放');
}

/** 批量删除 - 已屏蔽 */
async function handleDeleteBatch() {
  // 功能已屏蔽
  ElMessage.info('批量删除功能暂未开放');
}

const checkedIds = ref([]);
const checkedRows = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
  checkedRows.value = records;
}

// 快捷筛选变量
const filterPlateNo = ref('');
const filterAbnormalType = ref('');
const filterAlarmStatus = ref('');
const filterCreatorName = ref('');
const filterAlarmTime = ref(''); // 告警时间筛选（显示用，格式：yyyy-MM-dd HH:mm:ss）
const filterHandleTime = ref(''); // 处理时间筛选（显示用，格式：yyyy-MM-dd HH:mm:ss）
const filterCreateTime = ref(''); // 创建时间筛选（折线图钻取用，显示用，格式：yyyy-MM-dd HH:mm:ss）

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  list: [],
  searchParams: {},
});

const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

// 表格数据获取
const getTableData = async (pageObj) => {
  const page = pageObj.page;

  dataObj.currentPage = page.currentPage;
  dataObj.pageSize = page.pageSize;

  try {
    // 构建时间范围数组参数
    // 取日期部分（前10个字符：yyyy-MM-dd），避免重复追加时间
    const alarmTimeParam = filterAlarmTime.value
      ? [filterAlarmTime.value.substring(0, 10) + ' 00:00:00', filterAlarmTime.value.substring(0, 10) + ' 23:59:59']
      : undefined;
    const handleTimeParam = filterHandleTime.value
      ? [filterHandleTime.value.substring(0, 10) + ' 00:00:00', filterHandleTime.value.substring(0, 10) + ' 23:59:59']
      : undefined;
    const createTimeParam = filterCreateTime.value
      ? [filterCreateTime.value.substring(0, 10) + ' 00:00:00', filterCreateTime.value.substring(0, 10) + ' 23:59:59']
      : undefined;

    const queryParams = {
      pageNo: page.currentPage,
      pageSize: page.pageSize,
      plateNo: filterPlateNo.value,
      abnormalType: filterAbnormalType.value,
      alarmStatus: filterAlarmStatus.value,
      creatorName: filterCreatorName.value,
      // 告警时间使用alarmTime参数（数组格式：[开始时间, 结束时间]）
      alarmTime: alarmTimeParam,
      // 处理时间使用handleTime参数（数组格式：[开始时间, 结束时间]）
      handleTime: handleTimeParam,
      // 创建时间（折线图钻取，数组格式：[开始时间, 结束时间]）
      createTime: createTimeParam,
      ...dataObj.searchParams,
    };

    const response = await getOrderAlarmPage(queryParams);
    if (response) {
      dataObj.total = response.total;
      dataObj.list = response.list.map((item) => ({
        ...item,
        id: String(item.id),
        alarmTime: item.alarmTime ? formatTimestamp(item.alarmTime) : '',
        handleTime: item.handleTime ? formatTimestamp(item.handleTime) : '',
      }));
    }
  } catch (error) {
    ElMessage.error('获取数据失败');
    console.error(error);
  }

  return dataObj;
};

const [QueryForm] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: useSearchFormSchema().map((v) => {
    delete v.rules;
    return { ...v };
  }),
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});

// 搜索表单查询
function onSubmit(values) {
  const searchParams = { ...values };

  // 处理告警时间范围
  if (values.alarmTime && Array.isArray(values.alarmTime) && values.alarmTime.length === 2) {
    searchParams.startAlarmTime = values.alarmTime[0];
    searchParams.endAlarmTime = values.alarmTime[1];
    delete searchParams.alarmTime;
  }

  // 处理处理时间范围
  if (values.handleTime && Array.isArray(values.handleTime) && values.handleTime.length === 2) {
    searchParams.startHandleTime = values.handleTime[0];
    searchParams.endHandleTime = values.handleTime[1];
    delete searchParams.handleTime;
  }

  dataObj.searchParams = searchParams;
  handleRefresh();
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

const openOrderDetail = () => {
  ElMessage.info('打开订单详情');
};

const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  if (detailDrawerRef.value) {
    detailDrawerRef.value.open();
  }
};

const handleSerachShow = () => {
  drawerApi.open();
};

const handleFullShow = () => {
  screenfull.toggle();
};

// ==================== 列表页批量操作按钮 ====================

// 核实按钮 - 批量勾选未核实告警
const handleBatchVerify = () => {
  if (isEmpty(checkedIds.value)) {
    ElMessage.warning('请先选择需要核实的告警');
    return;
  }
  // 检查是否都是未核实状态
  const invalidRows = checkedRows.value.filter(
    (row) => row.alarmStatus !== '0' && row.alarmStatus !== '未核实'
  );
  if (invalidRows.length > 0) {
    ElMessage.warning('只能核实状态为"未核实"的告警');
    return;
  }
  if (verifyDialogRef.value) {
    verifyDialogRef.value.open(checkedIds.value);
  }
};

// 处理按钮 - 批量勾选已核实告警
const handleBatchHandle = () => {
  if (isEmpty(checkedIds.value)) {
    ElMessage.warning('请先选择需要处理的告警');
    return;
  }
  // 检查是否都是已核实状态
  const invalidRows = checkedRows.value.filter(
    (row) => row.alarmStatus !== '1' && row.alarmStatus !== '已核实'
  );
  if (invalidRows.length > 0) {
    ElMessage.warning('只能处理状态为"已核实"的告警');
    return;
  }
  if (handleDialogRef.value) {
    handleDialogRef.value.open(checkedIds.value);
  }
};

// 完结按钮 - 批量勾选处理中告警
const handleBatchComplete = () => {
  if (isEmpty(checkedIds.value)) {
    ElMessage.warning('请先选择需要完结的告警');
    return;
  }
  // 检查是否都是处理中状态
  const invalidRows = checkedRows.value.filter(
    (row) => row.alarmStatus !== '2' && row.alarmStatus !== '处理中'
  );
  if (invalidRows.length > 0) {
    ElMessage.warning('只能完结状态为"处理中"的告警');
    return;
  }
  if (completeDialogRef.value) {
    completeDialogRef.value.open(checkedIds.value);
  }
};

// ==================== 列表行操作按钮 ====================

// 行内核实按钮
const handleRowVerify = (row) => {
  if (row.alarmStatus !== '0' && row.alarmStatus !== '未核实') {
    ElMessage.warning('只能核实状态为"未核实"的告警');
    return;
  }
  if (verifyDialogRef.value) {
    verifyDialogRef.value.open([row.id]);
  }
};

// 行内处理按钮
const handleRowHandle = (row) => {
  if (row.alarmStatus !== '1' && row.alarmStatus !== '已核实') {
    ElMessage.warning('只能处理状态为"已核实"的告警');
    return;
  }
  if (handleDialogRef.value) {
    handleDialogRef.value.open([row.id]);
  }
};

// 行内完结按钮
const handleRowComplete = (row) => {
  if (row.alarmStatus !== '2' && row.alarmStatus !== '处理中') {
    ElMessage.warning('只能完结状态为"处理中"的告警');
    return;
  }
  if (completeDialogRef.value) {
    completeDialogRef.value.open([row.id]);
  }
};

// 行内备注按钮
const handleRowRemark = (row) => {
  if (remarkDialogRef.value) {
    remarkDialogRef.value.open(row.id, row.remark);
  }
};

// 根据状态判断是否显示操作按钮
const canVerify = (row) => {
  return row.alarmStatus === '0' || row.alarmStatus === '未核实';
};

const canHandle = (row) => {
  return row.alarmStatus === '1' || row.alarmStatus === '已核实';
};

const canComplete = (row) => {
  return row.alarmStatus === '2' || row.alarmStatus === '处理中';
};

// ==================== 快捷筛选处理 ====================

// 处理用户ID/车牌号点击
const handleUserInfoClick = (plateNo) => {
  filterPlateNo.value = filterPlateNo.value === plateNo ? '' : plateNo;
  gridApi.query();
};

// 处理异常类型点击
const handleAbnormalTypeClick = (abnormalType) => {
  filterAbnormalType.value =
    filterAbnormalType.value === abnormalType ? '' : abnormalType;
  gridApi.query();
};

// 处理告警状态点击
const handleAlarmStatusClick = (alarmStatus) => {
  filterAlarmStatus.value =
    filterAlarmStatus.value === alarmStatus ? '' : alarmStatus;
  gridApi.query();
};

// 处理操作人点击
const handleCreatorClick = (creatorName) => {
  filterCreatorName.value =
    filterCreatorName.value === creatorName ? '' : creatorName;
  gridApi.query();
};

// 处理告警时间点击 - 直接使用时间字符串（格式：yyyy-MM-dd HH:mm:ss）
const handleAlarmTimeClick = (alarmTimeStr) => {
  if (!alarmTimeStr) return;
  // 保存显示用的时间字符串，同时作为参数使用
  filterAlarmTime.value = alarmTimeStr;
  gridApi.query();
};

// 处理处理时间点击 - 直接使用时间字符串（格式：yyyy-MM-dd HH:mm:ss）
const handleHandleTimeClick = (handleTimeStr) => {
  if (!handleTimeStr) return;
  // 保存显示用的时间字符串，同时作为参数使用
  filterHandleTime.value = handleTimeStr;
  gridApi.query();
};

// 取消筛选
const handleCancelPlateNoFilter = () => {
  filterPlateNo.value = '';
  gridApi.query();
};

const handleCancelAbnormalTypeFilter = () => {
  filterAbnormalType.value = '';
  gridApi.query();
};

const handleCancelAlarmStatusFilter = () => {
  filterAlarmStatus.value = '';
  gridApi.query();
};

const handleCancelCreatorFilter = () => {
  filterCreatorName.value = '';
  gridApi.query();
};

const handleCancelAlarmTimeFilter = () => {
  filterAlarmTime.value = '';
  gridApi.query();
};

const handleCancelHandleTimeFilter = () => {
  filterHandleTime.value = '';
  gridApi.query();
};

const handleCancelCreateTimeFilter = () => {
  filterCreateTime.value = '';
  gridApi.query();
};

// 处理统计组件的钻取筛选
const handleStatsFilter = (type, value) => {
  if (type === 'status') {
    if (value === 'all') {
      // 总订单告警数 - 清空状态筛选
      filterAlarmStatus.value = '';
    } else if (value === 'unhandled') {
      // 未处理数 - 筛选未核实、已核实、处理中状态
      // 这里需要特殊处理，可能需要多个状态筛选
      filterAlarmStatus.value = '';
    } else if (value === 'completed') {
      // 处理完成数 - 筛选已完结状态
      const dictOptions = getDictOptions(
        DICT_TYPE.ORDER_ALARM_ALARM_STATUS,
        'string',
      );
      const dictItem = dictOptions.find((item) => item.label === '已完结');
      filterAlarmStatus.value = dictItem ? dictItem.value : '3';
    } else {
      // 根据状态名称获取字典值
      const dictOptions = getDictOptions(
        DICT_TYPE.ORDER_ALARM_ALARM_STATUS,
        'string',
      );
      const dictItem = dictOptions.find((item) => item.label === value);
      filterAlarmStatus.value = dictItem ? dictItem.value : value;
    }
  } else if (type === 'abnormalType') {
    // 饼图钻取 - 根据异常类型名称获取字典值
    const dictOptions = getDictOptions(
      DICT_TYPE.ORDER_ALARM_ABNORMAL_TYPE,
      'string',
    );
    const dictItem = dictOptions.find((item) => item.label === value);
    filterAbnormalType.value = dictItem ? dictItem.value : value;
  } else if (type === 'date') {
    // 折线图钻取 - 根据日期筛选，使用createTime参数
    // 保存日期部分（yyyy-MM-dd），查询时会构建成数组格式
    filterCreateTime.value = value;
  }
  gridApi.query();
};

// 暴露方法给父组件
defineExpose({
  handleStatsFilter,
});
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <!--   详情抽屉-->
    <DetailDrawer
      ref="detailDrawerRef"
      :title="`${dataObj.detailObj.alarmCode}详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
    />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <!-- 弹窗组件 -->
    <VerifyDialog ref="verifyDialogRef" @success="handleRefresh" />
    <HandleDialog ref="handleDialogRef" @success="handleRefresh" />
    <CompleteDialog ref="completeDialogRef" @success="handleRefresh" />
    <RemarkDialog ref="remarkDialogRef" @success="handleRefresh" />

    <Grid>
      <!-- 快捷筛选标签 -->
      <template #table-title>
        <div
          class="tabel-tabs"
          style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center"
        >
          <!-- 车牌号筛选标签 -->
          <ElTag
            v-if="filterPlateNo"
            type="primary"
            closable
            @close="handleCancelPlateNoFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            车牌号：{{ filterPlateNo }}
          </ElTag>
          <!-- 异常类型筛选标签 -->
          <ElTag
            v-if="filterAbnormalType"
            type="success"
            closable
            @close="handleCancelAbnormalTypeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            异常类型：{{
              getDictObj(
                DICT_TYPE.ORDER_ALARM_ABNORMAL_TYPE,
                String(filterAbnormalType),
              )?.label || filterAbnormalType
            }}
          </ElTag>
          <!-- 告警状态筛选标签 -->
          <ElTag
            v-if="filterAlarmStatus"
            type="warning"
            closable
            @close="handleCancelAlarmStatusFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            告警状态：{{
              getDictObj(
                DICT_TYPE.ORDER_ALARM_ALARM_STATUS,
                String(filterAlarmStatus),
              )?.label || filterAlarmStatus
            }}
          </ElTag>
          <!-- 操作人筛选标签 -->
          <ElTag
            v-if="filterCreatorName"
            type="info"
            closable
            @close="handleCancelCreatorFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            操作人：{{ filterCreatorName }}
          </ElTag>
          <!-- 告警时间筛选标签 - 只显示具体时间 -->
          <ElTag
            v-if="filterAlarmTime"
            type="primary"
            closable
            @close="handleCancelAlarmTimeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            告警时间：{{ filterAlarmTime }}
          </ElTag>
          <!-- 处理时间筛选标签 - 只显示具体时间 -->
          <ElTag
            v-if="filterHandleTime"
            type="primary"
            closable
            @close="handleCancelHandleTimeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            处理时间：{{ filterHandleTime }}
          </ElTag>
        </div>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <!-- 列表页操作按钮：核实、处理、完结 -->
          <IconButton
            content="核实"
            icon-name="QuestionFilled"
            :disabled="isEmpty(checkedIds)"
            @click="handleBatchVerify"
          />
          <IconButton
            content="处理"
            icon-name="Pointer"
            :disabled="isEmpty(checkedIds)"
            @click="handleBatchHandle"
          />
          <IconButton
            content="完结"
            icon-name="CircleCheckFilled"
            :disabled="isEmpty(checkedIds)"
            @click="handleBatchComplete"
          />
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExport"
          />
          <IconButton
            content="搜索"
            icon-name="search"
            @click="handleSerachShow"
          />
          <IconButton
            :content="props.showStats ? '隐藏统计' : '显示统计'"
            :icon-name="props.showStats ? 'ArrowUp' : 'ArrowDown'"
            @click="props.toggleStats"
          />
          <IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
        </div>
      </template>
      <!-- 告警编号插槽 - 点击跳转详情 -->
      <template #alarmCode="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.alarmCode }}
        </el-text>
      </template>
      <!-- 订单编号插槽 - 点击跳转订单详情 -->
      <template #orderCode="{ row }">
        <el-text
          @click="openOrderDetail()"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.orderCode }}
        </el-text>
      </template>
      <!-- 用户ID/车牌号插槽 - 点击筛选 -->
      <template #userInfo="{ row }">
        <el-text
          @click="handleUserInfoClick(row.plateNo)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.userId }}/{{ row.plateNo }}
        </el-text>
      </template>
      <!-- 异常类型插槽 - 点击筛选 -->
      <template #abnormalType="{ row }">
        <ElTag
          @click="handleAbnormalTypeClick(row.abnormalType)"
          :type="getAbnormalTypeTagType(row.abnormalType)"
          style="cursor: pointer"
        >
          {{
            getDictObj(
              DICT_TYPE.ORDER_ALARM_ABNORMAL_TYPE,
              String(row.abnormalType),
            )?.label || row.abnormalType
          }}
        </ElTag>
      </template>
      <!-- 告警时间插槽 - 点击筛选 -->
      <template #alarmTime="{ row }">
        <el-text
          @click="handleAlarmTimeClick(row.alarmTime)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.alarmTime }}
        </el-text>
      </template>
      <!-- 关联充电桩插槽 - 点击跳转充电桩详情 -->
      <template #pileName="{ row }">
        <el-text
          @click="$message.info('打开充电桩详情')"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.pileName }}
        </el-text>
      </template>
      <!-- 告警状态插槽 - 点击筛选 -->
      <template #alarmStatus="{ row }">
        <ElTag
          @click="handleAlarmStatusClick(row.alarmStatus)"
          :type="getAlarmStatusTagType(row.alarmStatus)"
          style="cursor: pointer"
        >
          {{
            getDictObj(
              DICT_TYPE.ORDER_ALARM_ALARM_STATUS,
              String(row.alarmStatus),
            )?.label || row.alarmStatus
          }}
        </ElTag>
      </template>
      <!-- 核实结果插槽 - 无钻取交互，仅显示字典标签 -->
      <template #verifyResult="{ row }">
        <ElTag :type="getVerifyResultTagType(row.verifyResult)">
          {{
            getDictObj(
              DICT_TYPE.ORDER_ALARM_VERIFY_RESULT,
              String(row.verifyResult),
            )?.label || row.verifyResult
          }}
        </ElTag>
      </template>
      <!-- 处理措施插槽 - 显示字典标签 -->
      <template #handleMeasure="{ row }">
        <ElTag :type="getHandleMeasureTagType(row.handleMeasure)">
          {{
            getDictObj(
              DICT_TYPE.ORDER_ALARM_HANDLE_MEASURE,
              String(row.handleMeasure),
            )?.label || row.handleMeasure
          }}
        </ElTag>
      </template>
      <!-- 处理时间插槽 - 点击筛选 -->
      <template #handleTime="{ row }">
        <el-text
          @click="handleHandleTimeClick(row.handleTime)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.handleTime }}
        </el-text>
      </template>
      <!-- 操作人插槽 - 点击筛选 -->
      <template #creator="{ row }">
        <el-text
          @click="handleCreatorClick(row.creator)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.creator }}
        </el-text>
      </template>
      <!-- 行操作按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <!-- 查看 - 所有状态都显示 -->
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
          <!-- 编辑 - 所有状态都显示 -->
<!--          <IconButton-->
<!--            content="编辑"-->
<!--            icon-name="Edit"-->
<!--            @click="handleEdit(row)"-->
<!--          />-->
          <!-- 核实 - 未核实状态显示 -->
          <IconButton
            v-if="canVerify(row)"
            content="核实"
            icon-name="QuestionFilled"
            @click="handleRowVerify(row)"
          />
          <!-- 处理 - 已核实状态显示 -->
          <IconButton
            v-if="canHandle(row)"
            content="处理"
            icon-name="Pointer"
            @click="handleRowHandle(row)"
          />
          <!-- 完结 - 处理中状态显示 -->
          <IconButton
            v-if="canComplete(row)"
            content="完结"
            icon-name="CircleCheckFilled"
            @click="handleRowComplete(row)"
          />
          <!-- 备注 - 所有状态都显示 -->
          <IconButton
            content="备注"
            icon-name="ChatLineRound"
            @click="handleRowRemark(row)"
          />
        </div>
      </template>
      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon" v-if="!dataObj.totalShow">
            <ArrowDown />
          </el-icon>
          <el-icon class="tabel-tab-icon" v-if="dataObj.totalShow">
            <ArrowUp />
          </el-icon>
          <span> 本页统计：订单告警数量: {{ dataObj.list.length }} </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
