const TAU = Math.PI * 2;
const PI_HALF = Math.PI * 0.5;
const shapesCount = 150;
const kaleidoBlocks = document.querySelectorAll('[data-kaleido]');
let kaleidoObjects = [];

const settings = {
  'slices': 32,
  'radius': 1280,
  'seperation': 600,
};

// The plane that the shader draws on

function getTriangleSide() {
  const angle = PI_HALF - ((TAU / settings.slices) / 2);
  const side = 2 * settings.radius * Math.cos(angle);

  return side;
}

class KaleidoPlane extends THREE.Mesh {
  constructor(canvas, renderer) {
    const texture = new THREE.Texture(canvas);

    texture.anistropy = renderer.getMaxAnisotropy();
    texture.needsUpdate = true;

    const geometry = new THREE.PlaneBufferGeometry(2, 2, 1, 1);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        image: {value: texture},
        imageSize: {value: new THREE.Vector2(canvas.width, canvas.height)},
        resolution: {value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
        radius: {value: settings.radius},
        slices: {value: settings.slices},
        maxSize: {value: getTriangleSide()},
        seperation: {value: settings.seperation},
      },

      fragmentShader: document.getElementById('fragment').innerText,
      vertexShader: document.getElementById('vertex').innerText,
    });

    super(geometry, material);

    this.texture = texture;

    window.addEventListener('resize', function () {
      material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
      material.needsUpdate = true;
    });
  }

  update() {
    this.texture.needsUpdate = true;
  }
}

// Texture shenanigans

class Shape {
  constructor() {
    this.x = Math.random() * 1024;
    this.y = Math.random() * 512;
    this.width = 10 + Math.random() * 40;
    this.height = 10 + Math.random() * 40;
    this.rotation = Math.random() * TAU;
    this.color = '#' +
      Math.round(Math.random() * 15).toString(16) +
      Math.round(Math.random() * 15).toString(16) +
      '0000';

    this.rotate = (-Math.PI + TAU * Math.random()) / TAU / 10;
  }

  update() {
    this.rotation += this.rotate;
  }
}

class Pattern {

  constructor() {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    this.canvas.width = 1024;
    this.canvas.height = 512;

    this.shapes = [];

    this.randomCanvas();
  }

  getCanvas() {
    return this.canvas;
  }

  update() {
    this.context.fillStyle = '#EDEEEF';
    this.context.fillRect(0, 0, 1024, 512);

    let shape;

    for (let i = 0; i < this.shapes.length; i++) {
      shape = this.shapes[i];
      shape.update();

      this.context.save();
      this.context.translate(256 + shape.x, 256 + shape.y);
      this.context.rotate(shape.rotation);
      this.context.strokeStyle = shape.color;
      this.context.strokeRect(0, 0, shape.width, shape.height);
      this.context.restore();
    }
  }

  randomCanvas() {
    for (let i = 0; i < shapesCount; i++) {
      this.shapes.push(new Shape());
    }

    this.update();
  }
}

// let's get this jazz setup


const initkaleido = () => {
  if (!kaleidoBlocks.length) {
    return;
  }


  kaleidoBlocks.forEach((kaleidoBlock) => {
    let newObj = {};
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 10000);
    const renderer = new THREE.WebGLRenderer();
    const pattern = new Pattern();
    const plane = new KaleidoPlane(pattern.getCanvas(), renderer);

    kaleidoBlock.appendChild(renderer.domElement);
    scene.add(plane);

    newObj.scene = scene;
    newObj.camera = camera;
    newObj.renderer = renderer;
    newObj.pattern = pattern;
    newObj.plane = plane;
    newObj.block = kaleidoBlock;
    kaleidoObjects.push(newObj);
  });
  window.addEventListener('resize', onResize);
  onResize();
  render();
};

// callbacks

function onResize() {
  kaleidoObjects.map((obj) => {
    const {renderer, camera, block} = obj;
    const {offsetWidth, offsetHeight} = block;
    renderer.setSize(offsetWidth, offsetHeight);
    camera.aspect = offsetWidth / offsetHeight;
    camera.updateProjectionMatrix();
  });
}

function render() {
  kaleidoObjects.map((obj) => {
    const {scene, camera, renderer, pattern, plane} = obj;
    pattern.update();
    plane.update();
    renderer.render(scene, camera);
  });

  requestAnimationFrame(render);
}

export {initkaleido};
