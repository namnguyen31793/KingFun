/**
 * Created by Nofear on 6/8/2017.
 */

(function () {
    var SbStringUtil;

    SbStringUtil = (function () {
        var instance;

        function SbStringUtil() {
        }

        instance = void 0;

        SbStringUtil.getInstance = function () {
            if (instance === void 0) {
                instance = this;
            }
            return instance.prototype;
        };

        SbStringUtil.prototype.formatMoneyNumber = function(t, e) {
            void 0 === e && (e = 2);
            var i = 1
              , n = t;
            t < 0 && (i = -1,
            n *= -1);
            var o = "";
            return n >= 1e9 ? (n /= 1e9,
            o = "B") : n >= 1e6 ? (n /= 1e6,
            o = "M") : n >= 1e3 && (n /= 1e3,
            o = "K"),
            (n = Math.floor(n * Math.pow(10, e) + 1e-8) / Math.pow(10, e) * i) + o
        }
        ,
        SbStringUtil.prototype.formatMoneyNumber2 = function(t) {
            var e = 1
              , i = t;
            t < 0 && (e = -1,
            i *= -1);
            var n = "";
            return i >= 1e9 ? (i /= 1e9,
            n = " T\u1ef7") : i >= 1e6 ? (i /= 1e6,
            n = " Tri\u1ec7u") : i >= 1e3 && (i /= 1e3,
            n = " Ng\xe0n"),
            (i = Math.floor(100 * i + 1e-8) / 100 * e) + n
        }
        ,
        SbStringUtil.prototype.formatMoneyNumberWithDot = function(t) {
            var e = !1;
            if (t < 0 && (t *= -1,
            e = !0),
            t < 1e3) {
                var i = Math.floor(t).toString();
                return 1 == e && (i = "-" + i),
                i
            }
            for (var n = "", o = Math.floor(t).toString(), a = o.length; a >= 0; a -= 3) {
                if (a - 3 <= 0) {
                    n = o.slice(0, a) + n;
                    break
                }
                n = "." + o.slice(a - 3, a) + n
            }
            return 1 == e && (n = "-" + n),
            n
        }
        ,
        SbStringUtil.prototype.formatMoneyNumberWithComma = function(t, e) {
            void 0 === e && (e = 1);
            var i = !1;
            if (t < 0 && (t *= -1,
            i = !0),
            t < 1e3) {
                var n = Number(t).toFixed(e).toString();
                return Number.isInteger(t) && (n = Math.floor(t).toString()),
                1 == i && (n = "-" + n),
                n
            }
            var o = ""
              , a = Number(t).toFixed(e).toString();
            Number.isInteger(t) && (a = Math.floor(t).toString());
            var s = a.indexOf(".")
              , r = a.length;
            s < 0 ? s = 0 : r = a.length - (a.length - s);
            for (var c = r; c >= 0; c -= 3) {
                if (c - 3 <= 0) {
                    o = a.slice(0, c) + o;
                    break
                }
                o = "," + a.slice(c - 3, c) + o
            }
            return s > 0 && (o += a.slice(-(a.length - s))),
            1 == i && (o = "-" + o),
            o
        }
        ,
        SbStringUtil.prototype.formatNumber = function(t) {
            return SbStringUtil.prototype.toLocaleString()
        }
        ,
        SbStringUtil.prototype.getRandomInt = function(t) {
            return Math.floor(Math.random() * Math.floor(t))
        }
        ,
        SbStringUtil.prototype.getRandomFloat = function(t) {
            return Math.random() * t
        }
        ,
        SbStringUtil.prototype.getRandomArbitrary = function(t, e) {
            return Math.random() * (e - t) + t
        }
        ,
        SbStringUtil.prototype.checkVec2Equal = function(t, e) {
            return SbStringUtil.prototype.x === e.x && SbStringUtil.prototype.y === e.y
        }
        ,
        SbStringUtil.prototype.isNullOrEmpty = function(t) {
            return void 0 === t || null === t || "" === t || 0 === SbStringUtil.prototype.length
        }
        ,
        SbStringUtil.prototype.getQueryStringValue = function(t) {
            return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(t).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$","i"), "$1"))
        }
        ,
        SbStringUtil.prototype.filterTenDangNhap = function(t) {
            return SbStringUtil.prototype.replace(/[^A-Za-z0-9]/g, "")
        }
        ,
        SbStringUtil.prototype.isContainSpecialCharacter = function(t) {
            return SbStringUtil.prototype.search(/[\xc0\xc1\xc2\xc3\xc8\xc9\xca\xcc\xcd\xd2\xd3\xd4\xd5\xd9\xda\xdd\xe0\xe1\xe2\xe3\xe8\xe9\xea\xec\xed\xf2\xf3\xf4\xf5\xf9\xfa\xfd\u1ef2\u1ef8\u1ef3\u1ef9\u1ef6\u1ef7\u1ef4\u1ef5\u1ef1\u1ef0\u1eed\u1eec\u1eef\u1eee\u1eeb\u1eea\u1ee9\u1ee8\u01b0\u01af\u1ee5\u1ee4\u1ee7\u1ee6\u0169\u0168\u1ee3\u1ee2\u1edf\u1ede\u1ee1\u1ee0\u1edd\u1edc\u1edb\u1eda\u01a1\u01a0\u1ed9\u1ed8\u1ed5\u1ed4\u1ed7\u1ed6\u1ed3\u1ed2\u1ed1\u1ed0\u1ecd\u1ecc\u1ecf\u1ece\u1ecb\u1eca\u1ec9\u1ec8\u0129\u0128\u1ec7\u1ec6\u1ec3\u1ec2\u1ec5\u1ec4\u1ec1\u1ec0\u1ebf\u1ebe\u1eb9\u1eb8\u1ebb\u1eba\u1ebd\u1ebc\u1eb7\u1eb6\u1eb3\u1eb2\u1eb5\u1eb4\u1eb1\u1eb0\u1eaf\u1eae\u0103\u0102\u1ead\u1eac\u1ea9\u1ea8\u1eab\u1eaa\u1ea7\u1ea6\u1ea5\u1ea4\u1ea1\u1ea0\u1ea3\u1ea2\u0111\u0110 !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g) >= 0
        }
        ,
        SbStringUtil.prototype.removeSpecialCharacter = function(t, e) {
            return void 0 === e && (e = !0),
            e ? SbStringUtil.prototype.replace(/[^A-Za-z0-9\xc0\xc1\xc2\xc3\xc8\xc9\xca\xcc\xcd\xd2\xd3\xd4\xd5\xd9\xda\xdd\xe0\xe1\xe2\xe3\xe8\xe9\xea\xec\xed\xf2\xf3\xf4\xf5\xf9\xfa\xfd\u1ef2\u1ef8\u1ef3\u1ef9\u1ef6\u1ef7\u1ef4\u1ef5\u1ef1\u1ef0\u1eed\u1eec\u1eef\u1eee\u1eeb\u1eea\u1ee9\u1ee8\u01b0\u01af\u1ee5\u1ee4\u1ee7\u1ee6\u0169\u0168\u1ee3\u1ee2\u1edf\u1ede\u1ee1\u1ee0\u1edd\u1edc\u1edb\u1eda\u01a1\u01a0\u1ed9\u1ed8\u1ed5\u1ed4\u1ed7\u1ed6\u1ed3\u1ed2\u1ed1\u1ed0\u1ecd\u1ecc\u1ecf\u1ece\u1ecb\u1eca\u1ec9\u1ec8\u0129\u0128\u1ec7\u1ec6\u1ec3\u1ec2\u1ec5\u1ec4\u1ec1\u1ec0\u1ebf\u1ebe\u1eb9\u1eb8\u1ebb\u1eba\u1ebd\u1ebc\u1eb7\u1eb6\u1eb3\u1eb2\u1eb5\u1eb4\u1eb1\u1eb0\u1eaf\u1eae\u0103\u0102\u1ead\u1eac\u1ea9\u1ea8\u1eab\u1eaa\u1ea7\u1ea6\u1ea5\u1ea4\u1ea1\u1ea0\u1ea3\u1ea2\u0111\u0110 !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, "") : SbStringUtil.prototype.replace(/[^A-Za-z0-9\xc0\xc1\xc2\xc3\xc8\xc9\xca\xcc\xcd\xd2\xd3\xd4\xd5\xd9\xda\xdd\xe0\xe1\xe2\xe3\xe8\xe9\xea\xec\xed\xf2\xf3\xf4\xf5\xf9\xfa\xfd\u1ef2\u1ef8\u1ef3\u1ef9\u1ef6\u1ef7\u1ef4\u1ef5\u1ef1\u1ef0\u1eed\u1eec\u1eef\u1eee\u1eeb\u1eea\u1ee9\u1ee8\u01b0\u01af\u1ee5\u1ee4\u1ee7\u1ee6\u0169\u0168\u1ee3\u1ee2\u1edf\u1ede\u1ee1\u1ee0\u1edd\u1edc\u1edb\u1eda\u01a1\u01a0\u1ed9\u1ed8\u1ed5\u1ed4\u1ed7\u1ed6\u1ed3\u1ed2\u1ed1\u1ed0\u1ecd\u1ecc\u1ecf\u1ece\u1ecb\u1eca\u1ec9\u1ec8\u0129\u0128\u1ec7\u1ec6\u1ec3\u1ec2\u1ec5\u1ec4\u1ec1\u1ec0\u1ebf\u1ebe\u1eb9\u1eb8\u1ebb\u1eba\u1ebd\u1ebc\u1eb7\u1eb6\u1eb3\u1eb2\u1eb5\u1eb4\u1eb1\u1eb0\u1eaf\u1eae\u0103\u0102\u1ead\u1eac\u1ea9\u1ea8\u1eab\u1eaa\u1ea7\u1ea6\u1ea5\u1ea4\u1ea1\u1ea0\u1ea3\u1ea2\u0111\u0110!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, "")
        }
        ,
        SbStringUtil.prototype.filterForDisplayName = function(t) {
            return SbStringUtil.prototype.replace(/[^A-Za-z0-9 \xc0\xc1\xc2\xc3\xc8\xc9\xca\xcc\xcd\xd2\xd3\xd4\xd5\xd9\xda\xdd\xe0\xe1\xe2\xe3\xe8\xe9\xea\xec\xed\xf2\xf3\xf4\xf5\xf9\xfa\xfd\u1ef2\u1ef8\u1ef3\u1ef9\u1ef6\u1ef7\u1ef4\u1ef5\u1ef1\u1ef0\u1eed\u1eec\u1eef\u1eee\u1eeb\u1eea\u1ee9\u1ee8\u01b0\u01af\u1ee5\u1ee4\u1ee7\u1ee6\u0169\u0168\u1ee3\u1ee2\u1edf\u1ede\u1ee1\u1ee0\u1edd\u1edc\u1edb\u1eda\u01a1\u01a0\u1ed9\u1ed8\u1ed5\u1ed4\u1ed7\u1ed6\u1ed3\u1ed2\u1ed1\u1ed0\u1ecd\u1ecc\u1ecf\u1ece\u1ecb\u1eca\u1ec9\u1ec8\u0129\u0128\u1ec7\u1ec6\u1ec3\u1ec2\u1ec5\u1ec4\u1ec1\u1ec0\u1ebf\u1ebe\u1eb9\u1eb8\u1ebb\u1eba\u1ebd\u1ebc\u1eb7\u1eb6\u1eb3\u1eb2\u1eb5\u1eb4\u1eb1\u1eb0\u1eaf\u1eae\u0103\u0102\u1ead\u1eac\u1ea9\u1ea8\u1eab\u1eaa\u1ea7\u1ea6\u1ea5\u1ea4\u1ea1\u1ea0\u1ea3\u1ea2\u0111\u0110]/g, "")
        }
        ,
        SbStringUtil.prototype.filterNumber = function(t) {
            return SbStringUtil.prototype.replace(/[.]/g, "")
        }
        ,
        SbStringUtil.prototype.getNumBer = function(t) {
            for (; SbStringUtil.prototype.indexOf(".") >= 0; )
                t = SbStringUtil.prototype.replace(".", "");
            return parseInt(t)
        }
        ,
        SbStringUtil.prototype.getStringofNumBer = function(t) {
            return t <= 9 ? "0" + t : SbStringUtil.prototype.toString()
        }
        ,
        SbStringUtil.prototype.ParseIntBanPhimMobile = function(t, e) {
            void 0 === e && (e = !1);
            var i = 0;
            return cc.sys.platform === cc.sys.MOBILE_BROWSER || cc.sys.platform === cc.sys.DESKTOP_BROWSER ? i = parseInt(t) : (i = parseInt(SbStringUtil.prototype.replace(".", "")),
            SbStringUtil.prototype.indexOf(".") >= 0 && e && (i = parseInt(SbStringUtil.prototype.split(".")[0]))),
            i
        }
        ,
        SbStringUtil.prototype.removeComma = function(t) {
            var e = SbStringUtil.prototype.replace(/,/g, "");
            return void 0 != e && null != e || (e = ""),
            e
        }
        ,
        SbStringUtil.prototype.formatMoneyNumberWithColomAndDot = function(e) {
            if (Number(e) >= 1e3) {
                var i = e.split(".")
                  , n = ""
                  , o = Number(i[0]);
                o >= 1e3 && (n = SbStringUtil.prototype.formatMoneyNumberWithComma(o)),
                e = n,
                void 0 != i[1] && (e += "." + i[1])
            }
            return e
        }
        ,
        SbStringUtil.prototype.formatTime = function(t) {
            return ("0" + t).slice(-2)
        }
        ,
        SbStringUtil.prototype.formatTimes = function(e, i, n) {
            return SbStringUtil.prototype.formatTime(e) + ":" + SbStringUtil.prototype.formatTime(i) + ":" + SbStringUtil.prototype.formatTime(n)
        }

        return SbStringUtil;

    })();

    cc.SbStringUtil = SbStringUtil;

}).call(this);
