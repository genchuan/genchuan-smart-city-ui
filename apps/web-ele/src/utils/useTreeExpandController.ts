import { nextTick } from 'vue';
// 树形结构展开收缩根据函数封装
export function useTreeExpandController(treeRef) {
  const expandAllNodes = (nodes = []) => {
    nodes.forEach((node) => {
      node.expanded = true;
      if (node.childNodes?.length) {
        expandAllNodes(node.childNodes);
      }
    });
  };

  const collapseAllNodes = (nodes = []) => {
    nodes.forEach((node) => {
      node.expanded = false;
      if (node.childNodes?.length) {
        collapseAllNodes(node.childNodes);
      }
    });
  };
// 获取根节点
  const getRootNodes = () => {
    return treeRef.value?.store?.root?.childNodes || [];
  };
// 展开全部
  const expandAll = async () => {
    await nextTick();
    expandAllNodes(getRootNodes());
  };
// 收起全部
  const collapseAll = async () => {
    await nextTick();
    collapseAllNodes(getRootNodes());
  };
// 控制展开/收缩
  const toggle = async () => {
    await nextTick();
    const nodes = getRootNodes();
    if (nodes.length === 0) return;

    const isExpanded = nodes.some((n) => n.expanded);
    isExpanded ? collapseAllNodes(nodes) : expandAllNodes(nodes);
  };

  return {
    expandAll,
    collapseAll,
    toggle,
  };
}
