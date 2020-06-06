'use strict';
let Options = {};

let chatChannels = {
  '0000': 'none',
  '0001': 'debug',
  '0002': 'urgent',
  '0003': 'announce',
  '000a': 'say',
  '000b': 'shout',
  '000c': 'tell', // outgoing
  '000d': 'tell', // incoming
  '000e': 'party',
  '000f': 'alliance',
  '0010': 'linkshell1',
  '0011': 'linkshell2',
  '0012': 'linkshell3',
  '0013': 'linkshell4',
  '0014': 'linkshell5',
  '0015': 'linkshell6',
  '0016': 'linkshell7',
  '0017': 'linkshell8',
  '0018': 'fc',
  '001b': 'novicenetwork',
  '001c': 'emote', // manual
  '001d': 'emote', // built-in
  '001e': 'yell',
  '0024': 'pvpteam',
  '0025': 'cwls1',
  '0038': 'echo',
  '0039': 'message',
  '003b': 'gathering',
  '003c': 'message',
  '003d': 'retainer',
  '003e': 'gil',
  '0043': 'collectable', // gathering bonuses
  '0044': 'dialog',
  '0045': 'companyaction',
  '0046': 'login',
  '0047': 'sale',
  '0048': 'pfsearch',
  '004c': 'orchestrion',
  '0065': 'cwls2',
  '0066': 'cwls3',
  '0067': 'cwls4',
  '0068': 'cwls5',
  '0069': 'cwls6',
  '006a': 'cwls7',
  '006b': 'cwls8',
};

let playing = false;

function Sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

class SoundTTS{
  playSound(text){
    //console.log(text);
    let iframe = document.createElement('iframe');
    // remove sandbox so we can modify contents/call play on audio element later
    iframe.removeAttribute('sandbox');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    let encText = encodeURIComponent(text);
    iframe.contentDocument.body.innerHTML = '<audio src="https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=' + encText + '" id="TTS">';

    this.item = iframe.contentDocument.body.firstElementChild;

    this.item.addEventListener('loadedmetadata', (event) => 
    {      
      //console.log(this.item.duration);
      this.item.play();
      playing = true;
      
      setTimeout(function() {
        playing = false;
        //console.log("audio stopped")
      }, this.item.duration * 1000);
    });
  }
}

class ChatLog {
  async onLogEvent(e) {
    for (let log of e.detail.logs) {
      let m = log.includes("003d"); //only message type
      if (!m)
        continue;

      let regex = Regexes.gameLog({ code: '00[0-9].' });
      let obj = log.match(regex);

      let text = obj.groups.line;

      let sound = new SoundTTS();
      
      let splitted = text.split(".");
      for (var i = 0; i < splitted.length; i++) {
        sound.playSound(splitted[i]);
        playing = true;
        do {
          //console.log("sleep");
          await Sleep(250);
        } while (playing == true);
      }
    }
  }
}

UserConfig.getUserConfigLocation('chat', function(e) {
  let chatLog = new ChatLog();
  addOverlayListener('onLogEvent', function(e) {
    chatLog.onLogEvent(e);
  });
});
