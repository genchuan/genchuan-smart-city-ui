<script setup>
import { reactive, ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getStudentInfoPage } from '#/api/genchuan/industry/educationTeaching/studentMgmt/decisionAnalysis/workReport/data.js';

// 本地模拟数据（确保至少有一条）
const mockStudents = [
  { id: 10, studentNo: '2023112', name: '林壵三', major: '护理', grade: '2023', className: '护理2401班', status: '在籍', createTime: Date.now() - 86400000 },
  { id: 11, studentNo: '2023113', name: '张小明', major: '计算机', grade: '2022', className: '计算机2201班', status: '在籍', createTime: Date.now() - 172800000 },
  { id: 12, studentNo: '2023114', name: '李芳', major: '软件工程', grade: '2024', className: '软件工程2301班', status: '在籍', createTime: Date.now() - 259200000 },
];

const props = defineProps({
  row: { type: Object, default: () => ({}) },
});

const columns = [
  { field: 'studentNo', title: '学号', minWidth: 120 },
  { field: 'name', title: '姓名', minWidth: 100 },
  { field: 'className', title: '班级', minWidth: 150 },
  { field: 'major', title: '专业', minWidth: 150 },
  { field: 'grade', title: '年级', minWidth: 100 },
  { field: 'status', title: '状态', minWidth: 100 },
  { field: 'createTime', title: '创建时间', minWidth: 180, formatter: ({ cellValue }) => cellValue ? new Date(cellValue).toLocaleString() : '-' },
];

const fetchData = async (pageParams) => {
  try {
    const res = await getStudentInfoPage({
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
    let list = [...mockStudents];
    if (props.row.className) list = list.filter(s => s.className === props.row.className);
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
  <DetailDrawer title="学生列表" class="genchuan-detail-drawer">
    <div class="detail-container">
      <Grid />
    </div>
  </DetailDrawer>
</template>

<style scoped>
.detail-container { padding: 10px; }
</style>
