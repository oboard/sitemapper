interface MNode {
  label: string;
  url: string;
  children: MNode[];
}

const root = {
  label: "root",
  url: "",
  children: [],
} as MNode;

function appendNode(url: string) {
  const segments = url.split("/").filter(Boolean);
  let lastNode = root;

  function next(segment: string): MNode | undefined {
    for (const node of lastNode.children) {
      if (node.label === segment) {
        return node;
      }
    }
    return undefined;
  }
  for (const segment of segments) {
    let node = next(segment);
    if (node) {
      lastNode = node;
    } else {
      node = {
        url: lastNode.url + segment + "/",
        label: segment,
        children: [],
      };
      lastNode.children.push(node);
      lastNode = node;
    }
  }
}
// Example usage:
appendNode("https://www.baidu.com/more/games");
appendNode("https://www.baidu.com/more/only");
console.log(JSON.stringify(root, null, 2));
