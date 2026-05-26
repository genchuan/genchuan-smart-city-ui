<script setup lang="ts">
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { IoTOtaFirmwareApi } from '#/api/iot/ota/firmware';

import { Page, useVbenModal } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteOtaFirmware, getOtaFirmwarePage } from '#/api/iot/ota/firmware';
import { $t } from '#/locales';

import { useGridColumns, useGridFormSchema } from './data';
import OtaFirmwareForm from './modules/ota-firmware-form.vue';

defineOptions({ name: 'IoTOtaFirmware' });

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: OtaFirmwareForm,
  destroyOnClose: true,
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 创建固件 */
function handleCreate() {
  formModalApi.setData(null).open();
}

/** 编辑固件 */
function handleEdit(row: IoTOtaFirmwareApi.Firmware) {
  formModalApi.setData(row).open();
}

/** 删除固件 */
async function handleDelete(row: IoTOtaFirmwareApi.Firmware) {
  const loadingInstance = ElMessage({
    message: $t('ui.actionMessage.deleting', [row.name]),
    duration: 0,
    type: 'info',
  });
  try {
    await deleteOtaFirmware(row.id as number);
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
          return await getOtaFirmwarePage({
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
  } as VxeTableGridOptions<IoTOtaFirmwareApi.Firmware>,
});
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="handleRefresh" />
    <Grid table-title="OTA 固件列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: $t('ui.actionTitle.create', ['固件']),
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['iot:ota-firmware:create'],
              onClick: handleCreate,
            },
          ]"
        />
      </template>
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: $t('common.edit'),
              type: 'link',
              icon: ACTION_ICON.EDIT,
              auth: ['iot:ota-firmware:update'],
              onClick: handleEdit.bind(null, row),
            },
            {
              label: $t('common.delete'),
              type: 'link',
              danger: true,
              icon: ACTION_ICON.DELETE,
              auth: ['iot:ota-firmware:delete'],
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
/* 确保表格容器正常显示 */
:deep(.vxe-grid--form-wrapper) {
  display: block;
}
</style>
