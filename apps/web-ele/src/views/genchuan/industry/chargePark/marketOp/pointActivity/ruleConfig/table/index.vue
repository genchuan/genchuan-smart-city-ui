<script setup>
import { computed, reactive, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { DICT_TYPE } from '@vben/constants';
import { getDictObj } from '@vben/hooks';
import { downloadFileFromBlobPart } from '@vben/utils';

import { ElLoading, ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  activateRuleConfig,
  createRuleConfig,
  disableRuleConfig,
  exportRuleConfig,
  getRuleConfigPage,
  updateRuleConfig,
} from '#/api/genchuan/industry/chargePark/marketOp/pointActivity/ruleConfig';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { formatDate } from '#/utils/genchuan/formatTime';

import StatusConfirmDialog from '../components/StatusConfirmDialog.vue';
import {
  detailFields,
  getRuleConfigSceneTagType,
  getRuleConfigStatusTagType,
  getRuleConfigTypeTagType,
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
const statusConfirmDialogRef = ref(null);
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
      text: formData.value?.id ? '保存..' : '创建..',
    });
    try {
      if (formData.value?.id) {
        await updateRuleConfig({ ...values, id: formData.value.id });
        ElMessage.success('编辑成功');
      } else {
        await createRuleConfig(values);
        ElMessage.success('创建成功');
      }
      handleRefresh();
      formDrawerApi.close();
    } catch (error) {
      console.error(error);
      ElMessage.error(formData.value?.id ? '编辑失败' : '创建失败');
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

/** 刷新表格 - 同时清除所有快捷筛选*/
function handleRefresh() {
  // 清除所有快捷筛选变量
  filterType.value = '';
  filterStatus.value = '';
  filterScene.value = '';
  filterStatsType.value = '';
  gridApi.query();
}

// ==================== 统计组件钻取筛选处理 ====================

/** 处理统计组件的钻取筛选 */
const handleStatsFilter = (type, subType, value) => {
  switch (type) {
    case 'card': {
      // 卡片点击 - 生效配置数或规则匹配率
      if (subType === 'active') {
        // 生效配置数卡片 - 筛选规则状态为"已生效"
        filterStatus.value = '1'; // "已生效"的字典值
        ElMessage.info('已筛选: 已生效');
      } else {
        // 规则匹配率卡片 - 不做筛选（已去掉交互）
        return;
      }

      break;
    }
    case 'scene': {
      // 柱状图柱形点击 - 按适用场景筛选
      // subType 是场景编码，value 是场景名称
      filterScene.value = subType || '';
      ElMessage.info(`已筛选适用场景: ${value}`);

      break;
    }
    case 'type': {
      // 饼图扇区点击 - 按类型筛选
      // subType 是类型编码，value 是类型名称
      filterType.value = subType || '';
      ElMessage.info(`已筛选规则类型: ${value}`);

      break;
    }
    // No default
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

/** 导出表格 */
async function handleExport() {
  try {
    const data = await exportRuleConfig();
    downloadFileFromBlobPart({ fileName: '规则配置数据.xlsx', source: data });
    ElMessage.success('导出成功');
  } catch (error) {
    ElMessage.error('导出失败');
    console.error(error);
  }
}

/** 创建 */
async function handleCreate() {
  // 设置表单schema
  await formApi.setState({ schema: useFormSchema() });
  formDrawerApi
    .setData({
      title: textObj.addText,
      status: '0', // 默认未生效
    })
    .open();
}

/** 编辑 */
async function handleEdit(row) {
  // 设置表单schema
  await formApi.setState({ schema: useFormSchema() });
  formDrawerApi
    .setData({
      title: textObj.editText,
      ...row,
    })
    .open();
}

/** 打开生效确认弹窗 */
function handleActivate(row) {
  statusConfirmDialogRef.value?.open({
    row,
    actionType: 'activate',
  });
}

/** 打开禁用确认弹窗 */
function handleDisable(row) {
  statusConfirmDialogRef.value?.open({
    row,
    actionType: 'disable',
  });
}

/** 处理状态变更确认*/
async function handleStatusConfirm({ row, actionType }) {
  const loadingInstance = ElLoading.service({
    text: actionType === 'activate' ? '生效..' : '禁用',
  });
  try {
    if (actionType === 'activate') {
      await activateRuleConfig({ id: row.id });
      ElMessage.success('生效成功');
    } else {
      await disableRuleConfig({ id: row.id });
      ElMessage.success('禁用成功');
    }
    handleRefresh();
  } catch (error) {
    console.error(error);
    ElMessage.error(actionType === 'activate' ? '生效失败' : '禁用失败');
  } finally {
    loadingInstance.close();
  }
}

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}

// 快捷筛选变
const filterType = ref('');
const filterStatus = ref('');
const filterScene = ref('');

// 统计组件钻取筛选
const filterStatsType = ref('');

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  list: [],
  searchParams: {},
});

