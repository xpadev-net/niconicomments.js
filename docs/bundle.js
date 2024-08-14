/*!
  niconicomments.js v0.2.72
  (c) 2021 xpadev-net https://xpadev.net
  Released under the MIT License.
*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.NiconiComments = factory());
})(this, (function () { 'use strict';

    let imageCache = {};
    const resetImageCache = () => {
        imageCache = {};
    };

    let nicoScripts = {
        reverse: [],
        default: [],
        replace: [],
        ban: [],
        seekDisable: [],
        jump: [],
    };
    const resetNicoScripts = () => {
        nicoScripts = {
            reverse: [],
            default: [],
            replace: [],
            ban: [],
            seekDisable: [],
            jump: [],
        };
    };

    let plugins = [];
    const setPlugins = (input) => {
        plugins = input;
    };

    var index$4 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        get imageCache () { return imageCache; },
        get nicoScripts () { return nicoScripts; },
        get plugins () { return plugins; },
        resetImageCache: resetImageCache,
        resetNicoScripts: resetNicoScripts,
        setPlugins: setPlugins
    });

    let isDebug = false;
    const setIsDebug = (val) => {
        isDebug = val;
    };

    let defaultConfig;
    const updateConfig = (config) => {
        defaultConfig = config;
    };
    const defaultOptions = {
        config: {},
        debug: false,
        enableLegacyPiP: false,
        format: "default",
        formatted: false,
        keepCA: false,
        mode: "default",
        scale: 1,
        showCollision: false,
        showCommentCount: false,
        showFPS: false,
        useLegacy: false,
        video: undefined,
        lazy: false,
    };
    let config;
    let options;
    const setConfig = (value) => {
        config = value;
    };
    const setOptions = (value) => {
        options = value;
    };

    var config$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        get config () { return config; },
        get defaultConfig () { return defaultConfig; },
        defaultOptions: defaultOptions,
        get options () { return options; },
        setConfig: setConfig,
        setOptions: setOptions,
        updateConfig: updateConfig
    });

    class CanvasRenderingContext2DError extends Error {
        constructor(options = {}) {
            super("CanvasRenderingContext2DError", options);
        }
    }
    CanvasRenderingContext2DError.prototype.name = "CanvasRenderingContext2DError";

    class InvalidFormatError extends Error {
        constructor(options = {}) {
            super("InvalidFormatError", options);
        }
    }
    InvalidFormatError.prototype.name = "InvalidFormatError";

    class InvalidOptionError extends Error {
        constructor(options = {}) {
            super("Invalid option\nPlease check document: https://xpadev-net.github.io/niconicomments/#p_options", options);
        }
    }
    InvalidOptionError.prototype.name = "InvalidOptionError";

    class NotImplementedError extends Error {
        pluginName;
        methodName;
        constructor(pluginName, methodName, options = {}) {
            super("NotImplementedError", options);
            this.pluginName = pluginName;
            this.methodName = methodName;
        }
    }
    NotImplementedError.prototype.name = "NotImplementedError";

    var index$3 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        CanvasRenderingContext2DError: CanvasRenderingContext2DError,
        InvalidFormatError: InvalidFormatError,
        InvalidOptionError: InvalidOptionError,
        NotImplementedError: NotImplementedError
    });

    const arrayPush = (_array, key, push) => {
        let array = _array;
        if (!array) {
            array = {};
        }
        if (!array[Number(key)]) {
            array[Number(key)] = [];
        }
        array[Number(key)]?.push(push);
    };
    const arrayEqual = (a, b) => {
        if (a.length !== b.length)
            return false;
        for (let i = 0, n = a.length; i < n; ++i) {
            if (a[i] !== b[i])
                return false;
        }
        return true;
    };

    const hex2rgb = (_hex) => {
        let hex = _hex;
        if (hex.startsWith("#"))
            hex = hex.slice(1);
        if (hex.length === 3)
            hex =
                hex.slice(0, 1) +
                    hex.slice(0, 1) +
                    hex.slice(1, 2) +
                    hex.slice(1, 2) +
                    hex.slice(2, 3) +
                    hex.slice(2, 3);
        return [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)].map((str) => Number.parseInt(str, 16));
    };
    const hex2rgba = (_hex) => {
        let hex = _hex;
        if (hex.startsWith("#"))
            hex = hex.slice(1);
        if (hex.length === 4)
            hex =
                hex.slice(0, 1) +
                    hex.slice(0, 1) +
                    hex.slice(1, 2) +
                    hex.slice(1, 2) +
                    hex.slice(2, 3) +
                    hex.slice(2, 3) +
                    hex.slice(3, 4) +
                    hex.slice(3, 4);
        return [
            hex.slice(0, 2),
            hex.slice(2, 4),
            hex.slice(4, 6),
            hex.slice(4, 6),
        ].map((str, index) => {
            if (index === 3)
                return Number.parseInt(str, 16) / 256;
            return Number.parseInt(str, 16);
        });
    };
    const getStrokeColor = (comment) => {
        if (comment.strokeColor) {
            const color = comment.strokeColor.slice(1);
            const length = color.length;
            if (length === 3 || length === 6) {
                return `rgba(${hex2rgb(color).join(",")},${config.contextStrokeOpacity})`;
            }
            if (length === 4 || length === 8) {
                return `rgba(${hex2rgba(color).join(",")})`;
            }
        }
        return `rgba(${hex2rgb(comment.color === "#000000"
        ? config.contextStrokeInversionColor
        : config.contextStrokeColor).join(",")},${config.contextStrokeOpacity})`;
    };

    function _callSuper(t, o, e) {
      return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
    }
    function _construct(t, e, r) {
      if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments);
      var o = [null];
      o.push.apply(o, e);
      var p = new (t.bind.apply(t, o))();
      return r && _setPrototypeOf(p, r.prototype), p;
    }
    function _isNativeReflectConstruct() {
      try {
        var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      } catch (t) {}
      return (_isNativeReflectConstruct = function () {
        return !!t;
      })();
    }
    function _iterableToArrayLimit(r, l) {
      var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
      if (null != t) {
        var e,
          n,
          i,
          u,
          a = [],
          f = !0,
          o = !1;
        try {
          if (i = (t = t.call(r)).next, 0 === l) {
            if (Object(t) !== t) return;
            f = !1;
          } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
        } catch (r) {
          o = !0, n = r;
        } finally {
          try {
            if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
          } finally {
            if (o) throw n;
          }
        }
        return a;
      }
    }
    function ownKeys(e, r) {
      var t = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        r && (o = o.filter(function (r) {
          return Object.getOwnPropertyDescriptor(e, r).enumerable;
        })), t.push.apply(t, o);
      }
      return t;
    }
    function _objectSpread2(e) {
      for (var r = 1; r < arguments.length; r++) {
        var t = null != arguments[r] ? arguments[r] : {};
        r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
          _defineProperty(e, r, t[r]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
          Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
        });
      }
      return e;
    }
    function _toPrimitive(t, r) {
      if ("object" != typeof t || !t) return t;
      var e = t[Symbol.toPrimitive];
      if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === r ? String : Number)(t);
    }
    function _toPropertyKey(t) {
      var i = _toPrimitive(t, "string");
      return "symbol" == typeof i ? i : i + "";
    }
    function _typeof(o) {
      "@babel/helpers - typeof";

      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
        return typeof o;
      } : function (o) {
        return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
      }, _typeof(o);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", {
        writable: false
      });
      return Constructor;
    }
    function _defineProperty(obj, key, value) {
      key = _toPropertyKey(key);
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function _inherits(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
          value: subClass,
          writable: true,
          configurable: true
        }
      });
      Object.defineProperty(subClass, "prototype", {
        writable: false
      });
      if (superClass) _setPrototypeOf(subClass, superClass);
    }
    function _getPrototypeOf(o) {
      _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
      return _getPrototypeOf(o);
    }
    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
      };
      return _setPrototypeOf(o, p);
    }
    function _isNativeFunction(fn) {
      try {
        return Function.toString.call(fn).indexOf("[native code]") !== -1;
      } catch (e) {
        return typeof fn === "function";
      }
    }
    function _wrapNativeSuper(Class) {
      var _cache = typeof Map === "function" ? new Map() : undefined;
      _wrapNativeSuper = function _wrapNativeSuper(Class) {
        if (Class === null || !_isNativeFunction(Class)) return Class;
        if (typeof Class !== "function") {
          throw new TypeError("Super expression must either be null or a function");
        }
        if (typeof _cache !== "undefined") {
          if (_cache.has(Class)) return _cache.get(Class);
          _cache.set(Class, Wrapper);
        }
        function Wrapper() {
          return _construct(Class, arguments, _getPrototypeOf(this).constructor);
        }
        Wrapper.prototype = Object.create(Class.prototype, {
          constructor: {
            value: Wrapper,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
        return _setPrototypeOf(Wrapper, Class);
      };
      return _wrapNativeSuper(Class);
    }
    function _assertThisInitialized(self) {
      if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }
      return self;
    }
    function _possibleConstructorReturn(self, call) {
      if (call && (typeof call === "object" || typeof call === "function")) {
        return call;
      } else if (call !== void 0) {
        throw new TypeError("Derived constructors may only return object or undefined");
      }
      return _assertThisInitialized(self);
    }
    function _slicedToArray(arr, i) {
      return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
    }
    function _toConsumableArray(arr) {
      return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
    }
    function _arrayWithoutHoles(arr) {
      if (Array.isArray(arr)) return _arrayLikeToArray(arr);
    }
    function _arrayWithHoles(arr) {
      if (Array.isArray(arr)) return arr;
    }
    function _iterableToArray(iter) {
      if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
    }
    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }
    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
      for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
      return arr2;
    }
    function _nonIterableSpread() {
      throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    function _createForOfIteratorHelper(o, allowArrayLike) {
      var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
      if (!it) {
        if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
          if (it) o = it;
          var i = 0;
          var F = function () {};
          return {
            s: F,
            n: function () {
              if (i >= o.length) return {
                done: true
              };
              return {
                done: false,
                value: o[i++]
              };
            },
            e: function (e) {
              throw e;
            },
            f: F
          };
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      var normalCompletion = true,
        didErr = false,
        err;
      return {
        s: function () {
          it = it.call(o);
        },
        n: function () {
          var step = it.next();
          normalCompletion = step.done;
          return step;
        },
        e: function (e) {
          didErr = true;
          err = e;
        },
        f: function () {
          try {
            if (!normalCompletion && it.return != null) it.return();
          } finally {
            if (didErr) throw err;
          }
        }
      };
    }

    // src/error/ValiError/ValiError.ts
    var ValiError = /*#__PURE__*/function (_Error) {
      /**
       * Creates a Valibot error with useful information.
       *
       * @param issues The error issues.
       */
      function ValiError(issues) {
        var _this;
        _classCallCheck(this, ValiError);
        _this = _callSuper(this, ValiError, [issues[0].message]);
        _defineProperty(_this, "issues", void 0);
        _this.name = "ValiError";
        _this.issues = issues;
        return _this;
      }
      _inherits(ValiError, _Error);
      return _createClass(ValiError);
    }( /*#__PURE__*/_wrapNativeSuper(Error));

    // src/utils/actionIssue/actionIssue.ts
    function actionIssue(context, reference, input, label, received) {
      return {
        issues: [{
          context: context,
          reference: reference,
          input: input,
          label: label,
          received: received
        }]
      };
    }

    // src/utils/actionOutput/actionOutput.ts
    function actionOutput(output) {
      return {
        output: output
      };
    }

    // src/utils/defaultArgs/defaultArgs.ts
    function defaultArgs(arg1, arg2) {
      return Array.isArray(arg1) ? [void 0, arg1] : [arg1, arg2];
    }

    // src/storages/globalConfig/globalConfig.ts
    var store;
    function getGlobalConfig(config) {
      var _config$lang, _store, _config$abortEarly, _store2, _config$abortPipeEarl, _store3, _config$skipPipe, _store4;
      return {
        lang: (_config$lang = config === null || config === void 0 ? void 0 : config.lang) !== null && _config$lang !== void 0 ? _config$lang : (_store = store) === null || _store === void 0 ? void 0 : _store.lang,
        message: config === null || config === void 0 ? void 0 : config.message,
        abortEarly: (_config$abortEarly = config === null || config === void 0 ? void 0 : config.abortEarly) !== null && _config$abortEarly !== void 0 ? _config$abortEarly : (_store2 = store) === null || _store2 === void 0 ? void 0 : _store2.abortEarly,
        abortPipeEarly: (_config$abortPipeEarl = config === null || config === void 0 ? void 0 : config.abortPipeEarly) !== null && _config$abortPipeEarl !== void 0 ? _config$abortPipeEarl : (_store3 = store) === null || _store3 === void 0 ? void 0 : _store3.abortPipeEarly,
        skipPipe: (_config$skipPipe = config === null || config === void 0 ? void 0 : config.skipPipe) !== null && _config$skipPipe !== void 0 ? _config$skipPipe : (_store4 = store) === null || _store4 === void 0 ? void 0 : _store4.skipPipe
      };
    }

    // src/storages/globalMessage/globalMessage.ts
    var store2;
    function getGlobalMessage(lang) {
      var _store5;
      return (_store5 = store2) === null || _store5 === void 0 ? void 0 : _store5.get(lang);
    }

    // src/storages/schemaMessage/schemaMessage.ts
    var store3;
    function getSchemaMessage(lang) {
      var _store7;
      return (_store7 = store3) === null || _store7 === void 0 ? void 0 : _store7.get(lang);
    }

    // src/storages/specificMessage/specificMessage.ts
    var store4;
    function getSpecificMessage(reference, lang) {
      var _store9;
      return (_store9 = store4) === null || _store9 === void 0 || (_store9 = _store9.get(reference)) === null || _store9 === void 0 ? void 0 : _store9.get(lang);
    }

    // src/utils/i18n/i18n.ts
    function i18n(schema, context, reference, config, issue) {
      var _ref3, _ref4, _ref5, _ref6, _context$message;
      var message = (_ref3 = (_ref4 = (_ref5 = (_ref6 = (_context$message = context.message) !== null && _context$message !== void 0 ? _context$message : getSpecificMessage(reference, issue.lang)) !== null && _ref6 !== void 0 ? _ref6 : schema ? getSchemaMessage(issue.lang) : null) !== null && _ref5 !== void 0 ? _ref5 : config === null || config === void 0 ? void 0 : config.message) !== null && _ref4 !== void 0 ? _ref4 : getGlobalMessage(issue.lang)) !== null && _ref3 !== void 0 ? _ref3 : issue.message;
      return typeof message === "function" ? message(issue) : message;
    }

    // src/utils/schemaResult/schemaResult.ts
    function schemaResult(typed, output, issues) {
      return {
        typed: typed,
        output: output,
        issues: issues
      };
    }

    // src/utils/stringify/stringify.ts
    function stringify(input) {
      var type = _typeof(input);
      if (type === "object") {
        type = input ? Object.getPrototypeOf(input).constructor.name : "null";
      }
      return type === "string" ? "\"".concat(input, "\"") : type === "number" || type === "bigint" || type === "boolean" ? "".concat(input) : type;
    }

    // src/utils/pipeResult/utils/pipeIssue/pipeIssue.ts
    function pipeIssue(context, config, issue) {
      var _issue$received;
      var received = (_issue$received = issue.received) !== null && _issue$received !== void 0 ? _issue$received : stringify(issue.input);
      var schemaIssue2 = {
        reason: context.type,
        context: issue.context.type,
        expected: issue.context.expects,
        received: received,
        message: "Invalid ".concat(issue.label, ": ").concat(issue.context.expects ? "Expected ".concat(issue.context.expects, " but r") : "R", "eceived ").concat(received),
        input: issue.input,
        requirement: issue.context.requirement,
        path: issue.path,
        lang: config === null || config === void 0 ? void 0 : config.lang,
        abortEarly: config === null || config === void 0 ? void 0 : config.abortEarly,
        abortPipeEarly: config === null || config === void 0 ? void 0 : config.abortPipeEarly,
        skipPipe: config === null || config === void 0 ? void 0 : config.skipPipe
      };
      schemaIssue2.message = i18n(false, issue.context, issue.reference, config, schemaIssue2);
      return schemaIssue2;
    }

    // src/utils/pipeResult/pipeResult.ts
    function pipeResult(context, input, config, issues) {
      if (context.pipe && !(config !== null && config !== void 0 && config.skipPipe)) {
        var _iterator = _createForOfIteratorHelper(context.pipe),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var action = _step.value;
            var result = action._parse(input);
            if (result.issues) {
              var _iterator2 = _createForOfIteratorHelper(result.issues),
                _step2;
              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  var actionIssue2 = _step2.value;
                  var schemaIssue2 = pipeIssue(context, config, actionIssue2);
                  issues ? issues.push(schemaIssue2) : issues = [schemaIssue2];
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }
              if (config !== null && config !== void 0 && config.abortEarly || config !== null && config !== void 0 && config.abortPipeEarly) {
                break;
              }
            } else {
              input = result.output;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
      return schemaResult(true, input, issues);
    }
    function restAndDefaultArgs(arg1, arg2, arg3) {
      if (!arg1 || _typeof(arg1) === "object" && !Array.isArray(arg1)) {
        var _defaultArgs = defaultArgs(arg2, arg3),
          _defaultArgs2 = _slicedToArray(_defaultArgs, 2),
          error2 = _defaultArgs2[0],
          pipe2 = _defaultArgs2[1];
        return [arg1, error2, pipe2];
      }
      var _defaultArgs3 = defaultArgs(arg1, arg2),
        _defaultArgs4 = _slicedToArray(_defaultArgs3, 2),
        error = _defaultArgs4[0],
        pipe = _defaultArgs4[1];
      return [void 0, error, pipe];
    }

    // src/utils/schemaIssue/schemaIssue.ts
    function schemaIssue(context, reference, input, config, other) {
      var _other$expected, _other$reason;
      var received = stringify(input);
      var expected = (_other$expected = other === null || other === void 0 ? void 0 : other.expected) !== null && _other$expected !== void 0 ? _other$expected : context.expects;
      var issue = {
        reason: (_other$reason = other === null || other === void 0 ? void 0 : other.reason) !== null && _other$reason !== void 0 ? _other$reason : "type",
        context: context.type,
        expected: expected,
        received: received,
        message: "Invalid type: Expected ".concat(expected, " but received ").concat(received),
        input: input,
        path: other === null || other === void 0 ? void 0 : other.path,
        issues: other === null || other === void 0 ? void 0 : other.issues,
        lang: config === null || config === void 0 ? void 0 : config.lang,
        abortEarly: config === null || config === void 0 ? void 0 : config.abortEarly,
        abortPipeEarly: config === null || config === void 0 ? void 0 : config.abortPipeEarly,
        skipPipe: config === null || config === void 0 ? void 0 : config.skipPipe
      };
      issue.message = i18n(true, context, reference, config, issue);
      return {
        typed: false,
        output: input,
        issues: [issue]
      };
    }

    // src/methods/getDefault/getDefault.ts
    function getDefault(schema) {
      return typeof schema["default"] === "function" ? schema["default"]() : schema["default"];
    }
    function is(schema, input, config) {
      var _getGlobalConfig;
      return !schema._parse(input, {
        abortEarly: true,
        skipPipe: (_getGlobalConfig = getGlobalConfig(config)) === null || _getGlobalConfig === void 0 ? void 0 : _getGlobalConfig.skipPipe
      }).issues;
    }

    // src/schemas/array/array.ts
    function array(item, arg2, arg3) {
      var _defaultArgs5 = defaultArgs(arg2, arg3),
        _defaultArgs6 = _slicedToArray(_defaultArgs5, 2),
        message = _defaultArgs6[0],
        pipe = _defaultArgs6[1];
      return {
        type: "array",
        expects: "Array",
        async: false,
        item: item,
        message: message,
        pipe: pipe,
        _parse: function _parse(input, config) {
          if (Array.isArray(input)) {
            var typed = true;
            var issues;
            var output = [];
            for (var key = 0; key < input.length; key++) {
              var value2 = input[key];
              var result = this.item._parse(value2, config);
              if (result.issues) {
                var pathItem = {
                  type: "array",
                  origin: "value",
                  input: input,
                  key: key,
                  value: value2
                };
                var _iterator7 = _createForOfIteratorHelper(result.issues),
                  _step7;
                try {
                  for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
                    var _issues;
                    var issue = _step7.value;
                    if (issue.path) {
                      issue.path.unshift(pathItem);
                    } else {
                      issue.path = [pathItem];
                    }
                    (_issues = issues) === null || _issues === void 0 || _issues.push(issue);
                  }
                } catch (err) {
                  _iterator7.e(err);
                } finally {
                  _iterator7.f();
                }
                if (!issues) {
                  issues = result.issues;
                }
                if (config !== null && config !== void 0 && config.abortEarly) {
                  typed = false;
                  break;
                }
              }
              if (!result.typed) {
                typed = false;
              }
              output.push(result.output);
            }
            if (typed) {
              return pipeResult(this, output, config, issues);
            }
            return schemaResult(false, output, issues);
          }
          return schemaIssue(this, array, input, config);
        }
      };
    }

    // src/schemas/boolean/boolean.ts
    function _boolean(arg1, arg2) {
      var _defaultArgs17 = defaultArgs(arg1, arg2),
        _defaultArgs18 = _slicedToArray(_defaultArgs17, 2),
        message = _defaultArgs18[0],
        pipe = _defaultArgs18[1];
      return {
        type: "boolean",
        expects: "boolean",
        async: false,
        message: message,
        pipe: pipe,
        _parse: function _parse(input, config) {
          if (typeof input === "boolean") {
            return pipeResult(this, input, config);
          }
          return schemaIssue(this, _boolean, input, config);
        }
      };
    }

    // src/schemas/instance/instance.ts
    function instance(class_, arg2, arg3) {
      var _defaultArgs25 = defaultArgs(arg2, arg3),
        _defaultArgs26 = _slicedToArray(_defaultArgs25, 2),
        message = _defaultArgs26[0],
        pipe = _defaultArgs26[1];
      return {
        type: "instance",
        expects: class_.name,
        async: false,
        "class": class_,
        message: message,
        pipe: pipe,
        _parse: function _parse(input, config) {
          if (input instanceof this["class"]) {
            return pipeResult(this, input, config);
          }
          return schemaIssue(this, instance, input, config);
        }
      };
    }

    // src/schemas/intersect/utils/mergeOutputs/mergeOutputs.ts
    function mergeOutputs(output1, output2) {
      if (_typeof(output1) === _typeof(output2)) {
        if (output1 === output2 || output1 instanceof Date && output2 instanceof Date && +output1 === +output2) {
          return {
            output: output1
          };
        }
        if (Array.isArray(output1) && Array.isArray(output2)) {
          if (output1.length === output2.length) {
            var array2 = [];
            for (var index = 0; index < output1.length; index++) {
              var result = mergeOutputs(output1[index], output2[index]);
              if (result.invalid) {
                return result;
              }
              array2.push(result.output);
            }
            return {
              output: array2
            };
          }
          return {
            invalid: true
          };
        }
        if (output1 && output2 && output1.constructor === Object && output2.constructor === Object) {
          var object2 = _objectSpread2(_objectSpread2({}, output1), output2);
          for (var key in output1) {
            if (key in output2) {
              var _result = mergeOutputs(output1[key], output2[key]);
              if (_result.invalid) {
                return _result;
              }
              object2[key] = _result.output;
            }
          }
          return {
            output: object2
          };
        }
      }
      return {
        invalid: true
      };
    }

    // src/schemas/intersect/intersect.ts
    function intersect(options, arg2, arg3) {
      var _defaultArgs29 = defaultArgs(arg2, arg3),
        _defaultArgs30 = _slicedToArray(_defaultArgs29, 2),
        message = _defaultArgs30[0],
        pipe = _defaultArgs30[1];
      return {
        type: "intersect",
        expects: _toConsumableArray(new Set(options.map(function (option) {
          return option.expects;
        }))).join(" & "),
        async: false,
        options: options,
        message: message,
        pipe: pipe,
        _parse: function _parse(input, config) {
          var typed = true;
          var issues;
          var output;
          var outputs = [];
          var _iterator9 = _createForOfIteratorHelper(this.options),
            _step9;
          try {
            for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
              var schema = _step9.value;
              var _result2 = schema._parse(input, config);
              if (_result2.issues) {
                if (issues) {
                  var _iterator10 = _createForOfIteratorHelper(_result2.issues),
                    _step10;
                  try {
                    for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
                      var issue = _step10.value;
                      issues.push(issue);
                    }
                  } catch (err) {
                    _iterator10.e(err);
                  } finally {
                    _iterator10.f();
                  }
                } else {
                  issues = _result2.issues;
                }
                if (config !== null && config !== void 0 && config.abortEarly) {
                  typed = false;
                  break;
                }
              }
              if (!_result2.typed) {
                typed = false;
              }
              outputs.push(_result2.output);
            }
          } catch (err) {
            _iterator9.e(err);
          } finally {
            _iterator9.f();
          }
          if (typed) {
            output = outputs[0];
            for (var index = 1; index < outputs.length; index++) {
              var result = mergeOutputs(output, outputs[index]);
              if (result.invalid) {
                return schemaIssue(this, intersect, input, config);
              }
              output = result.output;
            }
            return pipeResult(this, output, config, issues);
          }
          return schemaResult(false, output, issues);
        }
      };
    }

    // src/schemas/literal/literal.ts
    function literal(literal_, message) {
      return {
        type: "literal",
        expects: stringify(literal_),
        async: false,
        literal: literal_,
        message: message,
        _parse: function _parse(input, config) {
          if (input === this.literal) {
            return schemaResult(true, input);
          }
          return schemaIssue(this, literal, input, config);
        }
      };
    }

    // src/schemas/nullable/nullable.ts
    function nullable(wrapped, default_) {
      return {
        type: "nullable",
        expects: "".concat(wrapped.expects, " | null"),
        async: false,
        wrapped: wrapped,
        "default": default_,
        _parse: function _parse(input, config) {
          if (input === null) {
            var override = getDefault(this);
            if (override === void 0) {
              return schemaResult(true, input);
            }
            input = override;
          }
          return this.wrapped._parse(input, config);
        }
      };
    }

    // src/schemas/number/number.ts
    function number(arg1, arg2) {
      var _defaultArgs37 = defaultArgs(arg1, arg2),
        _defaultArgs38 = _slicedToArray(_defaultArgs37, 2),
        message = _defaultArgs38[0],
        pipe = _defaultArgs38[1];
      return {
        type: "number",
        expects: "number",
        async: false,
        message: message,
        pipe: pipe,
        _parse: function _parse(input, config) {
          if (typeof input === "number" && !isNaN(input)) {
            return pipeResult(this, input, config);
          }
          return schemaIssue(this, number, input, config);
        }
      };
    }

    // src/schemas/object/object.ts
    function object(entries, arg2, arg3, arg4) {
      var _restAndDefaultArgs = restAndDefaultArgs(arg2, arg3, arg4),
        _restAndDefaultArgs2 = _slicedToArray(_restAndDefaultArgs, 3),
        rest = _restAndDefaultArgs2[0],
        message = _restAndDefaultArgs2[1],
        pipe = _restAndDefaultArgs2[2];
      var cachedEntries;
      return {
        type: "object",
        expects: "Object",
        async: false,
        entries: entries,
        rest: rest,
        message: message,
        pipe: pipe,
        _parse: function _parse(input, config) {
          if (input && _typeof(input) === "object") {
            var _cachedEntries;
            cachedEntries = (_cachedEntries = cachedEntries) !== null && _cachedEntries !== void 0 ? _cachedEntries : Object.entries(this.entries);
            var typed = true;
            var issues;
            var output = {};
            var _iterator16 = _createForOfIteratorHelper(cachedEntries),
              _step16;
            try {
              for (_iterator16.s(); !(_step16 = _iterator16.n()).done;) {
                var _step16$value = _slicedToArray(_step16.value, 2),
                  _key = _step16$value[0],
                  schema = _step16$value[1];
                var _value = input[_key];
                var _result3 = schema._parse(_value, config);
                if (_result3.issues) {
                  var _pathItem3 = {
                    type: "object",
                    origin: "value",
                    input: input,
                    key: _key,
                    value: _value
                  };
                  var _iterator18 = _createForOfIteratorHelper(_result3.issues),
                    _step18;
                  try {
                    for (_iterator18.s(); !(_step18 = _iterator18.n()).done;) {
                      var _issues7;
                      var _issue2 = _step18.value;
                      if (_issue2.path) {
                        _issue2.path.unshift(_pathItem3);
                      } else {
                        _issue2.path = [_pathItem3];
                      }
                      (_issues7 = issues) === null || _issues7 === void 0 || _issues7.push(_issue2);
                    }
                  } catch (err) {
                    _iterator18.e(err);
                  } finally {
                    _iterator18.f();
                  }
                  if (!issues) {
                    issues = _result3.issues;
                  }
                  if (config !== null && config !== void 0 && config.abortEarly) {
                    typed = false;
                    break;
                  }
                }
                if (!_result3.typed) {
                  typed = false;
                }
                if (_result3.output !== void 0 || _key in input) {
                  output[_key] = _result3.output;
                }
              }
            } catch (err) {
              _iterator16.e(err);
            } finally {
              _iterator16.f();
            }
            if (this.rest && !(config !== null && config !== void 0 && config.abortEarly && issues)) {
              for (var key in input) {
                if (!(key in this.entries)) {
                  var value2 = input[key];
                  var result = this.rest._parse(value2, config);
                  if (result.issues) {
                    var pathItem = {
                      type: "object",
                      origin: "value",
                      input: input,
                      key: key,
                      value: value2
                    };
                    var _iterator17 = _createForOfIteratorHelper(result.issues),
                      _step17;
                    try {
                      for (_iterator17.s(); !(_step17 = _iterator17.n()).done;) {
                        var _issues6;
                        var issue = _step17.value;
                        if (issue.path) {
                          issue.path.unshift(pathItem);
                        } else {
                          issue.path = [pathItem];
                        }
                        (_issues6 = issues) === null || _issues6 === void 0 || _issues6.push(issue);
                      }
                    } catch (err) {
                      _iterator17.e(err);
                    } finally {
                      _iterator17.f();
                    }
                    if (!issues) {
                      issues = result.issues;
                    }
                    if (config !== null && config !== void 0 && config.abortEarly) {
                      typed = false;
                      break;
                    }
                  }
                  if (!result.typed) {
                    typed = false;
                  }
                  output[key] = result.output;
                }
              }
            }
            if (typed) {
              return pipeResult(this, output, config, issues);
            }
            return schemaResult(false, output, issues);
          }
          return schemaIssue(this, object, input, config);
        }
      };
    }

    // src/schemas/optional/optional.ts
    function optional(wrapped, default_) {
      return {
        type: "optional",
        expects: "".concat(wrapped.expects, " | undefined"),
        async: false,
        wrapped: wrapped,
        "default": default_,
        _parse: function _parse(input, config) {
          if (input === void 0) {
            var override = getDefault(this);
            if (override === void 0) {
              return schemaResult(true, input);
            }
            input = override;
          }
          return this.wrapped._parse(input, config);
        }
      };
    }

    // src/schemas/string/string.ts
    function string(arg1, arg2) {
      var _defaultArgs41 = defaultArgs(arg1, arg2),
        _defaultArgs42 = _slicedToArray(_defaultArgs41, 2),
        message = _defaultArgs42[0],
        pipe = _defaultArgs42[1];
      return {
        type: "string",
        expects: "string",
        async: false,
        message: message,
        pipe: pipe,
        _parse: function _parse(input, config) {
          if (typeof input === "string") {
            return pipeResult(this, input, config);
          }
          return schemaIssue(this, string, input, config);
        }
      };
    }

    // src/schemas/record/utils/recordArgs/recordArgs.ts
    function recordArgs(arg1, arg2, arg3, arg4) {
      if (_typeof(arg2) === "object" && !Array.isArray(arg2)) {
        var _defaultArgs45 = defaultArgs(arg3, arg4),
          _defaultArgs46 = _slicedToArray(_defaultArgs45, 2),
          message2 = _defaultArgs46[0],
          pipe2 = _defaultArgs46[1];
        return [arg1, arg2, message2, pipe2];
      }
      var _defaultArgs47 = defaultArgs(arg2, arg3),
        _defaultArgs48 = _slicedToArray(_defaultArgs47, 2),
        message = _defaultArgs48[0],
        pipe = _defaultArgs48[1];
      return [string(), arg1, message, pipe];
    }

    // src/schemas/record/values.ts
    var BLOCKED_KEYS = ["__proto__", "prototype", "constructor"];

    // src/schemas/record/record.ts
    function record(arg1, arg2, arg3, arg4) {
      var _recordArgs = recordArgs(arg1, arg2, arg3, arg4),
        _recordArgs2 = _slicedToArray(_recordArgs, 4),
        key = _recordArgs2[0],
        value2 = _recordArgs2[1],
        message = _recordArgs2[2],
        pipe = _recordArgs2[3];
      return {
        type: "record",
        expects: "Object",
        async: false,
        key: key,
        value: value2,
        message: message,
        pipe: pipe,
        _parse: function _parse(input, config) {
          if (input && _typeof(input) === "object") {
            var typed = true;
            var issues;
            var output = {};
            for (var _i = 0, _Object$entries = Object.entries(input); _i < _Object$entries.length; _i++) {
              var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
                inputKey = _Object$entries$_i[0],
                inputValue = _Object$entries$_i[1];
              if (!BLOCKED_KEYS.includes(inputKey)) {
                var pathItem = void 0;
                var keyResult = this.key._parse(inputKey, config);
                if (keyResult.issues) {
                  pathItem = {
                    type: "record",
                    origin: "key",
                    input: input,
                    key: inputKey,
                    value: inputValue
                  };
                  var _iterator21 = _createForOfIteratorHelper(keyResult.issues),
                    _step21;
                  try {
                    for (_iterator21.s(); !(_step21 = _iterator21.n()).done;) {
                      var _issues10;
                      var issue = _step21.value;
                      issue.path = [pathItem];
                      (_issues10 = issues) === null || _issues10 === void 0 || _issues10.push(issue);
                    }
                  } catch (err) {
                    _iterator21.e(err);
                  } finally {
                    _iterator21.f();
                  }
                  if (!issues) {
                    issues = keyResult.issues;
                  }
                  if (config !== null && config !== void 0 && config.abortEarly) {
                    typed = false;
                    break;
                  }
                }
                var valueResult = this.value._parse(inputValue, config);
                if (valueResult.issues) {
                  var _pathItem4;
                  pathItem = (_pathItem4 = pathItem) !== null && _pathItem4 !== void 0 ? _pathItem4 : {
                    type: "record",
                    origin: "value",
                    input: input,
                    key: inputKey,
                    value: inputValue
                  };
                  var _iterator22 = _createForOfIteratorHelper(valueResult.issues),
                    _step22;
                  try {
                    for (_iterator22.s(); !(_step22 = _iterator22.n()).done;) {
                      var _issues11;
                      var _issue3 = _step22.value;
                      if (_issue3.path) {
                        _issue3.path.unshift(pathItem);
                      } else {
                        _issue3.path = [pathItem];
                      }
                      (_issues11 = issues) === null || _issues11 === void 0 || _issues11.push(_issue3);
                    }
                  } catch (err) {
                    _iterator22.e(err);
                  } finally {
                    _iterator22.f();
                  }
                  if (!issues) {
                    issues = valueResult.issues;
                  }
                  if (config !== null && config !== void 0 && config.abortEarly) {
                    typed = false;
                    break;
                  }
                }
                if (!keyResult.typed || !valueResult.typed) {
                  typed = false;
                }
                if (keyResult.typed) {
                  output[keyResult.output] = valueResult.output;
                }
              }
            }
            if (typed) {
              return pipeResult(this, output, config, issues);
            }
            return schemaResult(false, output, issues);
          }
          return schemaIssue(this, record, input, config);
        }
      };
    }

    // src/schemas/union/utils/subissues/subissues.ts
    function subissues(results) {
      var issues;
      if (results) {
        var _iterator31 = _createForOfIteratorHelper(results),
          _step31;
        try {
          for (_iterator31.s(); !(_step31 = _iterator31.n()).done;) {
            var result = _step31.value;
            if (issues) {
              var _iterator32 = _createForOfIteratorHelper(result.issues),
                _step32;
              try {
                for (_iterator32.s(); !(_step32 = _iterator32.n()).done;) {
                  var issue = _step32.value;
                  issues.push(issue);
                }
              } catch (err) {
                _iterator32.e(err);
              } finally {
                _iterator32.f();
              }
            } else {
              issues = result.issues;
            }
          }
        } catch (err) {
          _iterator31.e(err);
        } finally {
          _iterator31.f();
        }
      }
      return issues;
    }

    // src/schemas/union/union.ts
    function union(options, arg2, arg3) {
      var _defaultArgs57 = defaultArgs(arg2, arg3),
        _defaultArgs58 = _slicedToArray(_defaultArgs57, 2),
        message = _defaultArgs58[0],
        pipe = _defaultArgs58[1];
      return {
        type: "union",
        expects: _toConsumableArray(new Set(options.map(function (option) {
          return option.expects;
        }))).join(" | "),
        async: false,
        options: options,
        message: message,
        pipe: pipe,
        _parse: function _parse(input, config) {
          var _typedResults, _untypedResults;
          var validResult;
          var untypedResults;
          var typedResults;
          var _iterator33 = _createForOfIteratorHelper(this.options),
            _step33;
          try {
            for (_iterator33.s(); !(_step33 = _iterator33.n()).done;) {
              var schema = _step33.value;
              var result = schema._parse(input, config);
              if (result.typed) {
                if (!result.issues) {
                  validResult = result;
                  break;
                } else {
                  typedResults ? typedResults.push(result) : typedResults = [result];
                }
              } else {
                untypedResults ? untypedResults.push(result) : untypedResults = [result];
              }
            }
          } catch (err) {
            _iterator33.e(err);
          } finally {
            _iterator33.f();
          }
          if (validResult) {
            return pipeResult(this, validResult.output, config);
          }
          if ((_typedResults = typedResults) !== null && _typedResults !== void 0 && _typedResults.length) {
            var firstResult = typedResults[0];
            return pipeResult(this, firstResult.output, config,
            // Hint: If there is more than one typed result, we use a general
            // union issue with subissues because the issues could contradict
            // each other.
            typedResults.length === 1 ? firstResult.issues : schemaIssue(this, union, input, config, {
              reason: "union",
              issues: subissues(typedResults)
            }).issues);
          }
          if (((_untypedResults = untypedResults) === null || _untypedResults === void 0 ? void 0 : _untypedResults.length) === 1) {
            return untypedResults[0];
          }
          return schemaIssue(this, union, input, config, {
            issues: subissues(untypedResults)
          });
        }
      };
    }

    // src/schemas/unknown/unknown.ts
    function unknown(pipe) {
      return {
        type: "unknown",
        expects: "unknown",
        async: false,
        pipe: pipe,
        _parse: function _parse(input, config) {
          return pipeResult(this, input, config);
        }
      };
    }

    // src/methods/omit/omit.ts
    function omit(schema, keys, arg3, arg4, arg5) {
      var _restAndDefaultArgs13 = restAndDefaultArgs(arg3, arg4, arg5),
        _restAndDefaultArgs14 = _slicedToArray(_restAndDefaultArgs13, 3),
        rest = _restAndDefaultArgs14[0],
        message = _restAndDefaultArgs14[1],
        pipe = _restAndDefaultArgs14[2];
      return object(Object.entries(schema.entries).reduce(function (entries, _ref33) {
        var _ref34 = _slicedToArray(_ref33, 2),
          key = _ref34[0],
          schema2 = _ref34[1];
        return keys.includes(key) ? entries : _objectSpread2(_objectSpread2({}, entries), {}, _defineProperty({}, key, schema2));
      }, {}), rest, message, pipe);
    }

    // src/methods/parse/parse.ts
    function parse(schema, input, config) {
      var result = schema._parse(input, getGlobalConfig(config));
      if (result.issues) {
        throw new ValiError(result.issues);
      }
      return result.output;
    }

    // src/methods/safeParse/safeParse.ts
    function safeParse(schema, input, config) {
      var result = schema._parse(input, getGlobalConfig(config));
      return {
        typed: result.typed,
        success: !result.issues,
        output: result.output,
        issues: result.issues
      };
    }

    // src/validations/custom/custom.ts
    function custom(requirement, message) {
      return {
        type: "custom",
        expects: null,
        async: false,
        message: message,
        requirement: requirement,
        _parse: function _parse(input) {
          if (this.requirement(input)) {
            return actionOutput(input);
          }
          return actionIssue(this, custom, input, "input");
        }
      };
    }

    // src/validations/notValue/notValue.ts
    function notValue(requirement, message) {
      return {
        type: "not_value",
        expects: "!".concat(requirement instanceof Date ? requirement.toJSON() : stringify(requirement)),
        async: false,
        message: message,
        requirement: requirement,
        _parse: function _parse(input) {
          if (input < this.requirement || input > this.requirement) {
            return actionOutput(input);
          }
          return actionIssue(this, notValue, input, "value", input instanceof Date ? input.toJSON() : stringify(input));
        }
      };
    }

    // src/validations/regex/regex.ts
    function regex(requirement, message) {
      return {
        type: "regex",
        expects: "".concat(requirement),
        async: false,
        message: message,
        requirement: requirement,
        _parse: function _parse(input) {
          if (this.requirement.test(input)) {
            return actionOutput(input);
          }
          return actionIssue(this, regex, input, "format");
        }
      };
    }

    const ZHTML5Fonts = union([
        literal("gothic"),
        literal("mincho"),
        literal("defont"),
    ]);

    const ZFormattedComment = object({
        id: optional(number(), 0),
        vpos: optional(number(), 0),
        content: optional(string(), ""),
        date: optional(number(), 0),
        date_usec: optional(number(), 0),
        owner: optional(_boolean(), false),
        premium: optional(_boolean(), false),
        mail: optional(array(string()), []),
        user_id: optional(number(), 0),
        layer: optional(number(), -1),
        is_my_post: optional(_boolean(), false),
    });
    const ZFormattedLegacyComment = omit(ZFormattedComment, [
        "layer",
        "user_id",
        "is_my_post",
    ]);

    const ZApiChat = object({
        thread: optional(string(), ""),
        no: optional(number(), 0),
        vpos: number(),
        date: optional(number(), 0),
        date_usec: optional(number(), 0),
        nicoru: optional(number(), 0),
        premium: optional(number(), 0),
        anonymity: optional(number(), 0),
        user_id: optional(string(), ""),
        mail: optional(string(), ""),
        content: string(),
        deleted: optional(number(), 0),
    });
    const ZRawApiResponse = union([
        object({ chat: ZApiChat }),
        record(string([notValue("chat")]), unknown()),
    ]);
    const ZApiPing = object({
        content: string(),
    });
    const ZApiThread = object({
        resultcode: number(),
        thread: string(),
        server_time: number(),
        ticket: string(),
        revision: number(),
    });
    const ZApiLeaf = object({
        thread: string(),
        count: number(),
    });
    const ZApiGlobalNumRes = object({
        thread: string(),
        num_res: number(),
    });

    const ZOwnerComment = object({
        time: string(),
        command: string(),
        comment: string(),
    });

    const ZV1Comment = object({
        id: string(),
        no: number(),
        vposMs: number(),
        body: string(),
        commands: array(string()),
        userId: string(),
        isPremium: _boolean(),
        score: number(),
        postedAt: string(),
        nicoruCount: number(),
        nicoruId: nullable(string()),
        source: string(),
        isMyPost: _boolean(),
    });
    const ZV1Thread = object({
        id: unknown(),
        fork: string(),
        commentCount: optional(number(), 0),
        comments: array(ZV1Comment),
    });

    const ZXml2jsChatItem = object({
        _: string(),
        $: object({
            no: optional(string()),
            vpos: string(),
            date: optional(string(), "0"),
            date_usec: optional(string(), "0"),
            user_id: optional(string()),
            owner: optional(string(), ""),
            premium: optional(string(), ""),
            mail: optional(string(), ""),
        }),
    });
    const ZXml2jsChat = object({
        chat: array(ZXml2jsChatItem),
    });
    const ZXml2jsPacket = object({
        packet: ZXml2jsChat,
    });

    const ZInputFormatType = union([
        literal("XMLDocument"),
        literal("niconicome"),
        literal("xml2js"),
        literal("formatted"),
        literal("legacy"),
        literal("legacyOwner"),
        literal("owner"),
        literal("v1"),
        literal("empty"),
        literal("default"),
    ]);

    const ZCommentFont = union([
        literal("defont"),
        literal("mincho"),
        literal("gothic"),
        literal("gulim"),
        literal("simsun"),
    ]);
    union([
        literal("defont"),
        literal("mincho"),
        literal("gothic"),
    ]);
    const ZCommentFlashFont = union([
        literal("defont"),
        literal("gulim"),
        literal("simsun"),
    ]);
    const ZCommentContentItemSpacer = object({
        type: literal("spacer"),
        char: string(),
        charWidth: number(),
        isButton: optional(_boolean()),
        font: optional(ZCommentFlashFont),
        count: number(),
    });
    const ZCommentContentItemText = object({
        type: literal("text"),
        content: string(),
        slicedContent: array(string()),
        isButton: optional(_boolean()),
        font: optional(ZCommentFlashFont),
        width: optional(array(number())),
    });
    const ZCommentContentItem = union([
        ZCommentContentItemSpacer,
        ZCommentContentItemText,
    ]);
    const ZCommentMeasuredContentItemText = intersect([
        ZCommentContentItem,
        object({
            width: array(number()),
        }),
    ]);
    const ZCommentMeasuredContentItem = union([
        ZCommentMeasuredContentItemText,
        ZCommentContentItemSpacer,
    ]);
    const ZCommentSize = union([
        literal("big"),
        literal("medium"),
        literal("small"),
    ]);
    const ZCommentLoc = union([
        literal("ue"),
        literal("naka"),
        literal("shita"),
    ]);
    const ZNicoScriptReverseTarget = union([
        literal("\u30b3\u30e1"),
        literal("\u6295\u30b3\u30e1"),
        literal("\u5168"),
    ]);
    const ZNicoScriptReplaceRange = union([
        literal("\u5358"),
        literal("\u5168"),
    ]);
    const ZNicoScriptReplaceTarget = union([
        literal("\u30b3\u30e1"),
        literal("\u6295\u30b3\u30e1"),
        literal("\u5168"),
        literal("\u542b\u307e\u306a\u3044"),
        literal("\u542b\u3080"),
    ]);
    const ZNicoScriptReplaceCondition = union([
        literal("\u90e8\u5206\u4e00\u81f4"),
        literal("\u5b8c\u5168\u4e00\u81f4"),
    ]);
    const ZMeasureInput = object({
        font: ZCommentFont,
        content: array(ZCommentContentItem),
        lineHeight: number(),
        charSize: number(),
        lineCount: number(),
    });

    const colors = {
        white: "#FFFFFF",
        red: "#FF0000",
        pink: "#FF8080",
        orange: "#FFC000",
        yellow: "#FFFF00",
        green: "#00FF00",
        cyan: "#00FFFF",
        blue: "#0000FF",
        purple: "#C000FF",
        black: "#000000",
        white2: "#CCCC99",
        niconicowhite: "#CCCC99",
        red2: "#CC0033",
        truered: "#CC0033",
        pink2: "#FF33CC",
        orange2: "#FF6600",
        passionorange: "#FF6600",
        yellow2: "#999900",
        madyellow: "#999900",
        green2: "#00CC66",
        elementalgreen: "#00CC66",
        cyan2: "#00CCCC",
        blue2: "#3399FF",
        marinblue: "#3399FF",
        purple2: "#6633CC",
        nobleviolet: "#6633CC",
        black2: "#666666",
    };

    var colors$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        colors: colors
    });

    const isBoolean = (i) => typeof i === "boolean";
    const isNumber = (i) => typeof i === "number";
    const isObject = (i) => typeof i === "object";
    const typeGuard = {
        formatted: {
            comment: (i) => is(ZFormattedComment, i),
            comments: (i) => is(array(ZFormattedComment), i),
            legacyComment: (i) => is(ZFormattedLegacyComment, i),
            legacyComments: (i) => is(array(ZFormattedLegacyComment), i),
        },
        legacy: {
            rawApiResponses: (i) => is(array(ZRawApiResponse), i),
            apiChat: (i) => is(ZApiChat, i),
            apiGlobalNumRes: (i) => is(ZApiGlobalNumRes, i),
            apiLeaf: (i) => is(ZApiLeaf, i),
            apiPing: (i) => is(ZApiPing, i),
            apiThread: (i) => is(ZApiThread, i),
        },
        xmlDocument: (i) => {
            if (!i.documentElement ||
                i.documentElement.nodeName !== "packet")
                return false;
            if (!i.documentElement.children)
                return false;
            for (const element of Array.from(i.documentElement.children)) {
                if (!element || element.nodeName !== "chat")
                    continue;
                if (!typeAttributeVerify(element, ["vpos", "date"]))
                    return false;
            }
            return true;
        },
        xml2js: {
            packet: (i) => is(ZXml2jsPacket, i),
            chat: (i) => is(ZXml2jsChat, i),
            chatItem: (i) => is(ZXml2jsChatItem, i),
        },
        legacyOwner: {
            comments: (i) => is(string([
                custom((i) => {
                    const lists = i.split(/\r\n|\r|\n/);
                    for (const list of lists) {
                        if (list.split(":").length < 3) {
                            return false;
                        }
                    }
                    return true;
                }),
            ]), i),
        },
        owner: {
            comment: (i) => is(ZOwnerComment, i),
            comments: (i) => is(array(ZOwnerComment), i),
        },
        v1: {
            comment: (i) => is(ZV1Comment, i),
            comments: (i) => is(array(ZV1Comment), i),
            thread: (i) => is(ZV1Thread, i),
            threads: (i) => is(array(ZV1Thread), i),
        },
        nicoScript: {
            range: {
                target: (i) => is(ZNicoScriptReverseTarget, i),
            },
            replace: {
                range: (i) => is(ZNicoScriptReplaceRange, i),
                target: (i) => is(ZNicoScriptReplaceTarget, i),
                condition: (i) => is(ZNicoScriptReplaceCondition, i),
            },
        },
        comment: {
            font: (i) => is(ZCommentFont, i),
            loc: (i) => is(ZCommentLoc, i),
            size: (i) => is(ZCommentSize, i),
            command: {
                key: (i) => is(union([
                    literal("full"),
                    literal("ender"),
                    literal("_live"),
                    literal("invisible"),
                ]), i),
            },
            color: (i) => is(string([custom((i) => Object.keys(colors).includes(i))]), i),
            colorCode: (i) => is(string([regex(/^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6})$/)]), i),
            colorCodeAllowAlpha: (i) => is(string([
                regex(/^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/),
            ]), i),
        },
        config: {
            initOptions: (item) => {
                if (typeof item !== "object" || !item)
                    return false;
                const keys = {
                    useLegacy: isBoolean,
                    formatted: isBoolean,
                    showCollision: isBoolean,
                    showFPS: isBoolean,
                    showCommentCount: isBoolean,
                    drawAllImageOnLoad: isBoolean,
                    debug: isBoolean,
                    enableLegacyPiP: isBoolean,
                    keepCA: isBoolean,
                    scale: isNumber,
                    config: isObject,
                    format: (i) => is(ZInputFormatType, i),
                    video: (i) => is(optional(instance(HTMLVideoElement)), i),
                };
                for (const key of Object.keys(keys)) {
                    if (item[key] !== undefined &&
                        !keys[key](item[key])) {
                        console.warn(`[Incorrect input] var: initOptions, key: ${key}, value: ${item[key]}`);
                        return false;
                    }
                }
                return true;
            },
        },
        internal: {
            CommentMeasuredContentItem: (i) => is(ZCommentMeasuredContentItem, i),
            CommentMeasuredContentItemArray: (i) => is(array(ZCommentMeasuredContentItem), i),
            MultiConfigItem: (i) => typeof i === "object" && objectVerify(i, ["html5", "flash"]),
            HTML5Fonts: (i) => is(ZHTML5Fonts, i),
            MeasureInput: (i) => is(ZMeasureInput, i),
        },
    };
    const objectVerify = (item, keys) => {
        if (typeof item !== "object" || !item)
            return false;
        for (const key of keys) {
            if (!Object.hasOwn(item, key))
                return false;
        }
        return true;
    };
    const typeAttributeVerify = (item, keys) => {
        if (typeof item !== "object" || !item)
            return false;
        for (const key of keys) {
            if (item.getAttribute(key) === null)
                return false;
        }
        return true;
    };

    var typeGuard$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        default: typeGuard
    });

    const getConfig = (input, isFlash = false) => {
        if (typeGuard.internal.MultiConfigItem(input)) {
            return input[isFlash ? "flash" : "html5"];
        }
        return input;
    };

    const isLineBreakResize = (comment) => {
        return (!comment.resized &&
            !comment.ender &&
            comment.lineCount >= config.lineBreakCount[comment.size]);
    };
    const getDefaultCommand = (vpos) => {
        nicoScripts.default = nicoScripts.default.filter((item) => !item.long || item.start + item.long >= vpos);
        let color = undefined;
        let size = undefined;
        let font = undefined;
        let loc = undefined;
        for (const item of nicoScripts.default) {
            if (item.loc) {
                loc = item.loc;
            }
            if (item.color) {
                color = item.color;
            }
            if (item.size) {
                size = item.size;
            }
            if (item.font) {
                font = item.font;
            }
            if (loc && color && size && font)
                break;
        }
        return { color, size, font, loc };
    };
    const nicoscriptReplaceIgnoreable = (comment, item) => ((item.target === "\u30b3\u30e1" ||
        item.target === "\u542b\u307e\u306a\u3044") &&
        comment.owner) ||
        (item.target === "\u6295\u30b3\u30e1" && !comment.owner) ||
        (item.target === "\u542b\u307e\u306a\u3044" && comment.owner) ||
        (item.condition === "\u5b8c\u5168\u4e00\u81f4" &&
            comment.content !== item.keyword) ||
        (item.condition === "\u90e8\u5206\u4e00\u81f4" &&
            comment.content.indexOf(item.keyword) === -1);
    const applyNicoScriptReplace = (comment, commands) => {
        nicoScripts.replace = nicoScripts.replace.filter((item) => !item.long || item.start + item.long >= comment.vpos);
        for (const item of nicoScripts.replace) {
            if (nicoscriptReplaceIgnoreable(comment, item))
                continue;
            if (item.range === "\u5358") {
                comment.content = comment.content.replaceAll(item.keyword, item.replace);
            }
            else {
                comment.content = item.replace;
            }
            if (item.loc) {
                commands.loc = item.loc;
            }
            if (item.color) {
                commands.color = item.color;
            }
            if (item.size) {
                commands.size = item.size;
            }
            if (item.font) {
                commands.font = item.font;
            }
        }
    };
    const parseCommandAndNicoScript = (comment) => {
        const isFlash = isFlashComment(comment);
        const commands = parseCommands(comment);
        processNicoscript(comment, commands);
        const defaultCommand = getDefaultCommand(comment.vpos);
        applyNicoScriptReplace(comment, commands);
        const size = commands.size ?? defaultCommand.size ?? "medium";
        return {
            size: size,
            loc: commands.loc ?? defaultCommand.loc ?? "naka",
            color: commands.color ?? defaultCommand.color ?? "#FFFFFF",
            font: commands.font ?? defaultCommand.font ?? "defont",
            fontSize: getConfig(config.fontSize, isFlash)[size].default,
            long: commands.long ? Math.floor(Number(commands.long) * 100) : 300,
            flash: isFlash,
            full: commands.full,
            ender: commands.ender,
            _live: commands._live,
            invisible: commands.invisible,
            strokeColor: commands.strokeColor,
            wakuColor: commands.wakuColor,
            fillColor: commands.fillColor,
            button: commands.button,
        };
    };
    const parseBrackets = (input) => {
        const content = input.split("");
        const result = [];
        let quote = "";
        let lastChar = "";
        let string = "";
        for (const i of content) {
            if (RegExp(/^["'\u300c]$/).exec(i) && quote === "") {
                quote = i;
            }
            else if (RegExp(/^["']$/).exec(i) && quote === i && lastChar !== "\\") {
                result.push(string.replaceAll("\\n", "\n"));
                quote = "";
                string = "";
            }
            else if (i === "\u300d" && quote === "\u300c") {
                result.push(string);
                quote = "";
                string = "";
            }
            else if (quote === "" && RegExp(/^\s+$/).exec(i)) {
                if (string) {
                    result.push(string);
                    string = "";
                }
            }
            else {
                string += i;
            }
            lastChar = i;
        }
        result.push(string);
        return result;
    };
    const addNicoscriptReplace = (comment, commands) => {
        const result = parseBrackets(comment.content.slice(4));
        if (result[0] === undefined ||
            (result[2] !== undefined &&
                !typeGuard.nicoScript.replace.range(result[2])) ||
            (result[3] !== undefined &&
                !typeGuard.nicoScript.replace.target(result[3])) ||
            (result[4] !== undefined &&
                !typeGuard.nicoScript.replace.condition(result[4])))
            return;
        nicoScripts.replace.unshift({
            start: comment.vpos,
            long: commands.long === undefined ? undefined : Math.floor(commands.long * 100),
            keyword: result[0],
            replace: result[1] ?? "",
            range: result[2] ?? "\u5358",
            target: result[3] ?? "\u30b3\u30e1",
            condition: result[4] ?? "\u90e8\u5206\u4e00\u81f4",
            color: commands.color,
            size: commands.size,
            font: commands.font,
            loc: commands.loc,
            no: comment.id,
        });
        sortNicoscriptReplace();
    };
    const sortNicoscriptReplace = () => {
        nicoScripts.replace.sort((a, b) => {
            if (a.start < b.start)
                return -1;
            if (a.start > b.start)
                return 1;
            if (a.no < b.no)
                return -1;
            if (a.no > b.no)
                return 1;
            return 0;
        });
    };
    const processNicoscript = (comment, commands) => {
        const nicoscript = RegExp(/^[@\uff20](\S+)(?:\s(.+))?/).exec(comment.content);
        if (!nicoscript)
            return;
        if (nicoscript[1] === "\u30dc\u30bf\u30f3" && nicoscript[2]) {
            processAtButton(comment, commands);
            return;
        }
        if (!comment.owner)
            return;
        commands.invisible = true;
        if (nicoscript[1] === "\u30c7\u30d5\u30a9\u30eb\u30c8") {
            processDefaultScript(comment, commands);
            return;
        }
        if (nicoscript[1] === "\u9006") {
            processReverseScript(comment, commands);
            return;
        }
        if (nicoscript[1] === "\u30b3\u30e1\u30f3\u30c8\u7981\u6b62") {
            processBanScript(comment, commands);
            return;
        }
        if (nicoscript[1] === "\u30b7\u30fc\u30af\u7981\u6b62") {
            processSeekDisableScript$1(comment, commands);
            return;
        }
        if (nicoscript[1] === "\u30b8\u30e3\u30f3\u30d7" && nicoscript[2]) {
            processJumpScript$1(comment, commands, nicoscript[2]);
            return;
        }
        if (nicoscript[1] === "\u7f6e\u63db") {
            addNicoscriptReplace(comment, commands);
        }
    };
    const processDefaultScript = (comment, commands) => {
        nicoScripts.default.unshift({
            start: comment.vpos,
            long: commands.long === undefined ? undefined : Math.floor(commands.long * 100),
            color: commands.color,
            size: commands.size,
            font: commands.font,
            loc: commands.loc,
        });
    };
    const processReverseScript = (comment, commands) => {
        const reverse = RegExp(/^[@\uff20]\u9006(?:\s+)?(\u5168|\u30b3\u30e1|\u6295\u30b3\u30e1)?/).exec(comment.content);
        if (!reverse?.[1] || !typeGuard.nicoScript.range.target(reverse[1]))
            return;
        if (commands.long === undefined) {
            commands.long = 30;
        }
        nicoScripts.reverse.unshift({
            start: comment.vpos,
            end: comment.vpos + commands.long * 100,
            target: reverse[1],
        });
    };
    const processBanScript = (comment, commands) => {
        if (commands.long === undefined) {
            commands.long = 30;
        }
        nicoScripts.ban.unshift({
            start: comment.vpos,
            end: comment.vpos + commands.long * 100,
        });
    };
    const processSeekDisableScript$1 = (comment, commands) => {
        if (commands.long === undefined) {
            commands.long = 30;
        }
        nicoScripts.seekDisable.unshift({
            start: comment.vpos,
            end: comment.vpos + commands.long * 100,
        });
    };
    const processJumpScript$1 = (comment, commands, input) => {
        const options = RegExp(/\s*((?:sm|so|nm|\uff53\uff4d|\uff53\uff4f|\uff4e\uff4d)?[1-9\uff11-\uff19][0-9\uff11-\uff19]*|#[0-9]+:[0-9]+(?:\.[0-9]+)?)\s+(.*)/).exec(input);
        if (!options?.[1])
            return;
        nicoScripts.jump.unshift({
            start: comment.vpos,
            end: commands.long === undefined ? undefined : commands.long * 100,
            to: options[1],
            message: options[2],
        });
    };
    const processAtButton = (comment, commands) => {
        const args = parseBrackets(comment.content);
        if (args[1] === undefined)
            return;
        commands.invisible = false;
        const content = RegExp(/^(?:(?<before>.*?)\[)?(?<body>.*?)(?:\](?<after>[^\]]*?))?$/su).exec(args[1]);
        const message = {
            before: content.groups?.before ?? "",
            body: content.groups?.body ?? "",
            after: content.groups?.after ?? "",
        };
        commands.button = {
            message,
            commentMessage: args[2] ?? `${message.before}${message.body}${message.after}`,
            commentVisible: args[3] !== "\u975e\u8868\u793a",
            commentMail: args[4]?.split(",") ?? [],
            limit: Number(args[5] ?? 1),
            local: comment.mail.includes("local"),
            hidden: comment.mail.includes("hidden"),
        };
    };
    const parseCommands = (comment) => {
        const commands = comment.mail;
        const isFlash = isFlashComment(comment);
        const result = {
            loc: undefined,
            size: undefined,
            fontSize: undefined,
            color: undefined,
            strokeColor: undefined,
            wakuColor: undefined,
            font: undefined,
            full: false,
            ender: false,
            _live: false,
            invisible: false,
            long: undefined,
        };
        for (const command of commands) {
            parseCommand(comment, command, result, isFlash);
        }
        if (comment.content.startsWith("/")) {
            result.invisible = true;
        }
        return result;
    };
    const parseCommand = (comment, _command, result, isFlash) => {
        const command = _command.toLowerCase();
        const long = RegExp(/^[@\uff20]([0-9.]+)/).exec(command);
        if (long) {
            result.long = Number(long[1]);
            return;
        }
        const strokeColor = getColor(RegExp(/^nico:stroke:(.+)$/).exec(command));
        if (strokeColor) {
            result.strokeColor ??= strokeColor;
            return;
        }
        const rectColor = getColor(RegExp(/^nico:waku:(.+)$/).exec(command));
        if (rectColor) {
            result.wakuColor ??= rectColor;
            return;
        }
        const fillColor = getColor(RegExp(/^nico:fill:(.+)$/).exec(command));
        if (fillColor) {
            result.fillColor ??= fillColor;
            return;
        }
        if (is(ZCommentLoc, command)) {
            result.loc ??= command;
            return;
        }
        if (result.size === undefined && is(ZCommentSize, command)) {
            result.size = command;
            result.fontSize = getConfig(config.fontSize, isFlash)[command].default;
            return;
        }
        if (config.colors[command]) {
            result.color ??= config.colors[command];
            return;
        }
        const colorCode = RegExp(/^#(?:[0-9a-z]{3}|[0-9a-z]{6})$/).exec(command);
        if (colorCode && comment.premium) {
            result.color ??= colorCode[0].toUpperCase();
            return;
        }
        if (is(ZCommentFont, command)) {
            result.font ??= command;
            return;
        }
        if (typeGuard.comment.command.key(command)) {
            result[command] = true;
        }
    };
    const getColor = (match) => {
        if (!match)
            return;
        const value = match[1];
        if (typeGuard.comment.color(value)) {
            return colors[value];
        }
        if (typeGuard.comment.colorCodeAllowAlpha(value)) {
            return value;
        }
        return;
    };
    const isFlashComment = (comment) => options.mode === "flash" ||
        (options.mode === "default" &&
            !(comment.mail.includes("gothic") ||
                comment.mail.includes("defont") ||
                comment.mail.includes("mincho")) &&
            (comment.date < config.flashThreshold ||
                comment.mail.includes("nico:flash")));
    const isReverseActive = (vpos, isOwner) => {
        for (const range of nicoScripts.reverse) {
            if ((range.target === "コメ" && isOwner) ||
                (range.target === "投コメ" && !isOwner))
                continue;
            if (range.start < vpos && vpos < range.end) {
                return true;
            }
        }
        return false;
    };
    const isBanActive = (vpos) => {
        for (const range of nicoScripts.ban) {
            if (range.start < vpos && vpos < range.end)
                return true;
        }
        return false;
    };
    const processFixedComment = (comment, collision, timeline, lazy = false) => {
        const posY = lazy ? -1 : getFixedPosY(comment, collision);
        for (let j = 0; j < comment.long; j++) {
            const vpos = comment.vpos + j;
            arrayPush(timeline, vpos, comment);
            if (j > comment.long - 20)
                continue;
            arrayPush(collision, vpos, comment);
        }
        comment.posY = posY;
    };
    const processMovableComment = (comment, collision, timeline, lazy = false) => {
        const beforeVpos = Math.round(-288 / ((1632 + comment.width) / (comment.long + 125))) - 100;
        const posY = lazy ? -1 : getMovablePosY(comment, collision, beforeVpos);
        for (let j = beforeVpos, n = comment.long + 125; j < n; j++) {
            const vpos = comment.vpos + j;
            const leftPos = getPosX(comment.comment, vpos);
            if (timeline[vpos]?.includes(comment))
                break;
            arrayPush(timeline, vpos, comment);
            if (leftPos + comment.width + config.collisionPadding >=
                config.collisionRange.right &&
                leftPos <= config.collisionRange.right) {
                arrayPush(collision.right, vpos, comment);
            }
            if (leftPos + comment.width + config.collisionPadding >=
                config.collisionRange.left &&
                leftPos <= config.collisionRange.left) {
                arrayPush(collision.left, vpos, comment);
            }
        }
        comment.posY = posY;
    };
    const getFixedPosY = (comment, collision) => {
        let posY = 0;
        let isChanged = true;
        let count = 0;
        while (isChanged && count < 10) {
            isChanged = false;
            count++;
            for (let j = 0; j < comment.long; j++) {
                const result = getPosY(posY, comment, collision[comment.vpos + j]);
                posY = result.currentPos;
                isChanged = result.isChanged;
                if (result.isBreak)
                    break;
            }
        }
        return posY;
    };
    const getMovablePosY = (comment, collision, beforeVpos) => {
        if (config.canvasHeight < comment.height) {
            return (comment.height - config.canvasHeight) / -2;
        }
        let posY = 0;
        let isChanged = true;
        let lastUpdatedIndex = undefined;
        while (isChanged) {
            isChanged = false;
            for (let j = beforeVpos, n = comment.long + 125; j < n; j += 5) {
                const vpos = comment.vpos + j;
                const leftPos = getPosX(comment.comment, vpos);
                let isBreak = false;
                if (lastUpdatedIndex !== undefined && lastUpdatedIndex === vpos) {
                    return posY;
                }
                if (leftPos + comment.width >= config.collisionRange.right &&
                    leftPos <= config.collisionRange.right) {
                    const result = getPosY(posY, comment, collision.right[vpos]);
                    posY = result.currentPos;
                    isChanged ||= result.isChanged;
                    if (result.isChanged)
                        lastUpdatedIndex = vpos;
                    isBreak = result.isBreak;
                }
                if (leftPos + comment.width >= config.collisionRange.left &&
                    leftPos <= config.collisionRange.left) {
                    const result = getPosY(posY, comment, collision.left[vpos]);
                    posY = result.currentPos;
                    isChanged ||= result.isChanged;
                    if (result.isChanged)
                        lastUpdatedIndex = vpos;
                    isBreak = result.isBreak;
                }
                if (isBreak)
                    return posY;
            }
        }
        return posY;
    };
    const getPosY = (_currentPos, targetComment, collision, _isChanged = false) => {
        let isBreak = false;
        if (!collision)
            return { currentPos: _currentPos, isChanged: _isChanged, isBreak };
        let currentPos = _currentPos;
        let isChanged = _isChanged;
        for (const collisionItem of collision) {
            if (collisionItem.index === targetComment.index || collisionItem.posY < 0)
                continue;
            if (collisionItem.owner === targetComment.owner &&
                collisionItem.layer === targetComment.layer &&
                currentPos < collisionItem.posY + collisionItem.height &&
                currentPos + targetComment.height > collisionItem.posY) {
                if (collisionItem.posY + collisionItem.height > currentPos) {
                    currentPos = collisionItem.posY + collisionItem.height;
                    isChanged = true;
                }
                if (currentPos + targetComment.height > config.canvasHeight) {
                    if (config.canvasHeight < targetComment.height) {
                        if (targetComment.mail.includes("naka")) {
                            currentPos = (targetComment.height - config.canvasHeight) / -2;
                        }
                        else {
                            currentPos = 0;
                        }
                    }
                    else {
                        currentPos = Math.floor(Math.random() * (config.canvasHeight - targetComment.height));
                    }
                    isBreak = true;
                    break;
                }
                return getPosY(currentPos, targetComment, collision, true);
            }
        }
        return { currentPos, isChanged, isBreak };
    };
    const getPosX = (comment, vpos, isReverse = false) => {
        if (comment.loc !== "naka") {
            return (config.canvasWidth - comment.width) / 2;
        }
        const speed = (config.commentDrawRange + comment.width * config.nakaCommentSpeedOffset) /
            (comment.long + 100);
        const vposLapsed = vpos - comment.vpos;
        const posX = config.commentDrawPadding +
            config.commentDrawRange -
            (vposLapsed + 100) * speed;
        if (isReverse) {
            return config.canvasWidth - comment.width - posX;
        }
        return posX;
    };
    const parseFont = (font, size) => {
        switch (font) {
            case "gulim":
            case "simsun":
                return config.fonts.flash[font].replace("[size]", `${size}`);
            case "gothic":
            case "mincho":
                return `${config.fonts.html5[font].weight} ${size}px ${config.fonts.html5[font].font}`;
            default:
                return `${config.fonts.html5.defont.weight} ${size}px ${config.fonts.html5.defont.font}`;
        }
    };

    const changeCALayer = (rawData) => {
        const userScoreList = getUsersScore(rawData);
        const filteredComments = removeDuplicateCommentArt(rawData);
        const commentArts = filteredComments.filter((comment) => (userScoreList[comment.user_id] ?? 0) >= config.sameCAMinScore &&
            !comment.owner);
        const commentArtsGroupedByUser = groupCommentsByUser(commentArts);
        const commentArtsGroupedByTimes = groupCommentsByTime(commentArtsGroupedByUser);
        updateLayerId(commentArtsGroupedByTimes);
        return filteredComments;
    };
    const getUsersScore = (comments) => {
        const userScoreList = {};
        for (const comment of comments) {
            if (comment.user_id === undefined || comment.user_id === -1)
                continue;
            userScoreList[comment.user_id] ||= 0;
            if (comment.mail.includes("ca") ||
                comment.mail.includes("patissier") ||
                comment.mail.includes("ender") ||
                comment.mail.includes("full")) {
                userScoreList[comment.user_id] += 5;
            }
            const lineCount = (comment.content.match(/\r\n|\n|\r/g) ?? []).length;
            if (lineCount > 2) {
                userScoreList[comment.user_id] += lineCount / 2;
            }
        }
        return userScoreList;
    };
    const removeDuplicateCommentArt = (comments) => {
        const index = {};
        return comments.filter((comment) => {
            const key = `${comment.content}@@${[...comment.mail]
            .sort((a, b) => a.localeCompare(b))
            .filter((e) => !RegExp(/@[\d.]+|184|device:.+|patissier|ca/).exec(e))
            .join("")}`;
            const lastComment = index[key];
            if (lastComment === undefined) {
                index[key] = comment;
                return true;
            }
            if (comment.vpos - lastComment.vpos > config.sameCAGap ||
                Math.abs(comment.date - lastComment.date) < config.sameCARange) {
                index[key] = comment;
                return true;
            }
            return false;
        });
    };
    const updateLayerId = (filteredComments) => {
        let layerId = 0;
        for (const user of filteredComments) {
            for (const time of user.comments) {
                for (const comment of time.comments) {
                    comment.layer = layerId;
                }
                layerId++;
            }
        }
    };
    const groupCommentsByUser = (comments) => {
        return comments.reduce((users, comment) => {
            const user = getUser(comment.user_id, users);
            user.comments.push(comment);
            return users;
        }, []);
    };
    const getUser = (userId, users) => {
        const user = users.find((user) => user.userId === userId);
        if (user)
            return user;
        const obj = {
            userId,
            comments: [],
        };
        users.push(obj);
        return obj;
    };
    const groupCommentsByTime = (comments) => {
        return comments.reduce((result, user) => {
            result.push({
                userId: user.userId,
                comments: user.comments.reduce((result, comment) => {
                    const time = getTime(comment.date, result);
                    time.comments.push(comment);
                    time.range.start = Math.min(time.range.start, comment.date);
                    time.range.end = Math.max(time.range.end, comment.date);
                    return result;
                }, []),
            });
            return result;
        }, []);
    };
    const getTime = (time, times) => {
        const timeObj = times.find((timeObj) => timeObj.range.start - config.sameCATimestampRange <= time &&
            timeObj.range.end + config.sameCATimestampRange >= time);
        if (timeObj)
            return timeObj;
        const obj = {
            range: {
                start: time,
                end: time,
            },
            comments: [],
        };
        times.push(obj);
        return obj;
    };

    const nativeSort = (getter) => {
        return (a, b) => {
            if (getter(a) > getter(b)) {
                return 1;
            }
            if (getter(a) < getter(b)) {
                return -1;
            }
            return 0;
        };
    };

    const getFlashFontIndex = (part) => {
        const regex = {
            simsunStrong: new RegExp(config.flashChar.simsunStrong),
            simsunWeak: new RegExp(config.flashChar.simsunWeak),
            gulim: new RegExp(config.flashChar.gulim),
            gothic: new RegExp(config.flashChar.gothic),
        };
        const index = [];
        let match = regex.simsunStrong.exec(part);
        if (match !== null) {
            index.push({ font: "simsunStrong", index: match.index });
        }
        match = regex.simsunWeak.exec(part);
        if (match !== null) {
            index.push({ font: "simsunWeak", index: match.index });
        }
        match = regex.gulim.exec(part);
        if (match !== null) {
            index.push({ font: "gulim", index: match.index });
        }
        match = regex.gothic.exec(part);
        if (match !== null) {
            index.push({ font: "gothic", index: match.index });
        }
        return index;
    };
    const getFlashFontName = (font) => {
        if (font === "simsunStrong" || font === "simsunWeak")
            return "simsun";
        if (font === "gothic")
            return "defont";
        return font;
    };
    const parseContent = (content) => {
        const results = [];
        const lines = Array.from(content.match(/\n|[^\n]+/g) ?? []);
        for (const line of lines) {
            const lineContent = parseLine(line);
            const firstContent = lineContent[0];
            const defaultFont = firstContent?.font;
            if (defaultFont) {
                results.push(...lineContent.map((val) => {
                    val.font ??= defaultFont;
                    if (val.type === "spacer") {
                        const spacer = config.compatSpacer.flash[val.char];
                        if (!spacer)
                            return val;
                        const width = spacer[val.font];
                        if (!width)
                            return val;
                        val.charWidth = width;
                    }
                    return val;
                }));
            }
            else {
                results.push(...lineContent);
            }
        }
        return results;
    };
    const parseLine = (line) => {
        const parts = Array.from(line.match(/[ -~｡-ﾟ]+|[^ -~｡-ﾟ]+/g) ?? []);
        const lineContent = [];
        for (const part of parts) {
            if (part.match(/[ -~｡-ﾟ]+/g) !== null) {
                addPartToResult(lineContent, part, "defont");
                continue;
            }
            parseFullWidthPart(part, lineContent);
        }
        return lineContent;
    };
    const addPartToResult = (lineContent, part, font) => {
        if (part === "")
            return;
        for (const key of Object.keys(config.compatSpacer.flash)) {
            const spacerWidth = config.compatSpacer.flash[key]?.[font ?? "defont"];
            if (!spacerWidth)
                continue;
            const compatIndex = part.indexOf(key);
            if (compatIndex >= 0) {
                addPartToResult(lineContent, part.slice(0, compatIndex), font);
                let i = compatIndex;
                for (; i < part.length && part[i] === key; i++) {
                }
                lineContent.push({
                    type: "spacer",
                    char: key,
                    charWidth: spacerWidth,
                    font,
                    count: i - compatIndex,
                });
                addPartToResult(lineContent, part.slice(i), font);
                return;
            }
        }
        lineContent.push({
            type: "text",
            content: part,
            slicedContent: part.split("\n"),
            font,
        });
    };
    const parseFullWidthPart = (part, lineContent) => {
        const index = getFlashFontIndex(part);
        if (index.length === 0) {
            addPartToResult(lineContent, part);
        }
        else if (index.length === 1 && index[0]) {
            addPartToResult(lineContent, part, getFlashFontName(index[0].font));
        }
        else {
            parseMultiFontFullWidthPart(part, index, lineContent);
        }
    };
    const parseMultiFontFullWidthPart = (part, index, lineContent) => {
        index.sort(nativeSort((val) => val.index));
        if (config.flashMode === "xp") {
            let offset = 0;
            for (let i = 1, n = index.length; i < n; i++) {
                const currentVal = index[i];
                const lastVal = index[i - 1];
                if (currentVal === undefined || lastVal === undefined)
                    continue;
                const content = part.slice(offset, currentVal.index);
                addPartToResult(lineContent, content, getFlashFontName(lastVal.font));
                offset = currentVal.index;
            }
            const val = index[index.length - 1];
            if (val) {
                const content = part.slice(offset);
                addPartToResult(lineContent, content, getFlashFontName(val.font));
            }
            return;
        }
        const firstVal = index[0];
        const secondVal = index[1];
        if (!firstVal || !secondVal) {
            addPartToResult(lineContent, part);
            return;
        }
        if (firstVal.font !== "gothic") {
            addPartToResult(lineContent, part, getFlashFontName(firstVal.font));
            return;
        }
        const firstContent = part.slice(0, secondVal.index);
        const secondContent = part.slice(secondVal.index);
        addPartToResult(lineContent, firstContent, getFlashFontName(firstVal.font));
        addPartToResult(lineContent, secondContent, getFlashFontName(secondVal.font));
    };
    const getButtonParts = (comment) => {
        let leftParts = undefined;
        const parts = [];
        const atButtonPadding = getConfig(config.atButtonPadding, true);
        const lineOffset = comment.lineOffset;
        const lineHeight = comment.fontSize * comment.lineHeight;
        const offsetKey = comment.resizedY ? "resized" : "default";
        const offsetY = config.flashCommentYPaddingTop[offsetKey] +
            comment.fontSize *
                comment.lineHeight *
                config.flashCommentYOffset[comment.size][offsetKey];
        let leftOffset = 0;
        let lineCount = 0;
        let isLastButton = false;
        for (const item of comment.content) {
            if (item.type === "spacer") {
                leftOffset += item.count * comment.fontSize * item.charWidth;
                continue;
            }
            const lines = item.slicedContent;
            for (let j = 0, n = lines.length; j < n; j++) {
                const line = lines[j];
                if (line === undefined)
                    continue;
                const posY = (lineOffset + lineCount + 1) * lineHeight + offsetY;
                const partWidth = item.width[j] ?? 0;
                if (comment.button && !comment.button.hidden) {
                    if (!isLastButton && item.isButton) {
                        leftParts = {
                            type: "left",
                            left: leftOffset + atButtonPadding,
                            top: posY - lineHeight + atButtonPadding,
                            width: partWidth + atButtonPadding,
                            height: lineHeight,
                        };
                        leftOffset += atButtonPadding * 2;
                    }
                    else if (isLastButton && item.isButton) {
                        parts.push({
                            type: "middle",
                            left: leftOffset,
                            top: posY - lineHeight + atButtonPadding,
                            width: partWidth,
                            height: lineHeight,
                        });
                    }
                    else if (isLastButton && !item.isButton) {
                        if (leftParts) {
                            comment.buttonObjects = {
                                left: leftParts,
                                middle: parts,
                                right: {
                                    type: "right",
                                    right: leftOffset + atButtonPadding,
                                    top: posY - lineHeight + atButtonPadding,
                                    height: lineHeight,
                                },
                            };
                        }
                        return comment;
                    }
                }
                if (j < n - 1) {
                    leftOffset = 0;
                    lineCount += 1;
                    continue;
                }
                leftOffset += partWidth;
            }
            isLastButton = !!item.isButton;
        }
        if (comment.button && !comment.button.hidden && isLastButton && leftParts) {
            const posY = (lineOffset + lineCount + 1) * lineHeight + offsetY;
            comment.buttonObjects = {
                left: leftParts,
                middle: parts,
                right: {
                    type: "right",
                    right: leftOffset + atButtonPadding,
                    top: posY - lineHeight + atButtonPadding,
                    height: lineHeight,
                },
            };
        }
        return comment;
    };
    const buildAtButtonComment = (comment, vpos) => {
        if (!comment.button || comment.button.limit <= 0)
            return;
        comment.button.limit -= 1;
        const mail = [...comment.button.commentMail, "from_button"];
        if (!comment.button.commentVisible) {
            mail.push("invisible");
        }
        return {
            id: -1,
            vpos,
            content: comment.button.commentMessage,
            date: -1,
            date_usec: -1,
            owner: false,
            premium: true,
            mail,
            user_id: -10,
            layer: -1,
            is_my_post: true,
        };
    };

    class TypeGuardError extends Error {
        constructor(options = {}) {
            super("Type Guard Error\nAn error occurred due to unexpected values\nPlease contact the developer on GitHub", options);
        }
    }
    TypeGuardError.prototype.name = "TypeGuardError";

    const getLineHeight = (fontSize, isFlash, resized = false) => {
        const lineCounts = getConfig(config.html5LineCounts, isFlash);
        const commentStageSize = getConfig(config.commentStageSize, isFlash);
        const lineHeight = commentStageSize.height / lineCounts.doubleResized[fontSize];
        const defaultLineCount = lineCounts.default[fontSize];
        if (resized) {
            const resizedLineCount = lineCounts.resized[fontSize];
            return ((commentStageSize.height -
                lineHeight * (defaultLineCount / resizedLineCount)) /
                (resizedLineCount - 1));
        }
        return (commentStageSize.height - lineHeight) / (defaultLineCount - 1);
    };
    const getCharSize = (fontSize, isFlash) => {
        const lineCounts = getConfig(config.html5LineCounts, isFlash);
        const commentStageSize = getConfig(config.commentStageSize, isFlash);
        return commentStageSize.height / lineCounts.doubleResized[fontSize];
    };
    const measure = (comment, renderer) => {
        const width = measureWidth(comment, renderer);
        return {
            ...width,
            height: comment.lineHeight * (comment.lineCount - 1) + comment.charSize,
        };
    };
    const addHTML5PartToResult = (lineContent, part, _font) => {
        if (part === "")
            return;
        const font = _font ?? "defont";
        for (const key of Object.keys(config.compatSpacer.html5)) {
            const spacerWidth = config.compatSpacer.html5[key]?.[font];
            if (!spacerWidth)
                continue;
            const compatIndex = part.indexOf(key);
            if (compatIndex >= 0) {
                addHTML5PartToResult(lineContent, part.slice(0, compatIndex), font);
                let i = compatIndex;
                for (; i < part.length && part[i] === key; i++) {
                }
                lineContent.push({
                    type: "spacer",
                    char: key,
                    charWidth: spacerWidth,
                    count: i - compatIndex,
                });
                addHTML5PartToResult(lineContent, part.slice(i), font);
                return;
            }
        }
        lineContent.push({
            type: "text",
            content: part,
            slicedContent: part.split("\n"),
        });
    };
    const measureWidth = (comment, renderer) => {
        const { fontSize, scale } = getFontSizeAndScale(comment.charSize);
        const lineWidth = [];
        const itemWidth = [];
        renderer.setFont(parseFont(comment.font, fontSize));
        let currentWidth = 0;
        for (const item of comment.content) {
            if (item.type === "spacer") {
                currentWidth += item.count * fontSize * item.charWidth;
                itemWidth.push([item.count * fontSize * item.charWidth]);
                lineWidth.push(Math.ceil(currentWidth * scale));
                continue;
            }
            const lines = item.content.split("\n");
            renderer.setFont(parseFont(item.font ?? comment.font, fontSize));
            const width = [];
            for (let j = 0, n = lines.length; j < n; j++) {
                const line = lines[j];
                if (line === undefined)
                    throw new TypeGuardError();
                const measure = renderer.measureText(line);
                currentWidth += measure.width;
                width.push(measure.width);
                if (j < lines.length - 1) {
                    lineWidth.push(Math.ceil(currentWidth * scale));
                    currentWidth = 0;
                }
            }
            itemWidth.push(width);
            lineWidth.push(Math.ceil(currentWidth * scale));
        }
        return {
            width: Math.max(...lineWidth),
            lineWidth,
            itemWidth,
        };
    };
    const getFontSizeAndScale = (_charSize) => {
        let charSize = _charSize;
        charSize *= 0.8;
        if (charSize < config.html5MinFontSize) {
            if (charSize >= 1)
                charSize = Math.floor(charSize);
            return {
                scale: charSize / config.html5MinFontSize,
                fontSize: config.html5MinFontSize,
            };
        }
        return {
            scale: 1,
            fontSize: Math.floor(charSize),
        };
    };

    var index$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        addHTML5PartToResult: addHTML5PartToResult,
        arrayEqual: arrayEqual,
        arrayPush: arrayPush,
        buildAtButtonComment: buildAtButtonComment,
        changeCALayer: changeCALayer,
        getButtonParts: getButtonParts,
        getCharSize: getCharSize,
        getConfig: getConfig,
        getDefaultCommand: getDefaultCommand,
        getFixedPosY: getFixedPosY,
        getFlashFontIndex: getFlashFontIndex,
        getFlashFontName: getFlashFontName,
        getFontSizeAndScale: getFontSizeAndScale,
        getLineHeight: getLineHeight,
        getMovablePosY: getMovablePosY,
        getPosX: getPosX,
        getPosY: getPosY,
        getStrokeColor: getStrokeColor,
        hex2rgb: hex2rgb,
        hex2rgba: hex2rgba,
        isBanActive: isBanActive,
        isFlashComment: isFlashComment,
        isLineBreakResize: isLineBreakResize,
        isReverseActive: isReverseActive,
        measure: measure,
        nativeSort: nativeSort,
        parseCommandAndNicoScript: parseCommandAndNicoScript,
        parseContent: parseContent,
        parseFont: parseFont,
        processFixedComment: processFixedComment,
        processMovableComment: processMovableComment
    });

    class BaseComment {
        renderer;
        cacheKey;
        comment;
        pos;
        posY;
        pluginName = "BaseComment";
        image;
        buttonImage;
        index;
        constructor(comment, renderer, index) {
            this.renderer = renderer;
            this.posY = -1;
            this.pos = { x: 0, y: 0 };
            comment.content = comment.content.replace(/\t/g, "\u2003\u2003");
            this.comment = this.convertComment(comment);
            this.cacheKey = this.getCacheKey();
            this.index = index;
        }
        get invisible() {
            return this.comment.invisible;
        }
        get loc() {
            return this.comment.loc;
        }
        get long() {
            return this.comment.long;
        }
        get vpos() {
            return this.comment.vpos;
        }
        get width() {
            return this.comment.width;
        }
        get height() {
            return this.comment.height;
        }
        get flash() {
            return false;
        }
        get layer() {
            return this.comment.layer;
        }
        get owner() {
            return this.comment.owner;
        }
        get mail() {
            return this.comment.mail;
        }
        get content() {
            throw new NotImplementedError(this.pluginName, "set: content");
        }
        set content(_) {
            throw new NotImplementedError(this.pluginName, "set: content");
        }
        getCommentSize(parsedData) {
            console.error("getCommentSize method is not implemented", parsedData);
            throw new NotImplementedError(this.pluginName, "getCommentSize");
        }
        parseCommandAndNicoscript(comment) {
            console.error("parseCommandAndNicoscript method is not implemented", comment);
            throw new NotImplementedError(this.pluginName, "parseCommandAndNicoscript");
        }
        parseContent(comment) {
            console.error("parseContent method is not implemented", comment);
            throw new NotImplementedError(this.pluginName, "parseContent");
        }
        measureText(comment) {
            console.error("measureText method is not implemented", comment);
            throw new NotImplementedError(this.pluginName, "measureText");
        }
        convertComment(comment) {
            console.error("convertComment method is not implemented", comment);
            throw new NotImplementedError(this.pluginName, "convertComment");
        }
        draw(vpos, showCollision, cursor) {
            if (isBanActive(vpos))
                return;
            const reverse = isReverseActive(vpos, this.comment.owner);
            const posX = getPosX(this.comment, vpos, reverse);
            const posY = this.comment.loc === "shita"
                ? config.canvasHeight - this.posY - this.comment.height
                : this.posY;
            this.pos = {
                x: posX,
                y: posY,
            };
            this._drawBackgroundColor(posX, posY);
            this._draw(posX, posY, cursor);
            this._drawRectColor(posX, posY);
            this._drawCollision(posX, posY, showCollision);
            this._drawDebugInfo(posX, posY);
        }
        _draw(posX, posY, cursor) {
            if (this.image === undefined) {
                this.image = this.getTextImage();
            }
            if (this.image) {
                this.renderer.save();
                if (this.comment._live) {
                    this.renderer.setGlobalAlpha(config.contextFillLiveOpacity);
                }
                else {
                    this.renderer.setGlobalAlpha(1);
                }
                if (this.comment.button && !this.comment.button.hidden) {
                    const button = this.getButtonImage(posX, posY, cursor);
                    button && this.renderer.drawImage(button, posX, posY);
                }
                this.renderer.drawImage(this.image, posX, posY);
                this.renderer.restore();
            }
        }
        _drawRectColor(posX, posY) {
            if (this.comment.wakuColor) {
                this.renderer.save();
                this.renderer.setStrokeStyle(this.comment.wakuColor);
                this.renderer.strokeRect(posX, posY, this.comment.width, this.comment.height);
                this.renderer.restore();
            }
        }
        _drawBackgroundColor(posX, posY) {
            if (this.comment.fillColor) {
                this.renderer.save();
                this.renderer.setFillStyle(this.comment.fillColor);
                this.renderer.fillRect(posX, posY, this.comment.width, this.comment.height);
                this.renderer.restore();
            }
        }
        _drawDebugInfo(posX, posY) {
            if (isDebug) {
                this.renderer.save();
                this.renderer.setFont(parseFont("defont", 30));
                this.renderer.setFillStyle("#ff00ff");
                this.renderer.fillText(this.comment.mail.join(","), posX, posY + 30);
                this.renderer.restore();
            }
        }
        _drawCollision(posX, posY, showCollision) {
            console.error("_drawCollision method is not implemented", posX, posY, showCollision);
            throw new NotImplementedError(this.pluginName, "_drawCollision");
        }
        getTextImage() {
            if (this.comment.invisible ||
                (this.comment.lineCount === 1 && this.comment.width === 0) ||
                this.comment.height - (this.comment.charSize - this.comment.lineHeight) <=
                    0)
                return null;
            const cache = imageCache[this.cacheKey];
            if (cache) {
                this.image = cache.image;
                window.setTimeout(() => {
                    this.image = undefined;
                }, this.comment.long * 10 + config.cacheAge);
                clearTimeout(cache.timeout);
                cache.timeout = window.setTimeout(() => {
                    imageCache[this.cacheKey]?.image.destroy();
                    delete imageCache[this.cacheKey];
                }, this.comment.long * 10 + config.cacheAge);
                return cache.image;
            }
            if (this.image)
                return this.image;
            const image = this._generateTextImage();
            this._cacheImage(image);
            return image;
        }
        _generateTextImage() {
            console.error("_generateTextImage method is not implemented");
            throw new NotImplementedError(this.pluginName, "_generateTextImage");
        }
        _cacheImage(image) {
            this.image = image;
            window.setTimeout(() => {
                this.image = undefined;
            }, this.comment.long * 10 + config.cacheAge);
            imageCache[this.cacheKey] = {
                timeout: window.setTimeout(() => {
                    delete imageCache[this.cacheKey];
                }, this.comment.long * 10 + config.cacheAge),
                image,
            };
        }
        getButtonImage(posX, posY, cursor) {
            console.error("getButtonImage method is not implemented", posX, posY, cursor);
            throw new NotImplementedError(this.pluginName, "getButtonImage");
        }
        isHovered(cursor, posX, posY) {
            console.error("isHovered method is not implemented", posX, posY, cursor);
            throw new NotImplementedError(this.pluginName, "getButtonImage");
        }
        getCacheKey() {
            return `${JSON.stringify(this.comment.content)}@@${this.pluginName}@@${[
            ...this.comment.mail,
        ]
            .sort((a, b) => a.localeCompare(b))
            .join(",")}`;
        }
    }

    const drawLeftBorder = (context, left, top, width, height, radius) => {
        context.save();
        context.beginPath();
        context.moveTo(left + width, top);
        context.lineTo(left + radius, top);
        context.quadraticCurveTo(left, top, left, top + radius);
        context.lineTo(left, top + height - radius);
        context.quadraticCurveTo(left, top + height, left + radius, top + height);
        context.lineTo(left + width, top + height);
        context.stroke();
        context.restore();
    };
    const drawMiddleBorder = (context, left, top, width, height) => {
        context.save();
        context.beginPath();
        context.moveTo(left + width, top);
        context.lineTo(left, top);
        context.moveTo(left + width, top + height);
        context.lineTo(left, top + height);
        context.stroke();
        context.restore();
    };
    const drawRightBorder = (context, right, top, height, radius) => {
        context.save();
        context.beginPath();
        context.moveTo(right - radius, top);
        context.quadraticCurveTo(right, top, right, top + radius);
        context.lineTo(right, top + height - radius);
        context.quadraticCurveTo(right, top + height, right - radius, top + height);
        context.stroke();
        context.restore();
    };

    class FlashComment extends BaseComment {
        _globalScale;
        pluginName = "FlashComment";
        buttonImage;
        constructor(comment, renderer, index) {
            super(comment, renderer, index);
            this._globalScale ??= getConfig(config.commentScale, true);
            this.buttonImage = renderer.getCanvas();
        }
        get content() {
            return this.comment.rawContent;
        }
        set content(input) {
            const { content, lineCount, lineOffset } = this.parseContent(input);
            const comment = {
                ...this.comment,
                rawContent: input,
                content,
                lineCount,
                lineOffset,
            };
            const val = content[0];
            if (val?.font) {
                comment.font = val.font;
            }
            this.comment = this.getCommentSize(comment);
            this.cacheKey = this.getCacheKey();
            this.image = undefined;
        }
        convertComment(comment) {
            this._globalScale = getConfig(config.commentScale, true);
            return getButtonParts(this.getCommentSize(this.parseCommandAndNicoscript(comment)));
        }
        getCommentSize(parsedData) {
            if (parsedData.invisible) {
                return {
                    ...parsedData,
                    height: 0,
                    width: 0,
                    lineHeight: 0,
                    fontSize: 0,
                    resized: false,
                    resizedX: false,
                    resizedY: false,
                    charSize: 0,
                    scale: 1,
                    scaleX: 1,
                    content: [],
                };
            }
            this.renderer.save();
            this.renderer.setFont(parseFont(parsedData.font, parsedData.fontSize));
            const measure = this.measureText({ ...parsedData, scale: 1 });
            if (options.scale !== 1 && parsedData.layer === -1) {
                measure.height *= options.scale;
                measure.width *= options.scale;
            }
            this.renderer.restore();
            if (parsedData.button && !parsedData.button.hidden) {
                measure.width += getConfig(config.atButtonPadding, true) * 4;
            }
            return {
                ...parsedData,
                height: measure.height * this._globalScale,
                width: measure.width * this._globalScale,
                lineHeight: measure.lineHeight,
                fontSize: measure.fontSize,
                resized: measure.resized,
                resizedX: measure.resizedX,
                resizedY: measure.resizedY,
                charSize: measure.charSize,
                scale: measure.scale,
                scaleX: measure.scaleX,
                content: measure.content,
            };
        }
        parseCommandAndNicoscript(comment) {
            const data = parseCommandAndNicoScript(comment);
            const { content, lineCount, lineOffset } = this.parseContent(comment.content, data.button);
            const val = content[0];
            if (val?.font) {
                data.font = val.font;
            }
            return {
                ...comment,
                rawContent: comment.content,
                ...data,
                content,
                lineCount,
                lineOffset,
            };
        }
        parseContent(input, button) {
            const content = button
                ? [
                    ...parseContent(button.message.before),
                    ...parseContent(button.message.body).map((val) => {
                        val.isButton = true;
                        return val;
                    }),
                    ...parseContent(button.message.after),
                ]
                : parseContent(input);
            const lineCount = (input.match(/\n/g)?.length ?? 0) + 1;
            const lineOffset = (input.match(new RegExp(config.flashScriptChar.super, "g"))?.length ??
                0) *
                -1 *
                config.flashScriptCharOffset +
                (input.match(new RegExp(config.flashScriptChar.sub, "g"))?.length ?? 0) *
                    config.flashScriptCharOffset;
            return {
                content,
                lineCount,
                lineOffset,
            };
        }
        measureText(comment) {
            const configLineHeight = getConfig(config.lineHeight, true);
            const configFontSize = getConfig(config.fontSize, true)[comment.size];
            const configStageSize = getConfig(config.commentStageSize, true);
            const defaultFontSize = configFontSize.default;
            comment.lineHeight ??= configLineHeight[comment.size].default;
            const widthLimit = configStageSize[comment.full ? "fullWidth" : "width"];
            const { scaleX, width, height } = this._measureContent(comment);
            let scale = 1;
            if (isLineBreakResize(comment)) {
                comment.resized = true;
                comment.resizedY = true;
                const lineBreakScale = config.flashLineBreakScale[comment.size];
                const scaledWidth = width * lineBreakScale;
                if (comment.loc !== "naka" &&
                    this._isDoubleResize(scaledWidth, widthLimit, comment.size, comment.lineCount, comment.full)) {
                    if (scaledWidth > widthLimit) {
                        const resizedFontSize = Math.round((widthLimit / scaledWidth) * defaultFontSize);
                        const resizeRate = (resizedFontSize + 1) / (defaultFontSize + 1);
                        scale *= resizeRate;
                    }
                }
                else {
                    scale *= lineBreakScale;
                }
            }
            else if (comment.loc !== "naka" && width > widthLimit) {
                const resizeRate = (Math.round((widthLimit / width) * defaultFontSize) + 1) /
                    (defaultFontSize + 1);
                scale *= resizeRate;
            }
            comment.scale = scale;
            if (!typeGuard.internal.CommentMeasuredContentItemArray(comment.content)) {
                throw new TypeGuardError();
            }
            return {
                charSize: 0,
                height: height * scale,
                resized: !!comment.resized,
                fontSize: comment.fontSize,
                lineHeight: comment.lineHeight,
                content: comment.content,
                resizedX: !!comment.resizedX,
                resizedY: !!comment.resizedY,
                scale: comment.scale,
                scaleX: scaleX,
                width: width * scale,
            };
        }
        _isDoubleResize(width, widthLimit, size, lineCount, isFull) {
            if (width < widthLimit * 0.9 || widthLimit * 1.1 < width)
                return width > widthLimit;
            if (size === "big") {
                if (8 <= lineCount &&
                    lineCount <= 14 &&
                    !isFull &&
                    widthLimit * 0.99 < width)
                    return true;
                if (width <= widthLimit)
                    return false;
                if (16 <= lineCount && width * 0.95 < widthLimit)
                    return true;
                if (isFull) {
                    if (width * 0.95 < widthLimit)
                        return false;
                    return width > widthLimit;
                }
                return true;
            }
            if (width <= widthLimit)
                return false;
            if (((size === "medium" && 25 <= lineCount) ||
                (size === "small" && 38 <= lineCount)) &&
                width * 0.95 < widthLimit)
                return false;
            return widthLimit < width;
        }
        _measureContent(comment) {
            const widthArr = [];
            const spacedWidthArr = [];
            let currentWidth = 0;
            let spacedWidth = 0;
            for (const item of comment.content) {
                if (item.type === "spacer") {
                    spacedWidth +=
                        item.count * item.charWidth * comment.fontSize +
                            Math.max(item.count - 1, 0) * config.flashLetterSpacing;
                    currentWidth += item.count * item.charWidth * comment.fontSize;
                    widthArr.push(currentWidth);
                    spacedWidthArr.push(spacedWidth);
                    continue;
                }
                const lines = item.content.split("\n");
                const widths = [];
                this.renderer.setFont(parseFont(item.font ?? comment.font, comment.fontSize));
                for (let i = 0, n = lines.length; i < n; i++) {
                    const value = lines[i];
                    if (value === undefined)
                        continue;
                    const measure = this.renderer.measureText(value);
                    currentWidth += measure.width;
                    spacedWidth +=
                        measure.width +
                            Math.max(value.length - 1, 0) * config.flashLetterSpacing;
                    widths.push(measure.width);
                    if (i < lines.length - 1) {
                        widthArr.push(currentWidth);
                        spacedWidthArr.push(spacedWidth);
                        spacedWidth = 0;
                        currentWidth = 0;
                    }
                }
                widthArr.push(currentWidth);
                spacedWidthArr.push(spacedWidth);
                item.width = widths;
            }
            const leadLine = (() => {
                let max = 0;
                let index = -1;
                spacedWidthArr.forEach((val, i) => {
                    if (max < val) {
                        max = val;
                        index = i;
                    }
                });
                return { max, index };
            })();
            const scaleX = leadLine.max / (widthArr[leadLine.index] ?? 1);
            const width = leadLine.max * comment.scale;
            const height = (comment.fontSize * (comment.lineHeight ?? 0) * comment.lineCount +
                config.flashCommentYPaddingTop[comment.resizedY ? "resized" : "default"]) *
                comment.scale;
            return { scaleX, width, height };
        }
        _drawCollision(posX, posY, showCollision) {
            if (showCollision) {
                this.renderer.save();
                this.renderer.setStrokeStyle("rgba(255,0,255,1)");
                this.renderer.strokeRect(posX, posY, this.comment.width, this.comment.height);
                for (let i = 0, n = this.comment.lineCount; i < n; i++) {
                    const linePosY = ((i + 1) * (this.comment.fontSize * this.comment.lineHeight) +
                        config.flashCommentYPaddingTop[this.comment.resizedY ? "resized" : "default"]) *
                        this.comment.scale;
                    this.renderer.setStrokeStyle("rgba(255,255,0,0.25)");
                    this.renderer.strokeRect(posX, posY + linePosY * this._globalScale, this.comment.width, this.comment.fontSize *
                        this.comment.lineHeight *
                        -1 *
                        this._globalScale *
                        this.comment.scale *
                        (this.comment.layer === -1 ? options.scale : 1));
                }
                this.renderer.restore();
            }
        }
        _generateTextImage() {
            const renderer = this.renderer.getCanvas();
            this._setupCanvas(renderer);
            const atButtonPadding = getConfig(config.atButtonPadding, true);
            const lineOffset = this.comment.lineOffset;
            const lineHeight = this.comment.fontSize * this.comment.lineHeight;
            const offsetKey = this.comment.resizedY ? "resized" : "default";
            const offsetY = config.flashCommentYPaddingTop[offsetKey] +
                this.comment.fontSize *
                    this.comment.lineHeight *
                    config.flashCommentYOffset[this.comment.size][offsetKey];
            let lastFont = this.comment.font;
            let leftOffset = 0;
            let lineCount = 0;
            let isLastButton = false;
            for (const item of this.comment.content) {
                if (item.type === "spacer") {
                    leftOffset += item.count * item.charWidth * this.comment.fontSize;
                    isLastButton = !!item.isButton;
                    continue;
                }
                const font = item.font ?? this.comment.font;
                if (lastFont !== font) {
                    lastFont = font;
                    renderer.setFont(parseFont(font, this.comment.fontSize));
                }
                const lines = item.slicedContent;
                for (let lineIndex = 0, lineLength = lines.length; lineIndex < lineLength; lineIndex++) {
                    const line = lines[lineIndex];
                    if (line === undefined)
                        continue;
                    const posY = (lineOffset + lineCount + 1) * lineHeight + offsetY;
                    const partWidth = item.width[lineIndex] ?? 0;
                    if (this.comment.button &&
                        !this.comment.button.hidden &&
                        ((!isLastButton && item.isButton) || (isLastButton && !item.isButton))) {
                        leftOffset += atButtonPadding * 2;
                    }
                    renderer.strokeText(line, leftOffset, posY);
                    renderer.fillText(line, leftOffset, posY);
                    leftOffset += partWidth;
                    if (lineIndex < lineLength - 1) {
                        leftOffset = 0;
                        lineCount += 1;
                    }
                }
                isLastButton = !!item.isButton;
            }
            return renderer;
        }
        getButtonImage(posX, posY, cursor) {
            if (!this.comment.button || this.comment.button.hidden)
                return undefined;
            const { renderer } = this._setupCanvas(this.buttonImage);
            const parts = this.comment.buttonObjects;
            if (!parts)
                return undefined;
            const atButtonRadius = getConfig(config.atButtonRadius, true);
            const isHover = this.isHovered(cursor, posX, posY);
            renderer.save();
            const getStrokeStyle = () => {
                if (isHover) {
                    return this.comment.color;
                }
                if (this.comment.button && this.comment.button.limit < 1) {
                    return "#777777";
                }
                return "white";
            };
            renderer.setStrokeStyle(getStrokeStyle());
            drawLeftBorder(renderer, parts.left.left, parts.left.top, parts.left.width, parts.left.height, atButtonRadius);
            for (const part of parts.middle) {
                drawMiddleBorder(renderer, part.left, part.top, part.width, part.height);
            }
            drawRightBorder(renderer, parts.right.right, parts.right.top, parts.right.height, atButtonRadius);
            renderer.restore();
            return renderer;
        }
        isHovered(_cursor, _posX, _posY) {
            if (!_cursor || !this.comment.buttonObjects)
                return false;
            const { left, middle, right } = this.comment.buttonObjects;
            const scale = this._globalScale *
                this.comment.scale *
                this.comment.scaleX *
                (this.comment.layer === -1 ? options.scale : 1);
            const posX = (_posX ?? this.pos.x) / scale;
            const posY = (_posY ?? this.pos.y) / scale;
            const cursor = {
                x: _cursor.x / scale,
                y: _cursor.y / scale,
            };
            if (cursor.x < posX ||
                posX + this.comment.width < cursor.x ||
                cursor.y < posY + left.top ||
                posY + right.top + right.height < cursor.y) {
                return false;
            }
            const atButtonPadding = getConfig(config.atButtonPadding, true);
            const between = (val, min, max) => {
                return min < val && val < max;
            };
            for (const part of [left, ...middle]) {
                if (between(cursor.x, posX + part.left, posX + part.left + part.width) &&
                    between(cursor.y, posY + part.top, posY + part.top + part.height)) {
                    return true;
                }
            }
            return (between(cursor.x, posX + right.right - atButtonPadding, posX + right.right + getConfig(config.contextLineWidth, true) / 2) && between(cursor.y, posY + right.top, posY + right.top + right.height));
        }
        _setupCanvas(renderer) {
            const atButtonPadding = getConfig(config.atButtonPadding, true);
            renderer.setSize(this.comment.width, this.comment.height + (this.comment.button ? atButtonPadding * 2 : 0));
            renderer.setStrokeStyle(getStrokeColor(this.comment));
            renderer.setFillStyle(this.comment.color);
            renderer.setLineWidth(getConfig(config.contextLineWidth, true));
            renderer.setFont(parseFont(this.comment.font, this.comment.fontSize));
            const scale = this._globalScale *
                this.comment.scale *
                (this.comment.layer === -1 ? options.scale : 1);
            renderer.setScale(scale * this.comment.scaleX, scale);
            return { renderer };
        }
    }

    class HTML5Comment extends BaseComment {
        pluginName = "HTML5Comment";
        constructor(comment, context, index) {
            super(comment, context, index);
            this.posY = -1;
        }
        get content() {
            return this.comment.rawContent;
        }
        set content(input) {
            const { content, lineCount, lineOffset } = this.parseContent(input);
            const comment = {
                ...this.comment,
                rawContent: input,
                content,
                lineCount,
                lineOffset,
            };
            this.comment = this.getCommentSize(comment);
            this.cacheKey = this.getCacheKey();
            this.image = undefined;
        }
        convertComment(comment) {
            return this.getCommentSize(this.parseCommandAndNicoscript(comment));
        }
        getCommentSize(parsedData) {
            if (parsedData.invisible) {
                return {
                    ...parsedData,
                    height: 0,
                    width: 0,
                    lineHeight: 0,
                    fontSize: 0,
                    resized: false,
                    resizedX: false,
                    resizedY: false,
                    charSize: 0,
                    content: [],
                    scaleX: 1,
                    scale: 1,
                };
            }
            this.renderer.save();
            this.renderer.setFont(parseFont(parsedData.font, parsedData.fontSize));
            const measure = this.measureText({ ...parsedData, scale: 1 });
            if (options.scale !== 1 && parsedData.layer === -1) {
                measure.height *= options.scale;
                measure.width *= options.scale;
                measure.fontSize *= options.scale;
            }
            this.renderer.restore();
            return {
                ...parsedData,
                height: measure.height,
                width: measure.width,
                lineHeight: measure.lineHeight,
                fontSize: measure.fontSize,
                resized: measure.resized,
                resizedX: measure.resizedX,
                resizedY: measure.resizedY,
                charSize: measure.charSize,
                content: measure.content,
                scaleX: measure.scaleX,
                scale: measure.scale,
            };
        }
        parseCommandAndNicoscript(comment) {
            const data = parseCommandAndNicoScript(comment);
            const { content, lineCount, lineOffset } = this.parseContent(comment.content, data.font);
            return {
                ...comment,
                rawContent: comment.content,
                ...data,
                content,
                lineCount,
                lineOffset,
            };
        }
        parseContent(input, font) {
            const content = [];
            addHTML5PartToResult(content, input, font ?? "defont");
            const lineCount = input.split("\n").length;
            const lineOffset = 0;
            return {
                content,
                lineCount,
                lineOffset,
            };
        }
        measureText(comment) {
            const scale = getConfig(config.commentScale, false);
            const configFontSize = getConfig(config.fontSize, false);
            const lineHeight = getLineHeight(comment.size, false);
            const charSize = getCharSize(comment.size, false);
            if (!comment.lineHeight)
                comment.lineHeight = lineHeight;
            if (!comment.charSize)
                comment.charSize = charSize;
            comment.fontSize = comment.charSize * 0.8;
            this.renderer.setFont(parseFont(comment.font, comment.fontSize));
            if (isLineBreakResize(comment)) {
                comment.fontSize = configFontSize[comment.size].resized;
                const lineHeight = getLineHeight(comment.size, false, true);
                comment.charSize = comment.charSize * (lineHeight / comment.lineHeight);
                comment.lineHeight = lineHeight;
                comment.resized = true;
                comment.resizedY = true;
            }
            const { width, height, itemWidth } = this._measureComment(comment);
            for (let i = 0, n = comment.content.length; i < n; i++) {
                const item = comment.content[i];
                if (item?.type !== "text" || !itemWidth)
                    continue;
                item.width = itemWidth[i];
            }
            comment.fontSize = (comment.charSize ?? 0) * 0.8;
            if (!typeGuard.internal.CommentMeasuredContentItemArray(comment.content)) {
                throw new TypeGuardError();
            }
            return {
                width: width * scale,
                height: height * scale,
                resized: !!comment.resized,
                fontSize: comment.fontSize,
                lineHeight: comment.lineHeight ?? 0,
                content: comment.content,
                resizedX: !!comment.resizedX,
                resizedY: !!comment.resizedY,
                charSize: comment.charSize ?? 0,
                scaleX: 1,
                scale: 1,
            };
        }
        _measureComment(comment) {
            const widthLimit = getConfig(config.commentStageSize, false)[comment.full ? "fullWidth" : "width"];
            if (!typeGuard.internal.MeasureInput(comment))
                throw new TypeGuardError();
            const measureResult = measure(comment, this.renderer);
            if (comment.loc !== "naka" && measureResult.width > widthLimit) {
                return this._processResizeX(comment, measureResult.width);
            }
            return measureResult;
        }
        _processResizeX(comment, width) {
            const widthLimit = getConfig(config.commentStageSize, false)[comment.full ? "fullWidth" : "width"];
            const lineHeight = getLineHeight(comment.size, false);
            const charSize = getCharSize(comment.size, false);
            const scale = widthLimit / width;
            comment.resizedX = true;
            let _comment = { ...comment };
            _comment.charSize = (_comment.charSize ?? 0) * scale;
            _comment.lineHeight = (_comment.lineHeight ?? 0) * scale;
            _comment.fontSize = _comment.charSize * 0.8;
            if (!typeGuard.internal.MeasureInput(_comment))
                throw new TypeGuardError();
            let result = measure(_comment, this.renderer);
            if (result.width > widthLimit) {
                while (result.width >= widthLimit) {
                    const originalCharSize = _comment.charSize;
                    _comment.charSize -= 1;
                    _comment.lineHeight *= _comment.charSize / originalCharSize;
                    _comment.fontSize = _comment.charSize * 0.8;
                    result = measure(_comment, this.renderer);
                }
            }
            else {
                let lastComment = { ..._comment };
                while (result.width < widthLimit) {
                    lastComment = { ..._comment };
                    const originalCharSize = _comment.charSize;
                    _comment.charSize += 1;
                    _comment.lineHeight *= _comment.charSize / originalCharSize;
                    _comment.fontSize = _comment.charSize * 0.8;
                    result = measure(_comment, this.renderer);
                }
                _comment = lastComment;
            }
            if (comment.resizedY) {
                const scale = (_comment.charSize ?? 0) / (comment.charSize ?? 0);
                comment.charSize = scale * charSize;
                comment.lineHeight = scale * lineHeight;
            }
            else {
                comment.charSize = _comment.charSize;
                comment.lineHeight = _comment.lineHeight;
            }
            comment.fontSize = (comment.charSize ?? 0) * 0.8;
            if (!typeGuard.internal.MeasureInput(comment))
                throw new TypeGuardError();
            return measure(comment, this.renderer);
        }
        _drawCollision(posX, posY, showCollision) {
            if (showCollision) {
                this.renderer.save();
                const scale = getConfig(config.commentScale, false);
                this.renderer.setStrokeStyle("rgba(0,255,255,1)");
                this.renderer.strokeRect(posX, posY, this.comment.width, this.comment.height);
                for (let i = 0, n = this.comment.lineCount; i < n; i++) {
                    if (!typeGuard.internal.HTML5Fonts(this.comment.font))
                        throw new TypeGuardError();
                    const linePosY = (this.comment.lineHeight * (i + 1) +
                        (this.comment.charSize - this.comment.lineHeight) / 2 +
                        this.comment.lineHeight * -0.16 +
                        (config.fonts.html5[this.comment.font]?.offset || 0)) *
                        scale;
                    this.renderer.setStrokeStyle("rgba(255,255,0,0.5)");
                    this.renderer.strokeRect(posX, posY + linePosY, this.comment.width, this.comment.fontSize * -1 * scale);
                }
                this.renderer.restore();
            }
        }
        _generateTextImage() {
            const { fontSize, scale } = getFontSizeAndScale(this.comment.charSize);
            const paddingTop = (10 - scale * 10) *
                ((this.comment.lineCount + 1) / config.html5HiResCommentCorrection);
            const drawScale = getConfig(config.commentScale, false) *
                scale *
                (this.comment.layer === -1 ? options.scale : 1);
            const image = this.renderer.getCanvas();
            image.setSize(this.comment.width + 2 * 2 * this.comment.charSize, this.comment.height +
                (((paddingTop + 1) * this.comment.lineHeight) / scale) * drawScale);
            image.setStrokeStyle(getStrokeColor(this.comment));
            image.setFillStyle(this.comment.color);
            image.setLineWidth(getConfig(config.contextLineWidth, false));
            image.setFont(parseFont(this.comment.font, fontSize));
            image.setScale(drawScale);
            let lineCount = 0;
            if (!typeGuard.internal.HTML5Fonts(this.comment.font))
                throw new TypeGuardError();
            const offsetY = (this.comment.charSize - this.comment.lineHeight) / 2 +
                this.comment.lineHeight * -0.16 +
                (config.fonts.html5[this.comment.font]?.offset || 0);
            for (const item of this.comment.content) {
                if (item?.type === "spacer") {
                    lineCount += item.count * item.charWidth * this.comment.fontSize;
                    continue;
                }
                const lines = item.slicedContent;
                for (let j = 0, n = lines.length; j < n; j++) {
                    const line = lines[j];
                    if (line === undefined)
                        continue;
                    const posY = (this.comment.lineHeight * (lineCount + 1 + paddingTop) + offsetY) /
                        scale;
                    image.strokeText(line, 0, posY);
                    image.fillText(line, 0, posY);
                    lineCount += 1;
                }
            }
            return image;
        }
        getButtonImage() {
            return undefined;
        }
        isHovered() {
            return false;
        }
    }

    var index$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        BaseComment: BaseComment,
        FlashComment: FlashComment,
        HTML5Comment: HTML5Comment
    });

    const build = (fonts) => {
        return fonts.reduce((pv, val, index) => {
            if (index === 0) {
                return { ...val };
            }
            pv.font += `, ${val.font}`;
            return pv;
        }, { font: "", offset: 0, weight: 600 });
    };
    const fontTemplates = {
        arial: {
            font: 'Arial, "ＭＳ Ｐゴシック", "MS PGothic", MSPGothic, MS-PGothic',
            offset: 0.01,
            weight: 600,
        },
        gothic: {
            font: '"游ゴシック体", "游ゴシック", "Yu Gothic", YuGothic, yugothic, YuGo-Medium',
            offset: -0.04,
            weight: 400,
        },
        gulim: {
            font: 'Gulim, "黑体", SimHei',
            offset: 0.03,
            weight: 400,
        },
        mincho: {
            font: '"游明朝体", "游明朝", "Yu Mincho", YuMincho, yumincho, YuMin-Medium',
            offset: -0.01,
            weight: 400,
        },
        simsun: {
            font: '"宋体", SimSun',
            offset: 0.135,
            weight: 400,
        },
        macGothicPro6: {
            font: '"ヒラギノ角ゴ ProN W6", HiraKakuProN-W6, "ヒラギノ角ゴ ProN", HiraKakuProN, "Hiragino Kaku Gothic ProN"',
            offset: -0.05,
            weight: 600,
        },
        macGothicPro3: {
            font: '"ヒラギノ角ゴ ProN W3", HiraKakuProN-W3, "ヒラギノ角ゴ ProN", HiraKakuProN, "Hiragino Kaku Gothic ProN"',
            offset: -0.04,
            weight: 300,
        },
        macMincho: {
            font: '"ヒラギノ明朝 ProN W3", HiraMinProN-W3, "ヒラギノ明朝 ProN", HiraMinProN, "Hiragino Mincho ProN"',
            offset: -0.02,
            weight: 300,
        },
        macGothic1: {
            font: '"ヒラギノ角ゴシック", "Hiragino Sans", HiraginoSans',
            offset: -0.05,
            weight: 600,
        },
        macGothic2: {
            font: '"ヒラギノ角ゴシック", "Hiragino Sans", HiraginoSans',
            offset: -0.04,
            weight: 300,
        },
        sansSerif600: {
            font: "sans-serif",
            offset: 0,
            weight: 600,
        },
        sansSerif400: {
            font: "sans-serif",
            offset: 0,
            weight: 400,
        },
        serif: {
            font: "serif",
            offset: 0,
            weight: 400,
        },
    };
    const fonts = {
        win7: {
            defont: build([fontTemplates.arial]),
            gothic: build([
                fontTemplates.gothic,
                fontTemplates.gulim,
                fontTemplates.arial,
            ]),
            mincho: build([
                fontTemplates.mincho,
                fontTemplates.simsun,
                fontTemplates.arial,
            ]),
        },
        win8_1: {
            defont: build([fontTemplates.arial]),
            gothic: build([
                fontTemplates.gothic,
                fontTemplates.simsun,
                fontTemplates.arial,
            ]),
            mincho: build([
                fontTemplates.mincho,
                fontTemplates.simsun,
                fontTemplates.arial,
            ]),
        },
        win: {
            defont: build([fontTemplates.arial]),
            gothic: build([fontTemplates.gulim, fontTemplates.arial]),
            mincho: build([fontTemplates.simsun, fontTemplates.arial]),
        },
        mac10_9: {
            defont: build([fontTemplates.macGothicPro6]),
            gothic: build([fontTemplates.gothic, fontTemplates.macGothicPro3]),
            mincho: build([
                fontTemplates.mincho,
                fontTemplates.macMincho,
                fontTemplates.macGothicPro3,
            ]),
        },
        mac10_11: {
            defont: build([fontTemplates.macGothic1]),
            gothic: build([fontTemplates.gothic, fontTemplates.macGothic2]),
            mincho: build([
                fontTemplates.mincho,
                fontTemplates.macMincho,
                fontTemplates.macGothic2,
            ]),
        },
        mac: {
            defont: build([fontTemplates.macGothicPro6]),
            gothic: build([fontTemplates.macGothicPro3]),
            mincho: build([fontTemplates.macMincho]),
        },
        other: {
            defont: build([fontTemplates.sansSerif600]),
            gothic: build([fontTemplates.sansSerif400]),
            mincho: build([fontTemplates.serif]),
        },
    };

    var fonts$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        fontTemplates: fontTemplates,
        fonts: fonts
    });

    const initConfig = () => {
        const platform = ((ua) => {
            if (RegExp(/windows nt 6\.[12]/i).exec(ua)) {
                return "win7";
            }
            if (RegExp(/windows nt (6\.3|10\.\d+)|win32/i).exec(ua)) {
                return "win8_1";
            }
            if (RegExp(/windows nt/i).exec(ua)) {
                return "win";
            }
            if (RegExp(/mac os x 10(.|_)(9|10)/i).exec(ua)) {
                return "mac10_9";
            }
            if (RegExp(/mac os x 10(.|_)\d{2}|darwin/i).exec(ua)) {
                return "mac10_11";
            }
            if (RegExp(/mac os x/i).exec(ua)) {
                return "mac";
            }
            return "other";
        })(typeof navigator !== "undefined" ? navigator.userAgent : process.platform);
        const defaultConfig = {
            colors: colors,
            contextStrokeColor: "#000000",
            contextStrokeInversionColor: "#FFFFFF",
            contextStrokeOpacity: 0.4,
            contextFillLiveOpacity: 0.5,
            contextLineWidth: {
                html5: 2.8,
                flash: 4,
            },
            commentScale: {
                html5: 1920 / 683,
                flash: 1920 / 683,
            },
            commentStageSize: {
                html5: {
                    width: 512,
                    fullWidth: 683,
                    height: 384,
                },
                flash: {
                    width: 512,
                    fullWidth: 640,
                    height: 385,
                },
            },
            fontSize: {
                html5: {
                    small: {
                        default: 18,
                        resized: 10,
                    },
                    medium: {
                        default: 27,
                        resized: 14,
                    },
                    big: {
                        default: 39,
                        resized: 19.5,
                    },
                },
                flash: {
                    small: {
                        default: 15,
                        resized: 7.5,
                    },
                    medium: {
                        default: 24,
                        resized: 12,
                    },
                    big: {
                        default: 39,
                        resized: 19.5,
                    },
                },
            },
            html5LineCounts: {
                default: {
                    big: 8.4,
                    medium: 13.1,
                    small: 21,
                },
                resized: {
                    big: 16,
                    medium: 25.4,
                    small: 38,
                },
                doubleResized: {
                    big: 7.8,
                    medium: 11.3,
                    small: 16.6,
                },
            },
            html5HiResCommentCorrection: 20,
            html5MinFontSize: 10,
            fonts: {
                html5: fonts[platform],
                flash: {
                    gulim: `normal 600 [size]px gulim, ${fonts[platform].gothic.font}, Arial`,
                    simsun: `normal 400 [size]px simsun, batang, "PMingLiU", MingLiU-ExtB, ${fonts[platform].mincho.font}, Arial`,
                },
            },
            fpsInterval: 500,
            cacheAge: 2000,
            canvasWidth: 1920,
            canvasHeight: 1080,
            commentDrawRange: 1530,
            commentDrawPadding: 195,
            collisionRange: {
                left: 235,
                right: 1685,
            },
            collisionPadding: 5,
            sameCARange: 3600,
            sameCAGap: 100,
            sameCAMinScore: 10,
            sameCATimestampRange: 300,
            plugins: [],
            flashThreshold: 1499871600,
            flashChar: {
                gulim: "[\u0126\u0127\u0132\u0133\u0138\u013f\u0140\u0149-\u014b\u0166\u0167\u02d0\u02da\u2074\u207f\u2081-\u2084\u2113\u2153\u2154\u215c-\u215e\u2194\u2195\u223c\u249c-\u24b5\u24d0-\u24e9\u25a3-\u25a9\u25b6\u25b7\u25c0\u25c1\u25c8\u25d0\u25d1\u260e\u260f\u261c\u261e\u2660\u2661\u2663-\u2665\u2667-\u2669\u266c\u3131-\u316e\u3200-\u321c\u3260-\u327b\u3380-\u3384\u3388-\u338d\u3390-\u339b\u339f\u33a0\u33a2-\u33ca\u33cf\u33d0\u33d3\u33d6\u33d8\u33db-\u33dd\uac00-\ud7a3\uf900-\uf928\uf92a-\uf994\uf996\ufa0b\uffe6]",
                simsunStrong: "[\u01ce\u01d0\u01d2\u01d4\u01d6\u01d8\u01da\u01dc\u0251\u0261\u02ca\u02cb\u2016\u2035\u216a\u216b\u2223\u2236\u2237\u224c\u226e\u226f\u2295\u2483-\u249b\u2504-\u250b\u256d-\u2573\u2581-\u2583\u2585-\u2587\u2589-\u258b\u258d-\u258f\u2594\u2595\u25e2-\u25e5\u2609\u3016\u3017\u301e\u3021-\u3029\u3105-\u3129\u3220-\u3229\u32a3\u33ce\u33d1\u33d2\u33d5\ue758-\ue864\ufa0c\ufa0d\ufe30\ufe31\ufe33-\ufe44\ufe49-\ufe52\ufe54-\ufe57\ufe59-\ufe66\ufe68-\ufe6b]",
                simsunWeak: "[\u02c9\u2105\u2109\u2196-\u2199\u220f\u2215\u2248\u2264\u2265\u2299\u2474-\u2482\u250d\u250e\u2511\u2512\u2515\u2516\u2519\u251a\u251e\u251f\u2521\u2522\u2526\u2527\u2529\u252a\u252d\u252e\u2531\u2532\u2535\u2536\u2539\u253a\u253d\u253e\u2540\u2541\u2543-\u254a\u2550-\u256c\u2584\u2588\u258c\u2593]",
                gothic: "[\u03fb\uff9f\u30fb]",
            },
            flashMode: "vista",
            flashScriptChar: {
                super: "[\u00aa\u00b2\u00b3\u00b9\u00ba\u02b0\u02b2\u02b3\u02b7\u02b8\u02e1-\u02e3\u0304\u1d2c-\u1d43\u1d45-\u1d61\u1d9b-\u1da1\u1da3-\u1dbf\u2070\u2071\u2074-\u207f\u2c7d]",
                sub: "[\u0320\u1d62-\u1d6a\u2080-\u208e\u2090-\u209c\u2c7c]",
            },
            lineHeight: {
                small: {
                    default: 18 / 15,
                    resized: 10 / 7.5,
                },
                medium: {
                    default: 29 / 25,
                    resized: 15 / 12,
                },
                big: {
                    default: 45 / 39,
                    resized: 24 / 19.5,
                },
            },
            flashCommentYPaddingTop: {
                default: 5,
                resized: 3,
            },
            flashCommentYOffset: {
                small: { default: -0.2, resized: -0.2 },
                medium: { default: -0.2, resized: -0.2 },
                big: { default: -0.2, resized: -0.2 },
            },
            flashLetterSpacing: 1,
            flashScriptCharOffset: 0.12,
            commentLimit: undefined,
            hideCommentOrder: "asc",
            lineBreakCount: {
                big: 3,
                medium: 5,
                small: 7,
            },
            commentPlugins: [
                {
                    class: FlashComment,
                    condition: isFlashComment,
                },
            ],
            nakaCommentSpeedOffset: 0.95,
            atButtonPadding: 5,
            atButtonRadius: 7,
            flashDoubleResizeHeights: {
                big: {
                    9: 392,
                    10: 384,
                    11: 389,
                    12: 388,
                    13: 381,
                    14: 381,
                    15: 384,
                },
            },
            flashLineBreakScale: {
                small: 0.557,
                medium: 0.519,
                big: 0.535,
            },
            compatSpacer: {
                flash: {
                    "\u3000": {
                        simsun: 0.98,
                        defont: 0.645,
                        gulim: 0.95,
                    },
                    "\u00a0": {
                        simsun: 0.25,
                    },
                    "\u0020": {
                        defont: 0.3,
                    },
                    "\u2001": {
                        defont: 0.95,
                    },
                    "\u2004": {
                        defont: 1.6,
                    },
                    "\u2007": {
                        defont: 1.6,
                    },
                    "\u202a": {
                        defont: 0.59,
                    },
                },
                html5: {},
            },
        };
        updateConfig(defaultConfig);
    };

    var initConfig$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        initConfig: initConfig
    });

    let handlerList = [];
    const handlerCounts = {
        seekDisable: 0,
        seekEnable: 0,
        commentDisable: 0,
        commentEnable: 0,
        jump: 0,
    };
    const registerHandler = (eventName, handler) => {
        handlerList.push({ eventName, handler });
        updateEventHandlerCounts();
    };
    const removeHandler = (eventName, handler) => {
        handlerList = handlerList.filter((item) => item.eventName !== eventName || item.handler !== handler);
        updateEventHandlerCounts();
    };
    const updateEventHandlerCounts = () => {
        for (const key_ of Object.keys(handlerCounts)) {
            const key = key_;
            handlerCounts[key] = handlerList.filter((item) => item.eventName === key).length;
        }
    };
    const triggerHandler = (vpos, lastVpos) => {
        processCommentDisableScript(vpos, lastVpos);
        processSeekDisableScript(vpos, lastVpos);
        processJumpScript(vpos, lastVpos);
    };
    const processCommentDisableScript = (vpos, lastVpos) => {
        if (handlerCounts.commentDisable < 1 && handlerCounts.commentEnable < 1)
            return;
        for (const range of nicoScripts.ban) {
            const vposInRange = range.start < vpos && vpos < range.end;
            const lastVposInRange = range.start < lastVpos && lastVpos < range.end;
            if (vposInRange && !lastVposInRange) {
                executeEvents("commentDisable", {
                    type: "commentDisable",
                    timeStamp: new Date().getTime(),
                    vpos: vpos,
                });
            }
            else if (!vposInRange && lastVposInRange) {
                executeEvents("commentEnable", {
                    type: "commentEnable",
                    timeStamp: new Date().getTime(),
                    vpos: vpos,
                });
            }
        }
    };
    const processSeekDisableScript = (vpos, lastVpos) => {
        if (handlerCounts.seekDisable < 1 && handlerCounts.seekEnable < 1)
            return;
        for (const range of nicoScripts.seekDisable) {
            const vposInRange = range.start < vpos && vpos < range.end;
            const lastVposInRange = range.start < lastVpos && lastVpos < range.end;
            if (vposInRange && !lastVposInRange) {
                executeEvents("seekDisable", {
                    type: "seekDisable",
                    timeStamp: new Date().getTime(),
                    vpos: vpos,
                });
            }
            else if (!vposInRange && lastVposInRange) {
                executeEvents("seekEnable", {
                    type: "seekEnable",
                    timeStamp: new Date().getTime(),
                    vpos: vpos,
                });
            }
        }
    };
    const processJumpScript = (vpos, lastVpos) => {
        if (handlerCounts.jump < 1)
            return;
        for (const range of nicoScripts.jump) {
            const vposInRange = range.start < vpos && (!range.end || vpos < range.end);
            const lastVposInRange = range.start < lastVpos && (!range.end || lastVpos < range.end);
            if (vposInRange && !lastVposInRange) {
                executeEvents("jump", {
                    type: "jump",
                    timeStamp: new Date().getTime(),
                    vpos: vpos,
                    to: range.to,
                    message: range.message,
                });
            }
        }
    };
    const executeEvents = (eventName, event) => {
        for (const item of handlerList) {
            if (eventName !== item.eventName)
                continue;
            item.handler(event);
        }
    };

    var eventHandler = /*#__PURE__*/Object.freeze({
        __proto__: null,
        registerHandler: registerHandler,
        removeHandler: removeHandler,
        triggerHandler: triggerHandler
    });

    const EmptyParser = {
        key: ["empty"],
        parse: () => {
            return [];
        },
    };

    const FormattedParser = {
        key: ["formatted", "niconicome"],
        parse: (input) => {
            return parse(array(ZFormattedComment), input);
        },
    };

    const LegacyParser = {
        key: ["legacy"],
        parse: (input) => {
            return fromLegacy(parse(array(ZRawApiResponse), input));
        },
    };
    const fromLegacy = (data) => {
        const data_ = [];
        const userList = [];
        for (const _val of data) {
            const val = safeParse(ZApiChat, _val.chat);
            if (!val.success)
                continue;
            const value = val.output;
            if (value.deleted !== 1) {
                const tmpParam = {
                    id: value.no,
                    vpos: value.vpos,
                    content: value.content || "",
                    date: value.date,
                    date_usec: value.date_usec || 0,
                    owner: !value.user_id,
                    premium: value.premium === 1,
                    mail: [],
                    user_id: -1,
                    layer: -1,
                    is_my_post: false,
                };
                if (value.mail) {
                    tmpParam.mail = value.mail.split(/\s+/g);
                }
                if (value.content.startsWith("/") && !value.user_id) {
                    tmpParam.mail.push("invisible");
                }
                const isUserExist = userList.indexOf(value.user_id);
                if (isUserExist === -1) {
                    tmpParam.user_id = userList.length;
                    userList.push(value.user_id);
                }
                else {
                    tmpParam.user_id = isUserExist;
                }
                data_.push(tmpParam);
            }
        }
        return data_;
    };

    const LegacyOwnerParser = {
        key: ["legacyOwner"],
        parse: (input) => {
            if (!typeGuard.legacyOwner.comments(input))
                throw new InvalidFormatError();
            return fromLegacyOwner(input);
        },
    };
    const fromLegacyOwner = (data) => {
        const data_ = [];
        const comments = data.split("\n");
        for (let i = 0, n = comments.length; i < n; i++) {
            const value = comments[i];
            if (!value)
                continue;
            const commentData = value.split(":");
            if (commentData.length < 3) {
                continue;
            }
            if (commentData.length > 3) {
                for (let j = 3, n = commentData.length; j < n; j++) {
                    commentData[2] += `:${commentData[j]}`;
                }
            }
            const tmpParam = {
                id: i,
                vpos: Number(commentData[0]) * 100,
                content: commentData[2] ?? "",
                date: i,
                date_usec: 0,
                owner: true,
                premium: true,
                mail: [],
                user_id: -1,
                layer: -1,
                is_my_post: false,
            };
            if (commentData[1]) {
                tmpParam.mail = commentData[1].split(/[\s+]/g);
            }
            if (tmpParam.content.startsWith("/")) {
                tmpParam.mail.push("invisible");
            }
            data_.push(tmpParam);
        }
        return data_;
    };

    const OwnerParser = {
        key: ["owner"],
        parse: (input) => {
            return fromOwner(parse(array(ZOwnerComment), input));
        },
    };
    const fromOwner = (data) => {
        const data_ = [];
        for (let i = 0, n = data.length; i < n; i++) {
            const value = data[i];
            if (!value)
                continue;
            const tmpParam = {
                id: i,
                vpos: time2vpos(value.time),
                content: value.comment,
                date: i,
                date_usec: 0,
                owner: true,
                premium: true,
                mail: [],
                user_id: -1,
                layer: -1,
                is_my_post: false,
            };
            if (value.command) {
                tmpParam.mail = value.command.split(/\s+/g);
            }
            if (tmpParam.content.startsWith("/")) {
                tmpParam.mail.push("invisible");
            }
            data_.push(tmpParam);
        }
        return data_;
    };
    const time2vpos = (input) => {
        const time = RegExp(/^(?:(\d+):(\d+)\.(\d+)|(\d+):(\d+)|(\d+)\.(\d+)|(\d+))$/).exec(input);
        if (time) {
            if (time[1] !== undefined &&
                time[2] !== undefined &&
                time[3] !== undefined) {
                return ((Number(time[1]) * 60 + Number(time[2])) * 100 +
                    Number(time[3]) / 10 ** (time[3].length - 2));
            }
            if (time[4] !== undefined && time[5] !== undefined) {
                return (Number(time[4]) * 60 + Number(time[5])) * 100;
            }
            if (time[6] !== undefined && time[7] !== undefined) {
                return (Number(time[6]) * 100 + Number(time[7]) / 10 ** (time[7].length - 2));
            }
            if (time[8] !== undefined) {
                return Number(time[8]) * 100;
            }
        }
        return 0;
    };

    const V1Parser = {
        key: ["v1"],
        parse: (input) => {
            return fromV1(parse(array(ZV1Thread), input));
        },
    };
    const fromV1 = (data) => {
        const data_ = [];
        const userList = [];
        for (const item of data) {
            const val = item.comments;
            const forkName = item.fork;
            for (const value of val) {
                const tmpParam = {
                    id: value.no,
                    vpos: Math.floor(value.vposMs / 10),
                    content: value.body,
                    date: date2time(value.postedAt),
                    date_usec: 0,
                    owner: forkName === "owner",
                    premium: value.isPremium,
                    mail: value.commands,
                    user_id: -1,
                    layer: -1,
                    is_my_post: value.isMyPost,
                };
                if (tmpParam.content.startsWith("/") && tmpParam.owner) {
                    tmpParam.mail.push("invisible");
                }
                const isUserExist = userList.indexOf(value.userId);
                if (isUserExist === -1) {
                    tmpParam.user_id = userList.length;
                    userList.push(value.userId);
                }
                else {
                    tmpParam.user_id = isUserExist;
                }
                data_.push(tmpParam);
            }
        }
        return data_;
    };
    const date2time = (date) => Math.floor(Date.parse(date) / 1000);

    const Xml2jsParser = {
        key: ["xml2js"],
        parse: (input) => {
            return fromXml2js(parse(ZXml2jsPacket, input));
        },
    };
    const fromXml2js = (data) => {
        const data_ = [];
        const userList = [];
        let index = data.packet.chat.length;
        for (const item of data.packet.chat) {
            const tmpParam = {
                id: Number(item.$.no) || index++,
                vpos: Number(item.$.vpos),
                content: item._,
                date: Number(item.$.date),
                date_usec: Number(item.$.date_usec),
                owner: !(item.$.owner === "0" || item.$.user_id),
                premium: item.$.premium === "1",
                mail: item.$.mail.split(/\s+/g),
                user_id: -1,
                layer: -1,
                is_my_post: false,
            };
            if (tmpParam.content.startsWith("/") && tmpParam.owner) {
                tmpParam.mail.push("invisible");
            }
            const userId = item.$.user_id ?? "";
            const isUserExist = userList.indexOf(userId);
            if (isUserExist === -1) {
                tmpParam.user_id = userList.length;
                userList.push(userId);
            }
            else {
                tmpParam.user_id = isUserExist;
            }
            data_.push(tmpParam);
        }
        return data_;
    };

    const XmlDocumentParser = {
        key: ["formatted", "niconicome"],
        parse: (input) => {
            if (!typeGuard.xmlDocument(input))
                throw new InvalidFormatError();
            return parseXMLDocument(input);
        },
    };
    const parseXMLDocument = (data) => {
        const data_ = [];
        const userList = [];
        let index = Array.from(data.documentElement.children).length;
        for (const item of Array.from(data.documentElement.children)) {
            if (item.nodeName !== "chat")
                continue;
            const tmpParam = {
                id: Number(item.getAttribute("no")) || index++,
                vpos: Number(item.getAttribute("vpos")),
                content: item.textContent ?? "",
                date: Number(item.getAttribute("date")) || 0,
                date_usec: Number(item.getAttribute("date_usec")) || 0,
                owner: !item.getAttribute("user_id"),
                premium: item.getAttribute("premium") === "1",
                mail: [],
                user_id: -1,
                layer: -1,
                is_my_post: false,
            };
            if (item.getAttribute("mail")) {
                tmpParam.mail = item.getAttribute("mail")?.split(/\s+/g) ?? [];
            }
            if (tmpParam.content.startsWith("/") && tmpParam.owner) {
                tmpParam.mail.push("invisible");
            }
            const userId = item.getAttribute("user_id") ?? "";
            const isUserExist = userList.indexOf(userId);
            if (isUserExist === -1) {
                tmpParam.user_id = userList.length;
                userList.push(userId);
            }
            else {
                tmpParam.user_id = isUserExist;
            }
            data_.push(tmpParam);
        }
        return data_;
    };

    const parsers = [
        EmptyParser,
        FormattedParser,
        LegacyParser,
        LegacyOwnerParser,
        OwnerParser,
        V1Parser,
        Xml2jsParser,
        XmlDocumentParser,
    ];

    const convert2formattedComment = (data, type) => {
        const parser = parsers.find((parser) => parser.key.includes(type));
        if (!parser)
            throw new InvalidFormatError();
        return sort(parser.parse(data));
    };
    const sort = (data) => {
        data.sort((a, b) => {
            if (a.vpos < b.vpos)
                return -1;
            if (a.vpos > b.vpos)
                return 1;
            if (a.date < b.date)
                return -1;
            if (a.date > b.date)
                return 1;
            if (a.date_usec < b.date_usec)
                return -1;
            if (a.date_usec > b.date_usec)
                return 1;
            return 0;
        });
        return data;
    };

    var inputParser = /*#__PURE__*/Object.freeze({
        __proto__: null,
        default: convert2formattedComment
    });

    class CanvasRenderer {
        canvas;
        video;
        context;
        constructor(canvas, video) {
            this.canvas = canvas ?? document.createElement("canvas");
            const context = this.canvas.getContext("2d");
            if (!context)
                throw new CanvasRenderingContext2DError();
            this.context = context;
            this.context.textAlign = "start";
            this.context.textBaseline = "alphabetic";
            this.video = video;
        }
        drawVideo(enableLegacyPip) {
            if (this.video) {
                let scale;
                const height = this.canvas.height / this.video.videoHeight;
                const width = this.canvas.width / this.video.videoWidth;
                if (enableLegacyPip ? height > width : height < width) {
                    scale = width;
                }
                else {
                    scale = height;
                }
                const offsetX = (this.canvas.width - this.video.videoWidth * scale) * 0.5;
                const offsetY = (this.canvas.height - this.video.videoHeight * scale) * 0.5;
                this.context.drawImage(this.video, offsetX, offsetY, this.video.videoWidth * scale, this.video.videoHeight * scale);
            }
        }
        getFont() {
            return this.context.font;
        }
        getFillStyle() {
            return this.context.fillStyle;
        }
        setScale(scale, arg1) {
            this.context.scale(scale, arg1 ?? scale);
        }
        drawImage(image, x, y, width, height) {
            if (!(image instanceof CanvasRenderer)) {
                throw new TypeError("CanvasRenderer.drawImage: 'image' argument must be an instance of CanvasRenderer.");
            }
            if (width === undefined || height === undefined)
                this.context.drawImage(image.canvas, x, y);
            else
                this.context.drawImage(image.canvas, x, y, width, height);
        }
        fillRect(x, y, width, height) {
            this.context.fillRect(x, y, width, height);
        }
        strokeRect(x, y, width, height) {
            this.context.strokeRect(x, y, width, height);
        }
        fillText(text, x, y) {
            this.context.fillText(text, x, y);
        }
        strokeText(text, x, y) {
            this.context.strokeText(text, x, y);
        }
        quadraticCurveTo(cpx, cpy, x, y) {
            this.context.quadraticCurveTo(cpx, cpy, x, y);
        }
        clearRect(x, y, width, height) {
            this.context.clearRect(x, y, width, height);
        }
        setFont(font) {
            this.context.font = font;
        }
        setFillStyle(color) {
            this.context.fillStyle = color;
        }
        setStrokeStyle(color) {
            this.context.strokeStyle = color;
        }
        setLineWidth(width) {
            this.context.lineWidth = width;
        }
        setGlobalAlpha(alpha) {
            this.context.globalAlpha = alpha;
        }
        setSize(width, height) {
            this.canvas.width = width;
            this.canvas.height = height;
        }
        getSize() {
            return { width: this.canvas.width, height: this.canvas.height };
        }
        measureText(text) {
            return this.context.measureText(text);
        }
        beginPath() {
            this.context.beginPath();
        }
        closePath() {
            this.context.closePath();
        }
        moveTo(x, y) {
            this.context.moveTo(x, y);
        }
        lineTo(x, y) {
            this.context.lineTo(x, y);
        }
        stroke() {
            this.context.stroke();
        }
        save() {
            this.context.save();
        }
        restore() {
            this.context.restore();
        }
        getCanvas() {
            return new CanvasRenderer();
        }
        destroy() {
        }
    }

    var index = /*#__PURE__*/Object.freeze({
        __proto__: null,
        CanvasRenderer: CanvasRenderer
    });

    const createCommentInstance = (comment, context, index) => {
        for (const plugin of config.commentPlugins) {
            if (plugin.condition(comment)) {
                return new plugin.class(comment, context, index);
            }
        }
        return new HTML5Comment(comment, context, index);
    };

    const definition = {
        colors: colors$1,
        config: config$1,
        fonts: fonts$1,
        initConfig: initConfig$1,
    };

    var internal = /*#__PURE__*/Object.freeze({
        __proto__: null,
        comments: index$1,
        contexts: index$4,
        definition: definition,
        errors: index$3,
        eventHandler: eventHandler,
        inputParser: inputParser,
        renderer: index,
        typeGuard: typeGuard$1,
        utils: index$2
    });

    class NiconiComments {
        enableLegacyPiP;
        showCollision;
        showFPS;
        showCommentCount;
        lastVpos;
        get lastVposInt() {
            return Math.floor(this.lastVpos);
        }
        processedCommentIndex;
        comments;
        renderer;
        collision;
        timeline;
        static typeGuard = typeGuard;
        static default = NiconiComments;
        static FlashComment = {
            condition: isFlashComment,
            class: FlashComment,
        };
        static internal = internal;
        constructor(_renderer, data, initOptions = {}) {
            const constructorStart = performance.now();
            initConfig();
            if (!typeGuard.config.initOptions(initOptions))
                throw new InvalidOptionError();
            setOptions(Object.assign(defaultOptions, initOptions));
            setConfig(Object.assign(defaultConfig, options.config));
            setIsDebug(options.debug);
            resetImageCache();
            resetNicoScripts();
            let renderer = _renderer;
            if (renderer instanceof HTMLCanvasElement) {
                renderer = new CanvasRenderer(renderer, options.video);
            }
            else if (options.video) {
                console.warn("options.video is ignored because renderer is not HTMLCanvasElement");
            }
            this.renderer = renderer;
            this.renderer.setLineWidth(getConfig(config.contextLineWidth, false));
            const rendererSize = this.renderer.getSize();
            this.renderer.setScale(rendererSize.width / config.canvasWidth, rendererSize.height / config.canvasHeight);
            let formatType = options.format;
            if (options.formatted) {
                console.warn("Deprecated: options.formatted is no longer recommended. Please use options.format. https://xpadev-net.github.io/niconicomments/#p_format");
            }
            if (formatType === "default") {
                formatType = options.formatted ? "formatted" : "legacy";
            }
            if (options.useLegacy) {
                console.warn("Deprecated: options.useLegacy is no longer recommended. Please use options.mode. https://xpadev-net.github.io/niconicomments/#p_mode");
            }
            if (options.mode === "default" && options.useLegacy) {
                options.mode = "html5";
            }
            const parsedData = convert2formattedComment(data, formatType);
            this.showCollision = options.showCollision;
            this.showFPS = options.showFPS;
            this.showCommentCount = options.showCommentCount;
            this.enableLegacyPiP = options.enableLegacyPiP;
            this.timeline = {};
            this.collision = {
                ue: [],
                shita: [],
                left: [],
                right: [],
            };
            this.lastVpos = -1;
            this.processedCommentIndex = -1;
            this.comments = this.preRendering(parsedData);
            logger(`constructor complete: ${performance.now() - constructorStart}ms`);
        }
        preRendering(_rawData) {
            let rawData = _rawData;
            const preRenderingStart = performance.now();
            if (options.keepCA) {
                rawData = changeCALayer(rawData);
            }
            let instances = rawData.reduce((pv, val, index) => {
                pv.push(createCommentInstance(val, this.renderer, index));
                return pv;
            }, []);
            this.getCommentPos(instances, instances.length, options.lazy);
            this.sortTimelineComment();
            const plugins = [];
            for (const plugin of config.plugins) {
                try {
                    const canvas = this.renderer.getCanvas();
                    const pluginInstance = new plugin(canvas, instances);
                    plugins.push({
                        canvas,
                        instance: pluginInstance,
                    });
                    if (pluginInstance.transformComments) {
                        instances = pluginInstance.transformComments(instances);
                    }
                }
                catch (e) {
                    console.error("Failed to init plugin");
                }
            }
            setPlugins(plugins);
            logger(`preRendering complete: ${performance.now() - preRenderingStart}ms`);
            return instances;
        }
        getCommentPos(data, end, lazy = false) {
            const getCommentPosStart = performance.now();
            if (this.processedCommentIndex + 1 >= end)
                return;
            for (const comment of data.slice(this.processedCommentIndex + 1, end)) {
                if (comment.invisible || (comment.posY > -1 && !lazy))
                    continue;
                if (comment.loc === "naka") {
                    processMovableComment(comment, this.collision, this.timeline, lazy);
                }
                else {
                    processFixedComment(comment, this.collision[comment.loc], this.timeline, lazy);
                }
                this.processedCommentIndex = comment.index;
            }
            if (lazy) {
                this.processedCommentIndex = 0;
            }
            logger(`getCommentPos complete: ${performance.now() - getCommentPosStart}ms`);
        }
        sortTimelineComment() {
            const sortCommentStart = performance.now();
            for (const vpos of Object.keys(this.timeline)) {
                const item = this.timeline[Number(vpos)];
                if (!item)
                    continue;
                const owner = [];
                const user = [];
                for (const comment of item) {
                    if (comment?.owner) {
                        owner.push(comment);
                    }
                    else {
                        user.push(comment);
                    }
                }
                this.timeline[Number(vpos)] = user.concat(owner);
            }
            logger(`parseData complete: ${performance.now() - sortCommentStart}ms`);
        }
        addComments(...rawComments) {
            const comments = rawComments.reduce((pv, val, index) => {
                pv.push(createCommentInstance(val, this.renderer, this.comments.length + index));
                return pv;
            }, []);
            for (const plugin of plugins) {
                try {
                    plugin.instance.addComments?.(comments);
                }
                catch (e) {
                    console.error("Failed to add comments", e);
                }
            }
            for (const comment of comments) {
                if (comment.invisible)
                    continue;
                if (comment.loc === "naka") {
                    processMovableComment(comment, this.collision, this.timeline);
                }
                else {
                    processFixedComment(comment, this.collision[comment.loc], this.timeline);
                }
            }
        }
        drawCanvas(vpos, forceRendering = false, cursor) {
            const vposInt = Math.floor(vpos);
            const drawCanvasStart = performance.now();
            if (this.lastVpos === vpos && !forceRendering)
                return false;
            triggerHandler(vposInt, this.lastVposInt);
            const timelineRange = this.timeline[vposInt];
            if (!forceRendering &&
                plugins.length === 0 &&
                timelineRange?.filter((item) => item.loc === "naka").length === 0 &&
                this.timeline[this.lastVposInt]?.filter((item) => item.loc === "naka")
                    ?.length === 0) {
                const current = timelineRange.filter((item) => item.loc !== "naka");
                const last = this.timeline[this.lastVposInt]?.filter((item) => item.loc !== "naka") ?? [];
                if (arrayEqual(current, last))
                    return false;
            }
            this.renderer.clearRect(0, 0, config.canvasWidth, config.canvasHeight);
            this.lastVpos = vpos;
            this._drawVideo();
            for (const plugin of plugins) {
                try {
                    plugin.instance.draw?.(vpos);
                    this.renderer.drawImage(plugin.canvas, 0, 0);
                }
                catch (e) {
                    console.error("Failed to draw comments", e);
                }
            }
            this._drawCollision(vposInt);
            this._drawComments(timelineRange, vpos, cursor);
            this._drawFPS(drawCanvasStart);
            this._drawCommentCount(timelineRange?.length);
            logger(`drawCanvas complete: ${performance.now() - drawCanvasStart}ms`);
            return true;
        }
        _drawVideo() {
            this.renderer.drawVideo(this.enableLegacyPiP);
        }
        _drawComments(timelineRange, vpos, cursor) {
            if (timelineRange) {
                const targetComment = (() => {
                    if (config.commentLimit === undefined) {
                        return timelineRange;
                    }
                    if (config.hideCommentOrder === "asc") {
                        return timelineRange.slice(-config.commentLimit);
                    }
                    return timelineRange.slice(0, config.commentLimit);
                })();
                for (const comment of targetComment) {
                    if (comment.invisible) {
                        continue;
                    }
                    this.getCommentPos(this.comments, comment.index + 1);
                    comment.draw(vpos, this.showCollision, cursor);
                }
            }
        }
        _drawCollision(vpos) {
            if (this.showCollision) {
                this.renderer.save();
                const leftCollision = this.collision.left[vpos];
                const rightCollision = this.collision.right[vpos];
                this.renderer.setFillStyle("red");
                if (leftCollision) {
                    for (const comment of leftCollision) {
                        this.renderer.fillRect(config.collisionRange.left, comment.posY, getConfig(config.contextLineWidth, comment.flash), comment.height);
                    }
                }
                if (rightCollision) {
                    for (const comment of rightCollision) {
                        this.renderer.fillRect(config.collisionRange.right, comment.posY, getConfig(config.contextLineWidth, comment.flash) * -1, comment.height);
                    }
                }
                this.renderer.restore();
            }
        }
        _drawFPS(drawCanvasStart) {
            if (this.showFPS) {
                this.renderer.save();
                this.renderer.setFont(parseFont("defont", 60));
                this.renderer.setFillStyle("#00FF00");
                this.renderer.setStrokeStyle(`rgba(${hex2rgb(config.contextStrokeColor).join(",")},${config.contextStrokeOpacity})`);
                const drawTime = Math.floor(performance.now() - drawCanvasStart);
                const fps = Math.floor(1000 / (drawTime === 0 ? 1 : drawTime));
                this.renderer.strokeText(`FPS:${fps}(${drawTime}ms)`, 100, 100);
                this.renderer.fillText(`FPS:${fps}(${drawTime}ms)`, 100, 100);
                this.renderer.restore();
            }
        }
        _drawCommentCount(count) {
            if (this.showCommentCount) {
                this.renderer.save();
                this.renderer.setFont(parseFont("defont", 60));
                this.renderer.setFillStyle("#00FF00");
                this.renderer.setStrokeStyle(`rgba(${hex2rgb(config.contextStrokeColor).join(",")},${config.contextStrokeOpacity})`);
                this.renderer.strokeText(`Count:${count ?? 0}`, 100, 200);
                this.renderer.fillText(`Count:${count ?? 0}`, 100, 200);
                this.renderer.restore();
            }
        }
        addEventListener(eventName, handler) {
            registerHandler(eventName, handler);
        }
        removeEventListener(eventName, handler) {
            removeHandler(eventName, handler);
        }
        clear() {
            const size = this.renderer.getSize();
            this.renderer.clearRect(0, 0, size.width, size.height);
        }
        click(vpos, pos) {
            const _comments = this.timeline[vpos];
            if (!_comments)
                return;
            const comments = [..._comments].reverse();
            for (const comment of comments) {
                if (comment.isHovered(pos)) {
                    const newComment = buildAtButtonComment(comment.comment, vpos);
                    if (!newComment)
                        continue;
                    this.addComments(newComment);
                }
            }
        }
    }
    const logger = (msg) => {
        if (isDebug)
            console.debug(msg);
    };

    return NiconiComments;

}));
