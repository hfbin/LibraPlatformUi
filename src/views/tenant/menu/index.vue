<template>
  <div class="app-container">
    <!-- ▼ 搜索条件板块-->
    <el-form v-show="showSearch" ref="listQuery" :model="listQuery" :inline="true" class="table-search">
      <el-form-item label="模板名称" prop="templateName">
        <el-input
          v-model="listQuery.templateName"
          placeholder="请输入模板名称"
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
            icon="el-icon-edit"
            @click="handleUpdate(slotData.row)"
          >修改</el-button>
          <el-button
            v-if="slotData.row.id"
            size="mini"
            type="text"
            icon="el-icon-refresh"
            @click="syncMenuPermission(slotData.row)"
          >权限同步</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(slotData.row)"
          >删除</el-button>
        </div>
      </template>
    </libra-table>
    <!-- ▲ 表格数据-->

    <!-- ▼ 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="模版名称" prop="templateName">
              <el-input v-model="form.templateName" placeholder="模版名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="描述" prop="description">
              <el-input v-model="form.description" placeholder="请输入描述" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单权限" prop="description">
              <div class="tree-search">
                <el-input v-model="filterTreeName" icon="el-icon-search" placeholder="搜索">
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
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- ▲ 添加或修改菜单对话框-->

  </div>
</template>

<script>
import * as constants from './js/constants'
import { pageList, get, update, del, add, syncTenantMenuPermission } from '@/api/tenant/menu'
import { menuTreeIgnoreTr } from '@/api/system/menu'
export default {
  name: 'Position',
  data() {
    return {
      // 表头数据
      constants,
      // 菜单树结构
      treeData: [],
      // 过滤菜单字段
      filterTreeName: '',
      // 总条数
      total: 0,
      // 显示搜索条件
      showSearch: true,
      // 查询列表参数
      listQuery: {
        templateName: undefined,
        keyword: undefined,
        pageNo: 1,
        pageSize: 10
      },
      // 部门树结构字段映射
      defaultProps: {
        children: 'child',
        label: 'name'
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
      form: {
        id: undefined,
        templateName: '',
        description: '',
        menuListIds: []
      },
      title: '添加菜单模板',
      // 表单校验
      rules: {
        templateName: [
          { required: true, message: '菜单模板名称不能为空', trigger: 'blur' }
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
    this.pageList()
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
      this.menuList()
      this.title = '新增菜单模板'
      this.open = true
      this.reset()
      // 清空之前选中
      this.$nextTick(() => {
        this.$refs.treeRef.setCheckedKeys([])
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.menuList()
      this.resetForm('form')
      this.open = true
      this.title = '修改菜单模板'
      get(row.id).then(response => {
        this.form = response.data
        this.$nextTick(() => {
          // 使用此方法会导致如果父级选中了则默认子集会被选中
          // this.$refs.treeRef.setCheckedKeys(this.form.menuListIds)

          // 避免父级选中了则默认子集会被选中
          this.form.menuListIds.forEach(value => {
            this.$refs.treeRef.setChecked(value, true, false)
          })
        })
      })
    },
    /** 同步权限 */
    syncMenuPermission(row) {
      syncTenantMenuPermission(row.id).then(response => {
        const count = response.data
        this.$message({
          message: '同步成功，已同步【' + count + '】个租户权限',
          type: 'success'
        })
      })
    },
    /** 提交按钮 */
    submitForm() {
      const menuIds = this.$refs.treeRef.getCheckedNodes()
      if (menuIds.length > 0) {
        // 去除某个属性值
        this.form.menuListIds = menuIds.map((item) => { return item.id })
      }
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
          // 清空之前选中
          this.$nextTick(() => {
            this.$refs.treeRef.setCheckedKeys([])
          })
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除名称为【' + row.templateName + '】的数据项?', '警告', {
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
    // 重置过滤部门树结构条件
    resetSearchFilter() {
      this.filterTreeName = ''
    },
    // 过滤树不存在关键词的节点
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 查询部门树
    menuList() {
      menuTreeIgnoreTr().then(response => {
        this.treeData = response.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
