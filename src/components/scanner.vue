<template>
    <div class="scanner">
        <el-button icon="el-icon-s-grid" type="info" circle @click="showDialog"></el-button>
        <el-dialog
            title="输入你的魔方排列"
            :visible.sync="dialogVisible"
            :width="width">
            <el-row v-for="(num1, index) in [0,1,2]" :key="index+999">
                <el-col v-for="(num2, index) in [1,2,3]" :key="index*200+333+num2" :span="2">
                    <div class="ytt-empty" />
                </el-col>
                <el-col v-for="num2 in [0,1,2]" :key="3 * num1 + num2 + 888" :span="2">
                    <div class="ytt-orange" @click="changeColor(3 * num1 + num2, $event)"/>
                </el-col>
                <el-col v-for="(num2, index) in [1,2,3]" :key="index*300+333" :span="2">
                    <div class="ytt-empty" />
                </el-col>
                <el-col v-for="num2 in [0,1,2]" :key="3 * num1 + num2 + 668" :span="2">
                    <div :class="'ytt-'+colorName[num2+3*num1]" :style="'border: 1px dashed #000'" v-if="num1!=2" @click="pickColor(num2+3*num1, $event)" name='pick' :id='num2+3*num1' />
                </el-col>
            </el-row>
            <el-row v-for="(num1, index) in [3,4,5]" :key="index*400">
                <el-col v-for="num2 in [0,1,2]" :key="3 * num1 + num2" :span="2">
                    <div class="ytt-yellow" @click="changeColor(3 * num1 + num2, $event)" />
                </el-col>
                <el-col v-for="num2 in [0,1,2]" :key="3 * (num1+3) + num2" :span="2">
                    <div class="ytt-white" @click="changeColor(3 * (num1+3) + num2, $event)" />
                </el-col>
                <el-col v-for="num2 in [0,1,2]" :key="3 * (num1+6) + num2" :span="2">
                    <div class="ytt-red" @click="changeColor(3 * (num1+6) + num2, $event)" />
                </el-col>
                <el-col v-for="num2 in [0,1,2]" :key="3 * (num1+9) + num2" :span="2">
                    <div class="ytt-blue" @click="changeColor(3 * (num1+9) + num2, $event)" />
                </el-col>
            </el-row>
            <el-row v-for="(num1, index) in [3,4,5]" :key="index*600+122">
                <el-col v-for="(num2, index) in [1,2,3]" :key="index*900" :span="2">
                    <div class="ytt-empty" />
                </el-col>
                <el-col v-for="num2 in [0,1,2]" :key="3 * (num1+12) + num2" :span="2">
                    <div class="ytt-green" @click="changeColor(3 * (num1+12) + num2, $event)" />
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { MessageBox } from 'element-ui'
import { acceptCubeString } from '../utils/Rubik.js'
export default {
    name: 'scanner',
    data() {
        return  {
            positions: [],
            colors: ['rgba(252, 244, 252, 1)', 'rgba(252, 236, 71, 1)',
            'rgba(252, 138, 10, 1)', 'rgba(101, 157, 44, 1)',
            'rgba(236, 56, 35, 1)', 'rgba(56, 148, 173, 1)'],
            dialogVisible: false,
            colorName: ['white', 'yellow', 'orange', 'green', 'red', 'blue'],
            message: '',
            currentColor: -1,
            width: '50%'
        }
    },

    mounted() {
        this.init()
        if(this._isMobile())
            this.width = '90%'
    },

    methods: {
        init() {
            for(var i=0; i<54; i++) {
                var colorIndex
                if(i < 9)  // orange
                    colorIndex = 2
                else if(i >=9 && i < 18)  // yellow
                    colorIndex = 1
                else if(i >= 18 && i < 27)  // white
                    colorIndex = 0
                else if(i >= 27 && i < 36)  // red
                    colorIndex = 4
                else if(i >= 36 && i < 45)  // blue
                    colorIndex = 5
                else  // green
                    colorIndex = 3
                var cube = {
                    'index': i,
                    'colorIndex': colorIndex
                }
                this.positions.push(cube)
            }
        },

        showDialog() {
            this.dialogVisible = true
            this.$nextTick(() => {
                var div = document.getElementById("0")
                div.style.border = '1px solid #000'
                this.currentColor = 0
            })
        },

        changeColor(index, event) {
            if(this.currentColor === -1) {
                MessageBox.alert('请先选择颜色！', '错误提示', {
                    confirmButtonText: '确定',
                })
            }
            var cube = this.positions[index]
            cube.colorIndex = this.currentColor
            event.currentTarget.style.backgroundColor = this.colors[cube.colorIndex]
        },

        pickColor(index, event) {
            document.getElementsByName('pick').forEach(div => {
                div.style.border= '1px dashed #000'
            })
            event.currentTarget.style.border = '1px solid #000'
            this.currentColor = index
        },

        checkColors() {
            var c = [0, 0, 0, 0, 0, 0]
            this.positions.forEach(cube => {
                c[cube.colorIndex]++
            })
            var flag = true
            this.message = '出现错误的颜色有：'
            for(var i=0; i<c.length; i++) {
                if(c[i] != 9) {
                    this.message = this.message + this.colorName[i] + ' '
                    flag = false
                }
            }
            return flag
        },

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
        submit() {
            if(!this.checkColors()) {
                MessageBox.alert('错误的魔方排列！' + this.message, '错误提示', {
                    confirmButtonText: '确定',
                })
                return
            }
            else {
                var cubeString = ''
                var colorDict = {
                    2: 'U',
                    4: 'R',
                    0: 'F',
                    3: 'D',
                    1: 'L',
                    5: 'B'
                }
                for(var i=0; i<9; i++) {  // U
                    var index = this.positions[i].colorIndex
                    cubeString += colorDict[index]
                }
                for(var i=27; i<36; i++) {  // R
                    var index = this.positions[i].colorIndex
                    cubeString += colorDict[index]
                }
                for(var i=18; i<27; i++) {  // F
                    var index = this.positions[i].colorIndex
                    cubeString += colorDict[index]
                }
                for(var i=45; i<54; i++) {  // D
                    var index = this.positions[i].colorIndex
                    cubeString += colorDict[index]
                }
                for(var i=9; i<18; i++) {  // R
                    var index = this.positions[i].colorIndex
                    cubeString += colorDict[index]
                }
                for(var i=36; i<45; i++) {  // B
                    var index = this.positions[i].colorIndex
                    cubeString += colorDict[index]
                }
                this.dialogVisible = false
                acceptCubeString(cubeString) 
            }
        },

        _isMobile() {
        let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
        return flag
        }
    }
}
</script>

<style scoped>
.ytt-orange {
    border: 1px solid #000;
    padding-bottom: 100%;
    background-color: rgba(252, 138, 10, 1);
    height: 0;
}

.ytt-yellow {
    border: 1px solid #000;
    padding-bottom: 100%;
    background-color: rgba(252, 236, 71, 1);
    height: 0;
}

.ytt-white {
    border: 1px solid #000;
    padding-bottom: 100%;
    background-color: rgba(252, 244, 252, 1);
    height: 0;
}

.ytt-red {
    border: 1px solid #000;
    padding-bottom: 100%;
    background-color: rgba(236, 56, 35, 1);
    height: 0;
}

.ytt-blue {
    border: 1px solid #000;
    padding-bottom: 100%;
    background-color: rgba(56, 148, 173, 1);
    height: 0;
}

.ytt-green {
    border: 1px solid #000;
    padding-bottom: 100%;
    background-color: rgba(101, 157, 44, 1);
    height: 0;
}

.ytt-empty {
    padding-bottom: 100%;
    height: 0;
}

.scanner {
    display: inline
}
</style>
