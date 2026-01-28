<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import DetailDrawer from '#/components/common/DetailDrawer.vue';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

import {
  dataList,
  deptDetailFields,
  deptList,
  textObj,
  useFormSchema,
  useGridColumns,
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
  return formData.value?.scheduleId ? textObj.editText : textObj.addText;
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

// 生成新的排班ID
const generateNewScheduleId = () => {
  // 从现有数据中获取最大的ID，然后自增
  // eslint-disable-next-line unicorn/no-array-reduce
  const maxId = dataObj.apilist.reduce((max, item) => {
    const idNum = Number.parseInt(item.scheduleId.replace('SCH', ''));
    return Math.max(idNum, max);
  }, 0);
  return `SCH${String(maxId + 1).padStart(3, '0')}`;
};

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    formDrawerApi.close();
  },
  onConfirm() {
    const obj = formApi.form.values;
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    if (formDrawerApi.sharedData.payload.title === textObj.addText) {
      // 新增逻辑，自动生成排班ID
      const newSchedule = {
        ...obj,
        scheduleId: generateNewScheduleId(),
        createTime: now,
        updateTime: now,
        // 根据maintainUserId获取运维人员姓名
        maintainUserName:
          {
            M001: '张三',
            M002: '王五',
            M003: '赵六',
            M004: '周八',
            M005: '吴九',
            M006: '郑十',
          }[obj.maintainUserId] || '',
        // 根据deptId获取部门名称
        deptName:
          {
            D001: '运维一部',
            D002: '运维二部',
            D003: '运维三部',
          }[obj.deptId] || '',
        // 默认操作人姓名
        createUserName: '系统管理员',
      };
      dataObj.apilist.push(newSchedule);
    } else {
      // 编辑逻辑
      dataObj.apilist.forEach((v, i) => {
        if (v.scheduleId === formData.value?.scheduleId) {
          dataObj.apilist[i] = {
            ...obj,
            scheduleId: formData.value.scheduleId,
            createTime: formData.value.createTime,
            updateTime: now,
            maintainUserName: formData.value.maintainUserName,
            deptName: formData.value.deptName,
            createUserName: formData.value.createUserName,
          };
        }
      });
    }
    handleRefresh();
    formDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
      if (formData.value?.scheduleId) {
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

/** 创建排班 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

/** 编辑排班 */
function handleEdit(row) {
  formDrawerApi
    .setData({
      title: textObj.editText,
      ...row,
    })
    .open();
}

/** 删除排班 */
async function handleDelete(row) {
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [row.maintainUserName]),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter(
      (v) => v.scheduleId !== row.scheduleId,
    );
    ElMessage.success(
      $t('ui.actionMessage.deleteSuccess', [row.maintainUserName]),
    );
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

/** 批量删除排班 */
async function handleDeleteBatch() {
  await confirm($t('确定删除这些数据吗？'));
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deletingBatch'),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter(
      (v) => !checkedIds.value.includes(v.scheduleId),
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
  checkedIds.value = records.map((item) => item.scheduleId);
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

// 搜索条件
const searchFormData = ref({});

const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;

  // 先根据activeName筛选数据
  let filteredList = dataObj.apilist.filter((v) => {
    switch (activeName.value) {
      case '全部': {
        return true;
      }
      case '取消': {
        return v.status === '取消';
      }
      case '正常': {
        return v.status === '正常';
      }
      case '调班': {
        return v.status === '调班';
      }
      // No default
    }
    return false;
  });
  // 第二步：叠加运维人员筛选
  if (filterUser.value) {
    filteredList = filteredList.filter(
      (v) => v.maintainUserName === filterUser.value,
    );
  }
  // 第三步：叠加班次类型筛选
  if (filterShiftType.value) {
    filteredList = filteredList.filter(
      (v) => v.shiftType === filterShiftType.value,
    );
  }
  // 再根据搜索条件筛选数据
  if (Object.keys(searchFormData.value).length > 0) {
    filteredList = filteredList.filter((item) => {
      // 遍历所有搜索条件
      for (const [key, value] of Object.entries(searchFormData.value)) {
        if (value && item[key] && !String(item[key]).includes(String(value))) {
          return false;
        }
      }
      return true;
    });
  }

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
function onSubmit(values) {
  searchFormData.value = values;
  drawerApi.close();
  handleRefresh();
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
      keyField: 'scheduleId',
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
const filterUser = ref(''); // 运维人员筛选：空=未筛选，有值=当前筛选运维人员
const filterShiftType = ref(''); // 班次类型筛选：空=未筛选，有值=当前筛选班次类型
// 详情抽屉相关
const detailDrawerRef = ref(null);
const detailData = ref({});
const detailFields = ref([
  { label: '排班ID', key: 'scheduleId' },
  { label: '运维人员', key: 'maintainUserName' },
  { label: '所属部门', key: 'deptName' },
  { label: '排班日期', key: 'scheduleDate' },
  { label: '班次类型', key: 'shiftType' },
  { label: '上班时间', key: 'startTime' },
  { label: '下班时间', key: 'endTime' },
  { label: '状态', key: 'status' },
  { label: '操作人', key: 'createUserName' },
  { label: '创建时间', key: 'createTime' },
  { label: '更新时间', key: 'updateTime' },
  { label: '调整原因', key: 'adjustReason' },
  { label: '备注', key: 'remark' },
]);

const handleOpenDetail = (row) => {
  detailData.value = row;
  if (detailDrawerRef.value) {
    detailDrawerRef.value.open();
  }
};

// 关闭详情抽屉
const handleCloseDetail = () => {
  if (detailDrawerRef.value) {
    detailDrawerRef.value.close();
  }
};

// 部门详情抽屉相关
const deptDetailDrawerRef = ref(null);
const selectedDept = ref({});

// 打开部门详情
const handleOpenDeptInfo = (row) => {
  // 根据deptId获取部门信息
  const deptInfo = deptList.find((dept) => dept.deptId === row.deptId);
  if (deptInfo) {
    selectedDept.value = deptInfo;
    deptDetailDrawerRef.value.open();
  }
};

// 部门详情关闭处理
const handleDeptDetailClose = () => {
  selectedDept.value = {};
};

// 修改tabsData为四个标签：全部、正常、调班、取消
const tabsData = ref([
  { label: '全部' },
  { label: '正常' },
  { label: '调班' },
  { label: '取消' },
]);

// 创建标签文本，显示数量统计
const createLabel = (item) => {
  let count = 0;

  switch (item.label) {
    case '全部': {
      count = dataObj.apilist.length;
      break;
    }
    case '取消': {
      count = dataObj.apilist.filter((v) => v.status === '取消').length;
      break;
    }
    case '正常': {
      count = dataObj.apilist.filter((v) => v.status === '正常').length;
      break;
    }
    case '调班': {
      count = dataObj.apilist.filter((v) => v.status === '调班').length;
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

// 筛选运维人员排班记录
const filterByMaintainUser = (userName) => {
  filterUser.value = filterUser.value === userName ? '' : userName;
  gridApi.query();
  // ElMessage.info(`筛选运维人员: ${userName}`);
};
/** 取消筛选运维人员排班记录（筛选标签关闭按钮） */
const handleCancelUserFilter = () => {
  filterUser.value = '';
  gridApi.query();
};
// 筛选同班次类型排班
const filterByShiftType = (shiftType) => {
  // 这里可以添加筛选逻辑，目前仅作为示例
  filterShiftType.value = filterShiftType.value === shiftType ? '' : shiftType;
  gridApi.query();
  // ElMessage.info(`筛选班次类型: ${shiftType}`);
};
/** 取消筛选运维人员排班记录（筛选标签关闭按钮） */
const handleCancelShiftTypeFilter = () => {
  filterShiftType.value = '';
  gridApi.query();
};
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>

    <!-- 详情抽屉 -->
    <DetailDrawer
      ref="detailDrawerRef"
      title="排班详情"
      :data="detailData"
      :fields="detailFields"
      @close="handleCloseDetail"
    />
    <!-- 部门详情抽屉 -->
    <DetailDrawer
      ref="deptDetailDrawerRef"
      :data="selectedDept"
      :fields="deptDetailFields"
      :title="`部门详情 - ${selectedDept?.deptName || ''}`"
      @close="handleDeptDetailClose"
    />

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
          <!-- 运维人员筛选标签：蓝色primary，仅筛选时显示 -->
          <ElTag
            v-if="filterUser"
            type="primary"
            closable
            @close="handleCancelUserFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            运维人员：{{ filterUser }}
          </ElTag>
          <!-- 班次类型筛选标签：绿色success，仅筛选时显示 -->
          <ElTag
            v-if="filterShiftType"
            type="success"
            closable
            @close="handleCancelShiftTypeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            班次类型：{{ filterShiftType }}
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

      <!-- 排班ID插槽 -->
      <template #scheduleId="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.scheduleId }}
        </el-text>
      </template>

      <!-- 运维人员插槽 -->
      <template #maintainUserName="{ row }">
        <el-text
          @click="filterByMaintainUser(row.maintainUserName)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.maintainUserName }}
        </el-text>
      </template>
      <!-- 所属部门插槽 -->
      <template #deptName="{ row }">
        <el-text
          @click="handleOpenDeptInfo(row)"
          class="common-align"
          type="primary"
        >
          {{ row.deptName }}
        </el-text>
      </template>

      <!-- 班次类型插槽 -->
      <template #shiftType="{ row }">
        <el-text
          @click="filterByShiftType(row.shiftType)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.shiftType }}
        </el-text>
      </template>

      <template #status="{ row }">
        <ElTag v-if="row.status === '正常'" type="success" size="small">
          {{ row.status }}
        </ElTag>
        <ElTag v-else-if="row.status === '调班'" type="warning" size="small">
          {{ row.status }}
        </ElTag>
        <ElTag v-else type="info" size="small">
          {{ row.status }}
        </ElTag>
      </template>

      <!-- 操作插槽 -->
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
          <span> 本页统计：排班数量: {{ dataObj.list.length }} </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
