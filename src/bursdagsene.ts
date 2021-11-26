export class Bursdagsene extends Phaser.Scene {
  bredde: number;
  hoyde: number;
  ballonggruppe: Phaser.Physics.Arcade.Group;
  spikergruppe: Phaser.Physics.Arcade.Group;
  kanongruppe: Phaser.Physics.Arcade.StaticGroup;
  tekst: Phaser.GameObjects.Text;

  innstillinger = {
    maksAntallBallonger: 10,
    tidMellomHverBallong: 1000,
    ballongfart: [30, 40],
    spikerfart: -750,
  };

  ballongTeller = 0;

  constructor() {
    super({ key: 'hovedsene' });

    //if (this.erDebug) {
    // this.innstillinger.tidMellomHverBallong = 250;
    // this.innstillinger.maksAntallBallonger = 1000;
    // this.innstillinger.ballongfart = [300, 400];
    // this.innstillinger.spikerfart = -1500;
    // }
  }

  init(data: any) {
    console.log(data);
    this.bredde = this.game.scale.gameSize.width;
    this.hoyde = this.game.scale.gameSize.height;
    console.log({ bredde: this.bredde, hoyde: this.hoyde });

    // @ts-ignore
    this.scale.on('resize', (gameSize, baseSize, displaySize, resolution, previousWidth, previousHeight) => {
      console.log('resizea', { gameSize, baseSize, displaySize, resolution, previousWidth, previousHeight });
      this.scene.restart();
    });
  }

  preload() {
    this.load.spritesheet('ballong', 'assets/ballonger-sprite.png', { frameWidth: 40, frameHeight: 50 });
    this.load.image('spiker', 'assets/spiker.png');
    this.load.image('spikerkanon-topp', 'assets/spikerkanon-topp.png');
    this.load.image('spikerkanon-bunn', 'assets/spikerkanon-bunn.png');
    this.load.image('ballongkanon-topp', 'assets/ballongkanon-topp.png');
    this.load.image('ballongkanon-bunn', 'assets/ballongkanon-bunn.png');
  }

  create() {
    this.ballonggruppe = this.physics.add.group({
      allowGravity: false,
    });

    this.spikergruppe = this.physics.add.group({
      allowGravity: false,
    });

    const ballongkanonBunn = this.add.image(0, this.hoyde, 'ballongkanon-bunn').setOrigin(0, 1);
    const ballongkanonTopp = this.add.image(35, this.hoyde - ballongkanonBunn.height + 10, 'ballongkanon-topp').setOrigin(0, 1);

    const spikerkanonBunn = this.add.image(this.bredde, this.hoyde, 'spikerkanon-bunn').setOrigin(1, 1);
    const spikerkanonTopp = this.add.image(this.bredde - 50, this.hoyde - spikerkanonBunn.height + 15, 'spikerkanon-topp').setOrigin(1, 1);

    this.kanongruppe = this.physics.add.staticGroup();
    this.kanongruppe.add(ballongkanonBunn);
    this.kanongruppe.add(ballongkanonTopp);
    this.kanongruppe.add(spikerkanonBunn);
    this.kanongruppe.add(spikerkanonTopp);

    this.kanongruppe.setDepth(1);

    ballongkanonBunn.setInteractive().on('pointerdown', () => {
      this.lagNyBallong();
    });
    ballongkanonTopp.setInteractive().on('pointerdown', () => {
      this.lagNyBallong();
    });
    spikerkanonBunn.setInteractive().on('pointerdown', () => {
      this.skytSpiker();
    });
    spikerkanonTopp.setInteractive().on('pointerdown', () => {
      this.skytSpiker();
    });

    this.physics.add.collider(this.ballonggruppe, this.ballonggruppe);
    this.physics.add.collider(this.kanongruppe, this.ballonggruppe);
    // @ts-ignore
    this.physics.add.collider(this.spikergruppe, this.ballonggruppe, (spiker, ballong: Phaser.Physics.Arcade.Sprite) => {
      ballong.disableBody(true, true);
      const antallBallonger = this.ballonggruppe.countActive(true);
      this.tekst.setText(this.lagTekst(antallBallonger));
      if (antallBallonger === 0) {
        this.scene.restart();
        // this.lagMangeBallonger();
      }
    });

    // setInterval(() => {
    //   if (this.ballongTeller < this.innstillinger.maksAntallBallonger) {
    //     this.lagNyBallong();
    //     this.ballongTeller++;
    //   }
    // }, this.innstillinger.tidMellomHverBallong);

    // this.lagMangeBallonger();

    this.tekst = this.add
      .text(this.bredde / 2, this.hoyde - 60, this.lagTekst(0), { fontFamily: 'arial', fontSize: '20px', color: '#000' })
      .setOrigin(0.5, 1)
      .setDepth(2);
  }

  // @ts-ignore
  update(time, delta) {
    // this.ballonggruppe.children.each((ballong: Phaser.Physics.Arcade.Sprite) => {
    //   ballong.setAngle(Phaser.Math.Between(-45, 45));
    // });

    // @ts-ignore
    this.spikergruppe.children.iterate((spiker: Phaser.Physics.Arcade.Image) => {
      if (spiker.x < 0 || spiker.y < 0) {
        spiker.disableBody(true, true);
      }
    });
  }

  private skytSpiker() {
    let spiker: Phaser.Physics.Arcade.Image = this.spikergruppe.getFirstDead();

    const x = this.bredde - 102;
    const y = this.hoyde - 190;

    if (spiker) {
      spiker.enableBody(true, x, y, true, true);
    } else {
      spiker = this.spikergruppe.create(x, y, 'spiker');
    }

    // Lager den litt tykkere slik at den lettere treffer ballongene
    // (som på sin side er lagd litt mindre for ikke å bumpe i hverandre for lett).
    spiker
      .setSize(20, 20)
      .setAngle(-25)
      .setImmovable(true)
      .setVelocity(this.innstillinger.spikerfart * 0.48, this.innstillinger.spikerfart);
  }

  // @ts-ignore
  private lagMangeBallonger() {
    for (let teller = 0; teller < this.innstillinger.maksAntallBallonger; teller++) {
      this.lagNyBallong2();
    }
  }

  private lagNyBallong() {
    let ballong: Phaser.Physics.Arcade.Sprite = this.ballonggruppe.getFirstDead();

    const x = 70;
    const y = this.hoyde - 90;
    if (ballong) {
      ballong.enableBody(true, x, y, true, true);
    } else {
      ballong = this.ballonggruppe.create(x, y, 'ballong', Phaser.Math.Between(0, 14));
    }

    ballong
      .setSize(25, 30)
      .setBounce(1, 1)
      .setCollideWorldBounds(true)
      .setVelocity(Phaser.Math.Between(40, 60), Phaser.Math.Between(-65, -85));

    const antallBallonger = this.ballonggruppe.countActive(true);
    this.tekst.setText(this.lagTekst(antallBallonger));
  }

  // @ts-ignore
  private lagNyBallong2() {
    const x = Phaser.Math.Between(0, this.bredde);
    const y = Phaser.Math.Between(0, this.hoyde);
    this.ballonggruppe
      .create(x, y, 'ballong', Phaser.Math.Between(0, 14))
      .setSize(25, 30)
      .setBounce(1, 1)
      .setCollideWorldBounds(true)
      // .setVelocity(30, 50)
      .setVelocity(
        Phaser.Math.Between(this.innstillinger.ballongfart[0], this.innstillinger.ballongfart[1]),
        Phaser.Math.Between(this.innstillinger.ballongfart[0], this.innstillinger.ballongfart[1])
      );
  }

  private lagTekst(antallBallonger: number) {
    return `${antallBallonger} ` + (antallBallonger === 1 ? 'ballong' : 'ballonger');
  }
}
