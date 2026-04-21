<script lang="ts" setup>
import type { UploadUserFile } from 'element-plus';
import type { UserCarRow } from '../data';

import { computed, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';

import {
  ElButton,
  ElDescriptions,
  ElDescriptionsItem,
  ElDialog,
  ElInput,
  ElMessage,
  ElTag,
} from 'element-plus';
import dayjs from 'dayjs';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { useVbenForm } from '#/adapter/form';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { exportToExcel } from '#/utils/excel.js';

import {
  buildExportRows,
  detailFields as userCarDetailFields,
  maskPhone,
  useCreateSchema,
  useEditSchema,
  useGridColumns,
  useSearchSchema,
  userOptions,
} from '../data';

const props = withDefaults(
  defineProps<{
    showStats?: boolean;
    toggleStats?: () => void;
    cars?: UserCarRow[];
  }>(),
  {
    showStats: false,
    toggleStats: () => {},
    cars: () => [],
  },
);

const emit = defineEmits<{
  'update:cars': [value: UserCarRow[]];
}>();

const cars = computed({
  get: () => props.cars,
  set: (value: UserCarRow[]) => {
    emit('update:cars', value);
  },
});

const userProfileMap = {
  1: {
    nickname: '张三',
    phone: '13812345678',
    remark: '个人用户，已绑定两辆车',
    userType: '个人用户',
  },
  2: {
    nickname: '李四',
    phone: '13912345679',
    remark: '小程序用户',
    userType: '小程序用户',
  },
  3: {
    nickname: '王五',
    phone: '13712345670',
    remark: '平台侧导入用户',
    userType: '平台用户',
  },
  4: {
    nickname: '赵六',
    phone: '13612345671',
    remark: '高频停车用户',
    userType: '个人用户',
  },
  5: {
    nickname: '孙七',
    phone: '13512345672',
    remark: '近期新增用户',
    userType: '小程序用户',
  },
};

const operatorProfileMap: Record<string, Record<string, string>> = {
  admin: {
    email: 'admin@genchuan.cn',
    phone: '13800000001',
    role: '系统管理员',
  },
  李主管: {
    email: 'li@genchuan.cn',
    phone: '13800000002',
    role: '运营主管',
  },
  陈老师: {
    email: 'chen@genchuan.cn',
    phone: '13800000003',
    role: '运营专员',
  },
  王客服: {
    email: 'wang@genchuan.cn',
    phone: '13800000004',
    role: '客服专员',
  },
};

const currentOperatorProfile = ref<Record<string, string> | null>(null);
const currentRow = ref<UserCarRow>();
const currentUserProfile = ref<Record<string, string> | null>(null);
const detailDrawerRef = ref<null | { open: () => void }>(null);
const drillFilters = ref({
  plateColor: '',
});
const editingId = ref<number | null>(null);
const formData = ref<UserCarRow>();
const formMode = ref<'create' | 'edit'>('create');
const importDialogVisible = ref(false);
const importFileList = ref<UploadUserFile[]>([]);
const operatorDialogVisible = ref(false);
const rejectDialogVisible = ref(false);
const rejectReason = ref('');
const rejectRowId = ref<number | null>(null);
const userDialogVisible = ref(false);

const detailData = computed(() => {
  if (!currentRow.value) {
    return null;
  }

  return {
    ...currentRow.value,
    maskedPhone: maskPhone(currentRow.value.phone),
    bindingLogsSummary: formatBindingLogs(currentRow.value.bindingLogs),
  };
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 96,
  },
  layout: 'horizontal',
  schema: useCreateSchema(),
  showDefaultActions: false,
});

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  width: 520,
  onCancel() {
    formDrawerApi.close();
  },
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }

    const values = (await formApi.getValues()) as Record<string, any>;

    if (formMode.value === 'create') {
      const duplicatePlate = cars.value.some(
        (item) => item.plateNo === values.plateNo,
      );
      if (duplicatePlate) {
        ElMessage.warning('车牌号码已存在');
        return;
      }

      const user = userOptions.find((item) => item.value === values.userId);
      const profile =
        userProfileMap[values.userId as keyof typeof userProfileMap];
      const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
      const id = Math.max(0, ...cars.value.map((item) => item.id)) + 1;

      cars.value = [
        {
          id,
          userId: values.userId,
          userName: user?.label || `用户${values.userId}`,
          phone: profile?.phone || '13800000000',
          plateNo: values.plateNo,
          plateColor: values.plateColor,
          carType: values.carType,
          bindTime: now,
          status: '待审核',
          auditorName: '-',
          auditTime: '-',
          auditRemark: '',
          remark: values.remark || '',
          creator: 'admin',
          createTime: now,
          updateTime: now,
          bindingLogs: [
            {
              action: '创建绑定',
              operator: 'admin',
              remark: '新增车辆绑定申请',
              time: now,
            },
          ],
        },
        ...cars.value,
      ];
      ElMessage.success('新增成功');
    } else {
      cars.value = cars.value.map((item) => {
        if (item.id !== editingId.value) {
          return item;
        }

        return {
          ...item,
          plateNo: values.plateNo,
          plateColor: values.plateColor,
          carType: values.carType,
          remark: values.remark || '',
          updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          bindingLogs: [
            {
              action: '编辑车辆',
              operator: '李主管',
              remark: '更新车辆信息',
              time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            },
            ...item.bindingLogs,
          ],
        };
      });
      ElMessage.success('编辑成功');
    }

    formDrawerApi.close();
    handleRefresh();
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      editingId.value = null;
      formData.value = undefined;
      return;
    }

    if (formMode.value === 'create') {
      formApi.resetForm();
      return;
    }

    if (formData.value) {
      await formApi.setValues({
        carType: formData.value.carType,
        plateColor: formData.value.plateColor,
        plateNo: formData.value.plateNo,
        remark: formData.value.remark,
      });
    }
  },
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useSearchSchema(),
  },
  gridOptions: {
    columns: useGridColumns(),
    layouts: [['Form'], ['Top', 'Toolbar', 'Table', 'Bottom', 'Pager']],
    height: '100%',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          const list = cars.value.filter((item) => matchCar(item, formValues));

          return {
            list: list.slice(
              (page.currentPage - 1) * page.pageSize,
              page.currentPage * page.pageSize,
            ),
            total: list.length,
          };
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
});

