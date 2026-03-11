<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';
import IconButton from '#/components/common/IconButton.vue';
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';

import { dataList, useFormSchema, useGridColumns } from './data';
// 引入封装后的详情抽屉组件
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
});
const emit = defineEmits(['arrow-change']);

const getTitle = computed(() => {
  return formData.value?.id ? '编辑' : '新增';
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
  onConfirm() {
    const obj = formApi.form.values;
    if (formDrawerApi.sharedData.payload.title === '新增') {
      dataObj.apilist.push(obj);
    } else {
      dataObj.apilist.forEach((v, i) => {
        if (v.id === formData.value?.id) {
          dataObj.apilist[i] = obj;
        }
      });
    }
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

/** 导出表格 */
async function handleExport() {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  exportToExcel(dataObj.apilist, `窨井盖设施待处置预警_${dateStr}`, 'excel');
}

/** 创建角色 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: '新增',
    })
    .open();
}

/** 编辑角色 */
function handleEdit(row) {
  formDrawerApi
    .setData({
      title: '编辑',
      ...row,
    })
    .open();
}
async function handleDelete(row) {
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [row.name]),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter((v) => v.id !== row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.name]));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

async function handleDeleteBatch() {
  await confirm($t('确定删除这些数据吗？'));
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deletingBatch'),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter(
      (v) => !checkedIds.value.includes(v.id),
    );
    checkedIds.value = [];
    ElMessage.success($t('删除成功'));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

/** 确认预警有效 */
async function handleConfirmValid(row) {
  await confirm('确定确认该预警有效吗？');
  const loadingInstance = ElLoading.service({
    text: '确认中...',
  });
  try {
    // 模拟确认有效
    row.assignStatus = '待派单';
    ElMessage.success('确认有效成功');
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

/** 标注预警无效 */
async function handleMarkInvalid(row) {
  await confirm('确定标注该预警无效吗？');
  const loadingInstance = ElLoading.service({
    text: '标注中...',
  });
  try {
    // 模拟标注无效
    row.assignStatus = '已驳回';
    ElMessage.success('标注无效成功');
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

/** 派发处置单 */
async function handleDispatchOrder(row) {
  await confirm('确定派发处置单吗？');
  const loadingInstance = ElLoading.service({
    text: '派发中...',
  });
  try {
    // 模拟派发处置单
    row.assignStatus = '已派单';
    ElMessage.success('派发处置单成功');
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

/** 批量确认无效预警 */
async function handleBatchInvalid() {
  await confirm(`确定批量确认选中的 ${checkedIds.value.length} 个预警无效吗？`);
  const loadingInstance = ElLoading.service({
    text: '处理中...',
  });
  try {
    // 模拟批量操作
    dataObj.apilist.forEach(item => {
      if (checkedIds.value.includes(item.id)) {
        item.assignStatus = '已驳回';
      }
    });
    ElMessage.success('批量确认无效成功');
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}
const dataObj = reactive({
  totalShow: false,
  detailObj: {}, // 保留详情对象用于传递给组件
  total: dataList().length,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(),
  list: [],
});
const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};
// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;
  // 先过滤数据
  let filteredData = dataObj.apilist
    .map((v) => v)
    .filter((v) => {
      // 状态筛选
      if (activeName.value !== '全部' && v.assignStatus !== activeName.value) {
        return false;
      }
      
      // 搜索表单筛选
      if (searchFormData.value.coverNo && !v.coverNo.includes(searchFormData.value.coverNo)) {
        return false;
      }
      if (searchFormData.value.roadName && !v.roadName.includes(searchFormData.value.roadName)) {
        return false;
      }
      if (searchFormData.value.abnormalType && v.abnormalType !== searchFormData.value.abnormalType) {
        return false;
      }
      if (searchFormData.value.riskLevel && v.riskLevel !== searchFormData.value.riskLevel) {
        return false;
      }
      
      return true;
    });
  
  // 高风险预警置顶
  filteredData.sort((a, b) => {
    if (a.riskLevel === '高风险' && b.riskLevel !== '高风险') return -1;
    if (a.riskLevel !== '高风险' && b.riskLevel === '高风险') return 1;
    return 0;
  });
  
  dataObj.total = filteredData.length;
  dataObj.list = filteredData
    .slice(
      (page.currentPage - 1) * page.pageSize,
      page.currentPage * page.pageSize,
    );
  return dataObj;
};

// 搜索表单数据
const searchFormData = ref({});

const [QueryForm] = useVbenForm({
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
  schema: [
    {
      fieldName: 'coverNo',
      label: '井盖编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入井盖编号',
        maxLength: 50,
      },
      labelWidth: '100',
    },
    {
      fieldName: 'roadName',
      label: '路段名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入路段名称',
        maxLength: 100,
      },
      labelWidth: '100',
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '倾斜角度异常', value: '倾斜角度异常' },
          { label: '振动异常', value: '振动异常' },
          { label: '设备离线', value: '设备离线' },
          { label: '设备异常', value: '设备异常' },
          { label: '轻微倾斜', value: '轻微倾斜' },
        ],
        placeholder: '请选择异常类型',
        showSearch: true,
      },
      fieldName: 'abnormalType',
      label: '异常类型',
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '高风险', value: '高风险' },
          { label: '中风险', value: '中风险' },
          { label: '低风险', value: '低风险' },
        ],
        placeholder: '请选择安全风险等级',
        showSearch: true,
      },
      fieldName: 'riskLevel',
      label: '安全风险等级',
    },
  ],
  // 是否可展开
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});
// 搜索表单查询
function onSubmit() {
  searchFormData.value = formApi.form.values;
  handleRefresh();
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

const activeName = ref('全部');
// 修改打开详情的方法，调用组件的open方法
const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  // 通过ref调用组件的open方法
  parkDetailDrawerRef.value.open();
  console.log(row);
};
const tabsData = ref([
  { label: '全部' },
  { label: '未派单' },
  { label: '已派单' },
  { label: '已接单' },
  { label: '已完成' },
  { label: '已驳回' },
]);
const createLabel = (item) => {
  let text = `(${dataObj.apilist.filter((v) => v.assignStatus === item.label).length})`;
  if (item.label === '全部') {
    text = `(${dataObj.apilist.length})`;
  }
  return item.label + text;
};
const handleClick = () => {
  gridApi.query();
};
const handleSerachShow = () => {
  drawerApi.open();
};
const handleFullShow = () => {
  screenfull.toggle();
};

