<script setup lang="ts">
import { ref } from 'vue'
import logo from './assets/logo.svg'

const count = ref(0)
const message = ref('Hello Vue Cite!')
</script>

<template>
  <main class="page">
    <header class="hero">
      <h1>
        <img :src="logo" alt="Vue Cite logo" class="logo" width="56" height="56">
        Vue Cite
      </h1>
      <p class="tagline">
        Cite-to-copy for any Vue element.
      </p>
      <p class="desc">
        Click any Vue element, add a note, and copy a Markdown citation with a
        source link. Great for design reviews, bug reports, and AI prompts.
      </p>
    </header>

    <section class="card">
      <h2>Form</h2>
      <p class="hint">
        Cite the textarea or its label to pinpoint where each field lives.
      </p>
      <label class="label">
        Message
        <textarea v-model="message" class="input" rows="3" placeholder="Type a message" />
      </label>
      <p class="echo">
        You typed: <strong>{{ message }}</strong>
      </p>
    </section>

    <section class="card">
      <h2>Counter</h2>
      <p class="hint">
        A reactive button — try citing it to capture its source line.
      </p>
      <button class="btn primary" @click="count++">
        Increment
      </button>
      <p class="count">
        Count: {{ count }}
      </p>
    </section>

    <section class="card">
      <h2>Grid</h2>
      <p class="hint">
        Each tile is rendered from the same v-for — cite one to see which.
      </p>
      <div class="grid">
        <div v-for="n in 6" :key="n" class="tile">
          Tile {{ n }}
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.page {
  max-width: 760px;
  margin: 2rem auto;
  padding: 0 1rem 4rem;
}
.hero {
  margin-bottom: 1.5rem;
}
.hero h1 {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin: 0 0 0.25rem;
  font-size: 2.4rem;
  color: #42b883;
}
.logo {
  display: block;
}
.tagline {
  margin: 0 0 0.75rem;
  font-weight: 600;
  color: #333;
}
.hero .desc {
  margin: 0;
  background: #f4f8ff;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  border-left: 4px solid #42b883;
  color: #444;
  font-size: 14px;
  line-height: 1.5;
}
.dot {
  display: inline-block;
  transform: translateY(1px);
}
.card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1rem 1.25rem;
  margin: 1rem 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}
.card h2 {
  margin: 0 0 0.75rem;
  font-size: 1rem;
  color: #333;
}
.hint {
  margin: 0 0 0.75rem;
  font-size: 13px;
  color: #888;
}
.btn {
  border: 0;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}
.btn.primary {
  background: #197;
  color: white;
}
.count {
  margin-top: 0.5rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}
.label {
  display: block;
  font-size: 13px;
  color: #555;
}
.input {
  display: block;
  width: 100%;
  margin-top: 4px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
}
.echo {
  margin-top: 0.5rem;
  font-size: 14px;
  color: #444;
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.tile {
  background: #f0f4f8;
  padding: 1rem;
  text-align: center;
  border-radius: 4px;
  font-size: 14px;
}
</style>
