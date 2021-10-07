<template>
  <div>
    <!-- ▼ 新增修改员工抽屉-->
    <el-drawer
      :title="optType === 'add' ? '新增员工' : '修改员工'"
      :visible.sync="drawerVisible"
      :wrapper-closable="false"
      :before-close="handleClose"
      wrapperClosable
      size="45%"
    >
      <div class="drawer__content">
        <el-form ref="empForm" :model="empForm" :rules="rules" size="small" :inline="true" label-position="top">
          <h4>账号信息</h4>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="empForm.name" />
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="empForm.mobile" maxlength="11" @input="mobileListener" />
          </el-form-item>
          <el-form-item label="登录账号" prop="username">
            <el-input v-model="empForm.username" :disabled="optType === 'update'" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="empForm.password" :disabled="optType === 'update'" type="password" />
          </el-form-item>
          <el-form-item label="角色" prop="roleListIds">
            <el-select v-model="empForm.roleListIds" multiple clearable filterable placeholder="请选择">
              <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id">
                <span style="float: left">{{ item.roleName }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="登录状态" prop="status">
            <el-select v-model="empForm.status" placeholder="请选择">
              <el-option v-for="( value, key) in constants.status" :key="key" :label="value" :value="key">
                <span style="float: left">{{ value }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <h4>组织关系</h4>
          <el-form-item label="部门" prop="deptId">
            <el-popover ref="deptPopover" placement="bottom-end" popper-class="part-job-popup-company" trigger="click">
              <el-tree ref="treeSelect" v-model="empForm.deptId" :data="deptTree" @node-click="empDeptNodeClickFun" />
              <el-input
                slot="reference"
                v-model="empForm.deptName"
                placeholder="请选择"
                @click.native="onClickEmpDeptFocus"
              >
                <i v-if="!showDeptTree" slot="suffix" class="el-icon-arrow-down" />
                <i v-if="showDeptTree" slot="suffix" class="el-icon-arrow-up" />
              </el-input>
            </el-popover>
          </el-form-item>
          <el-form-item label="岗位" prop="positionId">
            <el-select v-model="empForm.positionId" clearable filterable placeholder="请选择">
              <el-option v-for="item in positionList" :key="item.id" :label="item.name" :value="item.id">
                <span style="float: left">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="入职时间">
            <el-date-picker
              v-model="empForm.entryDate"
              type="date"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"
              style="width: 100%;"
            />
          </el-form-item>
          <el-form-item label="员工编号" prop="workNo">
            <el-input v-model="empForm.workNo" />
          </el-form-item>

          <h4>个人信息</h4>
          <el-form-item label="头像">
            <el-input v-model="empForm.avatar" />
          </el-form-item>
          <el-form-item label="职位状态" prop="positionStatus">
            <el-select v-model="empForm.positionStatus" placeholder="请选择">
              <el-option v-for="(value, key) in constants.positionStatus" :key="key" :label="value" :value="key">
                <span style="float: left">{{ value }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="empForm.sex" placeholder="请选择">
              <el-option v-for="(value, key) in constants.sex" :key="key" :label="value" :value="key">
                <span style="float: left">{{ value }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="生日">
            <el-date-picker
              v-model="empForm.birthday"
              type="date"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"
              style="width: 100%;"
            />
          </el-form-item>
          <el-form-item label="证件类型">
            <el-select v-model="empForm.cardType" placeholder="请选择">
              <el-option v-for="(key , value) in constants.cardType" :key="value" :label="key" :value="value">
                <span style="float: left">{{ key }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="证件号">
            <el-input v-model="empForm.cardNo" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="empForm.email" />
          </el-form-item>
          <el-form-item label="微信号">
            <el-input v-model="empForm.weChatNo" />
          </el-form-item>

        </el-form>
      </div>
      <div class="drawer__footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitEmp('empForm')">
          {{ submitLoading ? '提交中 ...' : '确 定' }}
        </el-button>
      </div>
    </el-drawer>
    <!-- ▲ 新增修改员工抽屉-->
  </div>
</template>
<script>
import * as constants from './js/constants'
import { saveEmp, updateEmp } from '@/api/personnel/emp'

export default {
  name: 'Emp',
  props: {
    drawerVisible: {
      type: Boolean,
      default: false
    },
    optType: {
      type: String,
      default: 'add'
    },
    positionList: {
      type: Array,
      default: null
    },
    roleList: {
      type: Array,
      default: null
    },
    deptTree: {
      type: Array,
      default: null
    },
    editEmp: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      constants,
      empForm: {
      },
      title: '新增员工',
      showDeptTree: false,
      // 加载中
      submitLoading: false,
      rules: {
        name: [
          { required: true, message: '名字不能为空', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        mobile: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        deptId: [
          { required: true, message: '部门不能为空', trigger: 'change' }
        ],
        roleListIds: [
          { required: true, message: '角色不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '登录状态不能为空', trigger: 'blur' }
        ],
        workNo: [
          { required: true, message: '员工工号不能为空', trigger: 'blur' }
        ],
        positionStatus: [
          { required: true, message: '职位状态不能为空', trigger: 'blur' }
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
    // eslint-disable-next-line no-unreachable
    var validatePassword = (rule, value, callback) => {
      if (this.optType === 'add' && value === '') {
        callback(new Error('请输入手机号'))
      } else {
        callback()
      }
    }
  },
  watch: {
    drawerVisible: function() {
      console.log('optType', this.editEmp, this.optType)
      if (this.optType === 'add') {
        this.reset()
      } else {
        this.empForm = this.editEmp
        this.empForm.status = this.editEmp.status + ''
        this.empForm.positionStatus = this.editEmp.positionStatus + ''
        this.empForm.sex = this.editEmp.sex === null ? this.editEmp.sex : this.editEmp.sex + ''
        this.empForm.cardType = this.editEmp.cardType === null ? this.editEmp.cardType : this.editEmp.cardType + ''
      }
    }
  },
  methods: {
    // 新增
    submitEmp(empForm) {
      const vm = this
      vm.submitLoading = true
      const roleList = []
      roleList.push(vm.empForm.roleId)
      vm.empForm.roleList = roleList

      vm.$refs[empForm].validate((valid) => {
        if (valid) {
          if (this.optType === 'add') {
            saveEmp(vm.empForm).then(response => {
              vm.$message({
                message: '新增成功',
                type: 'success'
              })
              vm.submitLoading = false
              vm.$emit('sucess')
            }).catch(() => {
              vm.submitLoading = false
            })
          } else {
            updateEmp(vm.empForm).then(response => {
              vm.$message({
                message: '修改成功',
                type: 'success'
              })
              this.submitLoading = false
              vm.$emit('sucess')
            }).catch(() => {
              vm.submitLoading = false
            })
          }
        } else {
          vm.submitLoading = false
          return false
        }
      })
      console.log('form', vm.empForm)
    },
    // drawer 关闭时间
    handleClose() {
      // 触发父组件
      this.$emit('close')
    },
    // 表单重置
    reset() {
      this.empForm = {
        status: '1',
        positionStatus: '0',
        sex: '0',
        cardType: '0',
        entryDate: this.dateFormat('YYYY-mm-dd HH:MM:SS', new Date())
      }
      this.resetForm('empForm')
    },
    // 新增员工选择部门点击
    empDeptNodeClickFun(data) {
      this.empForm.deptId = data.id
      this.empForm.deptName = data.label
      this.showDeptTree = false
      this.$refs.deptPopover.doClose()
    },
    onClickEmpDeptFocus() {
      this.showDeptTree = !this.showDeptTree
    },
    // 手机号输入框监听
    mobileListener() {

    }
  }
}
</script>
<style lang="scss" scoped>
.el-drawer__wrapper {
  .el-drawer__container {
    .el-drawer {
      height: 100%;
      overflow: auto;

      .el-drawer__body {
        .drawer__content {
          padding-left: 20px;

          h4 {
            font-weight: normal;
          }
        }
      }
    }
  }

  .el-form-item--small.el-form-item {
    width: 47%;
  }

  .el-select {
    width: 100%;
  }

  .drawer__footer {
    height: 50px;
    width: 100%;
    background: #fff;
    position: absolute;
    bottom: 0;
    text-align: right;
    padding-right: 48px;
  }
}

::v-deep .el-drawer {
  overflow: hidden;
}

::v-deep .el-drawer__body {
  height: calc(100vh - 200px);
  overflow-y: scroll;
  padding-bottom: 60px;
}
</style>
