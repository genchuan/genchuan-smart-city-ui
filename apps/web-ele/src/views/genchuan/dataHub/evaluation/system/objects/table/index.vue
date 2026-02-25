<script setup>
import { computed, reactive, ref } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';
import { ElLoading, ElMessage, ElDialog, ElUpload } from 'element-plus';
import { UploadFilled } from '@element-plus/icons-vue';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';
import garageDetailDrawer from './detail.vue';
import { dataList, textObj, useFormSchema, useGridColumns, areaList, objectTypeList, userList, relatedObjectList, statusList } from './data';

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

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() { drawerApi.close(); },
  async onOpenChange() {},
});

const formData = ref();
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

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() { formDrawerApi.close(); },
  onConfirm() {
    const obj = formApi.form.values;
    if (formDrawerApi.sharedData.payload.title === textObj.addText) {
      // 生成新ID并补全关联字段
      obj.id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
      obj.areaName = areaList.find(a => a.code === obj.areaCode)?.name || '';
      obj.objectTypeName = objectTypeList.find(t => t.id === obj.objectTypeId)?.name || '';
      obj.managerName = userList.find(u => u.id === obj.managerId)?.name || '';
      obj.relatedName = relatedObjectList.find(r => r.id === obj.relatedId)?.name || '';
      obj.statusName = statusList.find(s => s.id === obj.statusId)?.name || '';
      obj.createByName = '当前用户';
      obj.createTime = new Date().toLocaleString();
      obj.updateByName = '当前用户';
      obj.updateTime = obj.createTime;
      obj.changeLog = '新建对象';
      dataObj.apilist.push(obj);
      // 新增后跳转到第一页
      dataObj.currentPage = 1;
    } else {
      const index = dataObj.apilist.findIndex(v => v.id === formData.value?.id);
      if (index !== -1) {
        const updated = { ...dataObj.apilist[index], ...obj };
        updated.areaName = areaList.find(a => a.code === obj.areaCode)?.name || '';
        updated.objectTypeName = objectTypeList.find(t => t.id === obj.objectTypeId)?.name || '';
        updated.managerName = userList.find(u => u.id === obj.managerId)?.name || '';
        updated.relatedName = relatedObjectList.find(r => r.id === obj.relatedId)?.name || '';
        updated.statusName = statusList.find(s => s.id === obj.statusId)?.name || '';
        updated.updateByName = '当前用户';
        updated.updateTime = new Date().toLocaleString();
        updated.changeLog = (updated.changeLog || '') + '；编辑更新';
        dataObj.apilist[index] = updated;
      }
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

/** 导出（根据当前过滤条件） */
async function handleExport() {
  // 获取当前过滤后的完整数据（不分页）
  const filteredList = getFilteredList();
  if (filteredList.length === 0) {
    ElMessage.warning('没有符合条件的数据可导出');
    return;
  }

  // 生成文件名：评价对象信息_区域_日期.xlsx
  const areaName = searchParams.value?.areaCode
    ? areaList.find(a => a.code === searchParams.value.areaCode)?.name || '未知区域'
    : '全部区域';
  const dateStr = dayjs().format('YYYY-MM-DD');
  const fileName = `评价对象信息_${areaName}_${dateStr}.xlsx`;

  exportToExcel(filteredList, textObj.excelName, fileName);
}

/** 批量导出（根据选中的行） */
async function handleBatchExport() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请先勾选要导出的数据');
    return;
  }

  const selectedRows = dataObj.apilist.filter(item => checkedIds.value.includes(item.id));
  if (selectedRows.length === 0) return;

  // 生成文件名：评价对象信息_批量_日期.xlsx
  const dateStr = dayjs().format('YYYY-MM-DD');
  const fileName = `评价对象信息_批量_${dateStr}.xlsx`;

  exportToExcel(selectedRows, textObj.excelName, fileName);
}

/** 新增 */
function handleCreate() {
  formDrawerApi.setData({ title: textObj.addText }).open();
}

