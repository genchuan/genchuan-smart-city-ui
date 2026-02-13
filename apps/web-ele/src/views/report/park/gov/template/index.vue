<!-- index.vue 内部 - 数据上报模板配置版本 -->
<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';
import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';
// 引入封装后的详情抽屉组件
import ReportDetailDrawer from '#/views/report/park/gov/template/detail.vue';

import { dataList, textObj, useFormSchema, useGridColumns, getMaxId, getMaxTemplateId, indicatorList } from './data';

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

const formData = ref();
const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: extendedFormSchema(),
  showDefaultActions: false,
});

// 扩展表单配置，包含所有字段
function extendedFormSchema() {
  const indicators = indicatorList();

  return [
    {
      fieldName: 'template_name',
      label: '模板名称',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入模板名称',
      },
      rules: 'required',
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: false,
        filterOption: true,
        options: [
          { label: '运营统计', value: '运营统计' },
          { label: '设施统计', value: '设施统计' },
          { label: '监管统计', value: '监管统计' },
          { label: '预测分析', value: '预测分析' },
          { label: '使用统计', value: '使用统计' },
          { label: '收费统计', value: '收费统计' },
          { label: '专题统计', value: '专题统计' },
          { label: '服务统计', value: '服务统计' },
          { label: '分析报告', value: '分析报告' },
        ],
        placeholder: '请选择报表类型',
        showSearch: true,
      },
      fieldName: 'report_type',
      label: '报表类型',
      rules: 'required',
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: false,
        filterOption: true,
        options: [
          { label: '平台级', value: '平台级' },
          { label: '区域级', value: '区域级' },
          { label: '商户级', value: '商户级' },
          { label: '政务级', value: '政务级' },
        ],
        placeholder: '请选择适用范围',
        showSearch: true,
      },
      fieldName: 'apply_scope',
      label: '适用范围',
      rules: 'required',
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: false,
        filterOption: true,
        mode: 'multiple',
        options: indicators.map(item => ({
          label: item.label,
          value: item.id
        })),
        placeholder: '请选择统计维度',
        showSearch: true,
      },
      fieldName: 'indicator_ids',
      label: '统计维度',
      rules: 'required',
    },
    {
      fieldName: 'filter_condition',
      label: '过滤条件',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入过滤条件，格式：key1=value1;key2=value2',
        type: 'textarea',
        rows: 3,
      },
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: false,
        filterOption: true,
        options: [
          { label: '表格', value: '表格' },
          { label: '图表', value: '图表' },
        ],
        placeholder: '请选择展示样式',
      },
      fieldName: 'display_style',
      label: '展示样式',
    },
  ];
}

// 生成当前时间
const getCurrentTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    formDrawerApi.close();
  },
  onConfirm() {
    const obj = formApi.form.values;
    const currentTime = getCurrentTime();

    if (formDrawerApi.sharedData.payload.title === textObj.addText) {
      // 新增数据
      const newId = getMaxId() + 1;
      const newTemplateId = `TMP${String(getMaxTemplateId() + 1).padStart(3, '0')}`;
      const newData = {
        ...obj,
        id: newId,
        template_id: newTemplateId,
        config_content: obj.config_content || '暂无配置详情',
        status: '启用',
        creator: '当前用户',
        create_time: currentTime,
        update_time: currentTime
      };
      reportObj.apilist.unshift(newData);
      ElMessage.success('新增成功');
    } else {
      // 编辑数据
      const index = reportObj.apilist.findIndex(v => v.id === formData.value?.id);
      if (index !== -1) {
        const updatedData = {
          ...reportObj.apilist[index],
          ...obj,
          update_time: currentTime
        };
        reportObj.apilist[index] = updatedData;
        ElMessage.success('编辑成功');
      }
    }
    handleRefresh();
    formDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
      if (formData.value?.id) {
        // 编辑模式：设置表单值
        await formApi.setValues(formData.value);
      } else {
        // 新增模式：重置表单
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
  exportToExcel(reportObj.apilist, textObj.excelName, textObj.excelAllName);
}

/** 导出单行数据 */
function handleExportRow(row) {
  exportToExcel([row], `${row.template_name}-${row.template_id}`, `${row.template_name}-${row.template_id}.xlsx`);
}

/** 创建报表 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

/** 编辑模板 */
function handleEdit(row) {
  formDrawerApi
    .setData({
      title: textObj.editText,
      ...row,
    })
    .open();
}

/** 禁用/启用模板 */
async function handleToggleStatus(row) {
  const action = row.status === '启用' ? '禁用' : '启用';
  const confirmMessage = row.status === '启用'
    ? `确定要禁用模板 "${row.template_name}" 吗？`
    : `确定要启用模板 "${row.template_name}" 吗？`;

  try {
    await confirm(confirmMessage);
    const loadingInstance = ElLoading.service({
      text: `${action}模板 "${row.template_name}"...`,
    });

    const index = reportObj.apilist.findIndex(v => v.id === row.id);
    if (index !== -1) {
      reportObj.apilist[index] = {
        ...reportObj.apilist[index],
        status: action,
        update_time: getCurrentTime()
      };
      ElMessage.success(`${action}成功`);
      handleRefresh();
    }

    loadingInstance.close();
  } catch {
    // 用户取消操作
  }
}

/** 删除模板 */
async function handleDelete(row) {
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [row.template_name + ' - ' + row.template_id]),
  });
  try {
    reportObj.apilist = reportObj.apilist.filter((v) => v.id !== row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.template_name + ' - ' + row.template_id]));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

