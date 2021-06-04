<template>
  <ItTyping />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ItTyping from '../components/gameDisplay/ItTyping.vue';

@Component({
  components: {
    ItTyping
  },
})

export default class GameDisplay extends Vue{}
</script>
<style scoped>
</style>
