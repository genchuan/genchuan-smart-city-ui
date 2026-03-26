<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

import {
  activityDataList,
  activityDetailFields,
  activityTextObj,
  dataList,
  detailFields,
  textObj,
  useActivityFormSchema,
  useActivityGridColumns,
  useFormSchema,
  useGridColumns,
} from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'coupon',
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
  const currentTextObj = props.type === 'activity' ? activityTextObj : textObj;
  const idField = props.type === 'activity' ? 'activityId' : 'couponId';
  return formData.value?.[idField]
    ? currentTextObj.editText
    : currentTextObj.addText;
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
const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 120,
  },
  layout: 'horizontal',
  schema: props.type === 'activity' ? useActivityFormSchema() : useFormSchema(),
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
    const currentTextObj =
      props.type === 'activity' ? activityTextObj : textObj;
    const idField = props.type === 'activity' ? 'activityId' : 'couponId';

    if (formDrawerApi.sharedData.payload.title === currentTextObj.addText) {
      dataObj.apilist.push(obj);
    } else {
      dataObj.apilist.forEach((v, i) => {
        if (v[idField] === formData.value?.[idField]) {
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
      const idField = props.type === 'activity' ? 'activityId' : 'couponId';
      if (formData.value?.[idField]) {
        await formApi.setValues(formData.value);
      } else {
        formApi.resetForm();
      }
    }
  },
});

// 发放表单配置
const issueFormSchema = [
  {
    fieldName: 'issueMethod',
    label: '发放方式',
    component: 'Select',
    componentProps: {
      placeholder: '请选择发放方式',
      options: [
        { label: '手动发放', value: 'manual' },
        { label: '自动发放', value: 'auto' },
        { label: '批量发放', value: 'batch' },
      ],
    },
    rules: 'required',
  },
  {
    fieldName: 'issueScope',
    label: '发放范围',
    component: 'Select',
    componentProps: {
      placeholder: '请选择发放范围',
      options: [
        { label: '全部用户', value: 'all' },
        { label: '新用户', value: 'new' },
        { label: '老用户', value: 'old' },
        { label: '指定用户', value: 'specific' },
      ],
    },
  },
];

const issueFormData = ref();
const [IssueForm, issueFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 110,
  },
  layout: 'horizontal',
  schema: issueFormSchema,
  showDefaultActions: false,
});

const [IssueDrawer, issueDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  placement: 'right',
  onCancel() {
    issueDrawerApi.close();
  },
  onConfirm() {
    const obj = issueFormApi.form.values;
    if (!obj.issueMethod) {
      ElMessage.warning('请选择发放方式');
      return;
    }
    // 这里可以添加发放逻辑
    ElMessage.success('发放成功');
    issueDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      issueFormData.value = issueDrawerApi.getData();
      issueFormApi.resetForm();
    }
  },
});

// 处理发放操作
function handleIssue(row) {
  issueDrawerApi
    .setData({
      title: `发放优惠券 - ${row.couponName}`,
      couponId: row.couponId,
      couponName: row.couponName,
    })
    .open();
}

// 处理活动状态切换
async function handleToggleStatus(row) {
  const newStatus = row.status === '启动' ? '结束' : '启动';
  const confirmMessage = `确定要${newStatus === '启动' ? '启动' : '结束'}活动「${row.activityName}」吗？`;

  try {
    await confirm(confirmMessage);

    // 查找并更新活动状态
    const index = dataObj.apilist.findIndex(
      (item) => item.activityId === row.activityId,
    );
    if (index !== -1) {
      dataObj.apilist[index].status = newStatus;
      ElMessage.success(`${newStatus === '启动' ? '启动' : '结束'}活动成功`);
      // 刷新表格
      handleRefresh();
    }
  } catch {
    // 用户取消操作
  }
}

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 导出表格 */
async function handleExport() {
  const currentTextObj = props.type === 'activity' ? activityTextObj : textObj;
  exportToExcel(
    dataObj.apilist,
    currentTextObj.excelName,
    currentTextObj.excelAllName,
  );
}

/** 创建活动/优惠券 */
function handleCreate() {
  const currentTextObj = props.type === 'activity' ? activityTextObj : textObj;
  formDrawerApi
    .setData({
      title: currentTextObj.addText,
    })
    .open();
}

