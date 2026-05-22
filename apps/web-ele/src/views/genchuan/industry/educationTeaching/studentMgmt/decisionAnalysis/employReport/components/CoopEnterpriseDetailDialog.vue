<script setup>
import { reactive, ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getCoopEnterprisePage } from '#/api/genchuan/industry/educationTeaching/studentMgmt/decisionAnalysis/employReport/data.js';

// 模拟数据
const mockEnterprises = [
  { id: 9, enterpriseName: '中国电信股份有限公司', enterpriseType: '国有企业', contactUser: '郑主任', contactPhone: '13900139009', coopStartTime: Date.now() - 86400000, coopEndTime: Date.now() + 86400000, status: '合作中', createTime: Date.now() - 86400000 },
  { id: 10, enterpriseName: '华为技术有限公司', enterpriseType: '民营企业', contactUser: '李经理', contactPhone: '13800138000', coopStartTime: Date.now() - 172800000, coopEndTime: Date.now() + 172800000, status: '合作中', createTime: Date.now() - 172800000 },
];

const columns = [
  { field: 'enterpriseName', title: '企业名称', minWidth: 180 },
  { field: 'enterpriseType', title: '企业类型', minWidth: 120 },
  { field: 'contactUser', title: '联系人', minWidth: 100 },
  { field: 'contactPhone', title: '联系电话', minWidth: 130 },
  { field: 'coopStartTime', title: '合作开始时间', minWidth: 180, formatter: ({ cellValue }) => cellValue ? new Date(cellValue).toLocaleString() : '-' },
  { field: 'coopEndTime', title: '合作结束时间', minWidth: 180, formatter: ({ cellValue }) => cellValue ? new Date(cellValue).toLocaleString() : '-' },
  { field: 'status', title: '状态', minWidth: 100 },
  { field: 'createTime', title: '创建时间', minWidth: 180, formatter: ({ cellValue }) => cellValue ? new Date(cellValue).toLocaleString() : '-' },
];

const fetchData = async (pageParams) => {
  try {
    const res = await getCoopEnterprisePage({
      pageNo: pageParams.currentPage,
      pageSize: pageParams.pageSize,
    });
    if (res.code === 200 && res.data.list && res.data.list.length > 0) {
      return { list: res.data.list, total: res.data.total };
    }
    throw new Error('无数据');
  } catch (error) {
    console.warn('使用模拟数据');
    const list = [...mockEnterprises];
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
  <DetailDrawer title="合作企业明细" class="genchuan-detail-drawer">
    <div class="detail-container">
      <Grid />
    </div>
  </DetailDrawer>
</template>

<style scoped>
.detail-container { padding: 10px; }
</style>
