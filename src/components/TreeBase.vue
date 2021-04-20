<template>
    <div id="TreeBase">
        <el-tree
                :data="data"
                show-checkbox
                node-key="id"
                :default-expanded-keys="[2, 3]"
                :default-checked-keys="[5]"
                :props="defaultProps">
        </el-tree>
    </div>

</template>

<script>
    export default {
        name: 'Treebase',
        components: {
        },
        props: {},
        data() {
            return {
                data: [{
                    id: 1,
                    label: '一级 1',
                    children: [{
                        id: 4,
                        label: '二级 1-1',
                        children: [{
                            id: 9,
                            label: '三级 1-1-1'
                        }, {
                            id: 10,
                            label: '三级 1-1-2'
                        }]
                    }]
                }, {
                    id: 2,
                    label: '一级 2',
                    children: [{
                        id: 5,
                        label: '二级 2-1'
                    }, {
                        id: 6,
                        label: '二级 2-2'
                    }]
                }, {
                    id: 3,
                    label: '一级 3',
                    children: [{
                        id: 7,
                        label: '二级 3-1'
                    }, {
                        id: 8,
                        label: '二级 3-2'
                    }]
                }],
            };
        },
        watch: {},
        computed: {},
        methods: {},
        created() {
        },
        mounted() {
        }
    };
</script>
<style  scoped>
    #TreeBase{
        position: absolute;
        height: 400px;
        width: 300px;
        top: 100px;
        left: 25px;
        background-color: rgba(26,30,42,0.5);
    }
    .el-tree{
        background-color: rgba(26,30,42,0.2);
    }
</style>