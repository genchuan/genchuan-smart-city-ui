import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

/** 路侧停车管理表格初始数据（含行政区划、坐标等完整字段）*/
export const dataList = () => {
  return  [
    {
      id: '1', // 泊位主ID
      berthId: 'XC-DP-001', // 泊位ID（行政区-街道-编号）
      berthCode: '350602100001', // 泊位编号（行政区划+序列码）
      roadName: 'XX路', // 路段名称
      locationDesc: '芗城区XX街道XX路88号（道路东侧，距XX路口50米）', // 位置描述
      berthType: '路侧', // 泊位类型
      coordX: '117.658921', // 坐标X（漳州市芗城区大致经纬度）
      coordY: '24.512876', // 坐标Y
      status: '启用', // 启用状态
      regionCode: '350602', // 所属行政区划代码（芗城区）
      address: '芗城区XX街道XX路88号（道路东侧）',
      parkTotal: '28',
      pricing: '首小时8元，后续每小时4元，封顶32元',
      business: '06:00-24:00',
      division: '芗城区-东铺头街道',
      grid: '东铺头街道网格001',
      managementMatters: '泊位占用处置,违停抓拍核查',
      phone: '13800138000',
      reason: '',
    },
    {
      id: '2',
      berthId: 'LW-BH-002',
      berthCode: '350603002002',
      roadName: '碧湖路',
      locationDesc: '龙文区碧湖路126号（道路南侧，碧湖公园西门旁）',
      berthType: '路侧',
      coordX: '117.715634',
      coordY: '24.498723',
      status: '禁用',
      regionCode: '350603', // 龙文区
      address: '龙文区碧湖路126号（道路南侧）',
      parkTotal: '35',
      pricing: '首小时6元，后续每小时3元，封顶28元',
      business: '07:00-22:00',
      division: '龙文区-碧湖街道',
      grid: '碧湖街道网格002',
      managementMatters: '泊位标线翻新,设施故障维修',
      phone: '123456789',
      reason: '道路施工占用泊位，暂停使用',
    },
    {
      id: '3',
      berthId: 'LH-SM-001',
      berthCode: '350604001001',
      roadName: '解放北路',
      locationDesc: '龙海区石码镇解放北路59号（道路西侧，石码中心小学旁）',
      berthType: '路侧',
      coordX: '117.887654',
      coordY: '24.456789',
      status: '禁用',
      regionCode: '350604', // 龙海区
      address: '龙海区石码镇解放北路59号（道路西侧）',
      parkTotal: '18',
      pricing: '首小时4元，后续每小时2元，封顶20元',
      business: '08:00-21:00',
      division: '龙海区-石码街道',
      grid: '石码街道网格001',
      managementMatters: '泊位编号更新,设施升级改造',
      phone: '13959678987',
      reason: '智能咪表设备更换，暂停运营',
    },
    {
      id: '4',
      berthId: 'LH-HC-001',
      berthCode: '350604002001',
      roadName: '闽齐社区路',
      locationDesc: '龙海区海澄镇闽齐社区西门（社区道路北侧，社区服务中心旁）',
      berthType: '路侧',
      coordX: '117.901234',
      coordY: '24.432109',
      status: '启用',
      regionCode: '350604', // 龙海区
      address: '闽齐社区西门（社区道路北侧）',
      parkTotal: '12',
      pricing: '首小时5元，后续每小时2元，封顶24元',
      business: '24H',
      division: '龙海区-海澄镇',
      grid: '海澄镇网格001',
      managementMatters: '泊位占用处置,设施故障维修',
      phone: '15399916161',
      reason: '',
    },
    {
      id: '5',
      berthId: 'XC-XK-003',
      berthCode: '350602003003',
      roadName: '江滨南路',
      locationDesc: '芗城区江滨南路189号（滨江步道旁，距中山桥100米）',
      berthType: '路侧',
      coordX: '117.678901',
      coordY: '24.501234',
      status: '启用',
      regionCode: '350602', // 芗城区
      address: '芗城区江滨南路189号（滨江步道旁）',
      parkTotal: '42',
      pricing: '首小时10元，后续每小时5元，封顶40元',
      business: '06:00-24:00',
      division: '芗城区-巷口街道',
      grid: '巷口街道网格003',
      managementMatters: '车流高峰疏导,泊位占用处置,违停劝导',
      phone: '8888888',
      reason: '',
    },
    {
      id: '6',
      berthId: 'LW-LT-002',
      berthCode: '350603004002',
      roadName: '建元东路',
      locationDesc: '龙文区建元东路2号（万达1号门对面，道路北侧）',
      berthType: '路侧',
      coordX: '117.723456',
      coordY: '24.487654',
      status: '启用',
      regionCode: '350603', // 龙文区
      address: '龙文区建元东路2号（万达1号门对面）',
      parkTotal: '58',
      pricing: '首小时7元，后续每小时3元，封顶30元',
      business: '24H',
      division: '龙文区-蓝田街道',
      grid: '蓝田街道网格002',
      managementMatters: '运营状态变更,数据统计分析,高峰管控',
      phone: '15860234567',
      reason: '',
    },
    {
      id: '7',
      berthId: 'CT-WA-001',
      berthCode: '350625001001',
      roadName: '人民西路',
      locationDesc: '长泰区武安镇人民西路77号（道路北侧，长泰汽车站旁）',
      berthType: '路侧',
      coordX: '117.789012',
      coordY: '24.612345',
      status: '启用',
      regionCode: '350625', // 长泰区
      address: '长泰区武安镇人民西路77号（道路北侧）',
      parkTotal: '25',
      pricing: '首小时5元，后续每小时2元，封顶22元',
      business: '07:00-23:00',
      division: '长泰区-武安镇',
      grid: '武安镇网格001',
      managementMatters: '定期设施巡检,咪表设备维护',
      phone: '13706987654',
      reason: '',
    },
    {
      id: '8',
      berthId: 'ZP-SA-001',
      berthCode: '350623001001',
      roadName: '金浦大道',
      locationDesc: '漳浦县绥安镇金浦大道101号（道路东侧，漳浦县政府旁）',
      berthType: '路侧',
      coordX: '117.612345',
      coordY: '24.123456',
      status: '禁用',
      regionCode: '350623', // 漳浦县
      address: '漳浦县绥安镇金浦大道101号（道路东侧）',
      parkTotal: '20',
      pricing: '首小时4元，后续每小时1元，封顶18元',
      business: '08:00-20:00',
      division: '漳浦县-绥安镇',
      grid: '绥安镇网格001',
      managementMatters: '应急事件处置,道路抢修配合',
      phone: '13695901234',
      reason: '暴雨导致路面积水，临时封闭泊位',
    },
    {
      id: '9',
      berthId: 'XC-XK-002',
      berthCode: '350602003002',
      roadName: '新华东路',
      locationDesc: '芗城区新华东路32号（道路南侧，漳州一中旁）',
      berthType: '路侧',
      coordX: '117.667890',
      coordY: '24.523456',
      status: '启用',
      regionCode: '350602', // 芗城区
      address: '芗城区新华东路32号（道路南侧）',
      parkTotal: '16',
      pricing: '首小时6元，后续每小时3元，封顶26元',
      business: '06:00-23:00',
      division: '芗城区-巷口街道',
      grid: '巷口街道网格002',
      managementMatters: '收费标准调整,泊位占用处置,标线补划',
      phone: '18960012345',
      reason: '',
    },
    {
      id: '10',
      berthId: 'LW-LT-001',
      berthCode: '350603004001',
      roadName: '梧桥中路',
      locationDesc: '龙文区蓝田街道梧桥中路58号（道路西侧，蓝田开发区旁）',
      berthType: '路侧',
      coordX: '117.734567',
      coordY: '24.476543',
      status: '启用',
      regionCode: '350603', // 龙文区
      address: '龙文区蓝田街道梧桥中路58号（道路西侧）',
      parkTotal: '30',
      pricing: '首小时8元，后续每小时4元，封顶35元',
      business: '24H',
      division: '龙文区-蓝田街道',
      grid: '蓝田街道网格001',
      managementMatters: '环境卫生管理,设施故障维修,违停取证',
      phone: '15980567890',
      reason: '',
    },
  ]
}

