<template>
  <div id="app">
    <Rubik/>
    <scanner/>
  </div>
</template>

<script>
import Rubik from './components/Rubik'
import scanner from './components/scanner'

export default {
  name: 'App',
  components: {
    Rubik,
    scanner
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
