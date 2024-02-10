<template>
  <div>
    <input type="text" v-model="url" @keyup.enter="search" />

    <div>
      {{ result }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const url = ref('');
const result = ref('');


const search = () => {
  fetch(`api/${encodeURIComponent(url.value)}`)
    .then((res) => res.json())
    .then((data) => {
      result.value = data
    })
    .catch((err) => {
      console.log(err)
    });
}
</script>