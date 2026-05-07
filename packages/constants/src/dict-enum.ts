/** ========== COMMON - 通用模块 ========== */
const COMMON_DICT = {
  USER_TYPE: 'user_type',
  COMMON_STATUS: 'common_status',
  TERMINAL: 'terminal', // 终端
  DATE_INTERVAL: 'date_interval', // 数据间隔
} as const;

/** ========== SYSTEM - 系统模块 ========== */
const SYSTEM_DICT = {
  SYSTEM_USER_SEX: 'system_user_sex',
  SYSTEM_MENU_TYPE: 'system_menu_type',
  SYSTEM_ROLE_TYPE: 'system_role_type',
  SYSTEM_DATA_SCOPE: 'system_data_scope',
  SYSTEM_NOTICE_TYPE: 'system_notice_type',
  SYSTEM_LOGIN_TYPE: 'system_login_type',
  SYSTEM_LOGIN_RESULT: 'system_login_result',
  SYSTEM_SMS_CHANNEL_CODE: 'system_sms_channel_code',
  SYSTEM_SMS_TEMPLATE_TYPE: 'system_sms_template_type',
  SYSTEM_SMS_SEND_STATUS: 'system_sms_send_status',
  SYSTEM_SMS_RECEIVE_STATUS: 'system_sms_receive_status',
  SYSTEM_OAUTH2_GRANT_TYPE: 'system_oauth2_grant_type',
  SYSTEM_MAIL_SEND_STATUS: 'system_mail_send_status',
  SYSTEM_NOTIFY_TEMPLATE_TYPE: 'system_notify_template_type',
  SYSTEM_SOCIAL_TYPE: 'system_social_type',
} as const;

/** ========== INFRA - 基础设施模块 ========== */
const INFRA_DICT = {
  INFRA_BOOLEAN_STRING: 'infra_boolean_string',
  INFRA_JOB_STATUS: 'infra_job_status',
  INFRA_JOB_LOG_STATUS: 'infra_job_log_status',
  INFRA_API_ERROR_LOG_PROCESS_STATUS: 'infra_api_error_log_process_status',
  INFRA_CONFIG_TYPE: 'infra_config_type',
  INFRA_CODEGEN_TEMPLATE_TYPE: 'infra_codegen_template_type',
  INFRA_CODEGEN_FRONT_TYPE: 'infra_codegen_front_type',
  INFRA_CODEGEN_SCENE: 'infra_codegen_scene',
  INFRA_FILE_STORAGE: 'infra_file_storage',
  INFRA_OPERATE_TYPE: 'infra_operate_type',
} as const;

/** ========== BPM - 工作流模块 ========== */
const BPM_DICT = {
  BPM_MODEL_FORM_TYPE: 'bpm_model_form_type', // BPM 模型表单类型
  BPM_MODEL_TYPE: 'bpm_model_type', // BPM 模型类型
  BPM_OA_LEAVE_TYPE: 'bpm_oa_leave_type', // BPM OA 请假类型
  BPM_PROCESS_INSTANCE_STATUS: 'bpm_process_instance_status', // BPM 流程实例状态
  BPM_PROCESS_LISTENER_TYPE: 'bpm_process_listener_type', // BPM 流程监听器类型
  BPM_PROCESS_LISTENER_VALUE_TYPE: 'bpm_process_listener_value_type', // BPM 流程监听器值类型
  BPM_TASK_CANDIDATE_STRATEGY: 'bpm_task_candidate_strategy', // BPM 任务候选人策略
  BPM_TASK_STATUS: 'bpm_task_status', // BPM 任务状态
} as const;

