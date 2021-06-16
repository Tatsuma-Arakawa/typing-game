<template>
  <v-app>
    <Header />
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import Header from './components/Header.vue';

@Component({
  components: {
    Header
  },
})

export default class App extends Vue{
  private createTitileDesc(routeInstance: any) {
    if(routeInstance.meta.title) {
      let setTitle = routeInstance.meta.title + ' - Typing Game';
      document.title = setTitle;
    } else {
      document.title = 'Typing Game'
    }
  }

  private mounted() {
    let routeInstance = this.$route;
    this.createTitileDesc(routeInstance)
  }

  @Watch('$route')
  route(routeInstance: any) {
    this.createTitileDesc(routeInstance)
  }
}
</script>
<style lang="scss">
#app {
  font-weight: 500;
  background-color: #fffafa;
  font-family: "Helvetica Neue",
    Arial,
    "Hiragino Kaku Gothic ProN",
    "Hiragino Sans",
    Meiryo,
    sans-serif;
}
</style>
