<template>
  <div class="page">
    <div class="login-container">
      <div class="container-left">
        <div class="container-left-container">
          <h2 class="container-left-container-top">
            LibraPlatform 微服务平台
          </h2>
          <div class="container-left-container-mes">
            🚜 Libra-Platform平台基于SpringCloud(2020.0.x) + SpringCloudAlibaba(2021.x) + SpringBoot(2.4.x) + Vue3开发，基于多租户SaaS模式的设计，拥有强大的用户中心，权限基于RBAC设计，支持租户灰度发布等功能。
            Libra-Platform平台架构清晰、代码简洁、注解齐全，很适合作为基础框架使用。
          </div>
          <div class="container-left-container-mes" style="color: #ffcf6e">
            测试租户：AOLIN  账号：admin  密码：123456
          </div>
          <div class="container-left-container-mes-two" style="color: #ffcf6e">
            测试租户：TEST   账号：admin  密码：123456
          </div>
        </div>
      </div>
      <div class="container-right">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
          <div class="title-container">
            <h2 class="title" style="color: #40485b">LibraPlatform</h2>
          </div>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="账号登录" name="password">
              <el-form-item prop="tenantCode">
                <el-input
                  ref="tenantCode"
                  v-model="loginForm.tenantCode"
                  placeholder="请输入租户"
                  name="tenantCode"
                  type="text"
                  tabindex="1"
                  autocomplete="on"
                />
              </el-form-item>
              <el-form-item prop="username">
                <el-input
                  ref="username"
                  v-model="loginForm.username"
                  placeholder="请输入用户名"
                  name="username"
                  type="text"
                  tabindex="1"
                  autocomplete="on"
                />
              </el-form-item>
              <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
                <el-form-item prop="password">
                  <el-input
                    :key="passwordType"
                    ref="password"
                    v-model="loginForm.password"
                    :type="passwordType"
                    placeholder="请输入密码"
                    name="password"
                    tabindex="2"
                    autocomplete="on"
                    @blur="capsTooltip = false"
                    @keyup.enter.native="handleLogin"
                  />
                  <span class="show-pwd" @click="showPwd">
                    <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                  </span>
                </el-form-item>
              </el-tooltip>
              <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">立即登录</el-button>
            </el-tab-pane>
            <el-tab-pane label="手机登录" name="mobile">
              <el-form-item prop="tenantCode">
                <el-input
                  ref="tenantCode"
                  v-model="loginForm.tenantCode"
                  placeholder="请输入租户"
                  name="tenantCode"
                  type="text"
                  tabindex="1"
                  autocomplete="on"
                />
              </el-form-item>
              <el-form-item prop="username">
                <el-input
                  ref="username"
                  v-model="loginForm.username"
                  placeholder="请输入手机号"
                  name="username"
                  type="text"
                  tabindex="1"
                  autocomplete="on"
                />
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  ref="code"
                  v-model="loginForm.code"
                  placeholder="请输入验证码"
                  name="code"
                  tabindex="2"
                  autocomplete="on"
                  @keyup.enter.native="handleLogin"
                />
                <span v-show="verificationCodeShow" class="get-code" @click="getCode(59)">获取</span>
                <span v-show="!verificationCodeShow" class="count">{{ count }} 秒</span>
              </el-form-item>
              <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">立即登录</el-button>
            </el-tab-pane>
            <el-tab-pane label="更多登录" name="otherLogin" />
          </el-tabs>
        </el-form>
      </div>
    </div>
    <!--    <div class="footer">-->
    <!--      <span>租户申请</span>-->
    <!--      <span>使用条款</span>-->
    <!--    </div>-->
  </div>
</template>

<script>
import { setLocal, getLocal } from '@/utils/storage'
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456',
        tenantCode: null
      },
      loginRules: {
        tenantCode: [{ required: true, message: '租户不能为空', trigger: 'blur' }],
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      activeName: 'password',
      verificationCodeShow: true,
      count: null,
      timer: null
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // 获取缓存中的租户
    const tenantCode = getLocal('TenantCode')
    this.loginForm.tenantCode = (tenantCode === undefined || tenantCode === null) ? 'AOLIN' : tenantCode
    // 处理缓存中的倒计时
    const storageCount = getLocal('codeCount', this.count)
    if (storageCount !== null) {
      this.verificationCodeShow = false
      this.getCode(storageCount)
    } else {
      this.verificationCodeShow = true
    }
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      setLocal('TenantCode', this.loginForm.tenantCode)
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    // 登录方式切换
    handleClick(tab, event) {
      this.loginForm.grantType = tab.name
    },
    // 获取验证码及倒计时处理
    getCode(time) {
      const TIME_COUNT = time === null ? 60 : time
      if (!this.timer) {
        this.count = TIME_COUNT
        this.verificationCodeShow = false
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--
            setLocal('codeCount', this.count)
          } else {
            this.verificationCodeShow = true
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#fff;
$light_gray:#fff;
$cursor: #4c4c4c;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border-bottom: 1px solid #eee;
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.page {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  .login-container {
    height: 480px;
    width: 890px;
    background-color: #fff;
    display: flex;
    box-shadow: 0 0 70px #d8d8d8;
    .container-left {
      background: linear-gradient(
          0deg
        , #3a485a 0%, #607089 100%);
      height: 480px;
      width: 486px;
      background-size: 100% 100%;
      .container-left-container{
        padding: 80px 60px;
        background: url('~@/assets/login-button.png') no-repeat right bottom, url('~@/assets/login-left-top.png') no-repeat 0 0;
        height: 100%;
        width: 100%;
        .container-left-container-top{
          color: #ffffff;
        }
        .container-left-container-mes{
          color: #fff6e6;
          font-size: 14px;
          line-height: 1.71429;
          margin-top: 40px;
        }
        .container-left-container-mes-two{
          color: #fff6e6;
          font-size: 14px;
          line-height: 1.71429;
          margin-top: 10px;
        }
      }
    }

    .container-right {
      height: 100%;
      width: 404px;
      padding: 20px;
      .login-form{
        width: 248px;
        margin: 0 auto;
        .get-code {
          cursor: pointer;
        }
      }
    }

    ::v-deep .el-tabs__item {
      color: #919591;
    }
    ::v-deep .el-tabs__item.is-active {
      color: #181c25;
    }
  }
  .footer{
    height: 80px;
    margin-top: 40px;
    color: #8c92a4;
    cursor: pointer;
    span{
      margin-right: 15px;
    }
  }
}

</style>
