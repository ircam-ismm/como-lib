"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _BaseModule = _interopRequireDefault(require("./BaseModule.js"));

var _ticker = _interopRequireDefault(require("@ircam/ticker"));

var _helpers = require("./helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * There is a problem w/ this node,
 * Module that naïvely resample an incomming vector frame at a given framerate.
 * If 0 frame has been received since last tick, output last values.
 * If more than 1 frame since last tick, output the mean of all buffered frames.
 *
 * @memberof operator
 *
 * @todo - add option for output type (i.e. mean, max, min, last, median, etc.)
 *
 * @param {Object} [options] - Override default options.
 * @param {Number} [options.frameRate=20] - output sampling rate (in Hz)
 *
 */
class InputResampler extends _BaseModule.default {
  constructor(graph, type, id, options) {
    options = Object.assign({
      resamplingPeriod: 0.02
    }, options);
    super(graph, type, id, options);
    this.ticker = null;
    this.stack = [];
    this.bufferedFrameIndex = 0;
    this.propagate = this.propagate.bind(this);
  }

  destroy() {
    if (this.ticker !== null) {
      this.ticker.stop();
    }
  }

  process(inputFrame) {
    const copy = {};
    const inputData = inputFrame.data; // copy inputFrame.data into new object as the source reuses the same instance

    (0, _helpers.copyFrameData)(inputData, copy); // prepare `outputFrame.data` structure to simplify logic in `propagate`

    for (let name in inputData) {
      if (Array.isArray(inputData[name])) {
        if (!(name in this.outputFrame.data)) {
          this.outputFrame.data[name] = new Array(inputData[name].length);
        }
      } else if (Object.prototype.toString.call(inputData[name]) === '[object Object]') {
        if (!(name in this.outputFrame.data)) {
          this.outputFrame.data[name] = {};

          for (let key in inputData[name]) {
            this.outputFrame.data[name][key] = 0; // do we assume a source can only produce numbers ?
          }
        }
      } else {
        if (!(name in this.outputFrame.data)) {
          this.outputFrame.data[name] = 0;
        }
      }
    }

    this.stack[this.bufferedFrameIndex] = copy;
    this.bufferedFrameIndex += 1;

    if (this.ticker === null) {
      const period = this.options.resamplingPeriod * 1000; // to ms

      this.ticker = new _ticker.default(period, this.propagate);
      this.ticker.start();
    }
  }

  propagate() {
    if (this.bufferedFrameIndex === 0) {
      // update timetag and output last frame
      this.outputFrame.data.metas.time = this.graph.como.experience.plugins['sync'].getSyncTime();
      super.propagate(this.outputFrame);
    } else {
      const outputData = this.outputFrame.data;

      for (let name in outputData) {
        if (Array.isArray(outputData[name])) {
          const entryLength = outputData[name].length; // reset

          for (let i = 0; i < entryLength; i++) {
            outputData[name][i] = 0;
          } // sums


          for (let i = 0; i < this.bufferedFrameIndex; i++) {
            for (let j = 0; j < entryLength; j++) {
              outputData[name][j] += this.stack[i][name][j];
            }
          } // mean


          for (let i = 0; i < entryLength; i++) {
            outputData[name][i] /= this.bufferedFrameIndex;
          }
        } else if (Object.prototype.toString.call(outputData[name]) === '[object Object]') {
          // reset
          for (let key in outputData[name]) {
            outputData[name][key] = 0;
          } // sum


          for (let i = 0; i < this.bufferedFrameIndex; i++) {
            for (let key in outputData[name]) {
              outputData[name][key] += this.stack[i][name][key];
            }
          } // mean


          for (let key in outputData[name]) {
            outputData[name][key] /= this.bufferedFrameIndex;
          }
        } else {
          // reset
          outputData[name] = 0; // sum

          for (let i = 0; i < this.bufferedFrameIndex; i++) {
            outputData[name] += this.stack[i][name];
          } // mean


          outputData[name] /= this.bufferedFrameIndex;
        }
      } // override metas


      if (this.stack[0].metas) {
        // this condition is for testing purposes
        this.outputFrame.data.metas.id = this.stack[0].metas.id;
        this.outputFrame.data.metas.time = this.graph.como.experience.plugins['sync'].getSyncTime();
        this.outputFrame.data.metas.period = this.options.resamplingPeriod;
      }

      this.bufferedFrameIndex = 0;
      super.propagate(this.outputFrame);
    }
  }

}

var _default = InputResampler;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tb24vbW9kdWxlcy9JbnB1dFJlc2FtcGxlci5qcyJdLCJuYW1lcyI6WyJJbnB1dFJlc2FtcGxlciIsIkJhc2VNb2R1bGUiLCJjb25zdHJ1Y3RvciIsImdyYXBoIiwidHlwZSIsImlkIiwib3B0aW9ucyIsIk9iamVjdCIsImFzc2lnbiIsInJlc2FtcGxpbmdQZXJpb2QiLCJ0aWNrZXIiLCJzdGFjayIsImJ1ZmZlcmVkRnJhbWVJbmRleCIsInByb3BhZ2F0ZSIsImJpbmQiLCJkZXN0cm95Iiwic3RvcCIsInByb2Nlc3MiLCJpbnB1dEZyYW1lIiwiY29weSIsImlucHV0RGF0YSIsImRhdGEiLCJuYW1lIiwiQXJyYXkiLCJpc0FycmF5Iiwib3V0cHV0RnJhbWUiLCJsZW5ndGgiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJrZXkiLCJwZXJpb2QiLCJUaWNrZXIiLCJzdGFydCIsIm1ldGFzIiwidGltZSIsImNvbW8iLCJleHBlcmllbmNlIiwicGx1Z2lucyIsImdldFN5bmNUaW1lIiwib3V0cHV0RGF0YSIsImVudHJ5TGVuZ3RoIiwiaSIsImoiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNQSxjQUFOLFNBQTZCQyxtQkFBN0IsQ0FBd0M7QUFDdENDLEVBQUFBLFdBQVcsQ0FBQ0MsS0FBRCxFQUFRQyxJQUFSLEVBQWNDLEVBQWQsRUFBa0JDLE9BQWxCLEVBQTJCO0FBQ3BDQSxJQUFBQSxPQUFPLEdBQUdDLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUVDLE1BQUFBLGdCQUFnQixFQUFFO0FBQXBCLEtBQWQsRUFBMENILE9BQTFDLENBQVY7QUFDQSxVQUFNSCxLQUFOLEVBQWFDLElBQWIsRUFBbUJDLEVBQW5CLEVBQXVCQyxPQUF2QjtBQUVBLFNBQUtJLE1BQUws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SSxDQW9ETDs7O0FBQ0EsVUFBSSxLQUFLRCxLQUFMLENBQVcsQ0FBWCxFQUFjdUIsS0FBbEIsRUFBeUI7QUFBRTtBQUN6QixhQUFLVCxXQUFMLENBQWlCSixJQUFqQixDQUFzQmEsS0FBdEIsQ0FBNEI3QixFQUE1QixHQUFpQyxLQUFLTSxLQUFMLENBQVcsQ0FBWCxFQUFjdUIsS0FBZCxDQUFvQjdCLEVBQXJEO0FBQ0EsYUFBS29CLFdBQUwsQ0FBaUJKLElBQWpCLENBQXNCYSxLQUF0QixDQUE0QkMsSUFBNUIsR0FBbUMsS0FBS2hDLEtBQUwsQ0FBV2lDLElBQVgsQ0FBZ0JDLFVBQWhCLENBQTJCQyxPQUEzQixDQUFtQyxNQUFuQyxFQUEyQ0MsV0FBM0MsRUFBbkM7QUFDQSxhQUFLZCxXQUFMLENBQWlCSixJQUFqQixDQUFzQmEsS0FBdEIsQ0FBNEJILE1BQTVCLEdBQXFDLEtBQUt6QixPQUFMLENBQWFHLGdCQUFsRDtBQUNEOztBQUVELFdBQUtHLGtCQUFMLEdBQTBCLENBQTFCO0FBRUEsWUFBTUMsU0FBTixDQUFnQixLQUFLWSxXQUFyQjtBQUNEO0FBQ0Y7O0FBNUhxQzs7ZUErSHpCekIsYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTW9kdWxlIGZyb20gJy4vQmFzZU1vZHVsZS5qcyc7XG5pbXBvcnQgVGlja2VyIGZyb20gJ0BpcmNhbS90aWNrZXInO1xuaW1wb3J0IHsgY29weUZyYW1lRGF0YSB9IGZyb20gJy4vaGVscGVycyc7XG5cbi8qKlxuICogVGhlcmUgaXMgYSBwcm9ibGVtIHcvIHRoaXMgbm9kZSxcbiAqIE1vZHVsZSB0aGF0IG5hw692ZWx5IHJlc2FtcGxlIGFuIGluY29tbWluZyB2ZWN0b3IgZnJhbWUgYXQgYSBnaXZlbiBmcmFtZXJhdGUuXG4gKiBJZiAwIGZyYW1lIGhhcyBiZWVuIHJlY2VpdmVkIHNpbmNlIGxhc3QgdGljaywgb3V0cHV0IGxhc3QgdmFsdWVzLlxuICogSWYgbW9yZSB0aGFuIDEgZnJhbWUgc2luY2UgbGFzdCB0aWNrLCBvdXRwdXQgdGhlIG1lYW4gb2YgYWxsIGJ1ZmZlcmVkIGZyYW1lcy5cbiAqXG4gKiBAbWVtYmVyb2Ygb3BlcmF0b3JcbiAqXG4gKiBAdG9kbyAtIGFkZCBvcHRpb24gZm9yIG91dHB1dCB0eXBlIChpLmUuIG1lYW4sIG1heCwgbWluLCBsYXN0LCBtZWRpYW4sIGV0Yy4pXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSAtIE92ZXJyaWRlIGRlZmF1bHQgb3B0aW9ucy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5mcmFtZVJhdGU9MjBdIC0gb3V0cHV0IHNhbXBsaW5nIHJhdGUgKGluIEh6KVxuICpcbiAqL1xuY2xhc3MgSW5wdXRSZXNhbXBsZXIgZXh0ZW5kcyBCYXNlTW9kdWxlIHtcbiAgY29uc3RydWN0b3IoZ3JhcGgsIHR5cGUsIGlkLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oeyByZXNhbXBsaW5nUGVyaW9kOiAwLjAyIH0sIG9wdGlvbnMpO1xuICAgIHN1cGVyKGdyYXBoLCB0eXBlLCBpZCwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLnRpY2tlciA9IG51bGw7XG4gICAgdGhpcy5zdGFjayA9IFtdO1xuICAgIHRoaXMuYnVmZmVyZWRGcmFtZUluZGV4ID0gMDtcblxuICAgIHRoaXMucHJvcGFnYXRlID0gdGhpcy5wcm9wYWdhdGUuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMudGlja2VyICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnRpY2tlci5zdG9wKCk7XG4gICAgfVxuICB9XG5cbiAgcHJvY2VzcyhpbnB1dEZyYW1lKSB7XG4gICAgY29uc3QgY29weSA9IHt9O1xuICAgIGNvbnN0IGlucHV0RGF0YSA9IGlucHV0RnJhbWUuZGF0YTtcbiAgICAvLyBjb3B5IGlucHV0RnJhbWUuZGF0YSBpbnRvIG5ldyBvYmplY3QgYXMgdGhlIHNvdXJjZSByZXVzZXMgdGhlIHNhbWUgaW5zdGFuY2VcbiAgICBjb3B5RnJhbWVEYXRhKGlucHV0RGF0YSwgY29weSk7XG5cbiAgICAvLyBwcmVwYXJlIGBvdXRwdXRGcmFtZS5kYXRhYCBzdHJ1Y3R1cmUgdG8gc2ltcGxpZnkgbG9naWMgaW4gYHByb3BhZ2F0ZWBcbiAgICBmb3IgKGxldCBuYW1lIGluIGlucHV0RGF0YSkge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW5wdXREYXRhW25hbWVdKSkge1xuICAgICAgICBpZiAoIShuYW1lIGluIHRoaXMub3V0cHV0RnJhbWUuZGF0YSkpIHtcbiAgICAgICAgICB0aGlzLm91dHB1dEZyYW1lLmRhdGFbbmFtZV0gPSBuZXcgQXJyYXkoaW5wdXREYXRhW25hbWVdLmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGlucHV0RGF0YVtuYW1lXSkgPT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgICAgIGlmICghKG5hbWUgaW4gdGhpcy5vdXRwdXRGcmFtZS5kYXRhKSkge1xuICAgICAgICAgIHRoaXMub3V0cHV0RnJhbWUuZGF0YVtuYW1lXSA9IHt9O1xuXG4gICAgICAgICAgZm9yIChsZXQga2V5IGluIGlucHV0RGF0YVtuYW1lXSkge1xuICAgICAgICAgICAgdGhpcy5vdXRwdXRGcmFtZS5kYXRhW25hbWVdW2tleV0gPSAwOyAvLyBkbyB3ZSBhc3N1bWUgYSBzb3VyY2UgY2FuIG9ubHkgcHJvZHVjZSBudW1iZXJzID9cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghKG5hbWUgaW4gdGhpcy5vdXRwdXRGcmFtZS5kYXRhKSkge1xuICAgICAgICAgIHRoaXMub3V0cHV0RnJhbWUuZGF0YVtuYW1lXSA9IDA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnN0YWNrW3RoaXMuYnVmZmVyZWRGcmFtZUluZGV4XSA9IGNvcHk7XG4gICAgdGhpcy5idWZmZXJlZEZyYW1lSW5kZXggKz0gMTtcblxuICAgIGlmICh0aGlzLnRpY2tlciA9PT0gbnVsbCkge1xuICAgICAgY29uc3QgcGVyaW9kID0gdGhpcy5vcHRpb25zLnJlc2FtcGxpbmdQZXJpb2QgKiAxMDAwOyAvLyB0byBtc1xuICAgICAgdGhpcy50aWNrZXIgPSBuZXcgVGlja2VyKHBlcmlvZCwgdGhpcy5wcm9wYWdhdGUpO1xuICAgICAgdGhpcy50aWNrZXIuc3RhcnQoKTtcbiAgICB9XG4gIH1cblxuICBwcm9wYWdhdGUoKSB7XG4gICAgaWYgKHRoaXMuYnVmZmVyZWRGcmFtZUluZGV4ID09PSAwKSB7XG4gICAgICAvLyB1cGRhdGUgdGltZXRhZyBhbmQgb3V0cHV0IGxhc3QgZnJhbWVcbiAgICAgIHRoaXMub3V0cHV0RnJhbWUuZGF0YS5tZXRhcy50aW1lID0gdGhpcy5ncmFwaC5jb21vLmV4cGVyaWVuY2UucGx1Z2luc1snc3luYyddLmdldFN5bmNUaW1lKCk7XG5cbiAgICAgIHN1cGVyLnByb3BhZ2F0ZSh0aGlzLm91dHB1dEZyYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgb3V0cHV0RGF0YSA9IHRoaXMub3V0cHV0RnJhbWUuZGF0YTtcblxuICAgICAgZm9yIChsZXQgbmFtZSBpbiBvdXRwdXREYXRhKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KG91dHB1dERhdGFbbmFtZV0pKSB7XG4gICAgICAgICAgY29uc3QgZW50cnlMZW5ndGggPSBvdXRwdXREYXRhW25hbWVdLmxlbmd0aDtcbiAgICAgICAgICAvLyByZXNldFxuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW50cnlMZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgb3V0cHV0RGF0YVtuYW1lXVtpXSA9IDA7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gc3Vtc1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5idWZmZXJlZEZyYW1lSW5kZXg7IGkrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBlbnRyeUxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgIG91dHB1dERhdGFbbmFtZV1bal0gKz0gdGhpcy5zdGFja1tpXVtuYW1lXVtqXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBtZWFuXG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbnRyeUxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBvdXRwdXREYXRhW25hbWVdW2ldIC89IHRoaXMuYnVmZmVyZWRGcmFtZUluZGV4O1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob3V0cHV0RGF0YVtuYW1lXSkgPT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgICAgICAgLy8gcmVzZXRcbiAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gb3V0cHV0RGF0YVtuYW1lXSkge1xuICAgICAgICAgICAgb3V0cHV0RGF0YVtuYW1lXVtrZXldID0gMDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBzdW1cbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYnVmZmVyZWRGcmFtZUluZGV4OyBpKyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBvdXRwdXREYXRhW25hbWVdKSB7XG4gICAgICAgICAgICAgIG91dHB1dERhdGFbbmFtZV1ba2V5XSArPSB0aGlzLnN0YWNrW2ldW25hbWVdW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gbWVhblxuICAgICAgICAgIGZvciAobGV0IGtleSBpbiBvdXRwdXREYXRhW25hbWVdKSB7XG4gICAgICAgICAgICBvdXRwdXREYXRhW25hbWVdW2tleV0gLz0gdGhpcy5idWZmZXJlZEZyYW1lSW5kZXg7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIHJlc2V0XG4gICAgICAgICAgb3V0cHV0RGF0YVtuYW1lXSA9IDA7XG5cbiAgICAgICAgICAvLyBzdW1cbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYnVmZmVyZWRGcmFtZUluZGV4OyBpKyspIHtcbiAgICAgICAgICAgIG91dHB1dERhdGFbbmFtZV0gKz0gdGhpcy5zdGFja1tpXVtuYW1lXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gbWVhblxuICAgICAgICAgIG91dHB1dERhdGFbbmFtZV0gLz0gdGhpcy5idWZmZXJlZEZyYW1lSW5kZXg7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gb3ZlcnJpZGUgbWV0YXNcbiAgICAgIGlmICh0aGlzLnN0YWNrWzBdLm1ldGFzKSB7IC8vIHRoaXMgY29uZGl0aW9uIGlzIGZvciB0ZXN0aW5nIHB1cnBvc2VzXG4gICAgICAgIHRoaXMub3V0cHV0RnJhbWUuZGF0YS5tZXRhcy5pZCA9IHRoaXMuc3RhY2tbMF0ubWV0YXMuaWQ7XG4gICAgICAgIHRoaXMub3V0cHV0RnJhbWUuZGF0YS5tZXRhcy50aW1lID0gdGhpcy5ncmFwaC5jb21vLmV4cGVyaWVuY2UucGx1Z2luc1snc3luYyddLmdldFN5bmNUaW1lKCk7XG4gICAgICAgIHRoaXMub3V0cHV0RnJhbWUuZGF0YS5tZXRhcy5wZXJpb2QgPSB0aGlzLm9wdGlvbnMucmVzYW1wbGluZ1BlcmlvZDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5idWZmZXJlZEZyYW1lSW5kZXggPSAwO1xuXG4gICAgICBzdXBlci5wcm9wYWdhdGUodGhpcy5vdXRwdXRGcmFtZSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IElucHV0UmVzYW1wbGVyO1xuXG4iXX0=