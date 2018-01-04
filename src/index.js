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
const mapchipSrc = './img/mapchip.json';

const stageHeight = 512;

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
  
  
/**
 * エンティティの追加・削除を行う
 */
class EntityManager extends Container{
  constructor(entities, root) {
    super();
    this.entities = entities;
    root.addChild(this);
  }
  add(entity) {
    this.addChild(entity);
    this.entities.push(entity);
  }
}

/**
 * ゲーム状態(state)の保持を行う
 * 基本的にここ以外にゲームの情報を持たせてはいけない
 */
class Store {
  constructor(app) {
    this.state = this.getInitState();
    this.entity = new EntityManager(this.state.entities, app.stage);
  }
  getInitState() {
    return {
      entities: [],
    }
  }
  update(delta) {
    for (const i of this.entity.entities) {
      i.update(delta);
    }
  }
}

class Entity extends Sprite {
  constructor(...args) {
    super(...args);
    this.vx = 0;
    this.vy = 0;
    this.isOnFloor = false;
    this.MoveState = {
      Jump: {
        keyboard: {
          right: {
            press: this.moveRight.bind(this),
          },
          left: {
            press: this.moveLeft.bind(this),
          },
        },
        update: this.jumpUpdate.bind(this),
      },
      Walk: {
        keyboard: {
          up: {
            press: this.jump.bind(this),
          },           
          right: {
            press: this.moveRight.bind(this),
          },
          left: {
            press: this.moveLeft.bind(this),
          },
        },
        update: () => {},
      },
    };
    this.moveState = this.MoveState.Jump;
    this.keyboard = {
      left: keyboard(37),
      up: keyboard(38),
      right: keyboard(39),
      down: keyboard(40),
    };
    for (const i of Object.keys(this.keyboard)) {
      this.keyboard[i].press = () => {
        console.log('Key Pressed: ' + i);
        if (this.moveState.keyboard[i] !== undefined) {
          if (this.moveState.keyboard[i].press !== undefined) {
            this.moveState.keyboard[i].press();
          }
        }
      };
    }
  }
  
  moveRight() {
    
  }
  moveLeft() {}
  
  jumpUpdate() {
    // 床判定
    this.addGravity();
    if (this.y > stageHeight) {
      this.nextMoveState = this.MoveState.Walk;
      this.y = stageHeight - 1;
      this.vy = 0;
    }
  }
  
  jump() {
    console.log('Jumped');
    this.vy = -4;
    this.nextMoveState = this.MoveState.Jump;
  }
  
  addGravity(g = 0.1) {
    this.vy += g;
  }
  
  update(delta) {
    this.x += this.vx * (1 + delta);
    this.y += this.vy * (1 + delta);
    
    this.moveState.update();
    if (this.nextMoveState != null) {
      this.moveState = this.nextMoveState;
      this.nextMoveState = null;
      console.log('moveState changed.')
    }
  }
}

function genTestPlayer() {
  const player = new Entity(
    resources[chickenSrc].texture
  );
  
  player.x = 100;
  player.y = 200;
  player.anchor.x = 0.5;
  player.anchor.y = 0.5;
  
  return player;
}
  
function setup() {
  // スケールモード設定
  /*for (const i of resources) {
    i.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
  }*/
  
  const player = genTestPlayer();
  //const player = new Entity(resources[chickenSrc].texture);
  //const player = new Entity(resources[chickenSrc].texture);

  const store = new Store(app);
  store.entity.add(player);
  
  app.ticker.add(delta => {
    store.update(delta);
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
