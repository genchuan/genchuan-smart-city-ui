<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';
import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import DetailDrawer from '#/components/common/DetailDrawer.vue';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

import {
  dataList,
  detailFields,
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
  return formData.value?.maintainUserId ? textObj.editText : textObj.addText;
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
    labelWidth: 120,
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
      dataObj.apilist.push({
        ...obj,
        maintainUserId: `user_${Date.now()}`,
        userId: `user_${Date.now()}`,
        deptId: 'dept_001',
        deptName: '运维部',
        skillTags: [],
        createBy: 'admin',
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        // 根据teamId和postCode设置显示名称
        teamName:
          obj.teamId === 'team_001'
            ? '芗城区运维队'
            : obj.teamId === 'team_002'
              ? '龙文区运维队'
              : obj.teamId === 'team_003'
                ? '龙海区运维队'
                : obj.teamId === 'team_004'
                  ? '漳浦县运维队'
                  : '云霄县运维队',
        postName:
          obj.postCode === 'dev_maintain'
            ? '设备维修员'
            : obj.postCode === 'fault_check'
              ? '故障排查员'
              : '工单处置员',
        areaName:
          obj.areaCode === '350602'
            ? '芗城区'
            : obj.areaCode === '350603'
              ? '龙文区'
              : obj.areaCode === '350681'
                ? '龙海区'
                : obj.areaCode === '350623'
                  ? '漳浦县'
                  : '云霄县',
      });
    } else {
      dataObj.apilist.forEach((v, i) => {
        if (v.maintainUserId === formData.value?.maintainUserId) {
          dataObj.apilist[i] = {
            ...obj,
            maintainUserId: v.maintainUserId,
            userId: v.userId,
            deptId: v.deptId,
            deptName: v.deptName,
            skillTags: v.skillTags,
            createBy: v.createBy,
            createTime: v.createTime,
            updateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
            // 根据teamId和postCode设置显示名称
            teamName:
              obj.teamId === 'team_001'
                ? '芗城区运维队'
                : obj.teamId === 'team_002'
                  ? '龙文区运维队'
                  : obj.teamId === 'team_003'
                    ? '龙海区运维队'
                    : obj.teamId === 'team_004'
                      ? '漳浦县运维队'
                      : '云霄县运维队',
            postName:
              obj.postCode === 'dev_maintain'
                ? '设备维修员'
                : obj.postCode === 'fault_check'
                  ? '故障排查员'
                  : '工单处置员',
            areaName:
              obj.areaCode === '350602'
                ? '芗城区'
                : obj.areaCode === '350603'
                  ? '龙文区'
                  : obj.areaCode === '350681'
                    ? '龙海区'
                    : obj.areaCode === '350623'
                      ? '漳浦县'
                      : '云霄县',
          };
        }
      });
    }
    handleRefresh();
    formDrawerApi.close();
    ElMessage.success($t('ui.actionMessage.saveSuccess'));
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
      if (formData.value?.maintainUserId) {
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

/** 创建运维人员 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

/** 编辑运维人员 */
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
    dataObj.apilist = dataObj.apilist.filter(
      (v) => v.maintainUserId !== row.maintainUserId,
    );
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
      (v) => !checkedIds.value.includes(v.maintainUserId),
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
  checkedIds.value = records.map((item) => item.maintainUserId);
}

const dataObj = reactive({
  totalShow: false,
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
  collapsed: false,
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 120,
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
      keyField: 'maintainUserId',
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

// 详情相关
const selectedItem = ref(null);
const detailDrawerRef = ref(null);

// 修改打开详情的方法
const handleOpenDetail = (row) => {
  selectedItem.value = row;
  if (detailDrawerRef.value) {
    detailDrawerRef.value.open();
  }
};

const handleDetailClose = () => {
  selectedItem.value = null;
};

const tabsData = ref([
  { label: '全部', value: '全部' },
  { label: '启用', value: '启用' },
  { label: '禁用', value: '禁用' },
]);

const createLabel = (item) => {
  let text = `(${dataObj.apilist.filter((v) => v.status === item.value).length})`;
  if (item.value === '全部') {
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

    <!-- 使用封装后的详情抽屉组件 -->
    <DetailDrawer
      ref="detailDrawerRef"
      :data="selectedItem"
      :fields="detailFields"
      :title="selectedItem?.name || '运维人员详情'"
      @close="handleDetailClose"
    />

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
                :name="item.value"
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
      <template #name="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.name }}
        </el-text>
      </template>
      <template #onDutyStatus="{ row }">
        <el-tag
          :type="
            row.onDutyStatus === '在岗'
              ? 'success'
              : row.onDutyStatus === '休假'
                ? 'warning'
                : 'info'
          "
          size="small"
        >
          {{ row.onDutyStatus }}
        </el-tag>
      </template>
      <template #status="{ row }">
        <el-tag
          :type="row.status === '启用' ? 'success' : 'danger'"
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
            本页统计：运维人员数量{{ dataObj.list.length }};启用:{{
              dataObj.list.filter((item) => item.status === '启用').length
            }};禁用:{{
              dataObj.list.filter((item) => item.status === '禁用').length
            }}</span
          >
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> 全部统计：{{ textObj.total }}</span>
        </div>
      </template>
    </Grid>
  </div>
</template>
