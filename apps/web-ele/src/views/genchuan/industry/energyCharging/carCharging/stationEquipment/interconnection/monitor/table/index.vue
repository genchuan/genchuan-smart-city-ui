<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';

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
} from '#/api/genchuan/industry/energyCharging/carCharging/stationEquipment/interconnection/index';

const props = defineProps({
  secondShow: { type: Boolean, default: false },
  arrowShow: { type: Boolean, default: false },
  arrowState: { type: Boolean, default: false },
});

const emit = defineEmits(['arrow-change']);

const getTitle = computed(() => (formData.value?.id ? '编辑' : '新增'));

// 第三方平台筛选
const activePlatform = ref('');

const handlePlatformFilter = (platform) => {
  activePlatform.value = activePlatform.value === platform ? '' : platform;
  handleRefresh();
};

const closePlatformFilter = () => {
  activePlatform.value = '';
  handleRefresh();
};

// 时间格式化
const formatDateTime = (time) => {
  if (!time) return '';
  const date = new Date(time);
  if (isNaN(date.getTime())) return '';

  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  const hh = date.getHours().toString().padStart(2, '0');
  const mm = date.getMinutes().toString().padStart(2, '0');
  const ss = date.getSeconds().toString().padStart(2, '0');

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
};

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
    labelWidth: 120,
  },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  footer: true,
  showCancelButton: true,
  showConfirmButton: true,
  confirmText: '确认',
  cancelText: '取消',
  onCancel() { formDrawerApi.close(); },
  async onConfirm() {
    const valid = await formApi.validate();
    if (!valid) return;

    const params = formApi.form.values;
    const submitParams = { ...params };

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

function handleRefresh() {
  gridApi.query();
}

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

function handleCreate() {
  formDrawerApi.setData({ title: '新增' }).open();
}

function handleEdit(row) {
  formDrawerApi.setData({ title: '编辑', ...row }).open();
}

// 关闭按钮 - 确认后切换状态为已关闭
async function handleClose(row) {
  await confirm(`确定关闭【${row.connectCode}】吗？关闭后对接状态将变为"已关闭"`);
  const loading = ElLoading.service({ text: '关闭中...' });
  try {
    await closeInterconnection({ id: row.id });
    ElMessage.success('关闭成功，对接状态已更新为"已关闭"');
    handleRefresh();
  } catch (err) {
    ElMessage.error(err.message || '关闭失败');
  } finally {
    loading.close();
  }
}

// 批量关闭
async function handleBatchClose() {
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
    ElMessage.success('批量关闭成功，对接状态已更新为"已关闭"');
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

const getTableData = async (pageObj) => {
  try {
    const { page } = pageObj;
    const formValues = formQueryApi?.form?.values || {};
    const queryParams = {
      current: page.currentPage,
      size: page.pageSize,
      ...formValues,
      ...(activePlatform.value && { thirdPlatform: activePlatform.value }),
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

const [QueryForm, formQueryApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 130,
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

async function handleOpenDetail(row) {
  try {
    const detail = await getInterconnectionDetail({ id: row.id });
    dataObj.detailObj = detail || row;
  } catch {
    dataObj.detailObj = row;
  }
  parkDetailDrawerRef.value?.open();
}

// ==================== 审核功能（完整版） ====================
// 审核通过 -> 状态变为"已开通"
// 审核驳回 -> 状态变为"已关闭"
async function handleAudit(row) {
  try {
    // 第一步：选择通过或驳回
    const { value: action } = await ElMessageBox.confirm(
      `请审核平台【${row.thirdPlatform}】的互联互通申请`,
      '互联互通审核',
      {
        distinguishCancelAndClose: true,
        confirmButtonText: '通过',
        cancelButtonText: '驳回',
        type: 'warning',
      }
    );

    let auditRemark = '';
    let connectStatus = '';

    if (action === 'confirm') {
      // 审核通过
      connectStatus = '已开通';
      // 可选：通过时也可以填写备注
      try {
        const { value: remark } = await ElMessageBox.prompt(
          '审核备注（选填）',
          '审核通过',
          {
            confirmButtonText: '确认通过',
            cancelButtonText: '跳过',
            inputType: 'textarea',
            inputPlaceholder: '请输入审核备注，选填',
            inputValidator: () => true, // 选填，不做校验
          }
        );
        if (remark) auditRemark = remark;
      } catch {
        // 用户点击跳过，继续执行
      }
    } else if (action === 'cancel') {
      // 审核驳回 - 必须填写驳回原因，状态改为"已关闭"
      try {
        const { value: reason } = await ElMessageBox.prompt(
          '请输入驳回原因',
          '审核驳回',
          {
            confirmButtonText: '确认驳回',
            cancelButtonText: '取消',
            inputType: 'textarea',
            inputPlaceholder: '请输入驳回原因（必填）',
            inputValidator: (value) => {
              if (!value || !value.trim()) {
                return '驳回原因不能为空';
              }
              return true;
            },
          }
        );
        auditRemark = reason;
        connectStatus = '已关闭';
      } catch {
        return; // 用户取消驳回操作
      }
    } else {
      return; // 关闭弹窗
    }

    const loading = ElLoading.service({
      text: connectStatus === '已开通' ? '审核通过中...' : '驳回处理中...'
    });

    try {
      await auditInterconnection({
        id: row.id,
        connectStatus: connectStatus,
        auditRemark: auditRemark,
      });
      ElMessage.success(
        connectStatus === '已开通'
          ? '审核通过成功，对接状态已更新为"已开通"'
          : '驳回成功，对接状态已更新为"已关闭"'
      );
      handleRefresh();
    } catch (err) {
      console.error('审核接口报错详情：', err);
      ElMessage.error(err.message || '审核失败');
    } finally {
      loading.close();
    }
  } catch (err) {
    if (err !== 'cancel') {
      console.error('审核过程出错：', err);
    }
  }
}
// ==================================================

function arrowChange() { emit('arrow-change'); }
function handleSearchShow() { drawerApi.open(); }
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
      <template #table-title>
        <div class="filter-tag-wrapper" v-if="activePlatform">
          <ElTag
            type="primary"
            closable
            @close="closePlatformFilter"
            class="filter-tag"
          >
            第三方平台：{{ activePlatform }}
          </ElTag>
        </div>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
          <IconButton content="导出" icon-name="download" @click="handleExport" />
          <IconButton
            content="批量关闭"
            icon-name="delete"
            color="#F56C6C"
            :disabled="isEmpty(checkedIds)"
            @click="handleBatchClose"
          />
          <IconButton content="搜索" icon-name="search" @click="handleSearchShow" />
          <IconButton
            :content="arrowShow ? '收缩' : '展开'"
            :icon-name="arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <template #connectCode="{ row }">
        <el-text @click="handleOpenDetail(row)" class="common-align" type="primary">{{ row.connectCode }}</el-text>
      </template>

      <template #thirdPlatform="{ row }">
        <el-text
          class="common-align platform-label"
          :class="{ active: activePlatform === row.thirdPlatform }"
          @click="handlePlatformFilter(row.thirdPlatform)"
          type="primary"
        >
          {{ row.thirdPlatform }}
        </el-text>
      </template>

      <template #connectType="{ row }">
        <el-text @click="handleOpenDetail(row)" class="common-align" type="primary">{{ row.connectType }}</el-text>
      </template>

      <template #syncFreq="{ row }">
        <el-text @click="handleOpenDetail(row)" class="common-align" type="primary">{{ row.syncFreq }} 分钟</el-text>
      </template>

      <template #syncSuccessRate="{ row }">
        <el-text @click="handleOpenDetail(row)" class="common-align" type="primary">{{ row.syncSuccessRate }}%</el-text>
      </template>

      <template #connectStatus="{ row }">
        <el-tag :type="row.connectStatus === '已开通' ? 'success' : row.connectStatus === '已关闭' ? 'danger' : 'info'">
          {{ row.connectStatus }}
        </el-tag>
      </template>

      <template #createTime="{ row }">
        <el-text @click="handleOpenDetail(row)" class="common-align" type="primary">
          {{ formatDateTime(row.createTime) }}
        </el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)" />
          <IconButton content="审核" icon-name="Check" @click="handleAudit(row)" />
          <IconButton
            content="关闭"
            icon-name="Close"
            color="#F56C6C"
            @click="handleClose(row)"
          />
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
.filter-tag-wrapper {
  padding: 0 16px 8px;
}
.filter-tag {
  font-size: 13px;
}
.platform-label.active {
  font-weight: bold;
  color: #096dd9 !important;
  text-decoration: underline;
}
</style>
