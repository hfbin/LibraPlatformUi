
// 主表columns
export const columns = [
  {
    label: '表名',
    field: 'tableName',
    showTips: true
  },
  {
    label: '表描述',
    field: 'tableComment',
    showTips: true
  },
  {
    label: '引擎',
    field: 'ENGINE',
    showTips: true
  },
  {
    label: '字符集',
    field: 'tableCollation',
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
