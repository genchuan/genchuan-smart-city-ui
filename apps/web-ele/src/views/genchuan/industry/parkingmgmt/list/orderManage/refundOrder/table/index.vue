<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import DetailDrawer from '#/components/common/DetailDrawer.vue';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

import {
  dataList,
  detailFields,
  textObj,
  useFormSchema,
  useGridColumns,
} from './data';
import ApproveDrawer from '../drawers/ApproveDrawer.vue';
import TrackDrawer from '../drawers/TrackDrawer.vue';
import CalculateDrawer from '../drawers/CalculateDrawer.vue';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  tabType: {
    type: String,
    default: 'refundApply',
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
  const currentTextObj = textObj(props.tabType);
  return formData.value?.id ? currentTextObj.editText : currentTextObj.addText;
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

// 审批抽屉
const [ApproveDrawerComp, approveDrawerApi] = useVbenDrawer({
  title: '审批退款申请',
  width: '500px',
  appendToMain: true,
  modal: false,
  showFooter: true,
  confirmText: '确认',
  cancelText: '取消',
  onCancel() {
    approveDrawerApi.close();
  },
  async onConfirm() {
    if (approveDrawerRef.value) {
      const isValid = await approveDrawerRef.value.validate();
      if (isValid) {
        const values = approveDrawerRef.value.getValues();
        handleApproveSubmit({
          id: approveRow.value.id,
          approveResult: values.approveResult,
          approveOpinion: values.approveOpinion,
        });
        approveDrawerApi.close();
      }
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen && approveDrawerRef.value) {
      approveDrawerRef.value.resetForm();
    }
  },
});

// 跟踪抽屉
const [TrackDrawerComp, trackDrawerApi] = useVbenDrawer({
  title: '退款跟踪',
  placement: 'right',
  width: '600px',
  appendToMain: true,
  modal: false,
  showFooter: true,
  confirmText: '确认',
  cancelText: '取消',
  onCancel() {
    trackDrawerApi.close();
  },
  onConfirm() {
    trackDrawerApi.close();
  },
});

// 核算抽屉
const [CalculateDrawerComp, calculateDrawerApi] = useVbenDrawer({
  title: '金额核算',
  placement: 'right',
  width: '600px',
  appendToMain: true,
  modal: false,
  showFooter: true,
  confirmText: '确认',
  cancelText: '取消',
  onCancel() {
    calculateDrawerApi.close();
  },
  async onConfirm() {
    if (calculateDrawerRef.value) {
      const isValid = await calculateDrawerRef.value.validate();
      if (isValid) {
        const values = calculateDrawerRef.value.getValues();
        const refundAmount = calculateDrawerRef.value.getRefundAmount();
        handleCalculateSubmit({
          id: calculateRow.value.id,
          usedAmount: values.usedAmount,
          serviceFee: values.serviceFee,
          discountShare: values.discountShare,
          refundAmount: refundAmount,
        });
        calculateDrawerApi.close();
      }
    }
  },
  async onOpenChange(isOpen) {
    // 不要在打开时重置表单，以保留重新核算时的表格数据
  },
});

// 审批抽屉数据
const approveRow = ref({});
const approveDrawerRef = ref(null);
// 跟踪抽屉数据
const trackRow = ref({});
// 核算抽屉数据
const calculateRow = ref({});
const calculateDrawerRef = ref(null);
// 是否重新核算
const isReCalculate = ref(false);
const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: useFormSchema(props.tabType),
  showDefaultActions: false,
});
const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    formDrawerApi.close();
  },
  onConfirm() {
    const obj = formApi.form.values;
    if (formDrawerApi.sharedData.payload.title === textObj.addText) {
      dataObj.apilist.push(obj);
    } else {
      dataObj.apilist.forEach((v, i) => {
        if (v.id === formData.value?.id) {
          dataObj.apilist[i] = obj;
        }
      });
    }
    handleRefresh();
    formDrawerApi.close();
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

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 导出表格 */
async function handleExport() {
  exportToExcel(dataObj.apilist, textObj.excelName, textObj.excelAllName);
}

/** 创建退款订单 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

/** 编辑退款订单 */
function handleEdit(row) {
  formDrawerApi
    .setData({
      title: textObj.editText,
      ...row,
    })
    .open();
}
async function handleDelete(row) {
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [row.refundNo]),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter((v) => v.id !== row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.refundNo]));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

