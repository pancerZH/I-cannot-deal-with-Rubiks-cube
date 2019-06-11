<template>
  <div>
    <el-row>
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
    </el-row>
    <el-row>
      <el-col :span="23" class="step">
        <span class="msg txt" @click="changePlay" name='txt'>{{play}}</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="23" class="step">
        <span class="msg txt" @click="selectMethod" v-show="play==='练习模式'" name='txt'>{{method}}</span>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogVisible" :width="width">
      <el-select v-model="method" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-dialog>
  </div>
</template>

<script>
import { init, randomRotate, autoRest, autoRestOneStep, randomRotateLoading, autoRestRunning, changeSpeed, acceptStringRunning, stepCount, acceptMethod, clearAll, autoRunOneStep } from '../utils/Rubik.js'
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
      width: '',
      steps: 0,
      play: '自由模式',
      method: '请选择样式',
      dialogVisible: false,
      options: [{
        value: '六面回字',
        label: '六面回字'
      }, {
        value: '四色回字',
        label: '四色回字'
      }, {
        label: '对称棋盘',
        value: '对称棋盘'
      }, {
        label: '循环棋盘',
        value: '循环棋盘'
      }, {
        label: '六面十字',
        value: '六面十字',
      }, {
        label: '四面十字',
        value: '四面十字'
      }, {
        label: '六面彩条',
        value: '六面彩条'
      }, {
        label: '六面三条',
        value: '六面三条'
      }]      
    }
  },

  created() {
    var _this = this;
    document.onkeydown = function(e) {
        let key = window.event.keyCode
        if (key === 32 && !_this.status) {
            _this.autoRestOneStep()
        }
    }
  },

  mounted() {
    if(this._isMobile()) {
      this.off = 4
      this.mobile = true
      this.height = '150px'
      this.width = String(window.innerWidth / 2) + 'px'
    }
    else {
      this.width = String(window.innerWidth / 8) + 'px'
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
      if(this.play === '自由模式') {
        this.randomRotateLoading = true
        randomRotate(this.speed)
        while(this.randomRotateLoading) {
          await this.sleep(this.speed*2)
          this.randomRotateLoading = randomRotateLoading
        }
      }
      else if(this.play === '练习模式') {
        clearAll()
      }
    },

    async autoRest() {
      if(this.play === '自由模式') {
        this.autoRestRunning = true
        autoRest(this.speed)
        while(this.autoRestRunning) {
          await this.sleep(this.speed*2)
          this.autoRestRunning = autoRestRunning
        }
      }
      else if(this.play === '练习模式') {
        switch(this.method) {
          case '六面回字':
            acceptMethod("U' D F' B L R' U' D", this.speed)
            break
          case '四色回字':
            acceptMethod("B2 L R B L2 B F D U' B F R2 F' L R", this.speed)
            break
          case '对称棋盘':
            acceptMethod("L2 R2 F2 B2 U2 D2", this.speed)
            break
          case '循环棋盘':
            acceptMethod("D2 F2 U' B2 F2 L2 R2 D R' B F D' U L R D2 U2 F' U2", this.speed)
            break
          case '六面十字':
            acceptMethod("B2 F' L2 R2 D2 B2 F2 L2 R2 U2 F'", this.speed)
            break
          case '四面十字':
            acceptMethod("D F2 R2 F2 D' U R2 F2 R2 U'", this.speed)
            break
          case '六面彩条':
            acceptMethod("F2 U2 F2 B2 U2 F B", this.speed)
            break
          case '六面三条':
            acceptMethod("U2 L2 U2 L2 U2 L2 U2 R2 U2 R2 U2 R2 U D L2 R2", this.speed)
            break
          default:
            return '请选择样式'
        }
        this.playMethod()
      }
    },

    async autoRestOneStep() {
      if(this.play === '自由模式') {
        this.autoRestRunning = true
        autoRestOneStep(this.speed)
      }
      else if(this.play === '练习模式') {
        this.autoRestRunning = true
        switch(this.method) {
          case '六面回字':
            autoRunOneStep("U' D F' B L R' U' D", this.speed, this.steps)
            break
          case '四色回字':
            autoRunOneStep("B2 L R B L2 B F D U' B F R2 F' L R", this.speed, this.steps)
            break
          case '对称棋盘':
            autoRunOneStep("L2 R2 F2 B2 U2 D2", this.speed, this.steps)
            break
          case '循环棋盘':
            autoRunOneStep("D2 F2 U' B2 F2 L2 R2 D R' B F D' U L R D2 U2 F' U2", this.speed, this.steps)
            break
          case '六面十字':
            autoRunOneStep("B2 F' L2 R2 D2 B2 F2 L2 R2 U2 F'", this.speed, this.steps)
            break
          case '四面十字':
            autoRunOneStep("D F2 R2 F2 D' U R2 F2 R2 U'", this.speed, this.steps)
            break
          case '六面彩条':
            autoRunOneStep("F2 U2 F2 B2 U2 F B", this.speed, this.steps)
            break
          case '六面三条':
            autoRunOneStep("U2 L2 U2 L2 U2 L2 U2 R2 U2 R2 U2 R2 U D L2 R2", this.speed, this.steps)
            break
          default:
            return '请选择样式'
        }
      }

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

    async playMethod() {
      this.acceptStringRunning = true
      while(this.acceptStringRunning) {
        await this.sleep(this.speed*1.5)
        this.acceptStringRunning = acceptStringRunning
      }
    },

    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    _isMobile() {
      let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
      document.getElementsByName('txt').forEach(span => {
        span.style.fontSize = '26px'
      })
      return flag
    },

    updateTime() {
      this.steps = stepCount
    },

    changePlay() {
      if(this.status)
        return
      if(this.play === '自由模式')
        this.play = '练习模式'
      else
        this.play = '自由模式'
    },

    selectMethod() {
      if(this.status)
        return
      this.dialogVisible = true
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

    method() {
      this.dialogVisible = false
      switch(this.method) {
        case '六面回字':
          acceptMethod("U' D F' B L R' U' D", this.speed)
          break
        case '四色回字':
          acceptMethod("B2 L R B L2 B F D U' B F R2 F' L R", this.speed)
          break
        case '对称棋盘':
          acceptMethod("L2 R2 F2 B2 U2 D2", this.speed)
          break
        case '循环棋盘':
          acceptMethod("D2 F2 U' B2 F2 L2 R2 D R' B F D' U L R D2 U2 F' U2", this.speed)
          break
        case '六面十字':
          acceptMethod("B2 F' L2 R2 D2 B2 F2 L2 R2 U2 F'", this.speed)
          break
        case '四面十字':
          acceptMethod("D F2 R2 F2 D' U R2 F2 R2 U'", this.speed)
          break
        case '六面彩条':
          acceptMethod("F2 U2 F2 B2 U2 F B", this.speed)
          break
        case '六面三条':
          acceptMethod("U2 L2 U2 L2 U2 L2 U2 R2 U2 R2 U2 R2 U D L2 R2", this.speed)
          break
        default:
          return '请选择样式'
      }
      this.playMethod()
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
  color: blanchedalmond;
}

.msg.v-enter, .msg.v-leave {
  height: 0;
  padding: 0 10px;
  opacity: 0;
}

.txt {
  z-index: 9;
  -webkit-user-select: none;
  cursor: pointer;
}
</style>