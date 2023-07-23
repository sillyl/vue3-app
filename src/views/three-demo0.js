import * as THREE from "three";

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

//将几何体添加到场景当中
scene.add(cube);

//初始化渲染器
const renderer = new THREE.WebGL1Renderer();
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// 将渲染内容canvas 添加到body 上
document.body.appendChild(renderer.domElement);

//使用渲染器，通过相机将场景渲染进来
renderer.render(scene, camera);
