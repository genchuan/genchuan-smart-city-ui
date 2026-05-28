<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';

import { IconifyIcon } from '@vben/icons';

import { ElButton, ElForm, ElFormItem, ElOption, ElSelect, ElTable, ElTableColumn } from 'element-plus';

import { getSimpleDeviceList } from '#/api/iot/device/device';
import { getSimpleProductList } from '#/api/iot/product/product';
import { getThingModelListByProductId } from '#/api/iot/thingmodel';
import {
  IotDeviceMessageMethodEnum,
  IoTThingModelTypeEnum,
} from '#/views/iot/utils/constants';

const formData = ref<any[]>([]);
const productList = ref<any[]>([]); // 产品列表
const deviceList = ref<any[]>([]); // 设备列表
const thingModelCache = ref<Map<number, any[]>>(new Map()); // 缓存物模型数据，key 为 productId

const formRules = reactive({
  productId: [{ required: true, message: '产品不能为空', trigger: 'change' }],
  deviceId: [{ required: true, message: '设备不能为空', trigger: 'change' }],
  method: [{ required: true, message: '消息方法不能为空', trigger: 'change' }],
});
const formRef = ref(); // 表单 Ref

const upstreamMethods = computed(() => {
  return Object.values(IotDeviceMessageMethodEnum).filter(
    (item) => item.upstream,
  );
}); // 获取上行消息方法列表

/** 根据产品 ID 过滤设备 */
function getFilteredDevices(productId: number) {
  if (!productId) return [];
  return deviceList.value.filter(
    (device: any) => device.productId === productId,
  );
}

/** 判断是否需要显示标识符选择器 */
function shouldShowIdentifierSelect(row: any) {
  return [
    IotDeviceMessageMethodEnum.EVENT_POST.method,
    IotDeviceMessageMethodEnum.PROPERTY_POST.method,
  ].includes(row.method);
}

/** 获取物模型选项 */
function getThingModelOptions(row: any) {
  if (!row.productId || !shouldShowIdentifierSelect(row)) {
    return [];
  }
  const thingModels: any[] = thingModelCache.value.get(row.productId) || [];
  let filteredModels: any[] = [];
  if (row.method === IotDeviceMessageMethodEnum.EVENT_POST.method) {
    filteredModels = thingModels.filter(
      (item: any) => item.type === IoTThingModelTypeEnum.EVENT,
    );
  } else if (row.method === IotDeviceMessageMethodEnum.PROPERTY_POST.method) {
    filteredModels = thingModels.filter(
      (item: any) => item.type === IoTThingModelTypeEnum.PROPERTY,
    );
  }
  return filteredModels.map((item: any) => ({
    label: `${item.name} (${item.identifier})`,
    value: item.identifier,
  }));
}

/** 加载产品列表 */
async function loadProductList() {
  try {
    productList.value = await getSimpleProductList();
  } catch (error) {
    console.error('加载产品列表失败:', error);
  }
}

/** 加载设备列表 */
async function loadDeviceList() {
  try {
    deviceList.value = await getSimpleDeviceList();
  } catch (error) {
    console.error('加载设备列表失败:', error);
  }
}

/** 加载物模型数据 */
async function loadThingModel(productId: number) {
  // 已缓存，无需重复加载
  if (thingModelCache.value.has(productId)) {
    return;
  }
  try {
    const thingModels = await getThingModelListByProductId(productId);
    thingModelCache.value.set(productId, thingModels);
  } catch (error) {
    console.error('加载物模型失败:', error);
  }
}

/** 产品变化时处理 */
async function handleProductChange(row: any, _index: number) {
  row.deviceId = 0;
  row.method = undefined;
  row.identifier = undefined;
  row.identifierLoading = false;
}

/** 消息方法变化时处理 */
async function handleMethodChange(row: any, _index: number) {
  // 清空标识符
  row.identifier = undefined;
  // 如果需要加载物模型数据
  if (shouldShowIdentifierSelect(row) && row.productId) {
    row.identifierLoading = true;
    await loadThingModel(row.productId);
    row.identifierLoading = false;
  }
}

