<template>
  <div class="container">
    <div class="title">
      <h1>IT用語タイピング</h1>
      <div class="marker"></div>
    </div>

    <!-- スタート前 -->
    <div v-if = "startFlag!=true" class="mt-10">
      <v-btn class="startButton mb-20" @click="gameStart">
        <p>クリックでスタート</p>
      </v-btn>
    </div>

  <!-- ゲーム中に表示する部分 -->
    <div v-if="startFlag">

      <!-- 正解不正解判定 -->
      <p v-if="isTypingCorrenct">OK</p>
      <p v-else>NO</p>

      <!-- 出題問題 -->
      <div class="question mb-20">{{ currentWord }}</div>

      <!-- 回答欄 -->
      <div class="input-typing-wrapper mb-20">
        <input id="input-typing" type="text" class="form-control" v-model="typingText">
      </div>

      <!--問題数 -->
      <div>
        <div>第{{ currentWordNumber }}問</div>
      </div>

      <!-- タイプ数 -->
      <div>
        <div>タイプ数：{{ typeCount }}回</div>
      </div>

      <!-- 経過時間 -->
      <div>
        <div>経過時間：{{ timer }}秒</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})

export default class ItTyping extends Vue {
  // ゲームスタート
  startFlag = false;

  // 入力欄
  typingText = '';

  // ミスタイプ数
  typeMissCount = 0;

  // タイプ数
  typeCount = 0;

  // 問題解答用
  questionList = []
  questionIndex = 0;
  charIndex = 0;

  // 経過時間
  timer = -1; // 最初0秒表示させるため-1に設定

  /** 問題 */
  words = [
    'egg',
    'bag',
    'rose',
    'chair',
    'bat',
    'fish',
    'notebook',
    'pencil',
    'dog',
    'desk'
  ];

  /** 回答後の問題 */
  solvedWords = [];

  /** ゲームスタート */
  private gameStart() {
    this.startFlag = true;
    this.solvedWords = [];
    this.$nextTick(() => {
      document.getElementById('input-typing')?.focus()
    })
    this.countUp()
    // window.addEventListener('keypress', this.keyCheck)
  }

  /** ランダムで問題を出題する */
  private get currentWord() {
    const unsolvedWords = this.words.filter((word) => {
      return (!this.solvedWords.includes(word as never)) // 解答されてないものだけ
    })
    const randomIndex = Math.floor(Math.random()*unsolvedWords.length)
    return unsolvedWords[randomIndex]
  }

  /** 回答中の問題番号 */
  private get currentWordNumber() {
    return this.solvedWords.length + 1
  }

  /** キーボード入力と文字が一致しているか */
  private get isTypingCorrenct() {
    if(this.typingText == this.currentWord) {
      this.solvedWords.push(this.currentWord as never)
      this.typingText = ''
      if(this.words.length == this.solvedWords.length) {
        this.solvedWords = []
        this.startFlag = false
        alert('全問正解')
      }
      return true
    }
    const typingTextLength = this.typingText.length
    return (this.typingText === this.currentWord.slice(0, typingTextLength))
  }

  /** タイマー */
  countUp(): void {
    if (!this.startFlag) {
      return
    }
    this.timer += 1
    setTimeout(this.countUp, 1000)
  }
}
</script>
<style lang="scss" scoped>
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
  border: none;
  outline: none;
  border-radius: 8px;
  cursor: pointer;
  p {
    color: black;
    margin: auto 0;
  }
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

.input-typing {
  outline: none;
  border: none;
  text-align: center;
}

.input-typing-wrapper {
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