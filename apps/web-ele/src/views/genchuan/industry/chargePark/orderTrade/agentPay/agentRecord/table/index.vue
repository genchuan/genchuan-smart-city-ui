<script setup>
import { computed, reactive, ref, watch } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import { ElDialog, ElLoading, ElMessage, ElDescriptions, ElDescriptionsItem } from 'element-plus';
import screenfull from 'screenfull';
// 导出插件

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getAgentPayRecordPage,
  exportAgentPayRecord,
  deleteAgentPayRecord,
  createAgentPayRecord,
  updateAgentPayRecord,
  checkAgentPayRecord,
  getMerchantInfoPage,
} from '#/api/genchuan/industry/chargePark/orderTrade/agentPay/index.js';
import { $t } from '#/locales';
import { formatTimestamp } from '#/utils';
import { downloadLocalTemplate } from '#/utils/genchuan/down';

import { useFormSchema, useGridColumns } from './data';
import ParkDetailDrawer from './detail.vue';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  arrowShow: {
    type: Boolean,
    default: false,
  },
  arrowState: {
    type: Boolean,
    default: false,
  },
  filterParams: {
    type: Object,
    default: () => ({
      tradeTimeStart: null,
      tradeTimeEnd: null,
    }),
  },
});
const emit = defineEmits(['arrow-change', 'clear-filters']);

const getTitle = computed(() => {
  return formData.value?.id ? '编辑' : '新增';
});

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    drawerApi.close();
  },
  onConfirm() { },
  async onOpenChange() { },
});

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
    const obj = formApi.form.values;
    const loadingInstance = ElLoading.service({
      text: formDrawerApi.sharedData.payload.title === '新增' ? '正在创建...' : '正在更新...',
    });
    try {
      if (formDrawerApi.sharedData.payload.title === '新增') {
        await createAgentPayRecord({
          id: obj.id || 0,
          orderId: obj.orderId || 0,
          merchantId: obj.merchantId || 0,
          amount: obj.amount || 0,
          tradeTime: obj.tradeTime || '',
          status: obj.status || '',
          remark: obj.remark || '',
          reserve1: obj.reserve1 || '',
          reserve2: obj.reserve2 || '',
        });
        ElMessage.success('创建成功');
      } else {
        await updateAgentPayRecord({
          id: obj.id || 0,
          orderId: obj.orderId || 0,
          merchantId: obj.merchantId || 0,
          amount: obj.amount || 0,
          tradeTime: obj.tradeTime || '',
          status: obj.status || '',
          remark: obj.remark || '',
          reserve1: obj.reserve1 || '',
          reserve2: obj.reserve2 || '',
        });
        ElMessage.success('更新成功');
      }
      handleRefresh();
      formDrawerApi.close();
    } catch (error) {
      console.error('操作失败:', error);
      ElMessage.error(formDrawerApi.sharedData.payload.title === '新增' ? '创建失败' : '更新失败');
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
  gridApi.query();
}

// 点击记录状态筛选
function handleFilterStatus(status) {
  dataObj.searchObj = { ...dataObj.searchObj, status: status };
  queryFormApi.setValues({ status: status });
  dataObj.currentPage = 1;
  gridApi.query();
}

// 点击核查人筛选
function handleFilterCheckerName(checkerName) {
  dataObj.searchObj = { ...dataObj.searchObj, checkerName: checkerName };
  queryFormApi.setValues({ checkerName: checkerName });
  dataObj.currentPage = 1;
  gridApi.query();
}

// 点击关联订单跳转代付订单详情弹窗
function handleOpenOrderDetail(row) {
  dataObj.orderDetailObj = row;
  orderDialogVisible.value = true;
}

// 点击商户名称跳转商户详情弹窗
async function handleOpenMerchantDetail(row) {
  try {
    const res = await getMerchantInfoPage({ merchantName: row.merchantName });
    if (res.list && res.list.length > 0) {
      const firstMerchant = res.list[0];
      dataObj.merchantDetailObj = {
        ...firstMerchant,
        registerTime: formatTimestamp(firstMerchant.registerTime),
      };
      merchantDialogVisible.value = true;
    } else {
      ElMessage.info('未找到相关商户信息');
    }
  } catch (error) {
    console.error('获取商户详情失败:', error);
    ElMessage.error('获取商户详情失败');
  }
}

// ====================== 导出 EXCEL ======================
async function handleExport() {
  const data = await exportAgentPayRecord(dataObj.searchObj);
  downloadFileFromBlobPart({ fileName: '代付记录报表.xls', source: data });
}

