<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage, ElStep, ElSteps } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import DetailDrawer from '#/components/common/DetailDrawer.vue';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

import {
  dataList,
  merchantList,
  textObj,
  useFormSchema,
  useGridColumns,
  useGridFormSchema,
  getUserDetailFields,
} from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  userType: {
    type: String,
    default: '全部',
  },
});
const getTitle = computed(() => {
  return formData.value?.id ? textObj.editText : textObj.addText;
});
const [Drawer, drawerApi] = useVbenDrawer({
  footer: false,
  mask: false,
  modal: false,
  width: '35%',
  position: 'right',
  appendToMain: true,
  onCancel() {
    drawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});
const formData = ref();
const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: '140',
  },
  layout: 'horizontal',
  schema: useFormSchema(props.userType),
  showDefaultActions: false,
});
const [FormDrawer, formDrawerApi] = useVbenDrawer({
  mask: false,
  modal: false,
  width: '40%',
  position: 'right',
  appendToMain: true,
  onCancel() {
    formDrawerApi.close();
  },
  onConfirm() {
    const obj = formApi.form.values;
    if (formDrawerApi.sharedData.payload.title === textObj.addText) {
      // 新增用户
      dataObj.apilist.push({
        ...obj,
        create_time: new Date().toLocaleString('zh-CN'),
        update_time: new Date().toLocaleString('zh-CN'),
      });
    } else {
      // 编辑用户
      dataObj.apilist.forEach((v, i) => {
        if (
          (props.userType === '个人' && v.user_id === formData.value?.user_id) ||
          (props.userType === '企业' && v.enterprise_id === formData.value?.enterprise_id) ||
          (props.userType === '政府' && v.gov_user_id === formData.value?.gov_user_id)
        ) {
          dataObj.apilist[i] = {
            ...v,
            ...obj,
            update_time: new Date().toLocaleString('zh-CN'),
          };
        }
      });
    }
    handleRefresh();
    formDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      // 当抽屉打开时，根据用户类型重新加载表单schema
      formApi.setSchema(useFormSchema(props.userType));
      formData.value = formDrawerApi.getData();
      if (formData.value?.user_id || formData.value?.enterprise_id || formData.value?.gov_user_id) {
        await formApi.setValues(formData.value);
      } else {
        formApi.resetForm();
      }
    }
  },
});
const [searchDrawer] = useVbenDrawer({
  mask: false,
  modal: false,
  width: '30%',
  position: 'right',
  appendToMain: true,
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 导出表格 */
async function handleExport() {
  const excelName = props.userType === '个人' ? '个人用户列表' : props.userType === '企业' ? '企业用户列表' : '政府用户列表';
  const excelAllName = `${excelName}.xlsx`;
  exportToExcel(dataObj.apilist, excelName, excelAllName);
}

/** 创建用户 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

/** 编辑用户 */
function handleEdit(row) {
  formDrawerApi
    .setData({
      title: textObj.editText,
      ...row,
    })
    .open();
}

async function handleDisable(row) {
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.disabling', [row.user_name || row.enterprise_name]),
  });
  try {
    const index = dataObj.apilist.findIndex(
      (v) =>
        (props.userType === '个人' && v.user_id === row.user_id) ||
        (props.userType === '企业' && v.enterprise_id === row.enterprise_id) ||
        (props.userType === '政府' && v.gov_user_id === row.gov_user_id)
    );
    if (index !== -1) {
      dataObj.apilist[index].account_status = '禁用';
      ElMessage.success($t('ui.actionMessage.disableSuccess', [row.user_name || row.enterprise_name]));
      handleRefresh();
    }
  } finally {
    loadingInstance.close();
  }
}

async function handleDeleteBatch() {
  await confirm($t('确定删除这些数据吗？'));
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deletingBatch'),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter(
      (v) =>
        !checkedIds.value.includes(
          props.userType === '个人' ? v.user_id :
          props.userType === '企业' ? v.enterprise_id :
          v.gov_user_id
        )
    );
    checkedIds.value = [];
    ElMessage.success($t('删除成功'));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

const checkedIds = ref([]);

