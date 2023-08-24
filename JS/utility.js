function collision({rectangle1, rectangle2}){
    return(
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= 
        rectangle2.position.x && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y  + enemy.height
    )
}

function winner({player, enemy, timerID}){
    clearTimeout(timerID);
    document.querySelector('#match-result').style.display = 'flex';
    if(player.health === enemy.health){
        document.querySelector('#match-result').innerHTML = 'DRAW';            
    }
    else if(player.health > enemy.health){
        document.querySelector('#match-result').innerHTML = 'THUNDER (P1) WINS'; 
    }
    else if(player.health < enemy.health){
        document.querySelector('#match-result').innerHTML = 'RONIN (P2) WINS';
    }
}

let timer = 60;
let timerID;

function timerDecrease(){
    if(timer > 0){
        timerID = setTimeout(timerDecrease, 1000);
        timer--;
        document.querySelector('#timer').innerHTML = timer;
    }

    if(timer === 0){       
        winner({player, enemy, timerID});
    }   
}