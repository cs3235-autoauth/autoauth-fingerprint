

/*******************
 * Utility Functions 
 * ******************/

//For Plugins
var isIE = function () {
    if (navigator.appName === 'Microsoft Internet Explorer') {
        return true
    } else if (navigator.appName === 'Netscape' && /Trident/.test(navigator.userAgent)) { // IE 11
        return true
    }
    return false
}


var getRegularPlugins = function () {
    if (navigator.plugins == null) {
        return 'not available' 
    }
    var plugins = []
    for (var i = 0, l = navigator.plugins.length; i < l; i++) {
        if (navigator.plugins[i]) { plugins.push(navigator.plugins[i]) }
    }
    return _.map(plugins, function (p) {
        var mimeTypes = _.map(p, function (mt) {
            return [mt.type, mt.suffixes];
        });
        return [p.name, p.description, mimeTypes];
    })
}

var getIEPlugins = function () {
    var result = [];
    if ((Object.getOwnPropertyDescriptor && Object.getOwnPropertyDescriptor(window, 'ActiveXObject')) || ('ActiveXObject' in window)) {
        var names = [
            'AcroPDF.PDF', // Adobe PDF reader 7+
            'Adodb.Stream',
            'AgControl.AgControl', // Silverlight
            'DevalVRXCtrl.DevalVRXCtrl.1',
            'MacromediaFlashPaper.MacromediaFlashPaper',
            'Msxml2.DOMDocument',
            'Msxml2.XMLHTTP',
            'PDF.PdfCtrl', // Adobe PDF reader 6 and earlier, brrr
            'QuickTime.QuickTime', // QuickTime
            'QuickTimeCheckObject.QuickTimeCheck.1',
            'RealPlayer',
            'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)',
            'RealVideo.RealVideo(tm) ActiveX Control (32-bit)',
            'Scripting.Dictionary',
            'SWCtl.SWCtl', // ShockWave player
            'Shell.UIHelper',
            'ShockwaveFlash.ShockwaveFlash', // flash plugin
            'Skype.Detection',
            'TDCCtl.TDCCtl',
            'WMPlayer.OCX', // Windows media player
            'rmocx.RealPlayer G2 Control',
            'rmocx.RealPlayer G2 Control.1'
        ]
        // starting to detect plugins in IE
        result = _.map(names, function (name) {
            try {
                new window.ActiveXObject(name);
                return name;
            } catch (e) {
                return 'error' 
            }
        })
    } else {
        //result.push(options.NOT_AVAILABLE)
        results.push('not available')
    }
    if (navigator.plugins) {
        result = result.concat(getRegularPlugins());
    }
    return result;
}

//For canvas
var isCanvasSupported = function () {
    var e = document.createElement('canvas')
    return !!(e.getContext && e.getContext('2d'))
}

var getCanvasFp = function (options) {
    var result = []
    // Very simple now, need to make it more complex (geo shapes etc)
    var canvas = document.createElement('canvas')
    canvas.width = 2000
    canvas.height = 200
    canvas.style.display = 'inline'
    var ctx = canvas.getContext('2d')
    // detect browser support of canvas winding
    // http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
    // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/winding.js
    ctx.rect(0, 0, 10, 10)
    ctx.rect(2, 2, 6, 6)
    result.push('canvas winding:' + ((ctx.isPointInPath(5, 5, 'evenodd') === false) ? 'yes' : 'no'))


    // detect if photoshops bending modes are available in canvas
    // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/blending.js
    // firefox 3 throws an error when setting an invalid `globalCompositeOperation`
    try {
        ctx.globalCompositeOperation = 'screen';
    } catch (e) {}

    result.push('canvas blending:' + ((ctx.globalCompositeOperation === 'screen')? 'yes' : 'no'))

    //To data URL
    if (canvas.toDataURL) { result.push('canvas fp:' + canvas.toDataURL()) }
    return result
}



//For WebGL 
var isWebGlSupported = function () {
    // code taken from Modernizr
    if (!isCanvasSupported()) {
        return false
    }
    var canvas = document.createElement('canvas')
    var gl = null
    try {
        gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    } catch (e) { /* squelch */ }
    if (!gl) { gl = null }

    return !!window.WebGLRenderingContext && !!gl
}

