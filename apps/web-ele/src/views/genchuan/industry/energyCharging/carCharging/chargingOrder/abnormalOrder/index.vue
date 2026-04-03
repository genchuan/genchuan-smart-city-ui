<script setup>
import { computed, reactive, ref, watch, nextTick } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';
import { downloadFileFromBlobPart } from '@vben/utils';
import AbnormalOrderDetailDrawer from './components/detail.vue';
import {
  dataList,
  getAbnormalOrderPage,
  verifyAbnormalOrder,
  handleAbnormalOrder,
  completeAbnormalOrder,
  remarkAbnormalOrder,
  refundAbnormalOrder,
  exportAbnormalOrder,
} from '#/api/genchuan/industry/energyCharging/carCharging/chargingOrder/abnormalOrder/data.js';
import {
  textObj,
  useFormSchema,
  getColumnsByStatus,
} from '#/api/genchuan/industry/energyCharging/carCharging/chargingOrder/abnormalOrder/form.js';

// 辅助函数：状态标签类型
const getStatusType = (status) => {
  const map = {
    '未核实': 'warning',
    '已核实': 'primary',
    '处理中': 'success',
    '已完结': 'info',
  };
  return map[status] || 'info';
};

// 格式化金额
const formatMoney = (amount) => {
  if (amount === null || amount === undefined) return '-';
  return `¥${parseFloat(amount).toFixed(2)}`;
};

// 时间戳格式化
const formatTimestamp = (timestamp) => {
  if (!timestamp) return '-';
  const date = new Date(parseInt(timestamp));
  if (isNaN(date.getTime())) return timestamp;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 提取日期部分
const getDateFromTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(parseInt(timestamp));
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const props = defineProps({ secondShow: Boolean, arrowShow: Boolean, arrowState: Boolean });
const emit = defineEmits(['arrow-change']);

// ---------- 标签筛选（支持数组多值） ----------
const tagFilters = ref({});

function handleFilterTagClick(field, value) {
  if (!field || value == null) return;
  if (tagFilters.value[field] !== undefined) {
    const existing = tagFilters.value[field];
    if (Array.isArray(existing) && existing.length === 1 && existing[0] === value) {
      delete tagFilters.value[field];
    } else if (!Array.isArray(existing) && existing === value) {
      delete tagFilters.value[field];
    } else {
      tagFilters.value[field] = value;
    }
  } else {
    tagFilters.value[field] = value;
  }
  gridApi.reload();
}

function clearFilters() {
  tagFilters.value = {};
  gridApi.reload();
}

function removeFilterTag(field) {
  delete tagFilters.value[field];
  gridApi.reload();
}

function getFieldLabel(field) {
  const map = {
    abnormalType: '异常类型',
    abnormalStatus: '异常状态',
    checkUser: '排查人员',
    creator: '操作人',
    createTime: '创建时间',
    orderCode: '订单编号',
  };
  return map[field] || field;
}

function getTagDisplayText(field, value) {
  if (Array.isArray(value)) return value.join('、');
  return value || '-';
}

// ---------- 原有变量 ----------
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => drawerApi.close(),
});

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  list: [],
  loading: false,
});

const activeName = ref('全部');
const gridColumns = ref(getColumnsByStatus(activeName.value));
const checkedIds = ref([]);
const checkedRows = ref([]);

function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map(item => item.id);
  checkedRows.value = records;
}

const searchParams = ref({});

