// Create the canvas
let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d"); //2d object. objet will give you properties to manipulate the canvas
canvas.width = 1000; //specify how many pixels it will be 
canvas.height = 1000; 
document.body.appendChild(canvas); //Append element to the body


// Create the timer div element
let timerDiv = document.createElement("div");
timerDiv.id = "timer"; // Set the ID for styling
document.body.appendChild(timerDiv); // Append timer div to the body

// Styles set  for the timer div
let setTimerPosition = function() {
    timerDiv.style.position = "absolute";
    timerDiv.style.top = canvas.offsetTop + 32 + "px"; // Adjust top position as needed
    timerDiv.style.right = document.body.clientWidth - canvas.offsetLeft - canvas.width + 60 + "px"; // Adjust right position relative to canvas
    timerDiv.style.font = "24px Helvetica";
    timerDiv.style.color = "white";
    timerDiv.style.padding = "5px 10px";
};


//Spritesheet movements 

let rows = 4;
let cols = 3;


let trackRight = 2;

let trackLeft = 1;
let trackUp = 0;   // not using up and down in this version, see next version
let trackDown = 3;

let spriteWidth = 96; // also  spriteWidth/cols; 
let spriteHeight = 192;  // also spriteHeight/rows; 
let width = spriteWidth / cols; 
let height = spriteHeight / rows; 

let curXFrame = 0; // start on left side
let frameCount = 3;  // 3 frames per row
//x and y coordinates of the overall sprite image to get the single frame  we want
let srcX = 0;  // our image has no borders or other stuff
let srcY = 0;

//Assuming that at start the character will move right side 
let left = false;
let right = false;
let up = false;
let down = false;


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
setTimerPosition();
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

let counter = 0;
let timerRunning = false;
let secondsLeft = 15;
let timer;

let ghost = {
    speed: 256, // movement in pixels per second. scaling the ghost speed based on the overall game.
    x: 32 + (Math.random() * (canvas.width - 96)),
    y: 32 + (Math.random() * (canvas.height - 96))
};


let candies = [];
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


// Timer countdown
let startTimer = function () {
    clearInterval(timer); //reset the timer if alredy running 
    let seconds = secondsLeft; 
    timer = setInterval(function () {
        seconds--;
        if (seconds <= 0) {
            clearInterval(timer);
            endGame();
            reset();
        }
        timerDiv.textContent = 'Time: ' + seconds;
    }, 1000);
};

// Function to end the game
let endGame = function () {

    if (candiesCaught < 3 || timer <0) {
        alert("Time's up! Game over.");
       reset(); 
    } 
   
};

//candies initialized and placed in random places 
let initializeCandies = function () {
    candies = [];
    for (let i = 0; i < 3; i++) {
        let candy = {
            x: 32 + (Math.random() * (canvas.width - 96)),
            y: 32 + (Math.random() * (canvas.height - 96))
        };
        candies.push(candy);
    }
};

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
    if (!timerRunning) {
        // Start the timer when the ghost starts moving
        startTimer();
        timerRunning = true;
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

    //How to check for collision. slow the speed down of ghost to check math is correct.m
    for (let i = 0; i < candies.length; i++) {
            if (
                ghost.x <= (candies[i].x + 32)
                && candies[i].x <= (ghost.x + 32)
                && ghost.y <= (candies[i].y + 32)
                && candies[i].y <= (ghost.y + 32)
            ) {
            candies.splice(i, 1);
            
            soundEfx.src = soundCaught;
            soundEfx.play();
            candiesCaught++; 
        
         
        
        
        }
        
    }
    // Play game over sound only when all 3 candies are caught
    if (candiesCaught == 3 ) {
        soundEfx.src = soundGameOver;
        soundEfx.play();
        // Function to be executed once the sound ends
        
        // Show the alert after the sound ends
        alert("Congratulations! You caught all the candies! Click OK to try again!");
        // Reset the game
        reset();
        
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
        for (let i = 0; i < candies.length; i++) {
            ctx.drawImage(candyImage, candies[i].x, candies[i].y);
        }
        
    }


    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Candy Caught: " + candiesCaught, 32, 34);
     

    

        
};



// Reset the game when the player catches a candy
let reset = function () {
    alert("Start the game! Help the ghost catch all the candies in time!");
    
    ghost.x = Math.random() * (canvas.width  - 32);
    ghost.y = Math.random() * (canvas.height  - 32);
    
       
    initializeCandies();
    candiesCaught = 0; 
    resetTimer();
};
// Function to reset the timer
let resetTimer = function () {
    clearInterval(timer);
    secondsLeft = 15;
    startTimer();
};
// The main game loop
let main = function () {
    let now = Date.now();
    let delta = now - then;
    update(delta / 1000); //higher the number, slower, lower the number, faster. Scaling the speed based on the computer.
    render();
    then = now;
    // Request to do this again ASAP
    requestAnimationFrame(main);
}
// Let's play this game!
let then = Date.now();
initializeCandies();
startTimer();
setTimerPosition();
main();
    