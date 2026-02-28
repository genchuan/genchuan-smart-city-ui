<script setup>
import { computed, reactive, ref, onMounted } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';
import { ElLoading, ElMessage, ElDialog, ElUpload } from 'element-plus';
import screenfull from 'screenfull';
import dayjs from 'dayjs';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';

import {
  getAllPage,
  createObject,
  updateObject,
  deleteObject,
  exportObjectExcel,
  getStatusCount,
  importObjects,
  getImportTemplate,
  // 新增导入四个简单列表接口
  getUserSimpleList,
  getAreaSimpleList,
  getObjectTypeSimpleList,
  getRelatedObjectSimpleList,
} from '#/api/genchuan/dataHub/evaluation/system/objects.js';

import garageDetailDrawer from './detail.vue';
import {
  textObj,
  useFormSchema,
  useGridColumns,
  useQuerySchema,
} from './data';

const props = defineProps({
  secondShow: { type: Boolean, default: false },
  arrowShow: { type: Boolean, default: false },
  arrowState: { type: Boolean, default: false },
});
const emit = defineEmits(['arrow-change']);

const getTitle = computed(() => {
  return formData.value?.id ? textObj.editText : textObj.addText;
});

// 搜索参数
const searchParams = ref({});

// 搜索抽屉
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() { drawerApi.close(); },
  async onOpenChange() {},
});

// 新增/编辑表单数据（用于计算标题）
const formData = ref();

// 表单实例
const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

// 加载表单下拉选项的方法（修正版）
const loadFormOptions = async () => {
  try {
    // 并行请求四个下拉列表，拦截器已剥去外层，直接得到数组
    const [areaList, typeList, userList, relatedList] = await Promise.all([
      getAreaSimpleList(),
      getObjectTypeSimpleList(),
      getUserSimpleList(),
      getRelatedObjectSimpleList(),
    ]);

    // 更新表单 schema 的 options（确保传入的是数组）
    await formApi.updateSchema([
      {
        fieldName: 'areaCode',
        componentProps: { options: Array.isArray(areaList) ? areaList : [] },
      },
      {
        fieldName: 'objectTypeId',
        componentProps: { options: Array.isArray(typeList) ? typeList : [] },
      },
      {
        fieldName: 'managerId',
        componentProps: { options: Array.isArray(userList) ? userList : [] },
      },
      {
        fieldName: 'relatedId',
        componentProps: { options: Array.isArray(relatedList) ? relatedList : [] },
      },
    ]);
  } catch (error) {
    console.error('加载下拉选项失败', error);
    ElMessage.error('加载下拉选项失败，请重试');
    // 发生错误时设置为空数组，避免界面异常
    await formApi.updateSchema([
      { fieldName: 'areaCode', componentProps: { options: [] } },
      { fieldName: 'objectTypeId', componentProps: { options: [] } },
      { fieldName: 'managerId', componentProps: { options: [] } },
      { fieldName: 'relatedId', componentProps: { options: [] } },
    ]);
  }
};

// 抽屉打开/关闭时的处理函数
const onOpenChange = async (isOpen) => {
  if (isOpen) {
    await loadFormOptions();  // 确保选项加载完成
    const drawerData = formDrawerApi.getData() || {};
    formData.value = drawerData;
    if (drawerData.id) {
      await formApi.setValues(drawerData);
    } else {
      formApi.resetForm();
    }
  }
};

// 新增/编辑抽屉
const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() { formDrawerApi.close(); },
  async onConfirm() {
    const validateResult = await formApi.validate();
    if (!validateResult.valid) return;

    let values = formApi.form.values;
    // 从抽屉数据中获取 id（编辑时通过 setData 传入的 row 包含 id）
    const drawerData = formDrawerApi.getData() || {};
    const id = drawerData.id;  // 编辑时存在，新增时为 undefined
    const isEdit = !!id;

    // 数字字段转换（确保与后端类型一致）
    const numberFields = ['objectTypeId', 'managerId', 'relatedId'];
    numberFields.forEach(field => {
      if (values[field] !== undefined && values[field] !== null && values[field] !== '') {
        values[field] = Number(values[field]);
      }
    });

    const loadingInstance = ElLoading.service({ text: $t('ui.actionMessage.saving') });
    try {
      if (!isEdit) {
        // 新增：补充默认状态 statusId = 1
        await createObject({ ...values, statusId: 1 });
        ElMessage.success($t('ui.actionMessage.addSuccess'));
      } else {
        // 编辑：传入 id 和表单值
        await updateObject({ id, ...values });
        ElMessage.success($t('ui.actionMessage.editSuccess'));
      }
      handleRefresh();
      fetchStatusCount();
      formDrawerApi.close();
    } catch (error) {
      console.error('保存失败', error);
      // 直接显示后端返回的错误信息（如名称重复等）
      ElMessage.error(error.message || '保存失败');
    } finally {
      loadingInstance.close();
    }
  },
  onOpenChange,  // 使用上面定义的异步函数
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 导出（按当前搜索条件） */
async function handleExport() {
  const loadingInstance = ElLoading.service({ text: '导出中...' });
  try {
    const params = {
      ...searchParams.value,
      pageNo: 1,
      pageSize: 10000,
    };
    const blob = await exportObjectExcel(params);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    const areaName = searchParams.value.areaName || '全部';
    const fileName = `评价对象信息_${areaName}_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`;
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    ElMessage.error('导出失败');
  } finally {
    loadingInstance.close();
  }
}

