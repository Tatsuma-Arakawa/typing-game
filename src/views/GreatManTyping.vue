<template>
  <div class="container">
  
    <!-- スタート前 -->
    <div v-if="startFlag!=true" class="mt-10">
      <div class="title mt-5">
        <h1>ITモード</h1>
        <div class="marker"></div>
      </div>

      <!-- スタートボタン -->
      <div>
        <v-btn
        class="startButton mt-10"
        @click="gameStart"
        color="blue-grey"
        >
          <p>Click to start</p>
        </v-btn>
      </div>

      <!-- 名前入力欄 -->
      <v-text-field
        class="name-text-field mt-10"
        label="Your name"
        v-model="name"
      >
      </v-text-field>

      <!-- ランキングページ遷移ボタン -->
      <div class="mt-5">
        <v-btn
        href="/result"
        color="blue-grey"
        small
        >
          <p class="button">View ranking</p>
        </v-btn>
      </div>

    </div>

    <!-- カウントダウン -->
    <div v-if="readFlag">
      <p class="count-down-number">{{ readTime }}</p>
    </div>

    <!-- ゲーム中に表示する部分 -->
    <div v-if="startFlag">

      <!--問題数 -->
      <div class="mt-5">
        <div>第{{ currentWordNumber }}問</div>
      </div>

      <!-- 日本語出題問題 -->
      <div class="ja-word mt-10">
        {{ currentWord.ja }}
      </div>

      <!-- 回答欄 -->
      <div>
        <p class="word">
          <span class="transparent">{{ clearAnswer }}</span>
          <span class="underline">{{ nowAnswer }}</span>
          <span>{{ notAnswer }}</span>
        </p>
      </div>

      <!-- 残り時間 -->
      <div class="mt-10">
        <div>制限時間：残り{{ timer }}秒</div>
      </div>

      <!-- スコア -->
      <div class="mt-2">
        <div>スコア:{{ score }}</div>
      </div>
      
    </div>

    <!-- ゲーム終了時に表示する部分 -->
    <div v-if="resultFlag" class="mt-10">

      <!-- ランク -->
      <div class="font-weight-bold rank-font">
        <div>ランク: {{ rank }}</div>
      </div>

      <!-- ランキング -->
      <div class="display-none">
        {{ scores = results.map(item => item.data.score) }}
      </div>
      <div class="font-weight-bold rank-font">
        <div v-if="scores.findIndex((item) => this.score > item) == -1">
          ランキング: {{ scores.length + 1 }}位
        </div>
        <div v-else>
          ランキング: {{ scores.findIndex((item) => this.score > item) + 1 }}位
        </div>
      </div>

      <!-- スコア -->
      <div class="mt-10">
        <div>スコア: {{ score }}</div>
      </div>

      <!-- 回答数 -->
      <div class="mt-2">
        <div>回答数: {{ answers }}問</div>
      </div>

      <!-- タイプ数 -->
      <div class="mt-2">
        <div>タイプ数: {{ typeCount }}問</div>
      </div>

      <!-- ミスタイプ数 -->
      <div class="mt-2">
        <div>ミスタイプ数: {{ typeMissCount }}問</div>
      </div>

      <v-btn
        class="mt-5"
        href="/modeselection"
        color="blue-grey"
        small
      >
        <p class="button">Return to mode selection</p>
      </v-btn>

    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import db from '@/plugins/firestore'

@Component({})

export default class ItTyping extends Vue {
  /** ゲームスタート */
  private startFlag = false;

  /** カウントダウン */
  private readFlag = false;

  /** 結果 */
  private resultFlag = false

  /** 回答数 */
  private answers = 0;

  /** 制限時間 */
  private TIME = 61
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

  /** 名前 */
  private name = '名無し'

  private rankD = 'D'
  private rankC = 'C'
  private rankB = 'B'
  private rankA = 'A'
  private rankS = 'S'

  private scoreD = 80
  private scoreC = 130
  private scoreB = 180
  private scoreA = 230
  private scoreS = 280

