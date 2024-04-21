// import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
// import Stats from 'three/addons/libs/stats.module.js';

// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// const loader = new GLTFLoader();



// let camera, scene, renderer, object, stats;
// let planes, planeObjects, planeHelpers;
// let clock;


// const params = {
//     animate: false,
//     planeX: {
//         constant: 0,
//         negated: false,
//         displayHelper: false
//     },
//     planeY: {
//         constant: 0,
//         negated: false,
//         displayHelper: false
//     },
//     planeZ: {
//         constant: 0,
//         negated: false,
//         displayHelper: false
//     }
// };

// init();
// animate();

// function createPlaneStencilGroup( geometry, plane, renderOrder ) {
//     const group = new THREE.Group();
//     const baseMat = new THREE.MeshBasicMaterial();
//     baseMat.depthWrite = false;
//     baseMat.depthTest = false;
//     baseMat.colorWrite = false;
//     baseMat.stencilWrite = true;
//     baseMat.stencilFunc = THREE.AlwaysStencilFunc;

//     // back faces
//     const mat0 = baseMat.clone();
//     mat0.side = THREE.BackSide;
//     mat0.clippingPlanes = [ plane ];
//     mat0.stencilFail = THREE.IncrementWrapStencilOp;
//     mat0.stencilZFail = THREE.IncrementWrapStencilOp;
//     mat0.stencilZPass = THREE.IncrementWrapStencilOp;

//     const mesh0 = new THREE.Mesh( geometry, mat0 );
//     mesh0.renderOrder = renderOrder;
//     group.add( mesh0 );

//     // front faces
//     const mat1 = baseMat.clone();
//     mat1.side = THREE.FrontSide;
//     mat1.clippingPlanes = [ plane ];
//     mat1.stencilFail = THREE.DecrementWrapStencilOp;
//     mat1.stencilZFail = THREE.DecrementWrapStencilOp;
//     mat1.stencilZPass = THREE.DecrementWrapStencilOp;

//     const mesh1 = new THREE.Mesh( geometry, mat1 );
//     mesh1.renderOrder = renderOrder;
//     group.add( mesh1 );
//     return group;
// }

// function loadDiagram() {
//     loader.load( '/tpd.gltf', function ( gltf ) {
//         scene.add( gltf.scene );
//     }, undefined, function ( error ) {
//         console.error( error );
//     } );   
// }

// function init() {
//     clock = new THREE.Clock();
//     scene = new THREE.Scene();

//     camera = new THREE.PerspectiveCamera( 36, window.innerWidth / window.innerHeight, 1, 100 );
//     camera.position.set( 2, 2, 2 );

//     scene.add( new THREE.AmbientLight( 0xffffff, 1.5 ) );

//     loadDiagram();

//     const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
//     dirLight.position.set( 5, 10, 7.5 );
//     dirLight.castShadow = true;
//     dirLight.shadow.camera.right = 2;
//     dirLight.shadow.camera.left = - 2;
//     dirLight.shadow.camera.top	= 2;
//     dirLight.shadow.camera.bottom = - 2;

//     dirLight.shadow.mapSize.width = 1024;
//     dirLight.shadow.mapSize.height = 1024;
//     scene.add( dirLight );

//     planes = [
//         new THREE.Plane( new THREE.Vector3( - 1, 0, 0 ), 0 ),
//         new THREE.Plane( new THREE.Vector3( 0, - 1, 0 ), 0 ),
//         new THREE.Plane( new THREE.Vector3( 0, 0, - 1 ), 0 )
//     ];

//     planeHelpers = planes.map( p => new THREE.PlaneHelper( p, 2, 0xffffff ) );
//     planeHelpers.forEach( ph => {
//         ph.visible = false;
//         scene.add( ph );
//     } );

//     const geometry = new THREE.TorusKnotGeometry( 0.4, 0.15, 220, 60 );
//     object = new THREE.Group();
//     scene.add( object );

//     // Set up clip plane rendering
//     planeObjects = [];
//     const planeGeom = new THREE.PlaneGeometry( 4, 4 );

//     for ( let i = 0; i < 3; i ++ ) {
//         const poGroup = new THREE.Group();
//         const plane = planes[ i ];
//         const stencilGroup = createPlaneStencilGroup( geometry, plane, i + 1 );

//         // plane is clipped by the other clipping planes
//         const planeMat =
//             new THREE.MeshStandardMaterial( {

//                 color: 0xE91E63,
//                 metalness: 0.1,
//                 roughness: 0.75,
//                 clippingPlanes: planes.filter( p => p !== plane ),

//                 stencilWrite: true,
//                 stencilRef: 0,
//                 stencilFunc: THREE.NotEqualStencilFunc,
//                 stencilFail: THREE.ReplaceStencilOp,
//                 stencilZFail: THREE.ReplaceStencilOp,
//                 stencilZPass: THREE.ReplaceStencilOp,
//             } );
//         const po = new THREE.Mesh( planeGeom, planeMat );
//         po.onAfterRender = function ( renderer ) {
//             renderer.clearStencil();
//         };

