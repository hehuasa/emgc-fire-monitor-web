/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Map, MercatorCoordinate } from 'maplibre-gl';
import {
  Camera,
  Color,
  DirectionalLight,
  Group,
  Line3,
  Material,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  NoToneMapping,
  PerspectiveCamera,
  PlaneGeometry,
  Raycaster,
  sRGBEncoding,
  TextureLoader,
  Vector2,
  WebGLRenderer,
} from 'three';

import { Vector3, Scene } from 'three';
import { IAlarm } from '@/models/alarm';
import { FeatureCollection, bearing, distance, point } from '@turf/turf';
import { Line2 } from 'three/examples/jsm/lines/Line2';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
interface modelTransform {
  translateX: number;
  translateY: number;
  translateZ: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  scale: number;
}

type FeatureCollection_ = FeatureCollection<
  {
    coordinates: any[];
    type: string;
  },
  {
    layerId: string;
    currentAlarm: IAlarm;
    alarmId: string;
    alarmAreaId: string;
    floorLevel: string;
  }
>;
interface IProps {
  featurecollection: FeatureCollection_;
}

const oripoint = [103.90517552605934, 31.05350756515645];
export class AlarmLineAndPerson {
  private static modelOrigin: number[] = [0, 0];
  private static modelAltitude = 0;
  private static modelRotate = [0, 0, -Math.PI / 2];
  private static transform: modelTransform;
  id: string;
  type: 'custom';
  renderingMode: '3d';
  raycaster: Raycaster;
  map?: Map;
  camera: Camera;
  scene: Scene;
  renderer?: WebGLRenderer;
  lines: { alarmId: string; line: Line2 }[];
  needAnimate: boolean;
  imagePath: string;
  alarmType: string;
  color: string;
  showLine: boolean;
  scale: number;
  spritesGroup: Group;
  sprites: { alarmId: string; sprite: Mesh; up: boolean }[];
  featurecollection: FeatureCollection_;

  speed: number;
  level: number;
  constructor(
    id: string,
    alarmType: string,
    color: string,
    imagePath: string,
    needAnimate: boolean,
    speed: number,
    showLine: boolean,
    scale: number,
    level: number,
    featurecollection: FeatureCollection_
  ) {
    this.id = id;
    this.type = 'custom';
    this.renderingMode = '3d';
    this.camera = new PerspectiveCamera();
    this.scene = new Scene();
    this.lines = [];
    this.sprites = [];
    this.imagePath = imagePath;
    this.needAnimate = needAnimate;
    this.alarmType = alarmType;
    this.color = color;
    this.speed = alarmType === 'PON' ? 0.016 : 0.005;
    this.scale = scale;
    this.showLine = showLine;
    this.level = level;
    this.spritesGroup = new Group();
    this.featurecollection = featurecollection;
    this.raycaster = new Raycaster();
  }

  // 经纬度转换为墨卡托坐标 经纬度->墨卡托坐标 [0, 0]->[0.5, 0.5] [180, 0]->[1, 0.5] [-180, 0]->[0, 0.5]
  initPosition(modelOrigin: number[]) {
    AlarmLineAndPerson.modelOrigin = modelOrigin;
    // 墨卡托坐标
    const modelAsMercatorCoordinate = MercatorCoordinate.fromLngLat(
      AlarmLineAndPerson.modelOrigin as [number, number],
      AlarmLineAndPerson.modelAltitude
    );

    // 相机矩阵变化参数
    AlarmLineAndPerson.transform = {
      // 平移
      translateX: modelAsMercatorCoordinate.x as number,
      translateY: modelAsMercatorCoordinate.y as number,
      translateZ: modelAsMercatorCoordinate.z as number,
      // 旋转
      rotateX: AlarmLineAndPerson.modelRotate[0],
      rotateY: AlarmLineAndPerson.modelRotate[1],
      rotateZ: AlarmLineAndPerson.modelRotate[2],
      // 缩放  返回此纬度上以墨卡托坐标单位表示的1米距离,对于以米为单位的真实世界坐标,这自然提供了转换为墨卡托坐标的比例
      scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
    };
  }