const getTableData = async ({ page }) => {
  dataObj.loading = true;
  try {
    const params = {
      ...searchParams.value,
      pageNo: page.currentPage,
      pageSize: page.pageSize,
    };
    if (params.abnormalTime && Array.isArray(params.abnormalTime) && params.abnormalTime.length === 2) {
      params.startTime = params.abnormalTime[0];
      params.endTime = params.abnormalTime[1];
      delete params.abnormalTime;
    }
    const res = await getAbnormalOrderPage(params);
    let filtered = res.list.filter(v => activeName.value === '全部' || v.abnormalStatus === activeName.value);
    // 应用标签筛选
    Object.entries(tagFilters.value).forEach(([field, filterValue]) => {
      filtered = filtered.filter(item => {
        let itemValue;
        switch (field) {
          case 'abnormalType': itemValue = item.abnormalType; break;
          case 'abnormalStatus': itemValue = item.abnormalStatus; break;
          case 'checkUser': itemValue = item.checkUser; break;
          case 'creator': itemValue = item.creator; break;
          case 'createTime':
            const createDate = item.createTime ? getDateFromTimestamp(item.createTime) : '';
            itemValue = createDate;
            break;
          case 'orderCode': itemValue = item.orderCode; break;
          default: itemValue = item[field];
        }
        if (Array.isArray(filterValue)) {
          return filterValue.includes(String(itemValue));
        } else {
          return String(itemValue) === String(filterValue);
        }
      });
    });
    dataObj.total = filtered.length;
    dataObj.list = filtered.slice((page.currentPage - 1) * page.pageSize, page.currentPage * page.pageSize);
  } catch (error) {
    console.error('获取数据失败:', error);
    const mockData = dataList();
    let filtered = mockData.filter(v => activeName.value === '全部' || v.abnormalStatus === activeName.value);
    Object.entries(tagFilters.value).forEach(([field, filterValue]) => {
      filtered = filtered.filter(item => {
        let itemValue;
        switch (field) {
          case 'abnormalType': itemValue = item.abnormalType; break;
          case 'abnormalStatus': itemValue = item.abnormalStatus; break;
          case 'checkUser': itemValue = item.checkUser; break;
          case 'creator': itemValue = item.creator; break;
          case 'createTime':
            const createDate = item.createTime ? getDateFromTimestamp(item.createTime) : '';
            itemValue = createDate;
            break;
          case 'orderCode': itemValue = item.orderCode; break;
          default: itemValue = item[field];
        }
        if (Array.isArray(filterValue)) {
          return filterValue.includes(String(itemValue));
        } else {
          return String(itemValue) === String(filterValue);
        }
      });
    });
    dataObj.total = filtered.length;
    dataObj.list = filtered.slice((page.currentPage - 1) * page.pageSize, page.currentPage * page.pageSize);
  } finally {
    dataObj.loading = false;
  }
  return dataObj;
};

function handleRefresh() { gridApi.reload(); }

async function handleExport() {
  try {
    const loading = ElLoading.service({ text: '正在导出...' });
    try {
      const data = await exportAbnormalOrder(searchParams.value);
      downloadFileFromBlobPart({ fileName: '异常订单列表.xls', source: data });
      ElMessage.success('导出成功');
    } finally { loading.close(); }
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败');
  }
}

// 批量核实
async function handleBatchVerify() {
  if (checkedIds.value.length === 0) { ElMessage.warning('请至少选择一条异常订单'); return; }
  const selectedRows = checkedRows.value.filter(row => row.abnormalStatus === '未核实');
  if (selectedRows.length === 0) { ElMessage.warning('请选择状态为【未核实】的订单'); return; }

  try {
    const { value: result } = await ElMessageBox.prompt('请选择核实结果', '核实', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      inputType: 'select',
      inputOptions: [
        { label: '正常', value: '正常' },
        { label: '异常', value: '异常' },
        { label: '误报', value: '误报' },
      ],
      inputPlaceholder: '请选择核实结果',
    });
    if (result) {
      const { value: remark } = await ElMessageBox.prompt('请输入核实备注（可选）', '核实备注', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入备注',
      });
      const loading = ElLoading.service({ text: '核实中...' });
      try {
        const promises = selectedRows.map(row => verifyAbnormalOrder({ id: row.id, verifyResult: result, verifyRemark: remark || '' }));
        const results = await Promise.all(promises);
        const allSuccess = results.every(res => res === true);
        if (allSuccess) {
          selectedRows.forEach(row => {
            row.abnormalStatus = '已核实';
            row.verifyUser = '当前用户'; // 实际应从登录信息获取
            row.verifyTime = Date.now().toString();
            row.verifyResult = result;
            row.checkUser = '当前用户';
            row.checkTime = Date.now().toString();
          });
          ElMessage.success('核实成功'); handleRefresh();
        } else { ElMessage.error('部分核实失败'); }
      } finally { loading.close(); }
    }
  } catch {}
}

