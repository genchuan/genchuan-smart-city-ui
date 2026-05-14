const TMAP_KEY = 'ZOOBZ-TLBLT-M53X7-LPOVN-RNHKZ-Q5F5X';

export const loadTMap = (): Promise<any> => {
  return new Promise((resolve) => {
    if ((window as any).TMap) {
      resolve((window as any).TMap);
      return;
    }

    const existingScript = document.querySelector('#tmap-gl-js');
    if (existingScript) {
      existingScript.addEventListener('load', () =>
        resolve((window as any).TMap),
      );
      return;
    }

    const script = document.createElement('script');
    script.id = 'tmap-gl-js';
    script.src = `https://map.qq.com/api/gljs?libraries=tools&v=1.exp&key=${TMAP_KEY}`;
    script.async = true;
    script.addEventListener('load', () => resolve((window as any).TMap));
    document.head.append(script);
  });
};

/**
 * 通过腾讯地图驾车路径规划 WebService 接口获取沿真实道路的点串。
 * 用 JSONP 绕开 CORS。
 *
 * @param start {lat, lng}
 * @param end   {lat, lng}
 * @returns Promise<number[][]>  每个元素 [lng, lat],跟前端现有 pathPoints 格式一致
 */
export const fetchDrivingPath = (
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
): Promise<number[][]> => {
  return new Promise((resolve, reject) => {
    const cbName = `__tmap_driving_cb_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
    const script = document.createElement('script');
    const timer = setTimeout(() => {
      delete (window as any)[cbName];
      script.remove();
      reject(new Error('腾讯路径规划接口超时'));
    }, 8000);
    (window as any)[cbName] = (data: any) => {
      clearTimeout(timer);
      delete (window as any)[cbName];
      script.remove();
      try {
        if (data.status !== 0) {
          const err: any = new Error(data.message || '路径规划失败');
          err.status = data.status;
          return reject(err);
        }
        const arr: number[] = data.result?.routes?.[0]?.polyline || [];
        if (arr.length < 2) return reject(new Error('路径返回为空'));
        // 解码:首对真实坐标,后续每对为 (lat_delta, lng_delta)/1e6,累加得到下一个点
        const latLngs: [number, number][] = [[arr[0], arr[1]]];
        for (let i = 2; i < arr.length; i += 2) {
          const prev = latLngs.at(-1)!;
          latLngs.push([
            prev[0] + arr[i] / 1_000_000,
            prev[1] + arr[i + 1] / 1_000_000,
          ]);
        }
        // 输出 [lng, lat] 顺序,与 path_plan 现有数据保持一致
        resolve(latLngs.map(([lat, lng]) => [lng, lat]));
      } catch (e) {
        reject(e);
      }
    };
    script.src = `https://apis.map.qq.com/ws/direction/v1/driving/?from=${start.lat},${start.lng}&to=${end.lat},${end.lng}&key=${TMAP_KEY}&output=jsonp&callback=${cbName}`;
    script.addEventListener('error', () => {
      clearTimeout(timer);
      delete (window as any)[cbName];
      reject(new Error('JSONP 加载失败'));
    });
    document.head.append(script);
  });
};
