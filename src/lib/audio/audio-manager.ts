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

  fadeOutAndStop(key: string, duration: number = 1000) {
    const track = this.tracks.get(key);
    if (track && track.playing()) {
      track.fade(track.volume(), 0, duration);
      setTimeout(() => track.stop(), duration);
    }
  }

  fadeIn(key: string, targetVolume: number, duration: number = 2000) {
    const track = this.tracks.get(key);
    if (track) {
      track.volume(0);
      if (!track.playing()) track.play();
      track.fade(0, targetVolume, duration);
    }
  }

  isPlaying(key: string): boolean {
    const track = this.tracks.get(key);
    return track ? track.playing() : false;
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
