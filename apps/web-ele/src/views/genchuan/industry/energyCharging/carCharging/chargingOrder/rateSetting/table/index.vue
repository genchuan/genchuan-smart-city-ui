<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getRateSettingList, exporRateSettingExcel, deleteRateSetting, createRateSetting, updateRateSetting, enableRateSetting, disableRateSetting, copyRateSetting } from '#/api/genchuan/industry/energyCharging/carCharging/chargingOrder/rateSetting/index.js';
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
  const data = await exporRateSettingExcel();
  downloadFileFromBlobPart({
    fileName: '费率方案.xls',
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



  const data = await getRateSettingList(getParams);
  dataObj.total = data.total;
  dataObj.list = data.list.map((v) => {
    return {
      ...v,
      effectTime: formatTimestamp(v.effectTime),
      expireTime: formatTimestamp(v.expireTime),
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

      // 校验生效时间必须早于失效时间
      if (formData.effectTime && formData.expireTime) {
        if (new Date(formData.effectTime) >= new Date(formData.expireTime)) {
          ElMessage.error('生效时间必须早于失效时间');
          return;
        }
      }

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



      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="生效" icon-name="Check" @click="handleEnable" :disabled="isEmpty(checkedIds)" />
          <IconButton content="失效" icon-name="Close" @click="handleDisable" :disabled="isEmpty(checkedIds)" />
          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
          <IconButton content="导出" icon-name="download" @click="handleExport" />
          <IconButton content="批量删除" icon-name="delete" color="#F56C6C" :disabled="isEmpty(checkedIds)"
            @click="handleDeleteBatch" />
          <IconButton content="搜索" icon-name="search" @click="handleSerachShow" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <template #rateCode="{ row }">
        <el-text @click="handleOpenDetail(row)" class="common-align" type="primary">
          {{ row.rateCode }}
        </el-text>
      </template>



      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="复制" icon-name="document" @click="handleCopy(row)" />
          <IconButton content="生效" icon-name="Check" @click="handleRowEnable(row)"
            :disabled="row.rateStatus === '已生效'" />
          <IconButton content="失效" icon-name="Close" @click="handleRowDisable(row)"
            :disabled="row.rateStatus === '已失效'" />
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)" />
          <IconButton content="编辑" icon-name="edit" @click="handleUpdate(row)" />
          <IconButton content="删除" icon-name="delete" color="#F56C6C" @click="handleDeleteSingle(row)" />
        </div>
      </template>

      <template #bottom>
        <div class="common-total" @click="changeTotalShow"></div>
      </template>
    </Grid>
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
</style>
