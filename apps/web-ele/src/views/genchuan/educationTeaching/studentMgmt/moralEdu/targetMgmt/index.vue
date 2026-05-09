<script setup>
import {computed, reactive, ref, watch, nextTick} from 'vue';
import {confirm, useVbenDrawer} from '@vben/common-ui';
import {ElLoading, ElMessage, ElMessageBox} from 'element-plus';
import screenfull from 'screenfull';
import {useVbenForm} from '#/adapter/form';
import {useVbenVxeGrid} from '#/adapter/vxe-table';
import {downloadFileFromBlobPart} from '@vben/utils';
import TargetDetailDrawer from './components/targetDetail.vue';
import {
  getTargetMgmtPage,
  createTargetMgmt,
  updateTargetMgmt,
  configTargetMgmt,
  enableTargetMgmt,
  disableTargetMgmt,
  exportTargetMgmt,
  getTargetMgmtDetail,
} from '#/api/genchuan/educationTeaching/studentMgmt/moralEdu/targetMgmt/data.js';
import {
  textObj,
  useFormSchema,
  getColumns,
  useCreateFormSchema,
  useConfigFormSchema,
} from '#/api/genchuan/educationTeaching/studentMgmt/moralEdu/targetMgmt/form.js';

// 辅助函数：状态标签类型
const getStatusType = (status) => {
  const map = {
    '未启用': 'warning',
    '已启用': 'success',
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
    evaluatorType: '评价人类型',
    scoreType: '计分方式',
    status: '状态',
    creator: '创建人',
    createTime: '创建时间',
    targetName: '指标名称',
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

const [ConfigDrawer, configDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => configDrawerApi.close(),
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
const isConfigMode = ref(false);
const configIds = ref([]);

const getTableData = async ({ page }) => {
  dataObj.loading = true;
  try {
    const params = {
      ...searchParams.value,
      pageNo: page.currentPage,
      pageSize: page.pageSize,
    };

    const res = await getTargetMgmtPage(params);

    let filtered = res.list;

    // 应用标签筛选
    Object.entries(tagFilters.value).forEach(([field, filterValue]) => {
      filtered = filtered.filter((item) => {
        let itemValue;
        switch (field) {
          case 'evaluatorType':
            itemValue = item.evaluatorType;
            break;
          case 'scoreType':
            itemValue = item.scoreType;
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
          case 'targetName':
            itemValue = item.targetName;
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

    ElMessage.error('获取指标列表失败，请检查网络或联系管理员');
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
      const data = await exportTargetMgmt(searchParams.value);
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

// 批量配置
async function handleBatchConfig() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一个指标');
    return;
  }
  isConfigMode.value = true;
  configIds.value = [...checkedIds.value];
  configFormApi.resetForm();
  configDrawerApi.open();
}

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

// 启用
async function handleEnable(row) {
  if (row.status !== '未启用') {
    ElMessage.warning('只有未启用状态的指标可以启用');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认启用指标"${row.targetName}"？启用后指标将生效。`, '启用确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({text: '启用中...'});
    try {
      const res = await enableTargetMgmt([row.id]);
      if (res && res !== false) {
        ElMessage.success('启用成功');
        handleRefresh();
      } else {
        ElMessage.error('启用失败');
      }
    } finally {
      loading.close();
    }
  } catch {
  }
}

// 停用
async function handleDisable(row) {
  if (row.status !== '已启用') {
    ElMessage.warning('只有已启用状态的指标可以停用');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认停用指标"${row.targetName}"？停用后指标将不再使用。`, '停用确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({text: '停用中...'});
    try {
      const res = await disableTargetMgmt([row.id]);
      if (res && res !== false) {
        ElMessage.success('停用成功');
        handleRefresh();
      } else {
        ElMessage.error('停用失败');
      }
    } finally {
      loading.close();
    }
  } catch {
  }
}

// 新增/编辑表单
const [CreateForm, createFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: isEditMode.value ? '更新中...' : '保存中...'});
    try {
      let res;
      if (isEditMode.value) {
        // 编辑时传递 status（表单中已包含）
        res = await updateTargetMgmt({...values, id: currentEditId.value});
      } else {
        // 新增时确保 status 字段存在（默认未启用）
        const submitData = {...values, status: values.status || '未启用'};
        res = await createTargetMgmt(submitData);
      }
      if (res && res !== false) {
        ElMessage.success(isEditMode.value ? '更新成功' : '新增成功');
        createDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error(isEditMode.value ? '更新失败' : '新增失败');
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
          const detail = await getTargetMgmtDetail({id: currentEditId.value});
          await createFormApi.setValues({
            targetName: detail.targetName,
            totalScore: detail.totalScore,
            warnThreshold: detail.warnThreshold,
            evaluatorType: detail.evaluatorType,
            scoreType: detail.scoreType,
            status: detail.status,
            remark: detail.remark,
          });
        } catch (error) {
          console.error('加载详情失败', error);
          ElMessage.error('加载详情失败，请检查网络或联系管理员');
          createDrawerApi.close(); // 加载失败则关闭抽屉
        }
      } else {
        // 新增模式：设置默认状态为“未启用”
        await createFormApi.setValues({status: '未启用'});
      }
    }
  },
});

// 配置表单
const [ConfigForm, configFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: '配置中...'});
    try {
      const res = await configTargetMgmt({ids: configIds.value, ...values});
      if (res && res !== false) {
        ElMessage.success('配置成功');
        configDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('配置失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useConfigFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: {content: '保存'},
});

// 查看详情
const targetDetailDrawerRef = ref(null);

function handleOpenDetail(row) {
  dataObj.detailObj = row;
  targetDetailDrawerRef.value.open();
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
    <TargetDetailDrawer ref="targetDetailDrawerRef" :detail-obj="dataObj.detailObj"
                        @refresh="handleRefresh"/>
    <Drawer title="搜索">
      <QueryForm/>
    </Drawer>
    <CreateDrawer :title="isEditMode ? textObj.editText : textObj.addText">
      <CreateForm/>
    </CreateDrawer>
    <ConfigDrawer :title="textObj.configText">
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
          <IconButton content="新增" icon-name="Plus" @click="handleCreate"/>
          <IconButton content="配置" icon-name="Setting" @click="handleBatchConfig"/>
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
      <template #targetName="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary" style="cursor: pointer;">
          {{ row.targetName }}
        </el-text>
      </template>
      <template #evaluatorType="{ row }">
        <el-text @click="handleFilterTagClick('evaluatorType', row.evaluatorType)" type="primary"
                 style="cursor: pointer;">{{ row.evaluatorType }}
        </el-text>
      </template>
      <template #scoreType="{ row }">
        <el-text @click="handleFilterTagClick('scoreType', row.scoreType)" type="primary"
                 style="cursor: pointer;">{{ row.scoreType }}
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
                 style="cursor: pointer;">{{ row.creator || '-' }}
        </el-text>
      </template>
      <template #createTime="{ row }">
        <el-text @click="handleFilterTagClick('createTime', getDateFromTimestamp(row.createTime))"
                 type="primary" style="cursor: pointer;">{{ formatTimestamp(row.createTime) }}
        </el-text>
      </template>

      <!-- 时间格式化 -->
      <template #enableTime="{ row }">
        <el-text>{{ formatTimestamp(row.enableTime) }}</el-text>
      </template>
      <template #disableTime="{ row }">
        <el-text>{{ formatTimestamp(row.disableTime) }}</el-text>
      </template>
      <template #updateTime="{ row }">
        <el-text>{{ formatTimestamp(row.updateTime) }}</el-text>
      </template>

      <!-- 操作按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)"/>
          <IconButton v-if="row.status === '未启用'" content="编辑" icon-name="Edit"
                      @click="handleEdit(row)"/>
          <IconButton v-if="row.status === '未启用'" content="启用" icon-name="Check"
                      @click="handleEnable(row)"/>
          <IconButton v-if="row.status === '已启用'" content="停用" icon-name="CircleClose"
                      @click="handleDisable(row)"/>
        </div>
      </template>
    </Grid>
  </div>
</template>
