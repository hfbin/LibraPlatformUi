// 性别(0-默认未知,1-男,2-女)
export const sex = {
  0: '未知',
  1: '男',
  2: '女'
}
// 证件类型(0-身份证,1-护照)
export const cardType = {
  0: '身份证',
  1: '护照'
}

// 登录状态(0-身份证,1-护照)
export const status = {
  0: '禁用',
  1: '启用'
}
// 在职状态(0-在职,1-离职)
export const positionStatus = {
  0: '在职',
  1: '离职'
}

// 表格字段columns
export const columns = [
  {
    label: '工号',
    field: 'workNo',
    width: 130,
    fixed: true,
    showTips: true
  },
  {
    label: '姓名',
    field: 'name',
    width: 85,
    showTips: true
  },
  {
    label: '手机号',
    field: 'mobile',
    showTips: true,
    width: 200
  },
  {
    label: '部门',
    field: 'deptName',
    showTips: true,
    width: 200
  },
  {
    label: '岗位',
    field: 'positionName',
    showTips: true,
    width: 200
  },
  {
    label: '角色',
    field: 'roleNames',
    showTips: true,
    width: 200
  },
  {
    label: '职位状态',
    field: 'positionStatus',
    formatter: (val) => {
      return positionStatus[val]
    }
  },
  {
    label: '账号状态',
    field: 'status',
    formatter: (val) => {
      return status[val]
    }
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
    width: 250,
    fixed: 'right',
    align: 'center',
    headAlign: 'center'
  }
]
