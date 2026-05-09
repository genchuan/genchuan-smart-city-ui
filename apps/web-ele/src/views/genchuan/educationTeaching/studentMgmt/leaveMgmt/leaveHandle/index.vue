<script setup>
import { computed, reactive, ref, watch, nextTick } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { downloadFileFromBlobPart } from '@vben/utils';
import LeaveDetailDrawer from './components/leaveDetail.vue';
import {
  getLeaveHandlePage,
  createLeaveHandle,
  updateLeaveHandle,
  confirmLeaveHandle,
  handleLeaveHandle,
  exportLeaveHandle,
  getLeaveHandleDetail,
} from '#/api/genchuan/educationTeaching/studentMgmt/leaveMgmt/leaveHandle/data.js';
import {
  textObj,
  useFormSchema,
  getColumns,
  useApplyFormSchema,
} from '#/api/genchuan/educationTeaching/studentMgmt/leaveMgmt/leaveHandle/form.js';

// 辅助函数：状态标签类型
const getStatusType = (status) => {
  const map = {
    '待确认': 'warning',
    '待办理': 'primary',
    '已离校': 'success',
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

// 提取日期部分（用于筛选）
const getDateFromTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(parseInt(timestamp));
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const props = defineProps({secondShow: Boolean, arrowShow: Boolean, arrowState: Boolean});
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

// ---------- 抽屉组件 ----------
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

const gridColumns = ref(getColumns());
const checkedIds = ref([]);
const checkedRows = ref([]);

function handleRowCheckboxChange({records}) {
  checkedIds.value = records.map(item => item.id);
  checkedRows.value = records;
}

const searchParams = ref({});
const isEditMode = ref(false);
const currentEditId = ref(null);
const confirmId = ref(null);      // 待确认的ID
const handleId = ref(null);       // 待办理的ID

const getTableData = async ({page}) => {
  dataObj.loading = true;
  try {
    const params = {
      ...searchParams.value,
      pageNo: page.currentPage,
      pageSize: page.pageSize,
    };
    const res = await getLeaveHandlePage(params);
    let filtered = res.list;
    // 应用标签筛选
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
    ElMessage.error('获取离校记录失败，请检查网络或联系管理员');
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
      const data = await exportLeaveHandle(searchParams.value);
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

// 申请
function handleCreate() {
  isEditMode.value = false;
  currentEditId.value = null;
  applyDrawerApi.open(); // 打开抽屉，数据填充由 onOpenChange 负责
}

function handleEdit(row) {
  isEditMode.value = true;
  currentEditId.value = row.id;
  applyDrawerApi.open(); // 打开抽屉，数据填充由 onOpenChange 负责
}

// 单行确认
async function handleConfirm(row) {
  if (row.status !== '待确认') {
    ElMessage.warning('只有待确认状态的记录可以确认');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认家长已确认学号"${row.studentId}"的离校申请？确认后状态将变为“待办理”。`, '确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({text: '确认中...'});
    try {
      const res = await confirmLeaveHandle({id: row.id, parentConfirmTime: Date.now()});
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

// 单行办理
async function handleHandle(row) {
  if (row.status !== '待办理') {
    ElMessage.warning('只有待办理状态的记录可以办理');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认办理学号"${row.studentId}"的离校手续？办理后将自动完成退宿，状态变更为“已离校”。`, '办理', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({text: '办理中...'});
    try {
      const res = await handleLeaveHandle({
        id: row.id,
        handleUser: '当前用户',
        handleTime: Date.now(),
        checkoutTime: Date.now(),
        checkoutStatus: '已退宿',
      });
      if (res && res !== false) {
        ElMessage.success('办理成功');
        handleRefresh();
      } else {
        ElMessage.error('办理失败');
      }
    } finally {
      loading.close();
    }
  } catch {
  }
}

// 申请表单
const [ApplyForm, applyFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: isEditMode.value ? '保存中...' : '申请中...'});
    try {
      let res;
      // 确保 status 字段存在（新增时默认为待确认）
      const submitData = {...values, status: values.status || '待确认'};
      if (isEditMode.value) {
        res = await updateLeaveHandle({...submitData, id: currentEditId.value});
      } else {
        res = await createLeaveHandle(submitData);
      }
      if (res && res !== false) {
        ElMessage.success(isEditMode.value ? '编辑成功' : '申请成功');
        applyDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error(isEditMode.value ? '编辑失败' : '申请失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useApplyFormSchema(isEditMode.value),
  showCollapseButton: false,
  submitButtonOptions: {content: '保存'},
});

// 修复的核心：在抽屉打开时重置表单并加载编辑数据
const [ApplyDrawer, applyDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => applyDrawerApi.close(),
  async onOpenChange(isOpen) {
    if (isOpen) {
      // 每次打开前先重置表单（清空值 + 清除校验错误）
      await applyFormApi.resetForm();
      // 如果是编辑模式，则填充数据
      if (isEditMode.value && currentEditId.value) {
        try {
          const detail = await getLeaveHandleDetail({id: currentEditId.value});
          await applyFormApi.setValues({
            studentId: detail.studentId,
            leaveTime: detail.leaveTime,
            leaveAddress: detail.leaveAddress,
            status: detail.status,
            remark: detail.remark,
          });
        } catch (error) {
          console.error('加载详情失败', error);
          ElMessage.error('加载详情失败，请检查网络或联系管理员');
          applyDrawerApi.close(); // 加载失败则关闭抽屉
        }
      } else {
        // 新增模式：设置默认状态为“待确认”
        await applyFormApi.setValues({status: '待确认'});
      }
    }
  },
});

// 详情抽屉
const leaveDetailDrawerRef = ref(null);

function handleOpenDetail(row) {
  dataObj.detailObj = row;
  leaveDetailDrawerRef.value.open();
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

const showChart = ref(true);
const toggleChart = () => {
  showChart.value = !showChart.value;
};

defineExpose({handleFilterTagClick, clearFilters});
</script>

<template>
  <div class="park-lot-table-new">
    <LeaveDetailDrawer ref="leaveDetailDrawerRef" :detail-obj="dataObj.detailObj"
                       @refresh="handleRefresh"/>
    <Drawer title="搜索">
      <QueryForm/>
    </Drawer>
    <ApplyDrawer :title="isEditMode ? textObj.editText : textObj.applyText">
      <ApplyForm/>
    </ApplyDrawer>
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
          <IconButton content="申请" icon-name="Plus" @click="handleCreate"/>
          <IconButton content="导出" icon-name="download" @click="handleExport"/>
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow"/>
          <IconButton content="重置" icon-name="Refresh" @click="handleReset"/>
          <IconButton :content="props.arrowShow ? '展开' : '收缩'"
                      :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange"/>
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow"/>
          <IconButton :content="showChart ? '隐藏图表' : '显示图表'" icon-name="PieChart"
                      @click="toggleChart"/>
        </div>
      </template>

      <!-- 钻取列 -->
      <template #studentId="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary" style="cursor: pointer;">
          {{ row.studentId }}
        </el-text>
      </template>
      <template #status="{ row }">
        <el-tag :type="getStatusType(row.status)"
                @click="handleFilterTagClick('status', row.status)" style="cursor: pointer;">
          {{ row.status }}
        </el-tag>
      </template>
      <template #creator="{ row }">
        <el-text @click="handleFilterTagClick('creator', row.creator)" type="primary"
                 style="cursor: pointer;">
          {{ row.creator || '-' }}
        </el-text>
      </template>
      <template #createTime="{ row }">
        <el-text @click="handleFilterTagClick('createTime', getDateFromTimestamp(row.createTime))"
                 type="primary" style="cursor: pointer;">
          {{ formatTimestamp(row.createTime) }}
        </el-text>
      </template>

      <!-- 时间格式化 -->
      <template #leaveTime="{ row }">
        <el-text>{{ formatTimestamp(row.leaveTime) }}</el-text>
      </template>
      <template #parentConfirmTime="{ row }">
        <el-text>{{ formatTimestamp(row.parentConfirmTime) }}</el-text>
      </template>
      <template #handleTime="{ row }">
        <el-text>{{ formatTimestamp(row.handleTime) }}</el-text>
      </template>
      <template #checkoutTime="{ row }">
        <el-text>{{ formatTimestamp(row.checkoutTime) }}</el-text>
      </template>
      <template #updateTime="{ row }">
        <el-text>{{ formatTimestamp(row.updateTime) }}</el-text>
      </template>

      <!-- 操作按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)"/>
          <IconButton v-if="row.status === '待确认'" content="编辑" icon-name="Edit"
                      @click="handleEdit(row)"/>
          <IconButton v-if="row.status === '待确认'" content="确认" icon-name="Check"
                      @click="handleConfirm(row)"/>
          <IconButton v-if="row.status === '待办理'" content="办理" icon-name="EditPen"
                      @click="handleHandle(row)"/>
        </div>
      </template>
    </Grid>
  </div>
</template>
