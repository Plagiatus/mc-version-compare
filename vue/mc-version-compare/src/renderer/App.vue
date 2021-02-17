<template>
  <div id="app">
    <versioncheck></versioncheck>
    <headline></headline>
    <compare></compare>
    <comparison></comparison>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Headline from "@/components/Headline";
import Compare from "@/components/Compare";
import Comparison from "@/components/Comparison";
import Versioncheck from "@/components/Versioncheck";

export default Vue.extend({
  name: "mc-version-compare",
  components: {
    Headline,
    Compare,
    Comparison,
    Versioncheck
  },
  data: {},
  methods: {},
});
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #161b22;
  color: #fefefe;

  font-family: Arial, Helvetica, sans-serif;

  --logo-blue: #47b6b9;
  --bg-blue: #0e62ac;
}

button {
  margin: 0.25rem 0.125rem;
  padding: 0.375rem 0.75rem;
  line-height: 1.5;
  font-weight: 400;
  background-color: var(--logo-blue);
  display: inline-block;
  vertical-align: middle;
  text-align: center;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.15s;
  color: whitesmoke;
  font-size: 1rem;
}
button:hover {
  background-color: #3ea0a3;
}
button:disabled {
  background-color: gray;
  cursor: default;
}

select {
  margin: 0.25rem 0.5rem;
  padding: 0.375rem 2.25rem 0.375rem 0.75rem;
  border-radius: 0.25rem;
  border: 1px solid #ced4da;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px 12px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

select::after {
  content: "";
}

option {
  line-height: 1.5;
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: var(--logo-blue);
}

input:focus + .slider {
  box-shadow: 0 0 1px var(--logo-blue);
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.alert {
  padding: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  margin: 1em;
}

.alert-warn {
  color: #664d03 !important;
  background-color: #fff3cd !important;
  border-color: #ffecb5 !important;
}

.alert-error {
  color: #842029 !important;
  background-color: #f8d7da !important;
  border-color: #f5c2c7 !important;
}

.loading {
  text-align: center;
}
</style>
