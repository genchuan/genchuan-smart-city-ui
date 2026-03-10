<script setup>
import { computed, onMounted, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
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
  batchConfirmRemind,
  batchUpdateAssignStaff, // 新增：批量提醒接口
  confirmValid,
  deleteWarn,
  getRoadFacility,
  getRoadFacilityList,
  getRoadWorkOrder,
  updateRoad,
} from '#/api/genchuan/industry/urban/index.js';
import { $t } from '#/locales';
import { formatTimestamp } from '#/utils';

import { useFormSchema, useGridColumns } from './data';
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

const currentSwitchRow = ref({});
const switchLoading = ref(false);
const assignForm = reactive({
  assignStaffId: '',
  assignStaffName: '',
  remark: '',
});
const assignFormRules = reactive({
  assignStaffId: [
    { required: true, message: '请选择新的指派运维员', trigger: 'change' },
  ],
});
const staffList = ref([]);
const assignFormRef = ref(null);

// 批量提醒相关（核心新增）
const warnLoading = ref(false); // 批量提醒加载状态
const warnForm = reactive({
  warnContent: '', // 提醒内容
  sendType: 'SYSTEM', // 发送方式：SYSTEM-系统消息，SMS-短信，WECHAT-微信
});
const warnFormRules = reactive({
  warnContent: [
    { required: true, message: '请输入提醒内容', trigger: 'blur' },
    { min: 5, max: 200, message: '提醒内容长度在5-200个字符', trigger: 'blur' },
  ],
  sendType: [{ required: true, message: '请选择发送方式', trigger: 'change' }],
});
const warnFormRef = ref(null);
const getTitle = computed(() => {
  return formData.value?.id ? '编辑' : '新增';
});

onMounted(async () => {
  const roadList = await getRoadFacilityList({
    pageNo: 1,
    pageSize: 999,
  });
  roadObj.value.list = roadList.list;

  await fetchStaffList();

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
});

const fetchStaffList = async () => {
  try {
    staffList.value = [
      { value: '1', label: '张三' },
      { value: '2', label: '李四' },
    ];
  } catch {
    ElMessage.error('获取运维员列表失败！');
  }
};

const handleSwitch = (row) => {
  assignForm.assignStaffId = '';
  assignForm.assignStaffName = '';
  assignForm.remark = '';
  currentSwitchRow.value = row;
  switchDrawerApi.open();
};

const handleSwitchConfirm = async () => {
  const valid = await assignFormRef.value.validate();
  if (!valid) return;

  try {
    switchLoading.value = true;
    const nowObj = staffList.value.find(
      (v) => v.value === assignForm.assignStaffId,
    );
    await batchUpdateAssignStaff({
      workOrderId: currentSwitchRow.value.id,
      assignStaffId: nowObj.value,
      assignStaffName: nowObj.label,
    });

    ElMessage.success('调整派单对象并推送提醒成功！');
    switchDrawerApi.close();
    handleRefresh();
  } catch (error) {
    ElMessage.error(`操作失败：${error.message || '网络异常'}`);
  } finally {
    switchLoading.value = false;
  }
};

// 批量提醒抽屉（核心新增）
const [WarnDrawer, warnDrawerApi] = useVbenDrawer({
  title: '批量发送提醒',
  placement: 'right',
  width: 450,
  appendToMain: true,
  modal: false,
  footer: false,
  onCancel() {
    warnFormRef.value?.resetFields();
    warnDrawerApi.close();
  },
});

// 打开批量提醒抽屉（核心新增）
const handleWarnOpen = () => {
  // 初始化提醒表单
  warnForm.warnContent = '';
  warnForm.sendType = 'SYSTEM';
  // 打开抽屉
  warnDrawerApi.open();
};

// 提交批量提醒（核心新增）
const handleWarnSubmit = async () => {
  try {
    warnLoading.value = true;

    // 3. 调用批量提醒接口
    await batchConfirmRemind({
      idList: checkedIds.value, // 选中的工单ID列表
    });

    ElMessage.success(`成功发送${checkedIds.value.length}条提醒！`);
    warnDrawerApi.close();
    handleRefresh();
  } catch (error) {
    ElMessage.error(`批量提醒发送失败：${error.message || '网络异常'}`);
  } finally {
    warnLoading.value = false;
  }
};

// 批量提醒按钮禁用逻辑（核心新增）
const isWarnDisabled = () => {
  return isEmpty(checkedIds.value); // 无选中工单时禁用
};

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

const [SwitchDrawer, switchDrawerApi] = useVbenDrawer({
  title: '调整派单对象',
  placement: 'right',
  width: 450,
  appendToMain: true,
  modal: false,
  footer: false,
  onCancel() {
    assignFormRef.value?.resetFields();
    switchDrawerApi.close();
  },
});

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
  detailObj: {},
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