var getWebglFp = function() {
    var canvas, ctx, width = 256, height = 128;
    canvas = document.body.appendChild(document.createElement("canvas"));
    canvas.width = width,
        canvas.height = height,
        ctx = canvas.getContext("webgl2") || canvas.getContext("experimental-webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl") || canvas.getContext("moz-webgl");

    try {
        var f = "attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}";
        var g = "precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}";
        var h = ctx.createBuffer();

        ctx.bindBuffer(ctx.ARRAY_BUFFER, h);

        var i = new Float32Array([-.2, -.9, 0, .4, -.26, 0, 0, .7321, 0]);

        ctx.bufferData(ctx.ARRAY_BUFFER, i, ctx.STATIC_DRAW), h.itemSize = 3, h.numItems = 3;

        var j = ctx.createProgram();
        var k = ctx.createShader(ctx.VERTEX_SHADER);

        ctx.shaderSource(k, f);
        ctx.compileShader(k);

        var l = ctx.createShader(ctx.FRAGMENT_SHADER);

        ctx.shaderSource(l, g);
        ctx.compileShader(l);
        ctx.attachShader(j, k);
        ctx.attachShader(j, l);
        ctx.linkProgram(j);
        ctx.useProgram(j);

        j.vertexPosAttrib = ctx.getAttribLocation(j, "attrVertex");
        j.offsetUniform = ctx.getUniformLocation(j, "uniformOffset");

        ctx.enableVertexAttribArray(j.vertexPosArray);
        ctx.vertexAttribPointer(j.vertexPosAttrib, h.itemSize, ctx.FLOAT, !1, 0, 0);
        ctx.uniform2f(j.offsetUniform, 1, 1);
        ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, h.numItems);

    }
    catch (e) {	}

    var m = "";

    var n = new Uint8Array(width * height * 4);
    ctx.readPixels(0, 0, width, height, ctx.RGBA, ctx.UNSIGNED_BYTE, n);
    m = JSON.stringify(n).replace(/,?"[0-9]+":/g, "");

    //SHA256:
    //credit : https://codepen.io/jon/pen/LLPKbz
    var sha256 = (function(){

        // Eratosthenes seive to find primes up to 311 for magic constants. This is why SHA256 is better than SHA1
        var i = 1,
            j,
            K = [],
            H = [];

        while(++i < 18){
            for(j = i * i; j < 312; j += i){
                K[j] = 1;
            }
        }

        function x(num, root){
            return (Math.pow(num, 1 / root) % 1) * 4294967296|0;
        }

        for(i = 1, j = 0; i < 313; ){
            if(!K[++i]){
                H[j] = x(i,2);
                K[j++] = x(i,3);
            }
        }

        function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }

        function SHA256(b){
            var HASH = H.slice(i = 0),
                s = unescape(encodeURI(b)), /* encode as utf8 */
                W = [],
                l = s.length,
                m = [],
                a, y, z;
            for(; i < l; ) m[i >> 2] |= (s.charCodeAt(i) & 0xff) << 8 * (3 - i++ % 4);

            l *= 8;

            m[l >> 5] |= 0x80 << (24 - l % 32);
            m[z = (l + 64 >> 5) | 15] = l;

            for(i = 0; i < z; i += 16){
                a = HASH.slice(j = 0, 8);

                for(; j < 64; a[4] += y){
                    if(j < 16){
                        W[j] = m[j + i];
                    }else{
                        W[j] =
                            (S(y = W[j - 2], 17) ^ S(y, 19) ^ (y >>> 10)) +
                            (W[j - 7]|0) +
                            (S(y = W[j - 15], 7) ^ S(y, 18) ^ (y >>> 3)) +
                            (W[j - 16]|0);
                    }

                    a.unshift(
                        (
                            y = (
                                a.pop() +
                                (S(b = a[4], 6) ^ S(b, 11) ^ S(b, 25)) +
                                (((b & a[5]) ^ ((~b) & a[6])) + K[j])|0
                            ) +
                            (W[j++]|0)
                        ) +
                        (S(l = a[0], 2) ^ S(l, 13) ^ S(l, 22)) +
                        ((l & a[1]) ^ (a[1] & a[2]) ^ (a[2] & l))
                    );
                }

                for(j = 8; j--; ) HASH[j] = a[j] + HASH[j];
            }

            for(s = ''; j < 63; ) s += ((HASH[++j >> 3] >> 4 * (7 - j % 8)) & 15).toString(16);

            return s;
        }

        return SHA256;
    })();

    return sha256(m);
}

var getWebglVendorAndRenderer = function () {
    try {
        var glContext = getWebglCanvas()
        var extensionDebugRendererInfo = glContext.getExtension('WEBGL_debug_renderer_info')
        return glContext.getParameter(extensionDebugRendererInfo.UNMASKED_VENDOR_WEBGL) + '~' + glContext.getParameter(extensionDebugRendererInfo.UNMASKED_RENDERER_WEBGL)
    } catch (e) {
        return undefined;
    }
}

