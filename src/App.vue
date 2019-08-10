<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import Header from './components/Header.vue'

export default {
  name: 'app',
  components: {
    Header
  },
	beforeCreate () {
		this.$store.dispatch('checkLogin',this);
	}
}
</script>

<style lang="less">
@import url('assets/iview-variables.less');
#app {
  font-family: @font-family;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: @text-color;
  font-size: @font-size-base;
  flex-grow: 1;
}
body {
  display: flex;
  flex-direction: column;
}
</style>
