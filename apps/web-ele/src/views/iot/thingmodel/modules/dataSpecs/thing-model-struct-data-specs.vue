<!-- dataType：struct 数组类型 -->
<script lang="ts" setup>
import type { Ref } from 'vue';

import { nextTick, onMounted, ref, unref } from 'vue';

import { isEmpty } from '@vben/utils';

import { useVModel } from '@vueuse/core';
import { ElButton, ElDivider, ElForm, ElFormItem, ElInput, ElDialog } from 'element-plus';

import { IoTDataSpecsDataTypeEnum } from '#/views/iot/utils/constants';

import ThingModelProperty from '../thing-model-property.vue';

/** Struct 型的 dataSpecs 配置组件 */
defineOptions({ name: 'ThingModelStructDataSpecs' });

const props = defineProps<{ modelValue: any }>();
const emits = defineEmits(['update:modelValue']);
const dataSpecsList = useVModel(props, 'modelValue', emits) as Ref<any[]>;
const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref('新增参数'); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const structFormRef = ref(); // 表单 ref
const formData = ref<any>({
  property: {
    dataType: IoTDataSpecsDataTypeEnum.INT,
    dataSpecs: {
      dataType: IoTDataSpecsDataTypeEnum.INT,
    },
    dataSpecsList: [],
  },
});

/** 打开 struct 表单 */
function openStructForm(val: any) {
  dialogVisible.value = true;
  resetForm();
  if (isEmpty(val)) {
    return;
  }
  // 编辑时回显数据
  const valData = val as any;
  formData.value = {
    identifier: valData?.identifier || '',
    name: valData?.name || '',
    description: valData?.description || '',
    property: {
      dataType: valData?.childDataType || IoTDataSpecsDataTypeEnum.INT,
      dataSpecs: valData?.dataSpecs ?? {},
      dataSpecsList: valData?.dataSpecsList ?? [],
    },
  };

  // 确保 property.dataType 有值
  if (!formData.value.property.dataType) {
    formData.value.property.dataType = IoTDataSpecsDataTypeEnum.INT;
  }
}

/** 删除 struct 项 */
function deleteStructItem(index: number) {
  dataSpecsList.value.splice(index, 1);
}

/** 添加参数 */
async function submitForm() {
  await structFormRef.value.validate();

  try {
    const data = unref(formData);
    // 构建数据对象
    const item = {
      identifier: data.identifier,
      name: data.name,
      description: data.description,
      dataType: IoTDataSpecsDataTypeEnum.STRUCT,
      childDataType: data.property.dataType,
      dataSpecs:
        !!data.property.dataSpecs &&
        Object.keys(data.property.dataSpecs).length > 1
          ? data.property.dataSpecs
          : undefined,
      dataSpecsList: isEmpty(data.property.dataSpecsList)
        ? undefined
        : data.property.dataSpecsList,
    };

    // 新增或修改同 identifier 的参数
    const existingIndex = dataSpecsList.value.findIndex(
      (spec) => spec.identifier === data.identifier,
    );
    if (existingIndex === -1) {
      dataSpecsList.value.push(item);
    } else {
      dataSpecsList.value[existingIndex] = item;
    }
  } finally {
    dialogVisible.value = false;
  }
}

/** 重置表单 */
function resetForm() {
  formData.value = {
    property: {
      dataType: IoTDataSpecsDataTypeEnum.INT,
      dataSpecs: {
        dataType: IoTDataSpecsDataTypeEnum.INT,
      },
      dataSpecsList: [],
    },
  };
  structFormRef.value?.resetFields();
}

/** 组件初始化 */
onMounted(async () => {
  await nextTick();
  // 预防 dataSpecsList 空指针
  isEmpty(dataSpecsList.value) && (dataSpecsList.value = []);
});
</script>

<template>
  <!-- struct 数据展示 -->
  <el-form-item label="属性对象">
    <div
      v-for="(item, index) in dataSpecsList"
      :key="index"
      class="struct-item"
    >
      <span class="struct-name">参数：{{ item.name }}</span>
      <div class="struct-actions">
        <el-button type="primary" link @click="openStructForm(item)">
          编辑
        </el-button>
        <el-divider direction="vertical" />
        <el-button type="danger" link @click="deleteStructItem(index)">
          删除
        </el-button>
      </div>
    </div>
    <el-button type="primary" link @click="openStructForm(null)">
      +新增参数
    </el-button>
  </el-form-item>

  <!-- struct 表单 -->
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :close-on-click-modal="false"
    @confirm="submitForm"
  >
    <el-form
      ref="structFormRef"
      :model="formData"
      label-width="80px"
    >
      <el-form-item label="参数名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入功能名称" />
      </el-form-item>
      <el-form-item label="标识符" prop="identifier">
        <el-input v-model="formData.identifier" placeholder="请输入标识符" />
      </el-form-item>
      <!-- 属性配置 -->
      <ThingModelProperty v-model="formData.property" is-struct-data-specs />
    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="formLoading" @click="submitForm">
        确认
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.struct-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 10px;
  margin-bottom: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.struct-name {
  flex: 1;
}

.struct-actions {
  display: flex;
  align-items: center;
  gap: 0;
}

/* 表单项样式调整 */
:deep(.el-form-item) {
  margin-bottom: 18px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}
</style>
