<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer, useVbenModal } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import { ElImage, ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getDriveinList, exporStatusExcel, handleAbnormal,dispose } from '#/api/genchuan/industry/energyCharging/carCharging/statusMonitor/index.js';
import {
  addEntNotice,
  deleteEntNotice,
  exporEntNoticeExcel, 
  sendApprove,
  sendNoApprove,
  updateEntNotice,
  uploadRectifyFile,
} from '#/api/genchuan/industry/marketsupervision/index.js';
import { $t } from '#/locales';
import { formatTimestamp } from '#/utils';

import { useFormSchema, useGridColumns } from './table/data';
// 引入封装后的详情抽屉组件
import ParkDetailDrawer from './table/detail.vue';

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
      ? addEntNotice(obj)
      : updateEntNotice({ ...dataObj.editObj, ...obj }));
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
  const data = await exporStatusExcel();
  downloadFileFromBlobPart({
    fileName: '车辆状态监控记录.xls',
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
    await deleteEntNotice(row.id);
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
  const data = await getDriveinList(getParams); 
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
    formData.append('entRectifyRecordId', currentUploadRow.value.id);

    // 5. 调用上传接口：同时传递formData和query参数
    await uploadRectifyFile(formData);

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
// 查看全部证据图片
const handleViewAllEvidence = (row) => {
  if (!row.evidenceList || row.evidenceList.length === 0) {
    ElMessage.warning('无证据图片可查看');
    return;
  }
  ElMessage.info(`共${row.evidenceList.length}张证据图片，已打开第一张`);
  openImg(row.evidenceList[0].url);
};

/** 二次确认后执行下发 */
const handleDocument = async (row) => {
  try {
    // 弹出确认框
    await ElMessageBox.confirm('确定审核通过吗？此操作不可撤销！', '确认下发', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    // 用户确认后执行原逻辑
    await handleSendFile(row);
    ElMessage.success('审核通过！');
  } catch {
    // 用户取消则不执行任何操作
  }
};

// 原下发逻辑（保留你的handleSendFile方法）
const handleSendFile = async (row) => {
  // 你的下发接口逻辑...
  await sendApprove({
    entRectifyRecordId: row.id,
  });
  await handleRefresh();
};

// 弹窗显示状态
const dialogSendVisible = ref(false);
// 当前操作的行数据（存储审核不通过的目标数据）
const currentRow = ref(null);
// 表单实例（用于表单校验）
const formRef = ref(null);

// 表单数据：存储不通过原因
const form = reactive({
  rejectReason: '', // 不通过原因
});

// 表单校验规则：不通过原因必填
const rules = reactive({
  rejectReason: [
    { required: true, message: '请填写审核不通过的原因', trigger: 'blur' },
    { min: 5, message: '原因长度不少于5个字', trigger: 'blur' },
  ],
});

// 点击审核不通过按钮：打开弹窗并记录当前行数据
const handleNoDocument = (row) => {
  // 重置表单
  form.rejectReason = '';
  formRef.value?.resetFields();
  // 记录当前操作的行数据
  currentRow.value = row;
  // 打开弹窗
  dialogSendVisible.value = true;
};

// 弹窗关闭前的回调（可选）
const handleDialogClose = (done) => {
  dialogSendVisible.value = false;
  done();
};

// 确认提交审核不通过
const confirmReject = async () => {
  // 先校验表单
  try {
    await formRef.value.validate();
  } catch {
    // 表单校验失败，终止操作
    ElMessage.warning('请完善审核不通过原因后提交');
    return;
  }

  try {
    // 这里替换为你的实际接口调用逻辑
    // 示例：await api.auditReject({ id: currentRow.value.id, rejectReason: form.rejectReason });
    console.log('审核不通过提交成功', {
      rowId: currentRow.value.id, // 假设行数据有id字段
      rejectReason: form.rejectReason,
    });

    await sendNoApprove({
      entRectifyRecordId: currentRow.value.id, // 假设行数据有id字段
      rejectReason: form.rejectReason,
    });
    // 提示成功
    ElMessage.success('审核不通过操作已提交！');
    // 关闭弹窗
    dialogSendVisible.value = false;
    await handleRefresh();
  } catch (error) {
    // 接口调用失败处理
    ElMessage.error(`提交失败：${error.message || '请稍后重试'}`);
  }
};

// 异常处置弹窗相关
const abnormalDialogVisible = ref(false);
const abnormalForm = reactive({
  dispose_measure: '', // 处置措施
});

const abnormalFormRules = reactive({
  dispose_measure: [
    { required: true, message: '请输入处置措施', trigger: 'blur' },
    { min: 5, message: '处置措施长度不少于5个字', trigger: 'blur' },
  ],
});

const abnormalFormRef = ref(null);
const currentAbnormalRow = ref(null);

const openAbnormalDrawer = () => {
  // 重置表单
  abnormalForm.dispose_measure = '';
  abnormalFormRef.value?.resetFields();
  // 记录当前选中的行数据
  currentAbnormalRow.value = checkedIds.value.length > 0 ? checkedIds.value : null;
  // 打开弹窗
  abnormalDialogVisible.value = true;
};

const confirmAbnormalHandle = async () => {
  // 先校验表单
  try {
    await abnormalFormRef.value.validate();
  } catch {
    // 表单校验失败，终止操作
    ElMessage.warning('请完善处置措施后提交');
    return;
  }

  try {
    // 调用异常处置接口
    await handleAbnormal({
      ids: checkedIds.value,
      dispose_measure: abnormalForm.dispose_measure,
    });
    // 提示成功
    ElMessage.success('异常处置操作已提交！');
    // 关闭弹窗
    abnormalDialogVisible.value = false;
    await handleRefresh();
  } catch (error) {
    // 接口调用失败处理
    ElMessage.error(`提交失败：${error.message || '请稍后重试'}`);
  }
};

// 单个设备处置弹窗相关
const disposeDialogVisible = ref(false);
const disposeForm = reactive({
  dispose_measure: '', // 处置措施
});

const disposeFormRules = reactive({
  dispose_measure: [
    { required: true, message: '请输入处置措施', trigger: 'blur' },
    { min: 5, message: '处置措施长度不少于5个字', trigger: 'blur' },
  ],
});

const disposeFormRef = ref(null);
const currentDisposeRow = ref(null);

const handelOpenDisposeDrawer = (row) => {
  // 重置表单
  disposeForm.dispose_measure = '';
  disposeFormRef.value?.resetFields();
  // 记录当前操作的行数据
  currentDisposeRow.value = row;
  // 打开弹窗
  disposeDialogVisible.value = true;
};

const confirmDisposeHandle = async () => {
  // 先校验表单
  try {
    await disposeFormRef.value.validate();
  } catch {
    // 表单校验失败，终止操作
    ElMessage.warning('请完善处置措施后提交');
    return;
  }

  try {
    // 调用处置接口
    await dispose({
      id: currentDisposeRow.value.id,
      dispose_measure: disposeForm.dispose_measure,
    });
    // 提示成功
    ElMessage.success('处置操作已提交！');
    // 关闭弹窗
    disposeDialogVisible.value = false;
    await handleRefresh();
  } catch (error) {
    // 接口调用失败处理
    ElMessage.error(`提交失败：${error.message || '请稍后重试'}`);
  }
};
</script>

<template>
  <div class="park-lot-table-new">
    <!-- 审核不通过确认弹窗（包含原因输入） -->
    <el-dialog
      title="审核不通过确认"
      v-model="dialogSendVisible"
      width="500px"
      :close-on-click-modal="false"
      :before-close="handleDialogClose"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="不通过原因" prop="rejectReason">
          <el-input
            type="textarea"
            v-model="form.rejectReason"
            placeholder="请输入审核不通过的具体原因（必填）"
            rows="4"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogSendVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmReject">确认提交</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 异常处置弹窗（包含处置措施输入） -->
    <el-dialog
      title="异常处置"
      v-model="abnormalDialogVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="abnormalForm" :rules="abnormalFormRules" ref="abnormalFormRef" label-width="100px">
        <el-form-item label="处置措施" prop="dispose_measure">
          <el-input
            type="textarea"
            v-model="abnormalForm.dispose_measure"
            placeholder="请输入异常处置的具体措施（必填）"
            rows="4"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="abnormalDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAbnormalHandle">确认提交</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 单个设备处置弹窗（包含处置措施输入） -->
    <el-dialog
      title="设备处置"
      v-model="disposeDialogVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="disposeForm" :rules="disposeFormRules" ref="disposeFormRef" label-width="100px">
        <el-form-item label="处置措施" prop="dispose_measure">
          <el-input
            type="textarea"
            v-model="disposeForm.dispose_measure"
            placeholder="请输入设备处置的具体措施（必填）"
            rows="4"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="disposeDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmDisposeHandle">确认提交</el-button>
        </span>
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
         <IconButton content="异常处置" 
            :disabled="isEmpty(checkedIds)"
             icon-name="bell" 
             @click="openAbnormalDrawer" 
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

      <template #device_code="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.device_code }}
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
            content="处置"
            icon-name="bell"
            @click="handelOpenDisposeDrawer(row)"
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
