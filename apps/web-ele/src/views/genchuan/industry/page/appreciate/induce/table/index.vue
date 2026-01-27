<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

import { dataList, textObj, useFormSchema, useGridColumns } from './data';

// 接收父组件属性
const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
});

// 向父组件派发事件
const emit = defineEmits(['toggleChart']);

// 展开/收缩按钮自身状态
const arrowShow = ref(false);

// 表单抽屉标题（新增/编辑区分）
const getTitle = computed(() => {
  return formData.value?.id ? textObj.editText : textObj.addText;
});

// 抽屉配置 - 搜索抽屉
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

// 抽屉配置 - 详情抽屉
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    detailDrawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});

// 新增/编辑表单数据绑定
const formData = ref();

// 表单配置 - 新增/编辑核心表单
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

// 抽屉配置 - 新增/编辑表单抽屉
const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    formDrawerApi.close();
  },
  onConfirm() {
    const obj = formApi.form.values;
    // 新增逻辑
    if (formDrawerApi.sharedData.payload.title === textObj.addText) {
      dataObj.apilist.push(obj);
    } else {
      // 编辑逻辑
      dataObj.apilist.forEach((v, i) => {
        if (v.id === formData.value?.id) {
          dataObj.apilist[i] = obj;
        }
      });
    }
    handleRefresh();
    formDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
      // 编辑时回显数据，新增时重置表单
      if (formData.value?.id) {
        await formApi.setValues(formData.value);
      } else {
        formApi.resetForm();
      }
    }
  },
});

/** 刷新表格数据 */
function handleRefresh() {
  gridApi.query();
}

/** 导出表格数据到Excel */
async function handleExport() {
  exportToExcel(dataObj.apilist, textObj.excelName, textObj.excelAllName);
}

/** 打开新增抽屉 */
function handleCreate() {
  formDrawerApi.setData({ title: textObj.addText }).open();
}

/** 打开编辑抽屉并回显数据 */
function handleEdit(row) {
  formDrawerApi.setData({ title: textObj.editText, ...row }).open();
}

/** 单行删除操作 */
async function handleDelete(row) {
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [row.induction_name]),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter((v) => v.id !== row.id);
    ElMessage.success(
      $t('ui.actionMessage.deleteSuccess', [row.induction_name]),
    );
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

/** 批量删除操作 */
async function handleDeleteBatch() {
  await confirm($t('确定删除这些数据吗？'));
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deletingBatch'),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter(
      (v) => !checkedIds.value.includes(v.id),
    );
    checkedIds.value = [];
    ElMessage.success($t('删除成功'));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

// 表格勾选的ID集合
const checkedIds = ref([]);
/** 表格行勾选事件 */
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}

// 全局响应式数据（表格、分页、筛选、详情相关）
const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: dataList().length,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(),
  list: [],
});

/** 底部统计栏展开/收缩 */
const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

// 筛选状态核心变量
const activeName = ref('全部'); // 状态筛选：全部/启用/禁用
const filterArea = ref(''); // 区域筛选：空=未筛选，有值=当前筛选区域
const filterType = ref(''); // 类型筛选：空=未筛选，有值=当前筛选车场类型

/** 行政区域筛选：点击筛选，再次点击取消 */
const handleFilterByArea = (area) => {
  filterArea.value = filterArea.value === area ? '' : area;
  gridApi.query();
};

/** 车场类型筛选：点击筛选，再次点击取消 */
const handleFilterByType = (type) => {
  filterType.value = filterType.value === type ? '' : type;
  gridApi.query();
};

/** 取消行政区域筛选（筛选标签关闭按钮） */
const handleCancelAreaFilter = () => {
  filterArea.value = '';
  gridApi.query();
};

/** 取消车场类型筛选（筛选标签关闭按钮） */
const handleCancelTypeFilter = () => {
  filterType.value = '';
  gridApi.query();
};

/** 表格核心数据获取：三条件叠加筛选 + 分页 */
const getTableData = (pageObj) => {
  const page = pageObj.page;
  // 第一步：状态筛选（全部/启用/禁用）
  let filteredList = dataObj.apilist.filter((v) => {
    switch (activeName.value) {
      case '全部': {
        return true;
      }
      case '启用': {
        return v.status === '1';
      }
      case '禁用': {
        return v.status === '0';
      }
      default: {
        return false;
      }
    }
  });
  // 第二步：叠加行政区域筛选
  if (filterArea.value) {
    filteredList = filteredList.filter((v) => v.area === filterArea.value);
  }
  // 第三步：叠加车场类型筛选
  if (filterType.value) {
    filteredList = filteredList.filter((v) => v.type === filterType.value);
  }
  // 分页处理
  dataObj.total = filteredList.length;
  dataObj.list = filteredList.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  );
  return dataObj;
};

// 表单配置 - 搜索表单
const [QueryForm] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: useFormSchema().map((v) => {
    delete v.rules;
    return { ...v };
  }),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
});

/** 搜索表单提交 */
function onSubmit() {
  drawerApi.close();
}

// 表格配置 - VxeGrid核心表格
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

// 状态Tabs数据
const tabsData = ref([{ label: '全部' }, { label: '启用' }, { label: '禁用' }]);

