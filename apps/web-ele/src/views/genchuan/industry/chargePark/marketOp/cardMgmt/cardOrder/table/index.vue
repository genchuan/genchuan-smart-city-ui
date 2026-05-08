<script setup>
import { computed, reactive, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { DICT_TYPE } from '@vben/constants';
import { getDictObj } from '@vben/hooks';
import { downloadFileFromBlobPart } from '@vben/utils';

import { ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  batchExportCardOrder,
  exportCardOrder,
  getCardOrderPage,
} from '#/api/genchuan/industry/chargePark/marketOp/cardMgmt/cardOrder';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { exportToExcel } from '#/utils/excel.js';
import { formatDate } from '#/utils/genchuan/formatTime';

import ActiveConfirmDialog from '../components/ActiveConfirmDialog.vue';
import CancelConfirmDialog from '../components/CancelConfirmDialog.vue';
import InvoiceDialog from '../components/InvoiceDialog.vue';
import PayConfirmDialog from '../components/PayConfirmDialog.vue';
import {
  dataList,
  detailFields,
  getCardOrderInvoiceStatusLabel,
  getCardOrderInvoiceStatusTagType,
  getCardOrderPayStatusLabel,
  getCardOrderPayStatusTagType,
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
const payDialogRef = ref(null);
const activeDialogRef = ref(null);
const invoiceDialogRef = ref(null);
const cancelDialogRef = ref(null);
const formData = ref();

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
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
  async onConfirm() {},
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

/** 刷新表格 - 同时清除所有快捷筛选 */
function handleRefresh() {
  // 清除所有快捷筛选变量
  filterPayStatus.value = '';
  filterInvoiceStatus.value = '';
  filterCardType.value = '';
  filterOrderDate.value = '';
  gridApi.query();
}

/** 导出表格 */
async function handleExport() {
  try {
    const data = await exportCardOrder();
    downloadFileFromBlobPart({
      fileName: textObj.excelAllName,
      source: data,
    });
    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败');
    // 使用静态数据导出
    exportToExcel(dataObj.apilist, textObj.excelName, textObj.excelAllName);
  }
}

/** 批量导出表格 */
async function handleBatchExport() {
  try {
    // 获取选中的行数据
    const selectedRows = gridApi.grid.getCheckboxRecords();
    if (!selectedRows || selectedRows.length === 0) {
      ElMessage.warning('请先勾选需要导出的订单');
      return;
    }

    // 提取选中的订单ID列表
    const ids = selectedRows.map((row) => row.id);

    const data = await batchExportCardOrder({ ids });
    downloadFileFromBlobPart({
      fileName: textObj.excelAllName,
      source: data,
    });
    ElMessage.success('批量导出成功');
  } catch (error) {
    console.error('批量导出失败:', error);
    ElMessage.error('批量导出失败');
  }
}

/** 支付 */
function handlePay(row) {
  payDialogRef.value?.open(row);
}

/** 激活 */
function handleActive(row) {
  activeDialogRef.value?.open(row);
}

/** 开票 */
function handleInvoice(row) {
  invoiceDialogRef.value?.open(row);
}

/** 取消 */
function handleCancel(row) {
  cancelDialogRef.value?.open(row);
}

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}

// 快捷筛选变量
const filterPayStatus = ref('');
const filterInvoiceStatus = ref('');

// 统计组件钻取筛选变量
const filterCardType = ref('');
const filterOrderDate = ref('');

// 卡种类型到cardId的映射（根据字典值）
const typeToCardIdMap = {
  0: 1, // 日卡
  1: 2, // 周卡
  2: 3, // 月卡
  3: 4, // 季卡
  4: 5, // 年卡
};

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: dataList().length,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(),
  list: [],
  searchParams: {},
});

const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

