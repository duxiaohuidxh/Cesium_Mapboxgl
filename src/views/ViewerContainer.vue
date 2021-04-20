<template>
    <div id="container" class="box">
        <div id="CesiumContainer"></div>
    </div>
</template>

<script>

    import 'cesium/Build/Cesium/Widgets/widgets.css'
    import * as Cesium from 'cesium/Build/Cesium/Cesium'
    import CesiumNavigation from 'cesium-navigation-es6'

    export default {
        name: 'CesiumMap',
        components: {},
        props: {},
        data() {
            return {
                viewer: null,

            };
        },
        watch: {},
        computed: {},

        created() {
        },
        mounted() {
            this.Init3Dviewer();

        },
        methods: {
            Init3Dviewer() {
                /**
                 * 设置home建的位置
                 */
                Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
                    60.0,
                    60.0,
                    160,
                    9.0
                );
                this.viewer = new Cesium.Viewer("CesiumContainer", {
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
                    //imageryProvider: Worldwmts,
                    imageryProvider: new Cesium.MapboxImageryProvider({
                        mapId: "mapbox.satellite",
                        accessToken: "pk.eyJ1IjoiZGVuZ3plbmdqaWFuIiwiYSI6ImNqbGhnbWo1ZjFpOHEzd3V2Ynk1OG5vZHgifQ.16zy39I-tbQv3K6UnRk8Cw",
                    }),
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

            },

        },
    };
</script>
<style scoped>
    .box {
        width: 100%;
        height: 100%;
    }
    #CesiumContainer{
        height: 100%;
        width: 100%;
    }
</style>