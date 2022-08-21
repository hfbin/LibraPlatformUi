<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="角色权限配置" name="first">
        <el-container style="height: calc(100vh - 184px); border: 1px solid #eee">
          <el-aside width="12%" style="border-right: 1px solid #eee">
            <div class="tree-search">
              <el-input v-model="filterName" size="small" icon="el-icon-search" placeholder="搜索角色">
                <i v-if="filterName !== ''" slot="suffix" class="el-icon-circle-close" style="line-height: 32px" @click="resetSearchFilter"></i>
                <i v-if="filterName === ''" slot="suffix" class="el-icon-search el-input__icon"></i>
              </el-input>
            </div>
            <el-tree
              ref="treeRef"
              node-key="id"
              :data="roleData"
              :props="defaultProps"
              :filter-node-method="filterNode"
              highlight-current
              default-expand-all
              :expand-on-click-node="false"
              @node-click="handleNodeClick"
            >
              <span slot-scope="{ node, value }">
                <span :class="{disabled: node.data.roleGroup}">{{ node.data.name }}</span>
                <PopoverMenu
                  ref="showMenu"
                  class="role-menu"
                  :event="Event"
                  :node="node"
                  :text="value"
                  :data="popListFun(node.data.roleGroup)"
                  @menuClick="handleMenuClick"
                />
              </span>
            </el-tree>
            <div class="role-menu-save">
              <el-button
                class="role-menu-save-bth"
                type="primary"
                plain
                icon="el-icon-plus"
                @click="addRoleGroup"
              >新增角色组</el-button>
            </div>
          </el-aside>
          <el-main style="width: 100%;">
            <div style="">
              <h3 style="font-size: 20px;padding-left: 35px;font-weight: 500; margin-bottom: 0;">{{ currentRoleName }}</h3>
              <h5 style="font-size: 12px;padding-left: 35px;fcolor: #999; overflow: hidden; margin-top: 5px; font-weight: 100; text-overflow: ellipsis; white-space: nowrap;">{{ currentRoleRemark }}</h5>
            </div>
            <tree
              v-if="isRouterAlive"
              v-model="ids"
              class="role-menu-tree"
              :tree-data="treeData"
              :without-parents="withoutParents"
              :options="treeOptions"
              :disabled="checkboxDisabled"
            />
            <div class="role-menu-save">
              <el-button class="role-menu-save-bth" type="primary" @click="submitRoleMenuForm">保存</el-button>
              <el-button class="role-menu-rest-bth" type="text" @click="restRoleMenuForm">恢复默认</el-button>
            </div>
          </el-main>
        </el-container>
      </el-tab-pane>
      <el-tab-pane label="员工角色分配" name="second"> 员工角色分配</el-tab-pane>
      <el-tab-pane label="部门角色分配" name="th"> 部门角色分配</el-tab-pane>
    </el-tabs>
    <!-- ▼ 添加或修改角色组对话框 -->
    <el-dialog :title="roleGroupTitle" :visible.sync="roleGroupDialogOpen" width="600px" append-to-body>
      <el-form
        ref="roleGroupFrom"
        :model="roleGroupFrom"
        :rules="roleGroupRules"
        label-width="100px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色组名称" prop="name">
              <el-input v-model="roleGroupFrom.name" placeholder="请输入角色组名" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="角色组描述" prop="description">
              <el-input v-model="roleGroupFrom.description" placeholder="请输入描述" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitRoleGroupForm">确 定</el-button>
        <el-button @click="cancelRoleGroup">取 消</el-button>
      </div>
    </el-dialog>
    <!-- ▲ 添加或修改角色组对话框-->
    <!-- ▼ 添加或修改角色对话框 -->
    <el-dialog :title="roleTitle" :visible.sync="roleDialogOpen" width="600px" append-to-body>
      <el-form ref="roleFrom" :model="roleFrom" :rules="roleRules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色名称" prop="name">
              <el-input v-model="roleFrom.roleName" placeholder="请输入角色名" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="角色描述" prop="description">
              <el-input v-model="roleFrom.description" placeholder="请输入描述" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitRoleForm">确 定</el-button>
        <el-button @click="cancelRole">取 消</el-button>
      </div>
    </el-dialog>
    <!-- ▲ 添加或修改角色对话框-->
  </div>
</template>

<script>
import { roleTree, roleMenuAuth, saveRoleMenuAuth, getRole, getRoleGroup, saveRoleGroup, saveRole, updateRoleGroup, updateRole, delRoleGroup, delRole } from '@/api/personnel/role'
import { menuTree } from '@/api/system/menu'
import tree from './components/Tree'
import PopoverMenu from './components/PopoverMenu'
import Vue from 'vue'

