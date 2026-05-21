<script setup>
import { reactive, ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getViolateMgmtPage } from '#/api/genchuan/industry/educationTeaching/studentMgmt/decisionAnalysis/workReport/data.js';

// 本地模拟数据
const mockViolates = [
  { id: 54, studentName: '赵六', violateType: '行为违纪', punishType: '警告', violateTime: Date.now() - 432000000, createTime: Date.now() - 432000000 },
  { id: 55, studentName: '林壵三', violateType: '纪律违纪', punishType: '批评', violateTime: Date.now() - 518400000, createTime: Date.now() - 518400000 },
];

const props = defineProps({
  row: { type: Object, default: () => ({}) },
});

const columns = [
  { field: 'studentName', title: '学生姓名', minWidth: 100 },
  { field: 'violateType', title: '违纪类型', minWidth: 120 },
  { field: 'punishType', title: '处分类型', minWidth: 120 },
  { field: 'violateTime', title: '违纪时间', minWidth: 180, formatter: ({ cellValue }) => cellValue ? new Date(cellValue).toLocaleString() : '-' },
  { field: 'createTime', title: '记录时间', minWidth: 180, formatter: ({ cellValue }) => cellValue ? new Date(cellValue).toLocaleString() : '-' },
];

const fetchData = async (pageParams) => {
  try {
    const res = await getViolateMgmtPage({
      pageNo: pageParams.currentPage,
      pageSize: pageParams.pageSize,
    });
    if (res.code === 200 && res.data.list && res.data.list.length > 0) {
      return { list: res.data.list, total: res.data.total };
    }
    throw new Error('无数据');
  } catch (error) {
    console.warn('使用模拟数据');
    const list = [...mockViolates];
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
  <DetailDrawer title="违纪明细" class="genchuan-detail-drawer">
    <div class="detail-container">
      <Grid />
    </div>
  </DetailDrawer>
</template>

<style scoped>
.detail-container { padding: 10px; }
</style>