/** 新增 */
function handleCreate() {
  formDrawerApi.setData({ title: textObj.addText }).open();
}

/** 编辑 - 直接使用表格行数据，不再调用详情接口（仿停车代码） */
function handleEdit(row) {
  formDrawerApi.setData({ title: textObj.editText, ...row }).open();
}

/** 删除 */
async function handleDelete(row) {
  await confirm($t('确定删除该评价对象吗？'));
  const loadingInstance = ElLoading.service({ text: $t('ui.actionMessage.deleting') });
  try {
    await deleteObject(row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess'));
    handleRefresh();
    fetchStatusCount();
  } finally {
    loadingInstance.close();
  }
}

/** 停用 */
async function handleDisable(row) {
  if (row.statusId !== 1) {
    ElMessage.warning(`当前状态不是启用，不能执行停用操作`);
    return;
  }
  await confirm('确定停用该评价对象吗？');
  const loadingInstance = ElLoading.service({ text: '停用中...' });
  try {
    await updateObject({ id: row.id, statusId: 2 });
    ElMessage.success('已停用');
    handleRefresh();
    fetchStatusCount();
  } finally {
    loadingInstance.close();
  }
}

/** 启用 */
async function handleEnable(row) {
  if (row.statusId !== 2) {
    ElMessage.warning(`当前状态不是停用，不能执行启用操作`);
    return;
  }
  await confirm('确定启用该评价对象吗？');
  const loadingInstance = ElLoading.service({ text: '启用中...' });
  try {
    await updateObject({ id: row.id, statusId: 1 });
    ElMessage.success('已启用');
    handleRefresh();
    fetchStatusCount();
  } finally {
    loadingInstance.close();
  }
}

/** 批量状态变更（停用/启用） */
async function handleBatchStatusChange() {
  const targetStatus = activeName.value === '停用' ? '启用' : '停用';
  const targetStatusId = targetStatus === '启用' ? 1 : 2;
  await confirm(`确定将选中的对象${targetStatus}吗？`);

  const validIds = checkedIds.value.filter(id => {
    const row = dataObj.list.find(item => item.id === id);
    if (targetStatus === '启用') return row?.statusId === 2;
    else return row?.statusId === 1;
  });
  if (validIds.length === 0) {
    ElMessage.warning('选中的对象中没有可操作的数据');
    return;
  }

  const loadingInstance = ElLoading.service({ text: '处理中...' });
  try {
    await Promise.all(validIds.map(id => updateObject({ id, statusId: targetStatusId })));
    ElMessage.success(`批量${targetStatus}成功`);
    checkedIds.value = [];
    handleRefresh();
    fetchStatusCount();
  } finally {
    loadingInstance.close();
  }
}

/** 获取状态统计数据 */
async function fetchStatusCount() {
  try {
    const res = await getStatusCount();
    tabsData.value[0].count = res.totalCount || 0;
    tabsData.value[1].count = res.status1Count || res.enabled || 0;
    tabsData.value[2].count = res.status2Count || res.disabled || 0;
  } catch (error) {
    console.error('获取状态统计失败', error);
  }
}

// 选中 ID（存储 id）
const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map(item => item.id);
}

// 表格数据对象
const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  garageDetail: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  list: [],
  editObj: {},
});

const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

