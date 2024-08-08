/* eslint-disable @typescript-eslint/ban-ts-comment */
type RgbArray = number[];

export default class AlarmAnimateIcon {
  map: maplibregl.Map | undefined;
  canvas: HTMLCanvasElement;
  context!: CanvasRenderingContext2D;
  // @ts-ignore
  size!: number;
  halfSzie!: number;
  animateSize!: number;
  width!: number;
  height!: number;
  strokeStyle!: string;
  fillStyle!: string;
  rgbArray!: RgbArray;
  data!: Uint8Array | Uint8ClampedArray;
  constructor(props: { rgbArray: RgbArray; size?: number }) {
    const { rgbArray, size } = props;

    this.canvas = document.createElement('canvas');

    this.animateSize = 68;
    this.size = size || 48;
    this.halfSzie = 34;
    this.strokeStyle = 'rgba(255,255,255,1)'; // 报警动画的图标，默认白色线条。动画效果通过背景色的扩散以及透明度的切换实现，报警图标样式不变
    this.fillStyle = `rgba(${rgbArray[0]}, ${rgbArray[1]}, ${rgbArray[2]}, 1)`;
    this.rgbArray = rgbArray;
    this.width = this.animateSize;
    this.height = this.animateSize;

    // 最终的返回data
    this.data = new Uint8Array(this.animateSize * this.animateSize * 4);
  }

  onAdd = (map: maplibregl.Map) => {
    this.map = map;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.context = this.canvas.getContext('2d')!;

    this.canvas.width = this.width;

    this.canvas.height = this.height;
    // this.context.strokeStyle = this.strokeStyle;
    // this.context.fillStyle = this.fillStyle;
  };
  render = () => {
    const duration = 800;
    const t = (performance.now() % duration) / duration;

    // 3圈顺序动画，用于报警闪烁
    const radius1 = (this.size / 2) * 0.1;
    const outerRadius1 = (this.size / 2) * 0.7 * t + radius1;

    const radius2 = (this.size / 2) * 0.4;
    const outerRadius2 = (this.size / 2) * 0.7 * t + radius2;

    const radius3 = (this.size / 2) * 0.9;
    const outerRadius3 = (this.size / 2) * 0.7 * t + radius3;

    const { context } = this;

    // 圈1

    context.clearRect(0, 0, this.width, this.height);

    // const gd = context.createRadialGradient(this.width / 2, this.height / 2, 0, this.width / 2, this.height / 2, this.halfSzie);

    // gd.addColorStop(0, `rgba(${this.rgbArray[0]}, ${this.rgbArray[1]}, ${this.rgbArray[2]}, 0`);

    // gd.addColorStop(0.2, `rgba(${this.rgbArray[0]}, ${this.rgbArray[1]}, ${this.rgbArray[2]}, 0.5`);

    // gd.addColorStop(0.5, `rgba(${this.rgbArray[0]}, ${this.rgbArray[1]}, ${this.rgbArray[2]}, .9)`);

    // gd.addColorStop(0.7, `rgba(${this.rgbArray[0]}, ${this.rgbArray[1]}, ${this.rgbArray[2]}, 0.5)`);

    // gd.addColorStop(1, `rgba(${this.rgbArray[0]}, ${this.rgbArray[1]}, ${this.rgbArray[2]}, 0)`);

    // context.globalAlpha = 1 - t;

    // context.fillStyle = gd;
    // context.fillRect(0, 0, this.width, this.height);

    // // 圈1
    context.clearRect(0, 0, this.width, this.height);
    context.beginPath();

    context.arc(this.width / 2, this.height / 2, outerRadius1 < 6 ? 6 : outerRadius1, 0, Math.PI * 2);

    // context.arc(this.width / 2, this.height / 2, outerRadius2 < radius2 ? radius2 : outerRadius2, 0, Math.PI * 2, true);

    // context.fillStyle = 'rgba(0,0,0,1)';
    // context.fillStyle = `rgba(${this.rgbArray[0]}, ${this.rgbArray[1]}, ${this.rgbArray[2]}, ${1 - t}})`;

    context.fillStyle = `rgba(${this.rgbArray[0]}, ${this.rgbArray[1]}, ${this.rgbArray[2]}, 0.3)`;

    context.fill();
    // context.stroke();
    // context.globalAlpha = 1;
    // 圈2
    // context.beginPath();
    // context.arc(this.width / 2, this.height / 2, outerRadius2 < radius2 ? radius2 : outerRadius2, 0, Math.PI * 2);
    // context.arc(
    //   this.width / 2,
    //   this.height / 2,
    //   outerRadius3 < radius2 ? radius2 : outerRadius3 > this.halfSzie ? this.halfSzie : outerRadius3,
    //   0,
    //   Math.PI * 2,
    //   true
    // );
    // context.fillStyle = `rgba(${this.rgbArray[0]}, ${this.rgbArray[1]}, ${this.rgbArray[2]}, ${1 - t})`;

    // context.fill();

    // 圈3
    // context.beginPath();
    // context.arc(this.width / 2, this.height / 2, outerRadius3 > this.halfSzie ? this.halfSzie : outerRadius3, 0, Math.PI * 2);
    // context.fillStyle = `rgba(${this.rgbArray[0]}, ${this.rgbArray[1]}, ${this.rgbArray[2]}, ${1 - t})`;
    // context.fill();

    //  背景圆，无动画
    context.beginPath();
    context.arc(this.width / 2, this.height / 2, 6, 0, Math.PI * 2);
    context.fillStyle = `rgba(${this.rgbArray[0]}, ${this.rgbArray[1]}, ${this.rgbArray[1]}, 0.3)`;

    context.strokeStyle = `rgba(${this.rgbArray[0]}, ${this.rgbArray[1]}, ${this.rgbArray[2]}, 0.3)`;
    // context.globalAlpha = 1;

    context.fill();
    // context.stroke();
    context.globalAlpha = 1;

    // 将iconFont的图标的svgPath重绘至canvas
    // for (const node of this.childs) {
    //   // @ts-ignore
    //   const path = node.getAttribute('d');

    //   const scale = 32 / 1024;
    //   // @ts-ignore
    //   const sp = new SvgPath.default(path, scale);
    //   context.beginPath();

    //   sp.save()
    //     .fillStyle(`rgba(${this.rgbArray[0]}, ${this.rgbArray[1]}, ${this.rgbArray[2]}, 1`)
    //     .strokeStyle(`rgba(${this.rgbArray[0]}, ${this.rgbArray[1]}, ${this.rgbArray[2]}, 1`)
    //     .to(this.context)
    //     .stroke()
    //     .fill();
    // }

    // const img = new Image();
    // img.src = "/GAS.svg";

    // for (const childNode of this.childs) {
    //   const path_ = childNode.getAttribute("d");

    //   //
    //   const path = new Path2D(path_);
    //   context.fill(path);

    //   context.stroke(path);
    // }

    // context.drawImage(img, this.width / 4, this.height / 4);
    // context.globalAlpha = 1;

    // 导出 imgData
    const data_ = context.getImageData(0, 0, this.width, this.height);
    this.data = data_.data;
    this.map?.triggerRepaint();
    // 回调，用于通知地图 img的状态
    return true;
  };
}
