/** 评价规则管理 - 真实数据（环卫园林一体化考核） */

// 适用对象类型（保留，但不再用于否决项，若其他模块需要可保留）
export const objectTypeList = [
  { id: '1', name: '网格' },
  { id: '2', name: '部门' },
  { id: '3', name: '社区' },
  { id: '4', name: '街道' }
];

// 规则类型（保持不变）
export const ruleTypeList = [
  { id: 'rt1', name: '加分' },
  { id: 'rt2', name: '扣分' }
];

// 指标体系（新增环卫园林一体化考核体系）
export const indexSystemList = [
  { id: 'is_hy', name: '环卫园林一体化考核体系' }
];

// 指标项列表（从Excel所有工作表提取，共65项）
export const indexItemList = [
  // 道路类指标（20项） ii001-ii020
  { id: 'ii001', name: '道路（含车行道、人行道、道牙）及两侧、绿化带（含绿地、树穴、花坛、花箱）有没有明显垃圾。' },
  { id: 'ii002', name: '道路（含人行道、道牙）及两侧、绿化带（含绿地、树穴、花坛、花箱）有没有零星垃圾。' },
  { id: 'ii003', name: '电线电缆、屋顶雨篷、树干树梢等有没有吊挂或积存垃圾。' },
  { id: 'ii004', name: '道路（含车行道、人行道、道牙）及两侧路面有没有见本色。' },
  { id: 'ii005', name: '道路（含车行道、人行道、道牙）及两侧路面有没有明显脏污。' },
  { id: 'ii006', name: '垃圾收集点建（构）筑物及垃圾收集容器有没有残缺、破损或严重锈蚀。' },
  { id: 'ii007', name: '垃圾收集点建（构）筑物及垃圾收集容器有没有明显脏污、磨损、斑驳。' },
  { id: 'ii008', name: '垃圾收集容器有没有摆放不整齐，占用人、车行道或绿化带，屋外（柜外、线外）摆放垃圾桶。' },
  { id: 'ii009', name: '垃圾收集容器类别是否符合所在场所生活垃圾分类设施设置要求。' },
  { id: 'ii010', name: '垃圾收集容器有没有应密闭未密闭、应套袋未套袋。' },
  { id: 'ii011', name: '垃圾收集容器有没有满溢，周边3米范围内有没有垃圾裸露、乱堆乱挂、污水污渍。' },
  { id: 'ii012', name: '临街建（构）筑物外立面及其附属设施有没有明显脏污。' },
  { id: 'ii013', name: '城市家具有没有明显脏污斑驳。' },
  { id: 'ii014', name: '井盖雨篦有没有明显锈蚀，表面有没有明显脏污、垃圾杂物堆积堵塞。' },
  { id: 'ii015', name: '绿化带（含绿地、树穴、花坛、花箱）有没有明显泥土裸露、花草枯死等现象。' },
  { id: 'ii016', name: '城市树木有没有死株缺株、危树危枝、树木护树架破损等现象。' },
  { id: 'ii017', name: '行道树硕大果实有没有修剪不及时导致掉落或明显飘絮。' },
  { id: 'ii018', name: '城市树木有没有影响交通信号灯、路牌标志、路灯、电力、通信等现象。' },
  { id: 'ii019', name: '绿篱、灌木、地被、草坪等有没有及时修剪。' },
  { id: 'ii020', name: '市政环卫工人有没有规范穿着工作服和安全防护装备。' },

  // 公共厕所指标（13项） ii021-ii033
  { id: 'ii021', name: '公共厕所标识和男女厕、第三卫生间、母婴室等标识是否规范、干净整洁。' },
  { id: 'ii022', name: '公共厕所内有无臭味。' },
  { id: 'ii023', name: '洗手台是否干净整洁。' },
  { id: 'ii024', name: '水龙头是否完好干净。' },
  { id: 'ii025', name: '面镜是否完好干净。' },
  { id: 'ii026', name: '地面是否完好，是否有脏污、积水积垢。' },
  { id: 'ii027', name: '墙壁、天花板、窗户是否完好，是否有脏污，是否有乱张贴乱涂画，是否有蛛网。' },
  { id: 'ii028', name: '公厕内工具是否摆放整齐，是否有无乱堆放乱挂晒。' },
  { id: 'ii029', name: '厕门、厕位隔断是否完好干净。' },
  { id: 'ii030', name: '大小便器是否完好，是否有堵塞、脏污、积垢。' },
  { id: 'ii031', name: '厕间地面是否干净，是否有垃圾、脏污、积水积垢。' },
  { id: 'ii032', name: '冲水设备是否完好干净。' },
  { id: 'ii033', name: '无障碍设施是否完好干净。' },

  // 河道指标（14项） ii034-ii047
  { id: 'ii034', name: '河道水域、陆域有没有动物尸体。' },
  { id: 'ii035', name: '河道水域有没有明显漂浮的生活垃圾、枯枝落叶、油污、水生植物等。' },
  { id: 'ii036', name: '河道陆域、绿化带等有没有明显垃圾。' },
  { id: 'ii037', name: '河道陆域、绿化带等有没有零星垃圾。' },
  { id: 'ii038', name: '水边栈道路面、栏杆有没有明显脏污。' },
  { id: 'ii039', name: '垃圾收集点建（构）筑物及垃圾收集容器有没有残缺、破损或严重锈蚀。' },
  { id: 'ii040', name: '垃圾收集点建（构）筑物及垃圾收集容器有没有明显脏污、磨损、斑驳。' },
  { id: 'ii041', name: '垃圾收集容器有没有摆放不整齐，占用人道或绿化带，屋外（柜外、线外）摆放垃圾桶。' },
  { id: 'ii042', name: '垃圾收集容器类别是否符合所在场所生活垃圾分类设施设置要求。' },
  { id: 'ii043', name: '垃圾收集容器有没有应密闭未密闭、应套袋未套袋。' },
  { id: 'ii044', name: '垃圾收集容器有没有满溢，周边3米范围内有没有垃圾裸露、乱堆乱挂、污水污渍。' },
  { id: 'ii045', name: '河道范围建（构）筑物外立面及其附属设施有没有明显脏污。' },
  { id: 'ii046', name: '城市家具有没有明显脏污斑驳。' },
  { id: 'ii047', name: '市政环卫工人有没有规范穿着工作服和安全防护装备。' },

  // 环卫作业车指标（7项） ii048-ii054
  { id: 'ii048', name: '环卫作业车外观喷绘是否统一规范。' },
  { id: 'ii049', name: '环卫作业车号牌是否清晰完整。' },
  { id: 'ii050', name: '环卫作业车外观部件有无残缺破损。' },
  { id: 'ii051', name: '环卫作业车外观有无车容车貌不洁。' },
  { id: 'ii052', name: '垃圾清运车是否密闭收运，有无跑冒滴漏。' },
  { id: 'ii053', name: '桶装车装载垃圾桶是否密闭收运，有无垃圾满溢。' },
  { id: 'ii054', name: '车辆驾驶员、随车工作人员是否规范穿着工作服并文明作业。' },

  // 垃圾转运站指标（11项） ii055-ii065
  { id: 'ii055', name: '垃圾转运站监督公示牌是否完好整洁。' },
  { id: 'ii056', name: '建（构）筑物内外墙及及其附属设施有无明显破损、脏污。' },
  { id: 'ii057', name: '垃圾转运站内外地面有无明显破损、坑洼。' },
  { id: 'ii058', name: '垃圾转运站内外地面有无明显垃圾、污水、污迹。' },
  { id: 'ii059', name: '垃圾转运站排污沟渠是否干净通畅。' },
  { id: 'ii060', name: '垃圾转运站内压缩箱有无破损、锈蚀。' },
  { id: 'ii061', name: '垃圾转运站内压缩箱有无脏污、不洁。' },
  { id: 'ii062', name: '进站机具设备是否密闭收运，有无跑冒滴漏。' },
  { id: 'ii063', name: '压缩箱装载作业时是否开启排污阀并连接管道密闭排污。' },
  { id: 'ii064', name: '垃圾转运站除臭设施是否正常运行。' },
  { id: 'ii065', name: '市政环卫工人（含站内作业人员和进站车辆驾驶员、随车工作人员）是否规范穿着工作服并文明作业。' }
];