async function handleDeleteBatch() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请先选择要删除的数据');
    return;
  }

  await confirm($t('确定删除这些数据吗？'));
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deletingBatch'),
  });
  try {
    reportObj.apilist = reportObj.apilist.filter(
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

const reportObj = reactive({
  totalShow: false,
  detailObj: {},
  total: dataList().length,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(),
  list: [],
});

const changeTotalShow = () => {
  reportObj.totalShow = !reportObj.totalShow;
};

// 搜索条件
const searchParams = ref({});

// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;

  let filteredList = reportObj.apilist;

  // 1. 先根据标签页过滤
  if (activeName.value === '启用模板') {
    filteredList = filteredList.filter(v => v.status === '启用');
  } else if (activeName.value === '禁用模板') {
    filteredList = filteredList.filter(v => v.status === '禁用');
  } else if (activeName.value === '常用模板') {
    filteredList = filteredList.filter(v =>
      ['运营统计', '设施统计', '监管统计'].includes(v.report_type) && v.status === '启用'
    );
  } else if (activeName.value === '平台级模板') {
    filteredList = filteredList.filter(v => v.apply_scope === '平台级');
  }

  // 2. 再根据搜索条件过滤
  if (searchParams.value.template_name) {
    filteredList = filteredList.filter(v =>
      v.template_name.includes(searchParams.value.template_name)
    );
  }
  if (searchParams.value.report_type) {
    filteredList = filteredList.filter(v => v.report_type === searchParams.value.report_type);
  }
  if (searchParams.value.apply_scope) {
    filteredList = filteredList.filter(v => v.apply_scope === searchParams.value.apply_scope);
  }
  if (searchParams.value.status) {
    filteredList = filteredList.filter(v => v.status === searchParams.value.status);
  }

  reportObj.total = filteredList.length;
  reportObj.list = filteredList.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  );

  return reportObj;
};

// 添加查询表单
const [QueryForm, queryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: onSubmit,
  handleReset: onReset,
  layout: 'horizontal',
  schema: useFormSchema().map((v) => ({
    ...v,
    rules: undefined, // 移除表单验证规则，搜索不需要验证
  })),
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
    type: 'primary',
  },
  resetButtonOptions: {
    content: '重置',
  },
});

// 搜索表单查询
function onSubmit(values) {
  searchParams.value = { ...values };
  drawerApi.close();
  gridApi.query();
}

