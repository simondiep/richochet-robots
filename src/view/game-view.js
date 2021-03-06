import {
  getBody,
  getMuteButton,
  getNewPuzzleButton,
  getRestartButton,
  hideWinScreenOverlay,
  incrementNumberOfMovesLabel,
  muteBackgroundMusic,
  playBackgroundMusic,
  playRobotBeepSound,
  playTickSound,
  playThudSound,
  playWinSound,
  resetNumberOfMovesLabel,
  setMinimumNumberOfMovesLabel,
  setPuzzleNumber,
  showApp,
  showWinScreenOverlay,
  showHeaderBar,
  swapRobotControlsToRed,
  swapRobotControlsToGreen,
  swapRobotControlsToBlue,
  swapRobotControlsToYellow,
} from './dom-helper.js';
import { ROBOTS } from '../model/robot.js';

const SPACE_BAR_KEYCODE = 32;
const UP_ARROW_KEYCODE = 38;
const DOWN_ARROW_KEYCODE = 40;
const ONE_KEYCODE = 49;
const ONE_NUMPAD_KEYCODE = 97;
const TWO_KEYCODE = 50;
const TWO_NUMPAD_KEYCODE = 98;
const THREE_KEYCODE = 51;
const THREE_NUMPAD_KEYCODE = 99;
const FOUR_KEYCODE = 52;
const FOUR_NUMPAD_KEYCODE = 100;
const E_KEYCODE = 69;
const M_KEYCODE = 77;
const R_KEYCODE = 82;

/**
 * Handles all requests related to the display of the game, not including the canvas
 */
export default class GameView {
  constructor(keyDownCallback, initializeGameCallback, initializeGameWithPuzzleIdCallback) {
    this.volume = 0.1;
    this.keyDownCallback = keyDownCallback;
    this.initializeGameCallback = initializeGameCallback;
    this.initializeGameWithPuzzleIdCallback = initializeGameWithPuzzleIdCallback;
    window.addEventListener('keydown', this._handleKeyDown.bind(this), true);
    getMuteButton().addEventListener('click', this._handleMuteButtonClicked.bind(this));
    getNewPuzzleButton().addEventListener('click', this.initializeGameCallback);
    getRestartButton().addEventListener('click', this._handleRestartButtonClicked.bind(this));
    showApp();
  }

  initializeGame(puzzleId, minimumNumberOfMoves, activeRobotInfo) {
    this.puzzleId = puzzleId;
    this.activeRobotInfo = activeRobotInfo;
    this.hideVictoryScreen();
    resetNumberOfMovesLabel();
    setMinimumNumberOfMovesLabel(minimumNumberOfMoves);
    setPuzzleNumber(puzzleId);
    swapRobotControlsToRed();
    playTickSound(this.volume);
  }

  robotHasStoppedMoving(hasMoved) {
    playThudSound(this.volume);
    if (hasMoved) {
      incrementNumberOfMovesLabel();
    }
  }

  hideVictoryScreen() {
    hideWinScreenOverlay();
    this.winScreenOverlayVisible = false;
  }

  showVictoryScreen() {
    playWinSound(this.volume);
    showWinScreenOverlay();
    this.winScreenOverlayVisible = true;
  }

  _swapRobotControls(keyCode) {
    switch (keyCode) {
      case ONE_KEYCODE:
      case ONE_NUMPAD_KEYCODE:
        swapRobotControlsToRed();
        this.activeRobotInfo = ROBOTS.RED.id;
        playRobotBeepSound(this.volume);
        break;
      case TWO_KEYCODE:
      case TWO_NUMPAD_KEYCODE:
        swapRobotControlsToGreen();
        this.activeRobotInfo = ROBOTS.GREEN.id;
        playRobotBeepSound(this.volume);
        break;
      case THREE_KEYCODE:
      case THREE_NUMPAD_KEYCODE:
        swapRobotControlsToBlue();
        this.activeRobotInfo = ROBOTS.BLUE.id;
        playRobotBeepSound(this.volume);
        break;
      case FOUR_KEYCODE:
      case FOUR_NUMPAD_KEYCODE:
        swapRobotControlsToYellow();
        this.activeRobotInfo = ROBOTS.YELLOW.id;
        playRobotBeepSound(this.volume);
        break;
      default:
        break;
    }
  }

  /*******************
   *  Event handling *
   *******************/

  _handleKeyDown(e) {
    // Prevent keyboard scrolling default behavior
    // Also prevent triggering a focused button
    if (
      e.keyCode === UP_ARROW_KEYCODE ||
      e.keyCode === DOWN_ARROW_KEYCODE ||
      e.keyCode === SPACE_BAR_KEYCODE
    ) {
      e.preventDefault();
    }

    if (e.keyCode === SPACE_BAR_KEYCODE) {
      // Start First Game
      if (this.puzzleId === undefined) {
        playBackgroundMusic(this.volume);
        this.initializeGameCallback();
        showHeaderBar();
        return;
      }
      if (this.winScreenOverlayVisible) {
        this.hideVictoryScreen();
        this.initializeGameCallback();
        return;
      }
    }

    if (e.keyCode === E_KEYCODE) {
      this.initializeGameCallback();
      return;
    }

    if (e.keyCode === M_KEYCODE) {
      this.volume = 0;
      muteBackgroundMusic();
    }

    if (e.keyCode === R_KEYCODE) {
      this.initializeGameWithPuzzleIdCallback(this.puzzleId);
      return;
    }

    this._swapRobotControls(e.keyCode);
    this.keyDownCallback(e.keyCode);
  }

  _handleMuteButtonClicked() {
    this.volume = 0;
    muteBackgroundMusic();
  }

  _handleRestartButtonClicked() {
    this.initializeGameWithPuzzleIdCallback(this.puzzleId);
  }
}
