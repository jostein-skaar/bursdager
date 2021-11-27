export class Preloadsene extends Phaser.Scene {
  constructor() {
    super({ key: 'preloadsene' });
  }

  preload() {
    console.log('preload');
    this.load.spritesheet('ballong', 'assets/ballonger-sprite.png', { frameWidth: 40, frameHeight: 50 });
    this.load.image('spiker', 'assets/spiker.png');
    this.load.image('spikerkanon-topp', 'assets/spikerkanon-topp.png');
    this.load.image('spikerkanon-bunn', 'assets/spikerkanon-bunn.png');
    this.load.image('ballongkanon-topp', 'assets/ballongkanon-topp.png');
    this.load.image('ballongkanon-bunn', 'assets/ballongkanon-bunn.png');
  }

  create() {
    this.scene.start('hovedsene');
  }
}
