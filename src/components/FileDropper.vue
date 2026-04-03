<template>
  <v-card class="pa-4" elevation="1">
    <div class="d-flex flex-row align-center justify-center mb-1">
      <div class="h3 mb-1">{{ $t('fileDropper.dragFileBelow') }}</div>
      <v-spacer></v-spacer>
      <!-- file path guess -->
      <div v-if="fromSubEditor" class="text-center">
        {{ $t('fileDropper.subFilesInside') }} <span class="text-primary">{{ $t('fileDropper.barotraumaDir') }}</span>
      </div>
      <div v-else class="text-center">
        {{ $t('fileDropper.saveFilesShouldBeIn') }} <span class="text-primary">{{ saveLocation }}</span>
      </div>
      <!-- locate file dialog -->
      <v-btn @click.stop="fileLocDialog = true" size="x-small" icon>
        <v-icon>mdi-file-find-outline</v-icon>
        <v-tooltip anchor="bottom" activator="parent">{{ $t('fileDropper.whereCanIFind') }}</v-tooltip>
      </v-btn>
      <v-dialog class="filedropper" v-model="fileLocDialog">
        <v-card>
          <v-card-title>
            <span class="text-h5"
              >{{ $t('fileDropper.whereAreMy') }} {{ fromSubEditor ? '.sub' : '.save' }}
              {{ $t('fileDropper.files') }}</span
            >
            <v-spacer></v-spacer>
            <v-btn color="red" size="x-small" icon @click="fileLocDialog = false">
              <v-icon>mdi-close-thick</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <!-- sub editor -->
          <v-card-text class="pl-8" v-if="fromSubEditor">
            <div class="text-h6 text-center">{{ $t('fileDropper.subWithinBarotrauma') }}</div>
            <ul>
              <li>
                {{ $t('fileDropper.vanillaSubs') }}:
                <span class="text-primary"> Barotrauma/Submarines </span>
              </li>
              <li>
                {{ $t('fileDropper.downloadedTemp') }}:
                <span class="text-primary"> Barotrauma/Submarines/Downloaded </span> ({{ $t('fileDropper.hiddenDir') }})
              </li>
              <li>
                {{ $t('fileDropper.downloadedWorkshop') }}:
                <span class="text-primary"> Barotrauma/Mods/[package name] </span>
              </li>
              <li>
                {{ $t('fileDropper.createdOrModified') }}:
                <span class="text-primary"> Barotrauma/LocalMods/[package name] </span>
              </li>
            </ul>
            <br />
            <p class="text">
              {{ $t('fileDropper.toOpenDir') }}
            </p>
            <v-img src="~@/assets/browseLocalFiles.png"></v-img>
          </v-card-text>
          <!-- save editor -->
          <v-card-text class="pl-8" v-else>
            <div class="text-h6 text-center">{{ $t('fileDropper.saveLocationOS') }}</div>
            <ul>
              <li>
                {{ $t('fileDropper.windows') }}:
                <span class="text-primary">
                  C:\Users\%username%\AppData\Local\Daedalic Entertainment GmbH\Barotrauma
                </span>
              </li>
              <li>
                {{ $t('fileDropper.linux') }}:
                <span class="text-primary"> /home/$USER/.local/share/Daedalic Entertainment GmbH/ </span>
              </li>
              <li>
                {{ $t('fileDropper.macos') }}:
                <span class="text-primary"> /$USER/Library/Application Support/Daedalic Entertainment GmbH/ </span>
              </li>
            </ul>
          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- help dialog -->
      <v-btn @click.stop="helpDialog = true" size="x-small" icon>
        <v-icon>mdi-help-circle-outline</v-icon>
        <v-tooltip anchor="bottom" activator="parent">{{ $t('fileDropper.whatFilesCanILoad') }}</v-tooltip>
      </v-btn>
      <v-dialog class="filedropper" v-model="helpDialog">
        <v-card>
          <v-card-title>
            <span class="text-h5">{{ $t('fileDropper.whatFilesCanILoadHere') }}</span>
            <v-spacer></v-spacer>
            <v-btn color="red" size="x-small" icon @click="helpDialog = false">
              <v-icon>mdi-close-thick</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <!-- sub editor -->
          <v-card-text class="pl-8" v-if="fromSubEditor">
            <div class="text-h6 text-center">{{ $t('fileDropper.subEditorSupports') }}</div>
            <ul>
              <li>
                <span class="text-primary font-weight-bold">.sub</span> - {{ $t('fileDropper.barotraumaSubFiles') }}
              </li>
              <li><span class="text-primary text-bold">.xml</span> - {{ $t('fileDropper.decompressedSubFiles') }}</li>
            </ul>
          </v-card-text>
          <!-- save editor -->
          <v-card-text class="pl-8" v-else>
            <div class="text-h6 text-center">
              {{ $t('fileDropper.saveEditorNeeds') }} <span class="text-primary font-weight-bold">.save</span>
              {{ $t('fileDropper.fileFirstThen') }}
            </div>
            <ul>
              <li><span class="text-primary font-weight-bold">.sub</span> - {{ $t('fileDropper.addNewOrUpdate') }}</li>
              <li>
                <span class="text-primary font-weight-bold">gamesession.xml</span> -
                {{ $t('fileDropper.replaceGamesession') }}
              </li>
              <li>
                <span class="text-primary font-weight-bold">(...)_CharacterData.xml</span> -
                {{ $t('fileDropper.importPlayersAsBots') }}
              </li>
            </ul>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
    <div
      class="dropzone"
      @drop.prevent="dropHandler"
      @click="dropzoneClickHandler"
      @dragenter.stop.prevent="dragEnter"
      @dragleave.stop.prevent="dragLeave"
      @dragover.stop.prevent
      :style="{ borderColor: hovered ? getBorderColor : '', backgroundImage: `url(${fileImage})` }"
    ></div>
    <input
      ref="fileInput"
      class="dropzoneInput"
      type="file"
      @change="selectHandler"
      multiple="false"
      :accept="fromSubEditor ? '.sub, .xml' : '.save, .sub, .xml'"
    />
  </v-card>
