<template>
  <div>
    <input type="text" v-model="inputUrl" @keyup.enter="search" />
    <button @click="search">search</button>
    <button @click="deeper">deeper</button>

    <MNodeItem :root="root" />

    <!-- <pre ref="GraphView" /> -->
  </div>
</template>

<script lang="ts" setup>
import mermaid from 'mermaid';
import { ref } from 'vue';
import type { MermaidConfig, RenderResult } from 'mermaid';
import type MNode from './types/mnode';

const renderDiagram = async (
  config: MermaidConfig,
  code: string,
  id: string
): Promise<RenderResult> => {
  // Should be able to call this multiple times without any issues.
  mermaid.initialize(config);
  return await mermaid.render(id, code);
};

const inputUrl = ref('');
const GraphView = ref<HTMLPreElement | null>(null);
let urls = [] as string[];
let code = "";
const root = ref({
  id: 0,
  label: "[root]",
  url: "",
  children: [],
} as MNode);

const search = () => {
  localStorage.setItem('url', inputUrl.value);
  urls = [];
  root.value.children = [];
  code = "";
  appendGraph(encodeURIComponent(inputUrl.value));
}

const deeper = () => {
  for (const url of urls) {
    // 判断url是否是css或者js，如果是就跳过
    if (url.endsWith('.css') || url.endsWith('.js')) {
      continue;
    }
    if (url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.gif') || url.endsWith('.svg')) {
      continue;
    }
    const filename = url.split('/').reverse()[0];
    if (filename.includes('.')) {
      const allow = ['html', 'htm', 'php', 'asp', 'aspx', 'jsp', 'jspx', 'shtml', 'xml', 'xhtml', 'json'];
      const ext = filename.split('.').reverse()[0];
      if (!allow.includes(ext)) {
        continue;
      }
    }
    appendGraph(encodeURIComponent(url));
  }
}

const appendGraph = async (url: string) => {
  fetch(`api/${url}`)
    .then((res) => res.json())
    .then((data) => {

      let counter = 0;

      // Example usage:
      for (const url of data) {
        appendNode(url);
      }
      urls.push(...data);

      function appendNode(url: string) {
        let segments = url.split("/").filter(Boolean);
        // // 把域名逆转
        // if (segments.length > 2) {
        //   const news = segments[1].split('.').reverse();
        //   segments.splice(1, 1, ...news);
        // }
        // 如果第一个是http或https，去掉
        // if (segments[0] === 'http:' || segments[0] === 'https:') {
        //   segments = segments.slice(1);
        // }

        let lastNode = root.value;

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

      // 去掉叶子节点结尾的/
      function removeLastSlash(node: MNode) {
        if (node.children.length === 0) {
          node.url = node.url.slice(0, -1);
        } else {
          node.children.forEach(removeLastSlash);
        }
      }
      removeLastSlash(root.value);

      //   function graphString(node: MNode): string {
      //     let head = `${node.id}(${node.label})`;
      //     let result = "";
      //     node.children.forEach((child) => {
      //       if (child.label !== undefined && child.label !== null && child.label.length > 0) {
      //         result += `${head}-->${child.id}(${child.label});\n`;
      //         result += graphString(child);
      //       }
      //     });
      //     return result;
      //   }

      //   code += graphString(root.value);

      //   // 刷新mermaid

      //   renderDiagram(
      //     {},
      //     'graph LR;' + code,
      //     'graph-div'
      //   ).then((res: RenderResult) => {
      //     const graphDiv = GraphView.value;
      //     if (graphDiv) {
      //       graphDiv.innerHTML = res.svg;
      //       graphDiv.setAttribute('height', '100%');
      //       graphDiv.style.maxWidth = '100%';
      //       if (res?.bindFunctions) {
      //         res?.bindFunctions(graphDiv);
      //       }
      //     }
      //   });

    })
    .catch((err) => {
      console.log(err)
    });
};

onMounted(() => {
  if (localStorage === undefined) return;
  inputUrl.value = localStorage.getItem('url') || '';

});
</script>