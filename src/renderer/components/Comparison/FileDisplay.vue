<template>
  <div>
    <span class="top"> {{ file.name }} {{ old ? "(old)" : "(new)" }}</span>
    <div v-if="imageFile">
      <img v-if="(old ? file.oldContent : file.newContent)" :src="'data:image/png;base64,' + (old ? file.oldContent : file.newContent)">
    </div>
    <div class="file-display-content" v-else>
      <span
        v-for="(diff, index) in diffContent"
        :key="index"
        :class="{ added: diff.added, removed: diff.removed }"
      >
        {{ diff.value }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import * as Diff from "diff";

export default Vue.extend({
  name: "file-display",
  props: {
    file: {},
    old: Boolean,
  },
  computed: {
    diffContent() {
      if (!this.file.oldContent) return "";
      // let content = this.old ? this.file.oldContent : this.file.newContent;
      // console.log("file", this.file);
      let diffs = Diff.diffLines(this.file.oldContent, this.file.newContent);
      for (let i = 0; i < diffs.length; i++) {
        let trimmed = diffs[i].value.trim();
        if (trimmed.endsWith("\n") || trimmed.startsWith("\n")) {
          console.log("yes trim now")
        }

        if (this.old && diffs[i].added) {
          diffs.splice(i, 1);
          i--;
        } else if (!this.old && diffs[i].removed) {
          diffs.splice(i, 1);
          i--;
        }
      }
      return diffs;
    },
    imageFile() {
      return this.file && this.file.name && this.file.name.endsWith(".png")
    }
  },
});
</script>

<style scoped>
span.top {
  background-color: #0c0f13;
  position: sticky;
  top: 0;
  float: right;
  padding: 10px;
  text-align: center;
}

/* div.file-display-content span {
  display: block;
} */

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