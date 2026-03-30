<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Icon } from '@iconify/vue';
import {
  ElButton,
  ElCard,
  ElForm,
  ElFormItem,
  ElMessage,
  ElMessageBox,
  ElPagination,
  ElTable,
  ElTableColumn,
} from 'element-plus';

import { getProcessDefinitionPage } from '#/api/bpm/definition';
import {
  cancelProcessInstanceByAdmin,
  getProcessInstanceManagerPage,
} from '#/api/bpm/processInstance';
import { dateFormatter } from '#/utils/genchuan/formatTime';
import ProcessDefinitionDetail from '#/views/bpm/processInstance/create/modules/form.vue';

import TaskDispatchForm from './TaskDispatchForm.vue';

/** 任务派发 列表 */
defineOptions({ name: 'TaskDispatch' });

const router = useRouter();
// 新增：控制流程详情组件显示状态的变量
const isProcessDetailVisible = ref(false); // 流程详情是否可见（决定显示父组件还是子组件）

const loading = ref(true); // 列表的加载中
const list = ref([]); // 列表的数据（初始为空数组）
const total = ref(0); // 列表的总页数

// 1. 接口请求参数：仅含pageNo/pageSize/name，用于调用getProcessInstanceManagerPage
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: '任务派发',
});

// 2. 是否保留 不再调用原业务接口 直接调用流程信息查询（分页）搜索表单绑定参数：与搜索表单字段一一对应，用于接收用户输入
const searchForm = reactive({
  taskCode: undefined,
  taskType: undefined,
  testPoints: undefined,
  indicators: undefined,
  deadline: [],
  dispatchDept: undefined,
  createTime: [],
});

const queryFormRef = ref(); // 搜索的表单

// 流程定义相关变量
const selectProcessDefinition = ref(); // 选中的流程定义
const processDefinitionDetailRef = ref(); // 流程详情组件引用

/** 查询列表：调用接口时传递queryParams（精简版） */
const getList = async () => {
  loading.value = true;
  try {
    // 关键：传递精简版queryParams给接口
    const data = await getProcessInstanceManagerPage(queryParams);
    // 清空原有列表，避免旧数据残留
    list.value = [];
    // 映射接口返回数据到表格所需格式，从formVariables中取对应字段
    data.list.forEach((item: any) => {
      // 假设formVariables是一个对象，存储流程表单字段键值对
      const formVariables = item.formVariables || {};
      const tableRow = {
        id: item.id || 0,
        status: item.status || '', // 新增status便于取消按钮显示判断
        taskCode: formVariables.Fi0qmejlkdz1abc || '',
        taskType: formVariables.F703mejlljnzafc || '',
        testPoints: formVariables.F5s1mejllq2uagc || '',
        indicators: formVariables.F0m4mejllw1jajc || '',
        // 处理完成时限，转换为Date类型
        deadline: formVariables.Flrumejlm2jlamc
          ? new Date(formVariables.Flrumejlm2jlamc)
          : new Date(),
        dispatchDept: formVariables.Fml3mejlmosnavc || '',
      };
      list.value.push(tableRow); // 新增行，避免索引访问undefined
    });
    total.value = data.total; // 赋值总条数
  } catch (error) {
    console.error('获取列表失败：', error);
    ElMessage.error('获取列表失败');
  } finally {
    loading.value = false;
  }
};

/** 序号计算 */
const indexMethod = (index: number) =>
  (queryParams.pageNo - 1) * queryParams.pageSize + index + 1;

/** 查看流程实例详情 */
const handleDetail = (row: any) => {
  router.push({
    name: 'BpmProcessInstanceDetail',
    query: {
      id: row.id,
    },
  });
};

/** 取消按钮操作 */
const handleCancel = async (row: any) => {
  // 二次确认
  const { value } = await ElMessageBox.prompt('请输入取消原因', '取消流程', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /^\s*\S[\s\S]*$/, // 判断非空，且非空格
    inputErrorMessage: '取消原因不能为空',
  });
  // 发起取消
  await cancelProcessInstanceByAdmin(row.id, value);
  ElMessage.success('取消成功');
  // 刷新列表
  await getList();
};

