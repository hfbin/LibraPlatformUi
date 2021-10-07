<template>
  <div class="app-container">
    <!-- ▼ 搜索条件板块-->
    <el-form v-show="showSearch" ref="listQuery" :model="listQuery" :inline="true" class="table-search">
      <el-form-item label="租户名称" prop="tenantName">
        <el-input
          v-model="listQuery.tenantName"
          placeholder="请输入租户名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="租户编号" prop="tenantCode">
        <el-input
          v-model="listQuery.tenantCode"
          placeholder="请输入租户编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="菜单模板" prop="menuTemplateId">
        <el-select size="small" v-model="listQuery.menuTemplateId" clearable filterable placeholder="请选择">
          <el-option v-for="item in menuTemplateData" :key="item.id" :label="item.templateName" :value="item.id">
            <span style="float: left">{{ item.templateName }}</span>
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
      selection
      @selection-change="selectionChange"
      @select-all="selectionAll"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    >
      <template v-slot:operation="slotData">
        <div class="dialog-footer">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-tickets"
          >详情</el-button>
          <el-button
            v-if="slotData.row.id"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(slotData.row)"
          >修改</el-button>
          <el-button
            v-permission="['emp:delete']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(slotData.row)"
          >{{ slotData.row.status === 0 ? '启用' : '禁用' }}</el-button>
        </div>
      </template>
    </libra-table>
    <!-- ▲ 表格数据-->

    <!-- ▼ 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="租户名称" prop="tenantName">
              <el-input v-model="form.tenantName" placeholder="请输入租户名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="租户编码" prop="tenantCode">
              <el-input :disabled="form.id !== undefined" v-model="form.tenantCode" placeholder="请输入租户编码" />
            </el-form-item>
          </el-col>
          <el-col v-if="form.id === undefined" :span="24">
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="form.mobile" maxlength="11" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
          <el-col v-if="form.id === undefined" :span="24">
            <el-form-item label="管理账号" prop="username">
              <el-input v-model="form.username" placeholder="请输入管理账号" />
            </el-form-item>
          </el-col>
          <el-col v-if="form.id === undefined" :span="24">
            <el-form-item label="登录密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入登录密码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="租户等级" prop="level">
              <el-select v-model="form.level" placeholder="请选择">
                <el-option v-for="(value, key) in constants.level" :key="key" :label="value" :value="key">
                  <span style="float: left">{{ value }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单模板" prop="menuTemplateId">
              <el-select v-model="form.menuTemplateId" clearable filterable placeholder="请选择">
                <el-option v-for="item in menuTemplateData" :key="item.id" :label="item.templateName" :value="item.id">
                  <span style="float: left">{{ item.templateName }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生效时间" prop="beginDate">
              <el-date-picker
                v-model="form.beginDate"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择生效时间"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="终止时间" prop="endDate">
              <el-date-picker
                v-model="form.endDate"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择终止时间"
                style="width: 100%;"
              />
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
import { pageList, get, update, del, add } from '@/api/tenant/tenant'
import { menuTemplateList } from '@/api/tenant/menu'
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
        tenantCode: undefined,
        menuTemplateId: undefined,
        tenantName: undefined,
        keyword: undefined,
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
      // 新增或修改参数
      form: {},
      title: '添加租户',
      // 菜单模板
      menuTemplateData: {},
      // 表单校验
      rules: {
        tenantName: [
          { required: true, message: '租户名称不能为空', trigger: 'blur' }
        ],
        tenantCode: [
          { required: true, message: '租户编码不能为空', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '管理账号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '登录密码不能为空', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '租户等级不能为空', trigger: 'blur' }
        ],
        menuTemplateId: [
          { required: true, message: '菜单模板不能为空', trigger: 'blur' }
        ],
        mobile: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ]
      }
    }
    // eslint-disable-next-line no-unreachable
    var validatePhone = (rule, value, callback) => {
      const reg = !/^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else if (reg.test(rule)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
  },
  created() {
    this.pageList()
    this.menuTemplateList()
  },
  methods: {
    /** 选择框插件：选中监听 */
    selectionChange(val) {
      console.log('selectionChange', val)
      this.selectionList = val
    },
    /** 选择框插件：选中全部 */
    selectionAll(val) {
      console.log('selectionAll', val)
      this.selectionList = val
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
      this.title = '新增租户'
      this.open = true
      this.reset()
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.resetForm('form')
      get(row.id).then(response => {
        this.form = response.data
        this.form.level = this.form.level + ''
        this.open = true
        this.title = '修改租户'
      })
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
            add(this.form).then(response => {
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
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除名称为【' + row.tenantName + '】的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return del(row.id)
      }).then(() => {
        this.pageList()
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      }).catch(() => {})
    },
    /** 取消按钮 */
    cancel() {
      this.open = false
      this.resetForm('form')
    },
    /** 表单重置 */
    reset() {
      this.form = {
        id: undefined
      }
      this.resetForm('form')
    },
    /** 获取菜单模板*/
    menuTemplateList() {
      menuTemplateList().then(response => {
        this.menuTemplateData = response.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
