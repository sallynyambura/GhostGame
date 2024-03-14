// Create the canvas
let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d"); //2d object. objet will give you properties to manipulate the canvas
canvas.width = 1000; //specify how many pixels it will be 
canvas.height = 1000; 
document.body.appendChild(canvas); //Append element to the body
var counter = 0;

// lots of variables to keep track of sprite geometry
//  I have 4 rows and 3 cols in my space ship sprite sheet
var rows = 4;
var cols = 3;


var trackRight = 2;

var trackLeft = 1;
var trackUp = 0;   // not using up and down in this version, see next version
var trackDown = 3;

var spriteWidth = 96; // also  spriteWidth/cols; 
var spriteHeight = 192;  // also spriteHeight/rows; 
var width = spriteWidth / cols; 
var height = spriteHeight / rows; 

var curXFrame = 0; // start on left side
var frameCount = 3;  // 3 frames per row
//x and y coordinates of the overall sprite image to get the single frame  we want
var srcX = 0;  // our image has no borders or other stuff
var srcY = 0;

//Assuming that at start the character will move right side 
var left = false;
var right = false;
var up = false;
var down = false;


//Sounds 
let soundGameOver = "sound/gameover.wav"; //Game Over sound efx
let soundCaught = "sound/candycaught.wav"; //Game Over sound efx
//Assign audio to soundEfx
let soundEfx = document.getElementById("soundEfx");


// Background image
let bgReady = false; 
let bgImage = new Image();
bgImage.onload = function () { 
bgReady = true;
};
bgImage.src = "images/background.png";

//Edge (cobwebs) image hoirzontal 
let edgeReady = false; 
let edgeImage = new Image();
edgeImage.onload = function () { 
edgeReady = true;
};
edgeImage.src = "images/cobwebs.jpeg";
// Edge (cobwebs) image vertical
let edgeReady2 = false;  
let edgeImage2 = new Image();
edgeImage2.onload = function () { 
edgeReady2 = true;
};
edgeImage2.src = "images/cobwebsL&R.jpeg"; 
// Ghost (hero) image
let ghostReady = false;
let ghostImage = new Image();
ghostImage.onload = function () {
ghostReady = true;
};
ghostImage.src = "images/sprite.png";

// Candy (monster) image
let candyReady = false;
let candyImage = new Image();
candyImage.onload = function () {
candyReady = true;
};
candyImage.src = "images/ghostcandy.PNG";

//==============Done creating image objects ====================

// Game objects
let ghost = {
    speed: 256, // movement in pixels per second. scaling the ghost speed based on the overall game.
    x: 0, // where on the canvas are they?
    y: 0 // where on the canvas are they?
};
let candy = {
    // for this version, the candy does not move, so just and x and y
    x: 0,
    y: 0
};
let candiesCaught = 0;
//=============== Done with other variables =======



// Handle keyboard controls
let keysDown = {}; //object were we properties when keys go down
// and then delete them when the key goes up
// so the object tells us if any key is down when that keycode
// is down. In our game loop, we will move the ghost image if when
// we go thru render, a key is down

addEventListener("keydown", function (e) {
console.log(e.keyCode + " down") //keep using key code for noe. remove console.log after. not needed
keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
console.log(e.keyCode + " up")
delete keysDown[e.keyCode];
}, false);

//function definitons