// 用户列表（保持不变）
export const userList = [
  { id: 'u1', name: '张三' },
  { id: 'u2', name: '李四' },
  { id: 'u3', name: '王五' }
];

// 状态列表（保持不变）
export const statusList = [
  { id: 's1', name: '启用' },
  { id: 's2', name: '停用' }
];

/** 评价规则列表数据 - 真实考核数据 */
export const dataList = () => {
  const now = new Date();
  const createTime = now.toLocaleString();
  const updateTime = now.toLocaleString();

  // 指标导向映射（规则项名称使用导向名称）
  const guideNameMap = {
    // 市政道路 (ii001-ii020)
    ii001: '无明显垃圾',
    ii002: '无零星垃圾',
    ii003: '无吊挂或积存垃圾',
    ii004: '路面见本色',
    ii005: '路面无脏污',
    ii006: '垃圾收集点及容器完好洁净',
    ii007: '垃圾收集点及容器干净美观',
    ii008: '垃圾收集容器摆放有序',
    ii009: '垃圾分类设施设置符合要求',
    ii010: '垃圾收集容器密闭套袋',
    ii011: '垃圾收集容器无满溢周边整洁',
    ii012: '建（构）筑物外立面完好整洁',
    ii013: '城市家具完好整洁',
    ii014: '井盖雨篦完好通畅',
    ii015: '无花草枯死、泥土裸露',
    ii016: '无树木死株缺株、危树危枝',
    ii017: '行道树硕大果实及时修剪',
    ii018: '无树木影响其他设施',
    ii019: '绿篱、灌木、地被、草坪等绿化及时修剪',
    ii020: '市政环卫工人着装规范',

    // 公共厕所 (ii021-ii033)
    ii021: '标识规范、干净',
    ii022: '无臭味',
    ii023: '洗手台整洁干净',
    ii024: '水龙头完好干净',
    ii025: '面镜完好干净',
    ii026: '地面完好干净无脏污',
    ii027: '墙壁、天花板、窗户完好干净无脏污',
    ii028: '厕所内整洁干净',
    ii029: '厕门厕位隔断完好干净',
    ii030: '大小便器完好干净',
    ii031: '厕间干净',
    ii032: '冲水设备完好干净',
    ii033: '无障碍设施完好干净',

    // 河道 (ii034-ii047)
    ii034: '无动物尸体',
    ii035: '水域无明显漂浮垃圾',
    ii036: '陆域无明显垃圾',
    ii037: '陆域无零星垃圾',
    ii038: '水边栈道无脏污',
    ii039: '垃圾收集点及容器完好洁净',
    ii040: '垃圾收集点及容器干净美观',
    ii041: '垃圾收集容器摆放有序',
    ii042: '垃圾分类设施设置符合要求',
    ii043: '垃圾收集容器密闭套袋',
    ii044: '垃圾收集容器无满溢周边整洁',
    ii045: '建（构）筑物外立面完好整洁',
    ii046: '城市家具完好整洁',
    ii047: '市政环卫工人着装规范',

    // 环卫作业车 (ii048-ii054)
    ii048: '外观喷绘规范',
    ii049: '车牌清晰完整',
    ii050: '外观部件完好',
    ii051: '车容干净整洁',
    ii052: '垃圾密闭收运',
    ii053: '装载垃圾桶密闭',
    ii054: '驾驶员着装与行为规范',

    // 垃圾转运站 (ii055-ii065)
    ii055: '公示牌整洁',
    ii056: '外观完好整洁',
    ii057: '地面硬底化及维护',
    ii058: '地面干净',
    ii059: '排污沟渠干净通畅',
    ii060: '压缩箱外观完好',
    ii061: '压缩箱外观整洁',
    ii062: '垃圾密闭收运',
    ii063: '压缩箱排污阀正常开启',
    ii064: '除臭设施正常运行',
    ii065: '市政环卫工人着装规范'
  };

  // 辅助函数：创建规则项
  const createRuleItems = (categoryId, indexIdList, scoreLogicList, weightList) => {
    return indexIdList.map((indexId, idx) => ({
      ruleItemId: `${categoryId}_ri_${idx + 1}`,
      name: guideNameMap[indexId] || indexItemList.find(item => item.id === indexId).name,
      indexId: indexId,
      indexName: indexItemList.find(item => item.id === indexId).name,
      scoreLogic: scoreLogicList[idx],
      fullScore: '100',
      weight: weightList[idx], // 权重字段保留
      ruleTypeId: 'rt2',
      ruleTypeName: '扣分'
    }));
  };

  // 1. 市政道路（20项）
  const roadIndexIds = [
    'ii001', 'ii002', 'ii003', 'ii004', 'ii005', 'ii006', 'ii007', 'ii008', 'ii009', 'ii010',
    'ii011', 'ii012', 'ii013', 'ii014', 'ii015', 'ii016', 'ii017', 'ii018', 'ii019', 'ii020'
  ];
  const roadWeights = [2, 0.5, 0.5, 1, 1, 1, 1, 1, 1, 1, 1, 1.5, 1.5, 1, 1, 1, 1, 1, 1, 1];
  const roadScoreLogics = [
    '1 没有-100 ; 2 有1-5处散落垃圾-70 ; 3 有6-9处散落垃圾-40 ; 4 有10处以上散落垃圾-0',
    '1 没有-100 ; 2 有1-5处散落垃圾-70 ; 3 有6-9处散落垃圾-40 ; 4 有10处以上散落垃圾-0',
    '1 没有-100 ; 2 有1-2处-70 ; 3 有3-5处-40 ; 4 有6处以上-0',
    '1 全部见本色-100 ; 2 轻度污染-70 ; 3 中度污染-40 ; 4 严重污染-0',
    '1 没有-100 ; 2 有1-2处-70 ; 3 有3-5处-40 ; 4 有6处以上-0',
    '1 没有-100 ; 2 有1-2处-70 ; 3 有3-5处-40 ; 4 有6处以上-0',
    '1 没有-100 ; 2 有1-2处-70 ; 3 有3-5处-40 ; 4 有6处以上-0',
    '1 没有-100 ; 2 有1-2处-70 ; 3 有3-5处-40 ; 4 有6处以上-0',
    '1 符合-100 ; 2 有缺失-50 ; 3 不符合-0',
    '1 没有-100 ; 2 有1-2处-70 ; 3 有3-5处-40 ; 4 有6处以上-0',
    '1 没有-100 ; 2 有1-2处-70 ; 3 有3-5处-40 ; 4 有6处以上-0',
    '1 没有-100 ; 2 有1-2处-70 ; 3 有3-5处-40 ; 4 有6处以上-0',
    '1 没有-100 ; 2 有1-2处-70 ; 3 有3-5处-40 ; 4 有6处以上-0',
    '1 没有-100 ; 2 有1-2处-70 ; 3 有3-5处-40 ; 4 有6处以上-0',
    '1 没有-100 ; 2 有1-2处-70 ; 3 有3-5处-40 ; 4 有6处以上-0',
    '1 没有-100 ; 2 有1-2处-70 ; 3 有3-5处-40 ; 4 有6处以上-0',
    '1 没有-100 ; 2 有1-2处-70 ; 3 有3-5处-40 ; 4 有6处以上-0',
    '1 没有-100 ; 2 有1-2处-70 ; 3 有3-5处-40 ; 4 有6处以上-0',
    '1 没有-100 ; 2 有1-2处-70 ; 3 有3-5处-40 ; 4 有6处以上-0',
    '1 全部规范着装-100 ; 2 有不规范着装现象-50 ; 3 有不文明着装现象，或有2人或以上不规范着装-0'
  ];
  const roadRuleItems = createRuleItems('rc_municipal_road', roadIndexIds, roadScoreLogics, roadWeights);

  // 2. 公共厕所（13项）
  const toiletIndexIds = [
    'ii021', 'ii022', 'ii023', 'ii024', 'ii025', 'ii026', 'ii027', 'ii028', 'ii029', 'ii030',
    'ii031', 'ii032', 'ii033'
  ];
  const toiletWeights = [1, 2, 0.5, 0.5, 1, 2, 1, 1, 1, 2, 2, 1, 1];
  const toiletScoreLogics = [
    '1 标识规范、干净整洁-100 ; 2 标识规范，但有脏污-70 ; 3 标识不规范，或有缺失-40 ; 4 无标识-0',
    '1 无臭味-100 ; 2 轻微臭味-70 ; 3 明显臭味-40 ; 4 严重臭味-0',
    '1 完好无损，无堵塞、无杂物、无积垢积水-100 ; 2 完好无损、无堵塞，但有轻微水渍、污迹、杂物现象-70 ; 3 有明显破损，或有明显堵塞、杂物、积垢、积水现象-40 ; 4 有严重破损、堵塞、积垢现象-0',
    '1 完好无损且洁净-100 ; 2 完好，但有脏污锈蚀-70 ; 3 有明显损坏或漏水-40 ; 4 都损坏或都无法使用-0',
    '1 完好无损，表面干净整洁-100 ; 2 完好无损，但有轻微水渍或污迹-70 ; 3 有明显破损或脏污-40 ; 4 无面镜或有严重破损-0',
    '1 完好无损，无脏污、无积垢积水-100 ; 2 完好无损，但有轻微水渍、污迹现象-70 ; 3 有明显破损、坑洼，或有明显脏污、积垢积水现象-40 ; 4 有严重破损、坑洼，或有严重脏污、积垢积水现象-0',
    '1 完好无损，无脏污、无乱张贴涂画、无蛛网-100 ; 2 完好无损，但有轻微积尘、蛛网、污迹现象-70 ; 3 有明显破损、掉漆、瓷砖剥落，或有明显脏污、乱张贴涂画-40 ; 4 有严重破损、脏污、乱张贴涂画现象-0',
    '1 清洁工具摆放整齐，无乱堆放、无乱挂晒-100 ; 2 清洁工具摆放整齐，但有洗手台、搁物板、挂钩等乱挂乱放小物件现象-50 ; 3 有乱堆放或乱挂晒现象-0',
    '1 完好无损，无脏污、无乱张贴涂画-100 ; 2 完好无损，但有轻微水渍、污迹现象-70 ; 3 有明显破损、脏污、乱张贴涂画现象-40 ; 4 有严重脏污、乱张贴涂画现象-0',
    '1 完好无损，无堵塞、无脏污、无积垢、釉面干净-100 ; 2 完好、无堵塞，但有轻微污迹、杂物现象-70 ; 3 个别（≤1/2）有明显破损、堵塞、脏污、积垢现象-40 ; 4 半数以上（>1/2）有明显破损、堵塞、脏污、积垢现象，或有污物堆积、溢流现象-0',
    '1 厕间地面干净，无垃圾、无脏污、无积水，垃圾桶内垃圾不超过2/3-100 ; 2 厕间地面有轻微水渍、污迹现象，或垃圾桶内垃圾超过2/3但不满溢-70 ; 3 厕间地面有明显垃圾、脏污或积水现象-40 ; 4 厕间地面有严重脏污或积水现象，或垃圾桶满溢-0',
    '1 完好无损，正常使用-100 ; 2 个别（≤1/2）冲水设备有明显破损或漏水，或无法正常使用-50 ; 3 无自动或半自动冲水设备，或半数以上（>1/2）冲水设备无法正常使用-0',
    '1 无障碍通道、无障碍厕间（厕位）设施均完好整洁，无脏污、无积垢积水-100 ; 2 无障碍通道、无障碍厕间（厕位）设施完好无损，但有轻微水渍、污迹现象-70 ; 3 无障碍通道、无障碍厕间（厕位）设施有明显破损、坑洼，或有明显脏污、积垢积水现象-40 ; 4 无障碍通道、无障碍厕间（厕位）设施有严重破损、坑洼，或有严重脏污、积垢积水现象，或者无无障碍厕间（厕位）-0'
  ];
  const toiletRuleItems = createRuleItems('rc_public_toilet', toiletIndexIds, toiletScoreLogics, toiletWeights);

  // 3. 公共服务机构周边（与道路相同，复用指标和评分逻辑）
  const serviceRuleItems = createRuleItems('rc_service', roadIndexIds, roadScoreLogics, roadWeights);

  // 4. 商业街（与道路相同）
  const commercialRuleItems = createRuleItems('rc_commercial', roadIndexIds, roadScoreLogics, roadWeights);

  // 5. 公园（与道路相同）
  const parkRuleItems = createRuleItems('rc_park', roadIndexIds, roadScoreLogics, roadWeights);

  // 6. 城中村（与道路相同）
  const villageRuleItems = createRuleItems('rc_village', roadIndexIds, roadScoreLogics, roadWeights);

  // 7. 集贸市场周边（与道路相同）
  const marketRuleItems = createRuleItems('rc_market', roadIndexIds, roadScoreLogics, roadWeights);

  // 8. 河道（14项）
  const riverIndexIds = [
    'ii034', 'ii035', 'ii036', 'ii037', 'ii038', 'ii039', 'ii040', 'ii041', 'ii042', 'ii043',
    'ii044', 'ii045', 'ii046', 'ii047'
  ];
  const riverWeights = [1.5, 1.5, 1, 0.5, 1.5, 1, 1, 1, 1, 1, 1, 1.5, 1.5, 1];
  const riverScoreLogics = [
    '1 没有-100 ; 2 有1处-70 ; 3 有2处-40 ; 4 有3处以上-0',
    '1 没有-100 ; 2 有1-5处-70 ; 3 有6-9处-40 ; 4 有10处以上-0',
    '1 没有-100 ; 2 有1-5处-70 ; 3 有6-9处-40 ; 4 有10处以上-0',
    '1 没有-100 ; 2 有1-5处-70 ; 3 有6-9处-40 ; 4 有10处以上-0',
    '1 没有-100 ; 2 有1-2处-70 ; 3 有3-5处-40 ; 4 有6处以上-0',
    '1 没有-100 ; 2 有1-2处-70 ; 3 有3-5处-40 ; 4 有6处以上-0',
    '1 没有-100 ; 2 有1-2处-70 ; 3 有3-5处-40 ; 4 有6处以上-0',
    '1 没有-100 ; 2 有1-2处-70 ; 3 有3-5处-40 ; 4 有6处以上-0',
    '1 符合-100 ; 2 有缺失-50 ; 3 不符合-0',
    '1 没有-100 ; 2 有1-2处-70 ; 3 有3-5处-40 ; 4 有6处以上-0',
    '1 没有-100 ; 2 有1-2处-70 ; 3 有3-5处-40 ; 4 有6处以上-0',
    '1 没有-100 ; 2 有1-2处-70 ; 3 有3-5处-40 ; 4 有6处以上-0',
    '1 没有-100 ; 2 有1-2处-70 ; 3 有3-5处-40 ; 4 有6处以上-0',
    '1 全部规范着装-100 ; 2 有不规范着装现象-50 ; 3 有不文明着装现象，或有2人或以上不规范着装-0'
  ];
  const riverRuleItems = createRuleItems('rc_river', riverIndexIds, riverScoreLogics, riverWeights);

  // 9.1 环卫作业车（镇街）（7项）
  const truckIndexIds = ['ii048', 'ii049', 'ii050', 'ii051', 'ii052', 'ii053', 'ii054'];
  const truckWeights = [1, 1, 1, 1, 2, 1, 1];
  const truckScoreLogics = [
    '1 统一规范喷绘-100 ; 2 统一喷绘但不规范-50 ; 3 未统一喷绘-0',
    '1 前后号牌清晰完整-100 ; 2 前后号牌完整，但有1个号牌不清晰-50 ; 3 无号牌，或前后号牌都不清晰-0',
    '1 没有-100 ; 2 有1-2处-70 ; 3 有3-5处-40 ; 4 有6处以上-0',
    '1 没有-100 ; 2 有1-2处-70 ; 3 有3-5处-40 ; 4 有6处以上，或1平方米以上-0',
    '1 密闭良好-100 ; 2 密闭不严-50 ; 3 未密闭收运，或跑冒滴漏-0',
    '1 密闭良好-100 ; 2 密闭不严-50 ; 3 未密闭收运，或垃圾满溢-0',
    '1 全部规范着装且文明作业-100 ; 2 有不规范着装现象-50 ; 3 有违规、不文明作业现象，或有2人或以上不规范着装-0'
  ];
  const truckTownRuleItems = createRuleItems('rc_truck_town', truckIndexIds, truckScoreLogics, truckWeights);

  // 9.2 环卫作业车（区局）（与镇街相同）
  const truckDistrictRuleItems = createRuleItems('rc_truck_district', truckIndexIds, truckScoreLogics, truckWeights);

  // 10. 垃圾转运站（11项）
  const stationIndexIds = [
    'ii055', 'ii056', 'ii057', 'ii058', 'ii059', 'ii060', 'ii061', 'ii062', 'ii063', 'ii064',
    'ii065'
  ];
  const stationWeights = [1, 1, 1, 2, 1, 1, 2, 2, 1, 1, 1];
  const stationScoreLogics = [
    '1 完好整洁-100 ; 2 局部污损-50 ; 3 严重污损或无公示牌-0',
    '1 没有-100 ; 2 有1-2处-70 ; 3 有3-5处-40 ; 4 有6处以上，或露天摆放压缩箱-0',
    '1 完好平整-100 ; 2 局部开裂-70 ; 3 明显破损坑洼-40 ; 4 严重破损坑洼，或1平方米以上-0',
    '1 没有-100 ; 2 有1-2处-70 ; 3 有3-5处-40 ; 4 有6处以上-0',
    '1 干净通畅-100 ; 2 有少量垃圾杂物-70 ; 3 有垃圾杂物堵塞或明显积水污泥-40 ; 4 完全堵塞或无排污沟渠，污水溢流-0',
    '1 没有-100 ; 2 有1-2处-50 ; 3 有3处以上，或1平方米以上-0',
    '1 没有-100 ; 2 有1-2处-70 ; 3 有3-5处-40 ; 4 有6处以上-0',
    '1 密闭良好-100 ; 2 密闭不严-50 ; 3 未密闭收运，或跑冒滴漏-0',
    '1 开启并接管密闭-100 ; 2 开启但未接管或未密闭-50 ; 3 排污阀未开启-0',
    '1 正常运行-100 ; 2 有除臭设施但未运行-50 ; 3 无除臭设施-0',
    '1 全部规范着装-100 ; 2 有不规范着装现象-50 ; 3 有违规、不文明作业现象，或有2人或以上不规范着装-0'
  ];
  const stationRuleItems = createRuleItems('rc_station', stationIndexIds, stationScoreLogics, stationWeights);

  // 构建所有规则分类（去掉否决项相关字段）
  const categories = [
    {
      ruleCategoryId: 'rc_municipal_road',
      name: '市政道路',
      systemId: 'is_hy',
      systemName: '环卫园林一体化考核体系',
      itemCount: roadRuleItems.length,
      statusId: 's1',
      statusName: '启用',
      createBy: 'u1',
      createByName: '张三',
      createTime,
      updateBy: 'u1',
      updateByName: '张三',
      updateTime,
      lastUseTime: '',
      useCount: 0,
      changeLog: '初始化导入',
      ruleItems: roadRuleItems
    },
    {
      ruleCategoryId: 'rc_public_toilet',
      name: '公共厕所',
      systemId: 'is_hy',
      systemName: '环卫园林一体化考核体系',
      itemCount: toiletRuleItems.length,
      statusId: 's1',
      statusName: '启用',
      createBy: 'u1',
      createByName: '张三',
      createTime,
      updateBy: 'u1',
      updateByName: '张三',
      updateTime,
      lastUseTime: '',
      useCount: 0,
      changeLog: '初始化导入',
      ruleItems: toiletRuleItems
    },
    {
      ruleCategoryId: 'rc_service',
      name: '公共服务机构周边',
      systemId: 'is_hy',
      systemName: '环卫园林一体化考核体系',
      itemCount: serviceRuleItems.length,
      statusId: 's1',
      statusName: '启用',
      createBy: 'u1',
      createByName: '张三',
      createTime,
      updateBy: 'u1',
      updateByName: '张三',
      updateTime,
      lastUseTime: '',
      useCount: 0,
      changeLog: '初始化导入',
      ruleItems: serviceRuleItems
    },
    {
      ruleCategoryId: 'rc_commercial',
      name: '商业街',
      systemId: 'is_hy',
      systemName: '环卫园林一体化考核体系',
      itemCount: commercialRuleItems.length,
      statusId: 's1',
      statusName: '启用',
      createBy: 'u1',
      createByName: '张三',
      createTime,
      updateBy: 'u1',
      updateByName: '张三',
      updateTime,
      lastUseTime: '',
      useCount: 0,
      changeLog: '初始化导入',
      ruleItems: commercialRuleItems
    },
    {
      ruleCategoryId: 'rc_park',
      name: '公园',
      systemId: 'is_hy',
      systemName: '环卫园林一体化考核体系',
      itemCount: parkRuleItems.length,
      statusId: 's1',
      statusName: '启用',
      createBy: 'u1',
      createByName: '张三',
      createTime,
      updateBy: 'u1',
      updateByName: '张三',
      updateTime,
      lastUseTime: '',
      useCount: 0,
      changeLog: '初始化导入',
      ruleItems: parkRuleItems
    },
    {
      ruleCategoryId: 'rc_village',
      name: '城中村',
      systemId: 'is_hy',
      systemName: '环卫园林一体化考核体系',
      itemCount: villageRuleItems.length,
      statusId: 's1',
      statusName: '启用',
      createBy: 'u1',
      createByName: '张三',
      createTime,
      updateBy: 'u1',
      updateByName: '张三',
      updateTime,
      lastUseTime: '',
      useCount: 0,
      changeLog: '初始化导入',
      ruleItems: villageRuleItems
    },
    {
      ruleCategoryId: 'rc_market',
      name: '集贸市场周边',
      systemId: 'is_hy',
      systemName: '环卫园林一体化考核体系',
      itemCount: marketRuleItems.length,
      statusId: 's1',
      statusName: '启用',
      createBy: 'u1',
      createByName: '张三',
      createTime,
      updateBy: 'u1',
      updateByName: '张三',
      updateTime,
      lastUseTime: '',
      useCount: 0,
      changeLog: '初始化导入',
      ruleItems: marketRuleItems
    },
    {
      ruleCategoryId: 'rc_river',
      name: '河道',
      systemId: 'is_hy',
      systemName: '环卫园林一体化考核体系',
      itemCount: riverRuleItems.length,
      statusId: 's1',
      statusName: '启用',
      createBy: 'u1',
      createByName: '张三',
      createTime,
      updateBy: 'u1',
      updateByName: '张三',
      updateTime,
      lastUseTime: '',
      useCount: 0,
      changeLog: '初始化导入',
      ruleItems: riverRuleItems
    },
    {
      ruleCategoryId: 'rc_truck_town',
      name: '环卫作业车（镇街）',
      systemId: 'is_hy',
      systemName: '环卫园林一体化考核体系',
      itemCount: truckTownRuleItems.length,
      statusId: 's1',
      statusName: '启用',
      createBy: 'u1',
      createByName: '张三',
      createTime,
      updateBy: 'u1',
      updateByName: '张三',
      updateTime,
      lastUseTime: '',
      useCount: 0,
      changeLog: '初始化导入',
      ruleItems: truckTownRuleItems
    },
    {
      ruleCategoryId: 'rc_truck_district',
      name: '环卫作业车（区局）',
      systemId: 'is_hy',
      systemName: '环卫园林一体化考核体系',
      itemCount: truckDistrictRuleItems.length,
      statusId: 's1',
      statusName: '启用',
      createBy: 'u1',
      createByName: '张三',
      createTime,
      updateBy: 'u1',
      updateByName: '张三',
      updateTime,
      lastUseTime: '',
      useCount: 0,
      changeLog: '初始化导入',
      ruleItems: truckDistrictRuleItems
    },
    {
      ruleCategoryId: 'rc_station',
      name: '垃圾转运站',
      systemId: 'is_hy',
      systemName: '环卫园林一体化考核体系',
      itemCount: stationRuleItems.length,
      statusId: 's1',
      statusName: '启用',
      createBy: 'u1',
      createByName: '张三',
      createTime,
      updateBy: 'u1',
      updateByName: '张三',
      updateTime,
      lastUseTime: '',
      useCount: 0,
      changeLog: '初始化导入',
      ruleItems: stationRuleItems
    }
  ];

  return categories;
};

