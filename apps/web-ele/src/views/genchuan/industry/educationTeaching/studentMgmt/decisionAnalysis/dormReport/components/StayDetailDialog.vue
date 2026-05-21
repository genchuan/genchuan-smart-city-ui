<script setup>
import { reactive, ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getStayMgmtPage } from '#/api/genchuan/industry/educationTeaching/studentMgmt/decisionAnalysis/dormReport/data.js';

// 本地模拟数据
const mockStays = [
  { id: 10, studentId: 2024002, studentName: '张三', stayDate: [2026, 5, 2], stayReason: '图书馆查阅资料', applyTime: Date.now() - 86400000, status: 'approved', createTime: Date.now() - 86400000 },
  { id: 11, studentId: 2024003, studentName: '李四', stayDate: [2026, 5, 3], stayReason: '宿舍维修', applyTime: Date.now() - 172800000, status: 'approved', createTime: Date.now() - 172800000 },
];

const columns = [
  { field: 'studentId', title: '学生ID', minWidth: 100 },
  { field: 'studentName', title: '学生姓名', minWidth: 100 },
  { field: 'stayDate', title: '留宿日期', minWidth: 150, formatter: ({ cellValue }) => Array.isArray(cellValue) ? cellValue.join('-') : cellValue },
  { field: 'stayReason', title: '留宿原因', minWidth: 150 },
  { field: 'applyTime', title: '申请时间', minWidth: 180, formatter: ({ cellValue }) => cellValue ? new Date(cellValue).toLocaleString() : '-' },
  { field: 'status', title: '状态', minWidth: 100 },
  { field: 'createTime', title: '创建时间', minWidth: 180, formatter: ({ cellValue }) => cellValue ? new Date(cellValue).toLocaleString() : '-' },
];

const fetchData = async (pageParams) => {
  try {
    const res = await getStayMgmtPage({
      pageNo: pageParams.currentPage,
      pageSize: pageParams.pageSize,
    });
    if (res.code === 200 && res.data.list && res.data.list.length > 0) {
      return { list: res.data.list, total: res.data.total };
    }
    throw new Error('无数据');
  } catch (error) {
    console.warn('使用模拟数据');
    const list = [...mockStays];
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
  <DetailDrawer title="留宿明细" class="genchuan-detail-drawer">
    <div class="detail-container">
      <Grid />
    </div>
  </DetailDrawer>
</template>

<style scoped>
.detail-container { padding: 10px; }
</style>
