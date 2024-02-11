<template>
    <ul>
        <li v-for="node in root?.children" :key="node.id">
            <a :href="node.url" target="_blank">{{ node.label }}</a>
            <MNodeItem :root="node" />
        </li>
    </ul>
</template>

<script lang="ts" setup>
import type MNode from '@/types/mnode';

const props = defineProps<{
  root: MNode;
}>();
</script>