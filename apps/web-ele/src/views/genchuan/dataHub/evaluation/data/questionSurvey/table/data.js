// survey/data.js
/** 问卷调查管理 - 数据字典与模拟数据 */

// 评价任务表模拟（复用现有）
export const evalTaskList = [
  { task_id: 'task01', name: '2025年10月XX区网格管理评价任务' },
  { task_id: 'task02', name: '2025年11月河道水质监测任务' },
  { task_id: 'task03', name: '2025年第四季度设备在线率考核' }
];

// 系统用户表模拟
export const userList = [
  { id: 'u1', name: '张三' },
  { id: 'u2', name: '李四' },
  { id: 'u3', name: '王五' }
];

// 发放方式字典表
export const issueTypeList = [
  { id: 'qrcode', name: '二维码发放' },
  { id: 'link', name: '线上链接发放' },
  { id: 'sms', name: '短信邀请发放' },
  { id: 'email', name: '邮件发放' },
  { id: 'paper', name: '线下纸质发放' }
];

// 问卷状态字典表
export const surveyStatusList = [
  { id: 'not_started', name: '未开始' },
  { id: 'in_progress', name: '进行中' },
  { id: 'finished', name: '已结束' },
  { id: 'paused', name: '已暂停' },
  { id: 'cancelled', name: '已取消' }
];

// 题目类型
export const questionTypeList = [
  { id: 'radio', name: '单选题' },
  { id: 'checkbox', name: '多选题' },
  { id: 'score', name: '打分题' }
];

// 模拟问卷数据（包含题目和选项）
let questionnaires = [
  {
    questionnaire_id: 'q1',
    name: '2025年10月网格群众满意度调查',
    code: 'SQ001',
    task_id: 'task01',
    task_name: '2025年10月XX区网格管理评价任务',
    object_scope: 'XX区8个网格居民',
    issue_type_id: 'qrcode',
    start_time: '2025-10-10 00:00:00',
    end_time: '2025-10-20 23:59:59',
    original_start_time: '2025-10-10 00:00:00',
    original_end_time: '2025-10-20 23:59:59',
    status: 'finished',
    fill_count: 120,
    fill_rate: 85.7,
    average_score: 8.5,
    final_fill_rate: 85.7,
    final_average_score: 8.5,
    index_value: 85,
    data_relation_status: 'related',
    create_by: 'u1',
    create_by_name: '张三',
    create_time: '2025-10-05 09:00:00',
    update_by: 'u1',
    update_time: '2025-10-05 09:00:00',
    url_qrcode: 'https://survey.example.com/q1',
    questions: [
      {
        question_id: 'q1_q1',
        title: '您对所在网格的环境卫生满意吗？',
        question_type: 'score',
        score: 10,
        sort_no: 1,
        options: null
      },
      {
        question_id: 'q1_q2',
        title: '您认为网格管理需要改进的方面有哪些？',
        question_type: 'checkbox',
        score: null,
        sort_no: 2,
        options: [
          { option_id: 'o1', content: '环境卫生', score: null, sort_no: 1 },
          { option_id: 'o2', content: '公共设施', score: null, sort_no: 2 },
          { option_id: 'o3', content: '治安管理', score: null, sort_no: 3 }
        ]
      },
      {
        question_id: 'q1_q3',
        title: '您对网格员的整体服务评价？',
        question_type: 'radio',
        score: null,
        sort_no: 3,
        options: [
          { option_id: 'o4', content: '非常满意', score: null, sort_no: 1 },
          { option_id: 'o5', content: '满意', score: null, sort_no: 2 },
          { option_id: 'o6', content: '一般', score: null, sort_no: 3 },
          { option_id: 'o7', content: '不满意', score: null, sort_no: 4 }
        ]
      }
    ]
  },
  {
    questionnaire_id: 'q2',
    name: '2025年11月部门服务满意度调查',
    code: 'SQ002',
    task_id: 'task02',
    task_name: '2025年11月河道水质监测任务',
    object_scope: '河道管理部门',
    issue_type_id: 'link',
    start_time: '2025-11-15 00:00:00',
    end_time: '2025-11-30 23:59:59',
    original_start_time: '2025-11-15 00:00:00',
    original_end_time: '2025-11-30 23:59:59',
    status: 'in_progress',
    fill_count: 45,
    fill_rate: 56.3,
    average_score: 7.9,
    final_fill_rate: null,
    final_average_score: null,
    index_value: null,
    data_relation_status: 'unrelated',
    create_by: 'u2',
    create_by_name: '李四',
    create_time: '2025-11-10 14:30:00',
    update_by: 'u2',
    update_time: '2025-11-10 14:30:00',
    url_qrcode: 'https://survey.example.com/q2',
    questions: [
      {
        question_id: 'q2_q1',
        title: '您对河道水质改善效果满意吗？',
        question_type: 'score',
        score: 10,
        sort_no: 1,
        options: null
      }
    ]
  },
  {
    questionnaire_id: 'q3',
    name: '2025年第四季度设备在线率考核问卷',
    code: 'SQ003',
    task_id: 'task03',
    task_name: '2025年第四季度设备在线率考核',
    object_scope: '设备运维人员',
    issue_type_id: 'email',
    start_time: '2026-01-01 00:00:00',
    end_time: '2026-01-15 23:59:59',
    original_start_time: '2026-01-01 00:00:00',
    original_end_time: '2026-01-15 23:59:59',
    status: 'not_started',
    fill_count: 0,
    fill_rate: 0,
    average_score: null,
    final_fill_rate: null,
    final_average_score: null,
    index_value: null,
    data_relation_status: 'unrelated',
    create_by: 'u3',
    create_by_name: '王五',
    create_time: '2025-12-20 10:00:00',
    update_by: 'u3',
    update_time: '2025-12-20 10:00:00',
    url_qrcode: null,
    questions: [
      {
        question_id: 'q3_q1',
        title: '您认为设备在线率提升的主要因素？',
        question_type: 'radio',
        score: null,
        sort_no: 1,
        options: [
          { option_id: 'o8', content: '设备质量提升', score: null, sort_no: 1 },
          { option_id: 'o9', content: '运维效率提高', score: null, sort_no: 2 },
          { option_id: 'o10', content: '监测系统优化', score: null, sort_no: 3 }
        ]
      }
    ]
  }
];

