/** 评价标准管理 - 实际考核数据（聚合指标，不拆分档次） */

// 模拟指标体系（新增环卫园林一体化考核体系）
export const indexSystemList = [
  { id: 'sys1', name: '环卫园林一体化考核体系' },
  { id: 'sys2', name: '部门绩效评价体系V2.0' },
  { id: 'sys3', name: '社区服务评价体系V1.5' },
  { id: 'sys4', name: '街道治理评价体系V3.0' }
];

// 模拟用户（创建人/更新人）
export const userList = [
  { id: 'u1', name: '张三' },
  { id: 'u2', name: '李四' },
  { id: 'u3', name: '王五' },
  { id: 'u4', name: '赵六' },
  { id: 'u5', name: '孙七' }
];

// 模拟状态字典
export const statusList = [
  { id: 's1', name: '启用' },
  { id: 's2', name: '停用' }
];

// 各分类权重（从评价规则中提取，用于指标权重列）
const roadWeights = [2, 0.5, 0.5, 1, 1, 1, 1, 1, 1, 1, 1, 1.5, 1.5, 1, 1, 1, 1, 1, 1, 1];
const toiletWeights = [1, 2, 0.5, 0.5, 1, 2, 1, 1, 1, 2, 2, 1, 1];
const riverWeights = [1.5, 1.5, 1, 0.5, 1.5, 1, 1, 1, 1, 1, 1, 1.5, 1.5, 1];
const truckWeights = [1, 1, 1, 1, 2, 1, 1];
const stationWeights = [1, 1, 1, 2, 1, 1, 2, 2, 1, 1, 1];

// ----- 独立定义各分类的指标数组，避免循环引用 -----

// 市政道路指标
const roadIndicators = [
  { name: '无明显垃圾', standards: ['没有', '有1-5处散落垃圾', '有6-9处散落垃圾', '有10处以上散落垃圾'], scores: ['100', '70', '40', '0'], weight: roadWeights[0] },
  { name: '无零星垃圾', standards: ['没有', '有1-5处散落垃圾', '有6-9处散落垃圾', '有10处以上散落垃圾'], scores: ['100', '70', '40', '0'], weight: roadWeights[1] },
  { name: '无吊挂或积存垃圾', standards: ['没有', '有1-2处', '有3-5处', '有6处以上'], scores: ['100', '70', '40', '0'], weight: roadWeights[2] },
  { name: '路面见本色', standards: ['全部见本色', '轻度污染', '中度污染', '严重污染'], scores: ['100', '70', '40', '0'], weight: roadWeights[3] },
  { name: '路面无脏污', standards: ['没有', '有1-2处', '有3-5处', '有6处以上'], scores: ['100', '70', '40', '0'], weight: roadWeights[4] },
  { name: '垃圾收集点及容器完好洁净（残缺破损）', standards: ['没有', '有1-2处', '有3-5处', '有6处以上'], scores: ['100', '70', '40', '0'], weight: roadWeights[5] },
  { name: '垃圾收集点及容器明显脏污磨损斑驳', standards: ['没有', '有1-2处', '有3-5处', '有6处以上'], scores: ['100', '70', '40', '0'], weight: roadWeights[6] },
  { name: '垃圾收集容器摆放不整齐/占道/屋外摆放', standards: ['没有', '有1-2处', '有3-5处', '有6处以上'], scores: ['100', '70', '40', '0'], weight: roadWeights[7] },
  { name: '垃圾收集容器类别是否符合分类要求', standards: ['符合', '有缺失', '不符合'], scores: ['100', '50', '0'], weight: roadWeights[8] },
  { name: '垃圾收集容器应密闭未密闭/应套袋未套袋', standards: ['没有', '有1-2处', '有3-5处', '有6处以上'], scores: ['100', '70', '40', '0'], weight: roadWeights[9] },
  { name: '垃圾收集容器满溢/周边垃圾裸露/乱堆乱挂/污水污渍', standards: ['没有', '有1-2处', '有3-5处', '有6处以上'], scores: ['100', '70', '40', '0'], weight: roadWeights[10] },
  { name: '建（构）筑物外立面完好整洁', standards: ['没有', '有1-2处', '有3-5处', '有6处以上'], scores: ['100', '70', '40', '0'], weight: roadWeights[11] },
  { name: '城市家具完好整洁', standards: ['没有', '有1-2处', '有3-5处', '有6处以上'], scores: ['100', '70', '40', '0'], weight: roadWeights[12] },
  { name: '井盖雨篦完好通畅', standards: ['没有', '有1-2处', '有3-5处', '有6处以上'], scores: ['100', '70', '40', '0'], weight: roadWeights[13] },
  { name: '无花草枯死/泥土裸露', standards: ['没有', '有1-2处', '有3-5处', '有6处以上'], scores: ['100', '70', '40', '0'], weight: roadWeights[14] },
  { name: '无树木死株缺株/危树危枝', standards: ['没有', '有1-2处', '有3-5处', '有6处以上'], scores: ['100', '70', '40', '0'], weight: roadWeights[15] },
  { name: '行道树硕大果实及时修剪', standards: ['没有', '有1-2处', '有3-5处', '有6处以上'], scores: ['100', '70', '40', '0'], weight: roadWeights[16] },
  { name: '无树木影响其他设施', standards: ['没有', '有1-2处', '有3-5处', '有6处以上'], scores: ['100', '70', '40', '0'], weight: roadWeights[17] },
  { name: '绿篱/灌木/地被/草坪及时修剪', standards: ['没有', '有1-2处', '有3-5处', '有6处以上'], scores: ['100', '70', '40', '0'], weight: roadWeights[18] },
  { name: '市政环卫工人着装规范', standards: ['全部规范着装', '有不规范着装现象', '有不文明着装现象或有2人以上不规范'], scores: ['100', '50', '0'], weight: roadWeights[19] }
];