function formatBindingLogs(logs: UserCarRow['bindingLogs']) {
  if (!logs.length) {
    return '暂无绑定操作日志';
  }

  return logs
    .map(
      (item) =>
        `${item.time} ${item.operator}：${item.action}（${item.remark}）`,
    )
    .join('\n');
}

/** 匹配筛选条件 */
function matchCar(item: UserCarRow, formValues: Record<string, any>) {
  const userMatch = !formValues.userId || item.userId === formValues.userId;
  const plateMatch =
    !formValues.plateNo || item.plateNo.includes(formValues.plateNo);
  const carTypeMatch =
    !formValues.carType || item.carType === formValues.carType;
  const statusMatch = !formValues.status || item.status === formValues.status;
  const plateColorMatch =
    !drillFilters.value.plateColor ||
    item.plateColor === drillFilters.value.plateColor;
  const bindTime = formValues.bindTime || [];
  const bindTimeMatch =
    bindTime.length !== 2 ||
    (dayjs(item.bindTime).isAfter(dayjs(bindTime[0]).subtract(1, 'second')) &&
      dayjs(item.bindTime).isBefore(dayjs(bindTime[1]).add(1, 'second')));

  return (
    userMatch &&
    plateMatch &&
    carTypeMatch &&
    statusMatch &&
    plateColorMatch &&
    bindTimeMatch
  );
}

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 重置筛选条件 */
async function resetSearch() {
  drillFilters.value.plateColor = '';
  await gridApi.formApi.resetForm();
  handleRefresh();
}

/** 设置筛选条件 */
async function setSearchValues(values: Record<string, any>) {
  const nextValues = { ...values };

  drillFilters.value.plateColor = nextValues.plateColor || '';
  delete nextValues.plateColor;

  await gridApi.formApi.resetForm();
  await gridApi.formApi.setValues(nextValues);
  handleRefresh();
}

/** 重新计算表格布局 */
async function recalculateLayout() {
  await gridApi.grid?.recalculate?.(true);
  await gridApi.grid?.refreshScroll?.();
}

defineExpose({
  recalculateLayout,
  resetSearch,
  setSearchValues,
});

