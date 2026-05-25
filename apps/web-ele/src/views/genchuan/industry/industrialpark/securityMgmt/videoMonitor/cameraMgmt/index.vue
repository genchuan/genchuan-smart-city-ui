<!-- 文件3: src/views/genchuan/industrialPark/securityMgmt/cameraMgmt/index.vue -->
<script setup>
import { reactive, ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import CameraMgmtDetailDrawer from './components/detail.vue';
import {
  getMockList,
  getCameraMgmtPage,
  createCameraMgmt,
  updateCameraMgmt,
  deleteCameraMgmt,
  restartCameraMgmt,
  repairCameraMgmt,
  checkCameraMgmt,
  orderCameraMgmt,
  acceptCameraMgmt,
  getCameraMgmtDetail,
  getUserDetail,
  getRepairOrders,
} from '#/api/genchuan/industry/industrialpark/securityMgmt/videoMonitor/cameraMgmt/data.js';
import {
  textObj,
  useFormSchema,
  getColumns,
  useEditFormSchema,
  useRepairFormSchema,
  useCheckFormSchema,
  useOrderFormSchema,
  useAcceptFormSchema,
  formatTimestamp,
} from '#/api/genchuan/industry/industrialpark/securityMgmt/videoMonitor/cameraMgmt/form.js';

const props = defineProps({ secondShow: Boolean, arrowShow: Boolean, arrowState: Boolean });
const emit = defineEmits(['arrow-change']);

// 标签筛选
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
    deviceModel: '设备型号',
    area: '安装区域',
    runStatus: '运行状态',
    creator: '创建人',
    createTime: '创建时间',
    deviceName: '设备名称',
    handleUser: '操作人',
  };
  return map[field] || field;
}

function getTagDisplayText(field, value) {
  if (Array.isArray(value)) return value.join('、');
  return value || '-';
}

// 抽屉组件
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => drawerApi.close(),
});

const [EditDrawer, editDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => editDrawerApi.close(),
});

const [RepairDrawer, repairDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => repairDrawerApi.close(),
});

const [CheckDrawer, checkDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => checkDrawerApi.close(),
});

const [OrderDrawer, orderDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => orderDrawerApi.close(),
});

const [AcceptDrawer, acceptDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => acceptDrawerApi.close(),
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

const gridColumns = ref(getColumns());
const checkedIds = ref([]);
const checkedRows = ref([]);

function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map(item => item.id);
  checkedRows.value = records;
}

const searchParams = ref({});
const isEditMode = ref(false);
const currentEditId = ref(null);
const currentRepairIds = ref([]);
const currentCheckRow = ref(null);
const currentOrderRow = ref(null);
const currentAcceptRow = ref(null);

const getDateFromTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(parseInt(timestamp));
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getRunStatusType = (status) => {
  const map = {
    '在线': 'success',
    '离线': 'info',
    '故障': 'danger',
  };
  return map[status] || 'info';
};

