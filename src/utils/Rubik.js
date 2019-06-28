import { OrbitControls } from 'three-orbitcontrols-ts';

var camera = null;
var scene = null;
var light = null;
var cubes = [];
var renderer = null;
var width = 0;
var height = 0;
var originPoint = null;
var controller = null;
var raycaster = null;
var mouse = null;
export var cubeParams = {};
var isRotating = false;
var intersect = null;  // 碰撞光线穿过的元素
var normalize = null;  // 触发平面法向量
var startPoint = null;  // 触发点
var movePoint = null;
var initStatus = [];
var XLine = null;  // x轴正方向
var XLineAd = null;  // x轴负方向
var YLine = null;
var YLineAd = null;
var ZLine = null;
var ZLineAd = null;
export var stepCount = 0;
var minCubeIndex = null;
var speed = 200;
var oldSpeed = 200;
var Cube = null;
var cube = null;
var answer = {};
var stepBystep = [];
var newSolution = true;
var mobile = false;
var start = true;
var canvasOff = 200;
export var randomRotateLoading = false;
export var autoRestRunning = false;
export var acceptStringRunning = false;

export function init(is_mobile) {
    if (originPoint === null) {
        originPoint = new THREE.Vector3(0, 0, 0);  //原点
        XLine = new THREE.Vector3(1, 0, 0);
        XLineAd = new THREE.Vector3(-1, 0, 0);
        YLine = new THREE.Vector3(0, 1, 0);
        YLineAd = new THREE.Vector3(0, -1, 0);
        ZLine = new THREE.Vector3(0, 0, 1);
        ZLineAd = new THREE.Vector3(0, 0, -1);

        raycaster = new THREE.Raycaster();  // 光线碰撞传感器
        mouse = new THREE.Vector2();  // 储存鼠标坐标

        answer = {
            'R': R,
            'U': U,
            'F': F,
            'B': B,
            'L': L,
            'D': D,
            'r': r,
            'u': u,
            'f': f,
            'b': b,
            'l': l,
            'd': d
        };
    
        cubeParams = {
            x: 0,
            y: 0,
            z: 0,
            num: 3,
            len: 50,
            colorName: ['red', 'orange', 'blue', 'green', 'white', 'yellow'],
            // 右左上下前后
            colors: ['rgba(236, 56, 35, 1)', 'rgba(252, 138, 10, 1)',
                'rgba(56, 148, 173, 1)', 'rgba(101, 157, 44, 1)',
                'rgba(252, 244, 252, 1)', 'rgba(252, 236, 71, 1)'],
            sequences: ['R', 'L', 'U', 'D', 'F', 'B']  //默认序列名
        };
    }

    if (Cube === null) {
        Cube = require('cubejs');
        cube = new Cube();
        Cube.initSolver();
    }

    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            window.webkitRequestAnimationFrame
    })();

    if (is_mobile)
        mobile = true;

    initThree();
    initCamera();
    initScene();
    initLight();
    initObj();
    // initCord();  // 添加坐标轴
    render();

    //监听鼠标事件
    renderer.domElement.addEventListener('mousedown', startCube, false);
    renderer.domElement.addEventListener('mousemove', moveCube, false);
    renderer.domElement.addEventListener('mouseup', stopCube, false);

    //监听触摸事件
    renderer.domElement.addEventListener('touchstart', startCube, false);
    renderer.domElement.addEventListener('touchmove', moveCube, false);
    renderer.domElement.addEventListener('touchend', stopCube, false);

    // 控制视角
    controller = new OrbitControls(camera, renderer.domElement);
    controller.target = new THREE.Vector3(0, 0, 0);

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    // console.log("size change");
    // camera.aspect = window.innerWidth / window.innerHeight;
    // camera.updateProjectionMatrix();
    // renderer.setSize( window.innerWidth, window.innerHeight );
}

export function changeSpeed(newSpeed) {
    oldSpeed = newSpeed;
}

function initThree() {
    width = window.innerWidth;
    if (mobile) {
        height = window.innerHeight * 0.75;
        document.getElementById('canvas3d').style.marginTop = String(canvasOff)+'px';
    }
    else {
        height = window.innerHeight;
        document.getElementById('canvas3d').style.marginTop = '100px';
    }
    if (renderer === null) {
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
    }
    renderer.setSize(width, height);
    renderer.setClearColor(0xFFFFFF, 0);
    document.getElementById('canvas3d').appendChild(renderer.domElement);
}

function initCamera() {
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(200, 200, 600);
    camera.up.set(0, 1, 0);
    camera.lookAt(originPoint);
}

function initScene() {
    scene = new THREE.Scene();
}

function initLight() {
    light = new THREE.AmbientLight(0x404040, 2);
    // scene.add(light);

    var position = 160;
    for (var i = 0; i < 6; i++) {
        var spotLight = new THREE.SpotLight(0xffffff, 1.5);
        switch(i) {
            case 0:
                spotLight.position.set(0, position, 0);
                break;
            case 1:
                spotLight.position.set(0, -position, 0);
                break;
            case 2:
                spotLight.position.set(position, 0, 0);
                break;
            case 3:
                spotLight.position.set(-position, 0, 0);
                break;
            case 4:
                spotLight.position.set(0, 0, position);
                break;
            case 5:
                spotLight.position.set(0, 0, -position);
                break;
            default:
                break;
        }
        spotLight.target.position.set(0, 0, 0);
        scene.add(spotLight);
    }
}

