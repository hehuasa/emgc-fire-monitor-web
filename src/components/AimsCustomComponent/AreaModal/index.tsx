import { Box } from '@chakra-ui/react';
import { Renderer, ScopedContext } from 'amis';
import { RendererProps } from 'amis';
import React from 'react';
import Map from '@/components/Map';
import { request } from '@/utils/request';
import { FeatureCollection, Polygon, featureCollection } from '@turf/turf';
import { IArea } from '@/models/map';
import Maplibregl, { LngLat, MapMouseEvent, Marker as MarkerProps } from 'maplibre-gl';

export interface MyRendererProps extends RendererProps {
    target?: string;
}

type stateType = {
    pos: Array<number>;
};

export default class AreaModal extends React.Component<MyRendererProps> {
    static contextType = ScopedContext;
    static defaultProps = {
        target: 'world',
    };
    mapRef!: maplibregl.Map | null;
    marker!: MarkerProps | undefined;
    constructor(props: MyRendererProps) {
        super(props);
        this.state = {
            pos: [],
        };
    }
    componentDidMount(): void {
        const scoped: any = this.context;
        scoped.registerComponent(this);
    }
    componentWillUnmount() {
        this.mapRef = null;
        const scoped: any = this.context;
        scoped.unRegisterComponent(this);
    }

    getMapObj = ({ map }: { map: maplibregl.Map }) => {
        this.mapRef = map;
        this.genAreaLayers();
        this.getAreaDatas();
        map.on('click', (e) => {
            this.showPicImg(e.lngLat);
        });
    };

    showPicImg = (lngLat: LngLat) => {
        const arr = [lngLat.lng, lngLat.lat];
        this.setState({
            pos: arr,
        });

        sessionStorage.setItem('pos', JSON.stringify(arr));

        const warp = document.createElement('div');
        warp.className = 'map-pick-img';
        if (!this.marker) {
            this.marker = new Maplibregl.Marker({ element: warp, offset: [0, -36 / 2] });
            this.marker.setLngLat(lngLat).addTo(this.mapRef!);
        } else {
            this.marker.setLngLat(lngLat);
        }
    };
    // 获取区域数据并且给地图添加新的区域图层数据
    getAreaDatas = async () => {
        if (this.mapRef) {
            const url = `/cx-alarm/dc/area/areaMap`;
            const res = (await request({ url })) as unknown as FeatureCollection<Polygon, IArea>;
            res.features = res.features.filter((item) => item.geometry.type);
            const area_source_ = this.mapRef.getSource('area_source_') as maplibregl.GeoJSONSource;
            if (res && res.features) {
                res && res.features && area_source_.setData(res as GeoJSON.GeoJSON);
            }
        }
    };

    // 区域图层定义
    genAreaLayers = async () => {
        const source: maplibregl.GeoJSONSourceSpecification = {
            type: 'geojson',

            data: featureCollection([]),
        };
        this.mapRef?.addSource('area_source_', source);
        const broadcast_fill_hide: maplibregl.LayerSpecification = {
            id: 'broadcast_fill_hide',
            type: 'fill',
            source: 'area_source_',
            paint: {
                'fill-opacity': 0,
            },
        };
        this.mapRef?.on('click', 'broadcast_fill_hide', this.handleAreaClick);
        this.mapRef?.addLayer(broadcast_fill_hide);
        console.log('地图图层', this.mapRef?.getLayer('broadcast_fill_hide'));
    };

    //区域图层点击事件
    handleAreaClick = (
        e: MapMouseEvent & {
            features?: any;
        }
    ) => {
        if (e.features && e.features.length > 0) {
            const area = e.features[0].properties as IArea;
            const { areaId, areaName } = area;
            console.log('区域信息', e);
            //TODO:根据地图图层信息添加geo
        }
    };
    render() {
        const { target } = this.props;

        return (
            <Box w={'full'} h={'500px'}>
                <Map getMapObj={this.getMapObj} disableViewTools disableMiniMap />
            </Box>
        );
    }
}

Renderer({
    test: /\bareaModal$/,
    name: 'areaModal',
})(AreaModal);
