<script setup>
import { reactive, ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getCommunicateMgmtPage } from '#/api/genchuan/industry/educationTeaching/studentMgmt/decisionAnalysis/homeReport/data.js';

// 模拟数据（保证至少一条）
const mockCommunicates = [
  { id: 9, title: '春季开学报到通知', content: '春季学期于2月20日报到', sendUser: '张老师', sendTime: Date.now() - 86400000, status: 'published', createTime: Date.now() - 86400000 },
  { id: 10, title: '成绩单发布通知', content: '期末成绩已发布', sendUser: '李老师', sendTime: Date.now() - 172800000, status: 'published', createTime: Date.now() - 172800000 },
];

const columns = [
  { field: 'title', title: '标题', minWidth: 200 },
  { field: 'content', title: '内容', minWidth: 250 },
  { field: 'sendUser', title: '发送人', minWidth: 100 },
  { field: 'sendTime', title: '发送时间', minWidth: 180, formatter: ({ cellValue }) => cellValue ? new Date(cellValue).toLocaleString() : '-' },
  { field: 'status', title: '状态', minWidth: 100 },
  { field: 'createTime', title: '创建时间', minWidth: 180, formatter: ({ cellValue }) => cellValue ? new Date(cellValue).toLocaleString() : '-' },
];

const fetchData = async (pageParams) => {
  try {
    const res = await getCommunicateMgmtPage({
      pageNo: pageParams.currentPage,
      pageSize: pageParams.pageSize,
    });
    if (res.code === 200 && res.data.list && res.data.list.length > 0) {
      return { list: res.data.list, total: res.data.total };
    }
    throw new Error('无数据');
  } catch (error) {
    console.warn('使用模拟数据');
    const list = [...mockCommunicates];
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
  <DetailDrawer title="消息推送明细" class="genchuan-detail-drawer">
    <div class="detail-container">
      <Grid />
    </div>
  </DetailDrawer>
</template>

<style scoped>
.detail-container { padding: 10px; }
</style>
