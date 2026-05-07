<script setup>
import { computed, nextTick, onMounted, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import {downloadFileFromBlobPart} from '@vben/utils';

import { ElLoading, ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import {
  batchExportExchangeOrder,
  cancelExchangeOrder,
  exportExchangeOrder,
  getExchangeOrderDetail,
  getExchangeOrderPage,
  payExchangeOrder,
  shipExchangeOrder,
} from '#/api/genchuan/industry/chargePark/marketOp/exchangeMgmt/exchangeOrder';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';
import { formatDate } from '#/utils/genchuan/formatTime';

import CancelConfirmDialog from '../components/CancelConfirmDialog.vue';
import PayConfirmDialog from '../components/PayConfirmDialog.vue';
import ShipDialog from '../components/ShipDialog.vue';

import {
  dataList,
  detailFields,
  getExchangeOrderPayStatusLabel,
  getExchangeOrderPayStatusTagType,
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
const payConfirmDialogRef = ref(null);
const shipDialogRef = ref(null);
const cancelConfirmDialogRef = ref(null);
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
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;

    const values = await formApi.getValues();
    // const loadingInstance = ElLoading.service({
    //   text: formData.value?.id ? '保存中...' : '新增中...',
    // });

    try {
      // 实际项目中应该调用API
      // if (formData.value?.id) {
      //   await updateExchangeOrder({ ...values, id: formData.value.id });
      //   ElMessage.success('编辑成功');
      // } else {
      //   await createExchangeOrder(values);
      //   ElMessage.success('新增成功');
      // }
      formDrawerApi.close();
      handleRefresh();
    } catch (error) {
      console.error('保存失败:', error);
      ElMessage.error('保存失败');
    } finally {
      loadingInstance.close();
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

/** 刷新表格 */
function handleRefresh() {
  // 清除快捷筛选
  filterPayStatus.value = '';
  filterCategoryId.value = '';
  filterCategoryName.value = '';
  filterDate.value = '';
  gridApi.query();
}

/** 导出表格 */
async function handleExport() {
  try {
    const data = await exportExchangeOrder();
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
  if (!checkedIds.value || checkedIds.value.length === 0) {
    ElMessage.warning('请先勾选需要导出的订单');
    return;
  }
  try {
    const data = await batchExportExchangeOrder({ ids: checkedIds.value });
    downloadFileFromBlobPart({
      fileName: `批量导出兑换订单_${checkedIds.value.length}条.xlsx`,
      source: data,
    });
    ElMessage.success('批量导出成功');
  } catch (error) {
    console.error('批量导出失败:', error);
    ElMessage.error('批量导出失败');
  }
}

/** 创建 */
function handleCreate() {
  formDrawerApi.setData({ title: textObj.addText }).open();
}

/** 编辑 */
function handleEdit(row) {
  formDrawerApi.setData({ title: textObj.editText, ...row }).open();
}

/** 支付 - 打开确认弹窗 */
function handlePay(row) {
  payConfirmDialogRef.value?.open(row);
}

/** 发货 - 打开弹窗 */
function handleShip(row) {
  shipDialogRef.value?.open(row);
}

/** 取消 - 打开确认弹窗 */
function handleCancel(row) {
  cancelConfirmDialogRef.value?.open(row);
}

/** 删除 */
async function handleDelete(row) {
  await confirm($t('确定删除这条数据吗？'));
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [row.no]),
  });
  try {
    // 实际项目中应该调用删除API
    // await deleteExchangeOrder({ id: row.id });
    dataObj.apilist = dataObj.apilist.filter((v) => v.id !== row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.no]));
    handleRefresh();
  } catch (error) {
    console.error('删除失败:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 批量删除 */
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

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}

// 快捷筛选变量
const filterPayStatus = ref('');
const filterCategoryId = ref('');
const filterCategoryName = ref('');
const filterDate = ref('');

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
    // 构建API请求参数 - 仅包含表格展示字段
    const params = {
      pageNo: page.currentPage,
      pageSize: page.pageSize,
      no: dataObj.searchParams.no,
      userName: dataObj.searchParams.userName,
      goodsName: dataObj.searchParams.goodsName,
      costPointMin: dataObj.searchParams.costPointMin,
      costPointMax: dataObj.searchParams.costPointMax,
      payStatus: filterPayStatus.value || dataObj.searchParams.payStatus,
      logisticsInfo: dataObj.searchParams.logisticsInfo,
      createTime: dataObj.searchParams.createTime,
      payTime: dataObj.searchParams.payTime,
      shipTime: dataObj.searchParams.shipTime,
      archiveTime: dataObj.searchParams.archiveTime,
    };

    const response = await getExchangeOrderPage(params);
    if (response) {
      const { list, total } = response;
      dataObj.total = total || 0;
      dataObj.list = list || [];
      return dataObj;
    } else {
      // 接口返回数据不符合预期，使用静态数据
      console.log('接口返回数据不符合预期，使用静态数据');
    }
  } catch (error) {
    // 接口请求失败，使用静态数据
    console.error('分页接口请求失败，使用静态数据', error);
  }

  // 根据searchParams和快捷筛选变量筛选静态数据
  const filteredList = dataObj.apilist.filter((v) => {
    let searchMatch = true;
    Object.keys(dataObj.searchParams).forEach((key) => {
      const value = dataObj.searchParams[key];
      if (value && !['createTime', 'payTime', 'shipTime', 'archiveTime'].includes(key)) {
        if (key === 'costPointMin') {
          searchMatch = searchMatch && v.costPoint >= value;
        } else if (key === 'costPointMax') {
          searchMatch = searchMatch && v.costPoint <= value;
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
    return searchMatch;
  });

  dataObj.total = filteredList.length;
  dataObj.list = filteredList.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  );
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
const handleFilterByPayStatus = (status) => {
  filterPayStatus.value = filterPayStatus.value === status ? '' : status;
  gridApi.query();
};

// 取消筛选
const handleCancelPayStatusFilter = () => {
  filterPayStatus.value = '';
  gridApi.query();
};

// 取消类目筛选
const handleCancelCategoryFilter = () => {
  filterCategoryId.value = '';
  filterCategoryName.value = '';
  delete dataObj.searchParams.categoryId;
  gridApi.query();
};

// 取消日期筛选
const handleCancelDateFilter = () => {
  filterDate.value = '';
  delete dataObj.searchParams.createTime;
  gridApi.query();
};

// ==================== 统计组件钻取筛选处理 ====================

// 处理统计组件的钻取筛选
const handleStatsFilter = (type, value) => {
  // 清空之前的筛选
  dataObj.searchParams = {};
  filterPayStatus.value = '';
  filterCategoryId.value = '';
  filterCategoryName.value = '';
  filterDate.value = '';

  switch (type) {
    case 'card':
      if (value === 'todayOrder') {
        // 今日订单量 - 筛选今日订单
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        dataObj.searchParams.createTime = [today.getTime(), today.getTime() + 86400000];
        console.log('钻取：筛选今日订单');
      } else if (value === 'todayExchange') {
        // 今日兑换数 - 筛选今日已完成的订单
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        dataObj.searchParams.createTime = [today.getTime(), today.getTime() + 86400000];
        filterPayStatus.value = '2'; // 已完成
        console.log('钻取：筛选今日已完成订单');
      }
      break;
    case 'category':
      // 类目筛选 - value包含categoryId和name
      if (value) {
        filterCategoryId.value = value.categoryId;
        filterCategoryName.value = value.name;
        // 同时设置到searchParams中用于API请求
        dataObj.searchParams.categoryId = value.categoryId;
        console.log('钻取：筛选类目', value.name, 'ID:', value.categoryId);
      }
      break;
    case 'date':
      // 日期筛选 - 筛选特定日期的订单
      if (value) {
        filterDate.value = value;
        const date = new Date(value);
        date.setHours(0, 0, 0, 0);
        dataObj.searchParams.createTime = [date.getTime(), date.getTime() + 86400000];
        console.log('钻取：筛选日期', value);
      }
      break;
  }

  // 刷新表格
  gridApi.query();
};

// 暴露方法给父组件
defineExpose({
  handleStatsFilter,
});

// ==================== 详情弹窗处理 ====================

const handleOpenDetail = async (row) => {
  dataObj.detailObj = { ...row };
  await nextTick();
  detailDrawerRef.value.open();
};

/** 打开订单详情弹窗 */
const handleOpenOrderDetail = async (row) => {
  dataObj.detailObj = { ...row };
  await nextTick();
  detailDrawerRef.value.open();
};

/** 打开用户详情弹窗 */
const handleOpenUserDetail = (row) => {
  ElMessage.info(`查看用户详情: ${row.userName}`);
  // TODO: 实现用户详情弹窗
};

/** 打开商品详情弹窗 */
const handleOpenGoodsDetail = (row) => {
  ElMessage.info(`查看商品详情: ${row.goodsName}`);
  // TODO: 实现商品详情弹窗
};

/** 打开物流跟踪弹窗 */
const handleOpenLogisticsDetail = (row) => {
  if (row.logisticsInfo) {
    ElMessage.info(`查看物流跟踪: ${row.logisticsInfo}`);
    // TODO: 实现物流跟踪弹窗
  }
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
      v-if="Object.keys(dataObj.detailObj).length > 0"
      ref="detailDrawerRef"
      :title="`${dataObj.detailObj.no || '兑换订单'}详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
    />
    <!--   支付确认弹窗-->
    <PayConfirmDialog
      ref="payConfirmDialogRef"
      @success="handleRefresh"
    />
    <!--   发货弹窗-->
    <ShipDialog
      ref="shipDialogRef"
      @success="handleRefresh"
    />
    <!--   取消确认弹窗-->
    <CancelConfirmDialog
      ref="cancelConfirmDialogRef"
      @success="handleRefresh"
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
          <!-- 支付状态筛选标签 -->
          <ElTag
            v-if="filterPayStatus"
            type="primary"
            closable
            @close="handleCancelPayStatusFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            支付状态：{{ getExchangeOrderPayStatusLabel(filterPayStatus) }}
          </ElTag>
          <!-- 类目筛选标签 -->
          <ElTag
            v-if="filterCategoryId"
            type="success"
            closable
            @close="handleCancelCategoryFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            类目：{{ filterCategoryName }}
          </ElTag>
          <!-- 日期筛选标签 -->
          <ElTag
            v-if="filterDate"
            type="warning"
            closable
            @close="handleCancelDateFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            日期：{{ filterDate }}
          </ElTag>
        </div>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
<!--          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />-->
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExport"
          />
          <IconButton
            content="批量导出"
            icon-name="Download"
            :disabled="!checkedIds || checkedIds.length === 0"
            @click="handleBatchExport"
          />
<!--          <IconButton-->
<!--            content="批量删除"-->
<!--            icon-name="delete"-->
<!--            color="#F56C6C"-->
<!--            :disabled="isEmpty(checkedIds)"-->
<!--            @click="handleDeleteBatch"-->
<!--          />-->
          <IconButton
            content="搜索"
            icon-name="search"
            @click="handleSerachShow"
          />
          <IconButton
            :content="props.showStats ? '隐藏统计' : '显示统计'"
            :icon-name="showStats ? 'ArrowUp' : 'ArrowDown'"
            @click="toggleStats"
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
      <!-- 商品名称 - 点击跳转商品详情 -->
      <template #goodsName="{ row }">
        <el-text
          @click="handleOpenGoodsDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.goodsName }}
        </el-text>
      </template>
      <!-- 支付状态 - 点击筛选同状态 -->
      <template #payStatusName="{ row }">
        <ElTag
          :type="getExchangeOrderPayStatusTagType(row.payStatus)"
          style="cursor: pointer"
          @click="handleFilterByPayStatus(row.payStatus)"
        >
          {{ getExchangeOrderPayStatusLabel(row.payStatus) }}
        </ElTag>
      </template>
      <!-- 生成时间 - 格式化显示 -->
      <template #createTime="{ row }">
        <span>{{ row.createTime ? formatDate(new Date(Number(row.createTime)), 'YYYY-MM-DD HH:mm:ss') : '' }}</span>
      </template>
      <!-- 支付时间 - 格式化显示 -->
      <template #payTime="{ row }">
        <span>{{ row.payTime ? formatDate(new Date(Number(row.payTime)), 'YYYY-MM-DD HH:mm:ss') : '-' }}</span>
      </template>
      <!-- 发货时间 - 格式化显示 -->
      <template #shipTime="{ row }">
        <span>{{ row.shipTime ? formatDate(new Date(Number(row.shipTime)), 'YYYY-MM-DD HH:mm:ss') : '-' }}</span>
      </template>
      <!-- 物流信息 - 点击跳转物流跟踪 -->
      <template #logisticsInfo="{ row }">
        <el-text
          v-if="row.logisticsInfo"
          @click="handleOpenLogisticsDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.logisticsInfo }}
        </el-text>
        <span v-else>-</span>
      </template>
      <!-- 归档时间 - 格式化显示 -->
      <template #archiveTime="{ row }">
        <span>{{ row.archiveTime ? formatDate(new Date(Number(row.archiveTime)), 'YYYY-MM-DD HH:mm:ss') : '-' }}</span>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <!-- 待支付：支付、查看、取消 -->
          <template v-if="row.payStatus === '0'">
            <IconButton
              content="支付"
              icon-name="Money"
              @click="handlePay(row)"
            />
            <IconButton
              content="查看"
              icon-name="View"
              @click="handleOpenDetail(row)"
            />
            <IconButton
              content="取消"
              icon-name="Close"
              @click="handleCancel(row)"
            />
          </template>
          <!-- 已支付：发货、查看 -->
          <template v-else-if="row.payStatus === '1'">
            <IconButton
              content="发货"
              icon-name="Box"
              @click="handleShip(row)"
            />
            <IconButton
              content="查看"
              icon-name="View"
              @click="handleOpenDetail(row)"
            />
          </template>
          <!-- 已完成：查看 -->
          <template v-else-if="row.payStatus === '2'">
            <IconButton
              content="查看"
              icon-name="View"
              @click="handleOpenDetail(row)"
            />
          </template>
          <!-- 已取消：查看 -->
          <template v-else-if="row.payStatus === '3'">
            <IconButton
              content="查看"
              icon-name="View"
              @click="handleOpenDetail(row)"
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
          <span>
            本页统计：兑换订单数量 {{ dataObj.list.length }}; 已支付
            {{ dataObj.list.filter((v) => v.payStatus === '1').length }}; 已完成
            {{ dataObj.list.filter((v) => v.payStatus === '2').length }}; 待支付
            {{ dataObj.list.filter((v) => v.payStatus === '0').length }}; 已取消
            {{ dataObj.list.filter((v) => v.payStatus === '3').length }}
          </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> {{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
