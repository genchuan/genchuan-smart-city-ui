<script setup>
import { ref } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['close', 'confirm']);

const rectifyContent = ref('');
const rectifyType = ref('');
const loading = ref(false);
const result = ref({
  show: false,
  success: false,
  message: '',
});

const getStatusType = (status) => {
  switch (status) {
    case '停用': {
      return 'danger';
    }
    case '建设中': {
      return 'info';
    }
    case '正常': {
      return 'success';
    }
    case '维护中': {
      return 'warning';
    }
    default: {
      return 'info';
    }
  }
};

const getCheckResultType = (result) => {
  return result === '通过' ? 'success' : 'danger';
};

const handleConfirm = () => {
  if (!rectifyContent.value || !rectifyType.value) {
    return;
  }

  loading.value = true;

  // 模拟处理过程
  setTimeout(() => {
    loading.value = false;
    // 模拟处理结果
    result.value = {
      show: true,
      success: true,
    };
    emit('confirm', {
      rectifyContent: rectifyContent.value,
      rectifyType: rectifyType.value,
      geoCode: props.data.geoCode,
    });
  }, 2000);
};

const handleCancel = () => {
  emit('close');
};
</script>

<template>
  <div class="single-rectify">
    <div class="content">
      <div class="data-info">
        <p>地点名称：{{ data.locationName }}</p>
        <p>地理编码：{{ data.geoCode }}</p>
        <p>
          当前状态：<el-tag :type="getStatusType(data.statusName)">
            {{ data.statusName }}
          </el-tag>
        </p>
        <p>
          数据质量校验结果：<el-tag
            :type="getCheckResultType(data.checkResultName)"
          >
            {{ data.checkResultName }}
          </el-tag>
        </p>
      </div>
      <div class="rectify-content">
        <el-form-item label="整改内容">
          <el-input
            type="textarea"
            v-model="rectifyContent"
            placeholder="请输入整改内容"
            :rows="4"
          />
        </el-form-item>
      </div>
      <div class="rectify-type">
        <el-form-item label="整改类型">
          <el-select v-model="rectifyType" placeholder="请选择整改类型">
            <el-option label="坐标修正" value="coordinate" />
            <el-option label="编码重生成" value="code" />
            <el-option label="属性修正" value="property" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
      </div>
      <div class="loading-container" v-if="loading">
        <el-loading v-loading="loading" element-loading-text="正在处理...">
          <div style="height: 200px"></div>
        </el-loading>
      </div>
      <div class="result-info" v-if="result.show">
        <el-alert
          :title="result.success ? '整改成功' : '整改失败'"
          :type="result.success ? 'success' : 'error'"
          :closable="false"
          show-icon
        />
        <div v-if="result.success" class="success-info">
          <p>整改内容已提交成功</p>
          <p>二次校验结果：<el-tag type="success">通过</el-tag></p>
        </div>
        <div v-else class="error-info">
          <p>{{ result.message }}</p>
        </div>
      </div>
    </div>
    <div class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button
        type="primary"
        @click="handleConfirm"
        :loading="loading"
        :disabled="!rectifyContent || !rectifyType"
      >
        {{ loading ? '提交中...' : '确认' }}
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.single-rectify {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.title {
  padding-bottom: 10px;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid #eaeaea;
}

.content {
  flex: 1;
  padding: 10px 0;
}

.data-info {
  padding: 15px;
  margin-bottom: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.data-info p {
  margin: 8px 0;
}

.rectify-content {
  margin-bottom: 20px;
}

.rectify-type {
  margin-bottom: 20px;
}

.loading-container {
  margin: 20px 0;
}

.result-info {
  margin: 20px 0;
}

.success-info,
.error-info {
  padding: 10px;
  margin-top: 10px;
  background-color: #f0f9eb;
  border-radius: 4px;
}

.error-info {
  background-color: #fef0f0;
}

.dialog-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding-top: 10px;
  margin-top: 20px;
  border-top: 1px solid #eaeaea;
}
</style>