// ====================== 图片转PDF（终极零乱码） ======================
async function handlePDF() {
  downloadLocalTemplate('/static/test.pdf', '报表.pdf');
}

/** 创建角色 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: '新增',
    })
    .open();
}

/** 编辑角色 */
function handleEdit(row) {
  formDrawerApi
    .setData({
      title: '编辑',
      ...row,
    })
    .open();
}
async function handleDelete(row) {
  await confirm('确定删除这条数据吗？');
  const loadingInstance = ElLoading.service({
    text: '正在删除...',
  });
  try {
    await deleteAgentPayRecord({ id: row.id });
    ElMessage.success('删除成功');
    handleRefresh();
  } catch (error) {
    console.error('删除失败:', error);
    ElMessage.error('删除失败');
  } finally {
    loadingInstance.close();
  }
}

async function handleDeleteBatch() {
  await confirm('确定删除这些数据吗？');
  const loadingInstance = ElLoading.service({
    text: '正在批量删除...',
  });
  try {
    for (const id of checkedIds.value) {
      await deleteAgentPayRecord({ id });
    }
    checkedIds.value = [];
    ElMessage.success('批量删除成功');
    handleRefresh();
  } catch (error) {
    console.error('批量删除失败:', error);
    ElMessage.error('批量删除失败');
  } finally {
    loadingInstance.close();
  }
}

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}
const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  enDetailObj: {},
  orderDetailObj: {},
  merchantDetailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  apilist: [],
  list: [],
  loading: false,
  searchObj: {},
  filterParams: {},
});
const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};
// 表格数据获取
const getTableData = async (pageObj) => {
  const page = pageObj.page;
  const params = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...dataObj.searchObj,
    ...dataObj.filterParams,
  };

  try {
    dataObj.loading = true;
    const res = await getAgentPayRecordPage(params);
    dataObj.total = res.total;
    dataObj.list = res.list.map((v) => {
      return {
        ...v,
        checkTime: formatTimestamp(v.checkTime),
        tradeTime: formatTimestamp(v.tradeTime),
        createTime: formatTimestamp(v.createTime),
        updateTime: formatTimestamp(v.updateTime),
      };
    });
    return dataObj;
  } catch (error) {
    console.error('获取代付记录数据失败:', error);
    ElMessage.error('获取代付记录数据失败');
    return dataObj;
  } finally {
    dataObj.loading = false;
  }
};
const [QueryForm, queryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: async () => {
    const values = await queryFormApi.getValues();
    dataObj.searchObj = values;
    dataObj.currentPage = 1;
    dataObj.filterParams = {};
    emit('clear-filters');
    gridApi.query();
    drawerApi.close();
  },
  layout: 'horizontal',
  schema: useFormSchema()
    .map((v) => {
      delete v.rules;
      return { ...v };
    })
    .filter((v) => v.isSearch),
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});

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

