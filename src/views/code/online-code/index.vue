<template>
  <div class="app-container">
    <!-- ▼ 搜索条件板块-->
    <el-form v-show="showSearch" ref="listQuery" :model="listQuery" :inline="true" class="table-search">
      <el-form-item label="表名" prop="keyword">
        <el-input
          v-model="listQuery.keyword"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="数据源">
        <el-select v-model="listQuery.dsName" size="small" clearable filterable placeholder="请选择">
          <el-option v-for="item in dsListData" :key="item.name" :label="item.name" :value="item.name">
            <span style="float: left">{{ item.name }}</span>
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
          icon="el-icon-copy-document"
          size="mini"
          @click="handleBatchAdd"
        >批量生成</el-button>
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
      :border="false"
      selection
      @selection-change="selectionChange"
      @select-all="selectionAll"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    >
      <template v-slot:operation="slotData">
        <div class="dialog-footer">
          <el-button
            v-if="slotData.row.tableName"
            size="mini"
            type="text"
            icon="el-icon-copy-document"
            @click="handleAdd(slotData.row)"
          >生成代码</el-button>
        </div>
      </template>
    </libra-table>
    <!-- ▲ 表格数据-->

    <!-- ▼ 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="包名" prop="packageName">
              <el-input v-model="form.packageName" placeholder="请输入包名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模块名称" prop="moduleName">
              <el-input v-model="form.moduleName" placeholder="请输入模块名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-tooltip class="item" effect="dark" content="FeignClient调用服务名" placement="top">
              <el-form-item label="服务名" prop="serviceName">
                <el-input v-model="form.serviceName" placeholder="请输入服务名" />
              </el-form-item>
            </el-tooltip>
          </el-col>
          <el-col :span="24">
            <el-form-item label="应用端" prop="clientCode">
              <el-select v-model="form.clientCode" clearable filterable placeholder="请选择">
                <el-option v-for="item in clientListData" :key="item.clientCode" :label="item.name" :value="item.clientCode">
                  <span style="float: left">{{ item.name }}[{{ item.clientCode }}]</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-tooltip class="item" effect="dark" content="如果填了表名前缀匹配则生成的代码会将前缀去除" placement="bottom">
              <el-form-item label="表前缀" prop="name">
                <el-input v-model="form.tablePrefix" placeholder="请输入表前缀" />
              </el-form-item>
            </el-tooltip>
          </el-col>
          <el-col :span="24">
            <el-tooltip class="item" effect="dark" content="若不填则以表说明为准" placement="bottom">
              <el-form-item label="表备注" prop="description">
                <el-input v-model="form.comments" placeholder="请输入表备注" />
              </el-form-item>
            </el-tooltip>
          </el-col>
          <el-col :span="24">
            <el-form-item label="作者" prop="name">
              <el-input v-model="form.author" placeholder="请输入作者" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- ▲ 添加或修改菜单对话框-->

  </div>
</template>

<script>
import * as constants from './js/constants'
import { pageList, code } from '@/api/code/onlineCode'
import { list } from '@/api/code/ds'
import { clientList } from '@/api/system/client'
export default {
  name: 'CodeOnline',
  data() {
    return {
      // 表头数据
      constants,
      // 总条数
      total: 0,
      // 显示搜索条件
      showSearch: true,
      // 查询列表参数
      listQuery: {
        keyword: undefined,
        dsName: undefined,
        pageNo: 1,
        pageSize: 10
      },
      // 加载中
      loading: false,
      // 接口返回列表数据
      list: [],
      // 主表选中项
      selectionList: [],
      // 新增或修改弹出层
      open: false,
      tableNames: [],
      dsListData: [],
      // 新增或修改参数
      form: {
        dsName: undefined,
        packageName: 'cn.hfbin',
        author: 'huangfubin',
        moduleName: 'base',
        tablePrefix: '',
        comments: '',
        serviceName: 'libra-tenant',
        tableName: []
      },
      title: '代码生成',
      // 应用list
      clientListData: [],
      // 表单校验
      rules: {
        packageName: [
          { required: true, message: '包名不能为空', trigger: 'blur' }
        ],
        moduleName: [
          { required: true, message: '模块名不能为空', trigger: 'blur' }
        ],
        serviceName: [
          { required: true, message: '服务名不能为空', trigger: 'blur' }
        ],
        clientCode: [
          { required: true, message: '应用不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.pageList()
    this.dsList()
  },
  methods: {
    /** 选择框插件：选中监听 */
    selectionChange(val) {
      console.log('selectionChange', val)
      this.selectionList = val
      this.setTableNames(this.selectionList)
    },
    /** 选择框插件：选中全部 */
    selectionAll(val) {
      console.log('selectionAll', val)
      this.selectionList = val
      this.setTableNames(this.selectionList)
    },
    setTableNames(selectionList) {
      this.tableNames = []
      for (let i = 0; i < selectionList.length; i++) {
        this.tableNames.push(this.selectionList[i].tableName)
      }
    },
    /** 分页插件：当前页面条数改变 */
    handleSizeChange(val) {
      console.log('handleSizeChange', val)
      this.listQuery.pageNo = 1
      this.listQuery.pageSize = val
      this.pageList()
    },
    /** 分页插件：当前页面改变 */
    handleCurrentChange(val) {
      console.log('handleCurrentChange', val)
      this.listQuery.pageNo = val
      this.pageList()
    },
    /** 查询列表 */
    pageList() {
      pageList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.loading = false
      })
    },
    /** ds查询列表 */
    dsList() {
      list().then(response => {
        this.dsListData = response.data
      })
    },
    /** 搜索 */
    handleQuery() {
      this.pageList()
    },
    /** 重置查询条件 */
    resetQuery() {
      this.resetForm('listQuery')
      this.pageList()
    },
    /** 查询应用列表 */
    getClientList() {
      clientList().then(response => {
        this.clientListData = response.data
      })
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.form.tableName = []
      this.open = true
      this.reset()
      this.getClientList()
      this.form.tableName.push(row.tableName)
    },
    /** 批量新增按钮操作 */
    handleBatchAdd() {
      if (this.tableNames.length < 1) {
        this.$message({
          message: '请选择对应数据',
          type: 'fail'
        })
        return
      }
      this.getClientList()
      this.reset()
      this.open = true
      this.form.tableName = this.tableNames
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.dsName = this.listQuery.dsName
          code(this.form).then(response => {
            if (response.code !== undefined) {
              this.$message({
                message: '代码生成失败',
                type: 'error'
              })
              this.open = false
              return
            }
            this.fileDown(response.data, this.form.tableName[0] + '-' + this.form.tableName.length + '.zip')
            this.open = false
          })
        }
      })
    },
    /** 取消按钮 */
    cancel() {
      this.open = false
      this.resetForm('form')
    },
    /** 表单重置 */
    reset() {
      this.resetForm('form')
    }
  }
}
</script>

<style lang="scss" scoped>
.el-select{
  width: 100%;
}
</style>
