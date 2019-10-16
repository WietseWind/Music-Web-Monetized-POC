<template>
  <div class="container" id="app">
    <div v-if="!wmCapable || !wmStarted || !ready" class="card loading">
      <img src="./assets/wm-icon-animated.svg" />
      <div v-if="!wmCapable" class="card-body text-center">
        <h5 class="card-title">No Web Monetization</h5>
        <p class="card-text">Your browser is not Web Monetization enabled. Please use a supported browser and make sure you are logged in to Coil.</p>
        <a href="https://coil.com/learn-more/" target="_blank" class="btn mt-2 btn-block btn-primary">Visit Coil</a>
        <a href="https://help.coil.com/en/articles/2701494-supported-browsers" target="_blank" class="btn mt-2 btn-block btn-sm btn-outline-primary">Supported browsers</a>
      </div>
      <div v-if="wmCapable && !wmStarted" class="card-body text-center">
        <h5 class="card-title">Waiting for Web Monetization</h5>
        <p class="card-text">Waiting for payments. This should just take a few seconds. If payments don't come in, please check if you are <b>logged in</b> at Coil and have a <b>subscription</b>.</p>
        <a href="https://coil.com/login" target="_blank" class="btn mt-2 btn-block btn-primary">Login at Coil</a>
        <a href="https://coil.com/settings/payment" target="_blank" class="btn mt-2 btn-block btn-sm btn-outline-primary">Coil Subscription</a>
      </div>
      <div v-if="wmCapable && wmStarted && !ready" class="card-body text-center">
        <h5 class="card-title">Loading player...</h5>
        <p class="card-text">Loading songs, some fancy album cover images, etc.</p>
      </div>
    </div>

    <Player
      v-if="wmCapable"
      v-show="wmStarted && ready"
      :readyState="wmStarted && ready"
      :onReady="playerReady"
      :onMonetize="playerMonetization"
    />

    <Receipt :render="monetizationCount" :monetizationLog="receipts" :active="activePaymentPointer" />
  </div>
</template>

<script>
import Receipt from './components/Receipt'
import Player from './components/Player'

export default {
  name: 'app',
  components: {
    Player,
    Receipt
  },
  methods: {
    playerReady (data) {
      this.ready = true
    },
    playerMonetization (data) {
      this.paymentPointer.destination = ''
      if (typeof data === 'string' && data.slice(0, 1) === '$') {
        this.paymentPointer.destination = data
      }
      this.monetize()
    },
    handleMonetizationProgress (e) {
      this.wmStarted = true
      // Puma Browser doesn't confirm paymentPointer in event
      if (typeof e.detail.assetCode !== 'undefined' && typeof e.detail.paymentPointer === 'undefined') {
        Object.assign(e.detail, {
          paymentPointer: this.activePaymentPointer
        })
      }
      if (typeof this.receipts[e.detail.paymentPointer] === 'undefined') {
        this.receipts[e.detail.paymentPointer] = {}
      }
      if (typeof this.receipts[e.detail.paymentPointer][e.detail.assetCode] === 'undefined') {
        this.receipts[e.detail.paymentPointer][e.detail.assetCode] = 0
      }
      this.receipts[e.detail.paymentPointer][e.detail.assetCode] += parseInt(e.detail.amount) / Math.pow(10, e.detail.assetScale)
      this.monetizationCount++
    },
    monetize () {
      let metaTag = document.querySelector('meta[name="monetization"]')
      // if (!metaTag) {
      //   metaTag = document.createElement('meta')
      //   metaTag.setAttribute('name', 'monetization')
      //   document.getElementsByTagName('head')[0].appendChild(metaTag)
      // }

      metaTag.setAttribute('content', this.activePaymentPointer)
    }
  },
  watch: {
  },
  computed: {
    activePaymentPointer () {
      return this.paymentPointer.destination === ''
        ? this.paymentPointer.default
        : this.paymentPointer.destination
    }
  },
  created () {
    const installWebMonetization = () => {
      document.monetization.addEventListener('monetizationprogress', this.handleMonetizationProgress)
      this.monetize()
    }
    if (typeof document.monetization !== 'undefined') {
      installWebMonetization()
    } else {
      setTimeout(() => {
        // Still no monetization (So no Puma Browser Injection)
        if (typeof document.monetization === 'undefined') {
          this.wmCapable = false
        } else {
          installWebMonetization()
        }
      }, 750)
    }
  },
  data () {
    return {
      ready: false,
      wmCapable: true,
      wmStarted: false,
      paymentPointer: {
        default: '$twitter.xrptipbot.com/WietseWind',
        destination: ''
      },
      monetizationCount: 0,
      receipts: {}
    }
  }
}
</script>

<style lang="scss">
  html, body {
    background-color: #fcfcfc;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    padding-bottom: 20px;

    &.container {
      padding-top: 30px;

      .card {
        &.loading {
          margin: 0 auto 0 auto;
          max-width: 350px;
          >img {
            max-width: 100px;
            max-height: 100px;
            margin: 1em auto 1em auto;
          }
        }
      }
    }
  }

  #footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding-bottom: 3px;
  }
</style>
