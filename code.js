var canvas = document.querySelector('#canvas');
var c = canvas.getContext('2d');
canvas.width = window.innerWidth-20;	
canvas.height = window.innerHeight-20;	

var backgroundSound = new Howl({
			src: ['Sounds/bg.wav'],
			loop : true,
			autoplay : true,
			volume : 0.2
		});

backgroundSound.play();
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

// var deathSound = new Howl({
// 	src: ['death.mp3']
// });

var Alive = -1;			//1
var flag = 0;
var totalBullets = 0;
var kills = 0;
var health = 90;
var healthbarHeight;
var maxStars = 100;
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

var shuttle = function(x,y){
	this.x = x;
	this.y = y;
}

var star = function(x,y ,rad){
	this.x = x;
	this.y = y;
	this.rad = rad;
}

var alien = function(x,y){
	this.x = x;
	this.y = y;
}

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
	var temp = new star(Math.random()*(window.innerWidth-20), Math.random()*(window.innerHeight-20),Math.random()*5 );
	Stars.push(temp);
}
//Array of initial aliens
for(a = 0; a < aliensOnScreen; a++){
	var temp = new alien(Math.random()*(window.innerWidth-100)+60, Math.random()*(window.innerHeight/2-300));
	Aliens.push(temp);
}

var posx = window.innerWidth/2 , posy = window.innerHeight - baseBottomh - midBottomh - cannonh;

var testShuttle = new shuttle(posx, posy);

function dist(x1,y1,x2,y2){

	return(Math.sqrt((x1 - x2)**2 + (y1 - y1)**2 ));
}

