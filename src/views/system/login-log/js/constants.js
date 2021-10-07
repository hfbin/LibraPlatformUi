// 公共参数定义
// 主表columns
export const columns = [
  {
    label: '用户名',
    field: 'username'
  },
  {
    label: 'IP',
    field: 'ip'
  },
  {
    label: '地区',
    field: 'location'
  },
  {
    label: '客户端',
    field: 'clientCode'
  },
  {
    label: '请求地址',
    field: 'reqUrl'
  },
  {
    label: '浏览器信息',
    field: 'userAgent'
  },
  {
    label: '操作请求参数',
    field: 'reqParam'
  },
  {
    label: '操作响应结果',
    field: 'resInfo'
  },
  {
    label: '描述',
    field: 'description'
  },
  {
    label: '租户编码',
    field: 'tenantCode'
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
