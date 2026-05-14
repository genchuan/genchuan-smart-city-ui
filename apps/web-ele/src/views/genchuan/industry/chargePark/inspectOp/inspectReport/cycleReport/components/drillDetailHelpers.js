export function stripReadonlyGridColumns(columns = []) {
  return columns
    .filter((col) => col.type !== 'checkbox')
    .filter((col) => {
      if (col.field === 'actions' || col.slots?.default === 'actions') {
        return false;
      }
      if (String(col.title || '').includes('操作')) {
        return false;
      }
      return true;
    })
    .map((col) => {
      const next = { ...col };
      // delete next.slots;
      return next;
    });
}

export function unwrapPageResult(response) {
  const pageResult = response?.list ? response : response?.data || response;
  const list = Array.isArray(pageResult?.list) ? pageResult.list : [];
  const total = pageResult?.total ?? list.length;
  return { list, total };
}
