import { getInspectUserPage } from '#/api/genchuan/industry/chargePark/inspectOp/inspectMgmt/inspectUser';

/** 排班模块下拉与 mock 用巡检人员选项（与巡检任务列表一致走分页接口） */
const DEFAULT_USER_OPTIONS = [
  { label: '张三', position: '巡检员', value: 1 },
  { label: '李四', position: '值班长', value: 2 },
  { label: '王五', position: '设备工程师', value: 3 },
  { label: '赵六', position: '安全巡检员', value: 4 },
  { label: '陈七', position: '运维专员', value: 5 },
];

export const userOptions = [...DEFAULT_USER_OPTIONS];
let userOptionsLoaded = false;
let userOptionsLoadingPromise = null;

export async function loadScheduleUserOptions() {
  if (userOptionsLoaded) return;
  if (userOptionsLoadingPromise) {
    await userOptionsLoadingPromise;
    return;
  }

  userOptionsLoadingPromise = (async () => {
    try {
      const response = await getInspectUserPage({
        pageNo: 1,
        pageSize: 200,
        status: '1',
      });
      const pageResult = response?.list ? response : response?.data || response;
      const list = Array.isArray(pageResult?.list) ? pageResult.list : [];
      const options = list
        .map((item) => ({
          label: item.name || item.userName || `巡检人员${item.id ?? ''}`,
          value: item.id ?? item.userId,
          position:
            item.positionName ||
            item.position ||
            item.postName ||
            item.jobTitle ||
            '-',
        }))
        .filter((item) => item.value !== undefined && item.value !== null);

      if (options.length > 0) {
        userOptions.splice(0, userOptions.length, ...options);
        userOptionsLoaded = true;
      }
    } catch (error) {
      console.error('加载巡检人员选项失败，使用默认数据:', error);
    } finally {
      userOptionsLoadingPromise = null;
    }
  })();

  await userOptionsLoadingPromise;
}
