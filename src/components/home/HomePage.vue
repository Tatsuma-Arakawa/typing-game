<template>
  <v-container>
    <v-row class="text-center">
      スタートページ実装
      <v-btn>
        <router-link to="/difficulty">about</router-link>
      </v-btn>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})

export default class HomePage extends Vue{}
</script>
<style scoped>
</style>