// Update game objects
let update = function (modifier) {
    left = false;
    right = false;
    up = false;
    down = false;
   

    if (38 in keysDown && ghost.y > 32+0) { // holding up key
        ghost.y -= ghost.speed * modifier;
        down = true;
    }
    if (40 in keysDown && ghost.y < canvas.height - (64 + 0)) { // holding down key
        ghost.y += ghost.speed * modifier;
        up = true;

    }
    if (37 in keysDown && ghost.x > (32+0)) { // holding left key
        ghost.x -= ghost.speed * modifier;
        left = true;   // for animation
    }
    if (39 in keysDown && ghost.x < canvas.width - (64 + 0)) { // holding right key
        ghost.x += ghost.speed * modifier;
        right = true; // for animation
    }
    
    //curXFrame = ++curXFrame % frameCount; 	//Updating the sprite frame index 
    // it will count 0,1,2,0,1,2,0, etc

    if (counter == 5) {  // adjust this to change "walking speed" of animation
        curXFrame = ++curXFrame % frameCount; 	//Updating the sprite frame index 
        // it will count 0,1,2,0,1,2,0, etc
        counter = 0;
    } else {
        counter++;
    }

    srcX = curXFrame * width;   	//Calculating the x coordinate for spritesheet 
    //if left is true,  pick Y dim of the correct row
    if (left) {
        //calculate srcY 
        srcY = trackLeft * height;
    }

    //if the right is true,   pick Y dim of the correct row
    if (right) {
        //calculating y coordinate for spritesheet
        srcY = trackRight * height;
    }

    if (up) {
        //calculate srcY 
        srcY = trackUp * height;
    }

    if (down) {
        //calculate srcY 
        srcY = trackDown * height;
    }

    if (left == false && right == false && up == false && down == false) {
        srcX = 1 * width;
        srcY = 0 * height;
    }

    // Are they touching? How to check for collision. slow the speed down of ghost to check math is correct.m
    if (
        ghost.x <= (candy.x + 32)
        && candy.x <= (ghost.x + 32)
        && ghost.y <= (candy.y + 32)
        && candy.y <= (candy.y + 32)
    ) {
    ++candiesCaught; // keep track of our “score” what score? 
    console.log('got em')

    


    // play sound when touch
	
    if(candiesCaught < 3) {
	    soundEfx.src = soundCaught ;
	    soundEfx.play();
    } else {
        soundEfx.addEventListener("ended",function(){
             alert("Game over, you won!")
        });
        soundEfx.src = soundGameOver;
	    soundEfx.play();
       

    }

	 
        reset(); // start a new cycle
    }
    
}

// Draw everything in the main render function
let render = function () {
    if (bgReady) {
        //console.log('here2');
    ctx.drawImage(bgImage, 0, 0);
    }
    if (edgeReady) {
        //console.log('here2');
        ctx.drawImage(edgeImage, 0, 0);
        ctx.drawImage(edgeImage, 0, 968)
    }
    if (edgeReady2) {
        //console.log('here2');
        ctx.drawImage(edgeImage2, 0, 0);
        ctx.drawImage(edgeImage2, 968, 0)
    }

    if (ghostReady) {
        //ctx.drawImage(heroImage, hero.x, hero.y);
         ctx.drawImage(ghostImage, srcX, srcY, width, height, ghost.x, ghost.y, width, height);
    }

    if (candyReady) {
        ctx.drawImage(candyImage, candy.x, candy.y);
    }
    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Candy Caught: " + candiesCaught, 32, 32); //x and y coordinated of where text will show
    ctx.fillText("Time: " + timeLeft + " seconds", 32, 64);    
};

// The main game loop
// The main game loop (changed)
let main = function () {
    var now = Date.now();
    var delta = now - then;
    update(delta / 1000); //higher the number, slower, lower the number, faster. Scaling the speed based on the computer.
    render();
    then = now;
    // Request to do this again ASAP
    requestAnimationFrame(main);
}

// Reset the game when the player catches a candy
let reset = function () {
    ghost.x = (canvas.width / 2) -16;
    ghost.y = (canvas.height / 2) -16;
    //Place the candy somewhere on the screen randomly
    // but not in the hedges, Article in wrong, the 64 needs to be
    // hedge 32 + hedge 32 + char 32 = 96
    candy.x = 32 + (Math.random() * (canvas.width - 96));
    candy.y = 32 + (Math.random() * (canvas.height - 96)); //push character away from the trees 
};
   
// Let's play this game!
let then = Date.now();
reset(); 

let timeLeft = 30;
let timeInterval;

function updateTimer() {
    timeLeft--; 
    if (timeLeft <= 0) {
        clearInterval(timerInterval); 
        if (candiesCaught < 3) {
            alert("Time's up! You lost the game."); 
        }
    }
}

// timer start
timerInterval = setInterval(updateTimer, 1000); // update per second
main(); 
//call the main game loop. refreshes the game image




    