//declaration variables utiles
let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');
canvas.height = 700;
canvas.width = 800;
let pressed = {
    left : false,
    right: false,
};
const scoreEl = document.querySelector('#scoreEl');
const lifeEL = document.querySelector('#lifeEl');
const startGameButton = document.querySelector('#startGameButton');
const startScorboard = document.querySelector('#startScorboard');
const totalScore = document.querySelector('#totalScore');

let bullets = [];
let enemies=[];  
let smallEnemies =[];
let particles = [];
let shield = [];

//creation et paramètres du hero

class Hero{
    constructor(x, y, width, height, color){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;

        this.color = function(){
            // composite 
            ctx.globalCompositeOperation = "source-in";
            // affiche couleur
            ctx.fillStyle = "red";
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.globalCompositeOperation = "source-over";
        }
    
        this.post = function () {

            let img = new Image();
            img.src = './medias/hero.png';
            ctx.drawImage(img,this.x,this.y,this.width,this.height)       
        }
    
        //déplacer le hero avec la souris
    
        window.addEventListener('mousemove',(event)=>{
            let relativeX = event.clientX  - canvas.offsetLeft;
            if (relativeX > (this.x*-1) && relativeX < canvas.width - (this.width/2)) {
                this.x = relativeX - this.width/2;
                 }
        }) 
    
    
        this.moveX = function(moveX){
            this.x += moveX
        }
    
        //gestion des collision gauche et droite
        this.wallCollide = function () {
            if (this.x > canvas.width - this.width) this.x = canvas.width-this.width;
            else if (this.x <= 0) this.x = 0
            }
                
            
        //déplacer le hero avec le clavier
        this.update = function(){
            this.post();
            this.wallCollide();
            if (pressed.right){
                hero.moveX(4);
            } 
            if (pressed.left){
                hero.moveX(-4);
            } 
                     
        }
    }

}

//Création et paramètres du bouclier

class Shield{
    constructor(x,y,radius,color,velocity){
        
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;

    
        this.post = function () {
            ctx.beginPath();
            ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
            ctx.fillStyle = this.color;
            ctx.stroke()
        }     
        //collision des particule contre les murs 
        this.moveX = function(moveX){
            this.x += moveX           
        }


        
        //déplacer le bouclier avec la souris

       
        this.update = function () {
            this.post();

            if (pressed.shield){
                this.radius = this.radius + this.velocity;
            }

        }
        
        this.clear = function () {
            ctx.clearRect(this.x, this.y, this.width, this.height)
        }
        
    }
}


//creation et paramètres des balles 

class Bullet{
    constructor(x,y,width,height,sprite,space){
    
        this.x = x;
        this.y = y;
        this.width = width;
        this.height= height;
    
        this.post = function () {
             if(sprite == null){
                 ctx.fillRect(this.x,this.y,this.width,this.height);
             } else{
                let img = new Image();
                img.src = './medias/hero.png';
                ctx.drawImage(img,this.x,this.y,this.width,this.height)
             }
        }
    
    
        this.moveY = function (shoot) {
            this.y += shoot;
        }
    
        this.update = function () {
            this.post();
            if(space) this.moveY(-5);
        }
        this.clear = function () {
            ctx.clearRect(this.x, this.y, this.width, this.height)
        }
        
    }
} 

//creation et paramètre des enemies

class Enemy{
    constructor(text,x,y,width,height,sprite,space){
        
        this.text = text;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height= height;
       

    
        this.post = function () {
            ctx.fillStyle = '#000000'
            ctx.font = 'bold 20px Montserrat, sans-serif';
            let textWidth = ctx.measureText(text).width;
            ctx.fillText(this.text,this.x , this.y,textWidth);
   
        }        
       
     this.moveX = function (showLetters) {
            this.x + showLetters;
        }
    
        this.update = function () {
            this.post();
            // this.moveX(30)
           
        }
        
        this.clear = function () {
            ctx.clearRect(this.x, this.y, this.width, this.height)
        }
        
    }
}


class SmallEnemy{
    constructor(text,x,y,width,height,sprite,space){
        
        this.text = text;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height= height;
       

    
        this.post = function () {
            ctx.fillStyle = 'black'
            ctx.font = 'bold 15px Montserrat, sans-serif';
            let textWidth = ctx.measureText(text).width;
            ctx.fillText(this.text,this.x , this.y,textWidth);
   
        }        
       
     this.moveX = function (showLetters) {
            this.x + showLetters;
        }
    
        this.update = function () {
            this.post();
            // this.moveX(30)
           
        }
        
        this.clear = function () {
            ctx.clearRect(this.x, this.y, this.width, this.height)
        }
        
    }
}

//Création des particules d'explosion


