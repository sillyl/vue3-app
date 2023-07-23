import * as THREE from "three";
// 目标：使用控制器查看3d物体

//导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

//1.创建场景
const scene = new THREE.Scene();

//2.创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
); //透视相机

// 设置相机位置
camera.position.set(0, 0, 10);
scene.add(camera);

//添加物体

//创建几何体对象
const cubeGeometry = new THREE.BoxGeometry();
const meterial = new THREE.MeshBasicMaterial({ color: "skyblue" }); //材质
// 根据几何体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, meterial);

// // 修改物体的位置
// // cube.position.set(5, 0, 0);
// cube.position.x = 3;

// 缩放
// cube.scale.set(3, 2);
// cube.scale.x = 3;
// 旋转
cube.rotation.set(Math.PI / 4, 0, 0, "XYZ");

// 将几何体添加到场景当中
scene.add(cube);

//初始化渲染器
const renderer = new THREE.WebGL1Renderer();
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// 将渲染内容canvas 添加到body 上
console.log("renderer", renderer);
document.body.appendChild(renderer.domElement);

// //使用渲染器，通过相机将场景渲染进来
// renderer.render(scene, camera);

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);

// 添加坐标轴辅助线
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 设置渲染函数
function render(time) {
  // // console.log("time", time); //默认有个时间参数 ms级别
  // // 每一帧➕0.01
  // cube.position.x += 0.01;
  // cube.rotation.x += 0.01;
  // if (cube.position.x > 5) {
  //   cube.position.x = 0;
  // }
  let t = time / 1000; //s
  cube.position.x = t * 1;
  if (cube.position.x > 5) {
    cube.position.x = 0;
  }
  renderer.render(scene, camera);
  // 渲染下一帧函数
  requestAnimationFrame(render);
}

render();
