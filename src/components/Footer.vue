<template>
     <div id="footer">
        footer
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {
            avatar_url: ''
        }
    },
    methods: {
        
    },
    computed: {
        ...mapState(['isLogin','userInfo'])
    }
}
</script>


<style lang="less" scoped>
    @import url('../assets/iview-variables.less');
    #footer {
        line-height: @line-height-base + 0.5;
        display: flex;
        background: @component-background;
        .common(padding);
        .px2rem(margin-top,20);
    }
</style>
