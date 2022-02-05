<template>
  <div id="wrapper">
    <div class="header">
      <h1>Wordle Easy</h1>
      <h2>Row: {{ row }} - Column: {{ column }}</h2>
    </div>
    <div class="form">
      <div class="inputWrapper">
        <label for="letterInput">Letter:</label>
        <input id="letterInput" type="text" maxlength="1" @input="alphaOnly($event)" :value="letter" />

        <label for="statusInput">Status:</label>
        <select id="statusInput" :value="status" @change="statusChange($event)">
          <option value="absent">Absent (Grey)</option>
          <option value="present">Present (Yellow)</option>
          <option value="known">Known (Green)</option>
        </select>
      </div>

      <div class="row" v-for="(r, i) in 5" :key="i">
        <Letter
          @change-block="changeBlock"
          :class="{ selected: block === `r${r}c${c}` }"
          :uid="`r${r}c${c}`"
          :status="blocks[`r${r}c${c}`]?.status"
          v-for="(c, k) in 5"
          :key="k"
          :letter="blocks[`r${r}c${c}`]?.letter"
        />
      </div>
    </div>

    <div class="words">
      <p>Showing {{ shortList.length }} of {{ wordBank.length }}</p>
      <span class="word" :class="{ inWordle: entry.in_wordle }" v-for="entry in shortList" :key="entry.word">
        {{ entry.word }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import Letter from './components/Letter.vue'
import { Word, WordleEasy } from './lib/wordleEasy'

interface Block {
  [key: string]: {
    letter: string
    status: string
  }
}

@Options({
  components: {
    Letter,
  },
})
export default class App extends Vue {
  row = '1'
  column = '1'
  letter = ''
  status = 'default'
  blocks: Block = {}
  WE: WordleEasy|null = null
  wordBank: Word[] = []

  alphaOnly(event: any): void {
    const letter = event?.target.value
    if (!letter.match(/[A-Za-z]/)) {
      this.letter = ''
    } else {
      this.letter = letter.toLowerCase()
      if(this.status === 'default') {
        this.status = 'absent'
      }
      this.setBlock(this.block, this.letter, this.status)
    }
  }

  statusChange(event: any): void {
    this.status = event?.target?.value
    this.setBlock(this.block, this.letter, this.status)
  }

  changeBlock(letter: string, block: string, status = 'default'): void {
    this.letter = letter
    this.block = block
    this.status = status

    this.setBlock(block, letter, status)
  }

  setBlock(block: string, letter: string, status = 'default'): void {
    this.blocks[block] = { letter: letter, status: status }

    if(letter) {
      this.reduceWords()
    }
  }

  reduceWords(): void {
    this.WE = new WordleEasy()
    const present: {[key: string]: number[]} = {}

    for(const [blockInfo, letterInfo] of Object.entries(this.blocks)) {
      const letter = letterInfo.letter
      const column = parseInt(blockInfo[3])

      switch (letterInfo.status) {
        case 'absent':
          this.WE.removeLetter(letter)
          break
        case 'known':
          this.WE.setPosition(letter, column)
          break
        case 'present':
          if (Object.keys(present).includes(letter)) {
            present[letter].push(column)
          } else {
            present[letter] = [column]
          }
          break
        default:
          break
      }
    }


    for (const [letter, pos] of Object.entries(present)) {
      this.WE.setKnown(letter, pos)
    }

    this.wordBank = this.WE.sorted()
  }

  get shortList(): Word[] {
    return this.wordBank.splice(0,100)
  }


  get block(): string {
    return `r${this.row}c${this.column}`
  }

  set block(value: string) {
    this.row = value[1]
    this.column = value[3]
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
body {
  background: #121213;
  color: #d7dadc;
  font-size: 18px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-top: 25px;
}
#wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
}
.header {
  text-align: center;
  width: 100%;
  margin-bottom: 1rem;
}
.form {
  flex: 1;
  text-align: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}
.inputWrapper {
  margin-bottom: 1rem;
}
#letterInput {
  width: 25px;
  margin-right: 25px;
}
.words {
  flex: 3;
  flex-wrap: wrap;
  padding: 10px;
}
.word {
  margin-right:5px;
  display: inline-flex;
}
.row {
  display: flex;
  justify-content: center;
}
.inWordle {
  color: #8be9fd;
  font-size: 1.3em;
}
</style>
