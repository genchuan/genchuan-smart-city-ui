<script setup>
import { computed, reactive, ref, watch } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

import {
  dataList,
  detailFields,
  salesDataList,
  salesDetailFields,
  salesTextObj,
  textObj,
  useFormSchema,
  useGridColumns,
  useSalesFormSchema,
  useSalesGridColumns,
} from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'package',
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
const currentTextObj = computed(() => {
  return props.type === 'sales' ? salesTextObj : textObj;
});

const currentDetailFields = computed(() => {
  return props.type === 'sales' ? salesDetailFields : detailFields;
});

const getTitle = computed(() => {
  if (props.type === 'sales') {
    return formData.value?.rechargeNo
      ? currentTextObj.value.editText
      : currentTextObj.value.addText;
  }
  return formData.value?.packageId
    ? currentTextObj.value.editText
    : currentTextObj.value.addText;
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
const detailDrawerRef = ref(null);
const formData = ref();
const currentFormSchema = computed(() => {
  return props.type === 'sales' ? useSalesFormSchema() : useFormSchema();
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 110,
  },
  layout: 'horizontal',
  schema: currentFormSchema.value,
  showDefaultActions: false,
});
const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    formDrawerApi.close();
  },
  onConfirm() {
    const obj = formApi.form.values;
    if (
      formDrawerApi.sharedData.payload.title === currentTextObj.value.addText
    ) {
      dataObj.apilist.push(obj);
    } else {
      dataObj.apilist.forEach((v, i) => {
        if (props.type === 'sales') {
          if (v.rechargeNo === formData.value?.rechargeNo) {
            dataObj.apilist[i] = obj;
          }
        } else {
          if (v.packageId === formData.value?.packageId) {
            dataObj.apilist[i] = obj;
          }
        }
      });
    }
    handleRefresh();
    formDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
      if (
        props.type === 'sales'
          ? formData.value?.rechargeNo
          : formData.value?.packageId
      ) {
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
  exportToExcel(
    dataObj.apilist,
    currentTextObj.value.excelName,
    currentTextObj.value.excelAllName,
  );
}

/** 创建套餐或销售记录 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: currentTextObj.value.addText,
    })
    .open();
}

/** 编辑套餐或销售记录 */
function handleEdit(row) {
  formDrawerApi
    .setData({
      title: currentTextObj.value.editText,
      ...row,
    })
    .open();
}
async function handleDelete(row) {
  const itemName = props.type === 'sales' ? row.rechargeNo : row.packageName;
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [itemName]),
  });
  try {
    dataObj.apilist =
      props.type === 'sales'
        ? dataObj.apilist.filter((v) => v.rechargeNo !== row.rechargeNo)
        : dataObj.apilist.filter((v) => v.packageId !== row.packageId);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [itemName]));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

async function handleDeleteBatch() {
  await confirm($t('确定删除这些数据吗？'));
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deletingBatch'),
  });
  try {
    dataObj.apilist =
      props.type === 'sales'
        ? dataObj.apilist.filter(
            (v) => !checkedIds.value.includes(v.rechargeNo),
          )
        : dataObj.apilist.filter(
            (v) => !checkedIds.value.includes(v.packageId),
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
  checkedIds.value = records.map((item) =>
    props.type === 'sales' ? item.rechargeNo : item.packageId,
  );
}
const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: props.type === 'sales' ? salesDataList().length : dataList().length,
  currentPage: 1,
  pageSize: 10,
  apilist: props.type === 'sales' ? salesDataList() : dataList(),
  list: [],
  searchParams: {},
});
const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;

  // 根据activeName、套餐类型、支付方式和搜索参数筛选数据
  const filteredList = dataObj.apilist.filter((v) => {
    // 状态筛选
    let statusMatch = true;
    if (props.type === 'sales') {
      switch (activeName.value) {
        case '处理中': {
          statusMatch = v.rechargeStatus === '处理中';
          break;
        }
        case '失败': {
          statusMatch = v.rechargeStatus === '失败';
          break;
        }
        case '成功': {
          statusMatch = v.rechargeStatus === '成功';
          break;
        }
        case '退款': {
          statusMatch = v.rechargeStatus === '退款';
          break;
        }
      }
    } else {
      switch (activeName.value) {
        case '上架': {
          statusMatch = v.packageStatusName === '上架';
          break;
        }
        case '下架': {
          statusMatch = v.packageStatusName === '下架';
          break;
        }
      }
    }

    // 套餐类型筛选
    const rechargeTypeMatch =
      !filterRechargeType.value ||
      v.rechargeTypeName === filterRechargeType.value;

    // 支付方式筛选
    const payTypeMatch =
      !filterPayType.value || v.payType === filterPayType.value;

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

    return statusMatch && rechargeTypeMatch && payTypeMatch && searchMatch;
  });

  dataObj.total = filteredList.length;
  dataObj.list = filteredList.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  );
  return dataObj;
};

