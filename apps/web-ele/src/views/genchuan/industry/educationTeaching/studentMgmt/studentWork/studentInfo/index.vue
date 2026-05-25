<script setup>
import { reactive, ref, watch, onMounted, onUnmounted } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { downloadFileFromBlobPart } from '@vben/utils';
import StudentDetailDrawer from './components/studentDetail.vue';
import {
  getStudentInfoPage,
  createStudentInfo,
  updateStudentInfo,
  deleteStudentInfo,
  deleteStudentInfoList,
  exportStudentInfo,
  getStudentInfoDetail,
  uploadFile,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/studentWork/studentInfo/data.js';
import {
  textObj,
  useFormSchema,
  getColumnsByStatus,
  useCreateFormSchema,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/studentWork/studentInfo/form.js';

const getStatusType = (status) => {
  const map = { '在籍': 'success', '休学': 'warning', '退学': 'danger', '异动': 'info' };
  return map[status] || 'info';
};
const formatTimestamp = (timestamp) => {
  if (!timestamp) return '-';
  const date = new Date(parseInt(timestamp));
  if (isNaN(date.getTime())) return timestamp;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const props = defineProps({ secondShow: Boolean, arrowShow: Boolean, arrowState: Boolean });
const emit = defineEmits(['arrow-change']);

const tagFilters = ref({});
const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  list: [],
  loading: false,
});

const activeName = ref('全部');
const gridColumns = ref(getColumnsByStatus(activeName.value));
const checkedIds = ref([]);
const checkedRows = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map(item => item.id);
  checkedRows.value = records;
}

const searchParams = ref({});
const isEditMode = ref(false);
const currentEditId = ref(null);

const getTableData = async ({ page }) => {
  dataObj.loading = true;
  try {
    const merged = { ...searchParams.value, ...tagFilters.value };
    const params = {
      ...merged,
      pageNo: page.currentPage,
      pageSize: page.pageSize,
    };
    if (params.createTime && typeof params.createTime === 'string') {
      params.createTimeStart = params.createTime;
      params.createTimeEnd = params.createTime;
      delete params.createTime;
    } else if (Array.isArray(params.createTime) && params.createTime.length === 2) {
      params.createTimeStart = params.createTime[0];
      params.createTimeEnd = params.createTime[1];
      delete params.createTime;
    }
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) delete params[key];
    });
    const res = await getStudentInfoPage(params);
    dataObj.total = res.total || 0;
    dataObj.list = res.list || [];
    return dataObj;
  } catch (error) {
    console.error('获取数据失败:', error);
    dataObj.total = 0;
    dataObj.list = [];
    ElMessage.error('获取学生列表失败');
    return dataObj;
  } finally {
    dataObj.loading = false;
  }
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: gridColumns.value,
    keepSource: true,
    proxyConfig: { ajax: { query: getTableData } },
    rowConfig: { keyField: 'id', isHover: true },
    pagerConfig: dataObj,
    toolbarConfig: { refresh: true, search: true },
    showOverflow: true,
  },
  gridEvents: { checkboxAll: handleRowCheckboxChange, checkboxChange: handleRowCheckboxChange },
  showSearchForm: false,
});

function resetPageAndQuery() {
  if (gridApi.commitProxy) gridApi.commitProxy('reload');
  else if (gridApi.reload) gridApi.reload();
  else {
    dataObj.currentPage = 1;
    gridApi.query();
  }
  dataObj.currentPage = 1;
}
function handleRefresh() { gridApi.query(); }
function handleReset() {
  searchParams.value = {};
  tagFilters.value = {};
  resetPageAndQuery();
}
async function handleExport() {
  const loading = ElLoading.service({ text: '正在导出...' });
  try {
    const data = await exportStudentInfo(searchParams.value);
    downloadFileFromBlobPart({ fileName: '学生信息列表.xls', source: data });
    ElMessage.success('导出成功');
  } catch (error) { ElMessage.error('导出失败'); }
  finally { loading.close(); }
}
async function handleBatchDelete() {
  if (checkedIds.value.length === 0) return ElMessage.warning('请至少选择一条学生记录');
  try {
    await ElMessageBox.confirm(`确认删除选中的 ${checkedIds.value.length} 条学生记录？`, '批量删除确认', { type: 'warning' });
    const loading = ElLoading.service({ text: '删除中...' });
    try {
      const res = await deleteStudentInfoList({ ids: checkedIds.value });
      if (res && res !== false) { ElMessage.success('批量删除成功'); handleRefresh(); }
      else ElMessage.error('批量删除失败');
    } finally { loading.close(); }
  } catch { }
}
function handleCreate() {
  isEditMode.value = false;
  currentEditId.value = null;
  createDrawerApi.open();
}
function handleEdit(row) {
  isEditMode.value = true;
  currentEditId.value = row.id;
  createDrawerApi.open();
}
async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`确认删除学生 ${row.name}（学号：${row.studentNo}）？`, '删除确认', { type: 'warning' });
    const loading = ElLoading.service({ text: '删除中...' });
    try {
      const res = await deleteStudentInfo({ id: row.id });
      if (res && res !== false) { ElMessage.success('删除成功'); handleRefresh(); }
      else ElMessage.error('删除失败');
    } finally { loading.close(); }
  } catch { }
}

