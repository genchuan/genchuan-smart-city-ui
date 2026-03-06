<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import {
  ElDatePicker,
  ElDialog,
  ElImage,
  ElLoading,
  ElMessage,
} from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createRoad,
  deleteRoad,
  getHistroyList,
  getRoadList,
  outPark,
  realOutPark,
  simulateMagneticDetection,
  updateRoad,
} from '#/api/genchuan/industry/park/index.js';
import { $t } from '#/locales';
import { formatTimestamp } from '#/utils';
import { exportToExcel } from '#/utils/excel.js';
import ParkDetailDrawer from '#/views/genchuan/industry/page/vehicle/entry/table/detail.vue';

import { textObj, useFormSchema, useGridColumns } from './data';

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
  async onConfirm() {
    const obj = formApi.form.values;
    await (formDrawerApi.sharedData.payload.title === textObj.addText
      ? createRoad(obj)
      : updateRoad({ ...dataObj.editObj, ...obj }));
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
  dataObj.editObj = row;
  formDrawerApi
    .setData({
      title: textObj.editText,
      ...row,
    })
    .open();
}
async function handleDelete(row) {
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting'),
  });
  try {
    await deleteRoad(row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess'));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

async function handleDeleteBatch() {
  await confirm($t('确定删除这些数据吗？')).then(() => {
    checkedIds.value.forEach(async (v) => {
      await handleDelete({
        id: v,
      });
    });
  });
  handleRefresh();
}

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}
const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  apilist: [],
  imgUrl: '',
  serachObj: {},
  list: [],
  editObj: {},
});
const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};
// 表格数据获取
const getTableData = async (pageObj) => {
  const getParams = {
    pageNo: pageObj.page.currentPage,
    pageSize: pageObj.page.pageSize,
    ...dataObj.serachObj,
  };
  const data = await getRoadList(getParams);
  dataObj.total = data.total;
  dataObj.list = data.list.map((v) => {
    return {
      ...v,
      plateType: v.plateType === '1' ? '月租车' : '临时车',
      driveInTime: formatTimestamp(v.driveInTime),
      createTime: formatTimestamp(v.createTime),
    };
  });
  return dataObj;
};

