<script setup>
import { computed, reactive, ref, onMounted } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';
import { ElLoading, ElMessage } from 'element-plus';
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
} from '#/api/genchuan/dataHub/evaluation/system/objects.js';

import garageDetailDrawer from './detail.vue';
import {
  textObj,
  useFormSchema,
  useGridColumns,
} from './data';

const props = defineProps({
  secondShow: { type: Boolean, default: false },
  arrowShow: { type: Boolean, default: false },
  arrowState: { type: Boolean, default: false },
});
const emit = defineEmits(['arrow-change']);

const getTitle = computed(() => {
  return formData.value?.objectId ? textObj.editText : textObj.addText;
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

// 新增/编辑表单数据
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

// 新增/编辑抽屉
const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() { formDrawerApi.close(); },
  async onConfirm() {
    const values = formApi.form.values;
    const loadingInstance = ElLoading.service({ text: $t('ui.actionMessage.saving') });
    try {
      if (formDrawerApi.sharedData.payload.title === textObj.addText) {
        // 新增
        await createObject(values);
        ElMessage.success($t('ui.actionMessage.addSuccess'));
      } else {
        // 编辑：合并原始对象（含 objectId）与表单值
        await updateObject({ ...dataObj.editObj, ...values });
        ElMessage.success($t('ui.actionMessage.editSuccess'));
      }
      handleRefresh();
      formDrawerApi.close();
    } catch (error) {
      console.error('保存失败', error);
      ElMessage.error(error.message || '保存失败');
    } finally {
      loadingInstance.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData(); // 包含 title 及行数据
      if (formData.value?.objectId) {
        // 编辑时直接回填，字段名已统一
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
    link.href = url;
    link.download = `评价对象_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    ElMessage.error('导出失败');
  } finally {
    loadingInstance.close();
  }
}

/** 批量导出（按选中的 objectId） */
async function handleBatchExport() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请先勾选要导出的数据');
    return;
  }
  const loadingInstance = ElLoading.service({ text: '导出中...' });
  try {
    const params = {
      objectIds: checkedIds.value.join(','),
      pageNo: 1,
      pageSize: checkedIds.value.length,
    };
    const blob = await exportObjectExcel(params);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `评价对象_选中_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    ElMessage.error('批量导出失败');
  } finally {
    loadingInstance.close();
  }
}

/** 新增 */
function handleCreate() {
  formDrawerApi.setData({ title: textObj.addText }).open();
}

/** 编辑 */
function handleEdit(row) {
  dataObj.editObj = row; // 保存原始数据（包含 objectId）
  formDrawerApi.setData({ title: textObj.editText, ...row }).open();
}

/** 删除 */
async function handleDelete(row) {
  await confirm($t('确定删除该评价对象吗？'));
  const loadingInstance = ElLoading.service({ text: $t('ui.actionMessage.deleting') });
  try {
    await deleteObject(row.objectId);
    ElMessage.success($t('ui.actionMessage.deleteSuccess'));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
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
    await updateObject({ objectId: row.objectId, statusId: 2 });
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
    await updateObject({ objectId: row.objectId, statusId: 1 });
    ElMessage.success('已启用');
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

/** 批量状态变更 */
async function handleBatchStatusChange() {
  const targetStatus = activeName.value === '停用' ? '启用' : '停用';
  const targetStatusId = targetStatus === '启用' ? 1 : 2;
  await confirm(`确定将选中的对象${targetStatus}吗？`);
  const loadingInstance = ElLoading.service({ text: '处理中...' });
  try {
    await Promise.all(checkedIds.value.map(objectId => updateObject({ objectId, statusId: targetStatusId })));
    ElMessage.success(`批量${targetStatus}成功`);
    checkedIds.value = [];
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

// 选中 ID（存储 objectId）
const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map(item => item.objectId);
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
  editObj: {}, // 用于存储编辑时的原始数据
});

const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

// 获取表格数据（调用后端）
const getTableData = async ({ page }) => {
  const params = {
    pageNum: page.currentPage,
    pageSize: page.pageSize,
    ...searchParams.value,
  };
  if (activeName.value !== '全部') {
    params.statusId = activeName.value === '启用' ? 1 : 2;
  }
  try {
    const res = await getAllPage(params);
    const { list, total } = res;
    const formattedList = list.map(item => ({
      ...item,
      createTime: item.createTime ? dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss') : '-',
      updateTime: item.updateTime ? dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss') : '-',
    }));

    dataObj.list = formattedList;
    dataObj.total = total;

    return {
      list: formattedList,
      total: total,
    };
  } catch (error) {
    console.error('表格数据获取失败', error);
    ElMessage.error('数据加载异常');
    return { list: [], total: 0 };
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
  schema: useFormSchema().map(v => {
    delete v.rules;
    delete v.defaultValue; // 搜索表单不需要默认值
    return { ...v };
  }),
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
    rowConfig: { keyField: 'objectId', isHover: true },
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

onMounted(() => {
  handleRefresh();
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
          <IconButton v-if="row.statusName === '启用'" content="停用" icon-name="delete" color="#F56C6C" @click="handleDisable(row)" />
          <IconButton v-if="row.statusName === '停用'" content="启用" icon-name="check" color="#67C23A" @click="handleEnable(row)" />
        </div>
      </template>
      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon" v-if="!dataObj.totalShow"><ArrowDown /></el-icon>
          <el-icon class="tabel-tab-icon" v-if="dataObj.totalShow"><ArrowUp /></el-icon>
          <span>本页统计：对象数量{{ dataObj.list.length }}，启用{{ dataObj.list.filter(v => v.statusName === '启用').length }}，停用{{ dataObj.list.filter(v => v.statusName === '停用').length }}</span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span>全部统计：对象总数{{ dataObj.total }}</span>
        </div>
      </template>
    </Grid>
  </div>
</template>
