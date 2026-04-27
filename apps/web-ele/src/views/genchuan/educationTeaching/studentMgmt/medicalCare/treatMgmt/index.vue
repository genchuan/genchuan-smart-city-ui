<script setup>
import {computed, reactive, ref, watch, nextTick} from 'vue';
import {confirm, useVbenDrawer} from '@vben/common-ui';
import {ElLoading, ElMessage, ElMessageBox} from 'element-plus';
import screenfull from 'screenfull';
import {useVbenForm} from '#/adapter/form';
import {useVbenVxeGrid} from '#/adapter/vxe-table';
import {downloadFileFromBlobPart} from '@vben/utils';
import TreatDetailDrawer from './components/treatDetail.vue';
import {
  getTreatMgmtPage,
  appointTreatMgmt,
  auditTreatMgmt,
  registerTreatMgmt,
  updateTreatMgmt,
  feedbackTreatMgmt,
  exportTreatMgmt,
  getTreatMgmtDetail,
  getStudentOptions,
} from '#/api/genchuan/educationTeaching/studentMgmt/medicalCare/treatMgmt/data.js';
import {
  textObj,
  useFormSchema,
  getColumns,
  useAppointFormSchema,
  useCreateAppointFormSchema,
  useRegisterFormSchema,
} from '#/api/genchuan/educationTeaching/studentMgmt/medicalCare/treatMgmt/form.js';

// 辅助函数：状态标签类型
const getStatusType = (status) => {
  const map = {
    '待审核': 'warning',
    '已就诊': 'success',
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
    treatType: '就诊类型',
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

// 新增预约抽屉
const [CreateAppointDrawer, createAppointDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => createAppointDrawerApi.close(),
});

// 编辑抽屉（原预约抽屉，但仅用于编辑）
const [EditAppointDrawer, editAppointDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => editAppointDrawerApi.close(),
});