// 公共厕所指标
const toiletIndicators = [
  { name: '标识规范干净', standards: ['标识规范干净整洁', '标识规范但有脏污', '标识不规范或有缺失', '无标识'], scores: ['100', '70', '40', '0'], weight: toiletWeights[0] },
  { name: '无臭味', standards: ['无臭味', '轻微臭味', '明显臭味', '严重臭味'], scores: ['100', '70', '40', '0'], weight: toiletWeights[1] },
  { name: '洗手台整洁干净', standards: ['完好无损无堵塞无杂物无积垢积水', '完好无损无堵塞但有轻微水渍污迹杂物', '有明显破损堵塞杂物积垢积水', '严重破损堵塞积垢'], scores: ['100', '70', '40', '0'], weight: toiletWeights[2] },
  { name: '水龙头完好干净', standards: ['完好无损且洁净', '完好但有脏污锈蚀', '有明显损坏或漏水', '都损坏或无法使用'], scores: ['100', '70', '40', '0'], weight: toiletWeights[3] },
  { name: '面镜完好干净', standards: ['完好无损表面干净', '完好但有轻微水渍污迹', '有明显破损或脏污', '无面镜或严重破损'], scores: ['100', '70', '40', '0'], weight: toiletWeights[4] },
  { name: '地面完好干净无脏污', standards: ['完好无损无脏污无积垢积水', '完好但有轻微水渍污迹', '有明显破损坑洼脏污积垢积水', '严重破损坑洼脏污积垢积水'], scores: ['100', '70', '40', '0'], weight: toiletWeights[5] },
  { name: '墙壁/天花板/窗户完好干净', standards: ['完好无损无脏污无张贴涂画无蛛网', '完好但有轻微积尘蛛网污迹', '有明显破损掉漆剥落脏污张贴涂画', '严重破损脏污张贴涂画'], scores: ['100', '70', '40', '0'], weight: toiletWeights[6] },
  { name: '厕所内整洁干净', standards: ['清洁工具摆放整齐无乱堆放挂晒', '摆放整齐但有洗手台搁物板挂钩乱放小物件', '有乱堆放或乱挂晒'], scores: ['100', '50', '0'], weight: toiletWeights[7] },
  { name: '厕门厕位隔断完好干净', standards: ['完好无损无脏污无张贴涂画', '完好但有轻微水渍污迹', '有明显破损脏污张贴涂画', '严重脏污张贴涂画'], scores: ['100', '70', '40', '0'], weight: toiletWeights[8] },
  { name: '大小便器完好干净', standards: ['完好无损无堵塞脏污积垢釉面干净', '完好无堵塞但有轻微污迹杂物', '个别有明显破损堵塞脏污积垢', '半数以上有明显破损堵塞脏污积垢或污物溢流'], scores: ['100', '70', '40', '0'], weight: toiletWeights[9] },
  { name: '厕间干净', standards: ['地面干净无垃圾脏污积水垃圾桶不超2/3', '地面轻微水渍污迹或垃圾桶超2/3但不满溢', '地面有明显垃圾脏污或积水', '地面严重脏污积水或垃圾桶满溢'], scores: ['100', '70', '40', '0'], weight: toiletWeights[10] },
  { name: '冲水设备完好干净', standards: ['完好无损正常使用', '个别有明显破损漏水或无法正常使用', '无自动冲水或半数以上无法使用'], scores: ['100', '50', '0'], weight: toiletWeights[11] },
  { name: '无障碍设施完好干净', standards: ['设施完好整洁无脏污积垢积水', '完好但有轻微水渍污迹', '有明显破损坑洼脏污积垢积水', '严重破损坑洼脏污积垢积水或无无障碍厕间'], scores: ['100', '70', '40', '0'], weight: toiletWeights[12] }
];

