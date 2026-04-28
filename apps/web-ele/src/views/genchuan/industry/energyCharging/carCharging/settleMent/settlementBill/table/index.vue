<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';
 
import screenfull from 'screenfull';
import { getSettlementBillList, createSettlementBillBatch, exportSettlementBillExcel, auditSettlementBill, rejectSettlementBill, settleSettlementBill , reAuditSettlementBill,updateRemarkSettlementBill} from '#/api/genchuan/industry/energyCharging/carCharging/settlement/settlementBill/index.js';
import { ElDialog, ElLoading, ElForm, ElFormItem, ElInput, ElMessageBox, ElMessage, ElButton, ElDatePicker } from 'element-plus';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { $t } from '#/locales';
import { formatTimestamp } from '#/utils';

import { useFormSchema, useGridColumns } from './data';
// 引入封装后的详情抽屉组件
import ParkDetailDrawer from './detail.vue';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
});

// 生成结算单弹窗相关
const createBillDialogVisible = ref(false);
const createBillForm = reactive({
  cooperator: 'XX能源科技有限公司',
  settlementCycle: '2025-04'
});

// 审核结算单弹窗相关
const auditDialogVisible = ref(false);
const auditForm = reactive({
  id: '',
  auditRemark: '审核通过，数据无误'
});

// 驳回结算单弹窗相关
const rejectDialogVisible = ref(false);
const rejectForm = reactive({
  id: '',
  rejectReason: '结算数据存在异常，金额核对不符'
});

// 结算结算单弹窗相关
const settleDialogVisible = ref(false);
const settleForm = reactive({
  id: '',
  settlementChannel: '对公转账'
});

// 更新备注弹窗相关
const remarkDialogVisible = ref(false);
const remarkForm = reactive({
  id: '',
  remark: ''
});



const handleCreateBill = async () => {
  try {
    // 调用生成结算单接口
    const response = await createSettlementBillBatch(createBillForm);
    if (response) {
      ElMessage.success('结算单生成成功！');
      createBillDialogVisible.value = false;
      gridApi.reload();
    }
  } catch (error) {
    ElMessage.error(`生成失败：${error.msg || '请稍后重试'}`);
  }
};

// 审核结算单
const handleAudit = async (row) => {
  // 填充审核表单数据
  auditForm.id = row.id;
  auditForm.auditRemark = '审核通过，数据无误';
  // 打开审核弹窗
  auditDialogVisible.value = true;
};

// 确认审核
const confirmAudit = async () => {
  try {
    // 调用审核接口
    const response = await auditSettlementBill(auditForm);
    if (response) {
      ElMessage.success('审核成功！');
      auditDialogVisible.value = false;
      gridApi.reload();
    }
  } catch (error) {
    ElMessage.error(`审核失败：${error.msg || '请稍后重试'}`);
  }
};

// 驳回结算单
const handleReject = async (row) => {
  // 填充驳回表单数据
  rejectForm.id = row.id;
  rejectForm.rejectReason = '结算数据存在异常，金额核对不符';
  // 打开驳回弹窗
  rejectDialogVisible.value = true;
};

// 确认驳回
const confirmReject = async () => {
  try {
    // 调用驳回接口
    const response = await rejectSettlementBill(rejectForm);
    if (response) {
      ElMessage.success('驳回成功！');
      rejectDialogVisible.value = false;
      gridApi.reload();
    }
  } catch (error) {
    ElMessage.error(`驳回失败：${error.msg || '请稍后重试'}`);
  }
};

// 结算结算单
const handleSettle = async (row) => {
  // 填充结算表单数据
  settleForm.id = row.id;
  settleForm.settlementChannel = '对公转账';
  // 打开结算弹窗
  settleDialogVisible.value = true;
};

// 确认结算
const confirmSettle = async () => {
  try {
    // 调用结算接口
    const response = await settleSettlementBill(settleForm);
    if (response) {
      ElMessage.success('结算成功！');
      settleDialogVisible.value = false;
      gridApi.reload();
    }
  } catch (error) {
    ElMessage.error(`结算失败：${error.msg || '请稍后重试'}`);
  }
};

