<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import DetailDrawer from '#/components/common/DetailDrawer.vue';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

import {
  dataList,
  getRateDetailFields,
  getStatusTagType,
  textObj,
  useFormSchema,
  useGridColumns,
} from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  rateType: {
    type: String,
    default: 'base',
  },
  showStats: {
    type: Boolean,
    default: false,
  },
  toggleStats: {
    type: Function,
    default: () => {},
  },
});
const getTitle = computed(() => {
  return formData.value?.feeStrategyId ? textObj.editText : textObj.addText;
});

// 当前费率类型
const currentTabType = computed(() => {
  return props.rateType;
});

// 详情字段配置
const detailFields = computed(() => {
  return getRateDetailFields(currentTabType.value);
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
  schema: useFormSchema(currentTabType.value),
  showDefaultActions: false,
});

// 生成新的策略ID
const generateNewStrategyId = () => {
  // 从现有数据中获取最大ID，然后自增
  const maxId = dataObj.apilist.reduce((max, item) => {
    const idNum = Number.parseInt(item.feeStrategyId.replace('FEE', ''));
    return Math.max(idNum, max);
  }, 0);
  return `FEE${String(maxId + 1).padStart(3, '0')}`;
};

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    formDrawerApi.close();
  },
  onConfirm() {
    const obj = formApi.form.values;
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    if (formDrawerApi.sharedData.payload.title === textObj.addText) {
      // 新增时生成唯一的策略ID
      const newObj = {
        ...obj,
        feeStrategyId: generateNewStrategyId(),
        createTime: now,
        updateTime: now,
        createUserName: '管理员',
      };
      dataObj.apilist.push(newObj);
    } else {
      // 编辑时保留原有ID和创建时间
      dataObj.apilist.forEach((v, i) => {
        if (v.feeStrategyId === formData.value?.feeStrategyId) {
          dataObj.apilist[i] = {
            ...obj,
            feeStrategyId: formData.value.feeStrategyId,
            createTime: formData.value.createTime || now,
            updateTime: now,
            createUserName: formData.value.createUserName || '管理员',
          };
        }
      });
    }
    handleRefresh();
    formDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
      if (formData.value?.feeStrategyId) {
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
  // 导出当前标签页下的数据
  const filteredList = dataObj.apilist.filter((v) => {
    switch (activeName.value) {
      case '全部': {
        return true;
      }
      case '启用': {
        return v.status === '启用';
      }
      case '禁用': {
        return v.status === '禁用';
      }
      default: {
        return true;
      }
    }
  });
  exportToExcel(filteredList, textObj.excelName, textObj.excelAllName);
}

/** 创建策略 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

/** 编辑策略 */
function handleEdit(row) {
  formDrawerApi
    .setData({
      title: textObj.editText,
      ...row,
    })
    .open();
}

/** 删除策略 */
async function handleDelete(row) {
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [row.strategyName]),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter(
      (v) => v.feeStrategyId !== row.feeStrategyId,
    );
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.strategyName]));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

/** 批量删除策略 */
async function handleDeleteBatch() {
  await confirm($t('确定删除这些数据吗？'));
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deletingBatch'),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter(
      (v) => !checkedIds.value.includes(v.feeStrategyId),
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
  checkedIds.value = records.map((item) => item.feeStrategyId);
}

const dataObj = reactive({
  totalShow: false,
  total: dataList(currentTabType.value).length,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(currentTabType.value),
  list: [],
  searchParams: {},
});
const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;

  // 根据activeName和searchParams筛选数据
  const filteredList = dataObj.apilist.filter((v) => {
    // 状态筛选
    let statusMatch = true;
    switch (activeName.value) {
      case '启用': {
        statusMatch = v.status === '启用';
        break;
      }
      case '禁用': {
        statusMatch = v.status === '禁用';
        break;
      }
    }

    // 适用范围筛选
    const applyScopeMatch =
      !filterApplyScope.value || v.applyScope === filterApplyScope.value;

    // 区域名称筛选
    const regionNameMatch =
      !filterRegionName.value || v.regionName === filterRegionName.value;

    // 搜索条件筛选
    let searchMatch = true;
    Object.keys(dataObj.searchParams).forEach((key) => {
      const value = dataObj.searchParams[key];
      if (value) {
        searchMatch =
          typeof value === 'string'
            ? searchMatch && v[key]?.toString().includes(value)
            : searchMatch && v[key] === value;
      }
    });

    return statusMatch && applyScopeMatch && regionNameMatch && searchMatch;
  });

  dataObj.total = filteredList.length;
  dataObj.list = filteredList.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  );
  return dataObj;
};

