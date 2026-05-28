<script setup lang="ts">
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { AlertConfigApi } from '#/api/iot/alert/config';

import { Page, useVbenModal } from '@vben/common-ui';

import { ElMessage, ElTag } from 'element-plus';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteAlertConfig, getAlertConfigPage } from '#/api/iot/alert/config';
import { $t } from '#/locales';

import AlertConfigForm from '../modules/alert-config-form.vue';
import { useGridColumns, useGridFormSchema } from './data';

defineOptions({ name: 'IoTAlertConfig' });

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: AlertConfigForm,
  destroyOnClose: true,
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

// 获取告警级别文本
function getLevelText(level?: number) {
  const levelMap: Record<number, string> = {
    1: '提示',
    2: '一般',
    3: '警告',
    4: '严重',
    5: '紧急',
  };
  return level ? levelMap[level] || `级别${level}` : '-';
}

// 获取告警级别颜色
function getLevelColor(level?: number): 'primary' | 'success' | 'warning' | 'danger' | 'info' {
  const colorMap: Record<number, 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
    1: 'info',
    2: 'success',
    3: 'warning',
    4: 'danger',
    5: 'primary',
  };
  return level ? colorMap[level] : 'info';
}

// 获取接收类型文本
function getReceiveTypeText(type?: number) {
  const typeMap: Record<number, string> = {
    1: '站内信',
    2: '邮箱',
    3: '短信',
    4: '微信',
    5: '钉钉',
  };
  return type ? typeMap[type] || `类型${type}` : '-';
}

/** 创建告警配置 */
function handleCreate() {
  formModalApi.setData(null).open();
}

/** 编辑告警配置 */
function handleEdit(row: AlertConfigApi.AlertConfig) {
  formModalApi.setData(row).open();
}

/** 删除告警配置 */
async function handleDelete(row: AlertConfigApi.AlertConfig) {
  const loadingInstance = ElMessage({
    message: $t('ui.actionMessage.deleting', [row.name]),
    duration: 0,
    type: 'info',
  });
  try {
    await deleteAlertConfig(row.id as number);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.name]));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
  },
  gridOptions: {
    columns: useGridColumns(),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getAlertConfigPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      refresh: true,
      search: true,
    },
  } as VxeTableGridOptions<AlertConfigApi.AlertConfig>,
});
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="handleRefresh" />
    <Grid table-title="告警配置列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: $t('ui.actionTitle.create', ['告警配置']),
              type: 'primary',
              icon: ACTION_ICON.ADD,
              onClick: handleCreate,
            },
          ]"
        />
      </template>

      <!-- 告警级别列 -->
      <template #level="{ row }">
        <el-tag :type="getLevelColor(row.level)" size="small">
          {{ getLevelText(row.level) }}
        </el-tag>
      </template>

      <!-- 关联场景联动规则列 -->
      <template #sceneRules="{ row }">
        <span>{{ row.sceneRuleIds?.length || 0 }} 条</span>
      </template>

      <!-- 接收类型列 -->
      <template #receiveTypes="{ row }">
        <el-tag
          v-for="(type, index) in row.receiveTypes"
          :key="index"
          size="small"
          class="receive-type-tag"
        >
          {{ getReceiveTypeText(type) }}
        </el-tag>
      </template>

      <!-- 操作列 -->
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: $t('common.edit'),
              type: 'link',
              icon: ACTION_ICON.EDIT,
              onClick: handleEdit.bind(null, row),
            },
            {
              label: $t('common.delete'),
              type: 'link',
              danger: true,
              icon: ACTION_ICON.DELETE,
              popConfirm: {
                title: $t('ui.actionMessage.deleteConfirm', [row.name]),
                confirm: handleDelete.bind(null, row),
              },
            },
          ]"
        />
      </template>
    </Grid>
  </Page>
</template>

<style scoped>
.receive-type-tag {
  margin-right: 4px;
}

.receive-type-tag:last-child {
  margin-right: 0;
}

/* 确保表格容器正常显示 */
:deep(.vxe-grid--form-wrapper) {
  display: block;
}
</style>
