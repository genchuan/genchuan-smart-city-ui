<script setup>
import { computed, reactive, ref } from 'vue';

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
  textObj,
  useConfigFormSchema,
  useFormSchema,
  useGridColumns,
  useWashCardConfigFormSchema,
  useWashCardFormSchema,
  useWashCardGridColumns,
  useWashCardQueryFormSchema,
  washCardDataList,
  washCardDetailFields,
  washCardTextObj,
} from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  activeTab: {
    type: String,
    default: '套餐信息管理',
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
  return props.activeTab === '洗车卡套餐' ? washCardTextObj : textObj;
});

const getTitle = computed(() => {
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
const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 110,
  },
  layout: 'horizontal',
  schema:
    props.activeTab === '洗车卡套餐'
      ? useWashCardFormSchema()
      : useFormSchema(),
  showDefaultActions: false,
});

const configFormData = ref();
const [ConfigForm, configFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 110,
  },
  layout: 'horizontal',
  schema:
    props.activeTab === '洗车卡套餐'
      ? useWashCardConfigFormSchema()
      : useConfigFormSchema(),
  showDefaultActions: false,
});
const [ConfigDrawer, configDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  footer: false,
  onCancel() {
    configDrawerApi.close();
  },
  onConfirm() {
    const obj = configFormApi.form.values;
    const index = dataObj.apilist.findIndex(
      (v) => v.packageId === obj.packageId,
    );
    if (index !== -1) {
      dataObj.apilist[index] = { ...dataObj.apilist[index], ...obj };
      ElMessage.success('配置更新成功');
      handleRefresh();
    }
    configDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      configFormData.value = configDrawerApi.getData();
      if (configFormData.value?.packageId) {
        await configFormApi.setValues(configFormData.value);
      } else {
        configFormApi.resetForm();
      }
    }
  },
});
const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    formDrawerApi.close();
  },
  onConfirm() {
    const obj = formApi.form.values;
    if (formDrawerApi.sharedData.payload.title === textObj.addText) {
      dataObj.apilist.push(obj);
    } else {
      dataObj.apilist.forEach((v, i) => {
        if (v.packageId === formData.value?.packageId) {
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
      if (formData.value?.packageId) {
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

/** 创建套餐 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

/** 编辑套餐 */
function handleEdit(row) {
  formDrawerApi
    .setData({
      title: textObj.editText,
      ...row,
    })
    .open();
}
// async function handleDelete(row) {
//   const loadingInstance = ElLoading.service({
//     text: $t('ui.actionMessage.deleting', [row.packageName]),
//   });
//   try {
//     dataObj.apilist = dataObj.apilist.filter(
//       (v) => v.packageId !== row.packageId,
//     );
//     ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.packageName]));
//     handleRefresh();
//   } finally {
//     loadingInstance.close();
//   }
// }

async function handleDeleteBatch() {
  await confirm($t('确定删除这些数据吗？'));
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deletingBatch'),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter(
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
  checkedIds.value = records.map((item) => item.packageId);
}
const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total:
    props.activeTab === '洗车卡套餐'
      ? washCardDataList().length
      : dataList().length,
  currentPage: 1,
  pageSize: 10,
  apilist: props.activeTab === '洗车卡套餐' ? washCardDataList() : dataList(),
  list: [],
});
const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;

  // 根据activeName筛选数据
  let filteredList = dataObj.apilist.filter((v) => {
    switch (activeName.value) {
      case '上架': {
        return props.activeTab === '洗车卡套餐'
          ? v.status === '上架'
          : v.packageStatusName === '上架';
      }
      case '下架': {
        return props.activeTab === '洗车卡套餐'
          ? v.status === '下架'
          : v.packageStatusName === '下架';
      }
      case '全部': {
        return true;
      }
    }
    return false;
  });

  // 快捷筛选
  filteredList = filteredList.filter((v) => {
    // 套餐类型筛选 - 洗车卡套餐不需要此筛选
    const packageTypeMatch =
      !filterPackageType.value ||
      (v.packageTypeName && v.packageTypeName === filterPackageType.value);

    // 适用车场筛选
    const applyLotNamesMatch =
      !filterApplyLotNames.value ||
      v.applicableParkingLot === filterApplyLotNames.value;

    // 合作洗车店筛选
    const cooperationWashShopMatch =
      !filterCooperationWashShop.value ||
      v.cooperationWashShop === filterCooperationWashShop.value;

    // 搜索表单筛选
    const searchMatch = Object.entries(searchFormValues.value).every(
      ([key, value]) => {
        if (!value) return true;
        // 转换key以匹配数据对象中的字段名
        const fieldName = key;
        if (props.activeTab === '洗车卡套餐') {
          if (fieldName === 'status') {
            return v.status === value;
          }
        } else {
          if (fieldName === 'packageStatusName') {
            return v.packageStatusName === value;
          }
          if (fieldName === 'packageTypeName') {
            return v.packageTypeName === value;
          }
        }
        if (fieldName === 'applicableParkingLot') {
          return v.applicableParkingLot === value;
        }
        if (fieldName === 'cooperationWashShop') {
          return v.cooperationWashShop === value;
        }
        if (typeof v[fieldName] === 'string') {
          return v[fieldName].includes(value);
        }
        return v[fieldName] === value;
      },
    );

    return (
      packageTypeMatch &&
      applyLotNamesMatch &&
      cooperationWashShopMatch &&
      searchMatch
    );
  });

  dataObj.total = filteredList.length;
  dataObj.list = filteredList.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  );
  return dataObj;
};

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
  layout: 'horizontal',
  schema:
    props.activeTab === '洗车卡套餐'
      ? useWashCardQueryFormSchema()
      : useFormSchema().map((v) => {
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
function onSubmit() {
  searchFormValues.value = queryFormApi.form.values;
  drawerApi.close();
  handleRefresh();
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns:
      props.activeTab === '洗车卡套餐'
        ? useWashCardGridColumns()
        : useGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => getTableData({ page }),
      },
    },
    rowConfig: {
      keyField: 'packageId',
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

// 快捷筛选变量
const filterPackageType = ref(''); // 套餐类型筛选
const filterApplyLotNames = ref(''); // 适用车场筛选
const filterCooperationWashShop = ref(''); // 合作洗车店筛选

// 搜索表单值
const searchFormValues = ref({});

const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerRef.value.open();
};

// 修改tabsData为三个标签：全部、上架、下架
const tabsData = ref([{ label: '全部' }, { label: '上架' }, { label: '下架' }]);

// 创建标签文本，显示数量统计
const createLabel = (item) => {
  let count = 0;

  switch (item.label) {
    case '上架': {
      // 统计状态为'上架'的数据
      count = dataObj.apilist.filter((v) =>
        props.activeTab === '洗车卡套餐'
          ? v.status === '上架'
          : v.packageStatusName === '上架',
      ).length;

      break;
    }
    case '下架': {
      // 统计状态为'下架'的数据
      count = dataObj.apilist.filter((v) =>
        props.activeTab === '洗车卡套餐'
          ? v.status === '下架'
          : v.packageStatusName === '下架',
      ).length;

      break;
    }
    case '全部': {
      count = dataObj.apilist.length;

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

// 状态标签类型映射
const getStatusType = (status) => {
  switch (status) {
    case '上架': {
      return 'success';
    }
    case '下架': {
      return 'danger';
    }
    default: {
      return 'info';
    }
  }
};

// 处理套餐类型点击筛选
const handlePackageTypeClick = (packageType) => {
  filterPackageType.value =
    filterPackageType.value === packageType ? '' : packageType;
  handleRefresh();
};

// 取消套餐类型筛选
const handleCancelPackageTypeFilter = () => {
  filterPackageType.value = '';
  handleRefresh();
};

// 处理适用车场点击筛选
const handleApplyLotNamesClick = (applyLotNames) => {
  filterApplyLotNames.value =
    filterApplyLotNames.value === applyLotNames ? '' : applyLotNames;
  handleRefresh();
};

// 取消适用车场筛选
const handleCancelApplyLotNamesFilter = () => {
  filterApplyLotNames.value = '';
  handleRefresh();
};

// 处理合作洗车店点击筛选
const handleCooperationWashShopClick = (cooperationWashShop) => {
  filterCooperationWashShop.value =
    filterCooperationWashShop.value === cooperationWashShop
      ? ''
      : cooperationWashShop;
  handleRefresh();
};

// 取消合作洗车店筛选
const handleCancelCooperationWashShopFilter = () => {
  filterCooperationWashShop.value = '';
  handleRefresh();
};

// 处理上下架状态切换
const handleToggleStatus = async (row) => {
  const isWashCard = props.activeTab === '洗车卡套餐';
  const currentStatus = isWashCard ? row.status : row.packageStatusName;
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
        if (isWashCard) {
          dataObj.apilist[i].status = newStatus;
        } else {
          dataObj.apilist[i].packageStatusName = newStatus;
        }
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

// 打开配置抽屉
const handleOpenConfigDrawer = (row) => {
  configDrawerApi
    .setData({
      title: textObj.configText,
      ...row,
    })
    .open();
};
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <!--   详情抽屉-->
    <DetailDrawer
      ref="detailDrawerRef"
      :title="`${dataObj.detailObj.packageName}详情`"
      :data="dataObj.detailObj"
      :fields="
        props.activeTab === '洗车卡套餐' ? washCardDetailFields : detailFields
      "
    />
    <!--   配置抽屉-->
    <ConfigDrawer :title="currentTextObj.configText">
      <ConfigForm />
    </ConfigDrawer>
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
            v-if="filterPackageType"
            type="primary"
            closable
            @close="handleCancelPackageTypeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            套餐类型：{{ filterPackageType }}
          </el-tag>
          <!-- 适用车场筛选标签：绿色success，仅筛选时显示 -->
          <el-tag
            v-if="filterApplyLotNames"
            type="success"
            closable
            @close="handleCancelApplyLotNamesFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            适用车场：{{ filterApplyLotNames }}
          </el-tag>
          <!-- 合作洗车店筛选标签：紫色info，仅筛选时显示 -->
          <el-tag
            v-if="filterCooperationWashShop"
            type="success"
            closable
            @close="handleCancelCooperationWashShopFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            合作洗车店：{{ filterCooperationWashShop }}
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
      <template #packageStatusName="{ row }">
        <el-tag :type="getStatusType(row.packageStatusName)">
          {{ row.packageStatusName }}
        </el-tag>
      </template>

      <!-- 洗车卡套餐状态插槽 -->
      <template #status="{ row }">
        <el-tag :type="getStatusType(row.status)">
          {{ row.status }}
        </el-tag>
      </template>

      <!-- 套餐类型插槽 -->
      <template #packageTypeName="{ row }">
        <el-text
          v-if="row.packageTypeName"
          @click="handlePackageTypeClick(row.packageTypeName)"
          class="common-align"
          type="primary"
        >
          {{ row.packageTypeName }}
        </el-text>
        <span v-else>-</span>
      </template>

      <!-- 适用车场插槽 -->
      <template #applicableParkingLot="{ row }">
        <el-text
          @click="handleApplyLotNamesClick(row.applicableParkingLot)"
          class="common-align"
          type="primary"
        >
          {{ row.applicableParkingLot }}
        </el-text>
      </template>

      <!-- 合作洗车店插槽 -->
      <template #cooperationWashShop="{ row }">
        <el-text
          v-if="row.cooperationWashShop"
          @click="handleCooperationWashShopClick(row.cooperationWashShop)"
          class="common-align"
          type="primary"
        >
          {{ row.cooperationWashShop }}
        </el-text>
        <span v-else>-</span>
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
          <IconButton
            :content="
              props.activeTab === '洗车卡套餐'
                ? row.status === '上架'
                  ? '下架'
                  : '上架'
                : row.packageStatusName === '上架'
                  ? '下架'
                  : '上架'
            "
            :icon-name="
              props.activeTab === '洗车卡套餐'
                ? row.status === '上架'
                  ? 'Bottom'
                  : 'Top'
                : row.packageStatusName === '上架'
                  ? 'Bottom'
                  : 'Top'
            "
            :color="
              props.activeTab === '洗车卡套餐'
                ? row.status === '上架'
                  ? '#E6A23C'
                  : '#67C23A'
                : row.packageStatusName === '上架'
                  ? '#E6A23C'
                  : '#67C23A'
            "
            @click="handleToggleStatus(row)"
          />
          <IconButton
            v-if="props.activeTab !== '洗车卡套餐'"
            content="配置"
            icon-name="Setting"
            color="#409EFF"
            @click="handleOpenConfigDrawer(row)"
          />
          <!--          <IconButton-->
          <!--            content="删除"-->
          <!--            icon-name="delete"-->
          <!--            color="#F56C6C"-->
          <!--            @click="handleDelete(row)"-->
          <!--          />-->
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
            本页统计：{{
              props.activeTab === '洗车卡套餐' ? '洗车卡套餐' : '套餐'
            }}数量: {{ dataObj.total }}; 上架:
            {{
              dataObj.apilist.filter((v) =>
                props.activeTab === '洗车卡套餐'
                  ? v.status === '上架'
                  : v.packageStatusName === '上架',
              ).length
            }}; 下架:
            {{
              dataObj.apilist.filter((v) =>
                props.activeTab === '洗车卡套餐'
                  ? v.status === '下架'
                  : v.packageStatusName === '下架',
              ).length
            }}
          </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span>
            全部统计：{{
              props.activeTab === '洗车卡套餐'
                ? washCardTextObj.total
                : textObj.total
            }}
          </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
