class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.vel = {
      x: (Math.random() - 0.5) * (Math.random() * 10),
      y: (Math.random() - 0.5) * (Math.random() * 10),
    };
    this.alpha = 1;
    this.radius = Math.random() * 2 + 2;
  }
  update() {
    this.x += this.vel.x;
    this.y += this.vel.y;
    this.vel.x *= 0.98;
    this.vel.y *= 0.98;
    this.alpha = this.alpha - 0.02;
  }
  render() {
    c.save();
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.fillStyle = this.color;
    c.ellipse(this.x, this.y, this.radius, this.radius, 0, 0, Math.PI * 2);
    c.fill();
    c.restore();
  }
}

class Explosion {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.animation = new Animation(explosionImage, 2048, 128, 16);
    this.timer = 4;
    this.tic = 0;
  }

  update() {
    if (this.tic >= this.timer) {
      this.animation.update();
      this.tic = 0;
    }
    this.tic++;
  }
  render(context) {
    this.animation.render(context, this.x, this.y);
  }
}
