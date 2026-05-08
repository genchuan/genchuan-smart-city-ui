<script setup>
import { computed, nextTick, reactive, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { DICT_TYPE } from '@vben/constants';
import { getDictObj } from '@vben/hooks';
import { downloadFileFromBlobPart } from '@vben/utils';

import { ElLoading, ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createPackageConfig,
  getPackageConfigPage,
  updatePackageConfig,
} from '#/api/genchuan/industry/chargePark/marketOp/couponActivity/packageConfig';
import { getCouponMgmtDetail } from '#/api/genchuan/industry/chargePark/marketOp/couponActivity/couponMgmt';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';
import { formatDate } from '#/utils/genchuan/formatTime';
import StatusConfirmDialog from '#/views/genchuan/industry/chargePark/marketOp/couponActivity/packageConfig/components/StatusConfirmDialog.vue';

import {
  dataList,
  detailFields,
  getPackageConfigScopeLabel,
  getPackageConfigScopeTagType,
  getPackageConfigStatusLabel,
  getPackageConfigStatusTagType,
  getPackageConfigTypeLabel,
  getPackageConfigTypeTagType,
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
const couponDetailDrawerRef = ref(null);
const formData = ref();
const statusConfirmDialogRef = ref();
const couponDetailData = ref([]);
const couponDetailTitle = ref('优惠券详情');

// 优惠券详情字段配置 - 不包含xxid字段
const couponDetailFields = [
  { key: 'name', label: '券名称' },
  {
    key: 'type',
    label: '券类型',
    type: 'tag',
    formatter: (value) => {
      const dict = getDictObj(DICT_TYPE.COUPON_MGMT_TYPE, String(value));
      return dict ? dict.label : value;
    },
    tagType: (value) => {
      const dict = getDictObj(DICT_TYPE.COUPON_MGMT_TYPE, String(value));
      return getDictTagTypeFromDict(dict, 'primary');
    },
  },
  {
    key: 'amount',
    label: '面额',
    formatter: (value, row) => {
      if (!row) return value;
      if (row.type === '1') {
        return `${(value * 10).toFixed(1)}折`;
      } else if (row.type === '2') {
        return `${value}小时`;
      }
      return `¥${value}`;
    },
  },
  { key: 'useCondition', label: '使用条件' },
  {
    key: 'status',
    label: '券状态',
    type: 'tag',
    formatter: (value) => {
      const dict = getDictObj(DICT_TYPE.COUPON_MGMT_STATUS, String(value));
      return dict ? dict.label : value;
    },
    tagType: (value) => {
      const dict = getDictObj(DICT_TYPE.COUPON_MGMT_STATUS, String(value));
      return getDictTagTypeFromDict(dict, 'info');
    },
  },
  { key: 'senderName', label: '发放人' },
  { key: 'sendTimeStr', label: '发放时间' },
  { key: 'receiverName', label: '领取人' },
  { key: 'verifyTimeStr', label: '核销时间' },
  { key: 'validTimeStr', label: '有效期' },
  { key: 'description', label: '券描述' },
  { key: 'createTimeStr', label: '创建时间' },
  { key: 'creator', label: '创建者' },
  { key: 'updater', label: '更新者' },
  { key: 'updateTimeStr', label: '更新时间' },
];

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
  title: getTitle,
  onCancel() {
    formDrawerApi.close();
  },
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    const obj = await formApi.getValues();
    const loadingInstance = ElLoading.service({
      text: '保存中...',
    });
    try {
      if (formData.value?.id) {
        // 编辑
        await updatePackageConfig({ ...obj, id: formData.value.id });
        ElMessage.success('编辑成功');
      } else {
        // 新增
        await createPackageConfig(obj);
        ElMessage.success('新增成功');
      }
      handleRefresh();
      formDrawerApi.close();
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

/** 刷新表格 */
function handleRefresh() {
  // 清除快捷筛选
  filterType.value = '';
  filterStatus.value = '';
  filterScope.value = '';
  gridApi.query();
}

/** 导出表格 - 使用后端接口导出 */
async function handleExport() {
  try {
    const loadingInstance = ElLoading.service({
      text: '导出中...',
    });

    // 构建导出参数（包含当前筛选条件）
    const params = {
      name: dataObj.searchParams.name,
      type: filterType.value || dataObj.searchParams.type,
      scope: filterScope.value || dataObj.searchParams.scope,
      status: filterStatus.value || dataObj.searchParams.status,
      auditorName: dataObj.searchParams.auditorName,
      creator: dataObj.searchParams.creator,
    };

    // 调用后端导出接口
    const response = await getPackageConfigPage({
      ...params,
      pageNo: 1,
      pageSize: 99_999, // 获取所有数据
    });

    if (response && response.list) {
      // 格式化时间字段
      const formattedList = response.list.map((item) => ({
        ...item,
        id: String(item.id),
        typeName: getPackageConfigTypeLabel(item.type),
        statusName: getPackageConfigStatusLabel(item.status),
        scopeName: getPackageConfigScopeLabel(item.scope),
        createTimeStr: item.createTime ? formatDate(item.createTime) : '-',
        auditTimeStr: item.auditTime ? formatDate(item.auditTime) : '-',
        effectTimeStr: item.effectTime ? formatDate(item.effectTime) : '-',
        updateTimeStr: item.updateTime ? formatDate(item.updateTime) : '-',
      }));

      // 准备Excel数据
      const excelData = formattedList.map((item) => ({
        券包名称: item.name,
        券包类型: item.typeName,
        包含优惠券: item.couponNames || '-',
        价格: `¥${item.price}`,
        适用范围: item.scopeName,
        配置状态: item.statusName,
        创建时间: item.createTimeStr,
        审核人: item.auditorName || '-',
        审核时间: item.auditTimeStr,
        销量: item.saleCount || 0,
        生效时间: item.effectTimeStr,
        券包描述: item.description || '-',
      }));

      // 转换为CSV格式
      const headers = Object.keys(excelData[0] || {});
      const csvContent = [
        headers.join(','),
        ...excelData.map((row) =>
          headers
            .map((h) => `"${(row[h] || '').toString().replaceAll('"', '""')}"`)
            .join(','),
        ),
      ].join('\n');

      // 创建Blob并下载
      const blob = new Blob([`\uFEFF${csvContent}`], {
        type: 'text/csv;charset=utf-8;',
      });
      downloadFileFromBlobPart({
        fileName: textObj.excelAllName,
        source: blob,
      });

      ElMessage.success('导出成功');
    } else {
      ElMessage.error('导出失败：数据为空');
    }
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败');
  } finally {
    ElLoading.service().close();
  }
}

/** 创建 */
function handleCreate() {
  formDrawerApi.setData({
    title: textObj.addText,
  });
  formDrawerApi.open();
}

/** 编辑 */
function handleEdit(row) {
  formDrawerApi.setData({
    title: textObj.editText,
    ...row,
  });
  formDrawerApi.open();
}

/** 生效 */
function handleActivate(row) {
  statusConfirmDialogRef.value?.open('activate', row);
}

/** 禁用 */
function handleDisable(row) {
  statusConfirmDialogRef.value?.open('disable', row);
}

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}

// 快捷筛选变量
const filterType = ref('');
const filterStatus = ref('');
const filterScope = ref('');

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
      auditorName: dataObj.searchParams.auditorName,
      creator: dataObj.searchParams.creator,
    };

    const response = await getPackageConfigPage(params);
    if (response) {
      const { list, total } = response;
      dataObj.total = total || 0;
      // 格式化时间字段，统一转换为字符串形式
      dataObj.list = (list || []).map((item) => ({
        ...item,
        id: String(item.id),
        typeName: getPackageConfigTypeLabel(item.type),
        statusName: getPackageConfigStatusLabel(item.status),
        scopeName: getPackageConfigScopeLabel(item.scope),
        createTimeStr: item.createTime ? formatDate(item.createTime) : '',
        auditTimeStr: item.auditTime ? formatDate(item.auditTime) : '-',
        effectTimeStr: item.effectTime ? formatDate(item.effectTime) : '',
        updateTimeStr: item.updateTime ? formatDate(item.updateTime) : '',
      }));
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
          searchMatch =
            typeof value === 'string'
              ? searchMatch && v[key]?.toString().includes(value)
              : searchMatch && v[key] === value;
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
      return searchMatch;
    });

    // 格式化时间字段
    dataObj.total = filteredList.length;
    dataObj.list = filteredList
      .slice(
        (page.currentPage - 1) * page.pageSize,
        page.currentPage * page.pageSize,
      )
      .map((item) => ({
        ...item,
        id: String(item.id),
        typeName: getPackageConfigTypeLabel(item.type),
        statusName: getPackageConfigStatusLabel(item.status),
        scopeName: getPackageConfigScopeLabel(item.scope),
        createTimeStr: item.createTime ? formatDate(item.createTime) : '',
        auditTimeStr: item.auditTime ? formatDate(item.auditTime) : '-',
        effectTimeStr: item.effectTime ? formatDate(item.effectTime) : '',
        updateTimeStr: item.updateTime ? formatDate(item.updateTime) : '',
      }));
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

