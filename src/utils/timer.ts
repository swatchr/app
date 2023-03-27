export class Timer {
  isRunning: boolean;
  startTime: number;
  overallTime: number;

  constructor() {
    this.isRunning = false;
    this.startTime = 0;
    this.overallTime = 0;
  }

  _getTimeElapsedSinceLastStart(): number {
    if (!this.startTime) {
      return 0;
    }

    return Date.now() - this.startTime;
  }

  start(): void {
    if (this.isRunning) {
      return console.error('Timer is already running');
    }

    this.isRunning = true;

    if (!this.startTime) {
      this.startTime = Date.now();
    }
  }

  stop(): void {
    if (!this.isRunning) {
      return console.error('Timer is already stopped');
    }

    this.isRunning = false;

    this.overallTime = this.overallTime + this._getTimeElapsedSinceLastStart();
  }

  reset(): void {
    this.overallTime = 0;

    if (this.isRunning) {
      this.startTime = Date.now();
      return;
    }

    this.startTime = 0;
  }

  getTime(): number {
    if (!this.startTime) {
      return 0;
    }

    if (this.isRunning) {
      return this.overallTime + this._getTimeElapsedSinceLastStart();
    }

    return this.overallTime;
  }
}

/**
 * @USAGE:


const timer = new Timer();
timer.start();
setInterval(() => {
  const timeInSeconds = Math.round(timer.getTime() / 1000);
  document.getElementById('time').innerText = timeInSeconds;
}, 100);




 */
