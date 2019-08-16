<template>
     <div id="header">
        <router-link to="/" class="logo user-select-none">
            <h1>微Blog</h1>
        </router-link>
        <div class="header-left">
            <div v-if="isLogin" class="loged">
                <p @click="jumpToWrite">
                    <Avatar class="Avatar" icon="md-create" size="small" />
                    <span class="text">写博客</span>
                </p>
                <p>
                    <!-- <Avatar class="Avatar" size="small" v-if="userInfo.avatar_url" :src="userInfo.avatar_url" /> -->
                    <Avatar class="Avatar" size="small">V</Avatar>
                    <Dropdown class="text" @on-click="clickItem">
                        <a href="javascript:void(0)">
                            {{userInfo.username}}
                            <Icon type="ios-arrow-down"></Icon>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem name="setting">
                                <Icon type="ios-settings-outline" />设置
                            </DropdownItem>
                            <DropdownItem name="logout">
                                <Icon type="ios-swap" /> 退出
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </p>
            </div>
            <div v-else>
                <Button type="primary" ghost @click="handleJump('login')">登录</Button>
                <Button type="primary" ghost @click="handleJump('register')">注册</Button>
            </div>
        </div>
        <div class="menu">
            <Dropdown v-if="isLogin" @on-click="clickItem" placement="bottom-end">
                <a href="javascript:void(0)">
                    {{userInfo.username}}
                    <Icon type="ios-arrow-down"></Icon>
                </a>
                <DropdownMenu slot="list">
                    <DropdownItem name="setting">
                        <Icon type="ios-settings-outline" />设置
                    </DropdownItem>
                    <DropdownItem name="logout">
                        <Icon type="ios-swap" /> 退出
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
            <Button type="primary" v-else ghost @click="handleJump('login')">登录</Button>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import utils from '../utils/utils';
export default {
    data() {
        return {
            avatar_url: ''
        }
    },
    methods: {
        handleJump(address) {
            this.$router.push({ name: 'login', params: { name: address }});
        },
        clickItem (name) {
            if(name === "logout") {
                this.$store.commit('logout',this);
                this.$Message.success('已登出！');
                this.$router.replace({ name: 'login', params: { name: 'login' }});
            } else if(name === "setting") {
                this.$Message.warning(utils.warning_text);
                // this.$router.push({name: 'setting'});
            }
        },
        jumpToWrite(){
            this.$router.push({name: 'write',params: { type: 'newBlog'}});
        }
    },
    computed: {
        ...mapState(['isLogin','userInfo'])
    }
}
</script>


<style lang="less" scoped>
    @import url('../assets/iview-variables.less');
    #header {
        line-height: @line-height-base + 0.5;
        display: flex;
        background: @component-background;
        .common(padding-left);
        .common(padding-right);
        .px2rem(margin-bottom,20);
        position: relative;
        align-items: center;
    }
    .logo {
        flex: 1;
        color: @primary-color;
        text-align: left;
    }
    .header-left {
        flex: 2;
        text-align: right;
        line-height: 4;
        button:nth-of-type(2) {
            .px2rem(margin-left,10);
        }
        .loged {
            display: flex;
            justify-content: flex-end;
            p {
                margin-right: 10px;
                cursor: pointer;
            }
            .text {
                .px2rem(margin-left,6);
                text-align: left;
            }
        }
    }
    .Avatar {
        color: @normal-color ;
        background-color: @primary-color;
    }
    .menu {
        position: absolute;
        right: 10px;
        display: none;
    }
    @media screen{
        // 屏幕宽度小于768px时
        @media (max-width:@screen-s){
            .header-left {
              display: none;
            }
            .logo {
                text-align: center;
            }
            .menu {
                display: block;
            }
        }
        // 屏幕宽度大于768px时
        @media (min-width:@screen-s){
            .header-left {
              display: block;
            }
            .logo {
                text-align: left;
            }
            .menu {
                display: none;
            }
        }
    }
</style>