// 批量处理
async function handleBatchHandle() {
  if (checkedIds.value.length === 0) { ElMessage.warning('请至少选择一条异常订单'); return; }
  const selectedRows = checkedRows.value.filter(row => row.abnormalStatus === '已核实');
  if (selectedRows.length === 0) { ElMessage.warning('请选择状态为【已核实】的订单'); return; }

  try {
    const { value: measure } = await ElMessageBox.prompt('请输入处理措施', '处理', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      inputPlaceholder: '请输入处理措施',
    });
    if (measure) {
      const loading = ElLoading.service({ text: '处理中...' });
      try {
        const promises = selectedRows.map(row => handleAbnormalOrder({ id: row.id, handleMeasure: measure }));
        const results = await Promise.all(promises);
        const allSuccess = results.every(res => res === true);
        if (allSuccess) {
          const now = Date.now().toString();
          selectedRows.forEach(row => {
            row.abnormalStatus = '处理中';
            row.handleUser = '当前用户';
            row.handleTime = now;
            row.handleMeasure = measure;
          });
          ElMessage.success('处理成功'); handleRefresh();
        } else { ElMessage.error('部分处理失败'); }
      } finally { loading.close(); }
    }
  } catch {}
}

// 批量完结
async function handleBatchComplete() {
  if (checkedIds.value.length === 0) { ElMessage.warning('请至少选择一条异常订单'); return; }
  const selectedRows = checkedRows.value.filter(row => row.abnormalStatus === '处理中');
  if (selectedRows.length === 0) { ElMessage.warning('请选择状态为【处理中】的订单'); return; }

  try {
    await ElMessageBox.confirm('确认完结？完结后异常订单状态将变为"已完结"。', '完结确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({ text: '完结中...' });
    try {
      const promises = selectedRows.map(row => completeAbnormalOrder({ id: row.id }));
      const results = await Promise.all(promises);
      const allSuccess = results.every(res => res === true);
      if (allSuccess) {
        const now = Date.now().toString();
        selectedRows.forEach(row => {
          row.abnormalStatus = '已完结';
          row.completeTime = now;
        });
        ElMessage.success('完结成功'); handleRefresh();
      } else { ElMessage.error('部分完结失败'); }
    } finally { loading.close(); }
  } catch {}
}

// 行操作：核实
async function handleRowVerify(row) {
  if (row.abnormalStatus !== '未核实') {
    ElMessage.warning('只有未核实状态的订单可以核实');
    return;
  }
  try {
    const { value: result } = await ElMessageBox.prompt('请选择核实结果', '核实', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      inputType: 'select',
      inputOptions: [
        { label: '正常', value: '正常' },
        { label: '异常', value: '异常' },
        { label: '误报', value: '误报' },
      ],
      inputPlaceholder: '请选择核实结果',
    });
    if (result) {
      const { value: remark } = await ElMessageBox.prompt('请输入核实备注（可选）', '核实备注', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入备注',
      });
      const loading = ElLoading.service({ text: '核实中...' });
      try {
        const res = await verifyAbnormalOrder({ id: row.id, verifyResult: result, verifyRemark: remark || '' });
        if (res === true) {
          row.abnormalStatus = '已核实';
          row.verifyUser = '当前用户';
          row.verifyTime = Date.now().toString();
          row.verifyResult = result;
          row.checkUser = '当前用户';
          row.checkTime = Date.now().toString();
          ElMessage.success('核实成功'); handleRefresh();
        } else { ElMessage.error('核实失败'); }
      } finally { loading.close(); }
    }
  } catch {}
}