// 重新审核结算
const handleResetSettle = async (row) => {
  try {
    await confirm('确定重新审核计算吗？');
    // 调用重新审核结算接口
    const response = await reAuditSettlementBill({ id: row.id });
    if (response) {
      ElMessage.success('重新审核计算成功！');
      gridApi.reload();
    }
  } catch (error) {
    ElMessage.error(`重新审核计算失败：${error.msg || '请稍后重试'}`);
  }
};

// 更新备注
const handleUpdateRemark = async (row) => {
  // 填充备注表单数据
  remarkForm.id = row.id;
  remarkForm.remark = row.remark || '';
  // 打开备注弹窗
  remarkDialogVisible.value = true;
};

// 确认更新备注
const confirmUpdateRemark = async () => {
  try {
    // 调用更新备注接口
    const response = await updateRemarkSettlementBill(remarkForm);
    if (response) {
      ElMessage.success('备注更新成功！');
      remarkDialogVisible.value = false;
      gridApi.reload();
    }
  } catch (error) {
    ElMessage.error(`备注更新失败：${error.msg || '请稍后重试'}`);
  }
};

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    drawerApi.close();
  },
  onConfirm() { },
  async onOpenChange() { },
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 导出表格 */
async function handleExport() {
  const data = await exportSettlementBillExcel();
  downloadFileFromBlobPart({
    fileName: '结算单.xls',
    source: data,
  });
}

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}


