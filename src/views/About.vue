<template>
  <v-container>
    <v-row>
      <v-col>
        <v-sheet elevation="1" class="pa-2" style="text-align: center">
          <b>
            {{ $t('about.note') }}<br />
            {{ $t('about.risk') }}
          </b>
        </v-sheet>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-sheet elevation="1" class="buttonWrapper">
          <v-btn :class="{ 'text-black': !subEditor }" color="secondary" class="mx-2" @click="subEditor = false">
            {{ $t('aboutSaveEditor.aboutSaveEditor') }}
          </v-btn>
          <v-btn :class="{ 'text-black': subEditor }" color="secondary" class="mx-2" @click="subEditor = true">
            {{ $t('aboutSubEditor.aboutSubEditor') }}
          </v-btn>
        </v-sheet>
      </v-col>
    </v-row>
    <AboutSubEditor v-if="subEditor"></AboutSubEditor>
    <AboutSaveEditor v-else></AboutSaveEditor>
    <v-row>
      <v-col>
        <v-sheet elevation="1" class="pa-2" style="text-align: center">
          {{ $t('about.ifEditorFreezes') }}
          <a style="color: rgb(var(--v-theme-secondary))" href="https://github.com/ignis05/baro-save-editor/issues">
            {{ $t('about.githubIssue1') }}
          </a>
          {{ $t('about.attachingOriginal') }}<br>
          {{ $t('about.additionalWord') }}
          <a style="color: rgb(var(--v-theme-secondary))" href="https://github.com/Xin-Yu-Glitter/baro-save-editor-zh-CN/issues">
            {{ $t('about.githubIssue2') }}
          </a>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AboutSaveEditor from '@/components/AboutSaveEditor.vue'
import AboutSubEditor from '@/components/AboutSubEditor.vue'

export default {
  data() {
    return {
      subEditor: false,
    }
  },
  components: {
    AboutSaveEditor,
    AboutSubEditor,
  },
}
</script>

<style scoped>
.buttonWrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-content: center;
}
</style>
