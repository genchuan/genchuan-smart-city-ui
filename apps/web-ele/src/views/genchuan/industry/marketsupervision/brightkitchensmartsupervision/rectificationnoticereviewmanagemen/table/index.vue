<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer, useVbenModal } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import {
  ElImage,
  ElLoading,
  ElMessage,
  ElMessageBox,
  ElTable,
  ElTableColumn,
} from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  addRectify,
  deleteRectifyEvidence,
  exporReviewExcel,
  exporReviewPDF,
  getbatchEvidence,
  getDetailEnObj,
  getDetailillObj,
  getLedgerPage,
  getReasonList,
  sendReason,
  sendRectify,
  updateRectify,
  uploadKitchenFile,
} from '#/api/genchuan/industry/marketsupervision/index.js';
import { $t } from '#/locales';
import { formatTimestamp } from '#/utils';

import { useFormSchema, useGridColumns } from './data';
// 引入封装后的详情抽屉组件
import ParkDetailDrawer from './detail.vue';
import enDetailDrawer from './enDetail.vue';
import illDetailDrawer from './illDetail.vue';

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
      ? addRectify(obj)
      : updateRectify({ ...dataObj.editObj, ...obj }));
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
  const data = await exporReviewExcel();
  downloadFileFromBlobPart({
    fileName: '台账.xls',
    source: data,
  });
}
async function handlePDF() {
  const data = await exporReviewPDF(checkedIds.value);
  downloadFileFromBlobPart({
    fileName: '台账pdf.zip',
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
    await deleteRectifyEvidence(row.id);
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
let isRedArray = [];
// 表格数据获取
const getTableData = async (pageObj) => {
  const getParams = {
    pageNo: pageObj.page.currentPage,
    pageSize: pageObj.page.pageSize,
    ...dataObj.serachObj,
  };
  const data = await getLedgerPage(getParams);
  dataObj.total = data.total;
  dataObj.list = data.list.map((v) => {
    return {
      ...v,
      createTime: formatTimestamp(v.createTime),
      draftTime: formatTimestamp(v.draftTime),
      issueTime: formatTimestamp(v.issueTime),
      rectifyDeadlineTime: formatTimestamp(v.rectifyDeadlineTime),
      updateTime: formatTimestamp(v.updateTime),
      reviewTime: formatTimestamp(v.reviewTime),
    };
  });
  isRedArray = [];
  dataObj.list.forEach((v, i) => {
    if (
      Date.now() - v.createTime > 24 * 60 * 60 * 1000 &&
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
    rowStyle({ rowIndex }) {
      if (isRedArray.includes(rowIndex)) {
        return {
          backgroundColor: '#F56C6C',
        };
      }
    },
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
const enDetailObjRef = ref(null);
const illDetailObjRef = ref(null);
const dialogVisible = ref(false);
const openImg = (url) => {
  dataObj.imgUrl = url;
  dialogVisible.value = true;
};

// 查看全部证据图片
const handleViewAllEvidence = (row) => {
  if (!row.evidenceList || row.evidenceList.length === 0) {
    ElMessage.warning('无证据图片可查看');
    return;
  }
  ElMessage.info(`共${row.evidenceList.length}张证据图片，已打开第一张`);
  openImg(row.evidenceList[0].url);
};

// 批量查看数据编号（使用el-table展示）
const handleOpenData = async () => {
  // 1. 检查是否有选中的数据
  if (isEmpty(checkedIds.value)) {
    ElMessage.warning($t('请先选择要查看的数据！') || '请先选择要查看的数据！');
    return;
  }
  const res = await getbatchEvidence({
    ledgerIdList: checkedIds.value,
  });
  dataObj.batchViewData = res.list;
  // 3. 打开批量查看弹窗
  dataObj.batchViewVisible = true;
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
  title: '上传复审证据',
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
    formData.append('rectifyReviewId', currentUploadRow.value.id);

    // 5. 调用上传接口：同时传递formData和query参数
    await uploadKitchenFile(formData);

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

// 文件选择事件
const onChange = (file) => {
  fileList.value = [];
  fileList.value.push(file);
  uploadForm.file = file;
};
/** 二次确认后执行下发 */
const handleSendFileConfirm = async (row) => {
  try {
    // 弹出确认框
    await ElMessageBox.confirm(
      '确定要下发通知书吗？此操作不可撤销！',
      '确认下发',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      },
    );
    // 用户确认后执行原逻辑
    await handleSendFile(row);
    ElMessage.success('通知书下发成功！');
  } catch {
    // 用户取消则不执行任何操作
    ElMessage.info('已取消下发');
  }
};

// 原下发逻辑（保留你的handleSendFile方法）
const handleSendFile = async (row) => {
  // 你的下发接口逻辑...
  await sendRectify({
    id: row.id,
  });
  await handleRefresh();
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

// 原撤销逻辑（接收行数据和撤销原因）
const handleBack = async (row, formData) => {
  await sendReason({
    id: row.id,
    cancelReasonId: backForm.reason,
  });
};
const handleOpenEntName = async (row) => {
  const res = await getDetailEnObj(row.entId);
  dataObj.enDetailObj = res;
  // 通过ref调用组件的open方法
  enDetailObjRef.value.open();
  console.log(row);
};
const handleIllDetail = async (row) => {
  const res = await getDetailillObj(row.illegalTypeId);
  dataObj.illDetailObj = res;
  // 通过ref调用组件的open方法
  illDetailObjRef.value.open();
};
const gridRef = ref(null);
</script>

<template>
  <div class="park-lot-table-new">
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

    <!-- 图片查看弹窗 -->
    <el-dialog v-model="dialogVisible">
      <div class="park-img-center">
        <img style="width: 100%; height: 100%" :src="dataObj.imgUrl" />
      </div>
    </el-dialog>
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
    <!-- 批量查看编号弹窗（使用el-table） -->
    <el-dialog
      v-model="dataObj.batchViewVisible"
      title="批量查看证据 - 编号列表"
      width="1000px"
      center
      draggable
    >
      <ElTable
        :data="dataObj.batchViewData"
        border
        stripe
        size="small"
        max-height="500px"
        highlight-current-row
      >
        <ElTableColumn label="序号" type="index" width="60" align="center" />
        <!-- 台账编号列 -->
        <ElTableColumn
          label="台账编号"
          prop="ledgerCode"
          min-width="200"
          align="center"
        />
        <!-- 证据列表列 -->
        <ElTableColumn
          label="证据列表"
          prop="evidenceList"
          min-width="500"
          align="center"
        >
          <template #default="{ row }">
            <div
              v-if="row.evidenceList && row.evidenceList.length > 0"
              class="evidence-list"
            >
              <div
                v-for="(item, idx) in row.evidenceList"
                :key="idx"
                class="evidence-item"
              >
                <!-- 图片预览 -->
                <ElImage
                  v-if="item.type === 'image'"
                  style="width: 80px; height: 80px; margin-right: 8px"
                  :src="item.url"
                  @click="openImg(item.url)"
                  fit="cover"
                />
                <!-- 文件名展示 -->
                <div class="evidence-info">
                  <div class="evidence-name">{{ item.name }}</div>
                  <div class="evidence-type">{{ item.type }}</div>
                </div>
              </div>
            </div>
            <div v-else class="no-evidence">无证据</div>
          </template>
        </ElTableColumn>
      </ElTable>

      <template #footer>
        <el-button @click="dataObj.batchViewVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>

    <!-- 使用封装后的详情抽屉组件 -->
    <ParkDetailDrawer
      ref="parkDetailDrawerRef"
      :detail-obj="dataObj.detailObj"
      title="详情"
    />
    <enDetailDrawer
      ref="enDetailObjRef"
      :detail-obj="dataObj.enDetailObj"
      title="详情"
    />
    <illDetailDrawer
      ref="illDetailObjRef"
      :detail-obj="dataObj.illDetailObj"
      title="详情"
    />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <Grid ref="gridRef">
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
          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
          <IconButton
            content="导出EXCEL"
            icon-name="download"
            @click="handleExport"
          />
          <IconButton
            content="批量导出PDF"
            icon-name="download"
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
            content="批量查看证据"
            icon-name="Expand"
            :disabled="isEmpty(checkedIds)"
            @click="handleOpenData"
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

      <template #entName="{ row }">
        <el-text
          @click="handleOpenEntName(row)"
          class="common-align"
          type="primary"
        >
          {{ row.entName }}
        </el-text>
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
      <template #reviewStatus="{ row }">
        <div v-if="row.overdueFlag === 1">
          <el-tag size="small" type="danger" effect="plain">
            {{ row.reviewStatus }}(逾期)
          </el-tag>
        </div>
        <div v-else>
          <el-tag size="small" type="success" effect="plain">
            {{ row.reviewStatus }}
          </el-tag>
        </div>
      </template>
      <template #illegalTypeName="{ row }">
        <el-text
          @click="handleIllDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.illegalTypeName }}
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
            content="撤销"
            icon-name="back"
            :disabled="!['待复审'].includes(row.reviewStatus)"
            @click="openBackDialog(row)"
          />
          <IconButton
            content="下发通知书"
            icon-name="download"
            :disabled="!['待复审'].includes(row.reviewStatus)"
            @click="handleSendFileConfirm(row)"
          />
          <IconButton
            content="上传复审证据"
            icon-name="Upload"
            @click="handleUpdateFile(row)"
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
