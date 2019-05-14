<template>
  <div>
    <el-col :span="5" :offset="1">
      <el-slider v-model="speed" :min="100" :max="500" :step="100" :vertical="mobile" :height="height"></el-slider>
    </el-col>
    <el-col :span="5" :offset="off">
      <scanner />
      <el-button type="primary" icon="el-icon-refresh" circle @click="randomRotate" :loading=randomRotateLoading :disabled=(randomRotateLoading||autoRestRunning)></el-button>
      <el-button type="success" icon="el-icon-success" circle @click="autoRest" :loading=autoRestRunning :disabled=(randomRotateLoading||autoRestRunning)></el-button>
      <el-button type="success" icon="el-icon-arrow-right" circle @click="autoRestOneStep" :disabled=(randomRotateLoading||autoRestRunning)></el-button>
    </el-col>
  </div>
</template>

<script>
import { OrbitControls } from 'three-orbitcontrols-ts'
import { init, randomRotate, autoRest, autoRestOneStep, randomRotateLoading, autoRestRunning, changeSpeed } from '../utils/Rubik.js'
import scanner from './scanner'

export default {
  name: 'Rubik',
  components: {
    scanner
  },
  data () {
    return {
      randomRotateLoading: false,
      autoRestRunning: false,
      speed: 200,
      off: 10,
      mobile: false,
      height: ''
    }
  },

  mounted() {
    if(this._isMobile()) {
      this.off = 13
      this.mobile = true
      this.height = '150px'
    }
    init(this._isMobile())
  },

  methods: {
    async randomRotate() {
      this.randomRotateLoading = true
      randomRotate(this.speed)
      while(this.randomRotateLoading) {
        await this.sleep(this.speed*2)
        this.randomRotateLoading = randomRotateLoading
      }
    },

    async autoRest() {
      this.autoRestRunning = true
      autoRest(this.speed)
      while(this.autoRestRunning) {
        await this.sleep(this.speed*2)
        this.autoRestRunning = autoRestRunning
      }
    },

    async autoRestOneStep() {
      this.autoRestRunning = true
      autoRestOneStep(this.speed)
      while(this.autoRestRunning) {
        await this.sleep(this.speed*1.5)
        this.autoRestRunning = autoRestRunning
      }
    },

    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    _isMobile() {
      let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
      return flag
    }
  },

  watch: {
    speed() {
      changeSpeed(this.speed)
    }
  }
}
</script>

<style scoped>
.refreash {
  align-content: left;
}

.el-button+.el-button {
  margin-left: 0
}
</style>