<template>
  <div class="container">
  
    <!-- スタート前 -->
    <div v-if="titleFlag" class="mt-10">
      <div class="title mt-5">
        <h1>筋肉モード</h1>
        <div class="marker"></div>
      </div>

      <!-- スタートボタン -->
      <v-btn
        class="startButton mt-10"
        @click="gameStart"
        color="blue-grey"
      >
        <p>クリックでスタート</p>
      </v-btn>

      <!-- 名前入力欄 -->
      <v-form ref="form" v-model="valid">
        <v-text-field
          class="name-text-field mt-10"
          label="名前"
          v-model="name"
          :rules="rules"
          counter="10"
        >
        </v-text-field>
      </v-form>

      <!-- ランキングページ遷移ボタン -->
      <div class="mt-5">
        <v-btn
          href="/result"
          color="blue-grey"
          small
        >
          <p class="button">ランキング</p>
        </v-btn>
      </div>

     <!-- モード選択ページ遷移ボタン -->
     <div class="mt-5">
        <v-btn
          href="/"
          color="blue-grey"
          small
        >
          <p class="button">モード選択に戻る</p>
        </v-btn>
      </div>

    </div>

    <!-- カウントダウン -->
    <div v-if="readFlag" class="mt-16">
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
          <span class="entering">{{ nowAnswer }}</span>
          <span>{{ notAnswer }}</span>
        </p>
      </div>

      <!-- 残り時間 -->
      <div class="mt-10">
        <div class="font-size-large">制限時間：残り<span :class="{ fontRed: isFontRed }">{{ timer }}</span>秒</div>
      </div>

      <!-- スコア -->
      <div class="mt-2">
        <div>スコア:{{ score }}</div>
      </div>
      
    </div>
  
    <!-- finish -->
    <div v-if="finishFlag"> 
      <div class="mt-16">
        <p class="finish-font">終了!!</p>
      </div>
    </div>

    <!-- ゲーム終了時に表示する部分 -->
    <div v-if="resultFlag" class="mt-5">

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
          ランキング: {{ scores.length + 1 }}位<br>
          ({{ scores.length + 1 }}人中)
        </div>
        <div v-else>
          ランキング: {{ scores.findIndex((item) => this.score > item) + 1 }}位<br>
          ({{ scores.length + 1 }}人中)
        </div>
      </div>

      <!-- スコア -->
      <div class="mt-5">
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

      <!-- リプレイボタン -->
      <div class="mt-5">
        <v-btn
          @click="reload()"
          color="blue-grey"
          small
        >
          <p class="button">もう一度プレイする</p>
        </v-btn>
      </div>

      <!-- ランキングページ遷移ボタン -->
      <div class="mt-5">
        <v-btn
          href="/result"
          color="blue-grey"
          small
        >
          <p class="button">ランキング</p>
        </v-btn>
      </div>

     <!-- モード選択ページ遷移ボタン -->
      <div class="mt-5">
        <v-btn
          href="/"
          color="blue-grey"
          small
        >
          <p class="button">モード選択に戻る</p>
        </v-btn>
    </div>

    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Ref } from 'vue-property-decorator';
import db from '@/plugins/firestore'
import { VForm } from '@/main';


@Component({})

export default class ItTyping extends Vue {
  /** タイトル */
  private titleFlag = true

  /** ゲームスタート */
  private startFlag = false

  /** カウントダウン */
  private readFlag = false
  
  /** ゲーム終了 */
  private finishFlag = false

  /** 結果 */
  private resultFlag = false

  /** 回答数 */
  private answers = 0

  /** 制限時間 */
  private TIME = 61
  private timer: number = this.TIME

  /** 残り時間短くなると数字が赤くなる */
  private isFontRed = false

  /** ゲームスタートカウントダウン */
  private READ = 4
  private readTime: number = this.READ

