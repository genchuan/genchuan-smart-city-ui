<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

import { useFormSchema, useGridColumns } from './data';
import ParkDetailDrawer from './detail.vue';

import {
  getInterconnectionPage,
  applyInterconnection,
  auditInterconnection,
  closeInterconnection,
  exportInterconnectionExcel,
  getInterconnectionDetail,
  reapplyInterconnection,
  getInterconnectionChart,
  getInterconnectionStatusRatio,
  getInterconnectionCooperatorCount,
  getInterconnectionApplyCount,
} from '#/api/genchuan/industry/energyCharging/carCharging/stationEquipment/interconnection/index';

const props = defineProps({
  secondShow: { type: Boolean, default: false },
  arrowShow: { type: Boolean, default: false },
  arrowState: { type: Boolean, default: false },
});

const emit = defineEmits(['arrow-change']);

const getTitle = computed(() => (formData.value?.id ? '编辑' : '新增'));

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() { drawerApi.close(); },
});

const formData = ref();
const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() { formDrawerApi.close(); },
  async onConfirm() {
    const valid = await formApi.validate();
    if (!valid) return;

    const params = formApi.form.values;

    // 必传字段校验：connectType
    if (!params.connectType) {
      ElMessage.warning('请选择连接类型');
      return;
    }

    // 提交参数统一格式
    const submitParams = {
      ...params,
      connect_code: params.connectCode,
      connect_type: params.connectType,
    };

    const loading = ElLoading.service({ text: '提交中...' });

    try {
      if (formDrawerApi.sharedData.payload.title === '新增') {
        await applyInterconnection(submitParams);
        ElMessage.success('新增成功');
      } else {
        await reapplyInterconnection(submitParams);
        ElMessage.success('编辑成功');
      }
      handleRefresh();
      formDrawerApi.close();
    } catch (err) {
      ElMessage.error(err.message || '提交失败');
    } finally {
      loading.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
      if (formData.value?.id) {
        try {
          const detail = await getInterconnectionDetail({ id: formData.value.id });
          formApi.setValues(detail || {});
        } catch {
          formApi.setValues(formData.value);
        }
      } else {
        formApi.resetForm();
      }
    }
  },
});

// 刷新
function handleRefresh() {
  gridApi.query();
}