function SimpleCube(x, y, z, num, len, colors) {
    //魔方左上角坐标
    var leftUpX = x - num / 2 * len;
    var leftUpY = y + num / 2 * len;
    var leftUpZ = z + num / 2 * len;
    //根据颜色生成材质
    var materialArr = [];
    for (var i = 0; i < colors.length; i++) {
        var texture = new THREE.Texture(faces(colors[i]));
        texture.needsUpdate = true;
        var material = new THREE.MeshLambertMaterial({ map: texture });
        materialArr.push(material);
    }
    for (var i = 0; i < num; i++) {
        for (var j = 0; j < num * num; j++) {
            var cubegeo = new THREE.BoxGeometry(len, len, len, 2, 5);
            var cube = new THREE.Mesh(cubegeo, materialArr);
            //依次计算各个小方块中心点坐标
            cube.position.x = (leftUpX + len / 2) + (j % num) * len;
            cube.position.y = (leftUpY - len / 2) - parseInt(j / num) * len;
            cube.position.z = (leftUpZ - len / 2) - i * len ;
            cubes.push(cube);
        }
    }
}

function faces(rgbaColor) {
    var canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    var context = canvas.getContext('2d');
    if (context) {
      //画一个宽高都是256的黑色正方形
        context.fillStyle = 'rgba(0,0,0,1)';
        context.fillRect(0, 0, 256, 256);
        // 绘制圆角矩形
        var x = 16;
        var y = 16;
        var h = 224;
        var w = 224;
        var r = 32;
        context.beginPath();
        context.moveTo(x + r, y);
        context.arcTo(x + w, y, x + w, y + h, r);
        context.arcTo(x + w, y + h, x, y + h, r);
        context.arcTo(x, y + h, x, y, r);
        context.arcTo(x, y, x + w, y, r);
        context.closePath();
        context.lineWidth = 16;
        context.imageSmoothingQuality = 'high';
        context.fillStyle = rgbaColor;
        context.strokeStyle = rgbaColor;
        context.stroke();
        context.fill();
    } 
    else {
        alert('浏览器不支持Canvas无法预览.');
    }
    return canvas;
}

export function acceptCubeString(cubeString) {
    start = true;
    stepCount = 0;
    cube = Cube.fromString(cubeString);
    var moves = Cube.inverse(cube.solve());

    if (scene != null) {
        scene.remove(cubes);
    }

    camera = null;
    scene = null;
    light = null;
    cubes = [];
    // renderer = null;
    width = 0;
    height = 0;
    originPoint = null;
    controller = null;
    raycaster = null;
    mouse = null;
    cubeParams = {};
    isRotating = false;
    intersect = null;  // 碰撞光线穿过的元素
    normalize = null;  // 触发平面法向量
    startPoint = null;  // 触发点
    movePoint = null;
    initStatus = [];
    XLine = null;  // x轴正方向
    XLineAd = null;  // x轴负方向
    YLine = null;
    YLineAd = null;
    ZLine = null;
    ZLineAd = null;
    stepCount = 0;
    minCubeIndex = null;
    answer = {};
    stepBystep = [];
    newSolution = true;

    var x = document.getElementsByTagName("canvas")[1];
    x.parentNode.removeChild(x);
    init();
    speed = 50;
    acceptStringRunning = true;
    runOperations(moves);
}

export function clearAll() {
    if (scene != null) {
        scene.remove(cubes);
    }
    start = true;
    stepCount = 0;
    camera = null;
    scene = null;
    light = null;
    cubes = [];
    // renderer = null;
    width = 0;
    height = 0;
    originPoint = null;
    controller = null;
    raycaster = null;
    mouse = null;
    cubeParams = {};
    isRotating = false;
    intersect = null;  // 碰撞光线穿过的元素
    normalize = null;  // 触发平面法向量
    startPoint = null;  // 触发点
    movePoint = null;
    initStatus = [];
    XLine = null;  // x轴正方向
    XLineAd = null;  // x轴负方向
    YLine = null;
    YLineAd = null;
    ZLine = null;
    ZLineAd = null;
    stepCount = 0;
    minCubeIndex = null;
    answer = {};
    stepBystep = [];
    newSolution = true;

    var x = document.getElementsByTagName("canvas")[1];
    x.parentNode.removeChild(x);
    init();
}

