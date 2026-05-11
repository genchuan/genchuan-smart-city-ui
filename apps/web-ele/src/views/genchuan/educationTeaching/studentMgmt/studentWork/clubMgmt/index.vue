<script setup>
import { computed, reactive, ref, watch, nextTick, onMounted } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { downloadFileFromBlobPart } from '@vben/utils';
import ClubDetailDrawer from './components/clubDetail.vue';
import {
  getClubMgmtPage,
  createClubMgmt,
  updateClubMgmt,
  auditClubMgmt,
  archiveClubMgmt,
  venueApplyClubMgmt,
  exportClubMgmt,
  getClubMgmtDetail,
  getStudentOptions,
} from '#/api/genchuan/educationTeaching/studentMgmt/studentWork/clubMgmt/data.js';
import {
  textObj,
  useFormSchema,
  getColumnsByStatus,
  useCreateFormSchema,
  useVenueApplyFormSchema,
} from '#/api/genchuan/educationTeaching/studentMgmt/studentWork/clubMgmt/form.js';

// 辅助函数：状态标签类型
const getStatusType = (status) => {
  const map = {
    '待审核': 'warning',
    '已通过': 'primary',
    '已建档': 'success',
  };
  return map[status] || 'info';
};

// 场馆申请状态标签类型
const getVenueStatusType = (status) => {
  const map = {
    '无': 'info',
    '待申请': 'warning',
    '已通过': 'success',
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
    clubName: '社团名称',
    clubType: '社团类型',
    status: '状态',
    creator: '创建人',
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

// 场馆申请抽屉
const [VenueDrawer, venueDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => venueDrawerApi.close(),
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

function handleRowCheckboxChange({records}) {
  checkedIds.value = records.map(item => item.id);
  checkedRows.value = records;
}

const searchParams = ref({});
const isEditMode = ref(false);
const currentEditId = ref(null);
const currentVenueRow = ref(null);

// 学生选项
const studentOptions = ref([]);
const loadStudentOptions = async () => {
  try {
    const res = await getStudentOptions();
    studentOptions.value = res;
  } catch (error) {
    console.error('加载学生选项失败', error);
    ElMessage.error('加载学生选项失败，请刷新重试');
  }
};

// 动态生成申请表单 schema（包含实时学生选项）
const createFormSchema = computed(() => {
  const schema = useCreateFormSchema();
  // 为学生选择框注入选项
  const studentField = schema.find(item => item.fieldName === 'studentId');
  if (studentField) {
    studentField.componentProps.options = studentOptions.value;
  }
  return schema;
});

const getTableData = async ({ page }) => {
  dataObj.loading = true;
  try {
    const params = {
      ...searchParams.value,
      pageNo: page.currentPage,
      pageSize: page.pageSize,
    };

    const res = await getClubMgmtPage(params);

    let filtered = res.list;

    // 应用标签筛选
    Object.entries(tagFilters.value).forEach(([field, filterValue]) => {
      filtered = filtered.filter((item) => {
        let itemValue;
        switch (field) {
          case 'clubName':
            itemValue = item.clubName;
            break;
          case 'clubType':
            itemValue = item.clubType;
            break;
          case 'status':
            itemValue = item.status;
            break;
          case 'creator':
            itemValue = item.creator;
            break;
          case 'createTime':
            itemValue = item.createTime
              ? getDateFromTimestamp(item.createTime)
              : '';
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

    // ✅ 关键修复点：使用前端筛选后的长度
    dataObj.total = filtered.length;
    dataObj.list = filtered;

    return dataObj;
  } catch (error) {
    console.error('获取数据失败:', error);

    dataObj.total = 0;
    dataObj.list = [];

    ElMessage.error('获取社团申请列表失败，请检查网络或联系管理员');
    return dataObj;
  } finally {
    dataObj.loading = false;
  }
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
      const data = await exportClubMgmt(searchParams.value);
      downloadFileFromBlobPart({fileName: '社团管理列表.xls', source: data});
      ElMessage.success('导出成功');
    } finally {
      loading.close();
    }
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败');
  }
}

// 批量审核
async function handleBatchAudit() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一条入团申请');
    return;
  }
  const selectedRows = checkedRows.value.filter(row => row.status === '待审核');
  if (selectedRows.length === 0) {
    ElMessage.warning('请选择状态为【待审核】的入团申请');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认审核选中的 ${selectedRows.length} 条入团申请？审核后状态将变为"已通过"。`, '批量审核确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({text: '审核中...'});
    try {
      const ids = selectedRows.map(row => row.id);
      const res = await auditClubMgmt({ids, status: '已通过'});
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

// 批量建档
async function handleBatchArchive() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一条入团申请');
    return;
  }
  const selectedRows = checkedRows.value.filter(row => row.status === '已通过');
  if (selectedRows.length === 0) {
    ElMessage.warning('请选择状态为【已通过】的入团申请');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认对选中的 ${selectedRows.length} 条入团申请进行建档？建档后状态将变为"已建档"。`, '批量建档确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({text: '建档中...'});
    try {
      const ids = selectedRows.map(row => row.id);
      const res = await archiveClubMgmt({ids});
      if (res && res !== false) {
        ElMessage.success('批量建档成功');
        handleRefresh();
      } else {
        ElMessage.error('批量建档失败');
      }
    } finally {
      loading.close();
    }
  } catch {
  }
}

// 打开申请抽屉
function handleCreate() {
  try {
    isEditMode.value = false;
    currentEditId.value = null;
    createDrawerApi.open(); // 打开抽屉，数据填充由 onOpenChange 负责
  } catch (error) {
    console.error('打开申请抽屉失败:', error);
    ElMessage.error('打开申请表单失败，请刷新页面重试');
  }
}

function handleEdit(row) {
  if (row.status !== '待审核') {
    ElMessage.warning('只有待审核状态的入团申请可以编辑');
    return;
  }
  isEditMode.value = true;
  currentEditId.value = row.id;
  createDrawerApi.open(); // 打开抽屉，数据填充由 onOpenChange 负责
}

// 单行审核
async function handleAudit(row) {
  if (row.status !== '待审核') {
    ElMessage.warning('只有待审核状态的入团申请可以审核');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认审核入团申请（学号：${row.studentId}，社团：${row.clubName}）？审核后状态将变为"已通过"。`, '审核确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({text: '审核中...'});
    try {
      const res = await auditClubMgmt({ids: [row.id], status: '已通过'});
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

// 单行建档
async function handleArchive(row) {
  if (row.status !== '已通过') {
    ElMessage.warning('只有已通过状态的入团申请可以建档');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认对入团申请（学号：${row.studentId}，社团：${row.clubName}）进行建档？建档后状态将变为"已建档"。`, '建档确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({text: '建档中...'});
    try {
      const res = await archiveClubMgmt({ids: [row.id]});
      if (res && res !== false) {
        ElMessage.success('建档成功');
        handleRefresh();
      } else {
        ElMessage.error('建档失败');
      }
    } finally {
      loading.close();
    }
  } catch {
  }
}

// 场馆申请
function handleVenueApply(row) {
  if (row.status !== '已通过' && row.status !== '已建档') {
    ElMessage.warning('只有已通过或已建档状态的申请可以申请场馆');
    return;
  }
  currentVenueRow.value = row;
  venueFormApi.resetForm();
  venueDrawerApi.open();
}

// 申请/编辑表单
const [CreateForm, createFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: isEditMode.value ? '更新中...' : '申请中...'});
    try {
      let res;
      // 确保 status 字段存在（新增时默认待审核）
      const submitData = {...values, status: values.status || '待审核'};
      if (isEditMode.value) {
        res = await updateClubMgmt({...submitData, id: currentEditId.value});
      } else {
        res = await createClubMgmt(submitData);
      }
      if (res && res !== false) {
        ElMessage.success(isEditMode.value ? '更新成功' : '申请成功');
        createDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error(isEditMode.value ? '更新失败' : '申请失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: createFormSchema, // 使用响应式计算属性，确保学生选项动态更新
  showCollapseButton: false,
  submitButtonOptions: {content: computed(() => isEditMode.value ? '保存' : '申请')},
});

// 修复的核心：在抽屉打开时重置表单并加载编辑数据
const [CreateDrawer, createDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => createDrawerApi.close(),
  async onOpenChange(isOpen) {
    if (isOpen) {
      // 每次打开前先重置表单（清空值 + 清除校验错误）
      await createFormApi.resetForm();
      // 如果是编辑模式，则填充数据
      if (isEditMode.value && currentEditId.value) {
        try {
          const detail = await getClubMgmtDetail({id: currentEditId.value});
          await createFormApi.setValues({
            clubName: detail.clubName,
            clubType: detail.clubType,
            studentId: detail.studentId,
            applyTime: detail.applyTime,
            status: detail.status,
            remark: detail.remark,
          });
        } catch (error) {
          console.error('加载详情失败', error);
          ElMessage.error('加载详情失败，请检查网络或联系管理员');
          createDrawerApi.close(); // 加载失败则关闭抽屉
        }
      } else {
        // 新增模式：设置默认状态为“待审核”
        await createFormApi.setValues({status: '待审核'});
      }
    }
  },
});

// 场馆申请表单
const [VenueForm, venueFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: '提交场馆申请中...'});
    try {
      let applyTimeStr = values.applyTime;
      if (typeof applyTimeStr === 'number') {
        const date = new Date(applyTimeStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        applyTimeStr = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      } else if (typeof applyTimeStr === 'string' && applyTimeStr.includes('T')) {
        const date = new Date(applyTimeStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        applyTimeStr = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      }

      const res = await venueApplyClubMgmt({
        id: currentVenueRow.value.id,
        venueName: values.venueName,
        applyTime: applyTimeStr,
        applyReason: values.applyReason,
      });
      if (res && res !== false) {
        ElMessage.success('场馆申请提交成功');
        venueDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('提交失败');
      }
    } catch (error) {
      console.error('场馆申请失败:', error);
      ElMessage.error(error?.message || '提交失败');
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useVenueApplyFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: {content: '提交申请'},
});

// 查看详情
const clubDetailDrawerRef = ref(null);

function handleOpenDetail(row) {
  dataObj.detailObj = row;
  clubDetailDrawerRef.value.open();
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

watch(activeName, (newVal) => {
  tagFilters.value = {};
  gridColumns.value = getColumnsByStatus(newVal);
  if (gridApi && gridApi.xGrid) gridApi.xGrid.refreshColumn();
  else gridApi.setGridOptions?.({columns: gridColumns.value});
  gridApi.reload();
});

const handleSerachShow = () => drawerApi.open();
const handleFullShow = () => screenfull.toggle();
const arrowChange = () => emit('arrow-change');

const showChart = ref(true);
const toggleChart = () => {
  showChart.value = !showChart.value;
};

defineExpose({handleFilterTagClick, clearFilters});

onMounted(() => {
  loadStudentOptions();
});
</script>

<template>
  <div class="park-lot-table-new">
    <ClubDetailDrawer ref="clubDetailDrawerRef" :detail-obj="dataObj.detailObj"
                      @refresh="handleRefresh"/>
    <Drawer title="搜索">
      <QueryForm/>
    </Drawer>
    <CreateDrawer :title="isEditMode ? '编辑入团申请' : '入团申请'">
      <CreateForm/>
    </CreateDrawer>
    <VenueDrawer title="场馆申请">
      <VenueForm/>
    </VenueDrawer>
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
          <IconButton content="审核" icon-name="Check" @click="handleBatchAudit"/>
          <IconButton content="建档" icon-name="FolderOpened" @click="handleBatchArchive"/>
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

      <template #clubName="{ row }">
        <el-text @click="handleFilterTagClick('clubName', row.clubName)" type="primary"
                 style="cursor: pointer;">{{ row.clubName }}
        </el-text>
      </template>
      <template #clubType="{ row }">
        <el-text @click="handleFilterTagClick('clubType', row.clubType)" type="primary"
                 style="cursor: pointer;">{{ row.clubType }}
        </el-text>
      </template>
      <template #studentId="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary" style="cursor: pointer;">
          {{ row.studentId }}
        </el-text>
      </template>
      <template #applyTime="{ row }">
        <el-text>{{ formatTimestamp(row.applyTime) }}</el-text>
      </template>
      <template #auditTime="{ row }">
        <el-text>{{ formatTimestamp(row.auditTime) }}</el-text>
      </template>
      <template #archiveTime="{ row }">
        <el-text>{{ formatTimestamp(row.archiveTime) }}</el-text>
      </template>
      <template #venueApplyStatus="{ row }">
        <el-tag :type="getVenueStatusType(row.venueApplyStatus)">{{ row.venueApplyStatus }}</el-tag>
      </template>
      <template #status="{ row }">
        <el-tag :type="getStatusType(row.status)"
                @click="handleFilterTagClick('status', row.status)" style="cursor: pointer;">
          {{ row.status }}
        </el-tag>
      </template>
      <template #creator="{ row }">
        <el-text @click="handleFilterTagClick('creator', row.creator)" type="primary"
                 style="cursor: pointer;">{{ row.creator || '-' }}
        </el-text>
      </template>
      <template #createTime="{ row }">
        <el-text @click="handleFilterTagClick('createTime', getDateFromTimestamp(row.createTime))"
                 type="primary" style="cursor: pointer;">{{ formatTimestamp(row.createTime) }}
        </el-text>
      </template>
      <template #updateTime="{ row }">
        <el-text>{{ formatTimestamp(row.updateTime) }}</el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)"/>
          <IconButton v-if="row.status === '待审核'" content="编辑" icon-name="Edit"
                      @click="handleEdit(row)"/>
          <IconButton v-if="row.status === '待审核'" content="审核" icon-name="Check"
                      @click="handleAudit(row)"/>
          <IconButton v-if="row.status === '已通过'" content="建档" icon-name="FolderOpened"
                      @click="handleArchive(row)"/>
          <IconButton v-if="row.status === '已通过' || row.status === '已建档'" content="场馆申请"
                      icon-name="Location" @click="handleVenueApply(row)"/>
        </div>
      </template>
    </Grid>
  </div>
</template>
