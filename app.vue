<template>
  <div>
    <input type="text" v-model="url" @keyup.enter="search" />

    <pre ref="GraphView" />
  </div>
</template>

<script lang="ts" setup>
import mermaid from 'mermaid';
import { ref } from 'vue';
import type { MermaidConfig, RenderResult } from 'mermaid';

const renderDiagram = async (
  config: MermaidConfig,
  code: string,
  id: string
): Promise<RenderResult> => {
  // Should be able to call this multiple times without any issues.
  mermaid.initialize(config);
  return await mermaid.render(id, code);
};

const url = ref('');
const GraphView = ref<HTMLPreElement | null>(null);

const search = () => {
  localStorage.setItem('url', url.value);
  fetch(`api/${encodeURIComponent(url.value)}`)
    .then((res) => res.json())
    .then((data) => {
      interface MNode {
        id: number;
        label: string;
        url: string;
        children: MNode[];
      }

      const root = {
        id: 0,
        label: "root",
        url: "",
        children: [],
      } as MNode;

      let counter = 0;

      function appendNode(url: string) {
        let segments = url.split("/").filter(Boolean);
        // 把域名逆转
        if (segments.length > 2) {
          const news = segments[1].split('.').reverse();
          segments.splice(1, 1, ...news);
        }
        // 如果第一个是http或https，去掉
        if (segments[0] === 'http:' || segments[0] === 'https:') {
          segments = segments.slice(1);
        }

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
              id: ++counter,
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
      for (const url of data) {
        appendNode(url);
      }

      function graphString(node: MNode): string {
        let head = `${node.id}(${node.label})`;
        let result = "";
        node.children.forEach((child) => {
          if (child.label !== undefined && child.label !== null && child.label.length > 0) {
            result += `${head}-->${child.id}(${child.label});\n`;
            result += graphString(child);
          }
        });
        return result;
      }

      let code = 'graph TD;' + graphString(root);

      // 刷新mermaid


      renderDiagram(
        {},
        code,
        'graph-div'
      ).then((res: RenderResult) => {
        const graphDiv = GraphView.value;
        if (graphDiv) {
          graphDiv.innerHTML = res.svg;
          graphDiv.setAttribute('height', '100%');
          graphDiv.style.maxWidth = '100%';
          if (res?.bindFunctions) {
            res?.bindFunctions(graphDiv);
          }
        }
      });

    })
    .catch((err) => {
      console.log(err)
    });
}

onMounted(() => {
  if (localStorage === undefined) return;
  url.value = localStorage.getItem('url') || '';

});
</script>