<template>
  <Layout class="home">
    <Header></Header>
    <Content class="content">
        <div class="title item">
            标题：
            <Input 
              v-model="blog.title" 
              placeholder="请输入文章标题（50字以内）" 
              :maxlength="maxlength.title" />
        </div>
        <quill-editor v-model="content" class="item"
                        ref="myQuillEditor"
                        :options="editorOption"
                        @blur="onEditorBlur($event)"
                        @focus="onEditorFocus($event)"
                        @change="onEditorChange($event)">
        </quill-editor>
        <div class="abstract item">
            摘要：
            <Input 
              v-model="blog.abstract" 
              placeholder="请输入文章摘要（100字以内）" 
              :maxlength="maxlength.abstract"/>
        </div>
        <Button type="primary" @click="handleSubmit(1)">发布</Button>
    </Content>
    <Modal
        v-model="toggleWindow"
        title="选择文章标签"
        @on-ok="handleSubmit(2)">
        <RadioGroup v-model="tagId" type="button">
          <Radio v-for="item in tagList" :key="item.tag_id" :label="item.tag_id">{{item.tag_name}}</Radio>
          <label class="ivu-radio-wrapper ivu-radio-group-item ivu-radio-default" @click="handleAddTag">
            <Icon type="md-add"/>
          </label>
        </RadioGroup>
    </Modal>
  </Layout>
</template>

<script>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import Vue from 'vue'
import { mapState } from 'vuex'
import utils from '../utils/utils'

export default {
  name: 'home',
  data () {
      return {
        maxlength: {
          title: 100,
          abstract: 50
        },
        tagId: 0,
        startTagId: 0,
        toggleWindow: false,
        blog: {
            title: '',
            abstract: ''
        },
        content: '',
        editorOption: {
          modules:{
            toolbar:[
                ['bold', 'italic', 'underline', 'strike'], //加粗，斜体，下划线，删除线
                ['blockquote', 'code-block'],  //引用，代码块
                // [{ 'header': 1 }, { 'header': 2 }],  // 标题，键值对的形式；1、2表示字体大小
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],  //几级标题
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],  //列表
                [{ 'script': 'sub'}, { 'script': 'super' }], // 上下标
                [{ 'indent': '-1'}, { 'indent': '+1' }],  // 缩进
                [{ 'direction': 'rtl' }],    // 文本方向
                // [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
                [{ 'color': [] }, { 'background': [] }],  // 字体颜色，字体背景颜色
                [{ 'font': [] }],  //字体
                [{ 'align': [] }], //对齐方式
                ['clean'], //清除字体样式
                ['image','video'] //上传图片、上传视频
            
            ]
          },
          theme:'snow'
        }
      }
    },
    components: {
        Header
    },
    // manually control the data synchronization
    // 如果需要手动控制数据同步，父组件需要显式地处理changed事件
    methods: {
      // onEditorBlur(quill) {
      //   console.log('editor blur!', quill)
      // },
      // onEditorFocus(quill) {
      //   console.log('editor focus!', quill)
      // },
      // onEditorChange({ quill, html, text }) {
      //   console.log('editor change!', quill, html, text)
      //   this.content = html
      // },
      handleSubmit(flag) {
          switch(flag) {
            case 1:  // 显示选择标签窗口
              if(this.blog.title === '' || this.blog.abstract === '' || this.content === '') {
                this.$Message.error("请确认标题/内容/摘要都不为空");
              } else if((this.blog.title).length>50 || (this.blog.abstract).length>100) {
                this.$Message.error("请检查标题和摘要长度");
              } else {
                this.toggleWindow = true;
              }
              break;
            case 2:  // 确认发布
              if(this.tagId === this.startTagId)  this.$Message.error("请选择博客所属的标签");
              else {
                this.$axios.post(`${utils.req_address}/blog/add`,{
                  "title": this.blog.title,
                  "abstract": this.blog.abstract,
                  "content": this.content,
                  "tag_id": this.tagId,
                  "user_id": this.$store.state.userInfo.user_id
                })
                .then(res=>{
                  if(res.data.code === 1) {
                    this.$Message.success(res.data.msg);
                    this.$router.replace({'name': "index"});
                    this.removeBlogStorage();
                  }else {
                    this.$Message.error(`${res.data.msg},已为您保存到缓存中`);
                    this.saveBlogStorage();
                  }
                })
              }
              break;
          }
      },
      handleAddTag(){
        this.$Modal.confirm({
          title: '提示',
          content: '<p>添加标签须前往标签管理页面，本页内容将自动保存</p><p>确认前往？</p>',
          onOk: () => {
            // 将所写内容保存到缓存中
            this.saveBlogStorage();
            // 跳转至标签管理页
            this.$router.push({name:'manageTag'});
          }
        });
      },
      saveBlogStorage(){
        let obj = {};
        obj.title = this.blog.title;
        obj.content = this.content;
        obj.abstract = this.blog.abstract;
        localStorage.setItem("writting_blog",JSON.stringify(obj));
      },
      getBlogStorage(){
        let obj = {};
        if(localStorage.getItem("writting_blog") !== null && localStorage.getItem("writting_blog").length>0) {
          obj = JSON.parse(localStorage.getItem("writting_blog"));
          Vue.set(this.blog,"title",obj.title);
          Vue.set(this.blog,"abstract",obj.abstract);
          this.content = obj.content;
        }
      },
      removeBlogStorage(){
        localStorage.removeItem("writting_blog");
      }
    },
    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill
      },
      ...mapState(['isLogin','userInfo','tagList'])
    },
    created() {
      this.getBlogStorage();
    },
    beforeRouteLeave (to, from , next) {
      if(this.blog.title != '' || this.blog.abstract != '' || this.content != '') {
        this.$Modal.confirm({
            title: '提示',
            content: '<p>所编辑的内容将不会被保存，确认离开当然页面吗？</p>',
            onOk: () => {
                next()
            },
            onCancel: () => {
                next(false)
            }
        });
      } else {
        next()
      }
    }
}
</script>

<style lang="less" scoped>
  @import url('../assets/iview-variables.less');
  .home {
    height: 100%;
    text-align: left;
  }
  .content {
    .common(margin);
    padding: 20px;
    height: ~"calc(100% - 84px)";
    background: @component-background;
    .item {
        margin-bottom: 20px;
    }
  }
</style>

