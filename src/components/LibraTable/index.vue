<template>
  <div class="libra-table">
    <el-table
      ref="dataTable"
      v-loading="loading"
      :data="tableData"
      :border="border"
      :max-height="height"
      style="width: 100%"
      highlight-current-row
      fit
      :span-method="spanMethod"
      :row-key="getRowKeys"
      :header-cell-style="{background:'#f7f8fa',color:'#323233'}"
      @sort-change="sortChange"
      @selection-change="selectionChange"
      @select-all="selectAll"
    >
      <!-- ▼ 多选 -->
      <el-table-column
        v-if="selection"
        type="selection"
        width="55"
        :fixed="selectionFixed"
        :align="align"
        :reserve-selection="reserveSelection"
        :selectable="selectableDisabled"
      />
      <!-- ▲ 多选 -->
      <el-table-column v-if="sequence" label="序号" type="index" width="55" fixed :align="align" :index="indexMethods" />
      <!-- ▼ 数据渲染 -->
      <template v-for="item in tableHead">
        <!-- ▼ 图片 -->
        <el-table-column
          v-if="item.columnType === 'img'"
          :key="item.field"
          :prop="item.field"
          :label="item.label"
          :width="item.width"
          :align="item.align || align"
          :fixed="item.fixed"
        >
          <template slot-scope="scope">
            <el-image :style="item.imgStyle || defaultImgStyle" :src="scope.row[item.field]" />
          </template>
        </el-table-column>
        <!-- ▲ 图片 -->
        <!-- ▼ 插槽 slot-->
        <el-table-column
          v-else-if="item.columnType === 'slot'"
          :key="item.field"
          :prop="item.field"
          :label="item.label"
          :width="item.width"
          :align="item.align || align"
          :header-align="item.headAlign || align"
          :fixed="item.fixed"
        >
          <template slot-scope="scope">
            <slot :name="item.slotName" :row="scope.row" :idx="scope.$index" />
          </template>
        </el-table-column>
        <!-- ▲ 插槽 slot-->

        <!-- ▼ 常规列渲染 -->
        <el-table-column
          v-else
          :key="item.field"
          :label="item.label"
          :width="item.width"
          :align="item.align || align"
          :fixed="item.fixed"
          :prop="item.field"
          :show-overflow-tooltip="item.showTips"
          :sort-by="item.sortBy"
          :sortable="item.sortable"
        >
          <template slot-scope="scope">
            <span v-if="item.formatter">
              {{ item.formatter(scope.row[item.field], scope.row, scope.column) }}
            </span>
            <span v-else>{{ scope.row[item.field] }}</span>
          </template>
        </el-table-column>
        <!-- ▲ 常规列渲染 -->
      </template>
      <!-- ▲ 数据渲染 -->
    </el-table>
    <!-- ▼ 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-if="pagination"
        :current-page="listQuery.pageNo"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="listQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <slot name="pagination" />
    </div>
    <!-- ▲ 分页 -->
  </div>
</template>

<script>
// import Column from './column'
export default {
  name: 'LibraTable',
  // components: { Column },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    // 表头信息配置
    tableConfig: {
      type: Array,
      default: () => []
    },
    // 表格数据
    tableList: {
      type: Array,
      default: () => []
    },
    align: {
      type: String,
      default: 'center'
    },
    // 开启多选
    selection: {
      type: Boolean,
      default: false
    },
    // 多选列固定
    selectionFixed: {
      type: [Boolean, String],
      default: true
    },
    // 勾选保存
    reserveSelection: {
      type: Boolean,
      default: false
    },
    // 禁用多选项
    selectableDisabled: {
      type: Function,
      default: () => {
        return true
      }
    },
    spanMethod: {
      type: Function,
      required: false,
      default: () => {}
    },
    // 显示序号
    sequence: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: true
    },
    // eslint-disable-next-line vue/require-default-prop
    height: {
      type: Number,
      required: false
    },
    listQuery: {
      type: Object,
      default: () => {}
    },
    // eslint-disable-next-line vue/require-prop-types
    total: {
      default: 0
    },
    pagination: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 图片列 默认宽高
      defaultImgStyle: {
        width: '60px',
        height: '60px'
      }
    }
  },
  computed: {
    tableData() {
      return this.tableList
    },
    tableHead() {
      return this.tableConfig
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    indexMethods(index) {
      return this.listQuery.pageSize * this.listQuery.pageNo + index
    },
    getRowKeys(row) {
      return row.id
    },
    sortChange(column, prop, order) {
      this.$emit('sort-change', column, prop, order)
    },
    selectionChange(val) {
      this.$emit('selection-change', val)
    },
    selectAll(val) {
      this.$emit('select-all', val)
    },
    handleSizeChange(val) {
      this.$emit('handleSizeChange', val)
    },
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange', val)
    }
  }
}
</script>
<style lang="scss">
  .libra-table {
    .pagination-container {
      height: 48px;
      background-color: #ffffff;
      .el-pagination{
        float: right;
      }
    }
  }
  .app-container {
    .table-search {
      background-color: #f7f8fa;
      padding: 16px;
      margin-bottom: 16px;
      border: none;
      .el-form-item{
        margin-bottom:0;
        label{
          color: #323233 !important;
        }
      }
    }
  }
</style>
