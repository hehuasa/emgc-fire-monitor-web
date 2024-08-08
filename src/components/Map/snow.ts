import { Mesh, Vector3, TextureLoader, Box3, MeshBasicMaterial, DoubleSide, PlaneGeometry, Scene, Box3Helper, Color } from 'three';
/**
 * @class 粒子雪幕
 * @param scene threejs场景
 * @param width 范围宽度
 * @param height 范围高度
 * @param count 雨数量
 * @param speed 速度
 */
export class ShaderSnow {
  height: number;
  speed: number;
  group: Array<any>;
  material: MeshBasicMaterial;
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
    this.height = height;
    this.speed = speed;
    this.group = [];

    // box范围
    const box = new Box3(new Vector3(-length, 0, -width), new Vector3(length, height, width));
    const helper = new Box3Helper(box, new Color('#ff0'));
    // scene.add(helper);

    // 创建材质
    this.material = new MeshBasicMaterial({
      transparent: true,
      opacity: 0.8,
      map: new TextureLoader().load(img.src),
      depthWrite: true,
      side: DoubleSide,
    });

    // 数量
    for (let i = 0; i < count; i++) {
      const randomSize = Math.random() * 1 + 0.5;
      const geometry = new PlaneGeometry(imgWidth * randomSize, imgHeight * randomSize);
      const mesh = new Mesh(geometry, this.material);
      mesh.position.x = Math.random() * (box.max.x - box.min.x) + box.min.x;
      mesh.position.y = Math.random() * (box.max.y - box.min.y) + box.min.y;
      mesh.position.z = Math.random() * (box.max.z - box.min.z) + box.min.z;

      mesh.rotation.x = Math.random();
      mesh.rotation.y = Math.random();
      mesh.rotation.z = Math.random();

      // 采用多个实例有性能影响，但目前不清楚如何通过shader旋转粒子，所以采用此方法
      this.group.push(mesh);
      scene.add(mesh);
    }
  }

  /**
   * @function 帧更新函数
   * @param camera 场景相机
   * @param clock 时钟
   */
  Update() {
    if (this.material) {
      for (let i = 0; i < this.group.length; i++) {
        this.group[i].position.y -= this.speed;
        this.group[i].rotation.x -= Math.random() * 0.03;
        this.group[i].rotation.y -= Math.random() * 0.03;
        this.group[i].rotation.z -= Math.random() * 0.03;
        if (this.group[i].position.y <= 0) {
          this.group[i].position.y = this.height;
        }
      }
    }
  }
}