// 通用的列表格式化函数
function formatList(list) {
  return (list || []).map(item => {
    try {
      let createTime = '-';
      if (item.createTime != null) {
        try {
          createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss');
        } catch (e) {
          console.warn(`条目 ${item.id} createTime 格式化失败`, item.createTime, e);
        }
      }

      let updateTime = '-';
      const updateTimeField = item.updateTime ?? item.bizUpdateTime;
      if (updateTimeField != null) {
        try {
          updateTime = dayjs(updateTimeField).format('YYYY-MM-DD HH:mm:ss');
        } catch (e) {
          console.warn(`条目 ${item.id} updateTime 格式化失败`, updateTimeField, e);
        }
      }

      let changeLogShort = '-';
      if (item.changeLog != null) {
        try {
          const logStr = String(item.changeLog);
          changeLogShort = logStr.length > 50 ? logStr.substring(0, 50) + '...' : logStr;
        } catch (e) {
          console.warn(`条目 ${item.id} changeLog 处理失败`, item.changeLog, e);
        }
      }

      return {
        ...item, // 保留所有原始字段（包含 ID 字段如 areaCode, objectTypeId 等）
        areaName: item.areaName ?? '-',
        objectTypeName: item.objectTypeName ?? '-',
        managerName: item.managerName ?? '-',
        managerPhone: item.managerPhone ?? '-',
        relatedName: item.relatedName ?? '-',
        statusName: item.statusName ?? '-',
        createUserName: item.createUserName ?? '-',
        updateUserName: item.updateUserName ?? '-',
        createTime,
        updateTime,
        changeLogShort,
      };
    } catch (err) {
      console.error(`处理条目 ${item.id || 'unknown'} 时发生严重错误`, err, item);
      return {
        id: item.id,
        name: item.name || '数据异常',
        code: '-',
        areaName: '-',
        objectTypeName: '-',
        managerName: '-',
        managerPhone: '-',
        relatedName: '-',
        statusName: '-',
        createUserName: '-',
        updateUserName: '-',
        createTime: '-',
        updateTime: '-',
        changeLogShort: '数据解析错误',
      };
    }
  });
}

// 获取表格数据（使用 allpage 接口）
const getTableData = async ({ page }) => {
  const params = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...searchParams.value,
  };
  if (activeName.value !== '全部') {
    params.statusId = activeName.value === '启用' ? 1 : 2;
  }

  try {
    const res = await getAllPage(params);
    const { list, total } = res;
    const formattedList = formatList(list);
    dataObj.list = formattedList;
    dataObj.total = total;
    return dataObj;
  } catch (error) {
    const responseData = error?.response?.data;
    if (responseData?.data && Array.isArray(responseData.data.list)) {
      const { list, total } = responseData.data;
      const formattedList = formatList(list);
      dataObj.list = formattedList;
      dataObj.total = total;
      return dataObj;
    } else if (responseData && Array.isArray(responseData.list)) {
      const { list, total } = responseData;
      const formattedList = formatList(list);
      dataObj.list = formattedList;
      dataObj.total = total;
      return dataObj;
    }

    console.error('表格数据获取失败，错误详情：', error);
    dataObj.list = [];
    dataObj.total = 0;
    return dataObj;
  }
};

// 搜索表单
const [QueryForm, queryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: useQuerySchema(),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
  resetButtonOptions: {
    content: '重置',
    onClick: () => {
      queryFormApi.resetForm();
      queryFormApi.submitForm();
    }
  }
});

function onSubmit(values) {
  searchParams.value = values;
  drawerApi.close();
  handleRefresh();
}

// 表格实例
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: { query: async ({ page }) => getTableData({ page }) },
    },
    rowConfig: { keyField: 'id', isHover: true },
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

// 标签页
const activeName = ref('全部');
const handleGarageOpenDetail = (row) => {
  dataObj.garageDetail = row;
  garageDetailRef.value.open();
};

const tabsData = ref([
  { label: '全部', name: '全部', count: 0 },
  { label: '启用', name: '启用', count: 0 },
  { label: '停用', name: '停用', count: 0 },
]);

const createLabel = (item) => `${item.label} (${item.count})`;

const handleClick = () => {
  handleRefresh();
};

const handleSerachShow = () => {
  drawerApi.open();
};

const handleFullShow = () => {
  screenfull.toggle();
};

const garageDetailRef = ref(null);

const arrowChange = () => {
  emit('arrow-change');
};

// 导入相关
const importDialogVisible = ref(false);
const importFile = ref(null);
const importLoading = ref(false);
const uploadRef = ref(null);

