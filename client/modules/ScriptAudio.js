"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _AudioModule = _interopRequireDefault(require("./AudioModule.js"));

var _index = _interopRequireDefault(require("../helpers/index.js"));

var _json = _interopRequireDefault(require("json5"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// extend AudioModule to have the bypass node
// @note - the implmentation is mostly the same as ScriptData, but we can't
// derive 2 parents... maybe mixin would help
class ScriptAudio extends _AudioModule.default {
  constructor(graph, type, id, options) {
    // @note - these defaults are weak, we must reinforce this
    options = Object.assign({
      scriptName: 'default'
    }, options);
    super(graph, type, id, options);
    this.scriptService = this.graph.como.experience.plugins['scripts-audio'];
    this.script = null;
  }

  async init() {
    await this.setScript(this.options.scriptName);
  }

  async destroy() {
    super.destroy();

    if (this.script !== null) {
      const script = this.script;
      this.script = null; // this will call the onDetach callback and thus destroy the script

      await script.detach();
    }
  }

  async updateOptions(options) {
    super.updateOptions(options);

    if (!this.script || this.options.scriptName !== this.script.name) {
      await this.setScript(this.options.scriptName);
    }

    if (this.scriptModule && this.options.scriptParams) {
      if (typeof this.options.scriptParams === 'string') {
        try {
          this.options.scriptParams = _json.default.parse(this.options.scriptParams);
        } catch (err) {
          console.error(`Invalid script param, please provide a proper javascript object`);
          console.error(err);
        }
      }

      this.scriptModule.updateParams(this.options.scriptParams);
    }
  }

  async setScript(scriptName) {
    if (this.script !== null) {
      await this.script.detach();
      this.script = null;
    }

    this.script = await this.scriptService.attach(scriptName);
    this.script.subscribe(updates => {
      if (!updates.error) {
        this.initScript();
      }
    });
    this.script.onDetach(() => {
      this.scriptModule.destroy();
      this.scriptModule = null;
    });
    this.initScript();
  }

  initScript() {
    if (this.scriptModule) {
      this.scriptModule.destroy();
    }

    try {
      const scriptModule = this.script.execute(this.graph, _index.default, this.passThroughInNode, this.passThroughOutNode, this.outputFrame);

      if (!('process' in scriptModule) || !('destroy' in scriptModule) || !('updateParams' in scriptModule)) {
        throw new Error(`Invalid scriptModule "${this.script.name}", the script should return an object { updateParams, process, destroy }`);
      }

      this.scriptModule = scriptModule;
    } catch (err) {
      console.log(err);
    }
  }

  execute(inputFrame) {
    if (this.scriptModule) {
      this.outputFrame = this.scriptModule.process(inputFrame, this.outputFrame);
    }

    return this.outputFrame;
  }

}

var _default = ScriptAudio;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGllbnQvbW9kdWxlcy9TY3JpcHRBdWRpby5qcyJdLCJuYW1lcyI6WyJTY3JpcHRBdWRpbyIsIkF1ZGlvTW9kdWxlIiwiY29uc3RydWN0b3IiLCJncmFwaCIsInR5cGUiLCJpZCIsIm9wdGlvbnMiLCJPYmplY3QiLCJhc3NpZ24iLCJzY3JpcHROYW1lIiwic2NyaXB0U2VydmljZSIsImNvbW8iLCJleHBlcmllbmNlIiwicGx1Z2lucyIsInNjcmlwdCIsImluaXQiLCJzZXRTY3JpcHQiLCJkZXN0cm95IiwiZGV0YWNoIiwidXBkYXRlT3B0aW9ucyIsIm5hbWUiLCJzY3JpcHRNb2R1bGUiLCJzY3JpcHRQYXJhbXMiLCJKU09ONSIsInBhcnNlIiwiZXJyIiwiY29uc29sZSIsImVycm9yIiwidXBkYXRlUGFyYW1zIiwiYXR0YWNoIiwic3Vic2NyaWJlIiwidXBkYXRlcyIsImluaXRTY3JpcHQiLCJvbkRldGFjaCIsImV4ZWN1dGUiLCJoZWxwZXJzIiwicGFzc1Rocm91Z2hJbk5vZGUiLCJwYXNzVGhyb3VnaE91dE5vZGUiLCJvdXRwdXRGcmFtZSIsIkVycm9yIiwibG9nIiwiaW5wdXRGcmFtZSIsInByb2Nlc3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7OztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU1BLFdBQU4sU0FBMEJDLG9CQUExQixDQUFzQztBQUNwQ0MsRUFBQUEsV0FBVyxDQUFDQyxLQUFELEVBQVFDLElBQVIsRUFBY0MsRUFBZCxFQUFrQkMsT0FBbEIsRUFBMkI7QUFDcEM7QUFDQUEsSUFBQUEsT0FBTyxHQUFHQyxNQUFNLENBQUNDLE1BQVAsQ0FBYztBQUFFQyxNQUFBQSxVQUFVLEVBQUU7QUFBZCxLQUFkLEVBQXlDSCxPQUF6QyxDQUFWO0FBQ0EsVUFBTUgsS0FBTixFQUFhQyxJQUFiLEVBQW1CQyxFQUFuQixFQUF1QkMsT0FBdkI7QUFFQSxTQUFLSSxhQUFMLEdBQXFCLEtBQUtQLEtBQUwsQ0FBV1Es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QUFZTSxJQUFLLDBFQUFwRCxDQUFOO0FBQ0Q7O0FBRUQsV0FBS0MsWUFBTCxHQUFvQkEsWUFBcEI7QUFDRCxLQWpCRCxDQWlCRSxPQUFNSSxHQUFOLEVBQVc7QUFDWEMsTUFBQUEsT0FBTyxDQUFDYyxHQUFSLENBQVlmLEdBQVo7QUFDRDtBQUNGOztBQUVEUyxFQUFBQSxPQUFPLENBQUNPLFVBQUQsRUFBYTtBQUNsQixRQUFJLEtBQUtwQixZQUFULEVBQXVCO0FBQ3JCLFdBQUtpQixXQUFMLEdBQW1CLEtBQUtqQixZQUFMLENBQWtCcUIsT0FBbEIsQ0FBMEJELFVBQTFCLEVBQXNDLEtBQUtILFdBQTNDLENBQW5CO0FBQ0Q7O0FBRUQsV0FBTyxLQUFLQSxXQUFaO0FBQ0Q7O0FBdEdtQzs7ZUF5R3ZCdEMsVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBdWRpb01vZHVsZSBmcm9tICcuL0F1ZGlvTW9kdWxlLmpzJztcbmltcG9ydCBoZWxwZXJzIGZyb20gJy4uL2hlbHBlcnMvaW5kZXguanMnO1xuaW1wb3J0IEpTT041IGZyb20gJ2pzb241JztcblxuLy8gZXh0ZW5kIEF1ZGlvTW9kdWxlIHRvIGhhdmUgdGhlIGJ5cGFzcyBub2RlXG4vLyBAbm90ZSAtIHRoZSBpbXBsbWVudGF0aW9uIGlzIG1vc3RseSB0aGUgc2FtZSBhcyBTY3JpcHREYXRhLCBidXQgd2UgY2FuJ3Rcbi8vIGRlcml2ZSAyIHBhcmVudHMuLi4gbWF5YmUgbWl4aW4gd291bGQgaGVscFxuY2xhc3MgU2NyaXB0QXVkaW8gZXh0ZW5kcyBBdWRpb01vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKGdyYXBoLCB0eXBlLCBpZCwgb3B0aW9ucykge1xuICAgIC8vIEBub3RlIC0gdGhlc2UgZGVmYXVsdHMgYXJlIHdlYWssIHdlIG11c3QgcmVpbmZvcmNlIHRoaXNcbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7IHNjcmlwdE5hbWU6ICdkZWZhdWx0JyB9LCBvcHRpb25zKTtcbiAgICBzdXBlcihncmFwaCwgdHlwZSwgaWQsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5zY3JpcHRTZXJ2aWNlID0gdGhpcy5ncmFwaC5jb21vLmV4cGVyaWVuY2UucGx1Z2luc1snc2NyaXB0cy1hdWRpbyddO1xuXG4gICAgdGhpcy5zY3JpcHQgPSBudWxsO1xuICB9XG5cbiAgYXN5bmMgaW5pdCgpIHtcbiAgICBhd2FpdCB0aGlzLnNldFNjcmlwdCh0aGlzLm9wdGlvbnMuc2NyaXB0TmFtZSk7XG4gIH1cblxuICBhc3luYyBkZXN0cm95KCkge1xuICAgIHN1cGVyLmRlc3Ryb3koKTtcblxuICAgIGlmICh0aGlzLnNjcmlwdCAhPT0gbnVsbCkge1xuICAgICAgY29uc3Qgc2NyaXB0ID0gdGhpcy5zY3JpcHQ7XG4gICAgICB0aGlzLnNjcmlwdCA9IG51bGw7XG4gICAgICAvLyB0aGlzIHdpbGwgY2FsbCB0aGUgb25EZXRhY2ggY2FsbGJhY2sgYW5kIHRodXMgZGVzdHJveSB0aGUgc2NyaXB0XG4gICAgICBhd2FpdCBzY3JpcHQuZGV0YWNoKCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgdXBkYXRlT3B0aW9ucyhvcHRpb25zKSB7XG4gICAgc3VwZXIudXBkYXRlT3B0aW9ucyhvcHRpb25zKTtcblxuICAgIGlmICghdGhpcy5zY3JpcHQgfHwgKHRoaXMub3B0aW9ucy5zY3JpcHROYW1lICE9PSB0aGlzLnNjcmlwdC5uYW1lKSkge1xuICAgICAgYXdhaXQgdGhpcy5zZXRTY3JpcHQodGhpcy5vcHRpb25zLnNjcmlwdE5hbWUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNjcmlwdE1vZHVsZSAmJiB0aGlzLm9wdGlvbnMuc2NyaXB0UGFyYW1zKSB7XG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5zY3JpcHRQYXJhbXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zLnNjcmlwdFBhcmFtcyA9IEpTT041LnBhcnNlKHRoaXMub3B0aW9ucy5zY3JpcHRQYXJhbXMpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGBJbnZhbGlkIHNjcmlwdCBwYXJhbSwgcGxlYXNlIHByb3ZpZGUgYSBwcm9wZXIgamF2YXNjcmlwdCBvYmplY3RgKTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5zY3JpcHRNb2R1bGUudXBkYXRlUGFyYW1zKHRoaXMub3B0aW9ucy5zY3JpcHRQYXJhbXMpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHNldFNjcmlwdChzY3JpcHROYW1lKSB7XG4gICAgaWYgKHRoaXMuc2NyaXB0ICE9PSBudWxsKSB7XG4gICAgICBhd2FpdCB0aGlzLnNjcmlwdC5kZXRhY2goKTtcbiAgICAgIHRoaXMuc2NyaXB0ID0gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLnNjcmlwdCA9IGF3YWl0IHRoaXMuc2NyaXB0U2VydmljZS5hdHRhY2goc2NyaXB0TmFtZSk7XG5cbiAgICB0aGlzLnNjcmlwdC5zdWJzY3JpYmUodXBkYXRlcyA9PiB7XG4gICAgICBpZiAoIXVwZGF0ZXMuZXJyb3IpIHtcbiAgICAgICAgdGhpcy5pbml0U2NyaXB0KCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLnNjcmlwdC5vbkRldGFjaCgoKSA9PiB7XG4gICAgICB0aGlzLnNjcmlwdE1vZHVsZS5kZXN0cm95KCk7XG4gICAgICB0aGlzLnNjcmlwdE1vZHVsZSA9IG51bGw7XG4gICAgfSk7XG5cbiAgICB0aGlzLmluaXRTY3JpcHQoKTtcbiAgfVxuXG4gIGluaXRTY3JpcHQoKSB7XG4gICAgaWYgKHRoaXMuc2NyaXB0TW9kdWxlKSB7XG4gICAgICB0aGlzLnNjcmlwdE1vZHVsZS5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHNjcmlwdE1vZHVsZSA9IHRoaXMuc2NyaXB0LmV4ZWN1dGUoXG4gICAgICAgIHRoaXMuZ3JhcGgsXG4gICAgICAgIGhlbHBlcnMsXG4gICAgICAgIHRoaXMucGFzc1Rocm91Z2hJbk5vZGUsXG4gICAgICAgIHRoaXMucGFzc1Rocm91Z2hPdXROb2RlLFxuICAgICAgICB0aGlzLm91dHB1dEZyYW1lXG4gICAgICApO1xuXG4gICAgICBpZiAoISgncHJvY2VzcycgaW4gc2NyaXB0TW9kdWxlKSB8fFxuICAgICAgICAgICEoJ2Rlc3Ryb3knIGluIHNjcmlwdE1vZHVsZSkgfHxcbiAgICAgICAgICAhKCd1cGRhdGVQYXJhbXMnIGluIHNjcmlwdE1vZHVsZSlcbiAgICAgICkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgc2NyaXB0TW9kdWxlIFwiJHt0aGlzLnNjcmlwdC5uYW1lfVwiLCB0aGUgc2NyaXB0IHNob3VsZCByZXR1cm4gYW4gb2JqZWN0IHsgdXBkYXRlUGFyYW1zLCBwcm9jZXNzLCBkZXN0cm95IH1gKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zY3JpcHRNb2R1bGUgPSBzY3JpcHRNb2R1bGU7XG4gICAgfSBjYXRjaChlcnIpIHtcbiAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgfVxuICB9XG5cbiAgZXhlY3V0ZShpbnB1dEZyYW1lKSB7XG4gICAgaWYgKHRoaXMuc2NyaXB0TW9kdWxlKSB7XG4gICAgICB0aGlzLm91dHB1dEZyYW1lID0gdGhpcy5zY3JpcHRNb2R1bGUucHJvY2VzcyhpbnB1dEZyYW1lLCB0aGlzLm91dHB1dEZyYW1lKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5vdXRwdXRGcmFtZTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTY3JpcHRBdWRpbztcbiJdfQ==