<template>
    <div id="bgs">
<!--        <video muted="" autoplay="" loop="" class="mp4" style="opacity:1">-->
<!--            <source type="video/mp4" src="../../assets/image/video-diqiu.mp4">-->
<!--        </video>-->
        <div id="login">
            <div class="loginToHome">
                <el-form
                        ref="form"
                        :model="form"
                        :rules="ruleForm"
                        status-icon
                        label-width="80px"
                        class="loginForm"
                >
                    <h3>登陆</h3>
                    <el-form-item
                            label="用户名"
                            prop="name"
                    >
                        <el-input
                                type="text"
                                v-model="form.name"
                                auto-complete="off"
                                placeholder="请输入用户名"
                        ></el-input>
                    </el-form-item>
                    <el-form-item
                            label="密码"
                            prop="password"
                    >
                        <el-input
                                type="password"
                                v-model="form.password"
                                auto-complete="off"
                                placeholder="请输入密码"
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button
                                class="homeBut"
                                type="primary"
                                plain
                                @click="submit"
                                :loading="logining"
                        >登录</el-button>
                        <el-button
                                class="loginBut"
                                type="primary"
                                plain
                                @click="resetForm()"
                        >重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

    </div>

</template>
<script>
    export default {
        data() {
            return {
                logining: false,
                form: {
                    name: 'admin',
                    password: '123456'
                },
                ruleForm: {
                    name: [
                        { required: true, message: '请输入账号', trigger: 'blur' },
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                    ]
                }
            }
        },
        methods: {
            submit(event) {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.logining = true;
                        if (this.form.name === 'admin' &&
                            this.form.password === '123456') {
                            this.logining = false;
                            sessionStorage.setItem('user', this.form.name);
                            //this.$router.push({ name: 'home' });
                            this.$router.push("./");
                        } else {
                            this.logining = false;
                            this.$alert('name or password wrong!', 'info', {
                                confirmButtonText: 'ok'
                            })
                        }
                    } else {
                        console.log('error submit!');
                        alert("用户名密码错误！请重新输入");
                        return false;
                    }
                })
            },
            resetForm() {
                this.$refs.form.resetFields();
            }

        }
    }
</script>
<style>
    #bgs{
        padding: 0px;
        margin: 0px;
        width: 100%;
        height: 100%;
        background-color: #00a5f2;
        background-image:url("../../assets/image/bg3.png") ;
        /*background: url("../../assets/image/video-diqiu.mp4")  no-repeat ;*/
    }
    .mp4{
        top: 0;
        left: 0;
        z-index: 1;
        min-height: 1000px;
        min-width: 1024px;
        width: 100%;
        height: auto;
    }
    .loginToHome {
        position: absolute;
        left: 0px;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        width: 400px;
        height: 260px;
        -webkit-border-radius: 5px;
        border-radius: 5px;
        background: #fff;
        border: 1px solid #dcdfe6;
    }
    .loginForm {
        text-align: center;
        padding-top: 15px;
        padding-right: 30px;
        top: 10px;
    }
    .homeBut {
        position: absolute;
        left: 0px;
    }
    .loginBut {
        position: absolute;
        right: 0px;
    }
</style>