export function acceptMethod(moves, newSpeed) {
    start = true;
    stepCount = 0;
    camera = null;
    scene = null;
    light = null;
    cubes = [];
    // renderer = null;
    width = 0;
    height = 0;
    originPoint = null;
    controller = null;
    raycaster = null;
    mouse = null;
    cubeParams = {};
    isRotating = false;
    intersect = null;  // 碰撞光线穿过的元素
    normalize = null;  // 触发平面法向量
    startPoint = null;  // 触发点
    movePoint = null;
    initStatus = [];
    XLine = null;  // x轴正方向
    XLineAd = null;  // x轴负方向
    YLine = null;
    YLineAd = null;
    ZLine = null;
    ZLineAd = null;
    stepCount = 0;
    minCubeIndex = null;
    answer = {};
    stepBystep = [];
    newSolution = true;

    var x = document.getElementsByTagName("canvas")[1];
    x.parentNode.removeChild(x);
    init();
    speed = newSpeed;
    acceptStringRunning = true;
    runOperations(moves);
}

function runOperations(operations) {
    //解析命令
    operations = operations.split(' ');
    var arr = [];
    var reg1 = /^[a-zA-Z]{1}$/;  //纯字母
    var reg2 = /^[a-zA-Z]{1}[2]{1}$/;  //字母+2
    var reg3 = /^[a-zA-Z]{1}'$/;  //字母+单引号
    operations.forEach(move => {
        if (reg3.test(move)) {
            var temp = move.substring(0, 1);
            arr.push(temp.toLowerCase());
        }
        else if (reg2.test(move)) {
            var temp = move.substring(0, 1);
            arr.push(temp);
            arr.push(temp);
        }
        else if (reg1.test(move)) {
            arr.push(move);
        }
        else {
            console.log('出错啦');
        }
    });

    //执行
    var funcs = [];
    stepCount = 0;
    arr.forEach(move => {
        var f = answer[move];
        funcs.push(f);
    });
    var count = stepCount;
    autoRestRunning = true;
    runMethodAtNo(funcs, 0, 0, function () {
        var endTime = window.performance.now();
        console.log('end at:' + endTime);
        console.log('total times:' + (endTime - startTime));
        console.log('total steps:' + count);
    });
}

export function randomRotate(newSpeed) {
    start = true;
    stepCount = 0;
    randomRotateLoading = true;
    if(!isRotating) {
        speed = newSpeed;
        oldSpeed = speed;
        var stepNum = parseInt(40 * Math.random());
        if(stepNum < 20) {
          stepNum = 20;  // 至少动20步
        }
        var funcArr = [R, U, F, B, L, D, r, u, f, b, l, d];
        var stepArr = [];
        for(var i=0; i<stepNum; i++) {
          var num = parseInt(Math.random() * funcArr.length);
          stepArr.push(funcArr[num]);
        }
        runMethodAtNo(stepArr, 0, 0);
    }
}

function runMethodAtNo(arr,no,next) {
    if(no >= arr.length-1) {
        if(next) {
            arr[no](next);
            randomRotateLoading = false;
            autoRestRunning = false;
            acceptStringRunning = false;
        }
        else {
            arr[no]();
            randomRotateLoading = false;
            autoRestRunning = false;
            acceptStringRunning = false;
        }
    }
    else {
        arr[no](function () {
            if (no < arr.length - 1) {
                no++;
                runMethodAtNo(arr, no, next);
            }
        });
    }
}

export async function autoRest(newSpeed) {
    start = true;
    autoRestRunning = true;
    speed = newSpeed;
    oldSpeed = speed;
    var startTime = window.performance.now();
    console.log('start autoReset');
    console.log('start at:' + startTime);
  
    //调用kociemba算法获得自动还原命名
    var rubik = getRubikSequence();
    cube.init(Cube.fromString(rubik));
    if(cube.isSolved()) {
        autoRestRunning = false;
        return;
    }
    // Cube.initSolver();
    var moves = await cube.solve();
    
    runOperations(moves);
}

export async function autoRestOneStep(newSpeed) {
    autoRestRunning = true;
    speed = newSpeed;
    oldSpeed = speed;
    if(newSolution) {
        var stepCount = 0;
        stepBystep = [];

        //调用kociemba算法获得自动还原命名
        var rubik = getRubikSequence();
        cube.init(Cube.fromString(rubik));
        if(cube.isSolved()) {
            autoRestRunning = false;
            return;
        }
        // Cube.initSolver();
        var moves = await cube.solve();
        moves = moves.split(' ');
      
        //解析命令
        var reg1 = /^[a-zA-Z]{1}$/;  //纯字母
        var reg2 = /^[a-zA-Z]{1}[2]{1}$/;  //字母+2
        var reg3 = /^[a-zA-Z]{1}'$/;  //字母+单引号
        moves.forEach(move => {
            if (reg3.test(move)) {
                var temp = move.substring(0, 1);
                stepBystep.push(temp.toLowerCase());
            }
            else if (reg2.test(move)) {
                var temp = move.substring(0, 1);
                stepBystep.push(temp);
                stepBystep.push(temp);
            }
            else if (reg1.test(move)) {
                stepBystep.push(move);
            }
            else {
                console.log('出错啦');
            }
        });

        newSolution = false;
    }

    var f = answer[stepBystep.shift()];
    if(f) {
        f(0);
    }
    else {
        newSolution = true;
    }
    autoRestRunning = false;
}

