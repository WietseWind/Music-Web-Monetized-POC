<template>
  <div id="player" class="col-12 col-lg-8 col-xl-6" style="margin: 0 auto 0 auto;">
    <div v-if="readyState">
      <div id="buttons" v-if="readyState">
        <div class="text-center mb-4">
          <button @click="skipBackward" class="btn btn-outline-secondary">
            <i class="fas fa-backward"></i>
          </button>
          <button v-if="paying" @click="pause" class="btn btn-lg btn-outline-danger mx-3">
            <i class="fas fa-pause"></i>
          </button>
          <button v-if="!paying" @click="play" class="btn btn-lg btn-success mx-3">
            <i class="fas fa-play"></i>
          </button>
          <button @click="skipForward" class="btn btn-outline-secondary">
            <i class="fas fa-forward"></i>
          </button>
        </div>
      </div>

      <aplayer
        v-if="readyState" ref="aplayer"
        :audio="audio" :lrcType="0" :mini="false"
        :autoplay="true"
        :theme="theme" :loop="'all'" :preload="'auto'"
        :volume="0.8" :listFolded="false" :listMaxHeight="500"
        @play="handle"
        @playing="handle"
        @progress="handle"
        @pause="handle"
        @waiting="handle"
        @timeupdate="handle"
        @suspend="handle"
        @stalled="handle"
      />

      <small class="text-muted text-center d-block mt-2">Songs from <a href="https://www.jamendo.com">jamendo.com</a></small>
    </div>
  </div>
</template>

<script>
import { getPaletteFromURL } from 'color-thief-node'
import * as id3 from 'id3js'

export default {
  name: 'Player',
  props: {
    onReady: Function,
    onMonetize: Function,
    readyState: Boolean
  },
  components: {
  },
  methods: {
    monetize () {
      this.onMonetize(this.paying ? this.pointer : null)
    },
    handle () {
      if (arguments[0].type === 'play') {
        this.paying = true
        this.pointer = this.$refs.aplayer.currentMusic.payments
      } else if (arguments[0].type === 'pause') {
        this.paying = false
      } else {
        // console.log(arguments[0].type, arguments[0])
      }
    },
    play () {
      this.$refs.aplayer.play()
    },
    pause () {
      this.$refs.aplayer.pause()
    },
    skipForward () {
      this.$refs.aplayer.skipForward()
    },
    skipBackward () {
      this.$refs.aplayer.skipBackward()
    }
  },
  watch: {
    paying () {
      this.monetize()
    },
    pointer () {
      this.monetize()
    }
  },
  computed: {
  },
  async created () {
    const songs = [
      require('../assets/1.mp3'),
      require('../assets/2.mp3'),
      require('../assets/3.mp3'),
      require('../assets/4.mp3'),
      require('../assets/5.mp3'),
      require('../assets/6.mp3')
    ]

    Promise.all(songs.reduce((all, current) => {
      all.push(new Promise(async (resolve, reject) => {
        const tags = await id3.fromUrl(current)
        const coverBlob = new Blob([tags.images[0].data], { type: tags.images[0].mime })
        const coverUrl = window.URL.createObjectURL(coverBlob)
        const color = await getPaletteFromURL(coverUrl)
        resolve({
          name: tags.title,
          artist: tags.artist,
          url: current,
          cover: coverUrl,
          theme: `rgb(${color[4].join(',')})`,
          payments: tags.comments
        })
        // console.log(tags.album)
        // console.log(tags.artist)
        // console.log(tags.title)
        // console.log(tags.band)
        // console.log(tags.genre)
        // console.log(tags.comments)
        // console.log(tags.images[0].data)
      }))
      return all
    }, [])).then(ready => {
      this.theme = ready[0].theme
      this.audio = ready
      this.onReady()
    })
  },
  data () {
    return {
      paying: false,
      pointer: '',
      theme: undefined,
      audio: undefined
    }
  }
}
</script>

<style scoped lang="scss">
</style>