// 表格数据获取
const getTableData = async (pageObj) => {
  const page = pageObj.page;

  try {
    // 构建API请求参数
    // 将type映射为cardId
    const cardId = filterCardType.value
      ? typeToCardIdMap[filterCardType.value] || filterCardType.value
      : dataObj.searchParams.cardId;
    const params = {
      pageNo: page.currentPage,
      pageSize: page.pageSize,
      no: dataObj.searchParams.no,
      userId: dataObj.searchParams.userId,
      userName: dataObj.searchParams.userName,
      cardId,
      cardName: dataObj.searchParams.cardName,
      amountMin: dataObj.searchParams.amountMin,
      amountMax: dataObj.searchParams.amountMax,
      payStatus: filterPayStatus.value || dataObj.searchParams.payStatus,
      invoiceStatus:
        filterInvoiceStatus.value || dataObj.searchParams.invoiceStatus,
      orderDate: filterOrderDate.value,
    };

    const response = await getCardOrderPage(params);
    if (response) {
      const { list, total } = response;
      dataObj.total = total || 0;
      dataObj.list = list || [];
      return dataObj;
    }
  } catch (error) {
    // 接口请求失败，使用静态数据
    console.error('分页接口请求失败，使用静态数据:', error);

    // 根据searchParams和快捷筛选变量筛选静态数据
    const filteredList = dataObj.apilist.filter((v) => {
      let searchMatch = true;
      Object.keys(dataObj.searchParams).forEach((key) => {
        const value = dataObj.searchParams[key];
        if (
          value &&
          !['activeTime', 'archiveTime', 'createTime', 'payTime'].includes(key)
        ) {
          if (key === 'amountMin') {
            searchMatch = searchMatch && v.amount >= value;
          } else if (key === 'amountMax') {
            searchMatch = searchMatch && v.amount <= value;
          } else {
            searchMatch =
              typeof value === 'string'
                ? searchMatch && v[key]?.toString().includes(value)
                : searchMatch && v[key] === value;
          }
        }
      });
      // 应用快捷筛选变量
      if (filterPayStatus.value && v.payStatus !== filterPayStatus.value) {
        searchMatch = false;
      }
      if (
        filterInvoiceStatus.value &&
        v.invoiceStatus !== filterInvoiceStatus.value
      ) {
        searchMatch = false;
      }
      if (filterCardType.value && v.cardId !== filterCardType.value) {
        searchMatch = false;
      }
      if (filterOrderDate.value) {
        const orderDate = new Date(v.createTime).toISOString().split('T')[0];
        if (orderDate !== filterOrderDate.value) {
          searchMatch = false;
        }
      }
      return searchMatch;
    });

    dataObj.total = filteredList.length;
    dataObj.list = filteredList.slice(
      (page.currentPage - 1) * page.pageSize,
      page.currentPage * page.pageSize,
    );
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
  schema: useSearchFormSchema(),
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});

// 搜索表单查询
function onSubmit(values) {
  dataObj.searchParams = values;
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

// ==================== 钻取筛选处理 ====================

// 处理支付状态点击
const handleFilterByPayStatus = (payStatus) => {
  filterPayStatus.value = filterPayStatus.value === payStatus ? '' : payStatus;
  gridApi.query();
};

// 处理开票状态点击
const handleFilterByInvoiceStatus = (invoiceStatus) => {
  filterInvoiceStatus.value =
    filterInvoiceStatus.value === invoiceStatus ? '' : invoiceStatus;
  gridApi.query();
};

// 取消筛选
const handleCancelPayStatusFilter = () => {
  filterPayStatus.value = '';
  gridApi.query();
};

const handleCancelInvoiceStatusFilter = () => {
  filterInvoiceStatus.value = '';
  gridApi.query();
};

// ==================== 统计组件钻取筛选处理 ====================

/** 处理统计组件的钻取筛选 */
const handleStatsFilter = (type, subType, value) => {
  switch (type) {
    case 'card': {
      // 卡片点击 - 今日订单量或今日营收
      ElMessage.info(
        `已筛选: ${subType === 'todayOrder' ? '今日订单' : '今日营收'}`,
      );
      // 这里可以根据实际需求设置筛选条件
      const today = new Date().toISOString().split('T')[0];
      filterOrderDate.value = today;

      break;
    }
    case 'cardType': {
      // 柱状图点击 - 按卡种类型筛选
      filterCardType.value = subType;
      // 使用字典获取卡种类型标签
      const dict = getDictObj(DICT_TYPE.CARD_CONFIG_TYPE, String(subType));
      const cardName = dict ? dict.label : subType;
      ElMessage.info(`已筛选卡种类型: ${cardName}`);

      break;
    }
    case 'date': {
      // 折线图节点点击 - 按日期筛选
      filterOrderDate.value = subType;
      ElMessage.info(`已筛选日期: ${subType}`);

      break;
    }
    case 'payStatus': {
      // 柱状图点击 - 按支付状态筛选
      filterPayStatus.value = subType;
      // 使用字典获取支付状态标签
      const dict = getDictObj(DICT_TYPE.CARD_ORDER_PAY_STATUS, String(subType));
      const payStatusName = dict ? dict.label : subType;
      ElMessage.info(`已筛选支付状态: ${payStatusName}`);

      break;
    }
    // No default
  }
  gridApi.query();
};

/** 取消卡种类型筛选 */
const handleCancelCardTypeFilter = () => {
  filterCardType.value = '';
  gridApi.query();
};

/** 取消日期筛选 */
const handleCancelOrderDateFilter = () => {
  filterOrderDate.value = '';
  gridApi.query();
};

defineExpose({
  handleStatsFilter,
});

// ==================== 详情弹窗处理 ====================

const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerRef.value.open();
};