export async function autoRunOneStep(methodMoves, newSpeed, currentStep) {
    autoRestRunning = true;
    speed = newSpeed;
    oldSpeed = speed;
    if(newSolution && currentStep === 0) {
        stepBystep = [];

        // Cube.initSolver();
        var moves = methodMoves.split(' ');
      
        //解析命令
        var reg1 = /^[a-zA-Z]{1}$/;  //纯字母
        var reg2 = /^[a-zA-Z]{1}[2]{1}$/;  //字母+2
        var reg3 = /^[a-zA-Z]{1}'$/;  //字母+单引号
        moves.forEach(move => {
            if (reg3.test(move)) {
                var temp = move.substring(0, 1);
                stepBystep.push(temp.toLowerCase());
            }
            else if (reg2.test(move)) {
                var temp = move.substring(0, 1);
                stepBystep.push(temp);
                stepBystep.push(temp);
            }
            else if (reg1.test(move)) {
                stepBystep.push(move);
            }
            else {
                console.log('出错啦');
            }
        });

        newSolution = false;
    }

    var f = answer[stepBystep.shift()];
    if(f) {
        f(0);
    }
    else {
        newSolution = true;
    }
    autoRestRunning = false;
}

function getRubikSequence() {
    var seq = [];

    //U
    var us = [18, 19, 20, 9, 10, 11, 0, 1, 2];
    us.forEach(u => {
        var ui = getCubeByIndex(u);
        seq.push(getFaceColorByVector(ui, YLine));
    });

    //R
    var rs = [2, 11, 20, 5, 14, 23, 8, 17, 26];
    rs.forEach(r => {
        var ri = getCubeByIndex(r);
        seq.push(getFaceColorByVector(ri, XLine));
    });

    //F
    var fs = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    fs.forEach(f => {
        var fi = getCubeByIndex(f);
        seq.push(getFaceColorByVector(fi, ZLine));
    });

    //D
    var ds = [6, 7, 8, 15, 16, 17, 24, 25, 26];
    ds.forEach(d => {
        var di = getCubeByIndex(d);
        seq.push(getFaceColorByVector(di, YLineAd));
    });

    //L
    var ls = [18, 9, 0, 21, 12, 3, 24, 15, 6];
    ls.forEach(l => {
        var li = getCubeByIndex(l);
        seq.push(getFaceColorByVector(li, XLineAd));
    });

    //B
    var bs = [20, 19, 18, 23, 22, 21, 26, 25, 24];
    bs.forEach(b => {
        var bi = getCubeByIndex(b);
        seq.push(getFaceColorByVector(bi, ZLineAd));
    });

    //  因为并没有限制用户操作不能转动中心，因此默认魔方序列名可能会有变化，这里需要重新设置
    var cube10 = getCubeByIndex(10);
    var uColorIndex = getFaceColorByVector(cube10, YLine);
    cubeParams.sequences[uColorIndex] = 'U';

    var cube4 = getCubeByIndex(4);
    var fColorIndex = getFaceColorByVector(cube4, ZLine);
    cubeParams.sequences[fColorIndex] = 'F';

    var cube14 = getCubeByIndex(14);
    var rColorIndex = getFaceColorByVector(cube14, XLine);
    cubeParams.sequences[rColorIndex] = 'R';

    var cube12 = getCubeByIndex(12);
    var lColorIndex = getFaceColorByVector(cube12, XLineAd);
    cubeParams.sequences[lColorIndex] = 'L';

    var cube16 = getCubeByIndex(16);
    var dColorIndex = getFaceColorByVector(cube16, YLineAd);
    cubeParams.sequences[dColorIndex] = 'D';

    var cube22 = getCubeByIndex(22);
    var bColorIndex = getFaceColorByVector(cube22, ZLineAd);
    cubeParams.sequences[bColorIndex] = 'B';

    //  颜色序号转换为魔方序列
    var str = '';
    seq.forEach(s => {
        str += cubeParams.sequences[s];
    });

    return str;
    
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
}

//获取法向量和已知向量方向相同的面的颜色序号
function getFaceColorByVector(cube, vector) {
    var materials = cube.material;
    var faces = cube.geometry.faces;
    var normalMatrix = cube.normalMatrix;
    
    /**
     * 转换视角时摄像机位置发生了变动，模型开始上表面的法向量是世界坐标系的Y轴，现在依然是世界坐标系的Y轴；
     * 但是小方块面的法向量乘以其法向量矩阵得到的是视图坐标系中的向量；
     * 世界坐标系转换成视图坐标系需要乘以视图矩阵的逆反矩阵。
     */
    var viewMatrix = new THREE.Matrix4();
    viewMatrix.lookAt(camera.position, originPoint, camera.up);
    viewMatrix.getInverse(viewMatrix);
    var tempVector = vector.clone();
    tempVector.applyMatrix4(viewMatrix);
    var angles = [];

    faces.forEach(face => {
        var tempNormal = face.normal.clone();
        tempNormal.applyMatrix3(normalMatrix);
        angles.push(tempNormal.angleTo(tempVector));
    });
    var minNo = min(angles).no;
    return faces[minNo].materialIndex;
}
  
