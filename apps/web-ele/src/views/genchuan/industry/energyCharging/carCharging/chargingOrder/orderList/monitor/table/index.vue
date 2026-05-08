<!-- index.vue - 代理模式版本（只保留详情按钮）-->
<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>

    <ParkDetailDrawer
      ref="parkDetailDrawerRef"
      :detail-obj="dataObj.detailObj"
    />

    <Drawer title="搜索">
      <QueryForm class="query-form" />
      <template #footer>
        <div style="display: flex; justify-content: flex-end; gap: 12px;">
          <el-button @click="handleReset">重置</el-button>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </div>
      </template>
    </Drawer>

    <Grid>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton
            content="搜索"
            icon-name="search"
            @click="handleSerachShow"
          />
          <IconButton
            :content="props.arrowShow ? '收缩' : '展开'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
        </div>
      </template>

      <template #orderCode="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.orderCode }}
        </el-text>
      </template>

      <template #pileCode="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.pileCode }}
        </el-text>
      </template>

      <template #user_name="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.userId }}
        </el-text>
      </template>

      <template #amount="{ row }">
        <span class="common-align">
          ¥{{ (row.chargeMoney || 0).toFixed(2) }}
        </span>
      </template>

      <template #payStatus="{ row }">
        <el-tag :type="row.payStatus === '已支付' ? 'success' : 'danger'">
          {{ row.payStatus }}
        </el-tag>
      </template>

      <template #orderStatus="{ row }">
        <el-tag :type="getOrderStatusType(row.orderStatus)">
          {{ row.orderStatus }}
        </el-tag>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="详情"
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
          <span> 全部统计：{{ dataObj.total }}条 </span>
        </div>
      </template>
    </Grid>
  </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';

import {
  getOrderListPage,
  getOrderListDetail,
  cancelOrderList,
  payRemindOrderList,
  refundApplyOrderList,
  stopChargeOrderList,
  exportOrderListExcel,
  batchGetOrderList
} from '#/api/genchuan/industry/energyCharging/carCharging/chargingOrder/orderList/index.js';

import ParkDetailDrawer from './detail.vue';

// ==================== 表单配置 ====================
function useFormSchema() {
  return [
    {
      fieldName: 'orderCode',
      label: '订单编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入订单编号',
      },
      labelWidth: '130',
    },
    {
      fieldName: 'userId',
      label: '用户ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户ID',
      },
      labelWidth: '130',
    },
    {
      fieldName: 'pileCode',
      label: '充电桩编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入充电桩编号',
      },
      labelWidth: '130',
    },
    {
      fieldName: 'orderStatus',
      label: '订单状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择订单状态',
        options: [
          { label: '全部', value: '' },
          { label: '待支付', value: '待支付' },
          { label: '充电中', value: '充电中' },
          { label: '已完成', value: '已完成' },
          { label: '已取消', value: '已取消' },
        ]
      },
      labelWidth: '130',
    },
    {
      fieldName: 'payStatus',
      label: '支付状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择支付状态',
        options: [
          { label: '全部', value: '' },
          { label: '已支付', value: '已支付' },
          { label: '未支付', value: '未支付' },
        ]
      },
      labelWidth: '130',
    },
    {
      fieldName: 'createTimeRange',
      label: '创建时间',
      component: 'DatePicker',
      componentProps: {
        type: 'datetimerange',
        placeholder: ['开始时间', '结束时间'],
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: '130',
    },
  ];
}

// ==================== 表格字段配置 ====================
function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'orderCode',
      title: '订单编号',
      minWidth: 150,
      sortable: true,
      slots: { default: 'orderCode' },
    },
    {
      field: 'userId',
      title: '用户ID',
      minWidth: 120,
      sortable: true,
      slots: { default: 'user_name' },
    },
    {
      field: 'plateNo',
      title: '车牌号',
      minWidth: 120,
    },
    {
      field: 'pileCode',
      title: '充电桩编号',
      minWidth: 150,
      sortable: true,
      slots: { default: 'pileCode' },
    },
    {
      field: 'chargeTime',
      title: '充电时长(小时)',
      minWidth: 140,
      sortable: true,
      formatter: ({ cellValue }) => cellValue ? `${cellValue}小时` : '-',
    },
    {
      field: 'chargeAmount',
      title: '充电量(度)',
      minWidth: 120,
      sortable: true,
      formatter: ({ cellValue }) => cellValue ? `${cellValue}度` : '-',
    },
    {
      field: 'chargeMoney',
      title: '充电金额(元)',
      minWidth: 120,
      sortable: true,
      formatter: ({ cellValue }) => cellValue ? `¥${cellValue.toFixed(2)}` : '¥0.00',
    },
    {
      field: 'payStatus',
      title: '支付状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'payStatus' },
    },
    {
      field: 'orderStatus',
      title: '订单状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'orderStatus' },
    },
    {
      field: 'payType',
      title: '支付方式',
      minWidth: 100,
      formatter: ({ cellValue }) => cellValue || '-',
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 150,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 180,
      sortable: true,
      formatter: ({ cellValue }) => cellValue ? new Date(cellValue).toLocaleString() : '-',
    },
    {
      title: '操作',
      width: 80,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

// ==================== Props & Emits ====================
const props = defineProps({
  secondShow: { type: Boolean, default: false },
  arrowShow: { type: Boolean, default: false },
  arrowState: { type: Boolean, default: false },
});

const emit = defineEmits(['arrow-change']);

// ==================== 辅助函数 ====================
const getOrderStatusType = (status) => {
  const typeMap = {
    '待支付': 'warning',
    '充电中': 'primary',
    '已完成': 'success',
    '已取消': 'info'
  };
  return typeMap[status] || 'info';
};

// ==================== 抽屉和表单 ====================
const getTitle = computed(() => {
  return formData.value?.id ? '编辑订单' : '新增订单';
});

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() { drawerApi.close(); },
  onConfirm() {},
});

