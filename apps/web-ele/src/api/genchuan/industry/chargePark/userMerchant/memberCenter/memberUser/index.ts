import type { PageParam, PageResult } from '@vben/request';

import { normalizeQueryDateTimeRanges } from '#/api/genchuan/industry/chargePark/userMerchant/utils/query';
import { requestClient } from '#/api/request';

import { MemberGroupApi } from '../memberGroup';
import { MemberLevelApi } from '../memberLevel';
import { MemberTagApi } from '../memberTag';

export namespace MemberUserApi {
  export interface User {
    areaId?: number;
    areaName?: string;
    autoRenew?: boolean | number;
    avatar?: string;
    birthday?: number | string;
    createTime?: number | string;
    creator?: string;
    experience?: number;
    expireTime?: number | string;
    groupId?: number;
    groupName?: string;
    id?: number;
    levelId?: number;
    levelName?: string;
    loginDate?: number | string;
    loginIp?: string;
    mark?: string;
    mobile: string;
    name?: string;
    nickname?: string;
    password?: string;
    point?: number;
    registerIp?: string;
    registerTerminal?: string;
    sex?: number;
    status: number;
    tagIds?: number[] | string;
    tagNames?: string[];
    updater?: string;
    updateTime?: number | string;
  }

  export interface UserPageReqVO extends PageParam {
    areaId?: number;
    autoRenew?: boolean | number;
    avatar?: string;
    birthday?: string[];
    createTime?: string[];
    creator?: string;
    experience?: number;
    expireTime?: string[];
    groupId?: number;
    levelId?: number;
    loginDate?: string[];
    loginIp?: string;
    mark?: string;
    mobile?: string;
    name?: string;
    nickname?: string;
    point?: number;
    registerIp?: string;
    registerTerminal?: string;
    sex?: number;
    status?: number;
    tagIds?: number[] | string;
    updater?: string;
    updateTime?: string[];
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

type NameSource = {
  id?: number;
  name?: string;
};

type NameMap = Map<string, string>;

type MemberNameMaps = {
  groupNameMap?: NameMap;
  levelNameMap?: NameMap;
  tagNameMap?: NameMap;
};

let groupNameMapCache: Promise<NameMap> | undefined;
let levelNameMapCache: Promise<NameMap> | undefined;
let tagNameMapCache: Promise<NameMap> | undefined;

function normalizeTagIdsArray(value: MemberUserApi.User['tagIds']) {
  const ids = Array.isArray(value) ? value : String(value ?? '').split(',');

  return ids
    .map((item) => String(item).trim())
    .filter(Boolean)
    .map(Number)
    .filter((item) => Number.isFinite(item));
}

function normalizeTagIdsValue(value: MemberUserApi.User['tagIds']) {
  if (Array.isArray(value)) {
    return value
      .filter((item) => item !== undefined && item !== null)
      .join(',');
  }

  return value;
}

async function loadNameMap<T extends NameSource>(
  getPage: (params: PageParam) => Promise<PageResult<T>>,
) {
  const pageSize = 200;
  const firstPage = await getPage({
    pageNo: 1,
    pageSize,
  });
  const total = Number(firstPage.total ?? firstPage.list?.length ?? 0);
  const pageCount = Math.ceil(total / pageSize);
  const list = [...(firstPage.list || [])];

  if (pageCount > 1) {
    const restPages = await Promise.all(
      Array.from({ length: pageCount - 1 }, (_, index) =>
        getPage({
          pageNo: index + 2,
          pageSize,
        }),
      ),
    );

    list.push(...restPages.flatMap((page) => page.list || []));
  }

  return new Map(
    list
      .filter((item) => item.id !== undefined && item.name)
      .map((item) => [String(item.id), item.name]),
  );
}

async function getGroupNameMap() {
  groupNameMapCache ||= loadNameMap((params) =>
    MemberGroupApi.getMemberGroupPage(params),
  ).catch((error) => {
    groupNameMapCache = undefined;
    throw error;
  });

  return await groupNameMapCache;
}

async function getLevelNameMap() {
  levelNameMapCache ||= loadNameMap((params) =>
    MemberLevelApi.getMemberLevelPage(params),
  ).catch((error) => {
    levelNameMapCache = undefined;
    throw error;
  });

  return await levelNameMapCache;
}

async function getTagNameMap() {
  tagNameMapCache ||= loadNameMap((params) =>
    MemberTagApi.getMemberTagPage(params),
  ).catch((error) => {
    tagNameMapCache = undefined;
    throw error;
  });

  return await tagNameMapCache;
}

async function getSafeNameMap(
  getNameMap: () => Promise<NameMap>,
  logLabel: string,
) {
  try {
    return await getNameMap();
  } catch (error) {
    console.error(`[memberUser] load ${logLabel} names failed:`, error);
    return undefined;
  }
}

async function getSafeMemberNameMaps(): Promise<MemberNameMaps> {
  const [groupNameMap, levelNameMap, tagNameMap] = await Promise.all([
    getSafeNameMap(getGroupNameMap, 'member group'),
    getSafeNameMap(getLevelNameMap, 'member level'),
    getSafeNameMap(getTagNameMap, 'member tag'),
  ]);

  return {
    groupNameMap,
    levelNameMap,
    tagNameMap,
  };
}

function getMappedName(id?: number, nameMap?: NameMap) {
  if (id === undefined || id === null) {
    return undefined;
  }

  return nameMap?.get(String(id));
}

function normalizeTagNamesValue(
  data: MemberUserApi.User,
  tagNameMap?: NameMap,
) {
  const tagName = getMappedName(data.levelId, tagNameMap);

  return tagName ? [tagName] : [];
}

function normalizeUser(data?: MemberUserApi.User, nameMaps?: MemberNameMaps) {
  if (!data) {
    return data;
  }

  const tagIds = normalizeTagIdsArray(data.tagIds);

  return {
    ...data,
    groupName:
      data.groupName || getMappedName(data.groupId, nameMaps?.groupNameMap),
    levelName:
      data.levelName || getMappedName(data.levelId, nameMaps?.levelNameMap),
    tagIds,
    tagNames: normalizeTagNamesValue(data, nameMaps?.tagNameMap),
  };
}

function buildUserPayload(data: MemberUserApi.User) {
  const {
    groupName: _groupName,
    levelName: _levelName,
    tagNames: _tagNames,
    ...payload
  } = data;

  return {
    ...payload,
    tagIds: normalizeTagIdsValue(data.tagIds),
  };
}

function buildUserQuery(params: MemberUserApi.UserPageReqVO) {
  return normalizeQueryDateTimeRanges(
    {
      ...params,
      tagIds: normalizeTagIdsValue(params.tagIds),
    },
    ['birthday', 'createTime', 'expireTime', 'loginDate', 'updateTime'],
  );
}

export async function getUserPage(params: MemberUserApi.UserPageReqVO) {
  const [result, nameMaps] = await Promise.all([
    requestClient.get<PageResult<MemberUserApi.User>>(
      '/usermerchant/member-user/page',
      {
        params: buildUserQuery(params),
      },
    ),
    getSafeMemberNameMaps(),
  ]);

  return {
    ...result,
    list: Array.isArray(result.list)
      ? result.list.map(
          (item) => normalizeUser(item, nameMaps) as MemberUserApi.User,
        )
      : [],
  };
}

export async function getUserCount(params: MemberUserApi.UserPageReqVO) {
  const result = await requestClient.get<PageResult<MemberUserApi.User>>(
    '/usermerchant/member-user/page',
    {
      params: buildUserQuery({
        ...params,
        pageNo: 1,
        pageSize: 1,
      }),
    },
  );

  return Number(result.total ?? result.list?.length ?? 0);
}

export async function getUser(id: number) {
  const [result, nameMaps] = await Promise.all([
    requestClient.get<MemberUserApi.User>('/usermerchant/member-user/get', {
      params: { id },
    }),
    getSafeMemberNameMaps(),
  ]);

  return normalizeUser(result, nameMaps) as MemberUserApi.User;
}

export function createUser(data: MemberUserApi.User) {
  return requestClient.post(
    '/usermerchant/member-user/create',
    buildUserPayload(data),
  );
}

export function updateUser(data: MemberUserApi.User) {
  return requestClient.put(
    '/usermerchant/member-user/update',
    buildUserPayload(data),
  );
}

export function importUser(file: File) {
  return requestClient.upload('/usermerchant/member-user/import', {
    file,
  });
}

export function importUserTemplate() {
  return requestClient.download('/usermerchant/member-user/template', {
    responseReturn: 'raw',
  });
}

export function exportUser(params: MemberUserApi.UserPageReqVO) {
  return requestClient.download('/usermerchant/member-user/export', {
    params: buildUserQuery(params),
  });
}

export function enableUser(data: MemberUserApi.UserOperateReqVO) {
  return requestClient.put('/usermerchant/member-user/enable', data);
}

export function disableUser(data: MemberUserApi.UserOperateReqVO) {
  return requestClient.put('/usermerchant/member-user/disable', data);
}

export function getUserChart(params?: MemberUserApi.UserChartReqVO) {
  return requestClient.get<MemberUserApi.UserChartVO>(
    '/usermerchant/member-user/chart',
    {
      params,
    },
  );
}
