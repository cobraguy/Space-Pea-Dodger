var score;
var bootState = {
    create: function(){
        game.stage.backgroundColor = "#0c00ff";
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.state.start("load");
    }
};

var loadState = {
    preload: function(){
        var loadingLabel = game.add.text(game.world.centerX, game.world.centerY, "Loading...", {fill: "#ffffff"});
        loadingLabel.align = "center";
        loadingLabel.anchor.setTo(0.5);
        game.load.image("pea", "pea.png");
        game.load.spritesheet("button", "button.png", 200, 75);
    },
    
    create: function(){
        game.state.start("menu");
    }
};

var menuState = {
    create: function(){
        this.button = game.add.button(game.world.centerX, game.world.centerY, "button", this.buttonClicked, this, 1, 0);
        this.button.anchor.setTo(0.5);
    },
    
    buttonClicked: function(){
        game.state.start("play");
    }
};

var playState = {
    create: function(){
        score = 0;
        this.target = score + game.rnd.integerInRange(5, 10);
        this.scoreLabel = game.add.text(game.world.centerX, 20, score, {fill: "#ffffff", font: "30px Calibri"});
        this.scoreLabel.align = "center";
        this.scoreLabel.anchor.setTo(0.5);

        this.peas = game.add.physicsGroup();
        
        this.createPea(2);
    },
    
    update: function(){
        if(!game.input.activePointer.withinGame) game.state.start("gameover");
		
        for(var i = 0; i < this.peas.children.length; i++){
            var pea = this.peas.children[i];
	    
            if(pea.body.hitTest(game.input.x, game.input.y)) game.state.start("gameover");
            if(!pea.inMotion) pea.rotation = game.physics.arcade.angleToPointer(pea);
            
            if(game.time.now > pea.attackTime && !pea.inMotion){
                game.physics.arcade.moveToPointer(pea, 300);
                pea.inMotion = true;
            }
            
            if(!pea.inWorld){
                this.stopMoving(pea);
                score++;
                this.scoreLabel.text = score;
                if(pea.x < 0){
                    pea.x = 21;
                }else if(pea.x > 480){ 
                    pea.x = 459;
                }
                
                if(pea.y < 0){
                    pea.y = 21;
                }else if(pea.y > 360){
                    pea.y = 339;
                }
                this.setAttackTime(pea);
            }
        }
        
        if(this.target <= score){
            this.target += game.rnd.integerInRange(5, 10);
            this.createPea();
        }
    },
    
    createPea: function(amount){
        this.amount = amount || 1;
        for(var i = 0; i < this.amount; i++){
            var pea = this.peas.create(0, 0, "pea");
            this.setRandPos(pea);
            pea.anchor.setTo(0.5);
            pea.inMotion = false;
            this.setAttackTime(pea);
        }
    },
    
    setAttackTime: function(sprite){
        sprite.attackTime = game.time.now + (game.rnd.integerInRange(1, 3) * 1000);
    },
    
    stopMoving: function(sprite){
        sprite.body.velocity.x = 0;
        sprite.body.velocity.y = 0;
        sprite.inMotion = false;
    },
    
    setRandPos: function(sprite){
        if(game.rnd.integerInRange(1, 2) === 1){
            if(game.rnd.integerInRange(1, 2) === 1){
                sprite.x = 16;
            }else{
                sprite.x = 464;
            }
            sprite.y = game.rnd.integerInRange(16, 344);
        }else{
            if(game.rnd.integerInRange(1, 2) === 1){
                sprite.y = 16;
            }else{
                sprite.y = 344;
            }
            sprite.x = game.rnd.integerInRange(16, 464);
        }
    }
};

var gameoverState = {
    create: function(){
        this.endLabel = game.add.text(game.world.centerX, game.world.centerY, score, {fill: "#ffffff"});
        this.endLabel.align = "center";
        this.endLabel.anchor.setTo(0.5);
        
        this.button = game.add.button(game.world.centerX, game.world.centerY + 80, "button", this.buttonClicked, this, 1, 0);
        this.button.anchor.setTo(0.5);
    },
    
    buttonClicked: function(){
    	game.state.start("play");
    }
};

var game = new Phaser.Game(480, 360, Phaser.AUTO);

game.state.add("boot", bootState);
game.state.add("load", loadState);
game.state.add("menu", menuState);
game.state.add("play", playState);
game.state.add("gameover", gameoverState);

game.state.start("boot");