const [QueryForm] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: currentFormSchema.value.map((v) => {
    delete v.rules;
    return {
      ...v,
    };
  }),
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

const currentGridColumns = computed(() => {
  return props.type === 'sales' ? useSalesGridColumns() : useGridColumns();
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: currentGridColumns.value,
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => getTableData({ page }),
      },
    },
    rowConfig: {
      keyField: props.type === 'sales' ? 'rechargeNo' : 'packageId',
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
const filterRechargeType = ref(''); // 套餐类型筛选：空=未筛选，有值=当前筛选套餐类型
const filterPayType = ref(''); // 支付方式筛选：空=未筛选，有值=当前筛选支付方式

const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerRef.value.open();
};

// 处理套餐类型点击
const handleRechargeTypeClick = (type) => {
  filterRechargeType.value = filterRechargeType.value === type ? '' : type;
  gridApi.query();
};

/** 取消套餐类型筛选（筛选标签关闭按钮） */
const handleCancelRechargeTypeFilter = () => {
  filterRechargeType.value = '';
  gridApi.query();
};

// 处理支付方式点击
const handlePayTypeClick = (payType) => {
  filterPayType.value = filterPayType.value === payType ? '' : payType;
  gridApi.query();
};

/** 取消支付方式筛选（筛选标签关闭按钮） */
const handleCancelPayTypeFilter = () => {
  filterPayType.value = '';
  gridApi.query();
};

// 根据类型设置标签数据
const tabsData = computed(() => {
  if (props.type === 'sales') {
    return [
      { label: '全部' },
      { label: '成功' },
      { label: '失败' },
      { label: '处理中' },
      { label: '退款' },
    ];
  }
  return [{ label: '全部' }, { label: '上架' }, { label: '下架' }];
});

// 创建标签文本，显示数量统计
const createLabel = (item) => {
  let count = 0;

  if (props.type === 'sales') {
    switch (item.label) {
      case '全部': {
        count = dataObj.apilist.length;
        break;
      }
      case '处理中': {
        // 统计rechargeStatus为'处理中'的数据
        count = dataObj.apilist.filter(
          (v) => v.rechargeStatus === '处理中',
        ).length;
        break;
      }
      case '失败': {
        // 统计rechargeStatus为'失败'的数据
        count = dataObj.apilist.filter(
          (v) => v.rechargeStatus === '失败',
        ).length;
        break;
      }
      case '成功': {
        // 统计rechargeStatus为'成功'的数据
        count = dataObj.apilist.filter(
          (v) => v.rechargeStatus === '成功',
        ).length;
        break;
      }
      case '退款': {
        // 统计rechargeStatus为'退款'的数据
        count = dataObj.apilist.filter(
          (v) => v.rechargeStatus === '退款',
        ).length;
        break;
      }
    }
  } else {
    switch (item.label) {
      case '上架': {
        // 统计packageStatusName为'上架'的数据
        count = dataObj.apilist.filter(
          (v) => v.packageStatusName === '上架',
        ).length;
        break;
      }
      case '下架': {
        // 统计packageStatusName为'下架'的数据
        count = dataObj.apilist.filter(
          (v) => v.packageStatusName === '下架',
        ).length;
        break;
      }
      case '全部': {
        count = dataObj.apilist.length;
        break;
      }
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

// 处理上下架状态切换
const handleToggleStatus = async (row) => {
  const currentStatus = row.packageStatusName;
  const newStatus = currentStatus === '上架' ? '下架' : '上架';
  const confirmMessage =
    currentStatus === '上架' ? '确定要下架该套餐吗？' : '确定要上架该套餐吗？';

  try {
    await ElMessageBox.confirm(confirmMessage, '操作确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    const loadingInstance = ElLoading.service({
      text: `正在${newStatus}套餐...`,
    });

    // 更新数据中的状态
    dataObj.apilist.forEach((v, i) => {
      if (v.packageId === row.packageId) {
        dataObj.apilist[i].packageStatusName = newStatus;
      }
    });

    ElMessage.success(`${newStatus}成功`);
    handleRefresh();

    loadingInstance.close();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败');
    }
  }
};

// 处理退款
async function handleRefund(row) {
  try {
    await ElMessageBox.confirm('确定要退款该充值记录吗？', '操作确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    const loadingInstance = ElLoading.service({
      text: '正在处理退款...',
    });

    // 更新数据中的状态
    dataObj.apilist.forEach((v, i) => {
      if (v.rechargeNo === row.rechargeNo) {
        dataObj.apilist[i].rechargeStatus = '退款';
      }
    });

    ElMessage.success('退款成功');
    handleRefresh();

    loadingInstance.close();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败');
    }
  }
}

