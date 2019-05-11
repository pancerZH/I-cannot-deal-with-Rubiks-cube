<template>
  <div></div>
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
      minCubeIndex: null
    }
  },

  mounted() {
    this.init()
  },
  
  methods: {
    init() {
      this.originPoint = new THREE.Vector3(0, 0, 0)  //原点
      this.XLine = new THREE.Vector3( 1, 0, 0 )
      this.XLineAd = new THREE.Vector3( -1, 0, 0 )
      this.YLine = new THREE.Vector3( 0, 1, 0 )
      this.YLineAd = new THREE.Vector3( 0, -1, 0 )
      this.ZLine = new THREE.Vector3( 0, 0, 1 )
      this.ZLineAd = new THREE.Vector3( 0, 0, -1 )

      this.raycaster = new THREE.Raycaster()  // 光线碰撞传感器
      this.mouse = new THREE.Vector2()  // 储存鼠标坐标

      this.cubeParams = {
        x:0,
        y:0,
        z:0,
        num:3,
        len:50,
        colors:['rgba(236, 56, 35, 1)','rgba(252, 236, 71, 1)',
                'rgba(252, 138, 10, 1)','rgba(101, 157, 44, 1)',
                'rgba(252, 244, 252, 1)','rgba(56, 148, 173, 1)']
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

      this.randomRotate()
    },

    initThree() {
      this.width = window.innerWidth
      this.height = window.innerHeight
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
      } else {
          alert('您的浏览器不支持Canvas无法预览.')
      }
      return canvas
    },

    randomRotate() {
      if(!this.isRotating) {
        var stepNum = parseInt(20*Math.random())
        if(stepNum < 10) {
          stepNum = 10  // 至少动10步
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

    runMethodAtNo(arr,no,rotateNum,next) {
      if(no >= arr.length-1) {
        if(next) {
          arr[no](rotateNum,next)
        }
        else {
          arr[no](rotateNum)
        }
      }
      else {
        arr[no](rotateNum,function() {
          if(no<arr.length-1) {
            no++
            runMethodAtNo(arr, no, rotateNum, next)
          }
        })
      }
    },

    // 魔方基本公式 U、F、L、D、R、u、f、l、d
    U(rotateNum,next) {
      this.stepCount++
      var cube2 = this.getCubeByIndex(2,rotateNum)
      var zLine = this.rotateAxisByYLine(this.ZLine,rotateNum)
      var xLineAd = this.rotateAxisByYLine(this.XLineAd,rotateNum)
      this.normalize = zLine
      this.rotateMove(cube2,xLineAd,next)
    },
    u(rotateNum,next) {
      this.stepCount++
      var cube2 = this.getCubeByIndex(2,rotateNum)
      var xLine = this.rotateAxisByYLine(this.XLine,rotateNum)
      var zLineAd = this.rotateAxisByYLine(this.ZLineAd,rotateNum)
      this.normalize = xLine
      this.rotateMove(cube2,zLineAd,next)
    },
    F(rotateNum,next) {
      this.stepCount++
      var cube2 = this.getCubeByIndex(2,rotateNum)
      var xLine = this.rotateAxisByYLine(this.XLine,rotateNum)
      this.normalize = xLine
      this.rotateMove(cube2,this.YLineAd,next)
    },
    f(rotateNum,next) {
      this.stepCount++
      var cube2 = this.getCubeByIndex(2,rotateNum)
      var xLineAd = this.rotateAxisByYLine(this.XLineAd,rotateNum)
      this.normalize = this.YLine
      this.rotateMove(cube2,xLineAd,next)
    },
    L(rotateNum,next) {
      this.stepCount++
      var cube0 = this.getCubeByIndex(0,rotateNum)
      var zLine = this.rotateAxisByYLine(this.ZLine,rotateNum)
      this.normalize = zLine
      this.rotateMove(cube0,this.YLineAd,next)
    },
    l(rotateNum,next) {
      this.stepCount++
      var cube0 = this.getCubeByIndex(0,rotateNum)
      var zLineAd = this.rotateAxisByYLine(this.ZLineAd,rotateNum)
      this.normalize = this.YLine
      this.rotateMove(cube0,zLineAd,next)
    },
    D(rotateNum,next) {
      this.stepCount++
      var cube8 = this.getCubeByIndex(8,rotateNum)
      var xLine = this.rotateAxisByYLine(this.XLine,rotateNum)
      var zLineAd = this.rotateAxisByYLine(this.ZLineAd,rotateNum)
      this.normalize = xLine
      this.rotateMove(cube8,zLineAd,next)
    },
    d(rotateNum,next) {
      this.stepCount++
      var cube8 = this.getCubeByIndex(8,rotateNum)
      var zLine = this.rotateAxisByYLine(this.ZLine,rotateNum)
      var xLineAd = this.rotateAxisByYLine(this.XLineAd,rotateNum)
      this.normalize = zLine
      this.rotateMove(cube8,xLineAd,next)
    },
    R(rotateNum,next) {
      this.stepCount++
      var cube2 = this.getCubeByIndex(2,rotateNum)
      var zLineAd = this.rotateAxisByYLine(this.ZLineAd,rotateNum)
      this.normalize = this.YLine
      this.rotateMove(cube2,zLineAd,next)
    },
    r(rotateNum,next) {
      this.stepCount++
      var cube2 = this.getCubeByIndex(2,rotateNum)
      var zLine = this.rotateAxisByYLine(this.ZLine,rotateNum)
      this.normalize = zLine
      this.rotateMove(cube2,this.YLineAd,next)
    },
    B(rotateNum,next) {
      this.stepCount++
      var cube20 = this.getCubeByIndex(20,rotateNum)
      var xLine = this.rotateAxisByYLine(this.XLine,rotateNum)
      this.normalize = xLine
      this.rotateMove(cube20,this.YLine,next)
    },
    b(rotateNum,next) {
      this.stepCount++
      var cube20 = this.getCubeByIndex(20,rotateNum)
      var xLine = this.rotateAxisByYLine(this.XLine,rotateNum)
      this.normalize = xLine
      this.rotateMove(cube20,this.YLineAd,next)
    },

    getCubeByIndex(index,rotateNum) {
      var tempIndex = index
      var tempRotateNum = rotateNum
      while(rotateNum>0) {
        if(parseInt(index/9)==0) {
          if(index%3==0) {
            index += 2
          }
          else if(index%3==1) {
            index += 10
          }
          else if(index%3==2) {
            index += 18
          }
        }
        else if(index%3==2) {
          if(parseInt(index/9)==0) {
            index += 18
          }
          else if(parseInt(index/9)==1) {
            index += 8
          }
          else if(parseInt(index/9)==2) {
            index -= 2
          }
        }
        else if(parseInt(index/9)==2) {
          if(index%3==2) {
            index -= 2
          }
          else if(index%3==1) {
            index -= 10
          }
          else if(index%3==0) {
            index -= 18
          }
        }
        else if(index%3==0) {
          if(parseInt(index/9)==2) {
            index -= 18
          }
          else if(parseInt(index/9)==1) {
            index -= 8
          }
          else if(parseInt(index/9)==0) {
            index += 2
          }
        }
        rotateNum--
      }
      var cube
      this.cubes.forEach(element => {
        if(element.cubeIndex == index+this.minCubeIndex) {
          cube = element
        }
      })
      console.log(cube)
      return cube
    },

    //根据Y轴旋转向量
    rotateAxisByYLine(vector, rotateNum) {
      while(rotateNum > 0) {
        if(vector.angleTo(this.XLine) == 0) {
          vector = this.ZLineAd.clone()
        }
        else if(vector.angleTo(this.ZLineAd) == 0) {
          vector = this.XLineAd.clone()
        }
        else if(vector.angleTo(this.XLineAd) == 0) {
          vector = this.ZLine.clone()
        }
        else if(vector.angleTo(this.ZLine) == 0) {
          vector = this.XLine.clone()
        }
        rotateNum--
      }
      return vector
    },

    rotateMove(target,vector,next) {
      this.isRotating = true  //转动标识置为true
      var direction = this.getDirection(vector)  //获得方向
      var elements = this.getBoxs(target,direction)
      var rr = this.rotateAnimation
        window.requestAnimFrame(function(timestamp) {
            rr(elements,direction,timestamp,0,null,next)
        })
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
      this.minCubeIndex = this.min(ids)

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
      this.getIntersects(event)
      if(this.intersect) {
        if(!this.isRotating && this.startPoint) {
          //魔方没有进行转动且满足进行转动的条件
          this.movePoint = this.intersect.point
          if(!this.movePoint.equals(this.startPoint)) {
            //和起始点不一样则意味着可以得到转动向量了
            this.isRotating = true  //转动标识置为true
            var sub = this.movePoint.sub(this.startPoint)  //计算转动向量
            // var direction = this.getDirection(sub)  //获得方向
            // var elements = this.getBoxs(this.intersect, direction)
            // var startTime = new Date().getTime()
            // var rr = this.rotateAnimation
            // window.requestAnimFrame(function(timestamp) {
            //   rr(elements,direction,timestamp,0)
            // })
            this.rotateMove(this.intersect, sub)
          }
        }
      }
      event.preventDefault()
    },

    rotateAnimation(elements,direction,currentstamp,startstamp,laststamp) {
        var totalTime = 500  //转动的总运动时间
        var isLastRotate = false  //是否是某次转动最后一次动画
        if(startstamp === 0) {
          startstamp = currentstamp
          laststamp = currentstamp
        }
        if(currentstamp-startstamp >= totalTime) {
          currentstamp = startstamp+totalTime
          isLastRotate = true
        }
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
            rr(elements,direction,timestamp,startstamp,currentstamp)
          })
        }
        else {
          this.isRotating = false
          this.startPoint = null
          this.updateCubeIndex(elements)
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
      console.log(target)
      var targetId = 0
      if(target.object != null)
        targetId = target.object.cubeIndex
      else
        targetId = target.cubeIndex
      var ids = []   
      this.cubes.forEach(cube => {
        ids.push(cube.cubeIndex)
      })
      var minId = this.min(ids)
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
      var minAngle = this.min([xAngle,xAngleAd,yAngle,yAngleAd,zAngle,zAngleAd])  //最小夹角
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
      arr.forEach(element => {
        if(element < min) {
          min = element
        }
      })
      return min
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
            this.mouse.x = (touch.clientX / this.width)*2 - 1
            this.mouse.y = -(touch.clientY / this.height)*2 + 1
        }
        else {
            this.mouse.x = (event.clientX / this.width)*2 - 1
            this.mouse.y = -(event.clientY / this.height)*2 + 1
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

</style>