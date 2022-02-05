<template>
  <div class="letter" :class="status" @click="selectBlock">
    {{ letter?.toUpperCase() }}
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

const statuses = ['default', 'absent', 'present', 'known'] as const
export type Status = typeof statuses[number]

@Options({
  props: {
    uid: String,
    letter: String,
    status: String,
  },
})
export default class Letter extends Vue {
  uid!: string
  letter!: string
  status!: Status

  selectBlock(): void {
    this.$emit('changeBlock', this.letter, this.uid, this.status)
  }
}
</script>

<style>
:root {
  --color-text: #d7dadc;
  --color-bg: #818384;
  --color-present: #c9b458;
  --color-known: #6aaa64;
  --color-absent: #3a3a3c;
}
.letter {
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 2em;
  border: 0;
  padding: 0.5em;
  user-select: none;
  margin: 0.3em 0.1em;
  min-height: 1.1em;
  min-width: 1.1em;
}
.selected {
  outline: 2px solid green;
}
.default {
  background: var(--color-bg);
}
.absent {
  background: var(--color-absent);
}
.present {
  background: var(--color-present);
}
.known {
  background: var(--color-known);
}
</style>