// 行操作：处理
async function handleRowHandle(row) {
  if (row.abnormalStatus !== '已核实') {
    ElMessage.warning('只有已核实状态的订单可以处理');
    return;
  }
  try {
    const { value: measure } = await ElMessageBox.prompt('请输入处理措施', '处理', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      inputPlaceholder: '请输入处理措施',
    });
    if (measure) {
      const loading = ElLoading.service({ text: '处理中...' });
      try {
        const res = await handleAbnormalOrder({ id: row.id, handleMeasure: measure });
        if (res === true) {
          row.abnormalStatus = '处理中';
          row.handleUser = '当前用户';
          row.handleTime = Date.now().toString();
          row.handleMeasure = measure;
          ElMessage.success('处理成功'); handleRefresh();
        } else { ElMessage.error('处理失败'); }
      } finally { loading.close(); }
    }
  } catch {}
}

// 行操作：退款
async function handleRowRefund(row) {
  if (!['已核实', '处理中'].includes(row.abnormalStatus)) {
    ElMessage.warning('只有已核实或处理中的订单可以退款');
    return;
  }
  try {
    const { value: amount } = await ElMessageBox.prompt('请输入退款金额', '退款', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      inputPlaceholder: '例如：20.00',
      inputPattern: /^\d+(\.\d{1,2})?$/,
      inputErrorMessage: '请输入正确的金额格式',
    });
    if (amount) {
      const { value: reason } = await ElMessageBox.prompt('请输入退款原因', '退款原因', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入退款原因',
      });
      if (reason) {
        const loading = ElLoading.service({ text: '退款中...' });
        try {
          const res = await refundAbnormalOrder({ id: row.id, refundAmount: parseFloat(amount), refundReason: reason });
          if (res === true) {
            row.refundAmount = parseFloat(amount);
            ElMessage.success('退款成功'); handleRefresh();
          } else { ElMessage.error('退款失败'); }
        } finally { loading.close(); }
      }
    }
  } catch {}
}

// 行操作：完结
async function handleRowComplete(row) {
  if (row.abnormalStatus !== '处理中') {
    ElMessage.warning('只有处理中状态的订单可以完结');
    return;
  }
  try {
    await ElMessageBox.confirm('确认完结？完结后异常订单状态将变为"已完结"。', '完结确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({ text: '完结中...' });
    try {
      const res = await completeAbnormalOrder({ id: row.id });
      if (res === true) {
        row.abnormalStatus = '已完结';
        row.completeTime = Date.now().toString();
        ElMessage.success('完结成功'); handleRefresh();
      } else { ElMessage.error('完结失败'); }
    } finally { loading.close(); }
  } catch {}
}

// 行操作：备注
async function handleRowRemark(row) {
  try {
    const { value: remark } = await ElMessageBox.prompt('请输入备注', '备注', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      inputValue: row.remark || '',
    });
    if (remark !== null) {
      const loading = ElLoading.service({ text: '保存备注中...' });
      try {
        const res = await remarkAbnormalOrder({ id: row.id, remark });
        if (res === true) {
          row.remark = remark;
          ElMessage.success('备注添加成功');
          handleRefresh();
        } else { ElMessage.error('备注添加失败'); }
      } finally { loading.close(); }
    }
  } catch {}
}

// 查看详情
const abnormalOrderDetailDrawerRef = ref(null);
function handleOpenDetail(row) {
  dataObj.detailObj = row;
  abnormalOrderDetailDrawerRef.value.open();
}

const [QueryForm] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: (values) => {
    searchParams.value = { ...values };
    drawerApi.close();
    gridApi.reload();
  },
  layout: 'horizontal',
  schema: useFormSchema().map(v => {
    delete v.rules;
    return v;
  }),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: gridColumns.value,
    keepSource: true,
    proxyConfig: { ajax: { query: getTableData } },
    rowConfig: { keyField: 'id', isHover: true },
    pagerConfig: dataObj,
    toolbarConfig: { refresh: true, search: true },
    showOverflow: true,
  },
  gridEvents: { checkboxAll: handleRowCheckboxChange, checkboxChange: handleRowCheckboxChange },
  showSearchForm: false,
});

watch(activeName, (newVal) => {
  tagFilters.value = {};
  gridColumns.value = getColumnsByStatus(newVal);
  if (gridApi && gridApi.xGrid) gridApi.xGrid.refreshColumn();
  else gridApi.setGridOptions?.({ columns: gridColumns.value });
  gridApi.reload();
});

