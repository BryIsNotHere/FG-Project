class sprite{
    constructor({
        position, 
        imagesrc, 
        scale = 1, 
        maxframe = 1, 
        offset = {x : 0, y: 0}
        }){
        this.position = position;
        this.width = 50;
        this.height = 150;
        this.image = new Image();
        this.image.src = imagesrc;
        this.scale = scale;
        this.maxframe = maxframe;
        this.currentframe = 0;
        this.elapsedframe = 0;
        this.holdframe = 4;
        this.offset = offset;
    }

    draw(){
        char.drawImage(this.image, this.currentframe * (this.image.width / this.maxframe), 0, this.image.width / this.maxframe, this.image.height,
        this.position.x - this.offset.x, this.position.y - this.offset.y, (this.image.width / this.maxframe) * this.scale, 
        this.image.height * this.scale);
    }

    frameanimate(){       
        this.elapsedframe++;

        if(this.elapsedframe % this.holdframe === 0){
            if(this.currentframe < this.maxframe - 1){
            this.currentframe++;
            }
            else{
                this.currentframe = 0;
            }
        }  
    }

    update(){
        this.draw();
        this.frameanimate();
    }
}

class fighter extends sprite{
    constructor({
        position, 
        velocity, 
        color, 
        imagesrc, 
        scale = 1, 
        maxframe = 1, 
        offset = {x : 0, y: 0}, 
        sprites,
        attackBox = {offset : {}, width : undefined, height : undefined}
        }){
        super({
            position,
            imagesrc,
            scale,
            maxframe,
            offset,
        });
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.lastKey;
        this.attackBox = {
            position : {
                x : this.position.x,
                y : this.position.y,
            },
            offset : attackBox.offset,
            width : attackBox.width,
            height : attackBox.height,
        }
        this.color = color;
        this.attacking;
        this.health = 100;
        this.currentframe = 0;
        this.elapsedframe = 0;
        this.holdframe = 4;
        this.sprites = sprites;
        this.dead = false;

        for(const sprite in this.sprites){
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imagesrc;
        }
    }

    update(){
        this.draw();
        if(!this.dead) this.frameanimate();

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

        //Hitbox Indicator
        //char.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        //Gravity Function
        if (this.position.y + this.velocity.y + this.height >= canvas.height - 96){
            this.velocity.y = 0;
            this.position.y = 330;
        }
        else{
            this.velocity.y += gravity;
        }
        //console.log(this.position.y)
    }

    attack(){
        this.switchSprite('attack1');
        this.attacking = true;
    }

    takehit(){
        this.health -= 10;

        if(this.health <= 0){
            this.switchSprite('death');
        }
        else{
            this.switchSprite('takehit');
        }
    }

    switchSprite(sprite){
        if(this.image === this.sprites.death.image){
            if(this.currentframe === this.sprites.death.maxframe - 1) this.dead = true;
            return;
        }

        //override all animations while attacking
        if(this.image === this.sprites.attack1.image && this.currentframe < this.sprites.attack1.maxframe - 1) return;

        //override all animations while get hit
        if(this.image === this.sprites.takehit.image && this.currentframe < this.sprites.takehit.maxframe - 1) return;

        switch(sprite){
            case 'idle':
                if(this.image !== this.sprites.idle.image){
                    this.image = this.sprites.idle.image;
                    this.maxframe = this.sprites.idle.maxframe;
                    this.currentframe = 0;
                }
                break;
            case 'run':
                if(this.image !== this.sprites.run.image){
                    this.image = this.sprites.run.image;
                    this.maxframe = this.sprites.run.maxframe;
                    this.currentframe = 0;
                }
                break;
            case 'reverse':
                if(this.image !== this.sprites.reverse.image){
                    this.image = this.sprites.reverse.image;
                    this.maxframe = this.sprites.reverse.maxframe;
                    this.currentframe = 0;
                }
                break;
            case 'jump':
                if(this.image !== this.sprites.jump.image){
                    this.image = this.sprites.jump.image;
                    this.maxframe = this.sprites.jump.maxframe;
                    this.currentframe = 0;
                }
                break;
            case 'fall':
                if(this.image !== this.sprites.fall.image){
                    this.image = this.sprites.fall.image;
                    this.maxframe = this.sprites.fall.maxframe;
                    this.currentframe = 0;
                }
                break;
            case 'attack1':
                if(this.image !== this.sprites.attack1.image){
                    this.image = this.sprites.attack1.image;
                    this.maxframe = this.sprites.attack1.maxframe;
                    this.currentframe = 0;
                }
                break;
            case 'takehit':
                if(this.image !== this.sprites.takehit.image){
                    this.image = this.sprites.takehit.image;
                    this.maxframe = this.sprites.takehit.maxframe;
                    this.currentframe = 0;
                }
                break;               
            case 'death':
                if(this.image !== this.sprites.death.image){
                    this.image = this.sprites.death.image;
                    this.maxframe = this.sprites.death.maxframe;
                    this.currentframe = 0;
                }
                break;
        }
    }
}