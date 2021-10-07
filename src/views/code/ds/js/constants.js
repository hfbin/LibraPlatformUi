
// 主表columns
export const columns = [
  {
    label: '动态名称',
    field: 'name',
    showTips: true,
    width: 100
  },
  {
    label: '用户名',
    field: 'username',
    showTips: true,
    width: 100
  },
  {
    label: '密码',
    field: 'password',
    showTips: true
  },
  {
    label: 'jdbcUrl',
    field: 'url',
    showTips: true
  },
  {
    label: '创建时间',
    field: 'createTime',
    width: 200
  },
  {
    label: '操作',
    columnType: 'slot',
    slotName: 'operation',
    width: 200,
    fixed: 'right',
    align: 'center',
    headAlign: 'center'
  }
]