// 重置搜索表单
function onReset() {
  searchParams.value = {};
  queryFormApi.resetForm();
  gridApi.query();
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
    pagerConfig: reportObj,
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

const activeName = ref('启用模板');

// 修改打开详情的方法
const handleOpenDetail = (row) => {
  reportObj.detailObj = row;
  reportDetailDrawerRef.value.open();
};

// 模板ID点击事件
const handleTemplateIdClick = (template) => {
  // 跳转到模板详情弹窗的逻辑
  ElMessage.info(`跳转到模板 ${template.template_id} 的详情`);
};

// 状态点击事件
const handleStatusClick = (template) => {
  // 筛选同状态模板
  searchParams.value = { ...searchParams.value, status: template.status };
  gridApi.query();
};

// 更新标签页数据
const tabsData = ref([
  { label: '启用模板' },
  { label: '禁用模板' },
  { label: '常用模板' },
  { label: '平台级模板' },
  { label: '全部模板' },
]);

const createLabel = (item) => {
  let count = 0;
  let filteredList = reportObj.apilist;

  // 先应用搜索条件
  if (searchParams.value.template_name) {
    filteredList = filteredList.filter(v =>
      v.template_name.includes(searchParams.value.template_name)
    );
  }
  if (searchParams.value.report_type) {
    filteredList = filteredList.filter(v => v.report_type === searchParams.value.report_type);
  }
  if (searchParams.value.apply_scope) {
    filteredList = filteredList.filter(v => v.apply_scope === searchParams.value.apply_scope);
  }
  if (searchParams.value.status) {
    filteredList = filteredList.filter(v => v.status === searchParams.value.status);
  }

  if (item.label === '启用模板') {
    count = filteredList.filter(v => v.status === '启用').length;
  } else if (item.label === '禁用模板') {
    count = filteredList.filter(v => v.status === '禁用').length;
  } else if (item.label === '常用模板') {
    count = filteredList.filter(v =>
      ['运营统计', '设施统计', '监管统计'].includes(v.report_type) && v.status === '启用'
    ).length;
  } else if (item.label === '平台级模板') {
    count = filteredList.filter(v => v.apply_scope === '平台级').length;
  } else if (item.label === '全部模板') {
    count = filteredList.length;
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

// 定义组件ref
const reportDetailDrawerRef = ref(null);
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>

    <!-- 使用封装后的详情抽屉组件 -->
    <ReportDetailDrawer
      ref="reportDetailDrawerRef"
      :detail-obj="reportObj.detailObj"
      :title="`模板配置详情 - ${reportObj.detailObj.template_name}`"
      @template-id-click="handleTemplateIdClick"
      @status-click="handleStatusClick"
    />

    <Drawer title="筛选">
      <QueryForm class="query-form" />
    </Drawer>

    <Grid>
      <!-- 二级标签 -->
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
            content="筛选"
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

      <template #template_id="{ row }">
        <el-text
          @click="handleTemplateIdClick(row)"
          class="common-align"
          type="primary"
        >
          {{ row.template_id }}
        </el-text>
      </template>

      <template #template_name="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.template_name }}
        </el-text>
      </template>

      <template #report_type="{ row }">
        <el-tag type="success" size="small">
          {{ row.report_type }}
        </el-tag>
      </template>

      <template #apply_scope="{ row }">
        <el-tag :type="row.apply_scope === '平台级' ? 'warning' :
                       row.apply_scope === '区域级' ? 'primary' :
                       row.apply_scope === '商户级' ? 'success' : 'info'"
                size="small">
          {{ row.apply_scope }}
        </el-tag>
      </template>

      <template #config_content="{ row }">
        <el-text size="small" class="config-content-text">
          {{ row.config_content }}
        </el-text>
      </template>

      <template #status="{ row }">
        <el-tag :type="row.status === '启用' ? 'success' : 'danger'"
                size="small"
                class="cursor-pointer"
                @click="handleStatusClick(row)">
          {{ row.status }}
        </el-tag>
      </template>

      <template #creator="{ row }">
        <el-tag type="info" size="small">
          {{ row.creator }}
        </el-tag>
      </template>

      <template #create_time="{ row }">
        <el-text size="small">
          {{ row.create_time }}
        </el-text>
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
            icon-name="Edit"
            @click="handleEdit(row)"
          />
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExportRow(row)"
          />
          <IconButton
            :content="row.status === '启用' ? '禁用' : '启用'"
            :icon-name="row.status === '启用' ? 'Close' : 'Check'"
            :color="row.status === '启用' ? '#F56C6C' : '#67C23A'"
            @click="handleToggleStatus(row)"
          />
        </div>
      </template>

      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon" v-if="!reportObj.totalShow">
            <ArrowDown />
          </el-icon>
          <el-icon class="tabel-tab-icon" v-if="reportObj.totalShow">
            <ArrowUp />
          </el-icon>
          <span>
            本页统计：模板数{{ reportObj.list.length }};
            启用模板: {{ reportObj.list.filter(v => v.status === '启用').length }};
            平台级模板: {{ reportObj.list.filter(v => v.apply_scope === '平台级').length }};
            图表模板: {{ reportObj.list.filter(v => v.display_style === '图表').length }};
          </span>
        </div>
        <div class="common-total-bottom" v-if="reportObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>

