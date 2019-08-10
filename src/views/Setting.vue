<template>
  <Layout class="home">
    <Header></Header>
    <Content class="content">
        <div class="avatar_container">
            <Avatar class="Avatar" size="large" v-if="!userInfo.avatar_url">V</Avatar>
            <Upload 
                :action="uploadAddress" 
                accept="image"
                :show-upload-list="false"
                :format="['jpg','jpeg','png']"
                :on-success="handleSuccess"
                :on-format-error="handleFormatError">
                <Button icon="ios-cloud-upload-outline">Upload files</Button>
            </Upload>
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
    padding: 20px;
    background: @component-background;
    .Avatar {
        color: @normal-color ;
        background-color: @primary-color;
        margin-right: 20px;
    }
    .avatar_container {
        display: flex;
    }
  }
</style>

