<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <div class="mt-16">
          <v-btn href="/type" color="#00bfff">
            ゲームを始める
          </v-btn>
        </div>
      </v-col>
      <v-col cols="6" class="mt-10">
        <div>
          <h2>遊び方</h2>
          <v-card class="home-card">
            <p>
              専門用語タイピングは,ローマ字入力用のタイピングゲームです。<br>
              IT用語、医療用語、若者言葉、から選択出来ます。
            </p>
          </v-card>
        </div>
      </v-col>
      <v-col cols="6" class="mt-10">
        <h2>ランキング</h2>
          <v-card class="home-card">
            <p>
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
</style>