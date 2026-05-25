<script setup>import { reactive, ref, computed, watch } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';
import { ElMessage, ElForm, ElFormItem, ElInput, ElInputNumber, ElSelect, ElOption, ElDialog, ElDescriptions, ElDescriptionsItem } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getSplitRatePage, exportSplitRateExcel, createSplitRate, updateSplitRate, deleteSplitRate, enableSplitRate, disableSplitRate } from '#/api/genchuan/industry/chargePark/orderTrade/splitSettle/index.js';
import { getMerchantInfoPage } from '#/api/genchuan/industry/chargePark/orderTrade/agentPay/index.js';
import { formatTimestamp } from '#/utils';
import { confirm } from '@vben/common-ui';
import { useGridColumns } from './data';
import ParkDetailDrawer from './detail.vue';
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
  filterParams: {
    type: Object,
    default: () => ({
      splitMode: null,
      status: null,
    }),
  },
});
const emit = defineEmits(['arrow-change', 'clear-filters']);
// 搜索表单数据
const searchFormData = reactive({
  partnerId: '',
  status: '',
});
const searchFormRef = ref(null);
// 表单数据
const formData = reactive({
  id: 0,
  partnerId: 0,
  splitMode: '',
  rateValue: 0,
  status: '',
  remark: '',
  reserve1: '',
  reserve2: '',
});
// 表单规则
const rules = {
  splitMode: [
    { required: true, message: '分账方式不能为空', trigger: 'blur' },
  ],
  rateValue: [
    { required: true, message: '分账比例不能为空', trigger: 'blur' },
    { type: 'number', min: 0, max: 100, message: '分账比例必须在0-100之间', trigger: 'blur' },
  ],
};
const formRef = ref(null);
// 表单抽屉标题
const formTitle = computed(() => {
  return formData.id ? '编辑分账结算' : '新增分账结算';
});
const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  footer: true,
  cancelText: '取消',
  confirmText: '保存',
  onCancel() {
    formDrawerApi.close();
  },
  onConfirm() {
    handleSubmitForm();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = formDrawerApi.getData();
      if (data?.id) {
        // 编辑模式
        formData.id = data.id;
        formData.partnerId = data.partnerId || 0;
        formData.splitMode = data.splitMode || '';
        formData.rateValue = data.rateValue || 0;
        formData.status = data.status || '';
        formData.remark = data.remark || '';
        formData.reserve1 = data.reserve1 || '';
        formData.reserve2 = data.reserve2 || '';
      }
      else {
        // 新增模式 - 重置表单
        resetForm();
      }
    }
  },
});
// 重置表单
function resetForm() {
  formData.id = 0;
  formData.partnerId = 0;
  formData.splitMode = '';
  formData.rateValue = 0;
  formData.status = '';
  formData.remark = '';
  formData.reserve1 = '';
  formData.reserve2 = '';
  formRef.value?.resetFields();
}
/** 创建分账结算 */
function handleCreate() {
  formDrawerApi.setData({ title: '新增' }).open();
}
/** 编辑分账结算 */
function handleEdit(row) {
  formDrawerApi.setData({
    title: '编辑',
    ...row,
  }).open();
}
/** 提交表单 */
async function handleSubmitForm() {
  if (!formRef.value)
    return;
  formRef.value.validate(async (valid) => {
    if (!valid)
      return;
    // 强制转换为指定的数据格式
    const submitData = {
      id: formData.id || 0,
      partnerId: Number(formData.partnerId) || 0,
      splitMode: formData.splitMode || '',
      rateValue: Number(formData.rateValue) || 0,
      status: formData.status || '',
      remark: formData.remark || '',
      reserve1: formData.reserve1 || '',
      reserve2: formData.reserve2 || '',
    };
    try {
      if (submitData.id) {
        await updateSplitRate(submitData);
        ElMessage.success('更新成功');
      }
      else {
        await createSplitRate(submitData);
        ElMessage.success('创建成功');
      }
      formDrawerApi.close();
      handleRefresh();
    }
    catch (error) {
      console.error('提交失败:', error);
      ElMessage.error('提交失败');
    }
  });
}
/** 删除分账结算 */
async function handleDelete(row) {
 await confirm('确定删除该分账结算吗？');
 try {
 await deleteSplitRate({ id: row.id });
 ElMessage.success('删除成功');
 handleRefresh();
 }
 catch (error) {
 console.error('删除失败:', error);
 ElMessage.error('删除失败');
 }
}
/** 启用分账结算 */
async function handleEnable(row) {
 await confirm('确定启用该分账结算吗？');
 try {
 await enableSplitRate({ id: row.id });
 ElMessage.success('启用成功');
 handleRefresh();
 }
 catch (error) {
 console.error('启用失败:', error);
 ElMessage.error('启用失败');
 }
}
/** 禁用分账结算 */
async function handleDisable(row) {
 await confirm('确定禁用该分账结算吗？');
 try {
 await disableSplitRate({ id: row.id });
 ElMessage.success('禁用成功');
 handleRefresh();
 }
 catch (error) {
 console.error('禁用失败:', error);
 ElMessage.error('禁用失败');
 }
}
// 分账结算状态映射 - SplitRateStatusEnum
const statusMap = {
  pending: { label: '未生效', type: 'warning' },
  enabled: { label: '已生效', type: 'success' },
  disabled: { label: '已禁用', type: 'danger' },
};
// 获取状态标签
const getStatusLabel = (status) => {
  return statusMap[status]?.label || status;
};
// 获取状态类型
const getStatusType = (status) => {
  return statusMap[status]?.type || 'default';
};
const [Drawer, drawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  footer: true,
  cancelText: '重置',
  confirmText: '查询',
  onCancel() {
    resetSearch();
  },
  onConfirm() {
    handleSearch();
  },
});
/** 搜索 */
function handleSearch() {
  dataObj.searchObj = {
    partnerId: searchFormData.partnerId ? Number(searchFormData.partnerId) : undefined,
    status: searchFormData.status || undefined,
  };
  dataObj.currentPage = 1;
  gridApi.query();
  drawerApi.close();
}
/** 重置搜索 */
function resetSearch() {
  searchFormData.partnerId = '';
  searchFormData.status = '';
  dataObj.searchObj = {};
  dataObj.currentPage = 1;
  gridApi.query();
}
/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}
// ====================== 导出 EXCEL ======================
async function handleExport() {
  const data = await exportSplitRateExcel();
  downloadFileFromBlobPart({ fileName: '分账比例报表.xls', source: data });
}
const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}
const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  enDetailObj: {},
  merchantDetailObj: {},
  settlementListObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  apilist: [],
  list: [],
  loading: false,
  searchObj: {},
  filterParams: {},
});
const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};
// 表格数据获取
const getTableData = async (pageObj) => {
  const page = pageObj.page;
  const params = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...dataObj.searchObj,
    ...dataObj.filterParams,
  };
  try {
    dataObj.loading = true;
    const res = await getSplitRatePage(params);
    dataObj.total = res.total;
    dataObj.list = res.list.map((v) => {
      return {
        ...v,
        auditTime: formatTimestamp(v.auditTime),
        createTime: formatTimestamp(v.createTime),
        updateTime: formatTimestamp(v.updateTime),
      };
    });
    return dataObj;
  }
  catch (error) {
    console.error('获取分账结算数据失败:', error);
    ElMessage.error('获取分账结算数据失败');
    return dataObj;
  }
  finally {
    dataObj.loading = false;
  }
};
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
  parkDetailDrawerRef.value?.open();
};
const handleSerachShow = () => {
  drawerApi.open();
};
const handleFullShow = () => {
  screenfull.toggle();
};
const parkDetailDrawerRef = ref(null);
const arrowChange = () => {
  emit('arrow-change');
};