/** 编辑 */
function handleEdit(row) {
  formDrawerApi.setData({ title: textObj.editText, ...row }).open();
}

/** 停用 */
async function handleDisable(row) {
  if (row.statusName !== '启用') {
    ElMessage.warning(`当前状态为“${row.statusName}”，不能执行停用操作`);
    return;
  }
  await confirm('确定停用该评价对象吗？');
  const loadingInstance = ElLoading.service({ text: '停用中...' });
  try {
    const index = dataObj.apilist.findIndex(v => v.id === row.id);
    if (index !== -1) {
      dataObj.apilist[index].statusName = '停用';
      dataObj.apilist[index].changeLog = (dataObj.apilist[index].changeLog || '') + '；停用操作';
    }
    ElMessage.success('已停用');
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

/** 启用 */
async function handleEnable(row) {
  if (row.statusName !== '停用') {
    ElMessage.warning(`当前状态为“${row.statusName}”，不能执行启用操作`);
    return;
  }
  await confirm('确定启用该评价对象吗？');
  const loadingInstance = ElLoading.service({ text: '启用中...' });
  try {
    const index = dataObj.apilist.findIndex(v => v.id === row.id);
    if (index !== -1) {
      dataObj.apilist[index].statusName = '启用';
      dataObj.apilist[index].changeLog = (dataObj.apilist[index].changeLog || '') + '；启用操作';
    }
    ElMessage.success('已启用');
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

/** 批量状态变更（根据当前tab和选中行状态校验） */
async function handleBatchStatusChange() {
  const targetStatus = activeName.value === '停用' ? '启用' : '停用';
  const allowedCurrentStatus = targetStatus === '启用' ? '停用' : '启用';
  const invalidRows = dataObj.apilist.filter(item => checkedIds.value.includes(item.id) && item.statusName !== allowedCurrentStatus);
  if (invalidRows.length > 0) {
    ElMessage.warning(`选中的行中包含状态不是“${allowedCurrentStatus}”的对象，无法批量${targetStatus}。`);
    return;
  }
  await confirm(`确定将选中的对象${targetStatus === '启用' ? '启用' : '停用'}吗？`);
  const loadingInstance = ElLoading.service({ text: '处理中...' });
  try {
    dataObj.apilist.forEach(item => {
      if (checkedIds.value.includes(item.id)) {
        item.statusName = targetStatus;
        item.changeLog = (item.changeLog || '') + `；批量${targetStatus}`;
      }
    });
    checkedIds.value = [];
    ElMessage.success(`批量${targetStatus}成功`);
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map(item => item.id);
}

// ==================== 导入功能 ====================
const importDialogVisible = ref(false);
const importLoading = ref(false);
const importFile = ref(null);
const importResult = ref({ success: 0, failures: [] });

function handleImport() {
  importDialogVisible.value = true;
  importFile.value = null;
  importResult.value = { success: 0, failures: [] };
}

function handleFileChange(file) {
  importFile.value = file.raw;
  return false;
}

function handleRemove() {
  importFile.value = null;
  importResult.value = { success: 0, failures: [] };
}

function downloadTemplate() {
  const headers = [
    '对象名称',
    '对象编码',
    '所属区域名称',
    '对象类型名称',
    '负责人姓名',
    '联系电话',
    '关联网格/部门名称',
    '状态名称',
  ];
  const data = [
    ['芗城区网格单元', 'OBJ-1001', '芗城区', '网格', '张三', '13800138001', '芗城区XX街道第一网格', '启用'],
  ];
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
  XLSX.utils.book_append_sheet(wb, ws, '模板');
  XLSX.writeFile(wb, '评价对象导入模板.xlsx');
}

async function confirmImport() {
  if (!importFile.value) {
    ElMessage.warning('请选择要导入的文件');
    return;
  }

  importLoading.value = true;
  importResult.value = { success: 0, failures: [] };

  try {
    const arrayBuffer = await importFile.value.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer);
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' });

    if (rows.length < 2) {
      ElMessage.warning('文件内容为空');
      return;
    }

    const headers = rows[0];
    const expectedHeaders = [
      '对象名称',
      '对象编码',
      '所属区域名称',
      '对象类型名称',
      '负责人姓名',
      '联系电话',
      '关联网格/部门名称',
      '状态名称',
    ];
    if (!expectedHeaders.every((h, i) => headers[i] === h)) {
      ElMessage.error('导入文件格式不正确，请使用模板');
      return;
    }

    const areaMap = new Map(areaList.map((a) => [a.name, a.code]));
    const typeMap = new Map(objectTypeList.map((t) => [t.name, t.id]));
    const userMap = new Map(userList.map((u) => [u.name, u]));
    const relatedMap = new Map(relatedObjectList.map((r) => [r.name, r.id]));
    const statusMap = new Map(statusList.map((s) => [s.name, s.id]));

    const phoneRegex = /^1[3-9]\d{9}$/;

    const existingNamesByArea = new Map();
    dataObj.apilist.forEach((item) => {
      if (!existingNamesByArea.has(item.areaCode)) {
        existingNamesByArea.set(item.areaCode, new Set());
      }
      existingNamesByArea.get(item.areaCode).add(item.objectName);
    });

    const successRows = [];
    const failures = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.every((cell) => !cell)) continue;

      const [
        objectName,
        objectCode,
        areaName,
        typeName,
        managerName,
        managerPhone,
        relatedName,
        statusName,
      ] = row.map((cell) => (cell ? cell.toString().trim() : ''));

      const errors = [];

      if (!objectName) errors.push('对象名称不能为空');
      if (!objectCode) errors.push('对象编码不能为空');
      if (!areaName) errors.push('所属区域名称不能为空');
      if (!typeName) errors.push('对象类型名称不能为空');
      if (!managerName) errors.push('负责人姓名不能为空');
      if (!managerPhone) errors.push('联系电话不能为空');
      if (!relatedName) errors.push('关联网格/部门名称不能为空');
      if (!statusName) errors.push('状态名称不能为空');

      if (managerPhone && !phoneRegex.test(managerPhone)) {
        errors.push('联系电话格式不正确');
      }

      const areaCode = areaMap.get(areaName);
      if (!areaCode) errors.push(`所属区域“${areaName}”不存在`);

      const objectTypeId = typeMap.get(typeName);
      if (!objectTypeId) errors.push(`对象类型“${typeName}”不存在`);

      const manager = userMap.get(managerName);
      if (!manager) errors.push(`负责人“${managerName}”不存在`);

      const relatedId = relatedMap.get(relatedName);
      if (!relatedId) errors.push(`关联网格/部门“${relatedName}”不存在`);

      const statusId = statusMap.get(statusName);
      if (!statusId) errors.push(`状态“${statusName}”不存在`);

      if (areaCode && objectName) {
        const namesInArea = existingNamesByArea.get(areaCode) || new Set();
        if (namesInArea.has(objectName)) {
          errors.push(`当前区域下已存在名称为“${objectName}”的对象`);
        } else {
          if (!existingNamesByArea.has(areaCode)) {
            existingNamesByArea.set(areaCode, new Set());
          }
          existingNamesByArea.get(areaCode).add(objectName);
        }
      }

      if (errors.length > 0) {
        failures.push({ row: i + 1, errors });
      } else {
        successRows.push({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
          objectName,
          objectCode,
          areaCode,
          areaName,
          objectTypeId,
          objectTypeName: typeName,
          managerId: manager.id,
          managerName,
          managerPhone,
          relatedId,
          relatedName,
          statusId,
          statusName,
          createByName: '当前用户',
          createTime: new Date().toLocaleString(),
          updateByName: '当前用户',
          updateTime: new Date().toLocaleString(),
          changeLog: '批量导入',
        });
      }
    }

    importResult.value = { success: successRows.length, failures };

    if (successRows.length > 0 && failures.length === 0) {
      dataObj.apilist.push(...successRows);
      ElMessage.success(`成功导入 ${successRows.length} 条数据`);
      importDialogVisible.value = false;
      handleRefresh();
    } else if (successRows.length > 0 && failures.length > 0) {
      dataObj.apilist.push(...successRows);
      ElMessage.warning(`导入完成，成功 ${successRows.length} 条，失败 ${failures.length} 条，请查看失败明细`);
      handleRefresh();
    } else {
      ElMessage.error(`导入失败，请查看失败明细`);
    }
  } catch (error) {
    console.error('导入失败', error);
    ElMessage.error('导入失败：' + error.message);
  } finally {
    importLoading.value = false;
  }
}
// ==================== 导入功能结束 ====================

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  garageDetail: {},
  total: dataList().length,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(),
  list: [],
  filteredList: [], // 保存当前过滤后的完整列表（供导出使用）
});

