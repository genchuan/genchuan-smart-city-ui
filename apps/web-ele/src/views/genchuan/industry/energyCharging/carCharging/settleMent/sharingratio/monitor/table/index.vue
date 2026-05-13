<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>

    <ParkDetailDrawer
      ref="parkDetailDrawerRef"
      :detail-obj="dataObj.detailObj"
    />

    <Drawer title="搜索">
      <QueryForm class="query-form" />
      <template #footer>
        <div style="display: flex; justify-content: flex-end; gap: 12px;">
          <el-button @click="handleReset">重置</el-button>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </div>
      </template>
    </Drawer>

    <Grid>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExport"
          />
          <IconButton
            content="搜索"
            icon-name="search"
            @click="handleSerachShow"
          />
          <IconButton
            :content="props.arrowShow ? '收缩' : '展开'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
        </div>
      </template>

      <template #sharingCode="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.sharingCode }}
        </el-text>
      </template>

      <template #cooperator="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.cooperator }}
        </el-text>
      </template>

      <template #sharingStatus="{ row }">
        <el-tag :type="getSharingStatusType(row.sharingStatus)">
          {{ row.sharingStatus }}
        </el-tag>
      </template>

      <template #sharingType="{ row }">
        <el-tag :type="getSharingTypeTagType(row.sharingType)" effect="plain">
          {{ getSharingTypeText(row.sharingType) }}
        </el-tag>
      </template>

      <template #amount="{ row }">
        <span class="common-align">
          {{ row.sharingRatio || 0 }}%
        </span>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
          <IconButton
            content="编辑"
            icon-name="edit"
            @click="handleEdit(row)"
          />
          <IconButton
            v-if="row.sharingStatus !== '已生效'"
            content="生效"
            icon-name="Check"
            color="#67C23A"
            @click="handleEnable(row)"
          />
          <IconButton
            v-if="row.sharingStatus === '已生效'"
            content="失效"
            icon-name="Close"
            color="#F56C6C"
            @click="handleDisable(row)"
          />
          <IconButton
            content="复制"
            icon-name="CopyDocument"
            @click="handleCopy(row)"
          />
        </div>
      </template>

      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon" v-if="!dataObj.totalShow">
            <ArrowDown />
          </el-icon>
          <el-icon class="tabel-tab-icon" v-if="dataObj.totalShow">
            <ArrowUp />
          </el-icon>
          <span> 全部统计：{{ dataObj.total }}条 </span>
        </div>
      </template>
    </Grid>
  </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';
import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';
import axios from 'axios';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';

import {
  getSharingRatioPage,
  createSharingRatio,
  updateSharingRatio,
  deleteSharingRatio,
  batchDeleteSharingRatio,
  enableSharingRatio,
  disableSharingRatio,
  getSharingRatio,
  copySharingRatio,
} from '#/api/genchuan/industry/energyCharging/carCharging/settlement/sharingratio/index.js';

import ParkDetailDrawer from './detail.vue';

// ==================== 分账类型字典映射 ====================
const sharingTypeOptions = [
  { label: '固定比例', value: 'fixed_ratio' },
  { label: '阶梯比例', value: 'step_ratio' },
  { label: '保底分成', value: 'guaranteed_split' },
  { label: '封顶分成', value: 'capped_split' },
];

const getSharingTypeText = (type) => {
  const option = sharingTypeOptions.find(opt => opt.value === type);
  return option ? option.label : type || '-';
};

const getSharingTypeTagType = (type) => {
  const typeMap = {
    'fixed_ratio': 'primary',
    'step_ratio': 'success',
    'guaranteed_split': 'warning',
    'capped_split': 'info',
  };
  return typeMap[type] || 'info';
};

// ==================== 分账状态辅助函数 ====================
const getSharingStatusType = (status) => {
  const typeMap = {
    '未生效': 'info',
    '已生效': 'success',
    '已失效': 'danger',
  };
  return typeMap[status] || 'info';
};

