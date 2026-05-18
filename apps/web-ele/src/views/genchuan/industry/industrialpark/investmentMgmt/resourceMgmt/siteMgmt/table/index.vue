<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import {
  createSiteMgmt,
  exportSiteMgmt,
  followSiteMgmt,
  quitSiteMgmt,
  rejectSiteMgmt,
  renewSiteMgmt,
  reserveSiteMgmt,
  signSiteMgmt,
  updateSiteMgmt,
  updateSiteMgmtShow,
  updateSiteMgmtStatus,
} from '#/api/genchuan/industry/industrialpark/investmentMgmt/resourceMgmt/siteMgmt';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import SiteDetailDrawer from '../components/SiteDetailDrawer.vue';
import SiteOperationDialog from '../components/SiteOperationDialog.vue';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

import {
  dataList,
  detailFields,
  getSiteStatusLabel,
  getSiteStatusConfig,
  getSiteStatusTagType,
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
const siteDetailDrawerRef = ref(null);
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

/** 录入场地 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

/** 完善场地 - 需要选中数据 */
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

/** 标记场地状态 - 需要选中数据 */
async function handleUpdateStatus(row) {
  if (!row && checkedIds.value.length === 0) {
    ElMessage.warning('请先选中一条数据');
    return;
  }

  const targetRow = row || dataObj.apilist.find((item) => item.id === checkedIds.value[0]);
  if (!targetRow) return;

  await confirm('确定要标记该场地的状态吗？');
  const loadingInstance = ElLoading.service({ text: '正在标记...' });
  try {
    await updateSiteMgmtStatus({
      id: targetRow.id,
      siteStatus: targetRow.siteStatus,
      handleUser: getCurrentUsername(),
    });
    ElMessage.success('标记成功');
    handleRefresh();
  } catch (error) {
    console.error('标记失败:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 展示场地 - 需要选中数据 */
async function handleShow(row) {
  if (!row && checkedIds.value.length === 0) {
    ElMessage.warning('请先选中一条数据');
    return;
  }

  const targetRow = row || dataObj.apilist.find((item) => item.id === checkedIds.value[0]);
  if (!targetRow) return;

  await confirm('确定要将该场地发布到招商展示吗？');
  const loadingInstance = ElLoading.service({ text: '正在展示...' });
  try {
    await updateSiteMgmtShow({
      id: targetRow.id,
      handleUser: getCurrentUsername(),
    });
    ElMessage.success('展示成功');
    handleRefresh();
  } catch (error) {
    console.error('展示失败:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 签约入驻 - 需要选中数据（打开操作表单） */
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

/** 预约场地（打开操作表单） */
async function handleReserve(row) {
  operationDialogRef.value.open({
    title: '预约',
    id: row.id,
    ...row,
  });
}

/** 跟进洽谈 */
async function handleFollow(row) {
  const loadingInstance = ElLoading.service({ text: '正在跟进...' });
  try {
    await followSiteMgmt({
      id: row.id,
      handleUser: getCurrentUsername(),
    });
    ElMessage.success('跟进记录已保存');
    handleRefresh();
  } catch (error) {
    console.error('跟进失败:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 确认签约（打开操作表单） */
async function handleConfirm(row) {
  operationDialogRef.value.open({
    title: '确认',
    id: row.id,
    ...row,
  });
}

/** 处理操作对话框确认回调 */
const handleOperationConfirm = async (values) => {
  const { title, id, ...params } = values;
  const loadingInstance = ElLoading.service({ text: `正在${title}...` });

  try {
    switch (title) {
      case '续费':
        await renewSiteMgmt({
          id,
          rentInfo: params.rentInfo,
          handleUser: getCurrentUsername(),
        });
        break;
      case '确认':
        await signSiteMgmt({
          id,
          signCompany: params.signCompany,
          rentInfo: params.rentInfo,
          handleUser: getCurrentUsername(),
        });
        break;
      case '签约':
        await signSiteMgmt({
          id,
          signCompany: params.signCompany,
          rentInfo: params.rentInfo,
          handleUser: getCurrentUsername(),
        });
        break;
      case '预约':
        await reserveSiteMgmt({
          id,
          orderClient: params.orderClient,
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

/** 驳回洽谈 */
async function handleReject(row) {
  await confirm('确定要驳回该洽谈吗？场地将重置为空置状态。');
  const loadingInstance = ElLoading.service({ text: '正在驳回...' });
  try {
    await rejectSiteMgmt({
      id: row.id,
      handleUser: getCurrentUsername(),
    });
    ElMessage.success('驳回成功');
    handleRefresh();
  } catch (error) {
    console.error('驳回失败:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 续费（打开操作表单） */
async function handleRenew(row) {
  operationDialogRef.value.open({
    title: '续费',
    id: row.id,
    ...row,
  });
}

/** 退租 */
async function handleQuit(row) {
  await confirm('确定要办理退租吗？场地将重置为空置状态。');
  const loadingInstance = ElLoading.service({ text: '正在办理退租...' });
  try {
    await quitSiteMgmt({
      id: row.id,
      handleUser: getCurrentUsername(),
    });
    ElMessage.success('退租成功');
    handleRefresh();
  } catch (error) {
    console.error('退租失败:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 查看详情（基础详情） */
const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerRef.value.open();
};

/** 查看完整详情（包含照片、平面图、签约信息） */
const handleOpenSiteDetail = (row) => {
  siteDetailDrawerRef.value.open(row);
};

/** 点击场地编号打开完整详情 */
const handleSiteCodeClick = (row) => {
  handleOpenSiteDetail(row);
};

/** 点击图片打开完整详情 */
const handleImageClick = (row) => {
  handleOpenSiteDetail(row);
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
        if (key === 'siteArea') {
          searchMatch = searchMatch && v[key] == Number(value);
        } else if (typeof value === 'string') {
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

// 根据状态获取行按钮配置（使用字符串状态值）
const getRowButtons = (row) => {
  const status = Number(row.siteStatus);

  switch (status) {
    case 0:
      return [
        { content: '展示', iconName: 'Promotion', handler: () => handleShow(row) },
        { content: '预约', iconName: 'Calendar', handler: () => handleReserve(row) },
        { content: '修改', iconName: 'Edit', handler: () => handleEdit(row) },
      ];
    case 1:
      return [
        { content: '跟进', iconName: 'TrendCharts', handler: () => handleFollow(row) },
        { content: '确认', iconName: 'CircleCheck', handler: () => handleConfirm(row) },
        { content: '驳回', iconName: 'CircleClose', color: '#F56C6C', handler: () => handleReject(row) },
      ];
    case 2:
      return [
        { content: '查看', iconName: 'View', handler: () => handleOpenSiteDetail(row) },
        { content: '续费', iconName: 'Money', handler: () => handleRenew(row) },
        { content: '退租', iconName: 'Remove', color: '#F56C6C', handler: () => handleQuit(row) },
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
      :title="`${dataObj.detailObj.siteCode} 详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
    />
    <!--   场地完整详情抽屉（含照片、平面图、签约信息） -->
    <SiteDetailDrawer ref="siteDetailDrawerRef" />
    <!--   操作对话框（续费/确认/签约） -->
    <SiteOperationDialog ref="operationDialogRef" @confirm="handleOperationConfirm" />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>
    <Grid>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="录入" icon-name="DocumentAdd" @click="handleCreate" />
          <IconButton content="完善" icon-name="EditPen" @click="handleEdit()" />
          <IconButton content="标记" icon-name="Flag" @click="handleUpdateStatus()" />
          <IconButton content="展示" icon-name="Promotion" @click="handleShow()" />
          <IconButton content="签约" icon-name="DocumentChecked" @click="handleSign()" />
          <IconButton content="导出" icon-name="download" @click="handleExport" />
          <IconButton content="搜索" icon-name="search" @click="handleSerachShow" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>
      <template #siteCode="{ row }">
        <span
          class="site-code-link"
          style="color: #409eff; cursor: pointer; text-decoration: underline;"
          @click="handleSiteCodeClick(row)"
        >
          {{ row.siteCode }}
        </span>
      </template>
      <template #siteStatus="{ row }">
        <el-tag :type="getSiteStatusTagType(row.siteStatus)">
          {{ getSiteStatusLabel(row.siteStatus) }}
        </el-tag>
      </template>
      <template #photos="{ row }">
        <div class="image-cell" v-if="row.photos">
          <img
            :src="row.photos.split(',')[0]"
            alt="照片"
            class="thumbnail-image"
            @click="handleImageClick(row)"
          />
          <span class="image-count" v-if="row.photos.split(',').length > 1">
            +{{ row.photos.split(',').length - 1 }}
          </span>
        </div>
        <span v-else>-</span>
      </template>
      <template #floorPlan="{ row }">
        <div class="image-cell" v-if="row.floorPlan">
          <img
            :src="row.floorPlan"
            alt="平面图"
            class="thumbnail-image"
            @click="handleImageClick(row)"
          />
        </div>
        <span v-else>-</span>
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
.image-cell {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.thumbnail-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  transition: all 0.3s ease;
}

.thumbnail-image:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.image-count {
  position: absolute;
  top: -8px;
  right: -12px;
  background-color: #f56c6c;
  color: white;
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 8px;
  line-height: 14px;
}
</style>