const handleSerachShow = () => drawerApi.open();
const handleFullShow = () => screenfull.toggle();
const arrowChange = () => emit('arrow-change');

defineExpose({ handleFilterTagClick, clearFilters });
</script>

<template>
  <div class="park-lot-table-new">
    <AbnormalOrderDetailDrawer ref="abnormalOrderDetailDrawerRef" :detail-obj="dataObj.detailObj" @refresh="handleRefresh" />
    <Drawer title="搜索">
      <QueryForm />
    </Drawer>
    <Grid>
      <template #table-title>
        <ElTag
          v-for="(value, field) in tagFilters"
          :key="field"
          type="success"
          closable
          @close="removeFilterTag(field)"
          style="height: 32px; margin: 4px 8px 4px 0; line-height: 32px"
        >
          {{ getFieldLabel(field) }}: {{ getTagDisplayText(field, value) }}
        </ElTag>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="批量核实" icon-name="Check" @click="handleBatchVerify" />
          <IconButton content="批量处理" icon-name="Tools" @click="handleBatchHandle" />
          <IconButton content="批量完结" icon-name="EditPen" color="#F56C6C" @click="handleBatchComplete" />
          <IconButton content="导出" icon-name="download" @click="handleExport" />
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow" />
          <IconButton :content="props.arrowShow ? '展开' : '收缩'" :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <!-- 自定义列插槽 -->
      <template #orderCode="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary" style="cursor: pointer;">{{ row.orderCode }}</el-text>
      </template>
      <template #plateNo="{ row }">
        <el-text>{{ row.plateNo || '-' }}</el-text>
      </template>
      <template #abnormalType="{ row }">
        <el-tag @click="handleFilterTagClick('abnormalType', row.abnormalType)" style="cursor: pointer;">{{ row.abnormalType }}</el-tag>
      </template>
      <template #abnormalTime="{ row }">
        <el-text>{{ formatTimestamp(row.abnormalTime) }}</el-text>
      </template>
      <template #checkUser="{ row }">
        <el-text @click="handleFilterTagClick('checkUser', row.checkUser)" type="primary" style="cursor: pointer;">{{ row.checkUser || '-' }}</el-text>
      </template>
      <template #handleTime="{ row }">
        <el-text>{{ formatTimestamp(row.handleTime) }}</el-text>
      </template>
      <template #abnormalStatus="{ row }">
        <el-tag :type="getStatusType(row.abnormalStatus)" @click="handleFilterTagClick('abnormalStatus', row.abnormalStatus)" style="cursor: pointer;">{{ row.abnormalStatus }}</el-tag>
      </template>
      <template #refundAmount="{ row }">
        <el-text>{{ formatMoney(row.refundAmount) }}</el-text>
      </template>
      <template #createTime="{ row }">
        <el-text @click="handleFilterTagClick('createTime', getDateFromTimestamp(row.createTime))" type="primary" style="cursor: pointer;">{{ formatTimestamp(row.createTime) }}</el-text>
      </template>
      <template #creator="{ row }">
        <el-text @click="handleFilterTagClick('creator', row.creator)" type="primary" style="cursor: pointer;">{{ row.creator || '-' }}</el-text>
      </template>

      <!-- 操作按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
          <IconButton v-if="row.abnormalStatus === '未核实'" content="核实" icon-name="Check" @click="handleRowVerify(row)" />
          <IconButton v-if="row.abnormalStatus === '已核实'" content="处理" icon-name="Tools" @click="handleRowHandle(row)" />
          <IconButton v-if="['已核实', '处理中'].includes(row.abnormalStatus)" content="退款" icon-name="Money" @click="handleRowRefund(row)" />
          <IconButton v-if="row.abnormalStatus === '处理中'" content="完结" icon-name="EditPen" color="#F56C6C" @click="handleRowComplete(row)" />
          <IconButton content="备注" icon-name="edit" @click="handleRowRemark(row)" />
        </div>
      </template>
    </Grid>
  </div>
</template>