/** ========== PAY - 支付模块 ========== */
const PAY_DICT = {
  PAY_CHANNEL_CODE: 'pay_channel_code', // 支付渠道编码类型
  PAY_ORDER_STATUS: 'pay_order_status', // 商户支付订单状态
  PAY_REFUND_STATUS: 'pay_refund_status', // 退款订单状态
  PAY_NOTIFY_STATUS: 'pay_notify_status', // 商户支付回调状态
  PAY_NOTIFY_TYPE: 'pay_notify_type', // 商户支付回调状态
  PAY_TRANSFER_STATUS: 'pay_transfer_status', // 转账订单状态
  PAY_TRANSFER_TYPE: 'pay_transfer_type', // 转账类型
} as const;

/** ========== MP - 公众号模块 ========== */
const MP_DICT = {
  MP_AUTO_REPLY_REQUEST_MATCH: 'mp_auto_reply_request_match', // 自动回复请求匹配类型
  MP_MESSAGE_TYPE: 'mp_message_type', // 消息类型
} as const;

/** ========== MEMBER - 会员模块 ========== */
const MEMBER_DICT = {
  MEMBER_EXPERIENCE_BIZ_TYPE: 'member_experience_biz_type', // 会员经验业务类型
  MEMBER_POINT_BIZ_TYPE: 'member_point_biz_type', // 积分的业务类型
} as const;

/** ========== MALL - 商城模块 ========== */
const MALL_DICT = {
  /** ========== MALL - 商品模块 ========== */
  PRODUCT_SPU_STATUS: 'product_spu_status', // 商品状态

  /** ========== MALL - 交易模块 ========== */
  EXPRESS_CHARGE_MODE: 'trade_delivery_express_charge_mode', // 快递的计费方式
  TRADE_AFTER_SALE_STATUS: 'trade_after_sale_status', // 售后 - 状态
  TRADE_AFTER_SALE_TYPE: 'trade_after_sale_type', // 售后 - 类型
  TRADE_AFTER_SALE_WAY: 'trade_after_sale_way', // 售后 - 方式
  TRADE_DELIVERY_TYPE: 'trade_delivery_type', // 配送方式
  TRADE_ORDER_ITEM_AFTER_SALE_STATUS: 'trade_order_item_after_sale_status', // 订单项 - 售后状态
  TRADE_ORDER_STATUS: 'trade_order_status', // 订单 - 状态
  TRADE_ORDER_TYPE: 'trade_order_type', // 订单 - 类型
  BROKERAGE_BANK_NAME: 'brokerage_bank_name', // 佣金提现银行
  BROKERAGE_BIND_MODE: 'brokerage_bind_mode', // 分销关系绑定模式
  BROKERAGE_ENABLED_CONDITION: 'brokerage_enabled_condition', // 分佣模式
  BROKERAGE_RECORD_BIZ_TYPE: 'brokerage_record_biz_type', // 佣金业务类型
  BROKERAGE_RECORD_STATUS: 'brokerage_record_status', // 佣金状态
  BROKERAGE_WITHDRAW_STATUS: 'brokerage_withdraw_status', // 佣金提现状态
  BROKERAGE_WITHDRAW_TYPE: 'brokerage_withdraw_type', // 佣金提现类型

  /** ========== MALL - 营销模块 ========== */

  PROMOTION_BANNER_POSITION: 'promotion_banner_position', // banner 定位
  PROMOTION_BARGAIN_RECORD_STATUS: 'promotion_bargain_record_status', // 砍价记录的状态
  PROMOTION_COMBINATION_RECORD_STATUS: 'promotion_combination_record_status', // 拼团记录的状态
  PROMOTION_CONDITION_TYPE: 'promotion_condition_type', // 营销的条件类型枚举
  PROMOTION_COUPON_STATUS: 'promotion_coupon_status', // 优惠劵的状态
  PROMOTION_COUPON_TAKE_TYPE: 'promotion_coupon_take_type', // 优惠劵的领取方式
  PROMOTION_COUPON_TEMPLATE_VALIDITY_TYPE:
    'promotion_coupon_template_validity_type', // 优惠劵模板的有限期类型
  PROMOTION_DISCOUNT_TYPE: 'promotion_discount_type', // 优惠类型
  PROMOTION_PRODUCT_SCOPE: 'promotion_product_scope', // 营销的商品范围
} as const;

