const canvas = document.querySelector('canvas');
const char = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

char.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new sprite({
    position : {
        x : 0,
        y : 0,
    },
    imagesrc : './img/background.png'
})

const shop = new sprite({
    position : {
        x : 610,
        y : 128,
    },
    imagesrc : './img/shop.png',
    scale : 2.75,
    maxframe : 6,
})

const player = new fighter({
    position : {
        x : 256,
        y : 100,
    },
    velocity : {
        x : 0,
        y : 0
    },
    offset : {
        x : 0,
        y : 0,
    },
    color : 'red',
    imagesrc : './img/Player1/Idle.png',
    maxframe : 8,
    scale : 2.5,
    offset : {
        x : 170,
        y : 103,
    },
    sprites : {
        idle : {
            imagesrc : './img/Player1/Idle.png',
            maxframe : 10,
        },
        run : {
            imagesrc : './img/Player1/Run.png',
            maxframe : 8,
        },
        reverse : {
            imagesrc : './img/Player1/Reverse_Run.png',
            maxframe : 8,
        },
        jump : {
            imagesrc : './img/Player1/Jump.png',
            maxframe : 3,
        },
        fall : {
            imagesrc : './img/Player1/Fall.png',
            maxframe : 3,
        },
        attack1 : {
            imagesrc : './img/Player1/Attack1.png',
            maxframe : 7,
        },
        takehit : {
            imagesrc : './img/Player1/Take hit.png',
            maxframe : 3,
        },
        death : {
            imagesrc : './img/Player1/Death.png',
            maxframe : 7,
        },
    },
    attackBox : {
        offset : {
            x : 70,
            y : 30,
        },
        width : 100,
        height : 100,
    },
});

const enemy = new fighter({
    position : {
        x : 768,
        y : 100
    },
    velocity : {
        x : 0,
        y : 0
    },
    offset : {
        x : -50,
        y : 0,
    },
    color : 'blue',
    imagesrc : './img/Player2/idle.png',
    maxframe : 8,
    scale : 2.5,
    offset : {
        x : 220,
        y : 155,
    },
    sprites : {
        idle : {
            imagesrc : './img/Player2/Idle.png',
            maxframe : 8,
        },
        run : {
            imagesrc : './img/Player2/Run.png',
            maxframe : 8,
        },
        reverse : {
            imagesrc : './img/Player2/Reverse_Run.png',
            maxframe : 8,
        },
        jump : {
            imagesrc : './img/Player2/Jump.png',
            maxframe : 2,
        },
        fall : {
            imagesrc : './img/Player2/Fall.png',
            maxframe : 2,
        },
        attack1 : {
            imagesrc : './img/Player2/Attack1.png',
            maxframe : 6,
        },
        takehit : {
            imagesrc : './img/Player2/Take Hit.png',
            maxframe : 4,
        },
        death : {
            imagesrc : './img/Player2/Death.png',
            maxframe : 6,
        },
    },
    attackBox : {
        offset : {
            x : -180,
            y : 10,
        },
        width : 80,
        height : 110,
    },
});

console.log(player);

const keys = {
    a : {
        pressed : false
    },
    d : {
        pressed : false
    },
    w : {
        pressed : false
    },
    ArrowLeft : {
        pressed : false
    },
    ArrowRight : {
        pressed : false
    },
}

timerDecrease();

function animate(){
    window.requestAnimationFrame(animate);
    char.fillStyle = 'black';
    char.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    char.fillStyle = 'rgba(255, 255, 255, 0.1)';
    char.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    //Player Movement
    if(keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -5;
        player.switchSprite('reverse');
    }
    else if(keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5;
        player.switchSprite('run');
    }
    else{
        player.switchSprite('idle');
    }

    //PLayer Jump
    if(player.velocity.y < 0){
        player.switchSprite('jump');
    }
    else if(player.velocity.y > 0){
        player.switchSprite('fall');
    }

    //Enemy Movement
    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -5;
        enemy.switchSprite('run');
    }
    else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5;
        enemy.switchSprite('reverse');
    }
    else{
        enemy.switchSprite('idle');
    }

    //Enemy Jump
    if(enemy.velocity.y < 0){
        enemy.switchSprite('jump');
    }
    else if(enemy.velocity.y > 0){
        enemy.switchSprite('fall');
    }

    //Collision Detection (Player)
    if(collision({rectangle1 : player, rectangle2 : enemy}) && player.attacking && player.currentframe === 4){
        enemy.takehit();
        player.attacking = false;
        //console.log('player attacks');
        gsap.to('#enemyHP', {
            width : enemy.health + '%',
        })
    }

    //Player misses attack
    if(player.attacking && player.currentframe === 4){
        player.attacking = false;
    }

    //Collision Detection (Enemy)
    if(collision({rectangle1 : enemy, rectangle2 : player}) && enemy.attacking && enemy.currentframe === 2){
        player.takehit();
        enemy.attacking = false;
        //console.log('enemy attacks');
        gsap.to('#playerHP', {
            width : player.health + '%',
        })
    }

    //Enemy misses attack
    if(enemy.attacking && enemy.currentframe === 2){
        enemy.attacking = false;
    }

    //End Game
    if(enemy.health <= 0 || player.health <= 0){
        winner({player, enemy, timerID});
    }
}

animate();

window.addEventListener('keydown', (event) => {
    if(!player.dead){
        switch(event.key){
        //Player Key
        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd';
        break;
        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a';
        break;
        case 'w':
            player.velocity.y = -15;
        break;
        case 's':
            player.attack();
        break;
        }
    }

    if(!enemy.dead){
        switch(event.key){
            //Enemy Keys
            case 'ArrowRight':
                keys.ArrowRight.pressed = true;
                enemy.lastKey = 'ArrowRight';
            break;
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = 'ArrowLeft';
            break;
            case 'ArrowUp':
                enemy.velocity.y = -15;
            break;
            case 'ArrowDown':
                enemy.attack();
            break;
        }
    }
    //console.log(event.key);
})

window.addEventListener('keyup', (event) => {
    //Player Keys
    switch(event.key){
        case 'd':
            keys.d.pressed = false;
        break;
        case 'a':
            keys.a.pressed = false;
        break;
        case 'w':
            keys.w.pressed = false;
        break;
    }

    //Enemy Keys
    switch(event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
        break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
        break;
        case 'w':
            keys.w.pressed = false;
        break;
    }
    //console.log(event.key);
})