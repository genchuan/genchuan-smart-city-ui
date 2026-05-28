<!-- 产品的物模型表单（event、service 项里的参数） -->
<script lang="ts" setup>
import type { Ref } from 'vue';

import { ref, unref } from 'vue';

import { isEmpty } from '@vben/utils';

import { useVModel } from '@vueuse/core';
import { ElButton, ElDivider, ElForm, ElFormItem, ElInput, ElDialog } from 'element-plus';

import { IoTDataSpecsDataTypeEnum } from '#/views/iot/utils/constants';

import ThingModelProperty from './thing-model-property.vue';

/** 输入输出参数配置组件 */
defineOptions({ name: 'ThingModelInputOutputParam' });

const props = defineProps<{ direction: string; modelValue: any }>();
const emits = defineEmits(['update:modelValue']);
const thingModelParams = useVModel(props, 'modelValue', emits) as Ref<any[]>;
const dialogVisible = ref(false); // 弹窗的是否展示
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const paramFormRef = ref(); // 表单 ref
const formData = ref<any>({
  dataType: IoTDataSpecsDataTypeEnum.INT,
  property: {
    dataType: IoTDataSpecsDataTypeEnum.INT,
    dataSpecs: {
      dataType: IoTDataSpecsDataTypeEnum.INT,
    },
    dataSpecsList: [],
  },
});

/** 打开 param 表单 */
function openParamForm(val: any) {
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
      dataType: valData?.dataType || IoTDataSpecsDataTypeEnum.INT,
      dataSpecs: valData?.dataSpecs ?? {},
      dataSpecsList: valData?.dataSpecsList ?? [],
    },
  };

  // 确保 property.dataType 有值
  if (!formData.value.property.dataType) {
    formData.value.property.dataType = IoTDataSpecsDataTypeEnum.INT;
  }
}

/** 删除 param 项 */
function deleteParamItem(index: number) {
  thingModelParams.value.splice(index, 1);
}

/** 添加参数 */
async function submitForm() {
  // 初始化参数列表
  if (isEmpty(thingModelParams.value)) {
    thingModelParams.value = [];
  }
  // 校验参数
  await paramFormRef.value.validate();
  try {
    // 构建数据对象
    const data = unref(formData);
    const item = {
      identifier: data.identifier,
      name: data.name,
      description: data.description,
      dataType: data.property.dataType,
      paraOrder: 0, // TODO @puhui999: 先写死默认看看后续
      direction: props.direction,
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
    const existingIndex = thingModelParams.value.findIndex(
      (spec) => spec.identifier === data.identifier,
    );
    if (existingIndex === -1) {
      thingModelParams.value.push(item);
    } else {
      thingModelParams.value[existingIndex] = item;
    }
  } finally {
    dialogVisible.value = false;
  }
}

/** 重置表单 */
function resetForm() {
  formData.value = {
    dataType: IoTDataSpecsDataTypeEnum.INT,
    property: {
      dataType: IoTDataSpecsDataTypeEnum.INT,
      dataSpecs: {
        dataType: IoTDataSpecsDataTypeEnum.INT,
      },
      dataSpecsList: [],
    },
  };
  paramFormRef.value?.resetFields();
}
</script>

<template>
  <div
    v-for="(item, index) in thingModelParams"
    :key="index"
    class="param-item"
  >
    <span class="param-name">参数名称：{{ item.name }}</span>
    <div class="param-actions">
      <el-button type="primary" link @click="openParamForm(item)">编辑</el-button>
      <el-divider direction="vertical" />
      <el-button type="danger" link @click="deleteParamItem(index)">删除</el-button>
    </div>
  </div>
  <el-button type="primary" link @click="openParamForm(null)">+新增参数</el-button>

  <!-- param 表单 -->
  <el-dialog
    v-model="dialogVisible"
    title="新增参数"
    :close-on-click-modal="false"
    @confirm="submitForm"
  >
    <el-form
      ref="paramFormRef"
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
      <ThingModelProperty v-model="formData.property" is-params />
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
.param-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 10px;
  margin-bottom: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.param-name {
  flex: 1;
}

.param-actions {
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