export default {
  provide() {
    return {
      reload: this.reload
    }
  },
  components: {
    tree,
    PopoverMenu
  },
  data() {
    return {
      // 加载中
      loading: false,
      // 接口返回列表数据
      list: [],
      // 角色数据
      roleData: [],
      // 左边树结构，筛选
      filterName: '',
      activeName: 'first',
      // 树结构树字段重新指定
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 菜单树结构包含父节点
      ids: [],
      // 角色是否可以编辑
      checkboxDisabled: false,
      // 菜单树结构不包含父节点
      withoutParents: [],
      // 菜单数据
      treeData: [],
      treeOptions: {
        // 是否包含父节点，如果为false,则要添加withoutParents这个参数，如果为true则不需要添加
        withParents: true
      },
      Event: new Vue(),
      disable: true,
      // 记录当前选中角色
      currentRoleId: undefined,
      // 记录当前选中角色名称
      currentRoleName: '角色菜单关联配置',
      // 记录当前选中角色备注
      currentRoleRemark: '系统默认会有一个超级管理员角色，拥有最高权限，无法编辑',
      // 保存角色权限对象
      roleMenuFrom: {
        roleId: undefined,
        menuIds: undefined
      },
      // 局部刷新
      isRouterAlive: true,
      // 保存角色组权限对象
      roleGroupFrom: {
        id: undefined,
        name: undefined,
        description: undefined
      },
      // 角色组标题
      roleGroupTitle: '新增角色组',
      // 角色组标题
      roleGroupDialogOpen: false,
      // 表单校验
      roleGroupRules: {
        name: [
          { required: true, message: '岗位名称不能为空', trigger: 'blur' }
        ]
      },
      // 保存角色权限对象
      roleFrom: {
        id: undefined,
        name: undefined,
        description: undefined
      },
      // 角色组标题
      roleTitle: '新增角色组',
      // 角色组标题
      roleDialogOpen: false,
      // 表单校验
      roleRules: {
        roleName: [
          { required: true, message: '岗位名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    filterName(val) {
      if (this.$refs.treeRef) {
        this.$refs.treeRef.filter(val)
      }
    }
  },
  created() {
    this.roleTree()
    this.menuTree()
  },
  methods: {
    // 重新渲染菜单树结构
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function() {
        this.isRouterAlive = true
      })
    },
    // 角色操作按钮处理
    popListFun(roleGroup) {
      let lastPopList
      if (roleGroup) {
        lastPopList = [
          { text: '新建角色', value: 10 },
          { text: '编辑角色组', value: 20 },
          { text: '删除角色组', value: 30 }
        ]
      } else {
        lastPopList = [
          { text: '编辑角色', value: 50 },
          { text: '删除角色', value: 60 }
        ]
      }
      return lastPopList
    },
    // 点击角色设置图标触发
    handleMenuClick(obj) {
      const { node, edit } = obj
      console.log('handleMenuClick', node, edit)
      if (edit.value === 50) { // 编辑角色
        this.updateRole(node.data)
      } else if (edit.value === 60) { // 删除角色
        this.deleteRole(node.data)
      } else if (edit.value === 10) { // 新增角色
        this.addRole(node.data)
      } else if (edit.value === 20) { // 编辑角色组
        this.updateRoleGroup(node.data)
      } else if (edit.value === 30) { // 删除角色组
        this.deleteRoleGroup(node.data)
      }
      this.Event.$emit('showMenu')
    },
    // 顶部tabs切换监听
    handleClick(tab, event) {
      console.log(tab, event)
    },
    /** 点击角色节点触发*/
    handleNodeClick(data) {
      if (!data.roleGroup) {
        console.log('handleNodeClick', data)
        this.currentRoleId = data.id
        this.currentRoleName = data.name
        this.currentRoleRemark = data.remark === null ? data.name : data.remark
        this.ids = []
        roleMenuAuth(data.id).then(response => {
          this.ids = response.data.menuIds
          this.checkboxDisabled = response.data.systemDefault === 1
          this.menuTree()
        })
      }
    },
    /** 保存角色菜单*/
    submitRoleMenuForm() {
      if (this.currentRoleId === undefined) {
        this.$message({
          message: '请选择角色',
          type: 'warning'
        })
        return
      }
      if (this.ids === null || this.ids.length < 1) {
        this.$message({
          message: '没有选中对应菜单',
          type: 'warning'
        })
        return
      }
      this.roleMenuFrom.roleId = this.currentRoleId
      this.roleMenuFrom.menuIds = this.ids
      saveRoleMenuAuth(this.roleMenuFrom).then(response => {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      })
    },
    // 恢复角色权限为默认
    restRoleMenuForm() {
      if (this.currentRoleId === undefined || this.ids === null || this.ids.length < 1) {
        return
      }
      roleMenuAuth(this.currentRoleId).then(response => {
        this.ids = response.data.menuIds
        this.menuTree()
      })
    },
    // 查询角色列表
    roleTree() {
      roleTree().then(response => {
        response.data
        this.roleData = response.data
      })
    },
    // 查询菜单列表
    menuTree() {
      menuTree().then(response => {
        this.treeData = response.data
        this.reload()
      })
    },
    // 重置角色过滤条件
    resetSearchFilter() {
      this.filterName = ''
    },
    // 过滤树不存在关键词的节点
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // [角色组]提交角色组
    submitRoleGroupForm() {
      this.$refs['roleGroupFrom'].validate(valid => {
        if (valid) {
          if (this.roleGroupFrom.id !== undefined) {
            updateRoleGroup(this.roleGroupFrom).then(response => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.roleGroupDialogOpen = false
              this.roleTree()
            })
          } else {
            saveRoleGroup(this.roleGroupFrom).then(response => {
              this.$message({
                message: '新增成功',
                type: 'success'
              })
              this.roleGroupDialogOpen = false
              this.roleTree()
            })
          }
        }
      })
    },
    // [角色组]新增角色组按钮触发
    addRoleGroup() {
      this.roleGroupTitle = '新增角色组'
      this.roleGroupDialogOpen = true
      this.resetForm('roleGroupFrom')
    },
    // [角色组]新增角色组按钮触发
    updateRoleGroup(data) {
      this.roleGroupDialogOpen = true
      this.roleGroupTitle = '编辑角色组'
      getRoleGroup(data.id).then(response => {
        this.roleGroupFrom = response.data
      })
    },
    // [角色组]新增角色组按钮触发
    deleteRoleGroup(data) {
      this.$confirm('是否确认删除名称为【' + data.name + '】的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delRoleGroup(data.id)
      }).then(() => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.roleTree()
      }).catch(() => {})
    },
    // [角色组]取消角色组
    cancelRoleGroup() {
      this.roleGroupDialogOpen = false
    },
    // [角色]提交角色
    submitRoleForm() {
      this.$refs['roleFrom'].validate(valid => {
        if (valid) {
          if (this.roleFrom.id !== undefined) {
            updateRole(this.roleFrom).then(response => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.roleDialogOpen = false
              this.roleTree()
            })
          } else {
            saveRole(this.roleFrom).then(response => {
              this.$message({
                message: '新增成功',
                type: 'success'
              })
              this.roleDialogOpen = false
              this.roleTree()
            })
          }
        }
      })
    },
    // [角色]新增角色按钮触发
    addRole(data) {
      this.roleDialogOpen = true
      this.roleTitle = '新增角色'
      this.resetForm('roleFrom')
      this.roleFrom = {
        groupId: data.id,
        roleName: undefined,
        description: undefined
      }
    },
    // [角色]新增角色按钮触发
    updateRole(data) {
      this.roleDialogOpen = true
      this.roleTitle = '修改角色'
      getRole(data.id).then(response => {
        this.roleFrom = response.data
      })
    },
    // [角色]新增角色按钮触发
    deleteRole(data) {
      this.$confirm('是否确认删除名称为【' + data.name + '】的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delRole(data.id)
      }).then(() => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.roleTree()
      }).catch(() => {})
    },
    // [角色]取消角色
    cancelRole() {
      this.roleDialogOpen = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/element-variables.scss";
.app-container {
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .tree-search {
    margin: 10px 10px;
  }

  .el-aside {
    .el-tree-node__content {
      margin-bottom: 5px !important;

      .disabled {
        font-size: 14px;
        color: #696969;
      }

      span {
        font-size: 14px;
        color: #000;
      }

      .role-menu {
        visibility: hidden;
      }
      &:hover {
        .role-menu {
          visibility: visible;
          color: #ccc;
          &:hover {
            color: $--color-primary;
          }
        }
      }
    }
    .role-menu-save {
      position: absolute;
      bottom: 0px;
      width: 12%;
      background: #ffffff;
      height: 50px;
      z-index: 99;
      border-top: 1px #eee solid;
      border-bottom: 1px #eee solid;
      border-right: 1px #eee solid;

      .role-menu-save-bth {
        display: block;
        height: 32px;
        line-height: 32px;
        padding: 0 20px;
        border: 1px solid $--color-primary;
        background-color: $--color-primary;
        border-radius: 3px;
        color: #fff !important;
        text-align: center;
        text-decoration: none;
        cursor: pointer;
        font-family: inherit;
        vertical-align: middle;
        margin: 0 auto;
        position: relative;
        top: 7px;
      }
    }
  }

  main {
    padding: 0;
    .role-menu-tree {
      margin-bottom: 60px;
    }

    .role-menu-save {
      position: absolute;
      bottom: 0px;
      width: 100%;
      background: #ffffff;
      height: 50px;
      z-index: 99;
      border-top: 1px #eee solid;
      border-bottom: 1px #eee solid;
      padding-left: 40px;

      .role-menu-save-bth {
        margin-top: 7px;
        display: inline-block;
        height: 32px;
        line-height: 32px;
        padding: 0 20px;
        border: 1px solid $--color-primary;
        background-color: $--color-primary;
        border-radius: 3px;
        color: #fff !important;
        text-align: center;
        text-decoration: none;
        cursor: pointer;
        font-family: inherit;
        vertical-align: middle;
        float: left;
      }
      .role-menu-rest-bth{
        margin-top: 3px;
        margin-left: 30px;
        float: left;
      }
    }
  }

  aside {
    padding: 0;
    border: none;
    background: #ffffff;
    margin-bottom: 0;
  }
}

.el-input__inner {
  height: 32px;
  background-color: pink !important;
  line-height: 32px;
}
</style>