/** 导出当前列表 */
async function handleExport() {
  const formValues = await gridApi.formApi.getValues();
  const list = cars.value.filter((item) => matchCar(item, formValues));

  exportToExcel(buildExportRows(list), '用户车辆', '用户车辆列表.xlsx');
}

/** 打开新增抽屉 */
function handleCreate() {
  formMode.value = 'create';
  formApi.setState(() => ({
    schema: useCreateSchema(),
  }));
  formDrawerApi.setData(null).open();
}

/** 打开编辑抽屉 */
function handleEdit(row: UserCarRow) {
  formMode.value = 'edit';
  editingId.value = row.id;
  formData.value = row;
  formApi.setState(() => ({
    schema: useEditSchema(),
  }));
  formDrawerApi.setData(row).open();
}

/** 打开详情抽屉 */
function handleDetail(row: UserCarRow) {
  currentRow.value = row;
  detailDrawerRef.value?.open();
}

/** 打开用户详情弹窗 */
function handleOpenUser(row: UserCarRow) {
  currentUserProfile.value = {
    ...userProfileMap[row.userId as keyof typeof userProfileMap],
    nickname: row.userName,
    phone: maskPhone(row.phone),
  };
  userDialogVisible.value = true;
}

/** 打开操作人员弹窗 */
function handleOpenOperator(name: string) {
  if (!name || name === '-') {
    return;
  }

  currentOperatorProfile.value = {
    name,
    ...(operatorProfileMap[name] || {
      email: '-',
      phone: '-',
      role: '操作人员',
    }),
  };
  operatorDialogVisible.value = true;
}

/** 审核通过车辆 */
async function handleApprove(row: UserCarRow) {
  cars.value = cars.value.map((item) => {
    if (item.id !== row.id) {
      return item;
    }

    return {
      ...item,
      status: '已绑定',
      auditorName: '李主管',
      auditTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      auditRemark: '审核通过',
      updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      bindingLogs: [
        {
          action: '审核通过',
          operator: '李主管',
          remark: '资料审核通过',
          time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        },
        ...item.bindingLogs,
      ],
    };
  });

  ElMessage.success('审核通过');
  handleRefresh();
}

/** 打开驳回弹窗 */
function handleOpenReject(row: UserCarRow) {
  rejectReason.value = '';
  rejectRowId.value = row.id;
  rejectDialogVisible.value = true;
}

/** 确认驳回车辆 */
function handleConfirmReject() {
  if (rejectReason.value.trim().length < 10) {
    ElMessage.warning('驳回理由不能少于 10 个字');
    return;
  }

  cars.value = cars.value.map((item) => {
    if (item.id !== rejectRowId.value) {
      return item;
    }

    return {
      ...item,
      status: '已驳回',
      auditorName: '王客服',
      auditTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      auditRemark: rejectReason.value.trim(),
      updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      bindingLogs: [
        {
          action: '审核驳回',
          operator: '王客服',
          remark: rejectReason.value.trim(),
          time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        },
        ...item.bindingLogs,
      ],
    };
  });

  rejectDialogVisible.value = false;
  rejectRowId.value = null;
  rejectReason.value = '';
  ElMessage.success('驳回成功');
  handleRefresh();
}

/** 解绑车辆 */
async function handleUnbind(row: UserCarRow) {
  try {
    await confirm(`确认解绑车辆“${row.plateNo}”吗？`);
  } catch {
    return;
  }

  cars.value = cars.value.map((item) => {
    if (item.id !== row.id) {
      return item;
    }

    return {
      ...item,
      status: '已解绑',
      updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      bindingLogs: [
        {
          action: '解绑',
          operator: '李主管',
          remark: '执行解绑操作',
          time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        },
        ...item.bindingLogs,
      ],
    };
  });

  ElMessage.success('解绑成功');
  handleRefresh();
}

/** 重新绑定车辆 */
function handleRebind(row: UserCarRow) {
  cars.value = cars.value.map((item) => {
    if (item.id !== row.id) {
      return item;
    }

    return {
      ...item,
      status: '待审核',
      auditorName: '-',
      auditTime: '-',
      auditRemark: '',
      updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      bindingLogs: [
        {
          action: '重新绑定',
          operator: '李主管',
          remark: '重新发起绑定审核',
          time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        },
        ...item.bindingLogs,
      ],
    };
  });

  ElMessage.success('已重新发起绑定审核');
  handleRefresh();
}

