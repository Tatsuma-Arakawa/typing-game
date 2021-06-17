<template>
  <div class="container">
  
    <!-- スタート前 -->
    <div v-if="startFlag!=true" class="mt-10">
      <div class="title mt-5">
        <h1>世界の偉人モード</h1>
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

     <!-- モード選択ページ遷移ボタン -->
     <div class="mt-5">
        <v-btn
          href="/"
          color="blue-grey"
          small
        >
          <p class="button">Return to mode selection</p>
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
  private wordList: Array<{en: string; ja: string}> = [
    {
      en: 'toyotomihideyosi',
      ja: '豊臣秀吉'
    },
    {
      en: "aruhureddono-beru",
      ja: "アルフレッドノーベル"
    },
    {
      en: "akubarutaitei",
      ja: "アクバル大帝"
    },
    {
      en: "maia-amusyeruro-tosiruto",
      ja: "マイアーアムシェルロートシルト"
    },
    {
      en: "hanmurabiou",
      ja: "ハンムラビ王"
    },
    {
      en: "syarurudogo-ru",
      ja: "シャルルドゴール"
    },
    {
      en: "aruhureddodaiou",
      ja: "アルフレッド大王"
    },
    {
      en: "ramusesu2sei",
      ja: "ラムセス２世"
    },
    {
      en: "gurierumomaruko-ni",
      ja: "グリエルモマルコーニ"
    },
    {
      en: "athirradaiou",
      ja: "アッティラ大王"
    },
    {
      en: "riryuuki",
      ja: "李隆基"
    },
    {
      en: "kemaruatatelyurukupasya",
      ja: "ケマルアタテュルクパシャ"
    },
    {
      en: "aruberutoainsyutainn",
      ja: "アルベルトアインシュタイン"
    },
    {
      en: "unubanusu2sei",
      ja: "ウルバヌス2世"
    },
    {
      en: "simonboribaru",
      ja: "シモンボリバル"
    },
    {
      en: "jannnudaruku",
      ja: "ジャンヌダルク"
    },
    {
      en: "edowa-dojennna-",
      ja: "エドワードジェンナー"
    },
    {
      en: "nuruhati",
      ja: "ヌルハチ"
    },
    {
      en: "kyurosu2sei",
      ja: "キュロス２世"
    },
    {
      en: "pyu-torutaitei",
      ja: "ピョートル大帝"
    },
    {
      en: "nikorausukoperunikusu",
      ja: "ニコラウスコペルニクス"
    },
    {
      en: "wiriamu1sei",
      ja: "ウィリアム１世"
    },
    {
      en: "hannnibarubaruka",
      ja: "ハンニバルバルカ"
    },
    {
      en: "tito-",
      ja: "チトー"
    },
    {
      en: "feripe2sei",
      ja: "フェリペ2世"
    },
    {
      en: "raitokyoudai",
      ja: "ライト兄弟"
    },
    {
      en: "innnokenthiususansei",
      ja: "インノケンティウス三世"
    },
    {
      en: "cha-ruzuaruja-nonpa-sonzu",
      ja: "チャールズアルジャーノンパーソンズ"
    },
    {
      en: "sibasenn",
      ja: "司馬遷"
    },
    {
      en: "herodotosu",
      ja: "ヘロドトス"
    },
    {
      en: "youkenn",
      ja: "楊堅"
    },
    {
      en: "assyu-rubaniparuou",
      ja: "アッシュールバニパル王"
    },
    {
      en: "karakaratei",
      ja: "カラカラ帝"
    },
    {
      en: "metterunihi",
      ja: "メッテルニヒ"
    },
    {
      en: "kureopatora7sei",
      ja: "クレオパトラ7世"
    },
    {
      en: "sonbunn",
      ja: "孫文"
    },
    {
      en: "hu-go-gurothiusu",
      ja: "フーゴーグロティウス"
    },
    {
      en: "youdai",
      ja: "煬帝"
    },
    {
      en: "erizabesu1sei",
      ja: "エリザベス１世"
    },
    {
      en: "butei",
      ja: "武帝"
    },
    {
      en: "za-hirubaibarusu",
      ja: "ザーヒルバイバルス"
    },
    {
      en: "mariaterezia",
      ja: "マリアテレジア"
    },
    {
      en: "eirakutei",
      ja: "永楽帝"
    },
    {
      en: "dareiosu1sei",
      ja: "ダレイオス１世"
    },
    {
      en: "kisou",
      ja: "徽宗"
    },
    {
      en: "oriba-kuromuwiru",
      ja: "オリバークロムウェル"
    },
    {
      en: "nikoratesura",
      ja: "ニコラテスラ"
    },
    {
      en: "seitaikou",
      ja: "西太后"
    },
    {
      en: "wisutoncha-tiru",
      ja: "ウィストンチャーチル"
    },
    {
      en: "soronn",
      ja: "ソロン"
    },
    {
      en: "moutakutou",
      ja: "毛沢東"
    },
    {
      en: "jonrokku",
      ja: "ジョンロック"
    },
    {
      en: "tyoukyouinn",
      ja: "趙匡胤"
    },
    {
      en: "mehumeto2sei",
      ja: "メフメト２世"
    },
    {
      en: "naporeon3sei",
      ja: "ナポレオン３世"
    },
    {
      en: "syugensyou",
      ja: "朱元璋"
    },
    {
      en: "aburahamurinka-nn",
      ja: "アブラハムリンカーン"
    },
    {
      en: "aizakkunyu-tonn",
      ja: "アイザックニュートン"
    },
    {
      en: "koubutei",
      ja: "光武帝"
    },
    {
      en: "yohanesugu-tenberuku",
      ja: "ヨハネスグーテンベルク"
    },
    {
      en: "sairinn",
      ja: "蔡倫"
    },
    {
      en: "jo-ziwasintonn",
      ja: "ジョージワシントン"
    },
    {
      en: "dhiokurethianusutei",
      ja: "ディオクレティアヌス帝"
    },
    {
      en: "je-muzuwatto",
      ja: "ジェームズワット"
    },
    {
      en: "hubiraiha-nn",
      ja: "フビライハーン"
    },
    {
      en: "saradhinn",
      ja: "サラディン"
    },
    {
      en: "perikuresu",
      ja: "ペリクレス"
    },
    {
      en: "jonfittujerarudokenedhi",
      ja: "ジョンフィッツジェラルドケネディ"
    },
    {
      en: "ogotaiha-nn",
      ja: "オゴタイハーン"
    },
    {
      en: "homerosu",
      ja: "ホメロス"
    },
    {
      en: "rui14sei",
      ja: "ルイ14世"
    },
    {
      en: "thimu-ru",
      ja: "ティムール"
    },
    {
      en: "hurankurinru-zuberuto",
      ja: "フランクリンルーズベルト"
    },
    {
      en: "urazimi-rure-ninn",
      ja: "ウラジミールレーニン"
    },
    {
      en: "ryouhou",
      ja: "劉邦"
    },
    {
      en: "yusuthinianusutei",
      ja: "ユスティニアヌス帝"
    },
    {
      en: "ka-rutaitei",
      ja: "カール大帝"
    },
    {
      en: "riseiminn",
      ja: "李世民"
    },
    {
      en: "sureimantaitei",
      ja: "スレイマン大帝"
    },
    {
      en: "maruthinruta-",
      ja: "マルティンルター"
    },
    {
      en: "teodosiusutei",
      ja: "テオドシウス帝"
    },
    {
      en: "gandhi-",
      ja: "ガンディー"
    },
    {
      en: "puratonn",
      ja: "プラトン"
    },
    {
      en: "go-tamasidda-ruta",
      ja: "ゴータマシッダールタ"
    },
    {
      en: "viruherumu2sei",
      ja: "ヴィルヘルム2世"
    },
    {
      en: "kurisutofa-koronbusu",
      ja: "クリストファーコロンブス"
    },
    {
      en: "ka-rumarukusu",
      ja: "カールマルクス"
    },
    {
      en: "konsutanthinusutei",
      ja: "コンスタンティヌス帝"
    },
    {
      en: "suta-rinn",
      ja: "スターリン"
    },
    {
      en: "otto-finbisumaruku",
      ja: "オットーフォンビスマルク"
    },
    {
      en: "naporeonbonaparuto",
      ja: "ナポレオンボナパルト"
    },
    {
      en: "yuriusukaesaru",
      ja: "ユリウスカエサル"
    },
    {
      en: "koukyuu",
      ja: "孔丘"
    },
    {
      en: "augusutwusu",
      ja: "アウグストゥス"
    },
    {
      en: "arekusanda-daiou",
      ja: "アレクサンダー大王"
    },
    {
      en: "sikoutei",
      ja: "始皇帝"
    },
    {
      en: "adoruhuhitora-",
      ja: "アドルフヒトラー"
    },
    {
      en: "tingisuha-nn",
      ja: "チンギスハーン"
    },
    {
      en: "muhanmado",
      ja: "ムハンマド"
    },
    {
      en: "iesukirisuto",
      ja: "イエスキリスト"
    }
  ]
  private words: Array<{en: string; ja: string}> = this.wordList

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
    this.words = this.wordList
    this.countRead()
  }

  /** ゲームスタートまでのカウントダウン */
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
      window.addEventListener('keypress', this.keyCheck)
      this.countDown()
    }
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
    if (this.words.length == 1) {
      this.words = this.wordList
    }
    this.solvedWords.push(this.currentWord.en as never)
  }

  /** 出題した問題をwordsから削除して二度同じ問題を出題しない様にする */
  private deleteWord() {
    this.words = this.words.filter((item) => {
      return item !== this.currentWord
    }) 
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
      this.deleteWord()
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
      window.removeEventListener('keypress', this.keyCheck)
      this.result();
    }
  }

  /** ゲーム終了後 */
  private result(): void {
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
        mode: '世界の偉人',
        rank: this.rank
      })
    this.resultFlag = true
    this.startFlag = false
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