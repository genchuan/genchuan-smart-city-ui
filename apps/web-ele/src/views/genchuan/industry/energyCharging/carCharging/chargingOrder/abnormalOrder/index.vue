<script setup>
import { computed, reactive, ref, watch, nextTick } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { downloadFileFromBlobPart } from '@vben/utils';
import AbnormalOrderDetailDrawer from './components/detail.vue';
import {
  dataList,
  getAbnormalOrderPage,
  verifyAbnormalOrder,
  handleAbnormalOrder,
  completeAbnormalOrder,
  refundAbnormalOrder,
  remarkAbnormalOrder,
  exportAbnormalOrder,
  getAbnormalOrderDetail,
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

// 格式化金额
const formatMoney = (amount) => {
  if (amount === null || amount === undefined) return '-';
  return `¥${parseFloat(amount).toFixed(2)}`;
};

const props = defineProps({ secondShow: Boolean, arrowShow: Boolean, arrowState: Boolean });
const emit = defineEmits(['arrow-change']);

// ---------- 标签筛选 ----------
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
    if (params.createTime && Array.isArray(params.createTime) && params.createTime.length === 2) {
      params.startTime = params.createTime[0];
      params.endTime = params.createTime[1];
      delete params.createTime;
    }
    const res = await getAbnormalOrderPage(params);
    let filtered = res.list;
    // 应用标签筛选
    Object.entries(tagFilters.value).forEach(([field, filterValue]) => {
      filtered = filtered.filter(item => {
        let itemValue;
        switch (field) {
          case 'abnormalType':
            itemValue = item.abnormalType;
            break;
          case 'abnormalStatus':
            itemValue = item.abnormalStatus;
            break;
          case 'checkUser':
            itemValue = item.checkUser;
            break;
          case 'creator':
            itemValue = item.creator;
            break;
          case 'createTime':
            const createDate = item.createTime ? getDateFromTimestamp(item.createTime) : '';
            itemValue = createDate;
            break;
          default:
            itemValue = item[field];
        }
        if (Array.isArray(filterValue)) {
          return filterValue.includes(String(itemValue));
        } else {
          return String(itemValue) === String(filterValue);
        }
      });
    });
    // ✅ 修改点1：使用后端返回的总记录数
    dataObj.total = res.total;
    // ✅ 修改点2：直接使用当前页数据（res.list 已经是当前页数据，不需要再 slice）
    dataObj.list = filtered;
  } catch (error) {
    console.error('获取数据失败:', error);
    const mockData = dataList();
    let filtered = mockData;
    Object.entries(tagFilters.value).forEach(([field, filterValue]) => {
      filtered = filtered.filter(item => {
        let itemValue;
        switch (field) {
          case 'abnormalType':
            itemValue = item.abnormalType;
            break;
          case 'abnormalStatus':
            itemValue = item.abnormalStatus;
            break;
          case 'checkUser':
            itemValue = item.checkUser;
            break;
          case 'creator':
            itemValue = item.creator;
            break;
          case 'createTime':
            const createDate = item.createTime ? getDateFromTimestamp(item.createTime) : '';
            itemValue = createDate;
            break;
          default:
            itemValue = item[field];
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

function handleRefresh() {
  gridApi.reload();
}

function handleReset() {
  searchParams.value = {};
  tagFilters.value = {};
  gridApi.reload();
}

async function handleExport() {
  try {
    const loading = ElLoading.service({ text: '正在导出...' });
    try {
      const data = await exportAbnormalOrder(searchParams.value);
      downloadFileFromBlobPart({ fileName: '异常订单列表.xls', source: data });
      ElMessage.success('导出成功');
    } finally {
      loading.close();
    }
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败');
  }
}

// ========== 核实弹窗（使用独立对话框，下拉选择） ==========
const verifyDialogVisible = ref(false);
const currentVerifyRows = ref([]); // 要核实的订单列表
const verifyResult = ref('');
const verifyRemark = ref('');
const isBatchVerify = ref(false);

function openVerifyDialog(rows, batch = false) {
  currentVerifyRows.value = rows;
  isBatchVerify.value = batch;
  verifyResult.value = '';
  verifyRemark.value = '';
  verifyDialogVisible.value = true;
}

async function confirmVerify() {
  if (!verifyResult.value) {
    ElMessage.warning('请选择核实结果');
    return;
  }
  const loading = ElLoading.service({ text: '核实中...' });
  try {
    const ids = currentVerifyRows.value.map(row => row.id);
    const res = await verifyAbnormalOrder({
      ids,
      verifyResult: verifyResult.value,
      verifyRemark: verifyRemark.value,
    });
    if (res === true) {
      ElMessage.success(isBatchVerify.value ? '批量核实成功' : '核实成功');
      verifyDialogVisible.value = false;
      handleRefresh();
    } else {
      ElMessage.error(isBatchVerify.value ? '批量核实失败' : '核实失败');
    }
  } finally {
    loading.close();
  }
}

// 批量核实
async function handleBatchVerify() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一条异常订单');
    return;
  }
  const selectedRows = checkedRows.value.filter(row => row.abnormalStatus === '未核实');
  if (selectedRows.length === 0) {
    ElMessage.warning('请选择状态为【未核实】的订单');
    return;
  }
  openVerifyDialog(selectedRows, true);
}

// 单行核实
async function handleRowVerify(row) {
  if (row.abnormalStatus !== '未核实') {
    ElMessage.warning('只有未核实状态的订单可以核实');
    return;
  }
  openVerifyDialog([row], false);
}

// 批量处理
async function handleBatchHandle() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一条异常订单');
    return;
  }
  const selectedRows = checkedRows.value.filter(row => row.abnormalStatus === '已核实');
  if (selectedRows.length === 0) {
    ElMessage.warning('请选择状态为【已核实】的订单');
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
        const ids = selectedRows.map(row => row.id);
        const res = await handleAbnormalOrder({ ids, handleMeasure: measure });
        if (res === true) {
          ElMessage.success('批量处理成功');
          handleRefresh();
        } else {
          ElMessage.error('批量处理失败');
        }
      } finally {
        loading.close();
      }
    }
  } catch {}
}