// 魔方基本公式 U、F、L、D、R 、B、u、f、l、d
function U(next) {
    // stepCount++;
    var cube2 = getCubeByIndex(2);
    normalize = ZLine;
    rotateMove(cube2, XLineAd, next);
}

function u(next) {
    // stepCount++;
    var cube2 = getCubeByIndex(2);
    normalize = XLine;
    rotateMove(cube2, ZLineAd, next);
}

function F(next) {
    // stepCount++;
    var cube2 = getCubeByIndex(2);
    normalize = XLine;
    rotateMove(cube2, YLineAd, next);
}
  
function f(next) {
    // stepCount++;
    var cube2 = getCubeByIndex(2);
    normalize = YLine;
    rotateMove(cube2, XLineAd, next);
}
  
function L(next) {
    // stepCount++;
    var cube0 = getCubeByIndex(0);
    normalize = ZLine;
    rotateMove(cube0, YLineAd, next);
}
  
function l(next) {
    // stepCount++;
    var cube0 = getCubeByIndex(0);
    normalize = YLine;
    rotateMove(cube0, ZLineAd, next);
}
  
function D(next) {
    // stepCount++;
    var cube8 = getCubeByIndex(8);
    normalize = XLine;
    rotateMove(cube8, ZLineAd, next);
}
  
function d(next) {
    // stepCount++;
    var cube8 = getCubeByIndex(8);
    normalize = ZLine;
    rotateMove(cube8, XLineAd, next);
}
  
function R(next) {
    // stepCount++;
    var cube2 = getCubeByIndex(2);
    normalize = YLine;
    rotateMove(cube2, ZLineAd, next);
}
  
function r(next) {
    // stepCount++;
    var cube2 = getCubeByIndex(2);
    normalize = ZLine;
    rotateMove(cube2, YLineAd, next);
}
  
function B(next) {
    // stepCount++;
    var cube20 = getCubeByIndex(20);
    normalize = XLine;
    rotateMove(cube20, YLine, next);
}
  
function b(next) {
    // stepCount++;
    var cube20 = getCubeByIndex(20);
    normalize = XLine;
    rotateMove(cube20, YLineAd, next);
}
  
function getCubeByIndex(index) {
    var cube;
    cubes.forEach(element => {
        if (element.cubeIndex == index + minCubeIndex) {
            cube = element;
        }
    });
    return cube;
}

function rotateMove(target,vector,next) {
    isRotating = true;  //转动标识置为true
    var direction = getDirection(vector);  //获得方向
    var elements = getBoxs(target, direction);
    findWhichOperation(direction, elements);
    stepCount++;
    window.requestAnimFrame(function (timestamp) {
        rotateAnimation(elements, direction, timestamp, 0, null, next);
    });
}
  
function findWhichOperation(direction, elements) {
    var ids = []; 
    cubes.forEach(cube => {
        ids.push(cube.cubeIndex);
    });
    var minId = min(ids).value;
    var targetId = 0;
    switch(direction) {
        //绕z轴顺时针
        case 0.1:
        case 1.2:
        case 2.4:
        case 3.3:
            elements.forEach(element => {
                var targetId = element.cubeIndex - minId;
                if (targetId === 2) {
                    cube.move("F");
                }
                if (targetId === 10) {
                    cube.move("S");
                }
                if (targetId === 20) {
                    cube.move("b");
                }
            });
            break;
        //绕z轴逆时针
        case 0.2:
        case 1.1:
        case 2.3:
        case 3.4:
            elements.forEach(element => {
                targetId = element.cubeIndex - minId;
                if (targetId === 2) {
                    cube.move("F'");
                }
                if (targetId === 10) {
                    cube.move("S'");
                }
                if (targetId === 20) {
                    cube.move("B");
                }
            });
            break;
        //绕y轴顺时针
        case 0.4:
        case 1.3:
        case 4.3:
        case 5.4:
            elements.forEach(element => {
                targetId = element.cubeIndex - minId;
                if (targetId === 2) {
                    cube.move("U");
                }
                if (targetId === 5) {
                    cube.move("E");
                }
                if (targetId === 8) {
                    cube.move("D");
                }
            });
            break;
        //绕y轴逆时针
        case 1.4:
        case 0.3:
        case 4.4:
        case 5.3:
            elements.forEach(element => {
                targetId = element.cubeIndex - minId;
                if (targetId === 2) {
                    cube.move("U'");
                }
                if (targetId === 5) {
                    cube.move("E'");
                }
                if (targetId === 8) {
                    cube.move("D'");
                }
            });
            break;
        //绕x轴顺时针
        case 2.2:
        case 3.1:
        case 4.1:
        case 5.2:
            elements.forEach(element => {
                targetId = element.cubeIndex - minId;
                if (targetId === 2) {
                    cube.move("R'");
                }
                if (targetId === 4) {
                    cube.move("M");
                }
                if (targetId === 0) {
                    cube.move("L");
                }
            });
            break;
        //绕x轴逆时针
        case 2.1:
        case 3.2:
        case 4.2:
        case 5.1:
            elements.forEach(element => {
                targetId = element.cubeIndex - minId;
                if (targetId === 2) {
                    cube.move("R");
                }
                if (targetId === 4) {
                    cube.move("M'");
                }
                if (targetId === 0) {
                    cube.move("L'");
                }
            });
            break;
        default:
            break;
    }
}
  
