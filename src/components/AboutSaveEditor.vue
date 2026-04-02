<template>
  <v-row>
    <v-col>
      <v-sheet elevation="1" class="buttonWrapper">
        <v-btn color="secondary" variant="outlined" class="mx-2" @click="selectedComp = 'ownedSubs'">
          {{ $t('aboutSaveEditor.ownedSubmarines') }}
        </v-btn>
        <v-btn color="secondary" variant="outlined" class="mx-2" @click="selectedComp = 'campSettings'">
          {{ $t('aboutSaveEditor.campaignSettings') }}
        </v-btn>
        <v-btn color="secondary" variant="outlined" class="mx-2" @click="selectedComp = 'crew'"> {{ $t('aboutSaveEditor.crew') }} </v-btn>
        <v-btn color="secondary" variant="outlined" class="mx-2" @click="selectedComp = 'misc'"> {{ $t('aboutSaveEditor.miscTools') }} </v-btn>
      </v-sheet>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <!-- owned submarines -->
      <v-card v-if="selectedComp === 'ownedSubs'" elevation="1" class="aboutCard">
        <v-card-header>
          <v-card-title class="text-h4">{{ $t('aboutSaveEditor.ownedSubmarines') }}</v-card-title>
        </v-card-header>
        <v-card-text>
          <span class="text-h6">{{ $t('aboutSaveEditor.displaysListOwned') }}</span><br /><br />
          {{ $t('aboutSaveEditor.eachSubmarineHas') }}
          <ul class="pl-8">
            <li>
              <v-icon color="secondary">mdi-file-download-outline</v-icon> - {{ $t('aboutSaveEditor.extractsFileAndDownloads') }}
            </li>
            <li>
              <v-icon color="secondary">mdi-clipboard-arrow-right-outline</v-icon> - {{ $t('aboutSaveEditor.loadsInEditor') }}
            </li>
            <li>
              <v-icon color="red">mdi-delete-outline</v-icon> - {{ $t('aboutSaveEditor.removesFromList') }}
            </li>
          </ul>
          {{ $t('aboutSaveEditor.radioLeft') }}
          <br />
          {{ $t('aboutSaveEditor.loadingSubWill') }} {{ $t('aboutSaveEditor.existingSubmarine') }}
        </v-card-text>
      </v-card>
      <!-- campaign settings -->
      <v-card v-if="selectedComp === 'campSettings'" elevation="1" class="aboutCard">
        <v-card-header>
          <v-card-title class="text-h4">{{ $t('aboutSaveEditor.campaignSettings') }}</v-card-title>
        </v-card-header>
        <v-card-text>
          <span class="text-h6"> {{ $t('aboutSaveEditor.maxMissions') }} </span><br />
          {{ $t('aboutSaveEditor.allowsSetHowMany') }}
          <br /><br /><span class="text-h6"> {{ $t('aboutSaveEditor.radiation') }} </span><br />
          {{ $t('aboutSaveEditor.allowsToggle') }}<br />
          {{ $t('aboutSaveEditor.offToOn') }}<br />
          {{ $t('aboutSaveEditor.onToOff') }} {{ $t('aboutSaveEditor.alreadyAbandoned') }}
          <br /><br /><span class="text-h6"> {{ $t('aboutSaveEditor.difficulty') }} </span><br />
          {{ $t('aboutSaveEditor.allowsMassUpdate') }}<br />
          {{ $t('aboutSaveEditor.inputCanTake') }}<br />
          {{ $t('aboutSaveEditor.exampleUses') }}
          <ul class="pl-8">
            <li><span class="text-secondary">current * 2</span> - {{ $t('aboutSaveEditor.currentTimes2') }}</li>
            <li><span class="text-secondary">current + 10</span> - {{ $t('aboutSaveEditor.currentPlus10') }}</li>
            <li><span class="text-secondary">85</span> - {{ $t('aboutSaveEditor.setTo85') }}</li>
          </ul>
          {{ $t('aboutSaveEditor.wonTLetYou') }}
        </v-card-text>
      </v-card>
      <!-- crew -->
      <v-card v-if="selectedComp === 'crew'" elevation="1" class="aboutCard">
        <v-card-header>
          <v-card-title class="text-h4">{{ $t('aboutSaveEditor.crewBots') }}</v-card-title>
        </v-card-header>
        <v-card-text>
          <span class="text-h6">
            {{ $t('aboutSaveEditor.displaysListCurrent') }}
          </span>
          <br /><br />
          {{ $t('aboutSaveEditor.eachCharacterHas') }}
          <ul class="pl-8">
            <li><v-icon color="secondary">mdi-drag-horizontal-variant</v-icon> - {{ $t('aboutSaveEditor.canGrabToReorder') }}</li>
            <li>
              <v-icon color="secondary">mdi-file-edit-outline</v-icon> - {{ $t('aboutSaveEditor.opensCharacterEditing') }}
            </li>
            <li><v-icon color="red">mdi-delete-outline</v-icon> - {{ $t('aboutSaveEditor.deletesCharacter') }}</li>
          </ul>
          {{ $t('aboutSaveEditor.toAddCharacters') }}
          <ul class="pl-8">
            <li>
              {{ $t('aboutSaveEditor.loadCharacterData') }}
            </li>
            <li>
              <v-icon color="secondary">mdi-account-plus-outline</v-icon> - {{ $t('aboutSaveEditor.addNewAssistant') }}
            </li>
            <li>
              <v-icon color="secondary">mdi-account-edit-outline</v-icon> - {{ $t('aboutSaveEditor.addFromXml') }}
            </li>
            <li>
              <v-icon color="secondary">mdi-clipboard-arrow-up-outline</v-icon> - {{ $t('aboutSaveEditor.addFromClip') }}
            </li>
          </ul>
          {{ $t('aboutSaveEditor.afterLoading') }} <span class="text-secondary">CharacterData.xml</span> {{ $t('aboutSaveEditor.iconWillBeAvailable') }}
          <v-icon color="secondary">mdi-file-download-outline</v-icon> {{ $t('aboutSaveEditor.exportPlayerChars') }}<br />
          {{ $t('aboutSaveEditor.limitations') }} {{ $t('aboutSaveEditor.namesAndUsesIt') }} {{ $t('aboutSaveEditor.characterWonTAllowExport') }}
          <br>{{ $t('aboutSaveEditor.fileSoWonTBe') }}
        </v-card-text>
      </v-card>
      <!-- misc -->
      <v-card v-if="selectedComp === 'misc'" elevation="1" class="aboutCard">
        <v-card-header>
          <v-card-title class="text-h4">{{ $t('aboutSaveEditor.miscTools') }}</v-card-title>
        </v-card-header>
        <v-card-text>
          <span class="text-h6"> {{ $t('aboutSaveEditor.gamesessionXmlTools') }} </span>
          <br />
          {{ $t('aboutSaveEditor.fourButtonsAllowing') }}
          <ul class="pl-8">
            <li>
              <v-icon color="secondary">mdi-clipboard-arrow-down-outline</v-icon> - {{ $t('aboutSaveEditor.copiesContentsTo') }}
            </li>
            <li>
              <v-icon color="secondary">mdi-clipboard-arrow-up-outline</v-icon> - {{ $t('aboutSaveEditor.replacesWithContents') }}
            </li>
            <li><v-icon color="secondary">mdi-file-download-outline</v-icon> - {{ $t('aboutSaveEditor.downloadsFile') }}</li>
            <li>
              <v-icon color="secondary">mdi-file-edit-outline</v-icon> - {{ $t('aboutSaveEditor.opensInLarge') }}
            </li>
          </ul>
          {{ $t('aboutSaveEditor.loadingWillReplace') }}
          <br /><br /><span class="text-h6"> {{ $t('aboutSaveEditor.saveConversion') }} </span><br />
          {{ $t('aboutSaveEditor.allowsConvertBetween') }}<br />
          {{ $t('aboutSaveEditor.importantNotes') }}
          <ul class="pl-8">
            <li>
              {{ $t('aboutSaveEditor.whenConvertingMpSp') }} {{ $t('aboutSaveEditor.importedByLoading') }}
            </li>
            <li>
              {{ $t('aboutSaveEditor.whenConvertingSpMp') }}
            </li>
          </ul>
          <br /><span class="text-h6"> {{ $t('aboutSaveEditor.campaignIdMpOnly') }} </span><br />
          {{ $t('aboutSaveEditor.allowsSetCampaign') }}
          <br /><br /><span class="text-h6"> {{ $t('aboutSaveEditor.currentMoney') }} </span><br />
          {{ $t('aboutSaveEditor.allowsSetCurrent') }}
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