/** Utilit Funcs End **/

class Fingerprint {
    static userAgent() {
        var value = navigator.userAgent;
        return value;
    }

    static language() {
        var value = navigator.language;
        return value;
    }

    static languages() {
        var value = navigator.languages;
        return value;
    }

    static colorDepth() {
        var value = screen.colorDepth;
        return value;
    }

    static deviceMemory() {
        var value = navigator.deviceMemory;
        return value;
    }

    static pixelRatio() {
        var value = window.devicePixelRatio;
        return value;
    }

    static hardwareConcurrency() {
        var value = navigator.hardwareConcurrency;
        return value;
    }


    static screenResolution() {
        return undefined;
    }

    static availableScreenResolution() {
        return undefined;
    }

    static timezoneOffset() {
        return undefined;
    }

    static timezone() {
        return undefined;
    }

    static sessionStorage() {
        return undefined;
    }

    static localStorage() {
        return undefined;
    }

    static indexedDb() {
        try {
            return !!window.indexedDB;
        } catch (e) {
            return true; // SecurityError means indexedDB exists
        }
    }

    static addBehavior() {
        // body may not exist yet or has been removed
        return !!(document.body && document.body.addBehavior);
    }

    static openDatabase() {
        return !!window.openDatabase;
    }

    static cpuClass() {
        return navigator.cpuClass;
    }

    static platform() {
        return navigator.platform;
    }

    static doNotTrack() {
        if (navigator.doNotTrack) {
            return navigator.doNotTrack;
        } else if (navigator.msDoNotTrack) {
            return navigator.msDoNotTrack;
        } else if (window.doNotTrack) {
            return window.doNotTrack;
        } else {
            return undefined;
        }
    }

    static plugins() {
        if (isIE()) {
            return getIEPlugins()
        } else {
            return getRegularPlugins()
        }
    }

    static canvas() {
        if (isCanvasSupported()) {
            return getCanvasFp();
        }
        return undefined;
    }
    static webgl() {
        if (isWebGlSupported()) {
            return getWebglFp()
        }
        return undefined; 
    }

    static webglVendorAndRenderer() {
        if (isWebGlSupported()) {
            return getWebglVendorAndRenderer();
        }
        return undefined;
    }
    
    static adBlock() {
        var ad = document.createElement('div')
        ad.innerHTML = '&nbsp;'
        ad.className = 'adsbox'
        var res = false
        try {
            // body may not exist, that's why we need try/catch
            document.body.appendChild(ad)
            res = document.getElementsByClassName('adsbox')[0].offsetHeight === 0
            document.body.removeChild(ad)
        } catch (e) {}
        return res
    }

    static touchSupport() {
        return undefined;
    }

    static fonts() {
        return undefined;
    }

    static audio() {
        return undefined;
    }

    async static enumerateDevice() {
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
            return undefined;
        }

        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            return devices.map((device) => {
                return 'id=' + device.deviceId + ';gid=' + device.groupId + ';' + device.kind + ';' + device.label;
            });
        } catch (e) {
            return undefined;
        }
    }

    static get() {
        const components = {
            userAgent: this.userAgent(),
            language: this.language(),
            colorDepth: this.colorDepth(),
            deviceMemory: this.deviceMemory(),
            pixelRatio: this.pixelRatio(),
            hardwareConcurrency: this.hardwareConcurrency(),
            screenResolution: this.screenResolution(),
            availableScreenResolution: this.availableScreenResolution(),
            timezoneOffset: this.timezoneOffset(),
            timezone: this.timezone(),
            sessionStorage: this.sessionStorage(),
            localStorage: this.localStorage(),
            indexedDb: this.indexedDb(),
            addBehavior: this.addBehavior(),
            openDatabase: this.openDatabase(),
            cpuClass: this.cpuClass(),
            platform: this.platform(),
            doNotTrack: this.doNotTrack(),
            plugins: this.plugins(),
            canvas: this.canvas(),
            webgl: this.webgl(),
            webglVendorAndRenderer: this.webglVendorAndRenderer(),
            adBlock: this.adBlock(),
            touchSupport: this.touchSupport(),
            fonts: this.fonts(),
            audio: this.audio(),
            enumerateDevice: this.enumerateDevice(),
        };

    Object.keys(components).forEach((key) => {
      if (components[key] === undefined) {
        components[key] = 'unknown';
      }
    });

    return components;
  }
}

//export default Fingerprint;
