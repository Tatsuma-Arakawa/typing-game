<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <div class="mt-16">
          <v-btn
            href="/modeselection"
            color="blue-grey"
          >
            <p class="button">Start the game</p>
          </v-btn>
        </div>
      </v-col>
      <v-col cols="6" class="mt-10">
        <div>
          <h2 class="mb-5">How to play</h2>
          <v-card class="home-card" color="#f0f8ff">
            <p class="font">
              ・ローマ字入力用のタイピングゲームです。<br>
              ・ITモード、世界の偉人モード、筋肉モード、から選択出来ます。<br>
              ・制限時間は一分です。<br>
              ・ミスタイプで減点です。
            </p>
          </v-card>
        </div>
      </v-col>
      <v-col cols="6" class="mt-10">
        <h2 class="mb-5">Ranking</h2>
          <v-card class="home-card" color="#f0f8ff">
            <p class="font">
              1位 サンプル 500pt<br>
              2位 サンプル 500pt<br>
              3位 サンプル 500pt<br>
              4位 サンプル 500pt<br>
              5位 サンプル 500pt<br>
              6位 サンプル 500pt<br>
              7位 サンプル 500pt<br>
              8位 サンプル 500pt<br>
              9位 サンプル 500pt<br>
              10位 サンプル 500pt<br>
            </p>
          </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})

export default class HomePage extends Vue{}
</script>
<style lang="scss" scoped>
.home-card {
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
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
</style>