async function handleDeleteBatch() {
  await confirm($t('确定删除这些数据吗？'));
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deletingBatch'),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter(
      (v) => !checkedIds.value.includes(v.id),
    );
    checkedIds.value = [];
    ElMessage.success($t('删除成功'));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

// 审批按钮点击事件
function handleApprove(row) {
  approveRow.value = row;
  approveDrawerApi.open();
}

// 取消按钮点击事件
async function handleCancelRefund(row) {
  if (row.approveStatusName !== '待审批') {
    ElMessage.warning('只有待审批的退款申请可以取消');
    return;
  }

  try {
    await confirm('确定要取消该退款申请吗？');
    const loadingInstance = ElLoading.service({
      text: '取消中...',
    });

    // 更新状态为已取消
    const index = dataObj.apilist.findIndex((v) => v.id === row.id);
    if (index !== -1) {
      dataObj.apilist[index].approveStatusName = '已取消';
      dataObj.apilist[index].refundStatusName = '已取消';
    }

    ElMessage.success('退款申请已取消');
    handleRefresh();
    loadingInstance.close();
  } catch (error) {
    // 用户取消确认
  }
}

// 跟踪按钮点击事件
function handleTrack(row) {
  trackRow.value = row;
  trackDrawerApi.open();
}

// 核算按钮点击事件
function handleCalculate() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请先选择表格中的数据项');
    return;
  }

  if (checkedIds.value.length > 1) {
    ElMessage.warning('请选择一条数据进行核算');
    return;
  }

  // 获取选中的数据
  const selectedRow = dataObj.apilist.find(item => item.id === checkedIds.value[0]);
  if (selectedRow) {
    calculateRow.value = selectedRow;
    isReCalculate.value = false;
    calculateDrawerApi.open();
  }
}

// 重新核算按钮点击事件
function handleReCalculate(row) {
  calculateRow.value = row;
  isReCalculate.value = true;
  calculateDrawerApi.open();
}

// 确认按钮点击事件
async function handleConfirmCalculate(row) {
  try {
    await confirm('确定要确认该核算结果吗？确认后应退金额将被锁定');
    const loadingInstance = ElLoading.service({
      text: '确认中...',
    });

    // 锁定应退金额（这里只是模拟，实际项目中可能需要更多逻辑）
    ElMessage.success('核算结果已确认，应退金额已锁定');
    handleRefresh();
    loadingInstance.close();
  } catch (error) {
    // 用户取消确认
  }
}

// 下载退款记录详情PDF
function handleDownloadRecord(row) {
  // 这里只是模拟，实际项目中需要调用PDF导出API
  ElMessage.success(`正在导出退款记录 ${row.orderNo} 的PDF文件`);
}

// 审批提交事件
function handleApproveSubmit(data) {
  const index = dataObj.apilist.findIndex((v) => v.id === data.id);
  if (index !== -1) {
    dataObj.apilist[index].approveStatusName = data.approveResult;
    dataObj.apilist[index].approveOpinion = data.approveOpinion;
    dataObj.apilist[index].refundStatusName = data.approveResult === '已通过' ? '待退款' : '退款失败';
  }
  ElMessage.success('审批完成');
  handleRefresh();
  approveDrawerApi.close();
}

