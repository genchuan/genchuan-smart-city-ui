<script setup>
import { reactive, ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getTreatMgmtPage } from '#/api/genchuan/industry/educationTeaching/studentMgmt/decisionAnalysis/medicalReport/data.js';

// 本地模拟数据（保证至少一条）
const mockTreats = [
  { id: 13, studentId: 2025010, studentName: '张三', treatType: '门诊', symptom: '眼睛很疼', registerTime: Date.now() - 86400000, treatContent: '开具眼药水', applyTime: Date.now() - 172800000, auditUser: '李医生', auditTime: Date.now() - 86400000, status: 'visited', createTime: Date.now() - 86400000 },
  { id: 14, studentId: 2025011, studentName: '李四', treatType: '急诊', symptom: '发烧', registerTime: Date.now() - 172800000, treatContent: '退烧药', applyTime: Date.now() - 259200000, auditUser: '王医生', auditTime: Date.now() - 172800000, status: 'visited', createTime: Date.now() - 172800000 },
];

const columns = [
  { field: 'studentId', title: '学生ID', minWidth: 100 },
  { field: 'studentName', title: '学生姓名', minWidth: 100 },
  { field: 'treatType', title: '就诊类型', minWidth: 100 },
  { field: 'symptom', title: '症状', minWidth: 120 },
  { field: 'registerTime', title: '就诊时间', minWidth: 180, formatter: ({ cellValue }) => cellValue ? new Date(cellValue).toLocaleString() : '-' },
  { field: 'treatContent', title: '诊疗内容', minWidth: 150 },
  { field: 'status', title: '状态', minWidth: 100 },
  { field: 'createTime', title: '创建时间', minWidth: 180, formatter: ({ cellValue }) => cellValue ? new Date(cellValue).toLocaleString() : '-' },
];

const fetchData = async (pageParams) => {
  try {
    const res = await getTreatMgmtPage({
      pageNo: pageParams.currentPage,
      pageSize: pageParams.pageSize,
    });
    if (res.code === 200 && res.data.list && res.data.list.length > 0) {
      return { list: res.data.list, total: res.data.total };
    }
    throw new Error('无数据');
  } catch (error) {
    console.warn('使用模拟数据');
    const list = [...mockTreats];
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
  <DetailDrawer title="就诊记录明细" class="genchuan-detail-drawer">
    <div class="detail-container">
      <Grid />
    </div>
  </DetailDrawer>
</template>

<style scoped>
.detail-container { padding: 10px; }
</style>