// 获取所有问卷（含关联数据）
export const getAllQuestionnaires = () => {
  return questionnaires.map(q => ({
    ...q,
    task_name: evalTaskList.find(t => t.task_id === q.task_id)?.name || '',
    create_by_name: userList.find(u => u.id === q.create_by)?.name || '',
    issue_type_name: issueTypeList.find(i => i.id === q.issue_type_id)?.name || '',
    status_name: surveyStatusList.find(s => s.id === q.status)?.name || ''
  }));
};

// 根据状态和搜索条件获取问卷
export const getQuestionnairesByFilter = (activeTab, searchParams = {}) => {
  let quests = getAllQuestionnaires();
  if (activeTab !== '全部') {
    let statusMap = { '未开始': 'not_started', '进行中': 'in_progress', '已结束': 'finished' };
    quests = quests.filter(q => q.status === statusMap[activeTab]);
  }
  if (Object.keys(searchParams).length) {
    quests = quests.filter(q => {
      let match = true;
      if (searchParams.name && !q.name.includes(searchParams.name)) match = false;
      if (searchParams.task_id && q.task_id !== searchParams.task_id) match = false;
      if (searchParams.issue_type_id && q.issue_type_id !== searchParams.issue_type_id) match = false;
      if (searchParams.status && q.status !== searchParams.status) match = false;
      if (searchParams.start_time && q.start_time < searchParams.start_time) match = false;
      if (searchParams.end_time && q.end_time > searchParams.end_time) match = false;
      return match;
    });
  }
  return quests;
};

// 创建问卷
export const createQuestionnaire = (data) => {
  const newQuest = {
    questionnaire_id: `q${Date.now()}`,
    code: `SQ${Math.floor(Math.random() * 10000)}`,
    status: 'not_started',
    fill_count: 0,
    fill_rate: 0,
    average_score: null,
    final_fill_rate: null,
    final_average_score: null,
    index_value: null,
    data_relation_status: 'unrelated',
    create_by: 'u1',
    create_by_name: '张三',
    create_time: new Date().toLocaleString(),
    update_by: 'u1',
    update_time: new Date().toLocaleString(),
    url_qrcode: null,
    ...data,
    questions: data.questions || []
  };
  questionnaires.unshift(newQuest);
  return newQuest;
};

// 更新问卷（编辑）
export const updateQuestionnaire = (questId, data) => {
  const index = questionnaires.findIndex(q => q.questionnaire_id === questId);
  if (index !== -1) {
    questionnaires[index] = {
      ...questionnaires[index],
      ...data,
      update_time: new Date().toLocaleString()
    };
    return questionnaires[index];
  }
  return null;
};