// 核算提交事件
function handleCalculateSubmit(data) {
  const index = dataObj.apilist.findIndex((v) => v.id === data.id);
  if (index !== -1) {
    dataObj.apilist[index].usedAmount = data.usedAmount;
    dataObj.apilist[index].serviceFee = data.serviceFee;
    dataObj.apilist[index].discountShare = data.discountShare;
    dataObj.apilist[index].refundAmount = data.refundAmount;
    dataObj.apilist[index].calculateResult = '核算通过';
    dataObj.apilist[index].calculateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
  }
  ElMessage.success('核算完成');
  handleRefresh();
  calculateDrawerApi.close();
}

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}
const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: dataList(props.tabType).length,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(props.tabType),
  list: [],
  searchParams: {},
});
const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;

  // 根据activeName和筛选条件筛选数据
  const filteredList = dataObj.apilist.filter((v) => {
    // 状态筛选
    let statusMatch = true;
    if (activeName.value !== '全部') {
      if (props.tabType === 'refundApply') {
        statusMatch = v.approveStatusName === activeName.value;
      } else if (props.tabType === 'refundRecord') {
        statusMatch = v.refundStatusName === activeName.value;
      } else if (props.tabType === 'amountCalculate') {
        statusMatch = v.calculateResult === activeName.value;
      }
    }

    // 快捷筛选
    const refundReasonMatch = !filterRefundReason.value || v.refundReasonName === filterRefundReason.value;
    const refundStatusMatch = !filterRefundStatus.value || v.refundStatusName === filterRefundStatus.value;
    const carNumberMatch = !filterCarNumber.value || v.carNumber === filterCarNumber.value;
    const payTypeMatch = !filterPayType.value || v.payTypeName === filterPayType.value;
    const orderTypeMatch = !filterOrderType.value || v.orderTypeName === filterOrderType.value;
    const calculateResultMatch = !filterCalculateResult.value || v.calculateResult === filterCalculateResult.value;

    return statusMatch && refundReasonMatch && refundStatusMatch && carNumberMatch && payTypeMatch && orderTypeMatch && calculateResultMatch;
  });

  dataObj.total = filteredList.length;
  dataObj.list = filteredList.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  );
  return dataObj;
};

