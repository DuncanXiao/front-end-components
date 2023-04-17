<template>
  <div id="app">
    <div class='left-content'>
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
      >
        <template v-for="(route, index) in routes">
          <el-submenu
            v-if="route.children && route.children.length > 0 && route.displayMenu"
            :key="route.path + index"
            :index="index + ''"
          >
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{route.name}}</span>
            </template>
            <template v-for="(sroute, sindex) in route.children">
              <el-menu-item
                v-if="sroute.displayMenu"
                :key="sroute.path + sindex"
                :index="index + '-' + sindex"
              >
                <router-link :to="route.path + '/' + sroute.path">{{sroute.name}}</router-link>
              </el-menu-item>
            </template>
          </el-submenu>

          <el-menu-item
            v-else-if="route.displayMenu"
            :key="route.path + index"
            index="2">
            <i class="el-icon-menu"></i>
            <router-link :to="route.path">{{route.name}}</router-link>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
    <div class="right-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import routes from './routes.js'
export default {
  name: 'App',
  components: {
    
  },
  data() {
    return {
      routes
    }
  },
  methods: {
  }
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;

  display: flex;
}
.left-content {
  width: 200px;
}
</style>
