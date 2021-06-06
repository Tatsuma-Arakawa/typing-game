<template>
  <div class="container">
    <div class="title">
      <h1>IT用語タイピング</h1>
      <div class="marker"></div>
    </div>

    <!-- スタート前 -->
    <div v-if="startFlag!=true" class="mt-10">
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
      <div class="mb-20">
        <input id="input-typing" type="text" class="form-control" v-model="typingText">
      </div>

      <!--問題数 -->
      <div>
        <div>第{{ currentWordNumber }}問</div>
      </div>

      <!-- 経過時間 -->
      <div>
        <div>制限時間：残り{{ timer }}秒</div>
      </div>
    </div>

    <!-- ゲーム終了時に表示する部分 -->
    <div v-if="resultFlag">
      <div>回答数{{ answers }}問</div>
      <div>ランク{{ rank }}</div>
      <div>残り時間{{ timer }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})

export default class ItTyping extends Vue {
  // ゲームスタート
  startFlag = false;

  /** 結果 */
  resultFlag = false

  // 入力欄
  typingText = '';

  /** 回答数 */
  answers = 0;

  /** 制限時間 */
  TIME = 31
  timer = this.TIME;

  /** ランク */
  rank = 'E'

  rankD = 'D'
  rankC = 'C'
  rankB = 'B'
  rankA = 'A'
  rankS = 'S'

  scoreD = 3
  scoreC = 5
  scoreB = 7
  scoreA = 9
  scoreS = 10

  /** 問題 */
  words = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
  ];

  /** 回答後の問題 */
  solvedWords = [];

  /** ゲームスタート */
  private gameStart() {
    this.startFlag = true;
    this.solvedWords = [];
    this.answers = 0
    this.typingText = ''
    this.resultFlag = false
    this.rank = 'E'
    this.$nextTick(() => {
      document.getElementById('input-typing')?.focus()
    })
    this.countDown()
  }

  /** ゲーム終了後 */
  private result() {
    this.answers = this.solvedWords.length
    this.resultFlag = true
    this.startFlag = false
    if (this.answers >= this.scoreD) {
      this.rank = this.rankD
    } if (this.answers >= this.scoreC) {
      this.rank = this.rankD
    } if (this.answers >= this.scoreB) {
      this.rank = this.rankB
    } if (this.answers >= this.scoreA) {
      this.rank = this.rankA
    } if (this.answers >= this.scoreS) {
      this.rank = this.rankS
    }
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
        this.result()
        alert('クリア！！')
      }
      return true
    }
    const typingTextLength = this.typingText.length
    return (this.typingText === this.currentWord.slice(0, typingTextLength))
  }

  /** タイマー */
  countDown(): void {
    if (!this.startFlag) {
      return
    }
    this.timer -= 1
    setTimeout(this.countDown, 1000)
    if (this.words == this.solvedWords) {
      clearInterval(this.timer)
    }
    if (this.timer <= 0) {
      clearInterval
      this.result();
    }
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

.gauge {
  height: 12px;
  transition: all .3s ease;
}

.gaugeWrapper {
  border: 1px solid;
  height: 12px;
}
</style>