//         po.renderOrder = i + 1.1;

//         object.add( stencilGroup );
//         poGroup.add( po );
//         planeObjects.push( po );
//         scene.add( poGroup );
//     }

//     const material = new THREE.MeshStandardMaterial( {
//         color: 0xFFC107,
//         metalness: 0.1,
//         roughness: 0.75,
//         clippingPlanes: planes,
//         clipShadows: true,
//         shadowSide: THREE.DoubleSide,
//     } );

//     // add the color
//     const clippedColorFront = new THREE.Mesh( geometry, material );
//     clippedColorFront.castShadow = true;
//     clippedColorFront.renderOrder = 6;
//     object.add( clippedColorFront );


//     const ground = new THREE.Mesh(
//         new THREE.PlaneGeometry( 9, 9, 1, 1 ),
//         new THREE.ShadowMaterial( { color: 0x000000, opacity: 0.25, side: THREE.DoubleSide } )
//     );

//     ground.rotation.x = - Math.PI / 2; // rotates X/Y to X/Z
//     ground.position.y = - 1;
//     ground.receiveShadow = true;
//     scene.add( ground );

//     // Stats
//     stats = new Stats();
//     document.body.appendChild( stats.dom );

//     // Renderer
//     renderer = new THREE.WebGLRenderer( { antialias: true, stencil: true } );
//     renderer.shadowMap.enabled = true;
//     renderer.setPixelRatio( window.devicePixelRatio );
//     renderer.setSize( window.innerWidth, window.innerHeight );
//     renderer.setClearColor( 0x263238 );
//     window.addEventListener( 'resize', onWindowResize );
//     document.body.appendChild( renderer.domElement );

//     renderer.localClippingEnabled = true;

//     // Controls
//     const controls = new OrbitControls( camera, renderer.domElement );
//     controls.minDistance = 2;
//     controls.maxDistance = 210;
//     controls.update();

//     // GUI
//     const gui = new GUI();
//     gui.add( params, 'animate' );

//     const planeX = gui.addFolder( 'planeX' );
//     planeX.add( params.planeX, 'displayHelper' ).onChange( v => planeHelpers[ 0 ].visible = v );
//     planeX.add( params.planeX, 'constant' ).min( - 1 ).max( 1 ).onChange( d => planes[ 0 ].constant = d );
//     planeX.add( params.planeX, 'negated' ).onChange( () => {
//         planes[ 0 ].negate();
//         params.planeX.constant = planes[ 0 ].constant;
//     } );
//     planeX.open();

//     const planeY = gui.addFolder( 'planeY' );
//     planeY.add( params.planeY, 'displayHelper' ).onChange( v => planeHelpers[ 1 ].visible = v );
//     planeY.add( params.planeY, 'constant' ).min( - 1 ).max( 1 ).onChange( d => planes[ 1 ].constant = d );
//     planeY.add( params.planeY, 'negated' ).onChange( () => {
//         planes[ 1 ].negate();
//         params.planeY.constant = planes[ 1 ].constant;
//     } );
//     planeY.open();

//     const planeZ = gui.addFolder( 'planeZ' );
//     planeZ.add( params.planeZ, 'displayHelper' ).onChange( v => planeHelpers[ 2 ].visible = v );
//     planeZ.add( params.planeZ, 'constant' ).min( - 1 ).max( 1 ).onChange( d => planes[ 2 ].constant = d );
//     planeZ.add( params.planeZ, 'negated' ).onChange( () => {
//         planes[ 2 ].negate();
//         params.planeZ.constant = planes[ 2 ].constant;
//     } );
//     planeZ.open();
// }

// function onWindowResize() {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();

//     renderer.setSize( window.innerWidth, window.innerHeight );
// }

// function animate() {

//     const delta = clock.getDelta();
//     requestAnimationFrame( animate );

//     if ( params.animate ) {
//         object.rotation.x += delta * 0.5;
//         object.rotation.y += delta * 0.2;
//     }

//     for ( let i = 0; i < planeObjects.length; i ++ ) {
//         const plane = planes[ i ];
//         const po = planeObjects[ i ];
//         plane.coplanarPoint( po.position );
//         po.lookAt(
//             po.position.x - plane.normal.x,
//             po.position.y - plane.normal.y,
//             po.position.z - plane.normal.z,
//         );
//     }

//     stats.begin();
//     renderer.render( scene, camera );
//     stats.end();

// }
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Rhino3dmLoader } from 'three/addons/loaders/3DMLoader.js';

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';

let renderer, scene, camera, loader, controls, object;
let directionalLight, pointLight, hemiLight;
let planes, planeObjects, planeHelpers;

init();
animate();

