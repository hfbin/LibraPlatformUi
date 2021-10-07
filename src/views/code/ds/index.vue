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
          @click="handleAdd"
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
      :border="false"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    >
      <template v-slot:operation="slotData">
        <div class="dialog-footer">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-copy-document"
            @click="handleUpdate(slotData.row)"
          >修改</el-button>
        </div>
      </template>
    </libra-table>
    <!-- ▲ 表格数据-->

    <!-- ▼ 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="动态名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入动态名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" placeholder="请输入用户名" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入密码" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="jdbcUrl" prop="url">
              <el-input v-model="form.url" placeholder="请输入jdbcUrl" />
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
import { pageList, get, save, update } from '@/api/code/ds'
export default {
  name: 'Position',
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
        pageNo: 1,
        pageSize: 10
      },
      // 加载中
      loading: false,
      // 接口返回列表数据
      list: [],
      // 新增或修改弹出层
      open: false,
      // 新增或修改参数
      form: {
        id: undefined,
        name: undefined,
        username: undefined,
        password: undefined,
        jdbcUrl: undefined
      },
      title: '代码生成',
      // 表单校验
      rules: {
        name: [
          { required: true, message: '动态名称不能为空', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        url: [
          { required: true, message: 'jdbcUrl不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.pageList()
  },
  methods: {
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
    /** 搜索 */
    handleQuery() {
      this.pageList()
    },
    /** 重置查询条件 */
    resetQuery() {
      this.resetForm('listQuery')
      this.pageList()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true
      this.reset()
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      get(row.id).then(response => {
        this.form = response.data
        this.form.password = ''
      })
      this.open = true
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            update(this.form).then(response => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.open = false
              this.pageList()
            })
          } else {
            save(this.form).then(response => {
              this.$message({
                message: '新增成功',
                type: 'success'
              })
              this.open = false
              this.pageList()
            })
          }
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
      this.form = {
        id: undefined
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
