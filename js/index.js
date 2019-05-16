window.onload = function() {
    var wrap = document.getElementsByClassName('wrap')[0],
        start = document.getElementById('start');
    var k=10; //背景移动距离

    //记录键盘状态值
    var stateLeft=false,stateTop=false,stateRight=false,stateBottom=false,stateShoot=false;

    var plane; //飞机对象
    var bullets=[]; //所有的子弹放在一个数组里
    var enemys=[]; //所有的敌机放在一个数组里

    var smallEnemy,middleEnemy,bigEnemy;//创建敌机

    var timerPlaneFly,timerBulletFly,timerSmallProduct,timerMiddleProduct,timerBigProduct,timerEnemyFly,timerCollisionBullet,timerCollisionPlane;


    var gradeDiv=document.createElement('div');
    var lb1=document.createElement('label');
    var lb2=document.createElement('label');
    lb1.innerText='分数：';
    gradeDiv.className='grade';

    // 开始游戏
    start.onclick = function() {
        startGame();
    }
    
    /*开始游戏的初始化*/
    function startGame() {
        wrap.appendChild(gradeDiv);
        gradeDiv.appendChild(lb1);
        gradeDiv.appendChild(lb2);


        wrap.style.backgroundImage = 'url(images/bg.png)';
        start.style.display = 'none';

        // 实例化飞机对象
        plane = new Plane('images/myplane.gif','','','',10);

        //飞机移动
        timerPlaneFly=setInterval(planeFly, 40); //飞机移动
        timerBulletFly=setInterval(bulletFly, 40); //子弹移动
        timerSmallProduct=setInterval(smallProduct,1000); //创建敌机对象
        timerMiddleProduct=setInterval(middleProduct,3000); //创建敌机对象
        timerBigProduct=setInterval(bigProduct,1000); //创建敌机对象
        timerEnemyFly=setInterval(enemyFly, 40); //敌机飞
        timerCollisionBullet=setInterval(collisonBullet,40); //判断子弹敌机是否碰撞
        timerCollisionPlane=setInterval(collsionPlane,40); //判断战机敌机是否碰撞
        setInterval(bgDown,40);
    }

    /*
      创建飞机
      @param {string} src 飞机图片地址
      @param {number} x 飞机x坐标
      @params {number} y 飞机y坐标
      @params {number} speed 飞机速度
      @params {number} blood 飞机血量
    */
    function Plane(src, x, y, speed, blood) {
        // 设置默认值
        src = src || 'images/myplane.gif';
        x = x || 127;
        y = y || 488;
        speed = speed || 5;
        blood = blood || 10;

        this.imgNode = document.createElement('img');
        this.src = src;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.blood = blood;

        this.shoot = function() {
            var x = parseInt(this.imgNode.style.left) + this.imgNode.offsetWidth / 2 ; //飞机距离左边的距离+飞机宽度的一半   -子弹本身宽度的一半
            var y = parseInt(this.imgNode.style.top); //飞机距离顶部的距离-子弹本身的高度
            // 生成子弹对象
            var bullet = new Bullet(x,y);
            bullets.push(bullet);

        };

        this.moveLeft = function() {
            if (parseInt(this.imgNode.style.left)>0){
                this.imgNode.style.left = parseInt(this.imgNode.style.left) - this.speed + 'px';
            }else {
                this.imgNode.style.left='0';
            }
        };
        this.moveRight = function() {
            if (parseInt(this.imgNode.style.left)<320-this.imgNode.offsetWidth){
                this.imgNode.style.left=parseInt(this.imgNode.style.left)+this.speed+'px';
            }else {
                this.imgNode.style.left=320-this.imgNode.offsetWidth;
            }
        };
        this.moveTop = function() {
            this.imgNode.style.top = parseInt(this.imgNode.style.top) - this.speed + 'px';
        };
        this.moveBottom = function() {
            this.imgNode.style.top = parseInt(this.imgNode.style.top) + this.speed + 'px';
        };

        /* 飞机的初始化 */
        this.init = function() {
            this.imgNode.style.position = 'absolute';
            this.imgNode.style.left = this.x + 'px';
            this.imgNode.style.top = this.y + "px";
            this.imgNode.src = this.src;

            wrap.appendChild(this.imgNode);
        }
        //初始化飞机位置
        this.init();
    }

    /*
      创建子弹
      @param {number} x 子弹x坐标
      @params {number} y 子弹y坐标
      @param {string} src 子弹图片地址
      @params {number} speed 子弹速度
    */

    function Bullet(x, y, src, speed){
        src=src||'images/bullet.png';
        x=x||127;
        y=y||488;
        speed=speed||7;

        this.imgNode=document.createElement('img')
        this.src=src;
        this.x=x;
        this.y=y;
        this.speed=speed;
        this.isDied=false;


        this.moveBullet=function () {
            this.imgNode.style.top=parseInt(this.imgNode.style.top)-this.speed+'px';
        }

        /* 子弹的初始化 */
        this.init = function() {
            this.imgNode.src = this.src;
            this.imgNode.style.position = 'absolute';
            wrap.appendChild(this.imgNode);

            this.imgNode.style.left = this.x - this.imgNode.offsetWidth/2 + 'px';
            this.imgNode.style.top = this.y -this.imgNode.offsetHeight+ "px";
        }
        //初始化飞机位置
        this.init();
    }

    document.onkeydown=function (e) {
        var e=e||window.event;
        var k=e.keyCode||e.charCode||e.which;
        if(k==37){
            stateLeft=true;
        }else if(k==38){
            stateTop=true;
        }else if(k==39){
            stateRight=true;
        }else if(k==40){
            stateBottom=true;
        }
        if (k==32){
            stateShoot=true;
        }
    }

    document.onkeyup=function (e) {
        var e=e||window.event;
        var k=e.keyCode||e.charCode||e.which;
        if (k==37){
            stateLeft=false;
        } else if(k==38){
            stateTop=false;
        }else if(k==39){
            stateRight=false;
        }else if(k==40){
            stateBottom=false;
        }
        if (k==32){
            stateShoot=false;
        }
    }

    /* 控制飞机移动 */
    function planeFly() {
        if (stateTop){
            plane.moveTop();
        } else if(stateRight){
            plane.moveRight();
        }else if(stateBottom){
            plane.moveBottom();
        }else if(stateLeft){
            plane.moveLeft();
        }
        if (stateShoot){
            plane.shoot();
        }
    }

    /* 控制子弹移动 */
    function bulletFly() {
        for (var i=0;i<bullets.length;i++) {
            //存活
            if (!bullets[i].isDied){
                if (parseInt(bullets[i].imgNode.style.top)>-10){
                    bullets[i].moveBullet(); //子弹移动
                }else {
                    wrap.removeChild(bullets[i].imgNode); //删除节点
                    bullets.splice(i,1); //删除数组中的数据
                }
            }else {
                wrap.removeChild(bullets[i].imgNode); //删除节点
                bullets.splice(i,1); //删除数组中的数据
            }
        }
    }

    /*
     创建敌机
     @param {number} x 敌机x坐标
     @params {number} y 敌机y坐标
     @param {string} src 敌机图片地址
     @params {number} speed 敌机速度
   */

    function Enemy(x,y,src,speed,blood) {
        var x1=Math.random()*(wrap.clientWidth-33); //还要减去自身的宽度
        var y1=Math.random()*11; //y轴坐标 0-10
        var speed1=Math.random()*10+1;
        x=x1||154;
        y=y1||5;
        src=src||'images/smallEnemy.png';
        speed=speed1||10;
        blood=blood;

        this.imgNode=document.createElement('img');
        this.src=src;
        this.x=x;
        this.y=y;
        this.speed=speed;
        this.isDied=false;
        this.diedTime=10;
        this.blood=blood;
        this.moveEnemy=function () {
            this.imgNode.style.top=parseInt(this.imgNode.style.top)+this.speed+'px';
        }

         this.init=function () {
            this.imgNode.src=this.src;
            this.imgNode.style.position='absolute';
             wrap.appendChild(this.imgNode);

            this.imgNode.style.left=this.x+'px';
            this.imgNode.style.top=this.y+'px';
        }
        this.init();
    }

    //不断生成敌机
    function smallProduct() {
        smallEnemy=new Enemy();
        enemys.push(smallEnemy);
    }
    //不断生成 中型 敌机
    function middleProduct() {
        var x1=Math.random()*(wrap.clientWidth-45);
        middleEnemy=new Enemy(x1,'','images/middleEnemy.png','5','14');
        enemys.push(middleEnemy);
    }
    //不断生成 大型 敌机
    function bigProduct() {
        var x1=Math.random()*(wrap.clientWidth-109);
        bigEnemy=new Enemy(x1,'','images/bigEnemy.png','1','8');
        enemys.push(bigEnemy);
    }

    /* 控制敌机移动 */
    function enemyFly() {
        for (var i=0;i<enemys.length;i++) {
            //存活
            if (!enemys[i].isDied){
                if (parseInt(enemys[i].imgNode.style.top)<wrap.clientHeight){
                    enemys[i].moveEnemy(); //子弹移动
                }else {  //敌机飞出去
                    enemys[i].diedTime--;   //死亡等待消失时间
                    if (enemys[i].diedTime<=0){
                        wrap.removeChild(enemys[i].imgNode); //删除节点
                        enemys.splice(i,1); //删除数组中的数据
                    }
                }
            } else {
                wrap.removeChild(enemys[i].imgNode); //删除节点
                enemys.splice(i,1); //删除数组中的数据
            }
        }
    }

    /* 判断子弹和敌机是否碰撞 */
    function collisonBullet() {
        for (var i=0;i<bullets.length;i++){
            for (var j=0;j<enemys.length;j++){
                var bt = parseInt(bullets[i].imgNode.style.top),
                    bl = parseInt(bullets[i].imgNode.style.left),
                    et = parseInt(enemys[j].imgNode.style.top),
                    el = parseInt(enemys[j].imgNode.style.left);
                    // console.log(enemys[j].imgNode.style.top); //有单位px
                
                if (bl>el-parseInt(bullets[i].imgNode.offsetWidth)&&bl<el+parseInt(enemys[j].imgNode.offsetWidth)&&bt>et-parseInt(bullets[i].imgNode.offsetHeight)&&bt<et+parseInt(enemys[j].imgNode.offsetHeight)) {
                    //子弹与敌机的碰撞
                    if (enemys[j].imgNode.src.indexOf('small')!=-1){
                        enemys[j].imgNode.src='images/smallenemyboom.gif';
                        enemys[j].isDied=true;
                        plane.blood++;
                    }else if (enemys[j].imgNode.src.indexOf('middle')!=-1){
                        enemys[j].blood-=2;
                        wrap.removeChild(bullets[i].imgNode);
                        bullets.splice(i,1);
                        enemys[j].imgNode.src='images/middleEnemyHit.png';
                        if (enemys[j].blood<=0){
                            enemys[j].imgNode.src='images/middleEnemyBoom.gif';
                            enemys[j].isDied=true;
                            plane.blood+=2;
                        }
                    }else if (enemys[j].imgNode.src.indexOf('big')!=-1){
                        enemys[j].blood-=2;
                        enemys[j].imgNode.src='images/bigEnemyHit.png';
                        if (enemys[j].blood<=0){
                            enemys[j].imgNode.src='images/bigEnemyBoom.gif';
                            enemys[j].isDied=true;
                            plane.blood+=4;
                        }
                    }
                }
            }
            lb2.innerHTML=plane.blood;
        }
    }

    /* 判断敌机和战机是否碰撞 */
    function collsionPlane() {
        for (var i=0;i<enemys.length;i++){
            // console.log('开始执行');
            var et=parseInt(enemys[i].imgNode.style.top),
                el=parseInt(enemys[i].imgNode.style.left),
                pl=parseInt(plane.imgNode.style.left),
                pt=parseInt(plane.imgNode.style.top);
            if (el>pl-parseInt(enemys[i].imgNode.offsetWidth)&&el<pl+parseInt(plane.imgNode.offsetWidth)&&et>pt-parseInt(enemys[i].imgNode.offsetHeight)&&et<pt+parseInt(plane.imgNode.offsetHeight)){
                // console.log('撞上了');
                enemys[i].imgNode.src='images/boom.png';
                // plane.blood--;
                if (enemys[i].imgNode.src.indexOf('small')!=-1){
                    plane.blood--;
                }else if (enemys[i].imgNode.src.indexOf('middle')!=-1){
                    plane.blood-=2;
                }else if (enemys[i].imgNode.src.indexOf('big')!=-1) {
                    enemys[i].blood -= 4;
                }
                enemys[i].isDied=true;
                if (plane.blood<=0){
                    clearInterval(timerPlaneFly);
                    clearInterval(timerBulletFly);
                    clearInterval(timerSmallProduct);
                    clearInterval(timerMiddleProduct);
                    clearInterval(timerBigProduct);
                    clearInterval(timerEnemyFly);
                    clearInterval(timerCollisionBullet);
                    clearInterval(timerCollisionPlane);
                    var shadow=document.createElement('div');
                    shadow.className='shadow';
                    console.log(22);
                    shadow.innerHTML='Game Over!!';
                    wrap.appendChild(shadow);
                }
            }else {
                // console.log('没撞上');
            }
            lb2.innerHTML=plane.blood;
        }
    }

    /* 背景下移 */
    function bgDown() {
        wrap.style.backgroundPositionY=k+'px';
        wrap.style.backgroundRepeat='repeat';
        k+=10
        if (parseInt(wrap.style.backgroundPositionY)>568){
            wrap.style.backgroundPositionY='0'+'px';
            k=10;
        }
    }

}