<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import { ElImage, ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  addNotice,
  deleteNotice,
  exporNoticeExcel,
  getNoticeList,
  sendRectificationNotice,
  updateNotice,
} from '#/api/genchuan/industry/marketsupervision/index.js';
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
  schema: useFormSchema().filter((v) => v.isEdit),
  showDefaultActions: false,
});
const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    formDrawerApi.close();
  },
  async onConfirm() {
    const obj = formApi.form.values;
    await (formDrawerApi.sharedData.payload.title === '增加'
      ? addNotice(obj)
      : updateNotice({ ...dataObj.editObj, ...obj }));
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
  const data = await exporNoticeExcel();
  downloadFileFromBlobPart({
    fileName: '整改通知书.xls',
    source: data,
  });
}

/** 创建角色 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: '增加',
    })
    .open();
}

/** 编辑角色 */
function handleEdit(row) {
  dataObj.editObj = row;
  formDrawerApi
    .setData({
      title: '编辑',
      ...row,
    })
    .open();
}
async function handleDelete(row) {
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting'),
  });
  try {
    await deleteNotice(row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess'));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

async function handleDeleteBatch() {
  await confirm($t('确定删除这些数据吗？')).then(() => {
    checkedIds.value.forEach(async (v) => {
      await handleDelete({
        id: v,
      });
    });
  });
  handleRefresh();
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
  apilist: [],
  imgUrl: '',
  serachObj: {},
  list: [],
  editObj: {},
  batchViewData: [], // 新增：批量查看的数据列表
  batchViewVisible: false, // 新增：批量查看弹窗显示状态
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
  const data = await getNoticeList(getParams);
  dataObj.total = data.total;
  dataObj.list = data.list.map((v) => {
    return {
      ...v,
      issueTime: formatTimestamp(v.issueTime),
      receiveTime: formatTimestamp(v.receiveTime),
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

const activeName = ref('');
// 修改打开详情的方法，调用组件的open方法
const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  // 通过ref调用组件的open方法
  parkDetailDrawerRef.value.open();
  console.log(row);
};
const tabsData = ref([
  { label: '全部', value: '' },
  { label: '月租车', value: '1' },
  { label: '临时车', value: '0' },
]);
const createLabel = (item) => {
  return item.label;
};
const handleClick = () => {
  dataObj.serachObj.plateType = activeName.value;
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
const dialogVisible = ref(false);
const openImg = (url) => {
  dataObj.imgUrl = url;
  dialogVisible.value = true;
};
// 控制弹窗显示/隐藏
const dialogVisibleSend = ref(false);
const rowObj = ref({});
// 点击按钮触发弹窗显示
const handleSend = (row) => {
  dialogVisibleSend.value = true;
  rowObj.value = row;
};

// 弹窗关闭前的回调（可选，用于处理强制关闭的情况）
const handleClose = (done) => {
  dialogVisibleSend.value = false;
  done();
};

// 确认送达的核心逻辑
const confirmSend = async () => {
  try {
    // 这里替换为你实际的送达接口调用逻辑
    await sendRectificationNotice({
      rectifyNoticeId: rowObj.value.id,
    });
    console.log('整改通知书已送达');

    // 提示操作成功
    ElMessage({
      type: 'success',
      message: '整改通知书送达成功！',
    });

    // 关闭弹窗
    dialogVisibleSend.value = false;

    // 可添加后续操作，比如刷新列表、跳转页面等
  } catch (error) {
    // 异常处理
    ElMessage({
      type: 'error',
      message: `送达失败：${error.message || '请稍后重试'}`,
    });
  }
};
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>

    <!-- 使用封装后的详情抽屉组件 -->
    <ParkDetailDrawer
      class="genchuan-detail-drawer"
      ref="parkDetailDrawerRef"
      :detail-obj="dataObj.detailObj"
      title="详情"
    />

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>
    <el-dialog
      title="确认送达整改通知书"
      v-model="dialogVisibleSend"
      width="400px"
      :before-close="handleClose"
    >
      <span>你确定要送达整改通知书吗？此操作一经确认将无法撤回。</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisibleSend = false">取消</el-button>
          <el-button type="primary" @click="confirmSend">确认送达</el-button>
        </span>
      </template>
    </el-dialog>
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
                :name="item.value"
              />
            </el-tabs>
          </div>
        </div>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <!-- <IconButton content="新增" icon-name="Plus" @click="handleCreate" /> -->
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

      <template #noticeCode="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.noticeCode }}
        </el-text>
      </template>

      <template #driveInPhoto="{ row }">
        <ElImage
          style="width: 100px; height: 100px"
          :src="row.driveInPhoto"
          @click="openImg(row.driveInPhoto)"
        />
      </template>

      <template #driveOutPhoto="{ row }">
        <ElImage
          style="width: 100px; height: 100px"
          :src="row.driveOutPhoto"
          @click="openImg(row.driveOutPhoto)"
        />
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="送达整改通知书"
            icon-name="Plus"
            @click="handleSend(row)"
          />
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
        <div class="common-total" @click="changeTotalShow"></div>
      </template>
    </Grid>
  </div>
</template>

<style scoped>
.park-img-center {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 700px;
  height: 700px;
}

/* 批量查看表格样式优化 */
:deep(.el-table) {
  --el-table-header-text-color: #303133;
  --el-table-row-hover-bg-color: #f5f7fa;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

/* 证据列表样式 */
.evidence-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  padding: 8px 0;
}

.evidence-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.evidence-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.evidence-name {
  font-size: 12px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.evidence-type {
  font-size: 11px;
  color: #999;
}

.no-evidence {
  color: #999;
  font-size: 12px;
  text-align: center;
  padding: 8px 0;
}
</style>
