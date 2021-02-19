<template>
  <li>
    <div
      :class="{
        changed: item.status === 0,
        added: item.status === 1,
        removed: item.status === -1,
        folder: isFolder,
        file: !isFolder
      }"
      @click="toggleOrDisplay"
    >
      <span v-if="isFolder"> [ {{ isOpen ? "-" : "+" }} ] </span>
      {{ item.name }}
    </div>
    <ul v-if="isFolder" v-show="isOpen">
      <file v-for="(child, index) in item.children" :key="index" :item="child" />
    </ul>
  </li>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "file",
  props: {
    item: Object,
  },
  computed: {
    isFolder() {
      return this.item.children && this.item.children.length;
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    toggleOrDisplay() {
      if (this.isFolder) {
        this.isOpen = !this.isOpen;
      } else {
        this.$root.$emit("selectedFile", this.item);
      }
    },
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