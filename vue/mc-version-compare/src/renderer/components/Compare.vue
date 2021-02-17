<template>
  <div id="compare-wrapper">
    <div class="loading" v-if="options.length <= 0">Loading...</div>
    <div v-else id="compare">
      <div>
        Compare
        <select
          :disabled="comparing"
          v-model="originalVersion"
          name="ogVersionSelector"
          id="ogVersionSelector"
          required
        >
          <option v-for="o in options" :key="o" :value="o">{{ o }}</option>
        </select>
        to
        <select
          :disabled="comparing"
          v-model="comparisonVersion"
          name="compVersionSelector"
          id="compVersionSelector"
          required
        >
          <option v-for="o in options" :key="o" :value="o">{{ o }}</option>
        </select>

        <label class="switch">
          <input type="checkbox" v-model="includeSnapshots" />
          <span class="slider round"></span>
        </label>
        include snapshots
      </div>
      <span
        >To add a version, start the game with that version selected, so the
        relevant files are downloaded to your system.</span
      >
      <div>
        <button @click="compare" :disabled="comparing">Go!</button>
      </div>
      <span v-if="warning" class="alert alert-warn"> {{ warning }} </span>
      <span v-if="error" class="alert alert-error"> {{ error }} </span>
    </div>
  </div>
</template>

<style scoped>
div#compare {
  display: flex;
  align-content: center;
  justify-content: center;
  flex-direction: column;
}

div:not(#compare) {
  margin: 0.5em;
  display: flex;
  justify-content: center;
  align-items: center;
}

button {
  padding-right: 2em;
  padding-left: 2em;
}

span {
  text-align: center;
  color: var(--logo-blue);
}

label {
  margin-left: 2em;
  margin-right: 0.5em;
}
</style>

<script lang="ts">
import Vue from "vue";
import * as fs from "fs";

export default Vue.extend({
  name: "compare",
  methods: {
    compare: function () {
      this.warning = "";
      if (!this.originalVersion || !this.comparisonVersion) {
        this.warning = "Please select two versions.";
        return;
      }
      if (this.originalVersion === this.comparisonVersion) {
        this.warning = "The two versions need to be different.";
        return;
      }
      this.comparing = true;
      this.$root.$emit("compare", this.originalVersion, this.comparisonVersion);
    },
    readAvailableVersions: function () {
      let path = process.env.APPDATA + "/.minecraft/versions";
      let versions = fs.readdirSync(path);
      for (let i = 0; i < versions.length; i++) {
        if (
          !fs.existsSync(path + "/" + versions[i] + "/" + versions[i] + ".jar")
        ) {
          versions.splice(i, 1);
          i--;
        }
      }
      this.options = versions;
      if (this.options.length <= 0) {
        this.error = "Couldn't find any valid versions. Please download the versions you want to compare through the minecraft launcher.";
      }
    },
  },
  data () {
    return {
      originalVersion: "",
      comparisonVersion: "",
      options: [""],
      comparing: false,
      warning: "",
      error: "",
      includeSnapshots: true,
    };
  },
  created () {
    this.readAvailableVersions();
  },
});
</script>