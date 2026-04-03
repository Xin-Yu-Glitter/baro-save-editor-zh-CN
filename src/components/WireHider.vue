<template>
  <v-card elevation="1" class="pb-2">
    <v-card-header class="flex-column align-center">
      <v-card-title> {{ $t('wireHider.wireHider') }} </v-card-title>
    </v-card-header>
    <v-sheet class="mb-2 px-4 d-flex flex-row justify-center">
      <select v-model="selectedWireType" class="px-2">
        <option value="all">{{ $t('wireHider.all') }}</option>
        <option value="whitewire">{{ $t('wireHider.white') }}</option>
        <option value="redwire">{{ $t('wireHider.red') }}</option>
        <option value="bluewire">{{ $t('wireHider.blue') }}</option>
        <option value="yellowwire">{{ $t('wireHider.yellow') }}</option>
        <option value="greenwire">{{ $t('wireHider.green') }}</option>
        <option value="blackwire">{{ $t('wireHider.black') }}</option>
        <option value="brownall">{{ $t('wireHider.brown') }}</option>
      </select>
      <v-btn @click="hideWires" variant="outlined" color="secondary" class="mx-2">{{ $t('wireHider.hide') }}</v-btn>
      <v-btn @click="unhideWires" variant="outlined" color="secondary">{{ $t('wireHider.unhide') }}</v-btn>
    </v-sheet>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      selectedWireType: 'all',
    }
  },
  methods: {
    hideWires(setToBool = true) {
      var setTo = setToBool ? 'True' : 'False'
      var count = 0
      for (let wire of this.$store.getters.sub.elements.filter((el) => this.matchWireType(el.attributes.identifier))) {
        if (wire.attributes.hiddeningame != setTo) {
          wire.attributes.hiddeningame = setTo
          count++
        }
      }
      if (count > 0)
        this.$store.dispatch('showAlert', {
          type: 'success',
          text: this.$t('wireHider.setWiresTo', {
            count,
            hidden: setToBool ? this.$t('wireHider.hidden') : this.$t('wireHider.visible'),
          }),
        })
      else
        this.$store.dispatch('showAlert', {
          type: 'info',
          text: this.$t('wireHider.allWiresAlready', {
            type: setToBool ? this.$t('wireHider.hidden') : this.$t('wireHider.visible'),
          }),
        })
    },
    unhideWires() {
      this.hideWires(false)
    },
    matchWireType(identifier) {
      if (this.selectedWireType === 'all') return /^.*wire$/.test(identifier)
      return identifier === this.selectedWireType
    },
  },
}
</script>

<style scoped>
select {
  border: 1px solid white;
  color: white;
  cursor: pointer;
}
option {
  background: #212121;
}
</style>
