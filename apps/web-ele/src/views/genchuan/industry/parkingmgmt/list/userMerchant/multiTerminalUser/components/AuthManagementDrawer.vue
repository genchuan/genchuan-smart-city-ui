<script setup>
import { ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  selectedUser: {
    type: Object,
    default: null,
  },
  userType: {
    type: String,
    default: '个人',
  },
  dataList: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['close', 'success']);

// 认证管理抽屉配置
const [AuthDrawer, authDrawerApi] = useVbenDrawer({
  width: '50%',
  mask: false,
  modal: false,
  position: 'right',
  appendToMain: true,
  showCancelButton: false,
  showConfirmButton: false,
  title: '用户认证',
  onCancel() {
    authDrawerApi.close();
    emit('close');
    resetAuthState();
  },
});

// 认证流程步骤
const authStep = ref(1);
// 选择的认证类型
const selectedAuthType = ref(null);
// 认证表单数据
const authFormData = ref({
  authType: '',
  authMaterialUrl: '',
  plateNumber: '',
  idCardOrLicense: '',
  reviewerId: '',
  reviewResult: '',
  rejectReason: '',
  authStatus: '',
  authRecordDetail: '',
});

// 认证类型选项
const authTypeOptions = ref([
  {
    label: '车主认证',
    value: '车主',
    description: '适用于个人车主用户，需实名认证和车牌绑定',
    required: '需上传身份证正反面照片并绑定车牌',
    icon: 'User',
  },
  {
    label: '商户认证',
    value: '商户',
    description: '适用于停车场商户，需营业执照认证',
    required: '需上传营业执照照片和法人信息',
    icon: 'Shop',
  },
  {
    label: '政府用户认证',
    value: '政府',
    description: '适用于政府管理部门人员',
    required: '需提供工作证明和单位介绍信',
    icon: 'OfficeBuilding',
  },
  {
    label: '运维人员认证',
    value: '运维',
    description: '适用于系统运维和管理人员',
    required: '需提供工作证和授权证明',
    icon: 'Setting',
  },
]);

// 监听visible变化控制抽屉显示/隐藏
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      authDrawerApi.open();
      initAuthFormData();
    } else {
      authDrawerApi.close();
      resetAuthState();
    }
  },
);

// 初始化认证表单数据
const initAuthFormData = () => {
  authFormData.value = {
    authStatus: props.selectedUser?.cert_status || '',
    authType: '',
    authMaterialUrl: '',
    plateNumber: '',
    idCardOrLicense: '',
    reviewerId: '',
    reviewResult: '',
    rejectReason: '',
    authRecordDetail: '',
  };
  authStep.value = 1;
  selectedAuthType.value = null;
};

// 重置认证状态
const resetAuthState = () => {
  authStep.value = 1;
  selectedAuthType.value = null;
  authFormData.value = {};
};

// 步骤1：选择认证类型，进入下一步
const handleAuthTypeNext = () => {
  if (!selectedAuthType.value) {
    ElMessage.warning('请选择认证类型');
    return;
  }
  // 设置认证类型
  authFormData.value.authType = selectedAuthType.value;
  authStep.value = 2;
};

// 步骤2：填写信息，进入下一步
const handleInfoNext = () => {
  // 简单的表单验证
  if (!authFormData.value.authType) {
    ElMessage.warning('请选择认证类型');
    return;
  }
  if (!authFormData.value.idCardOrLicense) {
    ElMessage.warning('请输入身份证号/营业执照号');
    return;
  }
  if (
    authFormData.value.authType === '车主' &&
    !authFormData.value.plateNumber
  ) {
    ElMessage.warning('请输入车牌号码');
    return;
  }
  authStep.value = 3;
};

// 步骤2：填写信息，返回上一步
const handleInfoBack = () => {
  authStep.value = 1;
};

// 步骤3：提交审核，返回上一步
const handleReviewBack = () => {
  authStep.value = 2;
};

// 步骤3：提交审核，完成认证
const handleAuthSubmit = () => {
  if (!authFormData.value.reviewResult) {
    ElMessage.warning('请选择审核结果');
    return;
  }

  // 如果有选中用户，更新其认证状态
  if (props.selectedUser) {
    // 根据审核结果更新认证状态
    let newCertStatus = props.selectedUser.cert_status;
    if (authFormData.value.reviewResult === '通过') {
      newCertStatus = '已认证';
    } else if (authFormData.value.reviewResult === '驳回') {
      newCertStatus = '认证失败';
    }

    // 触发成功事件，让父组件更新数据
    emit('success', {
      user: props.selectedUser,
      newCertStatus,
    });
  }

  // 无论是否有选中用户，都显示成功提示并关闭抽屉
  ElMessage.success('用户认证操作成功');
  authDrawerApi.close();
  emit('close');
  resetAuthState();
};
</script>