function initCord() {
    var xmat = new THREE.LineBasicMaterial({ color: 'red' });
    var xgeo = new THREE.Geometry();
    xgeo.vertices.push(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(300, 0, 0)
    );
    var xline = new THREE.Line(xgeo, xmat);
    scene.add(xline);
    var ymat = new THREE.LineBasicMaterial({ color: 'blue' });
    var ygeo = new THREE.Geometry();
    ygeo.vertices.push(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 300, 0)
    );
    var yline = new THREE.Line(ygeo, ymat);
    scene.add(yline);
    var zmat = new THREE.LineBasicMaterial({ color: 'green' });
    var zgeo = new THREE.Geometry();
    zgeo.vertices.push(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 300)
    );
    var zline = new THREE.Line(zgeo, zmat);
    scene.add(zline);
}
  
function initObj() {
    SimpleCube(cubeParams.x, cubeParams.y, cubeParams.z, cubeParams.num, cubeParams.len, cubeParams.colors);
    var ids = [];
    cubes.forEach(element => {
        initStatus.push({
            x: element.position.x,
            y: element.position.y,
            z: element.position.z,
            cubeIndex: element.id
        });
        element.cubeIndex = element.id;
        ids.push(element.id);
        scene.add(element);
    });
    minCubeIndex = min(ids).value;

    // 透明正方体
    var cubegeo = new THREE.BoxGeometry(150, 150, 150);
    var hex = 0x000000;
    for ( var i = 0; i < cubegeo.faces.length; i += 2 ) {
        cubegeo.faces[i].color.setHex(hex);
        cubegeo.faces[i + 1].color.setHex(hex);
    }
    var cubemat = new THREE.MeshBasicMaterial({ vertexColors: THREE.FaceColors, opacity: 0, transparent: true });
    var cube = new THREE.Mesh(cubegeo, cubemat);
    cube.cubeType = 'coverCube';
    scene.add(cube);

    // 地板
    // var geometry = new THREE.PlaneBufferGeometry(100, 100);
    // var planeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    // var ground = new THREE.Mesh(geometry, planeMaterial);
    // ground.position.set(0, -80, 0);
    // ground.rotation.x = - Math.PI / 2;
    // ground.scale.set(100, 100, 100);
    // ground.castShadow = false;
    // ground.receiveShadow = true;
    // scene.add(ground);
}
  
function render() {
    renderer.clear();
    renderer.render(scene, camera);
    window.requestAnimFrame(render);
}
  
//魔方操作结束
function stopCube() {
    intersect = null;
    startPoint = null;
}

//绕着世界坐标系的某个轴旋转
function rotateAroundWorldY(obj,rad) {
    var x0 = obj.position.x;
    var z0 = obj.position.z;
    var q = new THREE.Quaternion();
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rad);
    obj.quaternion.premultiply(q);
    obj.position.x = Math.cos(rad) * x0 + Math.sin(rad) * z0;
    obj.position.z = Math.cos(rad) * z0 - Math.sin(rad) * x0;
}
  
function rotateAroundWorldZ(obj,rad) {
    var x0 = obj.position.x;
    var y0 = obj.position.y;
    var q = new THREE.Quaternion(); 
    q.setFromAxisAngle(new THREE.Vector3(0, 0, 1), rad);
    // 下面这句话有问题
    obj.quaternion.premultiply(q);
    obj.position.x = Math.cos(rad) * x0 - Math.sin(rad) * y0;
    obj.position.y = Math.cos(rad) * y0 + Math.sin(rad) * x0;
}
  
function rotateAroundWorldX(obj,rad) {
    var y0 = obj.position.y;
    var z0 = obj.position.z;
    var q = new THREE.Quaternion(); 
    q.setFromAxisAngle(new THREE.Vector3(1, 0, 0), rad);
    obj.quaternion.premultiply(q);
    obj.position.y = Math.cos(rad) * y0 - Math.sin(rad) * z0;
    obj.position.z = Math.cos(rad) * z0 + Math.sin(rad) * y0;
}
  
//滑动操作魔方
function moveCube(event) {
    getIntersects(event);  // 在里面拿到了法向量
    if(intersect) {
      if(!isRotating && startPoint) {
        //魔方没有进行转动且满足进行转动的条件
          movePoint = intersect.point;
        if(!movePoint.equals(startPoint)) {
          //和起始点不一样则意味着可以得到转动向量了
            isRotating = true;  //转动标识置为true
            speed = oldSpeed;
            newSolution = true;
            var sub = movePoint.sub(startPoint);  //计算转动向量
            if (start) {
                start = false;
                stepCount = 0;
            }
            rotateMove(intersect, sub);
        }
      }
    }
    event.preventDefault();
}
  
