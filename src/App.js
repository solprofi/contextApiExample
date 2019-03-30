/*
+ Make the Play button work 
+ Make the Pause button work
+ Disable the play button if it's playing
+ Disable the pause button if it's not playing
+ Make the PlayPause button work
+ Make the JumpForward button work
+ Make the JumpBack button work
+ Make the progress bar work
  + change the width of the inner element to the percentage of the played track
  + add a click handler on the progress bar to jump to the clicked spot

Here is the audio API you'll need to use, `audio` is the <audio/> dom nod
instance, you can access it as `this.audio` in `AudioPlayer`

```js
// play/pause
audio.play()
audio.pause()

// change the current time
audio.currentTime = audio.currentTime + 10
audio.currentTime = audio.currentTime - 30

// know the duration
audio.duration

// values to calculate relative mouse click position
// on the progress bar
event.clientX // left position *from window* of mouse click
const rect = node.getBoundingClientRect()
rect.left // left position *of node from window*
rect.width // width of node
```

Other notes about the `<audio/>` tag:

- You can't know the duration until `onLoadedData`
- `onTimeUpdate` is fired when the currentTime changes
- `onEnded` is called when the track plays through to the end and is no
  longer playing

Good luck!
*/

import './index.css';
import React, { Fragment } from 'react';
import podcast from './podcast.mp3';
import mario from './mariobros.mp3';
import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
} from 'react-icons/fa';

const { Provider, Consumer } = React.createContext();

class AudioPlayer extends React.Component {
  state = {
    isPlaying: false,
    progress: 0,
  }

  calculateProgress = () => {
    const progress = (this.audio.currentTime / this.audio.duration) * 100;
    this.setState({ progress });
  }

  handleEnd = () => {
    this.setPlaying(false);
    this.setState({ progress: 0 });
  }

  setPlaying = isPlaying => {
    this.setState({ isPlaying });
  }

  playAudio = () => {
    this.audio.play();
    this.setPlaying(true);
  }

  stopAudio = () => {
    this.audio.pause();
    this.setPlaying(false);
  }

  jumpBackward = () => {
    this.audio.currentTime -= 10;
  }

  jumpForward = () => {
    this.audio.currentTime += 10;
  }

  jumpTo = e => {
    const rect = e.target.getBoundingClientRect();
    const { left, width } = rect;
    const { clientX } = e;

    const progress = ((clientX - left) / width) * 100;
    this.audio.currentTime = this.audio.duration * (progress / 100);
    this.setState({ progress });
  }

  render() {
    const { source } = this.props;
    const { progress, isPlaying } = this.state;

    return (
      <div className="audio-player">
        <audio
          src={source}
          onTimeUpdate={this.calculateProgress}
          onLoadedData={null}
          onEnded={this.handleEnd}
          ref={n => this.audio = n}
        />
        <Provider value={{
          playAudio: this.playAudio,
          stopAudio: this.stopAudio,
          jumpForward: this.jumpForward,
          jumpBackward: this.jumpBackward,
          jumpTo: this.jumpTo,
          isPlaying,
          progress,
        }}>
          {this.props.children}
        </Provider>
      </div>
    )
  }
}

class Play extends React.Component {
  render() {
    return (
      <Consumer>
        {
          context => (
            <button
              className="icon-button"
              onClick={context.playAudio}
              disabled={context.isPlaying}
              title="play"
            >
              <FaPlay />
            </button>
          )
        }
      </Consumer>
    )
  }
}

class Pause extends React.Component {
  render() {
    return (
      <Consumer>
        {
          context => (
            <button
              className="icon-button"
              onClick={context.stopAudio}
              disabled={!context.isPlaying}
              title="pause"
            >
              <FaPause />
            </button>
          )}
      </Consumer>
    )
  }
}

class PlayPause extends React.Component {
  render() {
    return (
      <Consumer>
        {
          context => (
            <Fragment>
              {context.isPlaying ? <Pause /> : <Play />}
            </Fragment>
          )
        }
      </Consumer>
    )
  }
}

class JumpForward extends React.Component {
  render() {
    return (
      <Consumer>
        {
          context => (
            <button
              className="icon-button"
              onClick={context.jumpForward}
              disabled={!context.isPlaying}
              title="Forward 10 Seconds"
            >
              <FaStepForward />
            </button>
          )
        }
      </Consumer>
    )
  }
}

class JumpBack extends React.Component {
  render() {
    return (
      <Consumer>
        {
          context => (
            <button
              className="icon-button"
              onClick={context.jumpBackward}
              disabled={!context.isPlaying}
              title="Back 10 Seconds"
            >
              <FaStepBackward />
            </button>
          )
        }
      </Consumer>
    )
  }
}

class Progress extends React.Component {
  render() {
    return (
      <Consumer>
        {
          context => (
            <div
              className="progress"
              onClick={context.jumpTo}
            >
              <div
                className="progress-bar"
                style={{
                  width: `${context.progress}%`
                }}
              />
            </div>
          )
        }
      </Consumer>
    )
  }
}

const Exercise = () => (
  <div className="exercise">
    <AudioPlayer source={mario}>
      <Play /> <Pause />{' '}
      <span className="player-text">Mario Bros. Remix</span>
      <Progress />
    </AudioPlayer>

    <AudioPlayer source={podcast}>
      <PlayPause /> <JumpBack /> <JumpForward /> {' '}
      <span className="player-text">React30 Episode 010: React Virtualized</span>
      <Progress />
    </AudioPlayer>
  </div>
)

export default Exercise;