// 处理券包类型点击
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

// ==================== 详情弹窗处理 ====================

const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerRef.value.open();
};

/** 打开券包详情弹窗 */
const handleOpenPackageDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerRef.value.open();
};

/** 打开关联优惠券列表弹窗 - 查看多个优惠券详情 */
async function handleOpenCouponList(row) {
  if (!row.couponIds) {
    ElMessage.warning('该券包未包含优惠券');
    return;
  }

  const couponIdArr = row.couponIds.split(',').filter((id) => id.trim());
  if (couponIdArr.length === 0) {
    ElMessage.warning('该券包未包含优惠券');
    return;
  }

  try {
    const loadingInstance = ElLoading.service({
      text: '正在加载优惠券详情...',
    });

    // 并发请求所有优惠券详情
    const detailPromises = couponIdArr.map((id) =>
      getCouponMgmtDetail(Number(id.trim())).catch((error) => {
        console.error(`获取优惠券ID ${id} 详情失败:`, error);
        return null;
      }),
    );

    const detailResults = await Promise.all(detailPromises);

    // 过滤掉请求失败的，格式化时间字段
    const formattedDetails = detailResults
      .filter((detail) => detail && detail.id)
      .map((detail) => ({
        ...detail,
        createTimeStr: detail.createTime ? formatDate(detail.createTime) : '-',
        updateTimeStr: detail.updateTime ? formatDate(detail.updateTime) : '-',
        sendTimeStr: detail.sendTime ? formatDate(detail.sendTime) : '-',
        verifyTimeStr: detail.verifyTime ? formatDate(detail.verifyTime) : '-',
        validTimeStr: detail.validTime ? formatDate(detail.validTime) : '-',
      }));

    loadingInstance.close();

    if (formattedDetails.length === 0) {
      ElMessage.error('未能获取到任何优惠券详情');
      return;
    }

    // 设置数据并更新标题
    couponDetailData.value = formattedDetails;
    couponDetailTitle.value = `包含优惠券 (${formattedDetails.length}张)`;

    // 使用nextTick确保DOM更新后再打开抽屉
    await nextTick();
    if (couponDetailDrawerRef.value) {
      couponDetailDrawerRef.value.open();
    } else {
      console.error('优惠券详情抽屉组件未找到');
      ElMessage.error('打开详情失败，请重试');
    }
  } catch (error) {
    console.error('获取优惠券详情失败:', error);
    ElMessage.error('获取优惠券详情失败');
  }
}