class Particle{
    constructor(x,y,radius,color,velocity){
        
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;

    
        this.post = function () {
            ctx.beginPath();
            ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
            ctx.fillStyle = this.color;
            ctx.fill()
        }     
        //collision des particule contre les murs 
        this.move = function(){
            if (this.radius >=3) {
                if(this.y + this.velocity.y < this.radius){
                    this.velocity.y = - this.velocity.y
                }
                if(this.x + this.velocity.x > canvas.width - this.radius || this.x + this.velocity.x < this.radius){
                    this.velocity.x = - this.velocity.x
                }
                
            }
            
        }
       
        this.update = function () {
            this.post();
            this.move()
            this.x = this.x + this.velocity.x;
            this.y = this.y +this.velocity.y 
        }
        
        this.clear = function () {
            ctx.clearRect(this.x, this.y, this.width, this.height)
        }
        
    }
}




//déplacement au clavier et tir de projectiles au clavier
// affectation des touches du clavier

window.addEventListener('keyup', function(event){
    switch(event.keyCode ){
        case 39:
            pressed.right = false;
            break;

        case 37:
            pressed.left = false;
            break;
        
        case 68:
            pressed.shield = false;
            break
    }
})

window.addEventListener('keydown', function(event){
    switch(event.keyCode ){
        case 39:
            pressed.right = true;
            break;

        case 37:
            pressed.left = true;
            break;

        case 68:
            pressed.shield = true;
            if(shield.length < 1 ){
                shield.push(new Shield(hero.x + hero.width/2, hero.y + hero.height/2, 2,'red', 2));
            } 
            break;

        case 32: 
            if(bullets.length<8){
                bullets.push(new Bullet(hero.x+hero.width/2-10, hero.y, 20, 20, false, true));
            }
    }
    
})


//tir de projectiles au click

window.addEventListener('click',()=>{
    if(bullets.length<8){
        bullets.push(new Bullet(hero.x+hero.width/2-10, hero.y, 20, 20, false, true));
    }
})




// démarrer le minuteur
function updateCountdown() {
     sec = 30;
    let startTimer = setInterval(function() {
    document.getElementById("timer").innerHTML = sec+'s';
    sec--;
         
    if(sec < 0){
        clearInterval(startTimer)
        startScorboard.style.display = 'flex';
        totalScore.innerHTML = score;
        cancelAnimationFrame(animationId);
    }
    }, 1000);

}


function init(){//reinitialise les paramètres du jeu

    let text = 'SALUT JE SUIS LANDRY KOFFI'

    let smallText = 'Je suis developpeur web en formation chez simplon.co.'
    let smallTextLine2 = 'J\'apprend le Javascript, le php et la qualité projet'
    let smallTextLine3 ='N\'hésitez pas à consulter mes derniers projets'
    let smallTextLine4 = 'sur la page de mon portfolio'

    hero = new Hero(canvas.width/2,canvas.height - 69, 64, 64)
    bullets = [];
    enemies = [];
    smallEnemies = [];
    particles = [];
    score = 0;
    life = 10;
    scoreEl.innerHTML = score;
    totalScore.innerHTML = score;
    lifeEL.innerHTML = life;
    startGameButton.innerHTML = 'PLAY AGAIN' ;
    let gap=0;
    let gap2 = 0;
    let gap3 = 0;
    let gap4 =0;
    for (let i = 0; i < text.length; i++){
        let positionX = 170.5;
        let positionY = 250;

        enemies.push( (new Enemy(text[i],positionX+i*18,positionY,ctx.measureText(text[i]).width)));
    }

    for (let i = 0; i < smallText.length; i++){
        let positionX = 35.5;
        let positionY = 300;
        if (smallText[i]=='i' || smallText[i]=='l'|| smallText[i]==''||smallText[i]=='o'||smallText[i]=='m'|| smallText[i]=='s') {
        gap += 10
        }else{
         gap +=16
        }
        smallEnemies.push( (new SmallEnemy(smallText[i],positionX +=gap,positionY,ctx.measureText(smallText[i]).width)));
    }

    for (let i = 0; i < smallTextLine2.length; i++){
        let positionX = 25;
        let positionY = 330;
        if (smallTextLine2[i]=='i' || smallTextLine2[i]=='l'|| smallTextLine2[i]==''||smallTextLine2[i]=='o'||smallTextLine2[i]=='m'|| smallTextLine2[i]=='s') {
            gap2 += 10
        }else{
            gap2 +=16
        }
        smallEnemies.push( (new SmallEnemy(smallTextLine2[i],positionX +=gap2,positionY,ctx.measureText(smallTextLine2[i]).width)))
        console.log(smallEnemies[i])

    }

    for (let i = 0; i < smallTextLine3.length; i++){
        let positionX = 75;
        let positionY = 360;
        if (smallTextLine3[i]=='i' || smallTextLine3[i]=='l'|| smallTextLine3[i]==''||smallTextLine3[i]=='o'||smallTextLine3[i]=='m'|| smallTextLine3[i]=='s') {
            gap3 += 10
        }else{
            gap3 +=16
        }
        smallEnemies.push( (new SmallEnemy(smallTextLine3[i],positionX +=gap3,positionY,ctx.measureText(smallTextLine3[i]).width)))
        console.log(smallEnemies[i])

    }

    for (let i = 0; i < smallTextLine4.length; i++){
        let positionX = 200;
        let positionY = 390;
        if (smallTextLine4[i]=='i' || smallTextLine4[i]=='l'|| smallTextLine4[i]==''|| smallTextLine4[i]=='s') {
            gap4 += 10
        }else{
            gap4 +=16
        }
        smallEnemies.push( (new SmallEnemy(smallTextLine4[i],positionX +=gap4,positionY,ctx.measureText(smallTextLine4[i]).width)))
        console.log(smallEnemies[i])

    }
    

}