<template>
  <AuthDrawer>
    <div class="auth-management">
      <!-- 认证流程步骤指示器 -->
      <div class="auth-steps">
        <el-steps :active="authStep - 1" finish-status="success" align-center>
          <el-step title="选择认证类型" />
          <el-step title="填写信息" />
          <el-step title="提交审核" />
        </el-steps>
      </div>

      <!-- 步骤1：选择认证类型 -->
      <div v-if="authStep === 1" class="auth-step-content mt-4">
        <div class="auth-type-options mt-3">
          <div
            v-for="option in authTypeOptions"
            :key="option.value"
            class="auth-type-option"
            :class="{ selected: selectedAuthType === option.value }"
            @click="selectedAuthType = option.value"
          >
            <div class="auth-type-header">
              <el-radio v-model="selectedAuthType" :label="option.value" />
              <el-icon class="auth-type-icon">
                <component :is="option.icon" />
              </el-icon>
              <span class="auth-type-label">{{ option.label }}</span>
            </div>
            <p class="auth-type-description">{{ option.description }}</p>
            <p class="auth-type-required text-warning">
              {{ option.required }}
            </p>
          </div>
        </div>

        <!-- 认证说明 -->
        <div class="auth-description bg-info-light mt-4 p-3">
          <h5>认证说明</h5>
          <ul class="auth-description-list">
            <li>• 认证信息将严格保密，仅用于身份验证</li>
            <li>• 审核通常在1个工作日内完成</li>
            <li>• 未认证用户将无法使用预约停车、月卡办理等功能</li>
          </ul>
        </div>

        <div class="auth-actions mt-4 flex justify-end gap-2">
          <el-button @click="authDrawerApi.close">取消</el-button>
          <el-button type="primary" @click="handleAuthTypeNext">
            下一步
          </el-button>
        </div>
      </div>

      <!-- 步骤2：填写信息 -->
      <div v-if="authStep === 2" class="auth-step-content mt-4">
        <el-form :model="authFormData" label-width="150px" class="mt-3">
          <el-form-item label="认证类型" required>
            <el-select
              v-model="authFormData.authType"
              placeholder="请选择认证类型"
              class="w-60"
              disabled
            >
              <el-option label="车主" value="车主" />
              <el-option label="商户" value="商户" />
              <el-option label="政府" value="政府" />
              <el-option label="运维" value="运维" />
            </el-select>
          </el-form-item>

          <el-form-item label="认证材料URL">
            <el-input
              v-model="authFormData.authMaterialUrl"
              placeholder="请输入认证材料URL"
              class="w-full"
            />
          </el-form-item>

          <!-- 车主认证特有字段 -->
          <el-form-item
            label="车牌号码"
            v-if="authFormData.authType === '车主'"
            required
          >
            <el-input
              v-model="authFormData.plateNumber"
              placeholder="请输入车牌号码"
              class="w-60"
            />
          </el-form-item>

          <el-form-item label="身份证号" required>
            <el-input
              v-model="authFormData.idCardOrLicense"
              placeholder="请输入身份证号"
              class="w-full"
            />
          </el-form-item>

          <el-form-item label="审核人ID">
            <el-input
              v-model="authFormData.reviewerId"
              placeholder="请输入审核人ID"
              class="w-60"
            />
          </el-form-item>

          <el-form-item label="认证记录明细">
            <el-input
              v-model="authFormData.authRecordDetail"
              type="textarea"
              :rows="4"
              placeholder="请输入认证记录明细"
              class="w-full"
            />
          </el-form-item>
        </el-form>

        <div class="auth-actions mt-4 flex justify-end gap-2">
          <el-button @click="handleInfoBack">上一步</el-button>
          <el-button type="primary" @click="handleInfoNext">下一步</el-button>
        </div>
      </div>

      <!-- 步骤3：提交审核 -->
      <div v-if="authStep === 3" class="auth-step-content mt-4">
        <el-form :model="authFormData" label-width="150px" class="mt-3">
          <el-form-item label="审核结果" required>
            <el-select
              v-model="authFormData.reviewResult"
              placeholder="请选择审核结果"
              class="w-60"
            >
              <el-option label="通过" value="通过" />
              <el-option label="驳回" value="驳回" />
            </el-select>
          </el-form-item>

          <el-form-item
            label="驳回原因"
            v-if="authFormData.reviewResult === '驳回'"
          >
            <el-input
              v-model="authFormData.rejectReason"
              type="textarea"
              :rows="4"
              placeholder="请输入驳回原因"
              class="w-full"
            />
          </el-form-item>

          <el-form-item label="认证状态" required>
            <el-select
              v-model="authFormData.authStatus"
              placeholder="请选择认证状态"
              class="w-60"
            >
              <el-option label="未认证" value="未认证" />
              <el-option label="待审核" value="待审核" />
              <el-option label="已认证" value="已认证" />
              <el-option label="认证失败" value="认证失败" />
            </el-select>
          </el-form-item>

          <el-form-item label="认证记录明细">
            <el-input
              v-model="authFormData.authRecordDetail"
              type="textarea"
              :rows="4"
              placeholder="请输入认证记录明细"
              class="w-full"
              readonly
            />
          </el-form-item>
        </el-form>

        <div class="auth-actions mt-4 flex justify-end gap-2">
          <el-button @click="handleReviewBack">上一步</el-button>
          <el-button type="primary" @click="handleAuthSubmit">
            提交审核
          </el-button>
        </div>
      </div>
    </div>
  </AuthDrawer>
