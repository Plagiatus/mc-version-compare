<template>
  <div id="comparison-wrapper">
    <div v-if="calculating" class="loading">{{ progress }}</div>
    <div v-if="calculated" id="comparison">
      <div id="files"></div>
      <div id="file1"></div>
      <div id="file2"></div>
    </div>
  </div>
</template>

<style scoped>
#comparison {
  display: flex;
  justify-content: space-between;
}

.loading {
  white-space: pre-line;
}
</style>

<script lang="ts">
import Vue from "vue";
import {promisify} from "util";
import * as fs from "fs";
import * as JSZip from "jszip";

const fspReadFile = promisify(fs.readFile);

export default Vue.extend({
  name: "comparison",
  data () {
    return {
      progress: "Loading...\n",
      calculating: false,
      calculated: false,
    };
  },
  methods: {
    async compare(originalVersion, comparisonVersion) {
      this.calculating = true;

      let path = process.env.APPDATA + "/.minecraft/versions";
      let data1 = await fspReadFile(
        path + "/" + originalVersion + "/" + originalVersion + ".jar"
      );
      let data2 = await fspReadFile(
        path + "/" + comparisonVersion + "/" + comparisonVersion + ".jar"
      );
      let zip1 = await JSZip.loadAsync(data1);
      let zip2 = await JSZip.loadAsync(data2);

      let filesToCheck = [];
      // let changedFiles = [];
      // let addedFiles = [];
      // let removedFiles = [];

      for (let f in zip1.files) {
        if (!filesToCheck.includes(f) && this.doesFileNeedToBeChecked(f)) {
          filesToCheck.push(f);
        }
      }
      for (let f in zip2.files) {
        if (!filesToCheck.includes(f) && this.doesFileNeedToBeChecked(f)) {
          filesToCheck.push(f);
        }
      }

      this.progress += "checking " + filesToCheck.length + " files, this might take a while...";
    },

    doesFileNeedToBeChecked(f) {
      if (!f.startsWith("data") && !f.startsWith("assets")) return false;
      if (f.endsWith(".class")) return false;
      return true;
    },
  },
  created: function () {
    this.$root.$on("compare", this.compare);
  },
});
</script>