let animationId ;
let hero = new Hero(canvas.width/2,canvas.height - 69, 64, 64);


function Update() {

    animationId = requestAnimationFrame(Update);
    // ctx.fillStyle = 'rgba(0,0,0,0.1)'
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    hero.update();

    for (let s = 0; s < shield.length; s++){
        shield[s].update();
        shield[s].x = hero.x+hero.width/2
        if(shield[s].radius>120){
            shield = 0;
        }
    }

    for (let a = 0; a < particles.length;a++){    
        particles[a].update();

        if(particles[a].y > canvas.height){
            particles.splice(a,1)
        }

        if (collides(particles[a],hero)) { //Dégats héros et Fin du jeu
            particles.splice(a,1);
            life -= 1
            lifeEL.innerHTML = life;
            hero.color()
            if (life == 0) {
                startScorboard.style.display = 'flex';
                totalScore.innerHTML = score;
                cancelAnimationFrame(animationId);
                // clearInterval(startTimer)
            }
        }

        if (CirclesColliding(particles[a],shield[0])){//supprimer les partiules a la collision avec le bouclier
            particles.splice(a,1);
        }
    }

 
    
    for (let j = 0; j < enemies.length;j++){    
        enemies[j].update();
    }
    for (let j = 0; j < smallEnemies.length;j++){    
        smallEnemies[j].update();
    }

          
    for(let i = 0; i < bullets.length; i++){
        bullets[i].update();
        
        if(bullets[i] != undefined && bullets[i].y*-1 +canvas.height  > canvas.height - bullets[i].height){
            bullets.splice(i,1);
        }
        
        for (let j = 0; j < enemies.length; j++){    
            if ( enemies[j] !='' && bullets[i] != undefined && enemies[j] != undefined && bullets[i].y < enemies[j].y && bullets[i].x > enemies[j].x - enemies[j].width  && bullets[i].x < enemies[j].x + enemies[j].width ) {
                //score
                score += 10;
                scoreEl.innerHTML = score
                
                setTimeout(() => {  //Supprimer l'enemie avec un léger retardement après la collision 
                enemies.splice(j,1);
                }, 0);

                bullets.splice(i,1);
                
                //déployer les particules a la collision Balle/Lettre
                for (let i = 0; i < 5; i++) {
                    if (enemies[j] != undefined) {
                        particles.push(new Particle(enemies[j].x, enemies[j].y, 3 , 'red',{x:Math.random() *3,
                            y: Math.random() *-4})) 
                          
                    }
                    
                }

              
            }
          
        }

        for (let j = 0; j < smallEnemies.length; j++){    
            if ( smallEnemies[j] !='' && bullets[i] != undefined && smallEnemies[j] != undefined && bullets[i].y < smallEnemies[j].y && bullets[i].x > smallEnemies[j].x - smallEnemies[j].width  && bullets[i].x < smallEnemies[j].x + smallEnemies[j].width ) {
                //score
                score += 5;
                scoreEl.innerHTML = score
                
                setTimeout(() => {  //Supprimer l'enemie avec un léger retardement après la collision 
                smallEnemies.splice(j,1);
                }, 0);

                bullets.splice(i,1);
                
                //déployer les particules a la collision Balle/Lettre
                for (let i = 0; i < 2; i++) {
                    if (smallEnemies[j] != undefined) {
                        particles.push(new Particle(smallEnemies[j].x, smallEnemies[j].y ,Math.floor(Math.random() *3)  , '#FFFFFF',{x:Math.random()*2.5  ,
                            y: Math.random()*3  })) 
                          
                    }
                    
                }

              
            }
          
        }
      
    }
  
    

    
}

function collides(spriteOne, spriteTwo){
	if(spriteOne!= undefined && spriteTwo !=undefined && spriteOne.x > spriteTwo.x && spriteOne.x < spriteTwo.x+spriteTwo.width && spriteOne.y > spriteTwo.y){
		return true;
	}
}
function CirclesColliding(cercle1,cercle2){
    if(cercle1!= undefined && cercle2 != undefined && (cercle2.x-cercle1.x)*(cercle2.x-cercle1.x)+(cercle2.y-cercle1.y)*(cercle2.y-cercle1.y)<=(cercle1.radius+cercle2.radius)*(cercle1.radius+cercle2.radius)){
        return true;
    };
}


startGameButton.addEventListener('click',()=>{
    shield = []
    init();
    updateCountdown();
    requestAnimationFrame(Update);
    startScorboard.style.display = 'none';
})



