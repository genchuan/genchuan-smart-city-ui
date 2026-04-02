/** 表格初始数据 - 改造为季度渣土清运管理统计分析数据 */
export const dataList = () => [
  {
    areaName: '鼓楼区',
    quarterlyClearanceTotal: 12500,           // 季度清运总量(吨)
    illegalCaseDisposalRate: 98.5,            // 季度违规案件处置率(%)
    complianceRank: 2,                        // 季度清运企业合规率排名
    lawEnforcementEffectiveness: 94.2,        // 季度卡点执法成效(%)
    disposalSiteUsage: 4860,                  // 季度渣土消纳场使用量(吨)
    qoq_ClearanceTotal: 5.8,                  // 清运总量环比(%)
    yoy_ClearanceTotal: 12.3,                 // 清运总量同比(%)
    qoq_DisposalRate: 1.2,                   // 处置率环比(百分点)
    yoy_DisposalRate: 2.5,                   // 处置率同比(百分点)
    qoq_ComplianceRank: 0,                   // 合规率排名环比(变化名次，正为上升)
    yoy_ComplianceRank: 1,                   // 合规率排名同比(变化名次)
    qoq_EnforcementEffectiveness: 3.4,       // 执法成效环比(百分点)
    yoy_EnforcementEffectiveness: 5.1,       // 执法成效同比(百分点)
    qoq_DisposalSiteUsage: -2.3,             // 消纳场使用量环比(%)
    yoy_DisposalSiteUsage: 8.7,              // 消纳场使用量同比(%)
    detailByRegion: '鼓楼区:12500吨；台江区:8700吨；仓山区:11200吨；晋安区:7600吨；马尾区:4200吨',
    detailByHaulageCompany: '建发渣土:4850吨；城投运输:3920吨；市政清运:2780吨；环境集团:950吨',
    detailByDisposalSite: '北峰消纳场:6120吨；南屿消纳场:3840吨；东台消纳场:2540吨',
    detailByViolationType: '未密闭运输:23起；乱倒渣土:12起；无证清运:8起；路线违规:5起',
    detailByRegionQoq: '鼓楼区:+6.2%；台江区:+3.5%；仓山区:+8.1%；晋安区:-1.2%；马尾区:+15.3%',
    detailByRegionYoy: '鼓楼区:+14.5%；台江区:+9.8%；仓山区:+18.2%；晋安区:+2.1%；马尾区:+22.6%',
    detailByCompanyQoq: '建发渣土:+4.5%；城投运输:+2.1%；市政清运:+1.8%；环境集团:+11.2%',
    detailByCompanyYoy: '建发渣土:+13.2%；城投运输:+7.5%；市政清运:+5.9%；环境集团:+19.4%',
    detailByDisposalSiteQoq: '北峰消纳场:-3.2%；南屿消纳场:+5.4%；东台消纳场:+2.1%',
    detailByDisposalSiteYoy: '北峰消纳场:+9.5%；南屿消纳场:+15.3%；东台消纳场:+6.8%',
    detailByViolationQoq: '未密闭运输:-15.2%；乱倒渣土:-8.3%；无证清运:-12.5%；路线违规:+5.6%',
    detailByViolationYoy: '未密闭运输:-25.6%；乱倒渣土:-18.7%；无证清运:-22.1%；路线违规:-3.2%'
  },
  {
    areaName: '台江区',
    quarterlyClearanceTotal: 8700,
    illegalCaseDisposalRate: 97.2,
    complianceRank: 3,
    lawEnforcementEffectiveness: 91.5,
    disposalSiteUsage: 3250,
    qoq_ClearanceTotal: 3.5,
    yoy_ClearanceTotal: 9.8,
    qoq_DisposalRate: 0.8,
    yoy_DisposalRate: 1.6,
    qoq_ComplianceRank: -1,
    yoy_ComplianceRank: 0,
    qoq_EnforcementEffectiveness: 2.1,
    yoy_EnforcementEffectiveness: 4.3,
    qoq_DisposalSiteUsage: 1.5,
    yoy_DisposalSiteUsage: 6.2,
    detailByRegion: '台江区:8700吨；鼓楼区:12500吨；仓山区:11200吨；晋安区:7600吨；马尾区:4200吨',
    detailByHaulageCompany: '建发渣土:3120吨；城投运输:2580吨；市政清运:1850吨；环境集团:1150吨',
    detailByDisposalSite: '北峰消纳场:1950吨；南屿消纳场:860吨；东台消纳场:440吨',
    detailByViolationType: '未密闭运输:18起；乱倒渣土:9起；无证清运:6起；路线违规:4起',
    detailByRegionQoq: '台江区:+3.5%；鼓楼区:+6.2%；仓山区:+8.1%；晋安区:-1.2%；马尾区:+15.3%',
    detailByRegionYoy: '台江区:+9.8%；鼓楼区:+14.5%；仓山区:+18.2%；晋安区:+2.1%；马尾区:+22.6%',
    detailByCompanyQoq: '建发渣土:+2.3%；城投运输:+1.5%；市政清运:-0.8%；环境集团:+8.5%',
    detailByCompanyYoy: '建发渣土:+8.6%；城投运输:+5.2%；市政清运:+3.1%；环境集团:+14.7%',
    detailByDisposalSiteQoq: '北峰消纳场:+0.5%；南屿消纳场:+2.8%；东台消纳场:+1.2%',
    detailByDisposalSiteYoy: '北峰消纳场:+5.3%；南屿消纳场:+9.6%；东台消纳场:+4.1%',
    detailByViolationQoq: '未密闭运输:-10.5%；乱倒渣土:-5.2%；无证清运:-8.3%；路线违规:+2.1%',
    detailByViolationYoy: '未密闭运输:-18.3%；乱倒渣土:-12.4%；无证清运:-15.6%；路线违规:-1.5%'
  },
  {
    areaName: '仓山区',
    quarterlyClearanceTotal: 11200,
    illegalCaseDisposalRate: 99.1,
    complianceRank: 1,
    lawEnforcementEffectiveness: 96.8,
    disposalSiteUsage: 4680,
    qoq_ClearanceTotal: 8.1,
    yoy_ClearanceTotal: 18.2,
    qoq_DisposalRate: 1.5,
    yoy_DisposalRate: 3.2,
    qoq_ComplianceRank: 1,
    yoy_ComplianceRank: 2,
    qoq_EnforcementEffectiveness: 4.2,
    yoy_EnforcementEffectiveness: 6.8,
    qoq_DisposalSiteUsage: 5.2,
    yoy_DisposalSiteUsage: 13.5,
    detailByRegion: '仓山区:11200吨；晋安区:7600吨；马尾区:4200吨；长乐区:5800吨；福清市:4900吨',
    detailByHaulageCompany: '建发渣土:4380吨；城投运输:3210吨；市政清运:2450吨；环境集团:1160吨',
    detailByDisposalSite: '北峰消纳场:2540吨；南屿消纳场:1480吨；东台消纳场:660吨',
    detailByViolationType: '未密闭运输:15起；乱倒渣土:6起；无证清运:4起；路线违规:3起',
    detailByRegionQoq: '仓山区:+8.1%；晋安区:-1.2%；马尾区:+15.3%；长乐区:+6.5%；福清市:+2.3%',
    detailByRegionYoy: '仓山区:+18.2%；晋安区:+2.1%；马尾区:+22.6%；长乐区:+10.8%；福清市:+5.6%',
    detailByCompanyQoq: '建发渣土:+6.5%；城投运输:+3.8%；市政清运:+4.2%；环境集团:+14.1%',
    detailByCompanyYoy: '建发渣土:+15.6%；城投运输:+9.3%；市政清运:+8.7%；环境集团:+21.5%',
    detailByDisposalSiteQoq: '北峰消纳场:+3.2%；南屿消纳场:+7.1%；东台消纳场:+2.5%',
    detailByDisposalSiteYoy: '北峰消纳场:+11.8%；南屿消纳场:+18.5%；东台消纳场:+7.2%',
    detailByViolationQoq: '未密闭运输:-18.3%；乱倒渣土:-12.8%；无证清运:-15.6%；路线违规:-1.8%',
    detailByViolationYoy: '未密闭运输:-28.5%；乱倒渣土:-22.1%；无证清运:-26.3%；路线违规:-8.5%'
  },
  {
    areaName: '晋安区',
    quarterlyClearanceTotal: 7600,
    illegalCaseDisposalRate: 96.5,
    complianceRank: 4,
    lawEnforcementEffectiveness: 89.3,
    disposalSiteUsage: 2890,
    qoq_ClearanceTotal: -1.2,
    yoy_ClearanceTotal: 2.1,
    qoq_DisposalRate: -0.5,
    yoy_DisposalRate: 0.8,
    qoq_ComplianceRank: -2,
    yoy_ComplianceRank: -1,
    qoq_EnforcementEffectiveness: -1.2,
    yoy_EnforcementEffectiveness: 1.5,
    qoq_DisposalSiteUsage: -3.8,
    yoy_DisposalSiteUsage: 3.2,
    detailByRegion: '晋安区:7600吨；仓山区:11200吨；台江区:8700吨；鼓楼区:12500吨；马尾区:4200吨',
    detailByHaulageCompany: '建发渣土:2850吨；城投运输:2120吨；市政清运:1630吨；环境集团:1000吨',
    detailByDisposalSite: '北峰消纳场:1540吨；南屿消纳场:820吨；东台消纳场:530吨',
    detailByViolationType: '未密闭运输:26起；乱倒渣土:14起；无证清运:9起；路线违规:7起',
    detailByRegionQoq: '晋安区:-1.2%；仓山区:+8.1%；台江区:+3.5%；鼓楼区:+6.2%；马尾区:+15.3%',
    detailByRegionYoy: '晋安区:+2.1%；仓山区:+18.2%；台江区:+9.8%；鼓楼区:+14.5%；马尾区:+22.6%',
    detailByCompanyQoq: '建发渣土:-3.5%；城投运输:-1.8%；市政清运:-2.5%；环境集团:+5.2%',
    detailByCompanyYoy: '建发渣土:+1.2%；城投运输:-0.5%；市政清运:-1.3%；环境集团:+9.8%',
    detailByDisposalSiteQoq: '北峰消纳场:-5.2%；南屿消纳场:-1.8%；东台消纳场:-2.1%',
    detailByDisposalSiteYoy: '北峰消纳场:+1.5%；南屿消纳场:+3.8%；东台消纳场:+0.5%',
    detailByViolationQoq: '未密闭运输:+5.2%；乱倒渣土:+3.8%；无证清运:+2.5%；路线违规:+8.3%',
    detailByViolationYoy: '未密闭运输:-3.5%；乱倒渣土:-1.2%；无证清运:-2.8%；路线违规:+4.6%'
  },
  {
    areaName: '马尾区',
    quarterlyClearanceTotal: 4200,
    illegalCaseDisposalRate: 98.9,
    complianceRank: 2,
    lawEnforcementEffectiveness: 95.1,
    disposalSiteUsage: 1850,
    qoq_ClearanceTotal: 15.3,
    yoy_ClearanceTotal: 22.6,
    qoq_DisposalRate: 1.9,
    yoy_DisposalRate: 3.5,
    qoq_ComplianceRank: 1,
    yoy_ComplianceRank: 2,
    qoq_EnforcementEffectiveness: 5.6,
    yoy_EnforcementEffectiveness: 8.2,
    qoq_DisposalSiteUsage: 12.8,
    yoy_DisposalSiteUsage: 19.3,
    detailByRegion: '马尾区:4200吨；长乐区:5800吨；福清市:4900吨；连江县:3200吨；闽侯县:2800吨',
    detailByHaulageCompany: '建发渣土:1850吨；城投运输:1250吨；市政清运:850吨；环境集团:250吨',
    detailByDisposalSite: '北峰消纳场:950吨；南屿消纳场:620吨；东台消纳场:280吨',
    detailByViolationType: '未密闭运输:8起；乱倒渣土:3起；无证清运:2起；路线违规:1起',
    detailByRegionQoq: '马尾区:+15.3%；长乐区:+6.5%；福清市:+2.3%；连江县:+4.8%；闽侯县:+1.5%',
    detailByRegionYoy: '马尾区:+22.6%；长乐区:+10.8%；福清市:+5.6%；连江县:+9.2%；闽侯县:+3.8%',
    detailByCompanyQoq: '建发渣土:+12.5%；城投运输:+8.2%；市政清投:+5.6%；环境集团:+18.3%',
    detailByCompanyYoy: '建发渣土:+20.1%；城投运输:+13.5%；市政清运:+9.8%；环境集团:+24.6%',
    detailByDisposalSiteQoq: '北峰消纳场:+10.2%；南屿消纳场:+8.5%；东台消纳场:+5.8%',
    detailByDisposalSiteYoy: '北峰消纳场:+16.8%；南屿消纳场:+14.2%；东台消纳场:+10.5%',
    detailByViolationQoq: '未密闭运输:-22.5%；乱倒渣土:-15.8%；无证清运:-18.2%；路线违规:-10.5%',
    detailByViolationYoy: '未密闭运输:-35.2%；乱倒渣土:-28.6%；无证清运:-32.1%；路线违规:-18.9%'
  },
  {
    areaName: '长乐区',
    quarterlyClearanceTotal: 5800,
    illegalCaseDisposalRate: 97.8,
    complianceRank: 3,
    lawEnforcementEffectiveness: 92.4,
    disposalSiteUsage: 2260,
    qoq_ClearanceTotal: 6.5,
    yoy_ClearanceTotal: 10.8,
    qoq_DisposalRate: 0.9,
    yoy_DisposalRate: 2.1,
    qoq_ComplianceRank: 0,
    yoy_ComplianceRank: 1,
    qoq_EnforcementEffectiveness: 2.8,
    yoy_EnforcementEffectiveness: 4.9,
    qoq_DisposalSiteUsage: 4.2,
    yoy_DisposalSiteUsage: 8.5,
    detailByRegion: '长乐区:5800吨；福清市:4900吨；马尾区:4200吨；连江县:3200吨；罗源县:2100吨',
    detailByHaulageCompany: '建发渣土:2450吨；城投运输:1860吨；市政清运:1120吨；环境集团:370吨',
    detailByDisposalSite: '北峰消纳场:1280吨；南屿消纳场:680吨；东台消纳场:300吨',
    detailByViolationType: '未密闭运输:12起；乱倒渣土:5起；无证清运:4起；路线违规:2起',
    detailByRegionQoq: '长乐区:+6.5%；福清市:+2.3%；马尾区:+15.3%；连江县:+4.8%；罗源县:+3.2%',
    detailByRegionYoy: '长乐区:+10.8%；福清市:+5.6%；马尾区:+22.6%；连江县:+9.2%；罗源县:+6.5%',
    detailByCompanyQoq: '建发渣土:+3.8%；城投运输:+2.5%；市政清运:+1.2%；环境集团:+7.6%',
    detailByCompanyYoy: '建发渣土:+8.9%；城投运输:+6.3%；市政清运:+4.5%；环境集团:+12.8%',
    detailByDisposalSiteQoq: '北峰消纳场:+1.8%；南屿消纳场:+3.2%；东台消纳场:+0.5%',
    detailByDisposalSiteYoy: '北峰消纳场:+6.5%；南屿消纳场:+8.9%；东台消纳场:+3.2%',
    detailByViolationQoq: '未密闭运输:-12.8%；乱倒渣土:-7.5%；无证清运:-9.2%；路线违规:-2.1%',
    detailByViolationYoy: '未密闭运输:-20.5%；乱倒渣土:-15.3%；无证清运:-18.6%；路线违规:-5.8%'
  },
  {
    areaName: '福清市',
    quarterlyClearanceTotal: 4900,
    illegalCaseDisposalRate: 96.9,
    complianceRank: 5,
    lawEnforcementEffectiveness: 88.7,
    disposalSiteUsage: 1930,
    qoq_ClearanceTotal: 2.3,
    yoy_ClearanceTotal: 5.6,
    qoq_DisposalRate: -0.3,
    yoy_DisposalRate: 1.2,
    qoq_ComplianceRank: -1,
    yoy_ComplianceRank: -2,
    qoq_EnforcementEffectiveness: -0.8,
    yoy_EnforcementEffectiveness: 2.3,
    qoq_DisposalSiteUsage: -1.5,
    yoy_DisposalSiteUsage: 4.1,
    detailByRegion: '福清市:4900吨；长乐区:5800吨；闽侯县:2800吨；连江县:3200吨；永泰县:1900吨',
    detailByHaulageCompany: '建发渣土:2080吨；城投运输:1560吨；市政清运:980吨；环境集团:280吨',
    detailByDisposalSite: '北峰消纳场:1050吨；南屿消纳场:520吨；东台消纳场:360吨',
    detailByViolationType: '未密闭运输:19起；乱倒渣土:11起；无证清运:7起；路线违规:5起',
    detailByRegionQoq: '福清市:+2.3%；长乐区:+6.5%；闽侯县:+1.5%；连江县:+4.8%；永泰县:+0.5%',
    detailByRegionYoy: '福清市:+5.6%；长乐区:+10.8%；闽侯县:+3.8%；连江县:+9.2%；永泰县:+2.1%',
    detailByCompanyQoq: '建发渣土:+0.5%；城投运输:-1.2%；市政清运:-0.8%；环境集团:+3.5%',
    detailByCompanyYoy: '建发渣土:+3.2%；城投运输:+1.5%；市政清运:+0.8%；环境集团:+6.9%',
    detailByDisposalSiteQoq: '北峰消纳场:-2.5%；南屿消纳场:-0.8%；东台消纳场:-1.2%',
    detailByDisposalSiteYoy: '北峰消纳场:+2.1%；南屿消纳场:+3.5%；东台消纳场:+1.2%',
    detailByViolationQoq: '未密闭运输:+3.5%；乱倒渣土:+1.8%；无证清运:+2.5%；路线违规:+4.2%',
    detailByViolationYoy: '未密闭运输:-5.2%；乱倒渣土:-2.8%；无证清运:-3.5%；路线违规:+0.5%'
  }
];

