<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="listQuery" :model="listQuery" :inline="true" class="table-search">
      <el-form-item label="接口名称" prop="name">
        <el-input
          v-model="listQuery.name"
          placeholder="请输入接口名称"
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
      :data="InterfaceList"
      :header-cell-style="{background:'#f7f8fa',color:'#323233'}"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="name" align="left" label="接口名称" :show-overflow-tooltip="true" width="180" />
      <el-table-column prop="code" align="center" label="接口标识" :show-overflow-tooltip="true" />
      <el-table-column prop="clientCode" align="center" label="应用编码" :show-overflow-tooltip="true" />
      <el-table-column prop="method" align="center" label="请求方式" :formatter="methodFormat" :show-overflow-tooltip="true" />
      <el-table-column prop="interfacePath" align="center" label="接口路径" :show-overflow-tooltip="true" />
      <el-table-column label="修改时间" align="center" prop="updateTime" width="160" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="240" fixed="right" class-name="small-padding fixed-width">
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
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改接口对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级接口" prop="parentId">
              <treeselect
                v-model="form.parentId"
                :options="interfaceOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级接口"
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
            <el-form-item label="接口名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入接口名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="接口编码" prop="code">
              <el-input v-model="form.code" placeholder="请输入接口编码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求方式" prop="method">
              <el-select v-model="form.method" placeholder="请选择">
                <el-option v-for="(value, key) in constants.method" :key="key" :label="value" :value="key">
                  <span style="float: left">{{ value }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="接口路径" prop="interfacePath">
              <el-input v-model="form.interfacePath" placeholder="请输入接口路径" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listInterface, getInterface, delInterface, addInterface, updateInterface } from '@/api/system/interface'
import { clientList } from '@/api/system/client'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import * as constants from './js/constants'

export default {
  name: 'Interface',
  components: { Treeselect },
  data() {
    return {
      constants,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 接口表格树数据
      InterfaceList: [],
      // 接口树选项
      interfaceOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 显示状态数据字典
      visibleOptions: [],
      // 接口状态数据字典
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
        name: [
          { required: true, message: '接口名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '权限编码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getClientList()
  },
  methods: {
    /** 查询接口列表 */
    getList() {
      this.loading = true
      listInterface(this.listQuery).then(response => {
        this.InterfaceList = this.handleTree(response.data, 'id')
        this.loading = false
      })
    },
    /** 查询应用列表 */
    getClientList() {
      clientList().then(response => {
        this.clientListData = response.data
      })
    },
    /** 转换接口数据结构 */
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
    /** 查询接口下拉树结构 */
    getTreeselect() {
      listInterface().then(response => {
        this.interfaceOptions = []
        const tree = { id: 0, name: '主类目', children: [] }
        tree.children = this.handleTree(response.data, 'id')
        this.interfaceOptions.push(tree)
      })
    },
    // 是否启用
    methodFormat(row) {
      return constants.method[row.method]
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
        clientCode: undefined,
        code: undefined,
        method: '0',
        interfacePath: undefined
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
      this.title = '添加接口'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.getTreeselect()
      getInterface(row.id).then(response => {
        this.form = response.data
        this.form.method = this.form.method + ''
        this.open = true
        this.title = '修改接口'
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateInterface(this.form).then(response => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.open = false
              this.getList()
            })
          } else {
            addInterface(this.form).then(response => {
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
        return delInterface(row.id)
      }).then(() => {
        this.getList()
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      }).catch(() => {})
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
