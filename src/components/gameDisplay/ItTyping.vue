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

    <!-- カウントダウン -->
    <div v-if="readFlag">
      <p>{{ readTime }}</p>
    </div>

  <!-- ゲーム中に表示する部分 -->
    <div v-if="startFlag">

      <!-- 日本語出題問題 -->
      <div>{{ currentWord.ja }}</div>

      <!-- 回答欄 -->
      <div>
        <p>
          <span class="transparent">{{ clearAnswer }}</span>
          <span class="underline">{{ nowAnswer }}</span>
          <span>{{ notAnswer }}</span>
        </p>
      </div>

      <!-- 正解不正解判定 -->
      <p v-if="nextWord">OK</p>
      <div v-else>
        <p>NO</p>
      </div>

      <!--問題数 -->
      <div>
        <div>第{{ currentWordNumber }}問</div>
      </div>

      <!-- 残り時間 -->
      <div>
        <div>制限時間：残り{{ timer }}秒</div>
      </div>

      

    </div>

    <!-- ゲーム終了時に表示する部分 -->
    <div v-if="resultFlag">
      <!-- 回答数 -->
      <div>
        <div>回答数{{ answers }}問</div>
      </div>

      <!-- ランク -->
      <div>
        <div>ランク{{ rank }}</div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component({})

export default class ItTyping extends Vue {
  /** 課題 */
  // 入力部分の色を変える（問題と入力欄を分けない）
  // ランキング機能
  // 他モード追加
  // 全体デザイン修正

  /** ゲームスタート */
  private startFlag = false;

  /** カウントダウン */
  private readFlag = false;

  /** 結果 */
  private resultFlag = false

  /** 入力欄 */
  private typingText = '';

  /** 回答数 */
  private answers = 0;

  /** 制限時間 */
  private TIME = 31
  private timer: number = this.TIME;

  /** ゲームスタートカウントダウン */
  private READ = 4;
  private readTime: number = this.READ;

  /** ランク */
  private rank = 'E'

  /** タイプ数 */
  private typeCount = 0;

  /** 一問に対する正解文字数 */
  private charIndex = 0;

  /** ミスタイプ数 */
  private typeMissCount = 0;

  private rankD = 'D'
  private rankC = 'C'
  private rankB = 'B'
  private rankA = 'A'
  private rankS = 'S'

  private scoreD = 3
  private scoreC = 5
  private scoreB = 7
  private scoreA = 9
  private scoreS = 10

  /** 問題 */
  private words = [
    {
      en: 'apple',
      ja: 'りんご'
    },
    {
      en: 'banana',
      ja: 'バナナ'
    }
  ]

  /** 回答後の問題 */
  private solvedWords: Array<string> = [];

  /** ゲームスタート */
  private gameStart() {
    this.solvedWords = [];
    this.answers = 0
    this.typingText = ''
    this.resultFlag = false
    this.rank = 'E'
    this.readFlag = true
    this.timer = this.TIME
    this.countRead()
    window.addEventListener('keypress', this.keyCheck)
  }

  /** ゲームスタートカウントダウン */
  countRead(): void {
    if (!this.readFlag) {
      return
    }
    this.readTime -= 1
    setTimeout(this.countRead, 1000)
    if (this.readTime <= 0) {
      clearInterval
      this.readFlag = false
      this.readTime = this.READ
      this.startFlag = true
      this.countDown()
    }
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
  // TODO 一度出た問題でも繰り返し出る様に変更?
  private get currentWord() {
    const unsolvedWords = this.words.filter((word) => {
      return (!this.solvedWords.includes(word as never))
    })
    const randomIndex = Math.floor(Math.random()*unsolvedWords.length)
    return unsolvedWords[randomIndex]
  }

  /** 次の問題 */
  private nextWord() {
    this.solvedWords.push(this.currentWord.en as never)
  } 

  /** 入力した文字と問題が同じか確認 */
  private keyCheck(e: any) {
    this.typeCount += 1
    if (this.currentWord.en[this.charIndex] === String.fromCharCode(e.keyCode)) {
      this.charIndex += 1
      this.typeSound()
    } else {
      this.typeMissCount += 1
      this.missSound()
    }
  }

  /** 回答済み文字列 */
  get clearAnswer(): string {
    return this.currentWord.en.slice(0, this.charIndex)
  }

  /** 回答文字列 */
  get nowAnswer(): string {
    return this.currentWord.en.slice(this.charIndex, this.charIndex + 1)
  }

  /** 未回答文字列 */
  get notAnswer(): string {
    return this.currentWord.en.slice(this.charIndex + 1)
  }

  /** 正解した際 */
  @Watch('clearAnswer')
  onWatchChanged(val: string): void {
    if (val === this.currentWord.en) {
      this.answers += 1
      this.charIndex = 0
      this.nextWord()
    }
  }

  /** 回答中の問題番号 */
  private get currentWordNumber() {
    return this.solvedWords.length + 1
  }

  /** タイマー */
  countDown(): void {
    if (!this.startFlag) {
      return
    }
    this.timer -= 1
    setTimeout(this.countDown, 1000)
    if (this.timer <= 0) {
      clearInterval
      this.result();
    }
  }

  /** ミス音 */
  private missSound() {
    const audioElem = new Audio();
    audioElem.src = "Quiz-Wrong_Buzzer02-1.mp3";
    audioElem.play();
  }

  private typeSound() {
    const audioElem = new Audio();
    audioElem.src = "決定、ボタン押下31.mp3";
    audioElem.play();
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

.gauge {
  height: 12px;
  transition: all .3s ease;
}

.gaugeWrapper {
  border: 1px solid;
  height: 12px;
}

.input-area {
  border-bottom:solid 1px gray ;
  input {
    text-align: center;
    border: none;
    outline: none;
  }
}


.transparent {
  opacity: 0.3;
}
.underline {
  text-decoration: underline;
}
</style>