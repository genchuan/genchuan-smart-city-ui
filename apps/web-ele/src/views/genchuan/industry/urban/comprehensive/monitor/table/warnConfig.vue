<script setup>
import { ref, defineProps, defineEmits, toRefs } from 'vue';
import { ElMessage, ElDrawer, ElForm, ElFormItem, ElSelect, ElOption, ElButton } from 'element-plus';

// 定义组件接收的属性
const props = defineProps({
  // 详情数据对象
  detailObj: {
    type: Object,
    default: () => ({}),
  },
  // 抽屉标题
  title: {
    type: String,
    default: '配置预警方式',
  },
});

// 解构props
const { title } = toRefs(props);

// 定义事件
const emit = defineEmits(['save', 'close']);

// 预警方式选项
const warnWayOptions = [
  { label: '平台弹窗', value: '平台弹窗' },
  { label: '短信', value: '短信' },
  { label: '声光', value: '声光' },
];

// 管廊区段选项（模拟数据，实际项目中应从API获取）
const gallerySectionOptions = [
  { label: '福州市鼓楼区杨桥东路综合管廊', value: '福州市鼓楼区杨桥东路综合管廊' },
  { label: '厦门市思明区鹭江道综合管廊', value: '厦门市思明区鹭江道综合管廊' },
  { label: '泉州市丰泽区刺桐路综合管廊', value: '泉州市丰泽区刺桐路综合管廊' },
  { label: '漳州市芗城区胜利路综合管廊', value: '漳州市芗城区胜利路综合管廊' },
  { label: '莆田市城厢区荔城南大道综合管廊', value: '莆田市城厢区荔城南大道综合管廊' },
  { label: '宁德市蕉城区闽东中路综合管廊', value: '宁德市蕉城区闽东中路综合管廊' },
  { label: '龙岩市新罗区龙川路综合管廊', value: '龙岩市新罗区龙川路综合管廊' },
  { label: '三明市梅列区列东街综合管廊', value: '三明市梅列区列东街综合管廊' },
  { label: '南平市延平区八一路综合管廊', value: '南平市延平区八一路综合管廊' },
  { label: '平潭综合实验区金井大道综合管廊', value: '平潭综合实验区金井大道综合管廊' },
];

// 表单数据
const formData = ref({
  gallerySection: '',
  warnWay: '',
});

// 抽屉可见性
const drawerVisible = ref(false);

// 表单引用
const formRef = ref();

// 打开抽屉
function open() {
  drawerVisible.value = true;
  // 重置表单
  formData.value = {
    gallerySection: '',
    warnWay: '',
  };
}

// 关闭抽屉
function close() {
  drawerVisible.value = false;
  emit('close');
}

// 处理表单提交
function handleSubmit() {
  // 验证表单
  if (!formData.value.gallerySection || !formData.value.warnWay) {
    ElMessage.warning('请填写完整的预警配置信息');
    return;
  }
  
  // 模拟保存操作
  ElMessage.success('预警方式配置成功');
  
  // 关闭抽屉
  close();
  
  // 触发保存事件
  emit('save', formData.value);
}

// 处理重置
function handleReset() {
  formData.value = {
    gallerySection: '',
    warnWay: '',
  };
  close();
}

// 对外暴露打开/关闭抽屉的方法
defineExpose({
  open,
  close,
});
</script>

<template>
  <ElDrawer
    v-model="drawerVisible"
    :title="title.value"
    :width="600"
    :append-to-body="true"
    @close="close"
  >
    <div class="warn-config-container">
      <ElForm :model="formData" ref="formRef" label-width="100px">
        <ElFormItem label="管廊区段" required>
          <ElSelect v-model="formData.gallerySection" placeholder="请选择管廊区段" style="width: 100%">
            <ElOption
              v-for="option in gallerySectionOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="预警方式" required>
          <ElSelect v-model="formData.warnWay" placeholder="请选择预警方式" style="width: 100%">
            <ElOption
              v-for="option in warnWayOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem>
          <ElButton type="primary" @click="handleSubmit">保存</ElButton>
          <ElButton @click="handleReset">取消</ElButton>
        </ElFormItem>
      </ElForm>
    </div>
  </ElDrawer>
</template>

<style scoped>
.warn-config-container {
  padding: 20px;
}
</style>