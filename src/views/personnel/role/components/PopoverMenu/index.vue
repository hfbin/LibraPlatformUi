<template>
  <el-popover
    v-model="show"
    placement="right-start"
    :width="width"
    :visible-arrow="false"
  >
    <ul class="popover-menu">
      <li
        v-for="item in data"
        :key="item.value"
        @click="handleMenuClick(item)"
      >{{ item.text }}
      </li>
    </ul>
    <i
      slot="reference"
      style="margin-left: 5px"
      class="el-icon-setting"
      @click.stop="handleClick"
    />
  </el-popover>
</template>
<script>
export default {
  props: {
    event: {
      type: Object,
      default: null
    },
    width: {
      type: Number,
      default() {
        return 80
      }
    },
    data: {
      type: Array,
      default: null
    },
    node: {
      type: Object,
      default() {
        return {}
      }
    },
    text: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      show: false
    }
  },
  watch: {
    node: {
      handler(d) {
        this.disabled = d.data.disabled
      }
    }
  },
  mounted() {
    this.event.$on('showMenu', () => {
      this.hideDialog()
    })
  },
  methods: {
    hideDialog() {
      this.show = false
    },
    handleClick() {
      this.event.$emit('showMenu')
    },
    handleMenuClick(item) {
      this.$emit('menuClick', { node: this.node, edit: item })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-popover {
  padding: 0;
  min-width: 88px;

  .popover-menu {
    margin: 0;
    padding: 0;
    outline: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    /*align-items: space-between;*/
    li {
      list-style-type: none;
      height: 30px;
      line-height: 30px;
      padding: 0 10px;
      cursor: pointer;

      &:hover {
        background: rgb(236, 236, 236);
      }

      &:nth-child(2n) {
        border-bottom: 1px solid #ccc;
        padding-bottom: 4px;
      }

      &:nth-child(2n + 1) {
        margin-top: 4px;
      }

      &:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>