  // 当一个图层通过Map#addLayer被添加到地图上时被调用,该方法给了图层一个初始化gl资源和注册事件监听的机会
  onAdd(map: Map, gl: WebGLRenderingContext) {
    this.map = map;
    this.renderer = new WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl,
      antialias: true, // 是否执行抗锯齿
      precision: 'mediump', // 着色器精度
      alpha: true, // 画布是否包含 alpha（透明度）缓冲区
      // logarithmicDepthBuffer: false // 是否使用对数深度缓冲区。如果在单个场景中处理巨大的比例差异，则可能需要使用它
    });
    this.renderer.autoClear = false; // 定义渲染器是否应在渲染帧之前自动清除其输出，为true时，该图层之前的加载的地图元素会被清除
    // this.renderer.physicallyCorrectLights = true; // 开启时场景颜色会变暗
    this.renderer.shadowMap.enabled = false; //如果设置，在场景中使用阴影贴图
    this.renderer.toneMapping = NoToneMapping; // 色调映射
    this.renderer.toneMappingExposure = 1; // 色调映射曝光级别
    this.renderer.outputEncoding = sRGBEncoding;

    this.initPosition(oripoint);
    const directionalLight = new DirectionalLight(0xffffff);
    directionalLight.position.set(0, -70, 100).normalize();
    this.scene.add(directionalLight);
    this.genLine(this.featurecollection);

    // window.addEventListener('click', this.click);
    // this.scene.add(this.spritesGroup);

    // this.lines = lines;
    // this.sprites = sprites;

    // for (const { line } of this.lines) {
    //   this.scene.add(line);
    // }
    // for (const { sprite } of this.sprites) {
    //   this.scene.add(sprite);
    // }

    // const geometryb = new BoxGeometry(1, 1, 1);
    // const materialb = new MeshBasicMaterial({ color: 0x00ff00 });
    // const cube = new Mesh(geometryb, materialb);
    // this.scene.add(cube);
  }

  //   getXY = (point_: number[]) => {
  //     const start = point(oripoint);
  //     const end = point(point_)
  //     const ori = toMercator(start);
  //     const newp = toMercator(end);

  //     const length = distance(start, end)
  //     const bearing_ = bearing(start, end)

  //     // const x = newp.geometry.coordinates[0] - ori.geometry.coordinates[0];
  //     // const y = newp.geometry.coordinates[1] - ori.geometry.coordinates[1];

  //     const x = newp.geometry.coordinates[0] - ori.geometry.coordinates[0];
  //     const y = newp.geometry.coordinates[1] - ori.geometry.coordinates[1];
  //     return { x, y };
  //   };

  getXY = (point_: number[]) => {
    const start = point(oripoint);
    const end = point(point_);
    // const ori = toMercator(start);
    // const newp = toMercator(end);

    const length = distance(start, end) * 1000;
    const bearing_ = bearing(start, end) * (Math.PI / 180);

    // const x = newp.geometry.coordinates[0] - ori.geometry.coordinates[0];
    // const y = newp.geometry.coordinates[1] - ori.geometry.coordinates[1];
    // console.info('============length==============', length);
    // console.info('============bearing_==============', bearing_);

    const x = Math.cos(bearing_) * length;
    const y = Math.sin(bearing_) * length;
    return { x, y };
  };

  genLine = (featurecollection: FeatureCollection_) => {
    // const lines = [];
    // const sprites = [];
    // const map = new TextureLoader().load('/map/cross.png');
    const map = new TextureLoader().load(this.imagePath);

    // const materials = new SpriteMaterial({
    //   map: map,

    //   // opacity: Number(Math.random().toFixed(2))
    // });
    const materialsp = new MeshBasicMaterial({
      map: map,
      // color: 'rgba(0,0,0,0)',
      transparent: true,

      // opacity: 0.1,
      depthWrite: false,
      // opacity: Number(Math.random().toFixed(2))
    });
    // materials.transparent = false;
    // materials.sizeAttenuation = false;

    if (featurecollection && featurecollection.features) {
      for (const iterator of featurecollection.features.filter(
        (val) =>
          val.geometry.type === 'LineString' &&
          val.properties.currentAlarm.alarmType === this.alarmType
      )) {
        const alarmId = iterator.properties.alarmId;

        if (this.lines.find((val) => val.alarmId === alarmId)) {
          continue;
        }

        const material = new LineMaterial({
          color: new Color(this.color).getHex(),
          linewidth: 6,
          opacity: this.showLine ? 1 : 0,
          transparent: this.showLine ? false : true,
        });
        //   const materials = new SpriteMaterial({ map: map, opacity: Math.random() });

        material.resolution.set(window.innerWidth, window.innerHeight);
        const points = [];

        const vector3s = [];
        for (const item of iterator.geometry.coordinates) {
          const { x, y } = this.getXY(item);

          points.push(-x, y, 0);
          vector3s.push(new Vector3(-x, y, 0));
        }
        // 线条
        const lingeom = new LineGeometry();
        lingeom.setPositions(points);
        const line = new Line2(lingeom, material);
        line.renderOrder = -1;
        // lines.push({ alarmId, line });
        this.lines.push({ alarmId, line });
        this.scene.add(line);

        // 线条的中心点
        for (const [index, iterator] of vector3s.entries()) {
          if (index >= vector3s.length - 1) {
            break;
          }
          const line3 = new Line3(iterator, vector3s[index + 1]);
          const center_ = new Vector3();
          line3.getCenter(center_);

          // 精灵图
          const planeG = new PlaneGeometry(8, 8);
          // const sprite = new Sprite(materials);
          const plane = new Mesh(planeG, materialsp);
          plane.position.set(center_.x, center_.y, center_.z + 0.1 * this.level);
          plane.scale.set(this.scale, this.scale, this.scale);
          // plane.rotation.set(Math.PI / 2, 0, 0);

          // sprites.push(sprite);
          this.sprites.push({ alarmId, sprite: plane, up: true });
          // this.spritesGroup.add(plane);
          this.scene.add(plane);

          // // 运动轨迹线---首先计算一条与轨迹线垂直的线条，长度 为 5米

          // const length = 5;
          // // const radian  =90 * Math.PI  / 180;
          // // 计算起点左侧的点坐标

          // const startP = vector3s[0];

          // // 起点与中点相对于二维坐标系的角度
          // const length1 = center_.distanceTo(vector3s[0]);

          // const radian1 = Math.asin((center_.y - startP.y) / length1);
          // const angel1 = (radian1 * 180) / Math.PI;

          // // 根据余弦值反推角度
          // const tan = length / length1;
          // const length2 = Math.sqrt(length * length + length1 * length1);
          // const radian = Math.atan(tan);
          // const angel2 = (radian * 180) / Math.PI;
          // const angel3 = 90 - angel2;
          // // const angel3 = 90 - angel1;

          // const angel4 = 90 - angel3 - angel1;

          // const newCenstartX = Math.sign((angel4 * Math.PI) / 180) * length2;
          // const newCenstartY = Math.cos((angel4 * Math.PI) / 180) * length2;
          // // sprites.ren
          // const start = new Vector3(vector3s[0].x + newCenstartX, vector3s[0].y + newCenstartY, 0); // 轨迹线起点

          // const angel5 = angel1 - angel3;
          // const newCensendX = Math.sign((angel5 * Math.PI) / 180) * length2;
          // const newCenendtY = Math.cos((angel5 * Math.PI) / 180) * length2;

          // const end = new Vector3(vector3s[0].x + newCensendX, vector3s[0].y + newCenendtY, 0); // 轨迹线起点

          // const geometry = new BufferGeometry().setFromPoints([start, end]);

          // console.info('===========start===============', start);
          // console.info('===========end===============', end);

          // console.info('============vector3s==============', vector3s);

          // const lengthC = end.distanceTo(start);

          // console.info('============lengthC==============', lengthC);

          // const line = new Line(geometry, new LineBasicMaterial({ color: 'blue' }));
          // this.scene.add(line);
        }
      }
    }

    // return { lines, sprites };
  };
  click = (event: { clientX: number; clientY: number }) => {
    console.info('============1111==============', 1111);
    const pointer = new Vector2();
    pointer.x = (event.clientX / this.map!.getCanvas().width) * 2 - 1;
    pointer.y = -(event.clientY / this.map!.getCanvas().height) * 2 + 1;
    this.raycaster.setFromCamera(pointer, this.camera);

    const sps = [];

    for (const item of this.sprites) {
      sps.push(item.sprite);
    }
    console.info('============sps==============', sps);

    const intersects = this.raycaster.intersectObjects(this.scene.children);

    if (intersects.length > 0) {
      //alert(intersects[0].object.name);
      console.log(intersects[0].object);
    }
  };
  // 渲染函数,在一个渲染帧允许图层绘制到GL上下文期间被调用。
  render(gl: WebGLRenderingContext, matrix: number[]) {
    // if (this.needAnimate) {
    //   this.animate();
    // }
    this.animate();
    this.SyncCamera(matrix);
  }

  clear = () => {
    for (const { line } of this.lines) {
      line.geometry.dispose();
      line.material.dispose();
      this.scene.remove(line);
    }

    for (const { sprite } of this.sprites) {
      sprite.geometry.dispose();
      // @ts-ignore

      sprite.material.dispose();
      this.scene.remove(sprite);
    }
    window.removeEventListener('click', this.click);
  };
  update = (featurecollection: FeatureCollection_) => {
    this.featurecollection = featurecollection;
    // this.clear();

    const currentAlarms = this.featurecollection.features.filter(
      (val) =>
        val.geometry.type === 'LineString' &&
        val.properties.currentAlarm.alarmType === this.alarmType
    );

    // 需要删除的报警
    const needDelIds: string[] = [];
    for (const { alarmId, sprite } of this.sprites) {
      const notInclude = !currentAlarms.find((val) => alarmId === val.properties.alarmId);
      if (notInclude) {
        needDelIds.push(alarmId);

        sprite.geometry.dispose();
        // @ts-ignore
        sprite.material.dispose();
        this.scene.remove(sprite);

        const line = this.lines.find((val) => val.alarmId === alarmId);

        if (line) {
          line.line.geometry.dispose();
          // @ts-ignore

          line.line.material.dispose();
          this.scene.remove(line.line);
        }
      }
    }
    this.lines = this.lines.filter((val) => !needDelIds.includes(val.alarmId));
    this.sprites = this.sprites.filter((val) => !needDelIds.includes(val.alarmId));

    // 需要新增的报警

    // const feas = currentAlarms.filter((val) => !this.lines.find((line) => line.alarmId === val.properties.alarmId));

    this.genLine(featurecollection);

    // this.lines = lines;
    // this.sprites = sprites;

    // for (const { line } of this.lines) {
    //   this.scene.add(line);
    // }
    // for (const { sprite } of this.sprites) {
    //   this.scene.add(sprite);
    // }
  };
  changeOp = (mt: Material, val: number) => {
    mt.opacity = val;
  };
  animate = () => {
    // for (const line of this.lines) {
    //   line.material.opacity += 0.005;
    //   if (line.material.opacity >= 1) {
    //     line.material.opacity = 0;
    //   }
    // }
    // return;

    // this.speed += 0.001;;
    // this.spritesGroup.o
    for (const item of this.sprites) {
      // const scale = sprite.scale.x;
      // let newscale = scale + 0.05;
      // if (newscale >= 8) {
      //   newscale = 0.1;
      // }
      // sprite.scale.set(newscale, newscale, newscale);

      // sprite.material.opacity += 0.01;
      // @ts-ignore

      const newOp = this.speed / this.sprites.length;
      // const op = JSON.parse(JSON.stringify(item.sprite.material.opacity));

      if (item.up) {
        // this.speed += 0.002 / this.sprites.length;
        // @ts-ignore
        // this.changeOp(item.sprite.material, this.speed);
        item.sprite.material.opacity += newOp;
        // @ts-ignore

        if (item.sprite.material.opacity >= 1) {
          item.up = false;
        }
      } else {
        // @ts-ignore
        // this.speed -= 0.002 / this.sprites.length;

        // this.changeOp(item.sprite.material, this.speed);
        // @ts-ignore

        item.sprite.material.opacity -= newOp;
        // @ts-ignore

        if (item.sprite.material.opacity <= 0.2) {
          item.up = true;
        }
      }
    }
  };
  // 同步相机 参数为地图相机矩阵
  private SyncCamera(matrix: number[]) {
    // 创建一个4*4单位矩阵，绕指定轴(第一个参数)旋转指定角度(第二个参数)
    const rotationX = new Matrix4().makeRotationAxis(
      new Vector3(1, 0, 0),
      AlarmLineAndPerson.transform.rotateX
    );
    const rotationY = new Matrix4().makeRotationAxis(
      new Vector3(0, 1, 0),
      AlarmLineAndPerson.transform.rotateY
    );
    const rotationZ = new Matrix4().makeRotationAxis(
      new Vector3(0, 0, 1),
      AlarmLineAndPerson.transform.rotateZ
    );

    const m = new Matrix4().fromArray(matrix); // fromArray方法将存储Matrix4元素值的数组赋值给当前Matrix4(4x4矩阵)对象，matrix为世界坐标是向摄像机坐标系转换的相机矩阵
    const l = new Matrix4() // 创建一个4*4单位矩阵，进行平移、缩放，再与旋转矩阵相乘得到复合矩阵l,l时局部坐标系向世界坐标系(墨卡托坐标)转换的矩阵
      // 平移矩阵
      .makeTranslation(
        AlarmLineAndPerson.transform.translateX,
        AlarmLineAndPerson.transform.translateY,
        AlarmLineAndPerson.transform.translateZ
      ) // 缩放矩阵
      .scale(
        new Vector3(
          AlarmLineAndPerson.transform.scale,
          -AlarmLineAndPerson.transform.scale,
          AlarmLineAndPerson.transform.scale
        )
      ) // 旋转矩阵
      .multiply(rotationX) // a.multiply(b):矩阵相乘axb，结果保存在a; a.premultiply(b):矩阵相乘bxa，结果保存在a
      .multiply(rotationY)
      .multiply(rotationZ);

    this.camera.projectionMatrix = m.multiply(l); // Camera.projectionMatrix表示将场景中的信息投影到裁剪空间。
    this.camera.updateMatrixWorld(); // three.js中的Mesh和Camera都继承自Object3D，Object3D提供了更新图形矩阵的接口,在分别设置Mesh和camera的图形变换参数之后，需要调用updateMatrixWorld()才能保证图形矩阵正确：
    this.renderer?.resetState();
    this.renderer?.render(this.scene, this.camera);
    this.map?.triggerRepaint(); // 触发一个显示框的渲染。使用自定义图层时，当图层发生改变，使用此方法去重渲染。 在下一个显示框渲染前多次调用此方法也只会渲染一次。
  }
}
