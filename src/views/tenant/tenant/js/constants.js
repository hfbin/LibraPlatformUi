// 启用标识(1-正常,0-禁用)
export const enabled = {
  0: '禁用',
  1: '启用'
}

// 等级(10-试用版;20-基础版;30-VIP版;40-尊贵版)
export const level = {
  10: '试用版',
  20: '基础版',
  30: 'VIP版',
  40: '尊贵版'
}
// 主表columns
export const columns = [
  {
    label: '租户名称',
    field: 'tenantName',
    showTips: true
  },
  {
    label: '租户编码',
    field: 'tenantCode',
    showTips: true
  },
  {
    label: '生效时间',
    field: 'beginDate',
    width: 200,
    showTips: true
  },
  {
    label: '终止时间',
    field: 'endDate',
    width: 200,
    showTips: true
  },
  {
    label: '等级',
    field: 'level',
    width: 90,
    formatter: (val) => {
      return level[val]
    }
  },
  {
    label: '菜单模板',
    field: 'templateName'
  },
  {
    label: '是否启用',
    field: 'status',
    width: 100,
    formatter: (val) => {
      return enabled[val]
    }
  },
  {
    label: '创建时间',
    field: 'createTime',
    width: 200
  },
  {
    label: '修改时间',
    field: 'updateTime',
    width: 200
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
