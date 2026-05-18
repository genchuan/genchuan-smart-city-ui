<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import {
  confirmClientFile,
  createClientFile,
  followClientFile,
  renewClientFile,
  serviceClientFile,
  signClientFile,
  talkClientFile,
  updateClientFile,
  updateClientFileClassify,
  updateClientFileTrack,
} from '#/api/genchuan/industry/industrialpark/investmentMgmt/clientMgmt/clientFile';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import ClientDetailDrawer from '../components/ClientDetailDrawer.vue';
import ClientOperationDialog from '../components/ClientOperationDialog.vue';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

import {
  dataList,
  detailFields,
  getClientDemandTypeLabel,
  getClientDemandTypeTagType,
  getClientIntentLevelLabel,
  getClientIntentLevelTagType,
  getClientStatusLabel,
  getClientStatusTagType,
  textObj,
  useSearchFormSchema,
  useFormSchema,
  useGridColumns,
} from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
});

/** 获取当前用户信息 */
const userStore = useUserStore();

/** 获取当前登录用户的账号名 */
const getCurrentUsername = () => {
  return userStore.userInfo?.username || 'admin';
};

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
const clientDetailDrawerRef = ref(null);
const operationDialogRef = ref(null);
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
  schema: useFormSchema(),
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
    if (formDrawerApi.sharedData.payload.title === textObj.addText) {
      dataObj.apilist.push(obj);
    } else {
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
  gridApi.query();
}

/** 导出表格 */
async function handleExport() {
  exportToExcel(dataObj.apilist, textObj.excelName, textObj.excelAllName);
}

/** 收集客户信息 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

/** 编辑客户档案 - 需要选中数据 */
function handleEdit(row) {
  if (!row && checkedIds.value.length === 0) {
    ElMessage.warning('请先选中一条数据');
    return;
  }

  const targetRow = row || dataObj.apilist.find((item) => item.id === checkedIds.value[0]);
  if (!targetRow) return;

  formDrawerApi
    .setData({
      title: textObj.editText,
      ...targetRow,
    })
    .open();
}

/** 分类操作 - 打开操作表单 */
async function handleClassify(row) {
  if (!row && checkedIds.value.length === 0) {
    ElMessage.warning('请先选中一条数据');
    return;
  }

  const targetRow = row || dataObj.apilist.find((item) => item.id === checkedIds.value[0]);
  if (!targetRow) return;

  operationDialogRef.value.open({
    title: '分类',
    id: targetRow.id,
    ...targetRow,
  });
}

/** 维护操作 - 打开操作表单 */
async function handleMaintain(row) {
  if (!row && checkedIds.value.length === 0) {
    ElMessage.warning('请先选中一条数据');
    return;
  }

  const targetRow = row || dataObj.apilist.find((item) => item.id === checkedIds.value[0]);
  if (!targetRow) return;

  operationDialogRef.value.open({
    title: '维护',
    id: targetRow.id,
    ...targetRow,
  });
}

/** 签约操作 - 打开操作表单 */
async function handleSign(row) {
  if (!row && checkedIds.value.length === 0) {
    ElMessage.warning('请先选中一条数据');
    return;
  }

  const targetRow = row || dataObj.apilist.find((item) => item.id === checkedIds.value[0]);
  if (!targetRow) return;

  operationDialogRef.value.open({
    title: '签约',
    id: targetRow.id,
    ...targetRow,
  });
}

/** 跟进操作 - 打开操作表单 */
async function handleFollow(row) {
  operationDialogRef.value.open({
    title: '跟进',
    id: row.id,
    ...row,
  });
}

/** 洽谈操作 - 打开操作表单 */
async function handleTalk(row) {
  operationDialogRef.value.open({
    title: '洽谈',
    id: row.id,
    ...row,
  });
}

/** 确认转化操作 - 打开操作表单 */
async function handleConfirm(row) {
  operationDialogRef.value.open({
    title: '确认',
    id: row.id,
    ...row,
  });
}

/** 转化操作 - 打开操作表单（同签约） */
async function handleTransform(row) {
  operationDialogRef.value.open({
    title: '转化',
    id: row.id,
    ...row,
  });
}

/** 续费操作 - 打开操作表单 */
async function handleRenew(row) {
  operationDialogRef.value.open({
    title: '续费',
    id: row.id,
    ...row,
  });
}

/** 服务操作 - 打开操作表单 */
async function handleService(row) {
  operationDialogRef.value.open({
    title: '服务',
    id: row.id,
    ...row,
  });
}

/** 查看详情（基础详情） */
const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerRef.value.open();
};

/** 查看完整详情（包含意向场地、跟进记录） */
const handleOpenClientDetail = (row) => {
  clientDetailDrawerRef.value.open(row);
};

/** 点击客户姓名打开完整详情 */
const handleClientNameClick = (row) => {
  handleOpenClientDetail(row);
};