const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

// 表格数据获取
const getTableData = async (pageObj) => {
  const page = pageObj.page;

  dataObj.currentPage = page.currentPage;
  dataObj.pageSize = page.pageSize;

  // 构建查询参数 - 直接使用 searchParams 中的值，RangePicker 返回的数组会自动转换为同名字段传给后端
  const queryParams = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    name: dataObj.searchParams.name,
    type: filterType.value || dataObj.searchParams.type,
    scene: filterScene.value || dataObj.searchParams.scene,
    status: filterStatus.value || dataObj.searchParams.status,
    auditorName: dataObj.searchParams.auditorName,
    giftRatio: dataObj.searchParams.giftRatio,
    matchCount: dataObj.searchParams.matchCount,
    // RangePicker 返回数组格式 [start, end]，后端会接收为两个同名参数
    createTime: dataObj.searchParams.createTime
      ? dataObj.searchParams.createTime
      : undefined,
    effectTime: dataObj.searchParams.effectTime
      ? dataObj.searchParams.effectTime
      : undefined,
  };

  const response = await getRuleConfigPage(queryParams);
  if (response && response.list) {
    dataObj.total = response.total;
    dataObj.list = response.list.map((item) => ({
      ...item,
      id: String(item.id),
      createTimeStr: formatDate(item.createTime),
      updateTimeStr: formatDate(item.updateTime),
      auditTimeStr: formatDate(item.auditTime),
      effectTimeStr: formatDate(item.effectTime),
    }));
  } else {
    // 接口返回为空或无数据，清空列表
    dataObj.total = 0;
    dataObj.list = [];
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
  schema: useSearchFormSchema().map((v) => {
    delete v.rules;
    return { ...v };
  }),
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});

// 搜索表单查询
function onSubmit(values) {
  dataObj.searchParams = { ...values };
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

const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  if (detailDrawerRef.value) {
    detailDrawerRef.value.open();
  }
};

const handleSerachShow = () => {
  drawerApi.open();
};

const handleFullShow = () => {
  screenfull.toggle();
};

// ==================== 快捷筛选处理====================

// 处理规则类型点击
const handleTypeClick = (type) => {
  filterType.value = filterType.value === type ? '' : type;
  gridApi.query();
};

// 处理规则状态点击
const handleStatusClick = (status) => {
  filterStatus.value = filterStatus.value === status ? '' : status;
  gridApi.query();
};

// 处理适用场景点击
const handleSceneClick = (scene) => {
  filterScene.value = filterScene.value === scene ? '' : scene;
  gridApi.query();
};

// 取消筛选
const handleCancelTypeFilter = () => {
  filterType.value = '';
  gridApi.query();
};

const handleCancelStatusFilter = () => {
  filterStatus.value = '';
  gridApi.query();
};

const handleCancelSceneFilter = () => {
  filterScene.value = '';
  gridApi.query();
};

