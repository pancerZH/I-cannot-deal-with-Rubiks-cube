<template>
  <div>
    <el-col :span="2" :offset="18">
      <el-button type="primary" icon="el-icon-refresh" circle @click="randomRotate" :loading=randomRotateLoading :disabled=(randomRotateLoading||autoRestRunning)></el-button>
    </el-col>
    <el-col :span="2">
      <el-button type="success" icon="el-icon-success" circle @click="autoRest" :loading=autoRestRunning :disabled=(randomRotateLoading||autoRestRunning)></el-button>
    </el-col>
    <el-col :span="2">
      <el-button type="success" icon="el-icon-arrow-right" circle @click="autoRestOneStep" :disabled=(randomRotateLoading||autoRestRunning)></el-button>
    </el-col>
  </div>
</template>

<script>
import { OrbitControls } from 'three-orbitcontrols-ts'
import { init, randomRotate, autoRest, autoRestOneStep, randomRotateLoading, autoRestRunning } from '../utils/Rubik.js'

export default {
  name: 'Rubik',
  data () {
    return {
      randomRotateLoading: false,
      autoRestRunning: false
    }
  },

  mounted() {
    init()
  },

  methods: {
    async randomRotate() {
      this.randomRotateLoading = true
      randomRotate()
      while(this.randomRotateLoading) {
        await this.sleep(500)
        this.randomRotateLoading = randomRotateLoading
      }
    },

    async autoRest() {
      this.autoRestRunning = true
      autoRest()
      while(this.autoRestRunning) {
        await this.sleep(500)
        this.autoRestRunning = autoRestRunning
      }
    },

    async autoRestOneStep() {
      this.autoRestRunning = true
      autoRestOneStep()
      while(this.autoRestRunning) {
        await this.sleep(200)
        this.autoRestRunning = autoRestRunning
      }
    },

    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }
}
</script>

<style scoped>
.refreash {
  align-content: left;
}
</style>