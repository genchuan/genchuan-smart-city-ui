<script setup>
import {ref} from 'vue';
import {useVbenDrawer} from '@vben/common-ui';
import {useVbenVxeGrid} from '#/adapter/vxe-table';

const currentRow = ref({});

const columns = [
  {type: 'seq', width: 60, title: '序号'},
  {field: 'evaluateDate', title: '评比日期', minWidth: 120},
  {field: 'score', title: '得分', minWidth: 100, sortable: true},
  {field: 'inspector', title: '评比人', minWidth: 100},
  {field: 'items', title: '评比项目', minWidth: 150},
  {field: 'remark', title: '备注', minWidth: 150},
];

// 获取文明行为评比记录（模拟数据）
const fetchData = async (params) => {
  // TODO: 替换为真实API
  console.log('请求文明行为评比记录:', params);
  const mockList = [];
  for (let i = 1; i <= 4; i++) {
    mockList.push({
      id: i,
      evaluateDate: `2026-04-${i * 5}`,
      score: (Math.random() * 30 + 60).toFixed(1),
      inspector: ['德育处', '学生处', '值周教师'][Math.floor(Math.random() * 3)],
      items: '文明礼仪、卫生保持、纪律遵守',
      remark: i % 2 === 0 ? '表现优秀' : '有待提升',
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
  <DetailDrawer title="文明行为评比明细" class="genchuan-detail-drawer">
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