/** 新增按钮操作 */
function handleAdd() {
  const row = {
    productId: undefined,
    deviceId: undefined,
    method: undefined,
    identifier: undefined,
    identifierLoading: false,
  };
  formData.value.push(row);
}

/** 删除按钮操作 */
function handleDelete(index: number) {
  formData.value.splice(index, 1);
}

/** 表单校验 */
async function validate() {
  if (!formRef.value) return false;
  try {
    await formRef.value.validate();
    return true;
  } catch {
    return false;
  }
}

/** 表单值 */
function getData() {
  return formData.value;
}

/** 设置表单值 */
function setData(data: any[]) {
  // 确保每个项都有必要的字段
  formData.value = (data || []).map((item) => ({
    ...item,
    identifierLoading: false,
  }));
  // 为已有数据预加载物模型
  data?.forEach(async (item) => {
    if (item.productId && shouldShowIdentifierSelect(item)) {
      await loadThingModel(item.productId);
    }
  });
}

/** 初始化 */
onMounted(async () => {
  await Promise.all([loadProductList(), loadDeviceList()]);
});

defineExpose({ validate, getData, setData });
</script>

<template>
  <el-form ref="formRef" :model="{ data: formData }" class="source-config-form">
    <el-table :data="formData" border size="small" style="width: 100%">
      <el-table-column label="产品" width="200">
        <template #default="{ row, $index }">
          <el-form-item
            :prop="`data.${$index}.productId`"
            :rules="formRules.productId"
            class="form-item-no-margin"
          >
            <el-select
              v-model="row.productId"
              placeholder="请选择产品"
              filterable
              class="full-width"
              @change="() => handleProductChange(row, $index)"
            >
              <el-option
                v-for="product in productList"
                :key="product.id"
                :label="product.name"
                :value="product.id"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="设备" width="200">
        <template #default="{ row, $index }">
          <el-form-item
            :prop="`data.${$index}.deviceId`"
            :rules="formRules.deviceId"
            class="form-item-no-margin"
          >
            <el-select
              v-model="row.deviceId"
              placeholder="请选择设备"
              filterable
              class="full-width"
            >
              <el-option label="全部设备" :value="0" />
              <el-option
                v-for="device in getFilteredDevices(row.productId)"
                :key="device.id"
                :label="device.deviceName"
                :value="device.id"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="消息" width="200">
        <template #default="{ row, $index }">
          <el-form-item
            :prop="`data.${$index}.method`"
            :rules="formRules.method"
            class="form-item-no-margin"
          >
            <el-select
              v-model="row.method"
              placeholder="请选择消息"
              filterable
              class="full-width"
              @change="() => handleMethodChange(row, $index)"
            >
              <el-option
                v-for="method in upstreamMethods"
                :key="method.method"
                :label="method.name"
                :value="method.method"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="标识符" width="250">
        <template #default="{ row, $index }">
          <el-form-item
            :prop="`data.${$index}.identifier`"
            class="form-item-no-margin"
          >
            <el-select
              v-if="shouldShowIdentifierSelect(row)"
              v-model="row.identifier"
              placeholder="请选择标识符"
              filterable
              :loading="row.identifierLoading"
              class="full-width"
            >
              <el-option
                v-for="option in getThingModelOptions(row)"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80" fixed="right">
        <template #default="{ $index }">
          <el-button type="danger" link @click="handleDelete($index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="add-button-wrapper">
      <el-button type="primary" @click="handleAdd">
        <IconifyIcon icon="ant-design:plus-outlined" class="btn-icon" />
        添加数据源
      </el-button>
    </div>
  </el-form>
</template>

<style scoped>
.source-config-form {
  width: 100%;
}

.full-width {
  width: 100%;
}

.form-item-no-margin {
  margin-bottom: 0;
}

.add-button-wrapper {
  margin-top: 12px;
  text-align: center;
}

.btn-icon {
  margin-right: 4px;
}

/* 表格样式调整 */
:deep(.el-table__header th) {
  background-color: #f5f7fa;
}

:deep(.el-form-item__error) {
  position: absolute;
  top: 100%;
  left: 0;
}
</style>