requestAnimationFrame(draw);
function draw(){
	//Clear window
	c.clearRect(0,0,window.innerWidth, window.innerHeight);
	if(Alive == -1){
		c.beginPath();
		c.fillStyle = 'rgba(255,255,255,0.5)';
		c.font = "50px Calibri";
		c.fillText("|Space X|" , (window.innerWidth-20)/2 - 65 , (window.innerHeight-20)/2 - 70);
		c.font = "20px Calibri";
		c.fillText("Controls :" , (window.innerWidth-20)/2 - 10 , (window.innerHeight-20)/2 - 15);
		c.fillText("Arrow Keys  -  Move" , (window.innerWidth-20)/2 - 55 , (window.innerHeight-20)/2 + 10 );
		c.fillText("Spacebar       -  Shoot" , (window.innerWidth-20)/2 - 55 , (window.innerHeight-20)/2 + 35);
		c.font = "15px Calibri";
		c.fillText("Press any key to begin." , (window.innerWidth-20)/2 - 40 , (window.innerHeight-20)/2 + 110);
		c.fillText("(Sound : On)" , (window.innerWidth-20)/2 - 10 , (window.innerHeight-20)/2 + 125);
	}
	else if(Alive)
	{
	c.beginPath();
	//Health Bar
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
	//STARS
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
	
	//ALIENS
	for( j=0 ; j<Aliens.length ; j++)
	{
		c.fillStyle = alienColors[Math.floor(Math.random()*4)];
		c.beginPath();
		c.fillRect(Aliens[j].x - bunw/2,Aliens[j].y - faceh/2 - headh - bunh , bunw , bunh);
		c.fillRect(Aliens[j].x - headw/2 , Aliens[j].y - faceh/2 - headh, headw , headh);
		c.fillRect(Aliens[j].x - facew/2 , Aliens[j].y - faceh/2 , facew ,faceh);
		c.fillRect(Aliens[j].x + midh/2 , Aliens[j].y + faceh/2 , layer1w , layer1h);
		c.fillRect(Aliens[j].x - midh/2 -layer1w , Aliens[j].y + faceh/2 , layer1w , layer1h);
		c.fillRect(Aliens[j].x + midw/2 + layer1w/2 , Aliens[j].y + faceh/2 + layer1h , layer2w , layer2h);
		c.fillRect(Aliens[j].x - midw/2 - layer1w -2, Aliens[j].y + faceh/2 + layer1h , layer2w , layer2h);
		c.fillRect(Aliens[j].x - midw/2 , Aliens[j].y + faceh/2 + layer1h + layer2h , midw , midh );
		c.fillStyle = "black";
		//eyes
		c.fillRect(Aliens[j].x - headw/2 , Aliens[j].y , 8, 4);
		c.fillRect(Aliens[j].x + headw/2 - 8 , Aliens[j].y , 8, 4);
		c.closePath();
		c.fill();
		Aliens[j].y += alienSpeed;
		if(Math.abs(Aliens[j].y - testShuttle.y) <= 18 && Math.abs(Aliens[j].x - testShuttle.x)<=18 ||  Aliens[j].y >= window.innerHeight -30){	
			health-=30;
			if(health == 0)
			{
				Alive =  0;
			}
			BoomSounds[Math.floor(Math.random()*9)].play();
			var addAlien = new alien(Math.random()*(window.innerWidth-100)+60, Math.random()*(window.innerHeight/2-300));
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

	// left
    if (keys[37]) {
		if(testShuttle.x >= 30)
		testShuttle.x -= shuttleSpeedh;
	  }
   
	  // right
	  if (keys[39]) {
		  if(testShuttle.x <= window.innerWidth - 50)
		testShuttle.x += shuttleSpeedh;
	  }
   
	  // down
	  if (keys[38]) {
		if(testShuttle.y >= window.innerHeight/2)
		testShuttle.y -= shuttleSpeedv;
	  }
   
	  // up
	  if (keys[40]) {
		if(testShuttle.y <= window.innerHeight - baseBottomh - midBottomh - cannonh)
		testShuttle.y += shuttleSpeedv;
		
	  }
	
	// DRAWING THE SHUTTLE

	//Cannon
	c.beginPath();
	c.fillStyle = bulletColors[Math.floor(Math.random()*6)];		
	c.fillRect(testShuttle.x - cannonw/2 , testShuttle.y - midBottomh - cannonh ,cannonw,cannonh);	
	//Mid bottom
	c.fillRect(testShuttle.x - midBottomw/2, testShuttle.y  - midBottomh, midBottomw , midBottomh);
	//Mid top
	c.fillStyle = colorFront;
	c.fillRect(testShuttle.x- midTopw/2 ,  testShuttle.y - midToph, midTopw,midToph);
	c.closePath();
	//BaseBottom
	c.fillStyle = bulletColors[Math.floor(Math.random()*6)];
	c.fillRect(testShuttle.x- baseBottomw/2 , testShuttle.y ,baseBottomw,baseBottomh);
	//BaseTop
	c.fillStyle = colorFront;
	c.fillRect(testShuttle.x- baseTopw/2 ,  testShuttle.y  , baseTopw , baseToph);
	//Ridge
	c.fillStyle = "black";
	c.fillRect(testShuttle.x- ridgew/2 , testShuttle.y + baseToph - ridgeh, ridgew,ridgeh);
	//Tail
	c.fillStyle = bulletColors[Math.floor(Math.random()*8)];
	c.fillRect(testShuttle.x + baseBottomw/2 , testShuttle.y + baseBottomh,7,7);
	c.fillRect(testShuttle.x - baseBottomw/2 - 7,testShuttle.y + baseBottomh,7,7 );
	c.closePath();
	c.fill();


	for(i=0;i<Bullets.length;i++)
	{
		for(j=0;j<maxAliens;j++)
		{
			if(Math.abs(Bullets[i].x - Aliens[j].x) <= 18 && Bullets[i].y <= Aliens[j].y && (testShuttle.y - Aliens[j].y) >= 38 )
			{
				kills++;
				Bullets[i].y = -10;
				// deathSound.play();
				BoomSounds[Math.floor(Math.random()*9)].play();
				var addAlien = new alien(Math.random()*(window.innerWidth-100)+60, Math.random()*(window.innerHeight/2-300));
				Aliens[j] = addAlien;
				if(kills == 10 || kills == 20 || kills == 30 || kills == 40 || kills==50 || kills == 60 )
					alienSpeed += 0.1;
			}
		}
	}
	}
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
		c.fillStyle = 'rgba(255,255,255,0.7)';
		c.font = "30px Arial";
		c.fillText("GAME OVER!" , (window.innerWidth-20)/2 - 55 , (window.innerHeight-20)/2 - 30);
		c.fillText("Kills : " + kills , (window.innerWidth-20)/2 - 10 , (window.innerHeight-20)/2 );
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
 