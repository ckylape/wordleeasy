import wordleArray from '../data/wordle'
import wordsArray from '../data/words'

export interface Word {
  word: string,
  in_wordle: boolean
}

export class WordleEasy {
  words: Word[]
  filtered: Word[]
  knownPositions: string[]

  constructor() {
    this.words = this.parseWords()
    this.filtered = this.words
    this.knownPositions = ['.', '.', '.', '.', '.']
  }

  parseWords() {
    const wordBank = []
    const words: string[] = wordsArray
    const wordle: string[] = wordleArray
    for (const word of words) {
      wordBank.push({ word: word, in_wordle: wordle.includes(word) })
    }
    return wordBank
  }

  setKnown(letter: string, notPosition: number[]) {
    return notPosition.forEach((pos) => {
      this.filtered = this.filtered.filter((entry) => {
        return entry.word.includes(letter) && entry.word[pos - 1] !== letter
      })
    })
  }

  setPosition(letter: string, pos: number) {
    this.filtered = this.filtered.filter((entry) => {
      return entry.word[pos - 1] === letter
    })
  }

  removeLetter(letter: string) {
    this.filtered = this.filtered.filter(
      (entry) => !entry.word.includes(letter)
    )
  }

  sorted() {
    return this.filtered.sort((a: any, b: any) => {
      return b.in_wordle - a.in_wordle
    })
  }
}
