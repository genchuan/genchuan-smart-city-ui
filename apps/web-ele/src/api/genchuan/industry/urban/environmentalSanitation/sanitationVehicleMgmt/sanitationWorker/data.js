// 模拟环卫人员管理数据
export const dataList = () => {
  return [
    // ---------- 全部（人员基础信息）id1-id3 ----------
    {
      id: '1',
      toiletName: '张三',
      location: '保洁员',
      area: '芗城区-巷口街道',
      openHours: '2024-01-15',
      stallCount: 120,              // 累计考勤天数
      status: '在岗',
      manager: '李组长',
      cleaningRate: 92.5,           // 平均考核得分
      complaintRate: 98.5,          // 作业完成率(%)
      warningCount: 2,              // 未完成任务数
      facilityRate: 100,            // 全勤率(%)
      phone: '138****1122',
      entryTime: '2024-01-15',
    },
    {
      id: '2',
      toiletName: '李四',
      location: '清运工',
      area: '龙文区-碧湖街道',
      openHours: '2024-02-20',
      stallCount: 115,
      status: '在岗',
      manager: '王组长',
      cleaningRate: 88.0,
      complaintRate: 96.0,
      warningCount: 1,
      facilityRate: 98,
      phone: '139****3344',
      entryTime: '2024-02-20',
    },
    {
      id: '3',
      toiletName: '王五',
      location: '巡查员',
      area: '龙海区-石码镇',
      openHours: '2024-03-10',
      stallCount: 98,
      status: '休假',
      manager: '赵组长',
      cleaningRate: 95.0,
      complaintRate: 100,
      warningCount: 0,
      facilityRate: 95,
      phone: '137****5566',
      entryTime: '2024-03-10',
    },

    // ---------- 待排班 id4-id6 ----------
    {
      id: '4',
      toiletName: '赵六',
      location: '保洁员',
      area: '芗城区-巷口街道',
      openHours: '一班',               // 所属班组
      stallCount: '每日',              // 排班周期
      status: '待排班',
      manager: '李组长',
      cleaningRate: 90.0,
      complaintRate: 95.0,
      warningCount: 0,
      facilityRate: 100,
      // 待排班特有字段
      cleaningTime: '06:00-14:00',      // 作业时段
      dispatchStatus: '待排班',          // 排班状态
      handler: null,                    // 换班申请状态（无）
      swapApplyCount: 0,                // 换班申请数
      createBy: 'admin',
      createTime: '2026-03-01 08:00:00',
      updateTime: '2026-03-01 08:00:00',
      isEffective: true,
    },
    {
      id: '5',
      toiletName: '孙七',
      location: '清运工',
      area: '龙文区-碧湖街道',
      openHours: '二班',
      stallCount: '每周',
      status: '待排班',
      manager: '王组长',
      cleaningRate: 92.0,
      complaintRate: 97.0,
      warningCount: 1,
      facilityRate: 98,
      cleaningTime: '08:00-12:00,14:00-18:00',
      dispatchStatus: '已排班',
      handler: '待审核',                 // 换班申请状态
      swapApplyCount: 1,
      createBy: 'admin',
      createTime: '2026-03-01 09:30:00',
      updateTime: '2026-03-01 09:30:00',
      isEffective: true,
    },
    {
      id: '6',
      toiletName: '周八',
      location: '巡查员',
      area: '龙海区-石码镇',
      openHours: '三班',
      stallCount: '每月',
      status: '待排班',
      manager: '赵组长',
      cleaningRate: 96.0,
      complaintRate: 100,
      warningCount: 0,
      facilityRate: 100,
      cleaningTime: '07:00-15:00',
      dispatchStatus: '待排班',
      handler: null,
      swapApplyCount: 0,
      createBy: 'admin',
      createTime: '2026-03-01 10:00:00',
      updateTime: '2026-03-01 10:00:00',
      isEffective: true,
    },

    // ---------- 待考勤 id7-id9 ----------
    {
      id: '7',
      toiletName: '郑九',
      location: '保洁员',
      area: '芗城区-巷口街道',
      openHours: '一班',
      stallCount: '2026-03-01',          // 打卡日期
      status: '待考勤',
      manager: '李组长',
      cleaningRate: 0,                    // 考勤时长(小时)
      complaintRate: 0,                   // 异常类型（无）
      warningCount: 0,                   // 异常说明（空）
      facilityRate: 0,                   // 审核状态（待审核）
      // 待考勤特有字段
      cleaningTime: '08:05:00',           // 到岗打卡时间
      cleaningContent: '18:00:00',        // 离岗打卡时间
      cleaner: '正常打卡',                // 打卡状态
      photoUrl: '公园东门',               // 打卡位置
      repairBy: null,                    // 异常类型（复用）
      repairStatus: '待审核',             // 审核状态
      createBy: 'admin',
      createTime: '2026-03-01 18:05:00',
      updateTime: '2026-03-01 18:05:00',
      isEffective: true,
    },
    {
      id: '8',
      toiletName: '吴十',
      location: '清运工',
      area: '龙文区-碧湖街道',
      openHours: '二班',
      stallCount: '2026-03-01',
      status: '待考勤',
      manager: '王组长',
      cleaningRate: 7.5,                  // 考勤时长(小时)
      complaintRate: 1,                   // 异常类型代码（迟到）
      warningCount: 0,
      facilityRate: 1,                    // 审核状态（待审核）
      cleaningTime: '08:30:00',
      cleaningContent: '17:00:00',
      cleaner: '异常打卡',
      photoUrl: '迎宾路',
      repairBy: '迟到',
      repairStatus: '待审核',
      createBy: 'admin',
      createTime: '2026-03-01 17:05:00',
      updateTime: '2026-03-01 17:05:00',
      isEffective: true,
    },
    {
      id: '9',
      toiletName: '钱十一',
      location: '巡查员',
      area: '龙海区-石码镇',
      openHours: '三班',
      stallCount: '2026-03-01',
      status: '待考勤',
      manager: '赵组长',
      cleaningRate: 8.0,
      complaintRate: 0,
      warningCount: 0,
      facilityRate: 2,                    // 审核状态（已通过）
      cleaningTime: '07:00:00',
      cleaningContent: '16:00:00',
      cleaner: '正常打卡',
      photoUrl: '石码街',
      repairBy: null,
      repairStatus: '已通过',
      createBy: 'admin',
      createTime: '2026-03-01 16:05:00',
      updateTime: '2026-03-01 16:05:00',
      isEffective: true,
    },

    // ---------- 考核待审核 id10-id12 ----------
    {
      id: '10',
      toiletName: '陈十二',
      location: '保洁员',
      area: '芗城区-巷口街道',
      openHours: '一班',
      stallCount: '2026年2月',            // 考核周期
      status: '考核待审核',
      manager: '李组长',
      cleaningRate: 85,                   // 考勤得分
      complaintRate: 90,                  // 作业质量得分
      warningCount: 88,                  // 问题处置得分
      facilityRate: 87.5,                // 初始总分
      // 考核待审核特有字段
      proofUrl: 'http://example.com/proof1.jpg',
      repairBy: '赵审核员',               // 考核人员
      reportTime: '2026-03-01 10:30:00',  // 审核时间（空，待审核）
      repairStatus: '待审核',              // 最终总分（空）
      expectedCompleteTime: null,         // 考核等级（空）
      damageDesc: '需复核',               // 考核意见（截取）
      teamPassRate: 85.0,                // 班组考核通过率
      createBy: 'admin',
      createTime: '2026-03-01 09:00:00',
      updateTime: '2026-03-01 09:00:00',
      isEffective: true,
    },
    {
      id: '11',
      toiletName: '林十三',
      location: '清运工',
      area: '龙文区-碧湖街道',
      openHours: '二班',
      stallCount: '2026年2月',
      status: '考核待审核',
      manager: '王组长',
      cleaningRate: 90,
      complaintRate: 88,
      warningCount: 85,
      facilityRate: 87.0,
      proofUrl: 'http://example.com/proof2.jpg',
      repairBy: '钱审核员',
      reportTime: '2026-03-01 11:20:00',
      repairStatus: '已审核',
      expectedCompleteTime: '92',          // 最终总分
      damageDesc: '合格',
      teamPassRate: 90.0,
      createBy: 'admin',
      createTime: '2026-03-01 10:00:00',
      updateTime: '2026-03-01 11:20:00',
      isEffective: true,
    },
    {
      id: '12',
      toiletName: '黄十四',
      location: '巡查员',
      area: '龙海区-石码镇',
      openHours: '三班',
      stallCount: '2026年2月',
      status: '考核待审核',
      manager: '赵组长',
      cleaningRate: 95,
      complaintRate: 96,
      warningCount: 94,
      facilityRate: 95.0,
      proofUrl: 'http://example.com/proof3.jpg',
      repairBy: '孙审核员',
      reportTime: '2026-03-01 09:45:00',
      repairStatus: '待审核',
      expectedCompleteTime: null,
      damageDesc: '',
      teamPassRate: 88.0,
      createBy: 'admin',
      createTime: '2026-03-01 08:30:00',
      updateTime: '2026-03-01 08:30:00',
      isEffective: true,
    },

    // ---------- 已完成 id13-id15 ----------
    {
      id: '13',
      toiletName: '刘十五',
      location: '保洁员',
      area: '芗城区-巷口街道',
      openHours: '一班',
      stallCount: 0,
      status: '已完成',
      manager: '李组长',
      cleaningRate: 100,                // 班组考勤率(%)
      complaintRate: 92.5,              // 平均考核分
      warningCount: 30,                // 优秀人员占比(%)
      facilityRate: 0,
      // 已完成特有字段
      taskType: '排班',
      completeTime: '2026-03-01 14:00:00',
      handler: '李组长',
      handleResult: '已完成',
      proofUrl: 'http://example.com/schedule.jpg',
      handleDuration: '2小时',
      satisfaction: 88,                 // 综合管理评分
      statPeriod: '2026-03-01',
      createBy: 'admin',
      createTime: '2026-03-01 08:00:00',
      updateTime: '2026-03-01 14:00:00',
      isEffective: true,
    },
    {
      id: '14',
      toiletName: '赵十六',
      location: '清运工',
      area: '龙文区-碧湖街道',
      openHours: '二班',
      stallCount: 0,
      status: '已完成',
      manager: '王组长',
      cleaningRate: 98,
      complaintRate: 89.0,
      warningCount: 25,
      facilityRate: 0,
      taskType: '考勤',
      completeTime: '2026-03-01 16:30:00',
      handler: '王组长',
      handleResult: '已审核',
      proofUrl: 'http://example.com/attendance.jpg',
      handleDuration: '1小时',
      satisfaction: 90,
      statPeriod: '2026-03-01',
      createBy: 'admin',
      createTime: '2026-03-01 09:00:00',
      updateTime: '2026-03-01 16:30:00',
      isEffective: true,
    },
    {
      id: '15',
      toiletName: '周十七',
      location: '巡查员',
      area: '龙海区-石码镇',
      openHours: '三班',
      stallCount: 0,
      status: '已完成',
      manager: '赵组长',
      cleaningRate: 95,
      complaintRate: 96.0,
      warningCount: 20,
      facilityRate: 0,
      taskType: '考核',
      completeTime: '2026-03-01 17:00:00',
      handler: '赵组长',
      handleResult: '已归档',
      proofUrl: 'http://example.com/assessment.jpg',
      handleDuration: '3小时',
      satisfaction: 92,
      statPeriod: '2026-03-01',
      createBy: 'admin',
      createTime: '2026-03-01 08:30:00',
      updateTime: '2026-03-01 17:00:00',
      isEffective: true,
    },
  ];
};