// 批量完结
async function handleBatchComplete() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一条异常订单');
    return;
  }
  const selectedRows = checkedRows.value.filter(row => row.abnormalStatus === '处理中');
  if (selectedRows.length === 0) {
    ElMessage.warning('请选择状态为【处理中】的订单');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认完结选中的 ${selectedRows.length} 条异常订单？完结后状态将变为"已完结"。`, '批量完结确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({ text: '完结中...' });
    try {
      const ids = selectedRows.map(row => row.id);
      const res = await completeAbnormalOrder({ ids });
      if (res === true) {
        ElMessage.success('批量完结成功');
        handleRefresh();
      } else {
        ElMessage.error('批量完结失败');
      }
    } finally {
      loading.close();
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
        const res = await handleAbnormalOrder({ ids: [row.id], handleMeasure: measure });
        if (res === true) {
          ElMessage.success('处理成功');
          handleRefresh();
        } else {
          ElMessage.error('处理失败');
        }
      } finally {
        loading.close();
      }
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
            ElMessage.success('退款成功');
            handleRefresh();
          } else {
            ElMessage.error('退款失败');
          }
        } finally {
          loading.close();
        }
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
    await ElMessageBox.confirm(`确认完结异常订单（订单号：${row.orderCode}）？完结后状态将变为"已完结"。`, '完结确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({ text: '完结中...' });
    try {
      const res = await completeAbnormalOrder({ ids: [row.id] });
      if (res === true) {
        ElMessage.success('完结成功');
        handleRefresh();
      } else {
        ElMessage.error('完结失败');
      }
    } finally {
      loading.close();
    }
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
          ElMessage.success('备注添加成功');
          handleRefresh();
        } else {
          ElMessage.error('备注添加失败');
        }
      } finally {
        loading.close();
      }
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

const showChart = ref(true);
const toggleChart = () => {
  showChart.value = !showChart.value;
};

defineExpose({ handleFilterTagClick, clearFilters });
</script>

<template>
  <div class="park-lot-table-new">
    <AbnormalOrderDetailDrawer ref="abnormalOrderDetailDrawerRef" :detail-obj="dataObj.detailObj"
                               @refresh="handleRefresh" />
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
          <IconButton content="核实" icon-name="Check" @click="handleBatchVerify" />
          <IconButton content="处理" icon-name="Tools" @click="handleBatchHandle" />
          <IconButton content="完结" icon-name="EditPen" color="#F56C6C" @click="handleBatchComplete" />
          <IconButton content="导出" icon-name="download" @click="handleExport" />
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow" />
          <IconButton content="刷新" icon-name="Refresh" @click="handleRefresh" />
          <IconButton :content="props.arrowShow ? '展开' : '收缩'"
                      :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
          <IconButton :content="showChart ? '隐藏图表' : '显示图表'" icon-name="PieChart"
                      @click="toggleChart" />
        </div>
      </template>

      <template #orderCode="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary" style="cursor: pointer;">{{ row.orderCode }}</el-text>
      </template>
      <template #abnormalType="{ row }">
        <el-tag @click="handleFilterTagClick('abnormalType', row.abnormalType)" style="cursor: pointer;">{{ row.abnormalType }}</el-tag>
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
      <template #creator="{ row }">
        <el-text @click="handleFilterTagClick('creator', row.creator)" type="primary" style="cursor: pointer;">{{ row.creator || '-' }}</el-text>
      </template>
      <template #createTime="{ row }">
        <el-text @click="handleFilterTagClick('createTime', getDateFromTimestamp(row.createTime))" type="primary" style="cursor: pointer;">{{ formatTimestamp(row.createTime) }}</el-text>
      </template>

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

    <!-- 核实弹窗（独立对话框，下拉选择） -->
    <el-dialog title="核实" v-model="verifyDialogVisible" width="400px">
      <el-form label-width="100px">
        <el-form-item label="核实结果" required>
          <el-select v-model="verifyResult" placeholder="请选择核实结果" style="width: 100%;">
            <el-option label="正常" value="正常" />
            <el-option label="异常" value="异常" />
            <el-option label="误报" value="误报" />
          </el-select>
        </el-form-item>
        <el-form-item label="核实备注">
          <el-input v-model="verifyRemark" type="textarea" :rows="3" placeholder="请输入核实备注（可选）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="verifyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmVerify">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>
