<!-- index.vue 内部 - 运营趋势报表版本 -->
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
// 引入封装后的详情抽屉组件
import ReportDetailDrawer from '#/views/report/park/operate/trend/detail.vue';

import { dataList, textObj, useFormSchema, useGridColumns } from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  arrowShow: {
    type: Boolean,
    default: false,
  },
  arrowState: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['arrow-change']);
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

    // 处理时间范围字段
    const [startDate, endDate] = obj.timeRange || [];

    // 生成统计时间
    let statTime = '';
    if (obj.statCycle === '日' && startDate) {
      statTime = startDate;
    } else if (obj.statCycle === '周') {
      const weekNumber = getWeekNumber(new Date(startDate));
      statTime = `2026年第${weekNumber}周`;
    } else if (obj.statCycle === '月' && startDate) {
      statTime = startDate.slice(0, 7);
    }

    // 格式化平均泊位利用率（确保有%符号）
    let avgBerthUtilization = obj.avgBerthUtilization || '0%';
    if (!avgBerthUtilization.includes('%')) {
      avgBerthUtilization = `${avgBerthUtilization}%`;
    }

    const updatedRecord = {
      id:
        formData.value?.id ||
        (reportObj.apilist.length > 0
          ? Math.max(...reportObj.apilist.map((v) => v.id)) + 1
          : 1),
      statCycle: obj.statCycle,
      statTime,
      startDate: startDate || obj.startDate,
      endDate: endDate || obj.endDate,
      areaName: obj.areaName,
      parkType: obj.parkType,
      totalIncome: Number(obj.totalIncome) || 0,
      totalEntry: Number(obj.totalEntry) || 0,
      avgBerthUtilization,
      keyNode: obj.keyNode || '正常运营',
      updateTime: `${new Date().toISOString().split('T')[0]} 18:30`,
      operator: '系统管理员',
    };

    if (formDrawerApi.sharedData.payload.title === textObj.addText) {
      // 新增模式
      reportObj.apilist.push(updatedRecord);
      ElMessage.success('新增成功');
    } else {
      // 编辑模式
      const index = reportObj.apilist.findIndex(
        (v) => v.id === formData.value?.id,
      );
      if (index !== -1) {
        reportObj.apilist[index] = updatedRecord;
        ElMessage.success('编辑成功');
      }
    }

    handleRefresh();
    formDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
      if (formData.value?.id) {
        // 编辑模式：查找完整数据
        const record = reportObj.apilist.find(
          (v) => v.id === formData.value.id,
        );
        if (record) {
          const formValues = {
            ...record,
            timeRange: [record.startDate, record.endDate],
          };
          await formApi.setValues(formValues);
        }
      } else {
        // 新增模式：重置表单并设置默认值
        formApi.resetForm();

        // 设置默认值
        const defaultValues = {
          statCycle: '日',
          timeRange: [
            new Date().toISOString().split('T')[0],
            new Date().toISOString().split('T')[0],
          ],
          areaName: '天河区',
          parkType: '商业停车场',
          totalIncome: 0,
          totalEntry: 0,
          avgBerthUtilization: '0%',
          keyNode: '正常运营',
        };
        await formApi.setValues(defaultValues);
      }
    }
  },
});

/** 获取周数 */
function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86_400_000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 导出表格 */
async function handleExport() {
  exportToExcel(reportObj.apilist, textObj.excelName, textObj.excelAllName);
  ElMessage.success('导出成功');
}

/** 导出单行数据 */
async function handleExportRow(row) {
  exportToExcel(
    [row],
    `${row.areaName}-${row.parkType}`,
    `${row.areaName}-${row.parkType}.xlsx`,
  );
  ElMessage.success('导出成功');
}

/** 创建报表 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

/** 编辑报表 */
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
    text: $t('ui.actionMessage.deleting', [
      `${row.areaName} - ${row.parkType}`,
    ]),
  });
  try {
    reportObj.apilist = reportObj.apilist.filter((v) => v.id !== row.id);
    ElMessage.success(
      $t('ui.actionMessage.deleteSuccess', [
        `${row.areaName} - ${row.parkType}`,
      ]),
    );
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
    reportObj.apilist = reportObj.apilist.filter(
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

const reportObj = reactive({
  totalShow: false,
  detailObj: {}, // 保留详情对象用于传递给组件
  total: dataList().length,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(),
  list: [],
});

const changeTotalShow = () => {
  reportObj.totalShow = !reportObj.totalShow;
};

// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;

  let filteredList = reportObj.apilist;
  switch (activeName.value) {
    case '周数据': {
      filteredList = reportObj.apilist.filter((v) => v.statCycle === '周');

      break;
    }
    case '商业停车场': {
      filteredList = reportObj.apilist.filter(
        (v) => v.parkType === '商业停车场',
      );

      break;
    }
    case '天河区': {
      filteredList = reportObj.apilist.filter((v) => v.areaName === '天河区');

      break;
    }
    case '日数据': {
      filteredList = reportObj.apilist.filter((v) => v.statCycle === '日');

      break;
    }
    case '月数据': {
      filteredList = reportObj.apilist.filter((v) => v.statCycle === '月');

      break;
    }
    // No default
  }

  // 获取搜索表单的查询条件
  const queryValues = QueryFormApi?.form?.values || {};
  if (queryValues.areaName) {
    filteredList = filteredList.filter(
      (v) => v.areaName === queryValues.areaName,
    );
  }
  if (queryValues.parkType) {
    filteredList = filteredList.filter(
      (v) => v.parkType === queryValues.parkType,
    );
  }
  if (queryValues.statCycle) {
    filteredList = filteredList.filter(
      (v) => v.statCycle === queryValues.statCycle,
    );
  }
  if (
    queryValues.timeRange &&
    queryValues.timeRange[0] &&
    queryValues.timeRange[1]
  ) {
    filteredList = filteredList.filter(
      (v) =>
        v.startDate >= queryValues.timeRange[0] &&
        v.endDate <= queryValues.timeRange[1],
    );
  }

  reportObj.total = filteredList.length;
  reportObj.list = filteredList.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  );

  return reportObj;
};

