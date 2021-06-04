<template>
  <v-container>
    <h2>モード選択</h2>
    <v-row>
      <v-col cols="4" class="mt-8">
        <v-btn href="/gamedisplay">
          IT用語
        </v-btn>
      </v-col>
      <v-col cols="4" class="mt-8"> 
        <v-btn>
          筋肉
        </v-btn>
      </v-col>
      <v-col cols="4" class="mt-8">
        <v-btn>
          若者言葉
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})

export default class Type extends Vue{}
</script>
<style scoped>
</style>