function rotateAnimation(elements,direction,currentstamp,startstamp,laststamp,next) {
    var totalTime = speed;  //转动的总运动时间
    var isLastRotate = false;  //是否是某次转动最后一次动画
    if(startstamp === 0) {
        startstamp = currentstamp;
        laststamp = currentstamp;
    }
    if(currentstamp-startstamp >= totalTime) {
        currentstamp = startstamp + totalTime;
        isLastRotate = true;
    }
    var ids = [];
    cubes.forEach(cube => {
        ids.push(cube.cubeIndex);
    });
    var minId = min(ids).value;
    switch(direction) {
        //绕z轴顺时针
        case 0.1:
        case 1.2:
        case 2.4:
        case 3.3:
            elements.forEach(element => {
                rotateAroundWorldZ(element, -90 * Math.PI / 180 * (currentstamp - laststamp) / totalTime);
            });
            break;
        //绕z轴逆时针
        case 0.2:
        case 1.1:
        case 2.3:
        case 3.4:
            elements.forEach(element => {
                rotateAroundWorldZ(element, 90 * Math.PI / 180 * (currentstamp - laststamp) / totalTime);
            });
            break;
        //绕y轴顺时针
        case 0.4:
        case 1.3:
        case 4.3:
        case 5.4:
            elements.forEach(element => {
                rotateAroundWorldY(element, -90 * Math.PI / 180 * (currentstamp - laststamp) / totalTime);
            });
            break;
        //绕y轴逆时针
        case 1.4:
        case 0.3:
        case 4.4:
        case 5.3:
            elements.forEach(element => {
                rotateAroundWorldY(element, 90 * Math.PI / 180 * (currentstamp - laststamp) / totalTime);
            });
            break;
        //绕x轴顺时针
        case 2.2:
        case 3.1:
        case 4.1:
        case 5.2:
            elements.forEach(element => {
                rotateAroundWorldX(element, 90 * Math.PI / 180 * (currentstamp - laststamp) / totalTime);
            });
            break;
        //绕x轴逆时针
        case 2.1:
        case 3.2:
        case 4.2:
        case 5.1:
            elements.forEach(element => {
                rotateAroundWorldX(element, -90 * Math.PI / 180 * (currentstamp - laststamp) / totalTime);
            });
            break;
        default:
            break;
    }
    if(!isLastRotate) {
        window.requestAnimFrame(function (timestamp) {
            rotateAnimation(elements, direction, timestamp, startstamp, currentstamp, next);
        });
    }
    else {
        isRotating = false;
        startPoint = null;
        updateCubeIndex(elements);
        if (next)
            next();
    }
}

//更新位置索引
function updateCubeIndex(elements) {
    for(var i=0;i<elements.length;i++) {
        var temp1 = elements[i];
        for(var j=0;j<initStatus.length;j++) {
            var temp2 = initStatus[j];
            if( Math.abs(temp1.position.x - temp2.x) <= cubeParams.len/2 && 
                Math.abs(temp1.position.y - temp2.y) <= cubeParams.len/2 && 
                Math.abs(temp1.position.z - temp2.z) <= cubeParams.len/2 ) {
                temp1.cubeIndex = temp2.cubeIndex;
                break;
            }
        }
    }
}
  
//根据方向获得运动元素
function getBoxs(target,direction){
    var targetId = 0;
    if (target.object != null)
        targetId = target.object.cubeIndex;
    else
        targetId = target.cubeIndex;
    var ids = [];
    cubes.forEach(cube => {
        ids.push(cube.cubeIndex);
    });
    var minId = min(ids).value;
    targetId = targetId - minId;
    var numI = parseInt(targetId / 9);
    var numJ = targetId % 9;
    var boxs = [];
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
            cubes.forEach(cube => {
                var tempId = cube.cubeIndex - minId;
                if (numI === parseInt(tempId / 9)) {
                    boxs.push(cube);
                }
            });
            break;
        //绕y轴
        case 0.3:
        case 0.4:
        case 1.3:
        case 1.4:
        case 4.3:
        case 4.4:
        case 5.3:
        case 5.4:
            cubes.forEach(cube => {
                var tempId = cube.cubeIndex - minId;
                if (parseInt(numJ / 3) === parseInt(tempId % 9 / 3)) {
                    boxs.push(cube);
                }
            });
            break;
        //绕x轴
        case 2.1:
        case 2.2:
        case 3.1:
        case 3.2:
        case 4.1:
        case 4.2:
        case 5.1:
        case 5.2:
            cubes.forEach(cube => {
                var tempId = cube.cubeIndex - minId;
                if (tempId % 9 % 3 === numJ % 3) {
                    boxs.push(cube);
                }
            });
            break;
        default:
            break;
    }
    return boxs;
}
  