function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) =>
    props.userType === '个人' ? item.user_id :
    props.userType === '企业' ? item.enterprise_id :
    item.gov_user_id
  );
}

const dataObj = reactive({
  totalShow: false,
  total: dataList(props.userType).length,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(props.userType),
  list: [],
});
const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

// 表格数据获取
const getTableData = async (pageObj) => {
  const page = pageObj.page;
  const filteredList = dataObj.apilist
    .map((v) => v)
    .filter((v) => {
      if (activeStatus.value === '全部') {
        return true;
      }
      // 根据用户类型选择不同的状态字段进行过滤
      if (props.userType === '政府') {
        return v.online_status === activeStatus.value;
      } else {
        return v.cert_status === activeStatus.value;
      }
    })
    .filter((v) => {
      // 搜索条件过滤
      for (const key in searchParams.value) {
        if (searchParams.value[key]) {
          const searchValue = searchParams.value[key].toString().toLowerCase();
          const itemValue = v[key]?.toString().toLowerCase() || '';
          if (!itemValue.includes(searchValue)) {
            return false;
          }
        }
      }
      return true;
    });

  const total = filteredList.length;
  const list = filteredList.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  );

  // 更新dataObj以保持同步
  dataObj.total = total;
  dataObj.list = list;

  return {
    list,
    total,
  };
};

const searchParams = ref({});

const [QueryForm] = useVbenForm({
  // 默认展开
  collapsed: false,
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  // 提交函数
  handleSubmit: onSubmit,
  // 垂直布局，label和input在不同行，值为vertical
  // 水平布局，label和input在同一行
  layout: 'horizontal',
  schema: useGridFormSchema(props.userType),
  // 是否可展开
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});

// 搜索表单查询
function onSubmit(values) {
  searchParams.value = values;
  drawerApi.close();
  gridApi.query();
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(props.userType),
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => getTableData({ page }),
      },
    },
    rowConfig: {
      keyField: props.userType === '个人' ? 'user_id' : props.userType === '企业' ? 'enterprise_id' : 'gov_user_id',
      isHover: true,
    },
    pagerConfig: dataObj,
    toolbarConfig: {
      'class-name': 'common-tool-bar-config',
      refresh: true,
      search: true,
    },
    showOverflow: true,
  },
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
  showSearchForm: false,
});

// 根据用户类型获取状态标签
const getStatusTabs = () => {
  switch (props.userType) {
    case '个人':
      return [
        { label: '全部', value: '全部' },
        { label: '未认证', value: '未认证' },
        { label: '待审核', value: '待审核' },
        { label: '已认证', value: '已认证' },
        { label: '认证失败', value: '认证失败' },
      ];
    case '企业':
      return [
        { label: '全部', value: '全部' },
        { label: '未认证', value: '未认证' },
        { label: '待审核', value: '待审核' },
        { label: '已认证', value: '已认证' },
        { label: '认证失败', value: '认证失败' },
      ];
    case '政府':
      return [
        { label: '全部', value: '全部' },
        { label: '在线', value: '在线' },
        { label: '离线', value: '离线' },
      ];
    default:
      return [];
  }
};

// 状态标签页
const activeStatus = ref('全部');
const statusTabs = computed(() => getStatusTabs());

const handleStatusChange = () => {
  gridApi.query();
};

// 生成带数字角标的标签
const createLabel = (item) => {
  let count = 0;

  // 根据用户类型选择不同的状态字段
  const statusField = props.userType === '政府' ? 'online_status' : 'cert_status';

  count = item.value === '全部'
    ? dataObj.apilist.length
    : dataObj.apilist.filter((v) => v[statusField] === item.value).length;

  return `${item.label}(${count})`;
};

const handleSerachShow = () => {
  drawerApi.open();
};
const handleFullShow = () => {
  screenfull.toggle();
};

// 关联字段点击弹出抽屉
const [MerchantDrawer, merchantDrawerApi] = useVbenDrawer({
  width: '70%',
  mask: false,
  modal: false,
  position: 'right',
  appendToMain: true,
  title: computed(
    () => selectedMerchant.value?.merchantName || '商户关联用户列表',
  ),
  onCancel() {
    merchantDrawerApi.close();
  },
});

