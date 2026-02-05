<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import {
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElLoading,
  ElMessage,
} from 'element-plus'; // 新增：引入ElDialog等组件
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';
import arrearsDetailDrawer from '#/views/genchuan/industry/page/park/road/arrears/detail.vue';
// 引入封装后的详情抽屉组件
import roadDetailDrawer from '#/views/genchuan/industry/page/park/road/arrears/histroyDialog.vue';

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
// 移除原 DetailDrawer 初始化逻辑
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
  detailObj: {}, // 保留详情对象用于传递给组件
  arrearList: [], // 新增：存储欠费明细数据，传递给详情组件
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
      return v.bindingStatus === activeName.value;
    }).length;
  dataObj.list = dataObj.apilist
    .map((v) => v)
    .filter((v) => {
      if (activeName.value === '全部') {
        return true;
      }
      return v.bindingStatus === activeName.value;
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
// 修改打开详情的方法，调用组件的open方法（同步赋值明细数据）
const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  // 新增：给明细数据赋值（保证点击详情也能看到欠费明细）
  setArrearListData(row);
  // 通过ref调用组件的open方法
  arrearsDetailDrawerRef.value.open();
  console.log(row);
};
const tabsData = ref([
  { label: '全部' },
  { label: '已绑定' },
  { label: '未绑定' },
]);
const createLabel = (item) => {
  let text = `(${dataObj.apilist.filter((v) => v.bindingStatus === item.label).length})`;
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
const createType = (type) => {
  if (type === '占用') {
    return 'danger';
  } else if (type === '空置') {
    return 'success';
  } else {
    return 'warning';
  }
};
// 定义组件ref，用于调用组件方法
const roadDetailDrawerRef = ref(null);
const arrearsDetailDrawerRef = ref(null);
// ====================================== 新增：追缴功能相关变量和方法 ======================================
// 1. 定义弹框是否显示
const arrearsDialogVisible = ref(false);
// 2. 定义追缴数据（存储当前行的手机号码、车牌、姓名）
const arrearsData = ref({
  phone: '18033315151', // 手机号码
  plateNo: '闽EF66002', // 车牌
  name: '黄白', // 姓名
});

// 3. 实现追缴方法（赋值并打开弹框）
const handleArrears = (row) => {
  // 给追缴数据赋值（对应row中的字段，若字段名不一致请修改为你实际的字段名）
  arrearsData.value = {
    phone: '18033315151', // 手机号码（可改为 row.phone 若表格行有该字段）
    plateNo: row.plateNo || '闽EF66002', // 优先取当前行车牌，兜底默认值
    name: '黄白', // 姓名（可改为 row.name 若表格行有该字段）
  };
  // 打开弹框
  arrearsDialogVisible.value = true;
};

// 4. 关闭弹框方法（可选，用于重置数据）
const closeArrearsDialog = () => {
  arrearsDialogVisible.value = false;
  // 重置追缴数据（可选，避免下次打开残留上一次数据）
  arrearsData.value = {
    phone: '18033315151', // 手机号码
    plateNo: '闽EF66002', // 车牌
    name: '黄白', // 姓名
  };
};
const confirmArrears = () => {
  arrearsDialogVisible.value = false;
  ElMessage.success('已向车主发送追缴短信');
};

// 新增：封装欠费明细数据赋值方法（复用逻辑）
const setArrearListData = (row) => {
  // 模拟4条漳州欠费明细数据（可根据row.plateNo匹配不同数据，此处统一返回模拟数据）
  dataObj.arrearList = [
    {
      plateNo: row.plateNo || '闽ECFF07Q',
      arrearsAmount: '15.0',
      address: '龙海区万达广场',
      allTime: '2025年12月5日 6:00 至 2025年12月5日9:00',
      time: '3小时',
    },
    {
      plateNo: row.plateNo || '闽E8899X',
      arrearsAmount: '24.0',
      address: '芗城区古城历史文化街区',
      allTime: '2025年12月6日 8:30 至 2025年12月6日12:30',
      time: '4小时',
    },
    {
      plateNo: row.plateNo || '闽E6780Y',
      arrearsAmount: '9.0',
      address: '龙文区吾悦广场',
      allTime: '2025年12月7日 14:00 至 2025年12月7日17:00',
      time: '3小时',
    },
    {
      plateNo: row.plateNo || '闽E3456Z',
      arrearsAmount: '36.0',
      address: '长泰区天柱山欢乐大世界附近',
      allTime: '2025年12月8日 20:00 至 2025年12月9日 2:00',
      time: '6小时',
    },
  ];
};

// 完善：打开欠费订单数（赋值明细并打开详情抽屉）
const openArrearsOrderCount = (row) => {
  dataObj.detailObj = row;
  // 赋值欠费明细数据
  setArrearListData(row);
  // 打开详情抽屉
  roadDetailDrawerRef.value.open();
  console.log('欠费订单明细：', dataObj.arrearList);
};
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <!-- 使用封装后的详情抽屉组件：传递 detail-obj 和 arrear-list 两个属性 -->
    <roadDetailDrawer
      ref="roadDetailDrawerRef"
      :detail-obj="dataObj.detailObj"
      :arrear-list="dataObj.arrearList"
    />
    <!-- 使用封装后的详情抽屉组件：传递 detail-obj 和 arrear-list 两个属性 -->
    <arrearsDetailDrawer
      ref="arrearsDetailDrawerRef"
      :detail-obj="dataObj.detailObj"
      :arrear-list="dataObj.arrearList"
    />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <!-- ====================================== 新增：追缴弹框 ====================================== -->
    <ElDialog
      v-model="arrearsDialogVisible"
      title="追缴信息"
      width="400px"
      center
      @closed="closeArrearsDialog"
    >
      <ElForm label-width="80px" :model="arrearsData" class="arrears-form">
        <ElFormItem label="车牌">
          <ElInput v-model="arrearsData.plateNo" placeholder="暂无车牌数据" />
        </ElFormItem>
        <ElFormItem label="姓名">
          <ElInput v-model="arrearsData.name" placeholder="暂无姓名数据" />
        </ElFormItem>
        <ElFormItem label="手机号码">
          <ElInput v-model="arrearsData.phone" placeholder="暂无手机号码数据" />
        </ElFormItem>
      </ElForm>
      <!-- 弹框底部按钮（可选，可添加"确认追缴"等业务按钮） -->
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="confirmArrears">确认追缴</el-button>
        </span>
      </template>
    </ElDialog>

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
      <template #plateNo="{ row }">
        <el-text
          class="common-align"
          type="primary"
          @click="handleOpenDetail(row)"
        >
          {{ row.plateNo }}
        </el-text>
      </template>
      <template #arrearsOrderCount="{ row }">
        <el-text
          class="common-align"
          type="primary"
          @click="openArrearsOrderCount(row)"
        >
          {{ row.arrearsOrderCount }}
        </el-text>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="追缴"
            icon-name="Money"
            color="#F56C6C"
            @click="handleArrears(row)"
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
          <span> 本页统计：路测泊位数量6</span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> 全部统计：路测泊位数量8 </span>
        </div>
      </template>
    </Grid>
  </div>
</template>

<style scoped>
/* 新增：追缴弹框表单样式优化（可选） */
.arrears-form {
  margin-top: 10px;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
