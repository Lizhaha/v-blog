<template>
    <div class="container">
        <div class="userMsg">
            <!-- <Avatar class="Avatar" size="large" v-if="userInfo.avatar_url" :src="userInfo.avatar_url" /> -->
            <Avatar class="Avatar" size="large" >V</Avatar>
            <div class="">
                <p>{{userInfo.username}}</p>
                <p>微期：{{Math.ceil((new Date().getTime() - this.userInfo.register_time) / 86400000)}}天</p>
            </div>
        </div>
        <div class="tag">
            <p class="title">分类 <Icon type="ios-create-outline" style="cursor:pointer;" @click="editTag"/></p>
            <p v-for="item in tagList" :key = "item.tag_id">
                {{item.tag_name}}
                <span>（{{item.total}}）</span>
            </p>
            <p v-if="tagList.length === 0">暂无分类</p>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {
            time: 0,
            toggleWindow: false,
            controlArr: []
        }
    },
    methods: {
        editTag(){
            this.$router.push({"name": "manageTag"});
        }
    },
    computed: {
        ...mapState(['isLogin','userInfo','tagList'])
    },
    mounted(){
        
    }
}
</script>

<style lang="less" scoped>
    @import url('../assets/iview-variables.less');
    .userMsg {
        width: 100%;
        box-sizing: border-box;
        .px2rem(margin-top,40);
        .px2rem(margin-bottom,40);
        .px2rem(padding-left,20);
        .px2rem(padding-right,20);
        display: flex;
        div {
            text-align: left;
        .px2rem(padding-left,10);
        }
    }
    .Avatar {
        color: @normal-color ;
        background-color: @primary-color;
    }
    .tag {
        width: 100%;
        p {
            box-sizing: border-box;
            .px2rem(margin-left,20);
            .px2rem(margin-right,20);
            text-align: left;
            .px2rem(line-height,40);
            color: @primary-color;
            cursor: pointer;
            position: relative;
        }
        p span {
            position: absolute;
            right: 0;
        }
        .title {
            color: #333;
            background: @tag-color;
            cursor: default;
            margin: 0;
            .px2rem(padding-left,20);
            .px2rem(padding-right,20);
        }
    }
</style>