/** 按车牌颜色钻取列表 */
function handleFilterByPlateColor(plateColor: string) {
  drillFilters.value.plateColor = plateColor;
  handleRefresh();
}

/** 下载导入模板 */
function handleDownloadTemplate() {
  const blob = new Blob(
    [
      '所属用户,车牌号码,车牌颜色,车辆类型,备注\n张三,闽C67890,蓝牌,小型车,导入模板示例',
    ],
    { type: 'text/csv;charset=utf-8;' },
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = '用户车辆导入模板.csv';
  link.click();
  URL.revokeObjectURL(url);
}

/** 导入车辆数据 */
function handleImportCars() {
  if (!importFileList.value.length) {
    ElMessage.warning('请先上传导入文件');
    return;
  }

  const id = Math.max(0, ...cars.value.map((item) => item.id)) + 1;
  const now = dayjs().format('YYYY-MM-DD HH:mm:ss');

  cars.value = [
    {
      id,
      userId: 1,
      userName: '张三',
      phone: '13812345678',
      plateNo: `闽C66${String(id).padStart(3, '0').slice(-3)}`,
      plateColor: '蓝牌',
      carType: '小型车',
      bindTime: now,
      status: '待审核',
      auditorName: '-',
      auditTime: '-',
      auditRemark: '',
      remark: '通过导入功能新增',
      creator: 'admin',
      createTime: now,
      updateTime: now,
      bindingLogs: [
        {
          action: '导入创建',
          operator: 'admin',
          remark: '通过导入功能创建车辆',
          time: now,
        },
      ],
    },
    ...cars.value,
  ];

  importDialogVisible.value = false;
  importFileList.value = [];
  ElMessage.success('导入完成，已模拟新增 1 条车辆数据');
  handleRefresh();
}
</script>

<template>
  <div class="user-car-table">
    <div class="user-car-grid-wrap">
      <Grid table-title="用户车辆列表">
        <template #toolbar-tools>
          <TableAction
            :actions="[
              {
                label: '新增车辆',
                type: 'primary',
                icon: ACTION_ICON.ADD,
                onClick: handleCreate,
              },
              {
                label: '导入',
                type: 'primary',
                icon: ACTION_ICON.UPLOAD,
                onClick: () => (importDialogVisible = true),
              },
              {
                label: '导出',
                type: 'primary',
                icon: ACTION_ICON.DOWNLOAD,
                onClick: handleExport,
              },
              {
                label: props.showStats ? '隐藏统计' : '显示统计',
                type: 'primary',
                icon: props.showStats
                  ? 'lucide:chevron-up'
                  : 'lucide:chevron-down',
                onClick: props.toggleStats,
              },
            ]"
          />
        </template>

        <template #userName="{ row }">
          <ElButton type="primary" link @click="handleOpenUser(row)">
            {{ row.userName }}
          </ElButton>
        </template>

        <template #plateNo="{ row }">
          <ElButton type="primary" link @click="handleDetail(row)">
            {{ row.plateNo }}
          </ElButton>
        </template>

        <template #plateColor="{ row }">
          <ElButton
            type="primary"
            link
            @click="handleFilterByPlateColor(row.plateColor)"
          >
            {{ row.plateColor }}
          </ElButton>
        </template>

        <template #carType="{ row }">
          <ElButton
            type="primary"
            link
            @click="setSearchValues({ carType: row.carType })"
          >
            {{ row.carType }}
          </ElButton>
        </template>

        <template #status="{ row }">
          <ElButton
            type="primary"
            link
            @click="setSearchValues({ status: row.status })"
          >
            <ElTag
              :type="
                row.status === '已绑定'
                  ? 'success'
                  : row.status === '待审核'
                    ? 'warning'
                    : row.status === '已驳回'
                      ? 'danger'
                      : 'info'
              "
            >
              {{ row.status }}
            </ElTag>
          </ElButton>
        </template>

        <template #auditorName="{ row }">
          <ElButton
            v-if="row.auditorName !== '-'"
            type="primary"
            link
            @click="handleOpenOperator(row.auditorName)"
          >
            {{ row.auditorName }}
          </ElButton>
          <span v-else>{{ row.auditorName }}</span>
        </template>

        <template #actions="{ row }">
          <TableAction
            :actions="[
              {
                label: '查看',
                type: 'primary',
                link: true,
                icon: ACTION_ICON.VIEW,
                onClick: handleDetail.bind(null, row),
              },
              {
                label: '通过',
                type: 'primary',
                link: true,
                icon: ACTION_ICON.AUDIT,
                ifShow: () => row.status === '待审核',
                onClick: handleApprove.bind(null, row),
              },
              {
                label: '驳回',
                type: 'danger',
                link: true,
                icon: ACTION_ICON.DELETE,
                ifShow: () => row.status === '待审核',
                onClick: handleOpenReject.bind(null, row),
              },
              {
                label: '重新绑定',
                type: 'primary',
                link: true,
                icon: ACTION_ICON.AUDIT,
                ifShow: () => row.status === '已解绑',
                onClick: handleRebind.bind(null, row),
              },
              {
                label: '解绑',
                type: 'danger',
                link: true,
                icon: ACTION_ICON.DELETE,
                ifShow: () => row.status === '已绑定',
                popConfirm: {
                  title: `确认解绑${row.plateNo}吗？`,
                  confirm: handleUnbind.bind(null, row),
                },
              },
              {
                label: '编辑',
                type: 'primary',
                link: true,
                icon: ACTION_ICON.EDIT,
                ifShow: () => row.status === '待审核',
                onClick: handleEdit.bind(null, row),
              },
            ]"
          />
        </template>
      </Grid>
    </div>

    <FormDrawer :title="formMode === 'edit' ? '编辑车辆' : '新增车辆'">
      <Form class="mx-4" />
    </FormDrawer>

    <DetailDrawer
      ref="detailDrawerRef"
      :data="detailData"
      :fields="userCarDetailFields"
      :title="currentRow ? `${currentRow.plateNo}详情` : '车辆详情'"
    />

    <ElDialog v-model="importDialogVisible" title="导入车辆" width="520px">
      <div class="import-tip">
        提供标准模板下载，上传后按文档要求模拟导入校验。
      </div>
      <div class="import-actions">
        <ElButton @click="handleDownloadTemplate">下载模板</ElButton>
      </div>
      <el-upload
        v-model:file-list="importFileList"
        drag
        :auto-upload="false"
        :limit="1"
        accept=".xls,.xlsx,.csv"
      >
        <div>点击或拖拽文件到此处上传</div>
      </el-upload>
      <template #footer>
        <ElButton @click="importDialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="handleImportCars">开始导入</ElButton>
      </template>
    </ElDialog>

    <ElDialog v-model="rejectDialogVisible" title="驳回车辆绑定" width="520px">
      <ElInput
        v-model="rejectReason"
        :rows="4"
        maxlength="200"
        placeholder="请输入驳回理由，不少于 10 个字"
        show-word-limit
        type="textarea"
      />
      <template #footer>
        <ElButton @click="rejectDialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="handleConfirmReject">确认</ElButton>
      </template>
    </ElDialog>

    <ElDialog v-model="userDialogVisible" title="用户详情" width="520px">
      <ElDescriptions v-if="currentUserProfile" :column="1" border>
        <ElDescriptionsItem label="用户昵称">
          {{ currentUserProfile.nickname }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="绑定手机号">
          {{ currentUserProfile.phone }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="用户类型">
          {{ currentUserProfile.userType }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="备注">
          {{ currentUserProfile.remark }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElDialog>

    <ElDialog
      v-model="operatorDialogVisible"
      title="操作人员详情"
      width="520px"
    >
      <ElDescriptions v-if="currentOperatorProfile" :column="1" border>
        <ElDescriptionsItem label="姓名">
          {{ currentOperatorProfile.name }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="角色">
          {{ currentOperatorProfile.role }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="手机号">
          {{ currentOperatorProfile.phone }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="邮箱">
          {{ currentOperatorProfile.email }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElDialog>
  </div>
</template>

<style scoped lang="scss">
.user-car-table,
.user-car-grid-wrap {
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.user-car-table {
  display: flex;
  flex-direction: column;
}

.user-car-grid-wrap {
  flex: 1;
}

:deep(.vxe-grid) {
  height: 100% !important;
}

:deep(.vxe-grid--layout-body-wrapper),
:deep(.vxe-grid--layout-body-content-wrapper),
:deep(.vxe-grid--table-container),
:deep(.vxe-grid--table-wrapper) {
  min-height: 0;
}
</style>
