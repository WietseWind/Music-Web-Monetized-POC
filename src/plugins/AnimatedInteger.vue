<template>
  <span>{{ tweeningValue }}</span>
</template>

<script>
import TWEEN from '@tweenjs/tween.js'

export default {
  name: 'AnimatedInteger',
  props: {
    value: {
      type: Number,
      required: true
    },
    precision: {
      type: Number,
      required: false,
      default: 0
    },
    speed: {
      type: Number,
      required: false,
      default: 500
    }
  },
  data () {
    return {
      tweeningValue: 0
    }
  },
  watch: {
    value (newValue, oldValue) {
      this.tween(oldValue, newValue)
    }
  },
  mounted () {
    this.tween(0, this.value)
  },
  methods: {
    tween (startValue, endValue) {
      const animate = () => {
        if (TWEEN.update()) {
          requestAnimationFrame(animate)
        }
      }
      new TWEEN.Tween({
        tweeningValue: startValue
      }).to({
        tweeningValue: endValue
      }, this.speed).onUpdate(e => {
        this.tweeningValue = e.tweeningValue.toFixed(this.precision)
      }).start()
      animate()
    }
  }
}
</script>