/** 列表的字段 */
export function useGridColumns(): VxeTableGridOptions['columns'] {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '泊位ID',
      minWidth: 50,
      sortable: true
    },
    {
      field: 'berthCode',
      title: '泊位编号',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'roadName',
      title: '路段名称',
      minWidth: 200,
      sortable: true
    },
    {
      field: 'locationDesc',
      title: '位置描述',
      minWidth: 200,
      sortable: true
    },
    {
      field: 'berthType',
      title: '泊位类型',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'coordX',
      title: '坐标X',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'coordY',
      title: '坐标Y',
      minWidth: 100,
      sortable: true
    },
     {
      field: 'regionCode',
      title: '所属行政区划代码',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'grid',
      title: '网格',
      minWidth: 200,
      sortable: true
    },
    {
      field: 'phone',
      title: '电话',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'status',
      title: '运营状态',
      minWidth: 100,
      sortable: true
    },
    {
      title: '操作',
      width: 240,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 新增/修改的表单 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'id',
      label: '泊位ID',
      component: 'Input',
       componentProps: {
        placeholder: '请输入泊位ID',
      },
      rules: 'required',
    },
    {
      fieldName: 'berthCode',
      label: '泊位编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入泊位编号',
      },
      rules: 'required',
    },
    {
      fieldName: 'roadName',
      label: '路段名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入路段名称',
      },
      rules: 'required',
    }, 
     {
      fieldName: 'locationDesc',
      label: '位置描述',
      component: 'Input',
      componentProps: {
        placeholder: '请输入位置描述',
      },
      rules: 'required',
    }, 
     {
      fieldName: 'berthType',
      label: '泊位类型',
      component: 'Input',
      componentProps: {
        placeholder: '请输入泊位类型',
      },
      rules: 'required',
    }, 
     {
      fieldName: 'coordX',
      label: '坐标X',
      component: 'Input',
      componentProps: {
        placeholder: '请输入坐标X',
      },
      rules: 'required',
    }, 
    {
      fieldName: 'coordY',
      label: '坐标Y',
      component: 'Input',
      componentProps: {
        placeholder: '请输入coordY',
      },
      rules: 'required',
    }, 
    {
      fieldName: 'regionCode',
      label: '所属行政区划代码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入所属行政区划代码',
      },
      rules: 'required',
    }, 
    {
      fieldName: 'grid',
      label: '网格',
      component: 'Input',
      componentProps: {
        placeholder: '请输入网格',
      },
      rules: 'required',
    },
    {
      fieldName: 'phone',
      label: '电话',
      component: 'Input',
      componentProps: {
        placeholder: '请输入电话',
      },
      rules: 'required',
    },
    {
      fieldName: 'status',
      label: '运营状态',
      component: 'Input',
      componentProps: {
        placeholder: '请输入运营状态',
      },
      rules: 'required',
    },
  ];
}
 

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'id',
      label: '泊位ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入泊位ID',
        clearable: true,
      },
    },
    {
      fieldName: 'berthCode',
      label: '泊位编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入泊位编号',
        clearable: true,
      },
    },
    {
      fieldName: 'roadName',
      label: '路段名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入路段名称',
        clearable: true,
      },
    },
    {
      fieldName: 'locationDesc',
      label: '位置描述',
      component: 'Input',
      componentProps: {
        placeholder: '请输入位置描述',
        clearable: true,
      },
    },
    {
      fieldName: 'berthType',
      label: '泊位类型',
      component: 'Input',
      componentProps: {
        placeholder: '请输入泊位类型',
        clearable: true,
      },
    },
    {
      fieldName: 'coordX',
      label: '坐标X',
      component: 'Input',
      componentProps: {
        placeholder: '请输入坐标X',
        clearable: true,
      },
    }, 
    {
      fieldName: 'coordY',
      label: '坐标Y',
      component: 'Input',
      componentProps: {
        placeholder: '请输入坐标Y',
        clearable: true,
      },
    },
    {
      fieldName: 'regionCode',
      label: '所属行政区划代码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入所属行政区划代码',
        clearable: true,
      },
    },
    {
      fieldName: 'grid',
      label: '网格',
      component: 'Input',
      componentProps: {
        placeholder: '请输入网格',
        clearable: true,
      },
    }, 
     {
      fieldName: 'phone',
      label: '电话',
      component: 'Input',
      componentProps: {
        placeholder: '请输入电话',
        clearable: true,
      },
    }, 
     {
      fieldName: 'status',
      label: '运营状态',
      component: 'Input',
      componentProps: {
        placeholder: '请输入运营状态',
        clearable: true,
      },
    }, 
  ];
}
 