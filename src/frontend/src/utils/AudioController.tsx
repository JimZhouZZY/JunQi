// AudioController.tsx
// TODO: refactor needed

class AudioController {
    private static audioFiles: Record<string, string> = {
      roger: '/sounds/roger.flac',
    };
  
    private static audioRefs: Record<string, HTMLAudioElement> = {};
  
    // 播放音效
    static playSound(key: string) {
      if (!this.audioRefs[key]) {
        const audio = new Audio(this.audioFiles[key]);
        this.audioRefs[key] = audio;
      }
      this.audioRefs[key]?.play();
    }
  }
  
  export default AudioController;