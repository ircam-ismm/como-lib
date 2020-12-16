"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _client = require("soundworks/client");

const defaults = {
  threshold: 0.0001,
  offDelay: 0.3,
  preRollCount: 2,
  // num ticks before recording
  preRollInterval: 1,
  // in seconds
  startCallback: null,
  stopCallback: null,
  playSound: null
};

class CountDownTrigger {
  constructor(options) {
    this.options = Object.assign({}, defaults, options);
    this.isMoving = false;
    this.stopTimeoutId = null;
    this.prerollId = null;
    this.state = 'off';
    this.counter = 0;
  }

  set threshold(value) {
    this.options.threshold = value;
  }

  set offDelay(value) {
    this.options.offDelay = value;
  }

  set preRollCount(value) {
    this.options.preRollCount = value;
  }

  set preRollInterval(value) {
    this.options.preRollInterval = value;
  }

  process(energy) {
    if (energy > this.options.threshold && !this.isMoving) {
      this.isMoving = true;

      if (this.stopTimeoutId) {
        clearTimeout(this.stopTimeoutId);
        this.stopTimeoutId = null;
      }
    } else if (energy < this.options.threshold && this.isMoving) {
      this.isMoving = false;
      this.stopTimeoutId = setTimeout(() => {
        this.options.stopCallback();
        this.stopTimeoutId = null;
        this.isMoving = false;
      }, this.options.offDelay * 1000);
    }
  }
  /**
   * state can be 'preroll', 'on', 'off'
   */


  setState(state) {
    this.state = state;

    if (this.state === 'preroll') {
      this.counter = this.options.preRollCount;
      this.prerollId = setInterval(() => {
        if (this.counter === 0) {
          clearInterval(this.prerollId);
          this.options.startCallback();
        } else {
          this.options.countCallback(this.counter);
          this.counter -= 1;
        }
      }, this.options.preRollInterval * 1000);
    } else if (this.state === 'on') {
      // listen for off
      clearInterval(this.prerollId);
      this.isMoving = true;
    } else if (this.state === 'off') {
      this.options.stopCallback();
      this.stopTimeoutId = null;
      this.isMoving = false;
    }
  }

}

