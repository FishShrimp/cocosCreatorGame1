// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        playerNode:cc.Node,
        boomNode:cc.Node,
        enemyNode:cc.Node,
        scoreLabel:cc.Label,
    },

   

    onLoad () {
        this.score = 0;
        this.placePlayer();
        this.placeEnemy();
        console.log('onLoad');
        this.node.on('touchstart',this.fire,this); //绑定点击事件
    },

    onDestroy(){
        console.log('onDestroy');
        this.node.off('touchstart',this.fire,this);//解除绑定
    },
    //放置敌人节点
    placeEnemy(){
        
        let x = cc.winSize.width/2 -this.enemyNode.width/2;
        let y = Math.random()*cc.winSize.height/4;
        let dua = 0.6 + Math.random() * 0.5;
        this.enemyNode.active = true;
        this.enemyNode.x = 0;
        this.enemyNode.y = cc.winSize.height/3-this.enemyNode.height/2;

        let seq =  cc.repeatForever(
            cc.sequence(
                cc.moveTo(dua,-x,y),
                cc.moveTo(dua,x,y)
            )
        );
        this.enemyAction = this.enemyNode.runAction(seq);
    },
     update (dt) {
         //碰撞判断
        if(this.playerNode.position.sub(this.enemyNode.position).mag() <this.playerNode.width/2+this.enemyNode.width/2){
            this.enemyNode.active = false;
            this.boom(this.enemyNode.position,this.enemyNode.color);
            
            this.enemyNode.stopAction(this.enemyAction);
            this.playerNode.stopAction(this.playerAction);

            this.scoreLabel.string = ++this.score;
            this.placePlayer();
            this.placeEnemy();
        }

     },
//放置玩家节点
    placePlayer(){
        console.log('placePlayer');
        this.isFire = false;
        this.playerNode.active = true;

        this.playerNode.y = -cc.winSize.height/4;
        

        //长时间不发射会自动坠落
        let dua = 20;
        let seq = cc.sequence(
            cc.moveTo(dua,cc.v2(this.playerNode.x, - (cc.winSize.height / 2 - this.playerNode.height))),
            cc.callFunc(()=>{
                this.die();
            })
        );
        this.playerAction = this.playerNode.runAction(seq);



    },
    //发射
    fire(){

        if(this.isFire) {
            return;
        }

        this.isFire = true;
        console.log('发射');
        let dua = 0.6;
        let seq = cc.sequence(
            cc.moveTo(dua,cc.v2(0,cc.winSize.height/2)),
            cc.callFunc(() => {
                this.die();
            })
        );
        this.playerAction = this.playerNode.runAction(seq);
    },

    //游戏结束
    die(){
        console.log('结束');
        this.playerNode.active = false;
        this.boom(this.playerNode.position,this.playerNode.color);

        //延时重新开始
        setTimeout(()=>{
            //场景重新加载
            console.log('场景重新加载');
            cc.director.loadScene('game');
        },1000);
        
    },

    //爆炸
    boom(pos,color){
        this.boomNode.setPosition(pos);
        let particle = this.boomNode.getComponent(cc.ParticleSystem);
        if(color !== undefined){
            particle.startColor = particle.endColor = color;

        }
        particle.resetSystem();
    },
});
