<template>
    <Layout class="home">
        <Header></Header>
        <Content class="content">
            <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80">
                <FormItem label="手机号码" prop="phonenum">
                    <Input type="text" v-model="formCustom.phonenum" placeholder="请输入手机号码"></Input>
                </FormItem>
                <FormItem label="用户名" prop="username" v-if="pageName === 'register'">
                    <Input type="text" v-model="formCustom.username" placeholder="中文/英文/数字/下划线（2~6）"></Input>
                </FormItem>
                <FormItem label="密码" prop="passwd">
                    <Input type="password" v-model="formCustom.passwd" placeholder="英文/数字/下划线（6~8）"></Input>
                </FormItem>
                <FormItem label="确认密码" prop="passwdCheck" v-if="pageName === 'register'">
                    <Input type="password" v-model="formCustom.passwdCheck" placeholder="再次输入密码"></Input>
                </FormItem>
                <FormItem>
                    <Button type="warning" @click="handleChange()">{{pageName === "login" ? "未有账号，去注册" : "已有账号，去登录"}}</Button>
                    <Button type="primary" @click="handleSubmit('formCustom')" style="margin-left: 8px" :loading="loading">
                        <span v-if="!loading">{{pageName === "login" ? "登录" : "注册"}}</span>
                        <span v-else>{{pageName === "login" ? "登录" : "注册"}}中...</span>
                    </Button>
                    <Button @click="handleReset('formCustom')" style="margin-left: 8px">重置</Button>
                </FormItem>
            </Form>
        </Content>
    </Layout>
</template>

<script>
import Header from '../components/Header.vue'
import Vue from 'vue'
import utils from '../utils/utils'

export default {
  name: 'home',
  components: {
    Header
  },
  data() {
    const validateNum = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('手机号码不能为空'));
        }else {
            let regular = "^1(3|4|5|7|8)\\d{9}$";
            let pattern = new RegExp(regular);
            if (!pattern.test(value)) {
                callback(new Error('请输入合法的手机号码'));
            } else {
                callback();
            }
        }
    };
    const validateUname = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('用户名不能为空'));
        }else {
            let regular = "^([\u4e00-\u9fa5]||[a-z]||[A-Z]||[1-9]||\_){2,6}$";
            let pattern = new RegExp(regular);
            if (!pattern.test(value)) {
                callback(new Error('中文/英文/数字/下划线（2~6）'));
            } else {
                callback();
            }
        }
    };
    const validatePass = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请输入密码'));
        }else {
            let regular = "^\\w{6,8}$";
            let pattern = new RegExp(regular);
            if(!pattern.test(value)) {
                callback(new Error('英文/数字/下划线（6~8）'));
            }else if (this.formCustom.passwdCheck !== '' && this.pageName === 'register') {
                // 对第二个密码框单独验证
                this.$refs.formCustom.validateField('passwdCheck');
            } 
            callback();
        }
    };
    const validatePassCheck = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请确认您的密码'));
        } else if (value !== this.formCustom.passwd) {
            callback(new Error('与上一次输入不匹配'));
        } else {
            callback();
        }
    };
    return {
        loading: false,
        pageName: '',
        formCustom: {
            phonenum: '',
            username: '',
            passwd: '',
            passwdCheck: ''
        },
        ruleCustom: {
            phonenum: [
                { validator: validateNum,trigger: 'blur'}
            ],
            passwd: [
                { validator: validatePass, trigger: 'blur' }
            ],
            passwdCheck: [
                { validator: validatePassCheck, trigger: 'blur' }
            ],
            username: [
                { validator: validateUname, trigger: 'blur' }
            ]
        }
    }
  },
    methods: {
        handleSubmit (name) {
            this.loading = true;
            this.$refs[name].validate((valid) => {
                if (valid) {
                    switch (this.pageName) {
                        case 'login':                // 提交登录
                            this.$axios.post(`${utils.req_address}/user/login`, {
                                phone_num: this.formCustom.phonenum,
                                password: this.formCustom.passwd
                            })
                            .then(res => {
                                let data = res.data;
                                if(data.code !== undefined && data.code === 1) {
                                    this.$Message.success(data.msg);
                                    // 将sessionId存储到 localStorage 中
                                    localStorage.setItem("tokenId",data.tokenId);
                                    // 更新store中的数据状态
                                    this.$store.dispatch('login', {
                                        tokenId: data.tokenId,
                                        userInfo: data.userInfo,
                                        _this: this
                                    });
                                    // 跳转到首页
                                    this.$router.replace('/');
                                } else if(data.code !== undefined && data.code === 0) {
                                    this.$Message.error(data.msg);
                                } else {
                                    console.log("登录出现错误！");
                                }
                            })
                            .catch(err=>{
                                console.log(err);
                            })
                            .finally(()=>{
                                this.loading = false;
                            });
                            break;

                        case 'register':             // 提交注册
                            this.$axios.post(`${utils.req_address}/user/register`, {
                                phone_num: this.formCustom.phonenum,
                                username: this.formCustom.username,
                                password: this.formCustom.passwd
                            })
                            .then(res => {
                                let data = res.data;
                                if(data.code !== undefined && data.code === 1) {
                                    this.$Message.success(data.msg);
                                    this.handleChange();
                                } else if(data.code !== undefined && data.code === 0) {
                                    this.$Message.error(data.msg);
                                } else {
                                    console.log("注册出现错误！");
                                }
                            })
                            .catch(err=>{
                                console.log(err);
                            })
                            .finally(()=>{
                                this.loading = false;
                            });
                            break;

                        default:
                            break;
                    }
                } else {
                    this.loading = false;
                    this.$Message.error('信息存在错误!');
                }
            })
        },
        handleReset (name) {
            this.$refs[name].resetFields();
        },
        handleChange() {
            this.$router.push({ name: 'login', params: { name: this.pageName === 'register' ? 'login' : 'register' }});
        }
    },
    created() {
        // 获取路由参数
        this.pageName = this.$route.params.name;
    },
    watch: {
        // 当监测到路由参数变化时
        '$route' (to, from) {
            this.pageName = to.params.name;
            this.handleReset('formCustom')
        }
    }
}
</script>

<style lang="less" scoped>
  @import url('../assets/iview-variables.less');
  .content {
    background: @component-background;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>