function handleImport() {
  importDialogVisible.value = true;
}

function handleFileChange(file) {
  importFile.value = file.raw;
  return false;
}

async function handleDownloadTemplate() {
  const loadingInstance = ElLoading.service({ text: '下载模板中...' });
  try {
    const blob = await getImportTemplate();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `评价对象导入模板.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    ElMessage.error('模板下载失败');
  } finally {
    loadingInstance.close();
  }
}

async function submitImport() {
  if (!importFile.value) {
    ElMessage.warning('请选择文件');
    return;
  }
  importLoading.value = true;
  try {
    const res = await importObjects(importFile.value);
    ElMessage.success(`导入成功，${res.data || 0} 条`);
    importDialogVisible.value = false;
    handleRefresh();
    fetchStatusCount();
    if (uploadRef.value) {
      uploadRef.value.clearFiles();
    }
    importFile.value = null;
  } catch (error) {
    ElMessage.error(error.message || '导入失败');
  } finally {
    importLoading.value = false;
  }
}

onMounted(() => {
  handleRefresh();
  fetchStatusCount();
});
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <garageDetailDrawer
      ref="garageDetailRef"
      :detail-obj="dataObj.garageDetail"
    />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <Grid>
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
          <!-- 全部标签下的按钮 -->
          <template v-if="activeName === '全部'">
            <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
            <IconButton content="导入" icon-name="Upload" @click="handleImport" />
            <IconButton content="导出" icon-name="download" @click="handleExport" />
          </template>

          <!-- 启用/停用标签下的按钮 -->
          <template v-else>
            <IconButton content="导出" icon-name="download" @click="handleExport" />
          </template>

          <!-- 批量停用/启用按钮 -->
          <IconButton
            v-if="activeName !== '停用'"
            content="批量停用"
            icon-name="delete"
            color="#F56C6C"
            :disabled="isEmpty(checkedIds)"
            @click="handleBatchStatusChange"
          />
          <IconButton
            v-if="activeName === '停用'"
            content="批量启用"
            icon-name="check"
            color="#67C23A"
            :disabled="isEmpty(checkedIds)"
            @click="handleBatchStatusChange"
          />
          <IconButton content="搜索" icon-name="search" @click="handleSerachShow" />
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>
      <!-- 对象名称列插槽，点击打开详情 -->
      <template #name="{ row }">
        <el-text
          @click="handleGarageOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.name }}
        </el-text>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools" style="display: flex; align-items: center; justify-content: center; gap: 4px;">
          <IconButton content="详情" icon-name="View" @click="handleGarageOpenDetail(row)" />
          <IconButton content="编辑" icon-name="edit" @click="handleEdit(row)" />
          <IconButton content="删除" icon-name="delete" color="#F56C6C" @click="handleDelete(row)" />
          <IconButton v-if="row.statusId === 1" content="停用" icon-name="close" color="#F56C6C" @click="handleDisable(row)" />
          <IconButton v-if="row.statusId === 2" content="启用" icon-name="check" color="#67C23A" @click="handleEnable(row)" />
        </div>
      </template>
      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon" v-if="!dataObj.totalShow"><ArrowDown /></el-icon>
          <el-icon class="tabel-tab-icon" v-if="dataObj.totalShow"><ArrowUp /></el-icon>
          <span>本页统计：对象数量{{ dataObj.list.length }}，启用{{ dataObj.list.filter(v => v.statusId === 1).length }}，停用{{ dataObj.list.filter(v => v.statusId === 2).length }}</span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span>全部统计：对象总数{{ dataObj.total }}</span>
        </div>
      </template>
    </Grid>

    <!-- 导入弹窗（新增下载模板按钮） -->
    <el-dialog v-model="importDialogVisible" title="批量导入" width="400px" destroy-on-close>
      <div style="margin-bottom: 16px; text-align: right;">
        <el-button type="primary" link @click="handleDownloadTemplate">下载模板</el-button>
      </div>
      <el-upload
        ref="uploadRef"
        action="#"
        :auto-upload="false"
        :on-change="handleFileChange"
        :limit="1"
        accept=".xlsx,.xls"
      >
        <template #trigger>
          <el-button type="primary">选择 Excel 文件</el-button>
        </template>
        <template #tip>
          <div class="el-upload__tip">只能上传 .xlsx 或 .xls 文件</div>
        </template>
      </el-upload>
      <template #footer>
        <span>
          <el-button @click="importDialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="importLoading" @click="submitImport">确认导入</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
