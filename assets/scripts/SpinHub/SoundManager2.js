var SoundManager2 = cc.Class({
    extends: cc.Component,

    ctor() {
        this.objAudioClip = {};
    },
    properties: {
    },
    statics: {
        getIns() {
            if (this.self == null) {
                this.self = new SoundManager2();
            }
            return this.self;
        }
    },
    stopMusicBackground() {
        this.isPlayMusic = false;
        if (this.currentCipMusicBackGround != null) {
            cc.audioEngine.stop(this.currentCipMusicBackGround);
        }
    },

    playMusicBackgroundClip(clip, volume = 0.5) {
        this.isPlayMusic = true;
        let current = this;
        if (current.currentCipMusicBackGround != null) {
            cc.audioEngine.stop(current.currentCipMusicBackGround);
        }
        if(current.isPlayMusic)
            current.currentCipMusicBackGround = cc.audioEngine.play(clip, true, volume);
    }, 

    playMusicBackground(bundleName, bundleLink, volume = 0.5) {
        this.isPlayMusic = true;
        let current = this;
        cc.loader.loadRes(bundleLink+bundleName,cc.AudioClip, (err, clip)=>{
            if (current.currentCipMusicBackGround != null) {
                cc.audioEngine.stop(current.currentCipMusicBackGround);
            }
            if(current.isPlayMusic)
                current.currentCipMusicBackGround = cc.audioEngine.play(clip, true, volume);
        });
    }, 

    playMusicBackground2(bundleName, bundleLink, volume = 0.5, isLoop = true) {
        this.isPlayMusic = true;
        let current = this;
        Global.DownloadManager.LoadAssest(bundleName,cc.AudioClip,bundleLink, (audio)=>{
            if (current.currentCipMusicBackGround != null) {
                cc.audioEngine.stop(current.currentCipMusicBackGround);
            }
            if(current.isPlayMusic)
                current.currentCipMusicBackGround = cc.audioEngine.play(audio, isLoop, volume);
        });
    },
    
    playEffect(bundleName, bundleLink, isLoop = false, volume = 1, useBundle = false) {
        let current = this;
        // if(bundleLink.split("/").length > 1 && !useBundle) {
            cc.loader.loadRes(bundleLink, cc.AudioClip, (err, clip) => {
                if (err) return;
                if (this.objAudioClip[bundleLink] != null) {
                    cc.audioEngine.stop(this.objAudioClip[bundleLink]);
                }
                this.objAudioClip[bundleLink] = cc.audioEngine.play(clip, isLoop, volume);
            });
        // } else {
        //     Global.DownloadManager.LoadAssest(bundleName,cc.AudioClip,bundleLink, (audio)=>{
        //         if (current.objAudioClip[bundleLink] != null) {
        //             cc.audioEngine.stop(current.objAudioClip[bundleLink]);
        //         }
        //         current.objAudioClip[bundleLink] = cc.audioEngine.play(audio, isLoop, volume);
        //     });
        // }
    },
    playEffect2(bundleName, bundleLink, isLoop = false, volume = 1, useBundle = false) {
        let current = this;
        
        Global.DownloadManager.LoadAssest(bundleName,cc.AudioClip,bundleLink, (audio)=>{
            if (current.objAudioClip[bundleLink] != null) {
                cc.audioEngine.stop(current.objAudioClip[bundleLink]);
            }
            current.objAudioClip[bundleLink] = cc.audioEngine.play(audio, isLoop, volume);
        });
    }, 
    
    playEffectClip(name, audio, isLoop = false, volume = 1) {
        let current = this;
        
        if (current.objAudioClip[name] != null) {
            cc.audioEngine.stop(current.objAudioClip[name]);
        }
        current.objAudioClip[name] = cc.audioEngine.play(audio, isLoop, volume);
    },
    stopEffect(ResDefine) {
        if (this.objAudioClip[ResDefine] != null) {
            cc.audioEngine.stop(this.objAudioClip[ResDefine]);
        }
    },
    pasauseEffect(ResDefine) {
        if (this.objAudioClip[ResDefine] != null) {
            cc.audioEngine.pause(this.objAudioClip[ResDefine]);
        }
    },

    resumeEffect(ResDefine) {
        if (this.objAudioClip[ResDefine] != null) {
            cc.audioEngine.resume(this.objAudioClip[ResDefine]);
        }
    },

    stopAll() {
        // for(let temp in objAudioClip){
        //     if(objAudioClip[temp] != null ){

        //     }
        // }
        cc.audioEngine.stopAll();
        this.objAudioClip = {};
    },

});

export default SoundManager2;