import { MemberGroupApi } from './memberGroup';
import { MemberLevelApi } from './memberLevel';
import { MemberTagApi } from './memberTag';

type OptionSource = {
  id?: number;
  name?: string;
  status?: number | string;
};

function buildOptions(list: OptionSource[] = []) {
  return list
    .filter((item) => item.id !== undefined && item.name)
    .map((item) => ({
      ...item,
      label: item.name,
      value: item.id,
    }));
}

export async function getMemberTagOptions() {
  const result = await MemberTagApi.getMemberTagPage({
    pageNo: 1,
    pageSize: 100,
  });

  return buildOptions(result.list);
}

export async function getMemberLevelOptions() {
  const result = await MemberLevelApi.getMemberLevelPage({
    pageNo: 1,
    pageSize: 100,
  });

  return buildOptions(result.list);
}

export async function getMemberGroupOptions() {
  const result = await MemberGroupApi.getMemberGroupPage({
    pageNo: 1,
    pageSize: 100,
  });

  return buildOptions(result.list);
}
