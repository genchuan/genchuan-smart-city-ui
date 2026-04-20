<script lang="ts" setup>
import type { PlateAuthRow } from '../data';

import { computed, ref } from 'vue';

import {
  ElButton,
  ElDescriptions,
  ElDescriptionsItem,
  ElDialog,
  ElImage,
  ElInput,
  ElMessage,
  ElRadioButton,
  ElRadioGroup,
  ElTag,
} from 'element-plus';
import dayjs from 'dayjs';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { exportToExcel } from '#/utils/excel.js';

import {
  buildExportRows,
  maskPhone,
  useGridColumns,
  useSearchSchema,
} from '../data';

interface AuthLog {
  action: string;
  operator: string;
  remark: string;
  time: string;
}

interface BatchAuditState {
  mode: 'approve' | 'reject';
  remark: string;
}

interface OperatorDetail {
  account: string;
  dept: string;
  name: string;
  phone: string;
  role: string;
}

const props = withDefaults(
  defineProps<{
    auths?: PlateAuthRow[];
    showStats?: boolean;
    toggleStats?: () => void;
  }>(),
  {
    auths: () => [],
    showStats: false,
    toggleStats: () => {},
  },
);

const emit = defineEmits<{
  'update:auths': [value: PlateAuthRow[]];
}>();

const auths = computed({
  get: () => props.auths,
  set: (value: PlateAuthRow[]) => {
    emit('update:auths', value);
  },
});

