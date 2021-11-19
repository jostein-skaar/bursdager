import './style.scss';
import Phaser from 'phaser';
import { Bursdagsene } from './bursdagsene';
import moment from 'moment';

let aktivTid: number;

let erDebug = true;
erDebug = false;

const phaserKonfig = {
  type: Phaser.AUTO,
  // 768 - 20 (status bar)
  height: 500,
  width: 500,
  scene: [Bursdagsene],
  backgroundColor: 0xffffff,
  autoFocus: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: erDebug,
    },
  },
  scale: {
    // mode: Phaser.Scale.ScaleModes.FIT,
    // mode: Phaser.Scale.ScaleModes.NONE,
    // mode: Phaser.Scale.ScaleModes.ENVELOP,
    mode: Phaser.Scale.ScaleModes.RESIZE,
    // autoCenter: Phaser.Scale.Center.CENTER_BOTH,
    // autoCenter: Phaser.Scale.Center.CENTER_HORIZONTALLY,
  },
};

rendrePersoner();

const phaserGame = new Phaser.Game(phaserKonfig);

document.onvisibilitychange = () => {
  if (document.visibilityState === 'visible') {
    if (Date.now() - aktivTid > 60 * 1000) {
      console.log('visibilitychange. Og lenger enn 60 sekunder siden forrige.');
      // console.warn('lenge siden sist, vi tvinger en reload.');
      // alert('Lenge siden du starta nå, så vi tar en oppfrisk');
      // window.location.reload();
      rendrePersoner();
      aktivTid = Date.now();
    }
  }
};

function rendrePersoner() {
  const personer: any[] = [];
  const urlSearchParams = new URLSearchParams(window.location.search);
  urlSearchParams.forEach((value: string, key: string) => {
    personer.push({ navn: key.replaceAll('_', ' '), dato: value });
  });
  console.log(personer);

  const app = document.querySelector<HTMLDivElement>('#personer')!;
  let html = '';

  if (personer.length > 0) {
    const personinfoer = lagPersoner(personer);
    for (const personinfo of personinfoer) {
      let dagInfo = '';
      if (personinfo.dager === 0) {
        dagInfo = 'HURRA';
      } else if (personinfo.dager === 1) {
        dagInfo = `1 dag`;
      } else {
        dagInfo = `${personinfo.dager} dager`;
      }

      html += `<div class="person">${personinfo.navn}: ${dagInfo}`;
    }
  } else {
    html += 'Legg til navn og fødselsdatoer i urlen slik: ?Navn1=2010-12-01&Navn2a_Navn2b=2013-07-30';
  }

  app.innerHTML = html;
}

function lagPersoner(personer: any[]) {
  const personerMedDager = [];
  for (const person of personer) {
    personerMedDager.push({ navn: person.navn, dager: dagerTilBursdag(moment(person.dato)) });
  }
  return personerMedDager.sort((a, b) => a.dager - b.dager);
}

function dagerTilBursdag(fodselsdato: moment.Moment): number {
  // const bursdag = forsteBursdag
  const idag = moment();

  const bursdag = fodselsdato.year(idag.year());

  if (idag.isSame(bursdag, 'day')) {
    return 0;
  }

  if (bursdag < idag) {
    console.log(bursdag.toJSON(), idag);
    bursdag.year(idag.year() + 1);
  }

  return bursdag.diff(moment(), 'days') + 1;
}