const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

// 获取过滤后的完整列表（用于导出）
function getFilteredList() {
  // 先按状态过滤
  let filtered = dataObj.apilist.filter(v => {
    if (activeName.value === '全部') return true;
    return v.statusName === activeName.value;
  });

  // 再按搜索条件过滤
  const params = searchParams.value;
  if (Object.keys(params).length > 0) {
    filtered = filtered.filter(item => {
      let match = true;
      if (params.objectName && !item.objectName.includes(params.objectName)) match = false;
      if (params.objectCode && !item.objectCode.includes(params.objectCode)) match = false;
      if (params.areaCode && item.areaCode !== params.areaCode) match = false;
      if (params.objectTypeId && item.objectTypeId !== params.objectTypeId) match = false;
      if (params.managerId && item.managerId !== params.managerId) match = false;
      if (params.managerPhone && !item.managerPhone.includes(params.managerPhone)) match = false;
      if (params.relatedId && item.relatedId !== params.relatedId) match = false;
      if (params.statusId && item.statusId !== params.statusId) match = false;
      return match;
    });
  }

  // 排序：按创建时间降序（最新的在前）
  filtered.sort((a, b) => (b.createTime || '').localeCompare(a.createTime || ''));

  return filtered;
}

// 表格数据获取（按状态过滤 + 按搜索条件过滤 + 排序 + 分页）
const getTableData = (pageObj) => {
  const page = pageObj.page;
  const filtered = getFilteredList();
  dataObj.filteredList = filtered; // 保存供导出使用

  dataObj.total = filtered.length;
  dataObj.list = filtered.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize
  );
  return dataObj;
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
  schema: useFormSchema().map(v => {
    delete v.rules;
    return { ...v };
  }),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
  resetButtonOptions: {
    content: '重置',
    onClick: () => {
      queryFormApi.resetForm();
      queryFormApi.submitForm(); // 触发查询，清空搜索条件
    }
  }
});

