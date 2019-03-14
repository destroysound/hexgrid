import Phaser from "phaser";
import { SceneA } from "./scenes/game";
import { Preloader } from "./scenes/preloader";
import { Demo } from "./scenes/board";
import BoardPlugin from './plugins/board-plugin.js';

var config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  scene: Demo,
  plugins: {
      scene: [{
          key: 'rexBoard',
          plugin: BoardPlugin,
          mapping: 'rexBoard'
      }]
  }
};

const game = new Phaser.Game(config);
