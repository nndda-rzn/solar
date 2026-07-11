import { Howl } from "howler";

interface TrackConfig {
  src: string;
  volume: number;
  loop: boolean;
}

class AudioManager {
  private tracks: Map<string, Howl> = new Map();

  load(key: string, config: TrackConfig) {
    const howl = new Howl({
      src: [config.src],
      volume: config.volume,
      loop: config.loop,
    });
    this.tracks.set(key, howl);
    return howl;
  }

  play(key: string) {
    const track = this.tracks.get(key);
    if (track && !track.playing()) {
      track.play();
    }
  }

  stop(key: string) {
    const track = this.tracks.get(key);
    if (track) {
      track.stop();
    }
  }

  fadeOut(key: string, duration: number = 1000) {
    const track = this.tracks.get(key);
    if (track) {
      track.fade(track.volume(), 0, duration);
    }
  }

  setVolume(key: string, volume: number) {
    const track = this.tracks.get(key);
    if (track) {
      track.volume(volume);
    }
  }

  muteAll() {
    this.tracks.forEach((t) => t.mute(true));
  }

  unmuteAll() {
    this.tracks.forEach((t) => t.mute(false));
  }
}

export const audioManager = new AudioManager();
