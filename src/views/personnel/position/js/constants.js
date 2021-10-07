// 表格字段columns
export const columns = [
  {
    label: '岗位名称',
    field: 'name',
    showTips: true
  },
  {
    label: '岗位描述',
    field: 'description',
    showTips: true
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