/** 发起任务派发操作 - 打开子组件 */
const handleCreate = async () => {
  try {
    const processDefinitions = await getProcessDefinitionPage({
      pageNo: 1,
      pageSize: 10,
      key: 'water_02',
    });

    if (processDefinitions && processDefinitions.list.length > 0) {
      selectProcessDefinition.value = processDefinitions.list[0];
      isProcessDetailVisible.value = true;
      await nextTick();
      processDefinitionDetailRef.value?.initProcessInfo(
        processDefinitions.list[0],
      );
    } else {
      ElMessage.error('未找到"派发任务"流程定义，请联系管理员配置');
    }
  } catch (error: any) {
    ElMessage.error(`获取流程信息失败：${error.message || '未知错误'}`);
  }
};

/** 处理流程详情的取消操作 */
const handleProcessCancel = () => {
  isProcessDetailVisible.value = false;
  selectProcessDefinition.value = undefined;
};

/** 初始化 */
onMounted(() => {
  getList();
});
</script>

<template>
  <!-- 根容器 -->
  <div class="task-dispatch-container">
    <!-- 父组件内容：仅在未打开流程详情时显示 -->
    <div v-if="!isProcessDetailVisible">
      <ElCard shadow="never" class="mb-4">
        <!-- 搜索工作栏：绑定searchForm（而非原queryParams） -->
        <ElForm
          class="-mb-15px"
          :model="searchForm"
          ref="queryFormRef"
          :inline="true"
          label-width="100px"
        >
          <!--              <el-form-item label="任务编号" prop="taskCode">-->
          <!--                <el-input-->
          <!--                  v-model="searchForm.taskCode"-->
          <!--                  placeholder="请输入任务编号"-->
          <!--                  clearable-->
          <!--                  @keyup.enter="handleQuery"-->
          <!--                  class="!w-240px"-->
          <!--                />-->
          <!--              </el-form-item>-->
          <!--              <el-form-item label="任务类型" prop="taskType">-->
          <!--                <el-input-->
          <!--                  v-model="searchForm.taskType"-->
          <!--                  placeholder="请输入任务类型(常规/应急)"-->
          <!--                  clearable-->
          <!--                  @keyup.enter="handleQuery"-->
          <!--                  class="!w-240px"-->
          <!--                />-->
          <!--              </el-form-item>-->
          <!--              <el-form-item label="检测点清单" prop="testPoints">-->
          <!--                <el-input-->
          <!--                  v-model="searchForm.testPoints"-->
          <!--                  placeholder="请输入检测点清单"-->
          <!--                  clearable-->
          <!--                  @keyup.enter="handleQuery"-->
          <!--                  class="!w-240px"-->
          <!--                />-->
          <!--              </el-form-item>-->
          <!--              <el-form-item label="指标清单" prop="indicators">-->
          <!--                <el-input-->
          <!--                  v-model="searchForm.indicators"-->
          <!--                  placeholder="请输入指标清单"-->
          <!--                  clearable-->
          <!--                  @keyup.enter="handleQuery"-->
          <!--                  class="!w-240px"-->
          <!--                />-->
          <!--              </el-form-item>-->
          <!--              <el-form-item label="截止日期" prop="deadline">-->
          <!--                <el-date-picker-->
          <!--                  v-model="searchForm.deadline"-->
          <!--                  value-format="YYYY-MM-DD"-->
          <!--                  type="date"-->
          <!--                  placeholder="选择截止日期"-->
          <!--                  clearable-->
          <!--                  class="!w-240px"-->
          <!--                />-->
          <!--              </el-form-item>-->
          <!--              <el-form-item label="派发部门" prop="dispatchDept">-->
          <!--                <el-input-->
          <!--                  v-model="searchForm.dispatchDept"-->
          <!--                  placeholder="请输入派发部门"-->
          <!--                  clearable-->
          <!--                  @keyup.enter="handleQuery"-->
          <!--                  class="!w-240px"-->
          <!--                />-->
          <!--              </el-form-item>-->
          <!--              <el-form-item label="创建时间" prop="createTime">-->
          <!--                <el-date-picker-->
          <!--                  v-model="searchForm.createTime"-->
          <!--                  value-format="YYYY-MM-DD HH:mm:ss"-->
          <!--                  type="daterange"-->
          <!--                  start-placeholder="开始日期"-->
          <!--                  end-placeholder="结束日期"-->
          <!--                  :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"-->
          <!--                  class="!w-220px"-->
          <!--                />-->
          <!--              </el-form-item>-->
          <ElFormItem>
            <!--                <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>-->
            <!--                <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>-->
            <!--                <el-button-->
            <!--                  type="primary"-->
            <!--                  plain-->
            <!--                  @click="openForm('create')"-->
            <!--                  v-hasPermi="['waterdetection:task-dispatch:create']"-->
            <!--                >-->
            <!--                  <Icon icon="ep:plus" class="mr-5px" /> 新增-->
            <!--                </el-button>-->
            <!--                <el-button-->
            <!--                  type="success"-->
            <!--                  plain-->
            <!--                  @click="handleExport"-->
            <!--                  :loading="exportLoading"-->
            <!--                  v-hasPermi="['waterdetection:task-dispatch:export']"-->
            <!--                >-->
            <!--                  <Icon icon="ep:download" class="mr-5px" /> 导出-->
            <!--                </el-button>-->
            <ElButton type="primary" @click="handleCreate()">
              <Icon icon="ep:plus" style="margin-right: 4px" /> 派发任务
            </ElButton>
          </ElFormItem>
        </ElForm>
      </ElCard>

      <!-- 列表：数据绑定不变 -->
      <ElCard shadow="never">
        <ElTable
          v-loading="loading"
          :data="list"
          :stripe="true"
          :show-overflow-tooltip="true"
        >
          <!-- 接口id随机乱码，手动计算序号-->
          <ElTableColumn
            label="序号"
            align="center"
            type="index"
            :index="indexMethod"
            width="80"
          />
          <!--          <el-table-column label="序号" align="center" prop="id" />-->
          <ElTableColumn label="任务编号" align="center" prop="taskCode" />
          <ElTableColumn label="任务类型" align="center" prop="taskType" />
          <ElTableColumn label="检测点清单" align="center" prop="testPoints" />
          <ElTableColumn label="指标清单" align="center" prop="indicators" />
          <ElTableColumn
            label="截止日期"
            align="center"
            prop="deadline"
            :formatter="dateFormatter"
            width="180px"
          />
          <ElTableColumn label="派发部门" align="center" prop="dispatchDept" />
          <!--          <el-table-column-->
          <!--            label="创建时间"-->
          <!--            align="center"-->
          <!--            prop="createTime"-->
          <!--            :formatter="dateFormatter"-->
          <!--            width="180px"-->
          <!--          />-->
          <ElTableColumn label="操作" align="center" min-width="120px">
            <template #default="scope">
              <!--              <el-button-->
              <!--                link-->
              <!--                type="primary"-->
              <!--                @click="openForm('update', scope.row.id)"-->
              <!--                v-hasPermi="['waterdetection:task-dispatch:update']"-->
              <!--              >-->
              <!--                编辑-->
              <!--              </el-button>-->
              <!--              <el-button-->
              <!--                link-->
              <!--                type="danger"-->
              <!--                @click="handleDelete(scope.row.id)"-->
              <!--                v-hasPermi="['waterdetection:task-dispatch:delete']"-->
              <!--              >-->
              <!--                删除-->
              <!--              </el-button>-->
              <ElButton link type="primary" @click="handleDetail(scope.row)">
                详情
              </ElButton>
              <ElButton
                link
                type="danger"
                v-if="scope.row.status === 1"
                @click="handleCancel(scope.row)"
              >
                取消
              </ElButton>
            </template>
          </ElTableColumn>
        </ElTable>
        <!-- 分页：绑定接口请求参数queryParams -->
        <div class="mt-4 flex justify-end">
          <ElPagination
            :total="total"
            v-model:current-page="queryParams.pageNo"
            v-model:page-size="queryParams.pageSize"
            :page-sizes="[10, 20, 30, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="getList"
            @current-change="getList"
          />
        </div>
      </ElCard>

      <!-- 表单弹窗：添加/修改 -->
      <TaskDispatchForm ref="formRef" @success="getList" />
    </div>

    <!-- 流程提交组件：仅在打开时显示，替代父组件内容 -->
    <ProcessDefinitionDetail
      v-if="isProcessDetailVisible"
      ref="processDefinitionDetailRef"
      :select-process-definition="selectProcessDefinition"
      @cancel="handleProcessCancel"
    />
  </div>
</template>

<style scoped>
.task-dispatch-container {
  box-sizing: border-box;
  min-height: 100vh;
  padding: 16px;
}
</style>