// ==================== 表单配置 ====================
function useFormSchema() {
  return [
    {
      fieldName: 'sharingCode',
      label: '方案编号',
      component: 'Input',
      componentProps: { placeholder: '请输入方案编号' },
      rules: 'required',
    },
    {
      fieldName: 'sharingName',
      label: '方案名称',
      component: 'Input',
      componentProps: { placeholder: '请输入方案名称' },
      rules: 'required',
    },
    {
      fieldName: 'cooperator',
      label: '合作方',
      component: 'Input',
      componentProps: { placeholder: '请输入合作方名称' },
      rules: 'required',
    },
    {
      fieldName: 'sharingType',
      label: '分账类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择分账类型',
        options: sharingTypeOptions,
        clearable: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'sharingRatio',
      label: '分账比例(%)',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入分账比例',
        min: 0,
        max: 100,
        precision: 2,
        controlsPosition: 'right',
      },
      rules: 'required',
    },
    {
      fieldName: 'effectTime',
      label: '生效时间',
      component: 'DatePicker',
      componentProps: {
        type: 'datetime',
        placeholder: '请选择生效时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
      },
      rules: 'required',
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Input',
      componentProps: {
        placeholder: '请输入备注',
        type: 'textarea',
        rows: 3,
      },
    },
  ];
}

// ==================== 表格字段配置 ====================
function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'sharingCode',
      title: '方案编号',
      minWidth: 150,
      sortable: true,
      slots: { default: 'sharingCode' },
    },
    {
      field: 'sharingName',
      title: '方案名称',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'cooperator',
      title: '合作方',
      minWidth: 150,
      sortable: true,
      slots: { default: 'cooperator' },
    },
    {
      field: 'sharingType',
      title: '分账类型',
      minWidth: 120,
      sortable: true,
      slots: { default: 'sharingType' },
    },
    {
      field: 'sharingRatio',
      title: '分账比例(%)',
      minWidth: 120,
      sortable: true,
      slots: { default: 'amount' },
    },
    {
      field: 'sharingStatus',
      title: '分账状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'sharingStatus' },
    },
    {
      field: 'effectTime',
      title: '生效时间',
      minWidth: 180,
      sortable: true,
      formatter: ({ cellValue }) => cellValue ? new Date(cellValue).toLocaleString() : '-',
    },
    {
      field: 'expireTime',
      title: '失效时间',
      minWidth: 180,
      sortable: true,
      formatter: ({ cellValue }) => cellValue ? new Date(cellValue).toLocaleString() : '-',
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 150,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 180,
      sortable: true,
      formatter: ({ cellValue }) => cellValue ? new Date(cellValue).toLocaleString() : '-',
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

// ==================== Props & Emits ====================
const props = defineProps({
  secondShow: { type: Boolean, default: false },
  arrowShow: { type: Boolean, default: false },
  arrowState: { type: Boolean, default: false },
});

const emit = defineEmits(['arrow-change']);

// ==================== 表单实例 ====================
const formData = ref();
const [Form, formApi] = useVbenForm({
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

const getTitle = computed(() => {
  return formData.value?.id ? '编辑分账方案' : '新增分账方案';
});

// ==================== 抽屉配置 ====================
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() { drawerApi.close(); },
  onConfirm() {},
});

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  title: getTitle,
  onCancel() {
    formDrawerApi.close();
  },
  async onConfirm() {
    // 获取表单值
    const obj = formApi.form.values;
    const payload = formDrawerApi.getData();

    // 检查必填字段
    if (!obj.sharingCode || !obj.sharingName || !obj.cooperator || !obj.sharingType || !obj.sharingRatio === undefined || !obj.effectTime) {
      ElMessage.warning('请填写所有必填项');
      return;
    }

    try {
      if (payload?.title === '新增') {
        await createSharingRatio(obj);
        ElMessage.success('新增成功');
      } else {
        await updateSharingRatio({ ...obj, id: formData.value?.id });
        ElMessage.success('编辑成功');
      }
      handleRefresh();
      formDrawerApi.close();
    } catch (error) {
      console.error('操作失败:', error);
      ElMessage.error(error?.message || '操作失败');
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = formDrawerApi.getData();
      formData.value = data;

      if (data?.id) {
        try {
          const detail = await getSharingRatio({ id: data.id });
          await formApi.setValues(detail);
        } catch (error) {
          console.error('获取详情失败:', error);
          ElMessage.error('获取详情失败');
        }
      } else {
        formApi.resetForm();
      }
    }
  },
});

