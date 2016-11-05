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
    //CONST
    var LEN_LONG        =  500;
    var LEN_SHORT       =  310;
    var BALL_SIZE       =  (LEN_LONG/50|0);
    var COLOR_RED       =   "#FF0000";
    var COLOR_BLUE      =   "#00FF00";
    var COLOR_BLACK      =   "#222222";
    var COLOR_WHITE      =   "#FFFFFF";

    //val
    mouse_x=0
    mouse_y=0
    enemy_y=0

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
        block:[]
    }
    
    // Func -----------------------------------------------

    function init(){

        if('ontouchstart' in window){
            document.getElementById("canv").addEventListener("touchstart",ev_mouseMove)
        }else{
            document.getElementById("canv").addEventListener("mousemove",ev_mouseMove)
        }
        initParam()
        initPong()
        initBreakout()
        drawLoop()
    }

    function initParam(){
        ctx =document.getElementById("canv").getContext("2d");
        LEN_LONG=LEN_LONG*ctx.canvas.width/500;
        LEN_SHORT=LEN_SHORT*ctx.canvas.width/500;
    }

    function initPong(){
        status_pong.x=(LEN_LONG/2|0);
        status_pong.y=(LEN_LONG/2)+(LEN_SHORT/2)*(0.5-Math.random())|0;
        status_pong.vec[0]=-1

        if(Math.round()<0.5){
             status_pong.vec[1]=1.6  
        }else{
             status_pong.vec[1]=-1.6
        }
        pongLoop()
    }
    function initBreakout(){
        status_breakout.y=(LEN_LONG/2|0);
        status_breakout.x=(LEN_LONG/2)+(LEN_SHORT/2)*(0.5-Math.random())|0;
        status_breakout.vec[1]=-1.2

        if(Math.round()<0.5){
             status_breakout.vec[0]=1.3  
        }else{
             status_breakout.vec[0]=-1.3
        }
        var x,y;
        for(var _y=0;_y<=5;_y++){
            for(var _x=0;_x<=5;_x++){
                x=(LEN_LONG-LEN_SHORT)/2+BALL_SIZE/4+_x*BALL_SIZE*5+_x
                y=_y*BALL_SIZE+_y*BALL_SIZE*0.5
                status_breakout.block.push({x:x,
                                            y:y,
                                            w: BALL_SIZE*5,   
                                            h: BALL_SIZE,   
                                        });
            }
        }   



        breakoutLoop()
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
    }



    function pongLoop(){
        return setInterval(pong,10);
    }

    function pong(){
        _top=(LEN_LONG-LEN_SHORT)/2|0
        _bottom=((LEN_LONG-LEN_SHORT)/2)+LEN_SHORT|0
        //field
        if(status_pong.x<0){
            status_pong.vec[0]=Math.abs(status_pong.vec[0])
            beep("wall")
        }
        if(status_pong.x+BALL_SIZE>LEN_LONG){
            status_pong.vec[0]=-1*Math.abs(status_pong.vec[0])
            beep("miss")
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
            }
        }

        //ball mover 
        status_pong.x=status_pong.x+status_pong.vec[0]
        status_pong.y=status_pong.y+status_pong.vec[1]

        //enemy move
        if(status_pong.x+BALL_SIZE+BALL_SIZE<=(LEN_LONG-LEN_SHORT)/2){
            if(enemy_y<status_pong.y){
                enemy_y=enemy_y-1*(enemy_y-status_pong.y)/10
            }else{
                enemy_y=enemy_y-1*(enemy_y-status_pong.y)/10
            }
        }else{
            if(enemy_y<status_pong.y){
                enemy_y=enemy_y-1*(enemy_y-status_pong.y)/100
            }else{
                enemy_y=enemy_y-1*(enemy_y-status_pong.y)/100
            } 
        }
    }

    function breakoutLoop(){
        return setInterval(breakout,10);
    }

    function breakout(){
        _top=(LEN_LONG-LEN_SHORT)/2|0
        _bottom=((LEN_LONG-LEN_SHORT)/2)+LEN_SHORT|0
        //field
        if(status_breakout.y<0){
            status_breakout.vec[1]=Math.abs(status_breakout.vec[1])
            beep("wall")
        }
        if(status_breakout.y+BALL_SIZE>LEN_LONG){
            status_breakout.vec[1]=-1*Math.abs(status_breakout.vec[1])
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
                    vx=0.6*vxx
                    vy=-1.6
                }else{
                    vx=1.3*vxx
                    vy=-1.2
                }
                status_breakout.vec[0]=vx
                status_breakout.vec[1]=vy
                beep("player")
            }
        }
        //block
        for(var i=status_breakout.block.length-1;i>=0;i--){
            if(collision(i)){
                beep("clash")
                break;
            }
        }


        //ball move 
        status_breakout.x=status_breakout.x+status_breakout.vec[0]
        status_breakout.y=status_breakout.y+status_breakout.vec[1]

    }
    function collision(idx){
        var x=status_breakout.x
        var y=status_breakout.y
        var block=status_breakout.block[idx]
        if(block.y<=y&&block.y+block.h>=y){
            if(block.x<=x+BALL_SIZE*2&&block.x+block.w>=x ){
                status_breakout.vec[1]=-1*status_breakout.vec[1]
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

    function beep(id){
        document.getElementById(id).play();
    }


    function drawLoop(){
        draw()
        _requestAnimationFrame(drawLoop);
    }



    function draw(){
        ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.width);
        ctx.fillStyle = COLOR_BLACK;
        ctx.globalAlpha = 1;
        ctx.fillRect(0,0,LEN_LONG,LEN_LONG);
        ctx.fill();



        ctx.drawImage(drawBoard(true), 0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(drawPong(), 0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(drawBreakout(), 0, 0, ctx.canvas.width, ctx.canvas.height);

    }

    function drawBoard(initFlag){
        if(!canv_board){
            canv_board =document.createElement("canvas");
        }else if(!initFlag){
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



        return canv_breakout;
    }





})((this || 0).self || global); 


Pongout.init();
