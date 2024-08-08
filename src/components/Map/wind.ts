import {
  Box3,
  Box3Helper,
  Color,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  Scene,
  SphereGeometry,
  Vector3,
} from 'three';
/**
 * @class 粒子雪幕
 * @param scene threejs场景
 * @param width 范围宽度
 * @param height 范围高度
 * @param count 雨数量
 * @param speed 速度
 */
export class ShaderWind {
  length: number;
  width: number;
  height: number;
  speed: number;
  group: Array<any>;
  material: LineBasicMaterial;
  moveDistance: number;
  windDirection: string;
  constructor(
    scene: Scene,
    length: number,
    width: number,
    height: number,
    count: number,
    speed: number,
    windLengthRange: number,
    windDirection: string
  ) {
    this.length = length;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.group = [];
    this.moveDistance = 0;
    this.windDirection = windDirection;

    // box范围
    const box = new Box3(new Vector3(-length, 0, -width), new Vector3(length, height, width));
    const helper = new Box3Helper(box, new Color('#ff0'));
    // scene.add(helper);

    // 创建材质
    this.material = new LineBasicMaterial({
      color: '#87CEFA',
      opacity: Math.random() * 0.8,
      transparent: true,
    });

    // 数量
    for (let i = 0; i < count; i++) {
      // const randomLength = Math.random() * windLengthRange;
      // const points = [new Vector3(0, 0, 0), new Vector3(randomLength, 0, 0)];
      // const geometry = new BufferGeometry().setFromPoints(points);
      // const line = new Line(geometry, this.material);

      const geometry = new SphereGeometry(0.4, 12, 12);
      const material = new MeshBasicMaterial({
        color: 0xffffff,
        opacity: 0.5,
        transparent: true,
      });
      const sphere = new Mesh(geometry, material);

      sphere.position.x = Math.random() * (box.max.x - box.min.x) + box.min.x;
      sphere.position.y = Math.random() * (box.max.y - box.min.y) + box.min.y;
      sphere.position.z = Math.random() * (box.max.z - box.min.z) + box.min.z;

      const angle = this.getWindDirectionAngle(windDirection);
      sphere.rotation.y = angle;

      // 采用多个实例有性能影响，但目前不清楚如何通过shader旋转粒子，所以采用此方法
      this.group.push(sphere);
      scene.add(sphere);
    }
  }

  getWindDirectionAngle(windDirection: string) {
    switch (windDirection) {
      case '东风':
        return Math.PI;
      case '东南风':
        return (Math.PI * 3) / 4;
      case '南风':
        return Math.PI / 2;
      case '西南风':
        return Math.PI / 4;
      case '西风':
        return 0;
      case '西北风':
        return -Math.PI / 4;
      case '北风':
        return -Math.PI / 2;
      case '东北风':
        return (-Math.PI * 3) / 4;
      default:
        return 0;
    }
  }

  /**
   * @function 帧更新函数
   * @param camera 场景相机
   * @param clock 时钟
   */
  Update() {
    if (this.material) {
      const angle = this.getWindDirectionAngle(this.windDirection);
      const changeX = this.speed * Math.cos(angle);
      const changeZ = this.speed * Math.sin(angle);
      for (let i = 0; i < this.group.length; i++) {
        this.group[i].position.x += changeX;
        this.group[i].position.z -= changeZ;
        if (this.group[i].position.x >= this.length) {
          this.group[i].position.x = -this.length;
        } else if (this.group[i].position.x <= -this.length) {
          this.group[i].position.x = this.length;
        }

        if (this.group[i].position.z >= this.length) {
          this.group[i].position.z = -this.length;
        } else if (this.group[i].position.z <= -this.width) {
          this.group[i].position.z = this.length;
        }
      }
    }
  }
}
