<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer, useVbenModal } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  addNotice,
  deleteNotice,
  downLoadPdf,
  exporCFReviewPDF,
  exporpunishReviewExcel,
  getPunishPage,
  getReasonList,
  punishFile,
  sendIssue,
  sendledgerReason,
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
let isRedArray = [];
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
  const data = await exporpunishReviewExcel();
  downloadFileFromBlobPart({
    fileName: '处罚通知书.xls',
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
  isRedArray = [];
  const getParams = {
    pageNo: pageObj.page.currentPage,
    pageSize: pageObj.page.pageSize,
    ...dataObj.serachObj,
  };
  const data = await getPunishPage(getParams);
  dataObj.total = data.total;
  dataObj.list = data.list.map((v) => {
    return {
      ...v,
      oldcreateTime: v.createTime,
      paymentDeadlineTime: formatTimestamp(v.paymentDeadlineTime),
      draftTime: formatTimestamp(v.draftTime),
      reviewTime: formatTimestamp(v.reviewTime),
      cancelTime: formatTimestamp(v.cancelTime),
      createTime: formatTimestamp(v.createTime),
    };
  });
  dataObj.list.forEach((v, i) => {
    if (
      Date.now() - v.oldcreateTime > 24 * 60 * 60 * 1000 &&
      v.reviewStatus === '待复审'
    ) {
      isRedArray.push(i);
    }
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
    rowStyle({ rowIndex }) {
      if (isRedArray.includes(rowIndex)) {
        return {
          backgroundColor: '#F56C6C',
        };
      }
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
    await handleRefresh();
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
const downLoad = async (row) => {
  const data = await downLoadPdf(row.id);
  downloadFileFromBlobPart({
    fileName: '整改通知书.pdf',
    source: data,
  });
};
// 上传资料相关（核心改造：匹配接口所有query参数）
const uploadLoading = ref(false);
const currentUploadRow = ref({});
// 新增接口要求的所有参数
const uploadForm = reactive({
  fileDesc: '', // 资料文字说明
  afterIndexValue: 0, // 处理后的指标数值
  file: null,
});
// 上传表单校验规则（匹配接口必填项）
const uploadFormRules = reactive({
  file: [{ required: true, message: '请选择要上传的文件', trigger: 'change' }],
});
const uploadFormRef = ref(null);
const [UploadModal, uploadModalApi] = useVbenModal({
  title: '上传证据',
  width: 600,
  modalProps: {
    destroyOnClose: true,
  },
  onCancel() {
    // 关闭弹窗清空所有数据
    uploadForm.fileDesc = '';
    uploadForm.afterIndexValue = 0;
    uploadForm.file = null;
    fileList.value = [];
    uploadFormRef.value?.resetFields();
  },
  footer: false,
});
// 上传组件相关
const upload = ref(null);
const fileList = ref([]);
const handleExceed = (files) => {
  upload.value.clearFiles();
  const file = files[0];
  upload.value.handleStart(file);
};
// 打开上传资料弹窗
const handleUpdateFile = (row) => {
  // 初始化表单数据
  uploadForm.fileDesc = '';
  uploadForm.afterIndexValue = 0;
  uploadForm.file = null;
  fileList.value = [];
  currentUploadRow.value = row;
  uploadModalApi.open();
};
async function handlePDF() {
  const newid = [];
  dataObj.list.forEach((v) => {
    if (checkedIds.value.includes(v.id)) {
      newid.push(v.punishNoticeId);
    }
  });
  const data = await exporCFReviewPDF(newid);
  downloadFileFromBlobPart({
    fileName: '处罚通知书pdf.zip',
    source: data,
  });
}
// 提交文件上传（核心改造：匹配接口query+form-data参数）
const handleUploadSubmit = async () => {
  // 1. 表单整体校验
  const valid = await uploadFormRef.value.validate();
  if (!valid) return;
  // 2. 校验文件是否选择
  if (!uploadForm.file || fileList.value.length === 0) {
    ElMessage.warning('请选择要上传的文件');
    return;
  }

  try {
    uploadLoading.value = true;
    const file = fileList.value[0];
    // 3. 构建FormData（仅传递文件）
    const formData = new FormData();
    formData.append('file', file.raw);
    formData.append('punishReviewLedgerId', currentUploadRow.value.id);

    // 5. 调用上传接口：同时传递formData和query参数
    await punishFile(formData);

    ElMessage.success('资料上传成功！');
    uploadModalApi.close();
    handleRefresh(); // 刷新工单列表
  } catch (error) {
    ElMessage.error(`上传失败：${error.message || '服务器异常'}`);
    console.error('上传错误详情：', error);
  } finally {
    uploadLoading.value = false;
  }
};
const backDialogVisible = ref(false);
const currentRow = ref(null);
const reasonList = ref([]);
// 撤销表单（原因+备注）
const backForm = reactive({
  reason: '', // 撤销原因（必选）
  remark: '', // 补充说明（可选）
});

// 打开撤销弹窗
const openBackDialog = async (row) => {
  currentRow.value = row;
  // 重置表单
  backForm.reason = '';
  backForm.remark = '';
  backDialogVisible.value = true;
  const res = await getReasonList();
  reasonList.value = res.list;
};

// 文件选择事件
const onChange = (file) => {
  fileList.value = [];
  fileList.value.push(file);
  uploadForm.file = file;
};
// 原撤销逻辑（接收行数据和撤销原因）
const handleBack = async (row, formData) => {
  await sendledgerReason({
    id: row.id,
    cancelReasonId: backForm.reason,
  });

  handleRefresh();
};
// 确认撤销
const confirmBack = async () => {
  try {
    // 传递行数据 + 撤销原因给原逻辑
    await handleBack(currentRow.value, backForm);
    // 关闭弹窗
    backDialogVisible.value = false;
    // 提示成功（按需调整）
    ElMessage.success('撤销操作成功！');
  } catch (error) {
    ElMessage.error(`撤销失败：${error.message}`);
  }
};
// 原下发逻辑（保留你的handleSendFile方法）
const handleSendFile = async (row) => {
  // 你的下发接口逻辑...
  await sendIssue({
    id: row.id,
  });
  await handleRefresh();
};
/** 二次确认后执行下发 */
const handleSendFileConfirm = async (row) => {
  try {
    // 弹出确认框
    await ElMessageBox.confirm(
      '确定要下发处罚通知书吗？此操作不可撤销！',
      '确认下发',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      },
    );
    // 用户确认后执行原逻辑
    await handleSendFile(row);

    handleRefresh();
    ElMessage.success('通知书下发成功！');
  } catch {
    // 用户取消则不执行任何操作
    ElMessage.info('已取消下发');
  }
};
</script>

<template>
  <div class="park-lot-table-new">
    <!-- 撤销确认弹窗（带原因选择） -->
    <el-dialog
      title="撤销操作"
      v-model="backDialogVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <!-- 撤销原因选择框 -->
      <el-form :model="backForm" label-width="120px" required>
        <el-form-item label="撤销原因：" prop="reason">
          <el-select v-model="backForm.reason" placeholder="请选择撤销原因">
            <el-option
              v-for="item in reasonList"
              :key="item.id"
              :value="item.id"
              :label="item.reasonName"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <!-- 弹窗底部按钮 -->
      <template #footer>
        <el-button @click="backDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="confirmBack"
          :disabled="!backForm.reason"
        >
          确认撤销
        </el-button>
      </template>
    </el-dialog>
    <!-- 上传资料弹窗（核心改造：新增所有接口参数输入框） -->
    <UploadModal>
      <div class="upload-modal-content p-4">
        <ElForm
          ref="uploadFormRef"
          :model="uploadForm"
          :rules="uploadFormRules"
          label-width="120px"
        >
          <!-- 文件上传区域 -->
          <ElFormItem label="选择文件" prop="file" class="mb-4">
            <ElUpload
              ref="upload"
              v-model:file-list="fileList"
              :on-change="onChange"
              :on-exceed="handleExceed"
              :auto-upload="false"
              class="upload-demo"
              drag
              :limit="1"
            >
              <ElIcon class="el-icon--upload"><UploadFilled /></ElIcon>
              <div class="el-upload__text">
                拖拽文件到此处上传，或<em>点击选择文件</em>
              </div>
              <div class="el-upload__tip mt-2 text-sm text-gray-500">
                支持jpg/jpeg/png/pdf/doc/docx/xls/xlsx格式，单个文件不超过5MB
              </div>
            </ElUpload>
          </ElFormItem>
        </ElForm>

        <!-- 操作按钮 -->
        <div class="mt-4 flex justify-end gap-2">
          <ElButton @click="uploadModalApi.close()">取消</ElButton>
          <ElButton
            type="primary"
            @click="handleUploadSubmit"
            :loading="uploadLoading"
          >
            确认上传
          </ElButton>
        </div>
      </div>
    </UploadModal>
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
            content="导出EXCEL"
            icon-name="download"
            :disabled="isEmpty(checkedIds)"
            @click="handleExport"
          />
          <IconButton
            content="批量导出PDF"
            icon-name="download"
            :disabled="isEmpty(checkedIds)"
            @click="handlePDF"
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

      <template #overdueFlag="{ row }">
        <div v-if="row.overdueFlag === 1">
          <el-tag size="small" type="danger" effect="plain"> (逾期) </el-tag>
        </div>
        <div v-else>
          <el-tag size="small" effect="plain"> (未逾期) </el-tag>
        </div>
      </template>
      <template #ledgerCode="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.ledgerCode }}
        </el-text>
      </template>
      <template #noticeContent="{ row }">
        <el-button type="primary" @click="downLoad(row)">下载pdf</el-button>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="撤销"
            icon-name="back"
            :disabled="!['待复审'].includes(row.reviewStatus)"
            @click="openBackDialog(row)"
          />
          <IconButton
            content="下发出发通知书"
            icon-name="download"
            :disabled="!['待复审'].includes(row.reviewStatus)"
            @click="handleSendFileConfirm(row)"
          />
          <IconButton
            content="上传证据"
            icon-name="Upload"
            @click="handleUpdateFile(row)"
          />
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleOpenDetail(row)"
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
