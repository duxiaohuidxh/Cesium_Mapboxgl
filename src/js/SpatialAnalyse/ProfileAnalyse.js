/**
 * @Description:
 * @author 杜晓辉
 * @date 2021/4/20 14:39:37
 */
import * as Cesium from 'cesium/Build/Cesium/Cesium'
import * as echarts from 'echarts';

export const profile = {
    arrHB: [],
    arrPoint: [],
    arrLX: [],
    ponits: [],
    distance: 0
};

export function DrawShape(viewer,drawingMode) {
    let start, end;
    let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    var entityPolygon = null;
    var points = null;
    //viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    //取消左键双击事件
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    //淹没分析entity
    function createPoint(worldPosition) {
        var point = viewer.entities.add({
            position: worldPosition,
            point: {
                pixelSize: 10,
                color: Cesium.Color.YELLOW,
                //disableDepthTestDistance: Number.POSITIVE_INFINITY,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            },
        });
        points = point;
        return point;
    }
    var drawingMode = drawingMode;
    function drawShape(positionData) {
        var shape;
        if (drawingMode === 'line') {
            shape = viewer.entities.add({

                polyline: {
                    positions: positionData,
                    clampToGround: true,
                    arcType: Cesium.ArcType.RHUMB,
                    material: Cesium.Color.GREEN,
                    width: 5,

                    //zIndex:1
                }
                //,show:false
            });
        }
        else if (drawingMode === 'polygon') {
            shape = viewer.entities.add({
                polygon: {
                    hierarchy: positionData,
                    material: new Cesium.ColorMaterialProperty(Cesium.Color.LIGHTSKYBLUE.withAlpha(0.7))
                }
            });
        }
        return shape;
    }
    var activeShapePoints = [];
    var activeShape;
    var floatingPoint;
    handler.setInputAction(function (event) {
        if (!Cesium.Entity.supportsPolylinesOnTerrain(viewer.scene)) {
            console.log('This browser does not support polylines on terrain.');
            return;
        }
        // 使用viewer.scene.pickPosition` 来代替`viewer.camera.pickEllipsoid` 这样当鼠标掠过terrain能得到正确的坐标
        var earthPosition = viewer.scene.pickPosition(event.position);
        if (Cesium.defined(earthPosition)) {
            if (activeShapePoints.length === 0) {
                start = earthPosition;
                floatingPoint = createPoint(earthPosition);
                activeShapePoints.push(earthPosition);
                var dynamicPositions = new Cesium.CallbackProperty(function () {
                    return activeShapePoints;
                }, false);
                activeShape = drawShape(dynamicPositions);
            }
            //计算距离并且进行叠加
            profile.distance = profile.distance + distance(activeShapePoints[activeShapePoints.length - 1], earthPosition);
            activeShapePoints.push(earthPosition);
            createPoint(earthPosition);
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    handler.setInputAction(function (event) {
        if (Cesium.defined(floatingPoint)) {
            var newPosition = viewer.scene.pickPosition(event.endPosition);
            if (Cesium.defined(newPosition)) {
                floatingPoint.position.setValue(newPosition);
                activeShapePoints.pop();
                activeShapePoints.push(newPosition);
            }
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    function terminateShape() {
        activeShapePoints.pop();
        entityPolygon = drawShape(activeShapePoints);
        viewer.entities.remove(floatingPoint);
        viewer.entities.remove(activeShape);
        entityPolygon = null;
        floatingPoint = undefined;
        activeShape = undefined;
        activeShapePoints = [];
    }
    handler.setInputAction(function (event) {
        var length = activeShapePoints.length - 1;
        end = activeShapePoints[length];
        var data = profileAnalyse(viewer,start, end);
        console.log(data);
        setEchartsData(data);
        terminateShape();
        handler.destroy();
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

};


/**
 * 剖面分析
 * @param start
 * @param end
 * @returns {*}
 */
export  function profileAnalyse(viewer,start, end) {
    var startPoint = Cesium.Cartographic.fromCartesian(start);
    var endPoint = Cesium.Cartographic.fromCartesian(end);
    profile.arrLX.push(0);
    profile.ponits.push(startPoint);
    profile.arrPoint.push(getDegrees(viewer,startPoint));
    profile.arrHB.push(startPoint.height);
    // 插值100个点，点越多模拟越精确，但是效率会低
    var count = 100;
    for (var i = 1; i < count; i++) {
        var cart = Cesium.Cartesian3.lerp(start, end, i / count, new Cesium.Cartesian3());
        var cartographicCart = Cesium.Cartographic.fromCartesian(cart);
        var disc = distance(profile.ponits[i - 1], cartographicCart);
        profile.distance = profile.distance + disc;
        profile.ponits.push(cartographicCart);
        profile.arrLX.push(profile.arrLX[i - 1] + disc);

        profile.arrPoint.push(getDegrees(viewer,cart));
        profile.arrHB.push(cartographicCart.height);
    }
    profile.ponits.push(endPoint);
    profile.arrLX.push(profile.arrLX[profile.arrLX.length - 1] + distance(profile.ponits[profile.ponits.length-1], endPoint));
    profile.arrPoint.push(getDegrees(viewer,endPoint));
    profile.arrHB.push(endPoint.height);
    return profile;
}
//计算两点间的距离
export  function distance(point1, point2) {
    //var point1cartographic = Cesium.Cartographic.fromCartesian(point1);
    //var point2cartographic = Cesium.Cartographic.fromCartesian(point2);
    /**根据经纬度计算出距离**/
    var geodesic = new Cesium.EllipsoidGeodesic();
    geodesic.setEndPoints(point1, point2);
    var s = geodesic.surfaceDistance;
    //返回两点之间的距离
    s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2.height - point1.height, 2));
    return s;

}
//世界坐标转换为经纬度
export  function getDegrees(viewer,cart) {
    let ellipsoid = viewer.scene.globe.ellipsoid;
    var cartographic = ellipsoid.cartesianToCartographic(cart);
    var lat = Cesium.Math.toDegrees(cartographic.latitude);
    var lng = Cesium.Math.toDegrees(cartographic.longitude);
    var alt = cartographic.height;
    return {x:lng,y:lat,z:alt};
}
//经纬度保留两位小数
export  function strFormat(str) {
    var strString = str.toString();
    var strs = strString.slice(0, strString.indexOf(".")+3);
    return strs;
}
//设置Echart数据
export  function setEchartsData(e) {
    let myChart;
    if (null != e && null != e.arrPoint) {
        //$("#sectionChars").show(),
        document.getElementById("sectionChars").style.display = "block",
        null == myChart && (myChart = echarts.init(document.getElementById("echartsView1"), "dark"));
        console.log(e.arrHB.value);
        var t = e.arrPoint,
            chartData = {
                grid: {
                    left: 10,
                    right: 10,
                    bottom: 10,
                    containLabel: !0
                },
                dataZoom: [{
                    type: "inside",
                    throttle: 50
                }],
                tooltip: {
                    trigger: "axis",
                    formatter: function (e) {
                        var a = "";
                        if (0 == e.length) return a;
                        e[0].value;
                        console.log(e);
                        var r = t[e[0].dataIndex];
                        console.log(r);
                        let aixv = e[0].axisValue;
                        let aixt = e[0].value;
                        //return a += "所在位置&nbsp;" + strFormat(r.x ) + "," + strFormat(r.y ) + "<br />距起点&nbsp;<label>" + "</label><br />" + e[0].seriesName + "&nbsp;<label style='color:" + e[0].color + ";'>"  + "</label><br />"
                        return a += "X:&nbsp;" + parseFloat(r.x ).toFixed(6) + "<br/>Y:&nbsp;" + parseFloat(r.y ).toFixed(6) + "<br />距起点:&nbsp;<label>" + parseFloat(aixv).toFixed(4) + "</label><br />" + e[0].seriesName + "&nbsp;<label style='color:" + e[0].color + ";'>" + parseFloat(aixt).toFixed(4) + "</label><br />"
                        //return a += "所在位置&nbsp;" + strFormat(r.x ) + "," + strFormat(r.y ) + "<br />距起点&nbsp;<label>" + haoutil.str.formatLength(e[0].axisValue) + "</label><br />" + e[0].seriesName + "&nbsp;<label style='color:" + e[0].color + ";'>" + haoutil.str.formatLength(e[0].value) + "</label><br />"
                    }
                },
                xAxis: [{
                    name: "行程",
                    type: "category",
                    boundaryGap: !1,
                    axisLine: {
                        show: !1
                    },
                    axisLabel: {
                        show: !1
                    },
                    data: e.arrLX
                }],
                yAxis: [{
                    type: "value",
                    axisLabel: {
                        rotate: 60,
                        formatter: "{value} 米"
                    }
                }],
                series: [{
                    name: "高程值",
                    type: "line",
                    smooth: !0,
                    symbol: "none",
                    sampling: "average",
                    itemStyle: {
                        normal: {
                            color: "rgb(255, 70, 131)"
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: "rgb(255, 158, 68)"
                            },
                                {
                                    offset: 1,
                                    color: "rgb(255, 70, 131)"
                                }])
                        }
                    },
                    data: e.arrHB
                }]
            };
        myChart.setOption(chartData)
    }
}


