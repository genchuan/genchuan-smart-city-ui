<script setup>
import {computed, reactive, ref, watch, nextTick, onMounted} from 'vue';
import {confirm, useVbenDrawer} from '@vben/common-ui';
import {ElLoading, ElMessage, ElMessageBox} from 'element-plus';
import screenfull from 'screenfull';
import {useVbenForm} from '#/adapter/form';
import {useVbenVxeGrid} from '#/adapter/vxe-table';
import {downloadFileFromBlobPart} from '@vben/utils';
import BehaviorDetailDrawer from './components/behaviorDetail.vue';
import {
  getBehaviorMgmtPage,
  createBehaviorMgmt,
  updateBehaviorMgmt,
  auditBehaviorMgmt,
  cancelBehaviorMgmt,
  exportBehaviorMgmt,
  getBehaviorMgmtDetail,
  getStudentOptions,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/studentWork/behaviorMgmt/data.js';
import {
  textObj,
  useFormSchema,
  getColumnsByStatus,
  useCreateFormSchema,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/studentWork/behaviorMgmt/form.js';

// 辅助函数：状态标签类型
const getStatusType = (status) => {
  const map = {
    '待审批': 'warning',
    '已通过': 'success',
    '已驳回': 'danger',
  };
  return map[status] || 'info';
};

// 考勤同步状态标签类型
const getSyncType = (sync) => {
  const map = {
    '未同步': 'warning',
    '已同步': 'success',
  };
  return map[sync] || 'info';
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
    leaveType: '请假类型',
    status: '状态',
    attendanceSync: '考勤同步状态',
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

const getTableData = async ({ page }) => {
  dataObj.loading = true;
  try {
    const params = {
      ...searchParams.value,
      pageNo: page.currentPage,
      pageSize: page.pageSize,
    };

    const res = await getBehaviorMgmtPage(params);

    let filtered = res.list;

    // 应用标签筛选（仅对当前页数据筛选）
    Object.entries(tagFilters.value).forEach(([field, filterValue]) => {
      filtered = filtered.filter((item) => {
        let itemValue;
        switch (field) {
          case 'leaveType':
            itemValue = item.leaveType;
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

    ElMessage.error('获取请假列表失败，请检查网络或联系管理员');
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
      const data = await exportBehaviorMgmt(searchParams.value);
      downloadFileFromBlobPart({fileName: '行为管理列表.xls', source: data});
      ElMessage.success('导出成功');
    } finally {
      loading.close();
    }
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败');
  }
}

// ---------- 审批弹窗相关 ----------
const auditDialogVisible = ref(false);
const currentAuditRows = ref([]);
const auditStatus = ref('');
const auditRemark = ref('');

function handleBatchAudit() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一条请假记录');
    return;
  }
  const selectedRows = checkedRows.value.filter(row => row.status === '待审批');
  if (selectedRows.length === 0) {
    ElMessage.warning('请选择状态为【待审批】的请假记录');
    return;
  }
  currentAuditRows.value = selectedRows;
  auditStatus.value = '';
  auditRemark.value = '';
  auditDialogVisible.value = true;
}

function handleAudit(row) {
  if (row.status !== '待审批') {
    ElMessage.warning('只有待审批状态的请假记录可以审批');
    return;
  }
  currentAuditRows.value = [row];
  auditStatus.value = '';
  auditRemark.value = '';
  auditDialogVisible.value = true;
}

async function confirmAudit() {
  if (!auditStatus.value) {
    ElMessage.warning('请选择审批结果');
    return;
  }
  const loading = ElLoading.service({text: '审批中...'});
  try {
    const ids = currentAuditRows.value.map(row => row.id);
    // 注意：接口字段名为 remark，不是 auditRemark
    const res = await auditBehaviorMgmt({
      ids,
      status: auditStatus.value,
      remark: auditRemark.value || '',   // 已修正
    });
    if (res && res !== false) {
      ElMessage.success('审批成功');
      auditDialogVisible.value = false;
      handleRefresh();
    } else {
      ElMessage.error('审批失败');
    }
  } catch (error) {
    console.error('审批失败', error);
    ElMessage.error('审批失败');
  } finally {
    loading.close();
  }
}

async function handleCancel(row) {
  if (row.status !== '已通过') {
    ElMessage.warning('只有已通过状态的请假记录可以撤销');
    return;
  }
  try {
    // 使用 prompt 但允许不填写（非必填）
    const {value: cancelReason} = await ElMessageBox.prompt('请输入撤销原因（可选）', '撤销确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      inputPlaceholder: '可不填',
      // 不设置 inputValidator，允许空值
    });
    const loading = ElLoading.service({text: '撤销中...'});
    try {
      // 如果用户未输入，value 为 ''，传空字符串即可
      const res = await cancelBehaviorMgmt({id: row.id, cancelReason: cancelReason || ''});
      if (res && res !== false) {
        ElMessage.success('撤销成功');
        handleRefresh();
      } else {
        ElMessage.error('撤销失败');
      }
    } finally {
      loading.close();
    }
  } catch (error) {
    // 用户点击取消时不做处理
    if (error !== 'cancel') {
      console.error('撤销失败', error);
    }
  }
}

// ---------- 申请/编辑表单 ----------
const [CreateForm, createFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    if (values.startTime && values.endTime && values.startTime >= values.endTime) {
      ElMessage.error('结束时间必须大于开始时间');
      return;
    }
    const loading = ElLoading.service({text: isEditMode.value ? '更新中...' : '申请中...'});
    try {
      let res;
      if (isEditMode.value) {
        // 编辑时传递 status（表单中已包含）
        res = await updateBehaviorMgmt({...values, id: currentEditId.value});
      } else {
        // 新增时确保 status 字段存在（默认待审批）
        const submitData = {...values, status: values.status || '待审批'};
        res = await createBehaviorMgmt(submitData);
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
  schema: useCreateFormSchema(),
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
          const detail = await getBehaviorMgmtDetail({id: currentEditId.value});
          await createFormApi.setValues({
            studentId: detail.studentId,
            leaveType: detail.leaveType,
            startTime: detail.startTime,
            endTime: detail.endTime,
            leaveReason: detail.leaveReason,
            auditLevel: detail.auditLevel,
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

// ---------- 加载学生选项 ----------
const loadStudentOptions = async () => {
  try {
    const res = await getStudentOptions();
    // 兼容返回格式：可能是数组或 { data: [...] }
    let options = Array.isArray(res) ? res : (res.data || []);
    // 使用 updateSchema 更新 studentId 字段的 options
    createFormApi.updateSchema([
      {fieldName: 'studentId', componentProps: {options}}
    ]);
    console.log('学生选项加载成功', options);
  } catch (error) {
    console.error('加载学生选项失败', error);
    ElMessage.error('加载学生列表失败，请刷新重试');
  }
};

// ---------- 操作函数 ----------
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

// 查看详情
const behaviorDetailDrawerRef = ref(null);

function handleOpenDetail(row) {
  dataObj.detailObj = row;
  behaviorDetailDrawerRef.value.open();
}

// ---------- 搜索表单 ----------
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

// ---------- 表格 ----------
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
    <BehaviorDetailDrawer ref="behaviorDetailDrawerRef" :detail-obj="dataObj.detailObj"
                          @refresh="handleRefresh"/>
    <Drawer title="搜索">
      <QueryForm/>
    </Drawer>
    <CreateDrawer :title="isEditMode ? '编辑请假申请' : '请假申请'">
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
          <IconButton content="申请" icon-name="Plus" @click="handleCreate"/>
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
        <el-text @click="handleOpenDetail(row)" type="primary" style="cursor: pointer;">
          {{ row.studentId }}
        </el-text>
      </template>
      <template #leaveType="{ row }">
        <el-text @click="handleFilterTagClick('leaveType', row.leaveType)" type="primary"
                 style="cursor: pointer;">{{ row.leaveType }}
        </el-text>
      </template>
      <template #startTime="{ row }">
        <el-text>{{ formatTimestamp(row.startTime) }}</el-text>
      </template>
      <template #endTime="{ row }">
        <el-text>{{ formatTimestamp(row.endTime) }}</el-text>
      </template>
      <template #auditTime="{ row }">
        <el-text>{{ formatTimestamp(row.auditTime) }}</el-text>
      </template>
      <template #attendanceSync="{ row }">
        <el-tag :type="getSyncType(row.attendanceSync)">{{ row.attendanceSync }}</el-tag>
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
          <IconButton v-if="row.status !== '已通过'" content="编辑" icon-name="Edit"
                      @click="handleEdit(row)"/>
          <IconButton v-if="row.status === '待审批'" content="审批" icon-name="Check"
                      @click="handleAudit(row)"/>
          <IconButton v-if="row.status === '已通过'" content="撤销" icon-name="Refresh"
                      color="#F56C6C" @click="handleCancel(row)"/>
        </div>
      </template>
    </Grid>

    <!-- 审批弹窗 -->
    <el-dialog title="审批" v-model="auditDialogVisible" width="400px">
      <el-form label-width="100px">
        <el-form-item label="审批结果" required>
          <el-select v-model="auditStatus" placeholder="请选择审批结果" style="width: 100%;">
            <el-option label="通过" value="已通过"/>
            <el-option label="驳回" value="已驳回"/>
          </el-select>
        </el-form-item>
        <el-form-item label="审批备注">
          <el-input v-model="auditRemark" type="textarea" :rows="3" placeholder="请输入备注（可选）"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="auditDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAudit">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>
