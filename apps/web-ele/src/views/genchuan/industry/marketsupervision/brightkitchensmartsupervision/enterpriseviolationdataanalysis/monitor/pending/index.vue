<script setup>
import { computed, onMounted, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import {
  ElButton,
  ElDialog,
  ElInput,
  ElInputNumber,
  ElLoading,
  ElMessage,
  ElOption,
  ElSelect,
} from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  addRoad,
  batchConfirmInvalidSysWarn,
  confirmInvalid,
  confirmValid,
  createWorkOrder,
  deleteWarn,
  getRoadFacility,
  getRoadFacilityList,
  getwarnList,
  updateRoad,
} from '#/api/genchuan/industry/urban/index.js';
import { $t } from '#/locales';
import { formatTimestamp } from '#/utils';

import { useFormSchema, useGridColumns } from './data';
// 引入封装后的详情抽屉组件
import tableDetail from './detail.vue';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  arrowShow: {
    type: Boolean,
    default: false,
  },
  arrowState: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['arrow-change']);
const roadDetailRef = ref(null);
const schemaData = ref(null);
const roadObj = ref({ detailObj: {}, list: [] });
// 批量确认无效预警弹窗相关
const switchDialogVisible = ref(false);
const switchLoading = ref(false);

// 标注无效预警相关
const noConfirmDrawerApi = ref(null);
const currentNoConfirmRow = ref({}); // 当前标注无效的行数据
const invalidReason = ref(''); // 无效原因
const noConfirmLoading = ref(false); // 保存按钮加载状态

const getTitle = computed(() => {
  return formData.value?.id ? '编辑' : '新增';
});
onMounted(async () => {
  const roadList = await getRoadFacilityList({
    pageNo: 1,
    pageSize: 999,
  });
  roadObj.value.list = roadList.list;
  let roadIndex = 0;
  const schema = useFormSchema();
  schema.forEach((v, i) => {
    if (v.fieldName === 'roadId') {
      roadIndex = i;
    }
  });
  schema[roadIndex] = {
    fieldName: 'roadId',
    label: '道路名称',
    component: 'Select',
    labelWidth: '120',
    componentProps: {
      allowClear: true,
      filterOption: true,
      options: roadObj.value.list.map((v) => {
        return {
          label: v.roadName,
          value: v.id,
        };
      }),
      placeholder: '请选择设备在线状态',
      showSearch: true,
    },
    rules: 'required',
    isSearch: true,
    addShow: true,
    editShow: true,
  };
  schemaData.value = schema;
  // 初始化获取运维员列表
  await getOperatorList();
});
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    drawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});
// 移除原 DetailDrawer 初始化逻辑
const formData = ref();
const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});
const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    formDrawerApi.close();
  },
  async onConfirm() {
    const obj = formApi.form.values;
    await (formDrawerApi.sharedData.payload.title === '增加'
      ? addRoad(obj)
      : updateRoad({ ...dataObj.editObj, ...obj }));
    handleRefresh();
    formDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
      if (formData.value?.id) {
        await formApi.setValues(formData.value);
      } else {
        formApi.resetForm();
      }
    }
  },
});
/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

async function handleDelete(row) {
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting'),
  });
  try {
    await deleteWarn(row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess'));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

async function handleDeleteBatch() {
  await confirm($t('确定删除这些数据吗？')).then(() => {
    checkedIds.value.forEach(async (v) => {
      await handleDelete({
        id: v,
      });
    });
  });
  handleRefresh();
}
const recordsList = ref([]);
const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
  recordsList.value = records;
}
const dataObj = reactive({
  totalShow: false,
  detailObj: {}, // 保留详情对象用于传递给组件
  total: 0,
  currentPage: 1,
  pageSize: 10,
  apilist: [],
  imgUrl: '',
  serachObj: {},
  list: [],
  editObj: {},
});
const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};
// 表格数据获取
const getTableData = async (pageObj) => {
  const getParams = {
    pageNo: pageObj.page.currentPage,
    pageSize: pageObj.page.pageSize,
    ...dataObj.serachObj,
  };
  const data = await getwarnList(getParams);
  dataObj.total = data.total;
  dataObj.list = data.list.map((v) => {
    return {
      ...v,
      updateTime: formatTimestamp(v.updateTime),
      createTime: formatTimestamp(v.createTime),
    };
  });
  return dataObj;
};

