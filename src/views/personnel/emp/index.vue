<template>
  <div class="app-container">
    <el-container style="height: calc(100vh - 124px); border: 1px solid #eee">
      <el-aside width="13%" style="border-right: 1px solid #eee">
        <div class="tree-search">
          <el-input v-model="filterDeptName" size="small" icon="el-icon-search" placeholder="搜索部门">
            <i v-if="filterDeptName !== ''" slot="suffix" class="el-icon-circle-close" style="line-height: 32px" @click="resetSearchFilter" />
            <i v-if="filterDeptName === ''" slot="suffix" class="el-icon-search el-input__icon" />
          </el-input>
        </div>
        <el-tree
          ref="treeRef"
          node-key="id"
          :data="data"
          :props="defaultProps"
          :filter-node-method="filterNode"
          highlight-current
          default-expand-all
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
        />
      </el-aside>
      <el-main style="width: 100%;">
        <!-- ▼ 搜索条件板块-->
        <el-form v-show="showSearch" ref="queryForm" :model="listQuery" :inline="true" class="table-search">
          <el-form-item label="字段">
            <el-input
              v-model="listQuery.keyword"
              placeholder="请输入内容"
              size="small"
              class="input-with-select"
              @keyup.enter.native="handleQuery"
            >
              <el-select slot="prepend" v-model="querySelect" placeholder="请选择">
                <el-option label="手机号" value="2" />
                <el-option label="姓名" value="1" />
                <el-option label="工号" value="3" />
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item label="岗位">
            <el-select v-model="listQuery.positionId" size="small" clearable filterable placeholder="请选择">
              <el-option v-for="item in positionList" :key="item.id" :label="item.name" :value="item.id">
                <span style="float: left">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色">
            <el-select v-model="listQuery.roleListIds" size="small" multiple collapse-tags clearable filterable placeholder="请选择">
              <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id">
                <span style="float: left">{{ item.roleName }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- ▲ 搜索条件板块-->

        <!-- ▼ 其他操作按钮板块-->
        <el-row :gutter="10" class="mb8" style="margin-bottom: 12px">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAddEmp"
            >新增</el-button>
          </el-col>
          <right-toolbar :show-search.sync="showSearch" @queryTable="pageList" />
        </el-row>
        <!-- ▲ 其他操作按钮板块-->

        <!-- ▼ 表格数据-->
        <libra-table
          :table-config="constants.columns"
          :table-list="list"
          :loading="loading"
          :list-query="listQuery"
          :total="total"
          :border="true"
          selection
          @selection-change="selectionChange"
          @select-all="selectionAll"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        >
          <template v-slot:operation="slotData">
            <div class="dialog-footer">
              <el-button
                v-if="slotData.row.id"
                size="mini"
                type="text"
                icon="el-icon-tickets"
                :disabled="slotData.row.systemDefault === 1"
              >详情</el-button>
              <el-button
                v-if="slotData.row.id"
                size="mini"
                type="text"
                icon="el-icon-edit"
                :disabled="slotData.row.systemDefault === 1"
                @click="handleUpdateEmp(slotData.row)"
              >修改</el-button>
              <el-button
                v-if="slotData.row.id"
                size="mini"
                type="text"
                icon="el-icon-refresh"
                :disabled="slotData.row.systemDefault === 1"
                @click="restPassword(slotData.row)"
              >重置密码</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                :disabled="slotData.row.systemDefault === 1"
              >删除</el-button>
            </div>
          </template>
        </libra-table>
        <!-- ▲ 表格数据-->
      </el-main>
    </el-container>
    <!-- ▼ 新增修改员工抽屉-->
    <emp
      :drawer-visible="drawer.isVisible"
      :opt-type="drawer.optType"
      :position-list="positionList"
      :role-list="roleList"
      :dept-tree="data"
      :edit-emp="editEmp"
      prop="emp"
      @close="drawerClose"
      @sucess="empClose"
    />
    <!-- ▲ 新增修改员工抽屉-->
  </div>
</template>

<script>
import * as constants from './js/constants'
import { pageList, resetPassword } from '@/api/personnel/emp'
import { deptTree } from '@/api/personnel/org'
import { positionList } from '@/api/personnel/position'
import { roleList } from '@/api/personnel/role'
import Emp from './emp'

export default {
  components: { Emp },
  data() {
    return {
      drawer: {
        isVisible: false,
        optType: 'add'
      },
      // 表头数据
      constants,
      // 总条数
      total: 0,
      // 显示搜索条件
      showSearch: true,
      // 查询列表参数
      listQuery: {
        keyword: undefined,
        positionId: undefined,
        deptIds: [],
        roleIds: [],
        pageNo: 1,
        pageSize: 10
      },
      // 搜索选中字段
      querySelect: '1',
      // 加载中
      loading: false,
      // 当前修改员工
      editEmp: {},
      // 接口返回列表数据
      list: [],
      // 主表选中项
      selectionList: [],
      // 过滤部门字段
      filterDeptName: '',
      data: [],
      // 部门树结构字段映射
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 记录当前选中的部门id(包括子部门)
      currentDeptIds: [],
      positionList: [],
      roleList: []
    }
  },
  watch: {
    filterDeptName(val) {
      if (this.$refs.treeRef) {
        this.$refs.treeRef.filter(val)
      }
    }
  },
  created() {
    this.pageList()
    this.deptTree()
    this.queryPositionList()
    this.queryRoleList()
  },
  methods: {
    // 编辑树结构节点触发
    handleNodeClick(data, node) {
      this.currentDeptIds = []
      this.currentDeptIds.push(data.id)
      // 获取当前选中的所有子节点
      this.childNodesChange(node, this.currentDeptIds)
      this.listQuery.deptIds = this.currentDeptIds
      this.listQuery.pageNo = 1
      this.pageList()
    },
    // 获取当前选中的所有子节点
    childNodesChange(node, currentDeptIds) {
      const len = node.childNodes.length
      for (let i = 0; i < len; i++) {
        node.childNodes[i].checked = false
        currentDeptIds.push(node.childNodes[i].data.id)
        this.childNodesChange(node.childNodes[i], currentDeptIds)
      }
    },
    selectionChange(val) {
      console.log('selectionChange', val)
      this.selectionList = val
    },
    selectionAll(val) {
      console.log('selectionAll', val)
      this.selectionList = val
    },
    handleSizeChange(val) {
      console.log('handleSizeChange', val)
      this.listQuery.pageNo = 1
      this.listQuery.pageSize = val
      this.pageList()
    },
    handleCurrentChange(val) {
      console.log('handleCurrentChange', val)
      this.listQuery.pageNo = val
      this.pageList()
    },
    // 查询部门树
    deptTree() {
      deptTree().then(response => {
        this.data = response.data
      })
    },
    // 查询岗位列表
    queryPositionList() {
      positionList().then(response => {
        this.positionList = response.data
      })
    },
    // 查询角色列表
    queryRoleList() {
      roleList().then(response => {
        this.roleList = response.data
      })
    },
    // 查询人员列表
    pageList() {
      pageList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.loading = false
      })
    },
    // 搜索
    handleQuery() {
      this.pageList()
    },
    // 重置查询条件
    resetQuery() {
      this.resetForm('queryForm')
      this.resetQueryForm()
      this.pageList()
    },
    // 重置查询表单
    resetQueryForm() {
      this.listQuery = {
        pageNo: 1,
        pageSize: 10
      }
    },
    // 重置过滤部门树结构条件
    resetSearchFilter() {
      this.filterDeptName = ''
    },
    // 过滤树不存在关键词的节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 【新增员工】新增处理
    handleAddEmp() {
      this.editEmp = null
      this.drawer.isVisible = true
      this.drawer.optType = 'add'
    },
    // 【新增员工】修改处理
    handleUpdateEmp(row) {
      this.editEmp = row
      this.drawer.optType = 'update'
      this.drawer.isVisible = true
    },
    // 【新增员工】子组件触发
    empClose() {
      this.drawer.isVisible = false
      if (this.drawer.optType === 'add') {
        this.resetQuery()
      } else {
        this.pageList()
      }
    },
    drawerClose() {
      this.drawer.isVisible = false
    },
    // 【员工】重置员工密码
    restPassword(row) {
      resetPassword(row.accountId).then(response => {
        this.$message({
          message: '重置密码成功',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-container{
    .el-input-group__append .el-select, .el-input-group__append .el-button, .el-input-group__prepend .el-select, .el-input-group__prepend .el-button {
      width: 90px;
    }
    .el-header {
      background-color: #B3C0D1;
      color: #333;
      line-height: 60px;
    }
    .tree-search{
      margin: 10px 10px;
    }
    .el-aside {
      color: #333;
    }
    aside{
      padding: 0;
      border: none;
      background: #ffffff;
    }
    /*input输入框size使用small与el-select结合使用会导致上下对齐问题*/
    .el-form-item__content .el-input-group {
      vertical-align: middle;
    }
  }
</style>
<style lang="scss">
@import "~@/styles/element-variables.scss";
  .el-drawer {
    height: 100%;
    overflow: auto;
  }
  .el-drawer__header {
    margin-bottom: 0px;
    padding: 15px;
    border-bottom: 1px $--color-primary solid;
    font-size: 18px;
    font-weight: 500;
    color: #000000;
  }
</style>