function init() {
  THREE.Object3D.DefaultUp = new THREE.Vector3(0, 0, 1);

  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.OrthographicCamera(window.innerWidth / -8, window.innerWidth / 8, window.innerHeight / 8, window.innerHeight / -8, -50, 2000);
  camera.position.set(0, -200, 0);
  camera.lookAt(0, 0, 0);
  scene.add(camera);

  // Lights
  directionalLight = new THREE.DirectionalLight(0xffffff, 0.15);
  directionalLight.position.set(0, -50, 0);

  pointLight = new THREE.PointLight(0xeeeeee, 0.5, 0, 2);
  pointLight.position.set(500, 500, 1000);

  hemiLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.45);
  hemiLight.position.set(0, 1, 0);

  camera.add(directionalLight);
  camera.add(pointLight);
  camera.add(hemiLight);

  // Planes
  planes = [
    new THREE.Plane(new THREE.Vector3(- 1, 0, 0), 0)
  ];

  // Plane helpers
  planeHelpers = planes.map(p => new THREE.PlaneHelper(p, 200, 0x555555));
  planeHelpers.forEach(ph => {
    //scene.add(ph);
  });

  object = new THREE.Group();
  scene.add(object);

  // Model loader
  loader = new Rhino3dmLoader();
  loader.setLibraryPath('https://cdn.jsdelivr.net/npm/rhino3dm@8.4.0/');
  loader.load('/tpd.3dm',
    function (model) {
      object.add(model);

      // Set up clip plane rendering
      planeObjects = [];
      const planeGeometry = new THREE.PlaneGeometry(400, 400);

      for (let i = 0; i < planes.length; i++) {
        const poGroup = new THREE.Group();
        const plane = planes[i];

        for (let j = 0; j < model.children.length; j++) {
          const geometry = model.children[j].geometry;
          const stencilGroup = createPlaneStencilGroup(geometry, plane, j + 1);
          object.add(stencilGroup);
        }

        const planeMat = new THREE.MeshStandardMaterial({
          color: 0xE91E63,
          metalness: 0.1,
          roughness: 0.75,
          clippingPlanes: planes.filter(p => p !== plane),
          stencilWrite: true,
          stencilRef: 0,
          stencilFunc: THREE.NotEqualStencilFunc,
          stencilFail: THREE.ReplaceStencilOp,
          stencilZFail: THREE.ReplaceStencilOp,
          stencilZPass: THREE.ReplaceStencilOp,
        });

        const po = new THREE.Mesh(planeGeometry, planeMat);
        po.renderOrder = i + 1.1;
        po.onAfterRender = function (renderer) {
          renderer.clearStencil();
        };

        poGroup.add(po);
        planeObjects.push(po);
        scene.add(poGroup);
      }
    },
    function (xhr) { },
    function (error) {
      console.log(error);
    }
  );

  // Renderer
  renderer = new THREE.WebGLRenderer();
  renderer.clippingPlanes = planes;
  renderer.localClippingEnabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.rotateSpeed = 2;
  controls.panSpeed = 1;
  controls.target.set(0, 0, 0);
}

function createPlaneStencilGroup(geometry, plane, renderOrder) {
  const group = new THREE.Group();
  const baseMat = new THREE.MeshBasicMaterial();
  baseMat.depthWrite = false;
  baseMat.depthTest = false;
  baseMat.colorWrite = false;
  baseMat.stencilWrite = true;
  baseMat.stencilFunc = THREE.AlwaysStencilFunc;

  // back faces
  const mat0 = baseMat.clone();
  mat0.side = THREE.BackSide;
  mat0.clippingPlanes = [plane];
  mat0.stencilFail = THREE.IncrementWrapStencilOp;
  mat0.stencilZFail = THREE.IncrementWrapStencilOp;
  mat0.stencilZPass = THREE.IncrementWrapStencilOp;

  const mesh0 = new THREE.Mesh(geometry, mat0);
  mesh0.renderOrder = renderOrder;
  group.add(mesh0);

  // front faces
  const mat1 = baseMat.clone();
  mat1.side = THREE.FrontSide;
  mat1.clippingPlanes = [plane];
  mat1.stencilFail = THREE.DecrementWrapStencilOp;
  mat1.stencilZFail = THREE.DecrementWrapStencilOp;
  mat1.stencilZPass = THREE.DecrementWrapStencilOp;

  const mesh1 = new THREE.Mesh(geometry, mat1);
  mesh1.renderOrder = renderOrder;

  group.add(mesh1);

  return group;
}

function animate() {
  requestAnimationFrame(animate);

  if (planeObjects) {
    for (let i = 0; i < planeObjects.length; i++) {
      const plane = planes[i];
      const po = planeObjects[i];
      plane.coplanarPoint(po.position);
      po.lookAt(
        po.position.x - plane.normal.x,
        po.position.y - plane.normal.y,
        po.position.z - plane.normal.z,
      );
    }
  }

  controls.update();
  renderer.render(scene, camera);
}