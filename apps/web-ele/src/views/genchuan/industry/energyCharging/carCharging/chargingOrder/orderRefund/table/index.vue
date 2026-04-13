<script setup>
import { computed, reactive, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import { ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  exportOrderRefund,
  getOrderRefundPage,
  refundOrderRefundBatch,
} from '#/api/genchuan/industry/energyCharging/carCharging/chargingOrder/orderRefund';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { $t } from '#/locales';

import AuditDialog from '../components/AuditDialog.vue';
import ReapplyDrawer from '../components/ReapplyDrawer.vue';
import RejectDialog from '../components/RejectDialog.vue';
import RemarkDialog from '../components/RemarkDialog.vue';

import {
  detailFields,
  formatTimestamp,
  getRefundChannelTagType,
  getRefundStatusTagType,
  textObj,
  useSearchFormSchema,
  useGridColumns,
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
  schema: [],
  showDefaultActions: false,
});

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    formDrawerApi.close();
  },
  async onConfirm() {
    formDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
    }
  },
});

// 弹窗组件引用
const auditDialogRef = ref(null);
const rejectDialogRef = ref(null);
const remarkDialogRef = ref(null);
const reapplyDrawerRef = ref(null);

/** 刷新表格 - 同时清除所有快捷筛选 */
function handleRefresh() {
  // 清除所有快捷筛选变量
  filterPlateNo.value = '';
  filterRefundStatus.value = '';
  filterAuditUser.value = '';
  filterCreator.value = '';
  filterCreateTime.value = '';
  gridApi.query();
}

