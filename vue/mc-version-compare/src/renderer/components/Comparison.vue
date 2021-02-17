<template>
  <div id="comparison-wrapper">
    <div v-if="calculating" class="loading">{{ progress }}</div>
    <div v-if="calculated" id="comparison">
      <div id="files">
        <file v-for="(file, path) in files" :key="path" :file="file" :path="path">
          {{path}} : {{file}}
        </file>
      </div>
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

#file1,
#file2 {
  flex-grow: 1;
}

#files {
  resize: horizontal;
}
</style>

<script lang="ts">
import Vue from "vue";
import { promisify } from "util";
import * as crypto from "crypto";
import * as Diff from "diff";
import * as fs from "fs";
import * as JSZip from "jszip";

import File from "@/components/Comparison/File";

const fspReadFile = promisify(fs.readFile);

export default Vue.extend({
  name: "comparison",
  components: {
    File
  },
  data() {
    return {
      progress: "Loading...\n",
      calculating: false,
      calculated: false,
      files: {
        // a: {
        //   added: [],
        //   removed: [],
        //   status: 0
        // }
      }
    };
  },
  methods: {
    async compare(originalVersion, comparisonVersion) {
      this.progress = "Loading..."
      this.calculating = true;
      this.calculated = false;
      this.files = {};

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

      this.progress = "0 / " + filesToCheck.length;

      let changedFiles = [];
      let addedFiles = [];
      let removedFiles = [];
      let n = 0;
      for (let filename of filesToCheck) {
        n++;
        this.progress = n + " / " + filesToCheck.length;
        if (zip1.file(filename) && zip2.file(filename)) {
          if (
            filename.endsWith(".json") ||
            filename.endsWith(".mcmeta") ||
            filename.endsWith(".txt") ||
            filename.endsWith(".fsh") ||
            filename.endsWith(".vsh")
          ) {
            let fileContent1 = await zip1.file(filename).async("string");
            let fileContent2 = await zip2.file(filename).async("string");

            if (fileContent1 !== fileContent2) {
              this.files[filename] = {status: 0, added: [], removed: []};
              changedFiles.push(filename);
              console.log(filename);
              let diffs = Diff.diffLines(fileContent1, fileContent2);
              diffs.forEach((element) => {
                if (element.added) {
                  this.files[filename].added.push(element.value);
                } else if (element.removed) {
                  this.files[filename].removed.push(element.value);
                }
              });
            }
          } else if (filename.endsWith(".png")) {
            let hash1 = crypto
              .createHash("md5")
              .update(await zip1.file(filename).async("binarystring"))
              .digest("hex");
            let hash2 = crypto
              .createHash("md5")
              .update(await zip2.file(filename).async("binarystring"))
              .digest("hex");
            if (hash1 !== hash2) {
              // console.log("png", filename);
              changedFiles.push(filename);
            }
          } else if (filename.endsWith(".nbt")) {
            // no idea how to properly compare nbt files, so i'm going to ignore them
          } else {
            // ignoring everything else
          }
        } else if (zip1.file(filename) && !zip2.file(filename)) {
          removedFiles.push(filename);
          this.files[filename] = {
            status: -1,
            removed: await zip1.file(filename).async("string")
          }
        } else {
          addedFiles.push(filename);
          this.files[filename] = {
            status: 1,
            added: await zip2.file(filename).async("string")
          }
        }
      }
      this.calculating = false;
      this.calculated = true;
      console.log(this.files);
      this.$root.$emit("comparisonDone");
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