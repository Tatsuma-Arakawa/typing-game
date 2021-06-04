<template>
  <div class="container">
    <div class="title">
      <h1>IT用語タイピング</h1>
      <div class="marker"></div>
    </div>
    <button v-if="startFlag!=true" class="startButton mb-20" @click="gameStart">スタート</button>
    <div class="question mb-20">{{ currentQuestion }}</div>
    <div v-if="currentQuestionCounts == questionCounts" class="clear">クリア！！</div>
    <div class="typeFormWrapper mb-20">
      <input id="typeForm" v-model="typeBox" type="text" class="typeForm">
    </div>
    <div>
      <div>{{ currentQuestionCounts }}/{{ questionCounts }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component({})

export default class ItTyping extends Vue {
  startFlag = false;
  currentQuestion = "";
  typeBox = "";
  currentQuestionCounts = 0;
  questionCounts = 0;

  /** 問題 */
  questions = [
    'apple',
    'banana',
    'chocolate',
    'donut',
    'espresso'
  ];

  /** ゲームスタートと同時にカーソルを回答欄に配置 */
  private gameStart() {
    this.startFlag = true;
    this.$nextTick(() => {
      document.getElementById('typeForm')?.focus()
    })
  }

  /** 回答中の問題 */
  private mounted() {
    this.currentQuestion = this.questions[0]
    this.questionCounts = this.questions.length
  }

    /** 正解をすると問題が切り替わる */
  @Watch('typeBox')
  private onTextChanged(e: string) {
    if(e == this.currentQuestion) {
      this.questions.splice(0, 1)
      this.currentQuestion = this.questions[0]
      this.typeBox = ""
      this.currentQuestionCounts = this.currentQuestionCounts + 1
    }
  }
}
</script>
<style scoped>
*{
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}

body {
  font-size: 32px;
}

.mb-20 {
  margin-bottom: 20px;
}

.container {
  width: 400px;
  margin: 0 auto;
  text-align: center;
}

.title {
  position: relative;
  font-size: 48px;
}

.marker {
  width: 100%;
  height: 35%;
  background-color: gray;
  position: absolute;
  bottom: 5%;
  z-index: -1;
}

.startButton {
  background-color: gray;
  color: white;
  padding: 4px 60px;
  border: none;
  outline: none;
  border-radius: 8px;
  cursor: pointer;
}

.startButton:hover {
  opacity: 0.7;
}

.question {
  color: gray;
}

.clear {
  color: aqua;
}

.typeForm {
  outline: none;
  border: none;
  text-align: center;
}

.typeFormWrapper {
  border-bottom: 1px solid gray;
}

.gauge {
  height: 12px;
  transition: all .3s ease;
}

.gaugeWrapper {
  border: 1px solid;
  height: 12px;
}
</style>