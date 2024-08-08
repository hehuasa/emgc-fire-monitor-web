import { Map } from 'maplibre-gl';
import {
  AxesHelper,
  Box3,
  Box3Helper,
  BufferAttribute,
  BufferGeometry,
  Camera,
  Color,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  Points,
  PointsMaterial,
  Scene,
  TextureLoader,
  Vector3,
} from 'three';

/**
 * @class 粒子雨幕
 * @param scene threejs场景
 * @param width 范围宽度
 * @param height 范围高度
 * @param count 雨数量
 * @param speed 速度
 */
export class ShaderRain {
  count: number;
  speed: number;
  time: number;
  rainMesh: any;
  pivot: any;
  material: any;
  EWRatio: number;
  SNRatio: number;
  particleGeometry: any;
  img: any;
  constructor(
    scene: Scene,
    length: number,
    width: number,
    height: number,
    count: number,
    speed: number,
    img: any,
    imgWidth: number,
    imgHeight: number,
    EWRatio: number,
    SNRatio: number
  ) {
    this.count = count;
    this.speed = speed;
    this.time = 0;
    this.rainMesh = null;
    this.pivot = null;
    this.particleGeometry = null;
    this.EWRatio = EWRatio;
    this.SNRatio = SNRatio;
    this.img = img;
    //box范围
    const box = new Box3(new Vector3(-length, 0, -width), new Vector3(length, height, width));
    const helper = new Box3Helper(box, new Color('#ff0'));
    // scene.add(helper);

    const axesHelper = new AxesHelper(100);
    // scene.add(axesHelper);

    //创建雨
    this.material = new MeshBasicMaterial({
      transparent: true,
      opacity: 0.5,
      map: new TextureLoader().load(img.src),
      depthWrite: true,
      side: DoubleSide,
      color: '#ffffff',
    });

    this.material.onBeforeCompile = (shader: any) => {
      const getFoot = `
        uniform float top;
        uniform float bottom;
        uniform float time;
        uniform float EWRatio;
        uniform float SNRatio;
        #include <common>
        float angle(float x, float y){
          return atan(y, x);
        }
        vec2 getFoot(vec2 camera,vec2 normal,vec2 pos){
            vec2 position;

            float distanceLen = distance(pos, normal);

            float a = angle(camera.x - normal.x, camera.y - normal.y);

            pos.x > normal.x ? a -= 0.785 : a += 0.785; 

            position.x = cos(a) * distanceLen;
            position.y = sin(a) * distanceLen;
            
            return position + normal;
        }
        `;
      const begin_vertex = `
        vec2 foot = getFoot(vec2(cameraPosition.x, cameraPosition.z),  vec2(normal.x, normal.z), vec2(position.x, position.z));
        float height = top - bottom;
        float y = top - normal.y  - height * time;
        y = y + (y < 0.0 ? height : 0.0);
        if(y < 0.0){
        foot.x += sin(time);
        }
        float ratio = (1.0 - y / height) * (1.0 - y / height);
        y = height * (1.0 - ratio);
        y += bottom;
        y += position.y - normal.y;
        vec3 transformed = vec3( foot.x + height * (1.0 - ratio) * EWRatio, y, foot.y + height * (1.0 - ratio) * SNRatio);
        `;
      shader.vertexShader = shader.vertexShader.replace('#include <common>', getFoot);
      shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', begin_vertex);

      shader.uniforms.cameraPosition = {
        value: new Vector3(0, 0, 0),
      };
      //高度
      shader.uniforms.top = {
        value: height,
      };
      shader.uniforms.bottom = {
        value: 0,
      };
      shader.uniforms.time = {
        value: 0,
      };
      shader.uniforms.EWRatio = {
        value: 0,
      };
      shader.uniforms.SNRatio = {
        value: 0,
      };
      this.material.uniforms = shader.uniforms;
    };

    const geometry = new BufferGeometry();

    const vertices = [];
    const normals = [];
    const uvs = [];
    const indices = [];

    //雨的数量
    for (let i = 0; i < this.count; i++) {
      const pos = new Vector3();
      pos.x = Math.random() * (box.max.x - box.min.x) + box.min.x;
      pos.y = Math.random() * (box.max.y - box.min.y) + box.min.y;
      pos.z = Math.random() * (box.max.z - box.min.z) + box.min.z;

      const width = imgWidth;
      const height = imgHeight;

      vertices.push(
        pos.x + width,
        pos.y + height / 2,
        pos.z,
        pos.x - width,
        pos.y + height / 2,
        pos.z,
        pos.x - width,
        pos.y - height / 2,
        pos.z,
        pos.x + width,
        pos.y - height / 2,
        pos.z
      );

      normals.push(
        pos.x,
        pos.y,
        pos.z,
        pos.x,
        pos.y,
        pos.z,
        pos.x,
        pos.y,
        pos.z,
        pos.x,
        pos.y,
        pos.z
      );

      uvs.push(1, 1, 0, 1, 0, 0, 1, 0);

      indices.push(i * 4 + 0, i * 4 + 1, i * 4 + 2, i * 4 + 0, i * 4 + 2, i * 4 + 3);
    }

    geometry.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
    geometry.setAttribute('normal', new BufferAttribute(new Float32Array(normals), 3));
    geometry.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2));
    geometry.setIndex(new BufferAttribute(new Uint32Array(indices), 1));

    // 雨幕采用一个实例对象是为了减少性能消耗
    const mesh = new Mesh(geometry, this.material);
    this.rainMesh = mesh;
    scene.add(mesh);

    // const material1 = new MeshBasicMaterial({
    //   transparent: true,
    //   opacity: 0.8,
    //   map: new TextureLoader().load(img.src),
    //   depthWrite: true,
    //   side: DoubleSide,
    //   color: '#ffffff',
    // });

    // const geometry1 = new CircleGeometry(50, 32);
    // const circle = new Mesh(geometry1, material1);
    // scene.add(circle);

    // this.initParticles(scene);
    // this.animate();
  }

  initParticles(scene: Scene) {
    // 粒子数量
    const particleCount = 1000;

    // 粒子位置数组
    const positions = [];

    // 随机设置粒子位置
    for (let i = 0; i < particleCount; i++) {
      // positions[i * 3] = Math.random() * 200; // x 坐标范围 -1 到 1
      // positions[i * 3 + 1] = Math.random() * 200; // y 坐标范围 -1 到 1
      // positions[i * 3 + 2] = Math.random() * 200; // z 坐标范围 -1 到 1
      const x = Math.random() * 300 - 300; // 随机x坐标
      const y = Math.random() * 300 - 300; // 随机y坐标
      const z = Math.random() * 300 - 300; // 随机z坐标
      const rainDrop = new Vector3(x, y, z);
      positions.push(rainDrop);
    }

    // 创建粒子几何体
    this.particleGeometry = new BufferGeometry().setFromPoints(positions);

    // 创建粒子材质
    const particleMaterial = new PointsMaterial({
      transparent: true,
      opacity: 0.8,
      map: new TextureLoader().load(this.img.src),
      depthWrite: true,
      side: DoubleSide,
      // color: '#ffffff',
      size: 10,
    });

    // 创建粒子系统并添加到场景中
    const particles = new Points(this.particleGeometry, particleMaterial);
    scene.add(particles);
  }

  // 动画循环
  animate() {
    requestAnimationFrame(this.animate);

    // 更新粒子位置（这里让粒子围绕球体旋转）
    const time = Date.now() * 0.001;
    for (let i = 0; i < this.particleGeometry.attributes.position.count; i++) {
      const position = this.particleGeometry.attributes.position.getXYZ(i);

      // 简单的旋转逻辑，可以根据需要调整
      position.x = Math.cos(time + i * 0.1) * 2;
      position.y = Math.sin(time + i * 0.1) * 2;
      position.z = Math.sin(time + i * 0.2) * 2;

      // 应用更新后的位置
      this.particleGeometry.attributes.position.needsUpdate = true;
    }

    // // 渲染场景
    // renderer.render(scene, camera);
  }

  /**
   * @function 帧更新函数
   * @param camera 场景相机
   * @param clock 时钟
   */
  Update(camera: Camera, map: Map) {
    if (this.material) {
      const bearing = map.getBearing();
      const pitch = map.getPitch();

      // this.rainMesh.rotation.x = -Math.PI / 8; // 南正北负
      // this.rainMesh.rotation.z = Math.PI / 8; // 西正东负
      // this.rainMesh.rotation.y = -(bearing * Math.PI) / 180 - Math.PI / 2;
      // this.rainMesh.rotation.y = Math.PI / 2;

      // const axis = new Vector3(-1, 1, 0).normalize(); // 归一化向量
      // this.pivot.quaternion.setFromAxisAngle(axis, (bearing * Math.PI) / 180);

      this.time = this.time + this.speed;
      if (this.time >= 1) {
        this.time = 0;
      }
      this.material.cameraPosition = camera.position;
      if (this.material.uniforms) {
        this.material.uniforms.cameraPosition.value = camera.position;
        this.material.uniforms.time.value = this.time;
        this.material.uniforms.EWRatio.value = this.EWRatio;
        this.material.uniforms.SNRatio.value = this.SNRatio;
      }
    }
  }
}