/** 处理操作对话框确认回调 */
const handleOperationConfirm = async (values) => {
  const { title, id, ...params } = values;
  const loadingInstance = ElLoading.service({ text: `正在${title}...` });

  try {
    switch (title) {
      case '分类':
        await updateClientFileClassify({
          id,
          demandType: params.demandType,
          intentLevel: params.intentLevel,
          clientStatus: params.clientStatus,
          handleUser: getCurrentUsername(),
        });
        break;
      case '维护':
        await updateClientFileTrack({
          id,
          trackRecord: params.trackRecord,
          handleUser: getCurrentUsername(),
        });
        break;
      case '签约':
      case '转化':
        await signClientFile({
          id,
          transformResult: params.transformResult,
          handleUser: getCurrentUsername(),
        });
        break;
      case '跟进':
        await followClientFile({
          id,
          trackRecord: params.trackRecord,
          handleUser: getCurrentUsername(),
        });
        break;
      case '洽谈':
        await talkClientFile({
          id,
          trackRecord: params.trackRecord,
          handleUser: getCurrentUsername(),
        });
        break;
      case '确认':
        await confirmClientFile({
          id,
          transformResult: params.transformResult,
          handleUser: getCurrentUsername(),
        });
        break;
      case '续费':
        await renewClientFile({
          id,
          transformResult: params.transformResult,
          handleUser: getCurrentUsername(),
        });
        break;
      case '服务':
        await serviceClientFile({
          id,
          trackRecord: params.trackRecord,
          handleUser: getCurrentUsername(),
        });
        break;
      default:
        throw new Error(`未知操作类型：${title}`);
    }

    ElMessage.success(`${title}成功`);
    handleRefresh();
  } catch (error) {
    console.error(`${title}失败:`, error);
    ElMessage.error(`${title}失败`);
  } finally {
    loadingInstance.close();
  }
};

/** 快捷筛选 - 根据需求类型筛选 */
const handleDemandTypeFilter = (demandType) => {
  filterDemandType.value = demandType;
  dataObj.searchParams.demandType = demandType;
  handleRefresh();
};

/** 快捷筛选 - 根据意向程度筛选 */
const handleIntentLevelFilter = (intentLevel) => {
  filterIntentLevel.value = intentLevel;
  dataObj.searchParams.intentLevel = intentLevel;
  handleRefresh();
};

/** 快捷筛选 - 根据客户状态筛选 */
const handleClientStatusFilter = (clientStatus) => {
  filterClientStatus.value = clientStatus;
  dataObj.searchParams.clientStatus = clientStatus;
  handleRefresh();
};

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}
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

/** 快捷筛选标签 */
const filterDemandType = ref(null);
const filterIntentLevel = ref(null);
const filterClientStatus = ref(null);

/** 获取当前筛选标签列表 */
const getFilterTags = computed(() => {
  const tags = [];
  if (filterDemandType.value !== null) {
    tags.push({
      type: 'demandType',
      label: `需求类型：${getClientDemandTypeLabel(filterDemandType.value)}`,
      value: filterDemandType.value,
    });
  }
  if (filterIntentLevel.value !== null) {
    tags.push({
      type: 'intentLevel',
      label: `意向程度：${getClientIntentLevelLabel(filterIntentLevel.value)}`,
      value: filterIntentLevel.value,
    });
  }
  if (filterClientStatus.value !== null) {
    tags.push({
      type: 'clientStatus',
      label: `客户状态：${getClientStatusLabel(filterClientStatus.value)}`,
      value: filterClientStatus.value,
    });
  }
  return tags;
});

/** 取消单个筛选 */
const handleCancelFilter = (tag) => {
  switch (tag.type) {
    case 'demandType':
      filterDemandType.value = null;
      delete dataObj.searchParams.demandType;
      break;
    case 'intentLevel':
      filterIntentLevel.value = null;
      delete dataObj.searchParams.intentLevel;
      break;
    case 'clientStatus':
      filterClientStatus.value = null;
      delete dataObj.searchParams.clientStatus;
      break;
  }
  handleRefresh();
};

