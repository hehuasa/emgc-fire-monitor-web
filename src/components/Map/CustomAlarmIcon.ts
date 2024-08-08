// const path = `M512 0.03722A463.5119 463.5119 0 0 0 42.712101 457.614122 461.639901 461.639901 0 0 0 448.643014 911.030024l58.620987 112.953976 57.836988-111.689976a461.991901 461.991901 0 0 0 416.18691-454.679902A463.4959 463.4959 0 0 0 517.887999 0.03722h-5.935999`;

const path = `M451.700364 891.764364A442.181818 442.181818 0 0 1 69.818182 453.725091a442.181818 442.181818 0 0 1 442.181818-442.181818 442.181818 442.181818 0 0 1 442.181818 442.181818 442.181818 442.181818 0 0 1-381.882182 438.039273L512 1012.270545z`;
export default class CustomAlarmIcon {
  map: maplibregl.Map | undefined;
  canvas: HTMLCanvasElement;
  context!: CanvasRenderingContext2D;
  image: ImageBitmap | HTMLImageElement;
  size!: number;
  color: string;

  width!: number;
  height!: number;
  strokeStyle!: string;
  fillStyle!: string;

  data!: Uint8Array | Uint8ClampedArray;
  constructor(props: { size?: number; image: ImageBitmap | HTMLImageElement; color: string }) {
    const { size, image, color } = props;

    this.canvas = document.createElement('canvas');
    // const img = document.createElement("img");
    // img.src = "/"
    this.image = image;
    this.size = size || 48;
    this.color = color;

    this.width = this.size;
    this.height = this.size;

    // 最终的返回data
    this.data = new Uint8Array(this.size * this.size * 4);
  }

  onAdd = (map: maplibregl.Map) => {
    this.map = map;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.context = this.canvas.getContext('2d')!;

    // const a = map.getImage('FAS_09');
    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';

    this.canvas.width = this.width;

    this.canvas.height = this.height;
    // this.canvas.width = this.width * window.devicePixelRatio;

    // this.canvas.height = this.height * window.devicePixelRatio;
    // this.context.scale(window.devicePixelRatio, window.devicePixelRatio);

    // const path1 = 'M10 10 h 80 v 80 h -80 Z';
    const iconBackground = new Path2D(path);

    this.context.scale(0.04, 0.04);
    this.context.fillStyle = this.color;
    this.context.fill(iconBackground);

    this.context.globalCompositeOperation = 'source-over';
    this.context.scale(25, 25);

    this.context.drawImage(
      this.image,
      this.width / 2 - 24 / 2 - 3,
      this.height / 2 - 24 / 2 - 6,
      24,
      24
    );
    // this.context.scale(0.5, 0.5);
  };
  render = () => {
    // 导出 imgData
    const data_ = this.context.getImageData(0, 0, this.width, this.height);
    this.data = data_.data;
    // this.map?.triggerRepaint();
    // 回调，用于通知地图 img的状态
    return true;
  };
}
