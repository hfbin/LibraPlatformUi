// 公共参数定义
// 状态(0-禁用,1-启用)
export const status = {
  0: '禁用',
  1: '启用'
}
// 主表columns
export const columns = [
  {
    label: '应用名称',
    field: 'name'
  },
  {
    label: '应用编码',
    field: 'clientCode'
  },
  {
    label: '授权方式',
    field: 'authGrantTypes'
  },
  {
    label: '状态',
    field: 'status',
    formatter: (val) => {
      return status[val]
    }
  },
  {
    label: '修改时间',
    field: 'updateTime'
  },
  {
    label: '操作',
    columnType: 'slot',
    slotName: 'operation',
    width: 260,
    fixed: 'right',
    align: 'center',
    headAlign: 'center'
  }
]