// 启动问卷
export const startQuestionnaire = (questId) => {
  const index = questionnaires.findIndex(q => q.questionnaire_id === questId);
  if (index !== -1 && questionnaires[index].status === 'not_started') {
    questionnaires[index].status = 'in_progress';
    questionnaires[index].start_time = new Date().toLocaleString();
    questionnaires[index].url_qrcode = `https://survey.example.com/${questId}`;
    return true;
  }
  return false;
};

// 结束问卷
export const finishQuestionnaire = (questId) => {
  const index = questionnaires.findIndex(q => q.questionnaire_id === questId);
  if (index !== -1 && questionnaires[index].status === 'in_progress') {
    questionnaires[index].status = 'finished';
    questionnaires[index].end_time = new Date().toLocaleString();
    // 模拟计算最终统计
    questionnaires[index].final_fill_rate = questionnaires[index].fill_rate;
    questionnaires[index].final_average_score = questionnaires[index].average_score;
    // 模拟指标值映射
    questionnaires[index].index_value = Math.round(questionnaires[index].final_average_score * 10);
    return true;
  }
  return false;
};

// 延长结束时间
export const extendEndTime = (questId, newEndTime) => {
  const index = questionnaires.findIndex(q => q.questionnaire_id === questId);
  if (index !== -1 && questionnaires[index].status === 'in_progress') {
    questionnaires[index].original_end_time = questionnaires[index].end_time;
    questionnaires[index].end_time = newEndTime;
    return true;
  }
  return false;
};

// 复制问卷（返回新问卷，不保存）
export const copyQuestionnaire = (quest) => {
  const newQuest = JSON.parse(JSON.stringify(quest));
  newQuest.questionnaire_id = null;
  newQuest.name = `${quest.name} (副本)`;
  newQuest.code = `${quest.code}_copy`;
  newQuest.status = 'not_started';
  newQuest.fill_count = 0;
  newQuest.fill_rate = 0;
  newQuest.average_score = null;
  newQuest.final_fill_rate = null;
  newQuest.final_average_score = null;
  newQuest.index_value = null;
  newQuest.data_relation_status = 'unrelated';
  newQuest.create_time = new Date().toLocaleString();
  newQuest.update_time = new Date().toLocaleString();
  newQuest.url_qrcode = null;
  return newQuest;
};

// 删除问卷（仅未开始）
export const deleteQuestionnaire = (questId) => {
  const index = questionnaires.findIndex(q => q.questionnaire_id === questId);
  if (index !== -1 && questionnaires[index].status === 'not_started') {
    questionnaires.splice(index, 1);
    return true;
  }
  return false;
};

// 关联评价数据
export const relateToEvaluation = (questId) => {
  const index = questionnaires.findIndex(q => q.questionnaire_id === questId);
  if (index !== -1 && questionnaires[index].status === 'finished') {
    questionnaires[index].data_relation_status = 'related';
    // 实际应调用评价任务接口更新指标值
    return true;
  }
  return false;
};

