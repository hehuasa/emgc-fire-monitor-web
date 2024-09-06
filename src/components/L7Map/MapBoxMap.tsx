import { Mapbox, Scale, Scene, Zoom } from '@antv/l7';
import { useMount } from 'ahooks';
import mapboxgl from 'mapbox-gl';
import { useSearchParams } from 'next/navigation';
import React, { useRef } from 'react'
import { AiOutlineSync } from 'react-icons/ai';

const tk = `pk.eyJ1IjoiaGVodWFzYSIsImEiOiJjanNzYWh6czEwMHphNDR0bHN2bXd2MHQ1In0.HI19oiWtMvB8tbojxbBFgg`
interface IProps {
    getMapScence: (scene: Scene) => void;
    onMapLoaded?: (scene: Scene) => void;
    isDark?: boolean;
    isConfig?: boolean;
}

const MapBoxMap = ({ getMapScence, onMapLoaded }: IProps) => {
    const sceneRef = useRef<Scene | null>(null);
    const searchParams = useSearchParams();
    const mapType = searchParams.get('mapType');


    useMount(() => {
        if (sceneRef.current) {
            return;
        }
        let style;
        switch (mapType) {
            case '1':
                style = process.env.NEXT_PUBLIC_ANALYTICS_MAPURL_vec
                break;
            case '2':
                style = process.env.NEXT_PUBLIC_ANALYTICS_MAPURL_satellite
                break;
            default:
                break;
        }
        mapboxgl.accessToken = tk;
        const map = new mapboxgl.Map({
            container: 'map', // container id
            style,
            center: [Number(process.env.NEXT_PUBLIC_ANALYTICS_MAPCenterLng), Number(process.env.NEXT_PUBLIC_ANALYTICS_MAPCenterLat)],
            bearing: Number(process.env.NEXT_PUBLIC_ANALYTICS_MAPCenterBearing),
            zoom: Number(process.env.NEXT_PUBLIC_ANALYTICS_MAPCenterZoom),
            pitch: Number(process.env.NEXT_PUBLIC_ANALYTICS_MAPPitch),
            attributionControl: false,
        });



        sceneRef.current = new Scene({
            id: 'map',
            map: new Mapbox({
                mapInstance: map,
            }),
            logoVisible: false,
        });

        sceneRef.current.on('loaded', async () => {

            const zoom = new Zoom({
                zoomInTitle: '放大',
                zoomOutTitle: '缩小',
            });
            sceneRef.current!.addControl(zoom);

            const scale = new Scale({

            });
            sceneRef.current!.addControl(scale);

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

                className="absolute top-0 left-0 w-full h-full min-h-[600px] "
                id="map"
            ></div>

            <div

                className="absolute right-2  bottom-20 z-10 cursor-pointer hover:bg-[#f3f3f3] bg-white rounded-md w-7 h-7 flex items-center justify-center"
                onClick={handleReset}
            >
                <AiOutlineSync />
            </div>

        </>
    );
};

export default MapBoxMap;
