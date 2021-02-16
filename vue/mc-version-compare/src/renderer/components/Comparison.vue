<template>
  <div id="comparison">
    <div id="files"></div>
    <div id="file1"></div>
    <div id="file2"></div>
  </div>
</template>

<style scoped>
#comparison {
  display: flex;
  justify-content: space-between;
}
</style>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "comparison",
});
</script>