const [QueryForm] = useVbenForm({
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
  schema: useFormSchema(props.tabType).map((v) => {
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
function onSubmit() {
  drawerApi.close();
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(props.tabType),
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

const activeName = ref('全部');

// 快捷筛选变量
const filterRefundReason = ref(''); // 退款原因筛选
const filterRefundStatus = ref(''); // 退款状态筛选
const filterCarNumber = ref(''); // 车牌号码筛选
const filterPayType = ref(''); // 退款方式筛选
const filterOrderType = ref(''); // 订单类型筛选
const filterCalculateResult = ref(''); // 核算结果筛选

const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerRef.value.open();
};

// 根据tabType动态生成状态标签
const tabsData = computed(() => {
  if (props.tabType === 'refundApply') {
    return [{ label: '全部' }, { label: '待审批' }, { label: '已通过' }, { label: '已拒绝' }, { label: '已取消' }];
  } else if (props.tabType === 'refundRecord') {
    return [{ label: '全部' }, { label: '待退款' }, { label: '已退款' }, { label: '退款失败' }];
  } else if (props.tabType === 'amountCalculate') {
    return [{ label: '全部' }, { label: '核算通过' }, { label: '核算驳回' }];
  }
  return [{ label: '全部' }];
});

// 创建标签文本，显示数量统计
const createLabel = (item) => {
  let count = 0;

  switch (item.label) {
    case '全部': {
      count = dataObj.apilist.length;
      break;
    }
    default: {
      if (props.tabType === 'refundApply') {
        // 退款申请标签页：统计approveStatusName
        count = dataObj.apilist.filter((v) => v.approveStatusName === item.label).length;
      } else if (props.tabType === 'refundRecord') {
        // 退款记录标签页：统计refundStatusName
        count = dataObj.apilist.filter((v) => v.refundStatusName === item.label).length;
      } else if (props.tabType === 'amountCalculate') {
        // 金额核算标签页：统计calculateResult
        count = dataObj.apilist.filter((v) => v.calculateResult === item.label).length;
      }
      break;
    }
  }

  return `${item.label}(${count})`;
};

const handleClick = () => {
  gridApi.query();
};
const handleSerachShow = () => {
  drawerApi.open();
};
const handleFullShow = () => {
  screenfull.toggle();
};

// 获取状态标签类型
const getStatusType = (status) => {
  switch (status) {
    case '待审批':
      return 'info';
    case '已通过':
      return 'success';
    case '已拒绝':
      return 'danger';
    case '已取消':
      return 'warning';
    case '已退款':
      return 'success';
    case '待退款':
      return 'info';
    case '退款失败':
      return 'danger';
    default:
      return 'default';
  }
};

// 快捷筛选处理函数

// 处理退款原因点击
const handleRefundReasonClick = (refundReason) => {
  filterRefundReason.value = filterRefundReason.value === refundReason ? '' : refundReason;
  gridApi.query();
};

/** 取消退款原因筛选 */
const handleCancelRefundReasonFilter = () => {
  filterRefundReason.value = '';
  gridApi.query();
};

// 处理退款状态点击
const handleRefundStatusClick = (refundStatus) => {
  filterRefundStatus.value = filterRefundStatus.value === refundStatus ? '' : refundStatus;
  gridApi.query();
};

/** 取消退款状态筛选 */
const handleCancelRefundStatusFilter = () => {
  filterRefundStatus.value = '';
  gridApi.query();
};

// 处理车牌号码点击
const handleCarNumberClick = (carNumber) => {
  filterCarNumber.value = filterCarNumber.value === carNumber ? '' : carNumber;
  gridApi.query();
};

/** 取消车牌号码筛选 */
const handleCancelCarNumberFilter = () => {
  filterCarNumber.value = '';
  gridApi.query();
};

// 处理退款方式点击
const handlePayTypeClick = (payType) => {
  filterPayType.value = filterPayType.value === payType ? '' : payType;
  gridApi.query();
};

/** 取消退款方式筛选 */
const handleCancelPayTypeFilter = () => {
  filterPayType.value = '';
  gridApi.query();
};

// 处理订单类型点击
const handleOrderTypeClick = (orderType) => {
  filterOrderType.value = filterOrderType.value === orderType ? '' : orderType;
  gridApi.query();
};

/** 取消订单类型筛选 */
const handleCancelOrderTypeFilter = () => {
  filterOrderType.value = '';
  gridApi.query();
};

// 处理核算结果点击
const handleCalculateResultClick = (calculateResult) => {
  filterCalculateResult.value = filterCalculateResult.value === calculateResult ? '' : calculateResult;
  gridApi.query();
};

/** 取消核算结果筛选 */
const handleCancelCalculateResultFilter = () => {
  filterCalculateResult.value = '';
  gridApi.query();
};
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <!--   详情抽屉-->
    <DetailDrawer
      ref="detailDrawerRef"
      :title="props.tabType === 'refundApply' ? `${dataObj.detailObj.refundNo}详情` : props.tabType === 'refundRecord' ? `${dataObj.detailObj.orderNo}详情` : `${dataObj.detailObj.refundNo}详情`"
      :data="dataObj.detailObj"
      :fields="detailFields(props.tabType)"
    />
    <!-- 审批抽屉 -->
    <ApproveDrawerComp>
      <ApproveDrawer
        ref="approveDrawerRef"
        :row="approveRow"
      />
    </ApproveDrawerComp>
    <!-- 跟踪抽屉 -->
    <TrackDrawerComp>
      <TrackDrawer
        :row="trackRow"
        @close="trackDrawerApi.close()"
      />
    </TrackDrawerComp>
    <!-- 核算抽屉 -->
    <CalculateDrawerComp>
      <CalculateDrawer
        ref="calculateDrawerRef"
        :row="calculateRow"
        :is-re-calculate="isReCalculate"
      />
    </CalculateDrawerComp>
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>
    <Grid>
      <!-- 三级状态 -->
      <template #table-title>
        <div
          class="tabel-tabs"
          style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center"
        >
          <div v-if="props.secondShow">
            <el-tabs
              v-model="activeName"
              class="demo-tabs"
              @tab-change="handleClick"
            >
              <el-tab-pane
                v-for="item in tabsData"
                :key="item.label"
                :label="createLabel(item)"
                :name="item.label"
              />
            </el-tabs>
          </div>
          <!-- 快捷筛选标签 -->
          <el-tag
            v-if="filterRefundReason"
            type="primary"
            closable
            @close="handleCancelRefundReasonFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            退款原因：{{ filterRefundReason }}
          </el-tag>
          <el-tag
            v-if="filterRefundStatus"
            type="success"
            closable
            @close="handleCancelRefundStatusFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            退款状态：{{ filterRefundStatus }}
          </el-tag>
          <el-tag
            v-if="filterCarNumber"
            type="warning"
            closable
            @close="handleCancelCarNumberFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            车牌号码：{{ filterCarNumber }}
          </el-tag>
          <el-tag
            v-if="filterPayType"
            type="danger"
            closable
            @close="handleCancelPayTypeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            退款方式：{{ filterPayType }}
          </el-tag>
          <el-tag
            v-if="filterOrderType"
            type="success"
            closable
            @close="handleCancelOrderTypeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            订单类型：{{ filterOrderType }}
          </el-tag>
          <el-tag
            v-if="filterCalculateResult"
            type="primary"
            closable
            @close="handleCancelCalculateResultFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            核算结果：{{ filterCalculateResult }}
          </el-tag>
        </div>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExport"
          />
          <IconButton
            v-if="props.tabType === 'amountCalculate'"
            content="核算"
            icon-name="Check"
            @click="handleCalculate"
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
      <template #refundNo="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.refundNo }}
        </el-text>
      </template>
      <template #approveStatusName="{ row }">
        <el-tag :type="getStatusType(row.approveStatusName)">
          {{ row.approveStatusName }}
        </el-tag>
      </template>
      <template #refundStatusName="{ row }">
        <el-tag
          :type="getStatusType(row.refundStatusName)"
          @click="handleRefundStatusClick(row.refundStatusName)"
          class="cursor-pointer"
        >
          {{ row.refundStatusName }}
        </el-tag>
      </template>
      <template #refundReasonName="{ row }">
        <el-text
          @click="handleRefundReasonClick(row.refundReasonName)"
          class="common-align cursor-pointer"
          type="primary"
        >
          {{ row.refundReasonName }}
        </el-text>
      </template>
      <template #carNumber="{ row }">
        <el-text
          @click="handleCarNumberClick(row.carNumber)"
          class="common-align cursor-pointer"
          type="primary"
        >
          {{ row.carNumber }}
        </el-text>
      </template>
      <template #payTypeName="{ row }">
        <el-text
          @click="handlePayTypeClick(row.payTypeName)"
          class="common-align cursor-pointer"
          type="primary"
        >
          {{ row.payTypeName }}
        </el-text>
      </template>
      <template #orderTypeName="{ row }">
        <el-text
          @click="handleOrderTypeClick(row.orderTypeName)"
          class="common-align cursor-pointer"
          type="primary"
        >
          {{ row.orderTypeName }}
        </el-text>
      </template>
      <template #orderNo="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.orderNo }}
        </el-text>
      </template>
      <template #currentStatus="{ row }">
        <el-tag :type="getStatusType(row.currentStatus)">
          {{ row.currentStatus }}
        </el-tag>
      </template>
      <template #calculateResult="{ row }">
        <el-tag
          :type="row.calculateResult === '核算通过' ? 'success' : 'danger'"
          @click="handleCalculateResultClick(row.calculateResult)"
          class="cursor-pointer"
        >
          {{ row.calculateResult }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <!-- 退款申请标签页 -->
          <template v-if="props.tabType === 'refundApply'">
            <IconButton
              content="详情"
              icon-name="View"
              @click="handleOpenDetail(row)"
            />
            <IconButton
              content="审批"
              icon-name="Check"
              @click="handleApprove(row)"
            />
            <IconButton
              content="取消"
              icon-name="RefreshLeft"
              @click="handleCancelRefund(row)"
            />
          </template>

          <!-- 退款记录标签页 -->
          <template v-else-if="props.tabType === 'refundRecord'">
            <IconButton
              content="详情"
              icon-name="View"
              @click="handleOpenDetail(row)"
            />
            <IconButton
              content="跟踪"
              icon-name="Operation"
              @click="handleTrack(row)"
            />
            <IconButton
              content="下载"
              icon-name="download"
              @click="() => handleDownloadRecord(row)"
            />
          </template>

          <!-- 金额核算标签页 -->
          <template v-else-if="props.tabType === 'amountCalculate'">
            <IconButton
              content="详情"
              icon-name="View"
              @click="handleOpenDetail(row)"
            />
            <IconButton
              content="重新核算"
              icon-name="Refresh"
              @click="handleReCalculate(row)"
            />
            <IconButton
              content="确认"
              icon-name="CircleCheck"
              @click="handleConfirmCalculate(row)"
            />
          </template>
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
          <span> {{ props.tabType === 'refundApply' ? '本页统计：退款订单数量: ' : props.tabType === 'refundRecord' ? '本页统计：退款记录数量: ' : '本页统计：金额核算数量: ' }}{{ dataObj.list.length }} </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> 全部统计：{{ textObj(props.tabType).total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
