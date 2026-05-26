<script setup lang="ts">
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { AlertRecord } from '#/api/iot/alert/record';

import { h, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { ElButton, ElMessage, ElMessageBox, ElPopover, ElTag } from 'element-plus';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getAlertRecordPage, processAlertRecord } from '#/api/iot/alert/record';
import { getSimpleDeviceList } from '#/api/iot/device/device';
import { getSimpleProductList } from '#/api/iot/product/product';

import { useGridColumns, useGridFormSchema } from './data';

defineOptions({ name: 'IoTAlertRecord' });

const productList = ref<any[]>([]);
const deviceList = ref<any[]>([]);

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

// 加载产品和设备列表
async function loadData() {
  productList.value = await getSimpleProductList();
  deviceList.value = await getSimpleDeviceList();
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

// 获取产品名称
function getProductName(productId?: number) {
  if (!productId) return '-';
  const product = productList.value.find((p: any) => p.id === productId);
  return product?.name || '加载中...';
}

// 获取设备名称
function getDeviceName(deviceId?: number) {
  if (!deviceId) return '-';
  const device = deviceList.value.find((d: any) => d.id === deviceId);
  return device?.deviceName || '加载中...';
}

// 处理告警记录
async function handleProcess(row: AlertRecord) {
  let processRemark = '';

  await ElMessageBox.confirm(
    h('div', [
      h('p', { style: 'margin-bottom: 12px;' }, '请输入处理原因：'),
      h('textarea', {
        id: 'processRemark',
        class: 'el-textarea__inner',
        rows: 3,
        placeholder: '请输入处理原因',
        style: 'width: 100%; padding: 8px; font-size: 14px;',
      }),
    ]),
    '处理告警记录',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      beforeClose: async (action, instance, done) => {
        if (action === 'confirm') {
          const textarea = document.querySelector(
            '#processRemark',
          ) as HTMLTextAreaElement;
          processRemark = textarea?.value || '';

          if (!processRemark) {
            ElMessage.warning('请输入处理原因');
            return;
          }

          const loadingInstance = ElMessage({
            message: '正在处理...',
            duration: 0,
            type: 'info',
          });
          try {
            await processAlertRecord(row.id as number, processRemark);
            ElMessage.success('处理成功');
            handleRefresh();
            done();
          } catch (error) {
            console.error('处理失败:', error);
            ElMessage.error('处理失败');
          } finally {
            loadingInstance.close();
          }
        } else {
          done();
        }
      },
    },
  );
}

// 查看告警记录详情
function handleView(row: AlertRecord) {
  ElMessageBox.alert(
    h('div', { class: 'alert-detail-content' }, [
      h('div', { class: 'detail-item' }, [
        h('span', { class: 'detail-label' }, '告警名称：'),
        h('span', { class: 'detail-value' }, row.configName || '-'),
      ]),
      h('div', { class: 'detail-item' }, [
        h('span', { class: 'detail-label' }, '告警级别：'),
        h('span', { class: 'detail-value' }, getLevelText(row.configLevel)),
      ]),
      h('div', { class: 'detail-item' }, [
        h('span', { class: 'detail-label' }, '设备消息：'),
        h('pre', { class: 'detail-pre' }, row.deviceMessage || '-'),
      ]),
      h('div', { class: 'detail-item' }, [
        h('span', { class: 'detail-label' }, '处理结果：'),
        h('span', { class: 'detail-value' }, row.processRemark || '-'),
      ]),
      h('div', { class: 'detail-item' }, [
        h('span', { class: 'detail-label' }, '处理时间：'),
        h('span', { class: 'detail-value' }, row.processTime
          ? new Date(row.processTime).toLocaleString('zh-CN')
          : '-'),
      ]),
    ]),
    '告警记录详情',
    {
      confirmButtonText: '关闭',
      dangerouslyUseHTMLString: false,
    },
  );
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
          return await getAlertRecordPage({
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
  } as VxeTableGridOptions<AlertRecord>,
});

onMounted(() => {
  loadData();
});
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="告警记录列表">
      <!-- 告警级别列 -->
      <template #configLevel="{ row }">
        <el-tag :type="getLevelColor(row.configLevel)" size="small">
          {{ getLevelText(row.configLevel) }}
        </el-tag>
      </template>

      <!-- 产品名称列 -->
      <template #product="{ row }">
        <span>{{ getProductName(row.productId) }}</span>
      </template>

      <!-- 设备名称列 -->
      <template #device="{ row }">
        <span>{{ getDeviceName(row.deviceId) }}</span>
      </template>

      <!-- 设备消息列 -->
      <template #deviceMessage="{ row }">
        <el-popover
          v-if="row.deviceMessage"
          placement="top-start"
          trigger="hover"
          :width="400"
        >
          <template #reference>
            <el-button size="small" link type="primary">
              <IconifyIcon icon="ant-design:eye-outlined" class="btn-icon" />
              查看消息
            </el-button>
          </template>
          <pre class="message-preview">{{ row.deviceMessage }}</pre>
        </el-popover>
        <span v-else class="empty-text">-</span>
      </template>

      <!-- 操作列 -->
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: '处理',
              type: 'link',
              icon: ACTION_ICON.EDIT,
              onClick: handleProcess.bind(null, row),
              ifShow: !row.processStatus,
            },
            {
              label: '查看',
              type: 'link',
              icon: ACTION_ICON.VIEW,
              onClick: handleView.bind(null, row),
              ifShow: row.processStatus,
            },
          ]"
        />
      </template>
    </Grid>
  </Page>
</template>

<style scoped>
.btn-icon {
  margin-right: 4px;
}

.empty-text {
  color: #c0c4cc;
}

.message-preview {
  margin: 0;
  font-size: 12px;
  font-family: monospace;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* 告警详情弹窗样式 */
.alert-detail-content {
  line-height: 1.6;
}

.detail-item {
  margin-bottom: 12px;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-label {
  font-weight: 600;
  margin-right: 8px;
}

.detail-value {
  color: #606266;
}

.detail-pre {
  margin: 8px 0 0;
  padding: 8px;
  font-size: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* 确保表格容器正常显示 */
:deep(.vxe-grid--form-wrapper) {
  display: block;
}
</style>
