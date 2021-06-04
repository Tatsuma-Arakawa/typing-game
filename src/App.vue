<template>
  <v-app>
    <Header />
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Header from './components/common/Header.vue';

@Component({
  components: {
    Header
  },
})

export default class App extends Vue{}
</script>
<style scoped>
</style>
