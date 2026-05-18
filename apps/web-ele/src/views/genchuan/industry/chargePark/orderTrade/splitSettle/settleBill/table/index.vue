<script setup>import { reactive, ref, computed, watch } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';
import { ElMessage, ElForm, ElFormItem, ElInput, ElInputNumber, ElSelect, ElOption, ElDialog } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getSettleBillPage, exportSettleBillExcel, createSettleBill, updateSettleBill, deleteSettleBill, regenerateSettleBill, settleSettleBill, rejectSettleBill, passSettleBill } from '#/api/genchuan/industry/chargePark/orderTrade/splitSettle/index.js';
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
      createTimeStart: null,
      createTimeEnd: null,
    }),
  },
});
const emit = defineEmits(['arrow-change', 'clear-filters']);
// 搜索表单数据
const searchFormData = reactive({
  billNo: '',
  partnerId: '',
  status: '',
});
const searchFormRef = ref(null);
// 表单数据
const formData = reactive({
  id: 0,
  partnerId: 0,
  totalAmount: 0,
  splitAmount: 0,
  status: '',
  remark: '',
  reserve1: '',
  reserve2: '',
});
// 表单规则
const rules = {
  partnerId: [
    { required: true, message: '合作方ID不能为空', trigger: 'blur' },
    { type: 'number', min: 0, message: '合作方ID必须为非负整数', trigger: 'blur' },
  ],
  totalAmount: [
    { required: true, message: '收费总额不能为空', trigger: 'blur' },
    { type: 'number', min: 0, message: '收费总额必须为非负数', trigger: 'blur' },
  ],
  splitAmount: [
    { required: true, message: '分成金额不能为空', trigger: 'blur' },
    { type: 'number', min: 0, message: '分成金额必须为非负数', trigger: 'blur' },
  ],
};
const formRef = ref(null);
// 表单抽屉标题
const formTitle = computed(() => {
  return formData.id ? '编辑结算单据' : '新增结算单据';
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
        formData.totalAmount = data.totalAmount || 0;
        formData.splitAmount = data.splitAmount || 0;
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
  formData.totalAmount = 0;
  formData.splitAmount = 0;
  formData.status = '';
  formData.remark = '';
  formData.reserve1 = '';
  formData.reserve2 = '';
  formRef.value?.resetFields();
}
/** 创建结算单据 */
function handleCreate() {
  formDrawerApi.setData({ title: '新增' }).open();
}
/** 编辑结算单据 */
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
      totalAmount: Number(formData.totalAmount) || 0,
      splitAmount: Number(formData.splitAmount) || 0,
      status: formData.status || '',
      remark: formData.remark || '',
      reserve1: formData.reserve1 || '',
      reserve2: formData.reserve2 || '',
    };
    try {
      if (submitData.id) {
        await updateSettleBill(submitData);
        ElMessage.success('更新成功');
      }
      else {
        await createSettleBill(submitData);
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
/** 删除结算单据 */
async function handleDelete(row) {
 await confirm('确定删除该结算单据吗？');
 try {
 await deleteSettleBill({ id: row.id });
 ElMessage.success('删除成功');
 handleRefresh();
 }
 catch (error) {
 console.error('删除失败:', error);
 ElMessage.error('删除失败');
 }
}
// 操作弹窗数据
const actionDialog = reactive({
 visible: false,
 type: '',
 id: 0,
 remark: '',
 title: '',
});
// 打开操作弹窗
function openActionDialog(type, row) {
 actionDialog.id = row.id;
 actionDialog.remark = '';
 actionDialog.type = type;
 switch (type) {
 case 'pass':
 actionDialog.title = '审核通过';
 break;
 case 'reject':
 actionDialog.title = '审核驳回';
 break;
 case 'settle':
 actionDialog.title = '结算';
 break;
 case 'regenerate':
 actionDialog.title = '重新生成';
 break;
 }
 actionDialog.visible = true;
}
// 提交操作
async function submitAction() {
 const data = {
 id: actionDialog.id,
 remark: actionDialog.remark || '',
 };
 try {
 switch (actionDialog.type) {
 case 'pass':
 await passSettleBill(data);
 ElMessage.success('审核通过成功');
 break;
 case 'reject':
 await rejectSettleBill(data);
 ElMessage.success('审核驳回成功');
 break;
 case 'settle':
 await settleSettleBill(data);
 ElMessage.success('结算成功');
 break;
 case 'regenerate':
 await regenerateSettleBill(data);
 ElMessage.success('重新生成成功');
 break;
 }
 actionDialog.visible = false;
 handleRefresh();
 }
 catch (error) {
 console.error('操作失败:', error);
 ElMessage.error('操作失败');
 }
}
// 结算单据状态映射 - SettleBillStatusEnum
const statusMap = {
  pending_audit: { label: '待审核', type: 'warning' },
  pending_settle: { label: '待结算', type: 'info' },
  settled: { label: '已结算', type: 'success' },
  rejected: { label: '已驳回', type: 'danger' },
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
    billNo: searchFormData.billNo || undefined,
    partnerId: searchFormData.partnerId ? Number(searchFormData.partnerId) : undefined,
    status: searchFormData.status || undefined,
  };
  dataObj.currentPage = 1;
  gridApi.query();
  drawerApi.close();
}
/** 重置搜索 */
function resetSearch() {
  searchFormData.billNo = '';
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
  const data = await exportSettleBillExcel();
  downloadFileFromBlobPart({ fileName: '结算单据报表.xls', source: data });
}
const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}
const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  enDetailObj: {},
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
    const res = await getSettleBillPage(params);
    dataObj.total = res.total;
    dataObj.list = res.list.map((v) => {
      return {
        ...v,
        auditTime: formatTimestamp(v.auditTime),
        settleTime: formatTimestamp(v.settleTime),
        createTime: formatTimestamp(v.createTime),
        updateTime: formatTimestamp(v.updateTime),
      };
    });
    return dataObj;
  }
  catch (error) {
    console.error('获取结算单据数据失败:', error);
    ElMessage.error('获取结算单据数据失败');
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
        <ElFormItem label="合作方ID" prop="partnerId">
          <ElInputNumber v-model="formData.partnerId" :min="0" class="w-full" />
        </ElFormItem>
        <ElFormItem label="收费总额" prop="totalAmount">
          <ElInputNumber v-model="formData.totalAmount" :min="0" :precision="2" class="w-full" />
        </ElFormItem>
        <ElFormItem label="分成金额" prop="splitAmount">
          <ElInputNumber v-model="formData.splitAmount" :min="0" :precision="2" class="w-full" />
        </ElFormItem>
        <ElFormItem label="状态">
          <ElSelect v-model="formData.status" placeholder="请选择状态" class="w-full">
            <ElOption label="待审核" value="pending_audit" />
            <ElOption label="待结算" value="pending_settle" />
            <ElOption label="已结算" value="settled" />
            <ElOption label="已驳回" value="rejected" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="备注">
          <ElInput v-model="formData.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </ElFormItem>
      </ElForm>
    </FormDrawer>

    <ParkDetailDrawer ref="parkDetailDrawerRef" :detail-obj="dataObj.detailObj" />
    <Drawer title="搜索">
      <ElForm
        ref="searchFormRef"
        :model="searchFormData"
        label-width="100px"
        class="query-form"
      >
        <ElFormItem label="单据编号">
          <ElInput v-model="searchFormData.billNo" placeholder="请输入单据编号" />
        </ElFormItem>
        <ElFormItem label="合作方ID">
          <ElInputNumber v-model="searchFormData.partnerId" :min="0" placeholder="请输入合作方ID" />
        </ElFormItem>
        <ElFormItem label="状态">
          <ElSelect v-model="searchFormData.status" placeholder="请选择状态">
            <ElOption label="待审核" value="pending_audit" />
            <ElOption label="待结算" value="pending_settle" />
            <ElOption label="已结算" value="settled" />
            <ElOption label="已驳回" value="rejected" />
          </ElSelect>
        </ElFormItem>
      </ElForm>
    </Drawer>

    <!-- 操作弹窗 -->
    <ElDialog
      v-model="actionDialog.visible"
      :title="actionDialog.title"
      width="450px"
      append-to-body
    >
      <ElForm :model="actionDialog" label-width="80px">
        <ElFormItem label="备注">
          <ElInput
            v-model="actionDialog.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注（选填）"
          />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="actionDialog.visible = false">取消</el-button>
          <el-button type="primary" @click="submitAction">确认</el-button>
        </div>
      </template>
    </ElDialog>

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
      <template #status="{ row }">
        <el-tag :type="getStatusType(row.status)">
          {{ getStatusLabel(row.status) }}
        </el-tag>
      </template>
      <template #billNo="{ row }">
        <el-text @click="handleOpenDetail(row)" class="common-align" type="primary">
          {{ row.billNo }}
        </el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
          <IconButton content="编辑" icon-name="Edit" @click="handleEdit(row)" />
          <IconButton content="审核通过" icon-name="Check" v-if="row.status === 'pending_audit'" @click="openActionDialog('pass', row)" />
          <IconButton content="审核驳回" icon-name="Close" v-if="row.status === 'pending_audit'" @click="openActionDialog('reject', row)" />
          <IconButton content="结算" icon-name="Wallet" v-if="row.status === 'pending_settle'" @click="openActionDialog('settle', row)" />
          <IconButton content="重新生成" icon-name="Refresh" v-if="row.status === 'rejected'" @click="openActionDialog('regenerate', row)" />
          <IconButton content="删除" icon-name="Delete" @click="handleDelete(row)" />
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
