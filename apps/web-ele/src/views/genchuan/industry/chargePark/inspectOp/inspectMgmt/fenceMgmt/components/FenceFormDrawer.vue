<script setup>
import { computed, reactive, ref, shallowRef } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElOption,
  ElSelect,
} from 'element-plus';

import {
  createFenceMgmt,
  updateFenceMgmt,
} from '#/api/genchuan/industry/chargePark/inspectOp/inspectMgmt/fenceMgmt';

import { parseFenceArea, statusOptions, userOptions } from '../table/data';
import FenceMapEditor from './FenceMapEditor.vue';

const props = defineProps({
  existingRows: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['success']);

const formRef = ref(null);
const rowData = shallowRef({});
const submitting = shallowRef(false);
const isEdit = computed(() => rowData.value?.id);
const drawerTitle = computed(() =>
  rowData.value?.id ? '编辑电子围栏' : '新增电子围栏',
);

const form = reactive({
  name: '',
  area: '[]',
  userId: undefined,
  status: '1',
});

function validateFenceName(rule, value, callback) {
  const name = String(value || '').trim();
  if (!name) {
    callback(new Error('请输入围栏名称'));
    return;
  }

  const exists = props.existingRows.some(
    (item) =>
      item.name === name && Number(item.id) !== Number(rowData.value.id),
  );
  if (exists) {
    callback(new Error('围栏名称已存在'));
    return;
  }
  callback();
}

function validateFenceArea(rule, value, callback) {
  if (parseFenceArea(value).length < 3) {
    callback(new Error('请在地图上绘制至少 3 个围栏顶点'));
    return;
  }
  callback();
}

const rules = {
  name: [{ validator: validateFenceName, trigger: 'blur' }],
  area: [{ validator: validateFenceArea, trigger: 'change' }],
};

const [Drawer, drawerApi] = useVbenDrawer({
  appendToMain: true,
  footer: false,
  modal: false,
  title: drawerTitle,
  onCancel() {
    drawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (!isOpen) return;
    rowData.value = drawerApi.getData() || {};
    resetForm(rowData.value);
  },
});

function resetForm(row = {}) {
  form.name = row.name || '';
  form.area = row.area || '[]';
  form.userId = row.userId ?? undefined;
  formRef.value?.clearValidate?.();
}

async function submitForm() {
  try {
    await formRef.value?.validate();
  } catch {
    ElMessage.warning('请完善电子围栏信息');
    return;
  }

  submitting.value = true;
  try {
    const payload = {
      name: form.name,
      area: form.area,
      userId: form.userId,
      status: form.status,
    };
    if (rowData.value?.id) {
      await updateFenceMgmt({
        ...payload,
        id: rowData.value.id,
      });
      ElMessage.success('电子围栏编辑成功');
    } else {
      await createFenceMgmt(payload);
      ElMessage.success('电子围栏新增成功');
    }
    emit('success');
    drawerApi.close();
  } catch (error) {
    console.error('保存电子围栏失败:', error);
    ElMessage.error('保存失败，请稍后重试');
  } finally {
    submitting.value = false;
  }
}

function open(row) {
  form.status = row?.status || '1';
  form.userId = row?.userId ?? undefined;
  form.area = row?.area || '[]';
  form.name = row?.name || '';
  drawerApi.setData(row || {}).open();
}

defineExpose({
  open,
});
</script>

<template>
  <Drawer>
    <ElForm ref="formRef" :model="form" :rules="rules" label-width="110px">
      <ElFormItem label="围栏名称" prop="name">
        <ElInput
          v-model="form.name"
          maxlength="64"
          placeholder="请输入围栏名称"
          show-word-limit
        />
      </ElFormItem>
      <ElFormItem label="关联巡检人员">
        <ElSelect
          v-model="form.userId"
          clearable
          filterable
          placeholder="请选择关联巡检人员"
        >
          <ElOption
            v-for="item in userOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="围栏区域" prop="area">
        <FenceMapEditor v-model="form.area" height="340px" />
      </ElFormItem>
      <ElFormItem label="围栏状态" prop="status">
        <ElSelect
          v-model="form.status"
          placeholder="请选择围栏状态"
          clearable
          filterable
          :options="statusOptions"
          :disabled="isEdit"
        />
      </ElFormItem>
    </ElForm>
    <div class="drawer-footer">
      <ElButton @click="drawerApi.close()">取消</ElButton>
      <ElButton type="primary" :loading="submitting" @click="submitForm">
        保存
      </ElButton>
    </div>
  </Drawer>
</template>

<style scoped>
.drawer-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 16px;
}

:deep(.el-select) {
  width: 100%;
}
</style>
