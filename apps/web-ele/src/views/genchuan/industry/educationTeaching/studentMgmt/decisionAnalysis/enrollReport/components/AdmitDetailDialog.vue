<script setup>
import { reactive, ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getRegisterMgmtPage } from '#/api/genchuan/industry/educationTeaching/studentMgmt/decisionAnalysis/enrollReport/data.js';

// 录取记录模拟数据（status 为 admitted）
const mockAdmits = [
  { id: 6, studentName: '周八', idCard: '110101200806066789', major: '计算机科学', applyTime: Date.now() - 86400000, confirmTime: Date.now() - 43200000, status: 'admitted', createTime: Date.now() - 86400000 },
  { id: 7, studentName: '吴九', idCard: '110101200806066790', major: '机电一体化', applyTime: Date.now() - 172800000, confirmTime: Date.now() - 86400000, status: 'admitted', createTime: Date.now() - 172800000 },
];

const columns = [
  { field: 'studentName', title: '学生姓名', minWidth: 100 },
  { field: 'idCard', title: '身份证号', minWidth: 180 },
  { field: 'major', title: '专业', minWidth: 120 },
  { field: 'applyTime', title: '报名时间', minWidth: 180, formatter: ({ cellValue }) => cellValue ? new Date(cellValue).toLocaleString() : '-' },
  { field: 'confirmTime', title: '录取确认时间', minWidth: 180, formatter: ({ cellValue }) => cellValue ? new Date(cellValue).toLocaleString() : '-' },
  { field: 'status', title: '状态', minWidth: 100 },
];

const fetchData = async (pageParams) => {
  try {
    const res = await getRegisterMgmtPage({
      status: 'admitted',
      pageNo: pageParams.currentPage,
      pageSize: pageParams.pageSize,
    });
    if (res.code === 200 && res.data.list && res.data.list.length > 0) {
      return { list: res.data.list, total: res.data.total };
    }
    throw new Error('无数据');
  } catch (error) {
    console.warn('使用模拟数据');
    const list = [...mockAdmits];
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
  <DetailDrawer title="录取明细" class="genchuan-detail-drawer">
    <div class="detail-container">
      <Grid />
    </div>
  </DetailDrawer>
</template>

<style scoped>
.detail-container { padding: 10px; }
</style>