//获得旋转方向
function getDirection(vector3) {
    var direction;
    //判断差向量和x、y、z轴的夹角
    var xAngle = vector3.angleTo(XLine);
    var xAngleAd = vector3.angleTo(XLineAd);
    var yAngle = vector3.angleTo(YLine);
    var yAngleAd = vector3.angleTo(YLineAd);
    var zAngle = vector3.angleTo(ZLine);
    var zAngleAd = vector3.angleTo(ZLineAd);
    var minAngle = min([xAngle, xAngleAd, yAngle, yAngleAd, zAngle, zAngleAd]).value;  //最小夹角
    switch(minAngle){
        case xAngle:
            direction = 0;  //向x轴正方向旋转90度（还要区分是绕z轴还是绕y轴）
            if (normalize.equals(YLine)) {
                direction = direction + 0.1;  //绕z轴顺时针
            }
            else if (normalize.equals(YLineAd)) {
                direction = direction + 0.2;  //绕z轴逆时针
            }
            else if (normalize.equals(ZLine)) {
                direction = direction + 0.3;  //绕y轴逆时针
            }
            else {
                direction = direction + 0.4;  //绕y轴顺时针
            }
            break;
        case xAngleAd:
            direction = 1;  //向x轴反方向旋转90度
            if (normalize.equals(YLine)) {
                direction = direction + 0.1;  //绕z轴逆时针
            }
            else if (normalize.equals(YLineAd)) {
                direction = direction + 0.2;  //绕z轴顺时针
            }
            else if (normalize.equals(ZLine)) {
                direction = direction + 0.3;  //绕y轴顺时针
            }
            else {
                direction = direction + 0.4;  //绕y轴逆时针
            }
            break;
        case yAngle:
            direction = 2;  //向y轴正方向旋转90度
            if (normalize.equals(ZLine)) {
                direction = direction + 0.1;  //绕x轴逆时针
            }
            else if (normalize.equals(ZLineAd)) {
                direction = direction + 0.2;  //绕x轴顺时针
            }
            else if (normalize.equals(XLine)) {
                direction = direction + 0.3;  //绕z轴逆时针
            }
            else {
                direction = direction + 0.4;  //绕z轴顺时针
            }
            break;
        case yAngleAd:
            direction = 3;  //向y轴反方向旋转90度
            if (normalize.equals(ZLine)) {
                direction = direction + 0.1;  //绕x轴顺时针
            }
            else if (normalize.equals(ZLineAd)) {
                direction = direction + 0.2;  //绕x轴逆时针
            }
            else if (normalize.equals(XLine)) {
                direction = direction + 0.3;  //绕z轴顺时针
            }
            else {
                direction = direction + 0.4;  //绕z轴逆时针
            }
            break;
        case zAngle:
            direction = 4;  //向z轴正方向旋转90度
            if (normalize.equals(YLine)) {
                direction = direction + 0.1;  //绕x轴顺时针
            }
            else if (normalize.equals(YLineAd)) {
                direction = direction + 0.2;  //绕x轴逆时针
            }
            else if (normalize.equals(XLine)) {
                direction = direction + 0.3;  //绕y轴顺时针
            }
            else {
                direction = direction + 0.4;  //绕y轴逆时针
            }
            break;
        case zAngleAd:
            direction = 5;  //向z轴反方向旋转90度
            if (normalize.equals(YLine)) {
                direction = direction + 0.1;  //绕x轴逆时针
            }
            else if (normalize.equals(YLineAd)) {
                direction = direction + 0.2;  //绕x轴顺时针
            }
            else if (normalize.equals(XLine)) {
                direction = direction + 0.3;  //绕y轴逆时针
            }
            else {
                direction = direction + 0.4;  //绕y轴顺时针
            }
            break;
        default:
            break;
    }
    return direction;
}
  
function min(arr) {
    var min = arr[0];
    var no = 0;
    for(var i=1; i<arr.length; i++) {
      if(arr[i]<min) {
          min = arr[i];
          no = i;
      }
    }
    return { no: no, value: min };
}
  
//  开始操作魔方
function startCube(event) {
    getIntersects(event);
    //魔方没有处于转动过程中且存在碰撞物体
    if(!isRotating&&intersect) {
        startPoint = intersect.point;  //开始转动，设置起始点
        controller.enabled = false;  //当刚开始的接触点在魔方上时操作为转动魔方，屏蔽控制器转动
    }
    else {
        controller.enabled = true;  //当刚开始的接触点没有在魔方上或者在魔方上但是魔方正在转动时操作转动控制器
    }
}
  
//  获取操作焦点以及该焦点所在平面的法向量
function getIntersects(event) {
    //  触摸事件和鼠标事件获得坐标的方式有区别
    if (event.touches) {
        var offset = document.getElementsByTagName('canvas')[1].offsetTop
        var touch = event.touches[0];
        mouse.x = (touch.clientX / width) * 2 - 1;
        mouse.y = -((touch.clientY - offset - canvasOff) / height) * 2 + 1;
    }
    else {
        mouse.x = (event.offsetX / width) * 2 - 1;
        mouse.y = -(event.offsetY / height) * 2 + 1;
    }
    raycaster.setFromCamera(mouse, camera);
    //  Raycaster方式定位选取元素，可能会选取多个，以第一个为准
    var intersects = raycaster.intersectObjects(scene.children);
    if(intersects.length) {
      try {
        if(intersects[0].object.cubeType==='coverCube') {
            intersect = intersects[1];
            normalize = intersects[0].face.normal;
        }
        else {
            intersect = intersects[0];
            normalize = intersects[1].face.normal;
        }
      }
      catch(err) {
      }
    }
}