// ========== 照片上传（最终强化版） ==========
const uploadLoading = ref(false);
const photoPreviewUrl = ref('');

const handlePhotoUpload = async (options) => {
  const { file } = options;
  uploadLoading.value = true;

  // 本地预览
  if (photoPreviewUrl.value && photoPreviewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(photoPreviewUrl.value);
  }
  photoPreviewUrl.value = URL.createObjectURL(file);

  try {
    const res = await uploadFile(file);
    console.log('【上传响应】完整内容:', res); // 重要：查看控制台输出

    // 万能解析函数：从各种响应结构中提取图片地址
    let photoUrl = null;
    if (typeof res === 'string') {
      photoUrl = res;
    } else if (res && typeof res === 'object') {
      // 优先取 data 字段（可能是字符串，也可能是对象）
      if (res.data !== undefined) {
        if (typeof res.data === 'string') {
          photoUrl = res.data;
        } else if (typeof res.data === 'object' && (res.data.url || res.data.path)) {
          photoUrl = res.data.url || res.data.path;
        }
      }
      // 如果没有找到，尝试直接取 url 或 path
      if (!photoUrl && res.url) photoUrl = res.url;
      if (!photoUrl && res.path) photoUrl = res.path;
      // 如果 response 被包装在 data 里，比如 { data: { data: "url" } }
      if (!photoUrl && res.data && typeof res.data === 'object' && res.data.data) {
        photoUrl = res.data.data;
      }
    }

    if (photoUrl && photoUrl.startsWith('http')) {
      // 更新表单字段
      await createFormApi.setFieldValue('photo', photoUrl);
      // 将预览地址替换为服务器地址
      if (photoPreviewUrl.value && photoPreviewUrl.value.startsWith('blob:')) {
        URL.revokeObjectURL(photoPreviewUrl.value);
      }
      photoPreviewUrl.value = photoUrl;
      ElMessage.success('照片上传成功');
    } else {
      console.error('解析图片地址失败，响应结构:', res);
      throw new Error(`未返回有效的图片地址 (${photoUrl})`);
    }
  } catch (error) {
    console.error('上传失败:', error);
    ElMessage.error(error.message || '上传失败，请检查网络或后端接口');
    // 清除预览
    if (photoPreviewUrl.value && photoPreviewUrl.value.startsWith('blob:')) {
      URL.revokeObjectURL(photoPreviewUrl.value);
    }
    photoPreviewUrl.value = '';
    await createFormApi.setFieldValue('photo', '');
  } finally {
    uploadLoading.value = false;
  }
};

const clearPhoto = () => {
  if (photoPreviewUrl.value) {
    if (photoPreviewUrl.value.startsWith('blob:')) {
      URL.revokeObjectURL(photoPreviewUrl.value);
    }
    photoPreviewUrl.value = '';
  }
  createFormApi.setFieldValue('photo', '');
};

// 表单实例
const [CreateForm, createFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async (values) => {
    // 唯一性校验（保持原逻辑）
    if (!isEditMode.value) {
      const exist = dataObj.list.some(item => item.studentNo === values.studentNo || item.idCard === values.idCard);
      if (exist) { ElMessage.error('学号或身份证号已存在'); return; }
    } else {
      const exist = dataObj.list.some(item => item.id !== currentEditId.value && (item.studentNo === values.studentNo || item.idCard === values.idCard));
      if (exist) { ElMessage.error('学号或身份证号已存在'); return; }
    }
    const loading = ElLoading.service({ text: isEditMode.value ? '更新中...' : '保存中...' });
    try {
      let res;
      if (isEditMode.value) res = await updateStudentInfo({ ...values, id: currentEditId.value });
      else res = await createStudentInfo(values);
      if (res && res !== false) {
        ElMessage.success(isEditMode.value ? '更新成功' : '新增成功');
        createDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error(isEditMode.value ? '更新失败' : '新增失败');
      }
    } finally { loading.close(); }
  },
  layout: 'horizontal',
  schema: useCreateFormSchema(isEditMode.value),
  showCollapseButton: false,
  submitButtonOptions: { content: '保存' },
});