/** 编辑活动/优惠券 */
function handleEdit(row) {
  const currentTextObj = props.type === 'activity' ? activityTextObj : textObj;
  formDrawerApi
    .setData({
      title: currentTextObj.editText,
      ...row,
    })
    .open();
}
// async function handleDelete(row) {
//   const loadingInstance = ElLoading.service({
//     text: $t('ui.actionMessage.deleting', [row.couponName]),
//   });
//   try {
//     dataObj.apilist = dataObj.apilist.filter(
//       (v) => v.couponId !== row.couponId,
//     );
//     ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.couponName]));
//     handleRefresh();
//   } finally {
//     loadingInstance.close();
//   }
// }

async function handleDeleteBatch() {
  await confirm($t('确定删除这些数据吗？'));
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deletingBatch'),
  });
  try {
    const idField = props.type === 'activity' ? 'activityId' : 'couponId';
    dataObj.apilist = dataObj.apilist.filter(
      (v) => !checkedIds.value.includes(v[idField]),
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
  const idField = props.type === 'activity' ? 'activityId' : 'couponId';
  checkedIds.value = records.map((item) => item[idField]);
}
const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: (props.type === 'activity' ? activityDataList() : dataList()).length,
  currentPage: 1,
  pageSize: 10,
  apilist: props.type === 'activity' ? activityDataList() : dataList(),
  list: [],
  searchParams: {},
});
const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;

  // 根据activeName和筛选条件筛选数据
  const filteredList = dataObj.apilist.filter((v) => {
    // 状态筛选
    let statusMatch = true;
    // 根据当前类型使用不同的状态字段
    const statusField =
      props.type === 'activity' ? 'status' : 'couponStatusName';
    switch (activeName.value) {
      case '启动': {
        statusMatch = v[statusField] === '启动';
        break;
      }
      case '启用': {
        statusMatch = v[statusField] === '启用';
        break;
      }
      case '禁用': {
        statusMatch = v[statusField] === '禁用';
        break;
      }
      case '结束': {
        statusMatch = v[statusField] === '结束';
        break;
      }
    }

    // 优惠券码筛选
    const couponCodeMatch =
      !filterCouponCode.value || v.couponCode === filterCouponCode.value;

    // 优惠券类型筛选
    const couponTypeNameMatch =
      !filterCouponTypeName.value ||
      v.couponTypeName === filterCouponTypeName.value;

    // 适用范围筛选
    const applyScopeNameMatch =
      !filterApplyScopeName.value ||
      v.applyScopeName === filterApplyScopeName.value;

    // 适用场景筛选
    const couponSceneNameMatch =
      !filterCouponSceneName.value ||
      v.couponSceneName === filterCouponSceneName.value;

    // 活动类型筛选
    const activityTypeNameMatch =
      !filterActivityTypeName.value ||
      v.activityTypeName === filterActivityTypeName.value;

    // 搜索条件筛选
    let searchMatch = true;
    Object.keys(dataObj.searchParams).forEach((key) => {
      const value = dataObj.searchParams[key];
      if (value) {
        searchMatch =
          searchMatch && (v[key]?.toString().includes(value) || false);
      }
    });

    return (
      statusMatch &&
      couponCodeMatch &&
      couponTypeNameMatch &&
      applyScopeNameMatch &&
      couponSceneNameMatch &&
      activityTypeNameMatch &&
      searchMatch
    );
  });

  dataObj.total = filteredList.length;
  dataObj.list = filteredList.slice(
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
    labelWidth: 120,
  },
  // 提交函数
  handleSubmit: onSubmit,
  // 垂直布局，label和input在不同行，值为vertical
  // 水平布局，label和input在同一行
  layout: 'horizontal',
  schema: (props.type === 'activity'
    ? useActivityFormSchema()
    : useFormSchema()
  ).map((v) => {
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
  // 处理搜索数据
  dataObj.searchParams = values;
  // 触发表格重新查询
  handleRefresh();
  // 关闭抽屉
  drawerApi.close();
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns:
      props.type === 'activity' ? useActivityGridColumns() : useGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => getTableData({ page }),
      },
    },
    rowConfig: {
      keyField: props.type === 'activity' ? 'activityId' : 'couponId',
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

// 筛选状态管理
const filterCouponCode = ref(''); // 优惠券码筛选
const filterCouponTypeName = ref(''); // 优惠券类型筛选
const filterApplyScopeName = ref(''); // 适用范围筛选
const filterCouponSceneName = ref(''); // 适用场景筛选
const filterActivityTypeName = ref(''); // 活动类型筛选

const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerRef.value.open();
};

