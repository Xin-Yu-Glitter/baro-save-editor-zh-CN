<template>
  <v-container>
    <!-- row 1 - info -->
    <v-row>
      <v-col>
        <v-card>
          <v-card-text style="opacity: 1">
            <div class="text-white text-center text-h5">{{ $t('decompressor.title') }}</div>
            <div class="text-center d-flex flex-row justify-center align-center">
              {{ $t('decompressor.yourSaveLocation') }} <span class="text-primary ml-2">{{ saveLocation }}</span>
              <div>
                <v-icon @click="copyPath" color="secondary" class="iconButton ml-3"> mdi-clipboard-outline </v-icon>
                <v-tooltip anchor="bottom" activator="parent">{{ $t('decompressor.copyPath') }}</v-tooltip>
              </div>
            </div>
            <div class="text-center mt-2">
              <span class="text-orange">{{ $t('decompressor.warning') }}:</span> {{ $t('decompressor.warningText') }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!-- row 2 - dir selector -->
    <v-row>
      <v-col>
        <v-card>
          <v-card-header class="text-h4 justify-center">{{ $t('decompressor.selectWorkingDir') }}</v-card-header>
          <div class="d-flex justify-center align-center mb-4">
            <div
              class="mr-4 mb-0 text-white d-inline-flex text-h5 justify-center"
              style="
                min-width: 200px;
                border: 1px solid rgb(var(--v-theme-secondary));
                padding: 2px;
                border-radius: 5px;
              "
            >
              {{ workingDir.name || $t('decompressor.none') }}
            </div>
            <v-btn color="secondary" variant="outlined" type="icon" elevation="1" @click="selectWorkingDir">
              <v-icon size="large">mdi-folder-search-outline</v-icon>
              <v-tooltip anchor="bottom" activator="parent">{{ $t('decompressor.selectWorkingDir') }}</v-tooltip>
            </v-btn>
            <v-btn
              class="ml-2"
              v-if="workingDir.handle"
              color="secondary"
              variant="outlined"
              type="icon"
              elevation="1"
              @click="scanWorkingDir"
            >
              <v-icon size="large">mdi-folder-sync-outline</v-icon>
              <v-tooltip anchor="bottom" activator="parent">{{ $t('decompressor.refreshDir') }}</v-tooltip>
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <!-- row 3 - save list -->
    <v-row v-if="workingDir.handle">
      <v-col>
        <v-card>
          <v-card-header class="text-h5 justify-center">{{ $t('decompressor.detectedSaves') }}</v-card-header>
          <div class="d-flex flex-column justify-start align-center mb-4">
            <div
              v-for="save of this.savesList"
              :key="save.name"
              style="width: 400px"
              class="d-flex flex-row justify-center align-center my-1"
            >
              <div style="font-size: 1.1em">{{ save.name }}</div>
              <v-spacer />
              <v-btn
                :color="save.compressed ? 'secondary' : 'grey'"
                :disabled="!save.compressed"
                class="mx-1"
                type="icon"
                elevation="1"
                variant="outlined"
                @click="decompress(save)"
              >
                <v-icon size="large">mdi-package-variant</v-icon>
                <v-tooltip anchor="bottom" activator="parent">{{ $t('decompressor.decompress') }}</v-tooltip>
              </v-btn>
              <v-btn
                :color="save.decompressed ? 'secondary' : 'grey'"
                :disabled="!save.decompressed"
                class="mx-1"
                type="icon"
                elevation="1"
                variant="outlined"
                @click="compress(save)"
              >
                <v-icon size="large">mdi-package-variant-closed</v-icon>
                <v-tooltip anchor="bottom" activator="parent">{{ $t('decompressor.compress') }}</v-tooltip>
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <!-- row 4 - usage info -->
    <v-row>
      <v-col>
        <v-card class="d-flex align-center justify-center">
          <v-card-text style="opacity: 1">
            {{ $t('decompressor.howToUse') }}:
            <ol class="pl-4 mb-2">
              <li>{{ $t('decompressor.step1') }}</li>
              <li>{{ $t('decompressor.step2') }}</li>
              <li><v-icon color="secondary">mdi-package-variant</v-icon> {{ $t('decompressor.step3') }}</li>
              <li><v-icon color="secondary">mdi-package-variant-closed</v-icon> {{ $t('decompressor.step4') }}</li>
              <li>
                {{ $t('decompressor.step5') }} <v-icon color="secondary">mdi-folder-sync-outline</v-icon> {{ $t('decompressor.step5a') }}
                <v-icon color="secondary">mdi-folder-search-outline</v-icon> {{ $t('decompressor.step5b') }}.
              </li>
            </ol>
            {{ $t('decompressor.overwriteNote') }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import platform from 'platform-detect/os.mjs'
import { Buffer } from 'buffer'

import { DecompressSave, CompressSave } from '@/helpers/CompressionHelpers.js'

export default {
  data() {
    return {
      workingDir: {
        name: null,
        handle: null,
      },
      savesList: [],
    }
  },
  computed: {
    /**@type {String} */
    saveLocation() {
      if (platform.windows) return 'C:\\Users\\%username%\\AppData\\Local\\Daedalic Entertainment GmbH\\Barotrauma'
      if (platform.linux) return '/home/$USER/.local/share/Daedalic Entertainment GmbH/'
      if (platform.macos) return '/$USER/Library/Application Support/Daedalic Entertainment GmbH/'
      return '(unrecognized os)'
    },
  },
  methods: {
    /** Promps with File System API and runs scanWorkingDir */
    async selectWorkingDir() {
      try {
        var dirHandle = await window.showDirectoryPicker({
          id: 'DecompressorWorkingDir',
          startIn: 'desktop',
        })
      } catch (err) {
        // window.showDirectoryPicker is not a function
        if (err instanceof TypeError) {
          return this.$store.dispatch('showAlert', {
          type: 'error',
          text: this.$t('decompressor.fileSystemApiFail'),
        })
        }
        // user canceled file selector - do nothing
        if (err instanceof DOMException) {
          return
        }
        console.log(`directory picker failed:`)
        console.error(err)
      }
      // most likely user canceled file selector - do nothing
      if (!dirHandle) return

      this.workingDir.name = dirHandle.name
      this.workingDir.handle = dirHandle

      this.scanWorkingDir()

      this.$store.dispatch('showAlert', {
        type: 'success',
        text: this.$t('decompressor.openedWorkingDir', { name: dirHandle.name }),
      })
    },
    /** Scans working dir, detecting compressed and decompressed saves */
    async scanWorkingDir() {
      let tempList = []
      for await (const [name, handle] of this.workingDir.handle.entries()) {
        // files
        if (handle.kind === 'file') {
          if (name.endsWith('.save')) {
            let existing = tempList.find((el) => el.name == name.slice(0, -5))
            if (existing) {
              existing.compressed = handle
            } else tempList.push({ name: name.slice(0, -5), compressed: handle })
          }
        }
        // directory
        else {
          for await (const [subName, subHandle] of handle.entries()) {
            if (subHandle.kind === 'file' && subName == 'gamesession.xml') {
              let existing = tempList.find((el) => el.name == name)
              if (existing) {
                existing.decompressed = handle
              } else tempList.push({ name: name, decompressed: handle })
            }
          }
        }
      }
      this.savesList = tempList
    },
    /** Copies save path to clipboard */
    async copyPath() {
      await navigator.clipboard.writeText(this.saveLocation)
      this.$store.dispatch('showAlert', {
        type: 'success',
        text: this.$t('decompressor.copiedPath'),
      })
    },

    async decompress(save) {
      /** @type {FileSystemFileHandle} */
      let saveFile = save.compressed
      if (!saveFile) return console.error(`no saveFile - decompress button should not be reachable`)

      // check and/or request write permission for working dir
      /** @type {FileSystemDirectoryHandle} */
      let workingDir = this.workingDir.handle
      if (!workingDir) return console.error(`no workingDir - decompress button should not be reachable`)
      if ((await workingDir.queryPermission({ mode: 'readwrite' })) !== 'granted')
        if ((await workingDir.requestPermission({ mode: 'readwrite' })) !== 'granted')
          return this.$store.dispatch('showAlert', {
            type: 'error',
            text: this.$t('decompressor.permissionDenied'),
          })

      // read and decompress save file
      let fileContent = await saveFile.getFile()
      let buffer = Buffer.from(await fileContent.arrayBuffer())
      let saveData = DecompressSave(buffer)

      /** @type {FileSystemDirectoryHandle} */
      let saveDir = save.decompressed
      // create output dir if doesnt exist
      if (!saveDir) saveDir = await workingDir.getDirectoryHandle(save.name, { create: true })

      // clear output dir if exists
      for await (const [name, handle] of saveDir.entries()) {
        if (handle.kind === 'file') await saveDir.removeEntry(name)
      }

      // create files in saveDir
      for (let [file, content] of Object.entries(saveData)) {
        let handle = await saveDir.getFileHandle(file, { create: true })
        let writable = await handle.createWritable()
        let blob = new Blob([content])
        await writable.write(blob)
        await writable.close()
      }

      this.scanWorkingDir()

      this.$store.dispatch('showAlert', {
        type: 'success',
        text: this.$t('decompressor.decompressed', { name: saveFile.name }),
      })
    },
    // compressor methods
    async compress(save) {
      /** @type {FileSystemDirectoryHandle} */
      let saveDir = save.decompressed
      if (!saveDir) return console.error(`no saveDir - decompress button should not be reachable`)

      // check and/or request write permission for working dir
      /** @type {FileSystemDirectoryHandle} */
      let workingDir = this.workingDir.handle
      if (!workingDir) return console.error(`no workingDir - decompress button should not be reachable`)
      if ((await workingDir.queryPermission({ mode: 'readwrite' })) !== 'granted')
        if ((await workingDir.requestPermission({ mode: 'readwrite' })) !== 'granted')
          return this.$store.dispatch('showAlert', {
            type: 'error',
            text: this.$t('decompressor.permissionDenied'),
          })

      // read files from dir and add them to the save
      const saveObject = {}
      for await (const [name, handle] of saveDir.entries()) {
        if (handle.kind !== 'file') continue
        let file = await handle.getFile()
        let buffer = Buffer.from(await file.arrayBuffer())
        saveObject[name] = buffer
      }

      // compress save
      let compressed = CompressSave(saveObject)
      let blob = new Blob([compressed.buffer], { type: 'application/gzip' })

      /** @type {FileSystemFileHandle} */
      let saveFile = save.compressed
      // create output dir if doesnt exist
      if (!saveFile) saveFile = await workingDir.getFileHandle(saveDir.name + '.save', { create: true })

      // open write stream and write compressed savefile
      let writable = await saveFile.createWritable()
      await writable.write(blob)
      await writable.close()

      this.scanWorkingDir()

      this.$store.dispatch('showAlert', {
        type: 'success',
        text: this.$t('decompressor.compressed', { name: save.name }),
      })
    },
  },
}
</script>

<style scoped>
.iconButton {
  cursor: pointer;
}
</style>