// 商户详情弹窗
const merchantDialogVisible = ref(false);

// 结算单据明细弹窗
const settlementListDialogVisible = ref(false);

// 点击合作方名称跳转商户详情弹窗
async function handleOpenMerchantDetail(row) {
  try {
    const res = await getMerchantInfoPage({ merchantName: row.partnerName });
    if (res.list && res.list.length > 0) {
      const firstMerchant = res.list[0];
      dataObj.merchantDetailObj = {
        ...firstMerchant,
        registerTime: formatTimestamp(firstMerchant.registerTime),
      };
      merchantDialogVisible.value = true;
    } else {
      ElMessage.info('未找到相关商户信息');
    }
  } catch (error) {
    console.error('获取商户详情失败:', error);
    ElMessage.error('获取商户详情失败');
  }
}

// 点击分账模式筛选
function handleFilterSplitMode(splitMode) {
  if (!splitMode) return;
  dataObj.searchObj = { ...dataObj.searchObj, splitMode: splitMode };
  dataObj.currentPage = 1;
  gridApi.query();
}

// 点击状态筛选
function handleFilterStatus(status) {
  if (!status) return;
  dataObj.searchObj = { ...dataObj.searchObj, status: status };
  dataObj.currentPage = 1;
  gridApi.query();
}

