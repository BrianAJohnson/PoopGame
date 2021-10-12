class Animation {
  constructor(img, width, height, count) {
    this.img = img;
    this.width = width / count;
    this.height = height;
    this.count = count;
    this.spriteNumber = 0;
    this.complete = false;
  }

  update() {
    if (!this.complete) {
      this.spriteNumber++;
      if (this.spriteNumber >= this.count) {
        this.spriteNumber = -1;
        this.complete = true;
      }
    }
  }

  render(context, x, y) {
    if (!this.complete) {
      // prettier-ignore
      context.drawImage(this.img, this.spriteNumber * this.width,0,this.width,this.height,x,y,this.width,this.height)
    }
  }

  explode() {
    this.complete = false;
  }
}