  /** 終了の文字表示時間 */
  private FINISH = 3
  private finishTime: number = this.FINISH

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
      en: 'daikyoukinn',
      ja: '大胸筋（だいきょうきん）'
    },
    {
      en: 'syoukyoukinn',
      ja: '小胸筋（しょうきょうきん）'
    },
    {
      en: 'sakotukakinn',
      ja: '鎖骨下筋（さこつかきん）'
    },
    {
      en: 'zenkyokinn',
      ja: '前鋸筋（ぜんきょきん）'
    },
    {
      en: 'gairokkankinn',
      ja: '外肋間筋（がいろっかんきん）'
    },
    {
      en: 'nairokkankinn',
      ja: '内肋間筋（ないろっかんきん）'
    },
    {
      en: 'sainairokkankinn',
      ja: '最内肋間筋（さいないろっかんきん）'
    },
    {
      en: 'rokukakinn',
      ja: '肋下筋（ろくかきん）'
    },
    {
      en: 'kyououkinn',
      ja: '胸横筋（きょうおうきん）'
    },
    {
      en: 'rokkotukyokinn',
      ja: '肋骨挙筋（ろっこつきょきん）'
    },
    {
      en: 'oukakumaku',
      ja: '横隔膜（おうかくまく）'
    },
    {
      en: 'hukutyokukinn',
      ja: '腹直筋（ふくちょくきん）'
    },  
    {
      en: 'suitaikinn',
      ja: '錐体筋（すいたいきん）'
    },
    {
      en: 'gaihukusyakinn',
      ja: '外腹斜筋（がいふくしゃきん）'
    },
    {
      en: 'naihukusyakinn',
      ja: '内腹斜筋（ないふくしゃきん）'
    },
    {
      en: 'hukuoukinn',
      ja: '腹横筋（ふくおうきん）'
    },
    {
      en: 'youhoukeikinn',
      ja: '腰方形筋（ようほうけいきん）'
    },
    {
      en: 'souboukinn',
      ja: '僧帽筋（そうぼうきん）'
    },
    {
      en: 'kouhaikinn',
      ja: '広背筋（こうはいきん）'
    },
    {
      en: 'syouryoukeikinn',
      ja: '小菱形筋（しょうりょうけいきん）'
    },
    {
      en: 'dairyoukeikinn',
      ja: '大菱形筋（だいりょうけいきん）'
    },
    {
      en: 'kenkoukyokinn',
      ja: '肩甲挙筋（けんこうきょきん）'
    },
    {
      en: 'joukoukyokinn',
      ja: '上後鋸筋（じょうこうきょきん）'
    },
    {
      en: 'kakoukyokinn',
      ja: '下後鋸筋（かこうきょきん）'
    },
    {
      en: 'toubanjoukinn',
      ja: '頭板状筋（とうばんじょうきん）'
    },
    {
      en: 'keibanjoukinn',
      ja: '頸板状筋（けいばんじょうきん）'
    },
    {
      en: 'tyourokukinn',
      ja: '腸肋筋（ちょうろくきん）'
    },
    {
      en: 'saityoukinn',
      ja: '最長筋（さいちょうきん）'
    },
    {
      en: 'kyokukinn',
      ja: '棘筋（きょくきん）'
    },
    {
      en: 'hankyokukinn',
      ja: '半棘筋（はんきょくきん）'
    },
    {
      en: 'taretukinn',
      ja: '多裂筋（たれつきん）'
    },
    {
      en: 'kaisenkinn',
      ja: '回旋筋（かいせんきん）'
    },
    {
      en: 'sankakukinn',
      ja: '三角筋（さんかくきん）'
    },
    {
      en: 'syouenkinn',
      ja: '小円筋（しょうえんきん）'
    },
    {
      en: 'kyokujoukinn',
      ja: '棘上筋（きょくじょうきん）'
    },
    {
      en: 'kyokukakinn',
      ja: '棘下筋（きょくかきん）'
    },
    {
      en: 'daienkinn',
      ja: '大円筋（だいえんきん）'
    },
    {
      en: 'kenkoukakinn',
      ja: '肩甲下筋（けんこうかきん）'
    },
    {
      en: 'jouwannnitoukinn',
      ja: '上腕二頭筋（じょうわんにとうきん）'
    },
    {
      en: 'ukouwankinn',
      ja: '鳥口腕筋（うこうわんきん）'
    },
    {
      en: 'jouwankinn',
      ja: '上腕筋（じょうわんきん）'
    },
    {
      en: 'jouwansantoukinn',
      ja: '上腕三頭筋（じょうわんさんとうきん）'
    },
    {
      en: 'tyuukinn',
      ja: '肘筋（ちゅうきん）'
    },
    {
      en: 'enkainaikinn',
      ja: '円回内筋（えんかいないきん）'
    },
    {
      en: 'tousokusyukonkukkinn',
      ja: '橈側手根屈筋（とうそくしゅこんくっきん）'
    },
    {
      en: 'tyousyoukinn',
      ja: '長掌筋（ちょうしょうきん）'
    },
    {
      en: 'syakusokusyukonkukkinn',
      ja: '尺側手根屈筋（しゃくそくしゅこんくっきん）'
    },
    {
      en: 'sensikukkinn',
      ja: '浅指屈筋（せんしくっきん）'
    },
    {
      en: 'sinsikukkinn',
      ja: '深指屈筋（しんしくっきん）'
    },
    {
      en: 'tyoubosikukkinn',
      ja: '長母指屈筋（ちょうぼしくっきん）'
    },
    {
      en: 'houkeikainaikinn',
      ja: '方形回内筋（ほうけいかいないきん）'
    },
    {
      en: 'wantoukoukinn',
      ja: '腕橈骨筋（わんとうこうきん）'
    },
    {
      en: 'tyoutousokusyukonsinkinn',
      ja: '長橈側手根伸筋（ちょうとうそくしゅこんしんきん）'
    },
    {
      en: 'tantousokusyukonsinkinn',
      ja: '短橈側手根伸筋（たんとうそくしゅこんしんきん）'
    },
    {
      en: 'sisinkinn',
      ja: '指伸筋（ししんきん）'
    },
    {
      en: 'syousisinkinn',
      ja: '小指伸筋（しょうししんきん）'
    },
    {
      en: 'syakusokusyukonsinkinn',
      ja: '尺側手根伸筋（しゃくそくしゅこんしんきん）'
    },
    {
      en: 'kaigaikinn',
      ja: '回外筋（かいがいきん）'
    },
    {
      en: 'tyoubosigaitenkinn',
      ja: '長母指外転筋（ちょうぼしがいてんきん）'
    },
    {
      en: 'tanbosisinkinn',
      ja: '短母指伸筋（たんぼししんきん）'
    },
    {
      en: 'tyoubosisinkinn',
      ja: '長母指伸筋（ちょうぼししんきん）'
    },
    {
      en: 'zisisinkinn',
      ja: '示指伸筋（じししんきん）'
    },
    {
      en: 'tanbosigaitenkinn',
      ja: '短母指外転筋（たんぼしがいてんきん）'
    },
    {
      en: 'tanbosikukkinn',
      ja: '短母指屈筋（たんぼしくっきん）'
    },
    {
      en: 'bositairitukinn',
      ja: '母指対立筋（ぼしたいりつきん）'
    },
    {
      en: 'bosinaitenkinn',
      ja: '母指内転筋（ぼしないてんきん）'
    },
    {
      en: 'tansyoukinn',
      ja: '短掌筋（たんしょうきん）'
    },
    {
      en: 'syousigaitenkinn',
      ja: '小指外転勤（しょうしがいてんきん）'
    },
    {
      en: 'tansyousikukkinn',
      ja: '短小指屈筋（たんしょうしくっきん）'
    },
    {
      en: 'syousitairitukinn',
      ja: '小指対立筋（しょうしたいりつきん）'
    },
    {
      en: 'tyouyoukinn',
      ja: '虫様筋（ちゅうようきん）'
    },
    {
      en: 'syousokukokkankinn',
      ja: '掌側骨間筋（しょうそくこっかんきん）'
    },
    {
      en: 'haisokukokkankinn',
      ja: '背側骨間筋（はいそくこっかんきん）'
    },
    {
      en: 'tyoukotukinn',
      ja: '腸骨筋（ちょうこつきん）'
    },
    {
      en: 'daiyoukinn',
      ja: '大腰筋（だいようきん）'
    },
    {
      en: 'syouyoukinn',
      ja: '小腰筋（しょうようきん）'
    },
    {
      en: 'daidenkinn',
      ja: '大臀筋（だいでんきん）'
    },
    {
      en: 'syoudenkinn',
      ja: '小臀筋（しょうでんきん）'
    },
    {
      en: 'daitaikinmakutyoukinn',
      ja: '大腿筋膜張筋（だいたいきんまくちょうきん）'
    },
    {
      en: 'rijoukinn',
      ja: '梨状筋（りじょうきん）'
    },
    {
      en: 'naiheisakinn',
      ja: '内閉鎖筋（ないへいさきん）'
    },
    {
      en: 'jousousikinn',
      ja: '上双子筋（じょうそうしきん）'
    },
    {
      en: 'kasousikinn',
      ja: '下双子筋（かそうしきん）'
    },
    {
      en: 'daitaihoukeikenn',
      ja: '大腿方形筋（だいたいほうけいきん）'
    },
    {
      en: 'houkoukinn',
      ja: '縫工筋（ほうこうきん）'
    },
    {
      en: 'daitaityokkinn',
      ja: '大腿直筋（だいたいちょっきん）'
    },
    {
      en: 'naisokukoukinn',
      ja: '内側広筋（ないそくこうきん）'
    },
    {
      en: 'tyuukankoukinn',
      ja: '中間広筋（ちゅうかんこうきん）'
    },
    {
      en: 'gaisokukoukinn',
      ja: '外側広筋（がいそくこうきん）'
    },
    {
      en: 'tikotukinn',
      ja: '恥骨筋（ちこつきん）'
    },
    {
      en: 'tyounaitenkinn',
      ja: '長内転筋（ちょうないてんきん）'
    },
    {
      en: 'tannaitenkinn',
      ja: '短内転筋（たんないてんきん）'
    },
    {
      en: 'dainaitenkinn',
      ja: '大内転筋（だいないてんきん）'
    },
    {
      en: 'hakukinn',
      ja: '薄筋（はくきん）'
    },
    {
      en: 'gaiheisakinn',
      ja: '外閉鎖筋（がいへいさきん）'
    },
    {
      en: 'daitanitoukinn',
      ja: '大腿二頭筋（だいたにとうきん）'
    },
    {
      en: 'hankenyoukinn',
      ja: '半腱様筋（はんけんようきん）'
    },
    {
      en: 'hanmakuyoukinn',
      ja: '半膜様筋（はんまくようきん）'
    },
    {
      en: 'zenkeikotukinn',
      ja: '前脛骨筋（ぜんけいこつきん）'
    },
    {
      en: 'tyoubosisinkinn',
      ja: '長母趾伸筋（ちょうぼししんきん）'
    },
    {
      en: 'tyousisinkinn',
      ja: '長趾伸筋（ちょうししんきん）'
    },
    {
      en: 'daisanhikotukinn',
      ja: '第三腓骨筋（だいさんひこつきん）'
    },
    {
      en: 'tyouhikotukinn',
      ja: '長腓骨筋（ちょうひこつきん）'
    },
    {
      en: 'tanhikotukinn',
      ja: '短腓骨筋（たんひこつきん）'
    },
    {
      en: 'kataisantoukinn',
      ja: '下腿三頭筋（かたいさんとうきん）'
    },
    {
      en: 'sokuteikinn',
      ja: '足低筋（そくていきん）'
    },
    {
      en: 'sikkakinn',
      ja: '膝窩筋（しっかきん）'
    },
    {
      en: 'koukeikotukinn',
      ja: '後脛骨筋（こうけいこつきん）'
    },
    {
      en: 'tyousikukkinn',
      ja: '長趾屈筋（ちょうしくっきん）'
    },
    {
      en: 'tyoubosikukkinn',
      ja: '長母趾屈筋（ちょうぼしくっきん）'
    },
    {
      en: 'tanbosisinkinn',
      ja: '短母趾伸筋（たんぼししんきん）'
    },
    {
      en: 'tansisinkinn',
      ja: '短趾伸筋（たんししんきん）'
    },
    {
      en: 'tanbosikukkinn',
      ja: '短母趾屈筋（たんぼしくっきん）'
    },
    {
      en: 'bosinaitenkinn',
      ja: '母趾内転筋（ぼしないてんきん）'
    },
    {
      en: 'bosigaitenkinn',
      ja: '母趾外転筋（ぼしがいてんきん）'
    },
    {
      en: 'syousigaitenkinn',
      ja: '小趾外転筋（しょうしがいてんきん）'
    },
    {
      en: 'tansyousikukkinn',
      ja: '短小趾屈筋（たんしょうしくっきん）'
    },
    {
      en: 'tansikukkinn',
      ja: '短趾屈筋（たんしくっきん）'
    },
    {
      en: 'sokuteihoukeikinn',
      ja: '足底方形筋（そくていほうけいきん）'
    },
    {
      en: 'tyouyoukinn',
      ja: '虫様筋（ちょうようきん）'
    },
    {
      en: 'teisokukokkankinn',
      ja: '低側骨間筋（ていそくこっかんきん）'
    },
    {
      en: 'haisokukokkankinn',
      ja: '背側骨間筋（はいそくこっかんきん）'
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
  private created(): void {
    this.read()
  }

  /** スコアの配列 */
  private scores: Array<number> = this.results.map(item => item.data.score)

  /** 名前バリデーション */
  private rules = [
    (v: string) => v.length <= 10 || '10文字以内で入力してください',
    (v: string) => !!v || '必ず入力してください',
  ]
  @Ref("form") readonly form!: VForm;

  /** 名前のバリデーションが通ったかどうかのフラグ */
  private valid = false
 
  /** ゲームスタート */
  private gameStart(): void {
    if (this.form.validate()) {
      this.titleFlag = false
      this.resultFlag = false
      this.readFlag = true
      this.finishFlag = false
      this.isFontRed = false
      this.solvedWords = []
      this.answers = 0
      this.typeCount = 0
      this.typeMissCount = 0
      this.charIndex = 0
      this.rank = 'E'
      this.timer = this.TIME
      this.readTime = this.READ
      this.finishTime = this.FINISH
      this.words = this.wordList
      this.countRead()
    }
  }

  /** ゲームスタートまでのカウントダウン */
  countRead(): void {
    if (!this.readFlag) {
      return
    }
    this.readTime -= 1
    setTimeout(this.countRead, 1000)
    if (this.readTime <= 0) {
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
  private get score(): number {
    return Math.round(
      (this.typeCount - (this.typeMissCount * 2))
    )
  }

  /** タイマー */
  private countDown(): void {
    if (!this.startFlag) {
      return
    }
    this.timer -= 1
    setTimeout(this.countDown, 1000)
    if (this.timer <= 10) {
      this.isFontRed = true
    }
    if (this.timer <= 0) {
      this.timer = this.TIME
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
        mode: '筋肉',
        rank: this.rank
      })
    this.startFlag = false
    this.finishFlag = true
    this.finishSound();
    this.finish();
  }

  /** Finish */
  private finish(): void {
    if (!this.finishFlag) {
      return
    }
    this.finishTime -= 1
    setTimeout(this.finish, 1000)
    if (this.finishTime <= 0) {
      this.finishFlag = false
      this.resultFlag = true
      this.finishTime = this.FINISH
    }
  }

  /** リロード */
  private reload(): void {
    location.reload();
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

  /** 終了音 */
  private finishSound(): void {
    const audioElem = new Audio();
    audioElem.src = "和太鼓でドドン.mp3";
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
  font-size: 4em;
}

.word {
  font-size: 2.5em;
  width: 100%;
}

.ja-word {
  font-size: 1.5em;
}

.transparent {
  opacity: 0.3;
}

.entering {
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

.finish-font {
  font-size: 3em;
  font-weight: 600;
}

.font-size-large {
  font-size: 1.2em;
  font-weight: 600;
}

.fontRed {
  color: #dc143c;
}
</style>