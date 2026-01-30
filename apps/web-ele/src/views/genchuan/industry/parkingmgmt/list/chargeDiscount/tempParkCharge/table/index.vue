<script setup>
import { computed, reactive, ref, watch } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ArrowDown } from '@element-plus/icons-vue';
import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import DetailDrawer from '#/components/common/DetailDrawer.vue';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

import {
  dataList,
  getCarByNumber,
  getLotByNames,
  textObj,
  useDetailFields,
  useFormSchema,
  useGridColumns,
} from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  tabType: {
    type: String,
    default: 'chargeRule',
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
  return formData.value?.feeTempId || formData.value?.orderNo
    ? textObj.editText
    : textObj.addText;
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
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useFormSchema(props.tabType),
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
    const drawerData = formDrawerApi.getData();
    const hasId = drawerData.feeTempId || drawerData.orderNo;

    if (hasId) {
      // 编辑
      dataObj.apilist.forEach((v, i) => {
        if (
          props.tabType === 'chargeRule' &&
          v.feeTempId === drawerData.feeTempId
        ) {
          dataObj.apilist[i] = {
            ...v,
            ...obj,
            updateTime: new Date().toLocaleString('zh-CN'),
          };
        } else if (
          (props.tabType === 'feeCalculation' ||
            props.tabType === 'discountManagement') &&
          v.orderNo === drawerData.orderNo
        ) {
          dataObj.apilist[i] = {
            ...v,
            ...obj,
          };
        }
      });
    } else {
      // 新增
      const newObj = {
        ...obj,
        createTime: new Date().toLocaleString('zh-CN'),
        updateTime: new Date().toLocaleString('zh-CN'),
        operator: '当前用户',
      };
      if (props.tabType === 'chargeRule') {
        // 自动生成规则ID
        const maxId = Math.max(
          ...dataObj.apilist.map(
            (item) => Number.parseInt(item.feeTempId.replace('FTR', '')) || 0,
          ),
        );
        const newId = `FTR${String(maxId + 1).padStart(3, '0')}`;
        newObj.feeTempId = newId;
      }
      dataObj.apilist.push(newObj);
    }
    handleRefresh();
    formDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
      if (formData.value?.feeTempId || formData.value?.orderNo) {
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
  const excelName = {
    chargeRule: '收费规则管理',
    feeCalculation: '费用核算管理',
    discountManagement: '优惠抵扣管理',
  }[props.tabType];
  const excelAllName = `${excelName}.xlsx`;
  exportToExcel(dataObj.apilist, excelName, excelAllName);
}

/** 创建 */
function handleCreate() {
  formApi.schema = useFormSchema(props.tabType);
  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

/** 编辑 */
function handleEdit(row) {
  formApi.schema = useFormSchema(props.tabType);
  formDrawerApi
    .setData({
      title: textObj.editText,
      ...row,
    })
    .open();
}

async function handleDelete(row) {
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [row.ruleName || row.orderNo]),
  });
  try {
    dataObj.apilist =
      props.tabType === 'chargeRule'
        ? dataObj.apilist.filter((v) => v.feeTempId !== row.feeTempId)
        : dataObj.apilist.filter((v) => v.orderNo !== row.orderNo);
    ElMessage.success(
      $t('ui.actionMessage.deleteSuccess', [row.ruleName || row.orderNo]),
    );
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
      props.tabType === 'chargeRule'
        ? dataObj.apilist.filter((v) => !checkedIds.value.includes(v.feeTempId))
        : dataObj.apilist.filter((v) => !checkedIds.value.includes(v.orderNo));
    checkedIds.value = [];
    ElMessage.success($t('删除成功'));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value =
    props.tabType === 'chargeRule'
      ? records.map((item) => item.feeTempId)
      : records.map((item) => item.orderNo);
}

const activeStatus = ref('全部');
const searchParams = ref({});

// 快捷筛选变量
const filterStrategyName = ref(''); // 关联费率策略/费率策略筛选
const filterCouponType = ref(''); // 优惠券类型筛选

const dataObj = reactive({
  totalShow: false,
  total: dataList(props.tabType).length,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(props.tabType),
  list: [],
});

// 监听标签类型变化，更新数据
const tabTypeWatcher = watch(
  () => props.tabType,
  (newTabType) => {
    dataObj.apilist = dataList(newTabType);
    dataObj.total = dataObj.apilist.length;
    dataObj.currentPage = 1;
    activeStatus.value = '全部';
    searchParams.value = {};
    if (gridApi) {
      handleRefresh();
    }
  },
  { immediate: false },
);

const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