// 定义组件ref，用于调用组件方法
const parkDetailDrawerRef = ref(null);

const arrowChange = () => {
  emit('arrow-change');
};
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <!-- 使用封装后的详情抽屉组件 -->
    <ParkDetailDrawer
      ref="parkDetailDrawerRef"
      :detail-obj="dataObj.detailObj"
    />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>
    <Grid>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="筛选" icon-name="Filter" @click="handleSerachShow" />
          <IconButton content="刷新预警" icon-name="Refresh" @click="handleRefresh" />
          <IconButton content="手动触发预警" icon-name="Plus" @click="handleCreate" />
          <IconButton content="批量确认无效预警" icon-name="Close" color="#F56C6C" :disabled="isEmpty(checkedIds)" @click="handleBatchInvalid" />
          <IconButton content="导出预警数据" icon-name="download" @click="handleExport" />
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
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
      <template #coverNo="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.coverNo }}
        </el-text>
      </template>
      <template #roadName="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.roadName }}
        </el-text>
      </template>
      <template #abnormalType="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.abnormalType }}
        </el-text>
      </template>
      <template #openStatus="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.openStatus }}
        </el-text>
      </template>
      <template #dealLimit="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.dealLimit }}
        </el-text>
      </template>
      <template #assignStatus="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.assignStatus }}
        </el-text>
      </template>
      <template #riskLevel="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.riskLevel }}
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
            @click="handleConfirmValid(row)"
          />
          <IconButton
            content="标注无效"
            icon-name="Close"
            @click="handleMarkInvalid(row)"
          />
          <IconButton
            content="派发处置单"
            icon-name="Send"
            @click="handleDispatchOrder(row)"
          />
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
