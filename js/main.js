(function (){
var resSpan = document.getElementsByTagName('span')[0];
var canvas = document.createElement("canvas");
var fire = document.getElementById("fire");

var ctx = canvas.getContext("2d");
var spaceShipHeigth = 40;
var spaceShipWidth = 40;
var monsterHeigth = 60;
var monsterWidth =60;

var score = 0;
var youLose = false;
var ship;
canvas.width = 480;
canvas.height = 600;

var spaceShpiMoveSpeed = 15;

var gameSpeed = 180;
var req;

document.body.appendChild(canvas);

init();

var monsters;
//draw game field
function fieldDraw() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height); 

}
//initialize game objects
function init(){   
   new createSpaceShip();
   monsters = new Array(); 
   monsters.push(new addSpriteRow(0 ));
   fieldDraw();
   canvas.onkeypress = spaceShipMove;
   document.addEventListener('keydown', spaceShipMove, false);
}

//add spaceship to scene
var img;
function createSpaceShip(){
 this.x = (canvas.width - spaceShipWidth)/2 ;
 this.y;
 img = new Image(); 
 img.src = 'img/spaceship.jpg'; 
 img.onload = function() {
     req =  requestAnimationFrame(motion);      
 }
}

function addSprite(x, y, cp){
  this.sprite =  new Image(); 
  this.sprite.src = cp ? 'sprites/monster12.png' : 'sprites/monster11.png';  
  this.x = x;
  this.y = y; 
  this.isKilled = false;
}
//add row of monsters
function addSpriteRow(i){
  var delay = 0; 
  var changePic = (i % 2 == 0) ? false : true;
  this.spArr = new Array();
  this.monsterY = 0;  
  for(var i = 0; i < canvas.width/monsterWidth; i++){
  	this.spArr.push(new addSprite(i * monsterWidth, this.monsterY, changePic));
  }
  this.draw = function(){    
        delay++;          
        if(delay % 30 ==0 ){
   	    changePic = !changePic;               
        for(var j = 0; j < this.spArr.length; j++) this.spArr[j].sprite.src = changePic ? 'sprites/monster12.png' : 'sprites/monster11.png';
        if(delay == gameSpeed){delay = 0; this.monsterY += monsterHeigth;}
    	 }
   }
}

//n**2 !!!! draw new monster rows. think about dif.
var addNewRow = 0;
function monsterDraw(aMonsters){
	if(aMonsters[0].monsterY !== addNewRow  && aMonsters[0].monsterY !=0 ) {
	  addNewRow = aMonsters[0].monsterY;	 
	   monsters.push(new addSpriteRow()); 	   
	}	
   for(var mCount = 0; mCount < aMonsters.length; mCount++){   
     aMonsters[mCount].draw();    	   
     for(var spNum = 0; spNum < aMonsters[mCount].spArr.length; spNum++)
       ctx.drawImage(aMonsters[mCount].spArr[spNum].sprite, aMonsters[mCount].spArr[spNum].x, aMonsters[mCount].monsterY, monsterWidth, monsterHeigth);        
     }
}
//n*3 think about perfomans
function checkLose(){
   for(var i = 0; i < monsters.length; i++ ){
   	 if(monsters[i].monsterY >= 9 * monsterHeigth){
      for(var j = 0; j < monsters[i].spArr.length; j++ ){
       if( !monsters[i].spArr[j].isKilled){
   	       window.cancelAnimationFrame(req); 
   	       ctx.clearRect(0, 0, canvas.width, canvas.height);      
           ctx.fillStyle  = "red";      
           ctx.font = 'bold 30px sans-serif';        
           ctx.fillText("YOU LOSE ", 180, 200);
           ctx.fillText("Press F5 for restart!", 120, 240);
           ctx.fillText("Your score:" + score, 130, 280);
           youLose = true;
      }
    }
   }
 }
}

//n**3 !! think about perfomans
function killCheck(){
	 for (var i =0; i < patrons.length; i ++){
   for(var k = 0; k < monsters.length; k++ ){
	 for (var j = 0; j < monsters[k].spArr.length; j++) {		
      
	     if(patrons.length > 0 &&  monsters[k] && patrons !== undefined
            && patrons[i].x  > monsters[k].spArr[j].x
            && patrons[i].x  < monsters[k].spArr[j].x + monsterWidth
            && patrons[i].y  < monsters[k].monsterY + monsterHeigth
            && !patrons[i].attecked){ 
                patrons[i].attecked = true;
                patrons[i].color = '#000';
   	            monsters[k].spArr[j].isKilled = true; 
   	            score+=100;
                resSpan.innerHTML=score;
   	       }
          monsters[k].spArr = massMonstorssClean(monsters[k].spArr);
       } 
      }
    }   
}

function patronsDraw(){
  if(patrons.length!=0) {
    for(var i=0; i < patrons.length; i++){
      if(patrons[i].y >= -3) patrons[i].y -=3; 
      else continue;  
       patrons[i].draw();
    }
 }  
}

//main draw loop
function motion() { 
   fieldDraw();    
   monsterDraw(monsters)
   ctx.drawImage(img, xPos, canvas.height-spaceShipWidth, spaceShipWidth, spaceShipHeigth)    
   patronsDraw();  
   patrons = massPatronsClean(patrons);   
   req =  requestAnimationFrame(motion);
   killCheck();
   checkLose();
}

var patrons = new Array();
var xPos = (canvas.width - spaceShipWidth)/2;
function spaceShipMove(e){	 
     if(e.keyCode === 37 || e.which ===37) xPos=(xPos > 0) ? xPos - spaceShpiMoveSpeed : xPos;     
     if(e.keyCode === 39 || e.which === 39)xPos=(xPos < canvas.width - spaceShipWidth ) ? xPos + spaceShpiMoveSpeed : xPos;     
     if((e.keyCode === 32 || e.which === 32) && !youLose){
      fire.play();
      patrons.push(new rect(xPos + spaceShipWidth/2, canvas.height - spaceShipHeigth - 5));   
      } 
}

function rect(x, y) {
    this.color = '#ddd'; 
    this.x = x; 
    this.attecked = false;
    this.y = y; 
    this.width = 2; 
    this.height = 3; 
    this.draw = function() 
    {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

function massPatronsClean(mas){ 
        return mas.filter(function(num){
                if(num.y <= -3) num.attecked = true;
      	       return (num.y >= -3 || !num.attecked);
         });
}
function massMonstorssClean(mas){   
   return mas.filter(function(number){
   	   return !number.isKilled;
   });
}
}());