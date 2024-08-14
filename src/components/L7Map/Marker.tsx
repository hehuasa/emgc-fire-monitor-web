import { ReactNode, useContext, useEffect, useRef } from 'react';
import { Marker, anchorType } from '@antv/l7';
import { useMount, useUnmount } from 'ahooks';
import { MapSceneContext } from '@/models/map';
import { createPortal } from 'react-dom';

interface IPopupProps {
	zIndex?: number;
	lngLat: number[];
	anchor?: anchorType;
	onClose?: () => void;
	children: ReactNode;
}
const L7Marker = ({ lngLat, anchor, children, zIndex = 5 }: IPopupProps) => {
	const mapScence = useContext(MapSceneContext);
	const markerRef = useRef<Marker | null>(null);
	const domRef = useRef(document.createElement('div'));
	useMount(() => {
		domRef.current.style.zIndex = zIndex.toString();
		if (mapScence && domRef.current) {
			markerRef.current = new Marker({
				element: domRef.current,
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				anchor: anchor || 'TOP-LEFT',
			}).setLnglat({
				lng: lngLat[0],
				lat: lngLat[1],
			});
			mapScence.addMarker(markerRef.current);
		}
	});
	useUnmount(() => {
		if (markerRef.current) {
			markerRef.current.remove();
			markerRef.current = null;
		}
	});
	useEffect(() => {
		if (lngLat && lngLat.length === 2) {
			if (markerRef.current) {
				markerRef.current.setLnglat({
					lng: lngLat[0],
					lat: lngLat[1],
				});
			}
		}
	}, [lngLat]);
	return createPortal(children, domRef.current);
};

export default L7Marker;