</template>

<style scoped>
.auth-management h3 {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
}

.auth-management h4 {
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: bold;
}

.auth-management h5 {
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: bold;
}

.auth-steps {
  padding-bottom: 16px;
  margin-bottom: 24px;
  border-bottom: 1px solid #f0f2f5;
}

.auth-step-content {
  padding: 0;
}

.auth-type-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.auth-type-option {
  padding: 12px 16px;
  cursor: pointer;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.auth-type-option:hover {
  border-color: #409eff;
  box-shadow: 0 2px 4px rgb(0 0 0 / 8%);
}

.auth-type-option.selected {
  background-color: #ecf5ff;
  border-color: #409eff;
}

.auth-type-header {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 6px;
}

.auth-type-icon {
  margin-right: 4px;
  font-size: 16px;
  color: #409eff;
}

.auth-type-label {
  font-size: 15px;
  font-weight: bold;
  color: #303133;
}

.auth-type-description {
  margin-bottom: 6px;
  margin-left: 34px;
  font-size: 13px;
  color: #606266;
}

.auth-type-required {
  margin: 0;
  margin-left: 34px;
  font-size: 12px;
  color: #e6a23c;
}

.auth-description {
  margin-top: 20px;
  background-color: #ecf5ff;
  border: 1px solid #d9ecff;
  border-radius: 6px;
}

.auth-description-list {
  padding: 0;
  margin: 8px 0 0;
  color: #606266;
  list-style-type: none;
}

.auth-description-list li {
  margin-bottom: 4px;
  font-size: 13px;
  line-height: 1.5;
}

.mt-4 {
  margin-top: 16px;
}

.mt-3 {
  margin-top: 12px;
}

.text-muted {
  margin-bottom: 16px;
  font-size: 14px;
  color: #909399;
}

.text-warning {
  color: #e6a23c;
}

.bg-info-light {
  background-color: #ecf5ff;
}

.flex {
  display: flex;
}

.justify-end {
  justify-content: flex-end;
}

.gap-2 {
  gap: 8px;
}

.w-60 {
  width: 240px;
}

.w-full {
  width: 100%;
}

/* 移除步骤指示器的默认图标 */
:deep(.el-step__icon.is-text) {
  color: #fff;
  background-color: #e4e7ed;
}

:deep(.el-step__icon.is-text.is-success) {
  background-color: #67c23a;
}

:deep(.el-step__icon.is-text.is-active) {
  background-color: #409eff;
}

/* 调整步骤标题样式 */
:deep(.el-step__title) {
  font-size: 14px;
  color: #909399;
}

:deep(.el-step__title.is-success) {
  color: #67c23a;
}

:deep(.el-step__title.is-active) {
  font-weight: bold;
  color: #303133;
}

/* 调整步骤线样式 */
:deep(.el-step__line) {
  background-color: #e4e7ed;
}

:deep(.el-step__line.is-success) {
  background-color: #67c23a;
}
</style>
