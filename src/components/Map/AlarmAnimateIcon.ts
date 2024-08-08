/* eslint-disable @typescript-eslint/ban-ts-comment */
type RgbArray = number[];

export default class AlarmAnimateIcon {
  map: maplibregl.Map | undefined;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  animateSize: number;
  color: string;
  width!: number;
  height!: number;

  duration: number;
  rgbArray!: RgbArray;
  data!: Uint8Array | Uint8ClampedArray;
  constructor(props: { color: string; speed: 1 | 2 | 3 | 4 | 5; size: number }) {
    const { color, size, speed } = props;

    this.canvas = document.createElement('canvas');

    this.animateSize = size;
    this.width = this.animateSize;
    this.height = this.animateSize;
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;

    this.canvas.width = this.width;

    this.canvas.height = this.height;
    this.color = color;

    // this.rgbArray = rgbArray;

    switch (speed) {
      case 1:
        this.duration = 3200;
        break;
      case 2:
        this.duration = 2600;
        break;
      case 3:
        this.duration = 2000;
        break;
      case 4:
        this.duration = 1200;
        break;
      case 5:
        this.duration = 600;
        break;
      default:
        this.duration = 2000;
    }

    // 最终的返回data
    this.data = new Uint8Array(this.animateSize * this.animateSize * 4);
  }

  onAdd = (map: maplibregl.Map) => {
    this.map = map;
  };
  render = () => {
    const t = (performance.now() % this.duration) / this.duration;

    const radius1 = (this.animateSize / 2) * 0.1;
    const outerRadius1 = (this.animateSize / 2) * 0.8 * t + radius1;

    const { context } = this;

    // 圈1

    context.clearRect(0, 0, this.width, this.height);

    context.clearRect(0, 0, this.width, this.height);
    context.beginPath();

    context.arc(
      this.width / 2,
      this.height / 2,
      outerRadius1 < 18 ? 18 : outerRadius1,
      0,
      Math.PI * 2
    );
    context.fillStyle = this.color;
    context.fill();

    // 导出 imgData
    const data_ = context.getImageData(0, 0, this.width, this.height);
    this.data = data_.data;
    this.map?.triggerRepaint();
    // 回调，用于通知地图 img的状态
    return true;
  };
}
