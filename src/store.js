import Vue from 'vue'
import Vuex from 'vuex'
import utils from './utils/utils'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tokenId: window.localStorage.tokenId || '',
    isLogin: window.localStorage.isLogin || false,
    userInfo: {
        avatar_url: '',     // 头像
        id: '',             // 用户 id
        username: '',      // 用户名
    },
    tagList: []
  },
  mutations: {   // 更改 Vuex 的 store 中的状态   ！必须同步执行
    // 退出登录
    logout (state,data) {
        window.localStorage.removeItem('tokenId');
        window.localStorage.removeItem('isLogin');
        state.tokenId = '';
        state.isLogin = false;
        data.$axios.post(utils.req_address+"/user/logout")
        .then((res)=>{
          if(res.data.code !== undefined && res.data.code === 1) {
            this.$Message.success(res.data.msg);
          }
        })
        .catch(e => e);
    },  
    // 更新登录状态
    updateLoginStatus (state, data) {
        if( data.tokenId ) {
          window.localStorage.tokenId = window.localStorage.saveTokenId = state.tokenId = data.tokenId;
          state.userInfo = data.userInfo;
        } else {
          state.userInfo = data.userInfo;
        }
        window.localStorage.isLogin = true;
        state.isLogin = true;
    },
    // 获取标签列表
    getTag(state,data) {
      data.$axios.get(`${utils.req_address}/tag/getTag`,{
        params: {
            "user_id": state.userInfo.user_id
        }
      })
      .then((res)=>{
        if(res.data.code !== undefined && res.data.code === 1) {
          state.tagList = res.data.data;
        } else {
          this.$Message.error("获取标签列表错误！");
        }
      })
      .catch()
    },
    // 更新state中tagList的数据
    updateTagList(state,data) {
      state.tagList.splice(data.index,1);
    },
    // 修改tagList中的tag_name
    updateTagName(state,data){
      state.tagList[data.index].tag_name = data.tag_name;
    },
    // 改变用户的avatar_url字段
    updateAvatar(state,data) {
      state.userInfo.avatar_url = data.avatar_url;
    }
  },
  actions: {   // 提交 mutation     ！可以执行异步操作
    // 登录
    login ({ dispatch, state, commit }, data) {
        commit('updateLoginStatus', data);
        commit('getTag',data._this);
    },
    // 检查是否已登录
    checkLogin ({ state, dispatch, commit },_this) {
      if( state.tokenId ) {
          _this.$axios.post(`${utils.req_address}/user/login`,{
            "token_id": state.tokenId
          })
          .then(res => {
              if( res.data.code !== undefined && res.data.code === 1 ) {
                  commit('updateLoginStatus', res.data);
                  commit('getTag',_this);
              } else if(res.data.code !== undefined && res.data.code === 0) {
                state.isLogin = false;
                _this.$Message.error(res.data.msg);
              } else {
                console.log("检查登录状态失败！");
              }
          })
          .catch(e => e);
      }
    },
    addTag({ dispatch, state, commit }, data){
      (data._this).$axios.post(`${utils.req_address}/tag/add`,{
        "user_id": state.userInfo.user_id,
        "tag_name": data.tag_name
      })
      .then((res)=>{
        if(res.data.code !== undefined && res.data.code === 1) {
          // 新增禁用和操作按钮的状态
          data._this.disableArr.push(true);
          data._this.edit.push(false);
          data._this.newTag = '';
          // 更新数据
          commit('getTag',data._this);
          (data._this).$Message.success(res.data.msg);
        } else if(res.data.msg !== undefined){
          (data._this).$Message.error(res.data.msg);
        } else {
          console.log("添加标签失败！");
        }
      })
      .catch();
    },
    // 删除标签
    deleteTag({ dispatch, state, commit }, data) {
      (data._this).$axios.post(`${utils.req_address}/tag/delete`,{
        "user_id": state.userInfo.user_id,
        "tag_id": state.tagList[data.index].tag_id,
        "blog_total": state.tagList[data.index].total
      })
      .then((res)=>{
        if(res.data.code !== undefined && res.data.code === 1) {
          commit('updateTagList',{
            "tag_id": data.tag_id,
            "index": data.index
          });
          (data._this).$Message.success(res.data.msg);
          if(state.tagList[data.index].total > 0) {
            commit('getTag',data._this);
          }
        } else if(res.data.msg !== undefined) {
          (data._this).$Message.error(res.data.msg);
        } else {
          console.log("删除标签失败！");
        }
      })
      .catch();
    },
    // 编辑标签
    editTag({ dispatch, state, commit }, data) {
      (data._this).$axios.post(`${utils.req_address}/tag/edit`,{
        "user_id": state.userInfo.user_id,
        "tag_id": state.tagList[data.index].tag_id,
        "tag_name": state.tagList[data.index].tag_name
      })
      .then((res)=>{
        if(res.data.code !== undefined && res.data.code === 1) {
          (data._this).$Message.success(res.data.msg);
        } else {
          dispatch('commitTagName',{
            "index": data.index,
            "tag_name": data._this.startTagName[data.index]
          });
          this.$Message.error("标签名更新失败");
        }
      })
      .catch();
    },
    //  提交更新数据的mutation，updateTagName
    commitTagName({ dispatch, state, commit }, data) {
      commit('updateTagName',data)
    },
    editAvatar({ dispatch, state, commit }, data){
      commit('updateAvatar',data);
    }
  }
})
