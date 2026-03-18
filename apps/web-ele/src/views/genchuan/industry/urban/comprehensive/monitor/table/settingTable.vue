<script setup>
import { computed, reactive, ref } from 'vue';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { ElMessage } from 'element-plus';

// 模拟监测参数数据
const monitorParams = reactive({
  list: [
    {
      id: '1',
      paramName: '温度',
      paramCode: 'temperature',
      unit: '℃',
      minValue: 20,
      maxValue: 30,
      warningLevel: '中风险',
      isEnable: true
    },
    {
      id: '2',
      paramName: '湿度',
      paramCode: 'humidity',
      unit: '%',
      minValue: 40,
      maxValue: 70,
      warningLevel: '中风险',
      isEnable: true
    },
    {
      id: '3',
      paramName: '燃气浓度',
      paramCode: 'gas',
      unit: '%',
      minValue: 0,
      maxValue: 0.5,
      warningLevel: '高风险',
      isEnable: true
    }
  ]
});

// 表格列配置
const useGridColumns = () => {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'paramName',
      title: '参数名称',
      minWidth: 120,
      sortable: true
    },
    {
      field: 'paramCode',
      title: '参数编码',
      minWidth: 120,
      sortable: true
    },
    {
      field: 'unit',
      title: '单位',
      minWidth: 80,
      sortable: true
    },
    {
      field: 'minValue',
      title: '最小值',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'maxValue',
      title: '最大值',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'warningLevel',
      title: '预警等级',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'isEnable',
      title: '是否启用',
      minWidth: 100,
      sortable: true,
      slots: { default: 'isEnable' }
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      slots: { default: 'actions' }
    }
  ];
};

// 表格数据获取
const getTableData = () => {
  return {
    total: monitorParams.list.length,
    list: monitorParams.list
  };
};

// 初始化表格
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async () => getTableData()
      }
    },
    rowConfig: {
      keyField: 'id',
      isHover: true
    },
    pagerConfig: {
      total: monitorParams.list.length,
      currentPage: 1,
      pageSize: 10
    },
    toolbarConfig: {
      'class-name': 'common-tool-bar-config',
      refresh: true,
      search: true
    },
    showOverflow: true
  }
});

// 保存配置
const handleSaveConfig = () => {
  ElMessage.success('监测参数配置保存成功');
  console.log('保存监测参数配置:', monitorParams.list);
};

// 新增参数
const handleAddParam = () => {
  const newParam = {
    id: String(monitorParams.list.length + 1),
    paramName: '新参数',
    paramCode: 'new_param',
    unit: '',
    minValue: 0,
    maxValue: 100,
    warningLevel: '低风险',
    isEnable: true
  };
  monitorParams.list.push(newParam);
  gridApi.query();
  ElMessage.success('新增参数成功');
};

// 删除参数
const handleDeleteParam = (row) => {
  monitorParams.list = monitorParams.list.filter(item => item.id !== row.id);
  gridApi.query();
  ElMessage.success('删除参数成功');
};
</script>

<template>
  <div class="setting-table">
    <div class="setting-header">
      <h3>监测参数配置</h3>
      <el-button type="primary" @click="handleAddParam">
        新增参数
      </el-button>
    </div>
    
    <Grid>
      <template #isEnable="{ row }">
        <el-switch v-model="row.isEnable" />
      </template>
      <template #actions="{ row }">
        <el-button 
          type="danger" 
          size="small" 
          @click="handleDeleteParam(row)"
        >
          删除
        </el-button>
      </template>
    </Grid>
    
    <div class="setting-footer">
      <el-button @click="$emit('close')">取消</el-button>
      <el-button type="primary" @click="handleSaveConfig">保存配置</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.setting-table {
  padding: 20px;
  
  .setting-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h3 {
      margin: 0;
      color: #333;
    }
  }
  
  .setting-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }
}
</style>