/** 表单配置（新增/编辑规则分类）保持不变 */
export function useFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '规则分类名称',
      component: 'Input',
      componentProps: { placeholder: '请输入规则分类名称' },
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

/** 规则项表单配置（增加权重字段） */
export function useRuleItemFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '规则项名称',
      component: 'Input',
      componentProps: { placeholder: '请输入规则项名称' },
      rules: 'required'
    },
    {
      fieldName: 'indexId',
      label: '关联指标项',
      component: 'Select',
      componentProps: {
        placeholder: '请选择关联指标项',
        options: indexItemList.map(i => ({ label: i.name, value: i.id }))
      },
      rules: 'required'
    },
    {
      fieldName: 'scoreLogic',
      label: '评分逻辑',
      component: 'Input',
      componentProps: { type: 'textarea', placeholder: '请输入评分逻辑' },
      rules: 'required'
    },
    {
      fieldName: 'fullScore',
      label: '满分值',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入满分值', min: 0, step: 0.1 },
      rules: 'required'
    },
    {
      fieldName: 'weight',
      label: '权重',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入权重', min: 0, step: 0.1 },
      rules: 'required'
    },
    {
      fieldName: 'ruleTypeId',
      label: '规则类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择规则类型',
        options: ruleTypeList.map(r => ({ label: r.name, value: r.id }))
      },
      rules: 'required'
    }
  ];
}

