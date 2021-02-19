<template>
  <div id="filebrowser">
    <ul>
      <file :item="rootData" class="" />
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import File from "@/components/Comparison/File";

export default Vue.extend({
  name: "filebrowser",
  components: {
    File,
  },
  props: {
    files: Object,
  },
  data() {
    return {
      rootData: { name: "root" },
    };
  },
  methods: {
    createFoldersFromFiles() {
      for (let file in this.files) {
        let path = file.split("/");
        let parent = this.rootData;
        while (path.length > 1) {
          let folder = this.makeNode(parent, path.shift());
          this.addItem(parent, folder);
          parent = folder;
        }
        let item = this.makeNode(parent, path[0]);
        for (let key in this.files[file]) {
          item[key] = this.files[file][key] || item[key] || 0;
        }
        this.addItem(parent, item);
      }
      console.log(this.rootData);
    },
    makeFolder(item) {
      if (!item.children) {
        item.children = [];
      }
    },
    makeNode(parent, item) {
      if (parent.children) {
        let alreadyExistingItem = parent.children.find((e) => e.name === item);
        if (alreadyExistingItem) {
          return alreadyExistingItem;
        }
      }
      return { name: item };
    },
    addItem(parent, item) {
      this.makeFolder(parent);
      if (!parent.children.find((e) => e.name === item.name)) {
        parent.children.push(item);
      }
    },
  },
  created: function () {
    this.createFoldersFromFiles();
  },
});
</script>

<style>
#comparison-wrapper ul {
  padding-left: 1em;
  line-height: 1.5em;
  list-style-type: none;
}
#comparison-wrapper li {
  cursor: pointer;
}
#comparison-wrapper div.folder:hover,
#comparison-wrapper div.file:hover {
  background-color: rgba(1, 1, 1, 0.2);
}
</style>