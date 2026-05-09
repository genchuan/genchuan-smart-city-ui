<script setup>
import {computed, reactive, ref, watch, nextTick, onMounted} from 'vue';
import {confirm, useVbenDrawer} from '@vben/common-ui';
import {ElLoading, ElMessage, ElMessageBox} from 'element-plus';
import screenfull from 'screenfull';
import {useVbenForm} from '#/adapter/form';
import {useVbenVxeGrid} from '#/adapter/vxe-table';
import {downloadFileFromBlobPart} from '@vben/utils';
import AidWorkDetailDrawer from './components/aidWorkDetail.vue';
import {
  // dataList 已删除，不再导入
  getAidWorkPage,
  createAidWork,
  updateAidWork,
  auditAidWork,
  followAidWork,
  exportAidWork,
  getAidWorkDetail,
  getStudentOptions,
} from '#/api/genchuan/educationTeaching/studentMgmt/studentWork/aidWork/data.js';
import {
  textObj,
  useFormSchema,
  getColumnsByStatus,
  useCreateFormSchema,
  useFollowFormSchema,
} from '#/api/genchuan/educationTeaching/studentMgmt/studentWork/aidWork/form.js';

// 辅助函数：状态标签类型
const getStatusType = (status) => {
  const map = {
    '待审核': 'warning',
    '已通过': 'primary',
    '已完成': 'success',
  };
  return map[status] || 'info';
};

