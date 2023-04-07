<template>
  <div id="app">
    <router-view/>
  </div>

</template>

<style lang="less">
body{
  background-color: #f7f7f7;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  // color: #2c3e50;
}
.auto_img{
  width: 100%;
  display: block;
}
.fl{
  float: left;
}
.fr{
  float: right;
}
.clearfix::after{
  content: "";
  display: block;
  clear: both;
}
.one_text{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.fix{
  position: fixed;
}


</style>