</template>

<script>
import fileImage from '@/assets/file-upload-outline.png'

import platform from 'platform-detect/os.mjs'
import { Buffer } from 'buffer'

import { DecompressSave } from '@/helpers/CompressionHelpers.js'

export default {
  props: {
    fromSubEditor: Boolean,
  },
  data() {
    return {
      hovered: false,
      fileLocDialog: false,
      helpDialog: false,
    }
  },
  methods: {
    async loadFile(file) {
      await this.$store.dispatch('setLoading', true)
      // give vue time to update component before synchronous decompression
      await new Promise((r) => setTimeout(r, 50))

      const reader = new FileReader()

      reader.readAsArrayBuffer(file)
      reader.onload = (e) => {
        /**@type {ArrayBuffer} */
        const resultRaw = e.target.result
        var resultFile = {
          name: file.name,
          data: null,
        }

        // uploads from submarine editor
        if (this.fromSubEditor) {
          resultFile.data = resultRaw
          this.$store.dispatch('subUploaded', resultFile)
        }
        // uploads from save editor
        else {
          if (file.name.endsWith('.save')) {
            var save = DecompressSave(Buffer.from(resultRaw))
            resultFile.data = save
          } else if (file.name.endsWith('.sub')) {
            resultFile.data = resultRaw
          } else if (file.name.endsWith('.xml')) {
            resultFile.data = Buffer.from(resultRaw).toString('utf-8')
          } else {
            resultFile.data = resultRaw
          }
          this.$store.dispatch('fileUploaded', resultFile)
        }
      }
    },
    selectHandler(ev) {
      if (ev.target?.files[0]) this.loadFile(ev.target.files[0])
      ev.target.value = null
    },
    dropHandler(ev) {
      this.hovered = false
      if (ev.dataTransfer?.files[0]) this.loadFile(ev.dataTransfer.files[0])
    },
    dropzoneClickHandler() {
      this.$refs.fileInput.click()
    },
    dragEnter() {
      this.hovered = true
    },
    dragLeave() {
      this.hovered = false
    },
  },
  computed: {
    getBorderColor() {
      return this.$vuetify.theme.themes.dark.colors.secondary
    },
    fileImage() {
      return fileImage
    },
    /**@type {String} */
    saveLocation() {
      if (platform.windows) return 'C:\\Users\\%username%\\AppData\\Local\\Daedalic Entertainment GmbH\\Barotrauma'
      if (platform.linux) return '/home/$USER/.local/share/Daedalic Entertainment GmbH/'
      if (platform.macos) return '/$USER/Library/Application Support/Daedalic Entertainment GmbH/'
      return 'Your platform was not recognized, use button on the right to see possible save locations'
    },
  },
}
</script>

<style scoped>
input.dropzoneInput {
  display: none;
}
.dropzone {
  border: 2px dashed #bbb;
  border-radius: 5px;
  padding: 50px;
  text-align: center;
  cursor: pointer;
  position: relative;
  background-position: center;
}
</style>

<style>
.v-dialog.filedropper .v-overlay__content {
  max-width: 780px !important;
  max-height: 650px !important;
}
</style>
