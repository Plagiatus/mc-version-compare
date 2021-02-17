<template>
  <header>
    <img src="~@/assets/logo_trans.png" alt="MVC" />
    <span>Minecraft Version Compare</span>
  </header>
</template>

<style>
header {
  background-color: var(--bg-blue);
  font-family: "Arial Black", Arial, Helvetica, sans-serif;
  font-size: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
}

header > img {
  height: 1em;
  margin: 0.4em;
}
</style>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "headline",
});
</script>