// 表格数据获取
const getTableData = async (pageObj) => {
  const page = pageObj.page;

  // 根据activeStatus筛选数据
  let filteredList = dataObj.apilist.filter((v) => {
    if (activeStatus.value === '全部') {
      return true;
    }
    switch (props.tabType) {
      case 'chargeRule': {
        return activeStatus.value === '启用'
          ? v.status === '1'
          : v.status === '0';
      }
      case 'discountManagement': {
        switch (activeStatus.value) {
          case '启用': {
            return v.couponStatus === '1';
          }
          case '已过期': {
            return v.couponStatus === '2';
          }
          case '禁用': {
            return v.couponStatus === '0';
          }
          default: {
            return true;
          }
        }

        break;
      }
      case 'feeCalculation': {
        return v.calculateResult === activeStatus.value;
      }
      default: {
        return true;
      }
    }
  });

  // 快捷筛选
  filteredList = filteredList.filter((v) => {
    // 关联费率策略/费率策略筛选
    const strategyMatch =
      !filterStrategyName.value ||
      v.strategyName === filterStrategyName.value ||
      v.strategyName === filterStrategyName.value;

    // 优惠券类型筛选
    const couponTypeMatch =
      !filterCouponType.value || v.couponType === filterCouponType.value;

    return strategyMatch && couponTypeMatch;
  });

  // 搜索条件筛选
  filteredList = filteredList.filter((v) => {
    for (const key in searchParams.value) {
      if (searchParams.value[key]) {
        const searchValue = searchParams.value[key].toString().toLowerCase();
        const itemValue = v[key]?.toString().toLowerCase() || '';
        if (!itemValue.includes(searchValue)) {
          return false;
        }
      }
    }
    return true;
  });

  const total = filteredList.length;
  const list = filteredList.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  );
  dataObj.total = total;
  dataObj.list = list;
  return {
    list,
    total,
  };
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
  // 水平布局，label和input在同一行
  layout: 'horizontal',
  schema: useFormSchema(props.tabType).map((v) => {
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
  searchParams.value = values;
  drawerApi.close();
  handleRefresh();
}

// 监听标签类型变化，更新搜索表单
watch(
  () => props.tabType,
  (newTabType) => {
    QueryForm.schema = useFormSchema(newTabType).map((v) => {
      delete v.rules;
      return {
        ...v,
      };
    });
  },
  { immediate: true },
);

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(props.tabType),
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => getTableData({ page }),
      },
    },
    rowConfig: {
      keyField: props.tabType === 'chargeRule' ? 'feeTempId' : 'orderNo',
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

// 监听标签类型变化，更新表格列
const columnWatcher = watch(
  () => props.tabType,
  (newTabType) => {
    if (gridApi) {
      gridApi.setColumns(useGridColumns(newTabType));
      handleRefresh();
    }
  },
  { immediate: false },
);

// 初始化数据
setTimeout(() => {
  if (gridApi) {
    handleRefresh();
  }
}, 0);

// 状态标签页
const getStatusTabs = () => {
  switch (props.tabType) {
    case 'chargeRule': {
      return [
        { label: '全部', value: '全部' },
        { label: '启用', value: '启用' },
        { label: '禁用', value: '禁用' },
      ];
    }
    case 'discountManagement': {
      return [
        { label: '全部', value: '全部' },
        { label: '启用', value: '启用' },
        { label: '禁用', value: '禁用' },
        { label: '已过期', value: '已过期' },
      ];
    }
    case 'feeCalculation': {
      return [
        { label: '全部', value: '全部' },
        { label: '正常计费', value: '正常计费' },
        { label: '免费', value: '免费' },
        { label: 'VIP优惠', value: 'VIP优惠' },
        { label: '新能源车优惠', value: '新能源车优惠' },
        { label: '夜间优惠', value: '夜间优惠' },
        { label: '居民区优惠', value: '居民区优惠' },
      ];
    }
    default: {
      return [];
    }
  }
};
const statusTabs = computed(() => getStatusTabs());

const handleStatusChange = () => {
  handleRefresh();
};

// 创建标签文本，显示数量统计
const createLabel = (item) => {
  let count = 0;

  switch (props.tabType) {
    case 'chargeRule': {
      count =
        item.value === '全部'
          ? dataObj.apilist.length
          : dataObj.apilist.filter((v) =>
              item.value === '启用' ? v.status === '1' : v.status === '0',
            ).length;

      break;
    }
    case 'discountManagement': {
      count =
        item.value === '全部'
          ? dataObj.apilist.length
          : dataObj.apilist.filter((v) => {
              switch (item.value) {
                case '启用': {
                  return v.couponStatus === '1';
                }
                case '已过期': {
                  return v.couponStatus === '2';
                }
                case '禁用': {
                  return v.couponStatus === '0';
                }
                default: {
                  return true;
                }
              }
            }).length;

      break;
    }
    case 'feeCalculation': {
      count =
        item.value === '全部'
          ? dataObj.apilist.length
          : dataObj.apilist.filter((v) => v.calculateResult === item.value)
              .length;

      break;
    }
    // No default
  }

  return `${item.label}(${count})`;
};

const handleSerachShow = () => {
  drawerApi.open();
};
const handleFullShow = () => {
  screenfull.toggle();
};

// 详情抽屉
const selectedDetailRow = ref(null);
const detailDrawerRef = ref(null);
const handleOpenDetail = (row) => {
  selectedDetailRow.value = row;
  if (detailDrawerRef.value) {
    detailDrawerRef.value.open();
  }
};
// 处理规则ID点击
const handleFeeTempIdClick = (row) => {
  handleOpenDetail(row);
};
const handleOrderNoClick = (row) => {
  handleOpenDetail(row);
};
const handleDetailClose = () => {
  selectedDetailRow.value = null;
};

// 车场详情抽屉
const selectedLotRow = ref(null);
const lotDetailDrawerRef = ref(null);
const handleOpenLotData = (row) => {
  // 获取车场详情数据
  const lotDetails = getLotByNames(row.applyLotNames);
  // 传递所有车场的详情，DetailDrawer组件会为每个车场创建一个详情卡片
  selectedLotRow.value = lotDetails;
  if (lotDetailDrawerRef.value) {
    lotDetailDrawerRef.value.open();
  }
};
const handleLotDetailClose = () => {
  selectedLotRow.value = null;
};

// 车场详情字段配置
const useLotDetailFields = () => {
  return [
    { label: '车场ID', key: 'lot_id' },
    { label: '车场名称', key: 'name' },
    { label: '资产扩展ID', key: 'asset_extend_id' },
    { label: '总车位数', key: 'total_space' },
    { label: '当前可用车位数', key: 'available_space' },
    { label: '车场类型', key: 'park_type' },
    { label: '开放时间', key: 'open_time' },
    {
      label: '关闭时间',
      key: 'close_time',
      formatter: (value) => value || '24小时',
    },
    { label: '运营商户ID', key: 'management_merchant_id' },
    { label: '默认费率策略ID', key: 'fee_strategy_id' },
    { label: '创建时间', key: 'create_time' },
    { label: '更新时间', key: 'update_time' },
    { label: '备注', key: 'remark' },
  ];
};

// 车辆详情抽屉
const selectedCarRow = ref(null);
const carDetailDrawerRef = ref(null);
const handleOpenCarInfoData = (row) => {
  // 获取车辆详情数据
  const carDetails = getCarByNumber(row.carNumber);
  selectedCarRow.value = carDetails;
  if (carDetailDrawerRef.value) {
    carDetailDrawerRef.value.open();
  }
};
const handleCarDetailClose = () => {
  selectedCarRow.value = null;
};

// 车辆详情字段配置
const useCarDetailFields = () => {
  return [
    { label: '车辆ID', key: 'car_id' },
    { label: '车牌', key: 'car_number' },
    { label: '车辆类型', key: 'car_type' },
    { label: '用户ID', key: 'user_id' },
    { label: '品牌', key: 'brand' },
    { label: '颜色', key: 'color' },
    { label: '绑定状态', key: 'bind_status' },
    { label: '创建时间', key: 'create_time' },
    { label: '更新时间', key: 'update_time' },
    { label: '备注', key: 'remark' },
  ];
};

// 处理策略名称点击筛选
const handleStrategyNameClick = (strategyName) => {
  filterStrategyName.value =
    filterStrategyName.value === strategyName ? '' : strategyName;
  handleRefresh();
};

// 取消策略名称筛选
const handleCancelStrategyNameFilter = () => {
  filterStrategyName.value = '';
  handleRefresh();
};

// 处理优惠券类型点击筛选
const handleCouponTypeClick = (couponType) => {
  filterCouponType.value =
    filterCouponType.value === couponType ? '' : couponType;
  handleRefresh();
};

// 取消优惠券类型筛选
const handleCancelCouponTypeFilter = () => {
  filterCouponType.value = '';
  handleRefresh();
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
      :title="
        selectedDetailRow?.ruleName || selectedDetailRow?.orderNo || '详情'
      "
      :data="selectedDetailRow"
      :fields="useDetailFields(props.tabType)"
      @close="handleDetailClose"
      @confirm="handleDetailClose"
    />

    <!-- 车场详情抽屉 -->
    <DetailDrawer
      ref="lotDetailDrawerRef"
      title="车场详情"
      :data="selectedLotRow"
      :fields="useLotDetailFields()"
      @close="handleLotDetailClose"
      @confirm="handleLotDetailClose"
    />

    <!-- 车辆详情抽屉 -->
    <DetailDrawer
      ref="carDetailDrawerRef"
      :title="
        selectedCarRow ? `车辆详情 - ${selectedCarRow.car_number}` : '车辆详情'
      "
      :data="selectedCarRow"
      :fields="useCarDetailFields()"
      @close="handleCarDetailClose"
      @confirm="handleCarDetailClose"
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
              v-model="activeStatus"
              class="demo-tabs"
              @tab-change="handleStatusChange"
            >
              <el-tab-pane
                v-for="item in statusTabs"
                :key="item.value"
                :label="createLabel(item)"
                :name="item.value"
              />
            </el-tabs>
          </div>
          <!-- 策略名称筛选标签：蓝色primary，仅筛选时显示 -->
          <el-tag
            v-if="filterStrategyName"
            type="primary"
            closable
            @close="handleCancelStrategyNameFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            策略名称：{{ filterStrategyName }}
          </el-tag>
          <!-- 优惠券类型筛选标签：绿色success，仅筛选时显示 -->
          <el-tag
            v-if="filterCouponType"
            type="success"
            closable
            @close="handleCancelCouponTypeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            优惠券类型：{{ filterCouponType }}
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
      <!-- 策略ID插槽 -->
      <template #feeTempId="{ row }">
        <el-text
          @click="handleFeeTempIdClick(row)"
          class="common-align"
          type="primary"
        >
          {{ row.feeTempId }}
        </el-text>
      </template>

      <!-- 订单号插槽 -->
      <template #orderNo="{ row }">
        <el-text
          @click="handleOrderNoClick(row)"
          class="common-align"
          type="primary"
        >
          {{ row.orderNo }}
        </el-text>
      </template>

      <!-- 状态插槽 -->
      <template #status="{ row }">
        <el-tag
          v-if="props.tabType === 'chargeRule'"
          :type="row.status === '1' ? 'success' : 'danger'"
        >
          {{ row.status === '1' ? '启用' : '禁用' }}
        </el-tag>
        <el-tag
          v-else-if="props.tabType === 'discountManagement'"
          :type="
            row.couponStatus === '1'
              ? 'success'
              : row.couponStatus === '0'
                ? 'danger'
                : 'info'
          "
        >
          {{
            row.couponStatus === '1'
              ? '启用'
              : row.couponStatus === '0'
                ? '禁用'
                : '已过期'
          }}
        </el-tag>
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
            content="删除"
            icon-name="delete"
            color="#F56C6C"
            @click="handleDelete(row)"
          />
        </div>
      </template>

      <template #applyLotNames="{ row }">
        <el-text
          @click="handleOpenLotData(row)"
          class="common-align"
          type="primary"
        >
          {{ row.applyLotNames }}
        </el-text>
      </template>

      <template #carNumber="{ row }">
        <el-text
          @click="handleOpenCarInfoData(row)"
          class="common-align"
          type="primary"
        >
          {{ row.carNumber }}
        </el-text>
      </template>

      <!-- 关联费率策略/费率策略插槽 -->
      <template #strategyName="{ row }">
        <el-text
          @click="handleStrategyNameClick(row.strategyName)"
          class="common-align"
          type="primary"
        >
          {{ row.strategyName }}
        </el-text>
      </template>

      <!-- 优惠券类型插槽 -->
      <template #couponType="{ row }">
        <el-text
          @click="handleCouponTypeClick(row.couponType)"
          class="common-align"
          type="primary"
        >
          {{ row.couponType }}
        </el-text>
      </template>

      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon">
            <ArrowDown />
          </el-icon>
          <span>
            <template v-if="props.tabType === 'chargeRule'">
              本页统计：规则数量{{ dataObj.list.length }};启用:{{
                dataObj.list.filter((item) => item.status === '1').length
              }};禁用:{{
                dataObj.list.filter((item) => item.status === '0').length
              }}
            </template>
            <template v-else-if="props.tabType === 'feeCalculation'">
              本页统计：订单数量{{ dataObj.list.length }}
            </template>
            <template v-else-if="props.tabType === 'discountManagement'">
              本页统计：优惠数量{{ dataObj.list.length }};启用:{{
                dataObj.list.filter((item) => item.couponStatus === '1').length
              }};禁用:{{
                dataObj.list.filter((item) => item.couponStatus === '0').length
              }};已过期:{{
                dataObj.list.filter((item) => item.couponStatus === '2').length
              }}
            </template>
          </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> 全部统计：{{ dataObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