const dataObj = reactive({
  totalShow: false,
  detailObj: {}, // 保留详情对象用于传递给组件
  total: 0,
  currentPage: 1,
  pageSize: 10,
  serachObj: {},
  list: [],
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



  const data = await getSettlementBillList(getParams);
  dataObj.total = data.total;
  dataObj.list = data.list.map((v) => {
    return {
      ...v,
      settlementTime: formatTimestamp(v.settlementTime),
      auditTime: formatTimestamp(v.auditTime), 
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

// 新增抽屉创建相关


const handleSerachShow = () => {
  drawerApi.open();
};
const handleFullShow = () => {
  screenfull.toggle();
};

// 定义组件ref，用于调用组件方法
const parkDetailDrawerRef = ref(null);



</script>

<template>
  <div class="park-lot-table-new">

    <!-- 使用封装后的详情抽屉组件 -->
    <ParkDetailDrawer ref="parkDetailDrawerRef" :detail-obj="dataObj.detailObj" title="详情" />

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>



    <Grid>

      <!-- 快捷筛选标签 -->
      <template #table-title>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton
            content="生成结算单"
            icon-name="folder"
            @click="createBillDialogVisible = true"
          />
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExport"
          />
          <!-- <IconButton
            content="批量删除"
            icon-name="delete"
            color="#F56C6C"
            :disabled="isEmpty(checkedIds)"
            @click="handleDeleteBatch"
          /> -->
          <IconButton
            content="搜索"
            icon-name="search"
            @click="handleSerachShow"
          />
          <IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
        </div>
      </template>

      <template #billCode="{ row }">
        <el-text @click="handleOpenDetail(row)" class="common-align" type="primary">
          {{ row.billCode }}
        </el-text>
      </template>



      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="审核" :disabled="row.billStatus !== '待审核'"  icon-name="edit" @click="handleAudit(row)" />
          <IconButton content="重新审核结算" :disabled="row.billStatus !== '已驳回'"  icon-name="Check" @click="handleResetSettle(row)" />
          <IconButton content="驳回" :disabled="row.billStatus !== '待审核'"  icon-name="Close" @click="handleReject(row)"/>
          <IconButton content="结算" :disabled="row.billStatus !== '审核通过'" icon-name="Check" @click="handleSettle(row)" />
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)" />
          <IconButton content="备注" icon-name="Edit" @click="handleUpdateRemark(row)" />
          <!-- <IconButton content="删除" icon-name="delete" color="#F56C6C" @click="handleDeleteSingle(row)" /> -->
        </div>
      </template>

      <template #bottom>
        <div class="common-total" @click="changeTotalShow"></div>
      </template>
    </Grid>

    <!-- 生成结算单弹窗 -->
    <ElDialog
      title="生成结算单"
      v-model="createBillDialogVisible"
      width="500px"
      :close-on-click-modal="false" 
    >
      <div class="dialog-content">
        <div class="form-item">
          <label class="form-label">合作方:</label>
          <ElInput
            v-model="createBillForm.cooperator"
            placeholder="请输入合作方"
          />
        </div>
        <div class="form-item">
          <label class="form-label">结算周期:</label>
          <ElDatePicker
            v-model="createBillForm.settlementCycle"
            type="month"
            placeholder="请选择结算周期"
            format="YYYY-MM"
            value-format="YYYY-MM"
          />
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <ElButton @click="createBillDialogVisible = false">取消</ElButton>
          <ElButton type="primary" @click="handleCreateBill">确认生成</ElButton>
        </span>
      </template>
    </ElDialog>

    <!-- 审核结算单弹窗 -->
    <ElDialog
      title="审核结算单"
      v-model="auditDialogVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <div class="dialog-content">
        <div class="form-item">
          <label class="form-label">结算单ID:</label>
          <ElInput
            v-model="auditForm.id"
            placeholder="结算单ID"
            disabled
          />
        </div>
        <div class="form-item">
          <label class="form-label">审核备注:</label>
          <ElInput
            v-model="auditForm.auditRemark"
            placeholder="请输入审核备注"
            type="textarea"
            :rows="4"
          />
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <ElButton @click="auditDialogVisible = false">取消</ElButton>
          <ElButton type="primary" @click="confirmAudit">确认审核</ElButton>
        </span>
      </template>
    </ElDialog>

    <!-- 驳回结算单弹窗 -->
    <ElDialog
      title="驳回结算单"
      v-model="rejectDialogVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <div class="dialog-content">
        <div class="form-item">
          <label class="form-label">结算单ID:</label>
          <ElInput
            v-model="rejectForm.id"
            placeholder="结算单ID"
            disabled
          />
        </div>
        <div class="form-item">
          <label class="form-label">驳回原因:</label>
          <ElInput
            v-model="rejectForm.rejectReason"
            placeholder="请输入驳回原因"
            type="textarea"
            :rows="4"
          />
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <ElButton @click="rejectDialogVisible = false">取消</ElButton>
          <ElButton type="primary" @click="confirmReject">确认驳回</ElButton>
        </span>
      </template>
    </ElDialog>

    <!-- 结算结算单弹窗 -->
    <ElDialog
      title="结算结算单"
      v-model="settleDialogVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <div class="dialog-content">
        <div class="form-item">
          <label class="form-label">结算单ID:</label>
          <ElInput
            v-model="settleForm.id"
            placeholder="结算单ID"
            disabled
          />
        </div>
        <div class="form-item">
          <label class="form-label">结算渠道:</label>
          <ElInput
            v-model="settleForm.settlementChannel"
            placeholder="请输入结算渠道"
          />
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <ElButton @click="settleDialogVisible = false">取消</ElButton>
          <ElButton type="primary" @click="confirmSettle">确认结算</ElButton>
        </span>
      </template>
    </ElDialog>

    <!-- 更新备注弹窗 -->
    <ElDialog
      title="更新备注"
      v-model="remarkDialogVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <div class="dialog-content">
        <div class="form-item">
          <label class="form-label">结算单ID:</label>
          <ElInput
            v-model="remarkForm.id"
            placeholder="结算单ID"
            disabled
          />
        </div>
        <div class="form-item">
          <label class="form-label">备注内容:</label>
          <ElInput
            v-model="remarkForm.remark"
            placeholder="请输入备注内容"
            type="textarea"
            :rows="4"
          />
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <ElButton @click="remarkDialogVisible = false">取消</ElButton>
          <ElButton type="primary" @click="confirmUpdateRemark">确认更新</ElButton>
        </span>
      </template>
    </ElDialog>
  </div>
</template>

<style scoped>
/* 批量查看表格样式优化 */
:deep(.el-table) {
  --el-table-header-text-color: #303133;
  --el-table-row-hover-bg-color: #f5f7fa;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

/* 弹窗内容样式 */
.dialog-content {
  padding: 20px;
}

.form-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.form-label {
  width: 100px;
  font-weight: 500;
  color: #606266;
  margin-right: 20px;
}

.form-item .el-input {
  flex: 1;
}
</style>