// ==================== 数据获取 ====================
const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: 0,
  searchParams: {},
});

// 构建查询参数
const buildQueryParams = () => {
  const params = { ...dataObj.searchParams };
  Object.keys(params).forEach(key => {
    if (params[key] === '' || params[key] === null || params[key] === undefined) {
      delete params[key];
    }
  });
  return params;
};

// 获取表格数据
const getTableData = async ({ page }) => {
  try {
    const params = {
      pageNum: page?.currentPage || 1,
      pageSize: page?.pageSize || 10,
      ...buildQueryParams(),
    };

    const response = await getSharingRatioPage(params);

    let records = [];
    let total = 0;

    if (response) {
      if (response.list && Array.isArray(response.list)) {
        records = response.list;
        total = response.total || records.length;
      } else if (response.records && Array.isArray(response.records)) {
        records = response.records;
        total = response.total || records.length;
      } else if (response.data && response.data.list) {
        records = response.data.list;
        total = response.data.total || records.length;
      } else if (Array.isArray(response)) {
        records = response;
        total = response.length;
      }
    }

    dataObj.total = total;

    return { records, total };
  } catch (error) {
    console.error('获取数据失败:', error);
    ElMessage.error('获取数据失败');
    return { records: [], total: 0 };
  }
};

// 搜索表单
const [QueryForm] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: [
    {
      fieldName: 'sharingCode',
      label: '方案编号',
      component: 'Input',
      componentProps: { placeholder: '请输入方案编号' },
    },
    {
      fieldName: 'sharingName',
      label: '方案名称',
      component: 'Input',
      componentProps: { placeholder: '请输入方案名称' },
    },
    {
      fieldName: 'cooperator',
      label: '合作方',
      component: 'Input',
      componentProps: { placeholder: '请输入合作方' },
    },
    {
      fieldName: 'sharingType',
      label: '分账类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择分账类型',
        options: [
          { label: '全部', value: '' },
          ...sharingTypeOptions,
        ],
        clearable: true,
      },
    },
    {
      fieldName: 'sharingStatus',
      label: '分账状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择分账状态',
        options: [
          { label: '全部', value: '' },
          { label: '未生效', value: '未生效' },
          { label: '已生效', value: '已生效' },
          { label: '已失效', value: '已失效' },
        ],
        clearable: true,
      },
    },
  ],
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
});

// Grid 配置
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: {
      enabled: true,
      ajax: { query: getTableData },
      response: {
        result: 'records',
        total: 'total',
      },
    },
    rowConfig: { keyField: 'id', isHover: true },
    pagerConfig: {
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 20, 50, 100],
      total: 0,
    },
    toolbarConfig: { refresh: true },
    showOverflow: true,
  },
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
  showSearchForm: false,
});

// ==================== 业务逻辑 ====================
const checkedIds = ref([]);

function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}

function handleRefresh() {
  gridApi.query();
}

function handleCreate() {
  formDrawerApi.setData({ title: '新增' }).open();
}

function handleEdit(row) {
  formDrawerApi.setData({ title: '编辑', ...row }).open();
}

async function handleDelete(row) {
  try {
    await confirm(`确定删除方案"${row.sharingName}"吗？`);
    const loadingInstance = ElLoading.service({ text: '删除中...' });
    try {
      await deleteSharingRatio({ id: row.id });
      ElMessage.success('删除成功');
      handleRefresh();
    } finally {
      loadingInstance.close();
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error);
      ElMessage.error('删除失败');
    }
  }
}

async function handleDeleteBatch() {
  if (isEmpty(checkedIds.value)) {
    ElMessage.warning('请选择要删除的数据');
    return;
  }
  try {
    await confirm(`确定删除选中的${checkedIds.value.length}条数据吗？`);
    const loadingInstance = ElLoading.service({ text: '批量删除中...' });
    try {
      await batchDeleteSharingRatio({ ids: checkedIds.value });
      ElMessage.success('批量删除成功');
      checkedIds.value = [];
      handleRefresh();
    } finally {
      loadingInstance.close();
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除失败:', error);
      ElMessage.error('批量删除失败');
    }
  }
}

