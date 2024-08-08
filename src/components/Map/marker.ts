import type { MarkerOptions, PointLike } from 'maplibre-gl';
import * as maplibregl from 'maplibre-gl';
import * as React from 'react';
import { useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';

const unitlessNumber = /box|flex|grid|column|lineHeight|fontWeight|opacity|order|tabSize|zIndex/;

export function applyReactStyle(element: HTMLElement, styles?: React.CSSProperties | any) {
  if (!element || !styles) {
    return;
  }
  const style: any = element.style;

  for (const key in styles) {
    const value = styles[key];
    if (Number.isFinite(value) && !unitlessNumber.test(key)) {
      style[key] = `${value}px`;
    } else {
      style[key] = value;
    }
  }
}

/**
 * Compare two points
 * @param a
 * @param b
 * @returns true if the points are equal
 */
export function arePointsEqual(a?: PointLike, b?: PointLike): boolean {
  const ax = Array.isArray(a) ? a[0] : a ? a.x : 0;
  const ay = Array.isArray(a) ? a[1] : a ? a.y : 0;
  const bx = Array.isArray(b) ? b[0] : b ? b.x : 0;
  const by = Array.isArray(b) ? b[1] : b ? b.y : 0;
  return ax === bx && ay === by;
}

export interface MarkerLibreEvent<TOrig = undefined> {
  type: string;
  target: maplibregl.Marker;
  originalEvent: TOrig;
}

export type MarkerProps = {
  map: maplibregl.Map;
  /** Longitude of the anchor location */
  longitude: number;
  /** Latitude of the anchor location */
  latitude: number;
  /** A string indicating the part of the Marker that should be positioned closest to the coordinate set via Marker.setLngLat.
   * Options are `'center'`, `'top'`, `'bottom'`, `'left'`, `'right'`, `'top-left'`, `'top-right'`, `'bottom-left'`, and `'bottom-right'`.
   * @default "center"
   */
  anchor?: MarkerOptions['anchor'];
  /**
   * The max number of pixels a user can shift the mouse pointer during a click on the marker for it to be considered a valid click
   * (as opposed to a marker drag). The default (0) is to inherit map's clickTolerance.
   */
  clickTolerance?: number;
  /** The color to use for the default marker if options.element is not provided.
   * @default "#3FB1CE"
   */
  color?: string;
  /** A boolean indicating whether or not a marker is able to be dragged to a new position on the map.
   * @default false
   */
  draggable?: boolean;
  /** The offset in pixels as a PointLike object to apply relative to the element's center. Negatives indicate left and up. */
  offset?: MarkerOptions['offset'];
  /** `map` aligns the `Marker` to the plane of the map.
   * `viewport` aligns the `Marker` to the plane of the viewport.
   * `auto` automatically matches the value of `rotationAlignment`.
   * @default "auto"
   */
  pitchAlignment?: MarkerOptions['pitchAlignment'];
  /** The rotation angle of the marker in degrees, relative to its `rotationAlignment` setting. A positive value will rotate the marker clockwise.
   * @default 0
   */
  rotation?: number;
  /** `map` aligns the `Marker`'s rotation relative to the map, maintaining a bearing as the map rotates.
   * `viewport` aligns the `Marker`'s rotation relative to the viewport, agnostic to map rotations.
   * `auto` is equivalent to `viewport`.
   * @default "auto"
   */
  rotationAlignment?: MarkerOptions['rotationAlignment'];
  /** The scale to use for the default marker if options.element is not provided.
   * The default scale (1) corresponds to a height of `41px` and a width of `27px`.
   * @default 1
   */
  scale?: number;
  /** A Popup instance that is bound to the marker */
  popup?: maplibregl.Popup | null;
  /** CSS style override, applied to the control's container */
  style?: React.CSSProperties;
  onClick?: (e: MarkerLibreEvent<MouseEvent>) => void;
  onDragStart?: (e: MarkerLibreEvent<MouseEvent | TouchEvent | undefined>) => void;
  onDrag?: (e: MarkerLibreEvent<MouseEvent | TouchEvent | undefined>) => void;
  onDragEnd?: (e: MarkerLibreEvent<MouseEvent | TouchEvent | undefined>) => void;
  children?: React.ReactNode;
};

// const defaultProps: Partial<MarkerProps> = {
//   draggable: false,
//   popup: null,
//   rotation: 0,
//   rotationAlignment: 'auto',
//   pitchAlignment: 'auto',
// };

/* eslint-disable complexity,max-statements */
function Marker(props: MarkerProps) {
  const {
    map,
    draggable = false,
    popup = null,
    rotation = 0,
    rotationAlignment = 'auto',
    pitchAlignment = 'auto',
  } = props;
  const thisRef = useRef({ props });
  thisRef.current.props = props;

  const marker: maplibregl.Marker = useMemo(() => {
    let hasChildren = false;
    React.Children.forEach(props.children, (el) => {
      if (el) {
        hasChildren = true;
      }
    });
    const options = {
      ...props,
      element: hasChildren ? document.createElement('div') : undefined,
    };

    const mk = new maplibregl.Marker(options).setLngLat([props.longitude, props.latitude]);

    mk.getElement().addEventListener('click', (e: MouseEvent) => {
      thisRef.current.props.onClick?.({
        type: 'click',
        target: mk,
        originalEvent: e,
      });
    });

    mk.on('dragstart', (e) => {
      const evt = e;
      evt.lngLat = marker.getLngLat();
      thisRef.current.props.onDragStart?.(evt);
    });
    mk.on('drag', (e) => {
      const evt = e;
      evt.lngLat = marker.getLngLat();
      thisRef.current.props.onDrag?.(evt);
    });
    mk.on('dragend', (e) => {
      const evt = e;
      evt.lngLat = marker.getLngLat();
      thisRef.current.props.onDragEnd?.(evt);
    });

    return mk;
  }, []);

  useEffect(() => {
    marker.addTo(map);

    return () => {
      marker.remove();
    };
  }, []);

  useEffect(() => {
    applyReactStyle(marker.getElement(), props.style);
  }, [props.style]);

  // useEffect(() => {
  //   if (marker.isDraggable() !== draggable) {
  //     marker.setDraggable(draggable);
  //     console.log(draggable, marker.isDraggable());
  //   }
  // }, [draggable]);

  if (marker.getLngLat().lng !== props.longitude || marker.getLngLat().lat !== props.latitude) {
    marker.setLngLat([props.longitude, props.latitude]);
  }
  if (props.offset && !arePointsEqual(marker.getOffset(), props.offset)) {
    marker.setOffset(props.offset);
  }
  if (marker.isDraggable() !== draggable) {
    marker.setDraggable(draggable);
  }
  if (props.rotation && marker.getRotation() !== props.rotation) {
    marker.setRotation(rotation);
  }
  if (rotationAlignment && marker.getRotationAlignment() !== rotationAlignment) {
    marker.setRotationAlignment(rotationAlignment);
  }
  if (pitchAlignment && marker.getPitchAlignment() !== pitchAlignment) {
    marker.setPitchAlignment(pitchAlignment);
  }
  if (marker.getPopup() !== popup) {
    marker.setPopup(popup);
  }

  return createPortal(props.children, marker.getElement());
}

export default React.memo(Marker);
