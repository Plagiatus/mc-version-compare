<template>
  <div id="compare-wrapper">
    <div class="loading" v-if="options.length <= 0">Loading...</div>
    <div v-else id="compare">
      <div>
        Compare
        <input type="file" v-if="useFileSelector" accept=".jar" @change="changedFile" id="oldJarFile">
        <select
          v-else
          :disabled="comparing"
          v-model="originalVersion"
          name="ogVersionSelector"
          id="ogVersionSelector"
          required
        >
          <option v-for="o in options" :key="o" :value="o">{{ o }}</option>
        </select>
        to
        <input type="file" v-if="useFileSelector" accept=".jar" @change="changedFile" id="newJarFile">
        <select
          v-else
          :disabled="comparing"
          v-model="comparisonVersion"
          name="compVersionSelector"
          id="compVersionSelector"
          required
        >
          <option v-for="o in options" :key="o" :value="o">{{ o }}</option>
        </select>

        <div class="switch-wrapper" style="margin-left: auto" v-if="!useFileSelector">
          <label class="switch">
            <input
              type="checkbox"
              v-model="includeSnapshots"
              :disabled="comparing"
            />
            <span class="slider round"></span>
          </label>
          include snapshots
        </div>
        <div class="switch-wrapper">
          <label class="switch">
            <input
              type="checkbox"
              v-model="useFileSelector"
              :disabled="comparing"
            />
            <span class="slider round"></span>
          </label>
          select files directly
        </div>
      </div>
      <span>
        To add a version, start the game with that version selected, so the
        relevant files are downloaded to your system.
      </span>
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

/* label {
  margin-left: 2em;
  margin-right: 0.5em;
} */

div.switch-wrapper {
  display: flex;
  flex-direction: column;
}

input {
  margin: 0 5px;
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
      if (this.useFileSelector) {
        if (!this.newJarFile || !this.oldJarFile) {
          this.warning = "Please select two files."
          return;
        }
        if (this.newJarFile.path === this.oldJarFile.path) {
          this.warning = "The two files need to be different."
          return;
        }
        if (!this.newJarFile.name.endsWith(".jar") || !this.oldJarFile.name.endsWith(".jar")) {
          this.warning = "The files need to be .jar files."
          return;
        }
        this.comparing = true;
        this.$root.$emit("compareFiles", this.oldJarFile, this.newJarFile);
        return;
      }
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
    readAvailableVersions: async function () {
      await this.getOfficialVersions();
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
      this.localVersions = versions;
      if (this.localVersions.length <= 0) {
        this.error =
          "Couldn't find any valid versions. Please download the versions you want to compare through the minecraft launcher.";
      }

      this.updateVisibleOptions();
    },
    getOfficialVersions: async function () {
      this.officialVersions = (
        await (
          await fetch(
            "https://launchermeta.mojang.com/mc/game/version_manifest.json"
          )
        ).json()
      ).versions;
    },
    updateVisibleOptions: function () {
      this.options = [];
      for (let lv of this.localVersions) {
        let ov = this.getOfficialFromName(lv);
        if (!ov) continue;
        if (ov.type === "snapshot") {
          if (this.includeSnapshots) {
            this.options.push(lv);
          }
        } else {
          this.options.push(lv);
        }
      }
      this.options.sort(this.sortOptions);
    },
    sortOptions(a, b) {
      let offA = this.getOfficialFromName(a);
      let offB = this.getOfficialFromName(b);

      let da = new Date(offA.releaseTime);
      let db = new Date(offB.releaseTime);

      return db.getTime() - da.getTime();
    },
    getOfficialFromName(n) {
      return this.officialVersions.find((elem) => {
        return elem.id === n;
      });
    },
    unlock() {
      this.comparing = false;
      console.log(this.comparing);
    },
    changedFile(event) {
      let file = event.target.files[0];
      let id = event.target.id;
      if (id === "oldJarFile") {
        this.oldJarFile = file;
      } else if (id === "newJarFile") {
        this.newJarFile = file;
      }
    }
  },
  data() {
    return {
      originalVersion: "",
      comparisonVersion: "",
      options: [""],
      comparing: false,
      warning: "",
      error: "",
      includeSnapshots: true,
      useFileSelector: false,
      officialVersions: [{}],
      localVersions: [""],
      newJarFile: undefined,
      oldJarFile: undefined,
    };
  },
  created() {
    this.readAvailableVersions();
    this.$root.$on("comparisonDone", this.unlock);
  },
  watch: {
    includeSnapshots(val) {
      this.updateVisibleOptions();
    },
  },
});
</script>