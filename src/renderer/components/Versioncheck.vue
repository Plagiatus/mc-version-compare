<template>
  <div id="versioncheck" class="alert alert-error" v-if="outdated" @click="openLatestInBrowser">
    <span>Your version ({{ appVersion }}) is outdated. A newer version ({{
      latestVersion
    }}) is available. Click here to download.</span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { remote } from "electron";
export default Vue.extend({
  name: "versioncheck",
  data() {
    return {
      outdated: false,
      latestVersion: "",
      appVersion: "",
    };
  },
  mounted: async function () {
    this.appVersion = remote.app.getVersion();

    let request = await fetch(
      "https://api.github.com/repos/plagiatus/mc-version-compare/releases/latest"
    );
    if (request.status !== 200) return;
    let result = await request.json();
    if (!result) return;
    if (!result.tag_name) return;
    this.latestVersion = result.tag_name;
    if (this.latestVersion === this.appVersion) return;
    this.outdated = true;
  },
  methods: {
    openLatestInBrowser() {
      require("electron").shell.openExternal("https://github.com/plagiatus/mc-version-compare/releases/latest")
    }
  }
});
</script>

<style>
  #versioncheck {
    text-align: center;
    padding: 0.4em;
    cursor: pointer;
  }
</style>