/** 获取规则类型标签文本 */
function getTypeLabel(type) {
  const dict = getDictObj(DICT_TYPE.RULE_CONFIG_TYPE, String(type));
  return dict ? dict.label : type;
}

/** 获取规则状态标签文字*/
function getStatusLabel(status) {
  const dict = getDictObj(DICT_TYPE.RULE_CONFIG_STATUS, String(status));
  return dict ? dict.label : status;
}

/** 获取适用场景标签文本 */
function getSceneLabel(scene) {
  const dict = getDictObj(DICT_TYPE.RULE_CONFIG_SCENE, String(scene));
  return dict ? dict.label : scene;
}
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <!--   详情抽屉-->
    <DetailDrawer
      ref="detailDrawerRef"
      :title="`${dataObj.detailObj.name || '规则配置'}详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
    />
    <!--   状态变更确认弹窗-->
    <StatusConfirmDialog
      ref="statusConfirmDialogRef"
      @confirm="handleStatusConfirm"
    />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <Grid>
      <!-- 快捷筛选标签-->
      <template #table-title>
        <div
          class="tabel-tabs"
          style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center"
        >
          <!-- 规则类型筛选标签-->
          <ElTag
            v-if="filterType"
            type="primary"
            closable
            @close="handleCancelTypeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            规则类型：{{ getTypeLabel(filterType) }}
          </ElTag>
          <!-- 规则状态筛选标签-->
          <ElTag
            v-if="filterStatus"
            type="success"
            closable
            @close="handleCancelStatusFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            规则状态：{{ getStatusLabel(filterStatus) }}
          </ElTag>
          <!-- 适用场景筛选标签-->
          <ElTag
            v-if="filterScene"
            type="warning"
            closable
            @close="handleCancelSceneFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            适用场景：{{ getSceneLabel(filterScene) }}
          </ElTag>
          <!-- 统计组件筛选标签-->
          <ElTag
            v-if="filterStatsType"
            type="primary"
            closable
            @close="handleCancelStatsTypeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            统计筛选：{{
              filterStatsType === 'active' ? '生效配置' : '规则匹配率'
            }}
          </ElTag>
        </div>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
          <!--          <IconButton-->
          <!--            content="导出"-->
          <!--            icon-name="download"-->
          <!--            @click="handleExport"-->
          <!--          />-->
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
      <!-- 规则名称插槽 - 点击跳转规则详情弹窗 -->
      <template #name="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.name }}
        </el-text>
      </template>
      <!-- 规则类型插槽 - 点击筛选同类型规则配置 -->
      <template #type="{ row }">
        <ElTag
          @click="handleTypeClick(row.type)"
          :type="getRuleConfigTypeTagType(row.type)"
          style="cursor: pointer"
        >
          {{ getTypeLabel(row.type) }}
        </ElTag>
      </template>
      <!-- 规则状态插槽- 点击筛选同状态规则配插槽-->
      <template #status="{ row }">
        <ElTag
          @click="handleStatusClick(row.status)"
          :type="getRuleConfigStatusTagType(row.status)"
          style="cursor: pointer"
        >
          {{ getStatusLabel(row.status) }}
        </ElTag>
      </template>
      <!-- 适用场景插槽 - 点击筛选同场景规则配置 -->
      <template #scene="{ row }">
        <ElTag
          @click="handleSceneClick(row.scene)"
          :type="getRuleConfigSceneTagType(row.scene)"
          style="cursor: pointer"
        >
          {{ getSceneLabel(row.scene) }}
        </ElTag>
      </template>
      <!-- 行操作按状态-->
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
            本页统计：规则配置数量 {{ dataObj.list.length }}; 已生效
            {{ dataObj.list.filter((v) => v.status === '1').length }}; 未生效
            {{ dataObj.list.filter((v) => v.status === '0').length }}
          </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>

<style scoped></style>
