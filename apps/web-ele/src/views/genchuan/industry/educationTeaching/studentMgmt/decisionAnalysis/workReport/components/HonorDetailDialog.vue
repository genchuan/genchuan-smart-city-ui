<script setup>
import { reactive, ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getHonorMgmtPage } from '#/api/genchuan/industry/educationTeaching/studentMgmt/decisionAnalysis/workReport/data.js';

// 本地模拟数据
const mockHonors = [
  { id: 9, studentName: '王五', className: '电子2401班', honorName: '优秀团员', getTime: Date.now() - 86400000, createTime: Date.now() - 86400000 },
  { id: 10, studentName: '林壵三', className: '护理2401班', honorName: '三好学生', getTime: Date.now() - 172800000, createTime: Date.now() - 172800000 },
  { id: 11, studentName: '张小明', className: '计算机2201班', honorName: '优秀班干部', getTime: Date.now() - 259200000, createTime: Date.now() - 259200000 },
];

const props = defineProps({
  row: { type: Object, default: () => ({}) },
});

const columns = [
  { field: 'studentName', title: '学生姓名', minWidth: 100 },
  { field: 'className', title: '班级', minWidth: 150 },
  { field: 'honorName', title: '荣誉名称', minWidth: 150 },
  { field: 'getTime', title: '获得时间', minWidth: 180, formatter: ({ cellValue }) => cellValue ? new Date(cellValue).toLocaleString() : '-' },
  { field: 'createTime', title: '创建时间', minWidth: 180, formatter: ({ cellValue }) => cellValue ? new Date(cellValue).toLocaleString() : '-' },
];

const fetchData = async (pageParams) => {
  try {
    const res = await getHonorMgmtPage({
      className: props.row.className,
      pageNo: pageParams.currentPage,
      pageSize: pageParams.pageSize,
    });
    if (res.code === 200 && res.data.list && res.data.list.length > 0) {
      return { list: res.data.list, total: res.data.total };
    }
    throw new Error('无数据');
  } catch (error) {
    console.warn('使用模拟数据');
    let list = [...mockHonors];
    if (props.row.className) list = list.filter(h => h.className === props.row.className);
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
  <DetailDrawer title="荣誉明细" class="genchuan-detail-drawer">
    <div class="detail-container">
      <Grid />
    </div>
  </DetailDrawer>
</template>

<style scoped>
.detail-container { padding: 10px; }
</style>
