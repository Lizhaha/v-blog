<template>
  <Layout class="home">
    <Header></Header>
    <Content class="content">
        <div class="head">
          <p class="title">{{blogList[0].title }}</p>
          <div>
            <p class="time">{{time}}</p>
            <p class="tag">分类：<Tag style="display:inline-block;" type="border" color="primary">{{blogList[0].tag_name}}</Tag></p>
            <p class="author">作者：<span>{{blogList[0].author}}</span></p>
            <p>
              <Button icon="md-create" size="small" type="primary" style="margin-right: 5px" @click="handleEdit()"></Button>
              <Button icon="ios-trash" size="small" type="error" @click="handleDelete()"></Button>
            </p>
          </div>
        </div>
        <div class="body">
          <div class="ql-container ql-snow" style="border:none;"><div class="ql-editor" v-html="blogList[0].content"></div></div>
        </div>
        <div class="tail">
          <router-link :to="blogList[1] === null ? {} :{ name: 'detail', params:  { id: blogList[1].blog_id }}">上一篇：{{blogList[1] === null ? '无' : blogList[1].title}}</router-link>
          <router-link :to="blogList[2] === null ? {} :{ name: 'detail', params:  { id: blogList[2].blog_id }}">下一篇：{{blogList[2] === null ? '无' : blogList[2].title}}</router-link>
        </div>
    </Content>
  </Layout>
</template>

<script>
import Header from '../components/Header.vue'
import { mapState } from 'vuex'
import utils from '../utils/utils';

export default {
  name: 'home',
  components: {
    Header
  },
  data(){
    return {
      curBlogId: 0,
      blogList: [
        {
          blog_id: 0,
          title: "加载中",
          abstract: "加载中",
          content:"加载中",
          time:0,
          user_id:0,
          tag_id0:12,
          tag_name:"加载中",
          author:"加载中"
        },null,null
      ],
      time: ''
    }
  },
  computed: mapState([
    // 映射 this.count 为 store.state.count
    'isLogin','tokenId'
  ]),
  methods: {
    init() {
      // 从路由参数获取博客数据
      this.curBlogId = this.$route.params.id;
    },
    getDetail() {
      this.$axios.get(`${utils.req_address}/blog/getDetail`,{
        params: {
          "token_id": this.tokenId,
          "blog_id": this.curBlogId
        }
      })
      .then(res=>{
        if(res.data.code && res.data.code === 1) {
          this.blogList = res.data.data;
          // 转换时间戳
          this.time = utils.Conversiontime(this.blogList[0].time);
        } else if(res.data.code && res.data.code === 0) {
          this.$Message.error(res.data.msg);
        } else {
          console.log("获取博客详情出现错误！");
        }
      })
      .catch()
    },
    handleEdit() {
      this.$Message.warning(utils.warning_text);
      /*if(localStorage.getItem("writting_blog")) {
        this.$Modal.confirm({
            title: '提示',
            content: '<p>您有一篇文章正在编辑中，确认覆盖吗？</p>',
            okText: '确定',
            cancelText: '查看编辑中文章',
            onOk: () => {
              let obj = {};
              obj.title = this.blogList.title;
              obj.content = this.blogList.content;
              obj.abstract = this.blogList.abstract;
              // 以及标签等....
              this.$router.push({name: 'write',params: { type: 'editBlog'}});
            },
            onCancel: () => {
              this.$router.push({name: 'write',params: { type: 'newBlog'}});
            }
        });
      }*/
    },
    handleDelete() {
       this.$Modal.confirm({
          title: '提示',
          content: "<p>确定删除此篇博客？</p>",
          onOk: () => {
              this.$axios.post(`${utils.req_address}/blog/delete`,{
                "token_id": this.tokenId,
                "blog_id": this.blogList[0].blog_id
              })
              .then((res)=>{
                if(res.data.code !== undefined && res.data.code === 1) {
                  this.$Message.success(res.data.msg);
                  this.$router.replace({name:'login',params:{name:'login'}});
                } else if(res.data.code !== undefined) {
                  this.$Message.error(res.data.msg);
                } else {
                  console.log("删除blog出现错误！");
                }
              })
              .catch()
          }
      });
    }
  },
  created(){
    this.init();
    this.getDetail();
  },
  watch: {
    '$route' (to, from) {
      this.init();
      this.getDetail();
    }
  }
}
</script>

<style lang="less" scoped>
  @import url('../assets/iview-variables.less');
  .content {
    background: @component-background;
    padding: 10px 20px;
    .head,.body {
      padding: 10px;
      border-bottom: 1px solid @primary-color;
      text-align: left;
    }
    .head {
      text-align: left;
      padding: 10px;
      .title{
        font-weight: bold;
        font-size: @font-size-large;
        line-height: 50px;
      }
      div {
        display: flex;
        align-content: center;
      }
      div p {
        line-height: 28px;
        margin-right: 40px;
      }
    }
    .tail {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
    }
  }
</style>