var _default = CountDownTrigger;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGllbnQvdG1wL0NvdW50RG93blRyaWdnZXIuanMiXSwibmFtZXMiOlsiZGVmYXVsdHMiLCJ0aHJlc2hvbGQiLCJvZmZEZWxheSIsInByZVJvbGxDb3VudCIsInByZVJvbGxJbnRlcnZhbCIsInN0YXJ0Q2FsbGJhY2siLCJzdG9wQ2FsbGJhY2siLCJwbGF5U291bmQiLCJDb3VudERvd25UcmlnZ2VyIiwiY29uc3RydWN0b3IiLCJvcHRpb25zIiwiT2JqZWN0IiwiYXNzaWduIiwiaXNNb3ZpbmciLCJzdG9wVGltZW91dElkIiwicHJlcm9sbElkIiwic3RhdGUiLCJjb3VudGVyIiwidmFsdWUiLCJwcm9jZXNzIiwiZW5lcmd5IiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsInNldFN0YXRlIiwic2V0SW50ZXJ2YWwiLCJjbGVhckludGVydmFsIiwiY291bnRDYWxsYmFjayJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUVBLE1BQU1BLFFBQVEsR0FBRztBQUNmQyxFQUFBQSxTQUFTLEVBQUUsTUFESTtBQUVmQyxFQUFBQSxRQUFRLEVBQUUsR0FGSztBQUdmQyxFQUFBQSxZQUFZLEVBQUUsQ0FIQztBQUdFO0FBQ2pCQyxFQUFBQSxlQUFlLEVBQUUsQ0FKRjtBQUlLO0FBQ3BCQyxFQUFBQSxhQUFhLEVBQUUsSUFMQTtBQU1mQyxFQUFBQSxZQUFZLEVBQUUsSUFOQztBQU9mQyxFQUFBQSxTQUFTLEVBQUU7QUFQSSxDQUFqQjs7QUFVQSxNQUFNQyxnQkFBTixDQUF1QjtBQUNyQkMsRUFBQUEsV0FBVyxDQUFDQyxPQUFELEVBQVU7QUFDbkIsU0FBS0EsT0FBTCxHQUFlQyxNQUFNLENBQUNDLE1BQVAsQ0FBYyxFQUFkLEVBQWtCWixRQUFsQixFQUE0QlUsT0FBNUIsQ0FBZjtBQUNBLFNBQUtHLFFBQUwsR0FBZ0IsS0FBaEI7QUFDQSxTQUFLQyxhQUFMLEdBQXFCLElBQXJCO0FBQ0EsU0FBS0MsU0FBTCxHQUFpQixJQUFqQjtBQUNBLFNBQUtDLEtBQUwsR0FBYSxLQUFiO0FBQ0EsU0FBS0MsT0FBTCxHQUFlLENBQWY7QUFDRDs7QUFFRCxNQUFJaEIsU0FBSixDQUFjaUIsS0FBZCxFQUFxQjtBQUNuQixTQUFLUixPQUFMLENBQWFULFNBQWIsR0FBeUJpQixLQUF6QjtBQUNEOztBQUVELE1BQUloQixRQUFKLENBQWFnQixLQUFiLEVBQW9CO0FBQ2xCLFNBQUtSLE9BQUwsQ0FBYVIsUUFBYixHQUF3QmdCLEtBQXhCO0FBQ0Q7O0FBRUQsTUFBSWYsWUFBSixDQUFpQmUsS0FBakIsRUFBd0I7QUFDdEIsU0FBS1IsT0FBTCxDQUFhUCxZQUFiLEdBQTRCZSxLQUE1QjtBQUNEOztBQUVELE1BQUlkLGVBQUosQ0FBb0JjLEtBQXBCLEVBQTJCO0FBQ3pCLFNBQUtSLE9BQUwsQ0FBYU4sZUFBYixHQUErQmMsS0FBL0I7QUFDRDs7QUFFREMsRUFBQUEsT0FBTyxDQUFDQyxNQUFELEVBQVM7QUFDZCxRQUFJQSxNQUFNLEdBQUcsS0FBS1YsT0FBTCxDQUFhVCxTQUF0QixJQUFtQyxDQUFDLEtBQUtZLFFBQTdDLEVBQXVEO0FBQ3JELFdBQUtBLFFBQUwsR0FBZ0IsSUFBaEI7O0FBRUEsVUFBSSxLQUFLQyxhQUFULEVBQXdCO0FBQ3RCTyxRQUFBQSxZQUFZLENBQUMsS0FBS1AsYUFBTixDQUFaO0FBQ0EsYUFBS0EsYUFBTCxHQUFxQixJQUFyQjtBQUNEO0FBQ0YsS0FQRCxNQU9PLElBQUlNLE1BQU0sR0FBRyxLQUFLVixPQUFMLENBQWFULFNBQXRCLElBQW1DLEtBQUtZLFFBQTVDLEVBQXNEO0FBQzNELFdBQUtBLFFBQUwsR0FBZ0IsS0FBaEI7QUFFQSxXQUFLQyxhQUFMLEdBQXFCUSxVQUFVLENBQUMsTUFBTTtBQUNwQyxhQUFLWixPQUFMLENBQWFKLFlBQWI7QUFDQSxhQUFLUSxhQUFMLEdBQXFCLElBQXJCO0FBQ0EsYUFBS0QsUUFBTCxHQUFnQixLQUFoQjtBQUNELE9BSjhCLEVBSTVCLEtBQUtILE9BQUwsQ0FBYVIsUUFBYixHQUF3QixJQUpJLENBQS9CO0FBS0Q7QUFDRjtBQUVEO0FBQ0Y7QUFDQTs7O0FBQ0VxQixFQUFBQSxRQUFRLENBQUNQLEtBQUQsRUFBUTtBQUNkLFNBQUtBLEtBQUwsR0FBYUEsS0FBYjs7QUFFQSxRQUFJLEtBQUtBLEtBQUwsS0FBZSxTQUFuQixFQUE4QjtBQUM1QixXQUFLQyxPQUFMLEdBQWUsS0FBS1AsT0FBTCxDQUFhUCxZQUE1QjtBQUVBLFdBQUtZLFNBQUwsR0FBaUJTLFdBQVcsQ0FBQyxNQUFNO0FBQ2pDLFlBQUksS0FBS1AsT0FBTCxLQUFpQixDQUFyQixFQUF3QjtBQUN0QlEsVUFBQUEsYUFBYSxDQUFDLEtBQUtWLFNBQU4sQ0FBYjtBQUNBLGVBQUtMLE9BQUwsQ0FBYUwsYUFBYjtBQUNELFNBSEQsTUFHTztBQUNMLGVBQUtLLE9BQUwsQ0FBYWdCLGFBQWIsQ0FBMkIsS0FBS1QsT0FBaEM7QUFDQSxlQUFLQSxPQUFMLElBQWdCLENBQWhCO0FBQ0Q7QUFDRixPQVIyQixFQVF6QixLQUFLUCxPQUFMLENBQWFOLGVBQWIsR0FBK0IsSUFSTixDQUE1QjtBQVNELEtBWkQsTUFZTyxJQUFJLEtBQUtZLEtBQUwsS0FBZSxJQUFuQixFQUF5QjtBQUM5QjtBQUNBUyxNQUFBQSxhQUFhLENBQUMsS0FBS1YsU0FBTixDQUFiO0FBQ0EsV0FBS0YsUUFBTCxHQUFnQixJQUFoQjtBQUNELEtBSk0sTUFJQSxJQUFJLEtBQUtHLEtBQUwsS0FBZSxLQUFuQixFQUEwQjtBQUMvQixXQUFLTixPQUFMLENBQWFKLFlBQWI7QUFDQSxXQUFLUSxhQUFMLEdBQXFCLElBQXJCO0FBQ0EsV0FBS0QsUUFBTCxHQUFnQixLQUFoQjtBQUNEO0FBQ0Y7O0FBeEVvQjs7ZUEyRVJMLGdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXVkaW9Db250ZXh0LCBhdWRpbyB9IGZyb20gJ3NvdW5kd29ya3MvY2xpZW50JztcblxuY29uc3QgZGVmYXVsdHMgPSB7XG4gIHRocmVzaG9sZDogMC4wMDAxLFxuICBvZmZEZWxheTogMC4zLFxuICBwcmVSb2xsQ291bnQ6IDIsIC8vIG51bSB0aWNrcyBiZWZvcmUgcmVjb3JkaW5nXG4gIHByZVJvbGxJbnRlcnZhbDogMSwgLy8gaW4gc2Vjb25kc1xuICBzdGFydENhbGxiYWNrOiBudWxsLFxuICBzdG9wQ2FsbGJhY2s6IG51bGwsXG4gIHBsYXlTb3VuZDogbnVsbCxcbn1cblxuY2xhc3MgQ291bnREb3duVHJpZ2dlciB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgdGhpcy5pc01vdmluZyA9IGZhbHNlO1xuICAgIHRoaXMuc3RvcFRpbWVvdXRJZCA9IG51bGw7XG4gICAgdGhpcy5wcmVyb2xsSWQgPSBudWxsO1xuICAgIHRoaXMuc3RhdGUgPSAnb2ZmJztcbiAgICB0aGlzLmNvdW50ZXIgPSAwO1xuICB9XG5cbiAgc2V0IHRocmVzaG9sZCh2YWx1ZSkge1xuICAgIHRoaXMub3B0aW9ucy50aHJlc2hvbGQgPSB2YWx1ZTtcbiAgfVxuXG4gIHNldCBvZmZEZWxheSh2YWx1ZSkge1xuICAgIHRoaXMub3B0aW9ucy5vZmZEZWxheSA9IHZhbHVlO1xuICB9XG5cbiAgc2V0IHByZVJvbGxDb3VudCh2YWx1ZSkge1xuICAgIHRoaXMub3B0aW9ucy5wcmVSb2xsQ291bnQgPSB2YWx1ZTtcbiAgfVxuXG4gIHNldCBwcmVSb2xsSW50ZXJ2YWwodmFsdWUpIHtcbiAgICB0aGlzLm9wdGlvbnMucHJlUm9sbEludGVydmFsID0gdmFsdWU7XG4gIH1cblxuICBwcm9jZXNzKGVuZXJneSkge1xuICAgIGlmIChlbmVyZ3kgPiB0aGlzLm9wdGlvbnMudGhyZXNob2xkICYmICF0aGlzLmlzTW92aW5nKSB7XG4gICAgICB0aGlzLmlzTW92aW5nID0gdHJ1ZTtcblxuICAgICAgaWYgKHRoaXMuc3RvcFRpbWVvdXRJZCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5zdG9wVGltZW91dElkKTtcbiAgICAgICAgdGhpcy5zdG9wVGltZW91dElkID0gbnVsbDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGVuZXJneSA8IHRoaXMub3B0aW9ucy50aHJlc2hvbGQgJiYgdGhpcy5pc01vdmluZykge1xuICAgICAgdGhpcy5pc01vdmluZyA9IGZhbHNlO1xuXG4gICAgICB0aGlzLnN0b3BUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5vcHRpb25zLnN0b3BDYWxsYmFjaygpO1xuICAgICAgICB0aGlzLnN0b3BUaW1lb3V0SWQgPSBudWxsO1xuICAgICAgICB0aGlzLmlzTW92aW5nID0gZmFsc2U7XG4gICAgICB9LCB0aGlzLm9wdGlvbnMub2ZmRGVsYXkgKiAxMDAwKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogc3RhdGUgY2FuIGJlICdwcmVyb2xsJywgJ29uJywgJ29mZidcbiAgICovXG4gIHNldFN0YXRlKHN0YXRlKSB7XG4gICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuXG4gICAgaWYgKHRoaXMuc3RhdGUgPT09ICdwcmVyb2xsJykge1xuICAgICAgdGhpcy5jb3VudGVyID0gdGhpcy5vcHRpb25zLnByZVJvbGxDb3VudDtcblxuICAgICAgdGhpcy5wcmVyb2xsSWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmNvdW50ZXIgPT09IDApIHtcbiAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMucHJlcm9sbElkKTtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuc3RhcnRDYWxsYmFjaygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMub3B0aW9ucy5jb3VudENhbGxiYWNrKHRoaXMuY291bnRlcik7XG4gICAgICAgICAgdGhpcy5jb3VudGVyIC09IDE7XG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMub3B0aW9ucy5wcmVSb2xsSW50ZXJ2YWwgKiAxMDAwKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUgPT09ICdvbicpIHtcbiAgICAgIC8vIGxpc3RlbiBmb3Igb2ZmXG4gICAgICBjbGVhckludGVydmFsKHRoaXMucHJlcm9sbElkKTtcbiAgICAgIHRoaXMuaXNNb3ZpbmcgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZSA9PT0gJ29mZicpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5zdG9wQ2FsbGJhY2soKTtcbiAgICAgIHRoaXMuc3RvcFRpbWVvdXRJZCA9IG51bGw7XG4gICAgICB0aGlzLmlzTW92aW5nID0gZmFsc2U7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvdW50RG93blRyaWdnZXI7XG4iXX0=