const getTableData = async ({ page }) => {
  dataObj.loading = true;
  try {
    const params = {
      ...searchParams.value,
      pageNo: page.currentPage,
      pageSize: page.pageSize,
    };
    const res = await getCameraMgmtPage(params);
    let filtered = res.list;
    Object.entries(tagFilters.value).forEach(([field, filterValue]) => {
      filtered = filtered.filter(item => {
        let itemValue;
        switch (field) {
          case 'deviceModel':
            itemValue = item.deviceModel;
            break;
          case 'area':
            itemValue = item.area;
            break;
          case 'runStatus':
            itemValue = item.runStatus;
            break;
          case 'creator':
            itemValue = item.creator;
            break;
          case 'createTime':
            const createDate = item.createTime ? getDateFromTimestamp(item.createTime) : '';
            itemValue = createDate;
            break;
          case 'deviceName':
            itemValue = item.deviceName;
            break;
          case 'handleUser':
            itemValue = item.handleUser;
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
    dataObj.total = res.total || filtered.length;
    dataObj.list = filtered;
  } catch (error) {
    console.error('获取数据失败:', error);
    const mockData = getMockList();
    let filtered = mockData;
    Object.entries(tagFilters.value).forEach(([field, filterValue]) => {
      filtered = filtered.filter(item => {
        let itemValue;
        switch (field) {
          case 'deviceModel':
            itemValue = item.deviceModel;
            break;
          case 'area':
            itemValue = item.area;
            break;
          case 'runStatus':
            itemValue = item.runStatus;
            break;
          case 'creator':
            itemValue = item.creator;
            break;
          case 'createTime':
            const createDate = item.createTime ? getDateFromTimestamp(item.createTime) : '';
            itemValue = createDate;
            break;
          case 'deviceName':
            itemValue = item.deviceName;
            break;
          case 'handleUser':
            itemValue = item.handleUser;
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

// 批量删除
async function handleBatchDelete() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一个设备');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认删除选中的 ${checkedIds.value.length} 个设备吗？`, '删除确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({ text: '删除中...' });
    try {
      const res = await deleteCameraMgmt({ ids: checkedIds.value });
      if (res && res !== false) {
        ElMessage.success('批量删除成功');
        handleRefresh();
      } else {
        ElMessage.error('批量删除失败');
      }
    } finally {
      loading.close();
    }
  } catch {}
}

// 批量重启
async function handleBatchRestart() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一个设备');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认重启选中的 ${checkedIds.value.length} 个设备吗？`, '重启确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({ text: '重启中...' });
    try {
      const res = await restartCameraMgmt({ ids: checkedIds.value });
      if (res && res !== false) {
        ElMessage.success('批量重启成功');
        handleRefresh();
      } else {
        ElMessage.error('批量重启失败');
      }
    } finally {
      loading.close();
    }
  } catch {}
}

// 批量报修
async function handleBatchRepair() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一个设备');
    return;
  }
  const faultRows = checkedRows.value.filter(row => row.runStatus === '故障');
  if (faultRows.length === 0) {
    ElMessage.warning('请选择状态为【故障】的设备进行报修');
    return;
  }
  currentRepairIds.value = faultRows.map(row => row.id);
  repairFormApi.resetForm();
  repairDrawerApi.open();
}

// 新增
function handleCreate() {
  isEditMode.value = false;
  currentEditId.value = null;
  editFormApi.resetForm();
  editDrawerApi.open();
}

// 编辑
async function handleEdit(row) {
  isEditMode.value = true;
  currentEditId.value = row.id;
  try {
    const detail = await getCameraMgmtDetail({ id: row.id });
    editFormApi.setValues({
      deviceName: detail.deviceName,
      deviceModel: detail.deviceModel,
      area: detail.area,
      factory: detail.factory,
      factoryPhone: detail.factoryPhone,
    });
    editDrawerApi.open();
  } catch (error) {
    console.error('加载详情失败', error);
    ElMessage.error('加载详情失败');
  }
}

// 单行删除
async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`确认删除设备"${row.deviceName}"吗？`, '删除确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({ text: '删除中...' });
    try {
      const res = await deleteCameraMgmt({ ids: [row.id] });
      if (res && res !== false) {
        ElMessage.success('删除成功');
        handleRefresh();
      } else {
        ElMessage.error('删除失败');
      }
    } finally {
      loading.close();
    }
  } catch {}
}

// 单行重启
async function handleRestart(row) {
  try {
    await ElMessageBox.confirm(`确认重启设备"${row.deviceName}"吗？`, '重启确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({ text: '重启中...' });
    try {
      const res = await restartCameraMgmt({ ids: [row.id] });
      if (res && res !== false) {
        ElMessage.success('重启成功');
        handleRefresh();
      } else {
        ElMessage.error('重启失败');
      }
    } finally {
      loading.close();
    }
  } catch {}
}

// 单行报修
function handleRepair(row) {
  if (row.runStatus !== '故障') {
    ElMessage.warning('只有故障状态的设备可以报修');
    return;
  }
  currentRepairIds.value = [row.id];
  repairFormApi.resetForm();
  repairDrawerApi.open();
}

// 排查
function handleCheck(row) {
  if (row.runStatus !== '离线') {
    ElMessage.warning('只有离线状态的设备可以排查');
    return;
  }
  currentCheckRow.value = row;
  checkFormApi.resetForm();
  checkDrawerApi.open();
}

// 派单
function handleOrder(row) {
  if (row.runStatus !== '故障') {
    ElMessage.warning('只有故障状态的设备可以派单');
    return;
  }
  currentOrderRow.value = row;
  orderFormApi.resetForm();
  orderDrawerApi.open();
}

// 验收
function handleAccept(row) {
  if (row.runStatus !== '故障') {
    ElMessage.warning('只有故障状态的设备可以验收');
    return;
  }
  currentAcceptRow.value = row;
  acceptFormApi.resetForm();
  acceptDrawerApi.open();
}

// 查看报修记录明细
async function handleViewRepairCount(row) {
  if (row.repairCount === 0) {
    ElMessage.info('该设备暂无报修记录');
    return;
  }
  try {
    const orders = await getRepairOrders({ deviceId: row.id });
    const orderList = orders.map(o => `工单号：${o.id}，类型：${o.orderType}，状态：${o.orderStatus}，时间：${formatTimestamp(o.createTime)}`).join('\n');
    ElMessageBox.alert(orderList || '暂无报修记录', `设备【${row.deviceName}】报修记录明细`, { confirmButtonText: '关闭' });
  } catch (error) {
    console.error('获取报修记录失败', error);
    ElMessage.error('获取报修记录失败');
  }
}

// 点击操作人弹出用户详情
async function handleViewUser(row) {
  if (!row.handleUser) {
    ElMessage.warning('无操作人信息');
    return;
  }
  try {
    const userDetail = await getUserDetail({ username: row.handleUser });
    ElMessageBox.alert(
      `用户名：${userDetail.username}\n昵称：${userDetail.nickname}\n电话：${userDetail.phone}`,
      '操作人信息',
      { confirmButtonText: '关闭' }
    );
  } catch (error) {
    console.error('获取用户信息失败', error);
    ElMessage.error('获取用户信息失败');
  }
}

// 编辑表单
const [EditForm, editFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async (values) => {
    const loading = ElLoading.service({ text: isEditMode.value ? '保存中...' : '新增中...' });
    try {
      let res;
      if (isEditMode.value) {
        res = await updateCameraMgmt({ ...values, id: currentEditId.value });
      } else {
        res = await createCameraMgmt(values);
      }
      if (res && res !== false) {
        ElMessage.success(isEditMode.value ? '编辑成功' : '新增成功');
        editDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error(isEditMode.value ? '编辑失败' : '新增失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useEditFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: { content: '保存' },
});

// 报修表单
const [RepairForm, repairFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async (values) => {
    const loading = ElLoading.service({ text: '提交报修中...' });
    try {
      const res = await repairCameraMgmt({ ids: currentRepairIds.value, repairContent: values.repairContent });
      if (res && res.success !== false) {
        ElMessage.success('报修成功，工单已生成');
        repairDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('报修失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useRepairFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: { content: '提交' },
});

// 排查表单
const [CheckForm, checkFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async (values) => {
    const loading = ElLoading.service({ text: '排查中...' });
    try {
      const res = await checkCameraMgmt({ id: currentCheckRow.value.id, checkResult: values.checkResult });
      if (res && res !== false) {
        ElMessage.success('排查完成，设备状态已更新');
        checkDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('排查失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useCheckFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: { content: '提交' },
});

// 派单表单
const [OrderForm, orderFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async (values) => {
    const loading = ElLoading.service({ text: '派单中...' });
    try {
      const res = await orderCameraMgmt({ id: currentOrderRow.value.id, userId: values.userId });
      if (res && res !== false) {
        ElMessage.success('派单成功');
        orderDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('派单失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useOrderFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: { content: '提交' },
});

// 验收表单
const [AcceptForm, acceptFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async (values) => {
    const loading = ElLoading.service({ text: '验收中...' });
    try {
      const res = await acceptCameraMgmt({ id: currentAcceptRow.value.id, acceptResult: values.acceptResult });
      if (res && res !== false) {
        ElMessage.success('验收通过');
        acceptDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('验收失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useAcceptFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: { content: '提交' },
});

// 详情抽屉
const cameraMgmtDetailDrawerRef = ref(null);

async function handleOpenDetail(row) {
  try {
    const detail = await getCameraMgmtDetail({ id: row.id });
    dataObj.detailObj = detail;
    cameraMgmtDetailDrawerRef.value.open();
  } catch (error) {
    console.error('获取详情失败', error);
    ElMessage.error('获取详情失败');
  }
}

// 筛选表单
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

const handleSerachShow = () => drawerApi.open();
const handleFullShow = () => screenfull.toggle();
const arrowChange = () => emit('arrow-change');

defineExpose({ handleFilterTagClick, clearFilters });
</script>

<template>
  <div class="park-lot-table-new">
    <CameraMgmtDetailDrawer ref="cameraMgmtDetailDrawerRef" :detail-obj="dataObj.detailObj" @refresh="handleRefresh" />
    <Drawer title="筛选">
      <QueryForm />
    </Drawer>
    <EditDrawer :title="isEditMode ? textObj.editText : textObj.addText">
      <EditForm />
    </EditDrawer>
    <RepairDrawer :title="textObj.repairText">
      <RepairForm />
    </RepairDrawer>
    <CheckDrawer title="设备排查">
      <CheckForm />
    </CheckDrawer>
    <OrderDrawer title="派单">
      <OrderForm />
    </OrderDrawer>
    <AcceptDrawer title="验收">
      <AcceptForm />
    </AcceptDrawer>
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
          <IconButton :content="textObj.addText" icon-name="Plus" @click="handleCreate" />
          <IconButton :content="textObj.deleteText" icon-name="Delete" color="#F56C6C" @click="handleBatchDelete" />
          <IconButton :content="textObj.restartText" icon-name="Refresh" @click="handleBatchRestart" />
          <IconButton :content="textObj.repairText" icon-name="Tools" @click="handleBatchRepair" />
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow" />
          <IconButton content="重置" icon-name="Refresh" @click="handleReset" />
          <IconButton :content="props.arrowShow ? '展开' : '收缩'" :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <!-- 钻取列 -->
      <template #deviceName="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary" style="cursor: pointer;">
          {{ row.deviceName }}
        </el-text>
      </template>
      <template #deviceModel="{ row }">
        <el-text @click="handleFilterTagClick('deviceModel', row.deviceModel)" type="primary" style="cursor: pointer;">
          {{ row.deviceModel || '-' }}
        </el-text>
      </template>
      <template #area="{ row }">
        <el-text @click="handleFilterTagClick('area', row.area)" type="primary" style="cursor: pointer;">
          {{ row.area }}
        </el-text>
      </template>
      <template #runStatus="{ row }">
        <el-tag :type="getRunStatusType(row.runStatus)" @click="handleFilterTagClick('runStatus', row.runStatus)" style="cursor: pointer">
          {{ row.runStatus }}
        </el-tag>
      </template>
      <template #repairCount="{ row }">
        <el-text @click="handleViewRepairCount(row)" type="primary" style="cursor: pointer;">
          {{ row.repairCount }}
        </el-text>
      </template>
      <template #lastRepairTime="{ row }">
        {{ formatTimestamp(row.lastRepairTime) }}
      </template>
      <template #handleUser="{ row }">
        <el-text v-if="row.handleUser" @click="handleViewUser(row)" type="primary" style="cursor: pointer;">
          {{ row.handleUser }}
        </el-text>
        <span v-else>-</span>
      </template>
      <template #creator="{ row }">
        <el-text @click="handleFilterTagClick('creator', row.creator)" type="primary" style="cursor: pointer;">
          {{ row.creator || '-' }}
        </el-text>
      </template>
      <template #createTime="{ row }">
        <el-text @click="handleFilterTagClick('createTime', getDateFromTimestamp(row.createTime))" type="primary" style="cursor: pointer;">
          {{ formatTimestamp(row.createTime) }}
        </el-text>
      </template>
      <template #updateTime="{ row }">
        {{ formatTimestamp(row.updateTime) }}
      </template>

      <!-- 操作按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)" />
          <IconButton content="编辑" icon-name="Edit" @click="handleEdit(row)" />
          <IconButton content="删除" icon-name="Delete" color="#F56C6C" @click="handleDelete(row)" />
          <IconButton content="重启" icon-name="Refresh" @click="handleRestart(row)" />
          <IconButton v-if="row.runStatus === '故障'" content="报修" icon-name="Tools" @click="handleRepair(row)" />
          <IconButton v-if="row.runStatus === '离线'" content="排查" icon-name="Search" @click="handleCheck(row)" />
          <IconButton v-if="row.runStatus === '故障'" content="派单" icon-name="Share" @click="handleOrder(row)" />
          <IconButton v-if="row.runStatus === '故障'" content="验收" icon-name="Checked" @click="handleAccept(row)" />
        </div>
      </template>
    </Grid>
  </div>
</template>
