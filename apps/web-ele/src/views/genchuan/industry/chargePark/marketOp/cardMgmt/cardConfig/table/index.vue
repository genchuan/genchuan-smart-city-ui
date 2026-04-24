<script setup>
import { computed, reactive, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { ElLoading, ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createCardConfig,
  getCardConfigDetail,
  getCardConfigPage,
  updateCardConfig,
} from '#/api/genchuan/industry/chargePark/marketOp/cardMgmt/cardConfig';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { exportToExcel } from '#/utils/excel.js';
import { formatDate } from '#/utils/genchuan/formatTime';

import ActivateConfirmDialog from '../components/ActivateConfirmDialog.vue';
import DisableConfirmDialog from '../components/DisableConfirmDialog.vue';
import {
  dataList,
  detailFields,
  getCardConfigScopeLabel,
  getCardConfigScopeTagType,
  getCardConfigStatusLabel,
  getCardConfigStatusTagType,
  getCardConfigTypeLabel,
  getCardConfigTypeTagType,
  textObj,
  useFormSchema,
  useGridColumns,
  useSearchFormSchema,
} from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
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

const detailDrawerRef = ref(null);
const activateDialogRef = ref(null);
const disableDialogRef = ref(null);
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
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    formDrawerApi.close();
  },
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    const values = await formApi.getValues();
    const loadingInstance = ElLoading.service({
      text: '保存中...',
    });
    try {
      if (formData.value?.id) {
        await updateCardConfig({ ...values, id: formData.value.id });
        ElMessage.success('编辑成功');
      } else {
        await createCardConfig(values);
        ElMessage.success('新增成功');
      }
      formDrawerApi.close();
      handleRefresh();
    } catch (error) {
      console.error('保存失败:', error);
      ElMessage.error('保存失败');
    } finally {
      loadingInstance.close();
    }
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

/** 刷新表格 - 同时清除所有快捷筛选 */
function handleRefresh() {
  // 清除所有快捷筛选变量
  filterType.value = '';
  filterScope.value = '';
  filterStatus.value = '';
  filterStatsType.value = '';
  gridApi.query();
}

/** 导出表格 */
function handleExport() {
  exportToExcel(dataObj.apilist, textObj.excelName, textObj.excelAllName);
}

/** 新增 */
function handleAdd() {
  formDrawerApi.open();
  formDrawerApi.setData({});
}

/** 编辑 */
async function handleEdit(row) {
  const loadingInstance = ElLoading.service({
    text: '加载中...',
  });
  try {
    const response = await getCardConfigDetail({ id: row.id });
    if (response && response.code === 200 && response.data) {
      formDrawerApi.open();
      formDrawerApi.setData(response.data);
    } else {
      // 使用静态数据
      formDrawerApi.open();
      formDrawerApi.setData(row);
    }
  } catch (error) {
    console.error('获取详情失败:', error);
    // 使用静态数据
    formDrawerApi.open();
    formDrawerApi.setData(row);
  } finally {
    loadingInstance.close();
  }
}

/** 生效 - 打开确认弹窗 */
function handleActivate(row) {
  activateDialogRef.value?.open(row);
}

/** 禁用 - 打开确认弹窗 */
function handleDisable(row) {
  disableDialogRef.value?.open(row);
}

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}

// 快捷筛选变量
const filterType = ref('');
const filterScope = ref('');
const filterStatus = ref('');

// 统计组件钻取筛选变量
const filterStatsType = ref('');

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: dataList().length,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(),
  list: [],
  searchParams: {},
});

const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

