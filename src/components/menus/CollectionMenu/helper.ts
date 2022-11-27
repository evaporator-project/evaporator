import { DataNode } from 'antd/es/tree';

export function handleDrop(treeData: any, info: any): any {
  const dropKey = info.node.key;
  const dragKey = info.dragNode.key;
  const dragNodeType = info.dragNode.nodeType;
  const dropPos = info.node.pos.split('-');
  const dragPos = info.dragNode.pos.split('-');
  const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

  const loop = (
    data: DataNode[],
    key: React.Key,
    callback: (node: DataNode, i: number, data: DataNode[]) => void
  ) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].key === key) {
        return callback(data[i], i, data);
      }
      if (data[i].children) {
        loop(data[i].children!, key, callback);
      }
    }
  };

  const data = JSON.parse(JSON.stringify(treeData));

  // Find dragObject
  let dragObj: DataNode;
  loop(data, dragKey, (item, index, arr) => {
    arr.splice(index, 1);
    dragObj = item;
  });

  if (!info.dropToGap) {
    // Drop on the content
    loop(data, dropKey, (item) => {
      item.children = item.children || [];
      // where to insert 示例添加到头部，可以是随意位置
      item.children.unshift(dragObj);
    });
  } else if (
    ((info.node as any).props.children || []).length > 0 && // Has children
    (info.node as any).props.expanded && // Is expanded
    dropPosition === 1 // On the bottom gap
  ) {
    loop(data, dropKey, (item) => {
      item.children = item.children || [];
      // where to insert 示例添加到头部，可以是随意位置
      item.children.unshift(dragObj);
      // in previous version, we use item.children.push(dragObj) to insert the
      // item to the tail of the children
    });
  } else {
    let ar: DataNode[] = [];
    let i: number;
    loop(data, dropKey, (_item, index, arr) => {
      ar = arr;
      i = index;
    });
    if (dropPosition === -1) {
      ar.splice(i!, 0, dragObj!);
    } else {
      ar.splice(i! + 1, 0, dragObj!);
    }
  }

  // fromNodePath和toParentPath
  let fromNodePath = null;
  let toParentPath = null;
  let toIndex = 0;
  let NodeAll: any[] = [];
  const dfsNode = (d: any, key: string | number, NodeArray: any[]) => {
    d.children.forEach((e: any) => {
      dfsNode(e, key, [...NodeArray, e.key]);
    });
    if (!d.children.length) {
      NodeAll.push(NodeArray);
    }
  };
  //fromNodePath
  treeData.map((e: any) => {
    const arr = [e.key];
    dfsNode(e, dragKey, arr);
  });
  NodeAll = NodeAll.filter((e) => e.includes(dragKey))[0];
  fromNodePath = NodeAll.splice(0, NodeAll.indexOf(dragKey) + 1);
  NodeAll = [];
  //toParentPath
  data.map((e: any) => {
    const arr = [e.key];
    dfsNode(e, dragKey, arr);
  });
  NodeAll = NodeAll.filter((e) => e.includes(dragKey))[0];
  toParentPath = NodeAll.splice(0, NodeAll.indexOf(dragKey));
  if (!toParentPath.length) toParentPath = null;
  NodeAll = [];

  //计算toIndex
  const dfsNodeIndex = (d: any, key: string | number) => {
    const arr: any = [];
    let res = null;
    let resP: any = [];
    d.forEach((e: any) => {
      arr.push(e);
    });
    while (arr.length) {
      const temp = arr.shift();
      temp.children.forEach((e: any) => {
        if (e.key == key) {
          resP = temp;
          res = [temp.key];
        }
        arr.push(e);
      });
    }
    return [resP, res];
  };

  //判断不成立的情况
  if (dfsNodeIndex(data, dragKey)[0].nodeType) {
    if (dragNodeType == 2 && dfsNodeIndex(data, dragKey)[0].nodeType !== 1)
      return;
    if (dragNodeType == 3 && dfsNodeIndex(data, dragKey)[0].nodeType !== 3)
      return;
    if (dragNodeType == 1 && dfsNodeIndex(data, dragKey)[0].nodeType !== 3)
      return;
  } else {
    if (dragNodeType !== 3) return;
  }

  const fromNode = dfsNodeIndex(treeData, dragKey)[1];
  const toNode = dfsNodeIndex(data, dragKey)[1];
  const Td = dfsNodeIndex(treeData, dragKey)[0].children;
  const Dd = dfsNodeIndex(data, dragKey)[0].children;
  let tIndex = 0;
  let dIndex = 0;
  if (fromNode == null && toNode == null) {
    data.forEach((e: any, i: number) => {
      if (e.key == dragKey) dIndex = i;
    });
    treeData.forEach((e: any, i: number) => {
      if (e.key == dragKey) tIndex = i;
    });
    if (tIndex < dIndex) {
      toIndex = dIndex + 1;
    } else {
      toIndex = dIndex;
    }
  } else if (toNode == null || fromNode == null) {
    data.forEach((e: any, i: number) => {
      if (e.key == dragKey) toIndex = i;
    });
  } else if (fromNode[0] == toNode[0]) {
    Dd.forEach((e: any, i: number) => {
      if (e.key == dragKey) dIndex = i;
    });
    Td.forEach((e: any, i: number) => {
      if (e.key == dragKey) tIndex = i;
    });
    if (tIndex < dIndex) {
      toIndex = dIndex + 1;
    } else {
      toIndex = dIndex;
    }
  } else {
    Dd.forEach((e: any, i: number) => {
      if (e.key == dragKey) toIndex = i;
    });
  }

  return {
    fromNodePath,
    toParentPath,
    toIndex,
  };
}
