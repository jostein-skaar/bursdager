var u=Object.defineProperty;var f=(i,e,t)=>e in i?u(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var a=(i,e,t)=>(f(i,typeof e!="symbol"?e+"":e,t),t);import{P as d,h as g}from"./vendor.1f12c8f8.js";const y=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function t(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerpolicy&&(o.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?o.credentials="include":n.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(n){if(n.ep)return;n.ep=!0;const o=t(n);fetch(n.href,o)}};y();class k extends Phaser.Scene{constructor(){super({key:"hovedsene"});a(this,"bredde");a(this,"hoyde");a(this,"ballonggruppe");a(this,"spikergruppe");a(this,"kanongruppe");a(this,"tekst");a(this,"innstillinger",{maksAntallBallonger:10,tidMellomHverBallong:1e3,ballongfart:[30,40],spikerfart:-750});a(this,"ballongTeller",0)}init(e){console.log(e),this.bredde=this.game.scale.gameSize.width,this.hoyde=this.game.scale.gameSize.height,console.log({bredde:this.bredde,hoyde:this.hoyde}),this.scale.on("resize",(t,s,n,o,r,l)=>{setTimeout(()=>{console.log("resizea",{gameSize:t,baseSize:s,displaySize:n,resolution:o,previousWidth:r,previousHeight:l}),this.scene.restart()})})}create(){this.ballonggruppe=this.physics.add.group({allowGravity:!1}),this.spikergruppe=this.physics.add.group({allowGravity:!1});const e=this.add.image(0,this.hoyde,"ballongkanon-bunn").setOrigin(0,1),t=this.add.image(35,this.hoyde-e.height+10,"ballongkanon-topp").setOrigin(0,1),s=this.add.image(this.bredde,this.hoyde,"spikerkanon-bunn").setOrigin(1,1),n=this.add.image(this.bredde-50,this.hoyde-s.height+15,"spikerkanon-topp").setOrigin(1,1);this.kanongruppe=this.physics.add.staticGroup(),this.kanongruppe.add(e),this.kanongruppe.add(t),this.kanongruppe.add(s),this.kanongruppe.add(n),this.kanongruppe.setDepth(1),e.setInteractive().on("pointerdown",()=>{this.lagNyBallong()}),t.setInteractive().on("pointerdown",()=>{this.lagNyBallong()}),s.setInteractive().on("pointerdown",()=>{this.skytSpiker()}),n.setInteractive().on("pointerdown",()=>{this.skytSpiker()}),this.physics.add.collider(this.ballonggruppe,this.ballonggruppe),this.physics.add.collider(this.kanongruppe,this.ballonggruppe),this.physics.add.collider(this.spikergruppe,this.ballonggruppe,(o,r)=>{r.disableBody(!0,!0);const l=this.ballonggruppe.countActive(!0);this.tekst.setText(this.lagTekst(l)),l===0&&this.scene.restart()}),this.tekst=this.add.text(this.bredde/2,this.hoyde-60,this.lagTekst(0),{fontFamily:"arial",fontSize:"20px",color:"#000"}).setOrigin(.5,1).setDepth(2)}update(e,t){this.spikergruppe.children.iterate(s=>{(s.x<0||s.y<0)&&s.disableBody(!0,!0)})}skytSpiker(){let e=this.spikergruppe.getFirstDead();const t=this.bredde-102,s=this.hoyde-190;e?e.enableBody(!0,t,s,!0,!0):e=this.spikergruppe.create(t,s,"spiker"),e.setSize(20,20).setAngle(-25).setImmovable(!0).setVelocity(this.innstillinger.spikerfart*.48,this.innstillinger.spikerfart)}lagMangeBallonger(){for(let e=0;e<this.innstillinger.maksAntallBallonger;e++)this.lagNyBallong2()}lagNyBallong(){let e=this.ballonggruppe.getFirstDead();const t=70,s=this.hoyde-90;e?e.enableBody(!0,t,s,!0,!0):e=this.ballonggruppe.create(t,s,"ballong",Phaser.Math.Between(0,14)),e.setSize(25,30).setBounce(1,1).setCollideWorldBounds(!0).setVelocity(Phaser.Math.Between(40,60),Phaser.Math.Between(-65,-85));const n=this.ballonggruppe.countActive(!0);this.tekst.setText(this.lagTekst(n))}lagNyBallong2(){const e=Phaser.Math.Between(0,this.bredde),t=Phaser.Math.Between(0,this.hoyde);this.ballonggruppe.create(e,t,"ballong",Phaser.Math.Between(0,14)).setSize(25,30).setBounce(1,1).setCollideWorldBounds(!0).setVelocity(Phaser.Math.Between(this.innstillinger.ballongfart[0],this.innstillinger.ballongfart[1]),Phaser.Math.Between(this.innstillinger.ballongfart[0],this.innstillinger.ballongfart[1]))}lagTekst(e){return`${e} `+(e===1?"ballong":"ballonger")}}class b extends Phaser.Scene{constructor(){super({key:"preloadsene"})}preload(){console.log("preload"),this.load.spritesheet("ballong","assets/ballonger-sprite.png",{frameWidth:40,frameHeight:50}),this.load.image("spiker","assets/spiker.png"),this.load.image("spikerkanon-topp","assets/spikerkanon-topp.png"),this.load.image("spikerkanon-bunn","assets/spikerkanon-bunn.png"),this.load.image("ballongkanon-topp","assets/ballongkanon-topp.png"),this.load.image("ballongkanon-bunn","assets/ballongkanon-bunn.png")}create(){this.scene.start("hovedsene")}}let h,p=!0;p=!1;const m={type:d.AUTO,height:500,width:500,scene:[b,k],backgroundColor:16777215,autoFocus:!0,physics:{default:"arcade",arcade:{gravity:{y:300},debug:p}},scale:{mode:d.Scale.ScaleModes.RESIZE}};c();new d.Game(m);document.onvisibilitychange=()=>{document.visibilityState==="visible"&&Date.now()-h>60*1e3&&(console.log("visibilitychange. Og lenger enn 60 sekunder siden forrige."),c(),h=Date.now())};function c(){const i=[];new URLSearchParams(window.location.search).forEach((n,o)=>{i.push({navn:o.replaceAll("_"," "),dato:n})}),console.log(i);const t=document.querySelector("#personer");let s="";if(i.length>0){const n=v(i);for(const o of n){let r="";o.dager===0?r="HURRA":o.dager===1?r="1 dag":r=`${o.dager} dager`,s+=`<div class="person">${o.navn}: ${r}`}}else s+="Legg til navn og f\xF8dselsdatoer i urlen slik: ?Navn1=2010-12-01&Navn2a_Navn2b=2013-07-30";t.innerHTML=s}function v(i){const e=[];for(const t of i)e.push({navn:t.navn,dager:B(g(t.dato))});return e.sort((t,s)=>t.dager-s.dager)}function B(i){const e=g(),t=i.year(e.year());return e.isSame(t,"day")?0:(t<e&&(console.log(t.toJSON(),e),t.year(e.year()+1)),t.diff(g(),"days")+1)}window.onload=()=>{const i=document.getElementById("loader");i&&(i.style.display="none");const e=document.getElementById("content");e&&e.removeAttribute("hidden")};
