webpackJsonp([1],{"+BTi":function(e,n){},NHnr:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=t("//Fk"),a=t.n(o),r=t("Xxa5"),s=t.n(r),i=t("exGp"),c=t.n(i),u=t("h38G"),l=null,f=null,h=null,d=[],p=null,v=0,m=0,b=null,g=null,E=null,w=null,x={},R=!1,y=null,k=null,T=null,I=null,M=[],C=null,_=null,q=null,H=null,A=null,B=null,F=null,L=200,S=200,V=null,z=null,P={},N=[],U=!0,$=!1,D=!1,O=!1;function Q(e){b=new THREE.Vector3(0,0,0),C=new THREE.Vector3(1,0,0),_=new THREE.Vector3(-1,0,0),q=new THREE.Vector3(0,1,0),H=new THREE.Vector3(0,-1,0),A=new THREE.Vector3(0,0,1),B=new THREE.Vector3(0,0,-1),E=new THREE.Raycaster,w=new THREE.Vector2,V=t("KxHc"),z=new V,V.initSolver(),P={R:le,U:te,F:ae,B:he,L:se,D:ce,r:fe,u:oe,f:re,b:de,l:ie,d:ue},x={x:0,y:0,z:0,num:3,len:50,colors:["rgba(236, 56, 35, 1)","rgba(252, 236, 71, 1)","rgba(252, 138, 10, 1)","rgba(101, 157, 44, 1)","rgba(252, 244, 252, 1)","rgba(56, 148, 173, 1)"],sequences:["R","L","U","D","F","B"]},window.requestAnimFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame||window.webkitRequestAnimationFrame,e&&($=!0),function(){v=.95*window.innerWidth,m=$?.7*window.innerHeight:.8*window.innerHeight;(p=new THREE.WebGLRenderer({antialias:!0})).setSize(v,m),p.setClearColor(16777215,1),document.body.appendChild(p.domElement)}(),(l=new THREE.PerspectiveCamera(45,v/m,1,1e3)).position.set(200,200,600),l.up.set(0,1,0),l.lookAt(b),f=new THREE.Scene,h=new THREE.AmbientLight(4210752,5),f.add(h),function(){!function(e,n,t,o,a,r){for(var s=e-o/2*a,i=n+o/2*a,c=t+o/2*a,u=[],l=0;l<r.length;l++){var f=new THREE.Texture(j(r[l]));f.needsUpdate=!0;var h=new THREE.MeshLambertMaterial({map:f});u.push(h)}for(var l=0;l<o;l++)for(var p=0;p<o*o;p++){var v=new THREE.BoxGeometry(a,a,a,2,5),m=new THREE.Mesh(v,u);m.position.x=s+a/2+p%o*a,m.position.y=i-a/2-parseInt(p/o)*a,m.position.z=c-a/2-l*a,d.push(m)}}(x.x,x.y,x.z,x.num,x.len,x.colors);var e=[];d.forEach(function(n){M.push({x:n.position.x,y:n.position.y,z:n.position.z,cubeIndex:n.id}),n.cubeIndex=n.id,e.push(n.id),f.add(n)}),F=Re(e).value;for(var n=new THREE.BoxGeometry(150,150,150),t=0;t<n.faces.length;t+=2)n.faces[t].color.setHex(0),n.faces[t+1].color.setHex(0);var o=new THREE.MeshBasicMaterial({vertexColors:THREE.FaceColors,opacity:0,transparent:!0}),a=new THREE.Mesh(n,o);a.cubeType="coverCube",f.add(a)}(),me(),p.domElement.addEventListener("mousedown",ye,!1),p.domElement.addEventListener("mousemove",xe,!1),p.domElement.addEventListener("mouseup",be,!1),p.domElement.addEventListener("touchstart",ye,!1),p.domElement.addEventListener("touchmove",xe,!1),p.domElement.addEventListener("touchend",be,!1),(g=new u.OrbitControls(l,p.domElement)).target=new THREE.Vector3(0,0,0)}function j(e){var n=document.createElement("canvas");n.width=256,n.height=256;var t=n.getContext("2d");if(t){t.fillStyle="rgba(0,0,0,1)",t.fillRect(0,0,256,256);var o=16,a=16;t.beginPath(),t.moveTo(48,a),t.arcTo(240,a,240,240,32),t.arcTo(240,240,o,240,32),t.arcTo(o,240,o,a,32),t.arcTo(o,a,240,a,32),t.closePath(),t.lineWidth=16,t.imageSmoothingQuality="high",t.fillStyle=e,t.strokeStyle=e,t.stroke(),t.fill()}else alert("浏览器不支持Canvas无法预览.");return n}function G(e){console.log(e);var n=[],t=/^[a-zA-Z]{1}$/,o=/^[a-zA-Z]{1}[2]{1}$/,a=/^[a-zA-Z]{1}'$/;(e=e.split(" ")).forEach(function(e){if(a.test(e)){var r=e.substring(0,1);n.push(r.toLowerCase())}else if(o.test(e)){r=e.substring(0,1);n.push(r),n.push(r)}else t.test(e)?n.push(e):console.log("出错啦")});var r=[];0,n.forEach(function(e){var n=P[e];r.push(n),0});Z(r,0,0)}function W(e){if(D=!0,!R){S=L=e;var n=parseInt(20*Math.random());n<20&&(n=20);for(var t=[le,te,ae,he,se,ce,fe,oe,re,de,ie,ue],o=[],a=0;a<n;a++){var r=parseInt(Math.random()*t.length);o.push(t[r])}Z(o,0,0)}}function Z(e,n,t){n>=e.length-1?t?(e[n](t),D=!1,O=!1):(e[n](),D=!1,O=!1):e[n](function(){n<e.length-1&&Z(e,++n,t)})}var X,J,K=(X=c()(s.a.mark(function e(n){var t,o;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(O=!0,S=L=n,t=window.performance.now(),console.log("start autoReset"),console.log("start at:"+t),o=ee(),z.init(V.fromString(o)),!z.isSolved()){e.next=11;break}return O=!1,e.abrupt("return");case 11:return e.next=13,z.solve();case 13:G(e.sent);case 15:case"end":return e.stop()}},e,this)})),function(e){return X.apply(this,arguments)}),Y=(J=c()(s.a.mark(function e(n){var t,o,a,r,i,c;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(O=!0,S=L=n,!U){e.next=20;break}if(0,N=[],t=ee(),z.init(V.fromString(t)),!z.isSolved()){e.next=11;break}return O=!1,e.abrupt("return");case 11:return e.next=13,z.solve();case 13:o=(o=e.sent).split(" "),a=/^[a-zA-Z]{1}$/,r=/^[a-zA-Z]{1}[2]{1}$/,i=/^[a-zA-Z]{1}'$/,o.forEach(function(e){if(i.test(e)){var n=e.substring(0,1);N.push(n.toLowerCase())}else if(r.test(e)){n=e.substring(0,1);N.push(n),N.push(n)}else a.test(e)?N.push(e):console.log("出错啦")}),U=!1;case 20:(c=P[N.shift()])?c(0):U=!0,O=!1;case 23:case"end":return e.stop()}},e,this)})),function(e){return J.apply(this,arguments)});function ee(){var e=[];[18,19,20,9,10,11,0,1,2].forEach(function(n){var t=pe(n);e.push(ne(t,q))});[2,11,20,5,14,23,8,17,26].forEach(function(n){var t=pe(n);e.push(ne(t,C))});[0,1,2,3,4,5,6,7,8].forEach(function(n){var t=pe(n);e.push(ne(t,A))});[6,7,8,15,16,17,24,25,26].forEach(function(n){var t=pe(n);e.push(ne(t,H))});[18,9,0,21,12,3,24,15,6].forEach(function(n){var t=pe(n);e.push(ne(t,_))});[20,19,18,23,22,21,26,25,24].forEach(function(n){var t=pe(n);e.push(ne(t,B))});var n=ne(pe(10),q);x.sequences[n]="U";var t=ne(pe(4),A);x.sequences[t]="F";var o=ne(pe(14),C);x.sequences[o]="R";var a=ne(pe(12),_);x.sequences[a]="L";var r=ne(pe(16),H);x.sequences[r]="D";var s=ne(pe(22),B);x.sequences[s]="B";var i="";return e.forEach(function(e){i+=x.sequences[e]}),i}function ne(e,n){e.material;var t=e.geometry.faces,o=e.normalMatrix,a=new THREE.Matrix4;a.lookAt(l.position,b,l.up),a.getInverse(a);var r=n.clone();r.applyMatrix4(a);var s=[];return t.forEach(function(e){var n=e.normal.clone();n.applyMatrix3(o),s.push(n.angleTo(r))}),t[Re(s).no].materialIndex}function te(e){0;var n=pe(2);k=A,ve(n,_,e)}function oe(e){0;var n=pe(2);k=C,ve(n,B,e)}function ae(e){0;var n=pe(2);k=C,ve(n,H,e)}function re(e){0;var n=pe(2);k=q,ve(n,_,e)}function se(e){0;var n=pe(0);k=A,ve(n,H,e)}function ie(e){0;var n=pe(0);k=q,ve(n,B,e)}function ce(e){0;var n=pe(8);k=C,ve(n,B,e)}function ue(e){0;var n=pe(8);k=A,ve(n,_,e)}function le(e){0;var n=pe(2);k=q,ve(n,B,e)}function fe(e){0;var n=pe(2);k=A,ve(n,H,e)}function he(e){0;var n=pe(20);k=C,ve(n,q,e)}function de(e){0;var n=pe(20);k=C,ve(n,H,e)}function pe(e){var n;return d.forEach(function(t){t.cubeIndex==e+F&&(n=t)}),n}function ve(e,n,t){R=!0;var o=function(e){var n,t=e.angleTo(C),o=e.angleTo(_),a=e.angleTo(q),r=e.angleTo(H),s=e.angleTo(A),i=e.angleTo(B);switch(Re([t,o,a,r,s,i]).value){case t:n=0,k.equals(q)?n+=.1:k.equals(H)?n+=.2:k.equals(A)?n+=.3:n+=.4;break;case o:n=1,k.equals(q)?n+=.1:k.equals(H)?n+=.2:k.equals(A)?n+=.3:n+=.4;break;case a:n=2,k.equals(A)?n+=.1:k.equals(B)?n+=.2:k.equals(C)?n+=.3:n+=.4;break;case r:n=3,k.equals(A)?n+=.1:k.equals(B)?n+=.2:k.equals(C)?n+=.3:n+=.4;break;case s:n=4,k.equals(q)?n+=.1:k.equals(H)?n+=.2:k.equals(C)?n+=.3:n+=.4;break;case i:n=5,k.equals(q)?n+=.1:k.equals(H)?n+=.2:k.equals(C)?n+=.3:n+=.4}return n}(n),a=function(e,n){var t=0;t=null!=e.object?e.object.cubeIndex:e.cubeIndex;var o=[];d.forEach(function(e){o.push(e.cubeIndex)});var a=Re(o).value;t-=a;var r=parseInt(t/9),s=t%9,i=[];switch(n){case.1:case.2:case 1.1:case 1.2:case 2.3:case 2.4:case 3.3:case 3.4:d.forEach(function(e){var n=e.cubeIndex-a;r===parseInt(n/9)&&i.push(e)});break;case.3:case.4:case 1.3:case 1.4:case 4.3:case 4.4:case 5.3:case 5.4:d.forEach(function(e){var n=e.cubeIndex-a;parseInt(s/3)===parseInt(n%9/3)&&i.push(e)});break;case 2.1:case 2.2:case 3.1:case 3.2:case 4.1:case 4.2:case 5.1:case 5.2:d.forEach(function(e){var n=e.cubeIndex-a;n%9%3==s%3&&i.push(e)})}return i}(e,o);!function(e,n){var t=[];d.forEach(function(e){t.push(e.cubeIndex)});var o=Re(t).value,a=0;switch(e){case.1:case 1.2:case 2.4:case 3.3:n.forEach(function(e){var n=e.cubeIndex-o;2===n&&z.move("F"),10===n&&z.move("S"),20===n&&z.move("b")});break;case.2:case 1.1:case 2.3:case 3.4:n.forEach(function(e){2===(a=e.cubeIndex-o)&&z.move("F'"),10===a&&z.move("S'"),20===a&&z.move("B")});break;case.4:case 1.3:case 4.3:case 5.4:n.forEach(function(e){2===(a=e.cubeIndex-o)&&z.move("U"),5===a&&z.move("E"),8===a&&z.move("D")});break;case 1.4:case.3:case 4.4:case 5.3:n.forEach(function(e){2===(a=e.cubeIndex-o)&&z.move("U'"),5===a&&z.move("E'"),8===a&&z.move("D'")});break;case 2.2:case 3.1:case 4.1:case 5.2:n.forEach(function(e){2===(a=e.cubeIndex-o)&&z.move("R'"),4===a&&z.move("M"),0===a&&z.move("L")});break;case 2.1:case 3.2:case 4.2:case 5.1:n.forEach(function(e){2===(a=e.cubeIndex-o)&&z.move("R"),4===a&&z.move("M'"),0===a&&z.move("L'")})}}(o,a),window.requestAnimFrame(function(e){!function e(n,t,o,a,r,s){var i=L;var c=!1;0===a&&(a=o,r=o);o-a>=i&&(o=a+i,c=!0);var u=[];d.forEach(function(e){u.push(e.cubeIndex)});Re(u).value;switch(t){case.1:case 1.2:case 2.4:case 3.3:n.forEach(function(e){Ee(e,-90*Math.PI/180*(o-r)/i)});break;case.2:case 1.1:case 2.3:case 3.4:n.forEach(function(e){Ee(e,90*Math.PI/180*(o-r)/i)});break;case.4:case 1.3:case 4.3:case 5.4:n.forEach(function(e){ge(e,-90*Math.PI/180*(o-r)/i)});break;case 1.4:case.3:case 4.4:case 5.3:n.forEach(function(e){ge(e,90*Math.PI/180*(o-r)/i)});break;case 2.2:case 3.1:case 4.1:case 5.2:n.forEach(function(e){we(e,90*Math.PI/180*(o-r)/i)});break;case 2.1:case 3.2:case 4.2:case 5.1:n.forEach(function(e){we(e,-90*Math.PI/180*(o-r)/i)})}c?(R=!1,T=null,function(e){for(var n=0;n<e.length;n++)for(var t=e[n],o=0;o<M.length;o++){var a=M[o];if(Math.abs(t.position.x-a.x)<=x.len/2&&Math.abs(t.position.y-a.y)<=x.len/2&&Math.abs(t.position.z-a.z)<=x.len/2){t.cubeIndex=a.cubeIndex;break}}}(n),s&&s()):window.requestAnimFrame(function(r){e(n,t,r,a,o,s)})}(a,o,e,0,null,t)})}function me(){p.clear(),p.render(f,l),window.requestAnimFrame(me)}function be(){y=null,T=null}function ge(e,n){var t=e.position.x,o=e.position.z,a=new THREE.Quaternion;a.setFromAxisAngle(new THREE.Vector3(0,1,0),n),e.quaternion.premultiply(a),e.position.x=Math.cos(n)*t+Math.sin(n)*o,e.position.z=Math.cos(n)*o-Math.sin(n)*t}function Ee(e,n){var t=e.position.x,o=e.position.y,a=new THREE.Quaternion;a.setFromAxisAngle(new THREE.Vector3(0,0,1),n),e.quaternion.premultiply(a),e.position.x=Math.cos(n)*t-Math.sin(n)*o,e.position.y=Math.cos(n)*o+Math.sin(n)*t}function we(e,n){var t=e.position.y,o=e.position.z,a=new THREE.Quaternion;a.setFromAxisAngle(new THREE.Vector3(1,0,0),n),e.quaternion.premultiply(a),e.position.y=Math.cos(n)*t-Math.sin(n)*o,e.position.z=Math.cos(n)*o+Math.sin(n)*t}function xe(e){if(L=S,ke(e),y&&!R&&T&&!(I=y.point).equals(T)){R=!0,U=!0;var n=I.sub(T);ve(y,n)}e.preventDefault()}function Re(e){for(var n=e[0],t=0,o=1;o<e.length;o++)e[o]<n&&(n=e[o],t=o);return{no:t,value:n}}function ye(e){ke(e),!R&&y?(T=y.point,g.enabled=!1):g.enabled=!0}function ke(e){if(e.touches){var n=document.getElementsByTagName("canvas")[0].offsetTop,t=e.touches[0];w.x=t.clientX/v*2-1,w.y=-(t.clientY-n)/m*2+1}else w.x=e.offsetX/v*2-1,w.y=-e.offsetY/m*2+1;E.setFromCamera(w,l);var o=E.intersectObjects(f.children);if(o.length)try{"coverCube"===o[0].object.cubeType?(y=o[1],k=o[0].face.normal):(y=o[0],k=o[1].face.normal)}catch(e){}}t("oq7i"),t("+BTi");var Te=t("+TD8"),Ie=t.n(Te),Me={name:"scanner",data:function(){return{positions:[],colors:["rgba(252, 244, 252, 1)","rgba(252, 236, 71, 1)","rgba(252, 138, 10, 1)","rgba(101, 157, 44, 1)","rgba(236, 56, 35, 1)","rgba(56, 148, 173, 1)"],dialogVisible:!1,colorName:["white","yellow","orange","green","red","blue"],message:"",currentColor:-1,width:"50%"}},mounted:function(){this.init(),this._isMobile()&&(this.width="90%")},methods:{init:function(){for(var e=0;e<54;e++){var n={index:e,colorIndex:e<9?2:e>=9&&e<18?1:e>=18&&e<27?0:e>=27&&e<36?4:e>=36&&e<45?5:3};this.positions.push(n)}},showDialog:function(){var e=this;this.dialogVisible=!0,this.$nextTick(function(){document.getElementById("0").style.border="1px solid #000",e.currentColor=0})},changeColor:function(e,n){-1===this.currentColor&&Ie.a.alert("请先选择颜色！","错误提示",{confirmButtonText:"确定"});var t=this.positions[e];t.colorIndex=this.currentColor,n.currentTarget.style.backgroundColor=this.colors[t.colorIndex]},pickColor:function(e,n){document.getElementsByName("pick").forEach(function(e){e.style.border="1px dashed #000"}),n.currentTarget.style.border="1px solid #000",this.currentColor=e},checkColors:function(){var e=[0,0,0,0,0,0];this.positions.forEach(function(n){e[n.colorIndex]++});var n=!0;this.message="出现错误的颜色有：";for(var t=0;t<e.length;t++)9!=e[t]&&(this.message=this.message+this.colorName[t]+" ",n=!1);return n},submit:function(){if(this.checkColors()){for(var e="",n={2:"U",4:"R",0:"F",3:"D",1:"L",5:"B"},t=0;t<9;t++){e+=n[this.positions[t].colorIndex]}for(t=27;t<36;t++){e+=n[this.positions[t].colorIndex]}for(t=18;t<27;t++){e+=n[this.positions[t].colorIndex]}for(t=45;t<54;t++){e+=n[this.positions[t].colorIndex]}for(t=9;t<18;t++){e+=n[this.positions[t].colorIndex]}for(t=36;t<45;t++){e+=n[this.positions[t].colorIndex]}this.dialogVisible=!1,function(e){z=V.fromString(e);var n=V.inverse(z.solve());l=null,f=null,h=null,d=[],p=null,v=0,m=0,b=null,g=null,E=null,w=null,x={},R=!1,y=null,k=null,T=null,I=null,M=[],C=null,_=null,q=null,H=null,A=null,B=null,0,F=null,P={},N=[],U=!0;var t=document.getElementsByTagName("canvas")[0];t.parentNode.removeChild(t),Q(),L=50,G(n)}(e)}else Ie.a.alert("错误的魔方排列！"+this.message,"错误提示",{confirmButtonText:"确定"})},_isMobile:function(){return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)}}},Ce={render:function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{staticClass:"scanner"},[t("el-button",{attrs:{icon:"el-icon-s-grid",type:"info",circle:""},on:{click:e.showDialog}}),e._v(" "),t("el-dialog",{attrs:{title:"输入你的魔方排列",visible:e.dialogVisible,width:e.width},on:{"update:visible":function(n){e.dialogVisible=n}}},[e._l([0,1,2],function(n,o){return t("el-row",{key:o+999},[e._l([1,2,3],function(e,n){return t("el-col",{key:200*n+333+e,attrs:{span:2}},[t("div",{staticClass:"ytt-empty"})])}),e._v(" "),e._l([0,1,2],function(o){return t("el-col",{key:3*n+o+888,attrs:{span:2}},[t("div",{staticClass:"ytt-orange",on:{click:function(t){return e.changeColor(3*n+o,t)}}})])}),e._v(" "),e._l([1,2,3],function(e,n){return t("el-col",{key:300*n+333,attrs:{span:2}},[t("div",{staticClass:"ytt-empty"})])}),e._v(" "),e._l([0,1,2],function(o){return t("el-col",{key:3*n+o+668,attrs:{span:2}},[2!=n?t("div",{class:"ytt-"+e.colorName[o+3*n],style:"border: 1px dashed #000",attrs:{name:"pick",id:o+3*n},on:{click:function(t){return e.pickColor(o+3*n,t)}}}):e._e()])})],2)}),e._v(" "),e._l([3,4,5],function(n,o){return t("el-row",{key:400*o},[e._l([0,1,2],function(o){return t("el-col",{key:3*n+o,attrs:{span:2}},[t("div",{staticClass:"ytt-yellow",on:{click:function(t){return e.changeColor(3*n+o,t)}}})])}),e._v(" "),e._l([0,1,2],function(o){return t("el-col",{key:3*(n+3)+o,attrs:{span:2}},[t("div",{staticClass:"ytt-white",on:{click:function(t){e.changeColor(3*(n+3)+o,t)}}})])}),e._v(" "),e._l([0,1,2],function(o){return t("el-col",{key:3*(n+6)+o,attrs:{span:2}},[t("div",{staticClass:"ytt-red",on:{click:function(t){e.changeColor(3*(n+6)+o,t)}}})])}),e._v(" "),e._l([0,1,2],function(o){return t("el-col",{key:3*(n+9)+o,attrs:{span:2}},[t("div",{staticClass:"ytt-blue",on:{click:function(t){e.changeColor(3*(n+9)+o,t)}}})])})],2)}),e._v(" "),e._l([3,4,5],function(n,o){return t("el-row",{key:600*o+122},[e._l([1,2,3],function(e,n){return t("el-col",{key:900*n,attrs:{span:2}},[t("div",{staticClass:"ytt-empty"})])}),e._v(" "),e._l([0,1,2],function(o){return t("el-col",{key:3*(n+12)+o,attrs:{span:2}},[t("div",{staticClass:"ytt-green",on:{click:function(t){e.changeColor(3*(n+12)+o,t)}}})])})],2)}),e._v(" "),t("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[t("el-button",{on:{click:function(n){e.dialogVisible=!1}}},[e._v("取 消")]),e._v(" "),t("el-button",{attrs:{type:"primary"},on:{click:e.submit}},[e._v("确 定")])],1)],2)],1)},staticRenderFns:[]};var _e={name:"Rubik",components:{scanner:t("VU/8")(Me,Ce,!1,function(e){t("n45R")},"data-v-49cf9fc2",null).exports},data:function(){return{randomRotateLoading:!1,autoRestRunning:!1,speed:200,off:10,mobile:!1,height:""}},mounted:function(){this._isMobile()&&(this.off=13,this.mobile=!0,this.height="150px"),Q(this._isMobile())},methods:{randomRotate:function(){var e=c()(s.a.mark(function e(){return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:this.randomRotateLoading=!0,W(this.speed);case 2:if(!this.randomRotateLoading){e.next=8;break}return e.next=5,this.sleep(2*this.speed);case 5:this.randomRotateLoading=D,e.next=2;break;case 8:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}(),autoRest:function(){var e=c()(s.a.mark(function e(){return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:this.autoRestRunning=!0,K(this.speed);case 2:if(!this.autoRestRunning){e.next=8;break}return e.next=5,this.sleep(2*this.speed);case 5:this.autoRestRunning=O,e.next=2;break;case 8:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}(),autoRestOneStep:function(){var e=c()(s.a.mark(function e(){return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:this.autoRestRunning=!0,Y(this.speed);case 2:if(!this.autoRestRunning){e.next=8;break}return e.next=5,this.sleep(1.5*this.speed);case 5:this.autoRestRunning=O,e.next=2;break;case 8:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}(),sleep:function(e){return new a.a(function(n){return setTimeout(n,e)})},_isMobile:function(){return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)}},watch:{speed:function(){var e;e=this.speed,S=e}}},qe={render:function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",[t("el-col",{attrs:{span:5,offset:1}},[t("el-slider",{attrs:{min:100,max:500,step:100,vertical:e.mobile,height:e.height},model:{value:e.speed,callback:function(n){e.speed=n},expression:"speed"}})],1),e._v(" "),t("el-col",{attrs:{span:5,offset:e.off}},[t("scanner"),e._v(" "),t("el-button",{attrs:{type:"primary",icon:"el-icon-refresh",circle:"",loading:e.randomRotateLoading,disabled:e.randomRotateLoading||e.autoRestRunning},on:{click:e.randomRotate}}),e._v(" "),t("el-button",{attrs:{type:"success",icon:"el-icon-success",circle:"",loading:e.autoRestRunning,disabled:e.randomRotateLoading||e.autoRestRunning},on:{click:e.autoRest}}),e._v(" "),t("el-button",{attrs:{type:"success",icon:"el-icon-arrow-right",circle:"",disabled:e.randomRotateLoading||e.autoRestRunning},on:{click:e.autoRestOneStep}})],1)],1)},staticRenderFns:[]};var He={name:"App",components:{Rubik:t("VU/8")(_e,qe,!1,function(e){t("gX3n")},"data-v-4efe9e1c",null).exports}},Ae={render:function(){var e=this.$createElement,n=this._self._c||e;return n("div",{attrs:{id:"app"}},[n("Rubik")],1)},staticRenderFns:[]};var Be=t("VU/8")(He,Ae,!1,function(e){t("jqCE")},null,null).exports,Fe=t("lRwf"),Le=(t("l6IN"),t("NdbT"));t("KxHc");Fe.prototype.$three=Le,new Fe({el:"#app",components:{App:Be},template:"<App/>"})},NdbT:function(e,n){e.exports=THREE},gX3n:function(e,n){},jqCE:function(e,n){},l6IN:function(e,n){e.exports=ELEMENT},lRwf:function(e,n){e.exports=Vue},n45R:function(e,n){},oq7i:function(e,n){}},["NHnr"]);