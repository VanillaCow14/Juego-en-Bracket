var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            enableBody: true,
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var asteroids;
var score = 0;
var scoreText;
var timer;

var game = new Phaser.Game(config);

function preload() {
    this.load.image('ship', 'images/ship.png');
    this.load.image('asteroid', 'images/asteroid.png');
}

function create() {
    player = this.physics.add.image(400, 300, 'ship');
    player.setCollideWorldBounds(true);
    player.setScale(0.03); // Ajusta la escala para hacer la nave 100 veces más pequeña

    asteroids = this.physics.add.group({
        key: 'asteroid',
        repeat: 10,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    asteroids.children.iterate(function (asteroid) {
        asteroid.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        asteroid.setScale(0.01); // Ajusta la escala para hacer los asteroides 100 veces más pequeños
    });

    this.physics.add.collider(asteroids, asteroids);
    this.physics.add.collider(player, asteroids, gameOver, null, this);

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });  
        
 timer = this.time.addEvent({
        delay: 1000, // 1000 ms = 1 segundo
        loop: true,
        callback: function () {
            score += 10;
        }
    });

    this.input.on('pointermove', function (pointer) {
        player.x = pointer.x;
        player.y = pointer.y;
    });
}

function update() {
    if (player.active) {
        if (score % 10 === 0) {
            spawnAsteroid();
        }

        scoreText.setText('Score: ' + score);

        asteroids.children.iterate(function (asteroid) {
            if (asteroid.y > config.height) {
                asteroid.y = 0;
                asteroid.x = Phaser.Math.Between(0, config.width);
                score += 1;
            }
        });
        
        this.input.on('pointermove', function (pointer) {
        player.x = pointer.x;
        player.y = pointer.y;
    });
    }
}

function spawnAsteroid() {
    var asteroid = asteroids.create(Phaser.Math.Between(0, config.width), 0, 'asteroid');
    asteroid.setBounce(1);
    asteroid.setCollideWorldBounds(true);
    asteroid.setVelocity(Phaser.Math.Between(-200, 200), 200);
    asteroid.setScale(0.01); // Ajusta la escala para hacer los asteroides 100 veces más pequeños
}

function gameOver() {
    player.setActive(false).setVisible(false);
    asteroids.clear(true, true);
    this.physics.pause();
    alert('Game Over! Your score: ' + score);
    resetGame();
}

function resetGame() {
    player.setActive(true).setVisible(true);
    score = 0;
    timer.reset({ delay: 1000, loop: true }); // Reinicia el temporizador
    this.physics.resume();
}