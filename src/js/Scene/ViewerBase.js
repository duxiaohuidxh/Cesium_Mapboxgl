/**
 * @Description: 场景基础类实现定位  鼠标位置拾取
 * @author 杜晓辉
 * @date 2021/3/23 10:42:23
 */
import * as Cesium from 'cesium/Build/Cesium/Cesium'

/**
 * 场景视图对象
 */
export default class ViewerBase {
    constructor(viewer){
        this.viewer = viewer;
        this.scene = viewer.scene;
        this.camera = this.scene.camera;
        this.ellipsoid = viewer.scene.globe.ellipsoid;
        this.entity = viewer.entities.add({
           label:{
               show:false,
           }
        });
        this.longitudeString = null;
        this.latitudeString = null;
        this.height = null;
        this.cartesian = null;
        this.Camerapitch = null;
        this.Cameraroll = null;
        this.Cameraheading = null;
        //定义当前场景的画布元素的事件处理
        this.handlerMove = new Cesium.ScreenSpaceEventHandler(this.scene.canvas);
    }
    /**
     * 获取当前鼠标 空间位置 和相机方位角
     * @param fn
     */
    getCurMousePosition(callback){
        //设置鼠标移动事件的处理函数，这里负责监听x,y坐标值变化
        this.handlerMove.setInputAction((movement)=>{
            //设置鼠标移动事件的处理函数，这里负责监听x,y坐标值变化
            this.cartesian = this.viewer.camera.pickEllipsoid(movement.endPosition,this.ellipsoid);
            if(this.cartesian){
                //将笛卡尔坐标转换为地理坐标
                let  cartographic = this.ellipsoid.cartesianToCartographic(this.cartesian);
                //将弧度转化为度的十进制度表示
                this.longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
                this.latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
                //获取场景相机高度
                this.height = this.viewer.camera.positionCartographic.height;
                //航向角
                this.Cameraheading =  this.viewer.camera.heading;
                //俯仰角
                this.Camerapitch = this.viewer.camera.pitch;
                //滚转角
                this.Cameraroll = this.viewer.camera.roll;
                this.entity.position = this.cartesian;
                //回调函数回调和viewer 视图绑定返回鼠标坐标值和视角高度
                callback(this.longitudeString.toFixed(7),this.latitudeString.toFixed(7),this.height.toFixed(4),this.Cameraheading.toFixed(2),this.Camerapitch.toFixed(2),this.Cameraroll.toFixed(2));
            }
        },Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }

    /**
     * 重写场景飞行定位类
     */
    activeFlytoViwer(position,heading,pitch,roll){
        this.camera.flyTo({
            destination:Cesium.Cartesian3.fromDegrees(
                position[0],
                position[1],
                position[2]
            ),
            complete:()=>{
                setTimeout(()=>{
                    this.camera.flyTo({
                        destination:Cesium.Cartesian3.fromDegrees(
                            position[0],
                            position[1],
                            position[2]
                        ),
                        orientation:{
                            heading: Cesium.Math.toRadians(heading),
                            pitch: Cesium.Math.toRadians(pitch),
                            roll:Cesium.Math.toRadians(roll),
                        },
                        easingFunction: Cesium.EasingFunction.LINEAR_NONE,
                    })
                },500);
            }

        })
    }
}