const [QueryForm, QueryFormApi] = useVbenForm({
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
  schema: useFormSchema()
    .filter((v) => v.isSearch)
    .map((v) => {
      delete v.rules;
      return {
        ...v,
      };
    }),
  // 是否可展开
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});
// 搜索表单查询
async function onSubmit() {
  dataObj.serachObj = await QueryFormApi.getValues();
  gridApi.reload();
  drawerApi.close();
}
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => getTableData({ page }),
      },
    },
    rowConfig: {
      keyField: 'id',
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

// 修改打开详情的方法，调用组件的open方法
const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  // 通过ref调用组件的open方法
  parkDetailDrawerRef.value.open();
};
const handleSerachShow = () => {
  drawerApi.open();
};
const handleFullShow = () => {
  screenfull.toggle();
};
const arrowChange = () => {
  emit('arrow-change');
};
// 定义组件ref，用于调用组件方法
const parkDetailDrawerRef = ref(null);
const settingConfig = () => {
  // 这里可以补充手动触发预警的弹窗逻辑
};

// 批量确认无效预警 - 打开二次确认弹窗
const switchOpen = () => {
  // 校验是否选择了数据
  if (isEmpty(checkedIds.value)) {
    ElMessage.warning('请先选择需要确认无效的预警！');
    return;
  }

  // 打开二次确认弹窗
  switchDialogVisible.value = true;
};

// 批量确认无效预警 - 确认操作
const handleSwitchConfirm = async () => {
  try {
    switchLoading.value = true; // 开启加载状态

    // 调用批量确认无效预警的接口
    await batchConfirmInvalidSysWarn({
      idList: recordsList.value.map((v) => v.id),
    });
    ElMessage.success('批量确认无效预警操作成功！');
    switchDialogVisible.value = false; // 关闭弹窗
    handleRefresh(); // 刷新表格数据
  } catch (error) {
    ElMessage.error(`操作失败：${error.message || '网络异常'}`);
  } finally {
    switchLoading.value = false; // 关闭加载状态
  }
};

const openRoadDetail = async (row) => {
  const resObj = await getRoadFacility({
    id: row.roadId,
  });
  roadObj.value.detailObj = resObj;
  roadDetailRef.value.open();
};
// 确认有效 - 抽屉
const currentConfirmRow = ref({});
const confirmOpinion = ref('');
// 确认有效 - 打开抽屉
function handleConfirm(row) {
  currentConfirmRow.value = row;
  confirmOpinion.value = '';
  confirmDrawerApi.open();
}

// 确认有效 - 保存
async function handleConfirmSave() {
  if (!confirmOpinion.value) {
    ElMessage.warning('请输入确认意见');
    return;
  }

  try {
    await confirmValid({
      id: currentConfirmRow.value.id,
      confirmOpinion: confirmOpinion.value,
    });

    ElMessage.success('操作成功');
    confirmDrawerApi.close();
    handleRefresh();
  } catch {
    ElMessage.error('操作失败');
  }
}
// 确认有效抽屉
const [ConfirmDrawer, confirmDrawerApi] = useVbenDrawer({
  title: '确认有效',
  placement: 'right',
  width: 480,
  footer: false,
  appendToMain: true,
  modal: false,
  onCancel() {
    confirmDrawerApi.close();
  },
});

// 标注无效预警 - 打开抽屉
const handleNoConfirm = (row) => {
  // 初始化数据
  currentNoConfirmRow.value = row;
  invalidReason.value = '';
  // 打开抽屉
  noConfirmDrawerApi.value.open();
};

// 标注无效预警 - 保存
const handleNoConfirmSave = async () => {
  // 校验无效原因
  if (!invalidReason.value.trim()) {
    ElMessage.warning('请输入无效原因！');
    return;
  }

  try {
    noConfirmLoading.value = true;
    // 调用标注无效预警的接口
    await confirmInvalid({
      id: currentNoConfirmRow.value.id,
      invalidReason: invalidReason.value.trim(), // 无效原因
    });

    ElMessage.success('标注无效预警成功！');
    noConfirmDrawerApi.value.close();
    handleRefresh(); // 刷新表格
  } catch (error) {
    ElMessage.error(`标注失败：${error.message || '网络异常'}`);
  } finally {
    noConfirmLoading.value = false;
  }
};

// 标注无效预警抽屉
const [NoConfirmDrawer, noConfirmDrawerApiRef] = useVbenDrawer({
  title: '标注无效预警',
  placement: 'right',
  width: 480,
  footer: false,
  appendToMain: true,
  modal: false,
  onCancel() {
    noConfirmDrawerApiRef.close();
  },
});
// 赋值ref以便外部调用
noConfirmDrawerApi.value = noConfirmDrawerApiRef;

