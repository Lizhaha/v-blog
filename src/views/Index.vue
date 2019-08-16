<template>
    <Layout class="home">
        <Header></Header>
        <Layout class="content">
            <Sider hide-trigger  class="left">
              <Left></Left>
            </Sider>
            <Content class="right">
              <div class="item" v-for="(item,index) in blogList" :key="item.blog_id">
                <p class="title" @click="lookDetail(index)"><Tag type="border" color="primary">{{item.tag_name}}</Tag>{{item.title}}</p> 
                <p class="abstract">{{item.abstract}}</p>
                <p class="time">{{timeList[index]}}</p>
              </div>
              <p class="tip" v-if="blogList.length === 0">
                您还没有写博客哦，快去
                <router-link :to="{name: 'write',params:{type: 'newBlog'}}">写一篇</router-link>
                吧
              </p>
            </Content>
        </Layout>
    </Layout>
</template>

<script>
import Header from '../components/Header.vue'
import Left from '../components/Left.vue'
import { mapState } from 'vuex'
import utils from '../utils/utils'

export default {
  name: 'home',
  components: {
    Header,
    Left
  },
  data(){
    return {
      blogList: [],
      timeList: []
    }
  },
  computed: {
    ...mapState(['isLogin','tokenId'])
  },
  methods: {
    getList(){
      this.$axios.get(`${utils.req_address}/blog/getList`,{
        params: {
          "token_id": this.tokenId
        }
      })
      .then(res=>{
        if(res.data.code && res.data.code === 1) {
          this.blogList = res.data.data;
          // 将时间戳转时间格式
          let arr = [];
          res.data.data.forEach(element => {
            arr.push(utils.Conversiontime(element.time));
          });
          this.timeList = arr;
        } else if(res.data.code && res.data.code === 0 ) {
          this.$Message.error(res.data.msg);
        } else if(res.data.code && res.data.code === 2 ) {
          this.$router.replace({name: 'login',params:{name : 'login'}});
        } else {
          console.log("获取博客列表出现错误！");
        }
      })
    },
    lookDetail(index){
      this.$router.push({ name: 'detail', params: { id: this.blogList[index].blog_id}});
    }
  },
  mounted(){
    this.getList();
  }
}
</script>

<style lang="less" scoped>
  @import url('../assets/iview-variables.less');
  .left,.right {
    background: @component-background;
  }
  .content {
    background: none;
    transition: display .2s;
    .left {
      margin-right: 20px;
    }
    .right {
      position: relative;
      .item {
        padding: 10px 20px;
        text-align: left;
        border-bottom: 1px solid @primary-color;
        .title {
          color: @title-color;
          font-size: @font-size-large;
          font-weight: bold;
          cursor: pointer;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .abstract {
          color: @subsidiary-color;
          margin: 5px 0;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
      .tip {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        font-size: @font-size-base;
      }
    }
    @media screen{
      // 屏幕宽度小于768px时
      @media (max-width:@screen-s){
          .left {
            display: none;
          }
      }
      // 屏幕宽度大于768px时
      @media (min-width:@screen-s){
          .left {
            display: block;
          }
      }
    }
  }
</style>

