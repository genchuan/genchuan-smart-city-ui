<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
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

/** 创建角色 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

/** 编辑角色 */
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
    text: $t('ui.actionMessage.deleting', [row.name]),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter((v) => v.id !== row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.name]));
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
    .map((v) => v)
    .filter((v) => {
      if (activeName.value === '全部') {
        return true;
      }
      return v.status === activeName.value;
    }).length;
  dataObj.list = dataObj.apilist
    .map((v) => v)
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
  // 垂直布局，label和input在不同行，值为vertical
  // 水平布局，label和input在同一行
  layout: 'horizontal',
  schema: useFormSchema().map((v) => {
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

const activeName = ref('全部');
const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerApi.open();
};
const tabsData = ref([
  { label: '全部' },
  { label: '待使用' },
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

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <DetailDrawer :title="`${dataObj.detailObj.name}关联表`">
      <div class="detail-card">
        <div class="detail-card-row">
          <div class="detail-row-left">主键ID:</div>
          <div class="detail-row-right">
            {{ dataObj.detailObj.charge_reserve_id }}
          </div>
        </div>

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
          <div class="detail-row-left">车牌号码:</div>
          <div class="detail-row-right">
            {{ dataObj.detailObj.car_number }}
          </div>
        </div>

        <div class="detail-card-row">
          <div class="detail-row-left">充电桩ID:</div>
          <div class="detail-row-right">
            {{ dataObj.detailObj.charge_pile_id }}
          </div>
        </div>

        <div class="detail-card-row">
          <div class="detail-row-left">预约日期:</div>
          <div class="detail-row-right">
            {{ dataObj.detailObj.reserve_date }}
          </div>
        </div>

        <div class="detail-card-row">
          <div class="detail-row-left">预约开始时间:</div>
          <div class="detail-row-right">
            {{ dataObj.detailObj.start_time }}
          </div>
        </div>

        <div class="detail-card-row">
          <div class="detail-row-left">预约结束时间:</div>
          <div class="detail-row-right">
            {{ dataObj.detailObj.end_time }}
          </div>
        </div>

        <div class="detail-card-row">
          <div class="detail-row-left">状态:</div>
          <div class="detail-row-right">
            {{ dataObj.detailObj.status }}
          </div>
        </div>

        <div class="detail-card-row">
          <div class="detail-row-left">实际充电时长:</div>
          <div class="detail-row-right">
            {{ dataObj.detailObj.actual_charge_time }}
          </div>
        </div>

        <div class="detail-card-row">
          <div class="detail-row-left">充电度数:</div>
          <div class="detail-row-right">
            {{ dataObj.detailObj.charge_amount }}
          </div>
        </div>

        <div class="detail-card-row">
          <div class="detail-row-left">充电费用:</div>
          <div class="detail-row-right">
            {{ dataObj.detailObj.charge_fee }}
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
            {{ dataObj.detailObj.remark }}
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
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
        </div>
      </template>
      <template #chargePileId="{ row }">
        <el-text
          class="charge-pile-id-link"
          type="primary"
          @click="handleOpenDetail(row)"
        >
          {{ row.charge_pile_id }}
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
          <span>
            本页统计：订单数10; 待使用:3; 已使用:3; 已取消:2; 已过期:1
          </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>

<style scoped>
.charge-pile-id-link {
  color: #409eff;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.3s ease;
}

.charge-pile-id-link:hover {
  color: #337ecc;
  text-decoration: underline;
}

.park-lot-table-new {
  width: 100%;
  height: 100%;
}

.demo-tabs {
  padding: 0 10px;
  background: #fff;
}

.common-total {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  background-color: #f5f7fa;
  border-top: 1px solid #ebeef5;
}

.common-total:hover {
  background-color: #e4e7ed;
}

.tabel-tab-icon {
  font-size: 14px;
  color: #909399;
}

.common-total-bottom {
  padding: 10px;
  font-size: 14px;
  color: #606266;
  background-color: #f9fafc;
  border-top: 1px solid #ebeef5;
}

.detail-card {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
}

.detail-card-row {
  display: flex;
  padding-bottom: 12px;
  margin-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.detail-card-row:last-child {
  padding-bottom: 0;
  margin-bottom: 0;
  border-bottom: none;
}

.detail-row-left {
  flex-shrink: 0;
  width: 150px;
  font-weight: 500;
  color: #606266;
}

.detail-row-right {
  flex: 1;
  color: #303133;
}

.query-form {
  padding: 20px;
}
</style>
