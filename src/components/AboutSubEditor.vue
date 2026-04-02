<template>
  <v-row>
    <v-col>
      <v-sheet elevation="1" class="buttonWrapper">
        <v-btn color="secondary" variant="outlined" class="mx-2" @click="selectedComp = 'export'">
          {{ $t('aboutSubEditor.exportFromFile') }}
        </v-btn>
        <v-btn color="secondary" variant="outlined" class="mx-2" @click="selectedComp = 'wirehider'">{{ $t('aboutSubEditor.wireHider') }}</v-btn>
        <v-btn color="secondary" variant="outlined" class="mx-2" @click="selectedComp = 'script'">{{ $t('aboutSubEditor.runScript') }}</v-btn>
        <v-btn color="secondary" variant="outlined" class="mx-2" @click="selectedComp = 'misc'">{{ $t('aboutSubEditor.miscTools') }}</v-btn>
      </v-sheet>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <!-- export -->
      <v-card v-if="selectedComp === 'export'" elevation="1" class="aboutCard">
        <v-card-header>
          <v-card-title class="text-h4">{{ $t('aboutSubEditor.exportFromFile') }}</v-card-title>
        </v-card-header>
        <v-card-text>
          <span class="text-h6">{{ $t('aboutSubEditor.allowsExportPreview') }}</span><br /><br />
          {{ $t('aboutSubEditor.pressingButtonTriggers') }} <v-icon color="secondary">mdi-file-download-outline</v-icon> {{ $t('aboutSubEditor.buttonTriggers') }}.
        </v-card-text>
      </v-card>
      <!-- wire hider -->
      <v-card v-if="selectedComp === 'wirehider'" elevation="1" class="aboutCard">
        <v-card-header>
          <v-card-title class="text-h4">{{ $t('aboutSubEditor.wireHider') }}</v-card-title>
        </v-card-header>
        <v-card-text>
          <span class="text-h6"> {{ $t('aboutSubEditor.toolToMakeMass') }} </span>
          <br /><br />
          {{ $t('aboutSubEditor.justSelectDesired') }} {{ $t('aboutSubEditor.andPressButtons') }}<br>
          {{ $t('aboutSubEditor.thisToolUses') }} {{ $t('aboutSubEditor.wiresStillVisible') }}
        </v-card-text>
      </v-card>
      <!-- script -->
      <v-card v-if="selectedComp === 'script'" elevation="1" class="aboutCard">
        <v-card-header>
          <v-card-title class="text-h4">{{ $t('aboutSubEditor.runScript') }}</v-card-title>
        </v-card-header>
        <v-card-text>
          <span class="text-h6"> {{ $t('aboutSubEditor.editSubWithScript') }} </span>
          <br /><br />
          {{ $t('aboutSubEditor.workInProgress') }} {{ $t('aboutSubEditor.allowsDirectEdit') }}
        </v-card-text>
      </v-card>
      <!-- misc -->
      <v-card v-if="selectedComp === 'misc'" elevation="1" class="aboutCard">
        <v-card-header>
          <v-card-title class="text-h4">{{ $t('aboutSubEditor.miscTools') }}</v-card-title>
        </v-card-header>
        <v-card-text>
          <br /><span class="text-h6"> {{ $t('aboutSubEditor.changePrice') }} </span><br />
          {{ $t('aboutSubEditor.allowsChangeSubmarine') }}
          <br /><br /><span class="text-h6"> {{ $t('aboutSubEditor.cleanWalls') }} </span><br />
          {{ $t('aboutSubEditor.removesStainsFrom') }}
          <br /><br /><span class="text-h6"> {{ $t('aboutSubEditor.compactSubmarine') }} </span><br />
          {{ $t('aboutSubEditor.allowsMassivelyReduce') }}
          <ul class="pl-8">
            <li>
              <span class="text-secondary">{{ $t('aboutSubEditor.shuttlesButton') }}</span> {{ $t('aboutSubEditor.replacesPreviewImages') }}
              {{ $t('aboutSubEditor.theMainSubmarine') }}
            </li>
            <li><span class="text-secondary">{{ $t('aboutSubEditor.subButton') }}</span> {{ $t('aboutSubEditor.replacesPreviewImage') }}</li>
          </ul>
          {{ $t('aboutSubEditor.noteShuttleImages') }}
          {{ $t('aboutSubEditor.removingMainPreview') }}
          {{ $t('aboutSubEditor.inGame') }}<br />
          {{ $t('aboutSubEditor.ifButtonsLocked') }}
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      selectedComp: '',
    }
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
.aboutCard {
  padding: 4px;
}
</style>