// 处理优惠券码点击
const handleCouponCodeClick = (couponCode) => {
  filterCouponCode.value =
    filterCouponCode.value === couponCode ? '' : couponCode;
  gridApi.query();
};
/** 取消优惠券码筛选 */
const handleCancelCouponCodeFilter = () => {
  filterCouponCode.value = '';
  gridApi.query();
};

// 处理优惠券类型点击
const handleCouponTypeNameClick = (couponTypeName) => {
  filterCouponTypeName.value =
    filterCouponTypeName.value === couponTypeName ? '' : couponTypeName;
  gridApi.query();
};
/** 取消优惠券类型筛选 */
const handleCancelCouponTypeNameFilter = () => {
  filterCouponTypeName.value = '';
  gridApi.query();
};

// 处理适用范围点击
const handleApplyScopeNameClick = (applyScopeName) => {
  filterApplyScopeName.value =
    filterApplyScopeName.value === applyScopeName ? '' : applyScopeName;
  gridApi.query();
};
/** 取消适用范围筛选 */
const handleCancelApplyScopeNameFilter = () => {
  filterApplyScopeName.value = '';
  gridApi.query();
};

// 处理适用场景点击
const handleCouponSceneNameClick = (couponSceneName) => {
  filterCouponSceneName.value =
    filterCouponSceneName.value === couponSceneName ? '' : couponSceneName;
  gridApi.query();
};
/** 取消适用场景筛选 */
const handleCancelCouponSceneNameFilter = () => {
  filterCouponSceneName.value = '';
  gridApi.query();
};

// 处理活动类型点击
const handleActivityTypeNameClick = (activityTypeName) => {
  filterActivityTypeName.value =
    filterActivityTypeName.value === activityTypeName ? '' : activityTypeName;
  gridApi.query();
};
/** 取消活动类型筛选 */
const handleCancelActivityTypeNameFilter = () => {
  filterActivityTypeName.value = '';
  gridApi.query();
};

// 修改tabsData为三个标签：全部、启用/启动、禁用/结束
const tabsData = computed(() => {
  return props.type === 'activity'
    ? [{ label: '全部' }, { label: '启动' }, { label: '结束' }]
    : [{ label: '全部' }, { label: '启用' }, { label: '禁用' }];
});

