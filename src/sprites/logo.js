export default class Logo extends Phaser.GameObjects.Sprite {
  constructor (config) {
    super(config.scene, config.x, config.y , config.key);
    this.scene = config.scene;
    this.scene.add.existing(this);
  }
  preUpdate (time, delta) {
      super.preUpdate(time, delta);
      this.rotation += 0.01;
  }
}
