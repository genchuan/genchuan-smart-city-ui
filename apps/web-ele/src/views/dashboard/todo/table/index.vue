<!-- index.vue 内部-->
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
import TaskDetailDrawer from '#/views/dashboard/todo/table/detail.vue';

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
    if (formDrawerApi.sharedData.payload.title === textObj.addText) {
      taskObj.apilist.push(obj);
    } else {
      taskObj.apilist.forEach((v, i) => {
        if (v.id === formData.value?.id) {
          taskObj.apilist[i] = obj;
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
  exportToExcel(taskObj.apilist, textObj.excelName, textObj.excelAllName);
}

/** 创建任务 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

/** 编辑任务 */
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
    text: $t('ui.actionMessage.deleting', [row.taskName]),
  });
  try {
    taskObj.apilist = taskObj.apilist.filter((v) => v.id !== row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.taskName]));
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
    taskObj.apilist = taskObj.apilist.filter(
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

const taskObj = reactive({
  totalShow: false,
  detailObj: {}, // 保留详情对象用于传递给组件
  total: dataList().length,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(),
  list: [],
});

const changeTotalShow = () => {
  taskObj.totalShow = !taskObj.totalShow;
};

// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;

  let filteredList = taskObj.apilist;
  if (activeName.value === '待处理') {
    filteredList = taskObj.apilist.filter(v => v.taskStatus === '待处理');
  } else if (activeName.value === '处理中') {
    filteredList = taskObj.apilist.filter(v => v.taskStatus === '处理中');
  } else if (activeName.value === '已完成') {
    filteredList = taskObj.apilist.filter(v => v.taskStatus === '已完成');
  } else if (activeName.value === '我发起的') {
    filteredList = taskObj.apilist.filter(v => v.taskStatus !== '我发起的');
  }

  taskObj.total = filteredList.length;
  taskObj.list = filteredList.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  );

  return taskObj;
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
    pagerConfig: taskObj,
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
// 修改打开详情的方法，调用组件的open方法
const handleOpenDetail = (row) => {
  taskObj.detailObj = row;
  // 通过ref调用组件的open方法
  taskDetailDrawerRef.value.open();
  console.log(row);
};

const tabsData = ref([
  { label: '待处理' },
  { label: '处理中' },
  { label: '已完成' },
  { label: '我发起的' },
  { label: '全部任务' },
]);

const createLabel = (item) => {
  let count = 0;
  if (item.label === '待处理') {
    count = taskObj.apilist.filter((v) => v.taskStatus === '待处理').length;
  } else if (item.label === '处理中') {
    count = taskObj.apilist.filter((v) => v.taskStatus === '处理中').length;
  } else if (item.label === '已完成') {
    count = taskObj.apilist.filter((v) => v.taskStatus === '已完成').length;
  } else if (item.label === '我发起的') {
    count = taskObj.apilist.filter((v) => v.initiator !== '我发起的').length;
  } else if (item.label === '全部任务') {
    count = taskObj.apilist.length;
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
const taskDetailDrawerRef = ref(null);
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <!-- 使用封装后的详情抽屉组件 -->
    <TaskDetailDrawer
      ref="taskDetailDrawerRef"
      :detail-obj="taskObj.detailObj"
      :title="`任务详情 - ${taskObj.detailObj.taskName}`"
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
          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
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
      <template #taskName="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.taskName }}
        </el-text>
      </template>
      <template #priority="{ row }">
        <el-tag
          :type="row.priority === '紧急' ? 'danger' :
                 row.priority === '高' ? 'warning' :
                 row.priority === '中' ? 'primary' : 'info'"
          size="small"
        >
          {{ row.priority }}
        </el-tag>
      </template>
      <template #progress="{ row }">
        <div v-if="row.currentProgress && row.currentProgress !== '待处理'">
          <el-progress
            :percentage="parseInt(row.currentProgress)"
            :show-text="false"
            :stroke-width="6"
          />
          <span style="font-size: 12px;">{{ row.currentProgress }}</span>
        </div>
        <span v-else>{{ row.currentProgress || '-' }}</span>
      </template>
      <template #taskStatus="{ row }">
        <el-tag
          :type="row.taskStatus === '待处理' ? 'info' :
                 row.taskStatus === '处理中' ? 'primary' :
                 row.taskStatus === '已完成' ? 'success' :
                 row.taskStatus === '已撤回' ? 'danger' : 'warning'"
          size="small"
        >
          {{ row.taskStatus }}
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
            content="编辑"
            icon-name="edit"
            @click="handleEdit(row)"
          />
          <IconButton
            content="删除"
            icon-name="delete"
            color="#F56C6C"
            @click="handleDelete(row)"
          />
        </div>
      </template>
      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon" v-if="!taskObj.totalShow">
            <ArrowDown />
          </el-icon>
          <el-icon class="tabel-tab-icon" v-if="taskObj.totalShow">
            <ArrowUp />
          </el-icon>
          <span> 本页统计：任务数量{{ taskObj.list.length }};
            待处理: {{ taskObj.list.filter(v => v.taskStatus === '待处理').length }};
            处理中: {{ taskObj.list.filter(v => v.taskStatus === '处理中').length }};
            </span>
        </div>
        <div class="common-total-bottom" v-if="taskObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
