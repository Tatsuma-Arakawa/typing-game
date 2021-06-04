<template>
  <component v-bind:is="currentComponent" v-on:game-start="gameStart"></component>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})

export default class Beginner extends Vue{}
</script>
<style scoped>
</style>