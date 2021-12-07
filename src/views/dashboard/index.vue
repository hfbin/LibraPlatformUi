<template>
  <div class="app-container">
    <el-row>
      <el-col style="width: 49%; margin-right: 1%">
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
      </el-col>
      <el-col style="width: 50%">
        <el-card class="box-card">
          <h2>Libra-Platform相关依赖工具入口</h2>
          <el-button size="small" icon="el-icon-share" plain><a target="_blank" href="http://180.163.77.39:3000/">点我去 Grafana[libra/libra]</a></el-button>
          <el-button size="small" icon="el-icon-share" plain><a target="_blank" href="http://180.163.77.39:9090/">点我去 Prometheus</a></el-button>
          <el-button size="small" icon="el-icon-share" plain><a target="_blank" href="http://180.163.77.39:5601/">点我去 ELK</a></el-button>
          <p style="margin-top: 30px"/>
          <el-button size="small" icon="el-icon-share" plain><a target="_blank" href="http://180.163.77.39:8099/">点我去 Skywalking</a></el-button>
          <el-button size="small" icon="el-icon-share" plain><a target="_blank" href="http://180.163.81.139:8088/">点我去 Sentinel</a></el-button>
          <el-button size="small" icon="el-icon-share" plain><a target="_blank" href="http://180.163.81.139:8848/nacos/">点我去 Nacos</a></el-button>
        </el-card>
      </el-col>
    </el-row>
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
                V1.1 计划版本[待发布]<i class="header-icon el-icon-info" />
              </template>
              <div>数据权限完善</div>
              <div>接口参数校验完善</div>
              <div>xxl-job定时任务接入</div>
            </el-collapse-item>
            <el-collapse-item title="V1.0 2021-10-01">
              <div>多租户</div>
              <div>多身份用户中心</div>
              <div>RBAC权限设计</div>
              <div>接口权限处理</div>
              <div>统一异常拦截处理</div>
              <div>统一日志拦截处理</div>
              <div>Nacos配置中心相关配置抽取</div>
              <div>Sentinel限流、熔断等相关处理</div>
              <div>Redis相关操作工具封装</div>
              <div>已接入的监控Nacos监控、服务器监控、服务监控</div>
              <div>ELK日志收集搭建</div>
              <div>Skywalking链路追踪接入</div>
              <div>支撑网关、服务全链路蓝绿灰度发布</div>
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
  name: 'DashboardEditor',
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
