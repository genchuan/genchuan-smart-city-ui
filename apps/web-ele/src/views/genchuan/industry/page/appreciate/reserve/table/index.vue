<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <DetailDrawer :title="`${dataObj.detailObj.lot_id}详情`">
      <div class="detail-card">
        <div class="detail-card-row">
          <div class="detail-row-left">预约编号:</div>
          <div class="detail-row-right">
            {{ dataObj.detailObj.reservation_no }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">用户ID:</div>
          <div class="detail-row-right">
            {{ dataObj.detailObj.user_id }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">停车场名称:</div>
          <div class="detail-row-right parking-lot-name">
            {{ dataObj.detailObj.lot_id }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">车牌号:</div>
          <div class="detail-row-right">
            {{ dataObj.detailObj.car_number }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">车位ID:</div>
          <div class="detail-row-right">
            {{ dataObj.detailObj.space_id || '未分配' }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">预约日期:</div>
          <div class="detail-row-right">
            {{ dataObj.detailObj.reserve_date }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">开始时间:</div>
          <div class="detail-row-right">
            {{ dataObj.detailObj.start_time }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">结束时间:</div>
          <div class="detail-row-right">
            {{ dataObj.detailObj.end_time }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">预约状态:</div>
          <div class="detail-row-right">
            <el-tag :type="getStatusTagType(dataObj.detailObj.status)">
              {{ dataObj.detailObj.status }}
            </el-tag>
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">核验时间:</div>
          <div class="detail-row-right">
            {{ dataObj.detailObj.verify_time || '未核验' }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">核验人:</div>
          <div class="detail-row-right">
            {{ dataObj.detailObj.verify_by || '未核验' }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">取消时间:</div>
          <div class="detail-row-right">
            {{ dataObj.detailObj.cancel_time || '未取消' }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">取消原因:</div>
          <div class="detail-row-right">
            {{ dataObj.detailObj.cancel_reason || '无' }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">创建时间:</div>
          <div class="detail-row-right">
            {{ dataObj.detailObj.create_time }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">更新时间:</div>
          <div class="detail-row-right">
            {{ dataObj.detailObj.update_time }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">备注:</div>
          <div class="detail-row-right">
            {{ dataObj.detailObj.remark || '无' }}
          </div>
        </div>
      </div>
    </DetailDrawer>
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>
    <Grid>
      <!-- 三级状态 -->
      <template #table-title>
        <div class="tabel-tabs">
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
        </div>
      </template>
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: '新增',
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['system:role:create'],
              onClick: handleCreate,
            },
            {
              label: $t('ui.actionTitle.export'),
              type: 'primary',
              icon: ACTION_ICON.DOWNLOAD,
              auth: ['system:role:export'],
              onClick: handleExport,
            },
            {
              label: $t('ui.actionTitle.deleteBatch'),
              type: 'danger',
              icon: ACTION_ICON.DELETE,
              disabled: isEmpty(checkedIds),
              auth: ['system:role:delete'],
              onClick: handleDeleteBatch,
            },
          ]"
        />
        <button
          class="vxe-button type--button size--small is--circle ml-2"
          title="搜索"
          type="button"
          @click="handleSerachShow"
        >
          <i
            class="vxe-button--item vxe-button--prefix-icon vxe-icon-search"
          ></i>
        </button>
        <button
          class="vxe-button type--button size--small is--circle"
          title="全屏"
          type="button"
          @click="handleFullShow"
        >
          <i
            class="vxe-button--item vxe-button--prefix-icon vxe-table-icon-fullscreen"
          ></i>
        </button>
      </template>
      <!-- 停车场名称列插槽 - 蓝色字体可点击 -->
      <template #parkingLot="{ row }">
        <el-text
          class="parking-lot-link"
          type="primary"
          @click="handleOpenDetail(row)"
        >
          {{ row.lot_id }}
        </el-text>
      </template>
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: '详情',
              type: 'primary',
              link: true,
              icon: ACTION_ICON.MORE,
              auth: ['system:role:update'],
              onClick: handleOpenDetail.bind(null, row),
            },
            {
              label: '编辑',
              type: 'primary',
              link: true,
              icon: ACTION_ICON.EDIT,
              auth: ['system:role:update'],
              onClick: handleEdit.bind(null, row),
            },
            {
              label: '删除',
              type: 'danger',
              link: true,
              icon: ACTION_ICON.DELETE,
              auth: ['system:role:delete'],
              popConfirm: {
                title: $t('ui.actionMessage.deleteConfirm', [row.reservation_no]),
                confirm: handleDelete.bind(null, row),
              },
            },
          ]"
        />
      </template>
      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon" v-if="!dataObj.totalShow">
            <ArrowDown />
          </el-icon>
          <el-icon class="tabel-tab-icon" v-if="dataObj.totalShow">
            <ArrowUp />
          </el-icon>
          <span> 本页统计：预约记录{{ dataObj.list.length }}条; 已使用:{{ getCountByStatus('已使用') }}条; 已确认:{{ getCountByStatus('已确认') }}条 </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

import { dataList, textObj, useFormSchema, useGridColumns } from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
});

const getTitle = computed(() => {
  return formData.value?.id ? textObj.editText : textObj.addText;
});

// 获取状态标签类型
const getStatusTagType = (status) => {
  const typeMap = {
    '待核验': 'warning',
    '已确认': 'success',
    '已使用': 'primary',
    '已取消': 'info',
    '已过期': 'danger'
  };
  return typeMap[status] || 'default';
};

// 根据状态统计数量
const getCountByStatus = (status) => {
  return dataObj.list.filter(item => item.status === status).length;
};

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

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    detailDrawerApi.close();
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

/** 创建预约记录 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

/** 编辑预约记录 */
function handleEdit(row) {
  formDrawerApi
    .setData({
      title: textObj.editText,
      ...row,
    })
    .open();
}

async function handleDelete(row) {
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [row.reservation_no]),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter((v) => v.reservation_id !== row.reservation_id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.reservation_no]));
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
    dataObj.apilist = dataObj.apilist.filter(
      (v) => !checkedIds.value.includes(v.reservation_id),
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
  checkedIds.value = records.map((item) => item.reservation_id);
}

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: dataList().length,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(),
  list: [],
});

const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;
  dataObj.total = dataObj.apilist
    .filter((v) => {
      if (activeName.value === '全部') {
        return true;
      }
      return v.status === activeName.value;
    }).length;

  dataObj.list = dataObj.apilist
    .filter((v) => {
      if (activeName.value === '全部') {
        return true;
      }
      return v.status === activeName.value;
    })
    .slice(
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
  schema: useFormSchema().map((v) => {
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
      keyField: 'reservation_id',
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

// 打开详情页
const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerApi.open();
};

const tabsData = ref([
  { label: '全部' },
  { label: '待核验' },
  { label: '已确认' },
  { label: '已使用' },
  { label: '已取消' },
  { label: '已过期' },
]);

const createLabel = (item) => {
  let text = `(${dataObj.apilist.filter((v) => v.status === item.label).length})`;
  if (item.label === '全部') {
    text = `(${dataObj.apilist.length})`;
  }
  return item.label + text;
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
</script>

<style scoped>
.park-lot-table-new {
  width: 100%;
  height: 100%;
}

/* 停车场名称链接样式 */
.parking-lot-link {
  color: #1890ff;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.3s;
}

.parking-lot-link:hover {
  color: #40a9ff;
  text-decoration: underline;
}

.parking-lot-link:active {
  color: #096dd9;
}

/* 详情页样式 */
.detail-card {
  padding: 20px;
  background-color: #fff;
}

.detail-card-row {
  display: flex;
  margin-bottom: 16px;
  line-height: 24px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 12px;
}

.detail-card-row:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.detail-row-left {
  width: 100px;
  font-weight: 600;
  color: #333;
  flex-shrink: 0;
}

.detail-row-right {
  flex: 1;
  color: #666;
}

.parking-lot-name {
  color: #1890ff;
  font-weight: 500;
}

/* 表格标题样式 */
.tabel-tabs {
  margin-bottom: 16px;
}

.demo-tabs {
  background: #fff;
  padding: 0 16px;
}

.common-total {
  padding: 12px 16px;
  background: #f5f7fa;
  border-top: 1px solid #e4e7ed;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.3s;
}

.common-total:hover {
  background-color: #eef0f5;
}

.tabel-tab-icon {
  font-size: 14px;
  color: #909399;
}

.common-total-bottom {
  padding: 12px 16px;
  background: #f0f9ff;
  border-top: 1px solid #d9ecff;
  color: #606266;
}
</style>