// 河道指标
const riverIndicators = [
  { name: '无动物尸体', standards: ['没有', '有1处', '有2处', '有3处以上'], scores: ['100', '70', '40', '0'], weight: riverWeights[0] },
  { name: '水域无明显漂浮垃圾', standards: ['没有', '有1-5处', '有6-9处', '有10处以上'], scores: ['100', '70', '40', '0'], weight: riverWeights[1] },
  { name: '陆域无明显垃圾', standards: ['没有', '有1-5处', '有6-9处', '有10处以上'], scores: ['100', '70', '40', '0'], weight: riverWeights[2] },
  { name: '陆域无零星垃圾', standards: ['没有', '有1-5处', '有6-9处', '有10处以上'], scores: ['100', '70', '40', '0'], weight: riverWeights[3] },
  { name: '水边栈道无脏污', standards: ['没有', '有1-2处', '有3-5处', '有6处以上'], scores: ['100', '70', '40', '0'], weight: riverWeights[4] },
  { name: '垃圾收集点及容器完好洁净（残缺破损）', standards: ['没有', '有1-2处', '有3-5处', '有6处以上'], scores: ['100', '70', '40', '0'], weight: riverWeights[5] },
  { name: '垃圾收集点及容器明显脏污磨损斑驳', standards: ['没有', '有1-2处', '有3-5处', '有6处以上'], scores: ['100', '70', '40', '0'], weight: riverWeights[6] },
  { name: '垃圾收集容器摆放不整齐/占道/屋外摆放', standards: ['没有', '有1-2处', '有3-5处', '有6处以上'], scores: ['100', '70', '40', '0'], weight: riverWeights[7] },
  { name: '垃圾收集容器类别是否符合分类要求', standards: ['符合', '有缺失', '不符合'], scores: ['100', '50', '0'], weight: riverWeights[8] },
  { name: '垃圾收集容器应密闭未密闭/应套袋未套袋', standards: ['没有', '有1-2处', '有3-5处', '有6处以上'], scores: ['100', '70', '40', '0'], weight: riverWeights[9] },
  { name: '垃圾收集容器满溢/周边垃圾裸露/乱堆乱挂/污水污渍', standards: ['没有', '有1-2处', '有3-5处', '有6处以上'], scores: ['100', '70', '40', '0'], weight: riverWeights[10] },
  { name: '建（构）筑物外立面完好整洁', standards: ['没有', '有1-2处', '有3-5处', '有6处以上'], scores: ['100', '70', '40', '0'], weight: riverWeights[11] },
  { name: '城市家具完好整洁', standards: ['没有', '有1-2处', '有3-5处', '有6处以上'], scores: ['100', '70', '40', '0'], weight: riverWeights[12] },
  { name: '市政环卫工人着装规范', standards: ['全部规范着装', '有不规范着装现象', '有不文明着装现象或有2人以上不规范'], scores: ['100', '50', '0'], weight: riverWeights[13] }
];

// 环卫作业车（镇街）指标
const truckIndicators = [
  { name: '外观喷绘规范', standards: ['统一规范喷绘', '统一喷绘但不规范', '未统一喷绘'], scores: ['100', '50', '0'], weight: truckWeights[0] },
  { name: '车牌清晰完整', standards: ['前后号牌清晰完整', '前后号牌完整但有1个不清晰', '无号牌或前后都不清晰'], scores: ['100', '50', '0'], weight: truckWeights[1] },
  { name: '外观部件完好', standards: ['没有', '有1-2处', '有3-5处', '有6处以上'], scores: ['100', '70', '40', '0'], weight: truckWeights[2] },
  { name: '车容干净整洁', standards: ['没有', '有1-2处', '有3-5处', '有6处以上或1平方米以上'], scores: ['100', '70', '40', '0'], weight: truckWeights[3] },
  { name: '垃圾密闭收运', standards: ['密闭良好', '密闭不严', '未密闭收运或跑冒滴漏'], scores: ['100', '50', '0'], weight: truckWeights[4] },
  { name: '装载垃圾桶密闭', standards: ['密闭良好', '密闭不严', '未密闭收运或垃圾满溢'], scores: ['100', '50', '0'], weight: truckWeights[5] },
  { name: '驾驶员着装与行为规范', standards: ['全部规范着装且文明作业', '有不规范着装现象', '有违规不文明作业或2人以上不规范'], scores: ['100', '50', '0'], weight: truckWeights[6] }
];