/** 新增/修改的表单/列表的搜索表单 - 改造为季度渣土清运统计分析表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'areaName',
      label: '区域名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入区域名称'
      },
      labelWidth: '130',
      rules: 'required'
    },
    {
      fieldName: 'quarterlyClearanceTotal',
      label: '季度清运总量(吨)',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入季度清运总量(吨)',
        min: 0,
        precision: 0,
        addonAfter: '吨'
      },
      rules: 'required'
    },
    {
      fieldName: 'illegalCaseDisposalRate',
      label: '季度违规案件处置率(%)',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入违规案件处置率(%)',
        min: 0,
        max: 100,
        precision: 1,
        addonAfter: '%'
      },
      rules: 'required'
    },
    {
      fieldName: 'complianceRank',
      label: '季度清运企业合规率排名',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入合规率排名(数字越小越优)',
        min: 1,
        precision: 0
      },
      rules: 'required'
    },
    {
      fieldName: 'lawEnforcementEffectiveness',
      label: '季度卡点执法成效(%)',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入卡点执法成效(%)',
        min: 0,
        max: 100,
        precision: 1,
        addonAfter: '%'
      },
      rules: 'required'
    },
    {
      fieldName: 'disposalSiteUsage',
      label: '季度渣土消纳场使用量(吨)',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入消纳场使用量(吨)',
        min: 0,
        precision: 0,
        addonAfter: '吨'
      },
      rules: 'required'
    },
    {
      fieldName: 'qoq_ClearanceTotal',
      label: '清运总量环比变化率(%)',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入清运总量环比变化率(%)',
        precision: 1,
        addonAfter: '%'
      },
      rules: 'required'
    },
    {
      fieldName: 'yoy_ClearanceTotal',
      label: '清运总量同比变化率(%)',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入清运总量同比变化率(%)',
        precision: 1,
        addonAfter: '%'
      },
      rules: 'required'
    },
    {
      fieldName: 'qoq_DisposalRate',
      label: '处置率环比变化(百分点)',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入处置率环比变化(百分点)',
        precision: 1,
        addonAfter: '%'
      },
      rules: 'required'
    },
    {
      fieldName: 'yoy_DisposalRate',
      label: '处置率同比变化(百分点)',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入处置率同比变化(百分点)',
        precision: 1,
        addonAfter: '%'
      },
      rules: 'required'
    },
    {
      fieldName: 'qoq_ComplianceRank',
      label: '合规率排名环比变化',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入排名环比变化(正数上升)',
        precision: 0
      },
      rules: 'required'
    },
    {
      fieldName: 'yoy_ComplianceRank',
      label: '合规率排名同比变化',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入排名同比变化(正数上升)',
        precision: 0
      },
      rules: 'required'
    },
    {
      fieldName: 'qoq_EnforcementEffectiveness',
      label: '执法成效环比变化(百分点)',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入执法成效环比变化(百分点)',
        precision: 1,
        addonAfter: '%'
      },
      rules: 'required'
    },
    {
      fieldName: 'yoy_EnforcementEffectiveness',
      label: '执法成效同比变化(百分点)',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入执法成效同比变化(百分点)',
        precision: 1,
        addonAfter: '%'
      },
      rules: 'required'
    },
    {
      fieldName: 'qoq_DisposalSiteUsage',
      label: '消纳场使用量环比变化率(%)',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入消纳场使用量环比变化率(%)',
        precision: 1,
        addonAfter: '%'
      },
      rules: 'required'
    },
    {
      fieldName: 'yoy_DisposalSiteUsage',
      label: '消纳场使用量同比变化率(%)',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入消纳场使用量同比变化率(%)',
        precision: 1,
        addonAfter: '%'
      },
      rules: 'required'
    },
    {
      fieldName: 'detailByRegion',
      label: '按区域拆分明细(含同比环比)',
      component: 'Input',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入按区域拆分的明细数据及同比环比分析',
        maxlength: 500,
        type: 'textarea',
        rows: 3
      },
      rules: 'required'
    },
    {
      fieldName: 'detailByHaulageCompany',
      label: '按清运企业拆分明细(含同比环比)',
      component: 'Input',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入按清运企业拆分的明细数据及同比环比分析',
        maxlength: 500,
        type: 'textarea',
        rows: 3
      },
      rules: 'required'
    },
    {
      fieldName: 'detailByDisposalSite',
      label: '按消纳场拆分明细(含同比环比)',
      component: 'Input',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入按消纳场拆分的明细数据及同比环比分析',
        maxlength: 500,
        type: 'textarea',
        rows: 3
      },
      rules: 'required'
    },
    {
      fieldName: 'detailByViolationType',
      label: '按违规类型拆分明细(含同比环比)',
      component: 'Input',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入按违规类型拆分的明细数据及同比环比分析',
        maxlength: 500,
        type: 'textarea',
        rows: 3
      },
      rules: 'required'
    },
    {
      fieldName: 'detailByRegionQoq',
      label: '按区域环比分析明细',
      component: 'Input',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入各区域环比变化率明细',
        maxlength: 400,
        type: 'textarea',
        rows: 2
      },
      rules: 'required'
    },
    {
      fieldName: 'detailByRegionYoy',
      label: '按区域同比分析明细',
      component: 'Input',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入各区域同比变化率明细',
        maxlength: 400,
        type: 'textarea',
        rows: 2
      },
      rules: 'required'
    },
    {
      fieldName: 'detailByCompanyQoq',
      label: '按企业环比分析明细',
      component: 'Input',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入各企业环比变化率明细',
        maxlength: 400,
        type: 'textarea',
        rows: 2
      },
      rules: 'required'
    },
    {
      fieldName: 'detailByCompanyYoy',
      label: '按企业同比分析明细',
      component: 'Input',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入各企业同比变化率明细',
        maxlength: 400,
        type: 'textarea',
        rows: 2
      },
      rules: 'required'
    },
    {
      fieldName: 'detailByDisposalSiteQoq',
      label: '按消纳场环比分析明细',
      component: 'Input',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入各消纳场环比变化率明细',
        maxlength: 400,
        type: 'textarea',
        rows: 2
      },
      rules: 'required'
    },
    {
      fieldName: 'detailByDisposalSiteYoy',
      label: '按消纳场同比分析明细',
      component: 'Input',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入各消纳场同比变化率明细',
        maxlength: 400,
        type: 'textarea',
        rows: 2
      },
      rules: 'required'
    },
    {
      fieldName: 'detailByViolationQoq',
      label: '按违规类型环比分析明细',
      component: 'Input',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入各违规类型环比变化率明细',
        maxlength: 400,
        type: 'textarea',
        rows: 2
      },
      rules: 'required'
    },
    {
      fieldName: 'detailByViolationYoy',
      label: '按违规类型同比分析明细',
      component: 'Input',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入各违规类型同比变化率明细',
        maxlength: 400,
        type: 'textarea',
        rows: 2
      },
      rules: 'required'
    }
  ];
}

/** 表格字段 - 改造为季度渣土清运统计分析表格列 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'areaName',
      title: '区域名称',
      minWidth: 120,
      sortable: true
    },
    {
      field: 'quarterlyClearanceTotal',
      title: '季度清运总量(吨)',
      minWidth: 150,
      sortable: true
    },
    {
      field: 'illegalCaseDisposalRate',
      title: '违规案件处置率(%)',
      minWidth: 150,
      sortable: true
    },
    {
      field: 'complianceRank',
      title: '清运企业合规率排名',
      minWidth: 150,
      sortable: true
    },
    {
      field: 'lawEnforcementEffectiveness',
      title: '卡点执法成效(%)',
      minWidth: 140,
      sortable: true
    },
    {
      field: 'disposalSiteUsage',
      title: '渣土消纳场使用量(吨)',
      minWidth: 160,
      sortable: true
    },
    {
      field: 'qoq_ClearanceTotal',
      title: '清运总量环比(%)',
      minWidth: 140,
      sortable: true
    },
    {
      field: 'yoy_ClearanceTotal',
      title: '清运总量同比(%)',
      minWidth: 140,
      sortable: true
    },
    {
      field: 'qoq_DisposalRate',
      title: '处置率环比(百分点)',
      minWidth: 150,
      sortable: true
    },
    {
      field: 'yoy_DisposalRate',
      title: '处置率同比(百分点)',
      minWidth: 150,
      sortable: true
    },
    {
      field: 'qoq_ComplianceRank',
      title: '合规率排名环比变化',
      minWidth: 150,
      sortable: true
    },
    {
      field: 'yoy_ComplianceRank',
      title: '合规率排名同比变化',
      minWidth: 150,
      sortable: true
    },
    {
      field: 'qoq_EnforcementEffectiveness',
      title: '执法成效环比(百分点)',
      minWidth: 160,
      sortable: true
    },
    {
      field: 'yoy_EnforcementEffectiveness',
      title: '执法成效同比(百分点)',
      minWidth: 160,
      sortable: true
    },
    {
      field: 'qoq_DisposalSiteUsage',
      title: '消纳场使用量环比(%)',
      minWidth: 160,
      sortable: true
    },
    {
      field: 'yoy_DisposalSiteUsage',
      title: '消纳场使用量同比(%)',
      minWidth: 160,
      sortable: true
    },
    {
      field: 'detailByRegion',
      title: '按区域拆分明细(含同比环比)',
      minWidth: 280,
      sortable: false
    },
    {
      field: 'detailByHaulageCompany',
      title: '按清运企业拆分明细(含同比环比)',
      minWidth: 280,
      sortable: false
    },
    {
      field: 'detailByDisposalSite',
      title: '按消纳场拆分明细(含同比环比)',
      minWidth: 280,
      sortable: false
    },
    {
      field: 'detailByViolationType',
      title: '按违规类型拆分明细(含同比环比)',
      minWidth: 280,
      sortable: false
    },
    {
      field: 'detailByRegionQoq',
      title: '按区域环比分析明细',
      minWidth: 220,
      sortable: false
    },
    {
      field: 'detailByRegionYoy',
      title: '按区域同比分析明细',
      minWidth: 220,
      sortable: false
    },
    {
      field: 'detailByCompanyQoq',
      title: '按企业环比分析明细',
      minWidth: 220,
      sortable: false
    },
    {
      field: 'detailByCompanyYoy',
      title: '按企业同比分析明细',
      minWidth: 220,
      sortable: false
    },
    {
      field: 'detailByDisposalSiteQoq',
      title: '按消纳场环比分析明细',
      minWidth: 220,
      sortable: false
    },
    {
      field: 'detailByDisposalSiteYoy',
      title: '按消纳场同比分析明细',
      minWidth: 220,
      sortable: false
    },
    {
      field: 'detailByViolationQoq',
      title: '按违规类型环比分析明细',
      minWidth: 220,
      sortable: false
    },
    {
      field: 'detailByViolationYoy',
      title: '按违规类型同比分析明细',
      minWidth: 220,
      sortable: false
    }
  ];
}
