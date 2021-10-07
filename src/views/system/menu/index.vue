<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="listQuery" :model="listQuery" :inline="true" class="table-search">
      <el-form-item label="菜单名称" prop="name">
        <el-input
          v-model="listQuery.name"
          placeholder="请输入菜单名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="应用端" prop="clientCode">
        <el-select v-model="listQuery.clientCode" size="small" clearable filterable placeholder="请选择">
          <el-option v-for="item in clientListData" :key="item.clientCode" :label="item.name" :value="item.clientCode">
            <span style="float: left">{{ item.name }}({{ item.clientCode }})</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8" style="margin-bottom: 10px">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table
      v-loading="loading"
      :data="menuList"
      :header-cell-style="{background:'#f7f8fa',color:'#323233'}"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="name" align="center" label="菜单名称" :show-overflow-tooltip="true" width="130" />
      <el-table-column prop="icon" align="center" label="图标" width="100">
        <template slot-scope="scope">
          <svg-icon v-if="scope.row.icon" :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="sortNo" align="center" label="排序" width="50" />
      <el-table-column prop="clientCode" align="center" label="应用编码" :show-overflow-tooltip="true" />
      <el-table-column prop="menuType" align="center" label="菜单类型" :formatter="menuTypeFormat" width="80" :show-overflow-tooltip="true" />
      <el-table-column prop="perms" align="center" label="权限标识" :show-overflow-tooltip="true" width="100" />
      <el-table-column prop="path" align="center" label="组件地址" :show-overflow-tooltip="true" />
      <el-table-column prop="component" align="center" label="组件路径" :show-overflow-tooltip="true" />
      <el-table-column prop="enabled" align="center" label="启用状态" :formatter="enabledFormat" width="80" />
      <el-table-column prop="hidden" align="center" label="是否显示" :formatter="hiddenFormat" width="80" />
      <el-table-column label="修改时间" align="center" prop="updateTime" width="110" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="200" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-operation"
            @click="handleAddInterface(scope.row)"
          >接口配置</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- ▼ 接口权限配置对话框 -->
    <el-dialog title="接口权限配置" :visible.sync="interfaceOpen" width="600px" append-to-body>
      <el-form ref="interfaceForm" :model="interfaceForm" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="绑定接口" prop="description">
              <div class="tree-search">
                <el-input v-model="filterTreeName" size="mini" icon="el-icon-search" placeholder="搜索">
                  <i v-if="filterTreeName !== ''" slot="suffix" class="el-icon-circle-close" style="line-height: 32px" @click="resetSearchFilter" />
                  <i v-if="filterTreeName === ''" slot="suffix" class="el-icon-search el-input__icon" />
                </el-input>
              </div>
              <el-tree
                ref="treeRef"
                node-key="id"
                :data="treeData"
                :props="defaultProps"
                :filter-node-method="filterNode"
                show-checkbox
                highlight-current
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormInterface">确 定</el-button>
        <el-button @click="cancelInterface">取 消</el-button>
      </div>
    </el-dialog>
    <!-- ▲ 接口权限配置对话框 -->

    <!-- ▼ 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单" prop="parentId">
              <treeselect
                v-model="form.parentId"
                :options="menuOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级菜单"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="form.parentId === '0'" label="应用端" prop="clientCode">
              <el-select v-model="form.clientCode" clearable filterable placeholder="请选择">
                <el-option v-for="item in clientListData" :key="item.clientCode" :label="item.name" :value="item.clientCode">
                  <span style="float: left">{{ item.name }}[{{ item.clientCode }}]</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.menuType">
                <el-radio :label="0">一级菜单</el-radio>
                <el-radio :label="1">子菜单</el-radio>
                <el-radio :label="2">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="form.menuType !== 2" label="菜单图标">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['icons'].reset()"
              >
                <Icons ref="icons" @selected="selected" />
                <el-input slot="reference" v-model="form.icon" clearable placeholder="点击选择图标">
                  <svg-icon
                    v-if="form.icon"
                    slot="prefix"
                    :icon-class="form.icon"
                    class="el-input__icon"
                    style="height: 32px; width: 16px"
                  />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="sortNo">
              <el-input-number v-model="form.sortNo" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType !== 2" label="是否外链">
              <el-radio-group v-model="form.isOutUrl">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType !== 2" label="路由地址" prop="path">
              <el-input v-model="form.path" placeholder="路由地址（地址不可重复）" />
            </el-form-item>
          </el-col>
          <el-col v-if="form.menuType !== 2" :span="12">
            <el-tooltip class="item" effect="dark" :content="componentUrl(form)" placement="top">
              <el-form-item label="组件路径" prop="component">
                <el-input v-model="form.component" placeholder="请输入组件路径" />
              </el-form-item>
            </el-tooltip>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType === 2" label="权限标识">
              <el-input v-model="form.perms" placeholder="请输入权限标识" maxlength="200" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType !== 2 && form.isOutUrl === 0" label="显示状态">
              <el-radio-group v-model="form.hidden">
                <el-radio :label="0">显示</el-radio>
                <el-radio :label="1">隐藏</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType !== 2 && form.isOutUrl === 0" label="启用状态">
              <el-radio-group v-model="form.enabled">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType === 1 && form.isOutUrl === 0" label="是否缓存">
              <el-radio-group v-model="form.keepAlive">
                <el-radio :label="1">缓存</el-radio>
                <el-radio :label="0">不缓存</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- ▲ 接口权限配置对话框 -->

  </div>
</template>

<script>
import { listMenu, getMenu, delMenu, addMenu, updateMenu, getMenuInterfaceRef, addMenuInterfaceRef } from '@/api/system/menu'
import { treeInterface } from '@/api/system/interface'
import { clientList } from '@/api/system/client'

