import { getInspectOpStationOptions } from '#/api/genchuan/industry/chargePark/inspectOp/stationOptions';

const DEFAULT_STATION_OPTIONS = [
  {
    label: '泉州丰泽充电场站',
    value: 1001,
    longitude: 118.675_324,
    latitude: 24.896_541,
    regionName: '丰泽区',
  },
  {
    label: '泉州鲤城公共停车场',
    value: 1002,
    longitude: 118.589_421,
    latitude: 24.908_356,
    regionName: '鲤城区',
  },
  {
    label: '洛江万安充停站',
    value: 1003,
    longitude: 118.673_115,
    latitude: 24.943_231,
    regionName: '洛江区',
  },
  {
    label: '晋江池店综合能源站',
    value: 1004,
    longitude: 118.564_821,
    latitude: 24.806_942,
    regionName: '晋江市',
  },
  {
    label: '石狮服装城充停站',
    value: 1005,
    longitude: 118.652_914,
    latitude: 24.731_268,
    regionName: '石狮市',
  },
  {
    label: '南安水头交通枢纽站',
    value: 1006,
    longitude: 118.389_752,
    latitude: 24.738_946,
    regionName: '南安市',
  },
];

export const stationOptions = [...DEFAULT_STATION_OPTIONS];

let stationOptionsLoaded = false;
let stationOptionsLoadingPromise = null;

function mapStationOptionItem(item) {
  return {
    label:
      item.name ||
      item.stationName ||
      item.label ||
      `场站${item.id ?? ''}`,
    value: item.id ?? item.stationId,
    longitude: item.longitude ?? item.lng,
    latitude: item.latitude ?? item.lat,
    regionName: item.regionName || item.areaName || item.region || '-',
  };
}

/** 加载巡检运营模块公共场站下拉选项 */
export async function loadInspectOpStationOptions(params) {
  if (stationOptionsLoaded) return;
  if (stationOptionsLoadingPromise) {
    await stationOptionsLoadingPromise;
    return;
  }

  stationOptionsLoadingPromise = (async () => {
    try {
      const response = await getInspectOpStationOptions({
        pageNo: params?.pageNo || 1,
        pageSize: params?.pageSize || 200,
      });
      const list = Array.isArray(response)
        ? response
        : Array.isArray(response?.list)
          ? response.list
          : Array.isArray(response?.data)
            ? response.data
            : [];
      const options = list
        .map(mapStationOptionItem)
        .filter((item) => item.value !== undefined && item.value !== null);

      if (options.length > 0) {
        stationOptions.splice(0, stationOptions.length, ...options);
        stationOptionsLoaded = true;
      }
    } catch (error) {
      console.error('加载场站选项失败，使用默认数据:', error);
    } finally {
      stationOptionsLoadingPromise = null;
    }
  })();

  await stationOptionsLoadingPromise;
}

/** @deprecated 请使用 loadInspectOpStationOptions */
export const loadCycleReportStationOptions = loadInspectOpStationOptions;

export function getStationName(stationId) {
  return (
    stationOptions.find((item) => Number(item.value) === Number(stationId))
      ?.label || '-'
  );
}

export function getStationIdByName(stationName) {
  return stationOptions.find((item) => item.label === stationName)?.value || '';
}
