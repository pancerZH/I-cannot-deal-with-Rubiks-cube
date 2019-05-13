<template>
    <div>
        <el-row v-for="(num1, index) in [0,1,2]" :key="index+999">
            <el-col v-for="(num2, index) in [1,2,3]" :key="index*200" :span="2">
                <div class="ytt-empty" />
            </el-col>
            <el-col v-for="num2 in [0,1,2]" :key="3 * num1 + num2 + 888" :span="2">
                <div class="ytt" @click="changeColor(3 * num1 + num2, $event)" />
            </el-col>
        </el-row>
        <el-row v-for="(num1, index) in [3,4,5]" :key="index*400">
            <el-col v-for="num2 in [0,1,2]" :key="3 * num1 + num2" :span="2">
                <div class="ytt" @click="changeColor(3 * num1 + num2, $event)" />
            </el-col>
            <el-col v-for="num2 in [0,1,2]" :key="3 * (num1+3) + num2" :span="2">
                <div class="ytt" @click="changeColor(3 * (num1+3) + num2, $event)" />
            </el-col>
            <el-col v-for="num2 in [0,1,2]" :key="3 * (num1+6) + num2" :span="2">
                <div class="ytt" @click="changeColor(3 * (num1+6) + num2, $event)" />
            </el-col>
            <el-col v-for="num2 in [0,1,2]" :key="3 * (num1+9) + num2" :span="2">
                <div class="ytt" @click="changeColor(3 * (num1+9) + num2, $event)" />
            </el-col>
        </el-row>
        <el-row v-for="(num1, index) in [3,4,5]" :key="index*600+122">
            <el-col v-for="(num2, index) in [1,2,3]" :key="index*900" :span="2">
                <div class="ytt-empty" />
            </el-col>
            <el-col v-for="num2 in [0,1,2]" :key="3 * (num1+12) + num2" :span="2">
                <div class="ytt" @click="changeColor(3 * (num1+12) + num2, $event)" />
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'scanner',
    data() {
        return  {
            positions: [],
            colors: ['rgba(252, 244, 252, 1)', 'rgba(252, 236, 71, 1)',
            'rgba(252, 138, 10, 1)', 'rgba(101, 157, 44, 1)',
            'rgba(236, 56, 35, 1)', 'rgba(56, 148, 173, 1)']
        }
    },

    mounted() {
        this.init()
    },

    methods: {
        init() {
            for(var i=0; i<54; i++) {
                var cube = {
                    'index': i,
                    'colorIndex': 0
                }
                this.positions.push(cube)
            }
        },

        changeColor(index, event) {
            var cube = this.positions[index]
            if(cube.colorIndex < this.colors.length)
                cube.colorIndex += 1
            else
                cube.colorIndex = 0
            event.currentTarget.style.backgroundColor = this.colors[cube.colorIndex]
        }
    }
}
</script>

<style scoped>
.ytt {
    border: 1px solid #000;
    padding-bottom: 100%;
    background-color: rgba(252, 244, 252, 1);
    height: 0;
}

.ytt-empty {
    padding-bottom: 100%;
    height: 0;
}
</style>
