<template>
    <div id="menu">
        <el-menu
                :default-active="activeIndex2"
                class="el-menu-demo"
                mode="horizontal"
                @select="handleSelect"
                background-color=rgba(26,30,42,0.5)
                text-color="#fff"
                active-text-color=rgba(47,79,79,0.5) style="border-bottom: solid 0px #e6e6e6;">
            <el-menu-item index="1">菜  单</el-menu-item>
            <el-submenu index="2">
                <template slot="title">测  量</template>
                <el-menu-item index="2-1" @click="drawLineMeasure">长度测量</el-menu-item>
                <el-menu-item index="2-2" @click="drawAreaMeasure">面积测量</el-menu-item>
                <el-menu-item index="2-3" @click="drawTrianglesMeasure">三角测量</el-menu-item>
                <el-menu-item index="2-4" @click="">高度测量</el-menu-item>
                <el-menu-item index="2-5" @click="CleardrawMeasure">清除测量</el-menu-item>
            </el-submenu>
            <el-submenu index="3">
                <template slot="title">分  析</template>
                <el-menu-item index="3-1" @click="Loadmodel">模型加载</el-menu-item>
                <el-menu-item index="3-2">可视域分析</el-menu-item>
                <el-menu-item index="3-3">三角测量</el-menu-item>
                <el-menu-item index="3-4">几何分析</el-menu-item>
                <el-menu-item index="3-5">淹没分析</el-menu-item>
            </el-submenu>
            <el-submenu index="4">
                <template slot="title">动态分析</template>
                <el-menu-item index="4-1" @click="PorfileAnaly">剖面分析</el-menu-item>
            </el-submenu>
            <el-menu-item index="5" @click="restorationViewer">复  位</el-menu-item>
            <el-menu-item index="6" @click="OpenMapbox">MapboxGL</el-menu-item>
        </el-menu>
    </div>
</template>
<script>
    import Measure from  "../js/Measure/cesium-measure"
    import TilesLayerManager from "../js/Entity/LoadTilesLayer"
    import LoadTilesLayer from "../js/Entity/LoadTilesLayer";
    import ViewerBase from "../js/Scene/ViewerBase"
    import {DrawShape} from "../js/SpatialAnalyse/ProfileAnalyse"
    export default {
        name:"Navigation",
        components: {},
        props: {},
        data() {
            return {
                activeIndex: '1',
                activeIndex2: '1',
                measure:null,
                clampToGround:true,

            };
        },
        watch: {},
        computed: {},
        methods: {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            },
            initMeasure(){
                this.measure = new Measure(window.Scene.viewer);
                this.clampToGround = true;

            },
            drawLineMeasure(){
                this.initMeasure();
                let that = this;
                that.measure.drawLineMeasureGraphics({
                    clampToGround: that.clampToGround,
                    callback: () => { }
                })
            },
            drawAreaMeasure(){
                let that = this;
                that.measure.drawAreaMeasureGraphics({
                    clampToGround: that.clampToGround,
                    callback: () => { }
                })
            },
            drawTrianglesMeasure(){
                this.measure.drawTrianglesMeasureGraphics({
                    callback: () => { }
                })

            },
            CleardrawMeasure(){
                this.measure._drawLayer.entities.removeAll();
            },
            Loadmodel(){
                let tilesLaye = new LoadTilesLayer(window.Scene.viewer);
                //tilesLaye.AddTilesLayer(window.EarthBaseConfig.TilesModel);
                tilesLaye.MoveTilesLoad(window.EarthBaseConfig.TilesModel[0]);
            },
            PorfileAnaly(){
                //具体事件的实现
                DrawShape(window.Scene.viewer,"line");
            },
            restorationViewer(){
                let viewbase = new ViewerBase(window.Scene.viewer);
                viewbase.activeFlytoViwer(window.EarthBaseConfig.initviewpoint,-100,-70,0);
            },
            OpenMapbox(){
                //通过push进行跳转
                this.$router.push('/mapboxgl')
            }


        },
        created() {
        },
        mounted() {
            this.$nextTick(()=>{
                this.initMeasure();
            })
        }
    };
</script>
<style  scoped>
    #menu{
        position: absolute;
        top: 0;
        z-index: 99;
        width: 100%;
        background-color: rgba(26,30,42,0.5);
    }
    .el-menu{
        border-bottom: solid 0px #e6e6e6;
    }

</style>