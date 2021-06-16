<template>
  <div class="toolbar">
    <v-toolbar class="aaa" color="#f0f8ff" flat>
      <v-toolbar-title class="title">
        <a href="/">Typing Game</a>
      </v-toolbar-title>
    </v-toolbar>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})

export default class Header extends Vue{}
</script>
<style lang="scss" scoped>
.toolbar {
  border-bottom: solid 1px gray;
}

.title {
  a {
    text-decoration: none;
    color: #202020;
    font-weight: 600;
  }
}
</style>