const [QueryForm, QueryFormApi] = useVbenForm({
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
  schema: useFormSchema()
    .map((v) => {
      // 搜索表单不需要关键节点字段
      if (
        v.fieldName === 'keyNode' ||
        v.fieldName === 'totalIncome' ||
        v.fieldName === 'totalEntry' ||
        v.fieldName === 'avgBerthUtilization'
      ) {
        return null;
      }
      delete v.rules;
      return v;
    })
    .filter((v) => v !== null),
  // 是否可展开
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});

// 搜索表单查询
function onSubmit() {
  handleRefresh();
  drawerApi.close();
}

// 重置查询条件
function handleReset() {
  QueryFormApi?.resetForm();
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
      keyField: 'id',
      isHover: true,
    },
    pagerConfig: reportObj,
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

const activeName = ref('日数据');
// 修改打开详情的方法，调用组件的open方法
const handleOpenDetail = (row) => {
  reportObj.detailObj = row;
  // 通过ref调用组件的open方法
  reportDetailDrawerRef.value.open();
};

const tabsData = ref([
  { label: '日数据' },
  { label: '周数据' },
  { label: '月数据' },
  { label: '商业停车场' },
  { label: '天河区' },
  { label: '全部数据' },
]);

const createLabel = (item) => {
  let count = 0;
  switch (item.label) {
    case '全部数据': {
      count = reportObj.apilist.length;

      break;
    }
    case '周数据': {
      count = reportObj.apilist.filter((v) => v.statCycle === '周').length;

      break;
    }
    case '商业停车场': {
      count = reportObj.apilist.filter(
        (v) => v.parkType === '商业停车场',
      ).length;

      break;
    }
    case '天河区': {
      count = reportObj.apilist.filter((v) => v.areaName === '天河区').length;

      break;
    }
    case '日数据': {
      count = reportObj.apilist.filter((v) => v.statCycle === '日').length;

      break;
    }
    case '月数据': {
      count = reportObj.apilist.filter((v) => v.statCycle === '月').length;

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

const arrowChange = () => {
  emit('arrow-change');
};

// 定义组件ref，用于调用组件方法
const reportDetailDrawerRef = ref(null);
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <!-- 使用封装后的详情抽屉组件 -->
    <ReportDetailDrawer
      ref="reportDetailDrawerRef"
      :detail-obj="reportObj.detailObj"
      :title="`趋势详情 - ${reportObj.detailObj.areaName} ${reportObj.detailObj.parkType}`"
    />
    <Drawer title="趋势筛选">
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
            content="筛选"
            icon-name="search"
            @click="handleSerachShow"
          />
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
        </div>
      </template>
      <template #areaName="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.areaName }}
        </el-text>
      </template>
      <template #totalEntry="{ row }">
        <el-tag type="info" size="small">
          {{ row.totalEntry?.toLocaleString() }}
        </el-tag>
      </template>
      <template #totalIncome="{ row }">
        <el-tag type="success" size="small">
          ¥{{ row.totalIncome?.toLocaleString() }}
        </el-tag>
      </template>
      <template #keyNode="{ row }">
        <el-tag
          :type="
            row.keyNode && row.keyNode.includes('促销')
              ? 'danger'
              : row.keyNode && row.keyNode.includes('活动')
                ? 'warning'
                : 'info'
          "
          size="small"
        >
          {{ row.keyNode || '正常运营' }}
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
            content="删除"
            icon-name="delete"
            color="#F56C6C"
            @click="handleDelete(row)"
          />
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExportRow(row)"
          />
        </div>
      </template>
      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon" v-if="!reportObj.totalShow">
            <ArrowDown />
          </el-icon>
          <el-icon class="tabel-tab-icon" v-if="reportObj.totalShow">
            <ArrowUp />
          </el-icon>
          <span>
            本页统计：数据量{{ reportObj.list.length }}; 总入场车次:
            {{
              reportObj.list
                .reduce((sum, v) => sum + v.totalEntry, 0)
                .toLocaleString()
            }}; 总收费金额: ¥{{
              reportObj.list
                .reduce((sum, v) => sum + v.totalIncome, 0)
                .toLocaleString()
            }};
          </span>
        </div>
        <div class="common-total-bottom" v-if="reportObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
