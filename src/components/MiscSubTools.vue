<template>
  <v-card elevation="1" class="pb-2">
    <v-card-header class="flex-column align-center">
      <v-card-title> {{ $t('miscSubTools.miscTools') }} </v-card-title>
    </v-card-header>
    <v-sheet class="d-flex flex-column align-center">
      <!-- set price -->
      <div class="toolContent d-flex flex-row justify-space-between align-center px-2">
        <v-text-field
          density="comfortable"
          :label="$t('miscSubTools.changePrice')"
          variant="outlined"
          style="color: white; min-width: 140px"
          v-model="price.inputVal.value"
          @keyup="price.keyUp"
          class="mr-2 mb-0"
          :class="{ 'text-secondary': price.isDifferent.value, 'text-white': !price.isDifferent.value }"
        />
        <v-btn
          variant="outlined"
          :disabled="!price.isDifferent.value"
          @click="price.click"
          color="secondary"
          class="py-5"
        >
          {{ $t('miscSubTools.set') }}
        </v-btn>
      </div>
      <!-- clean walls -->
      <h3 class="toolTitle">{{ $t('miscSubTools.cleanWalls') }}</h3>
      <div class="toolContent d-flex flex-row justify-flex-start align-center px-2" style="width: 100%">
        <input style="width: auto" type="checkbox" v-model="wallClean.checkBoxVal.value" />
        <div class="mx-2">{{ $t('miscSubTools.includeShuttles') }}</div>
        <v-spacer></v-spacer>
        <v-btn variant="outlined" @click="wallClean.click" color="secondary"> {{ $t('miscSubTools.clean') }} </v-btn>
      </div>
      <!-- compact submarine -->
      <h3 class="toolTitle">
        {{ $t('miscSubTools.compactSub') }}
        <v-btn class="ml-2" @click.stop="compact.dialog.value = true" size="x-small" icon :title="$t('miscSubTools.info')">
          <v-icon>mdi-help-circle-outline</v-icon>
        </v-btn>
        <v-dialog class="subCompactor" v-model="compact.dialog.value">
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ $t('miscSubTools.compactSubTool') }}</span>
              <v-spacer></v-spacer>
              <v-btn color="red" size="x-small" icon @click="compact.dialog.value = false">
                <v-icon>mdi-close-thick</v-icon>
              </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pl-8">
              {{ $t('miscSubTools.compactDescription') }}<br />
              <h5 class="text-h5">{{ $t('miscSubTools.compactShuttles') }}</h5>
              {{ $t('miscSubTools.compactShuttlesDesc') }}
              <h5 class="text-h5">{{ $t('miscSubTools.compactSub') }}</h5>
              {{ $t('miscSubTools.compactSubDesc') }}
            </v-card-text>
          </v-card>
        </v-dialog>
      </h3>
      <div class="toolContent d-flex flex-row align-center px-2" style="width: 100%; justify-content: space-evenly">
        <v-btn
          variant="outlined"
          :disabled="compact.linkedSubs.value.length === 0"
          @click="compact.clickShuttles"
          color="secondary"
          :title="compact.linkedSubs.value.length === 0 ? $t('miscSubTools.noShuttles') : $t('miscSubTools.compactAttachedShuttles')"
        >
          {{ $t('miscSubTools.shuttles') }}
        </v-btn>
        <v-btn
          variant="outlined"
          :disabled="compact.previewImage.value === ''"
          @click="compact.clickSub"
          color="secondary"
          :title="compact.previewImage.value === '' ? $t('miscSubTools.noPreviewImage') : $t('miscSubTools.compactMainSub')"
        >
          {{ $t('miscSubTools.sub') }}
        </v-btn>
      </div>
    </v-sheet>
  </v-card>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const price = priceSetup()
    const wallClean = wallCleanSetup()
    const compact = compactSetup()

    return { price, wallClean, compact }
  },
}
function priceSetup() {
  const store = useStore()

  const priceGetter = computed(() => store.getters.sub.attributes.price)

  const inputVal = ref(priceGetter.value)
  const isDifferent = computed(() => {
    return inputVal.value !== priceGetter.value
  })
  function click() {
    if (parseInt(inputVal.value) >= 0) {
      store.getters.sub.attributes.price = inputVal.value
      store.dispatch('showAlert', {
        type: 'success',
        text: this.$t('miscSubTools.setPrice', { value: inputVal.value }),
      })
    } else
      store.dispatch('showAlert', {
        type: 'info',
        text: this.$t('miscSubTools.mustBePositive'),
      })
  }
  function keyUp(ev) {
    if (ev.key === 'Enter') click()
  }

  watch(priceGetter, () => {
    inputVal.value = priceGetter.value
  })

  return { inputVal, isDifferent, click, keyUp }
}
function wallCleanSetup() {
  const store = useStore()

  const checkBoxVal = ref(true)

  function click() {
    let cleanedCount = 0
    for (let hull of store.getters.sub.elements.filter((el) => el.name === 'Hull')) {
      if (hull.attributes.backgroundsections && hull.attributes.backgroundsections !== '') {
        hull.attributes.backgroundsections = ''
        cleanedCount++
      }
    }
    // also clean linked submarines
    if (checkBoxVal.value) {
      for (let linkedSub of store.getters.sub.elements.filter((el) => el.name === 'LinkedSubmarine')) {
        for (let hull of linkedSub.elements.filter((el) => el.name === 'Hull')) {
          if (hull.attributes.backgroundsections && hull.attributes.backgroundsections !== '') {
            hull.attributes.backgroundsections = ''
            cleanedCount++
          }
        }
      }
    }
    if (cleanedCount > 0) {
      store.dispatch('showAlert', {
        type: 'success',
        text: this.$t('miscSubTools.cleanedWalls', { count: cleanedCount }),
      })
    } else
      store.dispatch('showAlert', {
        type: 'info',
        text: this.$t('miscSubTools.noStainedWalls'),
      })
  }

  return { checkBoxVal, click }
}
function compactSetup() {
  const store = useStore()

  const dialog = ref(false)
  const linkedSubs = computed(() => {
    return store.getters.sub.elements.filter((el) => el.name === 'LinkedSubmarine')
  })

  const previewImage = computed(() => {
    return store.state.editorSubmarine.data.elements[0].attributes?.previewimage || ''
  })

  function clickShuttles() {
    let count = 0
    for (let shuttle of linkedSubs.value) {
      console.dir(shuttle)
      if (shuttle?.attributes?.previewimage) {
        shuttle.attributes.previewimage =
          'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAE0lEQVR4nGNkYGD4D8QMTAxQAAAOKAEDRx/UrAAAAABJRU5ErkJggg=='
        count++
      }
    }
    if (count > 0) {
      store.dispatch('showAlert', {
        type: 'success',
        text: this.$t('miscSubTools.compactedShuttles', { count }),
      })
    } else
      store.dispatch('showAlert', {
        type: 'info',
        text: this.$t('miscSubTools.noShuttlesWithPreview'),
      })
  }
  function clickSub() {
    store.state.editorSubmarine.data.elements[0].attributes.previewimage =
      'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAE0lEQVR4nGNkYGD4D8QMTAxQAAAOKAEDRx/UrAAAAABJRU5ErkJggg=='
    store.dispatch('showAlert', {
      type: 'success',
      text: this.$t('miscSubTools.compactedMainSub'),
    })
  }

  return { dialog, clickSub, clickShuttles, linkedSubs, previewImage }
}
</script>

<style scoped>
input {
  border: 1px solid white;
  width: 100%;
}
.toolTitle {
  font-weight: normal;
  font-size: 1.1em;
  align-self: center;
  margin-left: 12px;
}
.toolContent:not(:last-child) {
  margin-bottom: 16px;
}
</style>

<style>
.v-dialog.subCompactor .v-overlay__content {
  max-width: 820px !important;
  max-height: 650px !important;
}
</style>