const [RegisterDrawer, registerDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => registerDrawerApi.close(),
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
const auditIds = ref([]);
const registerIds = ref([]);

// 反馈弹窗
const feedbackVisible = ref(false);
const feedbackContent = ref('');
const currentFeedbackId = ref(null);

const getTableData = async ({page}) => {
  dataObj.loading = true;
  try {
    const params = {
      ...searchParams.value,
      pageNo: page.currentPage,
      pageSize: page.pageSize,
    };
    const res = await getTreatMgmtPage(params);
    let filtered = res.list;
    // 应用标签筛选
    Object.entries(tagFilters.value).forEach(([field, filterValue]) => {
      filtered = filtered.filter(item => {
        let itemValue;
        switch (field) {
          case 'treatType':
            itemValue = item.treatType;
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
    // 分页接口已联调成功，出错时返回空数据
    dataObj.total = 0;
    dataObj.list = [];
    ElMessage.error('获取就诊记录失败，请检查网络或联系管理员');
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
      const data = await exportTreatMgmt(searchParams.value);
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

// 批量审核
async function handleBatchAudit() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一个就诊记录');
    return;
  }
  const pendingRows = checkedRows.value.filter(row => row.status === '待审核');
  if (pendingRows.length === 0) {
    ElMessage.warning('请选择状态为【待审核】的记录进行审核');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认审核选中的 ${pendingRows.length} 条就诊记录？审核后状态将变为“已就诊”。`, '批量审核确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({text: '审核中...'});
    try {
      const ids = pendingRows.map(row => row.id);
      const res = await auditTreatMgmt({ids, auditUser: '当前用户', auditTime: Date.now()});
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

// 批量登记
async function handleBatchRegister() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一个就诊记录');
    return;
  }
  const finishedRows = checkedRows.value.filter(row => row.status === '已就诊');
  if (finishedRows.length === 0) {
    ElMessage.warning('请选择已就诊的就诊记录');
    return;
  }
  registerIds.value = finishedRows.map(row => row.id);
  registerFormApi.resetForm();
  registerDrawerApi.open();
}

// 新增预约
function handleCreate() {
  createAppointFormApi.resetForm();
  // 设置默认状态为“待审核”和当前预约时间
  createAppointFormApi.setValues({status: '待审核', applyTime: Date.now()});
  createAppointDrawerApi.open();
}

// 编辑
async function handleEdit(row) {
  isEditMode.value = true;
  currentEditId.value = row.id;
  try {
    const detail = await getTreatMgmtDetail({id: row.id});
    // 如果原记录没有 registerTime，则设置一个默认值（当前时间），以满足后端要求
    const registerTime = detail.registerTime || Date.now();
    editAppointFormApi.setValues({
      studentId: detail.studentId,
      treatType: detail.treatType,
      applyTime: detail.applyTime,
      symptom: detail.symptom,
      status: detail.status,
      registerTime: registerTime,
      remark: detail.remark,
    });
    editAppointDrawerApi.open();
  } catch (error) {
    console.error('加载详情失败', error);
    ElMessage.error('加载详情失败');
  }
}

// 单行审核
async function handleAudit(row) {
  if (row.status !== '待审核') {
    ElMessage.warning('只有待审核状态的记录可以审核');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认审核学号"${row.studentId}"的就诊申请？审核后状态将变为“已就诊”。`, '审核确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({text: '审核中...'});
    try {
      const res = await auditTreatMgmt({
        ids: [row.id],
        auditUser: '当前用户',
        auditTime: Date.now()
      });
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

// 单行反馈
async function handleFeedback(row) {
  if (row.status !== '已就诊') {
    ElMessage.warning('只有已就诊状态的记录可以反馈');
    return;
  }
  currentFeedbackId.value = row.id;
  feedbackContent.value = '';
  feedbackVisible.value = true;
}

async function submitFeedback() {
  if (!feedbackContent.value.trim()) {
    ElMessage.warning('请填写反馈内容');
    return;
  }
  const loading = ElLoading.service({text: '提交反馈...'});
  try {
    const res = await feedbackTreatMgmt({
      id: currentFeedbackId.value,
      feedbackContent: feedbackContent.value,
      feedbackTime: Date.now(),
    });
    if (res && res !== false) {
      ElMessage.success('反馈成功');
      feedbackVisible.value = false;
      handleRefresh();
    } else {
      ElMessage.error('反馈失败');
    }
  } finally {
    loading.close();
  }
}

// ----- 新增预约表单 -----
const [CreateAppointForm, createAppointFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: '预约中...'});
    try {
      // 新增时确保 status 字段存在（默认待审核）
      const submitData = {...values, status: values.status || '待审核'};
      const res = await appointTreatMgmt(submitData);
      if (res && res !== false) {
        ElMessage.success('预约成功');
        createAppointDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('预约失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useCreateAppointFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: {content: '保存'},
});

// ----- 编辑表单（含 registerTime）-----
const [EditAppointForm, editAppointFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: '保存中...'});
    try {
      const res = await updateTreatMgmt({...values, id: currentEditId.value});
      if (res && res !== false) {
        ElMessage.success('编辑成功');
        editAppointDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('编辑失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useAppointFormSchema(true), // 编辑模式，含 registerTime
  showCollapseButton: false,
  submitButtonOptions: {content: '保存'},
});

// ----- 登记表单 -----
const [RegisterForm, registerFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: '登记中...'});
    try {
      const res = await registerTreatMgmt({ids: registerIds.value, ...values});
      if (res && res !== false) {
        ElMessage.success('登记成功');
        registerDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('登记失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useRegisterFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: {content: '保存'},
});

// 动态注入学生选项
const studentOptions = ref([]);
const loadStudentOptions = async () => {
  const res = await getStudentOptions();
  studentOptions.value = res;
};
loadStudentOptions();

// 为新增预约表单注入学生选项
watch(createAppointFormApi, (api) => {
  if (api && studentOptions.value.length) {
    const schema = api.getSchema();
    const studentField = schema.find(f => f.fieldName === 'studentId');
    if (studentField) {
      studentField.componentProps.options = studentOptions.value;
    }
  }
}, {immediate: true});

// 为编辑表单注入学生选项
watch(editAppointFormApi, (api) => {
  if (api && studentOptions.value.length) {
    const schema = api.getSchema();
    const studentField = schema.find(f => f.fieldName === 'studentId');
    if (studentField) {
      studentField.componentProps.options = studentOptions.value;
    }
  }
}, {immediate: true});

// 详情抽屉
const treatDetailDrawerRef = ref(null);

function handleOpenDetail(row) {
  dataObj.detailObj = row;
  treatDetailDrawerRef.value.open();
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
    <TreatDetailDrawer ref="treatDetailDrawerRef" :detail-obj="dataObj.detailObj"
                       @refresh="handleRefresh"/>
    <Drawer title="搜索">
      <QueryForm/>
    </Drawer>
    <!-- 新增预约抽屉 -->
    <CreateAppointDrawer title="预约">
      <CreateAppointForm/>
    </CreateAppointDrawer>
    <!-- 编辑抽屉 -->
    <EditAppointDrawer title="编辑">
      <EditAppointForm/>
    </EditAppointDrawer>
    <RegisterDrawer title="登记">
      <RegisterForm/>
    </RegisterDrawer>

    <!-- 反馈弹窗 -->
    <el-dialog v-model="feedbackVisible" title="家长反馈" width="400px">
      <el-form label-width="80px">
        <el-form-item label="反馈内容">
          <el-input
            v-model="feedbackContent"
            type="textarea"
            rows="4"
            placeholder="请输入反馈内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="feedbackVisible = false">取消</el-button>
        <el-button type="primary" @click="submitFeedback">确认</el-button>
      </template>
    </el-dialog>

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
          <IconButton content="预约" icon-name="Plus" @click="handleCreate"/>
          <IconButton content="审核" icon-name="Check" @click="handleBatchAudit"/>
          <IconButton content="登记" icon-name="EditPen" @click="handleBatchRegister"/>
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
      <template #treatType="{ row }">
        <el-text @click="handleFilterTagClick('treatType', row.treatType)" type="primary"
                 style="cursor: pointer;">
          {{ row.treatType }}
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
      <template #registerTime="{ row }">
        <el-text>{{ formatTimestamp(row.registerTime) }}</el-text>
      </template>
      <template #applyTime="{ row }">
        <el-text>{{ formatTimestamp(row.applyTime) }}</el-text>
      </template>
      <template #auditTime="{ row }">
        <el-text>{{ formatTimestamp(row.auditTime) }}</el-text>
      </template>
      <template #feedbackTime="{ row }">
        <el-text>{{ formatTimestamp(row.feedbackTime) }}</el-text>
      </template>
      <template #updateTime="{ row }">
        <el-text>{{ formatTimestamp(row.updateTime) }}</el-text>
      </template>

      <!-- 操作按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)"/>
          <IconButton content="编辑" icon-name="Edit"
                      @click="handleEdit(row)"/>
          <IconButton v-if="row.status === '待审核'" content="审核" icon-name="Check"
                      @click="handleAudit(row)"/>
          <IconButton v-if="row.status === '已就诊'" content="反馈" icon-name="ChatLineSquare"
                      @click="handleFeedback(row)"/>
        </div>
      </template>
    </Grid>
  </div>
</template>
