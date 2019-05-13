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

export default {
  name: 'Rubik',
  data () {
    return {
      camera: null,
      scene: null,
      light: null,
      cubes: [],
      renderer: null,
      width: 0,
      height: 0,
      originPoint: null,
      controller: null,
      raycaster: null,
      mouse: null,
      cubeParams: {},
      isRotating: false,
      intersect: null,  // 碰撞光线穿过的元素
      normalize: null,  // 触发平面法向量
      startPoint: null,  // 触发点
      movePoint: null,
      initStatus: [],  // 魔方初始状态
      XLine: null,  // x轴正方向
      XLineAd: null,  // x轴负方向
      YLine: null,
      YLineAd: null,
      ZLine: null,
      ZLineAd: null,
      stepCount: 0,
      minCubeIndex: null,
      speed: 200,
      Cube: null,
      cube: null,
      answer: {},
      stepBystep: [],
      newSolution: true,
      randomRotateLoading: false,
      autoRestRunning: false
    }
  },

  mounted() {
    this.init()
  },
  
  methods: {
    async init() {
      this.originPoint = new THREE.Vector3(0, 0, 0)  //原点
      this.XLine = new THREE.Vector3( 1, 0, 0 )
      this.XLineAd = new THREE.Vector3( -1, 0, 0 )
      this.YLine = new THREE.Vector3( 0, 1, 0 )
      this.YLineAd = new THREE.Vector3( 0, -1, 0 )
      this.ZLine = new THREE.Vector3( 0, 0, 1 )
      this.ZLineAd = new THREE.Vector3( 0, 0, -1 )

      this.raycaster = new THREE.Raycaster()  // 光线碰撞传感器
      this.mouse = new THREE.Vector2()  // 储存鼠标坐标

      this.Cube = require('cubejs')
      this.cube = new this.Cube()
      this.answer = {
        'R': this.R,
        'U': this.U,
        'F': this.F,
        'B': this.B,
        'L': this.L,
        'D': this.D,
        'r': this.r,
        'u': this.u,
        'f': this.f,
        'b': this.b,
        'l': this.l,
        'd': this.d
      }

      this.cubeParams = {
        x:0,
        y:0,
        z:0,
        num:3,
        len:50,
        colors:['rgba(236, 56, 35, 1)','rgba(252, 236, 71, 1)',
                'rgba(252, 138, 10, 1)','rgba(101, 157, 44, 1)',
                'rgba(252, 244, 252, 1)','rgba(56, 148, 173, 1)'],
        sequences:['R','L','U','D','F','B']  //默认序列名
      }

      window.requestAnimFrame = (function() {
        return window.requestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                window.webkitRequestAnimationFrame
      })()

      this.initThree()
      this.initCamera()
      this.initScene()
      this.initLight()
      this.initObj()
      this.initCord()
      this.render()

      //监听鼠标事件
      this.renderer.domElement.addEventListener('mousedown', this.startCube, false)
      this.renderer.domElement.addEventListener('mousemove', this.moveCube, false)
      this.renderer.domElement.addEventListener('mouseup', this.stopCube, false)

      //监听触摸事件
      this.renderer.domElement.addEventListener('touchstart', this.startCube, false)
      this.renderer.domElement.addEventListener('touchmove', this.moveCube, false)
      this.renderer.domElement.addEventListener('touchend', this.stopCube, false)

      // 控制视角
      this.controller = new OrbitControls(this.camera, this.renderer.domElement)
      this.controller.target = new THREE.Vector3(0, 0, 0);

    },

    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },

    initThree() {
      this.width = window.innerWidth * 0.9
      this.height = window.innerHeight * 0.9
      this.renderer = new THREE.WebGLRenderer({
          antialias : true
      })
      this.renderer.setSize(this.width, this.height)
      this.renderer.setClearColor(0xFFFFFF, 1.0)
      document.body.appendChild(this.renderer.domElement)
    },

    initCamera() {
      this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1000)
      this.camera.position.set(200, 200, 600)
      this.camera.up.set(0, 1, 0)
      this.camera.lookAt(this.originPoint)
    },

    initScene() {
      this.scene = new THREE.Scene()
    },

    initLight() {
      this.light = new THREE.AmbientLight(0x404040, 5)
			this.scene.add(this.light)
    },

    SimpleCube(x, y, z, num, len, colors) {
      //魔方左上角坐标
      var leftUpX = x - num / 2 * len
      var leftUpY = y + num / 2 * len
      var leftUpZ = z + num / 2 * len
      //根据颜色生成材质
      var materialArr = []
      for (var i = 0; i < colors.length; i++) {
          var texture = new THREE.Texture(this.faces(colors[i]))
          texture.needsUpdate = true
          var material = new THREE.MeshLambertMaterial({ map: texture })
          materialArr.push(material)
      }
      var cubes = []
      for (var i = 0; i < num; i++) {
          for (var j = 0; j < num * num; j++) {
              var cubegeo = new THREE.BoxGeometry(len, len, len, 2, 5)
              var cube = new THREE.Mesh(cubegeo, materialArr)
              //依次计算各个小方块中心点坐标
              cube.position.x = (leftUpX + len / 2) + (j % num) * len
              cube.position.y = (leftUpY - len / 2) - parseInt(j / num) * len
              cube.position.z = (leftUpZ - len / 2) - i * len
              this.cubes.push(cube)
          }
      }
    },

    faces(rgbaColor) {
      var canvas = document.createElement('canvas')
      canvas.width = 256
      canvas.height = 256
      var context = canvas.getContext('2d')
      if (context) {
        //画一个宽高都是256的黑色正方形
          context.fillStyle = 'rgba(0,0,0,1)'
          context.fillRect(0, 0, 256, 256)
          // 绘制圆角矩形
          var x = 16
          var y = 16
          var h = 224
          var w = 224
          var r = 32
          context.beginPath()
          context.moveTo(x + r, y)
          context.arcTo(x + w, y, x + w, y + h, r)
          context.arcTo(x + w, y + h, x, y + h, r)
          context.arcTo(x, y + h, x, y, r)
          context.arcTo(x, y, x + w, y, r)
          context.closePath();
          context.lineWidth = 16
          context.imageSmoothingQuality = 'high'
          context.fillStyle = rgbaColor
          context.strokeStyle = rgbaColor
          context.stroke()
          context.fill()
      } 
      else {
          alert('浏览器不支持Canvas无法预览.')
      }
      return canvas
    },

    randomRotate() {
      this.randomRotateLoading = true
      if(!this.isRotating) {
        this.speed = 200
        var stepNum = parseInt(20*Math.random())
        if(stepNum < 20) {
          stepNum = 20  // 至少动20步
        }
        var funcArr = [this.R,this.U,this.F,this.B,this.L,this.D,this.r,this.u,this.f,this.b,this.l,this.d]
        var stepArr = []
        for(var i=0; i<stepNum; i++) {
          var num = parseInt(Math.random()*funcArr.length)
          stepArr.push(funcArr[num])
        }
        this.runMethodAtNo(stepArr, 0, 0)
      }
    },

    async runMethodAtNo(arr,no,rotateNum,next) {
      if(no >= arr.length-1) {
        if(next) {
          arr[no](rotateNum,next)
          await this.sleep(this.speed)
          this.randomRotateLoading = false
          this.autoRestRunning = false
        }
        else {
          arr[no](rotateNum)
          await this.sleep(this.speed)
          this.randomRotateLoading = false
          this.autoRestRunning = false
        }
      }
      else {
        var rr = this.runMethodAtNo
        arr[no](rotateNum,function() {
          if(no<arr.length-1) {
            no++
            rr(arr, no, rotateNum, next)
          }
        })
      }
    },

    autoRest() {
      this.autoRestRunning = true
      var stepCount = 0
      var startTime = window.performance.now()
      console.log('start autoReset')
      console.log('start at:'+startTime)
    
      //调用kociemba算法获得自动还原命名
      var rubik = this.getRubikSequence()
      this.cube = this.Cube.fromString(rubik)
      if(this.cube.isSolved()) {
        this.autoRestRunning = false
        return
      }
      this.Cube.initSolver()
      var moves = this.cube.solve()
      moves = moves.split(' ')
      
      //解析命令
      var arr = []
      var reg1 = /^[a-zA-Z]{1}$/  //纯字母
      var reg2 = /^[a-zA-Z]{1}[2]{1}$/  //字母+2
      var reg3 = /^[a-zA-Z]{1}'$/  //字母+单引号
      moves.forEach(move => {
        if(reg3.test(move)) {
          var temp = move.substring(0, 1)
          arr.push(temp.toLowerCase())
        }
        else if(reg2.test(move)) {
          var temp = move.substring(0, 1)
          arr.push(temp)
          arr.push(temp)
        }
        else if(reg1.test(move)) {
          arr.push(move)
        }
        else {
          console.log('出错啦')
        }
      })

      //执行
      var funcs = []
      this.stepCount = 0
      arr.forEach(move => {
        var f = this.answer[move]
        funcs.push(f)
        this.stepCount++
      })
      var count = this.stepCount
      this.runMethodAtNo(funcs, 0, 0, function() {
        var endTime = window.performance.now()
            console.log('end at:'+endTime)
            console.log('total times:'+(endTime-startTime))
            console.log('total steps:'+count)
      })
    },

    async autoRestOneStep() {
      this.autoRestRunning = true
      if(this.newSolution) {
        var stepCount = 0
        this.stepBystep = []

        //调用kociemba算法获得自动还原命名
        var rubik = this.getRubikSequence()
        this.cube = this.Cube.fromString(rubik)
        if(this.cube.isSolved()) {
          this.autoRestRunning = false
          return
        }
        this.Cube.initSolver()
        this.sleep(3000)
        var moves = this.cube.solve()
        moves = moves.split(' ')
        
        //解析命令
        var reg1 = /^[a-zA-Z]{1}$/  //纯字母
        var reg2 = /^[a-zA-Z]{1}[2]{1}$/  //字母+2
        var reg3 = /^[a-zA-Z]{1}'$/  //字母+单引号
        moves.forEach(move => {
          if(reg3.test(move)) {
            var temp = move.substring(0, 1)
            this.stepBystep.push(temp.toLowerCase())
          }
          else if(reg2.test(move)) {
            var temp = move.substring(0, 1)
            this.stepBystep.push(temp)
            this.stepBystep.push(temp)
          }
          else if(reg1.test(move)) {
            this.stepBystep.push(move)
          }
          else {
            console.log('出错啦')
          }
        })

        this.newSolution = false
      }

      var f = this.answer[this.stepBystep.shift()]
      if(f) {
        f(0)
        await this.sleep(this.speed)
      }
      this.autoRestRunning = false
    },

    getRubikSequence() {
      var seq = []

      //U
      var us = [18,19,20,9,10,11,0,1,2]
      us.forEach(u => {
        var ui = this.getCubeByIndex(u)
        seq.push(this.getFaceColorByVector(ui, this.YLine))
      })

      //R
      var rs = [2,11,20,5,14,23,8,17,26]
      rs.forEach(r => {
        var ri = this.getCubeByIndex(r)
        seq.push(this.getFaceColorByVector(ri, this.XLine))
      })

      //F
      var fs = [0,1,2,3,4,5,6,7,8]
      fs.forEach(f => {
        var fi = this.getCubeByIndex(f)
        seq.push(this.getFaceColorByVector(fi, this.ZLine))
      })

      //D
      var ds = [6,7,8,15,16,17,24,25,26]
      ds.forEach(d => {
        var di = this.getCubeByIndex(d)
        seq.push(this.getFaceColorByVector(di, this.YLineAd))
      })

      //L
      var ls = [18,9,0,21,12,3,24,15,6]
      ls.forEach(l => {
        var li = this.getCubeByIndex(l)
        seq.push(this.getFaceColorByVector(li, this.XLineAd))
      })

      //B
      var bs = [20,19,18,23,22,21,26,25,24]
      bs.forEach(b => {
        var bi = this.getCubeByIndex(b)
        seq.push(this.getFaceColorByVector(bi, this.ZLineAd))
      })

      //  因为并没有限制用户操作不能转动中心，因此默认魔方序列名可能会有变化，这里需要重新设置
      var cube10 = this.getCubeByIndex(10)
      var uColorIndex = this.getFaceColorByVector(cube10, this.YLine)
      this.cubeParams.sequences[uColorIndex] = 'U'

      var cube4 = this.getCubeByIndex(4)
      var fColorIndex = this.getFaceColorByVector(cube4, this.ZLine)
      this.cubeParams.sequences[fColorIndex] = 'F'

      var cube14 = this.getCubeByIndex(14)
      var rColorIndex = this.getFaceColorByVector(cube14, this.XLine)
      this.cubeParams.sequences[rColorIndex] = 'R'

      var cube12 = this.getCubeByIndex(12)
      var lColorIndex = this.getFaceColorByVector(cube12, this.XLineAd)
      this.cubeParams.sequences[lColorIndex] = 'L'

      var cube16 = this.getCubeByIndex(16)
      var dColorIndex = this.getFaceColorByVector(cube16, this.YLineAd)
      this.cubeParams.sequences[dColorIndex] = 'D'

      var cube22 = this.getCubeByIndex(22)
      var bColorIndex = this.getFaceColorByVector(cube22, this.ZLineAd)
      this.cubeParams.sequences[bColorIndex] = 'B'

        //颜色序号转换为魔方序列
      var str = ''
      seq.forEach(s => {
        str += this.cubeParams.sequences[s]
      })

      return str
      
      //UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB
      /**
        |************|
        |*U1**U2**U3*|
        |************|
        |*U4**U5**U6*|
        |************|
        |*U7**U8**U9*|
        |************|
************|************|************|************
*L1**L2**L3*|*F1**F2**F3*|*R1**R2**R3*|*B1**B2**B3*
************|************|************|************
*L4**L5**L6*|*F4**F5**F6*|*R4**R5**R6*|*B4**B5**B6*
************|************|************|************
*L7**L8**L9*|*F7**F8**F9*|*R7**R8**R9*|*B7**B8**B9*
************|************|************|************
        |************|
        |*D1**D2**D3*|
        |************|
        |*D4**D5**D6*|
        |************|
        |*D7**D8**D9*|
        |************|
        */
    },

    //获取法向量和已知向量方向相同的面的颜色序号
    getFaceColorByVector(cube, vector) {
      var materials = cube.material
      var faces = cube.geometry.faces
      var normalMatrix = cube.normalMatrix
      
      /**
       * 转换视角时摄像机位置发生了变动，模型开始上表面的法向量是世界坐标系的Y轴，现在依然是世界坐标系的Y轴；
       * 但是小方块面的法向量乘以其法向量矩阵得到的是视图坐标系中的向量；
       * 世界坐标系转换成视图坐标系需要乘以视图矩阵的逆反矩阵。
       */
      var viewMatrix = new THREE.Matrix4()
      viewMatrix.lookAt(this.camera.position, this.originPoint, this.camera.up)
      viewMatrix.getInverse(viewMatrix)
      var tempVector = vector.clone()
      tempVector.applyMatrix4(viewMatrix)
      var angles = []

      faces.forEach(face => {
        var tempNormal = face.normal.clone()
        tempNormal.applyMatrix3(normalMatrix)
        angles.push(tempNormal.angleTo(tempVector))
      })
      var minNo = this.min(angles).no
      return faces[minNo].materialIndex
    },

    // 魔方基本公式 U、F、L、D、R 、B、u、f、l、d
    U(rotateNum,next) {
      this.stepCount++
      var cube2 = this.getCubeByIndex(2,rotateNum)
      this.normalize = this.ZLine
      this.rotateMove(cube2, this.XLineAd, next)
    },
    u(rotateNum,next) {
      this.stepCount++
      var cube2 = this.getCubeByIndex(2,rotateNum)
      this.normalize = this.XLine
      this.rotateMove(cube2, this.ZLineAd, next)
    },
    F(rotateNum,next) {
      this.stepCount++
      var cube2 = this.getCubeByIndex(2,rotateNum)
      this.normalize = this.XLine
      this.rotateMove(cube2, this.YLineAd, next)
    },
    f(rotateNum,next) {
      this.stepCount++
      var cube2 = this.getCubeByIndex(2,rotateNum)
      this.normalize = this.YLine
      this.rotateMove(cube2, this.XLineAd, next)
    },
    L(rotateNum,next) {
      this.stepCount++
      var cube0 = this.getCubeByIndex(0,rotateNum)
      this.normalize = this.ZLine
      this.rotateMove(cube0, this.YLineAd, next)
    },
    l(rotateNum,next) {
      this.stepCount++
      var cube0 = this.getCubeByIndex(0,rotateNum)
      this.normalize = this.YLine
      this.rotateMove(cube0, this.ZLineAd, next)
    },
    D(rotateNum,next) {
      this.stepCount++
      var cube8 = this.getCubeByIndex(8,rotateNum)
      this.normalize = this.XLine
      this.rotateMove(cube8, this.ZLineAd, next)
    },
    d(rotateNum,next) {
      this.stepCount++
      var cube8 = this.getCubeByIndex(8,rotateNum)
      this.normalize = this.ZLine
      this.rotateMove(cube8, this.XLineAd, next)
    },
    R(rotateNum,next) {
      this.stepCount++
      var cube2 = this.getCubeByIndex(2,rotateNum)
      this.normalize = this.YLine
      this.rotateMove(cube2, this.ZLineAd, next)
    },
    r(rotateNum,next) {
      this.stepCount++
      var cube2 = this.getCubeByIndex(2,rotateNum)
      this.normalize = this.ZLine
      this.rotateMove(cube2, this.YLineAd, next)
    },
    B(rotateNum,next) {
      this.stepCount++
      var cube20 = this.getCubeByIndex(20,rotateNum)
      this.normalize = this.XLine
      this.rotateMove(cube20, this.YLine, next)
    },
    b(rotateNum,next) {
      this.stepCount++
      var cube20 = this.getCubeByIndex(20,rotateNum)
      this.normalize = this.XLine
      this.rotateMove(cube20, this.YLineAd, next)
    },

    getCubeByIndex(index,rotateNum) {
      var cube
      this.cubes.forEach(element => {
        if(element.cubeIndex == index+this.minCubeIndex) {
          cube = element
        }
      })
      return cube
    },

    rotateMove(target,vector,next) {
      this.isRotating = true  //转动标识置为true
      var direction = this.getDirection(vector)  //获得方向
      var elements = this.getBoxs(target,direction)
      this.findWhichOperation(direction, elements)
      var rr = this.rotateAnimation
      window.requestAnimFrame(function(timestamp) {
          rr(elements,direction,timestamp,0,null,next)
      })
    },

    findWhichOperation(direction, elements) {
      var ids = []   
      this.cubes.forEach(cube => {
        ids.push(cube.cubeIndex)
      })
      var minId = this.min(ids).value
      var targetId = 0
      switch(direction) {
        //绕z轴顺时针
        case 0.1:
        case 1.2:
        case 2.4:
        case 3.3:
          elements.forEach(element => {
            var targetId = element.cubeIndex - minId
            if(targetId === 2) {
              this.cube.move("F")
            }
            if(targetId === 10) {
              this.cube.move("S")
            }
            if(targetId === 20) {
              this.cube.move("b")
            }
          })
          break
        //绕z轴逆时针
        case 0.2:
        case 1.1:
        case 2.3:
        case 3.4:
          elements.forEach(element => {
            targetId = element.cubeIndex - minId
            if(targetId === 2) {
              this.cube.move("F'")
            }
            if(targetId === 10) {
              this.cube.move("S'")
            }
            if(targetId === 20) {
              this.cube.move("B")
            }
          })
          break
        //绕y轴顺时针
        case 0.4:
        case 1.3:
        case 4.3:
        case 5.4:
          elements.forEach(element => {
            targetId = element.cubeIndex - minId
            if(targetId === 2) {
              this.cube.move("U")
            }
            if(targetId === 5) {
              this.cube.move("E")
            }
            if(targetId === 8) {
              this.cube.move("D")
            }
          })
          break
        //绕y轴逆时针
        case 1.4:
        case 0.3:
        case 4.4:
        case 5.3:
          elements.forEach(element => {
            targetId = element.cubeIndex - minId
            if(targetId === 2) {
              this.cube.move("U'")
            }
            if(targetId === 5) {
              this.cube.move("E'")
            }
            if(targetId === 8) {
              this.cube.move("D'")
            }
          })
          break
        //绕x轴顺时针
        case 2.2:
        case 3.1:
        case 4.1:
        case 5.2:
          elements.forEach(element => {
            targetId = element.cubeIndex - minId
            if(targetId === 2) {
              this.cube.move("R'")
            }
            if(targetId === 4) {
              this.cube.move("M")
            }
            if(targetId === 0) {
              this.cube.move("L")
            }
          })
          break
        //绕x轴逆时针
        case 2.1:
        case 3.2:
        case 4.2:
        case 5.1:
          elements.forEach(element => {
            targetId = element.cubeIndex - minId
            if(targetId === 2) {
              this.cube.move("R")
            }
            if(targetId === 4) {
              this.cube.move("M'")
            }
            if(targetId === 0) {
              this.cube.move("L'")
            }
          })
          break
        default:
          break
      }
      if(this.cube.isSolved()) {
        console.log('胜利')
      }
    },

    initCord() {
      var xmat = new THREE.LineBasicMaterial({ color: 'red' })
      var xgeo = new THREE.Geometry()
      xgeo.vertices.push(
              new THREE.Vector3(0, 0, 0),
              new THREE.Vector3(300, 0, 0)
      )
      var xline = new THREE.Line(xgeo, xmat)
      this.scene.add(xline)
      var ymat = new THREE.LineBasicMaterial({ color: 'blue' })
      var ygeo = new THREE.Geometry()
      ygeo.vertices.push(
              new THREE.Vector3(0, 0, 0),
              new THREE.Vector3(0, 300, 0)
      )
      var yline = new THREE.Line(ygeo, ymat)
      this.scene.add(yline)
      var zmat = new THREE.LineBasicMaterial({ color: 'green' })
      var zgeo = new THREE.Geometry()
      zgeo.vertices.push(
              new THREE.Vector3(0, 0, 0),
              new THREE.Vector3(0, 0, 300)
      )
      var zline = new THREE.Line(zgeo, zmat)
      this.scene.add(zline)
    },

    initObj() {
      this.SimpleCube(this.cubeParams.x,this.cubeParams.y,this.cubeParams.z,
      this.cubeParams.num,this.cubeParams.len,this.cubeParams.colors)
      var ids = []
      this.cubes.forEach(element => {
        this.initStatus.push({
            x:element.position.x,
            y:element.position.y,
            z:element.position.z,
            cubeIndex:element.id
        })
        element.cubeIndex = element.id
        ids.push(element.id)
        this.scene.add(element)
      })
      this.minCubeIndex = this.min(ids).value

      //透明正方体
      var cubegeo = new THREE.BoxGeometry(150,150,150)
      var hex = 0x000000
      for ( var i = 0; i < cubegeo.faces.length; i += 2 ) {
          cubegeo.faces[ i ].color.setHex(hex)
          cubegeo.faces[ i + 1 ].color.setHex(hex)
      }
      var cubemat = new THREE.MeshBasicMaterial({vertexColors: THREE.FaceColors,opacity: 0, transparent: true})
      var cube = new THREE.Mesh(cubegeo, cubemat)
      cube.cubeType = 'coverCube'
      this.scene.add(cube)
    },

    render() {
      this.renderer.clear()
      this.renderer.render(this.scene, this.camera)
      window.requestAnimFrame(this.render)
    },

    //魔方操作结束
    stopCube() {
        this.intersect = null
        this.startPoint = null
    },

    //绕着世界坐标系的某个轴旋转
    rotateAroundWorldY(obj,rad) {
      var x0 = obj.position.x
      var z0 = obj.position.z
      var q = new THREE.Quaternion()
      q.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), rad )
      obj.quaternion.premultiply( q )
      obj.position.x = Math.cos(rad)*x0+Math.sin(rad)*z0
      obj.position.z = Math.cos(rad)*z0-Math.sin(rad)*x0
    },
    rotateAroundWorldZ(obj,rad) {
      var x0 = obj.position.x
      var y0 = obj.position.y
      var q = new THREE.Quaternion() 
      q.setFromAxisAngle( new THREE.Vector3( 0, 0, 1 ), rad )
      // 下面这句话有问题
      obj.quaternion.premultiply( q )
      obj.position.x = Math.cos(rad)*x0-Math.sin(rad)*y0
      obj.position.y = Math.cos(rad)*y0+Math.sin(rad)*x0
    },
    rotateAroundWorldX(obj,rad) {
      var y0 = obj.position.y
      var z0 = obj.position.z
      var q = new THREE.Quaternion() 
      q.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), rad )
      obj.quaternion.premultiply( q )
      obj.position.y = Math.cos(rad)*y0-Math.sin(rad)*z0
      obj.position.z = Math.cos(rad)*z0+Math.sin(rad)*y0
    },

    //滑动操作魔方
    moveCube(event) {
      this.getIntersects(event)  // 在里面拿到了法向量
      if(this.intersect) {
        if(!this.isRotating && this.startPoint) {
          //魔方没有进行转动且满足进行转动的条件
          this.movePoint = this.intersect.point
          if(!this.movePoint.equals(this.startPoint)) {
            //和起始点不一样则意味着可以得到转动向量了
            this.isRotating = true  //转动标识置为true
            var sub = this.movePoint.sub(this.startPoint)  //计算转动向量
            this.rotateMove(this.intersect, sub)
          }
        }
      }
      event.preventDefault()
    },

    rotateAnimation(elements,direction,currentstamp,startstamp,laststamp,next) {
        var totalTime = this.speed  //转动的总运动时间
        var isLastRotate = false  //是否是某次转动最后一次动画
        if(startstamp === 0) {
          startstamp = currentstamp
          laststamp = currentstamp
        }
        if(currentstamp-startstamp >= totalTime) {
          currentstamp = startstamp+totalTime
          isLastRotate = true
        }
        var ids = []   
        this.cubes.forEach(cube => {
          ids.push(cube.cubeIndex)
        })
        var minId = this.min(ids).value
        switch(direction) {
          //绕z轴顺时针
          case 0.1:
          case 1.2:
          case 2.4:
          case 3.3:
            elements.forEach(element => {
              this.rotateAroundWorldZ(element, -90*Math.PI/180*(currentstamp-laststamp)/totalTime)
            })
            break
          //绕z轴逆时针
          case 0.2:
          case 1.1:
          case 2.3:
          case 3.4:
            elements.forEach(element => {
              this.rotateAroundWorldZ(element, 90*Math.PI/180*(currentstamp-laststamp)/totalTime)
            })
            break
          //绕y轴顺时针
          case 0.4:
          case 1.3:
          case 4.3:
          case 5.4:
            elements.forEach(element => {
              this.rotateAroundWorldY(element, -90*Math.PI/180*(currentstamp-laststamp)/totalTime)
            })
            break
          //绕y轴逆时针
          case 1.4:
          case 0.3:
          case 4.4:
          case 5.3:
            elements.forEach(element => {
              this.rotateAroundWorldY(element, 90*Math.PI/180*(currentstamp-laststamp)/totalTime)
            })
            break
          //绕x轴顺时针
          case 2.2:
          case 3.1:
          case 4.1:
          case 5.2:
            elements.forEach(element => {
              this.rotateAroundWorldX(element, 90*Math.PI/180*(currentstamp-laststamp)/totalTime)
            })
            break
          //绕x轴逆时针
          case 2.1:
          case 3.2:
          case 4.2:
          case 5.1:
            elements.forEach(element => {
              this.rotateAroundWorldX(element, -90*Math.PI/180*(currentstamp-laststamp)/totalTime)
            })
            break
          default:
            break
        }
        if(!isLastRotate) {
          var rr = this.rotateAnimation
          window.requestAnimFrame(function(timestamp){
            rr(elements,direction,timestamp,startstamp,currentstamp,next)
          })
        }
        else {
          this.isRotating = false
          this.startPoint = null
          this.updateCubeIndex(elements)
          if(next)
            next()
        }
    },

    //更新位置索引
    updateCubeIndex(elements) {
      for(var i=0;i<elements.length;i++) {
        var temp1 = elements[i]
        for(var j=0;j<this.initStatus.length;j++) {
          var temp2 = this.initStatus[j]
          if( Math.abs(temp1.position.x - temp2.x) <= this.cubeParams.len/2 && 
              Math.abs(temp1.position.y - temp2.y) <= this.cubeParams.len/2 && 
              Math.abs(temp1.position.z - temp2.z) <= this.cubeParams.len/2 ) {
              temp1.cubeIndex = temp2.cubeIndex
              break
          }
        }
      }
    },

    //根据方向获得运动元素
    getBoxs(target,direction){
      var targetId = 0
      if(target.object != null)
        targetId = target.object.cubeIndex
      else
        targetId = target.cubeIndex
      var ids = []   
      this.cubes.forEach(cube => {
        ids.push(cube.cubeIndex)
      })
      var minId = this.min(ids).value
      targetId = targetId-minId
      var numI = parseInt(targetId/9)
      var numJ = targetId%9
      var boxs = []
      //根据绘制时的规律判断 no = i*9+j
      switch(direction){
          //绕z轴
          case 0.1:
          case 0.2:
          case 1.1:
          case 1.2:
          case 2.3:
          case 2.4:
          case 3.3:
          case 3.4:
            this.cubes.forEach(cube => {
              var tempId = cube.cubeIndex - minId
              if(numI === parseInt(tempId/9)) {
                boxs.push(cube)
              }
            })
            break
          //绕y轴
          case 0.3:
          case 0.4:
          case 1.3:
          case 1.4:
          case 4.3:
          case 4.4:
          case 5.3:
          case 5.4:
            this.cubes.forEach(cube => {
              var tempId = cube.cubeIndex - minId
              if(parseInt(numJ/3) === parseInt(tempId%9/3)) {
                boxs.push(cube)
              }
            })
            break
          //绕x轴
          case 2.1:
          case 2.2:
          case 3.1:
          case 3.2:
          case 4.1:
          case 4.2:
          case 5.1:
          case 5.2:
            this.cubes.forEach(cube => {
              var tempId = cube.cubeIndex - minId
              if(tempId%9%3 === numJ%3) {
                boxs.push(cube)
              }
            })
            break
          default:
            break
      }
      return boxs
    },

    //获得旋转方向
    getDirection(vector3){
      var direction
      //判断差向量和x、y、z轴的夹角
      var xAngle = vector3.angleTo(this.XLine)
      var xAngleAd = vector3.angleTo(this.XLineAd)
      var yAngle = vector3.angleTo(this.YLine)
      var yAngleAd = vector3.angleTo(this.YLineAd)
      var zAngle = vector3.angleTo(this.ZLine)
      var zAngleAd = vector3.angleTo(this.ZLineAd)
      var minAngle = this.min([xAngle,xAngleAd,yAngle,yAngleAd,zAngle,zAngleAd]).value  //最小夹角
      switch(minAngle){
        case xAngle:
          direction = 0  //向x轴正方向旋转90度（还要区分是绕z轴还是绕y轴）
          if(this.normalize.equals(this.YLine)) {
            direction = direction+0.1  //绕z轴顺时针
          }
          else if(this.normalize.equals(this.YLineAd)) {
            direction = direction+0.2  //绕z轴逆时针
          }
          else if(this.normalize.equals(this.ZLine)) {
            direction = direction+0.3  //绕y轴逆时针
          }
          else {
            direction = direction+0.4  //绕y轴顺时针
          }
          break
        case xAngleAd:
          direction = 1  //向x轴反方向旋转90度
          if(this.normalize.equals(this.YLine)) {
            direction = direction+0.1  //绕z轴逆时针
          }
          else if(this.normalize.equals(this.YLineAd)) {
            direction = direction+0.2  //绕z轴顺时针
          }
          else if(this.normalize.equals(this.ZLine)) {
            direction = direction+0.3  //绕y轴顺时针
          }
          else {
            direction = direction+0.4  //绕y轴逆时针
          }
          break
        case yAngle:
          direction = 2  //向y轴正方向旋转90度
          if(this.normalize.equals(this.ZLine)) {
            direction = direction+0.1  //绕x轴逆时针
          }
          else if(this.normalize.equals(this.ZLineAd)) {
            direction = direction+0.2  //绕x轴顺时针
          }
          else if(this.normalize.equals(this.XLine)) {
            direction = direction+0.3  //绕z轴逆时针
          }
          else {
            direction = direction+0.4  //绕z轴顺时针
          }
          break
        case yAngleAd:
          direction = 3  //向y轴反方向旋转90度
          if(this.normalize.equals(this.ZLine)) {
            direction = direction+0.1  //绕x轴顺时针
          }
          else if(this.normalize.equals(this.ZLineAd)) {
            direction = direction+0.2  //绕x轴逆时针
          }
          else if(this.normalize.equals(this.XLine)) {
            direction = direction+0.3  //绕z轴顺时针
          }
          else {
            direction = direction+0.4  //绕z轴逆时针
          }
          break
        case zAngle:
          direction = 4  //向z轴正方向旋转90度
          if(this.normalize.equals(this.YLine)) {
            direction = direction+0.1  //绕x轴顺时针
          }
          else if(this.normalize.equals(this.YLineAd)) {
            direction = direction+0.2  //绕x轴逆时针
          }
          else if(this.normalize.equals(this.XLine)) {
            direction = direction+0.3  //绕y轴顺时针
          }
          else {
            direction = direction+0.4//绕y轴逆时针
          }
          break
        case zAngleAd:
          direction = 5  //向z轴反方向旋转90度
          if(this.normalize.equals(this.YLine)) {
            direction = direction+0.1  //绕x轴逆时针
          }
          else if(this.normalize.equals(this.YLineAd)) {
            direction = direction+0.2  //绕x轴顺时针
          }
          else if(this.normalize.equals(this.XLine)) {
            direction = direction+0.3  //绕y轴逆时针
          }
          else {
            direction = direction+0.4  //绕y轴顺时针
          }
          break
        default:
          break
      }
      return direction
    },

    min(arr){
      var min = arr[0]
      var no = 0
      for(var i=1; i<arr.length; i++) {
        if(arr[i]<min) {
            min = arr[i]
            no = i
        }
      }
      return {no:no, value:min}
    },

    //开始操作魔方
    startCube(event) {
      this.getIntersects(event)
      //魔方没有处于转动过程中且存在碰撞物体
      if(!this.isRotating&&this.intersect) {
        this.startPoint = this.intersect.point  //开始转动，设置起始点
        this.controller.enabled = false  //当刚开始的接触点在魔方上时操作为转动魔方，屏蔽控制器转动
      }
      else {
        this.controller.enabled = true  //当刚开始的接触点没有在魔方上或者在魔方上但是魔方正在转动时操作转动控制器
      }
    },

    //获取操作焦点以及该焦点所在平面的法向量
    getIntersects(event) {
      //触摸事件和鼠标事件获得坐标的方式有区别
      if(event.touches) {
          var touch = event.touches[0]
          this.mouse.x = (touch.offsetX / this.width)*2 - 1
          this.mouse.y = -(touch.offsetY / this.height)*2 + 1
      }
      else {
          this.mouse.x = (event.offsetX / this.width)*2 - 1
          this.mouse.y = -(event.offsetY / this.height)*2 + 1
      }
      this.raycaster.setFromCamera(this.mouse, this.camera)
      //Raycaster方式定位选取元素，可能会选取多个，以第一个为准
      var intersects = this.raycaster.intersectObjects(this.scene.children)
      if(intersects.length) {
        try {
          if(intersects[0].object.cubeType==='coverCube') {
            this.intersect = intersects[1]
            this.normalize = intersects[0].face.normal
          }
          else {
            this.intersect = intersects[0]
            this.normalize = intersects[1].face.normal
          }
        }
        catch(err) {
        }
      }
    }
  }
}
</script>

<style scoped>
.refreash {
  align-content: left;
}
</style>