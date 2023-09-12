<template>
  <div>
    <p>一般权限管理分为角色、菜单权限、用户管理</p>
    <p>用户拥有 角色类型</p>
    <p>角色类型拥有菜单权限</p>
    <h4>菜单管理</h4>
    <menu-list></menu-list>
  </div>
</template>

<script>
import MenuList from './components/MenuList/index.vue'

export default {
  name: 'PermissionSystem',
  components: {
    MenuList
  }
}
</script>

