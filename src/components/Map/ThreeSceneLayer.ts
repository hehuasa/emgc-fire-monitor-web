import rain from '@/assets/large_img/img/panel/weather/rain.png';
import snow from '@/assets/large_img/img/panel/weather/snow.png';
import { Map, MercatorCoordinate } from 'maplibre-gl';
import {
  AmbientLight,
  Matrix4,
  NoToneMapping,
  PerspectiveCamera,
  Scene,
  sRGBEncoding,
  Vector3,
  WebGLRenderer,
} from 'three';
import { v4 } from 'uuid';
import { ShaderLightning } from './lightning';
import { ShaderRain } from './rain';
import { ShaderSnow } from './snow';
import { ShaderWind } from './wind';

interface modelTransform {
  translateX: number;
  translateY: number;
  translateZ: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  scale: number;
}

export class ThreeSceneLayer {
  private static modelOrigin: [number, number] = [0, 0];
  private static modelAltitude = 0;
  private static modelRotate = [Math.PI / 2, 0, 0];
  private static transform: modelTransform;
  id: string;
  type: 'custom';
  renderingMode: '3d';
  map?: Map;
  container?: HTMLDivElement;
  camera: PerspectiveCamera;
  scene: Scene;
  renderer?: WebGLRenderer;
  shaderRain?: ShaderRain | null;
  shaderSnow?: ShaderSnow | null;
  shaderWind?: ShaderWind | null;
  shaderLightning?: ShaderLightning | null;
  rangeLength: number;
  rangeWidth: number;
  rangeHeight: number;
  rainCount: number;
  rainSpeed: number;
  snowCount: number;
  snowSpeed: number;
  windCount: number;
  windSpeed: number;

  constructor() {
    this.id = v4();
    this.type = 'custom';
    this.renderingMode = '3d';
    this.camera = new PerspectiveCamera();
    this.scene = new Scene();
    this.shaderRain = null;
    this.shaderSnow = null;
    this.shaderLightning = null;
    this.rangeLength = 600;
    this.rangeWidth = 600;
    this.rangeHeight = 600;
    this.rainCount = 20000;
    this.rainSpeed = 0.001;
    this.snowCount = 20000;
    this.snowSpeed = 0.2;
    this.windCount = 5000;
    this.windSpeed = 1;
  }

