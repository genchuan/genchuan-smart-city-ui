<script setup>
import {computed, reactive, ref, watch, nextTick} from 'vue';
import {confirm, useVbenDrawer} from '@vben/common-ui';
import {ElLoading, ElMessage, ElMessageBox} from 'element-plus';
import screenfull from 'screenfull';
import {useVbenForm} from '#/adapter/form';
import {useVbenVxeGrid} from '#/adapter/vxe-table';
import {downloadFileFromBlobPart} from '@vben/utils';
import EnterpriseDetailDrawer from './components/enterpriseDetail.vue';
import {
  getCoopEnterprisePage,
  createCoopEnterprise,
  maintainCoopEnterprise,
  updateCoopEnterprise,
  exportCoopEnterprise,
  getCoopEnterpriseDetail,
  getDeptOptions,
} from '#/api/genchuan/educationTeaching/studentMgmt/employMgmt/coopEnterprise/data.js';
import {
  textObj,
  useFormSchema,
  getColumns,
  useCreateFormSchema,
  useMaintainFormSchema,
} from '#/api/genchuan/educationTeaching/studentMgmt/employMgmt/coopEnterprise/form.js';

// 辅助函数：状态标签类型
const getStatusType = (status) => {
  const map = {
    '合作中': 'success',
    '已结束': 'info',
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

// 加载系部选项
const deptOptions = ref([]);
const loadDeptOptions = async () => {
  const res = await getDeptOptions();
  deptOptions.value = res;
  // 数据加载完成后，更新查询表单和创建表单中 deptId 字段的 options
  updateDeptOptionsInForms();
};
loadDeptOptions();

// 根据 deptId 获取系部名称
const getDeptNameById = (deptId) => {
  if (!deptId) return '-';
  const found = deptOptions.value.find(opt => opt.value === deptId);
  return found ? found.label : String(deptId);
};

// 统一更新表单中的 deptId options
const updateDeptOptionsInForms = () => {
  const options = deptOptions.value;
  // 更新查询表单
  if (queryFormApi) {
    queryFormApi.updateSchema([
      {
        fieldName: 'deptId',
        componentProps: {options},
      },
    ]);
  }
  // 更新创建/编辑表单
  if (createFormApi) {
    createFormApi.updateSchema([
      {
        fieldName: 'deptId',
        componentProps: {options},
      },
    ]);
  }
};

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
    enterpriseType: '企业类型',
    deptId: '负责系部',
    status: '状态',
    creator: '创建人',
    createTime: '创建时间',
    enterpriseName: '企业名称',
  };
  return map[field] || field;
}

function getTagDisplayText(field, value) {
  if (Array.isArray(value)) return value.join('、');
  if (field === 'deptId') {
    return getDeptNameById(value);
  }
  return value || '-';
}

// ---------- 抽屉组件 ----------
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => drawerApi.close(),
});

