import { Mapbox, Scale, Scene, Zoom } from '@antv/l7';
import { useMount } from 'ahooks';
import { motion } from 'framer-motion';
import mapboxgl from 'mapbox-gl';
import Image from 'next/image';
import vec_png from "@/assets/map/vec.png";
import satellite_png from "@/assets/map/satellite.png";

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineSync } from 'react-icons/ai';
import { useLocale } from 'next-intl';

const tk = `pk.eyJ1IjoiaGVodWFzYSIsImEiOiJjanNzYWh6czEwMHphNDR0bHN2bXd2MHQ1In0.HI19oiWtMvB8tbojxbBFgg`
interface IProps {
    getMapScence: (scene: Scene) => void;
    onMapLoaded?: (scene: Scene) => void;
    isDark?: boolean;
    isConfig?: boolean;
}

const MapBoxMap = ({ getMapScence, onMapLoaded }: IProps) => {
    const sceneRef = useRef<Scene | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapLoaded = useRef<boolean>(false);

    const searchParams = useSearchParams();
    const mapType = searchParams.get('mapType');
    const locale = useLocale();

    const getStyle = (mapType: string | null) => {
        let style = process.env.NEXT_PUBLIC_ANALYTICS_MAPURL_3d as string
        switch (mapType) {
            case '1':
                style = process.env.NEXT_PUBLIC_ANALYTICS_MAPURL_vec as string
                break;
            case '2':
                style = process.env.NEXT_PUBLIC_ANALYTICS_MAPURL_satellite as string
                break;

            case '0':
                style = process.env.NEXT_PUBLIC_ANALYTICS_MAPURL_3d as string
                break;
            default:
                break;
        }
        console.info('============style==============', style);
        console.info('============mapType==============', mapType);

        return style
    }
    useMount(() => {
        if (sceneRef.current) {
            return;
        }

        const style = getStyle(mapType);
        mapboxgl.accessToken = tk;
        mapRef.current = new mapboxgl.Map({
            container: 'map', // container id
            // style: style || undefined,
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
                mapInstance: mapRef.current,
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

            mapLoaded.current = true;
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


    useEffect(() => {


        if (mapRef.current && mapLoaded.current) {
            mapRef.current.setStyle(getStyle(mapType))
        }
    }, [mapType])

    const handleReset = () => {
        if (sceneRef.current) {
            sceneRef.current.setZoomAndCenter(Number(process.env.NEXT_PUBLIC_ANALYTICS_MAPCenterZoom), [
                Number(process.env.NEXT_PUBLIC_ANALYTICS_MAPCenterLng),
                Number(process.env.NEXT_PUBLIC_ANALYTICS_MAPCenterLat),
            ]);
        }
    };

    const [isHover, setIsHover] = useState(false)

    const router = useRouter();

    return (
        <>
            <div

                className="absolute top-0 left-0 w-full h-full min-h-[600px] "
                id="map"
            ></div>
            <motion.div
                whileHover={{ width: 96 }}
                className="absolute right-2  bottom-20 z-10 cursor-pointer hover:bg-[#f3f3f3] bg-white rounded-md w-7 h-7 flex items-center justify-center"

                onMouseEnter={() => {
                    setIsHover(true);
                }}
                onMouseLeave={() => { setIsHover(false) }}
            >
                {((mapType !== "1" && mapType !== "2") || isHover) && <div onClick={() => { router.push(`/${locale}/monitor/operation?mapType=0`) }} className='hover:opacity-80 flex justify-center items-center w-6 h-6 mx-1 text-sm font-bold'>3D</div>}
                {(mapType === '1' || isHover) && <div onClick={() => { router.push(`/${locale}/monitor/operation?mapType=1`) }} className='hover:opacity-80 flex justify-center items-center w-6 h-6 mx-1'><Image alt='vec' src={vec_png} width={28} height={28} /></div>}
                {(mapType === '2' || isHover) && <div onClick={() => { router.push(`/${locale}/monitor/operation?mapType=2`) }} className='hover:opacity-80 flex justify-center items-center w-6 h-6 mx-1'><Image alt='satellite' src={satellite_png} width={28} height={28} /></div>}

            </motion.div>
            <div
                className="absolute right-2  bottom-28 z-10 cursor-pointer hover:bg-[#f3f3f3] bg-white rounded-md w-7 h-7 flex items-center justify-center"
                onClick={handleReset}
            >
                <AiOutlineSync />
            </div>

        </>
    );
};

export default MapBoxMap;
