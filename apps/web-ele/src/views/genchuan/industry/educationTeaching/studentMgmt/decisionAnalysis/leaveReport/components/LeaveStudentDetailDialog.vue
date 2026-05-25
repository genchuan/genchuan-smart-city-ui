<script setup>
import { reactive, ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getLeaveHandlePage } from '#/api/genchuan/industry/educationTeaching/studentMgmt/decisionAnalysis/leaveReport/data.js';

// 模拟数据
const mockLeaves = [
  { id: 7, studentId: 2025007, studentName: '张三', leaveTime: Date.now() - 86400000, leaveAddress: '武汉市洪山区珞喻路600号', parentConfirmTime: Date.now() - 172800000, handleUser: '辅导员杨老师', handleTime: Date.now() - 86400000, checkoutTime: Date.now() - 43200000, checkoutStatus: '已退宿', status: '已离校', createTime: Date.now() - 86400000 },
  { id: 8, studentId: 2025008, studentName: '李四', leaveTime: Date.now() - 172800000, leaveAddress: '北京市朝阳区', parentConfirmTime: Date.now() - 259200000, handleUser: '辅导员王老师', handleTime: Date.now() - 172800000, checkoutTime: Date.now() - 86400000, checkoutStatus: '已退宿', status: '已离校', createTime: Date.now() - 172800000 },
];

const columns = [
  { field: 'studentName', title: '学生姓名', minWidth: 100 },
  { field: 'leaveTime', title: '离校时间', minWidth: 180, formatter: ({ cellValue }) => cellValue ? new Date(cellValue).toLocaleString() : '-' },
  { field: 'leaveAddress', title: '离校去向', minWidth: 180 },
  { field: 'parentConfirmTime', title: '家长确认时间', minWidth: 180, formatter: ({ cellValue }) => cellValue ? new Date(cellValue).toLocaleString() : '-' },
  { field: 'handleUser', title: '办理人', minWidth: 100 },
  { field: 'handleTime', title: '办理时间', minWidth: 180, formatter: ({ cellValue }) => cellValue ? new Date(cellValue).toLocaleString() : '-' },
  { field: 'checkoutTime', title: '退宿时间', minWidth: 180, formatter: ({ cellValue }) => cellValue ? new Date(cellValue).toLocaleString() : '-' },
  { field: 'checkoutStatus', title: '退宿状态', minWidth: 100 },
  { field: 'status', title: '离校状态', minWidth: 100 },
];

const fetchData = async (pageParams) => {
  try {
    const res = await getLeaveHandlePage({
      pageNo: pageParams.currentPage,
      pageSize: pageParams.pageSize,
    });
    if (res.code === 200 && res.data.list && res.data.list.length > 0) {
      return { list: res.data.list, total: res.data.total };
    }
    throw new Error('无数据');
  } catch (error) {
    console.warn('使用模拟数据');
    const list = [...mockLeaves];
    const total = list.length;
    const start = (pageParams.currentPage - 1) * pageParams.pageSize;
    const sliced = list.slice(start, start + pageParams.pageSize);
    return { list: sliced, total };
  }
};

const dataObj = reactive({ totalShow: true, total: 0, currentPage: 1, pageSize: 10, loading: false });

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns,
    proxyConfig: { ajax: { query: async ({ page }) => await fetchData(page) } },
    rowConfig: { keyField: 'id' },
    pagerConfig: dataObj,
    toolbarConfig: { refresh: true },
  },
  showSearchForm: false,
});

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 800,
  onCancel: () => detailDrawerApi.close(),
});

const open = () => {
  detailDrawerApi.open();
  dataObj.currentPage = 1;
  gridApi.query();
};

defineExpose({ open });
</script>

<template>
  <DetailDrawer title="离校学生明细" class="genchuan-detail-drawer">
    <div class="detail-container">
      <Grid />
    </div>
  </DetailDrawer>
</template>

<style scoped>
.detail-container { padding: 10px; }
</style>