const [QueryForm] = useVbenForm({
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
  schema: useFormSchema(currentTabType.value).map((v) => {
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
function onSubmit(values) {
  dataObj.searchParams = values;
  handleRefresh();
  drawerApi.close();
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(currentTabType.value),
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => getTableData({ page }),
      },
    },
    rowConfig: {
      keyField: 'feeStrategyId',
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

const activeName = ref('全部');
const filterApplyScope = ref(''); // 适用范围筛选：空=未筛选，有值=当前筛选适用范围
const filterRegionName = ref(''); // 区域名称筛选：空=未筛选，有值=当前筛选区域名称

// 选中的策略详情
const selectedStrategy = ref(null);

// 详情抽屉引用
const detailDrawerRef = ref(null);

// 处理详情抽屉关闭
const handleDetailClose = () => {
  selectedStrategy.value = null;
};

// 修改tabsData为三个标签：全部、启用、禁用
const tabsData = ref([{ label: '全部' }, { label: '启用' }, { label: '禁用' }]);

// 创建标签文本，显示数量统计
const createLabel = (item) => {
  let count = 0;

  switch (item.label) {
    case '全部': {
      count = dataObj.apilist.length;
      break;
    }
    case '启用': {
      count = dataObj.apilist.filter((v) => v.status === '启用').length;
      break;
    }
    case '禁用': {
      count = dataObj.apilist.filter((v) => v.status === '禁用').length;
      break;
    }
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

// 处理策略ID点击
const handleFeeStrategyIdClick = (row) => {
  handleOpenDetail(row);
};

// 处理适用范围点击
const handleApplyScopeClick = (scope) => {
  filterApplyScope.value = filterApplyScope.value === scope ? '' : scope;
  gridApi.query();
};
/** 取消适用范围筛选（筛选标签关闭按钮） */
const handleCancelApplyScopeFilter = () => {
  filterApplyScope.value = '';
  gridApi.query();
};

// 处理区域名称点击
const handleRegionNameClick = (regionName) => {
  filterRegionName.value =
    filterRegionName.value === regionName ? '' : regionName;
  gridApi.query();
};

/** 取消区域名称筛选（筛选标签关闭按钮） */
const handleCancelRegionNameFilter = () => {
  filterRegionName.value = '';
  gridApi.query();
};

// 处理状态点击
const handleStatusClick = (status) => {
  activeName.value = status;
  handleRefresh();
};

// 处理打开详情抽屉
const handleOpenDetail = (row) => {
  selectedStrategy.value = row;
  if (detailDrawerRef.value) {
    detailDrawerRef.value.open();
  }
};
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>

    <!-- 详情抽屉 -->
    <DetailDrawer
      ref="detailDrawerRef"
      :title="selectedStrategy?.strategyName || '策略详情'"
      :data="selectedStrategy"
      :fields="detailFields"
      @close="handleDetailClose"
      @confirm="handleDetailClose"
    />

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <Grid>
      <!-- 三级状态 -->
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
          <!-- 适用范围筛选标签：蓝色primary，仅筛选时显示 -->
          <ElTag
            v-if="filterApplyScope"
            type="primary"
            closable
            @close="handleCancelApplyScopeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            适用范围：{{ filterApplyScope }}
          </ElTag>
          <!-- 区域名称筛选标签：绿色success，仅筛选时显示 -->
          <ElTag
            v-if="filterRegionName"
            type="success"
            closable
            @close="handleCancelRegionNameFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            区域名称：{{ filterRegionName }}
          </ElTag>
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
            content="搜索"
            icon-name="search"
            @click="handleSerachShow"
          />
          <IconButton
            :content="props.showStats ? '隐藏统计' : '显示统计'"
            :icon-name="props.showStats ? 'ArrowUp' : 'ArrowDown'"
            @click="props.toggleStats"
          />
          <IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
        </div>
      </template>

      <!-- 策略ID插槽 -->
      <template #feeStrategyId="{ row }">
        <el-text
          @click="handleFeeStrategyIdClick(row)"
          class="common-align"
          type="primary"
        >
          {{ row.feeStrategyId }}
        </el-text>
      </template>

      <!-- 适用范围插槽 -->
      <template #applyScope="{ row }">
        <el-text
          @click="handleApplyScopeClick(row.applyScope)"
          class="common-align"
          type="primary"
        >
          {{ row.applyScope }}
        </el-text>
      </template>

      <!-- 区域名称插槽 -->
      <template #regionName="{ row }">
        <el-text
          @click="handleRegionNameClick(row.regionName)"
          class="common-align"
          type="primary"
        >
          {{ row.regionName }}
        </el-text>
      </template>

      <!-- 状态插槽 -->
      <template #status="{ row }">
        <ElTag
          :type="getStatusTagType(row.status)"
          @click="handleStatusClick(row.status)"
          class="cursor-pointer"
        >
          {{ row.status }}
        </ElTag>
      </template>

      <!-- 操作插槽 -->
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

      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon" v-if="!dataObj.totalShow">
            <ArrowDown />
          </el-icon>
          <el-icon class="tabel-tab-icon" v-if="dataObj.totalShow">
            <ArrowUp />
          </el-icon>
          <span>
            本页统计：策略数量: {{ dataObj.total }}; 启用:
            {{ dataObj.apilist.filter((v) => v.status === '启用').length }};
            禁用:
            {{ dataObj.apilist.filter((v) => v.status === '禁用').length }}
          </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
