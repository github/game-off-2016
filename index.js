(function (global) {

    // Class ------------------------------------------------
    function Pongout () {}    

    // Header -----------------------------------------------
    global.Pongout = Pongout;
    global.Pongout.init = init;


    // Val -----------------------------------------------

    var _requestAnimationFrame = window.requestAnimationFrame ||
　　　　　　　　　　　　　　　　　　　window.mozRequestAnimationFrame ||
                            　window.webkitRequestAnimationFrame ||
　　　　　　　　　　　　　　　　　　　window.msRequestAnimationFrame;
    //canv
    var ctx             =   null;
    var canv_board      =   null;
    var canv_pong      =   null;
    var canv_breakout   =   null;
    var canv_noise   =   null;
    var canv_line   =   null;
    var canv_message   =   null;
    var canv_logo   =   null;

    //CONST
    var LEN_LONG        =  500;
    var LEN_SHORT       =  310;
    var BALL_SIZE       =  (LEN_LONG/50|0);
    var COLOR_RED       =   "#FF0000";
    var COLOR_BLUE      =   "#00FF00";
    var COLOR_BLACK      =   "#222222";
    var COLOR_WHITE      =   "#FFFFFF";
    var img_bk=null;img_bk = new Image();img_bk.src = "assets/brown.png";
    var img_title=null;img_title = new Image();img_title.src = "assets/PONGOUT.png";


    //val
    mouse_x=0
    mouse_y=0
    enemy_y=0
    img_bk_loaded=false;
    img_title_loaded=false;
    logo_draw=false;
    standby=true;
    firstStandby=true;
    wait=true;
    cycle=1;
    seed=0

    //status
    status_pong={
        x:0,
        y:0,
        vec:[0,0],
    }
    //status
    status_breakout={
        x:0,
        y:0,
        vec:[0,0],
        block:[],
        falling:[],
    }
    status_score={
        pong_score:0,
        breakout_score:0,
        hegh_score:0,
        life:0,
        gameover:true,
    }
    
    // Func -----------------------------------------------

    function init(){

        if('ontouchstart' in window){
            $("#canv").bind('touchstart',ev_mouseMove)
            $("#canv").bind('touchmove',ev_mouseMove)
            $("#canv").bind('touchend',ev_mouseMove)
       }else{
            $("#canv").bind('mousemove',ev_mouseMove)
        }
        if('ontouchstart' in window){
            $("#canv").bind('touchstart',newGame)
            document.getElementById("canv").addEventListener("touchstart",newGame)
       }else{
            $("#canv").bind('mousedown',newGame)
        }


        //画像読み込み成功時
        img_bk.onload = function() {
            img_bk_loaded=true;
        }
        //画像読み込み成功時
        img_title.onload = function() {
            img_title_loaded=true;
        }

        initParam()
        pongLoop()
        breakoutLoop()
        drawLoop()

    }

    function initParam(){
        ctx =document.getElementById("canv").getContext("2d");
        LEN_LONG=LEN_LONG*ctx.canvas.width/500;
        LEN_SHORT=LEN_SHORT*ctx.canvas.width/500;
        status_score={
            pong_score:0,
            breakout_score:0,
            hegh_score:0,
            life:3,
            gameover:true,
        }
        initPong()
        initBreakout()
 
    }

    function initPong(){
        status_pong.x=(LEN_LONG/2|0);
        status_pong.y=(LEN_LONG/2)+(LEN_SHORT/2)*(0.5-Math.random())|0;
        status_pong.vec[0]=-2
        enemy_y=(LEN_LONG/2|0);
        cycle=1;
        if(Math.round()<0.5){
             status_pong.vec[1]=3.2
        }else{
             status_pong.vec[1]=-3.2
        }
    }
    function initBreakout(){
        status_breakout.y=(LEN_LONG/2|0);
        status_breakout.x=(LEN_LONG/2)+(LEN_SHORT/2)*(0.5-Math.random())|0;
        status_breakout.vec[1]=-2.4

        if(Math.round()<0.5){
             status_breakout.vec[0]=2.6 
        }else{
             status_breakout.vec[0]=-2.6
        }
        var x,y;
        status_breakout.falling=[]
        status_breakout.block=[]
        for(var _y=0;_y<=4;_y++){
            for(var _x=0;_x<=5;_x++){
                x=(LEN_LONG-LEN_SHORT)/2+BALL_SIZE/4+_x*BALL_SIZE*5+_x
                y=_y*BALL_SIZE+_y*BALL_SIZE*0.5+(BALL_SIZE*1.5)
                status_breakout.block.push({x:x,
                                            y:y,
                                            w: BALL_SIZE*5,   
                                            h: BALL_SIZE,   
                                        });
            }
        }   
    }

    function newGame(){
        if(standby==true){
            initParam()
            standby=false
            status_score.gameover=false
            firstStandby=false
            setTimeout(function(){
                    wait=false
                },500)
        }
    }

    /** 
     * マウス位置取得
     */
    function getMousePosition(e) {  
        if(!e.clientX){//SmartPhone
            if(e.touches){
                e = e.originalEvent.touches[0];            
            }else if(e.originalEvent.touches){
                e = e.originalEvent.touches[0];
            }else{
                e = event.touches[0];
            }
        }
        var rect = e.target.getBoundingClientRect();
        mouse_x = e.clientX - rect.left;  
        mouse_y = e.clientY - rect.top;  
    }  

    /** 
     * マウス移動時処理
     */
    function ev_mouseMove(e){
        getMousePosition(e);
        e.preventDefault();
    }



    function pongLoop(){
        return setInterval(pong,20);
    }

    function pong(){
        if(status_score.gameover==true){
            return
        }

        _top=(LEN_LONG-LEN_SHORT)/2|0
        _bottom=((LEN_LONG-LEN_SHORT)/2)+LEN_SHORT|0
        //field
        if(status_pong.x<0){
            status_pong.vec[0]=Math.abs(status_pong.vec[0])
            status_pong.x=LEN_LONG/2;
            status_score.pong_score+=1
            beep("win")
            cycle+=1
        }
        if(status_pong.x+BALL_SIZE>LEN_LONG){
            status_pong.vec[0]=-1*Math.abs(status_pong.vec[0])
            status_score.life-=1
            calcScore()
            beep("miss")
            cycle+=1
        }
        if(status_pong.y<_top){
            status_pong.vec[1]=Math.abs(status_pong.vec[1])
            beep("wall")

        }
        if(status_pong.y+BALL_SIZE>_bottom){
            status_pong.vec[1]=-1*Math.abs(status_pong.vec[1])
            beep("wall")
        }
        //player
        if(status_pong.x+BALL_SIZE>=LEN_LONG-1*(BALL_SIZE*2) && status_pong.x+BALL_SIZE<=LEN_LONG-1*(BALL_SIZE)){
            if(mouse_y-1*(BALL_SIZE*5/2)<=status_pong.y && mouse_y+1*(BALL_SIZE*5/2)>=status_pong.y ){
                status_pong.vec[0]=-1*Math.abs(status_pong.vec[0])
                beep("player")
            }
        }
        //enemy
        if(status_pong.x<=(BALL_SIZE*2) && status_pong.x>=1*(BALL_SIZE)){
            if(enemy_y-1*(BALL_SIZE*5/2)<=status_pong.y && enemy_y+1*(BALL_SIZE*5/2)>=status_pong.y ){
                status_pong.vec[0]=Math.abs(status_pong.vec[0])
                beep("enemy")
                cycle+=1
            }
        }


        //enemy move
        if(status_pong.x+BALL_SIZE+BALL_SIZE<=(LEN_LONG-LEN_SHORT)/2){
            var x=cycle%5==0?9:6;
            if(wait==true&&cycle>2){
                if(enemy_y<status_pong.y){
                    enemy_y=enemy_y-1*(enemy_y-status_breakout.y)/x
                }else{
                    enemy_y=enemy_y-1*(enemy_y-status_breakout.y)/x
                }
            }else{
                if(enemy_y<status_pong.y){
                    enemy_y=enemy_y-1*(enemy_y-status_pong.y)/x
                }else{
                    enemy_y=enemy_y-1*(enemy_y-status_pong.y)/x
                }
            }

        }else{
            var x=20;
            if(wait==true&&cycle>3){
                if(enemy_y<status_pong.y){
                    enemy_y=enemy_y-1*(enemy_y-status_breakout.y)/x
                }else{
                    enemy_y=enemy_y-1*(enemy_y-status_breakout.y)/x
                } 
            }else{
                if(enemy_y<status_pong.y){
                    enemy_y=enemy_y-1*(enemy_y-status_pong.y)/x
                }else{
                    enemy_y=enemy_y-1*(enemy_y-status_pong.y)/x
                } 
            }

        }


        //ball move
        status_pong.x=status_pong.x+status_pong.vec[0]
        status_pong.y=status_pong.y+status_pong.vec[1]
        //ボール斥力
        dist=Math.sqrt(Math.pow(status_pong.x-status_breakout.x,2)+Math.pow(status_pong.y-status_breakout.y,2))
        gra=60/dist
        if(status_pong.x-status_breakout.x<0){
            status_pong.x=status_pong.x-gra/2
        }
        if(status_pong.x-status_breakout.x>0){
            status_pong.x=status_pong.x+gra/2
        }
        if(status_pong.y-status_breakout.y<0){
            status_pong.y=status_pong.y-gra
        }
        if(status_pong.y-status_breakout.y>0){
            status_pong.y=status_pong.y+gra
        }
        if(status_pong.x<(LEN_LONG/2) && status_pong.vec[0]>0 ){
            status_pong.x=status_pong.x+Math.abs(LEN_LONG/2-status_pong.x)/20
        }else if(status_pong.x>(LEN_LONG/2) && status_pong.vec[0]<0 ){
            status_pong.x=status_pong.x-Math.abs(LEN_LONG/2-status_pong.x)/20
        }

        //もや音
        if(dist<60&&wait==false){
            wait=true;
            beep("moya");
            setTimeout(function(){
                wait=false
            },1000)
        }

    }

    function breakoutLoop(){
        return setInterval(breakout,20);
    }

    function breakout(){
        if(status_score.gameover==true){
            return
        }
        _top=(LEN_LONG-LEN_SHORT)/2|0
        _bottom=((LEN_LONG-LEN_SHORT)/2)+LEN_SHORT|0
        //field
        if(status_breakout.y<0){
            status_breakout.vec[1]=Math.abs(status_breakout.vec[1])
            beep("wall")
        }
        if(status_breakout.y+BALL_SIZE>LEN_LONG){
            status_breakout.vec[1]=-1*Math.abs(status_breakout.vec[1])
            status_score.life-=1
            calcScore()
            beep("miss")
        }
        if(status_breakout.x<_top){
            status_breakout.vec[0]=Math.abs(status_breakout.vec[0])
            beep("wall")
        }
        if(status_breakout.x+BALL_SIZE>_bottom){
            status_breakout.vec[0]=-1*Math.abs(status_breakout.vec[0])
            beep("wall")
        }
        //player
        if(status_breakout.y+BALL_SIZE>=LEN_LONG-1*(BALL_SIZE*2) && status_breakout.y+BALL_SIZE<=LEN_LONG-1*(BALL_SIZE)){
            if(mouse_x-1*(BALL_SIZE*5/2)<=status_breakout.x+BALL_SIZE && mouse_x+1*(BALL_SIZE*5/2)>=status_breakout.x ){
                var vxx=0;
                var vx=0;
                var vy=0
                if(mouse_x<status_breakout.x){
                    vxx=1
                }else{
                    vxx=-1
                }
                if(Math.abs( (mouse_x)-(status_breakout.x+BALL_SIZE/2))<BALL_SIZE){
                    vx=1.2*vxx
                    vy=-3.2
                }else{
                    vx=2.6*vxx
                    vy=-2.4
                }
                status_breakout.vec[0]=vx
                status_breakout.vec[1]=vy
                beep("player")
            }
        }


        //falling
        for(var i=status_breakout.falling.length-1;i>=0;i--){
            status_breakout.falling[i].y+=6;
            if(LEN_SHORT+(LEN_LONG-LEN_SHORT)/2<status_breakout.falling[i].y){
                status_breakout.falling[i].y+=10;
            }
            if(collision_falling(i)){
                beep("falling")
            }
        }
        //block
        for(var i=status_breakout.block.length-1;i>=0;i--){
            if(collision_block(i)){
                status_score.breakout_score+=1
                calcScore()
                beep("clash")
                break;
            }
        }



        //ball move 
        status_breakout.x=status_breakout.x+status_breakout.vec[0]
        status_breakout.y=status_breakout.y+status_breakout.vec[1]
        //ボール斥力
        dist=Math.sqrt(Math.pow(status_pong.x-status_breakout.x,2)+Math.pow(status_pong.y-status_breakout.y,2))
        gra=60/dist
        if(status_breakout.x-status_pong.x<0){
            status_breakout.x=status_breakout.x-gra
        }
        if(status_breakout.x-status_pong.x>0){
            status_breakout.x=status_breakout.x+gra
        }
        if(status_breakout.y-status_pong.y<0){
            status_breakout.y=status_breakout.y-gra/2
        }
        if(status_breakout.y-status_pong.y>0){
            status_breakout.y=status_breakout.y+gra/2
        }

        if(status_breakout.y>(LEN_LONG/4) && status_breakout.vec[1]<0 ){
            status_breakout.y=status_breakout.y-Math.abs(LEN_LONG/4-status_breakout.y)/25
        }


    }
    function collision_block(idx){
        var x=status_breakout.x
        var y=status_breakout.y
        var block=status_breakout.block[idx]
        if(block.y<=y&&block.y+block.h>=y){
            if(block.x<=x+BALL_SIZE*2&&block.x+block.w>=x ){
                status_breakout.vec[1]=-1*status_breakout.vec[1]
                status_breakout.falling=status_breakout.falling.concat(status_breakout.block[idx])
                if(block.x<=x+BALL_SIZE*2){
                    status_breakout.vec[0]=-1*Math.abs(status_breakout.vec[0])
                    status_breakout.block.splice(idx,1)
                    return true
                }
                if(block.x+block.w>=x){
                    status_breakout.vec[0]=1*Math.abs(status_breakout.vec[0])
                    status_breakout.block.splice(idx,1)
                    return true
                }
            }
        }
        return false
    }
    function collision_falling(idx){
        var x=status_pong.x
        var y=status_pong.y
        var block=status_breakout.falling[idx]
        if(block.y-2<=y&&block.y+block.h+2>=y){
            if(block.x<=x+BALL_SIZE*2&&block.x+block.w>=x ){
                status_pong.vec[0]=-1*status_pong.vec[0]
                status_pong.vec[1]=-1*status_pong.vec[1]
                status_breakout.falling.splice(idx,1)
                wait=true
                setTimeout(function(){
                    wait=false
                },500)

                return true;
            }
            if(block.y>LEN_LONG){
                status_breakout.falling.splice(idx,1)
            }
        }
        return false
    }

    function beep(id){
        document.getElementById(id).play();
    }


    function drawLoop(){
        draw()
        seed+=1
        _requestAnimationFrame(drawLoop);
    }



    function draw(){
        ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.width);
        ctx.fillStyle = COLOR_BLACK;
        ctx.globalAlpha = 1;
        ctx.fillRect(0,0,LEN_LONG,LEN_LONG);
        ctx.fill();



        ctx.drawImage(drawBoard(), 0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(drawPong(), 0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(drawBreakout(), 0, 0, ctx.canvas.width, ctx.canvas.height);
        
        ctx.drawImage(noise(), 0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(drawLine(), 0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.drawImage(drawMessage(), 0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(drawLogo(), 0, 0, ctx.canvas.width, ctx.canvas.height);


        

    }

    function drawBoard(){
        if(!canv_board){
            canv_board =document.createElement("canvas");
        }else{
            return canv_board;
        }
        var ctx_board=canv_board.getContext('2d');
        canv_board.width=ctx.canvas.width;
        canv_board.height=ctx.canvas.height;
        ctx_board.clearRect(0,0,ctx.canvas.width,ctx.canvas.width);
        var x,y,w,h;
        //Pong fill
        x=0;
        y=((LEN_LONG-LEN_SHORT)/2|0);
        w=LEN_LONG;
        h=LEN_SHORT;
        ctx_board.fillStyle = COLOR_RED;
        ctx_board.globalAlpha = 0.3;
        ctx_board.fillRect(x,y,w,h);
        ctx.fill();

        //Breakout fill
        x=((LEN_LONG-LEN_SHORT)/2|0);
        y=0;
        w=LEN_SHORT;
        h=LEN_LONG;
        ctx_board.fillStyle = COLOR_BLUE;
        ctx_board.globalAlpha = 0.3;
        ctx_board.fillRect(x,y,w,h);
        ctx.fill();

        //Breakout stroke
        x=((LEN_LONG-LEN_SHORT)/2|0);
        y=0;
        w=LEN_SHORT;
        h=LEN_LONG;
        ctx_board.strokeStyle  = COLOR_BLUE;
        ctx_board.lineWidth =1;
        ctx_board.globalAlpha = 0.6;
        ctx_board.beginPath();
        ctx_board.strokeRect(x,y,w,h);
        ctx_board.stroke();

        //Pong stroke
        x=0;
        y=((LEN_LONG-LEN_SHORT)/2|0);
        w=LEN_LONG;
        h=LEN_SHORT;
        ctx_board.strokeStyle  = COLOR_RED;
        ctx_board.lineWidth =1;
        ctx_board.globalAlpha = 0.6;
        ctx_board.beginPath();
        ctx_board.strokeRect(x,y,w,h);
        ctx_board.stroke();

        return canv_board;
    }
    function drawPong(){
        if(!canv_pong){
            canv_pong =document.createElement("canvas");
        }
        var ctx_pong=canv_pong.getContext('2d');
        canv_pong.width=ctx.canvas.width;
        canv_pong.height=ctx.canvas.height;
        ctx_pong.clearRect(0,0,ctx.canvas.width,ctx.canvas.width);
        // ctx_pong.shadowBlur = 20;
        // ctx_pong.shadowColor = "rgba(0, 0, 0, 0.2)";
        // ctx_pong.shadowOffsetX = 2;
        // ctx_pong.shadowOffsetY = 2;

        if(!firstStandby){
            //ball fill
            ctx_pong.fillStyle = COLOR_WHITE;
            ctx_pong.globalAlpha = 1;
            ctx_pong.fillRect(status_pong.x,status_pong.y,BALL_SIZE,BALL_SIZE);
            ctx_pong.fill();
            //ball stroke
            ctx_pong.strokeStyle  = COLOR_RED;
            ctx_pong.lineWidth =1;
            ctx_pong.globalAlpha = 1;
            ctx_pong.beginPath();
            ctx_pong.strokeRect(status_pong.x,status_pong.y,BALL_SIZE,BALL_SIZE);
            ctx_pong.stroke();
        }


        //bar fill
        h=BALL_SIZE*5
        w=BALL_SIZE
        x=LEN_LONG-(BALL_SIZE*2)
        y=mouse_y-(h/2)
        ctx_pong.fillStyle = COLOR_WHITE;
        ctx_pong.globalAlpha = 1;
        ctx_pong.fillRect(x,y,w,h);
        ctx_pong.fill();
        
        //bar stroke
        ctx_pong.strokeStyle  = COLOR_RED;
        ctx_pong.lineWidth =1;
        ctx_pong.globalAlpha = 1;
        ctx_pong.beginPath();
        ctx_pong.strokeRect(x,y,w,h);
        ctx_pong.stroke();
        if(!firstStandby){
            //enemy fill
            h=BALL_SIZE*5
            w=BALL_SIZE
            x=BALL_SIZE
            y=enemy_y-(h/2)
            ctx_pong.fillStyle = COLOR_WHITE;
            ctx_pong.globalAlpha = 1;
            ctx_pong.fillRect(x,y,w,h);
            ctx_pong.fill();
            //enemy stroke
            ctx_pong.strokeStyle  = COLOR_RED;
            ctx_pong.lineWidth =1;
            ctx_pong.globalAlpha = 1;
            ctx_pong.beginPath();
            ctx_pong.strokeRect(x,y,w,h);
            ctx_pong.stroke();
        }


        return canv_pong;
    }

    function drawBreakout(){
        if(!canv_breakout){
            canv_breakout =document.createElement("canvas");
        }
        var ctx_breakout=canv_breakout.getContext('2d');
        canv_breakout.width=ctx.canvas.width;
        canv_breakout.height=ctx.canvas.height;
        ctx_breakout.clearRect(0,0,ctx.canvas.width,ctx.canvas.width);
        ctx_breakout.clearRect(0,0,ctx.canvas.width,ctx.canvas.width);
        // ctx_breakout.shadowBlur = 20;
        // ctx_breakout.shadowColor = "rgba(0, 0, 0, 0.2)";
        // ctx_breakout.shadowOffsetX = 2;
        // ctx_breakout.shadowOffsetY = 2;
        if(!firstStandby){
            //ball fill
            ctx_breakout.fillStyle = COLOR_WHITE;
            ctx_breakout.globalAlpha = 1;
            ctx_breakout.fillRect(status_breakout.x,status_breakout.y,BALL_SIZE,BALL_SIZE);
            ctx_breakout.fill();
            //ball stroke
            ctx_breakout.strokeStyle  = COLOR_BLUE;
            ctx_breakout.lineWidth =1;
            ctx_breakout.globalAlpha = 1;
            ctx_breakout.beginPath();
            ctx_breakout.strokeRect(status_breakout.x,status_breakout.y,BALL_SIZE,BALL_SIZE);
            ctx_breakout.stroke();
        }
        //bar fill
        w=BALL_SIZE*5
        h=BALL_SIZE
        y=LEN_LONG-(BALL_SIZE*2)
        x=mouse_x-(w/2)
        ctx_breakout.fillStyle = COLOR_WHITE;
        ctx_breakout.globalAlpha = 1;
        ctx_breakout.fillRect(x,y,w,h);
        ctx_breakout.fill();
        //bar stroke
        ctx_breakout.strokeStyle  = COLOR_BLUE;
        ctx_breakout.lineWidth =1;
        ctx_breakout.globalAlpha = 1;
        ctx_breakout.beginPath();
        ctx_breakout.strokeRect(x,y,w,h);
        ctx_breakout.stroke();

        //block
        for(var i =0;i<status_breakout.block.length;i++){
            x=status_breakout.block[i].x;
            y=status_breakout.block[i].y;
            w=status_breakout.block[i].w;
            h=status_breakout.block[i].h;
            ctx_breakout.fillStyle = COLOR_WHITE;
            ctx_breakout.globalAlpha = 0.6;
            ctx_breakout.fillRect(x,y,w,h);
            ctx_breakout.fill();
            ctx_breakout.strokeStyle  = COLOR_BLUE;
            ctx_breakout.lineWidth =1;
            ctx_breakout.globalAlpha = 0.6;
            ctx_breakout.beginPath();
            ctx_breakout.strokeRect(x,y,w,h);
            ctx_breakout.stroke();
        }
        //falling
        for(var i =0;i<status_breakout.falling.length;i++){
            x=status_breakout.falling[i].x;
            y=status_breakout.falling[i].y;
            w=status_breakout.falling[i].w;
            h=status_breakout.falling[i].h;
            ctx_breakout.fillStyle = COLOR_WHITE;
            ctx_breakout.globalAlpha = 0.6;
            ctx_breakout.strokeStyle  = COLOR_BLUE;
            ctx_breakout.lineWidth =1;
            ctx_breakout.globalAlpha = 0.6;
            ctx_breakout.beginPath();
            ctx_breakout.strokeRect(x,y,w,h);
            ctx_breakout.stroke();
        }



        return canv_breakout;
    }

    function drawLine(){
       if(!canv_line){
            canv_line =document.createElement("canvas");
        }
        var ctx_line=canv_line.getContext('2d');
        canv_line.width=ctx.canvas.width;
        canv_line.height=ctx.canvas.height;

        ctx_line.globalAlpha = 0.3;
        ctx_line.strokeStyle  = COLOR_WHITE;
        ctx_line.beginPath();
        ctx_line.setLineDash([3,3])
        ctx_line.moveTo(mouse_x,mouse_y);
        ctx_line.lineTo(LEN_LONG-BALL_SIZE*2,mouse_y);
        ctx_line.stroke();
        
        ctx_line.globalAlpha = 0.3;
        ctx_line.strokeStyle  = COLOR_WHITE;
        ctx_line.beginPath();
        ctx_line.setLineDash([3,3])
        ctx_line.moveTo(mouse_x,mouse_y);
        ctx_line.lineTo(mouse_x,LEN_LONG-BALL_SIZE*2);
        ctx_line.stroke();

        return canv_line
    }

    function noise() {
       if(!canv_noise){
            canv_noise =document.createElement("canvas");
        }
        var ctx_noise=canv_noise.getContext('2d');
        ctx_noise.clearRect(0,0,ctx.canvas.width,ctx.canvas.width);
        canv_noise.width=ctx.canvas.width;
        canv_noise.height=ctx.canvas.height;
        if(standby){
            w = ctx_noise.canvas.width
            h = ctx_noise.canvas.height
            rgb = {
                r: 230,
                g: 192,
                b: 184
            },
            idata = ctx_noise.createImageData(w, h)
            data  = idata.data
            dotAlpha = 100

            for(var i = 0, l = data.length; i < l; i += 4) {
                data[i + 0] = rgb.r;
                data[i + 1] = rgb.g;
                data[i + 2] = rgb.b;
                data[i + 3] = (Math.random()) * dotAlpha | 0;
            }
            ctx_noise.putImageData(idata, 0, 0);
        }


        if(img_bk_loaded){
            ctx_noise.globalAlpha = 0.5;
            ctx_noise.drawImage(img_bk,0,0, ctx.canvas.width, ctx.canvas.height,0,0,500,500);
        }


        return canv_noise;
  }
  function drawMessage(){
        if(!canv_message){
            canv_message =document.createElement("canvas");
        }
        var ctx_message=canv_message.getContext('2d');
        ctx_message.clearRect(0,0,ctx.canvas.width,ctx.canvas.width);
        canv_message.width=ctx.canvas.width;
        canv_message.height=ctx.canvas.height;
        //文字
        var fontsize=Math.round(BALL_SIZE*2);
        var message="";
        
        ctx_message.font = "bold "+fontsize+"px sans-serif";
        ctx_message.globalAlpha = 0.1;
        ctx_message.fillStyle = COLOR_WHITE;
        ctx_message.textBaseline ="middle";
        ctx_message.textAlign="left";

        ctx_message.beginPath();
        message="♥  "+( '000' +status_score.life).slice( -3 );
        ctx_message.fillText(message, LEN_LONG/4.5, LEN_LONG/1.5+BALL_SIZE*4*0);

        message=('0000'+status_score.breakout_score).slice( -4 )
        +" x "+('0000'+status_score.pong_score).slice( -4)
            +" = "
            +('00000000'+(status_score.breakout_score*status_score.pong_score)).slice( -8 )
        ctx_message.fillText(message, LEN_LONG/4.5, LEN_LONG/1.5+BALL_SIZE*4*1);

        ctx_message.font = "bold "+fontsize/2+"px sans-serif";
        message="LIFE";
        ctx_message.fillText(message, LEN_LONG/4.5, LEN_LONG/1.5+BALL_SIZE*4*0-BALL_SIZE*2);

        ctx_message.font = "bold "+fontsize/2+"px sans-serif";
        message="BREAKOUT       PONG               SCORE";
        ctx_message.fillText(message, LEN_LONG/4.5, LEN_LONG/1.5+BALL_SIZE*4*1-BALL_SIZE*2);

        if(standby){
            ctx_message.font = "bold "+fontsize+"px sans-serif";
            ctx_message.globalAlpha = 0.5;
            ctx_message.textAlign="center";
            message="PUSH START"
            ctx_message.fillText(message, LEN_LONG/2, LEN_LONG/1.7+BALL_SIZE*4*0);
        }


        return canv_message;
  }
  function drawLogo(){
        if(!canv_logo){
            canv_logo =document.createElement("canvas");
        }else if(logo_draw==true){
            return canv_logo
        }
        var ctx_logo=canv_logo.getContext('2d');
        ctx_logo.clearRect(0,0,ctx.canvas.width,ctx.canvas.width);
        canv_logo.width=ctx.canvas.width;
        canv_logo.height=ctx.canvas.height;
        //文字
        var fontsize=Math.round(BALL_SIZE*2);
        var message="";
        
        ctx_logo.font = "bold "+fontsize+"px sans-serif";
        ctx_logo.globalAlpha = 0.1;
        ctx_logo.fillStyle = COLOR_WHITE;
        ctx_logo.textBaseline ="middle";
        ctx_logo.textAlign="left";

        ctx_logo.font = "bold "+fontsize/1.2+"px sans-serif";
        message="@kurehajime";
        ctx_logo.fillText(message, LEN_LONG/1.8, LEN_LONG/2+BALL_SIZE*1);
 
        if(img_title_loaded){
            ctx_logo.globalAlpha = 0.1;
            ctx_logo.drawImage(img_title,0,0, ctx.canvas.width, ctx.canvas.height,0,0,500,500);
            logo_draw=true;
        }

        return canv_message;
  }



  function calcScore(){
      if(status_breakout.block.length==0){
            status_score.life+=1
            beep("1up")
            var x,y;
            for(var _y=0;_y<=4;_y++){
                for(var _x=0;_x<=5;_x++){
                    x=(LEN_LONG-LEN_SHORT)/2+BALL_SIZE/4+_x*BALL_SIZE*5+_x
                    y=_y*BALL_SIZE+_y*BALL_SIZE*0.5+(BALL_SIZE*1.5)
                    status_breakout.block.push({x:x,
                                                y:y,
                                                w: BALL_SIZE*5,   
                                                h: BALL_SIZE,   
                                            });
                }
            }    
      }
      if(status_score.life==0){
        beep("gameover")
        status_score.gameover=true;
        standby=true;
      }
      
  }




})((this || 0).self || global); 


Pongout.init();