// -------------------- 派发工单功能（按截图字段改造） --------------------
// 派发工单相关
const giveDrawerApi = ref(null); // 派发工单抽屉实例
const currentGiveRow = ref({}); // 当前派发工单的行数据
// 工单表单数据（匹配截图字段）
const giveForm = reactive({
  warnId: '1', // 关联预警ID
  assignStaffId: '张三', // 指派运维员ID
  assignStaffName: '', // 指派运维员名称（冗余）
  orderType: '', // 工单类型
  bizType: '', // 业务类型
  dealLimit: 0, // 处置时限（小时）
  priorityLevel: 1, // 工单优先等级
  riskLevel: 1, // 安全风险等级
  remark: '', // 派单备注（选填）
});
const giveLoading = ref(false); // 派单按钮加载状态
const operatorList = ref([]); // 运维员列表（用于下拉选择）
// 工单类型选项
const orderTypeOptions = ref([
  { label: '运维', value: '运维' },
  { label: '养护', value: '养护' },
  { label: '维修', value: '维修' },
  { label: '清淤', value: '清淤' },
  { label: '巡检', value: '巡检' },
  { label: '处置', value: '处置' },
]);
// 业务类型选项（根据工单类型联动）
const bizTypeOptions = ref([]);
// 优先级/风险等级选项
const levelOptions = ref([
  { label: '1-低', value: 1 },
  { label: '2-中', value: 2 },
  { label: '3-高', value: 3 },
]);

// 获取运维员列表（下拉选择用）
const getOperatorList = async () => {
  try {
    // const res = await getStaffList(); // 替换为实际获取运维员接口
    // operatorList.value = res.list.map((item) => ({
    //   label: item.staffName,
    //   value: item.staffId,
    // }));
    operatorList.value = [];
  } catch {
    ElMessage.error('获取运维员列表失败！');
  }
};

// 工单类型变更联动业务类型
const handleOrderTypeChange = (val) => {
  giveForm.bizType = '';
  // 根据工单类型匹配业务类型（按截图注释逻辑）
  if (val === '清淤') {
    bizTypeOptions.value = [
      { label: '机械清淤', value: '机械清淤' },
      { label: '人工清淤', value: '人工清淤' },
      { label: '高压冲洗', value: '高压冲洗' },
    ];
  } else if (val === '处置') {
    bizTypeOptions.value = [
      { label: '倾斜', value: '倾斜' },
      { label: '振动', value: '振动' },
      { label: '开合异常', value: '开合异常' },
    ];
  } else {
    // 其他工单类型业务类型与工单类型一致
    bizTypeOptions.value = [{ label: val, value: val }];
  }
};

// 打开派发工单抽屉
const handleGive = async (row) => {
  currentGiveRow.value = row;
  // 初始化表单数据
  Object.assign(giveForm, {
    warnId: row.id, // 关联预警ID
    assignStaffId: '1',
    assignStaffName: '张三',
    orderType: '',
    bizType: '',
    dealLimit: 0,
    priorityLevel: 1,
    riskLevel: 1,
    remark: '',
  });
  giveDrawerApi.value.open();
};

// 派发工单提交
const handleGiveSubmit = async () => {
  // 1. 必填校验
  const requiredFields = [
    { key: 'warnId', msg: '关联预警ID不能为空' },
    { key: 'assignStaffId', msg: '请选择指派运维员' },
    { key: 'orderType', msg: '请选择工单类型' },
    { key: 'bizType', msg: '请选择业务类型' },
    { key: 'dealLimit', msg: '请设置处置时限' },
  ];
  for (const field of requiredFields) {
    if (!giveForm[field.key]) {
      ElMessage.warning(field.msg);
      return;
    }
  }

  try {
    giveLoading.value = true;
    // 调用创建工单接口
    await createWorkOrder({
      warnId: giveForm.warnId,
      assignStaffId: giveForm.assignStaffId,
      assignStaffName: giveForm.assignStaffName,
      orderType: giveForm.orderType,
      bizType: giveForm.bizType,
      dealLimit: giveForm.dealLimit,
      priorityLevel: giveForm.priorityLevel,
      riskLevel: giveForm.riskLevel,
      remark: giveForm.remark,
    });

    ElMessage.success('工单派发成功！');
    giveDrawerApi.value.close();
    handleRefresh(); // 刷新表格
  } catch (error) {
    ElMessage.error(`派单失败：${error.message || '网络异常'}`);
  } finally {
    giveLoading.value = false;
  }
};