const formData = ref();
const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
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
  onCancel() { formDrawerApi.close(); },
  async onConfirm() {
    handleRefresh();
    formDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
      if (formData.value?.id) {
        try {
          const detail = await getOrderListDetail({ id: formData.value.id });
          await formApi.setValues(detail);
        } catch (error) {
          ElMessage.error('获取详情失败');
        }
      } else {
        formApi.resetForm();
      }
    }
  },
});

// ==================== 数据获取（代理模式） ====================
const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: 0,
  searchParams: {},
});

// 构建查询参数（用于导出和查询）
const buildQueryParams = () => {
  const params = {
    ...dataObj.searchParams,
  };

  // 处理时间范围参数
  if (params.createTimeRange && params.createTimeRange.length === 2) {
    params.createTimeStart = params.createTimeRange[0];
    params.createTimeEnd = params.createTimeRange[1];
    delete params.createTimeRange;
  }

  // 删除空值参数
  Object.keys(params).forEach(key => {
    if (params[key] === '' || params[key] === null || params[key] === undefined) {
      delete params[key];
    }
  });

  return params;
};

// 代理模式的数据获取函数
const getTableData = async ({ page }) => {
  try {
    const params = {
      pageNum: page?.currentPage || 1,
      pageSize: page?.pageSize || 10,
      ...buildQueryParams(),
    };

    console.log('📤 请求参数:', params);

    const response = await getOrderListPage(params);

    console.log('📥 接口返回:', response);

    let records = [];
    let total = 0;

    if (response) {
      if (response.list && Array.isArray(response.list)) {
        records = response.list;
        total = response.total || records.length;
      } else if (response.records && Array.isArray(response.records)) {
        records = response.records;
        total = response.total || records.length;
      } else if (response.data && response.data.list) {
        records = response.data.list;
        total = response.data.total || records.length;
      }
    }

    dataObj.total = total;

    return {
      records: records,
      total: total,
    };
  } catch (error) {
    console.error('❌ 获取数据失败:', error);
    ElMessage.error('获取数据失败');
    return { records: [], total: 0 };
  }
};

// 搜索表单
const [QueryForm] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: useFormSchema().map(v => ({ ...v, rules: undefined })),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
});

// Grid 配置（代理模式）
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: {
      enabled: true,
      ajax: { query: getTableData },
      response: {
        result: 'records',
        total: 'total',
      },
    },
    rowConfig: { keyField: 'id', isHover: true },
    pagerConfig: {
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 20, 50, 100],
      total: 0,
    },
    toolbarConfig: { refresh: true, search: true },
    showOverflow: true,
  },
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
  showSearchForm: false,
});

// ==================== 业务逻辑 ====================
const checkedIds = ref([]);

function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}

function handleRefresh() {
  gridApi.query();
}

function handleCreate() {
  formDrawerApi.setData({ title: '新增' }).open();
}

function handleEdit(row) {
  formDrawerApi.setData({ title: '编辑', ...row }).open();
}

async function onSubmit(values) {
  console.log('🔍 搜索:', values);
  dataObj.searchParams = values;
  drawerApi.close();
  gridApi.query();
}

function handleReset() {
  dataObj.searchParams = {};
  if (QueryForm && QueryForm.resetForm) {
    QueryForm.resetForm();
  }
  gridApi.query();
}

const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

const handleOpenDetail = async (row) => {
  try {
    const loadingInstance = ElLoading.service({ text: '加载详情中...' });
    const detail = await getOrderListDetail({ id: row.id });
    dataObj.detailObj = detail;
    parkDetailDrawerRef.value.open();
    loadingInstance.close();
  } catch (error) {
    ElMessage.error('获取详情失败');
  }
};

const handleSerachShow = () => { drawerApi.open(); };
const handleFullShow = () => { screenfull.toggle(); };
const arrowChange = () => { emit('arrow-change'); };

const parkDetailDrawerRef = ref(null);

onMounted(() => {
  console.log('🚀 代理模式版本启动');
  setTimeout(() => handleRefresh(), 100);
});
</script>

<style scoped>
.park-lot-table-new {
  height: 100%;
}
.common-toolbar-tools {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.table-toolbar-tools {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
.common-total {
  cursor: pointer;
  padding: 8px;
  text-align: center;
  border-top: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
.common-align {
  cursor: pointer;
}
</style>
