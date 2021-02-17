<template>
  <div
    :class="{
      changed: file.status == 0,
      added: file.status == 1,
      removed: file.status == -1,
    }"
  >
    {{ path }}
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "file",
  props: {
    path: String,
    file: Object,
  },
});
</script>

<style scoped>
.changed {
    color: orange;
}
.added {
    color: green;
}
.removed {
    color: red;
}
</style>