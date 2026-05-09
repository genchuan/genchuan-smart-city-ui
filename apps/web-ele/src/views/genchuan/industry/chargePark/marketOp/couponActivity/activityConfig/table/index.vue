<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';

import { ElLoading, ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createActivityConfig,
  getActivityConfigPage,
  updateActivityConfig,
} from '#/api/genchuan/industry/chargePark/marketOp/couponActivity/activityConfig';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';
import { formatDate } from '#/utils/genchuan/formatTime';
import StatusConfirmDialog from '#/views/genchuan/industry/chargePark/marketOp/couponActivity/activityConfig/components/StatusConfirmDialog.vue';

import {
  dataList,
  detailFields,
  getActivityConfigStatusLabel,
  getActivityConfigStatusTagType,
  getActivityConfigTypeLabel,
  getActivityConfigTypeTagType,
  getActivityConfigUserGroupLabel,
  getActivityConfigUserGroupTagType,
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
const formData = ref();
const statusConfirmDialogRef = ref();

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
  onConfirm: async () => {
    const valid = await formApi.validate();
    if (!valid) return;

    const values = await formApi.getValues();
    const loadingInstance = ElLoading.service({
      text: formData.value?.id ? '保存中...' : '创建中...',
    });

    try {
      if (formData.value?.id) {
        await updateActivityConfig({ ...values, id: formData.value.id });
        ElMessage.success('编辑成功');
      } else {
        await createActivityConfig(values);
        ElMessage.success('新增成功');
      }
      handleRefresh();
      formDrawerApi.close();
    } catch (error) {
      console.error('保存失败:', error);
      ElMessage.error('保存失败，请检查网络或稍后重试');
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
  filterStatus.value = '';
  filterUserGroup.value = '';
  gridApi.query();
}

/** 导出表格 */
async function handleExport() {
  exportToExcel(dataObj.apilist, textObj.excelName, textObj.excelAllName);
}

/** 新增 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

/** 编辑 */
function handleEdit(row) {
  formDrawerApi
    .setData({
      title: textObj.editText,
      ...row,
    })
    .open();
}

/** 生效 */
function handleActivate(row) {
  statusConfirmDialogRef.value?.open('activate', row);
}

/** 禁用 */
function handleDisable(row) {
  statusConfirmDialogRef.value?.open('disable', row);
}

/** 批量删除 */
async function handleDeleteBatch() {
  await confirm($t('确定删除这些数据吗？'));
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deletingBatch'),
  });
  try {
    // 这里应该调用批量删除API
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

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}

// 快捷筛选变量
const filterType = ref('');
const filterStatus = ref('');
const filterUserGroup = ref('');

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

// 表格数据获取 - 优先使用API，失败时使用静态数据
const getTableData = async (pageObj) => {
  const page = pageObj.page;

  try {
    // 构建API请求参数
    const params = {
      pageNo: page.currentPage,
      pageSize: page.pageSize,
      ...dataObj.searchParams,
      type: filterType.value || dataObj.searchParams.type,
      status: filterStatus.value || dataObj.searchParams.status,
      userGroup: filterUserGroup.value || dataObj.searchParams.userGroup,
    };

    // 调用分页接口
    const res = await getActivityConfigPage(params);

    if (res) {
      const { list, total } = res;
      dataObj.apilist = list || [];
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
        if (value) {
          switch (key) {
            case 'auditorName':
            case 'creator':
            case 'description':
            case 'joinCondition':
            case 'name':
            case 'ruleContent':
            case 'updater': {
              searchMatch = searchMatch && v[key]?.toString().includes(value);

              break;
            }
            case 'joinCount': {
              searchMatch = searchMatch && v[key] === value;

              break;
            }
            case 'status':
            case 'type':
            case 'userGroup': {
              searchMatch = searchMatch && v[key] === value;

              break;
            }
            default: {
              if (
                key === 'createTime' &&
                Array.isArray(value) &&
                value.length === 2
              ) {
                const createTime = Number(v.createTime);
                searchMatch =
                  searchMatch &&
                  createTime >= value[0] &&
                  createTime <= value[1];
              } else if (
                key === 'updateTime' &&
                Array.isArray(value) &&
                value.length === 2
              ) {
                const updateTime = Number(v.updateTime);
                searchMatch =
                  searchMatch &&
                  updateTime >= value[0] &&
                  updateTime <= value[1];
              } else if (
                key === 'auditTime' &&
                Array.isArray(value) &&
                value.length === 2
              ) {
                const auditTime = Number(v.auditTime);
                searchMatch =
                  searchMatch && auditTime >= value[0] && auditTime <= value[1];
              } else if (
                key === 'effectTime' &&
                Array.isArray(value) &&
                value.length === 2
              ) {
                const effectTime = Number(v.effectTime);
                searchMatch =
                  searchMatch &&
                  effectTime >= value[0] &&
                  effectTime <= value[1];
              }
            }
          }
        }
      });
      // 应用快捷筛选变量
      if (filterType.value && v.type !== filterType.value) {
        searchMatch = false;
      }
      if (filterStatus.value && v.status !== filterStatus.value) {
        searchMatch = false;
      }
      if (filterUserGroup.value && v.userGroup !== filterUserGroup.value) {
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

/** 打开详情抽屉 */
const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerRef.value.open();
};

// ==================== 快捷筛选处理 ====================

// 处理配置类型点击
const handleFilterByType = (type) => {
  filterType.value = filterType.value === type ? '' : type;
  gridApi.query();
};

// 处理适用人群点击
const handleFilterByUserGroup = (userGroup) => {
  filterUserGroup.value = filterUserGroup.value === userGroup ? '' : userGroup;
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

const handleCancelStatusFilter = () => {
  filterStatus.value = '';
  gridApi.query();
};

const handleCancelUserGroupFilter = () => {
  filterUserGroup.value = '';
  gridApi.query();
};

/** 打开操作人员详情弹窗 */
const handleOpenAuditorDetail = (row) => {
  // TODO: 实现操作人员详情弹窗
  console.log('打开操作人员详情:', row.auditorId);
  ElMessage.info(`查看审核人: ${row.auditorName}`);
};

/** 打开活动参与用户明细弹窗 */
const handleOpenJoinUserDetail = (row) => {
  // TODO: 实现活动参与用户明细弹窗
  console.log('打开活动参与用户明细:', row.id);
  ElMessage.info(`查看活动参与用户: ${row.name}`);
};

const handleSerachShow = () => {
  drawerApi.open();
};

const handleFullShow = () => {
  screenfull.toggle();
};

/** 处理统计组件的钻取筛选 */
function handleStatsFilter(filterSource, filterValue) {
  switch (filterSource) {
    case 'card': {
      // 点击卡片
      if (filterValue === 'enable') {
        // 点击生效配置数 - 筛选已生效的配置
        filterStatus.value = '1';
        gridApi.query();
      } else if (filterValue === 'join') {
        // 点击活动参与率
        ElMessage.info('按参与率筛选');
      }

      break;
    }
    case 'type': {
      // 点击饼图 - 按配置类型筛选
      filterType.value = filterType.value === filterValue ? '' : filterValue;
      gridApi.query();

      break;
    }
    case 'userGroup': {
      // 点击柱状图 - 按适用人群筛选
      filterUserGroup.value =
        filterUserGroup.value === filterValue ? '' : filterValue;
      gridApi.query();

      break;
    }
    // No default
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
      :title="`${dataObj.detailObj.name || '活动配置'}详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
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
          <!-- 配置类型筛选标签 -->
          <ElTag
            v-if="filterType"
            type="primary"
            closable
            @close="handleCancelTypeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            配置类型：{{ getActivityConfigTypeLabel(filterType) }}
          </ElTag>
          <!-- 适用人群筛选标签 -->
          <ElTag
            v-if="filterUserGroup"
            type="success"
            closable
            @close="handleCancelUserGroupFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            适用人群：{{ getActivityConfigUserGroupLabel(filterUserGroup) }}
          </ElTag>
          <!-- 配置状态筛选标签 -->
          <ElTag
            v-if="filterStatus"
            type="warning"
            closable
            @close="handleCancelStatusFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            配置状态：{{ getActivityConfigStatusLabel(filterStatus) }}
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
          <!--          <IconButton-->
          <!--            content="批量删除"-->
          <!--            icon-name="delete"-->
          <!--            color="#F56C6C"-->
          <!--            :disabled="isEmpty(checkedIds)"-->
          <!--            @click="handleDeleteBatch"-->
          <!--          />-->
          <IconButton
            :content="props.showStats ? '隐藏统计' : '显示统计'"
            :icon-name="props.showStats ? 'ArrowUp' : 'ArrowDown'"
            @click="props.toggleStats"
          />
          <IconButton
            content="搜索"
            icon-name="search"
            @click="handleSerachShow"
          />
          <IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
        </div>
      </template>
      <!-- 活动名称 - 点击跳转详情 -->
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
      <!-- 配置类型 - 点击筛选同类型 -->
      <template #typeName="{ row }">
        <ElTag
          :type="getActivityConfigTypeTagType(row.type)"
          style="cursor: pointer"
          @click="handleFilterByType(row.type)"
        >
          {{ getActivityConfigTypeLabel(row.type) }}
        </ElTag>
      </template>
      <!-- 适用人群 - 点击筛选同条件 -->
      <template #userGroupName="{ row }">
        <ElTag
          :type="getActivityConfigUserGroupTagType(row.userGroup)"
          style="cursor: pointer"
          @click="handleFilterByUserGroup(row.userGroup)"
        >
          {{ getActivityConfigUserGroupLabel(row.userGroup) }}
        </ElTag>
      </template>
      <!-- 配置状态 - 点击筛选同状态 -->
      <template #statusName="{ row }">
        <ElTag
          :type="getActivityConfigStatusTagType(row.status)"
          style="cursor: pointer"
          @click="handleFilterByStatus(row.status)"
        >
          {{ getActivityConfigStatusLabel(row.status) }}
        </ElTag>
      </template>
      <!-- 创建时间 -->
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
      <!-- 审核时间 -->
      <template #auditTime="{ row }">
        <span>{{
          row.auditTime
            ? formatDate(new Date(Number(row.auditTime)), 'YYYY-MM-DD HH:mm:ss')
            : '-'
        }}</span>
      </template>
      <!-- 参与人数 - 点击跳转活动参与用户明细 -->
      <template #joinCount="{ row }">
        <el-text
          @click="handleOpenJoinUserDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.joinCount }}
        </el-text>
      </template>
      <!-- 生效时间 -->
      <template #effectTime="{ row }">
        <span>{{
          row.effectTime
            ? formatDate(
                new Date(Number(row.effectTime)),
                'YYYY-MM-DD HH:mm:ss',
              )
            : ''
        }}</span>
      </template>
      <!-- 操作列 -->
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
          <span> 本页统计：活动配置数量: {{ dataObj.list.length }} </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
