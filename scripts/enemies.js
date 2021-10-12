// Standard enemy class - Little Bears
class Enemy {
  constructor(x, y, vel) {
    this.vel = vel ? vel : {x: -5, y: 0};
    this.x = x;
    this.y = y;
    this.offset = {x: -50, y: -18};
    this.hit = {width: 20, height: 118};
  }

  update() {
    this.x += this.vel.x;
    this.y += this.vel.y;
    this.hit.x = this.x;
    this.hit.y = this.y;
  }

  render() {
    // prettier-ignore
    c.drawImage(bear, 190, 126, 200, 275, this.x + this.offset.x, this.y + this.offset.y, 100, 140);
    if (hitBoxes) {
      c.fillRect(this.hit.x, this.hit.y, this.hit.width, this.hit.height);
    }
  }
}

// Boss Bullets - Spawn at boss mouth
class Bullet {
  constructor(x, y, vel) {
    this.vel = vel ? vel : {x: -5, y: 0};
    this.x = x;
    this.y = y;
    this.offset = {x: -20, y: 0};
    this.hit = {width: 20, height: 45};
  }

  update() {
    this.x += this.vel.x;
    this.y += this.vel.y;
    this.hit.x = this.x;
    this.hit.y = this.y;
  }

  render() {
    // prettier-ignore
    c.drawImage(bullet, 0, 0, 843, 448, this.x + this.offset.x, this.y + this.offset.y, 84, 44);
    if (hitBoxes)
      c.fillRect(this.hit.x, this.hit.y, this.hit.width, this.hit.height);
  }
}

class Boss {
  constructor() {
    this.x = innerWidth;
    this.y = 260;
    this.health = 100;
    this.attackTimer = 300;
    this.timer = 0;
    this.hit = {offsetX: 600, offsetY: 260, width: 50, height: 100};
  }
  attack() {
    let dx = player.x - this.hit.x;
    let dy = player.y - this.hit.y;

    let angle = Math.atan2(dy, dx);

    let nx = Math.cos(angle);
    let ny = Math.sin(angle);

    enemies.push(
      new Bullet(this.hit.x, this.hit.y, {x: nx * 5, y: ny * 5 - 1}, bullet)
    );
    enemies.push(
      new Bullet(this.hit.x, this.hit.y, {x: nx * 5, y: ny * 5}, bullet)
    );
    enemies.push(
      new Bullet(this.hit.x, this.hit.y, {x: nx * 5, y: ny * 5 + 1})
    );
  }

  update() {
    this.timer++;
    if (this.x > innerWidth / 2) this.x -= 3;
    if (this.timer >= this.attackTimer && this.x <= innerWidth / 2) {
      this.attack();
      this.timer = 0;
    }
    this.hit.x = this.x + this.hit.offsetX;
    this.hit.y = this.y + this.hit.offsetY;
  }

  render() {
    c.drawImage(boss, this.x, this.y);
    c.fillStyle = "red";
    if (hitBoxes) {
      c.fillRect(this.hit.x, this.hit.y, this.hit.width, this.hit.height);
    }
  }
}
