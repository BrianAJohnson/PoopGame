class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.offset = {x: -30, y: -150};
    this.hit = {width: 120, height: 220};
    this.health = 100;
    this.damaged = false;
    this.damageCounter = 0;
    this.damageTime = 30;
  }

  update() {
    this.hit.x = this.x + this.offset.x;
    this.hit.y = this.y + this.offset.y;
  }

  updatePosition(e) {
    player.x = e.clientX;
    player.y = e.clientY;
  }

  render() {
    if (this.damaged) {
      this.damageCounter++;
      if (this.damageCounter % 2 == 0)
        c.drawImage(poop, this.x - 120, this.y - 210);
      if (this.damageCounter == this.damageTime) {
        this.damageCounter = 0;
        this.damaged = false;
      }
    } else {
      c.drawImage(poop, this.x - 120, this.y - 210);
    }
    c.fillStyle = "rgba(0,0,0,0.4)";
    // prettier-ignore
    c.fillRect(40,innerHeight - 40, 304, 24);
    c.fillStyle = "rgba(255,0,0,0.8)";
    // prettier-ignore
    c.fillRect(42, innerHeight - 38, 3* this.health, 20);
    if (hitBoxes)
      c.fillRect(this.hit.x, this.hit.y, this.hit.width, this.hit.height);
  }
}

class Paper {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.offset = {x: -70, y: -5};
    this.hit = {width: 20, height: 40};
  }

  update() {
    this.x += 20;
    this.hit.x = this.x;
    this.hit.y = this.y;
  }

  render() {
    c.drawImage(
      paper,
      0,
      0,
      500,
      500,
      this.x + this.offset.x,
      this.y + this.offset.y,
      100,
      100
    );
    if (hitBoxes)
      c.fillRect(this.hit.x, this.hit.y, this.hit.width, this.hit.height);
  }
}