/** 清空所有筛选 */
const handleClearAllFilters = () => {
  filterDemandType.value = null;
  filterIntentLevel.value = null;
  filterClientStatus.value = null;
  dataObj.searchParams = {};
  handleRefresh();
};
const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;

  // 根据searchParams筛选数据
  const filteredList = dataObj.apilist.filter((v) => {
    let searchMatch = true;
    Object.keys(dataObj.searchParams).forEach((key) => {
      const value = dataObj.searchParams[key];
      if (value !== '' && value !== null && value !== undefined) {
        if (typeof value === 'string') {
          searchMatch = searchMatch && v[key]?.toString().includes(value);
        } else {
          searchMatch = searchMatch && v[key] === value;
        }
      }
    });

    return searchMatch;
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
  schema: useSearchFormSchema().map((v) => {
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

// 根据客户状态获取行按钮配置
const getRowButtons = (row) => {
  const status = Number(row.clientStatus);

  switch (status) {
    case 0:
      // 潜在客户：分类、跟进、维护
      return [
        { content: '分类', iconName: 'EditPen', handler: () => handleClassify(row) },
        { content: '跟进', iconName: 'ChatDotRound', handler: () => handleFollow(row) },
        { content: '维护', iconName: 'Tools', handler: () => handleMaintain(row) },
      ];
    case 1:
      // 意向客户：洽谈、确认、转化
      return [
        { content: '洽谈', iconName: 'ChatLineSquare', handler: () => handleTalk(row) },
        { content: '确认', iconName: 'CircleCheck', handler: () => handleConfirm(row) },
        { content: '转化', iconName: 'Promotion', handler: () => handleTransform(row) },
      ];
    case 2:
      // 已签约：查看、续费、服务
      return [
        { content: '查看', iconName: 'View', handler: () => handleOpenClientDetail(row) },
        { content: '续费', iconName: 'RefreshRight', handler: () => handleRenew(row) },
        { content: '服务', iconName: 'Service', handler: () => handleService(row) },
      ];
    default:
      return [];
  }
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
    <!--   基础详情抽屉-->
    <DetailDrawer
      ref="detailDrawerRef"
      :title="`${dataObj.detailObj.clientName} 详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
    />
    <!--   客户完整详情抽屉（含意向场地、跟进记录） -->
    <ClientDetailDrawer ref="clientDetailDrawerRef" />
    <!--   操作对话框（分类/维护/签约/跟进/洽谈/确认/转化/续费/服务） -->
    <ClientOperationDialog ref="operationDialogRef" @confirm="handleOperationConfirm" />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <!-- 快捷筛选标签 -->
    <div v-if="getFilterTags.length > 0" class="filter-tags-container">
      <el-tag
        v-for="(tag, index) in getFilterTags"
        :key="index"
        closable
        type="info"
        size="small"
        @close="handleCancelFilter(tag)"
      >
        {{ tag.label }}
      </el-tag>
      <el-button
        type="primary"
        link
        size="small"
        style="margin-left: 8px;"
        @click="handleClearAllFilters"
      >
        清空筛选
      </el-button>
    </div>

    <Grid>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="收集" icon-name="Plus" @click="handleCreate" />
          <IconButton content="建立" icon-name="Edit" @click="handleEdit()" />
          <IconButton content="分类" icon-name="EditPen" @click="handleClassify()" />
          <IconButton content="维护" icon-name="Tools" @click="handleMaintain()" />
          <IconButton content="签约" icon-name="Promotion" @click="handleSign()" />
          <IconButton content="导出" icon-name="download" @click="handleExport" />
          <IconButton content="搜索" icon-name="search" @click="handleSerachShow" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>
      <template #clientName="{ row }">
        <span
          class="client-name-link"
          style="color: #409eff; cursor: pointer; text-decoration: underline;"
          @click="handleClientNameClick(row)"
        >
          {{ row.clientName }}
        </span>
      </template>
      <template #demandType="{ row }">
        <el-tag
          :type="getClientDemandTypeTagType(row.demandType)"
          style="cursor: pointer;"
          @click="handleDemandTypeFilter(row.demandType)"
        >
          {{ getClientDemandTypeLabel(row.demandType) }}
        </el-tag>
      </template>
      <template #intentLevel="{ row }">
        <el-tag
          :type="getClientIntentLevelTagType(row.intentLevel)"
          style="cursor: pointer;"
          @click="handleIntentLevelFilter(row.intentLevel)"
        >
          {{ getClientIntentLevelLabel(row.intentLevel) }}
        </el-tag>
      </template>
      <template #clientStatus="{ row }">
        <el-tag
          :type="getClientStatusTagType(row.clientStatus)"
          style="cursor: pointer;"
          @click="handleClientStatusFilter(row.clientStatus)"
        >
          {{ getClientStatusLabel(row.clientStatus) }}
        </el-tag>
      </template>
      <template #intentSite="{ row }">
        <span v-if="row.intentSiteName">{{ row.intentSiteName }}</span>
        <span v-else style="color: #c0c4cc;">-</span>
      </template>
      <template #trackRecord="{ row }">
        <el-tooltip :content="row.trackRecord" placement="top" :show-after="500">
          <span class="track-record-text">{{ row.trackRecord }}</span>
        </el-tooltip>
      </template>
      <template #handleUser="{ row }">
        <span>{{ row.handleUser }}</span>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <template v-for="(btn, index) in getRowButtons(row)" :key="index">
            <IconButton
              :content="btn.content"
              :icon-name="btn.iconName"
              :color="btn.color"
              @click="btn.handler"
            />
          </template>
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
          <span> 本页统计：{{ textObj.total }} </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>

<style scoped>
.client-name-link:hover {
  color: #66b1ff;
}

.track-record-text {
  display: inline-block;
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}

.filter-tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  padding: 8px 12px;
  margin-bottom: 4px;
  background-color: #f5f7fa;
  border-radius: 4px;
}
</style>
