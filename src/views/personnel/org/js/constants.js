// 部门类型(10-集团,20-公司,30-部门
export const deptType = {
  10: '集团',
  20: '公司',
  30: '部门'
}
// 业务类型
export const bizType = {
  10: '集团',
  20: '公司',
  30: '部门'
}
// 启用标识(1-正常,0-禁用)
export const enabled = {
  0: '禁用',
  1: '启用'
}
// 表格字段columns
export const columns = [
  {
    label: '部门名称',
    field: 'deptName',
    width: 150,
    showTips: true,
    fixed: true
  },
  {
    label: '部门编码',
    field: 'deptCode',
    width: 200,
    showTips: true
  },
  {
    label: '上级部门',
    field: 'parentIds',
    width: 200,
    showTips: true
  },
  {
    label: '部门类型',
    field: 'deptType',
    formatter: (val) => {
      return deptType[val]
    }
  },
  {
    label: '描述',
    field: 'description',
    showTips: true
  },
  {
    label: '是否启用',
    field: 'enabled',
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
