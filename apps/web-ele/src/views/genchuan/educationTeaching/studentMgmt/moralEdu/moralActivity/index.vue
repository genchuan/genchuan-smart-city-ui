<script setup>
import { computed, reactive, ref, watch, nextTick } from 'vue';
import { confirm, useVbenDrawer, useVbenModal } from '@vben/common-ui';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { downloadFileFromBlobPart } from '@vben/utils';
import MoralActivityDetailDrawer from './components/moralActivityDetail.vue';
import {
  getMoralActivityPage,
  createMoralActivity,
  updateMoralActivity,
  publishMoralActivity,
  joinMoralActivity,
  recordMoralActivity,
  exportMoralActivity,
  getMoralActivityDetail,
  getDeptOptions,
  getStudentOptions,
} from '#/api/genchuan/educationTeaching/studentMgmt/moralEdu/moralActivity/data.js';
import {
  textObj,
  useFormSchema,
  getColumns,
  useCreateFormSchema,
  useJoinFormSchema,
  useRecordFormSchema,
} from '#/api/genchuan/educationTeaching/studentMgmt/moralEdu/moralActivity/form.js';

// 辅助函数：状态标签类型
const getStatusType = (status) => {
  const map = {
    '未发布': 'warning',
    '进行中': 'success',
    '已结束': 'info',
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
    activityType: '活动类型',
    hostDept: '主办部门',
    status: '状态',
    creator: '创建人',
    createTime: '创建时间',
    activityName: '活动名称',
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

const [CreateDrawer, createDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => createDrawerApi.close(),
});

// 将 JoinDrawer 改为 JoinModal (模态框)
const [JoinModal, joinModalApi] = useVbenModal({
  title: textObj.joinText,
  footer: false,
  onCancel: () => joinModalApi.close(),
});

const [RecordDrawer, recordDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => recordDrawerApi.close(),
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
const joinActivityId = ref(null);
const recordActivityId = ref(null);

// 加载部门选项
const deptOptions = ref([]);
const loadDeptOptions = async () => {
  const res = await getDeptOptions();
  deptOptions.value = res;
};
loadDeptOptions();

// 加载学生选项
const studentOptions = ref([]);
const loadStudentOptions = async () => {
  const res = await getStudentOptions();
  studentOptions.value = res;
};
loadStudentOptions();

const getTableData = async ({page}) => {
  dataObj.loading = true;
  try {
    const params = {
      ...searchParams.value,
      pageNo: page.currentPage,
      pageSize: page.pageSize,
    };
    const res = await getMoralActivityPage(params);
    let filtered = res.list;
    // 应用标签筛选
    Object.entries(tagFilters.value).forEach(([field, filterValue]) => {
      filtered = filtered.filter(item => {
        let itemValue;
        switch (field) {
          case 'activityType':
            itemValue = item.activityType;
            break;
          case 'hostDept':
            itemValue = item.hostDeptName;
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
          case 'activityName':
            itemValue = item.activityName;
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
    dataObj.total = 0;
    dataObj.list = [];
    ElMessage.error('获取数据失败，请稍后重试');
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
      const data = await exportMoralActivity(searchParams.value);
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

// 批量发布
async function handleBatchPublish() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一个活动');
    return;
  }
  const unPublishRows = checkedRows.value.filter(row => row.status === '未发布');
  if (unPublishRows.length === 0) {
    ElMessage.warning('请选择状态为【未发布】的活动进行发布');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认发布选中的 ${unPublishRows.length} 个活动？发布后状态将变为“进行中”。`, '批量发布确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({text: '发布中...'});
    try {
      const ids = unPublishRows.map(row => row.id);
      const res = await publishMoralActivity(ids);
      if (res && res !== false) {
        ElMessage.success('批量发布成功');
        handleRefresh();
      } else {
        ElMessage.error('批量发布失败');
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
  createFormApi.resetForm();
  // 新增时设置默认状态为“未发布”
  createFormApi.setValues({ status: '未发布' });
  createDrawerApi.open();
}

async function handleEdit(row) {
  isEditMode.value = true;
  currentEditId.value = row.id;
  try {
    const detail = await getMoralActivityDetail({id: row.id});
    createFormApi.setValues({
      activityName: detail.activityName,
      activityType: detail.activityType,
      hostDept: detail.hostDept,
      startTime: detail.startTime,
      endTime: detail.endTime,
      status: detail.status,     // 补充状态赋值
      content: detail.content,
      remark: detail.remark,
    });
    createDrawerApi.open();
  } catch (error) {
    console.error('加载详情失败', error);
    ElMessage.error('加载详情失败');
  }
}

// 单行发布
async function handlePublish(row) {
  if (row.status !== '未发布') {
    ElMessage.warning('只有未发布的活动可以发布');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认发布活动"${row.activityName}"？发布后状态将变为“进行中”。`, '发布确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({text: '发布中...'});
    try {
      const res = await publishMoralActivity([row.id]);
      if (res && res !== false) {
        ElMessage.success('发布成功');
        handleRefresh();
      } else {
        ElMessage.error('发布失败');
      }
    } finally {
      loading.close();
    }
  } catch {
  }
}

// 报名 - 改为打开模态框
async function handleJoin(row) {
  if (row.status !== '进行中') {
    ElMessage.warning('只有进行中的活动可以报名');
    return;
  }
  joinActivityId.value = row.id;
  joinFormApi.resetForm();
  joinModalApi.open();   // 打开模态框
}

// 记录
async function handleRecord(row) {
  if (row.status !== '进行中') {
    ElMessage.warning('只有进行中的活动可以记录');
    return;
  }
  recordActivityId.value = row.id;
  recordFormApi.resetForm();
  recordDrawerApi.open();
}

// 新增/编辑表单
const [CreateForm, createFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: isEditMode.value ? '更新中...' : '发布中...'});
    try {
      let res;
      if (isEditMode.value) {
        // 编辑时传递 status（表单中已包含）
        res = await updateMoralActivity({...values, id: currentEditId.value});
      } else {
        // 新增时确保 status 字段存在（默认未发布）
        const submitData = { ...values, status: values.status || '未发布' };
        res = await createMoralActivity(submitData);
      }
      if (res && res !== false) {
        ElMessage.success(isEditMode.value ? '更新成功' : '发布成功');
        createDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error(isEditMode.value ? '更新失败' : '发布失败');
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

// 动态注入部门选项
watch(createFormApi, (api) => {
  if (api && deptOptions.value.length) {
    const schema = api.getSchema();
    const hostDeptField = schema.find(f => f.fieldName === 'hostDept');
    if (hostDeptField) {
      hostDeptField.componentProps.options = deptOptions.value;
    }
  }
}, {immediate: true});

// 报名表单
const [JoinForm, joinFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: '报名中...'});
    try {
      const res = await joinMoralActivity({id: joinActivityId.value, studentId: values.studentId});
      if (res && res !== false) {
        ElMessage.success('报名成功');
        joinModalApi.close();   // 关闭模态框
        handleRefresh();
      } else {
        ElMessage.error('报名失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useJoinFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: {content: '确认'},
});

// 动态注入学生选项
watch(joinFormApi, (api) => {
  if (api && studentOptions.value.length) {
    const schema = api.getSchema();
    const studentField = schema.find(f => f.fieldName === 'studentId');
    if (studentField) {
      studentField.componentProps.options = studentOptions.value;
    }
  }
}, {immediate: true});

// 记录表单
const [RecordForm, recordFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: '保存记录...'});
    try {
      const res = await recordMoralActivity({id: recordActivityId.value, ...values});
      if (res && res !== false) {
        ElMessage.success('记录保存成功');
        recordDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('记录保存失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useRecordFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: {content: '保存'},
});

// 查看详情
const moralActivityDetailDrawerRef = ref(null);

function handleOpenDetail(row) {
  dataObj.detailObj = row;
  moralActivityDetailDrawerRef.value.open();
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
    if (v.fieldName === 'hostDept') v.componentProps.options = deptOptions.value;
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
    <MoralActivityDetailDrawer ref="moralActivityDetailDrawerRef" :detail-obj="dataObj.detailObj"
                               @refresh="handleRefresh"/>
    <Drawer title="搜索">
      <QueryForm/>
    </Drawer>
    <CreateDrawer :title="isEditMode ? textObj.editText : textObj.addText">
      <CreateForm/>
    </CreateDrawer>
    <!-- 报名改为模态框 -->
    <JoinModal>
      <JoinForm/>
    </JoinModal>
    <RecordDrawer :title="textObj.recordText">
      <RecordForm/>
    </RecordDrawer>
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
          <IconButton content="新增" icon-name="Plus" @click="handleCreate"/>
          <IconButton content="批量发布" icon-name="Upload" @click="handleBatchPublish"/>
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
      <template #activityName="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary" style="cursor: pointer;">
          {{ row.activityName }}
        </el-text>
      </template>
      <template #activityType="{ row }">
        <el-text @click="handleFilterTagClick('activityType', row.activityType)" type="primary"
                 style="cursor: pointer;">
          {{ row.activityType }}
        </el-text>
      </template>
      <template #hostDeptName="{ row }">
        <el-text @click="handleFilterTagClick('hostDept', row.hostDeptName)" type="primary"
                 style="cursor: pointer;">
          {{ row.hostDeptName }}
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
      <template #startTime="{ row }">
        <el-text>{{ formatTimestamp(row.startTime) }}</el-text>
      </template>
      <template #endTime="{ row }">
        <el-text>{{ formatTimestamp(row.endTime) }}</el-text>
      </template>
      <template #publishTime="{ row }">
        <el-text>{{ formatTimestamp(row.publishTime) }}</el-text>
      </template>
      <template #updateTime="{ row }">
        <el-text>{{ formatTimestamp(row.updateTime) }}</el-text>
      </template>

      <!-- 操作按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)"/>
          <IconButton v-if="row.status === '未发布'" content="编辑" icon-name="Edit" @click="handleEdit(row)"/>
          <IconButton v-if="row.status === '未发布'" content="发布" icon-name="Upload"
                      @click="handlePublish(row)"/>
          <IconButton v-if="row.status === '进行中'" content="报名" icon-name="User"
                      @click="handleJoin(row)"/>
          <IconButton v-if="row.status === '进行中'" content="记录" icon-name="EditPen"
                      @click="handleRecord(row)"/>
        </div>
      </template>
    </Grid>
  </div>
</template>
