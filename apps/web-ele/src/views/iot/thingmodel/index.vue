<script setup lang="ts">
import type { IotProductApi } from '#/api/iot/product/product';

import { onMounted, provide, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getProduct } from '#/api/iot/product/product';
import { deleteThingModel, getThingModelPage } from '#/api/iot/thingmodel';

import { getDataTypeOptionsLabel, IOT_PROVIDE_KEY } from '../utils/constants';
import { useGridColumns, useGridFormSchema } from './data';
import { DataDefinition } from './modules/components';
import ThingModelForm from './modules/thing-model-form.vue';
import ThingModelTsl from './modules/thing-model-tsl.vue';

defineOptions({ name: 'IoTThingModel' });

const props = defineProps<{
  productId: number;
}>();

const product = ref<IotProductApi.Product>({} as IotProductApi.Product); // 产品信息

provide(IOT_PROVIDE_KEY.PRODUCT, product); // 提供产品信息给子组件

const thingModelFormRef = ref(); // 物模型表单引用
const thingModelTSLRef = ref(); // TSL弹窗引用

/** 获取产品信息 */
async function getProductData() {
  try {
    product.value = await getProduct(props.productId);
  } catch (error) {
    console.error('获取产品信息失败:', error);
  }
}

/** 刷新表格 */
function handleRefresh() {
  gridApi.reload();
}

/** 创建功能 */
function handleCreate() {
  thingModelFormRef.value?.open('create');
}

/** 编辑功能 */
function handleEdit(row: any) {
  thingModelFormRef.value?.open('update', row.id);
}

/** 删除功能 */
async function handleDelete(row: any) {
  const loadingInstance = ElMessage({
    message: '正在删除...',
    duration: 0,
    type: 'info',
  });
  try {
    await deleteThingModel(row.id);
    ElMessage.success('删除成功');
    handleRefresh();
  } catch (error) {
    console.error('删除失败:', error);
    ElMessage.error('删除失败');
  } finally {
    loadingInstance.close();
  }
}

/** 打开TSL */
function handleOpenTSL() {
  thingModelTSLRef.value?.open();
}

/** 获取数据类型标签 */
function getDataTypeLabel(row: any) {
  return getDataTypeOptionsLabel(row.property?.dataType) || '-';
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }: any, formValues: any) => {
          return await getThingModelPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            productId: props.productId,
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
  },
  formOptions: {
    schema: useGridFormSchema(),
  },
});

/** 初始化 */
onMounted(async () => {
  await getProductData();
});
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: '添加功能',
              type: 'primary',
              icon: ACTION_ICON.ADD,
              onClick: handleCreate,
            },
            {
              label: 'TSL',
              type: 'default',
              icon: 'ant-design:file-text-outlined',
              onClick: handleOpenTSL,
            },
          ]"
        />
      </template>

      <!-- 数据类型列 -->
      <template #dataType="{ row }">
        <span>{{ getDataTypeLabel(row) }}</span>
      </template>

      <!-- 数据定义列 -->
      <template #dataDefinition="{ row }">
        <DataDefinition :data="row" />
      </template>

      <!-- 操作列 -->
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: '编辑',
              type: 'link',
              icon: ACTION_ICON.EDIT,
              onClick: handleEdit.bind(null, row),
            },
            {
              label: '删除',
              type: 'link',
              danger: true,
              icon: ACTION_ICON.DELETE,
              popConfirm: {
                title: '确认删除该功能吗?',
                confirm: handleDelete.bind(null, row),
              },
            },
          ]"
        />
      </template>
    </Grid>

    <!-- 物模型表单 -->
    <ThingModelForm ref="thingModelFormRef" @success="handleRefresh" />

    <!-- TSL 弹窗 -->
    <ThingModelTsl ref="thingModelTSLRef" />
  </Page>
</template>

<style scoped>
/* 确保表格容器正常显示 */
:deep(.vxe-grid--form-wrapper) {
  display: block;
}
</style>
