<script lang="ts" setup>
import type { UploadUserFile } from 'element-plus';
import type { AccountLog, AuditLog, GroupInfoRow } from '../data';

import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import {
  ElButton,
  ElDescriptions,
  ElDescriptionsItem,
  ElDialog,
  ElInput,
  ElMessage,
  ElTable,
  ElTableColumn,
  ElTag,
} from 'element-plus';
import dayjs from 'dayjs';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { useVbenForm } from '#/adapter/form';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { exportToExcel } from '#/utils/excel.js';

import {
  buildAuditLogs,
  buildExportRows,
  maskPhone,
  textObj,
  useCreateSchema,
  useEditSchema,
  useGridColumns,
  useSearchSchema,
} from '../data';

interface OperatorDetail {
  account: string;
  dept: string;
  name: string;
  phone: string;
  role: string;
}

const props = withDefaults(
  defineProps<{
    groups?: GroupInfoRow[];
    showStats?: boolean;
    toggleStats?: () => void;
  }>(),
  {
    groups: () => [],
    showStats: false,
    toggleStats: () => {},
  },
);

const emit = defineEmits<{
  'update:groups': [value: GroupInfoRow[]];
}>();

const groups = computed({
  get: () => props.groups,
  set: (value: GroupInfoRow[]) => {
    emit('update:groups', value);
  },
});

const operatorMap: Record<string, OperatorDetail> = {
  admin: {
    account: 'admin',
    dept: '平台运营中心',
    name: 'admin',
    phone: '13800000001',
    role: '系统管理员',
  },
  李主管: {
    account: 'lizg',
    dept: '集团运营组',
    name: '李主管',
    phone: '13800000002',
    role: '运营主管',
  },
  王客服: {
    account: 'wangkf',
    dept: '集团服务组',
    name: '王客服',
    phone: '13800000004',
    role: '客服专员',
  },
};

function getOperatorDetail(name: string) {
  return (
    operatorMap[name] || {
      account: name,
      dept: '未分配部门',
      name,
      phone: '-',
      role: '平台操作人',
    }
  );
}

function createAuditLog(
  operator: string,
  content: string,
  remark = '',
): AuditLog {
  return {
    content,
    operator,
    remark,
    time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  };
}

function getStatusTagType(status: GroupInfoRow['status']) {
  switch (status) {
    case '正常': {
      return 'success';
    }
    case '待审核': {
      return 'warning';
    }
    case '禁用':
    case '已驳回': {
      return 'danger';
    }
    default: {
      return 'info';
    }
  }
}

function formatCars(cars: GroupInfoRow['cars'] = []) {
  if (!cars.length) {
    return '暂无绑定车辆';
  }

  return cars
    .map((item) => `${item.plateNo} / ${item.carType} / ${item.status}`)
    .join('\n');
}

function formatAccountLogs(logs: AccountLog[] = []) {
  if (!logs.length) {
    return '暂无账户明细';
  }

  return logs
    .map(
      (item) =>
        `${item.time} ${item.type} ${item.amount}，余额 ${item.afterBalance}`,
    )
    .join('\n');
}

function formatAuditLogs(logs?: AuditLog[]) {
  if (!logs?.length) {
    return '暂无审计日志';
  }

  return logs
    .map((item) => {
      const remark = item.remark ? `（${item.remark}）` : '';
      return `${item.time} ${item.operator}：${item.content}${remark}`;
    })
    .join('\n');
}

function appendAuditLog(row: GroupInfoRow, log: AuditLog) {
  return {
    ...row,
    auditLogs: [...(row.auditLogs || []), log],
  };
}

const accountDialogVisible = ref(false);
const currentAccountLogs = ref<AccountLog[]>([]);
const detailDrawerRef = ref<null | { open: () => void }>(null);
const detailObj = ref<GroupInfoRow>();
const formData = ref<GroupInfoRow>();
const formMode = ref<'create' | 'edit'>('create');
const importDialogVisible = ref(false);
const importFileList = ref<UploadUserFile[]>([]);
const operatorDetail = ref<OperatorDetail>();
const operatorDialogVisible = ref(false);
const phoneFilter = ref('');
const rejectDialogVisible = ref(false);
const rejectReason = ref('');
const rejectRowId = ref<number | null>(null);