/** 打开操作人员详情弹窗 */
const handleOpenAuditorDetail = (row) => {
  ElMessage.info(`查看审核人: ${row.auditorName}`);
  // TODO: 实现操作人员详情弹窗
};

/** 打开券包订单明细弹窗 */
const handleOpenOrderDetail = (row) => {
  ElMessage.info(`查看券包订单明细，销量: ${row.saleCount}`);
  // TODO: 实现券包订单明细弹窗
};

const handleSerachShow = () => {
  drawerApi.open();
};

const handleFullShow = () => {
  screenfull.toggle();
};

/** 处理统计组件的钻取筛选 */
function handleStatsFilter(filterSource, filterValue) {
  if (filterSource === 'type') {
    // 点击柱状图 - 按券包类型筛选
    // 直接使用传递的type值
    filterType.value = filterType.value === filterValue ? '' : filterValue;
    gridApi.query();
  } else if (filterSource === 'card') {
    // 点击卡片
    if (filterValue === 'enable') {
      // 点击生效配置数 - 筛选已生效的券包（status=1表示已生效）
      filterStatus.value = filterStatus.value === '1' ? '' : '1';
      gridApi.query();
    } else if (filterValue === 'sale') {
      // 点击累计券包销量 - 可以按销量排序
      // ElMessage.info('按销量筛选');
    }
  }
}

