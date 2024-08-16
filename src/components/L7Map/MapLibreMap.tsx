import { Scene } from '@antv/l7';
import { MapLibre } from '@antv/l7-maps';
import { useMount } from 'ahooks';
import { useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { AiOutlineSync } from 'react-icons/ai';

interface IProps {
	getMapScence: (scene: Scene) => void;
	onMapLoaded?: (scene: Scene) => void;
	isDark?: boolean;
	isConfig?: boolean;
}

const MapLibreMap = ({ getMapScence, onMapLoaded }: IProps) => {
	const sceneRef = useRef<Scene | null>(null);


	useMount(() => {
		if (sceneRef.current) {
			return;
		}
		const mapOps = {
			container: 'map',
			style: process.env.NEXT_PUBLIC_ANALYTICS_MAPURL as string,

			center: [Number(process.env.NEXT_PUBLIC_ANALYTICS_MAPCenterLng), Number(process.env.NEXT_PUBLIC_ANALYTICS_MAPCenterLat)],
			bearing: Number(process.env.NEXT_PUBLIC_ANALYTICS_MAPCenterBearing),
			zoom: Number(process.env.NEXT_PUBLIC_ANALYTICS_MAPCenterZoom),
			pitch: Number(process.env.NEXT_PUBLIC_ANALYTICS_MAPPitch),
		};
		console.info('============mapOps==============', mapOps);
		const map = new maplibregl.Map(mapOps);
		console.info('============map==============', map);

		sceneRef.current = new Scene({
			id: 'map',

			map: new MapLibre({
				mapInstance: map,
			}),
			logoVisible: false,
		});

		sceneRef.current.on('loaded', async () => {
			if (getMapScence) {
				getMapScence(sceneRef.current!);
			}
			if (onMapLoaded) {
				onMapLoaded(sceneRef.current!);
			}


			sceneRef.current!.on('click', (e) => {
				console.info('============e==============', e);
				console.info('============e.lngLat==============', e.lngLat);

				console.info('============sceneRef.current!=====getCenter=========', sceneRef.current!.getCenter());
				console.info('============sceneRef.current!=====getZoom=========', sceneRef.current!.getZoom());
				console.info('============sceneRef.current!=====getPitch=========', sceneRef.current!.getPitch());
				console.info('============sceneRef.current!=====getRotation=========', sceneRef.current!.getRotation());
			});
		});

	});



	const handleReset = () => {
		if (sceneRef.current) {
			sceneRef.current.setZoomAndCenter(Number(process.env.NEXT_PUBLIC_ANALYTICS_MAPCenterZoom), [
				Number(process.env.NEXT_PUBLIC_ANALYTICS_MAPCenterLng),
				Number(process.env.NEXT_PUBLIC_ANALYTICS_MAPCenterLat),
			]);
		}
	};

	return (
		<>
			<div
				style={{
					background: 'rgb(13, 37, 85)',
				}}
				className="absolute top-0 left-0 w-full h-full bg-[rgb(13, 37, 85)] min-h-[600px] "
				id="map"
			></div>

			<div

				className="absolute  bottom-28 z-10 cursor-pointer hover:bg-blue-600 bg-[#2574A7] rounded-md w-9 h-9 flex items-center justify-center"
				onClick={handleReset}
			>
				<AiOutlineSync />
			</div>

		</>
	);
};

export default MapLibreMap;
