<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { IoTOtaFirmwareApi } from '#/api/iot/ota/firmware';

import { useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { ElMessage } from 'element-plus';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteOtaFirmware, getOtaFirmwarePage } from '#/api/iot/ota/firmware';
import { $t } from '#/locales';

import OtaFirmwareForm from '../modules/ota-firmware-form.vue';
import { useGridColumns, useGridFormSchema } from './data';

defineOptions({ name: 'IoTOtaFirmware' });

const { push } = useRouter();

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
  formModalApi.setData({ type: 'create' }).open();
}

/** 编辑固件 */
function handleEdit(row: IoTOtaFirmwareApi.Firmware) {
  formModalApi.setData({ type: 'update', id: row.id }).open();
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

/** 查看固件详情 */
function handleDetail(row: IoTOtaFirmwareApi.Firmware) {
  push({ name: 'IoTOtaFirmwareDetail', params: { id: row.id } });
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
    <Grid table-title="固件列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: $t('ui.actionTitle.create', ['固件']),
              type: 'primary',
              icon: ACTION_ICON.ADD,
              onClick: handleCreate,
            },
          ]"
        />
      </template>

      <!-- 产品名称列 -->
      <template #product="{ row }">
        <span class="product-name">{{ row.productName || '未知产品' }}</span>
      </template>

      <!-- 固件文件列 -->
      <template #fileUrl="{ row }">
        <div
          v-if="row.fileUrl"
          class="download-link"
        >
          <IconifyIcon
            icon="ant-design:download-outlined"
            class="download-icon"
          />
          <a
            :href="row.fileUrl"
            target="_blank"
            download
            class="download-btn"
          >
            下载固件
          </a>
        </div>
        <span v-else class="no-file">无文件</span>
      </template>

      <!-- 操作列 -->
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: $t('common.detail'),
              type: 'link',
              icon: ACTION_ICON.VIEW,
              onClick: handleDetail.bind(null, row),
            },
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
.product-name {
  color: #4b5563;
}

.download-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  vertical-align: middle;
  line-height: 1;
}

.download-icon {
  flex-shrink: 0;
  vertical-align: middle;
  font-size: 16px;
  color: #409eff;
}

.download-btn {
  cursor: pointer;
  vertical-align: middle;
  color: #409eff;
  text-decoration: none;
}

.download-btn:hover {
  text-decoration: underline;
}

.no-file {
  color: #c0c4cc;
}

/* 确保表格容器正常显示 */
:deep(.vxe-grid--form-wrapper) {
  display: block;
}
</style>