const [QueryForm, QueryFormApi] = useVbenForm({
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
async function onSubmit() {
  dataObj.serachObj = await QueryFormApi.getValues();
  gridApi.reload();
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

const activeName = ref('');
const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  parkDetailDrawerRef.value.open();
  console.log(row);
};
const tabsData = ref([
  { label: '全部', value: '' },
  { label: '月租车', value: '1' },
  { label: '临时车', value: '0' },
]);
const createLabel = (item) => {
  return item.label;
};
const handleClick = () => {
  dataObj.serachObj.plateType = activeName.value;
  gridApi.query();
};
const handleSerachShow = () => {
  drawerApi.open();
};
const handleFullShow = () => {
  screenfull.toggle();
};

const parkDetailDrawerRef = ref(null);
const dialogVisible = ref(false);
const openImg = (url) => {
  dataObj.imgUrl = url;
  dialogVisible.value = true;
};

// ========== 地磁车辆入场弹窗相关配置（原有） ==========
const driveInDialogVisible = ref(false);
const currentDriveInRow = ref(null);
const driveInTime = ref(Date.now());

const handleOpenDriveInDialog = (row) => {
  currentDriveInRow.value = row;
  const validTimeStamp = Date.now();
  driveInTime.value = validTimeStamp;
  driveInDialogVisible.value = true;
};

const handleConfirmDriveIn = async () => {
  if (!currentDriveInRow.value || !driveInTime.value) {
    ElMessage.warning('请选择有效的入场时间！');
    return;
  }

  try {
    const res = await simulateMagneticDetection({
      targetBerthNo: currentDriveInRow.value.berthCode,
      entryTime: driveInTime.value,
      parkId: currentDriveInRow.value.parkId,
    });

    ElMessage.success('地磁车辆入场操作成功！');
    handleRefresh();
    driveInDialogVisible.value = false;
  } catch (error) {
    ElMessage.error('地磁车辆入场操作失败！');
    console.error('入场失败：', error);
  }
};

const handleCancelDriveIn = () => {
  driveInDialogVisible.value = false;
  currentDriveInRow.value = null;
  driveInTime.value = Date.now();
};

// ========== 新增：地磁车辆出场弹窗相关配置 ==========
// 1. 出场弹窗显示状态
const driveOutDialogVisible = ref(false);
// 2. 当前选中的行数据（传递给出场弹窗）
const currentDriveOutRow = ref(null);
// 3. 出场时间（绑定时间选择器，默认值为当前时间戳）
const driveOutTime = ref(Date.now());
const histObj = ref([]);
// 4. 打开出场弹窗方法
const handleOpenDriveOutDialog = async (row) => {
  currentDriveOutRow.value = row;
  const resObj = await getHistroyList(row.berthCode, '已停入', row.parkId);
  histObj.value = resObj;
  const validTimeStamp = Date.now(); // 默认当前时间
  // 最终赋值：确保只有合法时间戳被绑定
  driveOutTime.value = validTimeStamp;
  driveOutDialogVisible.value = true;
};

// 5. 确认出场操作方法
const handleConfirmDriveOut = async () => {
  if (!currentDriveOutRow.value || !driveOutTime.value) {
    ElMessage.warning('请选择有效的出场时间！');
    return;
  }

  try {
    // 后续可替换为实际的地磁车辆出场接口
    // 示例：调用出场接口，传递泊位编号和出场时间戳
    const res = await outPark({
      id: histObj.value[0].id,
      exitTime: driveOutTime.value,
    });
    const result = await realOutPark({
      id: histObj.value[0].id,
      parkingStatus: '已驶离',
      exitTime: driveOutTime.value,
    });
    // 临时提示（后续替换为接口返回结果）
    ElMessage.success('地磁车辆出场操作成功！');
    // 刷新表格数据
    handleRefresh();
    // 关闭弹窗
    driveOutDialogVisible.value = false;
  } catch (error) {
    ElMessage.error('地磁车辆出场操作失败！');
    console.error('出场失败：', error);
  }
};

// 6. 取消出场弹窗（重置状态）
const handleCancelDriveOut = () => {
  driveOutDialogVisible.value = false;
  currentDriveOutRow.value = null;
  driveOutTime.value = Date.now();
};
</script>

<template>
  <div class="park-lot-table-new">
    <ElDialog v-model="dialogVisible">
      <div class="park-img-center">
        <img style="width: 100%; height: 100%" :src="dataObj.imgUrl" />
      </div>
    </ElDialog>

    <!-- ========== 地磁车辆入场弹窗（原有） ========== -->
    <ElDialog
      v-model="driveInDialogVisible"
      title="地磁车辆入场"
      width="500px"
      @close="handleCancelDriveIn"
    >
      <div class="drive-in-form">
        <div class="form-item">
          <label class="form-label">入场时间：</label>
          <ElDatePicker
            v-model="driveInTime"
            type="datetime"
            placeholder="请选择入场日期和时间"
            style="width: 100%"
          />
        </div>
      </div>
      <template #footer>
        <button
          class="el-button el-button--default"
          @click="handleCancelDriveIn"
        >
          取消
        </button>
        <button
          class="el-button el-button--primary"
          @click="handleConfirmDriveIn"
        >
          确认入场
        </button>
      </template>
    </ElDialog>

    <!-- ========== 新增：地磁车辆出场弹窗 ========== -->
    <ElDialog
      v-model="driveOutDialogVisible"
      title="地磁车辆出场"
      width="500px"
      @close="handleCancelDriveOut"
    >
      <div class="drive-in-form">
        <div class="form-item">
          <label class="form-label">出场时间：</label>
          <ElDatePicker
            v-model="driveOutTime"
            type="datetime"
            placeholder="请选择出场日期和时间"
            style="width: 100%"
          />
        </div>
      </div>
      <template #footer>
        <button
          class="el-button el-button--default"
          @click="handleCancelDriveOut"
        >
          取消
        </button>
        <button
          class="el-button el-button--primary"
          @click="handleConfirmDriveOut"
        >
          确认出场
        </button>
      </template>
    </ElDialog>

    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <ParkDetailDrawer
      ref="parkDetailDrawerRef"
      :detail-obj="dataObj.detailObj"
      title="详情"
    />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>
    <Grid>
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
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
        </div>
      </template>
      <template #recordId="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.recordId }}
        </el-text>
      </template>
      <template #driveInPhoto="{ row }">
        <ElImage
          style="width: 100px; height: 100px"
          :src="row.driveInPhoto"
          @click="openImg(row.driveInPhoto)"
        />
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <!-- 地磁车辆入场（原有） -->
          <IconButton
            content="地磁车辆入场"
            icon-name="Upload"
            @click="handleOpenDriveInDialog(row)"
          />
          <!-- ========== 修改：绑定出场弹窗打开方法 ========== -->
          <IconButton
            content="地磁车辆出场"
            icon-name="Download"
            @click="handleOpenDriveOutDialog(row)"
          />
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
          <span> 本页统计：停车记录10条 </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> 全部统计：停车记录15条 </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
<style scoped>
.park-img-center {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 700px;
  height: 700px;
}

.drive-in-form {
  padding: 10px 0;
}

.form-item {
  margin-bottom: 16px;
}

.form-label {
  display: inline-block;
  width: 80px;
  margin-right: 10px;
  color: #606266;
  text-align: right;
}
</style>
