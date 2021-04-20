/**
 * @Description:三维配置文件包括基础图层参数配置和基本的可配置参数设置
 * @author 杜晓辉
 * @date 2021/3/18 10:33:31
 */
/**
 *
 * @type {{WMTSLayerImg: [{show: boolean, index: number, url: string}, {show: boolean, index: number, url: string}, {show: boolean, index: number, url: string}, {show: boolean, index: number, url: string}, {show: boolean, index: number, url: string}], Cesiumtoken: string, initviewRectangle: number[], initviewpoint: number[], EarthDEM: [{name: string, show: boolean, style: string, url: string}], ArcGISLayerImg: []}}
 */
window.EarthBaseConfig = {
    //初始化地图中心点配置
    //神农架
    initviewpoint: [110.557547,  31.221136, 17650],
    //重庆
    //initviewpoint: [106.5443289, 29.48862215, 2765],
    //初始化地图位置矩形区域位置配置
    //神农架
    initviewRectangle: [109.9346923,31.294555, 110.97839355,31.8658447],
    //重庆
    //initviewRectangle: [106.5315699577,29.4858670235, 106.5411400795,29.49399948127],
    Cesiumtoken:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhNWIzMTYyZS1kMmQyLTRkOTAtYmRhZC0yZjZhOTE2YzZmYTEiLCJpZCI6MTI2NDksInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjE1NDE0ODh9.0jXPnp2IJ0RJ2gwvok4ybt0aIbekgiKRJbi-ehThGO4",
    WMTSLayerImg:[
        //天地图基础影像图层
        {
            //影像底图
            url: "http://t2.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=d6a72a78a43a2c17294b72ab26354cd6",
            // subdomains: ['0','1','2','3','4','5','6','7'],
            // layer: "tdtImgLayer",
            // style: "default",
            // tilingScheme:"EPSG:3857",
            // format: "image/jpeg",
            // tileMatrixSetID: "GoogleMapsCompatible",//使用谷歌的瓦片切片方式
            index:0,
            show: true

        },
        //天地矢量瓦片图层
        {
            url:
                "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=d6a72a78a43a2c17294b72ab26354cd6",
            // layer: "tdtImgBasicLayer",
            // style: "default",
            // tilingScheme:"EPSG:3857",
            // format: "image/jpeg",
            // tileMatrixSetID: "GoogleMapsCompatible",
            index: 1,
            show: false
        },
        // {
        //     url:"http://t2.tianditu.gov.cn/cta_c/wmts?tk=8cf3af25e445d634f1f8ba4572aebb41",
        //     layer: "tdtAnnoLayer",
        //     style: "default",
        //     format: "image/jpeg",
        //     dimensions: {
        //         tk: "8cf3af25e445d634f1f8ba4572aebb41",
        //     },
        //     tileMatrixSetID: "GoogleMapsCompatible",
        //     index: 19996,
        //     show: true
        // },
        //天地图注记图层
        // {
        //     url: "http://t0.tianditu.com/cia_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=d6a72a78a43a2c17294b72ab26354cd6",
        //     // layer: "tdtAnnoLayer",
        //     // style: "default",
        //     // format: "tiles",
        //     // tilingScheme:"EPSG:3857",
        //     // tileMatrixSetID: "GoogleMapsCompatible",
        //     index: 2,
        //     show: true
        // },
        {
            //url:"http://192.168.99.56:6080/arcgis/rest/services/SNJ/sat_and_ano_map/MapServer/WMTS?",
            url:"http://192.168.99.56:6080/arcgis/rest/services/SNJ/sat_map/MapServer/WMTS?",
            //layer:"SNJ_sat_and_ano_map",
            // tilingScheme:"EPSG:3857",
            // style: "default",
            // tileMatrixSetID: "GoogleMapsCompatible",
            // format: "image/png",
            // maximumLevel:18,
            // rectangle:[109.93469238281253 ,31.29263405889953,110.97839355468753 ,31.863562548378976],
            index: 3,
            show: true,
        },
        {
            url:"http://192.168.99.56:6080/arcgis/rest/services/SNJ/river/MapServer/WMTS?",
            //layer:"SNJ_river",
            // tilingScheme:"EPSG:3857",
            // style: "default",
            // tileMatrixSetID: "GoogleMapsCompatible",
            // format: "image/png",
            // maximumLevel:18,
            // rectangle:[109.93469238281253 ,31.29263405889953,110.97839355468753 ,31.863562548378976],
            index: 4,
            show: true,
        },
        // {
        //     url:"http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer?f=jsapi",
        //     //layer:"SNJ_river",
        //     // tilingScheme:"EPSG:3857",
        //     // style: "default",
        //     // tileMatrixSetID: "GoogleMapsCompatible",
        //     // format: "image/png",
        //     // maximumLevel:18,
        //     // rectangle:[109.93469238281253 ,31.29263405889953,110.97839355468753 ,31.863562548378976],
        //     index: 4,
        //     show: true,
        // },
    ],
    ArcGISLayerImg:[
        // {
        //     url:"http://192.168.99.56:6080/arcgis/rest/services/SNJ/snjbuffer/MapServer",
        //     layer:"snjbuffer",
        //     tilingScheme:"EPSG:4326",
        //     maximumLevel:20,
        //     rectangle:[109.4873099667816,30.838872465791724,111.44228737676109,32.18745809150329],
        //     show: true,
        // },
        // {
        //     url:"http://192.168.99.56:6080/arcgis/rest/services/SNJ/sat_and_ano_map/MapServer",
        //     layer:"",
        //     tilingScheme:"EPSG:3857",
        //     maximumLevel:20,
        //     rectangle:[1.223799221509799E7,3671410.8021436334,1.2353927480585247E7,3745300.9247597763],
        //     show: true,
        // },

    ],
    EarthDEM:[
        // {
        //     url:"http://localhost:8280/Ctb_dem",
        //     style:"",
        //     name:"cq_dem",
        //     show:true,
        // },
        {
            url:"http://192.168.99.49:8280/SNJ_Tileset",
            style:"",
            name:"snj_dem",
            show:true,
        },
        // {
        //     url:"http://localhost:8280/ZG_terrain",
        //     style:"",
        //     name:"zg_dem",
        //     show:true,
        // },
    ],
    TilesModel:[
        {
            url:"http://192.168.99.49:8280/CQTiles/tileset.json",
            style:"",
            name:"cq_tiles",
            show:true,
        }
    ]
}