const activeName = ref('全部');
const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  parkDetailDrawerRef.value?.open();
};
const tabsData = ref([
  { label: '全部' },
  { label: '启用' },
  { label: '禁用' },
  { label: '暂停运营' },
  { label: '维修中' },
]);
const createLabel = (item) => {
  let text = `(${dataObj.apilist.filter((v) => v.status === item.label).length})`;
  if (item.label === '全部') {
    text = `(${dataObj.apilist.length})`;
  }
  return item.label + text;
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

const parkDetailDrawerRef = ref(null);
const arrowChange = () => {
  emit('arrow-change');
};

// 代付记录状态映射
const statusMap = {
  normal: { label: '正常记录', type: 'success' },
  abnormal: { label: '异常记录', type: 'danger' },
};

// 获取状态标签
const getStatusLabel = (status) => {
  return statusMap[status]?.label || status;
};

// 获取状态类型
const getStatusType = (status) => {
  return statusMap[status]?.type || 'default';
};

// ====================== 商户详情弹窗 ======================
const merchantDialogVisible = ref(false);

// ====================== 订单详情弹窗 ======================
const orderDialogVisible = ref(false);

// 手机号脱敏函数
function maskPhone(phone) {
  if (!phone) return '-';
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

watch(
  () => props.filterParams,
  () => {
    dataObj.currentPage = 1;
    dataObj.searchObj = {};
    dataObj.filterParams = props.filterParams;
    gridApi.query();
  },
  { deep: true }
);

// 核算弹窗
const checkDialogVisible = ref(false);
const checkForm = reactive({
  id: '',
  remark: '',
});

// 打开核算弹窗
const handleCheck = (row) => {
  checkForm.id = row.id;
  checkForm.remark = '';
  checkDialogVisible.value = true;
};

// 提交核算
const handleCheckSubmit = async () => {
  try {
    await checkAgentPayRecord({
      id: checkForm.id,
      remark: checkForm.remark,
    });
    ElMessage.success('核算成功');
    checkDialogVisible.value = false;
    handleRefresh();
  } catch (error) {
    console.error('核算失败:', error);
    ElMessage.error('核算失败');
  }
};


</script>

<template>
  <div class="park-lot-table-new" v-loading="dataObj.loading">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <ParkDetailDrawer ref="parkDetailDrawerRef" :detail-obj="dataObj.detailObj" />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <!-- 核算弹窗 -->
    <ElDialog v-model="checkDialogVisible" title="代付记录核算" width="500px" append-to-body>
      <el-form :model="checkForm" label-width="80px">
        <el-form-item label="记录ID">
          <el-input v-model="checkForm.id" disabled />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="checkForm.remark" type="textarea" rows="3" placeholder="请输入核算备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="checkDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleCheckSubmit">
            执行核算
          </el-button>
        </div>
      </template>
    </ElDialog>

    <!-- 商户详情弹窗 -->
    <ElDialog v-model="merchantDialogVisible" title="商户详情" width="520px">
      <ElDescriptions v-if="dataObj.merchantDetailObj" :column="1" border>
        <ElDescriptionsItem label="商户名称">
          {{ dataObj.merchantDetailObj.name || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="商户类型">
          {{ dataObj.merchantDetailObj.merchantType || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="联系人">
          {{ dataObj.merchantDetailObj.contact || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="联系电话">
          {{ maskPhone(dataObj.merchantDetailObj.phone) }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="商户地址">
          {{ dataObj.merchantDetailObj.address || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="商户状态">
          {{ dataObj.merchantDetailObj.status || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="注册时间">
          {{ dataObj.merchantDetailObj.registerTime || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="备注">
          {{ dataObj.merchantDetailObj.remark || '-' }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElDialog>

    <!-- 订单详情弹窗 -->
    <ElDialog v-model="orderDialogVisible" title="代付订单详情" width="520px">
      <ElDescriptions v-if="dataObj.orderDetailObj" :column="1" border>
        <ElDescriptionsItem label="订单编号">
          {{ dataObj.orderDetailObj.orderNo || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="商户名称">
          {{ dataObj.orderDetailObj.merchantName || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="车牌号码">
          {{ dataObj.orderDetailObj.carNo || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="代付金额">
          ¥{{ (dataObj.orderDetailObj.amount || 0).toFixed(2) }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="交易时间">
          {{ dataObj.orderDetailObj.tradeTime || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="记录状态">
          {{ getStatusLabel(dataObj.orderDetailObj.status) }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElDialog>

    <Grid>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <!-- <IconButton content="新增" icon-name="Plus" @click="handleCreate" /> -->
          <IconButton content="导出EXCEL" icon-name="download" @click="handleExport" />
          <IconButton content="搜索" icon-name="search" @click="handleSerachShow" />
          <IconButton :content="props.arrowShow ? '展开' : '收缩'" :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <template #recordNo="{ row }">
        <span
          @click="handleOpenDetail(row)"
          class="common-align cursor-pointer text-primary"
        >
          {{ row.recordNo }}
        </span>
      </template>
      <template #status="{ row }">
        <el-tag
          :type="getStatusType(row.status)"
          class="cursor-pointer"
          @click="handleFilterStatus(row.status)"
        >
          {{ getStatusLabel(row.status) }}
        </el-tag>
      </template>
      <template #orderNo="{ row }">
        <span
          @click="handleOpenOrderDetail(row)"
          class="common-align cursor-pointer text-primary"
        >
          {{ row.orderNo }}
        </span>
      </template>
      <template #merchantName="{ row }">
        <span
          @click="handleOpenMerchantDetail(row)"
          class="common-align cursor-pointer text-primary"
        >
          {{ row.merchantName }}
        </span>
      </template>
      <template #checkerName="{ row }">
        <span
          @click="handleFilterCheckerName(row.checkerName)"
          class="common-align cursor-pointer text-primary"
        >
          {{ row.checkerName || '-' }}
        </span>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
          <IconButton 
            v-if="row.status === 'abnormal'" 
            content="核算" 
            icon-name="Check" 
            @click="handleCheck(row)" 
          />
          <!-- <IconButton content="编辑" icon-name="Edit" @click="handleEdit(row)" /> -->
          <!-- <IconButton content="删除" icon-name="Delete" @click="handleDelete(row)" /> -->
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
          <span> 全部统计：10条 </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
