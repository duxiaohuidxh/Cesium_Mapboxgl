/**
 * @Description:
 * @author 杜晓辉
 * @date 2021/3/18 14:01:50
 */
/**
 *
 * @param viewer
 * @param index
 * @constructor
 */
import * as Cesium from 'cesium/Build/Cesium/Cesium'

export function AddArcGISLayers(viewer,index) {
    let  ArcGISLayer;
    let  EPSG;
    if(viewer ===undefined)
    {
        viewer = window.Scene.viewer;
    }
    if(viewer){
        for (let i = 0;i<window.EarthBaseConfig.ArcGISLayerImg.length;i++) {
            if (window.EarthBaseConfig.ArcGISLayerImg[i].tilingScheme === "EPSG:4326") {
                EPSG = new Cesium.GeographicTilingScheme();
            } else {
                EPSG = new Cesium.WebMercatorTilingScheme();
            }
            ArcGISLayer = new Cesium.ArcGisMapServerImageryProvider({
                url: window.EarthBaseConfig.ArcGISLayerImg[i].url,
                rectangle: new Cesium.Rectangle.fromDegrees(window.EarthBaseConfig.ArcGISLayerImg[i].rectangle[0],
                    window.EarthBaseConfig.ArcGISLayerImg[i].rectangle[1],
                    window.EarthBaseConfig.ArcGISLayerImg[i].rectangle[2],
                    window.EarthBaseConfig.ArcGISLayerImg[i].rectangle[3]),
                maximumLevel: window.EarthBaseConfig.ArcGISLayerImg[i].maximumLevel,
                tilingScheme: EPSG,
            });
            index  = 4;
            viewer.imageryLayers.addImageryProvider(ArcGISLayer, index);
        }
    }
}