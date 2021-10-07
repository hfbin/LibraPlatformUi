// 主表columns
export const columns = [
  {
    label: '模版名称',
    field: 'templateName',
    showTips: true
  },
  {
    label: '描述',
    field: 'description',
    showTips: true
  },
  {
    label: '创建时间',
    field: 'createTime',
    width: 250
  },
  {
    label: '修改时间',
    field: 'updateTime',
    width: 250
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
