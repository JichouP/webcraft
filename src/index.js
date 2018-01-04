const app = new PIXI.Application({
  width: 512,
  height: 512,
  antialias: true,
  transparent: false,
  resolution: 1,
  forceCanvas: false,
});

app.renderer.backgroundColor = 0x061639;
app.renderer.autoResize = true;
app.renderer.resize(512, 512);
document.body.appendChild(app.view);

const chickenSrc = './img/chicken.png';

PIXI.loader
  .add([
    chickenSrc,
  ])
  .load(setup);
  
function setup() {
  const chicken = new PIXI.Sprite(
    PIXI.loader.resources[chickenSrc].texture
  );  
  app.stage.addChild(chicken);
}