// 否决项表单配置已删除

/** 根据标签页获取表格列配置（删除否决项数量列） */
export function getGridColumnsByTab(tab) {
  const baseColumns = [
    { type: 'checkbox', width: 40, visible: tab === '全部' }
  ];

  const commonColumns = [
    {
      field: 'name',
      title: '规则分类名称',
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

  const allExtraColumns = [
    {
      field: 'itemCount',
      title: '规则项数量',
      minWidth: 120,
      sortable: true
    },
    // 删除了 vetoCount 列
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
      field: 'changeLog',
      title: '变更日志',
      minWidth: 200,
      sortable: false,
      formatter: (row) => row.changeLog?.substring(0, 50) + (row.changeLog?.length > 50 ? '...' : '')
    }
  ];

  const enableExtraColumns = [
    {
      field: 'itemCount',
      title: '规则项数量',
      minWidth: 120,
      sortable: true
    },
    // 删除了 vetoCount 列
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
      title: '规则项数量',
      minWidth: 120,
      sortable: true
    },
    // 删除了 vetoCount 列
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
  editText: '编辑规则分类',
  addText: '新增规则分类',
  addRuleItemText: '新增规则项',
  excelName: '评价规则列表',
  excelAllName: '评价规则数据.xlsx',
  total: '总计：规则分类总数11；启用规则分类11；停用规则分类0',
};
