import React from "react";
import moment from "moment";
import "./clock.scss";
import { ReactComponent as PlayIcon } from './assets/play.svg';
import { ReactComponent as PauseIcon } from './assets/pause.svg';
import addIcon from "./assets/plus.svg";
import minusIcon from "./assets/minus.svg"
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            break_length: 5,
            session_length: 25,
            active_state: "Session",
            running: false,
            timeLeft: 1500
        };
        this.handleReset = this.handleReset.bind(this);
        this.handleBreakDecrement = this.handleBreakDecrement.bind(this);
        this.handleBreakIncrement = this.handleBreakIncrement.bind(this);
        this.handleSessionDecrement = this.handleSessionDecrement.bind(this);
        this.handleSessionIncrement = this.handleSessionIncrement.bind(this);
        this.timerOperation = this.timerOperation.bind(this);
        this.updateClock = this.updateClock.bind(this);
        this.y = null;
        this.loop = 3;
        this.formatTime = this.formatTime.bind(this);
        this.turnTimeToSec = this.turnTimeToSec.bind(this);
        this.timerSession = this.timerSession.bind(this);
        this.timerBreak = this.timerBreak.bind(this);
        this.updateTimeLeft = this.updateTimeLeft.bind(this);
    }

    updateTimeLeft(left) {
        this.setState({
            timeLeft: left * 60
        });
    }

    //Set time interval for Session
    timerSession() {
        let x = this.state.running;
        if (x === false) {
            this.y = setInterval(this.updateClock, 1000);
            this.setState({
                running: true
            });
        } else {
            clearInterval(this.y);
            this.setState({
                running: false
            });
        }
    }

    //Set time interval for break
    timerBreak() {
        let x = this.state.running;
        if (x === false) {
            this.y = setInterval(this.updateClock, 1000);
            this.setState({
                running: true
            });
        } else {
            clearInterval(this.y);
            this.setState({
                running: false
            });
        }
    }

    //Turn time in to seconds
    turnTimeToSec(input) {
        return input * 60;
    }

    //Turn time in seconds into Display time
    formatTime(time) {
        console.log(time * 1000);
        return time * 1000;
    }

    //update clock function
    updateClock() {
        let time;
        if (this.state.active_state === "Session") {
            if (this.state.timeLeft === null) {
                time = this.state.session_length * 60 + 1;
            } else {
                time = this.state.timeLeft;
            }
        } else if (this.state.active_state === "Break") {
            if (this.state.timeLeft === null) {
                time = this.state.break_length * 60 + 1;
            } else {
                time = this.state.timeLeft;
            }
        }
        if (time > 0) {
            time = time - 1;
            this.setState({
                timeLeft: time
            });
        } else if (this.state.timeLeft === 0) {
            clearInterval(this.y);
            let clip = document.getElementById("beep");
            clip.play();
            if (this.state.active_state === "Session") {
                this.setState({
                    active_state: "Break"
                });
            } else if (this.state.active_state === "Break") {
                this.setState({ active_state: "Session" });
            }
            if (this.loop !== 0) {
                this.setState({ running: false, timeLeft: null });
                this.timerOperation();
            }
        }
    }

    //Timer functionality Break or Session
    timerOperation() {
        if (this.state.active_state === "Session") {
            this.timerSession();
        } else if (this.state.active_state === "Break") {
            this.timerBreak();
        }
    }

    //button clicks increment & decrement
    handleSessionDecrement() {
        if (this.state.session_length > 1) {
            let num = this.state.session_length;
            this.setState({
                session_length: num - 1,
                timeLeft: (num - 1) * 60
            });
        }
    }
    handleSessionIncrement() {
        if (this.state.session_length <= 59) {
            let num = this.state.session_length;
            this.setState({
                session_length: num + 1,
                timeLeft: (num + 1) * 60
            });
        }
    }
    handleBreakDecrement() {
        if (this.state.break_length > 1) {
            this.setState({
                break_length: this.state.break_length - 1
            });
        }
    }
    handleBreakIncrement() {
        if (this.state.break_length <= 59) {
            this.setState({
                break_length: this.state.break_length + 1
            });
        }
    }

    //reset button
    handleReset() {
        this.setState({
            break_length: 5,
            session_length: 25,
            active_state: "Session",
            running: false,
            timeLeft: 1500
        });
        clearInterval(this.y);
        let clip = document.getElementById("beep");
        clip.pause();
        clip.currentTime = 0;
    }





    //User Interface
    render() {
        return (
            <div id='app-container'>
                <div id='left'>
                    <div id='clock-container'>
                        <Timer
                            session_length={this.state.session_length}
                            timeLeft={moment(this.formatTime(this.state.timeLeft)).format(
                                "mm:ss"
                            )}
                            timeProgress={this.state.timeLeft}
                            active_state={this.state.active_state}
                            break_length={this.state.break_length}
                            handleReset={this.handleReset}
                            timerOperation={this.timerOperation}
                            running={this.state.running}
                        />
                    </div>
                </div>
                <div id="right">
                    <div id='session-container'>
                        <Session
                            session_length={this.state.session_length}
                            handleSessionDecrement={this.handleSessionDecrement}
                            handleSessionIncrement={this.handleSessionIncrement}
                        />
                    </div>
                    <div id="break-container">
                        <Break
                            break_length={this.state.break_length}
                            handleBreakDecrement={this.handleBreakDecrement}
                            handleBreakIncrement={this.handleBreakIncrement}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

class Break extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div id="break_component" className="inline">
                <h2 id="break-label">Break Time</h2>
                <div className='controls'>
                    <button id="break-decrement" className='button' onClick={this.props.handleBreakDecrement}>
                        <img class='b-icon' src={minusIcon} />
                    </button>
                    <h2 id="break-length" className='time-display-text' >{this.props.break_length}</h2>
                    <button id="break-increment" className='button' onClick={this.props.handleBreakIncrement}>
                        <img class='b-icon' src={addIcon} />
                    </button>
                </div>
            </div>
        );
    }
}