/** ========== CRM - 客户管理模块 ========== */
const CRM_DICT = {
  CRM_AUDIT_STATUS: 'crm_audit_status', // CRM 审批状态
  CRM_BIZ_TYPE: 'crm_biz_type', // CRM 业务类型
  CRM_BUSINESS_END_STATUS_TYPE: 'crm_business_end_status_type', // CRM 商机结束状态类型
  CRM_CUSTOMER_INDUSTRY: 'crm_customer_industry', // CRM 客户所属行业
  CRM_CUSTOMER_LEVEL: 'crm_customer_level', // CRM 客户级别
  CRM_CUSTOMER_SOURCE: 'crm_customer_source', // CRM 客户来源
  CRM_FOLLOW_UP_TYPE: 'crm_follow_up_type', // CRM 跟进方式
  CRM_PERMISSION_LEVEL: 'crm_permission_level', // CRM 数据权限的级别
  CRM_PRODUCT_STATUS: 'crm_product_status', // CRM 商品状态
  CRM_PRODUCT_UNIT: 'crm_product_unit', // CRM 产品单位
  CRM_RECEIVABLE_RETURN_TYPE: 'crm_receivable_return_type', // CRM 回款的还款方式
} as const;

/** ========== ERP - 企业资源计划模块 ========== */
const ERP_DICT = {
  ERP_AUDIT_STATUS: 'erp_audit_status', // ERP 审批状态
  ERP_STOCK_RECORD_BIZ_TYPE: 'erp_stock_record_biz_type', // 库存明细的业务类型
} as const;

/** ========== AI - 人工智能模块 ========== */
const AI_DICT = {
  AI_GENERATE_MODE: 'ai_generate_mode', // AI 生成模式
  AI_IMAGE_STATUS: 'ai_image_status', // AI 图片状态
  AI_MODEL_TYPE: 'ai_model_type', // AI 模型类型
  AI_MUSIC_STATUS: 'ai_music_status', // AI 音乐状态
  AI_PLATFORM: 'ai_platform', // AI 平台
  AI_WRITE_FORMAT: 'ai_write_format', // AI 写作格式
  AI_WRITE_LANGUAGE: 'ai_write_language', // AI 写作语言
  AI_WRITE_LENGTH: 'ai_write_length', // AI 写作长度
  AI_WRITE_TONE: 'ai_write_tone', // AI 写作语气
  AI_WRITE_TYPE: 'ai_write_type', // AI 写作类型
  AI_MCP_CLIENT_NAME: 'ai_mcp_client_name', // AI MCP Client 名字
} as const;

