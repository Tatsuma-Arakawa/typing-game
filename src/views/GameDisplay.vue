<template>
  <Beginner />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Beginner from '../components/gameDisplay/Beginner.vue';

@Component({
  components: {
    Beginner
  },
})

export default class GameDisplay extends Vue{}
</script>
<style scoped>
</style>