function onSubmit(values) {
  searchParams.value = values;
  drawerApi.close();
  handleRefresh();
}

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

const activeName = ref('全部');
const handleGarageOpenDetail = (row) => {
  dataObj.garageDetail = row;
  garageDetailRef.value.open();
};

const tabsData = ref([
  { label: '全部' },
  { label: '启用' },
  { label: '停用' },
]);

const createLabel = (item) => {
  let count = 0;
  if (item.label === '全部') {
    count = dataObj.apilist.length;
  } else {
    count = dataObj.apilist.filter(v => v.statusName === item.label).length;
  }
  return `${item.label} (${count})`;
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

const garageDetailRef = ref(null);

const arrowChange = () => {
  emit('arrow-change');
};
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

    <!-- 导入弹窗 -->
    <el-dialog v-model="importDialogVisible" title="批量导入评价对象" width="600px" destroy-on-close>
      <div class="import-container">
        <div class="import-tip">
          <el-link type="primary" @click="downloadTemplate">下载导入模板</el-link>
          <span style="margin-left: 16px; color: #909399;">请按照模板格式填写数据后上传</span>
        </div>
        <el-upload
          drag
          :auto-upload="false"
          :on-change="handleFileChange"
          :on-remove="handleRemove"
          :limit="1"
          accept=".xlsx, .xls"
        >
          <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
          <div class="el-upload__text">将文件拖到此处或 <em>点击上传</em></div>
          <template #tip>
            <div class="el-upload__tip">仅支持 .xlsx 或 .xls 格式</div>
          </template>
        </el-upload>

        <!-- 导入结果展示 -->
        <div v-if="importResult.failures.length > 0" class="import-result">
          <div class="result-title">导入失败明细：</div>
          <el-table :data="importResult.failures" max-height="200" size="small">
            <el-table-column prop="row" label="行号" width="60" />
            <el-table-column prop="errors" label="错误信息">
              <template #default="{ row }">
                {{ row.errors.join('；') }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="importResult.success > 0 && importResult.failures.length === 0" class="import-success">
          成功导入 {{ importResult.success }} 条数据
        </div>
        <div v-if="importResult.success > 0 && importResult.failures.length > 0" class="import-success" style="color: #e6a23c;">
          已导入 {{ importResult.success }} 条，失败 {{ importResult.failures.length }} 条，请修正后重传失败数据
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="importDialogVisible = false">关闭</el-button>
          <el-button type="primary" :loading="importLoading" @click="confirmImport">开始导入</el-button>
        </span>
      </template>
    </el-dialog>

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
            <IconButton
              content="批量导出"
              icon-name="download"
              :disabled="isEmpty(checkedIds)"
              @click="handleBatchExport"
            />
          </template>

          <!-- 启用/停用标签下的按钮 -->
          <template v-else>
            <IconButton content="导出" icon-name="download" @click="handleExport" />
            <IconButton
              content="批量导出"
              icon-name="download"
              :disabled="isEmpty(checkedIds)"
              @click="handleBatchExport"
            />
          </template>

          <!-- 通用按钮 -->
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
      <template #objectName="{ row }">
        <el-text
          @click="handleGarageOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.objectName }}
        </el-text>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools" style="display: flex; align-items: center; justify-content: center; gap: 4px;">
          <IconButton content="详情" icon-name="View" @click="handleGarageOpenDetail(row)" />
          <IconButton content="编辑" icon-name="edit" @click="handleEdit(row)" />
          <IconButton content="停用" icon-name="delete" color="#F56C6C" @click="handleDisable(row)" />
          <IconButton content="启用" icon-name="check" color="#67C23A" @click="handleEnable(row)" />
        </div>
      </template>
      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon" v-if="!dataObj.totalShow"><ArrowDown /></el-icon>
          <el-icon class="tabel-tab-icon" v-if="dataObj.totalShow"><ArrowUp /></el-icon>
          <span>本页统计：对象数量{{ dataObj.list.length }}，启用{{ dataObj.list.filter(v => v.statusName === '启用').length }}，停用{{ dataObj.list.filter(v => v.statusName === '停用').length }}</span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span>全部统计：对象总数{{ dataObj.apilist.length }}，启用{{ dataObj.apilist.filter(v => v.statusName === '启用').length }}，停用{{ dataObj.apilist.filter(v => v.statusName === '停用').length }}</span>
        </div>
      </template>
    </Grid>
  </div>
</template>

<style scoped lang="scss">
/* 原有样式保持不变，新增导入相关样式 */
.import-container {
  padding: 20px 0;
}
.import-tip {
  margin-bottom: 20px;
  font-size: 14px;
}
.import-result {
  margin-top: 20px;
  .result-title {
    font-weight: 500;
    margin-bottom: 8px;
    color: #f56c6c;
  }
}
.import-success {
  margin-top: 20px;
  font-weight: 500;
}
</style>
