<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage } from 'element-plus';
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
  { label: '待处理' },
  { label: '处理中' },
  { label: '已办结' },
  { label: '已驳回' },
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
            {{ dataObj.detailObj.complaint_id }}
          </div>
        </div>

        <div class="detail-card-row">
          <div class="detail-row-left">投诉编号:</div>
          <div class="detail-row-right">
            {{ dataObj.detailObj.complaint_no }}
          </div>
        </div>

        <div class="detail-card-row">
          <div class="detail-row-left">投诉人ID:</div>
          <div class="detail-row-right">
            {{ dataObj.detailObj.complainant_id }}
          </div>
        </div>

        <div class="detail-card-row">
          <div class="detail-row-left">投诉人电话:</div>
          <div class="detail-row-right">
            {{ dataObj.detailObj.complainant_phone }}
          </div>
        </div>

        <div class="detail-card-row">
          <div class="detail-row-left">投诉类型:</div>
          <div class="detail-row-right">
            {{ dataObj.detailObj.complaint_type }}
          </div>
        </div>

        <div class="detail-card-row">
          <div class="detail-row-left">关联资产ID:</div>
          <div class="detail-row-right">
            {{ dataObj.detailObj.related_asset_id }}
          </div>
        </div>

        <div class="detail-card-row">
          <div class="detail-row-left">关联订单ID:</div>
          <div class="detail-row-right">
            {{ dataObj.detailObj.related_order_id }}
          </div>
        </div>

        <div class="detail-card-row">
          <div class="detail-row-left">投诉内容:</div>
          <div class="detail-row-right">
            {{ dataObj.detailObj.complaint_content }}
          </div>
        </div>

        <div class="detail-card-row">
          <div class="detail-row-left">投诉时间:</div>
          <div class="detail-row-right">
            {{ dataObj.detailObj.complaint_time }}
          </div>
        </div>

        <div class="detail-card-row">
          <div class="detail-row-left">处理状态:</div>
          <div class="detail-row-right">
            {{ dataObj.detailObj.status }}
          </div>
        </div>

        <div class="detail-card-row">
          <div class="detail-row-left">处理内容:</div>
          <div class="detail-row-right">
            {{ dataObj.detailObj.process_content }}
          </div>
        </div>

        <div class="detail-card-row">
          <div class="detail-row-left">处理人:</div>
          <div class="detail-row-right">
            {{ dataObj.detailObj.process_by }}
          </div>
        </div>

        <div class="detail-card-row">
          <div class="detail-row-left">处理时间:</div>
          <div class="detail-row-right">
            {{ dataObj.detailObj.process_time }}
          </div>
        </div>

        <div class="detail-card-row">
          <div class="detail-row-left">满意度:</div>
          <div class="detail-row-right">
            {{ dataObj.detailObj.satisfaction }}
          </div>
        </div>

        <div class="detail-card-row">
          <div class="detail-row-left">反馈时间:</div>
          <div class="detail-row-right">
            {{ dataObj.detailObj.feedback_time }}
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
      <template #parkName="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.name }}
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
              onClick: handleOpenDetail.bind(null, row),
            },
            {
              label: '编辑',
              type: 'primary',
              link: true,
              icon: ACTION_ICON.EDIT, 
              onClick: handleEdit.bind(null, row),
            },
            {
              label: '删除',
              type: 'danger',
              link: true,
              icon: ACTION_ICON.DELETE, 
              popConfirm: {
                title: $t('ui.actionMessage.deleteConfirm', [row.name]),
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
          <span>
            本页统计：投诉数量: 10; 待处理: 2; 处理中: 2; 已办结: 5; 已驳回: 1
          </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