const getTableData = async (pageObj) => {
  const getParams = {
    pageNo: pageObj.page.currentPage,
    pageSize: pageObj.page.pageSize,
    ...dataObj.serachObj,
  };
  const data = await getRoadWorkOrder(getParams);
  dataObj.total = data.total;
  dataObj.list = data.list.map((v) => {
    return {
      ...v,
      updateTime: formatTimestamp(v.updateTime),
      arriveTime: formatTimestamp(v.arriveTime),
      createTime: formatTimestamp(v.createTime),
    };
  });
  return dataObj;
};

const [QueryForm, QueryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: useFormSchema()
    .filter((v) => v.isSearch)
    .map((v) => {
      delete v.rules;
      return {
        ...v,
      };
    }),
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});

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

const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
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

const parkDetailDrawerRef = ref(null);

const openRoadDetail = async (row) => {
  const resObj = await getRoadFacility({
    id: row.roadId,
  });
  roadObj.value.detailObj = resObj;
  roadDetailRef.value.open();
};

const currentConfirmRow = ref({});
const confirmOpinion = ref('');
const handleConfirm = (row) => {
  currentConfirmRow.value = row;
  confirmOpinion.value = '';
  confirmDrawerApi.open();
};

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

    <!-- 批量提醒抽屉（核心新增） -->
    <WarnDrawer>
      <div class="warn-drawer-content p-6">
        <ElForm
          ref="warnFormRef"
          :model="warnForm"
          :rules="warnFormRules"
          class="warn-form"
        >
          <!-- 选中工单数量展示 -->
          <div class="form-item mb-4">
            <label class="mb-2 block text-sm font-medium">提醒范围</label>
            <div class="text-sm text-gray-700">
              已选中 {{ checkedIds.length }} 个工单
            </div>
          </div>
        </ElForm>

        <!-- 操作按钮 -->
        <div class="mt-6 flex justify-end gap-2">
          <ElButton @click="warnDrawerApi.close()">取消</ElButton>
          <ElButton
            type="primary"
            @click="handleWarnSubmit"
            :loading="warnLoading"
          >
            确认发送提醒
          </ElButton>
        </div>
      </div>
    </WarnDrawer>

    <!-- 调整派单对象抽屉 -->
    <SwitchDrawer>
      <div class="assign-drawer-content p-6">
        <ElForm
          ref="assignFormRef"
          :model="assignForm"
          :rules="assignFormRules"
          class="assign-form"
        >
          <div class="form-item mb-4">
            <label class="mb-2 block text-sm font-medium">当前工单</label>
            <div class="text-sm text-gray-700">
              工单编号：{{ currentSwitchRow.orderNo || '-' }}
            </div>
          </div>

          <ElFormItem label="新指派运维员" prop="assignStaffId" class="mb-4">
            <ElSelect
              v-model="assignForm.assignStaffId"
              placeholder="请选择运维员"
              class="w-full"
              @change="
                (val) => {
                  const staff = staffList.find((item) => item.staffId === val);
                  assignForm.assignStaffName = staff?.staffName || '';
                }
              "
            >
              <ElOption
                v-for="item in staffList"
                :key="item.staffId"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElForm>

        <div class="mt-6 flex justify-end gap-2">
          <ElButton @click="switchDrawerApi.close()">取消</ElButton>
          <ElButton
            type="primary"
            @click="handleSwitchConfirm"
            :loading="switchLoading"
          >
            确认调整并推送提醒
          </ElButton>
        </div>
      </div>
    </SwitchDrawer>

    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>

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
          <!-- 批量提醒按钮（核心新增） -->
          <IconButton
            content="批量提醒"
            icon-name="AlarmClock"
            color="#F56C6C"
            :disabled="isWarnDisabled()"
            @click="handleWarnOpen"
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
      <template #orderNo="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.orderNo }}
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
            content="调整派单对象"
            icon-name="switch"
            @click="handleSwitch(row)"
          />
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleOpenDetail(row)"
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
// 批量提醒抽屉样式（核心新增）
.warn-drawer-content {
  height: 100%;
  box-sizing: border-box;

  .warn-form {
    .el-form-item {
      margin-bottom: 16px;

      &.is-required {
        ::v-deep .el-form-item__label::after {
          content: '*';
          color: #f56c6c;
          margin-left: 4px;
        }
      }
    }

    .form-item {
      font-size: 14px;
      color: #606266;
    }
  }
}

// 调整派单对象抽屉样式
.assign-drawer-content {
  height: 100%;
  box-sizing: border-box;

  .assign-form {
    .el-form-item {
      margin-bottom: 16px;

      &.is-required {
        ::v-deep .el-form-item__label::after {
          content: '*';
          color: #f56c6c;
          margin-left: 4px;
        }
      }
    }

    .form-item {
      font-size: 14px;
      color: #606266;
    }
  }
}

// 按钮禁用样式优化
:deep(.common-toolbar-tools) {
  .el-button.is-disabled {
    opacity: 0.6;
  }
}

// 抽屉样式优化
:deep(.el-drawer) {
  .el-drawer__body {
    padding: 0;
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
