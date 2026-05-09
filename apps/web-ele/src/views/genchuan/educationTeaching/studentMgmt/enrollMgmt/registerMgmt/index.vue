<script setup>
import {computed, reactive, ref, watch, nextTick} from 'vue';
import {confirm, useVbenDrawer} from '@vben/common-ui';
import {ElLoading, ElMessage, ElMessageBox} from 'element-plus';
import screenfull from 'screenfull';
import {useVbenForm} from '#/adapter/form';
import {useVbenVxeGrid} from '#/adapter/vxe-table';
import {downloadFileFromBlobPart} from '@vben/utils';
import RegisterDetailDrawer from './components/registerDetail.vue';
import {
  getRegisterMgmtPage,
  createRegisterMgmt,
  auditRegisterMgmt,
  confirmRegisterMgmt,
  updateRegisterMgmt,
  exportRegisterMgmt,
  getRegisterMgmtDetail,
} from '#/api/genchuan/educationTeaching/studentMgmt/enrollMgmt/registerMgmt/data.js';
import {
  textObj,
  useFormSchema,
  getColumns,
  useApplyFormSchema,
} from '#/api/genchuan/educationTeaching/studentMgmt/enrollMgmt/registerMgmt/form.js';

// 辅助函数：状态标签类型
const getStatusType = (status) => {
  const map = {
    '待审核': 'warning',
    '已录取': 'success',
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
    major: '意向专业',
    status: '状态',
    creator: '创建人',
    createTime: '创建时间',
    studentName: '学生姓名',
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
const auditIds = ref([]);      // 待审核的ID列表
const confirmIds = ref([]);    // 待确认的ID列表

const getTableData = async ({ page }) => {
  dataObj.loading = true;
  try {
    const params = {
      ...searchParams.value,
      pageNo: page.currentPage,
      pageSize: page.pageSize,
    };

    const res = await getRegisterMgmtPage(params);

    let filtered = res.list;

    // 应用标签筛选
    Object.entries(tagFilters.value).forEach(([field, filterValue]) => {
      filtered = filtered.filter((item) => {
        let itemValue;
        switch (field) {
          case 'major':
            itemValue = item.major;
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
          case 'studentName':
            itemValue = item.studentName;
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

    ElMessage.error('获取报名记录失败，请检查网络或联系管理员');
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
      const data = await exportRegisterMgmt(searchParams.value);
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
    ElMessage.warning('请至少选择一个报名记录');
    return;
  }
  const pendingRows = checkedRows.value.filter(row => row.status === '待审核');
  if (pendingRows.length === 0) {
    ElMessage.warning('请选择状态为【待审核】的记录进行审核');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认审核选中的 ${pendingRows.length} 条报名记录？审核后状态将变为“已录取”。`, '批量审核确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({text: '审核中...'});
    try {
      const ids = pendingRows.map(row => row.id);
      const res = await auditRegisterMgmt({ids, auditUser: '当前用户', auditTime: Date.now()});
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

// 批量确认
async function handleBatchConfirm() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一个报名记录');
    return;
  }
  const admittedRows = checkedRows.value.filter(row => row.status === '已录取');
  if (admittedRows.length === 0) {
    ElMessage.warning('请选择已录取的报名记录进行确认');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认选中的 ${admittedRows.length} 条报名记录？确认后将更新录取确认时间。`, '批量确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({text: '确认中...'});
    try {
      const ids = admittedRows.map(row => row.id);
      const res = await confirmRegisterMgmt({ids, confirmTime: Date.now()});
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

// 报名
function handleCreate() {
  isEditMode.value = false;
  currentEditId.value = null;
  applyDrawerApi.open(); // 打开抽屉，数据填充由 onOpenChange 负责
}

function handleEdit(row) {
  if (row.status !== '待审核') {
    ElMessage.warning('只有待审核状态的报名可以编辑');
    return;
  }
  isEditMode.value = true;
  currentEditId.value = row.id;
  applyDrawerApi.open(); // 打开抽屉，数据填充由 onOpenChange 负责
}

// 单行审核
async function handleAudit(row) {
  if (row.status !== '待审核') {
    ElMessage.warning('只有待审核状态的报名可以审核');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认审核学生"${row.studentName}"的报名？审核后状态将变为“已录取”。`, '审核确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({text: '审核中...'});
    try {
      const res = await auditRegisterMgmt({
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

// 单行确认
async function handleConfirm(row) {
  if (row.status !== '已录取') {
    ElMessage.warning('只有已录取状态的报名可以确认');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认学生"${row.studentName}"的录取结果？确认后将同步至学籍系统。`, '确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({text: '确认中...'});
    try {
      const res = await confirmRegisterMgmt({ids: [row.id], confirmTime: Date.now()});
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

// 报名表单
const [ApplyForm, applyFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: isEditMode.value ? '保存中...' : '报名中...'});
    try {
      let res;
      // 确保 status 字段存在（新增时默认为待审核）
      const submitData = {...values, status: values.status || '待审核'};
      if (isEditMode.value) {
        res = await updateRegisterMgmt({...submitData, id: currentEditId.value});
      } else {
        res = await createRegisterMgmt(submitData);
      }
      if (res && res !== false) {
        ElMessage.success(isEditMode.value ? '编辑成功' : '报名成功');
        applyDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error(isEditMode.value ? '编辑失败' : '报名失败');
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
          const detail = await getRegisterMgmtDetail({id: currentEditId.value});
          await applyFormApi.setValues({
            studentName: detail.studentName,
            idCard: detail.idCard,
            phone: detail.phone,
            major: detail.major,
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
        // 新增模式：设置默认状态为“待审核”
        await applyFormApi.setValues({status: '待审核'});
      }
    }
  },
});

// 详情抽屉
const registerDetailDrawerRef = ref(null);

function handleOpenDetail(row) {
  dataObj.detailObj = row;
  registerDetailDrawerRef.value.open();
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
    <RegisterDetailDrawer ref="registerDetailDrawerRef" :detail-obj="dataObj.detailObj"
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
          <IconButton content="报名" icon-name="Plus" @click="handleCreate"/>
          <IconButton content="审核" icon-name="Check" @click="handleBatchAudit"/>
          <IconButton content="确认" icon-name="Checked" @click="handleBatchConfirm"/>
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
      <template #studentName="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary" style="cursor: pointer;">
          {{ row.studentName }}
        </el-text>
      </template>
      <template #major="{ row }">
        <el-text @click="handleFilterTagClick('major', row.major)" type="primary"
                 style="cursor: pointer;">
          {{ row.major }}
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
      <template #auditTime="{ row }">
        <el-text>{{ formatTimestamp(row.auditTime) }}</el-text>
      </template>
      <template #confirmTime="{ row }">
        <el-text>{{ formatTimestamp(row.confirmTime) }}</el-text>
      </template>
      <template #updateTime="{ row }">
        <el-text>{{ formatTimestamp(row.updateTime) }}</el-text>
      </template>

      <!-- 操作按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)"/>
          <IconButton v-if="row.status === '待审核'" content="编辑" icon-name="Edit"
                      @click="handleEdit(row)"/>
          <IconButton v-if="row.status === '待审核'" content="审核" icon-name="Check"
                      @click="handleAudit(row)"/>
          <IconButton v-if="row.status === '已录取'" content="确认" icon-name="Checked"
                      @click="handleConfirm(row)"/>
        </div>
      </template>
    </Grid>
  </div>
</template>
