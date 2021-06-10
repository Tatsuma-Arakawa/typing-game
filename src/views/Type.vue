<template>
  <v-container class="container">
    <h2 class="mt-10 mode-title">Mode selection</h2>
    <v-row>
      <v-col cols="4" class="mt-12">
        <v-btn
          href="/gamedisplay"
          color="blue-grey"
        >
          <p class="button">IT</p>
        </v-btn>
      </v-col>
      <v-col cols="4" class="mt-12"> 
        <v-btn
         href="#"
         color="blue-grey"
        >
          <p class="button">筋肉</p>
        </v-btn>
      </v-col>
      <v-col cols="4" class="mt-12">
        <v-btn
         href="#"
         color="blue-grey"
        >
          <p class="button">若者言葉</p>
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
<style lang="scss" scoped>
.container {
  text-align: center;
}

.button {
  color: #fffafa;
  margin: auto 0;
  font-weight: 600;
}

.mode-title {
  color: #202020;
}
</style>