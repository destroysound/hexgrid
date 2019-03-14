import logoImg from "../assets/logo.png";
import Logo from "../sprites/logo.js"

export class SceneA extends Phaser.Scene {
  constructor () {
    super({ key: 'sceneA'});
  }
  preload() {
    this.load.image('bg-static', logoImg)
  }
  create () {
    let graphics = this.add.graphics();
    graphics.fillStyle(0xff9933, 1);
    graphics.fillRect(100, 200, 600, 300);
    this.staticBg = this.add.image(0, 0, 'bg-static')
    this.sprite = new Logo({
      scene: this,
      key: 'bg-static',
      x: this.game.config.width/2,
      y: this.game.config.height/2-150
    })
  }
}
