let canvas = document.getElementById("canvas");
let c = canvas.getContext("2d");

let startScreen = document.getElementById("startScreen");
let game = document.getElementById("game");
let restart = document.getElementById("restart");

let scoreElement = document.getElementById("score");
let scoreDiv = document.getElementById("scoreDiv");
let sound = new Audio("https://www.pacdv.com/sounds/fart-sounds/fart-2.wav");
let backgroundMusic = new Audio(
  "https://www.looperman.com/media/loops/2787459/looperman-l-2787459-0238255-spanish-guitar-las-calles-makalo-loop.mp3"
);
let splat = new Audio(
  "https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-55112/zapsplat_impacts_wood_pole_hit_smack_into_dirt_and_small_stones_006_57471.mp3?_=1"
);

let scream = new Audio(
  "https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-lukas-tvrdon/lukas_tvrdon_eris_pain_scream%20short_3_110.mp3"
);

let bossMusic = new Audio(
  "https://cdn2.melodyloops.com/mp3/preview-explosion-hybrid-trailer.mp3"
);
backgroundMusic.loop = true;
bossMusic.loop = true;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = null;
let left, right, up, down;
let speed = 5;
let score = null;
let levelScore = null;
let levelComplete = false;

let poop = new Image();
poop.src = "./img/poop.png";

let paper = new Image();
paper.src = "./img/paper.png";

let bear = new Image();
bear.src = "./img/bear.png";

let bg = new Image();
bg.src = "./img/background.jpg";

let boss = new Image();
boss.src = "./img/boss.png";

let bullet = new Image();
// prettier-ignore
bullet.src = "./img/bullet.png";

let explosionImage = new Image();
explosionImage.src = "./img/boom.png";

let bosses = [];
let bullets = [];
let enemies = [];
let particles = [];
let explosions = [];

let hitBoxes = false;

let x = innerWidth / 2;
let y = innerHeight / 2;

let gameLoop = null;
let timer = 100;

let init = () => {
  startScreen.style.display = "none";
  scoreDiv.classList.remove("final");
  restart.style.display = "none";
  game.style.display = "block";
  canvas.style.cursor = "none";
  game.requestFullscreen();
  player = new Player(innerWidth / 2, innerHeight / 2);

  score = 0;
  levelScore = 0;

  document.addEventListener("keydown", keyDown);
  document.addEventListener("keyup", keyUp);
  document.addEventListener("fullscreenchange", () => {
    canvas.height = window.innerHeight;
  });
  canvas.addEventListener("mousemove", player.updatePosition);
  canvas.addEventListener("mousedown", shoot);
  gameLoop = setInterval(() => {
    update();
    render();
  }, 1000 / 60);
  backgroundMusic.play();
};

let createEnemy = () => {
  enemies.push(
    new Enemy(
      window.innerWidth + 200,
      Math.random() * (window.innerHeight - 100)
    )
  );
};

let keyDown = (e) => {
  let type = e.type == "keydown" ? true : false;
  switch (e.keyCode) {
    case 37:
      left = type;
      break;
    case 38:
      up = type;
      break;
    case 39:
      right = type;
      break;
    case 40:
      down = type;
      break;
    case 32:
      shoot();
      break;
  }
};

let keyUp = (e) => {
  let type = e.type == "keyup" ? true : false;
  switch (e.keyCode) {
    case 37:
      left = false;
      break;
    case 38:
      up = false;
      break;
    case 39:
      right = false;
      break;
    case 40:
      down = false;
      break;
  }
};

let update = () => {
  if (timer <= 0 && !levelComplete) {
    createEnemy();
    timer = 80;
  }

  timer--;

  if (!levelComplete && score > 2000 && bosses.length == 0) {
    bosses.push(new Boss());
    backgroundMusic.pause();
    bossMusic.play();
  }

  if (left) player.x -= speed;
  if (right) player.x += speed;
  if (up) player.y -= speed;
  if (down) player.y += speed;
  player.update();

  for (let i = 0; i < bullets.length; i++) {
    bullets[i].update();
    if (bullets[i].x > 2000) bullets.splice(i, 1);
  }
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].update();

    if (collision(player, enemies[i])) {
      player.damaged = true;
      player.health -= 20;
      scream.play();
      if (player.health <= 0) {
        player.health = 0;
        dead();
      }
      enemies.splice(i, 1);
    }
  }
  for (let j = 0; j < bullets.length; j++) {
    let bulletHit = false;
    bosses.forEach((boss, bossIndex) => {
      if (collision(bullets[j], boss)) {
        boss.health -= 10;
        bulletHit = true;
        for (let p = 0; p < 300; p++) {
          let color = Math.random() < 0.5 ? "red" : "rgb(192,156,142)";
          explosions.push(new Explosion(bullets[j].x - 50, bullets[j].y - 50));
        }
      }
      if (boss.health <= 0) {
        bosses.splice(bossIndex, 1);
        for (let p = 0; p < 20; p++) {
          // prettier-ignore
          explosions.push( new Explosion((boss.hit.x + Math.random() * 500) - 250, boss.hit.y + Math.random() * 500));
        }
        levelComplete = true;
      }
    });
    for (let i = 0; i < enemies.length; i++) {
      if (bullets[j] && collision(enemies[i], bullets[j])) {
        explosions.push(
          (explosion = new Explosion(enemies[i].x, enemies[i].y))
        );
        splat.play();
        enemies.splice(i, 1);
        bulletHit = true;
        score += 100;
      }
    }
    if (bulletHit) console.log("HIT HIT HIT");
    if (bulletHit || bullets[j].x > 2000) bullets.splice(j, 1);
  }
};

let render = () => {
  c.fillStyle = "black";
  c.drawImage(bg, 0, 0);
  if (player.health > 0) player.render();

  scoreElement.innerHTML = score;

  bosses.forEach((b, bi) => {
    b.update();
    b.render();
  });

  for (let i = 0; i < enemies.length; i++) {
    enemies[i].render();
    if (enemies[i].x < -100) enemies.splice(i, 1);
  }

  for (let i = 0; i < bullets.length; i++) {
    bullets[i].render();
  }

  explosions.forEach((explosion, index) => {
    if (!explosion.animation.complete) {
      explosion.render(c);
      explosion.update();
    } else {
      explosions.splice(index, 1);
    }
  });

  particles.forEach((particle, index) => {
    particle.update();
    if (particle.alpha <= 0.05) particles.splice(index, 1);
    particle.render();
  });
};

let shoot = () => {
  sound.play();
  bullets.push(new Paper(player.x, player.y));
};

let dead = () => {
  player.health = 0;
  enemies = [];
  bosses = [];
  clearInterval(gameLoop);
  bossMusic.pause();
  backgroundMusic.pause();
  c.clearRect(0, 0, innerWidth, innerHeight);
  scoreDiv.classList.add("final");
  restart.style.display = "block";
  canvas.style.cursor = "pointer";
};

let collision = (obj1, obj2) => {
  // prettier-ignore
  return ( obj1.hit.x < obj2.hit.x + obj2.hit.width && obj1.hit.x + obj1.hit.width > obj2.hit.x && obj1.hit.y < obj2.hit.y + obj2.hit.height && obj1.hit.y + obj1.hit.height > obj2.hit.y);
};

let dist = (e, l) => {
  return Math.sqrt((e.x - l.x) * (e.x - l.x) + (e.y - l.y) * (e.y - l.y));
};
window.onload = () => {
  //init();
};
