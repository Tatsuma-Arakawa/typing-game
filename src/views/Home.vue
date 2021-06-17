<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="4" class="mt-12">
        <v-btn
          href="/ittyping"
          color="blue-grey"
        >
          <p class="button">Play ITモード</p>
        </v-btn>
      </v-col>
      <v-col cols="4" class="mt-12">
        <v-btn
         href="/greatemantyping"
         color="blue-grey"
        >
          <p class="button">Play 世界の偉人モード</p>
        </v-btn>
      </v-col>
      <v-col cols="4" class="mt-12"> 
        <v-btn
         href="/muscletyping"
         color="blue-grey"
        >
          <p class="button">Play 筋肉モード</p>
        </v-btn>
      </v-col>
      <v-col cols="6" class="mt-10">
        <div>
          <h2 class="mb-5">How to play</h2>
          <v-card class="home-card" color="#f0f8ff" tile>
            <p class="font how-to-play ma-0 pa-2">
              ・ローマ字入力用のタイピングゲームです。<br>
              ・ITモード、世界の偉人モード、筋肉モード、から選択出来ます。<br>
              ・制限時間は一分です。<br>
              ・ミスタイプで減点です。<br>
              ※音が出ます。<br><br>
              ・Sランク: 280pt〜<br>
              ・Aランク: 230pt〜279pt<br>
              ・Bランク: 180pt〜229pt<br>
              ・Cランク: 130pt〜179pt<br>
              ・Dランク: 80pt〜129pt<br>
              ・Eランク: 〜79pts<br>
            </p>
          </v-card>
        </div>
      </v-col>
      <v-col cols="6" class="mt-10">
        <div>
          <h2 class="mb-5">Ranking</h2>
          <v-card class="home-card" color="#f0f8ff" tile>
            <template v-for="(result, index) in results">
              <p :key="index" class="py-2 pl-5 ma-0 rankign-data font">
                {{ results.indexOf(result) + 1 }}位 {{ result.data.name }} {{ result.data.mode }}モード {{ result.data.rank }}ランク {{ result.data.score }}pt
              </p>
            </template>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import db from '@/plugins/firestore'
 
@Component({})

export default class Home extends Vue{
  private results: Array<{
    id: string;
    data: {
      name: string;
      score: number;
      mode: string
    }
  }> = []
  
  private read(): void {
    db.collection('results')
      .orderBy('score', 'desc')
      .limit(10)
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
  height: 100%  ;
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

.font {
  color: #202020;
  text-align: left;
}

.how-to-play {
  border: 1px solid gray;
}
</style>