// 创建标签文本，显示数量统计
const createLabel = (item) => {
  let count = 0;

  switch (item.label) {
    case '全部': {
      count = dataObj.apilist.length;

      break;
    }
    case '启动':
    case '启用': {
      // 根据当前类型使用不同的状态字段和值
      const statusField =
        props.type === 'activity' ? 'status' : 'couponStatusName';
      const statusValue = props.type === 'activity' ? '启动' : '启用';
      count = dataObj.apilist.filter(
        (v) => v[statusField] === statusValue,
      ).length;

      break;
    }
    case '禁用':
    case '结束': {
      // 根据当前类型使用不同的状态字段和值
      const statusField =
        props.type === 'activity' ? 'status' : 'couponStatusName';
      const statusValue = props.type === 'activity' ? '结束' : '禁用';
      count = dataObj.apilist.filter(
        (v) => v[statusField] === statusValue,
      ).length;

      break;
    }
    // No default
  }

  return `${item.label}(${count})`;
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
    <!--   详情抽屉-->
    <DetailDrawer
      ref="detailDrawerRef"
      :title="
        props.type === 'activity'
          ? `${dataObj.detailObj.activityName}详情`
          : `${dataObj.detailObj.couponName}详情`
      "
      :data="dataObj.detailObj"
      :fields="props.type === 'activity' ? activityDetailFields : detailFields"
    />
    <!--   发放抽屉（仅优惠券管理显示）-->
    <IssueDrawer
      v-if="props.type === 'coupon'"
      :title="issueDrawerApi.sharedData.payload?.title || '发放优惠券'"
    >
      <IssueForm />
    </IssueDrawer>
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
          <!-- 优惠券码筛选标签 -->
          <el-tag
            v-if="filterCouponCode"
            type="primary"
            closable
            @close="handleCancelCouponCodeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            优惠券码：{{ filterCouponCode }}
          </el-tag>
          <!-- 优惠券类型筛选标签 -->
          <el-tag
            v-if="filterCouponTypeName"
            type="success"
            closable
            @close="handleCancelCouponTypeNameFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            优惠券类型：{{ filterCouponTypeName }}
          </el-tag>
          <!-- 适用范围筛选标签 -->
          <el-tag
            v-if="filterApplyScopeName"
            type="warning"
            closable
            @close="handleCancelApplyScopeNameFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            适用范围：{{ filterApplyScopeName }}
          </el-tag>
          <!-- 适用场景筛选标签 -->
          <el-tag
            v-if="filterCouponSceneName"
            type="danger"
            closable
            @close="handleCancelCouponSceneNameFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            适用场景：{{ filterCouponSceneName }}
          </el-tag>
          <!-- 活动类型筛选标签 -->
          <el-tag
            v-if="filterActivityTypeName"
            type="success"
            closable
            @close="handleCancelActivityTypeNameFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            活动类型：{{ filterActivityTypeName }}
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
      <template #couponId="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.couponId }}
        </el-text>
      </template>
      <template #activityId="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.activityId }}
        </el-text>
      </template>
      <template #couponCode="{ row }">
        <el-text
          @click="handleCouponCodeClick(row.couponCode)"
          class="common-align"
          type="primary"
        >
          {{ row.couponCode }}
        </el-text>
      </template>
      <template #couponTypeName="{ row }">
        <el-text
          @click="handleCouponTypeNameClick(row.couponTypeName)"
          class="common-align"
          type="primary"
        >
          {{ row.couponTypeName }}
        </el-text>
      </template>
      <template #applyScopeName="{ row }">
        <el-text
          @click="handleApplyScopeNameClick(row.applyScopeName)"
          class="common-align"
          type="primary"
        >
          {{ row.applyScopeName }}
        </el-text>
      </template>
      <template #couponSceneName="{ row }">
        <el-text
          @click="handleCouponSceneNameClick(row.couponSceneName)"
          class="common-align"
          type="primary"
        >
          {{ row.couponSceneName }}
        </el-text>
      </template>
      <template #activityTypeName="{ row }">
        <el-text
          @click="handleActivityTypeNameClick(row.activityTypeName)"
          class="common-align"
          type="primary"
        >
          {{ row.activityTypeName }}
        </el-text>
      </template>
      <template #couponStatusName="{ row }">
        <el-tag
          :type="row.couponStatusName === '启用' ? 'success' : 'danger'"
          size="small"
        >
          {{ row.couponStatusName }}
        </el-tag>
      </template>
      <template #status="{ row }">
        <el-tag
          :type="row.status === '启动' ? 'success' : 'danger'"
          size="small"
        >
          {{ row.status }}
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
            icon-name="edit"
            @click="handleEdit(row)"
          />
          <IconButton
            v-if="props.type === 'coupon'"
            content="发放"
            icon-name="Promotion"
            @click="handleIssue(row)"
          />
          <IconButton
            v-if="props.type === 'activity'"
            :content="row.status === '启动' ? '结束' : '启动'"
            icon-name="SwitchButton"
            @click="handleToggleStatus(row)"
          />
          <!-- <IconButton
            content="删除"
            icon-name="delete"
            color="#F56C6C"
            @click="handleDelete(row)"
          /> -->
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
            本页统计：{{
              props.type === 'activity' ? '活动数量' : '优惠券数量'
            }}: {{ dataObj.total }};
            {{ props.type === 'activity' ? '启动' : '启用' }}:
            {{
              dataObj.apilist.filter((v) =>
                props.type === 'activity'
                  ? v.status === '启动'
                  : v.couponStatusName === '启用',
              ).length
            }}; {{ props.type === 'activity' ? '结束' : '禁用' }}:
            {{
              dataObj.apilist.filter((v) =>
                props.type === 'activity'
                  ? v.status === '结束'
                  : v.couponStatusName === '禁用',
              ).length
            }}
          </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span>
            全部统计：{{
              props.type === 'activity' ? activityTextObj.total : textObj.total
            }}
          </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