const detailFields = ref([
  { key: 'name', label: '集团名称' },
  { key: 'contact', label: '联系人' },
  { key: 'maskedPhone', label: '联系手机号' },
  {
    key: 'groupType',
    label: '集团类型',
    type: 'tag',
    tagType: () => 'primary',
  },
  { key: 'address', label: '地址' },
  { key: 'registerTime', label: '注册时间' },
  {
    key: 'status',
    label: '集团状态',
    type: 'tag',
    tagType: (value: string) =>
      getStatusTagType(value as GroupInfoRow['status']),
  },
  { key: 'walletDisplay', label: '账户余额' },
  { key: 'accountSummary', label: '账户明细' },
  { key: 'carSummary', label: '绑定车辆信息' },
  { key: 'auditorName', label: '审核人' },
  { key: 'auditTime', label: '审核时间' },
  { key: 'creator', label: '创建人' },
  { key: 'createTime', label: '创建时间' },
  { key: 'updater', label: '最后更新人' },
  { key: 'updateTime', label: '最后更新时间' },
  { key: 'auditLogsSummary', label: '审计日志' },
  { key: 'remark', label: '备注' },
]);

const detailData = computed(() => {
  if (!detailObj.value) {
    return null;
  }

  return {
    ...detailObj.value,
    maskedPhone: maskPhone(detailObj.value.phone),
    walletDisplay: `${detailObj.value.walletBalance.toFixed(2)} 元`,
    accountSummary: formatAccountLogs(detailObj.value.accountLogs),
    carSummary: formatCars(detailObj.value.cars),
    auditLogsSummary: formatAuditLogs(detailObj.value.auditLogs),
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

    const values = (await formApi.getValues()) as Record<string, string>;

    if (formMode.value === 'create') {
      const duplicateName = groups.value.some(
        (item) => item.name === values.name,
      );
      if (duplicateName) {
        ElMessage.warning('集团名称已存在');
        return;
      }

      const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
      const id = Math.max(0, ...groups.value.map((item) => item.id)) + 1;

      groups.value = [
        {
          id,
          name: values.name || '',
          contact: values.contact || '',
          phone: values.phone || '',
          groupType: values.groupType || '',
          address: values.address || '',
          registerTime: now,
          status: '待审核',
          walletBalance: 0,
          auditorName: '-',
          auditTime: '-',
          creator: 'admin',
          createTime: now,
          updater: 'admin',
          updateTime: now,
          remark: values.remark || '',
          cars: [],
          accountLogs: [],
          auditLogs: [createAuditLog('admin', '创建集团')],
          auditSummary: '创建集团',
        },
        ...groups.value,
      ];
      ElMessage.success('新增成功');
    } else {
      groups.value = groups.value.map((item) => {
        if (item.id !== formData.value?.id) {
          return item;
        }

        return appendAuditLog(
          {
            ...item,
            contact: values.contact || '',
            phone: values.phone || '',
            address: values.address || '',
            remark: values.remark || '',
            updater: '李主管',
            updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            auditSummary: '编辑集团信息',
          },
          createAuditLog('李主管', '编辑集团信息'),
        );
      });
      ElMessage.success('编辑成功');
    }

    handleRefresh();
    formDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      formData.value = undefined;
      return;
    }

    if (formMode.value === 'create') {
      formApi.resetForm();
      await formApi.setValues({
        groupType: '企业单位',
        remark: '',
      });
      return;
    }

    if (formData.value) {
      await formApi.setValues({
        contact: formData.value.contact,
        phone: formData.value.phone,
        address: formData.value.address,
        remark: formData.value.remark,
      });
    }
  },
});