import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import Icons from './components/Icons'

export default {
  name: 'Menu',
  components: { Treeselect, Icons },
  data() {
    return {
      // 菜单树结构
      treeData: [],
      // 过滤菜单字段
      filterTreeName: '',
      // 部门树结构字段映射
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      // 关联接口保存Form
      interfaceForm: {},
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 菜单表格树数据
      menuList: [],
      // 菜单树选项
      menuOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      interfaceOpen: false,
      // 显示状态数据字典
      visibleOptions: [],
      // 菜单状态数据字典
      statusOptions: [],
      // 应用list
      clientListData: [],
      // 查询参数
      listQuery: {
        name: undefined,
        visible: undefined,
        clientCode: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: '上级不能为空', trigger: 'blur' }
        ],
        clientCode: [
          { required: true, message: '应用不能为空', trigger: 'blur' }
        ],
        menuType: [
          { required: true, message: '菜单类型不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        sortNo: [
          { required: true, message: '菜单顺序不能为空', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '路由地址不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    filterTreeName(val) {
      if (this.$refs.treeRef) {
        this.$refs.treeRef.filter(val)
      }
    }
  },
  created() {
    this.getList()
    this.getClientList()
  },
  methods: {
    componentUrl(data) {
      if (data.menuType === 0) {
        return '组件路径：@layout/index.vue'
      }
      if (data.menuType === 1 && data.component !== 'Layout') {
        return '组件路径：@views/' + data.component + '.vue'
      }
      if (data.menuType === 1 && data.component === 'Layout') {
        return '组件路径：@layout/entity.vue'
      }
      return '组件路径'
    },
    // 选择图标
    selected(name) {
      this.form.icon = name
    },
    /** 查询菜单列表 */
    getList() {
      this.loading = true
      listMenu(this.listQuery).then(response => {
        this.menuList = this.handleTree(response.data, 'id')
        this.loading = false
      })
    },
    /** 查询应用列表 */
    getClientList() {
      clientList().then(response => {
        this.clientListData = response.data
      })
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      listMenu().then(response => {
        this.menuOptions = []
        const menu = { id: 0, name: '主类目', children: [] }
        menu.children = this.handleTree(response.data, 'id')
        this.menuOptions.push(menu)
      })
    },
    // 显示状态字典翻译
    hiddenFormat(row) {
      if (row.hidden === 1) {
        return '隐藏'
      }
      return '显示'
    },
    // menuType转义
    menuTypeFormat(row) {
      let menuTypeName = ''
      if (row.menuType === 0) {
        menuTypeName = '一级菜单'
      } else if (row.menuType === 1) {
        menuTypeName = '子菜单'
      } else if (row.menuType === 2) {
        menuTypeName = '按钮'
      }
      return menuTypeName
    },
    // 是否启用
    enabledFormat(row) {
      if (row.enabled === 1) {
        return '启用'
      }
      return '禁用'
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        parentId: 0,
        name: undefined,
        icon: undefined,
        orderNum: undefined,
        isFrame: '1',
        keepAlive: 1,
        hidden: 0,
        enabled: 1,
        menuType: 0,
        isOutUrl: 0
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('listQuery')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset()
      this.getTreeselect()
      if (row != null && row.id) {
        this.form.parentId = row.id
      } else {
        this.form.parentId = '0'
      }
      this.open = true
      this.title = '添加菜单'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.getTreeselect()
      getMenu(row.id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改菜单'
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateMenu(this.form).then(response => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.open = false
              this.getList()
            })
          } else {
            addMenu(this.form).then(response => {
              this.$message({
                message: '新增成功',
                type: 'success'
              })
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除名称为"' + row.name + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delMenu(row.id)
      }).then(() => {
        this.getList()
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      }).catch(() => {})
    },
    /** 新增按钮操作 */
    handleAddInterface(row) {
      this.interfaceList()
      this.interfaceOpen = true
      this.reset()
      // 清空之前选中
      this.$nextTick(() => {
        this.$refs.treeRef.setCheckedKeys([])
      })
      getMenuInterfaceRef(row.id).then(response => {
        this.interfaceForm.ids = response.data.ids
        this.$nextTick(() => {
          this.$refs.treeRef.setCheckedKeys(this.interfaceForm.ids)
        })
      })
      this.interfaceForm.id = row.id
    },
    // 查询树
    interfaceList() {
      treeInterface().then(response => {
        this.treeData = response.data
      })
    },
    // 重置过滤部门树结构条件
    resetSearchFilter() {
      this.filterTreeName = ''
    },
    // 过滤树不存在关键词的节点
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    /** 提交按钮 */
    submitFormInterface() {
      const ids = this.$refs.treeRef.getCheckedNodes()
      if (ids.length > 0) {
        // 去除某个属性值
        this.interfaceForm.ids = ids.map((item) => { return item.id })
      }
      this.$refs['interfaceForm'].validate(valid => {
        if (valid) {
          addMenuInterfaceRef(this.interfaceForm).then(response => {
            this.$message({
              message: '绑定成功',
              type: 'success'
            })
            this.interfaceOpen = false
          })
          // 清空之前选中
          this.$nextTick(() => {
            this.$refs.treeRef.setCheckedKeys([])
          })
        }
      })
    },
    cancelInterface() {
      this.interfaceOpen = false
      this.resetForm('interfaceForm')
    }
  }
}
</script>
<style lang="scss" scoped>
.fixed-width .el-button--mini{
  padding: 0;
  min-width: auto;
}
.el-select{
  width: 100%;
}
</style>