class Session extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div id="session_component" className="inline">
                <h2 id="session-label">Session Time</h2>
                <div class='controls'>
                    <button
                        id="session-decrement"
                        className='button'
                        onClick={this.props.handleSessionDecrement}
                    >
                        <img class='b-icon' src={minusIcon} />
                    </button>
                    <h2 className='time-display-text' id="session-length">{this.props.session_length}</h2>
                    <button
                        id="session-increment"
                        className='button'
                        onClick={this.props.handleSessionIncrement}
                    >
                        <img class='b-icon' src={addIcon} />
                    </button>
                </div>
            </div>
        );
    }
}

class Timer extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let val;
        if (this.props.active_state === "Session") {
            val = this.props.timeProgress / (this.props.session_length * 60) * 100
        } else {
            val = this.props.timeProgress / (this.props.break_length * 60) * 100
        }

        let icon;
        if (!this.props.running) {
            icon = <PlayIcon class='button-icon' />
        } else {
            icon = <PauseIcon class='button-icon' />
        }

        return (
            <div id='timer-container'>
                <div className='progressbar-container' >
                    <CircularProgressbarWithChildren value={val}
                        strokeWidth={2}>
                        <h2 id="timer-label">{this.props.active_state}</h2>
                        <h1 id="time-left">
                            {this.props.session_length > 59 ? "60:00" : this.props.timeLeft}
                        </h1>
                        <div className='controls'>
                            <div className='button-main' id="start_stop" onClick={this.props.timerOperation}>
                                {icon}
                            </div>
                        </div>
                    </CircularProgressbarWithChildren>
                </div>

                <button className='button-cover' id="reset" onClick={this.props.handleReset}>
                    <p>Reset</p>
                </button>

                <audio
                    id="beep"
                    src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
                />
            </div>
        );
    }
}

export default App;