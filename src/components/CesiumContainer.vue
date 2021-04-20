<template>
    <div id="container" class="box">
        <Navigation></Navigation>
        <div id="CesiumContainer"></div>
        <div id="sectionChars" class="infoview sectionChars">
            <div id="echartsView1" style="width:100%;height:100%"></div>
        </div>
        <div id="trackPopUp" class="trackPopUp">
            <div id="trackPopUpContent" class="cesium-popup" style="top:5px;left:0;">
                <a id="popup-close-button" class="cesium-popup-close-button" href="#">×</a>
                <div id="popup-content-wrapper" class="cesium-popup-content-wrapper">
                    <div id="trackPopUpLink" class="cesium-popup-content"></div>
                </div>
            </div>
        </div>
        <div
                class="toolsbar main_toolsbar"
                id="coordinateDisplay"
                style="
        position: absolute;
        bottom: 0;
        left: 10px;
        background: transparent !important;
        line-height: 30px;
        filter: alpha(opacity=30);
        color: #ddd;
        font-family: MicrosoftTaHei;
        font-size: 14px;
      "
        >
            <label id="coordinate_location">  经度:{{this.MousePosition.lon}}°，  纬度:{{this.MousePosition.lat}}°， 视角海拔高度:{{this.MousePosition.height}}米， </label>
<!--            <label id="coordinate_height"></label> 航向角 {{heading}}°&#12288;|&#12288; 俯仰角 {{pitch}}°&#12288;|&#12288; 滚转角 {{roll}}°&#12288;|&#12288;-->
            <label id="coordinate_cameraheight">  航向角 {{this.MousePosition.heading}}°， 俯仰角 {{this.MousePosition.pitch}}°，滚转角 {{this.MousePosition.roll}}</label>
        </div>
    </div>
</template>

<script>

    import 'cesium/Build/Cesium/Widgets/widgets.css'
    import '../assets/Cesiumstyle.css'
    import * as Cesium from 'cesium/Build/Cesium/Cesium'
    import CesiumNavigation from 'cesium-navigation-es6'
    import Navigation from "./Navigation";

    import {AddArcGISLayers} from "../js/Layer/ArcGISLayers"
    import {AddWMTSLayers} from "../js/Layer/wmtsLayers"
    import {AddTerrainLayers} from "../js/Layer/TerrainLayer"

    import {OpenPopdlg} from "../js/Entity/PickEnitydlg"
    import ViewerBase from "../js/Scene/ViewerBase"
    import LableEntityManage from "../js/Entity/AddLableLayer";

    export default {
        name: 'CesiumMap',
        components: {
            Navigation

        },
        props: {},
        data() {
            return {
                viewer: null,
                MousePosition:{
                    lon:0,
                    lat:0,
                    height:0,
                    heading:0,
                    pitch:0,
                    roll:0,
                },
            };
        },
        watch: {},
        computed: {},

        created() {
        },
        mounted() {
            this.Init3Dviewer();
            if (this.viewer) {
                this.InitSceneData(this.viewer);
            }
        },
        methods: {
            /**
             * 初始化三维视图
             * @constructor
             */
            Init3Dviewer() {
                window.Scene = {};
                /**
                 * 设置home建的位置
                 */
                Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
                    60.0,
                    60.0,
                    160,
                    9.0
                );
                Cesium.Ion.defaultAccessToken = window.EarthBaseConfig.Cesiumtoken;
                this.viewer = new Cesium.Viewer("CesiumContainer", {
                    //allowDataSourcesToSuspendAnimation: true,
                    homeButton: true,
                    animation: true, //是否显示动画控件
                    baseLayerPicker: false, //是否显示图层选择控件
                    geocoder: false, //是否显示地名查找控件
                    timeline: true, //是否显示时间线控件
                    navigationHelpButton: false, //是否显示帮助信息控件
                    infoBox: false, //是否显示点击要素之后显示的信息
                    sceneModePicker: true, //是否显示3D/2D选择器
                    vrButton: false, //双屏模式,默认不显示false
                    fullscreenButton: false,
                    CreditsDisplay: true,
                    selectionIndicator: false,
                    readonlysceneModePicker: true,
                    selectedEntity: true,
                    shadows: false,
                    creditContainer: document.createElement("DIV"),
                    imageryProvider: null,
                    // imageryProvider: new Cesium.MapboxImageryProvider({
                    //     mapId: "mapbox.satellite",
                    //     accessToken: "pk.eyJ1IjoiZGVuZ3plbmdqaWFuIiwiYSI6ImNqbGhnbWo1ZjFpOHEzd3V2Ynk1OG5vZHgifQ.16zy39I-tbQv3K6UnRk8Cw",
                    // }),
                    //terrainProvider : globe_terrainProvider,
                    sceneMode: Cesium.SceneMode.SCENE3D, // Cesium.SceneMode.SCENE2D Cesium.SceneMode.COLUMBUS_VIEW
                });

                /**
                 * 地形深度测试 开启或者关闭
                 */
                this.viewer.scene.globe.depthTestAgainstTerrain = true;
                /**
                 * // 关闭fxaa  最新的cesium已经将fxaa移到PostProcessStageCollection
                 */
                this.viewer.scene.fxaa = false;
                /**
                 *cesium的label的清晰度
                 */
                this.viewer.scene.postProcessStages.fxaa.enabled = false;
                /**
                 * 隐藏Cesium动画控制控件
                 */
                this.viewer.animation.container.style.visibility = "hidden";
                /**
                 * 隐藏Cesium时间线控制控件
                 */
                this.viewer.timeline.container.style.visibility = "hidden";
                /**
                 * 隐藏版本信息用CSS控制
                 * @type {string}
                 */
                this.viewer.scene.postProcessStages.fxaa.enabled = false;
                var options = {};
                // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
                options.defaultResetView = Cesium.Rectangle.fromDegrees(60.0, 60.0, 160, 8.0);
                // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
                options.enableCompass = true;
                // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
                options.enableZoomControls = true;
                // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
                options.enableDistanceLegend = true;
                // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
                options.enableCompassOuterRing = true;
                console.log(CesiumNavigation)
                CesiumNavigation(this.viewer, options);
                if (this.viewer) {
                    window.Scene.viewer = this.viewer;
                    let viewbase = new ViewerBase(this.viewer);
                    viewbase.getCurMousePosition(this.callbackUPDataPosition);
                    viewbase.activeFlytoViwer(window.EarthBaseConfig.initviewpoint,-20,-20,0);
                    // let lable = new  LableEntityManage(window.Scene.viewer);
                    // lable.AddLabeentity(null);
                    // OpenPopdlg(window.Scene.viewer);


                }
                return this.viewer;
            },
            async InitSceneData(viewer) {
                await AddWMTSLayers(viewer);
                await AddArcGISLayers(viewer);
                await AddTerrainLayers(viewer);

                // var shapemapbox = new Cesium.ArcGisMapServerImageryProvider({
                //     url : 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
                // });
                // viewer.imageryLayers.addImageryProvider(shapemapbox,5);

            },
            callbackUPDataPosition(lon,lat,height,heading,pitch,roll) {
                this.MousePosition.lon = lon;
                this.MousePosition.lat = lat;
                this.MousePosition.height = height;
                this.MousePosition.heading = heading;
                this.MousePosition.pitch = pitch;
                this.MousePosition.roll = roll;
            },
        },
    };