/** ========== IOT - 物联网模块 ========== */
const IOT_DICT = {
  IOT_ALERT_LEVEL: 'iot_alert_level', // IoT 告警级别
  IOT_ALERT_RECEIVE_TYPE: 'iot_alert_receive_type', // IoT 告警接收类型
  IOT_CODEC_TYPE: 'iot_codec_type', // IOT 数据格式（编解码器类型）
  IOT_DATA_FORMAT: 'iot_data_format', // IOT 数据格式
  IOT_DATA_SINK_TYPE_ENUM: 'iot_data_sink_type_enum', // IoT 数据流转目的类型
  IOT_DATA_TYPE: 'iot_data_type', // IOT 数据类型
  IOT_DEVICE_STATE: 'iot_device_state', // IOT 设备状态
  IOT_LOCATION_TYPE: 'iot_location_type', // IOT 定位类型
  IOT_NET_TYPE: 'iot_net_type', // IOT 联网方式
  IOT_OTA_TASK_DEVICE_SCOPE: 'iot_ota_task_device_scope', // IoT OTA任务设备范围
  IOT_OTA_TASK_RECORD_STATUS: 'iot_ota_task_record_status', // IoT OTA 记录状态
  IOT_OTA_TASK_STATUS: 'iot_ota_task_status', // IoT OTA 任务状态
  IOT_PRODUCT_DEVICE_TYPE: 'iot_product_device_type', // IOT 产品设备类型
  IOT_PRODUCT_FUNCTION_TYPE: 'iot_product_function_type', // IOT 产品功能类型
  IOT_PRODUCT_STATUS: 'iot_product_status', // IOT 产品状态
  IOT_PROTOCOL_TYPE: 'iot_protocol_type', // IOT 接入网关协议
  IOT_RULE_SCENE_ACTION_TYPE_ENUM: 'iot_rule_scene_action_type_enum', // IoT 规则场景的触发类型枚举
  IOT_RULE_SCENE_TRIGGER_TYPE_ENUM: 'iot_rule_scene_trigger_type_enum', // IoT 场景流转的触发类型枚举
  IOT_RW_TYPE: 'iot_rw_type', // IOT 读写类型
  IOT_THING_MODEL_TYPE: 'iot_thing_model_type', // IOT 产品功能类型
  IOT_THING_MODEL_UNIT: 'iot_thing_model_unit', // IOT 物模型单位
  IOT_UNIT_TYPE: 'iot_unit_type', // IOT 单位类型
  IOT_VALIDATE_TYPE: 'iot_validate_type', // IOT 数据校验级别
} as const;

/** ========== DATA - 数据中枢模块 ========== */
const DATA_DICT = {
  DATA_CATEGORY_TYPE: 'op_data_category_type', // 分类类型
  DATA_RUN_STATUS: 'op_data_run_status', // 运行状态
  DATA_MATTER_STATUS: 'op_data_matter_status', // 事项状态
  DATA_AUDIT_STATUS: 'op_data_audit_status', // 审核状态
  DATA_ENABLE_STATUS: 'op_data_open_status', // 启用状态
  DATA_CORE_INDICATORS: 'op_data_sys_index', // 核心监测指标
  DATA_EVENT_LEVEL: 'op_data_event_level', // 事件等级
  DATA_TYPE: 'op_data_type', // 数据类型
} as const;

/** ========== SHUNCAHNG - 顺昌迁移模块 ========== */
const SHUNCHANG_DICT = {
  // 排水户管理系统
  SM_DRAINAGE_USER: 'sm_drainage_user',
  SM_INDUSTRY_CATEGORY: 'sm_Industry_category',
  SM_DRAINAGE_TYPE: 'sm_drainage_type',
  SM_PART_TYPE: 'sm_part_type',
  SM_STATE: 'sm_state',
  // 顺昌物联网设备状态
  SC_OP_SERVICE_DEVICE_STATUS: 'sc_op_service_device_status',
} as const;

/** ========== ENERGYCHARGE - 能源充电模块 ========== */
const ENERGYCHARGE_DICT = {
  // 汽车充电
  // 充电车位
  CHARGE_LOT_LOT_STATUS: 'charging_lot_lot_status', // 车位状态
  CHARGE_LOT_LOT_TYPE: 'charging_lot_lot_type', // 车位类型
  // 订单告警
  ORDER_ALARM_ABNORMAL_TYPE: 'order_alarm_abnormal_type', // 订单异常类型
  ORDER_ALARM_ALARM_STATUS: 'order_alarm_alarm_status', // 订单告警状态
  ORDER_ALARM_VERIFY_RESULT: 'order_alarm_verify_result', // 订单告警核实结果
  ORDER_ALARM_HANDLE_MEASURE: 'order_alarm_handle_measure', // 订单告警处理措施
  // 订单退款
  ORDER_REFUND_CHANNEL: 'order_refund_refund_channel', // 订单退款渠道
  ORDER_REFUND_STATUS: 'order_refund_refund_status', // 订单退款状态
} as const;