// 状态标签类型映射
const getStatusType = (status) => {
  switch (status) {
    case '上架': {
      return 'success';
    }
    case '下架': {
      return 'danger';
    }
    case '处理中': {
      return 'warning';
    }
    case '失败': {
      return 'danger';
    }
    case '成功': {
      return 'success';
    }
    case '退款': {
      return 'info';
    }
    default: {
      return 'info';
    }
  }
};

// 监听props.type变化，更新数据

watch(
  () => props.type,
  (newType) => {
    // 重置数据为对应类型的数据
    dataObj.apilist = newType === 'sales' ? salesDataList() : dataList();
    dataObj.total = dataObj.apilist.length;
    activeName.value = '全部';
    // 重新查询数据
    gridApi.query();
  },
  { immediate: false },
);
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <!--   详情抽屉-->
    <DetailDrawer
      ref="detailDrawerRef"
      :title="`${props.type === 'sales' ? dataObj.detailObj.rechargeNo : dataObj.detailObj.packageName}详情`"
      :data="dataObj.detailObj"
      :fields="currentDetailFields"
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
          <!-- 套餐类型筛选标签：蓝色primary，仅筛选时显示 -->
          <el-tag
            v-if="filterRechargeType"
            type="primary"
            closable
            @close="handleCancelRechargeTypeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            套餐类型：{{ filterRechargeType }}
          </el-tag>
          <!-- 支付方式筛选标签：绿色success，仅筛选时显示 -->
          <el-tag
            v-if="filterPayType"
            type="success"
            closable
            @close="handleCancelPayTypeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            支付方式：{{ filterPayType }}
          </el-tag>
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
      <template #packageId="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.packageId }}
        </el-text>
      </template>
      <template #rechargeNo="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.rechargeNo }}
        </el-text>
      </template>
      <template #packageName="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.packageName }}
        </el-text>
      </template>
      <template #packageStatusName="{ row }">
        <el-tag :type="getStatusType(row.packageStatusName)">
          {{ row.packageStatusName }}
        </el-tag>
      </template>
      <template #rechargeStatus="{ row }">
        <el-tag
          :type="
            row.rechargeStatus === '成功'
              ? 'success'
              : row.rechargeStatus === '失败'
                ? 'danger'
                : row.rechargeStatus === '处理中'
                  ? 'warning'
                  : 'info'
          "
        >
          {{ row.rechargeStatus }}
        </el-tag>
      </template>
      <template #rechargeTypeName="{ row }">
        <el-text
          @click="handleRechargeTypeClick(row.rechargeTypeName)"
          class="common-align"
          type="primary"
        >
          {{ row.rechargeTypeName }}
        </el-text>
      </template>
      <template #payType="{ row }">
        <el-text
          @click="handlePayTypeClick(row.payType)"
          class="common-align"
          type="primary"
        >
          {{ row.payType }}
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
            icon-name="edit"
            @click="handleEdit(row)"
          />
          <template v-if="props.type !== 'sales'">
            <IconButton
              :content="row.packageStatusName === '上架' ? '下架' : '上架'"
              :icon-name="row.packageStatusName === '上架' ? 'Bottom' : 'Top'"
              :color="row.packageStatusName === '上架' ? '#E6A23C' : '#67C23A'"
              @click="handleToggleStatus(row)"
            />
          </template>
          <template
            v-if="props.type === 'sales' && row.rechargeStatus === '成功'"
          >
            <IconButton
              content="退款"
              icon-name="RefreshRight"
              color="#409EFF"
              @click="handleRefund(row)"
            />
          </template>
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
          <span> 本页统计：充值套餐数量: 15; 上架: 12; 下架: 3 </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> 全部统计：{{ currentTextObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
