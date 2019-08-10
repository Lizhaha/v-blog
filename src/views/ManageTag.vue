<template>
    <Layout class="home">
        <Header></Header>
        <Content class="content">
            <div class="edit item">
                <h2>您创建的标签列表：</h2>
                <!-- slot-scope 的参数有 3 个：当前行数据 row，当前列数据 column，当前行序号 index。 -->
                <Table border :columns="columns" :data="tagList" width="800">
                    <template slot-scope="{ row,index }" slot="name">
                        <Input 
                            v-model="row.tag_name" 
                            placeholder="编辑标签名" 
                            style="width:250px; margin-right:20px;" 
                            :disabled="disableArr[index]"
                            @on-change="tagChange(index,$event)" />
                        <Button 
                            v-if="edit[index]"
                            type="primary" 
                            size="small" 
                            style="margin-right: 5px" 
                            @click="saveEdit(index)">保存</Button>
                        <Button 
                            v-if="edit[index]"
                            type="error" 
                            size="small" 
                            @click="cancelEdit(index)">取消</Button>
                    </template>
                    <template slot-scope="{ row }" slot="total">
                        {{row.total}}
                    </template>
                    <template slot-scope="{ row, index }" slot="operate">
                        <Button type="primary" size="small" style="margin-right: 5px" @click="handleEdit(index)">编辑</Button>
                        <Button type="error" size="small" @click="handleDelete(index)">删除</Button>
                    </template>
                </Table>
            </div>
            <div class="add item">
                <h2>添加新标签：</h2>
                <Input 
                    v-model="newTag" 
                    placeholder="请输入新增的标签名（20字以内）" 
                    style="width:250px; margin-right:20px;"
                    :maxlength="maxlength"  />
                <Button type="primary" size="small" @click="handleAddTag">添加</Button>
            </div>
        </Content>
    </Layout>
</template>

<script>
import Header from '../components/Header.vue'
import Vue from 'vue'
import { mapState } from 'vuex'

export default {
  name: 'home',
  data () {
      return {
        maxlength: 20,
        newTag: '',
        columns: [
            {
                title: '标签名',
                slot: 'name'
            },
            {
                title: '数量',
                slot: 'total',
                width: 150
            },
            {
                title: '操作',
                slot: 'operate',
                width: 150,
                align: 'center'
            }
        ],
        startTagName: [],
        disableArr: [],
        edit: []
      }
    },
    components: {
        Header
    },
    methods: {
        init() {
            // 初始化禁用数组
            let arr1 = [],arr2 = [],arr3 = [];
            arr1.length = arr2.length = this.$store.state.tagList.length;
            arr1.fill(true);
            this.disableArr = arr1;
            // 初始化显示操作按钮数组
            arr2.fill(false);
            this.edit = arr2;
            // 初始化 startTagName 数组
            this.$store.state.tagList.forEach(element => {
                arr3.push(element.tag_name);
            });
            this.startTagName = arr3;
        },
        handleEdit (index) {
            // 取消禁用状态
            this.disableArr[index] = false;
            Vue.set(this.disableArr, index, this.disableArr[index]);
            // 显示操作按钮
            this.edit[index] = true;
            Vue.set(this.edit,index,this.edit[index]);
        },
        handleDelete (index) {
            let strArr = [`<p>该标签下有<span style='color:red;'>${this.tagList[index].total}篇</span>文章，删除该标签后将会为你把标签下的文章移入[未分组]标签内。</p>`,"<p>该标签下无文章</p>"];
            this.$Modal.confirm({
                title: '提示',
                content: `${this.tagList[index].total === 0 ? strArr[1] : strArr[0]}<p>确认删除该标签？</p>`,
                onOk: () => {
                    this.$store.dispatch('deleteTag',{
                        "_this": this,
                        "index": index
                    })
                }
            });
        },
        saveEdit(index){
            // 将输入框变为禁用状态
            this.disableArr[index] = true;
            Vue.set(this.disableArr, index, this.disableArr[index]);
            // 隐藏操作按钮
            this.edit[index] = false;
            Vue.set(this.edit,index,this.edit[index]);
            // 提交改变
            if(this.startTagName[index] !== this.$store.state.tagList[index].tag_name) {
                this.$store.dispatch('editTag',{
                    "_this": this,
                    "index": index
                })
            }
        },
        cancelEdit(index){
            // 将输入框变为禁用状态
            this.disableArr[index] = true;
            Vue.set(this.disableArr, index, this.disableArr[index]);
            // 隐藏操作按钮
            this.edit[index] = false;
            Vue.set(this.edit,index,this.edit[index]);
            // 恢复输入框的值
            if(this.startTagName[index] !== this.$store.state.tagList[index].tag_name) {
                this.$store.dispatch('commitTagName',{
                    "index": index,
                    "tag_name": this.startTagName[index]
                })
            }
        },
        handleAddTag(){
            if(this.newTag !== '' && this.newTag.length < 20) {
                this.$store.dispatch('addTag',{
                    "_this": this,
                    "tag_name": this.newTag
                })
            } else {
                this.$Message.error("不能为空且字数在20字以内哦！");
            }
        },
        tagChange(index,event){
            this.$store.dispatch('commitTagName',{
                    "index": index,
                    "tag_name": event.target.value
                })
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
    padding: 20px;
    text-align: left;
    background: @component-background;
    .edit {
        margin-bottom: 20px;
    }
    .item h2 {
        margin-bottom: 10px;
    }
  }
</style>

