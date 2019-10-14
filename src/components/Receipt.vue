<template>
  <div v-if="Object.keys(monetizationLog).length > 0" id="receipt" class="mt-5">
    <h4 class="text-center">Receipt</h4>
    <div class="alert alert-warning text-center">
      The payment pointers are stored in the <a href="https://en.wikipedia.org/wiki/ID3" target="_blank"><code>comment</code> field in the ID3 tags</a> 🎉
    </div>
    <ul class="list-group">
      <li v-for="(value, pointer) in monetizationLog" v-bind:key="pointer" class="list-group-item py-1 px-2" :class="{ active: pointer === active }">
        <div class="float-right">
          <button v-for="(amount, currency) in value" class="btn btn-light py-0 px-1" :class="{ 'text-dark': pointer === active, 'text-secondary': pointer !== active }" v-bind:key="currency">
            {{ currency }}
            <span class="badge" :class="{ 'badge-primary': pointer === active, 'badge-light text-secondary': pointer !== active }">
              <b>{{ amount.toFixed(5) }}</b>
            </span>
          </button>
        </div>
        <div class="h6 py-0 pt-1 my-0">
          <a :href="'https://twitter.com/' + pointer.split('/')[1]" target="_blank" class="d-inline" :class="{ 'text-white': pointer === active }">
            <i class="fab fa-twitter"></i> &nbsp;
            <span class="d-none d-md-inline-block">{{ pointer }}</span>
            <span class="d-inline-block d-md-none">{{ pointer.split('/')[1] }}</span>
          </a>
          <small v-if="pointer.match(/WietseWind/)" class="d-none d-sm-inline"> (when paused)</small>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Receipt',
  props: {
    monetizationLog: Object,
    render: Number,
    active: String
  },
  components: {
  },
  methods: {
  },
  watch: {
    render () {
      this.$forceUpdate()
    }
  },
  computed: {
  },
  created () {
  },
  data () {
    return {
    }
  }
}
</script>

<style scoped lang="scss">
</style>