const userProfileMap: Record<number, Record<string, string>> = {
  1: {
    nickname: '张三',
    phone: '13812345678',
    remark: '个人用户，已有已认证车牌',
    userType: '个人用户',
  },
  2: {
    nickname: '李四',
    phone: '13912345679',
    remark: '小程序用户，近期发起认证',
    userType: '小程序用户',
  },
  3: {
    nickname: '王五',
    phone: '13712345670',
    remark: '历史驳回后待重新提交资料',
    userType: '平台用户',
  },
  4: {
    nickname: '赵六',
    phone: '13612345671',
    remark: '大型车车主，资料齐全',
    userType: '个人用户',
  },
  5: {
    nickname: '孙七',
    phone: '13512345672',
    remark: '近期新增认证申请用户',
    userType: '小程序用户',
  },
};

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
    dept: '用户运营组',
    name: '李主管',
    phone: '13800000002',
    role: '运营主管',
  },
  王客服: {
    account: 'wangkf',
    dept: '客户服务组',
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

function createAuthLog(action: string, operator: string, remark = ''): AuthLog {
  return {
    action,
    operator,
    remark,
    time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  };
}

function formatAuthLogs(logs: AuthLog[] = []) {
  if (!logs.length) {
    return '暂无认证记录';
  }

  return logs
    .map(
      (item) =>
        `${item.time} ${item.operator}：${item.action}${item.remark ? `（${item.remark}）` : ''}`,
    )
    .join('\n');
}

function getStatusTagType(status: PlateAuthRow['status']) {
  switch (status) {
    case '已认证': {
      return 'success';
    }
    case '待审核': {
      return 'warning';
    }
    case '已驳回': {
      return 'danger';
    }
    default: {
      return 'info';
    }
  }
}

const batchAuditDialogVisible = ref(false);
const batchAuditState = ref<BatchAuditState>({
  mode: 'approve',
  remark: '',
});
const checkedIds = ref<number[]>([]);
const checkedRows = ref<PlateAuthRow[]>([]);
const currentCarProfile = ref<Record<string, string> | null>(null);
const currentUserProfile = ref<Record<string, string> | null>(null);
const detailDrawerRef = ref<null | { open: () => void }>(null);
const detailObj = ref<PlateAuthRow>();
const operatorDetail = ref<OperatorDetail>();
const operatorDialogVisible = ref(false);
const rejectDialogVisible = ref(false);
const rejectReason = ref('');
const rejectRowId = ref<number | null>(null);
const userDialogVisible = ref(false);
const vehicleDialogVisible = ref(false);

const detailFields = ref([
  { key: 'userName', label: '所属用户' },
  { key: 'maskedPhone', label: '绑定手机号' },
  { key: 'plateNo', label: '车牌号码' },
  {
    key: 'plateColor',
    label: '车牌颜色',
    type: 'tag',
    tagType: () => 'primary',
  },
  {
    key: 'carType',
    label: '车辆类型',
    type: 'tag',
    tagType: () => 'warning',
  },
  { key: 'applyTime', label: '认证申请时间' },
  {
    key: 'status',
    label: '认证状态',
    type: 'tag',
    tagType: (value: string) =>
      getStatusTagType(value as PlateAuthRow['status']),
  },
  { key: 'auditorName', label: '审核人' },
  { key: 'auditTime', label: '审核时间' },
  { key: 'auditRemark', label: '审核备注' },
  { key: 'authLogsSummary', label: '审核记录' },
  { key: 'remark', label: '备注' },
  { key: 'creator', label: '创建人' },
  { key: 'createTime', label: '创建时间' },
  { key: 'updateTime', label: '更新时间' },
]);

const detailData = computed(() => {
  if (!detailObj.value) {
    return null;
  }

  return {
    ...detailObj.value,
    maskedPhone: maskPhone(detailObj.value.phone),
    authLogsSummary: formatAuthLogs(detailObj.value.authLogs),
  };
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
          const list = auths.value.filter((item) =>
            matchAuth(item, formValues),
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
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
});

/** 匹配筛选条件 */
function matchAuth(item: PlateAuthRow, formValues: Record<string, any>) {
  const userMatch = !formValues.userId || item.userId === formValues.userId;
  const plateMatch =
    !formValues.plateNo || item.plateNo.includes(formValues.plateNo);
  const statusMatch = !formValues.status || item.status === formValues.status;
  const applyTime = formValues.applyTime || [];
  const applyTimeMatch =
    applyTime.length !== 2 ||
    (dayjs(item.applyTime).isAfter(dayjs(applyTime[0]).subtract(1, 'second')) &&
      dayjs(item.applyTime).isBefore(dayjs(applyTime[1]).add(1, 'second')));

  return userMatch && plateMatch && statusMatch && applyTimeMatch;
}

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 批量更新认证记录 */
function updateAuthRows(
  ids: number[],
  updater: (row: PlateAuthRow) => PlateAuthRow,
) {
  auths.value = auths.value.map((item) => {
    if (!ids.includes(item.id)) {
      return item;
    }

    return updater(item);
  });
}

/** 重置筛选条件 */
async function resetSearch() {
  checkedIds.value = [];
  checkedRows.value = [];
  await gridApi.formApi.resetForm();
  handleRefresh();
}

/** 设置筛选条件 */
async function setSearchValues(values: Record<string, any>) {
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
  const list = auths.value.filter((item) => matchAuth(item, formValues));

  exportToExcel(buildExportRows(list), '车牌认证', '车牌认证列表.xlsx');
}

/** 同步勾选记录 */
function handleRowCheckboxChange({ records }: { records: PlateAuthRow[] }) {
  checkedIds.value = records.map((item) => item.id);
  checkedRows.value = records;
}

/** 打开批量审核弹窗 */
function handleOpenBatchAudit() {
  const pendingRows = checkedRows.value.filter(
    (item) => item.status === '待审核',
  );

  if (!pendingRows.length) {
    ElMessage.warning('请先勾选待审核的认证记录');
    return;
  }

  batchAuditState.value = {
    mode: 'approve',
    remark: '',
  };
  batchAuditDialogVisible.value = true;
}

/** 确认批量审核 */
function handleConfirmBatchAudit() {
  const pendingRows = checkedRows.value.filter(
    (item) => item.status === '待审核',
  );

  if (!pendingRows.length) {
    ElMessage.warning('当前选中项中没有待审核记录');
    return;
  }

  if (
    batchAuditState.value.mode === 'reject' &&
    batchAuditState.value.remark.trim().length < 10
  ) {
    ElMessage.warning('驳回理由不能少于 10 个字');
    return;
  }

  if (batchAuditState.value.mode === 'approve') {
    handleApproveByIds(
      pendingRows.map((item) => item.id),
      batchAuditState.value.remark || '批量审核通过',
    );
    ElMessage.success('批量审核通过成功');
  } else {
    handleRejectByIds(
      pendingRows.map((item) => item.id),
      batchAuditState.value.remark,
    );
    ElMessage.success('批量驳回成功');
  }

  batchAuditDialogVisible.value = false;
  checkedIds.value = [];
  checkedRows.value = [];
  gridApi.grid?.clearCheckboxRow?.();
  handleRefresh();
}

/** 批量通过认证 */
function handleApproveByIds(ids: number[], remark = '认证通过') {
  const now = dayjs().format('YYYY-MM-DD HH:mm:ss');

  updateAuthRows(ids, (item) => ({
    ...item,
    status: '已认证',
    auditorName: '李主管',
    auditTime: now,
    auditRemark: remark,
    updateTime: now,
    authLogs: [createAuthLog('审核通过', '李主管', remark), ...item.authLogs],
  }));
}

/** 批量驳回认证 */
function handleRejectByIds(ids: number[], remark: string) {
  const now = dayjs().format('YYYY-MM-DD HH:mm:ss');

  updateAuthRows(ids, (item) => ({
    ...item,
    status: '已驳回',
    auditorName: '王客服',
    auditTime: now,
    auditRemark: remark,
    updateTime: now,
    authLogs: [createAuthLog('审核驳回', '王客服', remark), ...item.authLogs],
  }));
}

/** 单条审核通过 */
function handleApprove(row: PlateAuthRow) {
  handleApproveByIds([row.id]);
  ElMessage.success('审核通过');
  handleRefresh();
}

/** 打开驳回弹窗 */
function handleOpenReject(row: PlateAuthRow) {
  rejectRowId.value = row.id;
  rejectReason.value = '';
  rejectDialogVisible.value = true;
}

/** 确认驳回认证 */
function handleConfirmReject() {
  if (rejectReason.value.trim().length < 10) {
    ElMessage.warning('驳回理由不能少于 10 个字');
    return;
  }

  if (!rejectRowId.value) {
    return;
  }

  handleRejectByIds([rejectRowId.value], rejectReason.value);
  rejectDialogVisible.value = false;
  ElMessage.success('认证已驳回');
  handleRefresh();
}

/** 重新发起认证 */
function handleReauth(row: PlateAuthRow) {
  const now = dayjs().format('YYYY-MM-DD HH:mm:ss');

  updateAuthRows([row.id], (item) => ({
    ...item,
    status: '待审核',
    auditorName: '-',
    auditTime: '-',
    auditRemark: '',
    updateTime: now,
    authLogs: [
      createAuthLog('重新认证', '李主管', '重新发起认证流程'),
      ...item.authLogs,
    ],
  }));

  ElMessage.success('已重新发起认证');
  handleRefresh();
}

/** 打开详情抽屉 */
function handleDetail(row: PlateAuthRow) {
  detailObj.value = row;
  detailDrawerRef.value?.open();
}

/** 打开用户详情弹窗 */
function handleOpenUser(row: PlateAuthRow) {
  currentUserProfile.value = {
    ...userProfileMap[row.userId],
    nickname: row.userName,
    phone: maskPhone(row.phone),
  };
  userDialogVisible.value = true;
}

/** 打开车辆详情弹窗 */
function handleOpenCar(row: PlateAuthRow) {
  currentCarProfile.value = {
    plateNo: row.plateNo,
    plateColor: row.plateColor,
    carType: row.carType,
    status: row.status === '已认证' ? '已绑定并已认证' : row.status,
  };
  vehicleDialogVisible.value = true;
}

/** 打开操作人员弹窗 */
function handleOpenOperator(name: string) {
  if (!name || name === '-') {
    return;
  }

  operatorDetail.value = getOperatorDetail(name);
  operatorDialogVisible.value = true;
}
</script>

<template>
  <div class="plate-auth-table">
    <div class="plate-auth-grid-wrap">
      <Grid table-title="车牌认证列表">
        <template #toolbar-tools>
          <TableAction
            :actions="[
              {
                label: '导出',
                type: 'primary',
                icon: ACTION_ICON.DOWNLOAD,
                onClick: handleExport,
              },
              {
                label: '批量审核',
                type: 'primary',
                icon: ACTION_ICON.AUDIT,
                disabled: !checkedIds.length,
                onClick: handleOpenBatchAudit,
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
          <ElButton type="primary" link @click="handleOpenCar(row)">
            {{ row.plateNo }}
          </ElButton>
        </template>

        <template #drivingLicense="{ row }">
          <ElImage
            :preview-src-list="[row.drivingLicense]"
            :src="row.drivingLicense"
            fit="cover"
            style="width: 68px; height: 42px; border-radius: 4px"
          />
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
                label: '重新认证',
                type: 'primary',
                link: true,
                icon: ACTION_ICON.AUDIT,
                ifShow: () => row.status === '已驳回',
                onClick: handleReauth.bind(null, row),
              },
            ]"
          />
        </template>
      </Grid>
    </div>

    <DetailDrawer
      ref="detailDrawerRef"
      :data="detailData"
      :fields="detailFields"
      :title="detailObj ? `${detailObj.plateNo}认证详情` : '车牌认证详情'"
    />

    <ElDialog v-model="batchAuditDialogVisible" title="批量审核" width="520px">
      <ElRadioGroup v-model="batchAuditState.mode">
        <ElRadioButton value="approve">批量通过</ElRadioButton>
        <ElRadioButton value="reject">批量驳回</ElRadioButton>
      </ElRadioGroup>
      <ElInput
        v-model="batchAuditState.remark"
        :maxlength="200"
        :placeholder="
          batchAuditState.mode === 'reject'
            ? '请输入统一驳回理由，不少于 10 个字'
            : '请输入审核备注'
        "
        :rows="4"
        show-word-limit
        style="margin-top: 16px"
        type="textarea"
      />
      <template #footer>
        <ElButton @click="batchAuditDialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="handleConfirmBatchAudit"
          >确认</ElButton
        >
      </template>
    </ElDialog>

    <ElDialog v-model="rejectDialogVisible" title="驳回认证" width="520px">
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

    <ElDialog v-model="vehicleDialogVisible" title="车辆详情" width="520px">
      <ElDescriptions v-if="currentCarProfile" :column="1" border>
        <ElDescriptionsItem label="车牌号码">
          {{ currentCarProfile.plateNo }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="车牌颜色">
          {{ currentCarProfile.plateColor }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="车辆类型">
          {{ currentCarProfile.carType }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="当前状态">
          {{ currentCarProfile.status }}
        </ElDescriptionsItem>
      </ElDescriptions>
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
.plate-auth-table,
.plate-auth-grid-wrap {
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.plate-auth-table {
  display: flex;
  flex-direction: column;
}

.plate-auth-grid-wrap {
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
