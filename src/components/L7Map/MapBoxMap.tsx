import { Mapbox, Scale, Scene, Zoom } from '@antv/l7';
import { useMount } from 'ahooks';
import mapboxgl from 'mapbox-gl';
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


    useMount(() => {
        if (sceneRef.current) {
            return;
        }
        mapboxgl.accessToken = tk;
        const map = new mapboxgl.Map({
            container: 'map', // container id
            style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
            center: [-73.9286084, 40.8140204], // starting position [lng, lat]
            // center: [103.82357442634452, 30.992602876948965],
            zoom: 18, // starting zoom
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

export default MapBoxMap;