async function handleEnable(row) {
  try {
    await confirm(`确定生效方案"${row.sharingName}"吗？`);
    const loadingInstance = ElLoading.service({ text: '生效中...' });
    try {
      await enableSharingRatio({ id: row.id });
      ElMessage.success('生效成功');
      handleRefresh();
    } finally {
      loadingInstance.close();
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('生效失败:', error);
      ElMessage.error('生效失败');
    }
  }
}

async function handleDisable(row) {
  try {
    await confirm(`确定失效方案"${row.sharingName}"吗？`);
    const loadingInstance = ElLoading.service({ text: '失效中...' });
    try {
      await disableSharingRatio({ id: row.id });
      ElMessage.success('失效成功');
      handleRefresh();
    } finally {
      loadingInstance.close();
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('失效失败:', error);
      ElMessage.error('失效失败');
    }
  }
}

async function handleCopy(row) {
  try {
    await confirm(`确定复制方案"${row.sharingName}"吗？`);
    const loadingInstance = ElLoading.service({ text: '复制中...' });
    try {
      await copySharingRatio({ id: row.id });
      ElMessage.success('复制成功');
      handleRefresh();
    } finally {
      loadingInstance.close();
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('复制失败:', error);
      ElMessage.error('复制失败');
    }
  }
}

// ==================== 导出功能 ====================
async function handleExport() {
  const loadingInstance = ElLoading.service({ text: '导出中...' });
  try {
    const params = buildQueryParams();
    const token = localStorage.getItem('token') || '';
    const baseURL = import.meta.env.VITE_API_BASE_URL || '';

    const response = await axios({
      method: 'GET',
      url: `${baseURL}/vehiclecharging/sharing-ratio/export`,
      params: params,
      responseType: 'blob',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    const blob = response.data;

    // 检查是否为错误响应
    if (blob.type === 'application/json' || blob.type.includes('json')) {
      const errorText = await blob.text();
      try {
        const errorJson = JSON.parse(errorText);
        ElMessage.error('导出失败：' + (errorJson.message || '服务器错误'));
      } catch {
        ElMessage.error('导出失败：' + (errorText.substring(0, 100) || '服务器错误'));
      }
      return;
    }

    // 下载文件
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileName = `分账方案_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error(error?.message || '导出失败，请稍后重试');
  } finally {
    loadingInstance.close();
  }
}

// ==================== 其他方法 ====================
function onSubmit(values) {
  dataObj.searchParams = values;
  drawerApi.close();
  gridApi.query();
}

function handleReset() {
  dataObj.searchParams = {};
  if (QueryForm && QueryForm.resetForm) {
    QueryForm.resetForm();
  }
  gridApi.query();
}

const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

const handleOpenDetail = async (row) => {
  try {
    const loadingInstance = ElLoading.service({ text: '加载详情中...' });
    const detail = await getSharingRatio({ id: row.id });
    dataObj.detailObj = detail;
    parkDetailDrawerRef.value?.open();
    loadingInstance.close();
  } catch (error) {
    console.error('获取详情失败:', error);
    ElMessage.error('获取详情失败');
  }
};

const handleSerachShow = () => {
  drawerApi.open();
};

const handleFullShow = () => {
  if (screenfull.isEnabled) {
    screenfull.toggle();
  }
};

const arrowChange = () => {
  emit('arrow-change');
};

const parkDetailDrawerRef = ref(null);

onMounted(() => {
  console.log('分账比例管理页面启动');
  setTimeout(() => handleRefresh(), 100);
});
</script>

<style scoped>
.park-lot-table-new {
  height: 100%;
}
.common-toolbar-tools {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.table-toolbar-tools {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
.common-total {
  cursor: pointer;
  padding: 8px;
  text-align: center;
  border-top: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
.common-align {
  cursor: pointer;
}
</style>
