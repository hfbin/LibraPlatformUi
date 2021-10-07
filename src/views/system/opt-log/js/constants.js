// 公共参数定义
// 主表columns
// 在职状态(0-在职,1-离职)
export const optType = {
  1: '操作日志',
  2: '登录日志'
}

/**
 * NOT(0,"未知"),
 * ADD(10,"新增"),
 * UPDATE(20,"修改"),
 * SELECT(30,"查询"),
 * DELETE(40,"删除"),
 * LOGIN(100,"登录"),
 * LOGOUT(200,"登出"),
 */
export const optBehavior = {
  0: '未知',
  10: '新增',
  20: '修改',
  30: '查询',
  40: '删除',
  100: '登录',
  101: '登出'
}

// 在职状态(0-在职,1-离职)
export const resStatus = {
  1: '成功',
  2: '失败'
}

export const columns = [
  {
    label: '用户名',
    field: 'username',
    showTips: true,
    fixed: true,
    width: 100
  },
  {
    label: '客户端',
    field: 'clientCode',
    width: 120
  },
  {
    label: '日志类型',
    field: 'optType',
    showTips: true,
    width: 100,
    formatter: (val) => {
      return optType[val]
    }
  },
  {
    label: '行为类型',
    field: 'optBehavior',
    showTips: true,
    width: 100,
    formatter: (val) => {
      return optBehavior[val]
    }
  },
  {
    label: '请求地址',
    field: 'reqUrl',
    showTips: true,
    width: 200
  },
  {
    label: '描述',
    field: 'description',
    showTips: true,
    width: 200
  },
  {
    label: '响应状态',
    field: 'resStatus',
    showTips: true,
    width: 100,
    formatter: (val) => {
      return resStatus[val]
    }
  },
  {
    label: '浏览器信息',
    field: 'userAgent',
    showTips: true,
    width: 200
  },
  {
    label: '请求类型',
    field: 'httpMethod',
    showTips: true,
    width: 100
  },
  {
    label: '操作请求参数',
    field: 'reqParam',
    showTips: true,
    width: 200
  },
  {
    label: '操作响应结果',
    field: 'resInfo',
    showTips: true,
    width: 200
  },
  {
    label: '租户编码',
    field: 'tenantCode',
    showTips: true,
    width: 100
  },
  {
    label: 'IP地址',
    field: 'ip',
    showTips: true,
    width: 150
  },
  {
    label: 'IP解析地址',
    field: 'location',
    showTips: true,
    width: 150
  },
  {
    label: '记录时间',
    field: 'createTime',
    width: 200
  },
  {
    label: '操作',
    columnType: 'slot',
    slotName: 'operation',
    width: 100,
    fixed: 'right',
    align: 'center',
    headAlign: 'center'
  }
]
