import logoImg from "../assets/logo.png";

export class Preloader extends Phaser.Scene {
    constructor () {
        super({
            key: 'preloader'
        })
    }
    preload () {
      this.load.image('bg-static', logoImg)
      this.load.image('bg-overlay', logoImg)
    }
}