/** 生成状态Tabs标签（带数量统计） */
const createLabel = (item) => {
  let count = 0;
  switch (item.label) {
    case '全部': {
      count = dataObj.apilist.length;
      break;
    }
    case '启用': {
      count = dataObj.apilist.filter((v) => v.status === '1').length;
      break;
    }
    case '禁用': {
      count = dataObj.apilist.filter((v) => v.status === '0').length;
      break;
    }
    default: {
      count = 0;
    }
  }
  return `${item.label}(${count})`;
};

/** 状态Tabs切换刷新表格 */
const handleClick = () => {
  gridApi.query();
};

/** 打开详情抽屉 */
const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerApi.open();
};

/** 打开搜索抽屉 */
const handleSerachShow = () => {
  drawerApi.open();
};

/** 全屏切换 */
const handleFullShow = () => {
  screenfull.toggle();
};

/** 展开/收缩按钮点击：切换自身状态 + 向父组件派发事件 */
const arrowChange = () => {
  arrowShow.value = !arrowShow.value;
  emit('toggleChart');
};
</script>

<template>
  <div class="park-lot-table-new">
    <!-- 新增/编辑表单抽屉 -->
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>

    <!-- 数据详情抽屉 -->
    <DetailDrawer :title="`${dataObj.detailObj.induction_name}详情`">
      <div class="detail-card">
        <div
          class="detail-card-row"
          v-for="(value, key) in dataObj.detailObj"
          :key="key"
        >
          <div class="detail-row-left">
            {{
              key === 'induction_id'
                ? '诱导屏ID'
                : key === 'area'
                  ? '行政区域'
                  : key === 'type'
                    ? '车场类型'
                    : key === 'asset'
                      ? '距离范围'
                      : key === 'induction_name'
                        ? '诱导屏名称'
                        : key === 'region'
                          ? '覆盖区域'
                          : key === 'related_lot_ids'
                            ? '关联车场'
                            : key === 'push_strategy'
                              ? '推送策略'
                              : key === 'status'
                                ? '状态'
                                : key === 'create_time'
                                  ? '创建时间'
                                  : key === 'update_time'
                                    ? '更新时间'
                                    : key === 'remark'
                                      ? '备注'
                                      : key
            }}:
          </div>
          <div class="detail-row-right">
            {{ key === 'status' ? (value === '1' ? '启用' : '禁用') : value }}
          </div>
        </div>
      </div>
    </DetailDrawer>

    <!-- 搜索表单抽屉 -->
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <!-- 核心表格 -->
    <Grid>
      <!-- 表格标题栏：状态Tabs + 双维度筛选标签 -->
      <template #table-title>
        <div
          class="tabel-tabs"
          style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center"
        >
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
          <!-- 行政区域筛选标签：蓝色primary，仅筛选时显示 -->
          <ElTag
            v-if="filterArea"
            type="primary"
            closable
            @close="handleCancelAreaFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            区域：{{ filterArea }}
          </ElTag>
          <!-- 车场类型筛选标签：绿色success，仅筛选时显示 -->
          <ElTag
            v-if="filterType"
            type="success"
            closable
            @close="handleCancelTypeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            类型：{{ filterType }}
          </ElTag>
        </div>
      </template>

      <!-- 表格工具栏：新增/导出/删除/搜索等按钮 -->
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
            content="搜索"
            icon-name="search"
            @click="handleSerachShow"
          />
          <IconButton
            :content="arrowShow ? '收缩' : '展开'"
            :icon-name="arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
        </div>
      </template>

      <!-- 表格列：诱导屏名称（点击打开详情，唯一保留） -->
      <template #induction_name="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.induction_name }}
        </el-text>
      </template>

      <!-- 表格列：行政区域（点击筛选该区域） -->
      <template #area="{ row }">
        <el-text
          @click="handleFilterByArea(row.area)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.area }}
        </el-text>
      </template>

      <!-- 表格列：车场类型（点击筛选同类型） -->
      <template #type="{ row }">
        <el-text
          @click="handleFilterByType(row.type)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.type }}
        </el-text>
      </template>

      <!-- 表格列：操作栏 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
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

      <!-- 表格底部：统计信息展开/收缩 -->
      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon" v-if="!dataObj.totalShow">
            <ArrowDown />
          </el-icon>
          <el-icon class="tabel-tab-icon" v-if="dataObj.totalShow">
            <ArrowUp />
          </el-icon>
          <span> 本页统计：诱导屏数量: 10; 启用: 8; 禁用: 2 </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>

<style scoped>
/* 筛选项蓝色文字：悬浮下划线+指针，强化可点击提示 */
:deep(.el-text--primary) {
  cursor: pointer;
}

:deep(.el-text--primary):hover {
  text-decoration: underline;
  opacity: 0.9;
}

/* 表格标题栏：宽度100%，内边距优化 */
.tabel-tabs {
  width: 100%;

}

/* 详情卡片样式：间距、对齐优化 */
.detail-card {
  padding: 24px;
}

.detail-card-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 16px;
}

.detail-row-left {
  min-width: 120px;
  margin-right: 16px;
  font-weight: 500;
  color: #606266;
}

.detail-row-right {
  flex: 1;
  color: #303133;
}

/* 表格工具栏：按钮间距、自动换行 */
:deep(.common-toolbar-tools) {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 4px 0;
}

/* 表格操作列：按钮间距 */
:deep(.table-toolbar-tools) {
  display: flex;
  gap: 4px;
  justify-content: center;
}

/* 底部统计栏：鼠标指针，提示可点击 */
.common-total {
  padding: 8px 0;
  cursor: pointer;
}

.common-total-bottom {
  padding: 0px 0;
  color: #606266;
}
</style>