const [CreateDrawer, createDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => createDrawerApi.close(),
  async onOpenChange(isOpen) {
    if (isOpen) {
      clearPhoto();
      await createFormApi.resetForm();
      if (isEditMode.value && currentEditId.value) {
        await createFormApi.updateSchema([
          { fieldName: 'studentNo', componentProps: { disabled: true } },
          { fieldName: 'idCard', componentProps: { disabled: true } },
        ]);
        try {
          const detail = await getStudentInfoDetail({ id: currentEditId.value });
          await createFormApi.setValues({
            studentNo: detail.studentNo,
            name: detail.name,
            idCard: detail.idCard,
            grade: detail.grade,
            educationLevel: detail.educationLevel,
            studyForm: detail.studyForm,
            major: detail.major,
            className: detail.className,
            studentType: detail.studentType,
            status: detail.status,
            phone: detail.phone,
            parentPhone: detail.parentPhone,
            remark: detail.remark,
            photo: detail.photo,
          });
          if (detail.photo) photoPreviewUrl.value = detail.photo;
        } catch (error) {
          ElMessage.error('加载详情失败');
          createDrawerApi.close();
        }
      } else {
        await createFormApi.updateSchema([
          { fieldName: 'studentNo', componentProps: { disabled: false } },
          { fieldName: 'idCard', componentProps: { disabled: false } },
        ]);
        await createFormApi.setValues({ status: '在籍' });
      }
    } else {
      clearPhoto();
    }
  },
});

// 详情抽屉
const studentDetailDrawerRef = ref(null);
function handleOpenDetail(row) {
  dataObj.detailObj = row;
  studentDetailDrawerRef.value.open();
}

// 高级查询表单
const [Drawer, drawerApi] = useVbenDrawer({ modal: false, footer: false, onCancel: () => drawerApi.close() });
const [QueryForm] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: (values) => {
    searchParams.value = { ...values };
    drawerApi.close();
    resetPageAndQuery();
  },
  layout: 'horizontal',
  schema: useFormSchema().map(v => { delete v.rules; return v; }),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
});

// 标签筛选逻辑
function getFieldLabel(field) {
  const map = { major: '专业', className: '班级', status: '学籍状态', creator: '创建人', createTime: '创建时间', grade: '年级' };
  return map[field] || field;
}
function getTagDisplayText(field, value) {
  if (Array.isArray(value)) return value.join('、');
  return value || '-';
}
function handleFilterTagClick(field, value) {
  if (!field) return;
  if (value === '' || value === null || value === undefined) {
    if (tagFilters.value[field] !== undefined) delete tagFilters.value[field];
  } else {
    const existing = tagFilters.value[field];
    if (existing !== undefined) {
      if (Array.isArray(existing) && existing.length === 1 && existing[0] === value) delete tagFilters.value[field];
      else if (!Array.isArray(existing) && existing === value) delete tagFilters.value[field];
      else tagFilters.value[field] = value;
    } else {
      tagFilters.value[field] = value;
    }
  }
  resetPageAndQuery();
}
function removeFilterTag(field) {
  delete tagFilters.value[field];
  resetPageAndQuery();
}
function clearFilters() {
  tagFilters.value = {};
  resetPageAndQuery();
}

watch(activeName, (newVal) => {
  tagFilters.value = {};
  gridColumns.value = getColumnsByStatus(newVal);
  if (gridApi && gridApi.xGrid) gridApi.xGrid.refreshColumn();
  else gridApi.setGridOptions?.({ columns: gridColumns.value });
  resetPageAndQuery();
});

const handleSerachShow = () => drawerApi.open();
const handleFullShow = () => screenfull.toggle();
const arrowChange = () => emit('arrow-change');
const showChart = ref(true);
const toggleChart = () => { showChart.value = !showChart.value; };
defineExpose({ handleFilterTagClick, clearFilters });