// 垃圾转运站指标
const stationIndicators = [
  { name: '公示牌整洁', standards: ['完好整洁', '局部污损', '严重污损或无公示牌'], scores: ['100', '50', '0'], weight: stationWeights[0] },
  { name: '外观完好整洁', standards: ['没有', '有1-2处', '有3-5处', '有6处以上或露天摆放压缩箱'], scores: ['100', '70', '40', '0'], weight: stationWeights[1] },
  { name: '地面硬底化及维护', standards: ['完好平整', '局部开裂', '明显破损坑洼', '严重破损坑洼或1平方米以上'], scores: ['100', '70', '40', '0'], weight: stationWeights[2] },
  { name: '地面干净', standards: ['没有', '有1-2处', '有3-5处', '有6处以上'], scores: ['100', '70', '40', '0'], weight: stationWeights[3] },
  { name: '排污沟渠干净通畅', standards: ['干净通畅', '有少量垃圾杂物', '有垃圾杂物堵塞或明显积水污泥', '完全堵塞或无排污沟渠污水溢流'], scores: ['100', '70', '40', '0'], weight: stationWeights[4] },
  { name: '压缩箱外观完好', standards: ['没有', '有1-2处', '有3处以上或1平方米以上'], scores: ['100', '50', '0'], weight: stationWeights[5] },
  { name: '压缩箱外观整洁', standards: ['没有', '有1-2处', '有3-5处', '有6处以上'], scores: ['100', '70', '40', '0'], weight: stationWeights[6] },
  { name: '垃圾密闭收运', standards: ['密闭良好', '密闭不严', '未密闭收运或跑冒滴漏'], scores: ['100', '50', '0'], weight: stationWeights[7] },
  { name: '压缩箱排污阀正常开启', standards: ['开启并接管密闭', '开启但未接管或未密闭', '排污阀未开启'], scores: ['100', '50', '0'], weight: stationWeights[8] },
  { name: '除臭设施正常运行', standards: ['正常运行', '有除臭设施但未运行', '无除臭设施'], scores: ['100', '50', '0'], weight: stationWeights[9] },
  { name: '市政环卫工人着装规范', standards: ['全部规范着装', '有不规范着装现象', '有违规不文明作业或2人以上不规范'], scores: ['100', '50', '0'], weight: stationWeights[10] }
];

// ----- 组合所有分类 -----
const categoryIndicators = [
  { name: '市政道路', indicators: roadIndicators },
  { name: '公共厕所', indicators: toiletIndicators },
  { name: '公共服务机构周边', indicators: roadIndicators.map(ind => ({ ...ind })) }, // 深拷贝独立副本
  { name: '商业街', indicators: roadIndicators.map(ind => ({ ...ind })) },
  { name: '公园', indicators: roadIndicators.map(ind => ({ ...ind })) },
  { name: '城中村', indicators: roadIndicators.map(ind => ({ ...ind })) },
  { name: '集贸市场周边', indicators: roadIndicators.map(ind => ({ ...ind })) },
  { name: '河道', indicators: riverIndicators },
  { name: '环卫作业车（镇街）', indicators: truckIndicators },
  { name: '环卫作业车（区局）', indicators: truckIndicators.map(ind => ({ ...ind })) },
  { name: '垃圾转运站', indicators: stationIndicators }
];

/** 标准分类列表数据 - 聚合指标（每个指标一条，包含标准和分数数组） */
export const dataList = () => {
  const list = [];
  categoryIndicators.forEach((cat) => {
    const items = cat.indicators.map((indicator, idx) => ({
      indicatorId: `ind_${cat.name}_${idx}`,
      name: indicator.name,
      standards: indicator.standards,
      scores: indicator.scores,
      weight: indicator.weight,
      sortNo: idx + 1,
      createTime: '2025-01-01 10:00',
      updateTime: '2025-01-01 10:00'
    }));

    list.push({
      standardCategoryId: `cat_${cat.name}`,
      name: cat.name,
      systemId: 'sys1',
      systemName: '环卫园林一体化考核体系',
      itemCount: items.length,
      statusId: 's1',
      statusName: '启用',
      createByName: '张三',
      createTime: '2025-01-01 10:00',
      updateByName: '李四',
      updateTime: '2025-01-01 10:00',
      changeLog: '根据考核表初始化（聚合指标）',
      items: items
    });
  });
  return list;
};