// 暴露方法给父组件
defineExpose({
  handleStatsFilter,
});
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <!--   详情抽屉-->
    <DetailDrawer
      ref="detailDrawerRef"
      :title="`${dataObj.detailObj.name || '券包配置'}详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
    />
    <!--   优惠券详情抽屉 - 展示多个优惠券详情-->
    <DetailDrawer
      ref="couponDetailDrawerRef"
      :title="couponDetailTitle"
      :data="couponDetailData"
      :fields="couponDetailFields"
    />
    <!-- 状态操作确认弹窗 -->
    <StatusConfirmDialog
      ref="statusConfirmDialogRef"
      @success="handleRefresh"
    />
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
          <!-- 券包类型筛选标签 -->
          <ElTag
            v-if="filterType"
            type="primary"
            closable
            @close="handleCancelTypeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            券包类型：{{ getPackageConfigTypeLabel(filterType) }}
          </ElTag>
          <!-- 适用范围筛选标签 -->
          <ElTag
            v-if="filterScope"
            type="warning"
            closable
            @close="handleCancelScopeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            适用范围：{{ getPackageConfigScopeLabel(filterScope) }}
          </ElTag>
          <!-- 配置状态筛选标签 -->
          <ElTag
            v-if="filterStatus"
            type="success"
            closable
            @close="handleCancelStatusFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            配置状态：{{ getPackageConfigStatusLabel(filterStatus) }}
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
      <!-- 券包名称 - 点击跳转详情 -->
      <template #name="{ row }">
        <el-text
          @click="handleOpenPackageDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.name }}
        </el-text>
      </template>
      <!-- 券包类型 - 点击筛选同类型 -->
      <template #typeName="{ row }">
        <ElTag
          :type="getPackageConfigTypeTagType(row.type)"
          style="cursor: pointer"
          @click="handleFilterByType(row.type)"
        >
          {{ getPackageConfigTypeLabel(row.type) }}
        </ElTag>
      </template>
      <!-- 包含优惠券 - 点击跳转关联优惠券列表 -->
      <template #couponNames="{ row }">
        <el-text
          @click="handleOpenCouponList(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.couponNames }}
        </el-text>
      </template>
      <!-- 价格 - 无钻取 -->
      <template #price="{ row }">
        <span>¥{{ row.price }}</span>
      </template>
      <!-- 适用范围 - 点击筛选同适用范围 -->
      <template #scopeName="{ row }">
        <ElTag
          :type="getPackageConfigScopeTagType(row.scope)"
          style="cursor: pointer"
          @click="handleFilterByScope(row.scope)"
        >
          {{ getPackageConfigScopeLabel(row.scope) }}
        </ElTag>
      </template>
      <!-- 配置状态 - 点击筛选同状态 -->
      <template #statusName="{ row }">
        <ElTag
          :type="getPackageConfigStatusTagType(row.status)"
          style="cursor: pointer"
          @click="handleFilterByStatus(row.status)"
        >
          {{ getPackageConfigStatusLabel(row.status) }}
        </ElTag>
      </template>
      <!-- 创建时间 - 使用格式化后的字符串 -->
      <template #createTime="{ row }">
        <span>{{ row.createTimeStr }}</span>
      </template>
      <!-- 审核人 - 点击跳转操作人员详情 -->
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
      <!-- 审核时间 - 使用格式化后的字符串 -->
      <template #auditTime="{ row }">
        <span>{{ row.auditTimeStr }}</span>
      </template>
      <!-- 销量 - 点击跳转券包订单明细 -->
      <template #saleCount="{ row }">
        <el-text
          @click="handleOpenOrderDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.saleCount }}
        </el-text>
      </template>
      <!-- 生效时间 - 使用格式化后的字符串 -->
      <template #effectTime="{ row }">
        <span>{{ row.effectTimeStr }}</span>
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
            本页统计：券包数量: {{ dataObj.list.length }}; 已生效:
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
