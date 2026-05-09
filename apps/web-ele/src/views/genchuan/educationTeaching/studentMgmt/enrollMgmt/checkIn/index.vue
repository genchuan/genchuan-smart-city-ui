<script setup>
import {reactive, ref} from 'vue';
import {useVbenDrawer} from '@vben/common-ui';
import {ElLoading, ElMessage, ElMessageBox} from 'element-plus';
import screenfull from 'screenfull';
import {useVbenForm} from '#/adapter/form';
import {useVbenVxeGrid} from '#/adapter/vxe-table';
import {downloadFileFromBlobPart} from '@vben/utils';
import CheckInDetailDrawer from './components/checkInDetail.vue';
import {
  // getMockList 已删除，不再导入
  getCheckInPage,
  supplyCheckIn,
  confirmCheckIn,
  auditCheckIn,
  exportCheckIn,
  getCheckInDetail,
} from '#/api/genchuan/educationTeaching/studentMgmt/enrollMgmt/checkIn/data.js';
import {
  textObj,
  useFormSchema,
  getColumns,
  useSupplyFormSchema,
} from '#/api/genchuan/educationTeaching/studentMgmt/enrollMgmt/checkIn/form.js';

const props = defineProps({secondShow: Boolean, arrowShow: Boolean, arrowState: Boolean});
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
    status: '状态',
    creator: '创建人',
    createTime: '创建时间',
    studentId: '学号',
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