/** ========== CHGPARKMGT  - 充电停车一体化管理模块 ========== */
const CHGPARKMGT_DICT = {
  // 营销运营管理
  // 积分活动
  POINT_ACTIVITY_TYPE: 'point_activity_type', // 活动类型
  POINT_ACTIVITY_STATUS: 'point_activity_status', // 状态
  // 积分抽奖
  POINT_LOTTERY_SYNC_STATUS: 'point_lottery_sync_status', // 同步状态
  POINT_LOTTERY_STATUS: 'point_lottery_status', // 记录状态
  // 规则配置
  RULE_CONFIG_TYPE: 'rule_config_type', // 规则类型
  RULE_CONFIG_STATUS: 'rule_config_status', // 规则状态
  RULE_CONFIG_SCENE: 'rule_config_scene', // 适用场景
  // 奖品管理
  PRIZE_MGMT_TYPE: 'prize_mgmt_type', // 奖品类型
  PRIZE_MGMT_STATUS: 'prize_mgmt_status', // 奖品状态
  // 优惠活动
  // 优惠券管理
  COUPON_MGMT_TYPE: 'coupon_mgmt_type', // 优惠券类型
  COUPON_MGMT_STATUS: 'coupon_mgmt_status', // 优惠券状态
  // 活动配置
  ACTIVITY_CONFIG_TYPE: 'activity_config_type', // 配置类型
  ACTIVITY_CONFIG_USER_GROUP: 'activity_config_user_group', // 配置适用人群
  ACTIVITY_CONFIG_STATUS: 'activity_config_status', // 配置状态
  // 券包配置
  PACKAGE_CONFIG_TYPE: 'package_config_type', // 券包类型
  PACKAGE_CONFIG_STATUS: 'package_config_status', // 券包配置状态
  PACKAGE_CONFIG_SCOPE: 'package_config_scope', // 券包适用范围
  // 领用记录
  RECEIVE_RECORD_STATUS: 'receive_record_status', // 状态
  RECEIVE_RECORD_SYNC_STATUS: 'receive_record_sync_status', // 同步状态
  // 卡种管理
  // 卡种订单
  CARD_ORDER_PAY_STATUS: 'card_order_pay_status', // 卡种订单支付状态
  CARD_ORDER_INVOICE_STATUS: 'card_order_invoice_status', // 卡种订单开票状态
  // 卡种配置
  CARD_CONFIG_TYPE: 'card_config_type', // 卡种类型
  CARD_CONFIG_SCOPE: 'card_config_scope', // 适用范围
  CARD_CONFIG_STATUS: 'card_config_status', // 配置状态
  // 库存管控
  STOCK_CONTROL_STATUS: 'stock_control_status', // 库存状态
  STOCK_CONTROL_WARN_STATUS: 'stock_control_warn_status', // 告警状态
  // 兑换管理
  // 兑换类目
  EXCHANGE_CATEGORY_STATUS: 'exchange_category_status', // 类目状态
  EXCHANGE_CATEGORY_SCOPE: 'exchange_category_scope', // 适用范围
  // 兑换订单
  EXCHANGE_ORDER_PAY_STATUS: 'exchange_order_pay_status', // 支付状态
  // 分析决策
  // 营销运营报表
  MARKET_OP_REPORT_TYPE: 'market_op_report_type', // 报表类型
  MARKET_OP_REPORT_STATUS: 'market_op_report_status', // 报表状态
  // 设备监控 - 车位状态监测
  SPACE_MONITOR_STATUS: 'space_monitor_status', // 车位监测状态
  SPACE_MONITOR_ALARM_STATUS: 'space_monitor_alarm_status', // 车位告警状态
  SPACE_MONITOR_PROCESS_STATUS: 'space_monitor_process_status', // 车位处理状态

  // 设备监控 - 油车占位监测
  OIL_MONITOR_PROCESS_STATUS: 'oil_monitor_process_status', // 油车占位处置状态

  // 设备监控 - 汽车充电监测
  CAR_CHARGE_MONITOR_STATUS: 'car_charge_monitor_status', // 汽车充电监测状态
  CAR_CHARGE_MONITOR_ALARM_STATUS: 'car_charge_monitor_alarm_status', // 汽车充电告警状态
  CAR_CHARGE_MONITOR_PROCESS_STATUS: 'car_charge_monitor_process_status', // 汽车充电处理状态

  // 设备监控 - 两轮充电监测
  BIKE_CHARGE_MONITOR_STATUS: 'bike_charge_monitor_status', // 两轮充电监测状态
  BIKE_CHARGE_MONITOR_ALARM_STATUS: 'bike_charge_monitor_alarm_status', // 两轮充电告警状态
  BIKE_CHARGE_MONITOR_PROCESS_STATUS: 'bike_charge_monitor_process_status', // 两轮充电处理状态

  // 设备监控 - 共享充电监测
  SHARE_CHARGE_MONITOR_STATUS: 'share_charge_monitor_status', // 共享充电监测状态
  SHARE_CHARGE_MONITOR_ALARM_STATUS: 'share_charge_monitor_alarm_status', // 共享充电告警状态
  SHARE_CHARGE_MONITOR_PROCESS_STATUS: 'share_charge_monitor_process_status', // 共享充电处理状态

  // 巡检管理
  INSPECT_PLAN_TYPE: 'inspect_plan_type', // 巡检计划类型
  INSPECT_PLAN_CYCLE: 'inspect_plan_cycle', // 巡检计划执行周期
  INSPECT_PLAN_STATUS: 'inspect_plan_status', // 巡检计划状态
  INSPECT_TASK_STATUS: 'inspect_task_status', // 巡检任务状态
  INSPECT_REPORT_TYPE: 'inspect_report_type', // 巡检上报问题类型
  INSPECT_REPORT_STATUS: 'inspect_report_status', // 巡检上报状态
  INSPECT_TRACK_STATUS: 'inspect_track_status', // 巡检轨迹状态
  INSPECT_USER_STATUS: 'inspect_user_status', // 巡检人员状态
  INSPECT_USER_ONLINE_STATUS: 'inspect_user_online_status', // 巡检人员在线状态
  FENCE_MGMT_STATUS: 'fence_mgmt_status', // 围栏状态

  // 资产管理
  ASSET_INFO_TYPE: 'asset_info_type', // 资产类型
  ASSET_INFO_STATUS: 'asset_info_status', // 资产状态
  ASSET_CHECK_TYPE: 'asset_check_type', // 资产盘点类型
  ASSET_CHECK_STATUS: 'asset_check_status', // 资产盘点状态
  ASSET_STOCK_STATUS: 'asset_stock_status', // 资产库存状态
  SPARE_STOCK_STATUS: 'spare_stock_status', // 备件库存状态

  // 排班管理
  SCHEDULE_VIEW_SHIFT_TYPE: 'schedule_view_shift_type', // 排班班次类型
  SCHEDULE_VIEW_STATUS: 'schedule_view_status', // 排班状态
  HANDOVER_LOG_STATUS: 'handover_log_status', // 交接日志状态
  SHIFT_APPLY_STATUS: 'shift_apply_status', // 换班申请状态
} as const;

/** 字典类型枚举 - 统一导出 */
const DICT_TYPE = {
  ...AI_DICT,
  ...BPM_DICT,
  ...CRM_DICT,
  ...ERP_DICT,
  ...INFRA_DICT,
  ...IOT_DICT,
  ...MEMBER_DICT,
  ...MP_DICT,
  ...PAY_DICT,
  ...MALL_DICT,
  ...SYSTEM_DICT,
  ...COMMON_DICT,
  ...DATA_DICT,
  ...SHUNCHANG_DICT,
  ...ENERGYCHARGE_DICT,
  ...CHGPARKMGT_DICT,
} as const;

export { DICT_TYPE };
