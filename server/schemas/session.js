"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  name: {
    type: 'string',
    default: ''
  },
  id: {
    type: 'string',
    default: ''
  },
  audioFiles: {
    type: 'any',
    default: []
  },
  labels: {
    type: 'any',
    default: []
  },
  labelAudioFileTable: {
    type: 'any',
    default: []
  },
  graph: {
    type: 'any',
    default: {}
  },
  // these two are not persisted as is, they are mixed in the "graph"
  // @todo - document this behavior, this is hard to understand
  graphOptions: {
    type: 'any',
    default: {}
  },
  graphOptionsEvent: {
    type: 'any',
    default: {},
    event: true
  },
  // this should belong to the "encoder / decoder"
  // this needs to be discussed further... what would be clean
  // architecture / strategy for that, e.g.
  // - we don't want to dispatch the examples everywhere,
  // - how to attach an example to a particular encoder / decoder instance,
  // - same for config, etc.
  //
  // @see also `player` schema
  model: {
    type: 'any',
    default: null,
    nullable: true
  },
  examples: {
    type: 'any',
    default: {}
  },
  learningConfig: {
    type: 'any',
    // posture default for now...
    default: {
      target: {
        name: 'xmm'
      },
      payload: {
        modelType: 'gmm',
        gaussians: 1,
        absoluteRegularization: 0.01,
        relativeRegularization: 0.01,
        covarianceMode: 'full',
        states: 1,
        transitionMode: 'ergodic'
      }
    }
  } // ...

};
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2ZXIvc2NoZW1hcy9zZXNzaW9uLmpzIl0sIm5hbWVzIjpbIm5hbWUiLCJ0eXBlIiwiZGVmYXVsdCIsImlkIiwiYXVkaW9GaWxlcyIsImxhYmVscyIsImxhYmVsQXVkaW9GaWxlVGFibGUiLCJncmFwaCIsImdyYXBoT3B0aW9ucyIsImdyYXBoT3B0aW9uc0V2ZW50IiwiZXZlbnQiLCJtb2RlbCIsIm51bGxhYmxlIiwiZXhhbXBsZXMiLCJsZWFybmluZ0NvbmZpZyIsInRhcmdldCIsInBheWxvYWQiLCJtb2RlbFR5cGUiLCJnYXVzc2lhbnMiLCJhYnNvbHV0ZVJlZ3VsYXJpemF0aW9uIiwicmVsYXRpdmVSZWd1bGFyaXphdGlvbiIsImNvdmFyaWFuY2VNb2RlIiwic3RhdGVzIiwidHJhbnNpdGlvbk1vZGUiXSwibWFwcGluZ3MiOiI7Ozs7OztlQUFlO0FBQ2JBLEVBQUFBLElBQUksRUFBRTtBQUNKQyxJQUFBQSxJQUFJLEVBQUUsUUFERjtBQUVKQyxJQUFBQSxPQUFPLEVBQUU7QUFGTCxHQURPO0FBS2JDLEVBQUFBLEVBQUUsRUFBRTtBQUNGRixJQUFBQSxJQUFJLEVBQUUsUUFESjtBQUVGQyxJQUFBQSxPQUFPLEVBQUU7QUFGUCxHQUxTO0FBU2JFLEVBQUFBLFVBQVUsRUFBRTtBQUNWSCxJQUFBQSxJQUFJLEVBQUUsS0FESTtBQUVWQyxJQUFBQSxPQUFPLEVBQUU7QUFGQyxHQVRDO0FBYWJHLEVBQUFBLE1BQU0sRUFBRTtBQUNOSixJQUFBQSxJQUFJLEVBQUUsS0FEQTtBQUVOQyxJQUFBQSxPQUFPLEVBQUU7QUFGSCxHQWJLO0FBa0JiSSxFQUFBQSxtQkFBbUIsRUFBRTtBQUNuQkwsSUFBQUEsSUFBSSxFQUFFLEtBRGE7QUFFbkJDLElBQUFBLE9BQU8sRUFBRTtBQUZVLEdBbEJSO0FBdUJiSyxFQUFBQSxLQUFLLEVBQUU7QUFDTE4sSUFBQUEsSUFBSSxFQUFFLEtBREQ7QUFFTEMsSUFBQUEsT0FBTyxFQUFFO0FBRkosR0F2Qk07QUE0QmI7QUFDQTtBQUNBTSxFQUFBQSxZQUFZLEVBQUU7QUFDWlAsSUFBQUEsSUFBSSxFQUFFLEtBRE07QUFFWkMsSUFBQUEsT0FBTyxFQUFFO0FBRkcsR0E5QkQ7QUFrQ2JPLEVBQUFBLGlCQUFpQixFQUFFO0FBQ2pCUixJQUFBQSxJQUFJLEVBQUUsS0FEVztBQUVqQkMsSUFBQUEsT0FBTyxFQUFFLEVBRlE7QUFHakJRLElBQUFBLEtBQUssRUFBRTtBQUhVLEdBbENOO0FBd0NiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQUMsRUFBQUEsS0FBSyxFQUFFO0FBQ0xWLElBQUFBLElBQUksRUFBRSxLQUREO0FBRUxDLElBQUFBLE9BQU8sRUFBRSxJQUZKO0FBR0xVLElBQUFBLFFBQVEsRUFBRTtBQUhMLEdBaERNO0FBcURiQyxFQUFBQSxRQUFRLEVBQUU7QUFDUlosSUFBQUEsSUFBSSxFQUFFLEtBREU7QUFFUkMsSUFBQUEsT0FBTyxFQUFFO0FBRkQsR0FyREc7QUF5RGJZLEVBQUFBLGNBQWMsRUFBRTtBQUNkYixJQUFBQSxJQUFJLEVBQUUsS0FEUTtBQUVkO0FBQ0FDLElBQUFBLE9BQU8sRUFBRTtBQUNQYSxNQUFBQSxNQUFNLEVBQUU7QUFDTmYsUUFBQUEsSUFBSSxFQUFFO0FBREEsT0FERDtBQUlQZ0IsTUFBQUEsT0FBTyxFQUFFO0FBQ1BDLFFBQUFBLFNBQVMsRUFBRSxLQURKO0FBRVBDLFFBQUFBLFNBQVMsRUFBRSxDQUZKO0FBR1BDLFFBQUFBLHNCQUFzQixFQUFFLElBSGpCO0FBSVBDLFFBQUFBLHNCQUFzQixFQUFFLElBSmpCO0FBS1BDLFFBQUFBLGNBQWMsRUFBRSxNQUxUO0FBTVBDLFFBQUFBLE1BQU0sRUFBRSxDQU5EO0FBT1BDLFFBQUFBLGNBQWMsRUFBRTtBQVBUO0FBSkY7QUFISyxHQXpESCxDQTJFYjs7QUEzRWEsQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZToge1xuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6ICcnLFxuICB9LFxuICBpZDoge1xuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6ICcnLFxuICB9LFxuICBhdWRpb0ZpbGVzOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogW10sXG4gIH0sXG4gIGxhYmVsczoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IFtdLFxuICB9LFxuXG4gIGxhYmVsQXVkaW9GaWxlVGFibGU6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBbXSxcbiAgfSxcblxuICBncmFwaDoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IHt9LFxuICB9LFxuXG4gIC8vIHRoZXNlIHR3byBhcmUgbm90IHBlcnNpc3RlZCBhcyBpcywgdGhleSBhcmUgbWl4ZWQgaW4gdGhlIFwiZ3JhcGhcIlxuICAvLyBAdG9kbyAtIGRvY3VtZW50IHRoaXMgYmVoYXZpb3IsIHRoaXMgaXMgaGFyZCB0byB1bmRlcnN0YW5kXG4gIGdyYXBoT3B0aW9uczoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IHt9LFxuICB9LFxuICBncmFwaE9wdGlvbnNFdmVudDoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IHt9LFxuICAgIGV2ZW50OiB0cnVlLFxuICB9LFxuXG4gIC8vIHRoaXMgc2hvdWxkIGJlbG9uZyB0byB0aGUgXCJlbmNvZGVyIC8gZGVjb2RlclwiXG4gIC8vIHRoaXMgbmVlZHMgdG8gYmUgZGlzY3Vzc2VkIGZ1cnRoZXIuLi4gd2hhdCB3b3VsZCBiZSBjbGVhblxuICAvLyBhcmNoaXRlY3R1cmUgLyBzdHJhdGVneSBmb3IgdGhhdCwgZS5nLlxuICAvLyAtIHdlIGRvbid0IHdhbnQgdG8gZGlzcGF0Y2ggdGhlIGV4YW1wbGVzIGV2ZXJ5d2hlcmUsXG4gIC8vIC0gaG93IHRvIGF0dGFjaCBhbiBleGFtcGxlIHRvIGEgcGFydGljdWxhciBlbmNvZGVyIC8gZGVjb2RlciBpbnN0YW5jZSxcbiAgLy8gLSBzYW1lIGZvciBjb25maWcsIGV0Yy5cbiAgLy9cbiAgLy8gQHNlZSBhbHNvIGBwbGF5ZXJgIHNjaGVtYVxuICBtb2RlbDoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gIH0sXG4gIGV4YW1wbGVzOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDoge30sXG4gIH0sXG4gIGxlYXJuaW5nQ29uZmlnOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgLy8gcG9zdHVyZSBkZWZhdWx0IGZvciBub3cuLi5cbiAgICBkZWZhdWx0OiB7XG4gICAgICB0YXJnZXQ6IHtcbiAgICAgICAgbmFtZTogJ3htbScsXG4gICAgICB9LFxuICAgICAgcGF5bG9hZDoge1xuICAgICAgICBtb2RlbFR5cGU6ICdnbW0nLFxuICAgICAgICBnYXVzc2lhbnM6IDEsXG4gICAgICAgIGFic29sdXRlUmVndWxhcml6YXRpb246IDAuMDEsXG4gICAgICAgIHJlbGF0aXZlUmVndWxhcml6YXRpb246IDAuMDEsXG4gICAgICAgIGNvdmFyaWFuY2VNb2RlOiAnZnVsbCcsXG4gICAgICAgIHN0YXRlczogMSxcbiAgICAgICAgdHJhbnNpdGlvbk1vZGU6ICdlcmdvZGljJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgLy8gLi4uXG59O1xuIl19