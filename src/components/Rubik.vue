<template>
  <div>
    <el-col :span="5" :offset="1">
      <el-slider v-model="speed" :min="100" :max="500" :step="100" :vertical="mobile" :height="height" :disabled="status"></el-slider>
    </el-col>
    <el-col :span="5" :offset="off" class="step">
      <span v-transition class="msg">{{steps}}</span>
    </el-col>
    <el-col :span="5" :offset="off">
      <scanner :randomRotate=randomRotateLoading :autoRest=autoRestRunning :acceptString=acceptStringRunning @accept="statusChange" />
      <el-button type="primary" icon="el-icon-refresh" circle @click="randomRotate" :loading=randomRotateLoading :disabled="status"></el-button>
      <el-button type="success" icon="el-icon-success" circle @click="autoRest" :loading=autoRestRunning :disabled="status"></el-button>
      <el-button type="success" icon="el-icon-arrow-right" circle @click="autoRestOneStep" :disabled="status"></el-button>
    </el-col>
  </div>
</template>

<script>
import { init, randomRotate, autoRest, autoRestOneStep, randomRotateLoading, autoRestRunning, changeSpeed, acceptStringRunning, stepCount } from '../utils/Rubik.js'
import { initBackground } from '../utils/background.js'
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
      acceptStringRunning: false,
      speed: 200,
      off: 3,
      mobile: false,
      height: '',
      steps: 0
    }
  },

  mounted() {
    if(this._isMobile()) {
      this.off = 4
      this.mobile = true
      this.height = '150px'
    }
    init(this._isMobile())
    setInterval(this.updateTime, 100)
    initBackground()

    // LBBRRURRRDDRDDLDLDFFFFFFFFFUUUUUDUBLBDBLBBLLBLRURLBRUD
    // LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL
    // DBULUFLUBLDFFRLBLRFFDRFLLUUBBRDDUURDFDDBLULRURDRBBRBFF
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

    async statusChange() {
      this.acceptStringRunning = true
      while(this.acceptStringRunning) {
        await this.sleep(100)
        this.acceptStringRunning = acceptStringRunning
      }
    },

    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    _isMobile() {
      let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
      return flag
    },

    updateTime() {
      this.steps = stepCount
    }
  },

  computed: {
    status() {
      return (this.randomRotateLoading || this.autoRestRunning || this.acceptStringRunning)
    }
  },

  watch: {
    speed() {
      changeSpeed(this.speed)
    },
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

.step {
  text-align: center;
  margin-top: 10px;
  font-size: 40px;
}

.msg {
    transition: all .3s ease;
    height: 30px;
    padding: 10px;
    overflow: hidden;
    color: blanchedalmond
}

.msg.v-enter, .msg.v-leave {
    height: 0;
    padding: 0 10px;
    opacity: 0;
}
</style>