  /** 問題 */
  private words: Array<{en: string; ja: string}> = [
    {
      en: 'injekusyonkougeki',
      ja: 'インジェクション攻撃'
    },
    {
      en: 'obujekutosikou',
      ja: 'オブジェクト指向'
    },
    {
      en: 'seitekikatadukegengo',
      ja: '静的型付け言語'
    },
    {
      en: 'yu-za-inta-fe-su',
      ja: 'ユーザーインターフェース'
    },
    {
      en: 'kihonjouhougijutusyasiken',
      ja: '基本情報技術者試験'
    },
    {
      en: 'kurosusaitosukuriputhingu',
      ja: 'クロスサイトスクリプティング'
    },
    {
      en: 'kurosusaitorikuesutofo-jeri',
      ja: 'クロスサイトリクエストフォージェリ'
    },
    {
      en: 'sqlinjekusyon',
      ja: 'SQLインジェクション'
    },
    {
      en: 'apurike-syonsohuto',
      ja: 'アプリケーションソフト'
    },
    {
      en: 'o-punso-su',
      ja: 'オープンソース'
    },
    {
      en: 'sessyonhaijakku',
      ja: 'セッションハイジャック'
    },
    {
      en: 'arugorizumu',
      ja: 'アルゴリズム'
    },
    {
      en: 'puroguramingugengo',
      ja: 'プログラミング言語'
    },
    {
      en: 'ma-kuappugengo',
      ja: 'マークアップ言語'
    },
    {
      en: 'de-tabe-su',
      ja: 'データベース'
    },
    {
      en: 'burokkuche-n',
      ja: 'ブロックチェーン'
    },
    {
      en: 'javascript',
      ja: 'JavaScript'
    },
    {
      en: 'typescript',
      ja: 'TypeScript'
    },
    {
      en: 'sisutemuinthigure-ta-',
      ja: 'システムインティグレーター'
    },
    {
      en: 'indento',
      ja: 'インデント'
    },
    {
      en: 'faiafo-ru',
      ja: 'ファイアフォール'
    },
    {
      en: 'toranzakusyon',
      ja: 'トランザクション'
    },
    {
      en: 'ro-dobaransa',
      ja: 'ロードバランサ'
    },
    {
      en: 'hure-muwa-ku',
      ja: 'フレームワーク'
    },
    {
      en: 'inta-netto',
      ja: 'インターネット'
    },
    {
      en: 'inhura',
      ja: 'インフラ'
    },
    {
      en: 'i-sanetto',
      ja: 'イーサネット'
    },
    {
      en: 'o-ba-ro-do',
      ja: 'オーバーロード'
    },
    {
      en: 'kueri',
      ja: 'クエリ'
    },
    {
      en: 'sutore-zi',
      ja: 'ストレージ'
    },
    {
      en: 'sekyurithiho-ru',
      ja: 'セキュリティホール'
    },
    {
      en: 'domein',
      ja: 'ドメイン'
    },
    {
      en: 'paketto',
      ja: 'パケット'
    },
    {
      en: 'purotokoru',
      ja: 'プロトコル'
    },
    {
      en: 'maigure-syon',
      ja: 'マイグレーション'
    },
  ]

  /** 回答後の問題 */
  private solvedWords: Array<string> = [];

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
  private created (): void {
    this.read()
  }

  /** スコアの配列 */
  private scores: Array<number> = this.results.map(item => item.data.score)
 
  /** ゲームスタート */
  private gameStart(): void {
    this.solvedWords = [];
    this.answers = 0
    this.typeCount = 0
    this.typeMissCount = 0
    this.charIndex = 0
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
  private result(): void {
    this.resultFlag = true
    this.startFlag = false
    if (this.score >= this.scoreD) {
      this.rank = this.rankD
    } if (this.score >= this.scoreC) {
      this.rank = this.rankD
    } if (this.score >= this.scoreB) {
      this.rank = this.rankB
    } if (this.score >= this.scoreA) {
      this.rank = this.rankA
    } if (this.score >= this.scoreS) {
      this.rank = this.rankS
    }
    /** firestoreに情報を追加 */
    db.collection('results')
      .add({
        name: this.name,
        score: this.score,
        mode: 'IT',
        rank: this.rank
      })
  }

  /** ランダムで問題を出題する */
  private get currentWord(): { en: string; ja: string; } {
    const unsolvedWords = this.words.filter((word: {en: string; ja: string}) => {
      return (!this.solvedWords.includes(word as never))
    })
    const randomIndex: number = Math.floor(Math.random()*unsolvedWords.length)
    return unsolvedWords[randomIndex]
  }

  /** 次の問題 */
  private nextWord(): void {
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
  private get currentWordNumber(): number {
    return this.solvedWords.length + 1
  }

  /** スコア */
    get score(): number {
    return Math.round(
      (this.typeCount - (this.typeMissCount * 2))
    )
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
  private missSound(): void {
    const audioElem = new Audio();
    audioElem.src = "Quiz-Wrong_Buzzer02-1.mp3";
    audioElem.play();
  }

  /** タイプ音 */
  private typeSound(): void {
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
  margin: 0 auto;
  text-align: center;
}

.title {
  position: relative;
  font-size: 48px;
  h1 {
    font-size: 1.5em;
  }
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
    margin: auto 0;
    color: #fffafa;
    font-weight: 600;
  }
  :hover {
    opacity: 0.7;
  }
}

.count-down-number {
  font-size: 3em;
}

.word {
  font-size: 2em;
  width: 100%;
}

.ja-word {
  font-size: 1.2em;
}

.transparent {
  opacity: 0.3;
}

.underline {
  font-size: 1.1em;
}

.rank-font {
  font-size: 1.5em;
}

.button {
  color: #fffafa;
  margin: auto 0;
  font-weight: 600;
}

.name-text-field {
  margin: 0 auto;
  max-width: 300px;
}

.display-none {
  display: none;
}
</style>