const [SupplyDrawer, supplyDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => supplyDrawerApi.close(),
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

function handleRowCheckboxChange({records}) {
  checkedIds.value = records.map(item => item.id);
  checkedRows.value = records;
}

const searchParams = ref({});
const currentEditId = ref(null);
const currentStudentId = ref(null); // 存储当前补充的学生ID

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

const getDateFromTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(parseInt(timestamp));
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getStatusType = (status) => {
  const map = {
    '待确认': 'warning',
    '待审核': 'info',
    '已报到': 'success',
  };
  return map[status] || 'info';
};

const getAccountStatusType = (accountStatus) => {
  const map = {
    '未创建': 'danger',
    '已创建': 'success',
  };
  return map[accountStatus] || 'info';
};

const getTableData = async ({page}) => {
  dataObj.loading = true;
  try {
    const params = {
      ...searchParams.value,
      pageNo: page.currentPage,
      pageSize: page.pageSize,
    };
    const res = await getCheckInPage(params);
    let filtered = res.list;
    Object.entries(tagFilters.value).forEach(([field, filterValue]) => {
      filtered = filtered.filter(item => {
        let itemValue;
        switch (field) {
          case 'status':
            itemValue = item.status;
            break;
          case 'creator':
            itemValue = item.creator;
            break;
          case 'createTime':
            const createDate = item.createTime ? getDateFromTimestamp(item.createTime) : '';
            itemValue = createDate;
            break;
          case 'studentId':
            itemValue = item.studentId;
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
    // 分页接口已联调成功，出错时返回空数据并提示用户
    dataObj.total = 0;
    dataObj.list = [];
    ElMessage.error('获取报到记录失败，请检查网络或联系管理员');
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
    const loading = ElLoading.service({text: '正在导出...'});
    try {
      const data = await exportCheckIn(searchParams.value);
      downloadFileFromBlobPart({fileName: `${textObj.excelName}.xls`, source: data});
      ElMessage.success('导出成功');
    } finally {
      loading.close();
    }
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败');
  }
}

// 批量确认
async function handleBatchConfirm() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一个报到记录');
    return;
  }
  const confirmRows = checkedRows.value.filter(row => row.status === '待确认');
  if (confirmRows.length === 0) {
    ElMessage.warning('请选择状态为【待确认】的记录进行确认');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认对选中的 ${confirmRows.length} 条记录执行报到确认？确认后状态将变为“待审核”。`, '批量确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({text: '确认中...'});
    try {
      const ids = confirmRows.map(row => row.id);
      const res = await confirmCheckIn({ids});
      if (res && res !== false) {
        ElMessage.success('批量确认成功');
        handleRefresh();
      } else {
        ElMessage.error('批量确认失败');
      }
    } finally {
      loading.close();
    }
  } catch {
  }
}

// 批量审核
async function handleBatchAudit() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一个报到记录');
    return;
  }
  const auditRows = checkedRows.value.filter(row => row.status === '待审核');
  if (auditRows.length === 0) {
    ElMessage.warning('请选择状态为【待审核】的记录进行审核');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认对选中的 ${auditRows.length} 条记录执行审核？审核后将自动创建系统账号，状态变为“已报到”。`, '批量审核', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({text: '审核中...'});
    try {
      const ids = auditRows.map(row => row.id);
      const res = await auditCheckIn({ids});
      if (res && res !== false) {
        ElMessage.success('批量审核成功');
        handleRefresh();
      } else {
        ElMessage.error('批量审核失败');
      }
    } finally {
      loading.close();
    }
  } catch {
  }
}

// 补充（编辑）
async function handleSupply(row) {
  if (row.status !== '待确认') {
    ElMessage.warning('只有待确认状态的记录可以补充信息');
    return;
  }
  currentEditId.value = row.id;
  currentStudentId.value = row.studentId;   // 保存 studentId
  try {
    const detail = await getCheckInDetail({id: row.id});
    supplyFormApi.setValues({
      examScore: detail.examScore,
      supplyInfo: detail.supplyInfo,
    });
    supplyDrawerApi.open();
  } catch (error) {
    console.error('加载详情失败', error);
    ElMessage.error('加载详情失败');
  }
}

// 单行确认
async function handleConfirm(row) {
  if (row.status !== '待确认') {
    ElMessage.warning('只有待确认状态的记录可以确认');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认学号"${row.studentId}"的报到信息？确认后状态将变为“待审核”。`, '确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({text: '确认中...'});
    try {
      const res = await confirmCheckIn({ids: [row.id]});
      if (res && res !== false) {
        ElMessage.success('确认成功');
        handleRefresh();
      } else {
        ElMessage.error('确认失败');
      }
    } finally {
      loading.close();
    }
  } catch {
  }
}

// 单行审核
async function handleAudit(row) {
  if (row.status !== '待审核') {
    ElMessage.warning('只有待审核状态的记录可以审核');
    return;
  }
  try {
    await ElMessageBox.confirm(`审核学号"${row.studentId}"的报到信息？审核后将自动创建系统账号，状态变为“已报到”。`, '审核', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({text: '审核中...'});
    try {
      const res = await auditCheckIn({ids: [row.id]});
      if (res && res !== false) {
        ElMessage.success('审核成功');
        handleRefresh();
      } else {
        ElMessage.error('审核失败');
      }
    } finally {
      loading.close();
    }
  } catch {
  }
}

// 补充表单 - 适配后端接口参数
const [SupplyForm, supplyFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: '保存中...'});
    try {
      // 构造后端要求的参数结构
      const requestData = {
        ids: [currentEditId.value],               // 必填，数组
        studentId: currentStudentId.value,        // 必填，整数
        examScore: values.examScore,
        supplyInfo: values.supplyInfo,
      };
      // 清理值为 undefined 或 null 的字段（可选）
      Object.keys(requestData).forEach(key => {
        if (requestData[key] === undefined || requestData[key] === null) {
          delete requestData[key];
        }
      });
      const res = await supplyCheckIn(requestData);
      if (res && res !== false) {
        ElMessage.success('补充成功');
        supplyDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('补充失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useSupplyFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: {content: '保存'},
});

// 详情抽屉
const checkInDetailDrawerRef = ref(null);

function handleOpenDetail(row) {
  dataObj.detailObj = row;
  checkInDetailDrawerRef.value.open();
}

const [QueryForm] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: (values) => {
    searchParams.value = {...values};
    drawerApi.close();
    gridApi.reload();
  },
  layout: 'horizontal',
  schema: useFormSchema().map(v => {
    delete v.rules;
    return v;
  }),
  showCollapseButton: true,
  submitButtonOptions: {content: '查询'},
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: gridColumns.value,
    keepSource: true,
    proxyConfig: {ajax: {query: getTableData}},
    rowConfig: {keyField: 'id', isHover: true},
    pagerConfig: dataObj,
    toolbarConfig: {refresh: true, search: true},
    showOverflow: true,
  },
  gridEvents: {checkboxAll: handleRowCheckboxChange, checkboxChange: handleRowCheckboxChange},
  showSearchForm: false,
});

const handleSerachShow = () => drawerApi.open();
const handleFullShow = () => screenfull.toggle();
const arrowChange = () => emit('arrow-change');

defineExpose({handleFilterTagClick, clearFilters});
</script>

<template>
  <div class="park-lot-table-new">
    <CheckInDetailDrawer ref="checkInDetailDrawerRef" :detail-obj="dataObj.detailObj"
                         @refresh="handleRefresh"/>
    <Drawer title="搜索">
      <QueryForm/>
    </Drawer>
    <SupplyDrawer title="补充信息">
      <SupplyForm/>
    </SupplyDrawer>
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
          <IconButton :content="textObj.confirmText" icon-name="Checked"
                      @click="handleBatchConfirm"/>
          <IconButton :content="textObj.auditText" icon-name="Check" @click="handleBatchAudit"/>
          <IconButton content="导出" icon-name="download" @click="handleExport"/>
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow"/>
          <IconButton content="重置" icon-name="Refresh" @click="handleReset"/>
          <IconButton :content="props.arrowShow ? '展开' : '收缩'"
                      :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange"/>
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow"/>
        </div>
      </template>

      <!-- 钻取列 -->
      <template #studentId="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary" style="cursor: pointer;">
          {{ row.studentId }}
        </el-text>
      </template>
      <template #supplyInfo="{ row }">
        <el-text>{{ row.supplyInfo || '-' }}</el-text>
      </template>
      <template #status="{ row }">
        <el-tag :type="getStatusType(row.status)"
                @click="handleFilterTagClick('status', row.status)" style="cursor: pointer">
          {{ row.status }}
        </el-tag>
      </template>
      <template #accountStatus="{ row }">
        <el-tag :type="getAccountStatusType(row.accountStatus)">
          {{ row.accountStatus || '-' }}
        </el-tag>
      </template>
      <template #creator="{ row }">
        <el-text @click="handleFilterTagClick('creator', row.creator)" type="primary"
                 style="cursor: pointer">
          {{ row.creator || '-' }}
        </el-text>
      </template>
      <template #createTime="{ row }">
        <el-text @click="handleFilterTagClick('createTime', getDateFromTimestamp(row.createTime))"
                 type="primary" style="cursor: pointer">
          {{ formatTimestamp(row.createTime) }}
        </el-text>
      </template>

      <!-- 时间格式化 -->
      <template #confirmTime="{ row }">
        <el-text>{{ formatTimestamp(row.confirmTime) }}</el-text>
      </template>
      <template #auditTime="{ row }">
        <el-text>{{ formatTimestamp(row.auditTime) }}</el-text>
      </template>
      <template #accountCreateTime="{ row }">
        <el-text>{{ formatTimestamp(row.accountCreateTime) }}</el-text>
      </template>
      <template #updateTime="{ row }">
        <el-text>{{ formatTimestamp(row.updateTime) }}</el-text>
      </template>

      <!-- 操作按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)"/>
          <IconButton v-if="row.status === '待确认'" content="补充" icon-name="Edit"
                      @click="handleSupply(row)"/>
          <IconButton v-if="row.status === '待确认'" content="确认" icon-name="Checked"
                      @click="handleConfirm(row)"/>
          <IconButton v-if="row.status === '待审核'" content="审核" icon-name="Check"
                      @click="handleAudit(row)"/>
        </div>
      </template>
    </Grid>
  </div>
</template>