// 导出
async function handleExport() {
  const loading = ElLoading.service({ text: '导出中...' });
  try {
    const blob = await exportInterconnectionExcel();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `互联互通列表_${new Date().getTime()}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
    ElMessage.success('导出成功');
  } catch (err) {
    ElMessage.error(err.message || '导出失败');
  } finally {
    loading.close();
  }
}

// 新增
function handleCreate() {
  formDrawerApi.setData({ title: '新增' }).open();
}

// 编辑
function handleEdit(row) {
  formDrawerApi.setData({ title: '编辑', ...row }).open();
}

// 关闭
async function handleDelete(row) {
  await confirm($t('确定关闭【{name}】吗？', { name: row.thirdPlatform || row.name }));
  const loading = ElLoading.service({ text: '关闭中...' });
  try {
    await closeInterconnection({ id: row.id });
    ElMessage.success('关闭成功');
    handleRefresh();
  } catch (err) {
    ElMessage.error(err.message || '关闭失败');
  } finally {
    loading.close();
  }
}

// 批量关闭
async function handleDeleteBatch() {
  if (isEmpty(checkedIds.value)) {
    ElMessage.warning('请选择数据');
    return;
  }
  await confirm($t('确定关闭选中的数据吗？'));
  const loading = ElLoading.service({ text: '批量关闭中...' });
  try {
    const promiseList = checkedIds.value.map(id => closeInterconnection({ id }));
    await Promise.all(promiseList);
    checkedIds.value = [];
    ElMessage.success('批量关闭成功');
    handleRefresh();
  } catch (err) {
    ElMessage.error(err.message || '批量关闭失败');
  } finally {
    loading.close();
  }
}

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map(item => item.id);
}

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
});

// 获取表格数据
const getTableData = async (pageObj) => {
  try {
    const { page } = pageObj;
    const formValues = formQueryApi?.form?.values || {};
    const queryParams = {
      current: page.currentPage,
      size: page.pageSize,
      ...formValues,
      connect_code: formValues.connectCode,
      connect_type: formValues.connectType,
    };
    const res = await getInterconnectionPage(queryParams);
    return {
      total: res?.total || 0,
      list: res?.list || [],
    };
  } catch {
    return { total: 0, list: [] };
  }
};

// 查询表单
const [QueryForm, formQueryApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: () => {
    drawerApi.close();
    handleRefresh();
  },
  layout: 'horizontal',
  schema: useFormSchema().map(v => {
    delete v.rules;
    return v;
  }),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
});

// 表格
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: { query: getTableData },
    },
    rowConfig: { keyField: 'id', isHover: true },
    toolbarConfig: { refresh: true, search: true },
    showOverflow: true,
  },
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
  showSearchForm: false,
});

const parkDetailDrawerRef = ref(null);

// 详情
async function handleOpenDetail(row) {
  try {
    const detail = await getInterconnectionDetail({ id: row.id });
    dataObj.detailObj = detail || row;
  } catch {
    dataObj.detailObj = row;
  }
  parkDetailDrawerRef.value?.open();
}

function arrowChange() { emit('arrow-change'); }
function handleSerachShow() { drawerApi.open(); }
function handleFullShow() { screenfull.toggle(); }
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>

    <ParkDetailDrawer ref="parkDetailDrawerRef" :detail-obj="dataObj.detailObj" />

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <Grid>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
          <IconButton content="导出" icon-name="download" @click="handleExport" />
          <IconButton
            content="批量关闭"
            icon-name="delete"
            color="#F56C6C"
            :disabled="isEmpty(checkedIds)"
            @click="handleDeleteBatch"
          />
          <IconButton content="搜索" icon-name="search" @click="handleSerachShow" />
          <IconButton
            :content="arrowShow ? '收缩' : '展开'"
            :icon-name="arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <template #code="{ row }">
        <el-text @click="handleOpenDetail(row)" class="common-align" type="primary">{{ row.connectCode }}</el-text>
      </template>
      <template #plat_name="{ row }">
        <el-text @click="handleOpenDetail(row)" class="common-align" type="primary">{{ row.thirdPlatform }}</el-text>
      </template>
      <template #type="{ row }">
        <el-text @click="handleOpenDetail(row)" class="common-align" type="primary">{{ row.connectType }}</el-text>
      </template>
      <template #sync_freq="{ row }">
        <el-text @click="handleOpenDetail(row)" class="common-align" type="primary">{{ row.syncFreq }}</el-text>
      </template>
      <template #sync_rate="{ row }">
        <el-text @click="handleOpenDetail(row)" class="common-align" type="primary">{{ row.syncSuccessRate }}</el-text>
      </template>
      <template #sync_error="{ row }">
        <el-text @click="handleOpenDetail(row)" class="common-align" type="primary">{{ row.syncError }}</el-text>
      </template>
      <template #status="{ row }">
        <el-text @click="handleOpenDetail(row)" class="common-align" type="primary">{{ row.connectStatus }}</el-text>
      </template>
      <template #create_time="{ row }">
        <el-text @click="handleOpenDetail(row)" class="common-align" type="primary">{{ row.createTime }}</el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)" />
          <IconButton content="编辑" icon-name="edit" @click="handleEdit(row)" />
          <IconButton content="关闭" icon-name="delete" color="#F56C6C" @click="handleDelete(row)" />
        </div>
      </template>

      <template #bottom>
        <div class="common-total" @click="() => dataObj.totalShow = !dataObj.totalShow">
          <el-icon class="tabel-tab-icon">
            <ArrowDown v-if="!dataObj.totalShow" />
            <ArrowUp v-else />
          </el-icon>
          <span>全部统计：{{ gridApi?.gridProps?.total || 0 }}条</span>
        </div>
      </template>
    </Grid>
  </div>
</template>

<style scoped>
.park-lot-table-new {
  width: 100%;
  height: 100%;
}
.common-toolbar-tools {
  display: flex;
  gap: 8px;
}
.table-toolbar-tools {
  display: flex;
  gap: 4px;
}
.common-align {
  cursor: pointer;
}
.common-total {
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}
.query-form {
  padding: 16px;
}
</style>