  // 经纬度转换为墨卡托坐标 经纬度->墨卡托坐标 [0, 0]->[0.5, 0.5] [180, 0]->[1, 0.5] [-180, 0]->[0, 0.5]
  SetPosition(modelOrigin: [number, number]) {
    ThreeSceneLayer.modelOrigin = modelOrigin;
    // 墨卡托坐标
    const modelAsMercatorCoordinate = MercatorCoordinate.fromLngLat(
      ThreeSceneLayer.modelOrigin,
      ThreeSceneLayer.modelAltitude
    );

    // 相机矩阵变化参数
    ThreeSceneLayer.transform = {
      // 平移
      translateX: modelAsMercatorCoordinate.x as number,
      translateY: modelAsMercatorCoordinate.y as number,
      translateZ: modelAsMercatorCoordinate.z as number,
      // 旋转
      rotateX: ThreeSceneLayer.modelRotate[0],
      rotateY: ThreeSceneLayer.modelRotate[1],
      rotateZ: ThreeSceneLayer.modelRotate[2],
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
    this.renderer.shadowMap.enabled = true; //如果设置，在场景中使用阴影贴图
    this.renderer.toneMapping = NoToneMapping; // 色调映射
    this.renderer.toneMappingExposure = 1; // 色调映射曝光级别
    this.renderer.outputEncoding = sRGBEncoding;

    const ambientLight = new AmbientLight(0xffffff, 1.0);
    this.scene.add(ambientLight);
  }

  // 渲染函数,在一个渲染帧允许图层绘制到GL上下文期间被调用。
  render(gl: WebGLRenderingContext, matrix: number[]) {
    this.SyncCamera(matrix);

    if (this.shaderRain && this.map) {
      this.shaderRain.Update(this.camera, this.map);
    }
    if (this.shaderSnow) {
      this.shaderSnow.Update();
    }
    if (this.shaderWind) {
      this.shaderWind.Update();
    }
    if (this.shaderLightning) {
      this.shaderLightning.Update(this.camera);
    }
  }

  // 同步相机 参数为地图相机矩阵
  private SyncCamera(matrix: number[]) {
    // 创建一个4*4单位矩阵，绕指定轴(第一个参数)旋转指定角度(第二个参数)
    const rotationX = new Matrix4().makeRotationAxis(
      new Vector3(1, 0, 0),
      ThreeSceneLayer.transform.rotateX
    );
    const rotationY = new Matrix4().makeRotationAxis(
      new Vector3(0, 1, 0),
      ThreeSceneLayer.transform.rotateY
    );
    const rotationZ = new Matrix4().makeRotationAxis(
      new Vector3(0, 0, 1),
      ThreeSceneLayer.transform.rotateZ
    );

    const m = new Matrix4().fromArray(matrix); // fromArray方法将存储Matrix4元素值的数组赋值给当前Matrix4(4x4矩阵)对象，matrix为世界坐标是向摄像机坐标系转换的相机矩阵
    const l = new Matrix4() // 创建一个4*4单位矩阵，进行平移、缩放，再与旋转矩阵相乘得到复合矩阵l,l时局部坐标系向世界坐标系(墨卡托坐标)转换的矩阵
      // 平移矩阵
      .makeTranslation(
        ThreeSceneLayer.transform.translateX,
        ThreeSceneLayer.transform.translateY,
        ThreeSceneLayer.transform.translateZ
      ) // 缩放矩阵
      .scale(
        new Vector3(
          ThreeSceneLayer.transform.scale,
          -ThreeSceneLayer.transform.scale,
          ThreeSceneLayer.transform.scale
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

  // 地图场景更新同步threejs场景
  update() {
    if (this.map && this.renderer) {
      // const temp = this.map.getCameraTargetElevation();
      // console.log('temp', temp);
      // const bounds = this.map.getBounds();
      // const canvas = this.map.getCanvas();
      // const size = [canvas.width, canvas.height];
      // const lngRadius = bounds.getEast() - bounds.getWest();
      // const latRadius = bounds.getNorth() - bounds.getSouth();
      // const lngCenter = (bounds.getWest() + bounds.getEast()) / 2;
      // const latCenter = (bounds.getNorth() + bounds.getSouth()) / 2;
      // const scale = this.map.transform.scale;
      // this.camera.fov = 75 / ((scale * Math.PI) / 180);
      // this.camera.updateProjectionMatrix();
      // // // this.container.style.width = size[0] + 'px';
      // // // this.container.style.height = size[1] + 'px';
      // // this.renderer.setSize(size[0], size[1]);
      // // 更新three.js场景的位置以匹配Mapbox地图的中心点和缩放级别
      // this.renderer.domElement.style.transform =
      //   'translate(' + -size[0] / 2 + 'px,' + -size[1] / 2 + 'px) scale(' + scale + ')';
      // // 添加three.js场景内容
      // this.scene.position.x = ((lngCenter - lngRadius / 2) / 180) * Math.PI;
      // this.scene.position.y = ((latCenter - latRadius / 2) / 180) * Math.PI;
      // this.scene.position.z = 0;
      // this.renderer?.render(this.scene, this.camera);
    }
  }

  /**
   *  雨幕效果
   */
  addRain(rainfall: number, windDirection: string, windSpeed = 0) {
    this.removeRain();

    let ratio = {
      EWRatio: 0,
      SNRatio: 0,
    };

    ratio = this.getWindDirectionRatio(windDirection);

    this.shaderRain = new ShaderRain(
      this.scene,
      this.rangeLength,
      this.rangeWidth,
      this.rangeHeight,
      rainfall > 200 ? (200000 * 200) / 50 : (200000 * rainfall) / 50,
      0.001,
      rain,
      0.1,
      2,
      (ratio.EWRatio * windSpeed) / 60,
      (ratio.SNRatio * windSpeed) / 60
    );
  }

  getWindDirectionRatio(windDirection: string) {
    switch (windDirection) {
      case '东风':
        return {
          EWRatio: 1,
          SNRatio: 0,
        };
      case '东南风':
        return {
          EWRatio: 1,
          SNRatio: 1,
        };
      case '南风':
        return {
          EWRatio: 0,
          SNRatio: 1,
        };
      case '西南风':
        return {
          EWRatio: -1,
          SNRatio: 1,
        };
      case '西风':
        return {
          EWRatio: -1,
          SNRatio: 0,
        };
      case '西北风':
        return {
          EWRatio: -1,
          SNRatio: -1,
        };
      case '北风':
        return {
          EWRatio: 0,
          SNRatio: -1,
        };
      case '东北风':
        return {
          EWRatio: 1,
          SNRatio: -1,
        };
      default:
        return {
          EWRatio: 0,
          SNRatio: 0,
        };
    }
  }

  /**
   *  清除雨幕
   */
  removeRain = () => {
    if (this.shaderRain) {
      this.shaderRain.rainMesh.geometry.dispose();
      this.shaderRain.rainMesh.material.dispose();
      this.scene.remove(this.shaderRain.rainMesh);
      this.shaderRain = null;
    }
  };

  /**
   *  雪幕效果
   */
  addSnow = () => {
    this.removeSnow();
    this.shaderSnow = new ShaderSnow(
      this.scene,
      this.rangeLength,
      this.rangeWidth,
      this.rangeHeight,
      this.snowCount,
      this.snowSpeed,
      snow,
      1,
      1
    );
  };

  /**
   *  清除雪幕
   */
  removeSnow = () => {
    if (this.shaderSnow) {
      for (let i = 0; i < this.shaderSnow.group.length; i++) {
        this.shaderSnow.group[i].geometry.dispose();
        this.shaderSnow.group[i].material.dispose();
        this.scene.remove(this.shaderSnow.group[i]);
      }

      this.shaderSnow.group = [];
      this.shaderSnow = null;
    }
  };

  /**
   *  风向效果
   */
  addWind(windDirection: string, windSpeed = 0) {
    this.removeWind();
    this.shaderWind = new ShaderWind(
      this.scene,
      this.rangeLength,
      this.rangeWidth,
      this.rangeHeight,
      this.windCount,
      windSpeed / 60,
      1,
      windDirection
    );
  }

  /**
   *  清除风向
   */
  removeWind = () => {
    if (this.shaderWind) {
      for (let i = 0; i < this.shaderWind.group.length; i++) {
        this.shaderWind.group[i].geometry.dispose();
        this.shaderWind.group[i].material.dispose();
        this.scene.remove(this.shaderWind.group[i]);
      }

      this.shaderWind.group = [];
      this.shaderWind = null;
    }
  };

  // 雷电效果 尚未实现
  addLightning = () => {
    this.Lightning();
    this.shaderLightning = new ShaderLightning(
      this.scene,
      this.rangeLength,
      this.rangeWidth,
      this.rangeHeight,
      this.rainCount,
      this.rainSpeed,
      rain,
      0.25,
      1
    );
  };

  /**
   *  清除雨幕
   */
  Lightning = () => {
    if (this.shaderLightning) {
      this.shaderLightning.rainMesh.geometry.dispose();
      this.shaderLightning.rainMesh.material.dispose();
      this.scene.remove(this.shaderLightning.rainMesh);
      this.shaderLightning = null;
    }
  };
}
