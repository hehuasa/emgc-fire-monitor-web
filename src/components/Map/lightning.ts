import {
  AdditiveBlending,
  Box3,
  Box3Helper,
  BufferAttribute,
  BufferGeometry,
  Camera,
  Color,
  DoubleSide,
  Float32BufferAttribute,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  Points,
  RawShaderMaterial,
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
export class ShaderLightning {
  count: number;
  speed: number;
  time: number;
  rainMesh: any;
  material: any;
  constructor(
    scene: Scene,
    length: number,
    width: number,
    height: number,
    count: number,
    speed: number,
    img: any,
    imgWidth: number,
    imgHeight: number
  ) {
    this.count = count;
    this.speed = speed;
    this.time = 0;
    this.rainMesh = null;
    //box范围
    const box = new Box3(new Vector3(-length, 0, -width), new Vector3(length, height, width));
    const helper = new Box3Helper(box, new Color('#ff0'));
    // scene.add(helper);
    console.log(img);

    //创建雨
    this.material = new MeshBasicMaterial({
      transparent: true,
      opacity: 0.8,
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
        float ratio = (1.0 - y / height) * (1.0 - y / height);
        y = height * (1.0 - ratio);
        y += bottom;
        y += position.y - normal.y;
        vec3 transformed = vec3( foot.x, y, foot.y );
        // vec3 transformed = vec3( position );
        `;
      shader.vertexShader = shader.vertexShader.replace('#include <common>', getFoot);
      shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', begin_vertex);

      shader.uniforms.cameraPosition = {
        value: new Vector3(0, 200, 0),
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
    // scene.add(mesh);

    class Lightning {
      private points: [Vector3];
      private maxPoints: number;
      private amplitude: number;
      private frequency: number;
      private offsetX: number;
      private offsetY: number;

      constructor(
        maxPoints: number,
        amplitude: number,
        frequency: number,
        offsetX: number,
        offsetY: number
      ) {
        this.points = <any>[];
        this.maxPoints = maxPoints;
        this.amplitude = amplitude;
        this.frequency = frequency;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
      }

      generate() {
        const startX = Math.random() * this.offsetX;
        const startY = Math.random() * this.offsetY;
        let currentX = startX;
        let currentY = startY;

        for (let i = 0; i < this.maxPoints; i++) {
          const noiseX = Math.sin((i / this.frequency) * this.amplitude);
          const noiseY = Math.cos((i / this.frequency) * this.amplitude);

          currentX += noiseX;
          currentY += noiseY;

          this.points.push(new Vector3(currentX, currentY, 100));
        }
      }

      getPoints() {
        return this.points;
      }
    }

    // 使用示例
    const lightning = new Lightning(100, 500, 10, 800, 600);
    lightning.generate();
    const points = lightning.getPoints();

    // console.log('points', points);

    const lightningGeometry = new BufferGeometry().setFromPoints(points);
    const lightningMaterial = new LineBasicMaterial({ color: 0xff0000 });
    const lightningMesh = new Line(lightningGeometry, lightningMaterial);

    // scene.add(lightningMesh);

    // 自定义闪电着色器
    const vertexShader = `  
varying vec3 vNormal;  
void main() {  
    vNormal = normal;  
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);  
}  
`;

    const fragmentShader = `  
varying vec3 vNormal;  
void main() {  
    float intensity = dot(vNormal, normalize(vec3(0.0, 1.0, 0.0))); // 假设闪电从上往下  
    intensity = clamp(intensity, 0.0, 1.0);  
    gl_FragColor = vec4(vec3(intensity), 1.0);  
}  
`;

    // 粒子材质，使用自定义着色器
    const particleMaterial = new RawShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      blending: AdditiveBlending,
      transparent: true,
      depthWrite: false, // 不写入深度缓冲区，以允许叠加效果
    });

    // 粒子几何体
    const particlesGeometry = new BufferGeometry();
    const positions = [];
    const numParticles = 100; // 粒子数量

    for (let i = 0; i < numParticles; i++) {
      // 创建随机位置来模拟闪电的路径
      const x = Math.random() * 200 - 100;
      const y = Math.random() * 200;
      const z = Math.random() * 200 - 100;
      positions.push(x, y, z);
    }
    console.log('positions', positions);

    particlesGeometry.setAttribute('position', new Float32BufferAttribute(positions, 3));

    // 粒子系统
    const particleSystem = new Points(particlesGeometry, particleMaterial);
    scene.add(particleSystem);
  }

  /**
   * @function 帧更新函数
   * @param camera 场景相机
   * @param clock 时钟
   */
  Update(camera: Camera) {
    if (this.material) {
      this.time = this.time + this.speed;
      if (this.time >= 1) {
        this.time = 0;
      }
      this.material.cameraPosition = camera.position;
      if (this.material.uniforms) {
        this.material.uniforms.cameraPosition.value = camera.position;
        this.material.uniforms.time.value = this.time;
      }
    }
  }
}