/** 导出表格 */
async function handleExport() {
  try {
    const data = await exportOrderRefund();
    downloadFileFromBlobPart({ fileName: '退款订单表.xls', source: data });
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

/** 编辑 - 已屏蔽 */
async function handleEdit(row) {
  // 功能已屏蔽
  ElMessage.info('编辑功能暂未开放');
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
const filterRefundStatus = ref('');
const filterAuditUser = ref('');
const filterCreator = ref('');
const filterCreateTime = ref(''); // 申请时间筛选（显示用，格式：yyyy-MM-dd HH:mm:ss）

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
    const createTimeParam = filterCreateTime.value
      ? [
          `${filterCreateTime.value.substring(0, 10)} 00:00:00`,
          `${filterCreateTime.value.substring(0, 10)} 23:59:59`,
        ]
      : undefined;

    const queryParams = {
      pageNo: page.currentPage,
      pageSize: page.pageSize,
      plateNo: filterPlateNo.value,
      refundStatus: filterRefundStatus.value,
      auditUser: filterAuditUser.value,
      creator: filterCreator.value,
      // 申请时间使用createTime参数（数组格式：[开始时间, 结束时间]）
      createTime: createTimeParam,
      ...dataObj.searchParams,
    };

    const response = await getOrderRefundPage(queryParams);
    if (response) {
      dataObj.total = response.total;
      dataObj.list = response.list.map((item) => ({
        ...item,
        id: String(item.id),
        createTime: item.createTime ? formatTimestamp(item.createTime) : '',
        auditTime: item.auditTime ? formatTimestamp(item.auditTime) : '',
        refundTime: item.refundTime ? formatTimestamp(item.refundTime) : '',
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

  // 处理申请时间范围
  if (
    values.createTime &&
    Array.isArray(values.createTime) &&
    values.createTime.length === 2
  ) {
    searchParams.startCreateTime = values.createTime[0];
    searchParams.endCreateTime = values.createTime[1];
    delete searchParams.createTime;
  }

  // 处理审核时间范围
  if (
    values.auditTime &&
    Array.isArray(values.auditTime) &&
    values.auditTime.length === 2
  ) {
    searchParams.startAuditTime = values.auditTime[0];
    searchParams.endAuditTime = values.auditTime[1];
    delete searchParams.auditTime;
  }

  // 处理退款时间范围
  if (
    values.refundTime &&
    Array.isArray(values.refundTime) &&
    values.refundTime.length === 2
  ) {
    searchParams.startRefundTime = values.refundTime[0];
    searchParams.endRefundTime = values.refundTime[1];
    delete searchParams.refundTime;
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

// 审核按钮 - 批量勾选待审核申请
const handleBatchAudit = () => {
  if (isEmpty(checkedIds.value)) {
    ElMessage.warning('请先选择需要审核的退款申请');
    return;
  }
  // 检查是否都是待审核状态
  const invalidRows = checkedRows.value.filter(
    (row) => !isPendingAudit(row)
  );
  if (invalidRows.length > 0) {
    ElMessage.warning('只能审核状态为"待审核"的退款申请');
    return;
  }
  if (auditDialogRef.value) {
    auditDialogRef.value.open(checkedIds.value);
  }
};

// 退款按钮 - 批量勾选审核通过申请，无需弹窗即时交互
const handleBatchRefund = async () => {
  if (isEmpty(checkedIds.value)) {
    ElMessage.warning('请先选择需要退款的申请');
    return;
  }
  // 检查是否都是审核通过状态
  const invalidRows = checkedRows.value.filter(
    (row) => !isApproved(row)
  );
  if (invalidRows.length > 0) {
    ElMessage.warning('只能对状态为"审核通过"的申请执行退款操作');
    return;
  }
  try {
    await refundOrderRefundBatch({ ids: checkedIds.value });
    ElMessage.success('退款操作成功，正在处理中...');
    handleRefresh();
  } catch (error) {
    console.error(error);
    ElMessage.error('退款操作失败');
  }
};

// ==================== 列表行操作按钮 ====================

// 行内审核按钮
const handleRowAudit = (row) => {
  if (!isPendingAudit(row)) {
    ElMessage.warning('只能审核状态为"待审核"的退款申请');
    return;
  }
  if (auditDialogRef.value) {
    auditDialogRef.value.open([row.id]);
  }
};

// 行内驳回按钮
const handleRowReject = (row) => {
  if (!isPendingAudit(row)) {
    ElMessage.warning('只能驳回状态为"待审核"的退款申请');
    return;
  }
  if (rejectDialogRef.value) {
    rejectDialogRef.value.open(row.id);
  }
};

// 行内退款按钮
const handleRowRefund = async (row) => {
  if (!isApproved(row)) {
    ElMessage.warning('只能对状态为"审核通过"的申请执行退款操作');
    return;
  }
  try {
    await refundOrderRefundBatch({ ids: [row.id] });
    ElMessage.success('退款操作成功，正在处理中...');
    handleRefresh();
  } catch (error) {
    console.error(error);
    ElMessage.error('退款操作失败');
  }
};

// 行内备注按钮
const handleRowRemark = (row) => {
  if (remarkDialogRef.value) {
    remarkDialogRef.value.open(row.id, row.remark);
  }
};

// 行内重新申请按钮
const handleRowReapply = (row) => {
  if (!isRejected(row)) {
    ElMessage.warning('只能重新申请状态为"已驳回"的退款申请');
    return;
  }
  if (reapplyDrawerRef.value) {
    reapplyDrawerRef.value.open(row);
  }
};

// ==================== 状态判断函数 ====================

/** 获取退款状态标签文本 */
function getRefundStatusLabel(refundStatus) {
  const dict = getDictObj(DICT_TYPE.ORDER_REFUND_STATUS, String(refundStatus));
  return dict ? dict.label : refundStatus;
}

// 判断是否为待审核状态
const isPendingAudit = (row) => {
  const statusLabel = getRefundStatusLabel(row.refundStatus);
  return (
    statusLabel === '待审核' ||
    row.refundStatus === '0' ||
    row.refundStatus === 'pending'
  );
};

// 判断是否为审核通过状态
const isApproved = (row) => {
  const statusLabel = getRefundStatusLabel(row.refundStatus);
  return (
    statusLabel === '审核通过' ||
    row.refundStatus === '1' ||
    row.refundStatus === 'approved'
  );
};

// 判断是否为退款中状态
const isRefunding = (row) => {
  const statusLabel = getRefundStatusLabel(row.refundStatus);
  return (
    statusLabel === '退款中' ||
    row.refundStatus === '2' ||
    row.refundStatus === 'refunding'
  );
};

// 判断是否为已完成状态
const isCompleted = (row) => {
  const statusLabel = getRefundStatusLabel(row.refundStatus);
  return (
    statusLabel === '已完成' ||
    row.refundStatus === '3' ||
    row.refundStatus === 'completed'
  );
};

// 判断是否为已驳回状态
const isRejected = (row) => {
  const statusLabel = getRefundStatusLabel(row.refundStatus);
  return (
    statusLabel === '已驳回' ||
    row.refundStatus === '4' ||
    row.refundStatus === 'rejected'
  );
};

// ==================== 快捷筛选处理 ====================

// 处理用户ID/车牌号点击
const handleUserInfoClick = (plateNo) => {
  filterPlateNo.value = filterPlateNo.value === plateNo ? '' : plateNo;
  gridApi.query();
};

// 处理退款状态点击
const handleRefundStatusClick = (refundStatus) => {
  filterRefundStatus.value =
    filterRefundStatus.value === refundStatus ? '' : refundStatus;
  gridApi.query();
};

// 处理审核人员点击
const handleAuditUserClick = (auditUser) => {
  filterAuditUser.value =
    filterAuditUser.value === auditUser ? '' : auditUser;
  gridApi.query();
};

// 处理操作人点击
const handleCreatorClick = (creator) => {
  filterCreator.value = filterCreator.value === creator ? '' : creator;
  gridApi.query();
};

// 处理申请时间点击 - 参照orderAlarm处理时间字段钻取交互的逻辑
const handleCreateTimeClick = (createTimeStr) => {
  if (!createTimeStr) return;
  // 保存显示用的时间字符串，同时作为参数使用
  filterCreateTime.value = createTimeStr;
  gridApi.query();
};

// 取消筛选
const handleCancelPlateNoFilter = () => {
  filterPlateNo.value = '';
  gridApi.query();
};

const handleCancelRefundStatusFilter = () => {
  filterRefundStatus.value = '';
  gridApi.query();
};

const handleCancelAuditUserFilter = () => {
  filterAuditUser.value = '';
  gridApi.query();
};

const handleCancelCreatorFilter = () => {
  filterCreator.value = '';
  gridApi.query();
};

const handleCancelCreateTimeFilter = () => {
  filterCreateTime.value = '';
  gridApi.query();
};

// 处理统计组件的钻取筛选
const handleStatsFilter = (type, value) => {
  switch (type) {
    case 'refundStatus': {
      // 饼图钻取 - 根据退款状态名称获取字典值
      const dictOptions = getDictOptions(
        DICT_TYPE.ORDER_REFUND_STATUS,
        'string',
      );
      const dictItem = dictOptions.find((item) => item.label === value);
      filterRefundStatus.value = dictItem ? dictItem.value : value;
      break;
    }
    case 'date': {
      // 折线图钻取 - 根据日期筛选，使用createTime参数
      // 保存日期部分（yyyy-MM-dd），查询时会构建成数组格式
      // 注意：不显示筛选标签，仅筛选表格数据
      filterCreateTime.value = value;
      break;
    }
    case 'status': {
      switch (value) {
        case 'all': {
          // 总退款订单数 - 清空状态筛选
          filterRefundStatus.value = '';
          break;
        }
        case 'completed': {
          // 退款完成数 - 筛选已完成状态
          const dictOptions = getDictOptions(
            DICT_TYPE.ORDER_REFUND_STATUS,
            'string',
          );
          const dictItem = dictOptions.find((item) => item.label === '已完成');
          filterRefundStatus.value = dictItem ? dictItem.value : '3';
          break;
        }
        case 'pending': {
          // 待审核数 - 筛选待审核状态
          const dictOptions = getDictOptions(
            DICT_TYPE.ORDER_REFUND_STATUS,
            'string',
          );
          const dictItem = dictOptions.find((item) => item.label === '待审核');
          filterRefundStatus.value = dictItem ? dictItem.value : '0';
          break;
        }
        case 'rejected': {
          // 驳回数 - 筛选已驳回状态
          const dictOptions = getDictOptions(
            DICT_TYPE.ORDER_REFUND_STATUS,
            'string',
          );
          const dictItem = dictOptions.find((item) => item.label === '已驳回');
          filterRefundStatus.value = dictItem ? dictItem.value : '4';
          break;
        }
        default: {
          // 根据状态名称获取字典值
          const dictOptions = getDictOptions(
            DICT_TYPE.ORDER_REFUND_STATUS,
            'string',
          );
          const dictItem = dictOptions.find((item) => item.label === value);
          filterRefundStatus.value = dictItem ? dictItem.value : value;
        }
      }
      break;
    }
    // No default
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
      :title="`${dataObj.detailObj.refundCode}详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
    />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <!-- 弹窗组件 -->
    <AuditDialog ref="auditDialogRef" @success="handleRefresh" />
    <RejectDialog ref="rejectDialogRef" @success="handleRefresh" />
    <RemarkDialog ref="remarkDialogRef" @success="handleRefresh" />
    <ReapplyDrawer ref="reapplyDrawerRef" @success="handleRefresh" />

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
          <!-- 退款状态筛选标签 -->
          <ElTag
            v-if="filterRefundStatus"
            type="warning"
            closable
            @close="handleCancelRefundStatusFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            退款状态：{{
              getDictObj(
                DICT_TYPE.ORDER_REFUND_STATUS,
                String(filterRefundStatus),
              )?.label || filterRefundStatus
            }}
          </ElTag>
          <!-- 审核人员筛选标签 -->
          <ElTag
            v-if="filterAuditUser"
            type="success"
            closable
            @close="handleCancelAuditUserFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            审核人员：{{ filterAuditUser }}
          </ElTag>
          <!-- 操作人筛选标签 -->
          <ElTag
            v-if="filterCreator"
            type="info"
            closable
            @close="handleCancelCreatorFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            操作人：{{ filterCreator }}
          </ElTag>
          <!-- 申请时间筛选标签 - 只显示具体时间 -->
          <ElTag
            v-if="filterCreateTime"
            type="primary"
            closable
            @close="handleCancelCreateTimeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            申请时间：{{ filterCreateTime }}
          </ElTag>
        </div>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <!-- 列表页操作按钮：审核、退款 -->
          <IconButton
            content="审核"
            icon-name="Clock"
            :disabled="isEmpty(checkedIds)"
            @click="handleBatchAudit"
          />
          <IconButton
            content="退款"
            icon-name="RefreshLeft"
            :disabled="isEmpty(checkedIds)"
            @click="handleBatchRefund"
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
      <!-- 退款编号插槽 - 点击跳转详情 -->
      <template #refundCode="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.refundCode }}
        </el-text>
      </template>
      <!-- 关联订单编号插槽 - 点击跳转订单详情 -->
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
      <!-- 申请时间插槽 - 点击筛选 -->
      <template #createTime="{ row }">
        <el-text
          @click="handleCreateTimeClick(row.createTime)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.createTime }}
        </el-text>
      </template>
      <!-- 退款状态插槽 - 点击筛选 -->
      <template #refundStatus="{ row }">
        <ElTag
          @click="handleRefundStatusClick(row.refundStatus)"
          :type="getRefundStatusTagType(row.refundStatus)"
          style="cursor: pointer"
        >
          {{
            getDictObj(
              DICT_TYPE.ORDER_REFUND_STATUS,
              String(row.refundStatus),
            )?.label || row.refundStatus
          }}
        </ElTag>
      </template>
      <!-- 审核人员插槽 - 点击筛选 -->
      <template #auditUser="{ row }">
        <el-text
          @click="handleAuditUserClick(row.auditUser)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.auditUser }}
        </el-text>
      </template>
      <!-- 退款渠道插槽 - 无钻取交互，仅显示字典标签 -->
      <template #refundChannel="{ row }">
        <ElTag :type="getRefundChannelTagType(row.refundChannel)">
          {{
            getDictObj(
              DICT_TYPE.ORDER_REFUND_CHANNEL,
              String(row.refundChannel),
            )?.label || row.refundChannel
          }}
        </ElTag>
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
      <!-- 行操作按钮 - 根据退款状态显示不同按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <!-- 查看 - 所有状态都显示 -->
          <IconButton
            content="查看"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />

          <!-- 待审核状态：查看、审核、驳回、备注 -->
          <IconButton
            v-if="isPendingAudit(row)"
            content="审核"
            icon-name="Clock"
            @click="handleRowAudit(row)"
          />
          <IconButton
            v-if="isPendingAudit(row)"
            content="驳回"
            icon-name="CircleClose"
            color="#F56C6C"
            @click="handleRowReject(row)"
          />

          <!-- 审核通过状态：查看、退款、备注 -->
          <IconButton
            v-if="isApproved(row)"
            content="退款"
            icon-name="RefreshLeft"
            @click="handleRowRefund(row)"
          />

          <!-- 已驳回状态：查看、重新申请、备注 -->
          <IconButton
            v-if="isRejected(row)"
            content="重新申请"
            icon-name="Position"
            @click="handleRowReapply(row)"
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
          <span> 本页统计：退款订单数量: {{ dataObj.list.length }} </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
