var c = document.getElementById("c");
var ctx = c.getContext("2d");

// 全屏
c.height = window.innerHeight;
c.width = window.innerWidth;

var matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%";
// 将字符串转为array
matrix = matrix.split("");

var font_size = 10;
var columns = c.width / font_size; // column的个数
var drops = [];
// x是x坐标
for(var x = 0; x < columns; x++)
    drops[x] = 1; 

// 绘制函数
function draw()
{
    // 黑色背景
    // 将背景黑色设为透明以展示代码
    ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
    ctx.fillRect(0, 0, c.width, c.height);

    ctx.fillStyle = "#0F0"; // 绿色的文本
    ctx.font = font_size + "px arial";
    for( var i = 0; i < drops.length; i++ )
    {
        // 随机字符
        var text = matrix[ Math.floor( Math.random() * matrix.length ) ];
        // x = i*font_size, y = value of drops[i]*font_size
        ctx.fillText(text, i * font_size, drops[i] * font_size);

        // 字符沿y轴纵向分布
        if( drops[i] * font_size > c.height && Math.random() > 0.975 )
            drops[i] = 0;

        // 增加y坐标，使其下移
        drops[i]++;
    }
    if (window.innerWidth != c.width)
        onWindowResize();
}

function onWindowResize() {
    c.height = window.innerHeight;
    c.width = window.innerWidth;
    columns = c.width / font_size;
    drops = [];
    for(var x = 0; x < columns; x++)
        drops[x] = 1; 
}

export function initBackground() {
    window.addEventListener( 'resize', onWindowResize, false );
    setInterval( draw, 35 );
}