// 表格列配置
export function getGridColumnsByTab(tab) {
  const baseColumns = [
    { type: 'checkbox', width: 40, visible: true }
  ];

  const commonColumns = [
    { field: 'name', title: '问卷名称', minWidth: 200, sortable: true, slots: { default: 'name' } },
    { field: 'code', title: '问卷编码', minWidth: 150, sortable: true, slots: { default: 'code' } }
  ];

  // 全部特有列
  const allExtra = [
    { field: 'task_name', title: '关联评价任务', minWidth: 200, sortable: true, slots: { default: 'taskName' } },
    { field: 'object_scope', title: '调查对象范围', minWidth: 150 },
    { field: 'issue_type_name', title: '发放方式', minWidth: 120 },
    { field: 'time_range', title: '起止时间', minWidth: 200, formatter: row => `${row.start_time} 至 ${row.end_time}` },
    { field: 'status_name', title: '状态', minWidth: 100, sortable: true, slots: { default: 'status' } },
    { field: 'create_by_name', title: '创建人', minWidth: 100 },
    { field: 'create_time', title: '创建时间', minWidth: 160 },
    { field: 'fill_count', title: '填写人数', minWidth: 100, sortable: true },
    { field: 'url_qrcode', title: '问卷链接/二维码', minWidth: 120, slots: { default: 'url' } }
  ];

  // 未开始特有列
  const notStartedExtra = [
    { field: 'task_name', title: '关联评价任务', minWidth: 200 },
    { field: 'object_scope', title: '调查对象范围', minWidth: 150 },
    { field: 'issue_type_name', title: '发放方式', minWidth: 120 },
    { field: 'time_range', title: '起止时间', minWidth: 200, formatter: row => `${row.start_time} 至 ${row.end_time}` },
    { field: 'create_by_name', title: '创建人', minWidth: 100 },
    { field: 'create_time', title: '创建时间', minWidth: 160 },
    { field: 'preview_url', title: '问卷预览入口', minWidth: 100, slots: { default: 'preview' } }
  ];

  // 进行中特有列
  const inProgressExtra = [
    { field: 'task_name', title: '关联评价任务', minWidth: 200 },
    { field: 'object_scope', title: '调查对象范围', minWidth: 150 },
    { field: 'issue_type_name', title: '发放方式', minWidth: 120 },
    { field: 'original_time_range', title: '原起止时间', minWidth: 200, formatter: row => `${row.original_start_time} 至 ${row.original_end_time}` },
    { field: 'end_time', title: '当前结束时间', minWidth: 160 },
    { field: 'fill_count', title: '填写人数', minWidth: 100 },
    { field: 'fill_rate', title: '实时填写率', minWidth: 100, formatter: row => row.fill_rate + '%' },
    { field: 'average_score', title: '平均分', minWidth: 100 }
  ];

  // 已结束特有列
  const finishedExtra = [
    { field: 'task_name', title: '关联评价任务', minWidth: 200 },
    { field: 'object_scope', title: '调查对象范围', minWidth: 150 },
    { field: 'issue_type_name', title: '发放方式', minWidth: 120 },
    { field: 'time_range', title: '起止时间', minWidth: 200, formatter: row => `${row.start_time} 至 ${row.end_time}` },
    { field: 'fill_count', title: '填写人数', minWidth: 100 },
    { field: 'final_fill_rate', title: '最终填写率', minWidth: 100, formatter: row => row.final_fill_rate + '%' },
    { field: 'final_average_score', title: '最终平均分', minWidth: 100 },
    { field: 'index_value', title: '指标值映射结果', minWidth: 120 },
    { field: 'data_relation_status', title: '数据关联状态', minWidth: 120, formatter: row => row.data_relation_status === 'related' ? '已关联评价' : '未关联评价' }
  ];

  let dynamicColumns = [];
  if (tab === '全部') dynamicColumns = allExtra;
  else if (tab === '未开始') dynamicColumns = notStartedExtra;
  else if (tab === '进行中') dynamicColumns = inProgressExtra;
  else if (tab === '已结束') dynamicColumns = finishedExtra;

  const actionsColumn = {
    title: '操作',
    width: 200,
    fixed: 'right',
    slots: { default: 'actions' }
  };

  return [...baseColumns, ...commonColumns, ...dynamicColumns, actionsColumn];
}

// 搜索表单schema
export function getSearchSchemaByTab(tab) {
  const base = [
    { fieldName: 'name', label: '问卷名称', component: 'Input' },
    { fieldName: 'task_id', label: '关联评价任务', component: 'Select', componentProps: { options: evalTaskList.map(t => ({ label: t.name, value: t.task_id })) } },
    { fieldName: 'issue_type_id', label: '发放方式', component: 'Select', componentProps: { options: issueTypeList.map(i => ({ label: i.name, value: i.id })) } }
  ];
  if (tab === '全部') {
    base.push({ fieldName: 'status', label: '状态', component: 'Select', componentProps: { options: surveyStatusList.map(s => ({ label: s.name, value: s.id })) } });
  }
  if (tab !== '已结束') {
    base.push(
      { fieldName: 'start_time', label: '开始时间', component: 'DatePicker', componentProps: { type: 'datetime' } },
      { fieldName: 'end_time', label: '结束时间', component: 'DatePicker', componentProps: { type: 'datetime' } }
    );
  }
  return base;
}

// 题目表单schema（动态，根据题型不同）
export function getQuestionSchema() {
  return [
    { fieldName: 'title', label: '题目内容', component: 'Input', rules: 'required' },
    { fieldName: 'question_type', label: '题目类型', component: 'Select', componentProps: { options: questionTypeList.map(t => ({ label: t.name, value: t.id })) }, rules: 'required' },
    { fieldName: 'score', label: '分值', component: 'InputNumber', componentProps: { min: 0, max: 100 }, rules: 'required', ifShow: (form) => form.question_type === 'score' },
    { fieldName: 'options', label: '选项', component: 'OptionList', componentProps: { placeholder: '请输入选项，每行一个' }, ifShow: (form) => form.question_type !== 'score' }
  ];
}
