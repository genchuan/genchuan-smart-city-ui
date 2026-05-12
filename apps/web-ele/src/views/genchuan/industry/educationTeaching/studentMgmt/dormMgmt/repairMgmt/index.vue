<script setup>
import {computed, reactive, ref, watch, nextTick} from 'vue';
import {confirm, useVbenDrawer} from '@vben/common-ui';
import {ElLoading, ElMessage, ElMessageBox} from 'element-plus';
import screenfull from 'screenfull';
import {useVbenForm} from '#/adapter/form';
import {useVbenVxeGrid} from '#/adapter/vxe-table';
import {downloadFileFromBlobPart} from '@vben/utils';
import RepairDetailDrawer from './components/repairDetail.vue';
import {
  getRepairMgmtPage,
  createRepairMgmt,
  assignRepairMgmt,
  feedbackRepairMgmt,
  acceptRepairMgmt,
  updateRepairMgmt,
  exportRepairMgmt,
  getRepairMgmtDetail,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/dormMgmt/repairMgmt/data.js';
import {
  textObj,
  useFormSchema,
  getColumns,
  useApplyFormSchema,
  useFeedbackFormSchema,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/dormMgmt/repairMgmt/form.js';

// 辅助函数：状态标签类型
const getStatusType = (status) => {
  const map = {
    '待派单': 'warning',
    '维修中': 'primary',
    '已维修': 'success',
  };
  return map[status] || 'info';
};

const getCheckStatusType = (checkStatus) => {
  const map = {
    '未验收': 'danger',
    '已验收': 'success',
  };
  return map[checkStatus] || 'info';
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
    dormNum: '宿舍号',
    repairType: '报修类型',
    checkStatus: '验收状态',
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

// ---------- 抽屉组件 ----------
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => drawerApi.close(),
});

const [FeedbackDrawer, feedbackDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => feedbackDrawerApi.close(),
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
const assignIds = ref([]);      // 待派单的ID列表
const feedbackIds = ref([]);    // 待反馈的ID列表

// 派单弹窗
const assignVisible = ref(false);
const assignRepairUser = ref('');   // 改为输入框，直接存储维修人姓名
const currentAssignIds = ref([]);

const getTableData = async ({ page }) => {
  dataObj.loading = true;
  try {
    const params = {
      ...searchParams.value,
      pageNo: page.currentPage,
      pageSize: page.pageSize,
    };

    const res = await getRepairMgmtPage(params);

    let filtered = res.list;

    // 应用标签筛选
    Object.entries(tagFilters.value).forEach(([field, filterValue]) => {
      filtered = filtered.filter((item) => {
        let itemValue;
        switch (field) {
          case 'dormNum':
            itemValue = item.dormNum;
            break;
          case 'repairType':
            itemValue = item.repairType;
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

    ElMessage.error('获取报修列表失败，请检查网络或联系管理员');
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
      const data = await exportRepairMgmt(searchParams.value);
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

// 批量派单
async function handleBatchAssign() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一个报修记录');
    return;
  }
  const pendingRows = checkedRows.value.filter(row => row.status === '待派单');
  if (pendingRows.length === 0) {
    ElMessage.warning('请选择状态为【待派单】的记录进行派单');
    return;
  }
  currentAssignIds.value = pendingRows.map(row => row.id);
  assignRepairUser.value = '';
  assignVisible.value = true;
}

async function submitAssign() {
  if (!assignRepairUser.value || !assignRepairUser.value.trim()) {
    ElMessage.warning('请输入维修人姓名');
    return;
  }
  const loading = ElLoading.service({text: '派单中...'});
  try {
    const res = await assignRepairMgmt({
      ids: currentAssignIds.value,
      repairUser: assignRepairUser.value.trim()
    });
    if (res && res !== false) {
      ElMessage.success('派单成功');
      assignVisible.value = false;
      handleRefresh();
    } else {
      ElMessage.error('派单失败');
    }
  } finally {
    loading.close();
  }
}

// 批量反馈
async function handleBatchFeedback() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一个报修记录');
    return;
  }
  const repairingRows = checkedRows.value.filter(row => row.status === '维修中');
  if (repairingRows.length === 0) {
    ElMessage.warning('请选择状态为【维修中】的记录进行反馈');
    return;
  }
  feedbackIds.value = repairingRows.map(row => row.id);
  feedbackFormApi.resetForm();
  feedbackDrawerApi.open();
}

// 新增申请
function handleCreate() {
  isEditMode.value = false;
  currentEditId.value = null;
  applyDrawerApi.open(); // 打开抽屉，数据填充由 onOpenChange 负责
}

function handleEdit(row) {
  if (row.status !== '待派单') {
    ElMessage.warning('只有待派单状态的报修可以编辑');
    return;
  }
  isEditMode.value = true;
  currentEditId.value = row.id;
  applyDrawerApi.open(); // 打开抽屉，数据填充由 onOpenChange 负责
}

// 单行派单
async function handleAssign(row) {
  if (row.status !== '待派单') {
    ElMessage.warning('只有待派单状态的报修可以派单');
    return;
  }
  currentAssignIds.value = [row.id];
  assignRepairUser.value = '';
  assignVisible.value = true;
}

// 单行反馈
async function handleFeedback(row) {
  if (row.status !== '维修中') {
    ElMessage.warning('只有维修中状态的报修可以反馈');
    return;
  }
  feedbackIds.value = [row.id];
  feedbackFormApi.resetForm();
  feedbackDrawerApi.open();
}

// 单行验收
async function handleAccept(row) {
  if (row.status !== '已维修') {
    ElMessage.warning('只有已维修状态的报修可以验收');
    return;
  }
  if (row.checkStatus === '已验收') {
    ElMessage.warning('该报修已验收，不可重复验收');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认验收报修（宿舍 ${row.dormNum}）？验收后验收状态将变为“已验收”。`, '验收确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({text: '验收中...'});
    try {
      const res = await acceptRepairMgmt({id: row.id});
      if (res && res !== false) {
        ElMessage.success('验收成功');
        handleRefresh();
      } else {
        ElMessage.error('验收失败');
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
    const loading = ElLoading.service({text: isEditMode.value ? '保存中...' : '提交中...'});
    try {
      let res;
      if (isEditMode.value) {
        // 编辑时传递 status（表单中已包含）
        res = await updateRepairMgmt({...values, id: currentEditId.value});
      } else {
        // 新增时确保 status 字段存在（默认待派单）
        const submitData = {...values, status: values.status || '待派单'};
        res = await createRepairMgmt(submitData);
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
          const detail = await getRepairMgmtDetail({id: currentEditId.value});
          await applyFormApi.setValues({
            dormNum: detail.dormNum,
            repairType: detail.repairType,
            applyTime: detail.applyTime,
            status: detail.status,
            remark: detail.remark,
          });
        } catch (error) {
          console.error('加载详情失败', error);
          ElMessage.error('加载详情失败，请检查网络或联系管理员');
          applyDrawerApi.close(); // 加载失败则关闭抽屉
        }
      } else {
        // 新增模式：设置默认申请时间为当前时间，默认状态为“待派单”
        await applyFormApi.setValues({applyTime: Date.now(), status: '待派单'});
      }
    }
  },
});

// 反馈表单
const [FeedbackForm, feedbackFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: '提交反馈...'});
    try {
      const res = await feedbackRepairMgmt({
        ids: feedbackIds.value,
        feedbackContent: values.feedbackContent
      });
      if (res && res !== false) {
        ElMessage.success('反馈成功');
        feedbackDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('反馈失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useFeedbackFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: {content: '保存'},
});

// 详情抽屉
const repairDetailDrawerRef = ref(null);

function handleOpenDetail(row) {
  dataObj.detailObj = row;
  repairDetailDrawerRef.value.open();
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
    <RepairDetailDrawer ref="repairDetailDrawerRef" :detail-obj="dataObj.detailObj"
                        @refresh="handleRefresh"/>
    <Drawer title="搜索">
      <QueryForm/>
    </Drawer>
    <ApplyDrawer :title="isEditMode ? textObj.editText : textObj.applyText">
      <ApplyForm/>
    </ApplyDrawer>
    <FeedbackDrawer :title="textObj.feedbackText">
      <FeedbackForm/>
    </FeedbackDrawer>

    <!-- 派单弹窗 - 维修人改为输入框 -->
    <el-dialog v-model="assignVisible" title="派单" width="400px">
      <el-form label-width="80px">
        <el-form-item label="维修人">
          <el-input
            v-model="assignRepairUser"
            placeholder="请输入维修人姓名"
            clearable
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="assignVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAssign">确认派单</el-button>
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
          <IconButton content="申请" icon-name="Plus" @click="handleCreate"/>
          <IconButton content="派单" icon-name="User" @click="handleBatchAssign"/>
          <IconButton content="反馈" icon-name="EditPen" @click="handleBatchFeedback"/>
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
      <template #dormNum="{ row }">
        <el-text @click="handleFilterTagClick('dormNum', row.dormNum)" type="primary"
                 style="cursor: pointer;">
          {{ row.dormNum }}
        </el-text>
      </template>
      <template #repairType="{ row }">
        <el-text @click="handleFilterTagClick('repairType', row.repairType)" type="primary"
                 style="cursor: pointer;">
          {{ row.repairType }}
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
      <template #applyTime="{ row }">
        <el-text>{{ formatTimestamp(row.applyTime) }}</el-text>
      </template>
      <template #dispatchTime="{ row }">
        <el-text>{{ formatTimestamp(row.dispatchTime) }}</el-text>
      </template>
      <template #feedbackTime="{ row }">
        <el-text>{{ formatTimestamp(row.feedbackTime) }}</el-text>
      </template>
      <template #checkTime="{ row }">
        <el-text>{{ formatTimestamp(row.checkTime) }}</el-text>
      </template>
      <template #updateTime="{ row }">
        <el-text>{{ formatTimestamp(row.updateTime) }}</el-text>
      </template>

      <!-- 操作按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)"/>
          <IconButton v-if="row.status === '待派单'" content="编辑" icon-name="Edit"
                      @click="handleEdit(row)"/>
          <IconButton v-if="row.status === '待派单'" content="派单" icon-name="User"
                      @click="handleAssign(row)"/>
          <IconButton v-if="row.status === '维修中'" content="反馈" icon-name="EditPen"
                      @click="handleFeedback(row)"/>
          <IconButton v-if="row.status === '已维修'" content="验收"
                      icon-name="Check" @click="handleAccept(row)"/>
        </div>
      </template>
    </Grid>
  </div>
</template>
