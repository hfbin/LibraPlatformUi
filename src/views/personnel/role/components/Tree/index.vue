<template>
  <ul>
    <treenode
      v-for="(model , index) in treeData"
      :key="index"
      :model="model"
      :without-parents="withoutParents"
      :ids="ids"
      :disabled="disabled"
      :options="treeOptions"
    />
  </ul>
</template>
<script>
import tree from './item.vue'
export default {
  name: 'Tree',
  components: {
    'treenode': tree
  },
  model: {
    prop: 'ids',
    event: 'change'
  },
  props: {
    treeData: {
      type: Array,
      default: function() {
        return []
      }
    },
    ids: {
      type: Array,
      default: function() {
        return []
      }
    },
    withoutParents: {
      type: Array,
      default: function() {
        return []
      }
    },
    options: {
      type: Object,
      default: function() {
        return {}
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      defaultOptions: {
        withParents: true
      },
      treeOptions: {}
    }
  },
  watch: {
  },
  created() {
    this.initOptions()
  },
  mounted() {
  },
  methods: {
    // 初始化默认选项
    initOptions() {
      this.treeOptions = Object.assign({}, this.defaultOptions, this.options)
    }
  }
}
</script>
<style lang="scss" scoped="scoped">
.tree{
}
</style>
