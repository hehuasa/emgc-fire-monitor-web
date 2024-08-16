/*
 * @Author: wangzheng
 * @Date: 2024-04-08 08:36:49
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-04-08 13:01:01
 * @Description: 请填写简介
 */
'use client';
import { CanvasLayer, ICanvasLayerRenderParams } from '@antv/l7';
import { FeatureCollection, Point } from 'geojson';

const genCanvasLayer = (points: FeatureCollection<Point>) => {
  const drawingOnCanvas = (option: ICanvasLayerRenderParams) => {
    const { size, ctx, utils } = option;
    const [width, height] = size;
    const circleWidth = 64;
    const circleHeight = 64;
    const circleSize = circleWidth;
    const context = ctx as CanvasRenderingContext2D;
    context.clearRect(0, 0, width, height);
    // canvas 绘制

    const duration = 1000;
    const t = (performance.now() % duration) / duration;
    // 3圈顺序动画，用于报警闪烁
    const radius1 = (circleSize / 2) * 0.1;
    const outerRadius1 = (circleSize / 2) * 0.7 * t + radius1;

    const radius2 = (circleSize / 2) * 0.4;
    const outerRadius2 = (circleSize / 2) * 0.7 * t + radius2;

    const radius3 = (circleSize / 2) * 0.9;
    const outerRadius3 = (circleSize / 2) * 0.7 * t + radius3;

    for (const point of points.features) {
      const currentPoint = utils.lngLatToContainer(point.geometry.coordinates as any);

      currentPoint.x *= window.devicePixelRatio;
      currentPoint.y *= window.devicePixelRatio;

      const { x, y } = currentPoint;

      // 圈1
      context.save();
      context.arc(x, y, outerRadius1 < 6 ? 6 : outerRadius1, 0, Math.PI * 2);

      context.fillStyle = `rgba(255, 0, 0, 0.5)`;

      context.fill();
      // context.closePath();

      //  背景圆，无动画
      context.beginPath();
      context.arc(x, y, 6, 0, Math.PI * 2);
      context.fillStyle = `rgba(255, 0, 0, 1)`;

      context.strokeStyle = `rgba(255, 0, 0, 0.3)`;
      // context.globalAlpha = 1;
      // context.closePath();

      context.fill();
      // context.stroke();
      context.globalAlpha = 1;
      context.restore();
    }
  };
  const layer = new CanvasLayer()
    .style({
      zIndex: 1,
      update: 'always',
      drawingOnCanvas,
    })
    .animate({
      enable: true,
    });

  return layer;
};
export default genCanvasLayer;
