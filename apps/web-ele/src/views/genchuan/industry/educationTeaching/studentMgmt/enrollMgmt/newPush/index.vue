<script setup>
import { reactive, ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { downloadFileFromBlobPart } from '@vben/utils';
import NewPushDetailDrawer from './components/newPushDetail.vue';
import {
  getNewPushPage,
  createNewPushConfig,
  pushNewPush,
  updateNewPush,
  exportNewPush,
  getNewPushDetail,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/enrollMgmt/newPush/data.js';
import {
  textObj,
  useFormSchema,
  getColumns,
  useConfigFormSchema,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/enrollMgmt/newPush/form.js';

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
    status: '状态',
    creator: '创建人',
    createTime: '创建时间',
    taskName: '推送任务名称',
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
    '未推送': 'warning',
    '已推送': 'success',
  };
  return map[status] || 'info';
};

const getFinishRateType = (rate) => {
  if (rate === null || rate === undefined) return '-';
  return `${rate}%`;
};

const getTableData = async ({ page }) => {
  dataObj.loading = true;
  try {
    // 1️⃣ 合并搜索参数 + 标签筛选参数
    const params = {
      ...searchParams.value,
      pageNo: page.currentPage,
      pageSize: page.pageSize,
      // 将 tagFilters 中的字段映射到后端接口参数
      status: tagFilters.value.status,
      creator: tagFilters.value.creator,
      taskName: tagFilters.value.taskName,
      // 注意：createTime 需要特殊处理（见下方说明）
    };
    // 2️⃣ 删除无效参数
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key];
      }
    });
    const res = await getNewPushPage(params);
    // 3️⃣ 直接使用后端返回的数据
    dataObj.total = res.total || 0;   // ✅ 正确的总记录数
    dataObj.list = res.list || [];
    return dataObj;
  } catch (error) {
    console.error('获取数据失败:', error);
    dataObj.total = 0;
    dataObj.list = [];
    ElMessage.error('获取推送任务列表失败，请检查网络或联系管理员');
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
      const data = await exportNewPush(searchParams.value);
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

// 批量推送
async function handleBatchPush() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一个推送任务');
    return;
  }
  const unPushedRows = checkedRows.value.filter(row => row.status === '未推送');
  if (unPushedRows.length === 0) {
    ElMessage.warning('请选择状态为【未推送】的任务进行推送');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认推送选中的 ${unPushedRows.length} 个任务？推送后状态将变为“已推送”。`, '批量推送确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({text: '推送中...'});
    try {
      const ids = unPushedRows.map(row => row.id);
      const res = await pushNewPush({ids});
      if (res && res !== false) {
        ElMessage.success('批量推送成功');
        handleRefresh();
      } else {
        ElMessage.error('批量推送失败');
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
  if (row.status !== '未推送') {
    ElMessage.warning('只有未推送状态的任务可以编辑');
    return;
  }
  isEditMode.value = true;
  currentEditId.value = row.id;
  configDrawerApi.open(); // 打开抽屉，数据填充由 onOpenChange 负责
}

// 单行推送
async function handlePush(row) {
  if (row.status !== '未推送') {
    ElMessage.warning('只有未推送状态的任务可以推送');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认推送任务"${row.taskName}"？`, '推送确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({text: '推送中...'});
    try {
      const res = await pushNewPush({ids: [row.id]});
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

// 配置表单
const [ConfigForm, configFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: isEditMode.value ? '保存中...' : '配置中...'});
    try {
      let res;
      if (isEditMode.value) {
        res = await updateNewPush({...values, id: currentEditId.value});
      } else {
        res = await createNewPushConfig({...values, status: '未推送'});
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
          const detail = await getNewPushDetail({id: currentEditId.value});
          await configFormApi.setValues({
            taskName: detail.taskName,
            pushContent: detail.pushContent,
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
const newPushDetailDrawerRef = ref(null);

function handleOpenDetail(row) {
  dataObj.detailObj = row;
  newPushDetailDrawerRef.value.open();
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
    <NewPushDetailDrawer ref="newPushDetailDrawerRef" :detail-obj="dataObj.detailObj"
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
          <IconButton :content="textObj.pushText" icon-name="Checked" @click="handleBatchPush"/>
          <IconButton content="导出" icon-name="download" @click="handleExport"/>
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow"/>
          <IconButton content="重置" icon-name="Refresh" @click="handleReset"/>
          <IconButton :content="props.arrowShow ? '展开' : '收缩'"
                      :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange"/>
          <span style="width: 30px; display: inline-block;"></span>
        </div>
      </template>

      <!-- 钻取列 -->
      <template #taskName="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary" style="cursor: pointer;">
          {{ row.taskName }}
        </el-text>
      </template>
      <template #pushContent="{ row }">
        <el-text>{{
            row.pushContent?.substring(0, 50) || '-'
          }}{{ row.pushContent?.length > 50 ? '...' : '' }}
        </el-text>
      </template>
      <template #finishRate="{ row }">
        <el-text>{{ getFinishRateType(row.finishRate) }}</el-text>
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
      <template #pushTime="{ row }">
        <el-text>{{ formatTimestamp(row.pushTime) }}</el-text>
      </template>
      <template #updateTime="{ row }">
        <el-text>{{ formatTimestamp(row.updateTime) }}</el-text>
      </template>

      <!-- 操作按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)"/>
          <IconButton v-if="row.status === '未推送'" content="编辑" icon-name="Edit"
                      @click="handleEdit(row)"/>
          <IconButton v-if="row.status === '未推送'" content="推送" icon-name="Checked"
                      @click="handlePush(row)"/>
        </div>
      </template>
    </Grid>
  </div>
</template>