// 派发工单抽屉初始化
const [GiveDrawer, giveDrawerApiRef] = useVbenDrawer({
  title: '派发运维工单',
  placement: 'right',
  width: 520,
  footer: false,
  appendToMain: true,
  modal: false,
  onCancel() {
    giveDrawerApiRef.close();
  },
});
giveDrawerApi.value = giveDrawerApiRef;
// -------------------- 派发工单功能结束 --------------------
</script>

<template>
  <div class="park-lot-table-new">
    <!-- 确认有效抽屉 -->
    <ConfirmDrawer>
      <div class="p-6">
        <div class="mb-4">
          <label class="mb-2 block text-sm font-medium">确认意见</label>
          <ElInput
            v-model="confirmOpinion"
            type="textarea"
            :rows="6"
            placeholder="请输入确认意见"
          />
        </div>

        <div class="flex justify-end gap-2">
          <ElButton @click="confirmDrawerApi.close()">取消</ElButton>
          <ElButton type="primary" @click="handleConfirmSave">保存</ElButton>
        </div>
      </div>
    </ConfirmDrawer>

    <!-- 标注无效预警抽屉 -->
    <NoConfirmDrawer>
      <div class="p-6">
        <!-- 预警编号提示 -->
        <div class="mb-4 text-sm text-gray-500">
          预警编号：<span class="text-primary">{{
            currentNoConfirmRow.warnNo
          }}</span>
        </div>

        <div class="mb-4">
          <label class="mb-2 block text-sm font-medium">无效原因 <span class="text-red-500">*</span></label>
          <ElInput
            v-model="invalidReason"
            type="textarea"
            :rows="8"
            placeholder="请详细描述该预警标注为无效的原因（例如：误报、数据异常、已处理等）"
            maxlength="500"
            show-word-limit
          />
        </div>

        <div class="flex justify-end gap-2">
          <ElButton @click="noConfirmDrawerApi.close()">取消</ElButton>
          <ElButton
            type="primary"
            @click="handleNoConfirmSave"
            :loading="noConfirmLoading"
          >
            确认标注无效
          </ElButton>
        </div>
      </div>
    </NoConfirmDrawer>

    <!-- 派发工单抽屉（按截图字段改造） -->
    <GiveDrawer>
      <div class="p-6">
        <!-- 预警基本信息 -->
        <div class="mb-6 text-sm text-gray-500">
          <div class="mb-1">
            预警编号：<span class="text-primary">{{
              currentGiveRow.warnNo
            }}</span>
          </div>
          <div>
            所属道路：<span class="text-primary">{{
              currentGiveRow.roadName
            }}</span>
          </div>
        </div>

        <!-- 派单表单（匹配截图字段） -->
        <div class="form-item mb-4">
          <label class="mb-2 block text-sm font-medium">
            指派运维员 <span class="text-red-500">*</span>
          </label>
          <ElInput
            v-model="giveForm.assignStaffName"
            type="textarea"
            :rows="4"
            placeholder="请输入运维员"
            maxlength="300"
            show-word-limit
          />
        </div>
        <div class="form-item mb-4">
          <label class="mb-2 block text-sm font-medium">
            工单类型 <span class="text-red-500">*</span>
          </label>
          <ElSelect
            v-model="giveForm.orderType"
            placeholder="请选择工单类型"
            class="w-full"
            @change="handleOrderTypeChange"
          >
            <ElOption
              v-for="item in orderTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </div>

        <div class="form-item mb-4">
          <label class="mb-2 block text-sm font-medium">
            业务类型 <span class="text-red-500">*</span>
          </label>
          <ElSelect
            v-model="giveForm.bizType"
            placeholder="请选择业务类型"
            class="w-full"
            :disabled="!giveForm.orderType"
          >
            <ElOption
              v-for="item in bizTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </div>

        <div class="form-item mb-4">
          <label class="mb-2 block text-sm font-medium">
            处置时限（小时）<span class="text-red-500">*</span>
          </label>
          <ElInputNumber
            v-model="giveForm.dealLimit"
            placeholder="请输入处置时限"
            class="w-full"
            :min="1"
            :precision="0"
          />
        </div>

        <div class="form-item mb-4">
          <label class="mb-2 block text-sm font-medium">
            工单优先等级 <span class="text-red-500">*</span>
          </label>
          <ElSelect
            v-model="giveForm.priorityLevel"
            placeholder="请选择优先等级"
            class="w-full"
          >
            <ElOption
              v-for="item in levelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </div>

        <div class="form-item mb-4">
          <label class="mb-2 block text-sm font-medium">
            安全风险等级 <span class="text-red-500">*</span>
          </label>
          <ElSelect
            v-model="giveForm.riskLevel"
            placeholder="请选择风险等级"
            class="w-full"
          >
            <ElOption
              v-for="item in levelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </div>

        <div class="form-item mb-6">
          <label class="mb-2 block text-sm font-medium">派单备注</label>
          <ElInput
            v-model="giveForm.remark"
            type="textarea"
            :rows="4"
            placeholder="请输入派单备注（选填）"
            maxlength="300"
            show-word-limit
          />
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-end gap-2">
          <ElButton @click="giveDrawerApi.close()">取消</ElButton>
          <ElButton
            type="primary"
            @click="handleGiveSubmit"
            :loading="giveLoading"
          >
            确认派发
          </ElButton>
        </div>
      </div>
    </GiveDrawer>

    <!-- 批量确认无效预警 二次确认弹窗 -->
    <ElDialog
      v-model="switchDialogVisible"
      title="批量确认无效预警"
      width="380px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      destroy-on-close
    >
      <div class="switch-dialog-content">
        <div class="selected-count">
          你已选择
          <span class="count-num">{{ checkedIds.length }}</span>
          条预警数据，确认要标记为无效吗？
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <ElButton @click="switchDialogVisible = false">取消</ElButton>
          <ElButton
            type="primary"
            @click="handleSwitchConfirm"
            :loading="switchLoading"
          >
            确认标记为无效
          </ElButton>
        </div>
      </template>
    </ElDialog>

    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <!-- 使用封装后的详情抽屉组件 -->
    <tableDetail
      ref="parkDetailDrawerRef"
      :detail-obj="dataObj.detailObj"
      title="详情"
    />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>
    <Grid>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton
            content="手动触发预警"
            icon-name="setting"
            @click="settingConfig"
          />
          <IconButton
            content="批量确认无效预警"
            icon-name="switch"
            @click="switchOpen"
          />
          <IconButton
            content="批量删除"
            icon-name="delete"
            color="#F56C6C"
            :disabled="isEmpty(checkedIds)"
            @click="handleDeleteBatch"
          />
          <IconButton
            content="搜索"
            icon-name="search"
            @click="handleSerachShow"
          />
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
        </div>
      </template>
      <template #warnNo="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.warnNo }}
        </el-text>
      </template>
      <template #roadName="{ row }">
        <el-text
          @click="openRoadDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.warnNo }}
        </el-text>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
          <IconButton
            content="确认有效"
            icon-name="Check"
            :disabled="row.status !== '待处置'"
            @click="handleConfirm(row)"
          />
          <IconButton
            content="标注无效"
            icon-name="Paperclip"
            :disabled="row.status !== '待处置'"
            @click="handleNoConfirm(row)"
          />
          <IconButton
            content="派发工单"
            icon-name="Avatar"
            :disabled="row.status !== '待处置'"
            @click="handleGive(row)"
          />
          <IconButton
            content="删除"
            icon-name="delete"
            color="#F56C6C"
            @click="handleDelete(row)"
          />
        </div>
      </template>
      <template #bottom>
        <div class="common-total" @click="changeTotalShow"></div>
      </template>
    </Grid>
  </div>