// 表格数据获取
const getTableData = async (pageObj) => {
  const page = pageObj.page;

  try {
    // 构建API请求参数
    const params = {
      pageNo: page.currentPage,
      pageSize: page.pageSize,
      name: dataObj.searchParams.name,
      type: filterType.value || dataObj.searchParams.type,
      scope: filterScope.value || dataObj.searchParams.scope,
      status: filterStatus.value || dataObj.searchParams.status,
    };

    const response = await getCardConfigPage(params);
    if (response) {
      const { list, total } = response;
      dataObj.total = total || 0;
      dataObj.list = list || [];
      return dataObj;
    }
  } catch (error) {
    // 接口请求失败，使用静态数据
    console.error('分页接口请求失败，使用静态数据:', error);

    // 根据searchParams和快捷筛选变量筛选静态数据
    const filteredList = dataObj.apilist.filter((v) => {
      let searchMatch = true;
      Object.keys(dataObj.searchParams).forEach((key) => {
        const value = dataObj.searchParams[key];
        if (value && !['auditTime', 'createTime', 'effectTime'].includes(key)) {
          switch (key) {
            case 'priceMax': {
              searchMatch = searchMatch && v.price <= value;

              break;
            }
            case 'priceMin': {
              searchMatch = searchMatch && v.price >= value;

              break;
            }
            case 'saleCountMax': {
              searchMatch = searchMatch && v.saleCount <= value;

              break;
            }
            case 'saleCountMin': {
              searchMatch = searchMatch && v.saleCount >= value;

              break;
            }
            default: {
              searchMatch =
                typeof value === 'string'
                  ? searchMatch && v[key]?.toString().includes(value)
                  : searchMatch && v[key] === value;
            }
          }
        }
      });
      // 应用快捷筛选变量
      if (filterType.value && v.type !== filterType.value) {
        searchMatch = false;
      }
      if (filterScope.value && v.scope !== filterScope.value) {
        searchMatch = false;
      }
      if (filterStatus.value && v.status !== filterStatus.value) {
        searchMatch = false;
      }
      // 应用统计组件钻取筛选
      if (filterStatsType.value === 'effective' && v.status !== '1') {
        searchMatch = false;
      }
      return searchMatch;
    });

    dataObj.total = filteredList.length;
    dataObj.list = filteredList.slice(
      (page.currentPage - 1) * page.pageSize,
      page.currentPage * page.pageSize,
    );
  }
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
  schema: useSearchFormSchema(),
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

// ==================== 钻取筛选处理 ====================

// 处理卡种类型点击
const handleFilterByType = (type) => {
  filterType.value = filterType.value === type ? '' : type;
  gridApi.query();
};

// 处理适用范围点击
const handleFilterByScope = (scope) => {
  filterScope.value = filterScope.value === scope ? '' : scope;
  gridApi.query();
};

// 处理配置状态点击
const handleFilterByStatus = (status) => {
  filterStatus.value = filterStatus.value === status ? '' : status;
  gridApi.query();
};

// 取消筛选
const handleCancelTypeFilter = () => {
  filterType.value = '';
  gridApi.query();
};

const handleCancelScopeFilter = () => {
  filterScope.value = '';
  gridApi.query();
};

const handleCancelStatusFilter = () => {
  filterStatus.value = '';
  gridApi.query();
};

// ==================== 统计组件钻取筛选处理 ====================

/** 处理统计组件的钻取筛选 */
const handleStatsFilter = (type, value) => {
  if (type === 'card') {
    // 卡片点击 - 生效配置数或累计卡种销量
    filterStatsType.value = value;
    ElMessage.info(
      `已筛选: ${value === 'effective' ? '生效配置' : '销量统计'}`,
    );
  } else if (type === 'type') {
    // 饼图点击 - 按卡种类型筛选
    filterType.value = value;
    const typeName =
      dataObj.apilist.find((v) => v.type === value)?.typeName || value;
    ElMessage.info(`已筛选卡种类型: ${typeName}`);
  }
  gridApi.query();
};

/** 取消统计类型筛选 */
const handleCancelStatsTypeFilter = () => {
  filterStatsType.value = '';
  gridApi.query();
};

defineExpose({
  handleStatsFilter,
});

// ==================== 详情弹窗处理 ====================

const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerRef.value.open();
};

/** 打开卡种详情弹窗 */
const handleOpenCardDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerRef.value.open();
};

/** 打开审核人详情弹窗 */
const handleOpenAuditorDetail = (row) => {
  if (row.auditorName) {
    ElMessage.info(`查看审核人详情: ${row.auditorName}`);
    // TODO: 实现审核人详情弹窗
  }
};

/** 打开卡种订单明细弹窗 */
const handleOpenSaleDetail = (row) => {
  ElMessage.info(`查看卡种订单明细: ${row.name}，销量: ${row.saleCount}`);
  // TODO: 实现卡种订单明细弹窗
};

const handleSerachShow = () => {
  drawerApi.open();
};

