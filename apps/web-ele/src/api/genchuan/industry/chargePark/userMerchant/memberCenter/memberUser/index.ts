import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace MemberUserApi {
  /** 会员用户信息 */
  export interface User {
    areaId?: number;
    areaName?: string;
    avatar?: string;
    birthday?: number;
    createTime?: number | string;
    experience?: number;
    groupId?: number;
    groupName?: string;
    id?: number;
    levelId?: number;
    levelName: string;
    loginDate?: number | string;
    loginIp: string;
    mark: string;
    mobile: string;
    name?: string;
    nickname?: string;
    point?: number;
    registerIp: string;
    renewStatus?: boolean | number;
    sex: number;
    status: number;
    tagIds?: number[];
    tagNames?: string[];
    totalPoint?: number;
  }

  /** 会员用户等级更新信息 */
  export interface UserUpdateLevelReqVO {
    id: number;
    levelId: number;
    reason?: string;
  }

  /** 会员用户积分更新信息 */
  export interface UserPointUpdateReqVO {
    id: number;
    point: number;
  }

  export interface UserPageReqVO extends PageParam {
    createTime?: string;
    groupId?: number;
    levelId?: number;
    loginDate?: string;
    mobile?: string;
    nickname?: string;
    status?: number;
    tagIds?: number[];
  }

  export interface UserOperateReqVO {
    ids: number[];
  }

  export interface UserChartReqVO {
    timeRange?: string;
  }

  export interface UserChartVO {
    memberGrowthTrend: Array<{
      count: number;
      date: string;
    }>;
    newMemberCount: number;
    totalMemberCount: number;
  }
}

/** 查询会员用户列表 */
export function getUserPage(params: MemberUserApi.UserPageReqVO) {
  return requestClient.get<PageResult<MemberUserApi.User>>(
    '/usermerchant/member-user/page',
    {
      params,
    },
  );
}

/** 查询会员用户详情 */
export function getUser(id: number) {
  return requestClient.get<MemberUserApi.User>(
    '/usermerchant/member-user/get',
    {
      params: { id },
    },
  );
}

/** 新增会员用户 */
export function createUser(data: MemberUserApi.User) {
  return requestClient.post('/usermerchant/member-user/create', data);
}

/** 修改会员用户 */
export function updateUser(data: MemberUserApi.User) {
  return requestClient.put('/usermerchant/member-user/update', data);
}

/** 导入会员用户 */
export function importUser(file: File) {
  return requestClient.upload('/usermerchant/member-user/import', {
    file,
  });
}

/** 导出会员用户 */
export function exportUser(params: MemberUserApi.UserPageReqVO) {
  return requestClient.download('/usermerchant/member-user/export', {
    params,
  });
}

/** 启用会员用户 */
export function enableUser(data: MemberUserApi.UserOperateReqVO) {
  return requestClient.put('/usermerchant/member-user/enable', data);
}

/** 禁用会员用户 */
export function disableUser(data: MemberUserApi.UserOperateReqVO) {
  return requestClient.put('/usermerchant/member-user/disable', data);
}

/** 会员统计 */
export function getUserChart(params?: MemberUserApi.UserChartReqVO) {
  return requestClient.get<MemberUserApi.UserChartVO>(
    '/usermerchant/member-user/chart',
    {
      params,
    },
  );
}

/** 修改会员用户等级 */
export function updateUserLevel(data: MemberUserApi.UserUpdateLevelReqVO) {
  return requestClient.put('/usermerchant/member-user/update-level', data);
}

/** 修改会员用户积分 */
export function updateUserPoint(data: MemberUserApi.UserPointUpdateReqVO) {
  return requestClient.put('/usermerchant/member-user/update-point', data);
}
