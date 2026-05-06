<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';

import {
  ElDialog,
  ElImage,
  ElLoading,
  ElMessage,
  ElOption,
  ElSelect,
} from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
// 新增：引入企业列表接口（需根据实际项目路径调整）
import {
  createReviewLedger,
  getEnterpriseList,
  // 新增：引入获取复审台账详情接口
  getReviewLedgerDetail,
  getWarnList,
} from '#/api/genchuan/industry/marketsupervision/index.js';
import {
  createParkLot,
  deleteParkLot,
  updateParkLot,
} from '#/api/genchuan/industry/park/index.js';
import { $t } from '#/locales'; 
import { formatTimestamp } from '#/utils';
import { exportToExcel } from '#/utils/excel.js';

import { useFormSchema, useGridColumns } from './data';
// 引入封装后的详情抽屉组件
import Detail from './detail.vue';
import fuDetail from './fuDetail.vue';

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
  schema: useFormSchema(),
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
      ? createParkLot(obj)
      : updateParkLot({ ...dataObj.editObj, ...obj }));
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
  exportToExcel(dataObj.apilist, '数据导出', '数据导出');
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
    await deleteParkLot(row.id);
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
  fuDetailObj: {}, // 新增：复审台账详情对象
  total: 0,
  currentPage: 1,
  pageSize: 10,
  apilist: [],
  imgUrl: '',
  serachObj: {},
  list: [],
  editObj: {},
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
  const data = await getWarnList(getParams);
  dataObj.total = data.total;
  dataObj.list = data.list.map((v) => {
    return {
      ...v,
      alertCreateTime: formatTimestamp(v.alertCreateTime),
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
    .filter((v) => !v.searchFilter)
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

// 图片预览弹窗
const previewDialogVisible = ref(false);
const previewImageUrl = ref('');

const handlePreviewImage = (url) => {
  previewImageUrl.value = url;
  previewDialogVisible.value = true;
};

const activeName = ref('');
// 修改打开详情的方法，调用组件的open方法
const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  // 通过ref调用组件的open方法
  parkDetailDrawerRef.value.open();
  console.log(row);
};

// ========== 新增：打开复审台账详情抽屉方法 ==========
// 定义复审台账详情组件ref
const fuDetailDrawerRef = ref(null);

// 打开复审台账详情抽屉
const handleOpenFuDetail = async (row) => {
  try {
    const loadingInstance = ElLoading.service({
      text: '加载复审台账详情中...',
    });

    // 1. 调用接口获取复审台账详情数据
    // 传入告警ID作为查询条件（根据实际接口参数调整）
    const detailData = await getReviewLedgerDetail(
      row.id, // 告警ID
    );

    // 2. 将详情数据赋值给fuDetailObj
    dataObj.fuDetailObj = detailData || {};

    // 3. 调用复审台账详情组件的open方法打开抽屉
    fuDetailDrawerRef.value.open();

    loadingInstance.close();
  } catch (error) {
    ElMessage.error('加载复审台账详情失败，请重试');
    console.error('加载复审台账详情失败：', error);
  }
};
// ========== 复审台账详情方法结束 ==========

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

// ========== 新增：企业选择弹窗相关逻辑 ==========
// 弹窗显示状态
const enterpriseDialogVisible = ref(false);
// 选中的企业ID
const selectedEnterpriseId = ref('');
// 企业列表数据
const enterpriseList = ref([]);
// 企业搜索关键词
const enterpriseSearchKey = ref('');
// 当前操作的行数据
const currentRow = ref(null);

// 获取企业列表
const fetchEnterpriseList = async () => {
  try {
    const loadingInstance = ElLoading.service({
      text: '加载企业列表中...',
    });
    // 调用企业列表接口（可传入搜索参数）
    const res = await getEnterpriseList({
      pageNo: 1,
      pageSize: 100, // 加载足够多的企业数据
    });
    enterpriseList.value = res.list || [];
    loadingInstance.close();
  } catch (error) {
    ElMessage.error('企业列表加载失败，请重试');
    console.error('加载企业列表失败：', error);
  }
};

// 打开企业选择弹窗
const addDetail = (row) => {
  // 保存当前行数据
  currentRow.value = row;
  // 重置选中状态和搜索关键词
  selectedEnterpriseId.value = '';
  enterpriseSearchKey.value = '';
  // 打开弹窗
  enterpriseDialogVisible.value = true;
  // 加载企业列表
  fetchEnterpriseList();
};

// 企业搜索
const handleEnterpriseSearch = () => {
  fetchEnterpriseList();
};

// 提交企业选择（生成复审台账）
const submitEnterpriseSelect = async () => {
  if (!selectedEnterpriseId.value) {
    ElMessage.warning('请选择关联企业');
    return;
  }

  try {
    const loadingInstance = ElLoading.service({
      text: '生成复审台账中...',
    });

    // ========== 核心逻辑：调用生成复审台账接口 ==========
    const res = await createReviewLedger({
      aiAlertMessageId: currentRow.value.id, // 告警ID
      entId: selectedEnterpriseId.value, // 选中的企业ID
    });

    ElMessage.success('复审台账生成成功');
    loadingInstance.close();
    // 关闭弹窗
    enterpriseDialogVisible.value = false;
    // 刷新表格数据
    handleRefresh();
  } catch (error) {
    ElMessage.error('复审台账生成失败，请重试');
    console.error('生成复审台账失败：', error);
  }
};

// 取消企业选择
const cancelEnterpriseSelect = () => {
  enterpriseDialogVisible.value = false;
  selectedEnterpriseId.value = '';
  enterpriseSearchKey.value = '';
};
// ========== 企业选择弹窗逻辑结束 ==========
</script>

<template>
  <div class="park-lot-table-new">
    <ElDialog v-model="dialogVisible">
      <div class="park-img-center">
        <img style="width: 100%; height: 100%" :src="dataObj.imgUrl" />
      </div>
    </ElDialog>

    <!-- ========== 新增：企业选择弹窗 ========== -->
    <ElDialog
      v-model="enterpriseDialogVisible"
      title="生成复审台账 - 选择关联企业"
      width="500px"
      @close="cancelEnterpriseSelect"
    >
      <div class="enterprise-select-container">
        <!-- 企业选择器 -->
        <div class="enterprise-select">
          <ElSelect
            v-model="selectedEnterpriseId"
            placeholder="请选择关联企业"
            filterable
            clearable
            style="width: 100%"
          >
            <ElOption
              v-for="item in enterpriseList"
              :key="item.id"
              :label="item.entName"
              :value="item.id"
            >
              <!-- 可选：显示企业ID和名称 -->
              <span>{{ item.entName }}</span>
              <span style="float: right; color: #8492a6; font-size: 12px">
                ID: {{ item.id }}
              </span>
            </ElOption>
          </ElSelect>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelEnterpriseSelect">取消</el-button>
          <el-button type="primary" @click="submitEnterpriseSelect">
            确认生成
          </el-button>
        </div>
      </template>
    </ElDialog>
    <!-- ========== 企业选择弹窗结束 ========== -->

    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <!-- 使用封装后的详情抽屉组件 -->
    <Detail
      ref="parkDetailDrawerRef"
      :detail-obj="dataObj.detailObj"
      title="详情"
    />
    <fuDetail
      ref="fuDetailDrawerRef"
      :detail-obj="dataObj.fuDetailObj"
      title="复审台账详情"
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
                :name="item.value"
              />
            </el-tabs>
          </div>
        </div>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <!-- <IconButton
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
          /> -->
          <IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
        </div>
      </template>
      <template #userIds="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.userIds }}
        </el-text>
      </template>
      <template #driveInPhoto="{ row }">
        <ElImage
          style="width: 100px; height: 100px"
          :src="row.driveInPhoto"
          @click="openImg(row.driveInPhoto)"
        />
      </template>
      <template #srcUrl="{ row }">
        <div class="image-item">
            <img :src="row.srcUrl" :alt="row.srcUrl" @click="handlePreviewImage(row.srcUrl)" style="cursor: pointer;" />
        </div> 
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
          <!-- <IconButton
            content="生成复审台账"
            icon-name="Plus"
            @click="addDetail(row)"
          />
          <IconButton
            content="查看复审台账记录"
            icon-name="View"
            @click="handleOpenFuDetail(row)"
          /> -->
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
          <!-- <IconButton
            content="删除"
            icon-name="delete"
            color="#F56C6C"
            @click="handleDelete(row)"
          /> -->
        </div>
      </template>
      <template #bottom>
        <div class="common-total" @click="changeTotalShow"></div>
      </template>
    </Grid>

    <!-- 图片预览弹窗 -->
    <ElDialog v-model="previewDialogVisible" title="图片预览" width="800px" append-to-body>
      <ElImage :src="previewImageUrl" fit="contain" style="width: 100%; height: 600px;" />
    </ElDialog>
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

/* 企业选择弹窗样式 */
.enterprise-select-container {
  padding: 10px 0;
}
.image-item {
  width: 150px;
  height:50px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid #eee;
}

.image-item img {
  width: 80%;
  height: 80%;
  object-fit: cover;
}
.enterprise-search {
  margin-bottom: 8px;
}

.dialog-footer {
  text-align: right;
}
</style>