// 流程状态标签类型
const getProcessStatusType = (status) => {
  const map = {
    '跟进中': 'warning',
    '已完成': 'success',
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

// 格式化金额
const formatMoney = (amount) => {
  if (amount === null || amount === undefined) return '-';
  return `¥${parseFloat(amount).toFixed(2)}`;
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
    aidType: '资助类型',
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

// 跟进抽屉
const [FollowDrawer, followDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => followDrawerApi.close(),
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
const currentFollowRow = ref(null);

// 学生选项
const studentOptions = ref([]);
const loadStudentOptions = async () => {
  const res = await getStudentOptions();
  studentOptions.value = res;
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

    const res = await getAidWorkPage(params);

    let filtered = res.list;

    // 应用标签筛选
    Object.entries(tagFilters.value).forEach(([field, filterValue]) => {
      filtered = filtered.filter((item) => {
        let itemValue;
        switch (field) {
          case 'aidType':
            itemValue = item.aidType;
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

    ElMessage.error('获取奖助勤贷列表失败，请检查网络或联系管理员');
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
      const data = await exportAidWork(searchParams.value);
      downloadFileFromBlobPart({fileName: '奖助勤贷列表.xls', source: data});
      ElMessage.success('导出成功');
    } finally {
      loading.close();
    }
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败');
  }
}

// ---------- 审核弹窗相关 ----------
const auditDialogVisible = ref(false);
const currentAuditRows = ref([]);      // 存储待审核的记录
const auditResult = ref('');           // 审核结果：通过 / 驳回
const auditRemark = ref('');           // 审核备注

// 批量审核
function handleBatchAudit() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一条奖助申请');
    return;
  }
  const selectedRows = checkedRows.value.filter(row => row.status === '待审核');
  if (selectedRows.length === 0) {
    ElMessage.warning('请选择状态为【待审核】的奖助申请');
    return;
  }
  currentAuditRows.value = selectedRows;
  auditResult.value = '';
  auditRemark.value = '';
  auditDialogVisible.value = true;
}

// 单行审核
function handleAudit(row) {
  if (row.status !== '待审核') {
    ElMessage.warning('只有待审核状态的奖助申请可以审核');
    return;
  }
  currentAuditRows.value = [row];
  auditResult.value = '';
  auditRemark.value = '';
  auditDialogVisible.value = true;
}

// 确认审核
async function confirmAudit() {
  if (!auditResult.value) {
    ElMessage.warning('请选择审核结果');
    return;
  }
  const loading = ElLoading.service({text: '审核中...'});
  try {
    const ids = currentAuditRows.value.map(row => row.id);
    const res = await auditAidWork({
      ids,
      auditResult: auditResult.value,
      remark: auditRemark.value || '',
    });
    if (res && res !== false) {
      ElMessage.success('审核成功');
      auditDialogVisible.value = false;
      handleRefresh();
    } else {
      ElMessage.error('审核失败');
    }
  } catch (error) {
    console.error('审核失败', error);
    ElMessage.error('审核失败');
  } finally {
    loading.close();
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
  isEditMode.value = true;
  currentEditId.value = row.id;
  createDrawerApi.open(); // 打开抽屉，数据填充由 onOpenChange 负责
}

// 跟进
function handleFollow(row) {
  if (row.status !== '已通过' && row.status !== '已完成') {
    ElMessage.warning('只有已通过或已完成状态的申请可以跟进');
    return;
  }
  currentFollowRow.value = row;
  followFormApi.resetForm();
  followFormApi.setValues({
    processStatus: row.processStatus,
    remark: '',
  });
  followDrawerApi.open();
}

// 申请/编辑表单
const [CreateForm, createFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: isEditMode.value ? '更新中...' : '申报中...'});
    try {
      let res;
      if (isEditMode.value) {
        // 编辑时传递 status（表单中已包含）
        res = await updateAidWork({...values, id: currentEditId.value});
      } else {
        // 新增时确保 status 字段存在（默认待审核）
        const submitData = {...values, status: values.status || '待审核'};
        res = await createAidWork(submitData);
      }
      if (res && res !== false) {
        ElMessage.success(isEditMode.value ? '更新成功' : '申报成功');
        createDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error(isEditMode.value ? '更新失败' : '申报失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: createFormSchema,
  showCollapseButton: false,
  submitButtonOptions: {content: computed(() => isEditMode.value ? '保存' : '申报')},
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
          const detail = await getAidWorkDetail({id: currentEditId.value});
          await createFormApi.setValues({
            studentId: detail.studentId,
            aidType: detail.aidType,
            applyAmount: detail.applyAmount,
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

// 跟进表单
const [FollowForm, followFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: '提交跟进中...'});
    try {
      const res = await followAidWork({
        id: currentFollowRow.value.id,
        processStatus: values.processStatus,
        remark: values.remark,
      });
      if (res && res !== false) {
        ElMessage.success('跟进成功');
        followDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('跟进失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useFollowFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: {content: '提交跟进'},
});

// 查看详情
const aidWorkDetailDrawerRef = ref(null);

function handleOpenDetail(row) {
  dataObj.detailObj = row;
  aidWorkDetailDrawerRef.value.open();
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
    <AidWorkDetailDrawer ref="aidWorkDetailDrawerRef" :detail-obj="dataObj.detailObj"
                         @refresh="handleRefresh"/>
    <Drawer title="搜索">
      <QueryForm/>
    </Drawer>
    <CreateDrawer :title="isEditMode ? '编辑奖助申请' : '奖助申报'">
      <CreateForm/>
    </CreateDrawer>
    <FollowDrawer title="流程跟进">
      <FollowForm/>
    </FollowDrawer>
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
          <IconButton content="申报" icon-name="Plus" @click="handleCreate"/>
          <IconButton content="审核" icon-name="Check" @click="handleBatchAudit"/>
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
      <template #aidType="{ row }">
        <el-text @click="handleFilterTagClick('aidType', row.aidType)" type="primary"
                 style="cursor: pointer;">{{ row.aidType }}
        </el-text>
      </template>
      <template #applyAmount="{ row }">
        <el-text>{{ formatMoney(row.applyAmount) }}</el-text>
      </template>
      <template #applyTime="{ row }">
        <el-text>{{ formatTimestamp(row.applyTime) }}</el-text>
      </template>
      <template #auditTime="{ row }">
        <el-text>{{ formatTimestamp(row.auditTime) }}</el-text>
      </template>
      <template #processStatus="{ row }">
        <el-tag :type="getProcessStatusType(row.processStatus)">{{ row.processStatus }}</el-tag>
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
          <IconButton v-if="row.status === '已通过' || row.status === '已完成'" content="跟进"
                      icon-name="EditPen" @click="handleFollow(row)"/>
        </div>
      </template>
    </Grid>

    <!-- 审核弹窗 -->
    <el-dialog title="审核" v-model="auditDialogVisible" width="400px">
      <el-form label-width="100px">
        <el-form-item label="审核结果" required>
          <el-select v-model="auditResult" placeholder="请选择审核结果" style="width: 100%;">
            <el-option label="通过" value="通过"/>
            <el-option label="驳回" value="驳回"/>
          </el-select>
        </el-form-item>
        <el-form-item label="审核备注">
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
