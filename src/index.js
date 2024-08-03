"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Xss = void 0;
var spider_1 = require("@hive-o/spider");
var weber_1 = require("@hive-o/weber");
var async = require("async");
var DEBUG = require("debug");
var Xss = /** @class */ (function () {
    function Xss() {
    }
    Xss.prototype.debugger = function (tag) {
        return DEBUG("xss:".concat(tag));
    };
    Xss.prototype.scan = function (urls, payloads) {
        return __awaiter(this, void 0, void 0, function () {
            var debug, spider;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        debug = this.debugger('scan');
                        debug('started');
                        debug('metrics | urls: %o, payloads: %o', urls.length, payloads.length);
                        spider = new spider_1.Spider();
                        return [4 /*yield*/, spider.start(__spreadArray([], urls, true))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, async.forEachSeries(payloads, function (payload) { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, async.forEachSeries(spider.navigation.entries(), function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                                                var browser, page, e_1;
                                                var _this = this;
                                                var query_params = _b.query_params, url = _b.url;
                                                return __generator(this, function (_c) {
                                                    switch (_c.label) {
                                                        case 0:
                                                            browser = weber_1.WeberBrowser.instance();
                                                            return [4 /*yield*/, browser.launch()];
                                                        case 1:
                                                            _c.sent();
                                                            return [4 /*yield*/, browser.context.newPage()];
                                                        case 2:
                                                            page = _c.sent();
                                                            _c.label = 3;
                                                        case 3:
                                                            _c.trys.push([3, 6, 7, 10]);
                                                            console.log("scanning ".concat(url, " | payload ").concat(payload));
                                                            // Improved Error Handling and Event Management
                                                            page.on('dialog', function (dialog) { return __awaiter(_this, void 0, void 0, function () {
                                                                return __generator(this, function (_a) {
                                                                    switch (_a.label) {
                                                                        case 0:
                                                                            console.log('Found Vulnerability: ', dialog.message());
                                                                            return [4 /*yield*/, dialog.dismiss()];
                                                                        case 1:
                                                                            _a.sent();
                                                                            return [2 /*return*/];
                                                                    }
                                                                });
                                                            }); });
                                                            page.on('error', console.error); // Catch potential page errors
                                                            url.searchParams.append('query', payload);
                                                            return [4 /*yield*/, page.goto(url.toString(), {
                                                                    timeout: 20000,
                                                                    waitUntil: 'networkidle2',
                                                                })];
                                                        case 4:
                                                            _c.sent(); // Increased timeout, wait for network idle
                                                            // Dynamic Wait for Page Content (Optional)
                                                            return [4 /*yield*/, page.waitForFunction(function () { return document.readyState === 'complete'; }, {
                                                                    timeout: 20000,
                                                                })];
                                                        case 5:
                                                            // Dynamic Wait for Page Content (Optional)
                                                            _c.sent();
                                                            return [3 /*break*/, 10];
                                                        case 6:
                                                            e_1 = _c.sent();
                                                            console.error("Error processing ".concat(url.toString(), ":"), e_1); // Log specific URL
                                                            return [3 /*break*/, 10];
                                                        case 7: return [4 /*yield*/, page.close()];
                                                        case 8:
                                                            _c.sent();
                                                            return [4 /*yield*/, browser.close()];
                                                        case 9:
                                                            _c.sent();
                                                            console.log("scanning ".concat(url, " | payload ").concat(payload, " completed"));
                                                            return [7 /*endfinally*/];
                                                        case 10: return [2 /*return*/];
                                                    }
                                                });
                                            }); })];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Xss;
}());
exports.Xss = Xss;
