<script setup>
import {computed, reactive, ref, watch, nextTick} from 'vue';
import {confirm, useVbenDrawer} from '@vben/common-ui';
import {ElLoading, ElMessage, ElMessageBox} from 'element-plus';
import screenfull from 'screenfull';
import {useVbenForm} from '#/adapter/form';
import {useVbenVxeGrid} from '#/adapter/vxe-table';
import {downloadFileFromBlobPart} from '@vben/utils';
import ViolateDetailDrawer from './components/violateDetail.vue';
import {
  getViolateMgmtPage,
  createViolateMgmt,
  updateViolateMgmt,
  auditViolateMgmt,
  pushViolateMgmt,
  warnViolateMgmt,
  exportViolateMgmt,
  getViolateMgmtDetail,
} from '#/api/genchuan/educationTeaching/studentMgmt/studentWork/violateMgmt/data.js';
import {
  textObj,
  useFormSchema,
  getColumnsByStatus,
  useCreateFormSchema,
} from '#/api/genchuan/educationTeaching/studentMgmt/studentWork/violateMgmt/form.js';

// 辅助函数：状态标签类型
const getStatusType = (status) => {
  const map = {
    '待审批': 'warning',
    '已执行': 'success',
    '已预警': 'danger',
  };
  return map[status] || 'info';
};

const getStatusText = (status) => {
  return status || '-';
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
    className: '班级',
    violateType: '违纪类型',
    punishType: '处分类型',
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

const getTableData = async ({page}) => {
  dataObj.loading = true;
  try {
    const params = {
      ...searchParams.value,
      pageNo: page.currentPage,
      pageSize: page.pageSize,
    };
    const res = await getViolateMgmtPage(params);
    let filtered = res.list;
    // 应用标签筛选
    Object.entries(tagFilters.value).forEach(([field, filterValue]) => {
      filtered = filtered.filter(item => {
        let itemValue;
        switch (field) {
          case 'violateType':
            itemValue = item.violateType;
            break;
          case 'punishType':
            itemValue = item.punishType;
            break;
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
    dataObj.total = res.total;
    dataObj.list = filtered;
  } catch (error) {
    console.error('获取数据失败:', error);
    // 分页接口已联调成功，出错时返回空数据
    dataObj.total = 0;
    dataObj.list = [];
    ElMessage.error('获取违纪列表失败，请检查网络或联系管理员');
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
      const data = await exportViolateMgmt(searchParams.value);
      downloadFileFromBlobPart({fileName: '违纪管理列表.xls', source: data});
      ElMessage.success('导出成功');
    } finally {
      loading.close();
    }
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败');
  }
}

// 批量审批
async function handleBatchAudit() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一条违纪记录');
    return;
  }
  const selectedRows = checkedRows.value.filter(row => row.status === '待审批');
  if (selectedRows.length === 0) {
    ElMessage.warning('请选择状态为【待审批】的违纪记录');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认审批选中的 ${selectedRows.length} 条违纪记录？审批后状态将变为"已执行"。`, '批量审批确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({text: '审批中...'});
    try {
      const ids = selectedRows.map(row => row.id);
      const res = await auditViolateMgmt({ids});
      if (res && res !== false) {
        ElMessage.success('批量审批成功');
        handleRefresh();
      } else {
        ElMessage.error('批量审批失败');
      }
    } finally {
      loading.close();
    }
  } catch {
  }
}

function handleCreate() {
  isEditMode.value = false;
  currentEditId.value = null;
  createDrawerApi.open(); // 打开抽屉，数据填充由 onOpenChange 负责
}

function handleEdit(row) {
  isEditMode.value = true;
  currentEditId.value = row.id;
  createDrawerApi.open(); // 打开抽屉，数据填充由 onOpenChange 负责
}

// 单行审批
async function handleAudit(row) {
  if (row.status !== '待审批') {
    ElMessage.warning('只有待审批状态的违纪记录可以审批');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认审批违纪记录（学号：${row.studentId}，类型：${row.violateType}）？审批后状态将变为"已执行"。`, '审批确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({text: '审批中...'});
    try {
      const res = await auditViolateMgmt({ids: [row.id]});
      if (res && res !== false) {
        ElMessage.success('审批成功');
        handleRefresh();
      } else {
        ElMessage.error('审批失败');
      }
    } finally {
      loading.close();
    }
  } catch {
  }
}

// 推送
async function handlePush(row) {
  if (row.status !== '已执行') {
    ElMessage.warning('只有已执行状态的违纪记录可以推送');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认推送违纪记录（学号：${row.studentId}，类型：${row.violateType}）给家长？`, '推送确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({text: '推送中...'});
    try {
      const res = await pushViolateMgmt({id: row.id});
      if (res && res !== false) {
        ElMessage.success('推送成功');
        handleRefresh();
      } else {
        ElMessage.error('推送失败');
      }
    } finally {
      loading.close();
    }
  } catch {
  }
}

// 预警
async function handleWarn(row) {
  if (row.status !== '已执行') {
    ElMessage.warning('只有已执行状态的违纪记录可以触发预警');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认对违纪记录（学号：${row.studentId}，类型：${row.violateType}）触发预警？预警后状态将变为"已预警"。`, '预警确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({text: '预警中...'});
    try {
      const res = await warnViolateMgmt({id: row.id});
      if (res && res !== false) {
        ElMessage.success('预警成功');
        handleRefresh();
      } else {
        ElMessage.error('预警失败');
      }
    } finally {
      loading.close();
    }
  } catch {
  }
}

// 新增/编辑表单
const [CreateForm, createFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: isEditMode.value ? '更新中...' : '登记中...'});
    try {
      let res;
      if (isEditMode.value) {
        res = await updateViolateMgmt({...values, id: currentEditId.value});
      } else {
        const submitData = {...values, status: values.status || '待审批'};
        res = await createViolateMgmt(submitData);
      }
      if (res && res !== false) {
        ElMessage.success(isEditMode.value ? '更新成功' : '登记成功');
        createDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error(isEditMode.value ? '更新失败' : '登记失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useCreateFormSchema(isEditMode.value),
  showCollapseButton: false,
  submitButtonOptions: {content: '保存'},
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
          const detail = await getViolateMgmtDetail({id: currentEditId.value});
          await createFormApi.setValues({
            studentId: detail.studentId,
            violateType: detail.violateType,
            punishType: detail.punishType,
            violateTime: detail.violateTime,
            violateReason: detail.violateReason,
            status: detail.status,
            remark: detail.remark,
          });
        } catch (error) {
          console.error('加载详情失败', error);
          ElMessage.error('加载详情失败，请检查网络或联系管理员');
          createDrawerApi.close(); // 加载失败则关闭抽屉
        }
      } else {
        // 新增模式：设置默认状态为“待审批”
        await createFormApi.setValues({status: '待审批'});
      }
    }
  },
});

