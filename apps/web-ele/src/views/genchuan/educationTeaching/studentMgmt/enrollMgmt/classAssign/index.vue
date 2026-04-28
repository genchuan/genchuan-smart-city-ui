<script setup>
import { reactive, ref, nextTick } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { downloadFileFromBlobPart } from '@vben/utils';
import ClassAssignDetailDrawer from './components/classAssignDetail.vue';
import {
  getClassAssignPage,
  createClassAssignConfig,
  assignClassAssign,
  confirmClassAssign,
  updateClassAssign,
  exportClassAssign,
  getClassAssignDetail,
} from '#/api/genchuan/educationTeaching/studentMgmt/enrollMgmt/classAssign/data.js';
import {
  textObj,
  useFormSchema,
  getColumns,
  useConfigFormSchema,
} from '#/api/genchuan/educationTeaching/studentMgmt/enrollMgmt/classAssign/form.js';

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
    ruleContent: '分班规则',
    className: '班级名称',
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

// 抽屉组件
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
    '未分班': 'warning',
    '已分班': 'success',
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
    const res = await getClassAssignPage(params);
    let filtered = res.list;
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
          case 'className':
            itemValue = item.className;
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
    dataObj.total = res.total || filtered.length;
    dataObj.list = filtered;
  } catch (error) {
    console.error('获取数据失败:', error);
    // 分页接口已联调成功，出错时返回空数据并提示用户
    dataObj.total = 0;
    dataObj.list = [];
    ElMessage.error('获取分班任务列表失败，请检查网络或联系管理员');
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
      const data = await exportClassAssign(searchParams.value);
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

// 批量分班
async function handleBatchAssign() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一个分班任务');
    return;
  }
  const unassignedRows = checkedRows.value.filter(row => row.status === '未分班');
  if (unassignedRows.length === 0) {
    ElMessage.warning('请选择状态为【未分班】的任务进行分班');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认对选中的 ${unassignedRows.length} 个任务执行智能分班？`, '批量分班确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({text: '分班中...'});
    try {
      const ids = unassignedRows.map(row => row.id);
      const res = await assignClassAssign({ids, assignTime: Date.now()});
      if (res && res !== false) {
        ElMessage.success('批量分班成功');
        handleRefresh();
      } else {
        ElMessage.error('批量分班失败');
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
    ElMessage.warning('请至少选择一个分班任务');
    return;
  }
  const assignedRows = checkedRows.value.filter(row => row.status === '已分班');
  if (assignedRows.length === 0) {
    ElMessage.warning('请选择状态为【已分班】的任务进行确认');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认选中的 ${assignedRows.length} 个分班任务？确认后将记录确认信息。`, '批量确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({text: '确认中...'});
    try {
      const ids = assignedRows.map(row => row.id);
      const res = await confirmClassAssign({ids, confirmUser: '当前用户', confirmTime: Date.now()});
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

// 配置（新增）
function handleConfig() {
  isEditMode.value = false;
  currentEditId.value = null;
  configDrawerApi.open(); // 打开抽屉，数据填充由 onOpenChange 负责
}

function handleEdit(row) {
  if (row.status !== '未分班') {
    ElMessage.warning('只有未分班状态的任务可以编辑');
    return;
  }
  isEditMode.value = true;
  currentEditId.value = row.id;
  configDrawerApi.open(); // 打开抽屉，数据填充由 onOpenChange 负责
}

// 单行分班
async function handleAssign(row) {
  if (row.status !== '未分班') {
    ElMessage.warning('只有未分班状态的任务可以分班');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认对任务"${row.ruleContent.substring(0, 20)}..."执行智能分班？`, '分班确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({text: '分班中...'});
    try {
      const res = await assignClassAssign({ids: [row.id], assignTime: Date.now()});
      if (res && res !== false) {
        ElMessage.success('分班成功');
        handleRefresh();
      } else {
        ElMessage.error('分班失败');
      }
    } finally {
      loading.close();
    }
  } catch {
  }
}

// 单行确认
async function handleConfirm(row) {
  if (row.status !== '已分班') {
    ElMessage.warning('只有已分班状态的任务可以确认');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认分班任务"${row.ruleContent.substring(0, 20)}..."？确认后将生成班级学生信息。`, '确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({text: '确认中...'});
    try {
      const res = await confirmClassAssign({
        ids: [row.id],
        confirmUser: '当前用户',
        confirmTime: Date.now()
      });
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

// 配置表单
const [ConfigForm, configFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: isEditMode.value ? '保存中...' : '配置中...'});
    try {
      let res;
      if (isEditMode.value) {
        res = await updateClassAssign({...values, id: currentEditId.value, status: '未分班'});
      } else {
        res = await createClassAssignConfig({...values, status: '未分班'});
      }
      if (res && res !== false) {
        ElMessage.success(isEditMode.value ? '编辑成功' : '配置成功');
        configDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error(isEditMode.value ? '编辑失败' : '配置失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useConfigFormSchema(isEditMode.value),
  showCollapseButton: false,
  submitButtonOptions: {content: '保存'},
});

// 修复的核心：在抽屉打开时重置表单并加载编辑数据
const [ConfigDrawer, configDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => configDrawerApi.close(),
  async onOpenChange(isOpen) {
    if (isOpen) {
      // 每次打开前先重置表单（清空值 + 清除校验错误）
      await configFormApi.resetForm();
      // 如果是编辑模式，则填充数据
      if (isEditMode.value && currentEditId.value) {
        try {
          const detail = await getClassAssignDetail({id: currentEditId.value});
          await configFormApi.setValues({
            ruleContent: detail.ruleContent,
            studentNum: detail.studentNum,
            remark: detail.remark,
          });
        } catch (error) {
          console.error('加载详情失败', error);
          ElMessage.error('加载详情失败，请检查网络或联系管理员');
          configDrawerApi.close(); // 加载失败则关闭抽屉
        }
      }
    }
  },
});

// 详情抽屉
const classAssignDetailDrawerRef = ref(null);

function handleOpenDetail(row) {
  dataObj.detailObj = row;
  classAssignDetailDrawerRef.value.open();
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
    <ClassAssignDetailDrawer ref="classAssignDetailDrawerRef" :detail-obj="dataObj.detailObj"
                             @refresh="handleRefresh"/>
    <Drawer title="搜索">
      <QueryForm/>
    </Drawer>
    <ConfigDrawer :title="isEditMode ? textObj.editText : textObj.configText">
      <ConfigForm/>
    </ConfigDrawer>
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
          <IconButton :content="textObj.configText" icon-name="Plus" @click="handleConfig"/>
          <IconButton :content="textObj.assignText" icon-name="Check" @click="handleBatchAssign"/>
          <IconButton :content="textObj.confirmText" icon-name="Checked"
                      @click="handleBatchConfirm"/>
          <IconButton content="导出" icon-name="download" @click="handleExport"/>
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow"/>
          <IconButton content="重置" icon-name="Refresh" @click="handleReset"/>
          <IconButton :content="props.arrowShow ? '展开' : '收缩'"
                      :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange"/>
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow"/>
        </div>
      </template>

      <!-- 钻取列 -->
      <template #className="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary" style="cursor: pointer">
          {{ row.className || '-' }}
        </el-text>
      </template>
      <template #ruleContent="{ row }">
        <el-text>{{ row.ruleContent }}</el-text>
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
      <template #assignTime="{ row }">
        <el-text>{{ formatTimestamp(row.assignTime) }}</el-text>
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
          <IconButton v-if="row.status === '未分班'" content="编辑" icon-name="Edit"
                      @click="handleEdit(row)"/>
          <IconButton v-if="row.status === '未分班'" content="分班" icon-name="Check"
                      @click="handleAssign(row)"/>
          <IconButton v-if="row.status === '已分班'" content="确认" icon-name="Checked"
                      @click="handleConfirm(row)"/>
        </div>
      </template>
    </Grid>
  </div>
</template>
