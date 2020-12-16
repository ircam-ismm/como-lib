"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _BaseModule = _interopRequireDefault(require("./BaseModule"));

var _lodash = _interopRequireDefault(require("lodash.clonedeep"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Bridge extends _BaseModule.default {
  constructor(graph, type, id, options) {
    super(graph, type, id, options);
    this._listeners = new Set();
  }

  subscribe(callback) {
    this._listeners.add(callback);

    return () => this._listeners.delete(callback);
  }

  execute(inputFrame) {
    const copy = (0, _lodash.default)(inputFrame.data);

    this._listeners.forEach(callback => callback(copy));
  }

}

var _default = Bridge;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tb24vbW9kdWxlcy9CcmlkZ2UuanMiXSwibmFtZXMiOlsiQnJpZGdlIiwiQmFzZU1vZHVsZSIsImNvbnN0cnVjdG9yIiwiZ3JhcGgiLCJ0eXBlIiwiaWQiLCJvcHRpb25zIiwiX2xpc3RlbmVycyIsIlNldCIsInN1YnNjcmliZSIsImNhbGxiYWNrIiwiYWRkIiwiZGVsZXRlIiwiZXhlY3V0ZSIsImlucHV0RnJhbWUiLCJjb3B5IiwiZGF0YSIsImZvckVhY2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7OztBQUVBLE1BQU1BLE1BQU4sU0FBcUJDLG1CQUFyQixDQUFnQztBQUM5QkMsRUFBQUEsV0FBVyxDQUFDQyxLQUFELEVBQVFDLElBQVIsRUFBY0MsRUFBZCxFQUFrQkMsT0FBbEIsRUFBMkI7QUFDcEMsVUFBTUgsS0FBTixFQUFhQyxJQUFiLEVBQW1CQyxFQUFuQixFQUF1QkMsT0FBdkI7QUFFQSxTQUFLQyxVQUFMLEdBQWtCLElBQUlDLEdBQUosRUFBbEI7QUFDRDs7QUFFREMsRUFBQUEsU0FBUyxDQUFDQyxRQUFELEVBQVc7QUFDbEIsU0FBS0gsVUFBTCxDQUFnQkksR0FBaEIsQ0FBb0JELFFBQXBCOztBQUVBLFdBQU8sTUFBTSxLQUFLSCxVQUFMLENBQWdCSyxNQUFoQixDQUF1QkYsUUFBdkIsQ0FBYjtBQUNEOztBQUVERyxFQUFBQSxPQUFPLENBQUNDLFVBQUQsRUFBYTtBQUNsQixVQUFNQyxJQUFJLEdBQUcscUJBQVVELFVBQVUsQ0FBQ0UsSUFBckIsQ0FBYjs7QUFDQSxTQUFLVCxVQUFMLENBQWdCVSxPQUFoQixDQUF3QlAsUUFBUSxJQUFJQSxRQUFRLENBQUNLLElBQUQsQ0FBNUM7QUFDRDs7QUFoQjZCOztlQW1CakJmLE0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZU1vZHVsZSBmcm9tICcuL0Jhc2VNb2R1bGUnO1xuaW1wb3J0IGNsb25lRGVlcCBmcm9tICdsb2Rhc2guY2xvbmVkZWVwJztcblxuY2xhc3MgQnJpZGdlIGV4dGVuZHMgQmFzZU1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKGdyYXBoLCB0eXBlLCBpZCwgb3B0aW9ucykge1xuICAgIHN1cGVyKGdyYXBoLCB0eXBlLCBpZCwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9saXN0ZW5lcnMgPSBuZXcgU2V0KCk7XG4gIH1cblxuICBzdWJzY3JpYmUoY2FsbGJhY2spIHtcbiAgICB0aGlzLl9saXN0ZW5lcnMuYWRkKGNhbGxiYWNrKTtcblxuICAgIHJldHVybiAoKSA9PiB0aGlzLl9saXN0ZW5lcnMuZGVsZXRlKGNhbGxiYWNrKTtcbiAgfVxuXG4gIGV4ZWN1dGUoaW5wdXRGcmFtZSkge1xuICAgIGNvbnN0IGNvcHkgPSBjbG9uZURlZXAoaW5wdXRGcmFtZS5kYXRhKTtcbiAgICB0aGlzLl9saXN0ZW5lcnMuZm9yRWFjaChjYWxsYmFjayA9PiBjYWxsYmFjayhjb3B5KSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQnJpZGdlO1xuIl19