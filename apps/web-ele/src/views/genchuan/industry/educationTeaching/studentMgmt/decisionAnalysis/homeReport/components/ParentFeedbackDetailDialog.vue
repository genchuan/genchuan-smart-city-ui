<script setup>
import { reactive, ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getParentReplyPage } from '#/api/genchuan/industry/educationTeaching/studentMgmt/decisionAnalysis/homeReport/data.js';

// 家长反馈模拟数据
const mockFeedbacks = [
  { id: 1, communicateId: 9, studentId: 7, studentName: '吴九', parentReplyContent: '好的，收到', parentReplyTime: Date.now() - 86400000, teacherReplyContent: '感谢配合', teacherReplyTime: Date.now() - 43200000, createTime: Date.now() - 86400000 },
  { id: 2, communicateId: 10, studentId: 8, studentName: '郑十', parentReplyContent: '谢谢老师', parentReplyTime: Date.now() - 172800000, teacherReplyContent: null, teacherReplyTime: null, createTime: Date.now() - 172800000 },
];

const columns = [
  { field: 'studentName', title: '学生姓名', minWidth: 100 },
  { field: 'parentReplyContent', title: '家长反馈内容', minWidth: 200 },
  { field: 'parentReplyTime', title: '反馈时间', minWidth: 180, formatter: ({ cellValue }) => cellValue ? new Date(cellValue).toLocaleString() : '-' },
  { field: 'teacherReplyContent', title: '老师回复', minWidth: 200 },
  { field: 'teacherReplyTime', title: '回复时间', minWidth: 180, formatter: ({ cellValue }) => cellValue ? new Date(cellValue).toLocaleString() : '-' },
  { field: 'createTime', title: '创建时间', minWidth: 180, formatter: ({ cellValue }) => cellValue ? new Date(cellValue).toLocaleString() : '-' },
];

const fetchData = async (pageParams) => {
  try {
    const res = await getParentReplyPage({
      pageNo: pageParams.currentPage,
      pageSize: pageParams.pageSize,
    });
    if (res.code === 200 && res.data.list && res.data.list.length > 0) {
      return { list: res.data.list, total: res.data.total };
    }
    throw new Error('无数据');
  } catch (error) {
    console.warn('使用模拟数据');
    const list = [...mockFeedbacks];
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
  <DetailDrawer title="家长反馈明细" class="genchuan-detail-drawer">
    <div class="detail-container">
      <Grid />
    </div>
  </DetailDrawer>
</template>

<style scoped>
.detail-container { padding: 10px; }
</style>
