<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';
 
import screenfull from 'screenfull';
import { getSettlementBillList, createSettlementBillBatch, exportSettlementBillExcel, auditSettlementBill, rejectSettlementBill, settleSettlementBill , reAuditSettlementBill,updateRemarkSettlementBill} from '#/api/genchuan/industry/energyCharging/carCharging/settlementBill/index.js';
import { ElDialog, ElLoading, ElForm, ElFormItem, ElInput, ElMessageBox, ElMessage, ElButton, ElDatePicker } from 'element-plus';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {   deleteRateSetting, createRateSetting, updateRateSetting, enableRateSetting, disableRateSetting, copyRateSetting } from '#/api/genchuan/industry/energyCharging/carCharging/chargingOrder/rateSetting/index.js';
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

async function handleDeleteBatch() {
  try {
    await confirm('确定删除这些费率方案吗？');
    for (const id of checkedIds.value) {
      // 调用单行删除方法
      await handleDeleteSingle({ id });
    }
    ElMessage.success('批量删除成功');
    handleRefresh();
  } catch (error) {
    ElMessage.error(`批量删除失败：${error.msg || '请稍后重试'}`);
  }
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
const [CreateDrawer, createDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    createDrawerApi.close();
  },
  async onConfirm() {
    try {
      // 获取表单数据
      const formData = await createFormApi.getValues();
      // 获取抽屉数据
      const drawerData = createDrawerApi.getData();
      // 判断是创建还是编辑
      if (drawerData.rowData) {
        // 编辑模式，调用更新接口
        await updateRateSetting({ ...formData, id: drawerData.rowData.id });
        // 提示成功
        ElMessage.success('编辑成功');
      } else {
        // 创建模式，调用创建接口
        await createRateSetting(formData);
        // 提示成功
        ElMessage.success('创建成功');
      }
      // 关闭抽屉
      createDrawerApi.close();
      // 刷新表格
      handleRefresh();
    } catch (error) {
      // 接口调用失败处理
      ElMessage.error(`${drawerData.rowData ? '编辑' : '创建'}失败：${error.msg || '请稍后重试'}`);
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      // 获取抽屉数据
      const drawerData = createDrawerApi.getData();
      // 如果是编辑模式，填充表单数据
      if (drawerData.rowData) {
        await createFormApi.setValues(drawerData.rowData);
      } else {
        // 重置表单
        createFormApi.resetForm();
      }
    }
  },
});

// 创建表单配置
const [CreateForm, createFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: useFormSchema().map((v) => {
    return {
      ...v,
    };
  }),
  showDefaultActions: false,
});

// 新增创建方法
const handleCreate = () => {
  createDrawerApi
    .setData({
      title: '新增费率方案',
    })
    .open();
};

// 编辑方法
const handleUpdate = (row) => {
  createDrawerApi
    .setData({
      title: '编辑费率方案',
      rowData: row,
    })
    .open();
};

// 批量生效方法
const handleEnable = async () => {
  try {
    await confirm('确定生效这些费率方案吗？');
    await enableRateSetting({ idList: checkedIds.value });
    ElMessage.success('生效成功');
    handleRefresh();
  } catch (error) {
    ElMessage.error(`生效失败：${error.msg || '请稍后重试'}`);
  }
};

// 批量失效方法
const handleDisable = async () => {
  try {
    await confirm('确定失效这些费率方案吗？');
    await disableRateSetting({ idList: checkedIds.value });
    ElMessage.success('失效成功');
    handleRefresh();
  } catch (error) {
    ElMessage.error(`失效失败：${error.msg || '请稍后重试'}`);
  }
};

// 单行生效方法
const handleRowEnable = async (row) => {
  try {
    await confirm('确定生效该费率方案吗？');
    await enableRateSetting({ idList: [row.id] });
    ElMessage.success('生效成功');
    handleRefresh();
  } catch (error) {
    ElMessage.error(`生效失败：${error.msg || '请稍后重试'}`);
  }
};

// 单行失效方法
const handleRowDisable = async (row) => {
  try {
    await confirm('确定失效该费率方案吗？');
    await disableRateSetting({ idList: [row.id] });
    ElMessage.success('失效成功');
    handleRefresh();
  } catch (error) {
    ElMessage.error(`失效失败：${error.msg || '请稍后重试'}`);
  }
};

// 复制抽屉相关
const [CopyDrawer, copyDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    copyDrawerApi.close();
  },
  async onConfirm() {
    try {
      // 获取表单数据
      const formData = await copyFormApi.getValues();
      // 转换时间格式为时间戳
      const timestampFormData = {
        ...formData,
        newStartTime: new Date(formData.newStartTime).getTime(),
        newEndTime: new Date(formData.newEndTime).getTime(),
      };
      // 调用复制接口
      await copyRateSetting(timestampFormData);
      // 提示成功
      ElMessage.success('复制成功');
      // 关闭抽屉
      copyDrawerApi.close();
      // 刷新表格
      handleRefresh();
    } catch (error) {
      // 接口调用失败处理
      ElMessage.error(`复制失败：${error.msg || '请稍后重试'}`);
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      // 重置表单
      copyFormApi.resetForm();
    }
  },
});

// 复制表单配置
const [CopyForm, copyFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 120,
  },
  layout: 'horizontal',
  schema: [
    {
      fieldName: 'id',
      label: '原方案ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入原方案ID',
        disabled: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'newRateCode',
      label: '新方案编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入新方案编号',
      },
      rules: 'required',
    },
    {
      fieldName: 'newRateName',
      label: '新方案名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入新方案名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'newStartTime',
      label: '生效开始时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择生效开始时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required',
    },
    {
      fieldName: 'newEndTime',
      label: '生效结束时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择生效结束时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required',
    },
  ],
  showDefaultActions: false,
});

// 复制方法
const handleCopy = (row) => {
  copyDrawerApi
    .setData({
      title: '复制费率方案',
    })
    .open();
  // 填充原方案ID
  copyFormApi.setValues({ id: row.id });
};

const handleSerachShow = () => {
  drawerApi.open();
};
const handleFullShow = () => {
  screenfull.toggle();
};

// 定义组件ref，用于调用组件方法
const parkDetailDrawerRef = ref(null);


const handleDeleteSingle = async (row) => {
  try {
    // 调用删除接口
    await deleteRateSetting(row.id);
    // 提示成功
    ElMessage.success('删除成功操作已提交！');
    // 刷新表格
    await handleRefresh();
  } catch (error) {
    // 接口调用失败处理
    ElMessage.error(`删除失败：${error.msg || '请稍后重试'}`);
  }
}
</script>

<template>
  <div class="park-lot-table-new">

    <!-- 使用封装后的详情抽屉组件 -->
    <ParkDetailDrawer ref="parkDetailDrawerRef" :detail-obj="dataObj.detailObj" title="详情" />

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <CreateDrawer title="新增费率方案">
      <CreateForm />
    </CreateDrawer>

    <CopyDrawer title="复制费率方案">
      <CopyForm />
    </CopyDrawer>

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
          <IconButton content="审核" icon-name="edit" @click="handleAudit(row)" />
           <IconButton content="重新审核结算" icon-name="Check" @click="handleResetSettle(row)" />
          <IconButton content="驳回" icon-name="Close" @click="handleReject(row)"/>
          <IconButton content="结算" icon-name="Check" @click="handleSettle(row)" />
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)" />
          <IconButton content="备注" icon-name="Edit" @click="handleUpdateRemark(row)" />
          <IconButton content="删除" icon-name="delete" color="#F56C6C" @click="handleDeleteSingle(row)" />
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
