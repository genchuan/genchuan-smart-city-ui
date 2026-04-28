<script setup>
import { reactive, ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { downloadFileFromBlobPart } from '@vben/utils';
import StudyUpDetailDrawer from './components/studyUpDetail.vue';
import {
  getStudyUpPage,
  selectStudyUp,
  planStudyUp,
  recordStudyUp,
  exportStudyUp,
  getStudyUpDetail,
} from '#/api/genchuan/educationTeaching/studentMgmt/employMgmt/studyUp/data.js';
import {
  textObj,
  useFormSchema,
  getColumns,
  useSelectFormSchema,
  usePlanFormSchema,
  useRecordFormSchema,
} from '#/api/genchuan/educationTeaching/studentMgmt/employMgmt/studyUp/form.js';

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
    schoolType: '院校类型',
    schoolName: '院校名称',
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

const [SelectDrawer, selectDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => selectDrawerApi.close(),
});

const [PlanDrawer, planDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => planDrawerApi.close(),
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
const currentEditId = ref(null);
const currentSelectRow = ref(null);
const currentPlanRow = ref(null);
const currentRecordRow = ref(null);

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
    '待规划': 'warning',
    '已规划': 'success',
  };
  return map[status] || 'info';
};

const getTableData = async ({page}) => {
  dataObj.loading = true;
  try {
    const params = {
      ...searchParams.value,
      pageNo: page.currentPage,
      pageSize: page.pageSize,
    };
    const res = await getStudyUpPage(params);
    let filtered = res.list;
    Object.entries(tagFilters.value).forEach(([field, filterValue]) => {
      filtered = filtered.filter(item => {
        let itemValue;
        switch (field) {
          case 'schoolType':
            itemValue = item.schoolType;
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
    ElMessage.error('获取升学记录失败，请检查网络或联系管理员');
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
      const data = await exportStudyUp(searchParams.value);
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

// 选择（弹窗）
function handleSelect(row) {
  if (row.status !== '待规划') {
    ElMessage.warning('只有待规划状态的学生可以选择院校');
    return;
  }
  currentSelectRow.value = row;
  selectFormApi.resetForm();
  selectDrawerApi.open();
}

// 规划（弹窗）
function handlePlan(row) {
  if (row.status !== '待规划') {
    ElMessage.warning('只有待规划状态的学生可以进行规划');
    return;
  }
  currentPlanRow.value = row;
  planFormApi.resetForm();
  planDrawerApi.open();
}

// 记录（弹窗）
function handleRecord(row) {
  if (row.status !== '已规划') {
    ElMessage.warning('只有已规划状态的学生可以记录跟踪');
    return;
  }
  currentRecordRow.value = row;
  recordFormApi.resetForm();
  recordDrawerApi.open();
}

// 选择表单
const [SelectForm, selectFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: '保存中...'});
    try {
      const res = await selectStudyUp({
        id: currentSelectRow.value.id,
        ...values,
      });
      if (res && res !== false) {
        ElMessage.success('选择成功');
        selectDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('选择失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useSelectFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: {content: '确认'},
});

// 规划表单
const [PlanForm, planFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: '保存中...'});
    try {
      const res = await planStudyUp({
        id: currentPlanRow.value.id,
        planContent: values.planContent,
        planTime: Date.now(),
      });
      if (res && res !== false) {
        ElMessage.success('规划成功');
        planDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('规划失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: usePlanFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: {content: '保存'},
});

// 跟踪记录表单
const [RecordForm, recordFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: '保存中...'});
    try {
      const res = await recordStudyUp({
        id: currentRecordRow.value.id,
        recordTime: Date.now(),
        remark: values.remark,
      });
      if (res && res !== false) {
        ElMessage.success('记录成功');
        recordDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('记录失败');
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

// 详情抽屉
const studyUpDetailDrawerRef = ref(null);

function handleOpenDetail(row) {
  dataObj.detailObj = row;
  studyUpDetailDrawerRef.value.open();
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
    <StudyUpDetailDrawer ref="studyUpDetailDrawerRef" :detail-obj="dataObj.detailObj"
                         @refresh="handleRefresh"/>
    <Drawer title="搜索">
      <QueryForm/>
    </Drawer>
    <SelectDrawer title="选择目标院校">
      <SelectForm/>
    </SelectDrawer>
    <PlanDrawer title="升学规划">
      <PlanForm/>
    </PlanDrawer>
    <RecordDrawer title="跟踪记录">
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
      <template #schoolName="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary" style="cursor: pointer;">
          {{ row.schoolName || '-' }}
        </el-text>
      </template>
      <template #schoolType="{ row }">
        <el-text @click="handleFilterTagClick('schoolType', row.schoolType)" type="primary"
                 style="cursor: pointer;">
          {{ row.schoolType || '-' }}
        </el-text>
      </template>
      <template #planContent="{ row }">
        <el-text>{{
            row.planContent?.substring(0, 50) || '-'
          }}{{ row.planContent?.length > 50 ? '...' : '' }}
        </el-text>
      </template>
      <template #status="{ row }">
        <el-tag :type="getStatusType(row.status)"
                @click="handleFilterTagClick('status', row.status)" style="cursor: pointer">
          {{ row.status }}
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
      <template #planTime="{ row }">
        <el-text>{{ formatTimestamp(row.planTime) }}</el-text>
      </template>
      <template #recordTime="{ row }">
        <el-text>{{ formatTimestamp(row.recordTime) }}</el-text>
      </template>
      <template #updateTime="{ row }">
        <el-text>{{ formatTimestamp(row.updateTime) }}</el-text>
      </template>

      <!-- 操作按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)"/>
          <IconButton v-if="row.status === '待规划'" content="选择" icon-name="Select"
                      @click="handleSelect(row)"/>
          <IconButton v-if="row.status === '待规划'" content="规划" icon-name="Edit"
                      @click="handlePlan(row)"/>
          <IconButton v-if="row.status === '已规划'" content="记录" icon-name="Checked"
                      @click="handleRecord(row)"/>
        </div>
      </template>
    </Grid>
  </div>
</template>
