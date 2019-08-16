<template>
  <Layout class="home">
    <Header></Header>
    <Content class="content">
        <div>
            <img src="@/assets/images/404.jpg" alt="未匹配" class="pointer-events-none" />
            <div class="go">
                <router-link to="/">回到首页</router-link>
            </div>
        </div>
    </Content>
  </Layout>
</template>

<script>
import Header from '../components/Header.vue'
import Vue from 'vue'
import { mapState } from 'vuex'
import utils from '../utils/utils';

export default {
  name: 'home',
  data () {
      return {
        uploadAddress: `${utils.req_address}/user/upload`
      }
    },
    components: {
        Header
    },
    methods: {
        init() {
            
        },
        handleSuccess(res,file) {
            if(res.code === 1) {
                this.$Message.success(res.msg);
                this.$store.dispatch('editAvatar',{
                    'avatar_url':  `${utils.avatar_url}/${file.name}`
                });
            }
        },
        handleFormatError(file) {
            this.$Message.error("该文件格式不符合要求，请上传正确格式：[jpg,jpeg,png]");
        }
    },
    computed: {
      ...mapState(['isLogin','userInfo','tagList'])
    },
    mounted() {
        this.init();
    }
}
</script>

<style lang="less" scoped>
  @import url('../assets/iview-variables.less');
  .content {
    text-align: left;
    .px2rem(padding,20);
    background: @component-background;
    .go {
        font-weight: bold;
        text-decoration: underline;
    }
  }
  @media screen{
        // 屏幕宽度小于768px时
        @media (max-width:@screen-s){
            .content img {
              width: 240px;
              height: 150px;
            }
        }
        // 屏幕宽度大于768px时
        @media (min-width:@screen-s){
            .content img {
              width: 480px;
              height: 300px;
            }
        }
    }
</style>