/** 匹配筛选条件 */
function matchGroup(item: GroupInfoRow, formValues: Record<string, any>) {
  const nameMatch = !formValues.name || item.name.includes(formValues.name);
  const contactMatch =
    !formValues.contact || item.contact.includes(formValues.contact);
  const phoneMatch = !phoneFilter.value || item.phone === phoneFilter.value;
  const typeMatch =
    !formValues.groupType || item.groupType === formValues.groupType;
  const statusMatch = !formValues.status || item.status === formValues.status;
  const registerTime = formValues.registerTime || [];
  const registerTimeMatch =
    registerTime.length !== 2 ||
    (dayjs(item.registerTime).isAfter(
      dayjs(registerTime[0]).subtract(1, 'second'),
    ) &&
      dayjs(item.registerTime).isBefore(
        dayjs(registerTime[1]).add(1, 'second'),
      ));

  return (
    nameMatch &&
    contactMatch &&
    phoneMatch &&
    typeMatch &&
    statusMatch &&
    registerTimeMatch
  );
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useSearchSchema(),
  },
  gridOptions: {
    columns: useGridColumns(),
    layouts: [['Form'], ['Top', 'Toolbar', 'Table', 'Bottom', 'Pager']],
    keepSource: true,
    height: '100%',
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          const list = groups.value.filter((item) =>
            matchGroup(item, formValues),
          );

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

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 重置筛选条件 */
async function resetSearch() {
  phoneFilter.value = '';
  await gridApi.formApi.resetForm();
  handleRefresh();
}

/** 设置筛选条件 */
async function setSearchValues(values: Record<string, any>) {
  phoneFilter.value = '';
  await gridApi.formApi.resetForm();
  await gridApi.formApi.setValues(values);
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
  const list = groups.value.filter((item) => matchGroup(item, formValues));

  exportToExcel(buildExportRows(list), textObj.excelName, textObj.excelAllName);
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
function handleEdit(row: GroupInfoRow) {
  formMode.value = 'edit';
  formData.value = row;
  formApi.setState(() => ({
    schema: useEditSchema(),
  }));
  formDrawerApi.setData(row).open();
}

/** 按手机号钻取列表 */
function handleFilterByPhone(phone: string) {
  phoneFilter.value = phone;
  gridApi.formApi.resetForm();
  handleRefresh();
}

/** 更新集团状态 */
function updateStatus(
  row: GroupInfoRow,
  status: GroupInfoRow['status'],
  operator: string,
  content: string,
  remark = '',
) {
  const now = dayjs().format('YYYY-MM-DD HH:mm:ss');

  groups.value = groups.value.map((item) => {
    if (item.id !== row.id) {
      return item;
    }

    return appendAuditLog(
      {
        ...item,
        status,
        auditorName: status === '待审核' ? '-' : operator,
        auditTime: status === '待审核' ? '-' : now,
        updater: operator,
        updateTime: now,
        auditSummary: content,
      },
      createAuditLog(operator, content, remark),
    );
  });
}

/** 审核通过集团 */
function handleApprove(row: GroupInfoRow) {
  updateStatus(row, '正常', '李主管', '审核通过');
  ElMessage.success('集团审核通过');
  handleRefresh();
}

/** 打开驳回弹窗 */
function handleOpenReject(row: GroupInfoRow) {
  rejectRowId.value = row.id;
  rejectReason.value = '';
  rejectDialogVisible.value = true;
}

/** 确认驳回集团 */
function handleConfirmReject() {
  if (rejectReason.value.trim().length < 10) {
    ElMessage.warning('驳回理由不能少于 10 个字');
    return;
  }

  const current = groups.value.find((item) => item.id === rejectRowId.value);
  if (!current) {
    return;
  }

  updateStatus(current, '已驳回', '王客服', '审核驳回', rejectReason.value);
  rejectDialogVisible.value = false;
  ElMessage.success('集团已驳回');
  handleRefresh();
}

/** 启用或禁用集团 */
function handleToggleStatus(row: GroupInfoRow, status: GroupInfoRow['status']) {
  updateStatus(
    row,
    status,
    '李主管',
    status === '正常' ? '启用集团' : '禁用集团',
  );
  ElMessage.success(`${status === '正常' ? '启用' : '禁用'}成功`);
  handleRefresh();
}

/** 打开详情抽屉 */
function handleDetail(row: GroupInfoRow) {
  detailObj.value = row.auditLogs?.length
    ? row
    : {
        ...row,
        auditLogs: buildAuditLogs(row),
      };
  detailDrawerRef.value?.open();
}

/** 打开操作人员弹窗 */
function handleOpenOperator(name: string) {
  if (!name || name === '-') {
    return;
  }

  operatorDetail.value = getOperatorDetail(name);
  operatorDialogVisible.value = true;
}

/** 打开账户明细弹窗 */
function handleOpenAccount(row: GroupInfoRow) {
  currentAccountLogs.value = row.accountLogs;
  accountDialogVisible.value = true;
}

/** 下载导入模板 */
function handleDownloadTemplate() {
  const blob = new Blob(
    [
      '集团名称,联系人,联系手机号,集团类型,地址,备注\n示例集团,孙七,13512345678,企业单位,福建省泉州市丰泽区,导入模板示例',
    ],
    { type: 'text/csv;charset=utf-8;' },
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = '集团信息导入模板.csv';
  link.click();
  URL.revokeObjectURL(url);
}

/** 导入集团数据 */
function handleImportGroups() {
  if (!importFileList.value.length) {
    ElMessage.warning('请先上传导入文件');
    return;
  }

  const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
  const id = Math.max(0, ...groups.value.map((item) => item.id)) + 1;

  groups.value = [
    {
      id,
      name: `导入集团${id}`,
      contact: '导入联系人',
      phone: `1390000${String(id).padStart(4, '0').slice(-4)}`,
      groupType: '企业单位',
      address: '福建省泉州市示例地址',
      registerTime: now,
      status: '待审核',
      walletBalance: 0,
      auditorName: '-',
      auditTime: '-',
      creator: 'admin',
      createTime: now,
      updater: 'admin',
      updateTime: now,
      remark: '通过导入功能新增',
      cars: [],
      accountLogs: [],
      auditLogs: [createAuditLog('admin', '导入创建集团')],
      auditSummary: '导入创建集团',
    },
    ...groups.value,
  ];

  importDialogVisible.value = false;
  importFileList.value = [];
  ElMessage.success('导入完成，已模拟新增 1 条集团数据');
  handleRefresh();
}
</script>

<template>
  <div class="group-info-table">
    <div class="group-info-grid-wrap">
      <Grid table-title="集团信息列表">
        <template #toolbar-tools>
          <TableAction
            :actions="[
              {
                label: '新增集团',
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

        <template #name="{ row }">
          <ElButton type="primary" link @click="handleDetail(row)">
            {{ row.name }}
          </ElButton>
        </template>

        <template #contact="{ row }">
          <ElButton
            type="primary"
            link
            @click="setSearchValues({ contact: row.contact })"
          >
            {{ row.contact }}
          </ElButton>
        </template>

        <template #phone="{ row }">
          <ElButton type="primary" link @click="handleFilterByPhone(row.phone)">
            {{ maskPhone(row.phone) }}
          </ElButton>
        </template>

        <template #groupType="{ row }">
          <ElButton
            type="primary"
            link
            @click="setSearchValues({ groupType: row.groupType })"
          >
            {{ row.groupType }}
          </ElButton>
        </template>

        <template #status="{ row }">
          <ElButton
            type="primary"
            link
            @click="setSearchValues({ status: row.status })"
          >
            <ElTag :type="getStatusTagType(row.status)">
              {{ row.status }}
            </ElTag>
          </ElButton>
        </template>

        <template #walletBalance="{ row }">
          <ElButton type="primary" link @click="handleOpenAccount(row)">
            {{ row.walletBalance.toFixed(2) }}
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

        <template #creator="{ row }">
          <ElButton
            type="primary"
            link
            @click="handleOpenOperator(row.creator)"
          >
            {{ row.creator }}
          </ElButton>
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
                label: '编辑',
                type: 'primary',
                link: true,
                icon: ACTION_ICON.EDIT,
                ifShow: () => row.status === '正常',
                onClick: handleEdit.bind(null, row),
              },
              {
                label: '禁用',
                type: 'danger',
                link: true,
                icon: ACTION_ICON.DELETE,
                ifShow: () => row.status === '正常',
                popConfirm: {
                  title: `确认禁用${row.name}吗？`,
                  confirm: handleToggleStatus.bind(null, row, '禁用'),
                },
              },
              {
                label: '启用',
                type: 'primary',
                link: true,
                icon: ACTION_ICON.AUDIT,
                ifShow: () => row.status === '禁用',
                popConfirm: {
                  title: `确认启用${row.name}吗？`,
                  confirm: handleToggleStatus.bind(null, row, '正常'),
                },
              },
            ]"
          />
        </template>
      </Grid>
    </div>

    <FormDrawer :title="formData?.id ? textObj.editText : textObj.addText">
      <Form class="mx-4" />
    </FormDrawer>

    <DetailDrawer
      ref="detailDrawerRef"
      :data="detailData"
      :fields="detailFields"
      :title="detailObj ? `${detailObj.name}详情` : '集团详情'"
    />

    <ElDialog v-model="importDialogVisible" title="导入集团" width="520px">
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
        <ElButton type="primary" @click="handleImportGroups">开始导入</ElButton>
      </template>
    </ElDialog>

    <ElDialog v-model="rejectDialogVisible" title="驳回集团" width="520px">
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

    <ElDialog v-model="accountDialogVisible" title="集团账户明细" width="720px">
      <ElTable :data="currentAccountLogs" border>
        <ElTableColumn prop="time" label="时间" min-width="170" />
        <ElTableColumn prop="type" label="类型" min-width="110" />
        <ElTableColumn prop="amount" label="金额" min-width="100" />
        <ElTableColumn prop="afterBalance" label="变更后余额" min-width="120" />
      </ElTable>
    </ElDialog>

    <ElDialog
      v-model="operatorDialogVisible"
      title="操作人员详情"
      width="520px"
    >
      <ElDescriptions v-if="operatorDetail" :column="1" border>
        <ElDescriptionsItem label="姓名">
          {{ operatorDetail.name }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="账号">
          {{ operatorDetail.account }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="角色">
          {{ operatorDetail.role }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="部门">
          {{ operatorDetail.dept }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="手机号">
          {{ operatorDetail.phone }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElDialog>
  </div>
</template>

<style scoped lang="scss">
.group-info-table,
.group-info-grid-wrap {
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.group-info-table {
  display: flex;
  flex-direction: column;
}

.group-info-grid-wrap {
  flex: 1;
}

.import-actions,
.import-tip {
  margin-bottom: 12px;
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
