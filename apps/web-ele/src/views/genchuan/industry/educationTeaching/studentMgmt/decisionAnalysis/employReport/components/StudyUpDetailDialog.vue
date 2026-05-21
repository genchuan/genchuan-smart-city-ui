<script setup>
import { reactive, ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getStudyUpPage } from '#/api/genchuan/industry/educationTeaching/studentMgmt/decisionAnalysis/employReport/data.js';

// 模拟数据
const mockStudyUps = [
  { id: 4, studentId: 4, studentName: '赵六', schoolName: '复旦大学', schoolType: '公办本科', major: '信息安全', status: '已录取', createTime: Date.now() - 86400000 },
  { id: 5, studentId: 5, studentName: '钱七', schoolName: '浙江大学', schoolType: '公办本科', major: '计算机技术', status: '已录取', createTime: Date.now() - 172800000 },
];

const columns = [
  { field: 'studentName', title: '学生姓名', minWidth: 100 },
  { field: 'schoolName', title: '升学学校', minWidth: 180 },
  { field: 'schoolType', title: '学校类型', minWidth: 120 },
  { field: 'major', title: '专业', minWidth: 120 },
  { field: 'status', title: '状态', minWidth: 100 },
  { field: 'createTime', title: '创建时间', minWidth: 180, formatter: ({ cellValue }) => cellValue ? new Date(cellValue).toLocaleString() : '-' },
];

const fetchData = async (pageParams) => {
  try {
    const res = await getStudyUpPage({
      pageNo: pageParams.currentPage,
      pageSize: pageParams.pageSize,
    });
    if (res.code === 200 && res.data.list && res.data.list.length > 0) {
      return { list: res.data.list, total: res.data.total };
    }
    throw new Error('无数据');
  } catch (error) {
    console.warn('使用模拟数据');
    const list = [...mockStudyUps];
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
  <DetailDrawer title="升学明细" class="genchuan-detail-drawer">
    <div class="detail-container">
      <Grid />
    </div>
  </DetailDrawer>
</template>

<style scoped>
.detail-container { padding: 10px; }
</style>
