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
  createInspectUser,
  updateInspectUser,
} from '#/api/genchuan/industry/chargePark/inspectOp/inspectMgmt/inspectUser';

import { statusOptions } from '../table/data';

const emit = defineEmits(['success']);

const formRef = ref(null);
const rowData = shallowRef({});
const submitting = shallowRef(false);
const isEdit = computed(() => rowData.value?.id);
const drawerTitle = computed(() =>
  rowData.value?.id ? '编辑巡检人员' : '新增巡检人员',
);

const form = reactive({
  name: '',
  phone: '',
  area: '',
  deviceId: undefined,
  status: '1',
});

function validatePhone(rule, value, callback) {
  if (!value) {
    callback(new Error('请输入手机号'));
    return;
  }
  if (!/^1\d{10}$/.test(String(value))) {
    callback(new Error('请输入正确的手机号'));
    return;
  }
  callback();
}

const rules = {
  name: [{ required: true, message: '请输入人员姓名', trigger: 'blur' }],
  phone: [{ validator: validatePhone, trigger: 'blur' }],
  area: [{ required: true, message: '请选择所属片区', trigger: 'change' }],
  status: [{ required: true, message: '请选择人员状态', trigger: 'change' }],
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
  form.phone = row.phone || '';
  form.area = row.area || '';
  form.deviceId = row.deviceId ?? undefined;
  formRef.value?.clearValidate?.();
}

async function submitForm() {
  try {
    await formRef.value?.validate();
  } catch {
    ElMessage.warning('请完善巡检人员信息');
    return;
  }

  submitting.value = true;
  try {
    const payload = {
      name: form.name,
      phone: form.phone,
      area: form.area,
      deviceId: form.deviceId,
      status: form.status,
    };
    if (rowData.value?.id) {
      await updateInspectUser({
        ...payload,
        id: rowData.value.id,
      });
      ElMessage.success('巡检人员编辑成功');
    } else {
      await createInspectUser(payload);
      ElMessage.success('巡检人员新增成功');
    }
    emit('success');
    drawerApi.close();
  } catch (error) {
    console.error('保存巡检人员失败:', error);
    ElMessage.error('保存失败，请稍后重试');
  } finally {
    submitting.value = false;
  }
}

function open(row) {
  drawerApi.setData(row || {}).open();
}

defineExpose({
  open,
});
</script>

<template>
  <Drawer>
    <ElForm ref="formRef" :model="form" :rules="rules" label-width="110px">
      <ElFormItem label="人员姓名" prop="name">
        <ElInput
          v-model="form.name"
          maxlength="64"
          placeholder="请输入人员姓名"
          show-word-limit
        />
      </ElFormItem>
      <ElFormItem label="手机号" prop="phone">
        <ElInput
          v-model="form.phone"
          maxlength="11"
          placeholder="请输入手机号"
          show-word-limit
        />
      </ElFormItem>
      <ElFormItem label="所属片区" prop="area">
        <!-- <ElSelect v-model="form.area" clearable placeholder="请选择所属片区">
          <ElOption
            v-for="item in areaOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect> -->
        <ElInput v-model="form.area" placeholder="请输入所属片区" />
      </ElFormItem>
      <ElFormItem label="绑定设备">
        <!-- <ElSelect
          v-model="form.deviceId"
          clearable
          filterable
          placeholder="请选择绑定设备"
        >
          <ElOption
            v-for="item in deviceOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect> -->
        <ElInput v-model="form.deviceId" placeholder="请输入绑定设备Id" />
      </ElFormItem>
      <ElFormItem label="人员状态" prop="status">
        <ElSelect
          v-model="form.status"
          clearable
          placeholder="请选择人员状态"
          :disabled="isEdit"
        >
          <ElOption
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
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
