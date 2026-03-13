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

// 搜索表单数据
const searchFormData = ref({});

// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;
  // 先过滤数据
  let filteredData = dataObj.apilist
    .map((v) => v)
    .filter((v) => {
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
      if (searchFormData.value.processStatus && v.processStatus !== searchFormData.value.processStatus) {
        return false;
      }
      
      return true;
    });
  
  // 高风险工单置顶
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
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '待处置', value: '待处置' },
          { label: '前往现场', value: '前往现场' },
          { label: '现场处置', value: '现场处置' },
          { label: '处置中', value: '处置中' },
        ],
        placeholder: '请选择当前进度',
        showSearch: true,
      },
      fieldName: 'processStatus',
      label: '当前进度',
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
  gridApi.query();
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
      keyField: 'orderNo',
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

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.orderNo);
}

// 修改打开详情的方法，调用组件的open方法
const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  // 通过ref调用组件的open方法
  parkDetailDrawerRef.value.open();
  console.log(row);
};

// 更新进度
const handleUpdateProgress = (row) => {
  ElMessage.info('更新进度功能开发中');
};

// 上传资料
const handleUploadMaterial = (row) => {
  ElMessage.info('上传资料功能开发中');
};

// 超时督办
const handleOvertimeSupervision = (row) => {
  ElMessage.info('超时督办功能开发中');
};

// 批量提醒
const handleBatchRemind = async () => {
  await confirm(`确定向选中的 ${checkedIds.value.length} 个工单运维员发送提醒吗？`);
  const loadingInstance = ElLoading.service({
    text: '发送提醒中...',
  });
  try {
    // 模拟批量提醒
    ElMessage.success('批量提醒发送成功');
  } finally {
    loadingInstance.close();
  }
};

// 调整派单对象
const handleAdjustAssign = () => {
  ElMessage.info('调整派单对象功能开发中');
};

// 导出工单数据
async function handleExport() {
  const fileName = `窨井盖设施处置中工单_${new Date().toISOString().split('T')[0]}`;
  exportToExcel(dataObj.apilist, fileName, 'excel');
}

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
          <IconButton content="刷新工单" icon-name="Refresh" @click="gridApi.query" />
          <IconButton content="批量提醒" icon-name="Bell" :disabled="isEmpty(checkedIds)" @click="handleBatchRemind" />
          <IconButton content="调整派单对象" icon-name="UserFilled" @click="handleAdjustAssign" />
          <IconButton content="导出工单数据" icon-name="download" @click="handleExport" />
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
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
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
          <IconButton
            content="更新进度"
            icon-name="Refresh"
            @click="handleUpdateProgress(row)"
          />
          <IconButton
            content="上传资料"
            icon-name="Upload"
            @click="handleUploadMaterial(row)"
          />
          <IconButton
            content="超时督办"
            icon-name="Warning"
            color="#F56C6C"
            @click="handleOvertimeSupervision(row)"
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
          <span> 全部统计：{{ dataObj.total }}条 </span>
        </div>
      </template>
    </Grid>
  </div>
</template>

