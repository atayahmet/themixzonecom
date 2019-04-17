import { Subject, Observable } from 'rxjs';
import { ITrackCue, ITrack } from '@music/interfaces';

class PlayerService {
  private audio: HTMLAudioElement = new Audio;
  private track: TextTrack;
  private onLoadedDataSubject: Subject<any> = new Subject;
  private onTimeUpdateSubject: Subject<any> = new Subject;
  private onPauseSubject: Subject<any> = new Subject;
  private onPlaySubject: Subject<any> = new Subject;
  private onTrackEnter: Subject<any> = new Subject;

  constructor() {
    this.audio.addEventListener('loadeddata', () => this.onLoadedDataSubject.next());
    this.audio.addEventListener('pause', () => this.onPauseSubject.next());
    this.audio.addEventListener('play', () => this.onPlaySubject.next());
    this.audio.addEventListener('timeupdate', () => this.onTimeUpdateSubject.next());
  }

  public load(src: string) {
    this.audio.src = src;
    this.audio.load();
    this.track = this.audio.addTextTrack('metadata');
    return this;
  }

  public play(): void {
    this.audio.play();
  }

  public pause(): void {
    this.audio.pause();
  }

  public addCues(cues: ITrackCue[]): void {
    for (const cue of cues) {
      this.addCue(cue);
    }
  }

  public addCue(trackCue: ITrackCue): void {
    const { name } = (trackCue.track || {} as ITrack);
    const cue = new VTTCue(trackCue.startTime, trackCue.endTime, name);
    cue.id = trackCue.trackId;

    const onEnter = (result: TextTrackCue) => this.onTrackEnter.next(result);
    cue.onenter = function() { onEnter(this); };

    this.track.addCue(cue);
  }

  public element(): HTMLAudioElement {
    return this.audio;
  }

  public onLoadedData(): Observable<any> {
    return this.onLoadedDataSubject.asObservable();
  }

  public onPause(): Observable<any> {
    return this.onPauseSubject.asObservable();
  }

  public onPlay(): Observable<any> {
    return this.onPlaySubject.asObservable();
  }

  public onTimeUpdate(): Observable<any> {
    return this.onTimeUpdateSubject.asObservable();
  }

  public onEnter(): Observable<any> {
    return this.onTrackEnter.asObservable();
  }
}

export default new PlayerService;