</template>

<style scoped lang="scss">
// 批量切换状态弹窗样式
.switch-dialog-content {
  padding: 20px 0;

  .selected-count {
    margin-bottom: 20px;
    font-size: 14px;
    color: #606266;

    .count-num {
      font-weight: 600;
      color: #1989fa;
    }
  }

  .status-select {
    font-size: 14px;

    .label {
      font-weight: 500;
      color: #303133;
    }
  }
}

.dialog-footer {
  text-align: right;
}

// 按钮禁用样式优化
:deep(.common-toolbar-tools) {
  .el-button.is-disabled {
    opacity: 0.6;
  }
}

// 弹窗样式优化
:deep(.el-dialog) {
  .el-dialog__body {
    padding: 20px 20px 10px;
  }
  .el-dialog__footer {
    padding: 10px 20px 20px;
  }
}

// 标注无效抽屉样式优化
:deep(.el-drawer) {
  .el-drawer__body {
    padding: 0;
  }
}

// 派发工单表单样式
.form-item {
  &:last-of-type {
    margin-bottom: 0;
  }

  .el-select,
  .el-date-picker,
  .el-input-number {
    width: 100%;
  }
}

.text-red-500 {
  color: #f56c6c;
}

.text-gray-500 {
  color: #909399;
}

.text-primary {
  color: #409eff;
}
</style>
