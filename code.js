var canvas = document.querySelector('#canvas');
var c = canvas.getContext('2d');
canvas.width = window.innerWidth-24;	
canvas.height = window.innerHeight-20;	

// SPRITES
var shuttlesprite = new Image();
shuttlesprite.src = 'Spaceshuttles/spaceshuttle2.png'; //spaceshuttle.png

var empty = new Image();
var alien1 = new Image();
var alien2 = new Image();
var alien3 = new Image();
alien1.src = 'Aliens/alien1.png';
alien2.src = 'Aliens/alien2.png';
alien3.src = 'Aliens/alien3.png';

var aliensprites = new Array();
aliensprites.push(empty);
aliensprites.push(alien1);
aliensprites.push(alien2);
aliensprites.push(alien3);

var exp1 = new Image();
var exp2 = new Image();
var exp3 = new Image();
var exp4 = new Image();
var exp5 = new Image();
var exp6 = new Image();
var exp7 = new Image();

exp1.src = 'Explosion/1.png';
exp2.src = 'Explosion/2.png';
exp3.src = 'Explosion/3.png';
exp4.src = 'Explosion/4.png';
exp5.src = 'Explosion/5.png';
exp6.src = 'Explosion/6.png';
exp7.src = 'Explosion/7.png';

var explosionStages  = new Array();

explosionStages.push(exp1);
explosionStages.push(exp2);
explosionStages.push(exp3);
explosionStages.push(exp3);
explosionStages.push(exp3);
explosionStages.push(exp3);
explosionStages.push(exp3);
explosionStages.push(exp3);
explosionStages.push(exp4);
explosionStages.push(exp4);
explosionStages.push(exp4);
explosionStages.push(exp4);
explosionStages.push(exp4);
explosionStages.push(exp4);
explosionStages.push(exp5);
explosionStages.push(exp5);
explosionStages.push(exp5);
explosionStages.push(exp5);
explosionStages.push(exp5);
explosionStages.push(exp5);
explosionStages.push(exp6);
explosionStages.push(exp6);
explosionStages.push(exp6);
explosionStages.push(exp6);
explosionStages.push(exp6);
explosionStages.push(exp6);
explosionStages.push(exp7);
//END SPRITE

var backgroundSound = new Howl({
			src: ['Sounds/bg.wav'],
			loop : true
		});

var soundCount = 0;

var bulletSound = new Howl({
	src: ['Sounds/laser1.wav'],
	volume : 0.2
  });

var o;
var BoomSounds = new Array();
for(o=1; o<=9;o++){

	var temp = new Howl({
		src : [ 'Sounds/boom'+o+'.wav' ],
		volume : 0.2
	});

	BoomSounds.push(temp);
}

var level = 1;
var Alive = -1;			
var flag = 0;
var totalBullets = 0;
var kills = 0;
var health = 90;
var healthbarHeight;
var maxStars = 150;
var maxAliens = 5;
var starSpeed = 5;

//spaceshuttle props and dimensions
var cannonw = 10,cannonh = 20;
var midBottomw = 24,midBottomh = 20 ,midTopw = 16,midToph = 20;
var baseBottomw = 36 ,baseBottomh = 24 ,baseTopw = 28 ,baseToph = 24;
var ridgew = 16 ,ridgeh = 16;
var colorBack = "aqua", colorFront = "blue";
var shuttleSpeedh = 7;
var shuttleSpeedv  = 4;

//alien props and dimanesions
var bunw = 20,bunh = 6;
var headw = 26,headh = 6 ;
var facew = 30 ,faceh = 18;
var layer1w = 5 ,layer1h = 5;
var layer2w = 4,layer2h = 4;
var midw = 3,midh = 3;

var bulletSpeed = 7;
var alienSpeed = 0.2 ;
var aliensOnScreen = 5;
var keys = [];

var alienColors = ["#4fc02f" , "green" ,"turquoise", "teal" ];
var bulletColors = ["cyan", "aqua" ,"turquoise", "teal" ,"lightcyan","mediumaquamarine","blue" ,"black"];

//Shuttle object
var shuttle = function(x,y){
	this.x = x;
	this.y = y;
}

//Star object
var star = function(x,y ,rad){
	this.x = x;
	this.y = y;
	this.rad = rad;
}

//Alien object
var alien = function(x,y,type){
	this.x = x;
	this.y = y;
	this.type = type;
}

//Bullet object
var bullet = function(x,y){
	this.x = x;
	this.y = y;
}
var Bullets = new Array();

var Aliens = new Array();

var Stars = new Array();

var a;