const handleChartFilter = (event) => {
  const { type, value } = event.detail;
  if (type === 'status') handleFilterTagClick('status', value);
  else if (type === 'grade') handleFilterTagClick('grade', value);
  else if (type === 'major') handleFilterTagClick('major', value);
  else if (type === 'className') handleFilterTagClick('className', value);
  else if (type === 'createTime') handleFilterTagClick('createTime', value);
};

onMounted(() => window.addEventListener('student-chart-filter', handleChartFilter));
onUnmounted(() => window.removeEventListener('student-chart-filter', handleChartFilter));
</script>

<template>
  <div class="tools-table-new">
    <StudentDetailDrawer ref="studentDetailDrawerRef" :detail-obj="dataObj.detailObj" @refresh="handleRefresh"/>
    <Drawer title="搜索"><QueryForm/></Drawer>
    <CreateDrawer :title="isEditMode ? '编辑学生信息' : '新增学生信息'">
      <!-- 照片上传区域 -->
      <div style="margin-bottom: 16px; padding: 12px; background-color: #f5f7fa; border-radius: 8px;">
        <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
          <span style="font-weight: 500; width: 100px;">学生照片：</span>
          <el-upload
            :auto-upload="true"
            :show-file-list="false"
            :http-request="handlePhotoUpload"
            :disabled="uploadLoading"
            accept="image/*"
          >
            <el-button type="primary" :loading="uploadLoading">选择图片并上传</el-button>
          </el-upload>
          <div v-if="photoPreviewUrl" style="display: flex; align-items: center; gap: 8px;">
            <img :src="photoPreviewUrl" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px; border: 1px solid #dcdfe6;" />
            <el-button type="danger" size="small" @click="clearPhoto">清除照片</el-button>
          </div>
          <span v-else style="color: #909399; font-size: 12px;">支持jpg、png等格式，上传后自动填充地址并预览</span>
        </div>
      </div>
      <CreateForm/>
    </CreateDrawer>
    <Grid>
      <template #table-title>
        <ElTag
          v-for="(value, field) in tagFilters"
          :key="field"
          type="success"
          closable
          @close="removeFilterTag(field)"
          style="height: 32px; margin: 4px 8px 4px 0; line-height: 32px"
        >
          {{ getFieldLabel(field) }}: {{ getTagDisplayText(field, value) }}
        </ElTag>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="Plus" @click="handleCreate"/>
          <IconButton content="导出" icon-name="download" @click="handleExport"/>
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow"/>
          <IconButton content="重置" icon-name="Refresh" @click="handleReset"/>
          <IconButton content="批量删除" icon-name="Delete" color="#F56C6C" @click="handleBatchDelete"/>
          <IconButton :content="props.arrowShow ? '展开' : '收缩'" :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange"/>
          <span style="width: 30px; display: inline-block;"></span>
        </div>
      </template>
      <template #name="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary" style="cursor: pointer;">{{ row.name }}</el-text>
      </template>
      <template #major="{ row }">
        <el-text @click="handleFilterTagClick('major', row.major)" type="primary" style="cursor: pointer;">{{ row.major }}</el-text>
      </template>
      <template #className="{ row }">
        <el-text @click="handleFilterTagClick('className', row.className)" type="primary" style="cursor: pointer;">{{ row.className }}</el-text>
      </template>
      <template #status="{ row }">
        <el-tag :type="getStatusType(row.status)" @click="handleFilterTagClick('status', row.status)" style="cursor: pointer;">{{ row.status }}</el-tag>
      </template>
      <template #creator="{ row }">
        <el-text @click="handleFilterTagClick('creator', row.creator)" type="primary" style="cursor: pointer;">{{ row.creator || '-' }}</el-text>
      </template>
      <template #createTime="{ row }"><el-text>{{ formatTimestamp(row.createTime) }}</el-text></template>
      <template #updateTime="{ row }"><el-text>{{ formatTimestamp(row.updateTime) }}</el-text></template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)"/>
          <IconButton content="编辑" icon-name="Edit" @click="handleEdit(row)"/>
          <IconButton content="删除" icon-name="Delete" color="#F56C6C" @click="handleDelete(row)"/>
        </div>
      </template>
    </Grid>
  </div>
</template>

<style scoped lang="scss">
.common-toolbar-tools, .table-toolbar-tools {
  display: flex;
  gap: 8px;
}
</style>
