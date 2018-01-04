const {
  Application,
  Container,
  loader: {
    resources,
  },
  utils: {
    TextureCache,
  },
  Sprite,
  Rectangle,
} = PIXI;


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
const mapchipSrc = './img/mapchip.png';

PIXI.loader
  .add([
    chickenSrc,
    mapchipSrc,
  ])
  .on('progress', loadProgressHandler)
  .load(setup);

function loadProgressHandler(loader, resource) {

  //Display the file `url` currently being loaded
  console.log("loading: " + resource.url); 

  //Display the percentage of files currently loaded
  console.log("progress: " + loader.progress + "%"); 

  //If you gave your files names as the first argument function loadProgressHandler(loader, resource) {

  //Display the file `url` currently being loaded
  console.log("loading: " + resource.url); 

  //Display the percentage of files currently loaded
  console.log("progress: " + loader.progress + "%"); 

  //If you gave your files names as the first argument 
  //of the `add` method, you can access them like this
  //console.log("loading: " + resource.name);
}
  
function randomInt(max = 32768, min = 0) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
  
function setup() {
  PIXI.loader.resources[chickenSrc].texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
  const chicken = new PIXI.Sprite(
    PIXI.loader.resources[chickenSrc].texture
  );
  
  
  chicken.x = 100;
  chicken.y = 200;
  chicken.width = 64;
  chicken.height = 64;
  chicken.rotation = 0.5;
  chicken.anchor.x = 0.5;
  chicken.anchor.y = 0.5;
  app.stage.addChild(chicken);
  
  const mapchipTexture = TextureCache[mapchipSrc];
  const rectangle = new Rectangle(16, 0, 16, 16);
  mapchipTexture.frame = rectangle;
  const chip = new Sprite(mapchipTexture);
  chip.x = 32;
  chip.y = 32;
  chicken.vx = 0;
  chicken.vy = 0;
  
    const left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40);
      //Left arrow key `press` method
  left.press = () => {
    //Change the chicken's velocity when the key is pressed
    chicken.vx = -5;
    chicken.vy = 0;
  };
  
  //Left arrow key `release` method
  left.release = () => {
    //If the left arrow has been released, and the right arrow isn't down,
    //and the chicken isn't moving vertically:
    //Stop the chicken
    if (!right.isDown && chicken.vy === 0) {
      chicken.vx = 0;
    }
  };

  //Up
  up.press = () => {
    chicken.vy = -5;
    chicken.vx = 0;
  };
  up.release = () => {
    if (!down.isDown && chicken.vx === 0) {
      chicken.vy = 0;
    }
  };

  //Right
  right.press = () => {
    chicken.vx = 5;
    chicken.vy = 0;
  };
  right.release = () => {
    if (!left.isDown && chicken.vy === 0) {
      chicken.vx = 0;
    }
  };

  //Down
  down.press = () => {
    chicken.vy = 5;
    chicken.vx = 0;
  };
  down.release = () => {
    if (!up.isDown && chicken.vx === 0) {
      chicken.vy = 0;
    }
  };
  
  
  const rectangle2 = new Rectangle(32, 0, 16, 16);
  mapchipTexture.frame = rectangle2;
  const chip2 = new Sprite(mapchipTexture);
  chip2.x = 48;
  chip2.y = 32;
  
  const container = new Container();
  container.addChild(chip);
  container.addChild(chip2);
  app.stage.addChild(container);
  
  
  app.ticker.add(delta => {
    //chicken.x += 1 + delta;
    container.x += 1;
    chicken.x += chicken.vx * (1 * delta);
    chicken.y += chicken.vy * (1 * delta);
  });

}

function keyboard(keyCode) {
  let key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}
