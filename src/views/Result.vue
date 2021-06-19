<template>
  <div class="container">
    <h2 class="my-5 text-center">Ranking</h2>
    <v-card class="home-card" color="#f0f8ff" tile>
      <template v-for="(result, index) in results">
        <p :key="index" class="py-2 pl-5 ma-0 rankign-data">
          {{ results.indexOf(result) + 1 }}位 {{ result.data.name }} {{ result.data.mode }}モード {{ result.data.rank }}ランク {{ result.data.score }}pt
        </p>
      </template>
    </v-card>
    
    <div class="my-8 text-center">
      <v-btn
        class="mx-2"
        href="/ittyping"
        color="blue-grey"
        small
      >
        <p class="button">ITモード</p>
      </v-btn>
      <v-btn
        class="mx-2"
        href="/greatemantyping"
        color="blue-grey"
        small
      >
        <p class="button">世界の偉人モード</p>
      </v-btn>
      <v-btn
        class="mx-2"
        href="/muscletyping"
        color="blue-grey"
        small
      >
        <p class="button">筋肉モード</p>
      </v-btn>
    </div>

  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import db from '@/plugins/firestore'

@Component({})

export default class Result extends Vue{
  /** 過去ランキング */
  private results: Array<{
    id: string;
    data: {
      name: string;
      score: number;
      mode: string;
      rank: string;
    }
  }> = []
  
  /** 過去ランキング結果取得 */
  private read(): void {
    db.collection('results')
      .orderBy('score', 'desc')
      .limit(30)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.results.push({
            id: doc.id,
            data: doc.data() as any
          })
        })
      })
  }
    private created () {
    this.read()
    }
}
</script>
<style lang="scss" scoped>
.home-card {
  height: 100%;
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-flow: column;
  align-items: left;
}

.rankign-data {
  border: 1px solid gray;
}

.button {
  color: #fffafa;
  margin: auto 0;
  font-weight: 600;
}
</style>