// 查看详情
const violateDetailDrawerRef = ref(null);

function handleOpenDetail(row) {
  dataObj.detailObj = row;
  violateDetailDrawerRef.value.open();
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
</script>

<template>
  <div class="park-lot-table-new">
    <ViolateDetailDrawer ref="violateDetailDrawerRef" :detail-obj="dataObj.detailObj"
                         @refresh="handleRefresh"/>
    <Drawer title="搜索">
      <QueryForm/>
    </Drawer>
    <CreateDrawer :title="isEditMode ? '编辑违纪记录' : '登记违纪'">
      <CreateForm/>
    </CreateDrawer>
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
          <IconButton content="登记" icon-name="Plus" @click="handleCreate"/>
          <IconButton content="审批" icon-name="Check" @click="handleBatchAudit"/>
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

      <template #studentId="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary" style="cursor: pointer;">{{
            row.studentId
          }}
        </el-text>
      </template>
      <template #violateType="{ row }">
        <el-text @click="handleFilterTagClick('violateType', row.violateType)" type="primary"
                 style="cursor: pointer;">{{ row.violateType }}
        </el-text>
      </template>
      <template #punishType="{ row }">
        <el-text @click="handleFilterTagClick('punishType', row.punishType)" type="primary"
                 style="cursor: pointer;">{{ row.punishType }}
        </el-text>
      </template>
      <template #violateTime="{ row }">
        <el-text>{{ formatTimestamp(row.violateTime) }}</el-text>
      </template>
      <template #auditTime="{ row }">
        <el-text>{{ formatTimestamp(row.auditTime) }}</el-text>
      </template>
      <template #pushTime="{ row }">
        <el-text>{{ formatTimestamp(row.pushTime) }}</el-text>
      </template>
      <template #warnTime="{ row }">
        <el-text>{{ formatTimestamp(row.warnTime) }}</el-text>
      </template>
      <template #status="{ row }">
        <el-tag :type="getStatusType(row.status)"
                @click="handleFilterTagClick('status', row.status)" style="cursor: pointer;">
          {{ getStatusText(row.status) }}
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
          <IconButton content="编辑" icon-name="Edit" @click="handleEdit(row)"/>
          <IconButton v-if="row.status === '待审批'" content="审批" icon-name="Check"
                      @click="handleAudit(row)"/>
          <IconButton v-if="row.status === '已执行'" content="推送"
                      icon-name="Promotion" @click="handlePush(row)"/>
          <IconButton v-if="row.status === '已执行'" content="预警"
                      icon-name="Warning" @click="handleWarn(row)"/>
        </div>
      </template>
    </Grid>
  </div>
</template>