</script>
<style >
    .box {
        width: 100%;
        height: 100%;
        position: relative;
    }

    #CesiumContainer {
        height: 100%;
        width: 100%;
    }

    .trackPopUp {
        display: none;
        /*color: rgb(255, 255, 255);*/
        /*height: 50px;*/
    }

    #trackPopUpContent {
        position: absolute;
    }

    #popup-close-button {
        position: absolute;
        top: 0;
        right: 0;
        padding: 4px 4px 0 0;
        text-align: center;
        font: 25px/25px Tahoma, Verdana, sans-serif;
        color: rgba(255, 56, 56, 1);
        text-decoration: none;
        font-weight: bold;
        background-color: rgba(206, 42, 36, 0);
        /*background: transparent;*/
    }

    #popup-content-wrapper {
        margin: 0px;
        max-height: 300px;
        overflow-y: auto;

        padding: 1px;
        text-align: left;
        border-radius: 12px;
        background-color: rgba(20, 21, 21, 0.5);
        border:1.8px solid rgb(0, 165, 242);


        /*background-image: url('../assets/image/bgs.png');*/
    }

    #trackPopUpLink {
        /*margin: 3px 20px;*/
        /*line-height: 1.4;*/
        /*position: absolute;*/
        /*color: white;*/
        /*background-color: rgba(44, 47, 46, 0.9);*/
        /*-webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));*/
        /*filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));*/
        /*!*padding: 20px;*!*/
        /*border-radius: 3px;*/
        /*border: 1px solid rgb(0, 165, 242);*/
        /*bottom: 12px;*/
        /*!*height: 170px;*!*/
        /*!*right: -550px;*!*/
        /*!*display: none;*!*/

    }
    .Cesium-popup-content div{
        text-align: center;
    }

    .Cesium-popup-content div {
        font-size: 18px;
    }

    .Cesium-popup-content table {
        margin-top: 15px;
    }
    .Cesium-popup-content table thead{
        background-color: #3e2d2d;
        color: #000000;
        text-align: left;
        vertical-align: bottom;
    }

    .Cesium-popup-content table tr {
        height: 25px;
    }

    table {
        border-collapse: collapse;
        border-spacing: 0;
        padding: 0px;
        margin: 0px;
    }

    td,th {
        padding: 0;
    }

    .pure-table {
        border-collapse: collapse;
        border-spacing: 0;
        empty-cells: show;
        border: 0px solid #cbcbcb;
    }

    .pure-table caption {
        color: #000;
        font: italic 85%/1 arial,sans-serif;
        padding: 1em 0;
        text-align: center;
    }

    .pure-table td,.pure-table th {
        border-left: 1px solid #cbcbcb;
        border-width: 0 0 0 1px;
        font-size: inherit;
        margin: 0;
        overflow: visible;
        padding: .5em 1em;
    }

    .pure-table thead {
        background-color: rgba(27, 147, 212, 0.6);
        border: 1px solid rgb(0, 165, 242);
        color: #000;
        text-align: left;
        vertical-align: bottom;
    }

    .pure-table td {
        background-color: transparent;
    }
    .pure-table-horizontal td,.pure-table-horizontal th {
        border-width: 0 0 0px 0;
        border-bottom: 0px solid #cbcbcb;
    }

    .pure-table-horizontal tbody>tr:last-child>td {
        border-bottom-width: 0;
    }
    .sectionChars {
        position: absolute;
        top: auto;
        width: 90%;
        height: 200px;
        bottom: 10px;
        left: 5%;
        top: auto;
        bottom: 25px;
        display: none;
    }
    #echartsView1{
        background-color: rgba(36, 191, 101, 0.5);
    }
</style>