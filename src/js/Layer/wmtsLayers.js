/**
 * @Description:
 * @author 杜晓辉
 * @date 2021/3/18 11:05:47
 */
import * as Cesium from 'cesium/Build/Cesium/Cesium'
/**
 *
 * @param viewer
 * @param WMTS
 * @param index
 * @param show
 * @constructor
 */
export function AddWMTSLayers(viewer,index) {
    if(viewer === undefined)
    {
        viewer = window.Scene.viewer;
    }
    let WMTSLayer ;
    let EPSG;
    let Rectangle= null;
    if(viewer){
        for(let i=0;i<window.EarthBaseConfig.WMTSLayerImg.length;i++){
            if(window.EarthBaseConfig.WMTSLayerImg[i].tilingScheme ==="EPSG:4326")
            {
                EPSG = new Cesium.GeographicTilingScheme();
                if(window.EarthBaseConfig.WMTSLayerImg[i].rectangle && window.EarthBaseConfig.WMTSLayerImg[i].rectangle.length>0){
                    Rectangle = new Cesium.Rectangle.fromDegrees(window.EarthBaseConfig.WMTSLayerImg[i].rectangle[0],
                        window.EarthBaseConfig.WMTSLayerImg[i].rectangle[1],
                        window.EarthBaseConfig.WMTSLayerImg[i].rectangle[2],
                        window.EarthBaseConfig.WMTSLayerImg[i].rectangle[3]);
                }

            }else {
                EPSG =new Cesium.WebMercatorTilingScheme();
            }
            WMTSLayer = new Cesium.WebMapTileServiceImageryProvider({
                url:window.EarthBaseConfig.WMTSLayerImg[i].url,
                layer:window.EarthBaseConfig.WMTSLayerImg[i].layer,
                subdomains:window.EarthBaseConfig.WMTSLayerImg[i].subdomains,
                style:window.EarthBaseConfig.WMTSLayerImg[i].style,
                format:window.EarthBaseConfig.WMTSLayerImg[i].format,
                tileMatrixSetID:window.EarthBaseConfig.WMTSLayerImg[i].tileMatrixSetID,
                tilingScheme: EPSG,
                tileMatrixLabels:window.EarthBaseConfig.WMTSLayerImg[i].tileMatrixLabels,
                maximumLevel:window.EarthBaseConfig.WMTSLayerImg[i].maximumLevel,
                rectangle:Rectangle,
                show:window.EarthBaseConfig.WMTSLayerImg[i].show,
            });
            index = window.EarthBaseConfig.WMTSLayerImg[i].index;
            viewer.imageryLayers.addImageryProvider(WMTSLayer,index);
            if(window.EarthBaseConfig.WMTSLayerImg[i].show !== undefined){
                viewer.imageryLayers.get(i).show = window.EarthBaseConfig.WMTSLayerImg[i].show;
            }
        }
    }else {
        return console.log("viewer is 视图未能初始化不可添加图层");
    }
}


