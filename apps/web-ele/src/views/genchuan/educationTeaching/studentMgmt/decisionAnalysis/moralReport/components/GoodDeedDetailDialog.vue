<script setup>
import { ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';

const currentRow = ref({});

const columns = [
  { type: 'seq', width: 60, title: '序号' },
  { field: 'eventDate', title: '发生日期', minWidth: 120 },
  { field: 'eventName', title: '好人好事事件', minWidth: 200 },
  { field: 'score', title: '得分', minWidth: 100, sortable: true },
  { field: 'recorder', title: '记录人', minWidth: 100 },
];

// 获取好人好事记录（模拟数据）
const fetchData = async (params) => {
  // TODO: 替换为真实API
  // return requestClient.get('/studentmgmt/moral-report/good-deed-list', { params });
  console.log('请求好人好事记录:', params);
  const mockList = [];
  for (let i = 1; i <= 5; i++) {
    mockList.push({
      id: i,
      eventDate: `2026-04-${i * 3}`,
      eventName: ['拾金不昧', '助人为乐', '义务劳动', '爱心捐赠'][i % 4],
      score: (Math.random() * 10 + 5).toFixed(1),
      recorder: ['班主任', '德育处', '班长'][Math.floor(Math.random() * 3)],
    });
  }
  return {list: mockList, total: mockList.length};
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns,
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({page}) =>
          await fetchData({className: currentRow.value.className, ...page}),
      },
    },
    rowConfig: {keyField: 'id', isHover: true},
    pagerConfig: {},
    toolbarConfig: {refresh: true},
    showOverflow: true,
  },
  showSearchForm: false,
});

// 使用 Drawer 替代 Modal
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,      // 非模态，支持同时打开多个
  appendToMain: true,
  footer: false,
  width: 800,
  onCancel: () => detailDrawerApi.close(),
});

const open = async (row) => {
  if (!row) return;
  currentRow.value = row;
  detailDrawerApi.open();
  setTimeout(() => gridApi.query(), 100);
};

const close = () => detailDrawerApi.close();

defineExpose({open, close});
</script>

<template>
  <DetailDrawer title="好人好事记录明细" class="genchuan-detail-drawer">
    <div class="detail-container">
      <div class="info-bar">班级：{{ currentRow.className }}</div>
      <Grid/>
    </div>
  </DetailDrawer>
</template>

<style scoped>
.detail-container {
  padding: 10px;
}

.info-bar {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #409eff;
}
</style>
