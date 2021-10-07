// 公共参数定义
// 主表columns
export const columns = [
  {
    label: '名称',
    field: 'name'
  },
  {
    label: '版本',
    field: 'version'
  },
  {
    label: '描述',
    field: 'description'
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