/** 打开卡种订单详情弹窗 */
const handleOpenOrderDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerRef.value.open();
};

/** 打开用户详情弹窗 */
const handleOpenUserDetail = (row) => {
  ElMessage.info(`查看用户详情: ${row.userName}`);
  // TODO: 实现用户详情弹窗
};

/** 打开卡种详情弹窗 */
const handleOpenCardDetail = (row) => {
  ElMessage.info(`查看卡种详情: ${row.cardName}`);
  // TODO: 实现卡种详情弹窗
};

const handleSerachShow = () => {
  drawerApi.open();
};

const handleFullShow = () => {
  screenfull.toggle();
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
      :title="`${dataObj.detailObj.no || '卡种订单'}详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
    />
    <!--   支付确认弹窗-->
    <PayConfirmDialog ref="payDialogRef" @success="handleRefresh" />
    <!--   激活确认弹窗-->
    <ActiveConfirmDialog ref="activeDialogRef" @success="handleRefresh" />
    <!--   开票弹窗-->
    <InvoiceDialog ref="invoiceDialogRef" @success="handleRefresh" />
    <!--   取消确认弹窗-->
    <CancelConfirmDialog ref="cancelDialogRef" @success="handleRefresh" />
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
          <!-- 支付状态筛选标签 -->
          <ElTag
            v-if="filterPayStatus"
            type="primary"
            closable
            @close="handleCancelPayStatusFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            支付状态：{{ getCardOrderPayStatusLabel(filterPayStatus) }}
          </ElTag>
          <!-- 开票状态筛选标签 -->
          <ElTag
            v-if="filterInvoiceStatus"
            type="success"
            closable
            @close="handleCancelInvoiceStatusFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            开票状态：{{ getCardOrderInvoiceStatusLabel(filterInvoiceStatus) }}
          </ElTag>
          <!-- 统计组件-卡种类型筛选标签 -->
          <ElTag
            v-if="filterCardType"
            type="warning"
            closable
            @close="handleCancelCardTypeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            卡种类型：{{
              getDictObj(DICT_TYPE.CARD_CONFIG_TYPE, String(filterCardType))
                ?.label || filterCardType
            }}
          </ElTag>
          <!-- 统计组件-日期筛选标签 -->
          <ElTag
            v-if="filterOrderDate"
            type="info"
            closable
            @close="handleCancelOrderDateFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            订单日期：{{ filterOrderDate }}
          </ElTag>
        </div>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExport"
          />
          <IconButton
            content="批量导出"
            icon-name="download"
            @click="handleBatchExport"
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
      <!-- 订单编号 - 点击跳转详情 -->
      <template #no="{ row }">
        <el-text
          @click="handleOpenOrderDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.no }}
        </el-text>
      </template>
      <!-- 用户名称 - 点击跳转用户详情 -->
      <template #userName="{ row }">
        <el-text
          @click="handleOpenUserDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.userName }}
        </el-text>
      </template>
      <!-- 卡种名称 - 点击跳转卡种详情 -->
      <template #cardName="{ row }">
        <el-text
          @click="handleOpenCardDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.cardName }}
        </el-text>
      </template>
      <!-- 订单金额 - 格式化显示 -->
      <template #amount="{ row }">
        <span>¥{{ row.amount?.toFixed(2) }}</span>
      </template>
      <!-- 支付状态 - 点击筛选同状态 -->
      <template #payStatusName="{ row }">
        <ElTag
          :type="getCardOrderPayStatusTagType(row.payStatus)"
          style="cursor: pointer"
          @click="handleFilterByPayStatus(row.payStatus)"
        >
          {{ getCardOrderPayStatusLabel(row.payStatus) }}
        </ElTag>
      </template>
      <!-- 生成时间 - 格式化显示 -->
      <template #createTime="{ row }">
        <span>{{
          row.createTime
            ? formatDate(
                new Date(Number(row.createTime)),
                'YYYY-MM-DD HH:mm:ss',
              )
            : ''
        }}</span>
      </template>
      <!-- 支付时间 - 格式化显示 -->
      <template #payTime="{ row }">
        <span>{{
          row.payTime
            ? formatDate(new Date(Number(row.payTime)), 'YYYY-MM-DD HH:mm:ss')
            : '-'
        }}</span>
      </template>
      <!-- 激活时间 - 格式化显示 -->
      <template #activeTime="{ row }">
        <span>{{
          row.activeTime
            ? formatDate(
                new Date(Number(row.activeTime)),
                'YYYY-MM-DD HH:mm:ss',
              )
            : '-'
        }}</span>
      </template>
      <!-- 开票状态 - 点击筛选同开票状态 -->
      <template #invoiceStatusName="{ row }">
        <ElTag
          :type="getCardOrderInvoiceStatusTagType(row.invoiceStatus)"
          style="cursor: pointer"
          @click="handleFilterByInvoiceStatus(row.invoiceStatus)"
        >
          {{ getCardOrderInvoiceStatusLabel(row.invoiceStatus) }}
        </ElTag>
      </template>
      <!-- 归档时间 - 格式化显示 -->
      <template #archiveTime="{ row }">
        <span>{{
          row.archiveTime
            ? formatDate(
                new Date(Number(row.archiveTime)),
                'YYYY-MM-DD HH:mm:ss',
              )
            : '-'
        }}</span>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <!-- 待支付：支付、查看、取消 -->
          <IconButton
            v-if="row.payStatus === '0'"
            content="支付"
            icon-name="Money"
            @click="handlePay(row)"
          />
          <IconButton
            v-if="row.payStatus === '0'"
            content="取消"
            icon-name="CircleClose"
            color="#F56C6C"
            @click="handleCancel(row)"
          />
          <!-- 已支付：激活、开票、查看 -->
          <IconButton
            v-if="row.payStatus === '1'"
            content="激活"
            icon-name="CircleCheck"
            @click="handleActive(row)"
          />
          <IconButton
            v-if="row.payStatus === '1'"
            content="开票"
            icon-name="Document"
            @click="handleInvoice(row)"
          />
          <!-- 已完成：开票、查看 -->
          <IconButton
            v-if="row.payStatus === '2' && row.invoiceStatus === '0'"
            content="开票"
            icon-name="Document"
            @click="handleInvoice(row)"
          />
          <!-- 所有状态都显示查看 -->
          <IconButton
            content="查看"
            icon-name="View"
            @click="handleOpenDetail(row)"
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
          <span>
            本页统计：卡种订单数量: {{ dataObj.list.length }}; 待支付:
            {{ dataObj.list.filter((v) => v.payStatus === '0').length }};
            已支付:
            {{ dataObj.list.filter((v) => v.payStatus === '1').length }};
            已完成:
            {{ dataObj.list.filter((v) => v.payStatus === '2').length }};
            已取消: {{ dataObj.list.filter((v) => v.payStatus === '3').length }}
          </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> {{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
