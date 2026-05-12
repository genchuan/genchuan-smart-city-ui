<script setup>
import {reactive, ref} from 'vue';
import {useVbenDrawer} from '@vben/common-ui';
import {ElLoading, ElMessage, ElMessageBox} from 'element-plus';
import screenfull from 'screenfull';
import {useVbenForm} from '#/adapter/form';
import {useVbenVxeGrid} from '#/adapter/vxe-table';
import {downloadFileFromBlobPart} from '@vben/utils';
import PromoteDetailDrawer from './components/promoteDetail.vue';
import {
  getPromoteMgmtPage,
  createPromoteMgmt,
  executePromoteMgmt,
  updatePromoteMgmt,
  exportPromoteMgmt,
  getPromoteMgmtDetail,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/enrollMgmt/promoteMgmt/data.js';
import {
  textObj,
  useFormSchema,
  getColumns,
  usePublishFormSchema,
  useExecuteFormSchema,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/enrollMgmt/promoteMgmt/form.js';

const props = defineProps({secondShow: Boolean, arrowShow: Boolean, arrowState: Boolean});
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
    site: '宣传站点',
    status: '状态',
    creator: '创建人',
    createTime: '创建时间',
    taskName: '宣传任务名称',
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

const [ExecuteDrawer, executeDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => executeDrawerApi.close(),
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
const currentExecuteIds = ref([]);      // 存储待执行的任务ID数组

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
    '未执行': 'warning',
    '已执行': 'success',
  };
  return map[status] || 'info';
};

const getTableData = async ({ page }) => {
  dataObj.loading = true;
  try {
    const params = {
      ...searchParams.value,
      pageNo: page.currentPage,
      pageSize: page.pageSize,
    };

    const res = await getPromoteMgmtPage(params);

    let filtered = res.list;

    // 应用标签筛选
    Object.entries(tagFilters.value).forEach(([field, filterValue]) => {
      filtered = filtered.filter((item) => {
        let itemValue;
        switch (field) {
          case 'site':
            itemValue = item.site;
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
          case 'taskName':
            itemValue = item.taskName;
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

    ElMessage.error('获取宣传任务列表失败，请检查网络或联系管理员');
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
      const data = await exportPromoteMgmt(searchParams.value);
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

// 批量执行（支持多选）
async function handleBatchExecute() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一个宣传任务');
    return;
  }
  const unexecutedRows = checkedRows.value.filter(row => row.status === '未执行');
  if (unexecutedRows.length === 0) {
    ElMessage.warning('请选择状态为【未执行】的任务进行执行');
    return;
  }
  // 存储所有选中且状态为未执行的任务ID
  currentExecuteIds.value = unexecutedRows.map(row => row.id);
  // 打开执行弹窗，让用户填写宣传人数和意向学生数（作为汇总值）
  executeFormApi.resetForm();
  executeDrawerApi.open();
}

// 发布（新增）
function handlePublish() {
  isEditMode.value = false;
  currentEditId.value = null;
  publishDrawerApi.open(); // 打开抽屉，数据填充由 onOpenChange 负责
}

function handleEdit(row) {
  if (row.status !== '未执行') {
    ElMessage.warning('只有未执行状态的任务可以编辑');
    return;
  }
  isEditMode.value = true;
  currentEditId.value = row.id;
  publishDrawerApi.open(); // 打开抽屉，数据填充由 onOpenChange 负责
}

// 单行执行（也复用批量执行接口，只是ids只有一个）
async function handleExecute(row) {
  if (row.status !== '未执行') {
    ElMessage.warning('只有未执行状态的任务可以执行');
    return;
  }
  currentExecuteIds.value = [row.id];
  executeFormApi.resetForm();
  executeDrawerApi.open();
}

// 发布表单
const [PublishForm, publishFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: isEditMode.value ? '保存中...' : '发布中...'});
    try {
      let res;
      // 确保 status 字段存在（新增时默认未执行）
      const submitData = {...values, status: values.status || '未执行'};
      if (isEditMode.value) {
        res = await updatePromoteMgmt({...submitData, id: currentEditId.value});
      } else {
        res = await createPromoteMgmt(submitData);
      }
      if (res && res !== false) {
        ElMessage.success(isEditMode.value ? '编辑成功' : '发布成功');
        publishDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error(isEditMode.value ? '编辑失败' : '发布失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: usePublishFormSchema(isEditMode.value),
  showCollapseButton: false,
  submitButtonOptions: {content: '保存'},
});

// 修复的核心：在抽屉打开时重置表单并加载编辑数据
const [PublishDrawer, publishDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => publishDrawerApi.close(),
  async onOpenChange(isOpen) {
    if (isOpen) {
      // 每次打开前先重置表单（清空值 + 清除校验错误）
      await publishFormApi.resetForm();
      // 如果是编辑模式，则填充数据
      if (isEditMode.value && currentEditId.value) {
        try {
          const detail = await getPromoteMgmtDetail({id: currentEditId.value});
          await publishFormApi.setValues({
            taskName: detail.taskName,
            site: detail.site,
            status: detail.status,
            remark: detail.remark,
          });
        } catch (error) {
          console.error('加载详情失败', error);
          ElMessage.error('加载详情失败，请检查网络或联系管理员');
          publishDrawerApi.close(); // 加载失败则关闭抽屉
        }
      } else {
        // 新增模式：设置默认状态为“未执行”
        await publishFormApi.setValues({status: '未执行'});
      }
    }
  },
});

// 执行表单（支持批量）
const [ExecuteForm, executeFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: '执行中...'});
    try {
      // 批量执行：ids 为所有选中的任务ID，promoteNum/intentNum 作为汇总值
      const res = await executePromoteMgmt({
        ids: currentExecuteIds.value,
        promoteNum: values.promoteNum,
        intentNum: values.intentNum,
        executeTime: Date.now(),
      });
      if (res && res !== false) {
        ElMessage.success(`成功执行 ${currentExecuteIds.value.length} 个任务`);
        executeDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('执行失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useExecuteFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: {content: '确认'},
});

// 详情抽屉
const promoteDetailDrawerRef = ref(null);

function handleOpenDetail(row) {
  dataObj.detailObj = row;
  promoteDetailDrawerRef.value.open();
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
    <PromoteDetailDrawer ref="promoteDetailDrawerRef" :detail-obj="dataObj.detailObj"
                         @refresh="handleRefresh"/>
    <Drawer title="搜索">
      <QueryForm/>
    </Drawer>
    <PublishDrawer :title="isEditMode ? textObj.editText : textObj.publishText">
      <PublishForm/>
    </PublishDrawer>
    <ExecuteDrawer title="执行宣传任务">
      <ExecuteForm/>
    </ExecuteDrawer>
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
          <IconButton :content="textObj.publishText" icon-name="Plus" @click="handlePublish"/>
          <IconButton :content="textObj.executeText" icon-name="Check" @click="handleBatchExecute"/>
          <IconButton content="导出" icon-name="download" @click="handleExport"/>
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow"/>
          <IconButton content="重置" icon-name="Refresh" @click="handleReset"/>
          <IconButton :content="props.arrowShow ? '展开' : '收缩'"
                      :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange"/>
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow"/>
        </div>
      </template>

      <!-- 钻取列 -->
      <template #taskName="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary" style="cursor: pointer;">
          {{ row.taskName }}
        </el-text>
      </template>
      <template #site="{ row }">
        <el-text @click="handleFilterTagClick('site', row.site)" type="primary"
                 style="cursor: pointer;">
          {{ row.site || '-' }}
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
      <template #executeTime="{ row }">
        <el-text>{{ formatTimestamp(row.executeTime) }}</el-text>
      </template>
      <template #updateTime="{ row }">
        <el-text>{{ formatTimestamp(row.updateTime) }}</el-text>
      </template>

      <!-- 操作按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)"/>
          <IconButton v-if="row.status === '未执行'" content="编辑" icon-name="Edit"
                      @click="handleEdit(row)"/>
          <IconButton v-if="row.status === '未执行'" content="执行" icon-name="Check"
                      @click="handleExecute(row)"/>
        </div>
      </template>
    </Grid>
  </div>
</template>