const selectedMerchant = ref(null);

const handleMerchantClick = (row) => {
  // 根据merchantId从merchantList中查找商户详情
  selectedMerchant.value = merchantList.find(
    (merchant) => merchant.merchant_id === row.merchantId,
  );
  merchantDrawerApi.open();
};

const selectedDetailUser = ref(null);
const detailFields = computed(() => getUserDetailFields(props.userType));

const detailDrawerRef = ref(null);

const handleDetailClose = () => {
  selectedDetailUser.value = null;
};

// 认证管理抽屉
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
    // 重置认证流程状态
    authStep.value = 1;
    selectedAuthType.value = null;
    authFormData.value = {};
  },
});

const selectedUser = ref(null);
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

const handleUserDetail = (row) => {
  selectedDetailUser.value = row;
  if (detailDrawerRef.value) {
    detailDrawerRef.value.open();
  }
};

const handleAuthManage = (row = {}) => {
  selectedUser.value = row;
  // 初始化认证表单数据
  authFormData.value = {
    authStatus: row.cert_status || '',
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
  authDrawerApi.open();
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
  if (selectedUser.value) {
    const index = dataObj.apilist.findIndex(
      (item) =>
        (props.userType === '个人' && item.user_id === selectedUser.value.user_id) ||
        (props.userType === '企业' && item.enterprise_id === selectedUser.value.enterprise_id) ||
        (props.userType === '政府' && item.gov_user_id === selectedUser.value.gov_user_id)
    );
    if (index !== -1) {
      // 根据审核结果更新认证状态
      let newCertStatus = selectedUser.value.cert_status;
      if (authFormData.value.reviewResult === '通过') {
        newCertStatus = '已认证';
      } else if (authFormData.value.reviewResult === '驳回') {
        newCertStatus = '认证失败';
      }

      // 更新用户数据
      dataObj.apilist[index] = {
        ...dataObj.apilist[index],
        cert_status: newCertStatus,
        update_time: new Date().toLocaleString('zh-CN'),
      };
    }
  }

  // 无论是否有选中用户，都显示成功提示并关闭抽屉
  ElMessage.success('用户认证操作成功');
  authDrawerApi.close();
  handleRefresh();

  // 重置状态
  authStep.value = 1;
  selectedAuthType.value = null;
  authFormData.value = {};
};
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <MerchantDrawer>
      <div class="merchant-detail">
        <div class="related-users-list">
          <div v-if="selectedMerchant" class="user-item">
            <div class="user-item-details">
              <div class="detail-row">
                <span class="detail-label">商户ID：</span>
                <span class="detail-value">{{
                  selectedMerchant.merchant_id
                }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">商户名称：</span>
                <span class="detail-value">{{
                  selectedMerchant.merchant_name
                }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">商户编码：</span>
                <span class="detail-value">{{
                  selectedMerchant.merchant_code
                }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">联系人：</span>
                <span class="detail-value">{{
                  selectedMerchant.contact_person
                }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">联系电话：</span>
                <span class="detail-value">{{
                  selectedMerchant.contact_phone
                }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">商户地址：</span>
                <span class="detail-value">{{ selectedMerchant.address }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">经营范围：</span>
                <span class="detail-value">{{
                  selectedMerchant.business_scope
                }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">状态：</span>
                <span class="detail-value">
                  <el-tag
                    :type="
                      selectedMerchant.status === '正常'
                        ? 'success'
                        : selectedMerchant.status === '停业'
                          ? 'warning'
                          : 'danger'
                    "
                  >
                    {{ selectedMerchant.status }}
                  </el-tag>
                </span>
              </div>
              <div class="detail-row">
                <span class="detail-label">默认分账比例：</span>
                <span class="detail-value">
                  {{ (selectedMerchant.settlement_ratio * 100).toFixed(1) }}%
                </span>
              </div>
              <div class="detail-row">
                <span class="detail-label">创建时间：</span>
                <span class="detail-value">{{
                  selectedMerchant.create_time
                }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">更新时间：</span>
                <span class="detail-value">{{
                  selectedMerchant.update_time
                }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">创建人：</span>
                <span class="detail-value">{{
                  selectedMerchant.create_by
                }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">更新人：</span>
                <span class="detail-value">{{
                  selectedMerchant.update_by
                }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">备注：</span>
                <span class="detail-value">{{ selectedMerchant.remark }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MerchantDrawer>

    <!-- 用户详情抽屉 -->
    <DetailDrawer
      ref="detailDrawerRef"
      :title="selectedDetailUser?.user_name || selectedDetailUser?.enterprise_name || '用户详情'"
      :data="selectedDetailUser"
      :fields="detailFields"
      @close="handleDetailClose"
      @confirm="handleDetailClose"
    />

    <!-- 认证管理抽屉 -->
    <AuthDrawer>
      <div class="auth-management">
        <!-- 认证流程步骤指示器 -->
        <div class="auth-steps">
          <ElSteps :active="authStep - 1" finish-status="success" align-center>
            <ElStep title="选择认证类型" />
            <ElStep title="填写信息" />
            <ElStep title="提交审核" />
          </ElSteps>
        </div>

        <!-- 步骤1：选择认证类型 -->
        <div v-if="authStep === 1" class="auth-step-content mt-4">
          <!--          <h4>请选择认证类型</h4>-->
          <!--          <p class="text-muted">根据您的用户类型选择相应的认证方式</p>-->

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
          <!--          <h4>填写认证信息</h4>-->

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
          <!--          <h4>审核认证信息</h4>-->

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
    <!-- <NewFormModel @success="handleRefresh" /> -->
    <searchDrawer title="搜索栏设置" />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <Grid>
      <!-- 三级状态 -->
      <template #table-title>
        <div class="tabel-title-container">
          <div v-if="props.secondShow" class="tabel-tabs-container">
            <!-- 状态标签页 -->
            <el-tabs
              v-model="activeStatus"
              class="demo-tabs auth-status-tabs"
              @tab-change="handleStatusChange"
            >
              <el-tab-pane
                v-for="item in statusTabs"
                :key="item.label"
                :label="createLabel(item)"
                :name="item.value"
              />
            </el-tabs>
          </div>
        </div>
      </template>
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: '新增',
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['system:role:create'],
              onClick: handleCreate,
            },
            {
              label: $t('ui.actionTitle.export'),
              type: 'primary',
              icon: ACTION_ICON.DOWNLOAD,
              auth: ['system:role:export'],
              onClick: handleExport,
            },
            {
              label: $t('ui.actionTitle.deleteBatch'),
              type: 'danger',
              icon: ACTION_ICON.DELETE,
              disabled: isEmpty(checkedIds),
              auth: ['system:role:delete'],
              onClick: handleDeleteBatch,
            },
            {
              label: '用户认证',
              type: 'warning',
              icon: ACTION_ICON.AUDIT,
              onClick: handleAuthManage,
            },
          ]"
        />
        <button
          class="vxe-button type--button size--small is--circle ml-2"
          title="搜索"
          type="button"
          @click="handleSerachShow"
        >
          <i
            class="vxe-button--item vxe-button--prefix-icon vxe-icon-search"
          ></i>
        </button>
        <button
          class="vxe-button type--button size--small is--circle"
          title="全屏"
          type="button"
          @click="handleFullShow"
        >
          <i
            class="vxe-button--item vxe-button--prefix-icon vxe-table-icon-fullscreen"
          ></i>
        </button>
      </template>
      <!-- 认证状态插槽 -->
      <template #certStatus="{ row }">
        <el-tag
          :type="
            row.cert_status === '已认证'
              ? 'success'
              : row.cert_status === '待审核'
                ? 'warning'
                : row.cert_status === '认证失败'
                  ? 'danger'
                  : 'info'
          "
        >
          {{ row.cert_status }}
        </el-tag>
      </template>
      <!-- 账号状态插槽 -->
      <template #accountStatus="{ row }">
        <el-tag
          :type="
            row.account_status === '正常'
              ? 'success'
              : row.account_status === '禁用'
                ? 'danger'
                : row.account_status === '冻结'
                  ? 'warning'
                  : 'info'
          "
        >
          {{ row.account_status }}
        </el-tag>
      </template>
      <!-- 代付规则状态插槽 -->
      <template #proxyStatus="{ row }">
        <el-tag
          :type="
            row.proxy_status === '启用'
              ? 'success'
              : row.proxy_status === '禁用'
                ? 'danger'
                : 'info'
          "
        >
          {{ row.proxy_status }}
        </el-tag>
      </template>
      <!-- 在线状态插槽 -->
      <template #onlineStatus="{ row }">
        <el-tag
          :type="
            row.online_status === '在线'
              ? 'success'
              : 'info'
          "
        >
          {{ row.online_status }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              type: 'primary',
              link: true,
              icon: ACTION_ICON.VIEW,
              onClick: handleUserDetail.bind(null, row),
            },
            {
              type: 'primary',
              link: true,
              icon: ACTION_ICON.EDIT,
              onClick: handleEdit.bind(null, row),
            },
            {
              type: 'danger',
              link: true,
              icon: ACTION_ICON.BAN,
              popConfirm: {
                title: $t('ui.actionMessage.disableConfirm', [row.user_name || row.enterprise_name]),
                confirm: handleDisable.bind(null, row),
              },
            },
          ]"
        />
      </template>
      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon">
            <ArrowDown />
          </el-icon>
          <span>
            <template v-if="props.userType === '个人'">
              本页统计：用户数量{{ dataObj.list.length }};认证通过:{{
                dataObj.list.filter((item) => item.cert_status === '已认证')
                  .length
              }};待审核:{{
                dataObj.list.filter((item) => item.cert_status === '待审核').length
              }};正常账号:{{
                dataObj.list.filter((item) => item.account_status === '正常').length
              }}
            </template>
            <template v-else-if="props.userType === '企业'">
              本页统计：企业数量{{ dataObj.list.length }};认证通过:{{
                dataObj.list.filter((item) => item.cert_status === '已认证')
                  .length
              }};待审核:{{
                dataObj.list.filter((item) => item.cert_status === '待审核').length
              }};正常账号:{{
                dataObj.list.filter((item) => item.account_status === '正常').length
              }}
            </template>
            <template v-else-if="props.userType === '政府'">
              本页统计：用户数量{{ dataObj.list.length }};在线:{{
                dataObj.list.filter((item) => item.online_status === '在线')
                  .length
              }};离线:{{
                dataObj.list.filter((item) => item.online_status === '离线').length
              }};正常账号:{{
                dataObj.list.filter((item) => item.account_status === '正常').length
              }}
            </template>
          </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> 全部统计：{{ dataObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>

<style scoped>
.tabel-title-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 0;
}

.tabel-tabs-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.user-type-tabs {
  margin-bottom: 0;
}

.auth-status-tabs {
  margin-bottom: 0;
}

.merchant-detail h3 {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.related-users-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-item {
  padding: 16px;
  background-color: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.user-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
}

.user-item-header {
  display: flex;
  align-items: center;
  padding-bottom: 8px;
  margin-bottom: 12px;
  border-bottom: 1px solid #f0f2f5;
}

.user-item-index {
  margin-right: 8px;
  font-weight: bold;
  color: #409eff;
}

.user-item-name {
  font-size: 15px;
  font-weight: bold;
  color: #303133;
}

.user-item-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-row {
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 1.5;
}

.detail-label {
  width: 100px;
  margin-right: 16px;
  font-weight: 500;
  color: #606266;
  text-align: right;
}

.detail-value {
  flex: 1;
  color: #303133;
}

.empty-list {
  padding: 40px 0;
  color: #909399;
  text-align: center;
  background-color: #fafafa;
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
}

.relateField {
  color: #409eff;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.3s ease;
}

.relateField:hover {
  color: #66b1ff;
  text-decoration: underline;
}

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

.main-auth-steps {
  padding: 20px;
  margin-bottom: 16px;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 8%);
}

.main-auth-steps h3 {
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: bold;
  color: #303133;
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
