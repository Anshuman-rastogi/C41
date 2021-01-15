class Game {
  constructor(){

  }

  getState(){
    var gameStateRef  = database.ref('gameState');
    gameStateRef.on("value",function(data){
       gameState = data.val();
    })

  }

  update(state){
    database.ref('/').update({
      gameState: state
    });
  }

  async start(){
    if(gameState === 0){
      player = new Player();
      var playerCountRef = await database.ref('playerCount').once("value");
      if(playerCountRef.exists()){
        playerCount = playerCountRef.val();
        player.getCount();
      }
      form = new Form()
      form.display();
    }

    car1 = createSprite(100,200);
    car1.addImage("car1",car1_img);
    car2 = createSprite(300,200);
    car2.addImage("car2",car2_img);
    car3 = createSprite(500,200);
    car3.addImage("car3",car3_img);
    car4 = createSprite(700,200);
    car4.addImage("car4",car4_img);
    cars = [car1, car2, car3, car4];

    passedFinish = false;
  }

  play(){
    form.hide();
    
    Player.getPlayerInfo();

    player.getFinishedPlayers();
    
    if(allPlayers !== undefined){
      background(rgb(198,135,103));
      image(track, 0,-displayHeight*4,displayWidth, displayHeight*5);
      
      //var display_position = 100;
      
      //index of the array
      var index = 0;

      //x and y position of the cars
      var x = 170 ;
      var y;

      for(var plr in allPlayers){
        //add 1 to the index for every loop
        index = index + 1 ;

        //position the cars a little away from each other in x direction
        x = x + 240;
        //use data form the database to display the cars in y direction
        y = displayHeight - allPlayers[plr].distance;
        cars[index-1].x = x;
        cars[index-1].y = y;

        if (index === player.index){
          cars[index - 1].shapeColor = "red";
          fill(255);
          ellipse(x, y, 80, 80);
          camera.position.x = displayWidth/2;
          camera.position.y = cars[index-1].y;
        }
       
        textSize(20);
        fill("blue");
        text(allPlayers[plr].name, cars[index-1].x-25, cars[index-1].y+65);
      }

    }

    if(keyIsDown(UP_ARROW) && player.index !== null && passedFinish !== true){
      player.distance +=10
      player.update();
    }

    if(player.distance > 4200 && passedFinish === false){
      Player.updateFinishedPlayers();
      player.rank = finishedPlayers;
      player.update();
      passedFinish = true;
    }
   
    drawSprites();
  }

  displayRanks(){
    //console.log("Game Ended");
    camera.position.x = 0;
    camera.position.y = 0;
    imageMode(CENTER);
    Player.getPlayerInfo();
    image(bronzeimg, displayWidth/-4, -100+displayHeight/9, 200, 240);
    image(silverimg, displayWidth/4, -100+displayHeight/10, 225, 270);
    image(goldimg, 0, -100, 250, 300);

    textAlign(CENTER);
    textSize(50);
    fill(0);
    for(var i in allPlayers){
      if(allPlayers[i].rank === 1){
        text("1st🥇: " + allPlayers[i].name, 0, 85);
      }
      else if(allPlayers[i].rank === 2){
        text("2nd🥈: " + allPlayers[i].name, displayWidth/4, displayHeight/9 + 73);
      }
      else if(allPlayers[i].rank === 3){
        text("3rd🥉: " + allPlayers[i].name, displayWidth/-4, displayHeight/10 + 76);
      }
      else{
        textSize(30);
        text("Thank You for participating and finishing🎉: " + allPlayers[i].name, 0, 225);
      }

    }
  }
}