// 点击审核人筛选
function handleFilterAuditor(auditorName) {
  if (!auditorName) return;
  dataObj.searchObj = { ...dataObj.searchObj, auditorName: auditorName };
  dataObj.currentPage = 1;
  gridApi.query();
}

// 点击累计分账金额跳转结算单据明细弹窗
function handleOpenSettlementList(row) {
  dataObj.settlementListObj = row;
  settlementListDialogVisible.value = true;
}

// 手机号脱敏函数
function maskPhone(phone) {
  if (!phone) return '-';
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

watch(
  () => props.filterParams,
  () => {
    dataObj.currentPage = 1;
    dataObj.searchObj = {};
    dataObj.filterParams = props.filterParams;
    gridApi.query();
  },
  { deep: true }
);
</script>

<template>
  <div class="park-lot-table-new" v-loading="dataObj.loading">
    <!-- 表单抽屉 -->
    <FormDrawer :title="formTitle">
      <ElForm ref="formRef" :model="formData" :rules="rules" label-width="100px" class="common-form">
        <ElFormItem label="分账方式" prop="splitMode">
          <ElSelect v-model="formData.splitMode" placeholder="请选择分账方式" class="w-full">
            <ElOption label="固定比例" value="fixed" />
            <ElOption label="阶梯比例" value="ladder" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="分账比例(%)" prop="rateValue">
          <ElInputNumber v-model="formData.rateValue" :min="0" :max="100" :precision="2" class="w-full" />
        </ElFormItem>
        <ElFormItem label="状态">
          <ElSelect v-model="formData.status" placeholder="请选择状态" class="w-full">
            <ElOption label="未生效" value="pending" />
            <ElOption label="已生效" value="enabled" />
            <ElOption label="已禁用" value="disabled" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="备注">
          <ElInput v-model="formData.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </ElFormItem>
      </ElForm>
    </FormDrawer>

    <ParkDetailDrawer ref="parkDetailDrawerRef" :detail-obj="dataObj.detailObj" />
    
    <!-- 商户详情弹窗 -->
    <ElDialog v-model="merchantDialogVisible" title="商户详情" width="520px">
      <ElDescriptions v-if="dataObj.merchantDetailObj" :column="1" border>
        <ElDescriptionsItem label="商户名称">
          {{ dataObj.merchantDetailObj.name || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="商户类型">
          {{ dataObj.merchantDetailObj.merchantType || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="联系人">
          {{ dataObj.merchantDetailObj.contact || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="联系电话">
          {{ maskPhone(dataObj.merchantDetailObj.phone) }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="商户地址">
          {{ dataObj.merchantDetailObj.address || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="商户状态">
          {{ dataObj.merchantDetailObj.status || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="注册时间">
          {{ dataObj.merchantDetailObj.registerTime || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="备注">
          {{ dataObj.merchantDetailObj.remark || '-' }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElDialog>

    <!-- 结算单据明细弹窗 -->
    <ElDialog v-model="settlementListDialogVisible" title="关联结算单据明细" width="600px">
      <ElDescriptions v-if="dataObj.settlementListObj" :column="1" border>
        <ElDescriptionsItem label="配置ID">
          {{ dataObj.settlementListObj.id || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="合作方名称">
          {{ dataObj.settlementListObj.partnerName || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="分账模式">
          {{ dataObj.settlementListObj.splitMode === 'fixed' ? '固定比例' : '阶梯比例' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="比例值">
          {{ dataObj.settlementListObj.rateValue ? `${dataObj.settlementListObj.rateValue}%` : '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="累计分账金额">
          ¥{{ (dataObj.settlementListObj.totalSplitAmount || 0).toFixed(2) }}
        </ElDescriptionsItem>
      </ElDescriptions>
      <div style="margin-top: 16px; color: #909399; font-size: 13px;">
        注：此处展示该配置关联的结算单据明细列表（需后端提供接口支持）
      </div>
    </ElDialog>
    
    <Drawer title="搜索">
      <ElForm
        ref="searchFormRef"
        :model="searchFormData"
        label-width="100px"
        class="query-form"
      >
        <ElFormItem label="合作方ID">
          <ElInputNumber v-model="searchFormData.partnerId" :min="0" placeholder="请输入合作方ID" />
        </ElFormItem>
        <ElFormItem label="状态">
          <ElSelect v-model="searchFormData.status" placeholder="请选择状态">
            <ElOption label="未生效" value="pending" />
            <ElOption label="已生效" value="enabled" />
            <ElOption label="已禁用" value="disabled" />
          </ElSelect>
        </ElFormItem>
      </ElForm>
    </Drawer>

    <Grid>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
          <IconButton content="导出EXCEL" icon-name="download" @click="handleExport" />
          <IconButton content="搜索" icon-name="search" @click="handleSerachShow" />
          <IconButton :content="props.arrowShow ? '展开' : '收缩'" :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>
      <template #partnerName="{ row }">
        <span
          @click="handleOpenMerchantDetail(row)"
          class="common-align cursor-pointer text-primary"
        >
          {{ row.partnerName }}
        </span>
      </template>
      <template #splitMode="{ row }">
        <span
          @click="handleFilterSplitMode(row.splitMode)"
          class="common-align cursor-pointer text-primary"
        >
          {{ row.splitMode === 'fixed' ? '固定比例' : '阶梯比例' }}
        </span>
      </template>
      <template #status="{ row }">
        <el-tag 
          :type="getStatusType(row.status)"
          class="cursor-pointer"
          @click="handleFilterStatus(row.status)"
        >
          {{ getStatusLabel(row.status) }}
        </el-tag>
      </template>
      <template #auditorName="{ row }">
        <span
          @click="handleFilterAuditor(row.auditorName)"
          class="common-align cursor-pointer text-primary"
        >
          {{ row.auditorName || '-' }}
        </span>
      </template>
      <template #totalSplitAmount="{ row }">
        <span
          @click="handleOpenSettlementList(row)"
          class="common-align cursor-pointer text-primary"
        >
          ¥{{ (row.totalSplitAmount || 0).toFixed(2) }}
        </span>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
          <IconButton content="编辑" icon-name="Edit" @click="handleEdit(row)" />
          <IconButton content="启用" icon-name="Check" v-if="row.status === 'disabled' || row.status === 'pending'" @click="handleEnable(row)" />
          <IconButton content="禁用" icon-name="Close" v-if="row.status === 'enabled'" @click="handleDisable(row)" />
          <!-- <IconButton content="删除" icon-name="Delete" @click="handleDelete(row)" /> -->
        </div>
      </template>
      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon" v-if="!dataObj.totalShow">
            <ArrowDown />
          </el-icon>
          <el-icon class="tabel-tab-icon" v-if="dataObj.totalShow">
            <ArrowUp />
          </el-icon>
          <span> 全部统计：10条 </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
