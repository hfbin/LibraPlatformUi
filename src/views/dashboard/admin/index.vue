<template>
  <div class="app-container">
    <el-card class="box-card">
      <h2>Libra-Platform 微服务平台</h2>
      <span style="font-size: 14px;">
        🚜 Libra-Platform平台基于SpringCloud(2020.0.x) + SpringCloudAlibaba(2021.x) + SpringBoot(2.4.x) + Vue3开发，基于多租户SaaS模式的设计，拥有强大的用户中心，权限基于RBAC设计，支持租户灰度发布等功能。
        Libra-Platform平台架构清晰、代码简洁、注解齐全，很适合作为基础框架使用。
      </span>
      <div style="margin-top: 10px" />
      <el-button size="small" icon="el-icon-share" plain><a target="_blank" href="https://gitee.com/huangfubin/LibraPlatform">点我去 Gitee</a></el-button>
      <el-button size="small" icon="el-icon-share" plain><a target="_blank" href="https://github.com/hfbin/LibraPlatform">点我去 Github</a></el-button>
    </el-card>
    <el-row style="margin-top: 18px">
      <el-col style="width: 49%; margin-right: 1%">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>架构图</span>
          </div>
          <img style="width: 100%" src="@/assets/libra/libra-架构图.jpg">
        </el-card>
      </el-col>
      <el-col style="width: 50%">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>功能规划图</span>
          </div>
          <img style="width: 82%" src="@/assets/libra/Libra-Platform平台规划.png">
        </el-card>
      </el-col>
    </el-row>
    <el-row style="margin-top: 18px">
      <el-col style="">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>版本更新日志</span>
          </div>
          <el-collapse accordion>
            <el-collapse-item>
              <template slot="title">
                V1.1 2021-09-01<i class="header-icon el-icon-info" />
              </template>
              <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
              <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
            </el-collapse-item>
            <el-collapse-item title="V1.0 2021-08-01">
              <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
              <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DashboardAdmin',
  data() {
    return {
      emptyGif: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  }
}
</script>

<style lang="scss" scoped>
.emptyGif {
  display: block;
  width: 45%;
  margin: 0 auto;
}
.el-collapse {
  border-top: none;
}
.dashboard-editor-container {
  background-color: #e3e3e3;
  min-height: 100vh;
  padding: 50px 60px 0px;

  .pan-info-roles {
    font-size: 12px;
    font-weight: 700;
    color: #333;
    display: block;
  }

  .info-container {
    position: relative;
    margin-left: 190px;
    height: 150px;
    line-height: 200px;

    .display_name {
      font-size: 48px;
      line-height: 48px;
      color: #212121;
      position: absolute;
      top: 25px;
    }
  }
}
</style>
