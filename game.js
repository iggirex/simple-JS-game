// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function(){
    bgReady = true;
};
bgImage.src = "images/background.png";

// Hero Image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function(){
    heroReady = true;
};
heroImage.src = "images/hero.png";

// Mojito image
var mojitoReady = false;
var mojitoImage = new Image();
mojitoImage.onload = function(){
    mojitoReady = true;
};
mojitoImage.src = "images/mojito.png";

// Game objects
var hero = {
    speed: 256,
    x: 0,
    y: 0
};
var mojito = {
    x: 0,
    y: 0
};
var mojitosCaught = 0;

var keysDown = {};

addEventListener("keydown", function(e){
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function(e){
    delete keysDown[e.keyCode];
}, false);

//Reset the game when the player catches a mojito
var reset = function(){
    hero.x = canvas.width/2;
    hero.y = canvas.height/2;

    //Throw the mojito somewhere on the screen randomly
    mojito.x = 32 + (Math.random() * (canvas.width - 64));
    mojito.y = 32 + (Math.random() * (canvas.height - 64))
}

// Update game objects
var update = function(modifier){
    if(38 in keysDown) {
        hero.y -= hero.speed * modifier;
    }
    if(40 in keysDown){
        hero.y += hero.speed * modifier;
    }
    if(37 in keysDown){
        hero.x -= hero.speed * modifier;
    }
    if(39 in keysDown){
        hero.x += hero.speed * modifier;
    }

    // Are they touching?
    if (
        hero.x <= (mojito.x + 32)
        && mojito.x <= (hero.x + 32)
        && hero.y <= (mojito.y + 32)
        && mojito.y <= (hero.y + 32)
    ) {
        ++mojitosCaught;
        reset()
    }
}

// Draw everything
var render = function(){
    if(bgReady){
        ctx.drawImage(bgImage, 0, 0);
    }
    if(heroReady){
        ctx.drawImage(heroImage, hero.x, hero.y);
    }

    if(mojitoReady){
        ctx.drawImage(mojitoImage, mojito.x, mojito.y);
    }

    // Score
    ctx.fillStyle = "rgb(250, 250,250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Mojitos caught: " + mojitosCaught, 32, 32);
}

// Main game loop
var main = function(){
    var now = Date.now();
    var delta = now - then;

    update(delta/1000);
    render();

    then = now;

    // Request to do this again ASAP
    requestAnimationFrame(main);
}

// Let's play
var then = Date.now()
reset();
main();
