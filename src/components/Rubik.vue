<template>
  <div></div>
</template>

<script>
import { RoundedBoxGeometry } from '../utils/plugins/RoundedBoxGeometry.js'
import { RoundedPlaneGeometry } from '../utils/plugins/RoundedPlaneGeometry.js'
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
      xLine: null,  // x轴正方向
      xLineAd: null,  // x轴负方向
      yLine: null,
      yLineAd: null,
      zLine: null,
      zLineAd: null
    }
  },

  mounted() {
    this.init()
  },
  
  methods: {
    init() {
      this.originPoint = new THREE.Vector3(0, 0, 0)  //原点
      this.xLine = new THREE.Vector3( 1, 0, 0 )
      this.xLineAd = new THREE.Vector3( -1, 0, 0 )
      this.yLine = new THREE.Vector3( 0, 1, 0 )
      this.yLineAd = new THREE.Vector3( 0, -1, 0 )
      this.zLine = new THREE.Vector3( 0, 0, 1 )
      this.zLineAd = new THREE.Vector3( 0, 0, -1 )

      this.raycaster = new THREE.Raycaster()  // 光线碰撞传感器
      this.mouse = new THREE.Vector2()  // 储存鼠标坐标

      this.cubeParams = {
          x:0,
          y:0,
          z:0,
          num:3,
          len:50,
          colors:['rgba(255,193,37,1)','rgba(0,191,255,1)',
                  'rgba(50,205,50,1)','rgba(178,34,34,1)',
                  'rgba(255,255,0,1)','rgba(255,255,255,1)']
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
      this.render()

      //监听鼠标事件
      this.renderer.domElement.addEventListener('mousedown', this.startCube, false)
      this.renderer.domElement.addEventListener('mousemove', this.moveCube, false)
      this.renderer.domElement.addEventListener('mouseup', this.stopCube, false)

      //监听触摸事件
      this.renderer.domElement.addEventListener('touchstart', this.startCube, false)
      this.renderer.domElement.addEventListener('touchmove', this.moveCube, false)
      this.renderer.domElement.addEventListener('touchend', this.stopCube, false)
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
      this.camera.position.set(200, 400, 600)
      this.camera.up.set(0, 1, 0)
      this.camera.lookAt(this.originPoint)

      // 控制视角
      this.controller = new OrbitControls(this.camera, this.renderer.domElement)
      this.controller.target = this.originPoint
    },

    initScene() {
      this.scene = new THREE.Scene()
    },

    initLight() {
      this.light = new THREE.AmbientLight(0xfefefe)
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
              var cubegeo = new THREE.BoxGeometry(len, len, len)
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
          //在内部用某颜色的16px宽的线再画一个宽高为224的圆角正方形并用颜色填充
          context.rect(16, 16, 224, 224)
          context.lineJoin = 'round'
          context.lineWidth = 16
          context.fillStyle = rgbaColor
          context.strokeStyle = rgbaColor
          context.stroke()
          context.fill()
      } else {
          alert('您的浏览器不支持Canvas无法预览.\n')
      }
      return canvas
    },

    initObj() {
      this.SimpleCube(this.cubeParams.x,this.cubeParams.y,this.cubeParams.z,
      this.cubeParams.num,this.cubeParams.len,this.cubeParams.colors)
      this.cubes.forEach(element => {
        this.initStatus.push({
            x:element.position.x,
            y:element.position.y,
            z:element.position.z,
            cubeIndex:element.id
        })
        element.cubeIndex = element.id
        this.scene.add(element)
      })

      var cubegeo = new THREE.BoxGeometry(150,150,150)
      var hex = 0x000000
      for ( var i = 0; i < cubegeo.faces.length; i += 2 ) {
          cubegeo.faces[ i ].color.setHex( hex )
          cubegeo.faces[ i + 1 ].color.setHex( hex )
      }
      var cubemat = new THREE.MeshBasicMaterial({vertexColors: THREE.FaceColors,opacity: 0, transparent: true})
      var cube = new THREE.Mesh( cubegeo, cubemat )
      cube.cubeType = 'coverCube'
      this.scene.add( cube )
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
                var direction = this.getDirection(sub)  //获得方向
                var elements = this.getBoxs(this.intersect, direction)
                var startTime = new Date().getTime()
                var rr = this.rotateAnimation
                window.requestAnimFrame(function(timestamp) {
                  rr(elements,direction,timestamp,0)
                })
              }
            }
        }
        event.preventDefault()
    },

    rotateAnimation(elements,direction,currentstamp,startstamp,laststamp) {
        var totalTime = 500  //转动的总运动时间
        if(startstamp === 0){
          startstamp = currentstamp
          laststamp = currentstamp
        }
        if(currentstamp-startstamp >= totalTime){
          currentstamp = startstamp+totalTime
          this.isRotating = false
          this.startPoint = null
          this.updateCubeIndex(elements)
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
        if(currentstamp-startstamp<totalTime){
          var rr = this.rotateAnimation
          window.requestAnimFrame(function(timestamp){
            rr(elements,direction,timestamp,startstamp,currentstamp)
          })
        }
    },

    //更新位置索引
    updateCubeIndex(elements) {
      for(var i=0;i<elements.length;i++) {
        var temp1 = elements[i]
        for(var j=0;j<this.initStatus.length;j++) {
          var temp2 = this.initStatus[j]
          if( Math.abs(temp1.position.x - temp2.x)<=this.cubeParams.len/2 && 
              Math.abs(temp1.position.y - temp2.y)<=this.cubeParams.len/2 && 
              Math.abs(temp1.position.z - temp2.z)<=this.cubeParams.len/2 ){
              temp1.cubeIndex = temp2.cubeIndex
              break
          }
        }
      }
    },

    //根据方向获得运动元素
    getBoxs(target,direction){
      var targetId = target.object.cubeIndex
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
      var xAngle = vector3.angleTo(this.xLine)
      var xAngleAd = vector3.angleTo(this.xLineAd)
      var yAngle = vector3.angleTo(this.yLine)
      var yAngleAd = vector3.angleTo(this.yLineAd)
      var zAngle = vector3.angleTo(this.zLine)
      var zAngleAd = vector3.angleTo(this.zLineAd)
      var minAngle = this.min([xAngle,xAngleAd,yAngle,yAngleAd,zAngle,zAngleAd])  //最小夹角
      switch(minAngle){
        case xAngle:
          direction = 0  //向x轴正方向旋转90度（还要区分是绕z轴还是绕y轴）
          console.log('向x轴正方向旋转90度')
          if(this.normalize.equals(this.yLine)) {
            direction = direction+0.1  //绕z轴顺时针
          }
          else if(this.normalize.equals(this.yLineAd)) {
            direction = direction+0.2  //绕z轴逆时针
          }
          else if(this.normalize.equals(this.zLine)) {
            direction = direction+0.3  //绕y轴逆时针
          }
          else {
            direction = direction+0.4  //绕y轴顺时针
          }
          break
        case xAngleAd:
          console.log('向x轴反方向旋转90度')
          direction = 1  //向x轴反方向旋转90度
          if(this.normalize.equals(this.yLine)) {
            direction = direction+0.1  //绕z轴逆时针
          }
          else if(this.normalize.equals(this.yLineAd)) {
            direction = direction+0.2  //绕z轴顺时针
          }
          else if(this.normalize.equals(this.zLine)) {
            direction = direction+0.3  //绕y轴顺时针
          }
          else {
            direction = direction+0.4  //绕y轴逆时针
          }
          break
        case yAngle:
          console.log('向y轴正方向旋转90度')
          direction = 2  //向y轴正方向旋转90度
          if(this.normalize.equals(this.zLine)) {
            direction = direction+0.1  //绕x轴逆时针
          }
          else if(this.normalize.equals(this.zLineAd)) {
            direction = direction+0.2  //绕x轴顺时针
          }
          else if(this.normalize.equals(this.xLine)) {
            direction = direction+0.3  //绕z轴逆时针
          }
          else {
            direction = direction+0.4  //绕z轴顺时针
          }
          break
        case yAngleAd:
          console.log('向y轴反方向旋转90度')
          direction = 3  //向y轴反方向旋转90度
          if(this.normalize.equals(this.zLine)) {
            direction = direction+0.1  //绕x轴顺时针
          }
          else if(this.normalize.equals(this.zLineAd)) {
            direction = direction+0.2  //绕x轴逆时针
          }
          else if(this.normalize.equals(this.xLine)) {
            direction = direction+0.3  //绕z轴顺时针
          }
          else {
            direction = direction+0.4  //绕z轴逆时针
          }
          break
        case zAngle:
          console.log('向z轴正方向旋转90度')
          direction = 4  //向z轴正方向旋转90度
          if(this.normalize.equals(this.yLine)) {
            direction = direction+0.1  //绕x轴顺时针
          }
          else if(this.normalize.equals(this.yLineAd)) {
            direction = direction+0.2  //绕x轴逆时针
          }
          else if(this.normalize.equals(this.xLine)) {
            direction = direction+0.3  //绕y轴顺时针
          }
          else {
            direction = direction+0.4//绕y轴逆时针
          }
          break
        case zAngleAd:
          console.log('向z轴反方向旋转90度')
          direction = 5  //向z轴反方向旋转90度
          if(this.normalize.equals(this.yLine)) {
            direction = direction+0.1  //绕x轴逆时针
          }
          else if(this.normalize.equals(this.yLineAd)) {
            direction = direction+0.2  //绕x轴顺时针
          }
          else if(this.normalize.equals(this.xLine)) {
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