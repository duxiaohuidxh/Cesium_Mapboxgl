<template>
    <div id="container" class="box">
        <div id="MapboxContainer"></div>
    </div>
</template>

<script>
    import mapboxgl from 'mapbox-gl'
    export default {
        name: 'mapboxgl',
        components: {},
        props: {},
        data() {
            return {};
        },
        watch: {},
        computed: {},
        methods: {
            initmap() {
                //mapboxgl.accessToken = 'pk.eyJ1IjoicGxheS1pc2FhYyIsImEiOiJjazU0cDkzbWowamd2M2dtemd4bW9mbzRhIn0.cxD4Fw3ZPB_taMkyUSFENA';
                //mapboxgl.accessToken = 'pk.eyJ1IjoiZHV4aWFvaHVpbG92ZSIsImEiOiJja2VydXVhbHAweW1vMnhtcnd2ZnQwdDNzIn0.HEJCYVPKbxpXdhPyL1F2yg';
                mapboxgl.accessToken = 'pk.eyJ1IjoiZHV4aWFvaHVpbG92ZSIsImEiOiJja2VydXVhbHAweW1vMnhtcnd2ZnQwdDNzIn0.HEJCYVPKbxpXdhPyL1F2yg';
                var map = new mapboxgl.Map({
                    container: 'MapboxContainer',
                    zoom: 11,
                    center: [110.30048,31.462541],
                    //style:null,
                    //style: 'mapbox://styles/mapbox/dark-v10', // the outdoors-v10 style but without Hillshade layers
                    style: 'mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y',
                    pitch: 58,  //地图的角度，不写默认是0，取值是0-60度，一般在3D中使用
                    bearing: 180, //地图的初始方向，值是北的逆时针度数，默认是0，即是正北
                    antialias: true, //抗锯齿，通过false关闭提升性能
                });
                window.mapbox={};
                window.mapbox.map = map;

                // Add zoom and rotation controls to the map.
                map.addControl(new mapboxgl.NavigationControl());

                map.on('load', function () {
                    map.addSource('mapbox-dem', {
                        'type': 'raster-dem',
                        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
                        'tileSize': 512,
                        'maxzoom': 14
                    });
                    map.setTerrain({'source': 'mapbox-dem', 'exaggeration': 1.5});

                    map.addLayer({
                        'id': 'sky',
                        'type': 'sky',
                        'paint': {
                            // set up the sky layer to use a color gradient
                            'sky-type': 'gradient',
                                // the sky will be lightest in the center and get darker moving radially outward
                                // this simulates the look of the sun just below the horizon
                            'sky-gradient': [
                                'interpolate',
                                ['linear'],
                                ['sky-radial-progress'],
                                0.8,
                                'rgba(135, 206, 235, 1.0)',
                                1,
                                'rgba(0,0,0,0.1)'
                            ],
                            'sky-gradient-center': [0, 0],
                            'sky-gradient-radius': 90,
                            'sky-opacity': [
                                'interpolate',
                                ['exponential', 0.1],
                                ['zoom'],
                                5,
                                0,
                                22,
                                1
                            ]
                        }
                    });

                    map.addSource('dxhjson', {
                        type: 'geojson',
                        data: 'http://127.0.0.1:8280/JSON/CHNLine.json' //snj_scopeLine.json
                    });
                    map.addLayer({                 /* 为地图添加layer */
                        "id": "dxhjson",             /* layer id是route */
                        "type": "line",            /* line类型layer*/
                        "source": "dxhjson",         /* 资源引用的是上面定义的source*/
                        "layout": {
                            "line-join": "round",  /* 线条相交的形状 */
                            "line-cap": "round"    /* 线条末端形状 */
                        },
                        paint: {
                            'line-width': 1.5,
                            'line-color': '#286BFF',
                        },
                    });
                    map.addSource("arcgissource",{
                            type: "raster",
                            tiles: ["http://192.168.99.56:6080/arcgis/rest/services/SNJ/sat_map/MapServer/tile/{z}/{y}/{x}"],
                            tileSize: 256
                    },)
                    map.addLayer( {
                        id: "test",
                        type: "raster",
                        source: "arcgissource",
                        minzoom: 9,
                        maxzoom: 18
                    });
                    map.addSource('snjjson', {
                        type: 'geojson',
                        data: 'http://127.0.0.1:8280/JSON/snj_scopeLine.json' //snj_scopeLine.json
                    });
                    map.addLayer({                 /* 为地图添加layer */
                        "id": "snjjson",             /* layer id是route */
                        "type": "line",            /* line类型layer*/
                        "source": "snjjson",         /* 资源引用的是上面定义的source*/
                        "layout": {
                            "line-join": "round",
                            "line-cap": "round"
                        },
                        "paint": {
                            "line-color": "#7DF9A6",
                            "line-width": 8,
                            "line-opacity": 0.4
                        }
                    });
                    map.addLayer({                 /* 为地图添加layer */
                        "id": "snjjson2",             /* layer id是route */
                        "type": "line",            /* line类型layer*/
                        "source": "snjjson",         /* 资源引用的是上面定义的source*/
                        "layout": {
                            "line-join": "round",
                            "line-cap": "round"
                        },
                        "paint": {
                            "line-color": "#fff",
                            "line-width": 1
                        }
                    });
                });
            }
        },
        created() {
        },
        mounted() {
            this.initmap();
        }
    };
</script>
<style scoped>
    @import url('../../assets/mapbox-gl.css');
    .box {
        width: 100%;
        height: 100%;
        position: relative;
    }
    #MapboxContainer {
        position: absolute;
        left: 0;
        top: 0;
        text-align: left;
        width: 100%;
        height: 100%;
        bottom: 0;
    }
</style>