/** 标准分类表单配置（新增/编辑） */
export function useCategoryFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '标准分类名称',
      component: 'Input',
      componentProps: { placeholder: '请输入标准分类名称' },
      rules: 'required'
    },
    {
      fieldName: 'systemId',
      label: '适用指标体系',
      component: 'Select',
      componentProps: {
        placeholder: '请选择适用指标体系',
        options: indexSystemList.map(s => ({ label: s.name, value: s.id }))
      },
      rules: 'required'
    },
    {
      fieldName: 'statusId',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: statusList.map(s => ({ label: s.name, value: s.id }))
      },
      rules: '',
      defaultValue: 's1',
      hidden: true
    }
  ];
}

/** 标准项表单配置（新增/编辑） - 用于指标级别，但标准页不直接编辑标准项，此处保留备用 */
export function useItemFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '指标名称',
      component: 'Input',
      componentProps: { placeholder: '请输入指标名称' },
      rules: 'required'
    },
    {
      fieldName: 'weight',
      label: '权重',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入权重', min: 0, step: 0.1 },
      rules: 'required'
    }
    // 标准和分数不在表单中直接编辑，可通过表格行内编辑
  ];
}

/** 根据标签页获取表格列配置 */
export function getGridColumnsByTab(tab) {
  const baseColumns = [
    { type: 'checkbox', width: 40, visible: tab === '全部' }
  ];

  const commonColumns = [
    {
      field: 'name',
      title: '标准分类名称',
      minWidth: 150,
      sortable: true,
      slots: { default: 'name' }
    },
    {
      field: 'systemName',
      title: '适用指标体系',
      minWidth: 180,
      sortable: true,
      slots: { default: 'systemName' }
    }
  ];

  // 全部tab额外列
  const allExtraColumns = [
    {
      field: 'statusName',
      title: '状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'statusName' }
    },
    {
      field: 'createByName',
      title: '创建人',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 160,
      sortable: true
    },
    {
      field: 'itemCount',
      title: '指标数量',
      minWidth: 120,
      sortable: true
    },
    {
      field: 'changeLog',
      title: '变更日志',
      minWidth: 200,
      sortable: false,
      formatter: (row) => row.changeLog?.substring(0, 50) + (row.changeLog?.length > 50 ? '...' : '')
    }
  ];

  // 启用tab额外列
  const enableExtraColumns = [
    {
      field: 'createByName',
      title: '创建人',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 160,
      sortable: true
    },
    {
      field: 'lastUseTime',
      title: '最近使用时间',
      minWidth: 160,
      sortable: true
    },
    {
      field: 'useCount',
      title: '使用次数',
      minWidth: 100,
      sortable: true
    }
  ];

  // 停用tab额外列
  const disableExtraColumns = [
    {
      field: 'changeLog',
      title: '停用原因',
      minWidth: 200,
      sortable: false,
      formatter: (row) => row.changeLog?.substring(0, 50) + (row.changeLog?.length > 50 ? '...' : '')
    },
    {
      field: 'itemCount',
      title: '指标数量',
      minWidth: 120,
      sortable: true
    },
    {
      field: 'createByName',
      title: '创建人',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 160,
      sortable: true
    },
    {
      field: 'updateTime',
      title: '停用时间',
      minWidth: 160,
      sortable: true
    },
    {
      field: 'updateByName',
      title: '停用操作人',
      minWidth: 120,
      sortable: true
    }
  ];

  let dynamicColumns = [];
  if (tab === '全部') {
    dynamicColumns = allExtraColumns;
  } else if (tab === '启用') {
    dynamicColumns = enableExtraColumns;
  } else if (tab === '停用') {
    dynamicColumns = disableExtraColumns;
  }

  const columns = [
    ...(tab === '全部' ? baseColumns : []),
    ...commonColumns,
    ...dynamicColumns,
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' }
    }
  ];

  return columns;
}

export const textObj = {
  editText: '编辑标准分类',
  addText: '新增标准分类',
  versionText: '新增版本',
  excelName: '评价标准列表',
  excelAllName: '评价标准数据.xlsx',
  total: '总计：分类总数11；启用11；停用0',
  addItemText: '新增指标',
  editItemText: '编辑指标'
};
