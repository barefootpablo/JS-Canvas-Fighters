const canvas = document.querySelector('canvas');
const c =  canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './imgs/background.png'
})

const shop = new Sprite({
    position: {
        x: 625,
        y: 128
    },
    imageSrc: './imgs/shop.png',
    scale: 2.75,
    framesMax: 6
})

const player = new Fighter ({
    position: {
    x: 0,
    y: 0
}, velocity: {
    x: 0,
    y: 0
}, offset: {
    x: 0,
    y: 0
}
})



const enemy = new Fighter ({
    position: {
    x: 400,
    y: 100
}, velocity: {
    x: 0,
    y: 0
}, color : 'blue',
offset: {
    x: -50,
    y: 0
}
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //Movimiento jugador
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
    }

    //Movimiento enemigo
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
    }

    //Detectar Colisión
    if (
    rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
    }) &&
    player.isAttacking
      
    ) {
        player.isAttacking = false
        enemy.health -= 20
        document.querySelector('#enemyHealth').style.width = enemy.health + '%';
    }

    if (
    rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
    }) &&
    enemy.isAttacking
          
    ) {
        enemy.isAttacking = false
        player.health -= 20
        document.querySelector('#playerHealth').style.width = player.health + '%';
    }

    //Vida llega a cero
    if (enemy.health <= 0 || player.health <= 0){
        determineWinner({player, enemy, timerId})
    }
}

animate()

window.addEventListener('keydown', (event) => {
    console.log(event.key)
    switch (event.key) {
//Direccionales jugador
        case 'd': 
            keys.d.pressed = true
            player.lastKey = 'd'
            break

        case 'a': 
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        
        case 'w': 
            player.velocity.y = -20
            break

//Comandos jugador
        case ' ':
            player.attack()
            break

//Direccionales enemigo
        case 'ArrowRight': 
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break

        case 'ArrowLeft': 
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        
        case 'ArrowUp': 
            enemy.velocity.y = -20
            break

//Comandos enemigo
        case 'ArrowDown': 
            enemy.attack()
            break
    }
    console.log(event.key);
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
//Direccionales jugador
        case 'd': 
            keys.d.pressed = false
            break

        case 'a': 
            keys.a.pressed = false
            break

        case 'w': 
            keys.w.pressed = false
            break

//Direccionales enemigo
        case 'ArrowRight': 
            keys.ArrowRight.pressed = false
            break

        case 'ArrowLeft': 
            keys.ArrowLeft.pressed = false
            break

        case 'ArrowUp': 
            keys.ArrowUp.pressed = false
            break
    }
    console.log(event.key);
})