//Array of stars 
for(a = 0; a<maxStars ; a++){
	var temp = new star(Math.random()*(window.innerWidth-20), Math.random()*(window.innerHeight-20),Math.random()*3 );
	Stars.push(temp);
}

//Array of initial aliens
for(a = 0; a < aliensOnScreen; a++){
	var temp = new alien(Math.random()*(window.innerWidth-100)+60, Math.random()*(window.innerHeight/2-300),Math.floor(Math.random()*3));
	Aliens.push(temp);
}

var posx = window.innerWidth/2 , posy = window.innerHeight - baseBottomh - midBottomh - cannonh;

var testShuttle = new shuttle(posx, posy);

function dist(x1,y1,x2,y2){

	return(Math.sqrt((x1 - x2)**2 + (y1 - y1)**2 ));
}
window.addEventListener("load", draw , false);
//requestAnimationFrame(draw);
function draw(){	
	//Clear window
	c.clearRect(0,0,window.innerWidth, window.innerHeight);

	//Instructions page
	if(Alive == -1){
		c.beginPath();
		c.fillStyle = 'rgba(255,255,255,0.5)';
		c.font = "50px Calibri";
		c.fillText("|Space X|" , (window.innerWidth-20)/2 - 65 , (window.innerHeight-20)/2 - 70);
		c.font = "10px Calibri";
		c.fillText("J A Y  R A T H O D" , (window.innerWidth-20)/2 -10  , (window.innerHeight-20)/2 - 45);
		c.font = "20px Calibri";
		c.fillText("Controls :" , (window.innerWidth-20)/2 - 10 , (window.innerHeight-20)/2 - 15);
		c.fillText("Arrow Keys  -  Move" , (window.innerWidth-20)/2 - 55 , (window.innerHeight-20)/2 + 10 );
		c.fillText("Spacebar       -  Shoot" , (window.innerWidth-20)/2 - 55 , (window.innerHeight-20)/2 + 35);
		c.font = "15px Calibri";
		c.fillText("Press any key to begin." , (window.innerWidth-20)/2 - 40 , (window.innerHeight-20)/2 + 110);
		c.fillText("(Sound : On)" , (window.innerWidth-20)/2 - 10 , (window.innerHeight-20)/2 + 125);
	}

	//GAME 
	else if(Alive)
	{
		if(soundCount == 0)		//Initiate background sound
		{
			backgroundSound.play();
			soundCount = 1;
		}
		
		//Draw Health Bar
		c.beginPath();
		if(health == 90){
			c.fillStyle = "green";
			healthbarHeight = 90*6;
		}
		else if(health == 60){
			c.fillStyle = "orange";
			healthbarHeight = 60*6;
		}	
		else if(health == 30){
			c.fillStyle = "red";
			healthbarHeight = 30*6;
		}
		else{
			healthbarHeight = 0;
		}

		c.fillRect(20, 20, 20 , healthbarHeight );
		c.closePath();
		c.fill();

		var i,j;
		//Draw STARS
		for(j = 0;j<maxStars ; j++){
			c.beginPath();
			c.fillStyle = 'rgba(255,255,255,0.7)';
			c.arc(Stars[j].x,Stars[j].y,Stars[j].rad , 0 , Math.PI * 2 , false);
			Stars[j].y += starSpeed;
			if(Stars[j].y >= window.innerHeight-20){
				Stars[j].y = 0;
			}
			c.closePath();
			c.fill();
		}
		
		//Draw ALIENS
		for( j=0 ; j<Aliens.length ; j++)
		{
			c.drawImage(aliensprites[Aliens[j].type+1] , Aliens[j].x-25 , Aliens[j].y-25 , 50,50);

			Aliens[j].y += alienSpeed;

			//Handling Alien Shuttle collision & Alien passing through base condition
			if(Math.abs(Aliens[j].y - testShuttle.y) <= 60 && Math.abs(Aliens[j].x - testShuttle.x)<=18 ||  Aliens[j].y >= window.innerHeight -30){	
				health-=30;
				if(health == 0)
				{
					Alive =  0;
				}
				BoomSounds[Math.floor(Math.random()*9)].play();
				var addAlien = new alien(Math.random()*(window.innerWidth-100)+60, Math.random()*(window.innerHeight/2-300), Math.floor(Math.random()*3));
				Aliens[j] = addAlien;	

			}
			
		}

		//Bullets :
		for(i=0;i<Bullets.length;i++){
			c.fillStyle = bulletColors[Math.floor(Math.random()*6)];
			c.beginPath();
			c.arc(Bullets[i].x,Bullets[i].y - cannonh + 10, 2.5 , 0 , Math.PI*2 ,false);
			c.fillRect(Bullets[i].x-2.5,Bullets[i].y - cannonh + 10  ,5,5);
			c.closePath();
			c.fill();
			Bullets[i].y -= bulletSpeed;
			if(Bullets[i].y <=0 ){
				Bullets.splice(i,1);
			}
		}


		//Handling arrow key presses and shuttle movement boundaries 
		
		// left
	    if (keys[65] || keys[37]) {		//37
			if(testShuttle.x >= 70)
			testShuttle.x -= shuttleSpeedh;
		  }
	   
		  // right
		  if (keys[68] || keys[39]) {		//39
			  if(testShuttle.x <= window.innerWidth - 50)
			testShuttle.x += shuttleSpeedh;
		  }
	   
		  // down
		  if (keys[87] || keys[38]) {		//38
			if(testShuttle.y >= window.innerHeight/2)
			testShuttle.y -= shuttleSpeedv;
		  }
	   
		  // up
		  if (keys[83] || keys[40]) {		//40
			if(testShuttle.y <= window.innerHeight - baseBottomh - midBottomh - cannonh)
			testShuttle.y += shuttleSpeedv;
			
		  }
		
		// DRAWING THE SHUTTLE

		  c.drawImage(shuttlesprite,testShuttle.x-35,testShuttle.y-50,70,100);

		//Checking for bullet kill

		for(i=0;i<Bullets.length;i++)
		{
			for(j=0;j<maxAliens;j++)
			{
				if(Math.abs(Bullets[i].x - Aliens[j].x) <= 18 && Bullets[i].y <= Aliens[j].y && Bullets[i].y>=Aliens[j].y-20 && (testShuttle.y - Aliens[j].y) >= 38 )
				{
					kills++;
					Bullets[i].y = -10;
					BoomSounds[Math.floor(Math.random()*9)].play();
					for(let t = 0;t<27;t++)
					{

						c.drawImage(explosionStages[t],Aliens[j].x-50, Aliens[j].y-50,100,100);
						// c.clearRect(Aliens[j].x-25, Aliens[j].y-25,100,100);
					}
					var addAlien = new alien(Math.random()*(window.innerWidth-100)+60, Math.random()*(window.innerHeight/2-300),Math.floor(Math.random()*2));
					Aliens[j] = addAlien;

					//Increase difficulty with kills 
					if(kills % 10 == 0){
						alienSpeed += 0.1;
					}		
					if(kills % 20 == 0){
						level++;
						var levelupAlien = new alien(Math.random()*(window.innerWidth-100)+60, Math.random()*(window.innerHeight/2-300),Math.floor(Math.random()*2));
						Aliens.push(levelupAlien);
						maxAliens++;
					}
					
				}
			}
		}
	}

	//DEAD STATE
	else{
		var j;
		for(j = 0;j<maxStars ; j++){
			c.beginPath();
			c.fillStyle = 'rgba(255,255,255,0.4)';
			c.arc(Stars[j].x,Stars[j].y,Stars[j].rad , 0 , Math.PI * 2 , false);
			Stars[j].y += starSpeed;
			if(Stars[j].y >= window.innerHeight-20){
				Stars[j].y = 0;
			}
			c.closePath();
			c.fill();
		}
		c.beginPath();
		c.fillStyle = 'rgba(255,255,255,0.5)';
		c.font = "30px Calibri";
		c.fillText("GAME OVER!" , (window.innerWidth-20)/2 - 55 , (window.innerHeight-20)/2 - 30);
		c.fillText("Kills : " + kills , (window.innerWidth-20)/2 - 15 , (window.innerHeight-20)/2 );
		c.fillText("Accuracy : " + (kills*100/totalBullets).toFixed(2), (window.innerWidth-20)/2 - 55 , (window.innerHeight-20)/2 + 30);
	}

	requestAnimationFrame(draw);
}

window.addEventListener("keydown", keysPressed, false );
window.addEventListener("keyup", keysReleased, false);


 
function keysPressed(e) {
	// store an entry for every key pressed
	if(flag==0)
	{
		Alive = 1;
		flag=1;
	}
	keys[e.keyCode] = true;
}
 
function keysReleased(e) {
    // mark keys that were released
	keys[e.keyCode] = false;
	if(e.keyCode==32)
	{
		var temp = new bullet(testShuttle.x , testShuttle.y - midBottomh - cannonh);
			if(Alive)
			{
				totalBullets++;
				Bullets.push(temp);
				bulletSound.play();
			}
	}
}       
 