const handleFullShow = () => {
  screenfull.toggle();
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
      :title="`${dataObj.detailObj.name || '卡种配置'}详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
    />
    <!--   生效确认弹窗-->
    <ActivateConfirmDialog ref="activateDialogRef" @success="handleRefresh" />
    <!--   禁用确认弹窗-->
    <DisableConfirmDialog ref="disableDialogRef" @success="handleRefresh" />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>
    <Grid>
      <!-- 快捷筛选标签 -->
      <template #table-title>
        <div
          class="tabel-tabs"
          style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center"
        >
          <!-- 卡种类型筛选标签 -->
          <ElTag
            v-if="filterType"
            type="primary"
            closable
            @close="handleCancelTypeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            卡种类型：{{ getCardConfigTypeLabel(filterType) }}
          </ElTag>
          <!-- 适用范围筛选标签 -->
          <ElTag
            v-if="filterScope"
            type="success"
            closable
            @close="handleCancelScopeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            适用范围：{{ getCardConfigScopeLabel(filterScope) }}
          </ElTag>
          <!-- 配置状态筛选标签 -->
          <ElTag
            v-if="filterStatus"
            type="warning"
            closable
            @close="handleCancelStatusFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            配置状态：{{ getCardConfigStatusLabel(filterStatus) }}
          </ElTag>
          <!-- 统计组件-类型筛选标签 -->
          <ElTag
            v-if="filterStatsType"
            type="info"
            closable
            @close="handleCancelStatsTypeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            统计筛选：{{
              filterStatsType === 'effective' ? '生效配置' : '销量统计'
            }}
          </ElTag>
        </div>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="Plus" @click="handleAdd" />
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExport"
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
      <!-- 卡种名称 - 点击跳转详情 -->
      <template #name="{ row }">
        <el-text
          @click="handleOpenCardDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.name }}
        </el-text>
      </template>
      <!-- 卡种类型 - 点击筛选同类型 -->
      <template #typeName="{ row }">
        <ElTag
          :type="getCardConfigTypeTagType(row.type)"
          style="cursor: pointer"
          @click="handleFilterByType(row.type)"
        >
          {{ getCardConfigTypeLabel(row.type) }}
        </ElTag>
      </template>
      <!-- 适用范围 - 点击筛选同范围 -->
      <template #scopeName="{ row }">
        <ElTag
          :type="getCardConfigScopeTagType(row.scope)"
          style="cursor: pointer"
          @click="handleFilterByScope(row.scope)"
        >
          {{ getCardConfigScopeLabel(row.scope) }}
        </ElTag>
      </template>
      <!-- 价格 - 格式化显示 -->
      <template #price="{ row }">
        <span>¥{{ row.price?.toFixed(2) }}</span>
      </template>
      <!-- 配置状态 - 点击筛选同状态 -->
      <template #statusName="{ row }">
        <ElTag
          :type="getCardConfigStatusTagType(row.status)"
          style="cursor: pointer"
          @click="handleFilterByStatus(row.status)"
        >
          {{ getCardConfigStatusLabel(row.status) }}
        </ElTag>
      </template>
      <!-- 创建时间 - 格式化显示 -->
      <template #createTime="{ row }">
        <span>{{
          row.createTime
            ? formatDate(
                new Date(Number(row.createTime)),
                'YYYY-MM-DD HH:mm:ss',
              )
            : ''
        }}</span>
      </template>
      <!-- 审核人 - 点击跳转审核人详情 -->
      <template #auditorName="{ row }">
        <el-text
          v-if="row.auditorName"
          @click="handleOpenAuditorDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.auditorName }}
        </el-text>
        <span v-else>-</span>
      </template>
      <!-- 审核时间 - 格式化显示 -->
      <template #auditTime="{ row }">
        <span>{{
          row.auditTime
            ? formatDate(new Date(Number(row.auditTime)), 'YYYY-MM-DD HH:mm:ss')
            : '-'
        }}</span>
      </template>
      <!-- 销量 - 点击跳转订单明细 -->
      <template #saleCount="{ row }">
        <el-text
          @click="handleOpenSaleDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.saleCount }}
        </el-text>
      </template>
      <!-- 生效时间 - 格式化显示 -->
      <template #effectTime="{ row }">
        <span>{{
          row.effectTime
            ? formatDate(
                new Date(Number(row.effectTime)),
                'YYYY-MM-DD HH:mm:ss',
              )
            : '-'
        }}</span>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="编辑"
            icon-name="Edit"
            @click="handleEdit(row)"
          />
          <IconButton
            v-if="row.status === '0'"
            content="生效"
            icon-name="CircleCheck"
            @click="handleActivate(row)"
          />
          <IconButton
            v-if="row.status === '1'"
            content="禁用"
            icon-name="CircleClose"
            color="#F56C6C"
            @click="handleDisable(row)"
          />
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleOpenDetail(row)"
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
            本页统计：卡种配置数量: {{ dataObj.list.length }}; 已生效:
            {{ dataObj.list.filter((v) => v.status === '1').length }}; 未生效:
            {{ dataObj.list.filter((v) => v.status === '0').length }}
          </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> {{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
