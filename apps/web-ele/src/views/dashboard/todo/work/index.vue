<!-- index.vue -->
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
// 引入封装后的详情抽屉组件
import WorkorderDetailDrawer from '#/views/dashboard/todo/work/detail.vue';

import { dataList, textObj, useFormSchema, useGridColumns } from './data';

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
  return formData.value?.id ? textObj.editText : textObj.addText;
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
    if (formDrawerApi.sharedData.payload.title === textObj.addText) {
      workorderObj.apilist.push(obj);
    } else {
      workorderObj.apilist.forEach((v, i) => {
        if (v.id === formData.value?.id) {
          workorderObj.apilist[i] = obj;
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
  exportToExcel(workorderObj.apilist, textObj.excelName, textObj.excelAllName);
}

/** 创建工单 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

/** 编辑工单 */
function handleEdit(row) {
  formDrawerApi
    .setData({
      title: textObj.editText,
      ...row,
    })
    .open();
}

async function handleDelete(row) {
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [row.workorderNo]),
  });
  try {
    workorderObj.apilist = workorderObj.apilist.filter((v) => v.id !== row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.workorderNo]));
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
    workorderObj.apilist = workorderObj.apilist.filter(
      (v) => !checkedIds.value.includes(v.id),
    );
    checkedIds.value = [];
    ElMessage.success($t('删除成功'));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}

const workorderObj = reactive({
  totalShow: false,
  detailObj: {}, // 保留详情对象用于传递给组件
  total: dataList().length,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(),
  list: [],
});

const changeTotalShow = () => {
  workorderObj.totalShow = !workorderObj.totalShow;
};

// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;

  let filteredList = workorderObj.apilist;
  if (activeName.value === '待处理') {
    filteredList = workorderObj.apilist.filter(v => v.status === '待处理');
  } else if (activeName.value === '处理中') {
    filteredList = workorderObj.apilist.filter(v => v.status === '处理中' || v.status === '已认领');
  } else if (activeName.value === '待评价') {
    filteredList = workorderObj.apilist.filter(v => v.status === '已完成' || v.evaluateStatus === '待评价');
  } else if (activeName.value === '已完成') {
    filteredList = workorderObj.apilist.filter(v => v.status === '已评价' || v.status === '已完成');
  }

  workorderObj.total = filteredList.length;
  workorderObj.list = filteredList.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  );

  return workorderObj;
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
  schema: useFormSchema().map((v) => {
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
function onSubmit() {
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
    pagerConfig: workorderObj,
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

const activeName = ref('待处理');

// 打开详情的方法
const handleOpenDetail = (row) => {
  workorderObj.detailObj = row;
  // 通过ref调用组件的open方法
  workorderDetailDrawerRef.value.open();
};

// 认领工单方法
const handleClaim = (row) => {
  const index = workorderObj.apilist.findIndex(v => v.id === row.id);
  if (index !== -1) {
    workorderObj.apilist[index].status = '已认领';
    workorderObj.apilist[index].receiveTime = new Date().toISOString().slice(0, 16).replace('T', ' ');
    workorderObj.apilist[index].executor = '当前用户';
    workorderObj.apilist[index].receiveStatus = '已认领';
    workorderObj.apilist[index].disposalProgress = '待开始';
    workorderObj.apilist[index].currentProgress = '0%';
    ElMessage.success('工单认领成功');
    handleRefresh();
  }
};

// 开始处理工单方法
const handleProcess = (row) => {
  const index = workorderObj.apilist.findIndex(v => v.id === row.id);
  if (index !== -1) {
    workorderObj.apilist[index].status = '处理中';
    workorderObj.apilist[index].disposalProgress = '处理中';
    workorderObj.apilist[index].currentProgress = '20%';
    ElMessage.success('开始处理工单');
    handleRefresh();
  }
};

// 完成工单方法
const handleComplete = (row) => {
  const index = workorderObj.apilist.findIndex(v => v.id === row.id);
  if (index !== -1) {
    workorderObj.apilist[index].status = '已完成';
    workorderObj.apilist[index].finishTime = new Date().toISOString().slice(0, 16).replace('T', ' ');
    workorderObj.apilist[index].evaluateStatus = '待评价';
    workorderObj.apilist[index].disposalProgress = '已完成';
    workorderObj.apilist[index].currentProgress = '100%';
    workorderObj.apilist[index].acceptResult = '已完成';
    ElMessage.success('工单已完成，等待评价');
    handleRefresh();
  }
};

// 评价工单方法
const handleEvaluate = (row) => {
  const index = workorderObj.apilist.findIndex(v => v.id === row.id);
  if (index !== -1) {
    workorderObj.apilist[index].evaluateStatus = '已评价';
    workorderObj.apilist[index].satisfaction = '满意';
    workorderObj.apilist[index].status = '已评价';
    workorderObj.apilist[index].archiveTime = new Date().toISOString().slice(0, 16).replace('T', ' ');
    ElMessage.success('工单评价完成');
    handleRefresh();
  }
};

const tabsData = ref([
  { label: '待处理' },
  { label: '处理中' },
  { label: '待评价' },
  { label: '已完成' },
]);

const createLabel = (item) => {
  let count = 0;
  if (item.label === '待处理') {
    count = workorderObj.apilist.filter((v) => v.status === '待处理').length;
  } else if (item.label === '处理中') {
    count = workorderObj.apilist.filter((v) => v.status === '处理中' || v.status === '已认领').length;
  } else if (item.label === '待评价') {
    count = workorderObj.apilist.filter((v) => v.status === '已完成' || v.evaluateStatus === '待评价').length;
  } else if (item.label === '已完成') {
    count = workorderObj.apilist.filter((v) => v.status === '已评价' || v.status === '已完成').length;
  }
  return `${item.label}(${count})`;
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

const arrowChange = () => {
  emit('arrow-change');
};

// 定义组件ref，用于调用组件方法
const workorderDetailDrawerRef = ref(null);
</script>

<template>
                                    <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <!-- 使用封装后的详情抽屉组件 -->
    <WorkorderDetailDrawer
      ref="workorderDetailDrawerRef"
      :detail-obj="workorderObj.detailObj"
      :title="`工单详情 - ${workorderObj.detailObj.workorderNo}`"
    />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>
    <Grid>
      <!-- 三级状态 -->
      <template #table-title>
        <div class="tabel-tabs">
          <div v-if="props.secondShow">
            <el-tabs
              v-model="activeName"
              class="demo-tabs"
              @tab-change="handleClick"
            >
              <el-tab-pane
                v-for="item in tabsData"
                :key="item.label"
                :label="createLabel(item)"
                :name="item.label"
              />
            </el-tabs>
          </div>
        </div>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新建工单" icon-name="Plus" @click="handleCreate" />
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExport"
          />
          <IconButton
            v-if="activeName === '待处理'"
            content="批量认领"
            icon-name="check"
            color="#67C23A"
            :disabled="isEmpty(checkedIds)"
            @click="handleClaim"
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
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
        </div>
      </template>
      <template #workorderNo="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.workorderNo }}
        </el-text>
      </template>
      <template #emergencyDegree="{ row }">
        <el-tag
          :type="row.emergencyDegree === '紧急' ? 'danger' :
                 row.emergencyDegree === '高' ? 'warning' :
                 row.emergencyDegree === '中' ? 'primary' : 'info'"
          size="small"
        >
          {{ row.emergencyDegree }}
        </el-tag>
      </template>
      <template #progress="{ row }">
        <div v-if="row.currentProgress && row.currentProgress !== '待处理'">
          <el-progress
            :percentage="row.currentProgress.includes('%') ? parseInt(row.currentProgress) : 0"
            :show-text="false"
            :stroke-width="6"
          />
          <span style="font-size: 12px;">{{ row.currentProgress }}</span>
        </div>
        <span v-else>{{ row.currentProgress || '-' }}</span>
      </template>
      <template #status="{ row }">
        <el-tag
          :type="row.status === '待处理' ? 'info' :
                 row.status === '已认领' ? 'primary' :
                 row.status === '处理中' ? 'warning' :
                 row.status === '已完成' ? 'success' :
                 row.status === '已评价' ? 'success' :
                 row.status === '已撤回' ? 'danger' : 'warning'"
          size="small"
        >
          {{ row.status }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
          <IconButton
            v-if="activeName === '待处理' && row.status === '待处理'"
            content="认领"
            icon-name="check"
            color="#67C23A"
            @click="handleClaim(row)"
          />
          <IconButton
            v-if="activeName === '待处理' && row.status === '已认领'"
            content="处理"
            icon-name="play-circle"
            color="#409EFF"
            @click="handleProcess(row)"
          />
          <IconButton
            v-if="(activeName === '处理中') && row.status === '处理中'"
            content="完成"
            icon-name="check-circle"
            color="#67C23A"
            @click="handleComplete(row)"
          />
          <IconButton
            v-if="activeName === '待评价' && row.evaluateStatus === '待评价'"
            content="评价"
            icon-name="star"
            color="#E6A23C"
            @click="handleEvaluate(row)"
          />
          <IconButton
            v-if="row.status === '待处理' || row.status === '已认领'"
            content="编辑"
            icon-name="edit"
            @click="handleEdit(row)"
          />
          <IconButton
            v-if="row.status === '待处理'"
            content="删除"
            icon-name="delete"
            color="#F56C6C"
            @click="handleDelete(row)"
          />
        </div>
      </template>
      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon" v-if="!workorderObj.totalShow">
            <ArrowDown />
          </el-icon>
          <el-icon class="tabel-tab-icon" v-if="workorderObj.totalShow">
            <ArrowUp />
          </el-icon>
          <span> 本页统计：工单数量{{ workorderObj.list.length }};
            待处理: {{ workorderObj.list.filter(v => v.status === '待处理').length }};
            处理中: {{ workorderObj.list.filter(v => v.status === '处理中' || v.status === '已认领').length }};
            </span>
        </div>
        <div class="common-total-bottom" v-if="workorderObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