const [MaintainDrawer, maintainDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => maintainDrawerApi.close(),
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
const maintainIds = ref([]);      // 待维护的ID列表

const getTableData = async ({ page }) => {
  dataObj.loading = true;
  try {
    const params = {
      ...searchParams.value,
      pageNo: page.currentPage,
      pageSize: page.pageSize,
    };

    const res = await getCoopEnterprisePage(params);

    let filtered = res.list;

    // 应用标签筛选
    Object.entries(tagFilters.value).forEach(([field, filterValue]) => {
      filtered = filtered.filter((item) => {
        let itemValue;
        switch (field) {
          case 'enterpriseType':
            itemValue = item.enterpriseType;
            break;
          case 'deptId':
            itemValue = item.deptId;
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
          case 'enterpriseName':
            itemValue = item.enterpriseName;
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

    ElMessage.error('获取合作企业列表失败，请检查网络或联系管理员');
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
      const data = await exportCoopEnterprise(searchParams.value);
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

// 批量维护
async function handleBatchMaintain() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一个合作企业');
    return;
  }
  const cooperatingRows = checkedRows.value.filter(row => row.status === '合作中');
  if (cooperatingRows.length === 0) {
    ElMessage.warning('请选择状态为【合作中】的企业进行维护');
    return;
  }
  maintainIds.value = cooperatingRows.map(row => row.id);
  maintainFormApi.resetForm();
  maintainDrawerApi.open();
}

// 建档
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

// 单行维护
async function handleMaintain(row) {
  if (row.status !== '合作中') {
    ElMessage.warning('只有合作中的企业可以维护');
    return;
  }
  maintainIds.value = [row.id];
  maintainFormApi.resetForm();
  maintainDrawerApi.open();
}

// 建档/编辑表单
const [CreateForm, createFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: isEditMode.value ? '保存中...' : '建档中...'});
    try {
      let res;
      if (isEditMode.value) {
        // 编辑时传递 status（表单中已包含）
        res = await updateCoopEnterprise({...values, id: currentEditId.value});
      } else {
        // 新增时确保 status 字段存在（表单中已有，但以防万一）
        const submitData = {...values, status: values.status || '合作中'};
        res = await createCoopEnterprise(submitData);
      }
      if (res && res !== false) {
        ElMessage.success(isEditMode.value ? '编辑成功' : '建档成功');
        createDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error(isEditMode.value ? '编辑失败' : '建档失败');
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
          const detail = await getCoopEnterpriseDetail({id: currentEditId.value});
          await createFormApi.setValues({
            enterpriseName: detail.enterpriseName,
            enterpriseType: detail.enterpriseType,
            deptId: detail.deptId,
            contactUser: detail.contactUser,
            contactPhone: detail.contactPhone,
            coopStartTime: detail.coopStartTime,
            status: detail.status,
            remark: detail.remark,
          });
        } catch (error) {
          console.error('加载详情失败', error);
          ElMessage.error('加载详情失败，请检查网络或联系管理员');
          createDrawerApi.close(); // 加载失败则关闭抽屉
        }
      } else {
        // 新增模式：设置默认状态为“合作中”
        await createFormApi.setValues({status: '合作中'});
      }
    }
  },
});

// 维护表单
const [MaintainForm, maintainFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: '维护中...'});
    try {
      const res = await maintainCoopEnterprise({ids: maintainIds.value, ...values});
      if (res && res !== false) {
        ElMessage.success('维护成功');
        maintainDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('维护失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useMaintainFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: {content: '保存'},
});

// 详情抽屉
const enterpriseDetailDrawerRef = ref(null);

function handleOpenDetail(row) {
  dataObj.detailObj = row;
  enterpriseDetailDrawerRef.value.open();
}

// 查询表单 - 获取 API 以便后续动态更新 options
const [QueryForm, queryFormApi] = useVbenForm({
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
    <EnterpriseDetailDrawer
      ref="enterpriseDetailDrawerRef"
      :detail-obj="dataObj.detailObj"
      :dept-options="deptOptions"
      @refresh="handleRefresh"
    />
    <Drawer title="搜索">
      <QueryForm/>
    </Drawer>
    <CreateDrawer :title="isEditMode ? textObj.editText : textObj.createText">
      <CreateForm/>
    </CreateDrawer>
    <MaintainDrawer :title="textObj.maintainText">
      <MaintainForm/>
    </MaintainDrawer>
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
          <IconButton content="建档" icon-name="Plus" @click="handleCreate"/>
          <IconButton content="维护" icon-name="EditPen" @click="handleBatchMaintain"/>
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
      <template #enterpriseName="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary" style="cursor: pointer;">
          {{ row.enterpriseName }}
        </el-text>
      </template>
      <template #enterpriseType="{ row }">
        <el-text @click="handleFilterTagClick('enterpriseType', row.enterpriseType)" type="primary"
                 style="cursor: pointer;">
          {{ row.enterpriseType }}
        </el-text>
      </template>
      <template #deptId="{ row }">
        <el-text @click="handleFilterTagClick('deptId', row.deptId)" type="primary"
                 style="cursor: pointer;">
          {{ getDeptNameById(row.deptId) }}
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
      <template #coopStartTime="{ row }">
        <el-text>{{ formatTimestamp(row.coopStartTime) }}</el-text>
      </template>
      <template #coopEndTime="{ row }">
        <el-text>{{ formatTimestamp(row.coopEndTime) }}</el-text>
      </template>
      <template #updateTime="{ row }">
        <el-text>{{ formatTimestamp(row.updateTime) }}</el-text>
      </template>

      <!-- 操作按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)"/>
          <IconButton v-if="row.status === '合作中'" content="编辑" icon-name="Edit"
                      @click="handleEdit(row)"/>
          <IconButton v-if="row.status === '合作中'" content="维护" icon-name="EditPen"
                      @click="handleMaintain(row)"/>
        </div>
      </template>
    </Grid>
  </div>
</template>
