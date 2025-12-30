let wasm;

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_externrefs.set(idx, obj);
    return idx;
}

function _assertBoolean(n) {
    if (typeof(n) !== 'boolean') {
        throw new Error(`expected a boolean argument, found ${typeof(n)}`);
    }
}

function _assertNum(n) {
    if (typeof(n) !== 'number') throw new Error(`expected a number argument, found ${typeof(n)}`);
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => state.dtor(state.a, state.b));

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function getArrayU32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let cachedUint32ArrayMemory0 = null;
function getUint32ArrayMemory0() {
    if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.byteLength === 0) {
        cachedUint32ArrayMemory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32ArrayMemory0;
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function logError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        let error = (function () {
            try {
                return e instanceof Error ? `${e.message}\n\nStack:\n${e.stack}` : e.toString();
            } catch(_) {
                return "<failed to stringify thrown value>";
            }
        }());
        console.error("wasm-bindgen: imported JS function that was not marked as `catch` threw an error:", error);
        throw e;
    }
}

function makeClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {

        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        try {
            return f(state.a, state.b, ...args);
        } finally {
            real._wbg_cb_unref();
        }
    };
    real._wbg_cb_unref = () => {
        if (--state.cnt === 0) {
            state.dtor(state.a, state.b);
            state.a = 0;
            CLOSURE_DTORS.unregister(state);
        }
    };
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {

        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            state.a = a;
            real._wbg_cb_unref();
        }
    };
    real._wbg_cb_unref = () => {
        if (--state.cnt === 0) {
            state.dtor(state.a, state.b);
            state.a = 0;
            CLOSURE_DTORS.unregister(state);
        }
    };
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (typeof(arg) !== 'string') throw new Error(`expected a string argument, found ${typeof(arg)}`);
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);
        if (ret.read !== arg.length) throw new Error('failed to pass whole string');
        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    }
}

let WASM_VECTOR_LEN = 0;

function wasm_bindgen__convert__closures_____invoke__h89cfc849b552b19b(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.wasm_bindgen__convert__closures_____invoke__h89cfc849b552b19b(arg0, arg1, arg2);
}

function wasm_bindgen__convert__closures_____invoke__h3e2c67654a2d5277(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.wasm_bindgen__convert__closures_____invoke__h3e2c67654a2d5277(arg0, arg1, arg2);
}

function wasm_bindgen__convert__closures_____invoke__h69d907cbca5bfb7f(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.wasm_bindgen__convert__closures_____invoke__h69d907cbca5bfb7f(arg0, arg1, arg2);
}

function wasm_bindgen__convert__closures_____invoke__hc76af966a592eb33(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.wasm_bindgen__convert__closures_____invoke__hc76af966a592eb33(arg0, arg1, arg2);
}

function wasm_bindgen__convert__closures_____invoke__h0ae20a6a123b01a1(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.wasm_bindgen__convert__closures_____invoke__h0ae20a6a123b01a1(arg0, arg1, arg2);
}

function wasm_bindgen__convert__closures_____invoke__hf2972596b9f4234f(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.wasm_bindgen__convert__closures_____invoke__hf2972596b9f4234f(arg0, arg1, arg2);
}

function wasm_bindgen__convert__closures_____invoke__hdc5e2b6e3d336e70(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.wasm_bindgen__convert__closures_____invoke__hdc5e2b6e3d336e70(arg0, arg1, arg2);
}

function wasm_bindgen__convert__closures_____invoke__hcdeee809ea8f37d3(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.wasm_bindgen__convert__closures_____invoke__hcdeee809ea8f37d3(arg0, arg1, arg2);
}

function wasm_bindgen__convert__closures_____invoke__hdbf621e1e726425e(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.wasm_bindgen__convert__closures_____invoke__hdbf621e1e726425e(arg0, arg1, arg2);
}

function wasm_bindgen__convert__closures_____invoke__h58c3fe630889d985(arg0, arg1) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.wasm_bindgen__convert__closures_____invoke__h58c3fe630889d985(arg0, arg1);
}

function wasm_bindgen__convert__closures_____invoke__h96fe359bdad60d2d(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.wasm_bindgen__convert__closures_____invoke__h96fe359bdad60d2d(arg0, arg1, arg2);
}

function wasm_bindgen__convert__closures_____invoke__h96c22d8053682eec(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.wasm_bindgen__convert__closures_____invoke__h96c22d8053682eec(arg0, arg1, arg2);
}

function wasm_bindgen__convert__closures_____invoke__h1fad2bb8049b3dfb(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.wasm_bindgen__convert__closures_____invoke__h1fad2bb8049b3dfb(arg0, arg1, arg2);
}

function wasm_bindgen__convert__closures_____invoke__habb541a800c9a2b4(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.wasm_bindgen__convert__closures_____invoke__habb541a800c9a2b4(arg0, arg1, arg2);
}

function wasm_bindgen__convert__closures_____invoke__h7056fb3b0f0d5615(arg0, arg1) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.wasm_bindgen__convert__closures_____invoke__h7056fb3b0f0d5615(arg0, arg1);
}

function wasm_bindgen__convert__closures_____invoke__hc60b8628c24971b4(arg0, arg1, arg2, arg3) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.wasm_bindgen__convert__closures_____invoke__hc60b8628c24971b4(arg0, arg1, arg2, arg3);
}

function wasm_bindgen__convert__closures_____invoke__hac4421b78e6862e7(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.wasm_bindgen__convert__closures_____invoke__hac4421b78e6862e7(arg0, arg1, arg2);
}

function wasm_bindgen__convert__closures_____invoke__h1cc7e65e9e4e3b6f(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.wasm_bindgen__convert__closures_____invoke__h1cc7e65e9e4e3b6f(arg0, arg1, arg2);
}

function wasm_bindgen__convert__closures_____invoke__ha87da6173727fe8b(arg0, arg1) {
    _assertNum(arg0);
    _assertNum(arg1);
    const ret = wasm.wasm_bindgen__convert__closures_____invoke__ha87da6173727fe8b(arg0, arg1);
    return ret !== 0;
}

function wasm_bindgen__convert__closures_____invoke__h00fab9553f9747a5(arg0, arg1, arg2, arg3) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.wasm_bindgen__convert__closures_____invoke__h00fab9553f9747a5(arg0, arg1, arg2, arg3);
}

const __wbindgen_enum_BinaryType = ["blob", "arraybuffer"];

const __wbindgen_enum_GpuAddressMode = ["clamp-to-edge", "repeat", "mirror-repeat"];

const __wbindgen_enum_GpuBlendFactor = ["zero", "one", "src", "one-minus-src", "src-alpha", "one-minus-src-alpha", "dst", "one-minus-dst", "dst-alpha", "one-minus-dst-alpha", "src-alpha-saturated", "constant", "one-minus-constant", "src1", "one-minus-src1", "src1-alpha", "one-minus-src1-alpha"];

const __wbindgen_enum_GpuBlendOperation = ["add", "subtract", "reverse-subtract", "min", "max"];

const __wbindgen_enum_GpuBufferBindingType = ["uniform", "storage", "read-only-storage"];

const __wbindgen_enum_GpuCanvasAlphaMode = ["opaque", "premultiplied"];

const __wbindgen_enum_GpuCompareFunction = ["never", "less", "equal", "less-equal", "greater", "not-equal", "greater-equal", "always"];

const __wbindgen_enum_GpuCullMode = ["none", "front", "back"];

const __wbindgen_enum_GpuDeviceLostReason = ["unknown", "destroyed"];

const __wbindgen_enum_GpuErrorFilter = ["validation", "out-of-memory", "internal"];

const __wbindgen_enum_GpuFilterMode = ["nearest", "linear"];

const __wbindgen_enum_GpuFrontFace = ["ccw", "cw"];

const __wbindgen_enum_GpuIndexFormat = ["uint16", "uint32"];

const __wbindgen_enum_GpuLoadOp = ["load", "clear"];

const __wbindgen_enum_GpuMipmapFilterMode = ["nearest", "linear"];

const __wbindgen_enum_GpuPowerPreference = ["low-power", "high-performance"];

const __wbindgen_enum_GpuPrimitiveTopology = ["point-list", "line-list", "line-strip", "triangle-list", "triangle-strip"];

const __wbindgen_enum_GpuQueryType = ["occlusion", "timestamp"];

const __wbindgen_enum_GpuSamplerBindingType = ["filtering", "non-filtering", "comparison"];

const __wbindgen_enum_GpuStencilOperation = ["keep", "zero", "replace", "invert", "increment-clamp", "decrement-clamp", "increment-wrap", "decrement-wrap"];

const __wbindgen_enum_GpuStorageTextureAccess = ["write-only", "read-only", "read-write"];

const __wbindgen_enum_GpuStoreOp = ["store", "discard"];

const __wbindgen_enum_GpuTextureAspect = ["all", "stencil-only", "depth-only"];

const __wbindgen_enum_GpuTextureDimension = ["1d", "2d", "3d"];

const __wbindgen_enum_GpuTextureFormat = ["r8unorm", "r8snorm", "r8uint", "r8sint", "r16uint", "r16sint", "r16float", "rg8unorm", "rg8snorm", "rg8uint", "rg8sint", "r32uint", "r32sint", "r32float", "rg16uint", "rg16sint", "rg16float", "rgba8unorm", "rgba8unorm-srgb", "rgba8snorm", "rgba8uint", "rgba8sint", "bgra8unorm", "bgra8unorm-srgb", "rgb9e5ufloat", "rgb10a2uint", "rgb10a2unorm", "rg11b10ufloat", "rg32uint", "rg32sint", "rg32float", "rgba16uint", "rgba16sint", "rgba16float", "rgba32uint", "rgba32sint", "rgba32float", "stencil8", "depth16unorm", "depth24plus", "depth24plus-stencil8", "depth32float", "depth32float-stencil8", "bc1-rgba-unorm", "bc1-rgba-unorm-srgb", "bc2-rgba-unorm", "bc2-rgba-unorm-srgb", "bc3-rgba-unorm", "bc3-rgba-unorm-srgb", "bc4-r-unorm", "bc4-r-snorm", "bc5-rg-unorm", "bc5-rg-snorm", "bc6h-rgb-ufloat", "bc6h-rgb-float", "bc7-rgba-unorm", "bc7-rgba-unorm-srgb", "etc2-rgb8unorm", "etc2-rgb8unorm-srgb", "etc2-rgb8a1unorm", "etc2-rgb8a1unorm-srgb", "etc2-rgba8unorm", "etc2-rgba8unorm-srgb", "eac-r11unorm", "eac-r11snorm", "eac-rg11unorm", "eac-rg11snorm", "astc-4x4-unorm", "astc-4x4-unorm-srgb", "astc-5x4-unorm", "astc-5x4-unorm-srgb", "astc-5x5-unorm", "astc-5x5-unorm-srgb", "astc-6x5-unorm", "astc-6x5-unorm-srgb", "astc-6x6-unorm", "astc-6x6-unorm-srgb", "astc-8x5-unorm", "astc-8x5-unorm-srgb", "astc-8x6-unorm", "astc-8x6-unorm-srgb", "astc-8x8-unorm", "astc-8x8-unorm-srgb", "astc-10x5-unorm", "astc-10x5-unorm-srgb", "astc-10x6-unorm", "astc-10x6-unorm-srgb", "astc-10x8-unorm", "astc-10x8-unorm-srgb", "astc-10x10-unorm", "astc-10x10-unorm-srgb", "astc-12x10-unorm", "astc-12x10-unorm-srgb", "astc-12x12-unorm", "astc-12x12-unorm-srgb"];

const __wbindgen_enum_GpuTextureSampleType = ["float", "unfilterable-float", "depth", "sint", "uint"];

const __wbindgen_enum_GpuTextureViewDimension = ["1d", "2d", "2d-array", "cube", "cube-array", "3d"];

const __wbindgen_enum_GpuVertexFormat = ["uint8", "uint8x2", "uint8x4", "sint8", "sint8x2", "sint8x4", "unorm8", "unorm8x2", "unorm8x4", "snorm8", "snorm8x2", "snorm8x4", "uint16", "uint16x2", "uint16x4", "sint16", "sint16x2", "sint16x4", "unorm16", "unorm16x2", "unorm16x4", "snorm16", "snorm16x2", "snorm16x4", "float16", "float16x2", "float16x4", "float32", "float32x2", "float32x3", "float32x4", "uint32", "uint32x2", "uint32x3", "uint32x4", "sint32", "sint32x2", "sint32x3", "sint32x4", "unorm10-10-10-2", "unorm8x4-bgra"];

const __wbindgen_enum_GpuVertexStepMode = ["vertex", "instance"];

const __wbindgen_enum_IdbTransactionMode = ["readonly", "readwrite", "versionchange", "readwriteflush", "cleanup"];

const __wbindgen_enum_ResizeObserverBoxOptions = ["border-box", "content-box", "device-pixel-content-box"];

const __wbindgen_enum_VisibilityState = ["hidden", "visible"];

/**
 * Initialize and run the WASM application.
 * @returns {Promise<void>}
 */
export function run_wasm() {
    wasm.run_wasm();
}

const EXPECTED_RESPONSE_TYPES = new Set(['basic', 'cors', 'default']);

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = module.ok && EXPECTED_RESPONSE_TYPES.has(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_Error_52673b7de5a0ca89 = function() { return logError(function (arg0, arg1) {
        const ret = Error(getStringFromWasm0(arg0, arg1));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_Number_2d1dcfcf4ec51736 = function() { return logError(function (arg0) {
        const ret = Number(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_String_8f0eb39a4a4c2f66 = function() { return logError(function (arg0, arg1) {
        const ret = String(arg1);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_Window_6419f7513544dd0b = function() { return logError(function (arg0) {
        const ret = arg0.Window;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_Window_d1bf622f71ff0629 = function() { return logError(function (arg0) {
        const ret = arg0.Window;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_WorkerGlobalScope_147f18e856464ee4 = function() { return logError(function (arg0) {
        const ret = arg0.WorkerGlobalScope;
        return ret;
    }, arguments) };
    imports.wbg.__wbg___wbindgen_boolean_get_dea25b33882b895b = function(arg0) {
        const v = arg0;
        const ret = typeof(v) === 'boolean' ? v : undefined;
        if (!isLikeNone(ret)) {
            _assertBoolean(ret);
        }
        return isLikeNone(ret) ? 0xFFFFFF : ret ? 1 : 0;
    };
    imports.wbg.__wbg___wbindgen_debug_string_adfb662ae34724b6 = function(arg0, arg1) {
        const ret = debugString(arg1);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg___wbindgen_in_0d3e1e8f0c669317 = function(arg0, arg1) {
        const ret = arg0 in arg1;
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbg___wbindgen_is_function_8d400b8b1af978cd = function(arg0) {
        const ret = typeof(arg0) === 'function';
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbg___wbindgen_is_null_dfda7d66506c95b5 = function(arg0) {
        const ret = arg0 === null;
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbg___wbindgen_is_object_ce774f3490692386 = function(arg0) {
        const val = arg0;
        const ret = typeof(val) === 'object' && val !== null;
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbg___wbindgen_is_string_704ef9c8fc131030 = function(arg0) {
        const ret = typeof(arg0) === 'string';
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbg___wbindgen_is_undefined_f6b95eab589e0269 = function(arg0) {
        const ret = arg0 === undefined;
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbg___wbindgen_jsval_loose_eq_766057600fdd1b0d = function(arg0, arg1) {
        const ret = arg0 == arg1;
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbg___wbindgen_number_get_9619185a74197f95 = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'number' ? obj : undefined;
        if (!isLikeNone(ret)) {
            _assertNum(ret);
        }
        getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    };
    imports.wbg.__wbg___wbindgen_string_get_a2a31e16edf96e42 = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg___wbindgen_throw_dd24417ed36fc46e = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg__wbg_cb_unref_87dfb5aaa0cbcea7 = function() { return logError(function (arg0) {
        arg0._wbg_cb_unref();
    }, arguments) };
    imports.wbg.__wbg_abort_07646c894ebbf2bd = function() { return logError(function (arg0) {
        arg0.abort();
    }, arguments) };
    imports.wbg.__wbg_activeElement_b3e6b135325e4d5f = function() { return logError(function (arg0) {
        const ret = arg0.activeElement;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_addEventListener_6a82629b3d430a48 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        arg0.addEventListener(getStringFromWasm0(arg1, arg2), arg3);
    }, arguments) };
    imports.wbg.__wbg_addListener_32ac5b9ed9d2a521 = function() { return handleError(function (arg0, arg1) {
        arg0.addListener(arg1);
    }, arguments) };
    imports.wbg.__wbg_altKey_56d1d642f3a28c92 = function() { return logError(function (arg0) {
        const ret = arg0.altKey;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_altKey_e13fae92dfebca3e = function() { return logError(function (arg0) {
        const ret = arg0.altKey;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_animate_6ec571f163cf6f8d = function() { return logError(function (arg0, arg1, arg2) {
        const ret = arg0.animate(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_appendChild_7465eba84213c75f = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.appendChild(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_arrayBuffer_3356d392ef2d2aa9 = function() { return logError(function (arg0) {
        const ret = arg0.arrayBuffer();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_beginComputePass_d1fdb8126d3023c7 = function() { return logError(function (arg0, arg1) {
        const ret = arg0.beginComputePass(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_beginRenderPass_5959b1e03e4f545c = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.beginRenderPass(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_blockSize_6456aaf09f0ab287 = function() { return logError(function (arg0) {
        const ret = arg0.blockSize;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_body_544738f8b03aef13 = function() { return logError(function (arg0) {
        const ret = arg0.body;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_brand_9562792cbb4735c3 = function() { return logError(function (arg0, arg1) {
        const ret = arg1.brand;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_brands_a1e7a2bce052128f = function() { return logError(function (arg0) {
        const ret = arg0.brands;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_buffer_6cb2fecb1f253d71 = function() { return logError(function (arg0) {
        const ret = arg0.buffer;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_button_a54acd25bab5d442 = function() { return logError(function (arg0) {
        const ret = arg0.button;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_buttons_a37ff9ffacadddb5 = function() { return logError(function (arg0) {
        const ret = arg0.buttons;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_call_3020136f7a2d6e44 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.call(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_call_abb4ff46ce38be40 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.call(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_cancelAnimationFrame_1c2a3faf7be5aedd = function() { return handleError(function (arg0, arg1) {
        arg0.cancelAnimationFrame(arg1);
    }, arguments) };
    imports.wbg.__wbg_cancelIdleCallback_ee06eb3dcf335b86 = function() { return logError(function (arg0, arg1) {
        arg0.cancelIdleCallback(arg1 >>> 0);
    }, arguments) };
    imports.wbg.__wbg_cancel_09c394f0894744eb = function() { return logError(function (arg0) {
        arg0.cancel();
    }, arguments) };
    imports.wbg.__wbg_catch_b9db41d97d42bd02 = function() { return logError(function (arg0, arg1) {
        const ret = arg0.catch(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_clearBuffer_2b0a3c8ac8b1cdab = function() { return logError(function (arg0, arg1, arg2, arg3) {
        arg0.clearBuffer(arg1, arg2, arg3);
    }, arguments) };
    imports.wbg.__wbg_clearBuffer_d734bcb0f4fad3c6 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.clearBuffer(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_clearTimeout_1ca823b279705d35 = function() { return logError(function (arg0, arg1) {
        arg0.clearTimeout(arg1);
    }, arguments) };
    imports.wbg.__wbg_click_3a8e35c38329dd3a = function() { return logError(function (arg0) {
        arg0.click();
    }, arguments) };
    imports.wbg.__wbg_clipboard_c210ce30f20907dd = function() { return logError(function (arg0) {
        const ret = arg0.clipboard;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_close_1db3952de1b5b1cf = function() { return handleError(function (arg0) {
        arg0.close();
    }, arguments) };
    imports.wbg.__wbg_close_8158530fc398ee2f = function() { return logError(function (arg0) {
        arg0.close();
    }, arguments) };
    imports.wbg.__wbg_close_cf7ef4e294ac3858 = function() { return logError(function (arg0) {
        arg0.close();
    }, arguments) };
    imports.wbg.__wbg_code_b3ddfa90f724c486 = function() { return logError(function (arg0, arg1) {
        const ret = arg1.code;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_configure_8d74ee79dc392b1f = function() { return handleError(function (arg0, arg1) {
        arg0.configure(arg1);
    }, arguments) };
    imports.wbg.__wbg_contains_457d2fc195838bfa = function() { return logError(function (arg0, arg1) {
        const ret = arg0.contains(arg1);
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_contentRect_1806147dfdc380d8 = function() { return logError(function (arg0) {
        const ret = arg0.contentRect;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_copyBufferToBuffer_8391faedae7bae2d = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.copyBufferToBuffer(arg1, arg2, arg3, arg4);
    }, arguments) };
    imports.wbg.__wbg_copyBufferToBuffer_db1c4fd94fdfa9a8 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.copyBufferToBuffer(arg1, arg2, arg3, arg4, arg5);
    }, arguments) };
    imports.wbg.__wbg_copyBufferToTexture_c4bc464c7af9eb3d = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        arg0.copyBufferToTexture(arg1, arg2, arg3);
    }, arguments) };
    imports.wbg.__wbg_copyExternalImageToTexture_41327f54ff2be5fb = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        arg0.copyExternalImageToTexture(arg1, arg2, arg3);
    }, arguments) };
    imports.wbg.__wbg_copyTextureToBuffer_739b5accd0131afa = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        arg0.copyTextureToBuffer(arg1, arg2, arg3);
    }, arguments) };
    imports.wbg.__wbg_copyTextureToTexture_ecb35eeeccc84668 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        arg0.copyTextureToTexture(arg1, arg2, arg3);
    }, arguments) };
    imports.wbg.__wbg_createBindGroupLayout_37b290868edc95c3 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.createBindGroupLayout(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createBindGroup_9e48ec0df6021806 = function() { return logError(function (arg0, arg1) {
        const ret = arg0.createBindGroup(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createBuffer_301327852bcb0fc9 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.createBuffer(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createCommandEncoder_f91fd6a7bbb31da6 = function() { return logError(function (arg0, arg1) {
        const ret = arg0.createCommandEncoder(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createComputePipeline_63e73966ce7658ed = function() { return logError(function (arg0, arg1) {
        const ret = arg0.createComputePipeline(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createElement_da4ed2b219560fc6 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.createElement(getStringFromWasm0(arg1, arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createIndex_3889f4177a3fa5d0 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        const ret = arg0.createIndex(getStringFromWasm0(arg1, arg2), arg3, arg4);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createIndex_3c576f3c5564f5d7 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = arg0.createIndex(getStringFromWasm0(arg1, arg2), arg3);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createObjectStore_cbdcc26f3aae8530 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = arg0.createObjectStore(getStringFromWasm0(arg1, arg2), arg3);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createObjectURL_7d9f7f8f41373850 = function() { return handleError(function (arg0, arg1) {
        const ret = URL.createObjectURL(arg1);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_createPipelineLayout_e218679853a4ec90 = function() { return logError(function (arg0, arg1) {
        const ret = arg0.createPipelineLayout(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createQuerySet_a263dc11313f1d4f = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.createQuerySet(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createRenderBundleEncoder_cc6623603aca6dcc = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.createRenderBundleEncoder(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createRenderPipeline_01226de8ac511c31 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.createRenderPipeline(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createSampler_dd08c9ffd5b1afa4 = function() { return logError(function (arg0, arg1) {
        const ret = arg0.createSampler(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createShaderModule_a7e2ac8c2d5bd874 = function() { return logError(function (arg0, arg1) {
        const ret = arg0.createShaderModule(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createTask_432d6d38dc688bee = function() { return handleError(function (arg0, arg1) {
        const ret = console.createTask(getStringFromWasm0(arg0, arg1));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createTexture_47efd1fcfeeaeac8 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.createTexture(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createView_bb87ba5802a138dc = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.createView(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_crypto_574e78ad8b13b65f = function() { return logError(function (arg0) {
        const ret = arg0.crypto;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_ctrlKey_487597b9069da036 = function() { return logError(function (arg0) {
        const ret = arg0.ctrlKey;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_ctrlKey_b391e5105c3f6e76 = function() { return logError(function (arg0) {
        const ret = arg0.ctrlKey;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_dataTransfer_3653d4b679b026b2 = function() { return logError(function (arg0) {
        const ret = arg0.dataTransfer;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_data_8bf4ae669a78a688 = function() { return logError(function (arg0) {
        const ret = arg0.data;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_debug_9d0c87ddda3dc485 = function() { return logError(function (arg0) {
        console.debug(arg0);
    }, arguments) };
    imports.wbg.__wbg_deleteIndex_5cd5c1a016293bf2 = function() { return handleError(function (arg0, arg1, arg2) {
        arg0.deleteIndex(getStringFromWasm0(arg1, arg2));
    }, arguments) };
    imports.wbg.__wbg_deleteObjectStore_88e9fff1fbbc6189 = function() { return handleError(function (arg0, arg1, arg2) {
        arg0.deleteObjectStore(getStringFromWasm0(arg1, arg2));
    }, arguments) };
    imports.wbg.__wbg_deltaMode_d74ec093e23ffeec = function() { return logError(function (arg0) {
        const ret = arg0.deltaMode;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_deltaX_41f7678c94b10355 = function() { return logError(function (arg0) {
        const ret = arg0.deltaX;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_deltaY_3f10fd796fae2a0f = function() { return logError(function (arg0) {
        const ret = arg0.deltaY;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_destroy_1fb0841289b41ab7 = function() { return logError(function (arg0) {
        arg0.destroy();
    }, arguments) };
    imports.wbg.__wbg_destroy_511c665839f365c0 = function() { return logError(function (arg0) {
        arg0.destroy();
    }, arguments) };
    imports.wbg.__wbg_destroy_c98dc18b3a071e98 = function() { return logError(function (arg0) {
        arg0.destroy();
    }, arguments) };
    imports.wbg.__wbg_devicePixelContentBoxSize_4312b643ce19dcae = function() { return logError(function (arg0) {
        const ret = arg0.devicePixelContentBoxSize;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_devicePixelRatio_390dee26c70aa30f = function() { return logError(function (arg0) {
        const ret = arg0.devicePixelRatio;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_disconnect_0078fed2ab427a04 = function() { return logError(function (arg0) {
        arg0.disconnect();
    }, arguments) };
    imports.wbg.__wbg_disconnect_94d44092a36f9880 = function() { return logError(function (arg0) {
        arg0.disconnect();
    }, arguments) };
    imports.wbg.__wbg_dispatchWorkgroupsIndirect_4db6960535ab3535 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.dispatchWorkgroupsIndirect(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_dispatchWorkgroups_0219513d577c632c = function() { return logError(function (arg0, arg1, arg2, arg3) {
        arg0.dispatchWorkgroups(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0);
    }, arguments) };
    imports.wbg.__wbg_document_5b745e82ba551ca5 = function() { return logError(function (arg0) {
        const ret = arg0.document;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_done_62ea16af4ce34b24 = function() { return logError(function (arg0) {
        const ret = arg0.done;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_drawIndexedIndirect_42fe3c5b17fdc555 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.drawIndexedIndirect(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_drawIndexed_3cb778da4c5793f5 = function() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.drawIndexed(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4, arg5 >>> 0);
    }, arguments) };
    imports.wbg.__wbg_drawIndirect_549f56d168b141b3 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.drawIndirect(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_draw_35bd445973b180dc = function() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.draw(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
    }, arguments) };
    imports.wbg.__wbg_end_d20172f7cfc0b44b = function() { return logError(function (arg0) {
        arg0.end();
    }, arguments) };
    imports.wbg.__wbg_end_ddc7a483fce32eed = function() { return logError(function (arg0) {
        arg0.end();
    }, arguments) };
    imports.wbg.__wbg_entries_83c79938054e065f = function() { return logError(function (arg0) {
        const ret = Object.entries(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_error_1a829178de44fe4e = function() { return logError(function (arg0) {
        const ret = arg0.error;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_error_7534b8e9a36f1ab4 = function() { return logError(function (arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    }, arguments) };
    imports.wbg.__wbg_error_7bc7d576a6aaf855 = function() { return logError(function (arg0) {
        console.error(arg0);
    }, arguments) };
    imports.wbg.__wbg_error_7fe4580410ec1f12 = function() { return logError(function (arg0) {
        const ret = arg0.error;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_error_ad02a286da74488a = function() { return handleError(function (arg0) {
        const ret = arg0.error;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_error_d7f117185d9ffd19 = function() { return logError(function (arg0, arg1) {
        console.error(arg0, arg1);
    }, arguments) };
    imports.wbg.__wbg_executeBundles_84e1e9326fd29d93 = function() { return logError(function (arg0, arg1) {
        arg0.executeBundles(arg1);
    }, arguments) };
    imports.wbg.__wbg_exitFullscreen_14c765e2bd192c7b = function() { return logError(function (arg0) {
        arg0.exitFullscreen();
    }, arguments) };
    imports.wbg.__wbg_features_7463d4000d7c57a2 = function() { return logError(function (arg0) {
        const ret = arg0.features;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_features_dafff7dd39a9b665 = function() { return logError(function (arg0) {
        const ret = arg0.features;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_files_aa1f009258eadae6 = function() { return logError(function (arg0) {
        const ret = arg0.files;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_files_d5264787ebe0eb8e = function() { return logError(function (arg0) {
        const ret = arg0.files;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_finish_7c3e136077cc2230 = function() { return logError(function (arg0) {
        const ret = arg0.finish();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_finish_db51f74029254467 = function() { return logError(function (arg0, arg1) {
        const ret = arg0.finish(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_focus_220a53e22147dc0f = function() { return handleError(function (arg0) {
        arg0.focus();
    }, arguments) };
    imports.wbg.__wbg_from_29a8414a7a7cd19d = function() { return logError(function (arg0) {
        const ret = Array.from(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_fullscreenElement_e2e939644adf50e1 = function() { return logError(function (arg0) {
        const ret = arg0.fullscreenElement;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_getAllKeys_86b80d220f9cd2a3 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.getAllKeys(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getAllKeys_925405ffbd671e86 = function() { return handleError(function (arg0) {
        const ret = arg0.getAllKeys();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getAllKeys_b7c29e1ced533cef = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.getAllKeys(arg1, arg2 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getCoalescedEvents_21492912fd0145ec = function() { return logError(function (arg0) {
        const ret = arg0.getCoalescedEvents;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getCoalescedEvents_43b8965761bb13ef = function() { return logError(function (arg0) {
        const ret = arg0.getCoalescedEvents();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getComputedStyle_bbcd5e3d08077b71 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.getComputedStyle(arg1);
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_getContext_01f42b234e833f0a = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.getContext(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_getContext_2f210d0a58d43d95 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.getContext(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_getCurrentTexture_b82524d31095411f = function() { return handleError(function (arg0) {
        const ret = arg0.getCurrentTexture();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getElementById_e05488d2143c2b21 = function() { return logError(function (arg0, arg1, arg2) {
        const ret = arg0.getElementById(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_getMappedRange_98acf7ad62c501ee = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.getMappedRange(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getOwnPropertyDescriptor_b6aa5a2fa50d52c7 = function() { return logError(function (arg0, arg1) {
        const ret = Object.getOwnPropertyDescriptor(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getPreferredCanvasFormat_92cc631581256e43 = function() { return logError(function (arg0) {
        const ret = arg0.getPreferredCanvasFormat();
        return (__wbindgen_enum_GpuTextureFormat.indexOf(ret) + 1 || 96) - 1;
    }, arguments) };
    imports.wbg.__wbg_getPropertyValue_dcded91357966805 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = arg1.getPropertyValue(getStringFromWasm0(arg2, arg3));
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_getRandomValues_9b655bdd369112f2 = function() { return handleError(function (arg0, arg1) {
        globalThis.crypto.getRandomValues(getArrayU8FromWasm0(arg0, arg1));
    }, arguments) };
    imports.wbg.__wbg_getRandomValues_b8f5dbd5f3995a9e = function() { return handleError(function (arg0, arg1) {
        arg0.getRandomValues(arg1);
    }, arguments) };
    imports.wbg.__wbg_getType_151d09dd17f71853 = function() { return logError(function (arg0, arg1, arg2) {
        const ret = arg0.getType(getStringFromWasm0(arg1, arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_get_6b7bd52aca3f9671 = function() { return logError(function (arg0, arg1) {
        const ret = arg0[arg1 >>> 0];
        return ret;
    }, arguments) };
    imports.wbg.__wbg_get_7d8b665fa88606d5 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.get(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_get_89bca58298277b24 = function() { return logError(function (arg0, arg1) {
        const ret = arg0[arg1 >>> 0];
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_get_985f6dca0ce6b776 = function() { return logError(function (arg0, arg1, arg2) {
        const ret = arg1[arg2 >>> 0];
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_get_af9dab7e9603ea93 = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.get(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_get_c53d381635aa3929 = function() { return logError(function (arg0, arg1) {
        const ret = arg0[arg1 >>> 0];
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_get_with_ref_key_1dc361bd10053bfe = function() { return logError(function (arg0, arg1) {
        const ret = arg0[arg1];
        return ret;
    }, arguments) };
    imports.wbg.__wbg_gpu_4b2187814fd587ca = function() { return logError(function (arg0) {
        const ret = arg0.gpu;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_has_e7b9469a0ae9abd2 = function() { return logError(function (arg0, arg1, arg2) {
        const ret = arg0.has(getStringFromWasm0(arg1, arg2));
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_hash_979a7861415bf1f8 = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.hash;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_height_5d22b94a936fae9f = function() { return logError(function (arg0) {
        const ret = arg0.height;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_host_d33d7c53a6d98060 = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.host;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_indexNames_417264eefae70daa = function() { return logError(function (arg0) {
        const ret = arg0.indexNames;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_index_6af68133e0cdd5f8 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.index(getStringFromWasm0(arg1, arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_info_ce6bcc489c22f6f0 = function() { return logError(function (arg0) {
        console.info(arg0);
    }, arguments) };
    imports.wbg.__wbg_inlineSize_65c8cd0ecc54c605 = function() { return logError(function (arg0) {
        const ret = arg0.inlineSize;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_innerHeight_ccac894168ddb23c = function() { return handleError(function (arg0) {
        const ret = arg0.innerHeight;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_innerWidth_5a44c76afe8ca065 = function() { return handleError(function (arg0) {
        const ret = arg0.innerWidth;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_ArrayBuffer_f3320d2419cd0355 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof ArrayBuffer;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_Blob_e9c51ce33a4b6181 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof Blob;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_ClipboardItem_a63c4aa6e03dc1cc = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof ClipboardItem;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_GpuAdapter_5e451ad6596e2784 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof GPUAdapter;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_GpuCanvasContext_f70ee27f49f4f884 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof GPUCanvasContext;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_GpuDeviceLostInfo_2060b770b1a9a12f = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof GPUDeviceLostInfo;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_GpuOutOfMemoryError_d312fd1714771dbd = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof GPUOutOfMemoryError;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_GpuValidationError_eb3c494ad7b55611 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof GPUValidationError;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_HtmlAnchorElement_2ac07b5cf25eac0c = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLAnchorElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_HtmlCanvasElement_c4251b1b6a15edcc = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLCanvasElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_HtmlImageElement_5b634ec1c6908255 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLImageElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_HtmlInputElement_46b31917ce88698f = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLInputElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_IdbDatabase_f4e157055e32c479 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof IDBDatabase;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_IdbFactory_4130e795041912c6 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof IDBFactory;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_IdbOpenDbRequest_e4a587961e53201e = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof IDBOpenDBRequest;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_IdbRequest_9000a361b4bf0dc6 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof IDBRequest;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_IdbTransaction_920b7152b18630c7 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof IDBTransaction;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_Object_577e21051f7bcb79 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof Object;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_Uint8Array_da54ccc9d3e09434 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof Uint8Array;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_Window_b5cf7783caa68180 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof Window;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_isArray_51fd9e6422c0a395 = function() { return logError(function (arg0) {
        const ret = Array.isArray(arg0);
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_isIntersecting_2d00a342ea420fb9 = function() { return logError(function (arg0) {
        const ret = arg0.isIntersecting;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_isSafeInteger_ae7d3f054d55fa16 = function() { return logError(function (arg0) {
        const ret = Number.isSafeInteger(arg0);
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_is_928aa29d71e75457 = function() { return logError(function (arg0, arg1) {
        const ret = Object.is(arg0, arg1);
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_iterator_27b7c8b35ab3e86b = function() { return logError(function () {
        const ret = Symbol.iterator;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_keyPath_676d41bf4f287b17 = function() { return handleError(function (arg0) {
        const ret = arg0.keyPath;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_key_505d33c50799526a = function() { return logError(function (arg0, arg1) {
        const ret = arg1.key;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_keys_af2028954708892b = function() { return logError(function (arg0) {
        const ret = arg0.keys();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_label_8296b38115112ca4 = function() { return logError(function (arg0, arg1) {
        const ret = arg1.label;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_length_22ac23eaec9d8053 = function() { return logError(function (arg0) {
        const ret = arg0.length;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_length_5548a3a9b927d0af = function() { return logError(function (arg0) {
        const ret = arg0.length;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_length_9f7c82a979890e31 = function() { return logError(function (arg0) {
        const ret = arg0.length;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_length_d45040a40c570362 = function() { return logError(function (arg0) {
        const ret = arg0.length;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_limits_22116faf3a912173 = function() { return logError(function (arg0) {
        const ret = arg0.limits;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_limits_b79b8275a12805b2 = function() { return logError(function (arg0) {
        const ret = arg0.limits;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_location_0ef648bbeb3e599c = function() { return logError(function (arg0) {
        const ret = arg0.location;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_location_962e75c1c1b3ebed = function() { return logError(function (arg0) {
        const ret = arg0.location;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_log_1d990106d99dacb7 = function() { return logError(function (arg0) {
        console.log(arg0);
    }, arguments) };
    imports.wbg.__wbg_lost_127bd218dad158f4 = function() { return logError(function (arg0) {
        const ret = arg0.lost;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_mapAsync_2dba5c7b48d2e598 = function() { return logError(function (arg0, arg1, arg2, arg3) {
        const ret = arg0.mapAsync(arg1 >>> 0, arg2, arg3);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_matchMedia_29904c79dbaba90b = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.matchMedia(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_matches_9cef9b7c722bd7c8 = function() { return logError(function (arg0) {
        const ret = arg0.matches;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxBindGroups_af2c64a371bc64b2 = function() { return logError(function (arg0) {
        const ret = arg0.maxBindGroups;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxBindingsPerBindGroup_430f6510523172d9 = function() { return logError(function (arg0) {
        const ret = arg0.maxBindingsPerBindGroup;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxBufferSize_68b45c1b69c22207 = function() { return logError(function (arg0) {
        const ret = arg0.maxBufferSize;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxColorAttachmentBytesPerSample_cbfce6f5737b4853 = function() { return logError(function (arg0) {
        const ret = arg0.maxColorAttachmentBytesPerSample;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxColorAttachments_70e7c33a58d9fc56 = function() { return logError(function (arg0) {
        const ret = arg0.maxColorAttachments;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxComputeInvocationsPerWorkgroup_4ad21bf35b7bd17f = function() { return logError(function (arg0) {
        const ret = arg0.maxComputeInvocationsPerWorkgroup;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxComputeWorkgroupSizeX_854c87a3ea2e5a00 = function() { return logError(function (arg0) {
        const ret = arg0.maxComputeWorkgroupSizeX;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxComputeWorkgroupSizeY_965ebcb7fee4acf5 = function() { return logError(function (arg0) {
        const ret = arg0.maxComputeWorkgroupSizeY;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxComputeWorkgroupSizeZ_3bf468106936874c = function() { return logError(function (arg0) {
        const ret = arg0.maxComputeWorkgroupSizeZ;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxComputeWorkgroupStorageSize_b9cab4f75b0f03e3 = function() { return logError(function (arg0) {
        const ret = arg0.maxComputeWorkgroupStorageSize;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxComputeWorkgroupsPerDimension_f4664066d76015da = function() { return logError(function (arg0) {
        const ret = arg0.maxComputeWorkgroupsPerDimension;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxDynamicStorageBuffersPerPipelineLayout_6b7faf56a6e328ad = function() { return logError(function (arg0) {
        const ret = arg0.maxDynamicStorageBuffersPerPipelineLayout;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxDynamicUniformBuffersPerPipelineLayout_22a38cc27e2f4626 = function() { return logError(function (arg0) {
        const ret = arg0.maxDynamicUniformBuffersPerPipelineLayout;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxSampledTexturesPerShaderStage_97c70c39fb197a2b = function() { return logError(function (arg0) {
        const ret = arg0.maxSampledTexturesPerShaderStage;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxSamplersPerShaderStage_a148c7e536a3807c = function() { return logError(function (arg0) {
        const ret = arg0.maxSamplersPerShaderStage;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxStorageBufferBindingSize_bfaa9c302ad157e3 = function() { return logError(function (arg0) {
        const ret = arg0.maxStorageBufferBindingSize;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxStorageBuffersPerShaderStage_463d04005d78f248 = function() { return logError(function (arg0) {
        const ret = arg0.maxStorageBuffersPerShaderStage;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxStorageTexturesPerShaderStage_3fe774bbe6ad1371 = function() { return logError(function (arg0) {
        const ret = arg0.maxStorageTexturesPerShaderStage;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxTextureArrayLayers_6b1a7b0b3b4c0556 = function() { return logError(function (arg0) {
        const ret = arg0.maxTextureArrayLayers;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxTextureDimension1D_e79117695a706815 = function() { return logError(function (arg0) {
        const ret = arg0.maxTextureDimension1D;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxTextureDimension2D_cbb3e7343bea93d1 = function() { return logError(function (arg0) {
        const ret = arg0.maxTextureDimension2D;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxTextureDimension3D_7ac996fb8fe18286 = function() { return logError(function (arg0) {
        const ret = arg0.maxTextureDimension3D;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxUniformBufferBindingSize_22c4f55b73d306cf = function() { return logError(function (arg0) {
        const ret = arg0.maxUniformBufferBindingSize;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxUniformBuffersPerShaderStage_65e2b2eaf78ef4e1 = function() { return logError(function (arg0) {
        const ret = arg0.maxUniformBuffersPerShaderStage;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxVertexAttributes_a6c97c2dc4a8d443 = function() { return logError(function (arg0) {
        const ret = arg0.maxVertexAttributes;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxVertexBufferArrayStride_305ba73c4de05f82 = function() { return logError(function (arg0) {
        const ret = arg0.maxVertexBufferArrayStride;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxVertexBuffers_df4a4911d2c540d8 = function() { return logError(function (arg0) {
        const ret = arg0.maxVertexBuffers;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_media_077ecdcd98f5aa28 = function() { return logError(function (arg0, arg1) {
        const ret = arg1.media;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_message_7bd11486f13d13ab = function() { return logError(function (arg0, arg1) {
        const ret = arg1.message;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_message_ed58662d040ec0c0 = function() { return logError(function (arg0, arg1) {
        const ret = arg1.message;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_metaKey_0572b1cbcb5b272b = function() { return logError(function (arg0) {
        const ret = arg0.metaKey;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_metaKey_448c751accad2eba = function() { return logError(function (arg0) {
        const ret = arg0.metaKey;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_minStorageBufferOffsetAlignment_12d731adbf75fd21 = function() { return logError(function (arg0) {
        const ret = arg0.minStorageBufferOffsetAlignment;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_minUniformBufferOffsetAlignment_2a0a0d2e84c280a7 = function() { return logError(function (arg0) {
        const ret = arg0.minUniformBufferOffsetAlignment;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_movementX_00c85de14e45c5f4 = function() { return logError(function (arg0) {
        const ret = arg0.movementX;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_movementY_9f8470917a12f3f5 = function() { return logError(function (arg0) {
        const ret = arg0.movementY;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_msCrypto_a61aeb35a24c1329 = function() { return logError(function (arg0) {
        const ret = arg0.msCrypto;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_multiEntry_5d9dbb8b1d312b4a = function() { return logError(function (arg0) {
        const ret = arg0.multiEntry;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_name_13bb9dc8b6e6e67c = function() { return logError(function (arg0, arg1) {
        const ret = arg1.name;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_naturalHeight_e5febdb1901d3680 = function() { return logError(function (arg0) {
        const ret = arg0.naturalHeight;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_naturalWidth_69d8692132b04c44 = function() { return logError(function (arg0) {
        const ret = arg0.naturalWidth;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_navigator_11b7299bb7886507 = function() { return logError(function (arg0) {
        const ret = arg0.navigator;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_navigator_b49edef831236138 = function() { return logError(function (arg0) {
        const ret = arg0.navigator;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_111dde64cffa8ba1 = function() { return handleError(function () {
        const ret = new FileReader();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_137453588c393c59 = function() { return handleError(function () {
        const ret = new MessageChannel();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_1ba21ce319a06297 = function() { return logError(function () {
        const ret = new Object();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_25f239778d6112b9 = function() { return logError(function () {
        const ret = new Array();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_53cb1e86c1ef5d2a = function() { return handleError(function (arg0, arg1) {
        const ret = new Worker(getStringFromWasm0(arg0, arg1));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_6421f6084cc5bc5a = function() { return logError(function (arg0) {
        const ret = new Uint8Array(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_7c30d1f874652e62 = function() { return handleError(function (arg0, arg1) {
        const ret = new WebSocket(getStringFromWasm0(arg0, arg1));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_881a222c65f168fc = function() { return handleError(function () {
        const ret = new AbortController();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_8a6f238a6ece86ea = function() { return logError(function () {
        const ret = new Error();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_a25bd305a87faf63 = function() { return handleError(function (arg0) {
        const ret = new ResizeObserver(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_b546ae120718850e = function() { return logError(function () {
        const ret = new Map();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_bba60878a7b7f42c = function() { return handleError(function (arg0) {
        const ret = new IntersectionObserver(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_ff12d2b041fb48f1 = function() { return logError(function (arg0, arg1) {
        try {
            var state0 = {a: arg0, b: arg1};
            var cb0 = (arg0, arg1) => {
                const a = state0.a;
                state0.a = 0;
                try {
                    return wasm_bindgen__convert__closures_____invoke__h00fab9553f9747a5(a, state0.b, arg0, arg1);
                } finally {
                    state0.a = a;
                }
            };
            const ret = new Promise(cb0);
            return ret;
        } finally {
            state0.a = state0.b = 0;
        }
    }, arguments) };
    imports.wbg.__wbg_new_from_slice_f9c22b9153b26992 = function() { return logError(function (arg0, arg1) {
        const ret = new Uint8Array(getArrayU8FromWasm0(arg0, arg1));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_no_args_cb138f77cf6151ee = function() { return logError(function (arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_with_byte_offset_and_length_d85c3da1fd8df149 = function() { return logError(function (arg0, arg1, arg2) {
        const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_with_length_aa5eaf41d35235e5 = function() { return logError(function (arg0) {
        const ret = new Uint8Array(arg0 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_with_record_from_str_to_blob_promise_44de1087288de77b = function() { return handleError(function (arg0) {
        const ret = new ClipboardItem(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_with_str_sequence_and_options_fe06fc75a8482fd3 = function() { return handleError(function (arg0, arg1) {
        const ret = new Blob(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_with_u8_array_sequence_and_options_d4def9ec0588c7ec = function() { return handleError(function (arg0, arg1) {
        const ret = new Blob(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_next_138a17bbf04e926c = function() { return logError(function (arg0) {
        const ret = arg0.next;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_next_3cfe5c0fe2a4cc53 = function() { return handleError(function (arg0) {
        const ret = arg0.next();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_node_905d3e251edff8a2 = function() { return logError(function (arg0) {
        const ret = arg0.node;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_now_2c95c9de01293173 = function() { return logError(function (arg0) {
        const ret = arg0.now();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_now_8a87c5466cc7d560 = function() { return logError(function () {
        const ret = Date.now();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_objectStoreNames_90900f9a531513ac = function() { return logError(function (arg0) {
        const ret = arg0.objectStoreNames;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_objectStore_da9a077b8849dbe9 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.objectStore(getStringFromWasm0(arg1, arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_observe_5186b67ce86740f9 = function() { return logError(function (arg0, arg1) {
        arg0.observe(arg1);
    }, arguments) };
    imports.wbg.__wbg_observe_ce343c3f1701b1f1 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.observe(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_observe_eefa2465578e5d51 = function() { return logError(function (arg0, arg1) {
        arg0.observe(arg1);
    }, arguments) };
    imports.wbg.__wbg_of_6505a0eb509da02e = function() { return logError(function (arg0) {
        const ret = Array.of(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_of_b8cd42ebb79fb759 = function() { return logError(function (arg0, arg1) {
        const ret = Array.of(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_offsetX_cb6a38e6f23cb4a6 = function() { return logError(function (arg0) {
        const ret = arg0.offsetX;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_offsetY_43e21941c5c1f8bf = function() { return logError(function (arg0) {
        const ret = arg0.offsetY;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_onSubmittedWorkDone_22f709e16b81d1c2 = function() { return logError(function (arg0) {
        const ret = arg0.onSubmittedWorkDone();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_open_0d7b85f4c0a38ffe = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = arg0.open(getStringFromWasm0(arg1, arg2), arg3 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_open_2a2740c93beabe29 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.open(getStringFromWasm0(arg1, arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_performance_7a3ffd0b17f663ad = function() { return logError(function (arg0) {
        const ret = arg0.performance;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_persisted_90586ee41f1f0188 = function() { return logError(function (arg0) {
        const ret = arg0.persisted;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_play_63bc12f42e16af91 = function() { return logError(function (arg0) {
        arg0.play();
    }, arguments) };
    imports.wbg.__wbg_pointerId_bf4326e151df1474 = function() { return logError(function (arg0) {
        const ret = arg0.pointerId;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_pointerType_f1939c6407f96be9 = function() { return logError(function (arg0, arg1) {
        const ret = arg1.pointerType;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_popErrorScope_3620d0770e0c967f = function() { return logError(function (arg0) {
        const ret = arg0.popErrorScope();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_port1_75dce9d0d8087125 = function() { return logError(function (arg0) {
        const ret = arg0.port1;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_port2_3cffa4119380f41d = function() { return logError(function (arg0) {
        const ret = arg0.port2;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_postMessage_79f844174f56304f = function() { return handleError(function (arg0, arg1) {
        arg0.postMessage(arg1);
    }, arguments) };
    imports.wbg.__wbg_postMessage_e0309b53c7ad30e6 = function() { return handleError(function (arg0, arg1, arg2) {
        arg0.postMessage(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_postTask_41d93e93941e4a3d = function() { return logError(function (arg0, arg1, arg2) {
        const ret = arg0.postTask(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_pressure_35422752c1a40439 = function() { return logError(function (arg0) {
        const ret = arg0.pressure;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_preventDefault_e97663aeeb9709d3 = function() { return logError(function (arg0) {
        arg0.preventDefault();
    }, arguments) };
    imports.wbg.__wbg_process_dc0fbacc7c1c06f7 = function() { return logError(function (arg0) {
        const ret = arg0.process;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_protocol_9d5f5cf57103846e = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.protocol;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_prototype_c28bca39c45aba9b = function() { return logError(function () {
        const ret = ResizeObserverEntry.prototype;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_prototypesetcall_dfe9b766cdc1f1fd = function() { return logError(function (arg0, arg1, arg2) {
        Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), arg2);
    }, arguments) };
    imports.wbg.__wbg_pushErrorScope_82cb69cc547ce5fb = function() { return logError(function (arg0, arg1) {
        arg0.pushErrorScope(__wbindgen_enum_GpuErrorFilter[arg1]);
    }, arguments) };
    imports.wbg.__wbg_push_7d9be8f38fc13975 = function() { return logError(function (arg0, arg1) {
        const ret = arg0.push(arg1);
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_put_d3ad5a2a0698e185 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.put(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_put_d40a68e5a8902a46 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.put(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_querySelectorAll_aa1048eae18f6f1a = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.querySelectorAll(getStringFromWasm0(arg1, arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_querySelector_15a92ce6bed6157d = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.querySelector(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_queueMicrotask_892c6bd5d40fe78e = function() { return logError(function (arg0, arg1) {
        arg0.queueMicrotask(arg1);
    }, arguments) };
    imports.wbg.__wbg_queueMicrotask_9b549dfce8865860 = function() { return logError(function (arg0) {
        const ret = arg0.queueMicrotask;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_queueMicrotask_fca69f5bfad613a5 = function() { return logError(function (arg0) {
        queueMicrotask(arg0);
    }, arguments) };
    imports.wbg.__wbg_queue_e7ab52ab0880dce9 = function() { return logError(function (arg0) {
        const ret = arg0.queue;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_randomFillSync_ac0988aba3254290 = function() { return handleError(function (arg0, arg1) {
        arg0.randomFillSync(arg1);
    }, arguments) };
    imports.wbg.__wbg_readAsText_576ce4784fdfa327 = function() { return handleError(function (arg0, arg1) {
        arg0.readAsText(arg1);
    }, arguments) };
    imports.wbg.__wbg_readText_3be3891f629b2f59 = function() { return logError(function (arg0) {
        const ret = arg0.readText();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_read_36aed98f38c1b59b = function() { return logError(function (arg0) {
        const ret = arg0.read();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_reason_92874ec807ec200c = function() { return logError(function (arg0) {
        const ret = arg0.reason;
        return (__wbindgen_enum_GpuDeviceLostReason.indexOf(ret) + 1 || 3) - 1;
    }, arguments) };
    imports.wbg.__wbg_removeEventListener_565e273024b68b75 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        arg0.removeEventListener(getStringFromWasm0(arg1, arg2), arg3);
    }, arguments) };
    imports.wbg.__wbg_removeListener_204002d1eb3f20f6 = function() { return handleError(function (arg0, arg1) {
        arg0.removeListener(arg1);
    }, arguments) };
    imports.wbg.__wbg_removeProperty_c2e16faee2834bef = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = arg1.removeProperty(getStringFromWasm0(arg2, arg3));
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_remove_32f69ffabcbc4072 = function() { return logError(function (arg0) {
        arg0.remove();
    }, arguments) };
    imports.wbg.__wbg_repeat_3733d1d584bf0e38 = function() { return logError(function (arg0) {
        const ret = arg0.repeat;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_requestAdapter_eb00393b717ebb9c = function() { return logError(function (arg0, arg1) {
        const ret = arg0.requestAdapter(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_requestAnimationFrame_994dc4ebde22b8d9 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.requestAnimationFrame(arg1);
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_requestDevice_1be6e30ff9d67933 = function() { return logError(function (arg0, arg1) {
        const ret = arg0.requestDevice(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_requestFullscreen_86fc6cdb76000482 = function() { return logError(function (arg0) {
        const ret = arg0.requestFullscreen;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_requestFullscreen_9f0611438eb929cf = function() { return logError(function (arg0) {
        const ret = arg0.requestFullscreen();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_requestIdleCallback_1b8d644ff564208f = function() { return logError(function (arg0) {
        const ret = arg0.requestIdleCallback;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_requestIdleCallback_dedd367f2e61f932 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.requestIdleCallback(arg1);
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_require_60cc747a6bc5215a = function() { return handleError(function () {
        const ret = module.require;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_resolveQuerySet_44dddc4a814652f2 = function() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.resolveQuerySet(arg1, arg2 >>> 0, arg3 >>> 0, arg4, arg5 >>> 0);
    }, arguments) };
    imports.wbg.__wbg_resolve_fd5bfbaa4ce36e1e = function() { return logError(function (arg0) {
        const ret = Promise.resolve(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_result_084f962aedb54250 = function() { return handleError(function (arg0) {
        const ret = arg0.result;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_result_893437a1eaacc4df = function() { return handleError(function (arg0) {
        const ret = arg0.result;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_revokeObjectURL_88db3468842ff09e = function() { return handleError(function (arg0, arg1) {
        URL.revokeObjectURL(getStringFromWasm0(arg0, arg1));
    }, arguments) };
    imports.wbg.__wbg_run_51bf644e39739ca6 = function() { return logError(function (arg0, arg1, arg2) {
        try {
            var state0 = {a: arg1, b: arg2};
            var cb0 = () => {
                const a = state0.a;
                state0.a = 0;
                try {
                    return wasm_bindgen__convert__closures_____invoke__ha87da6173727fe8b(a, state0.b, );
                } finally {
                    state0.a = a;
                }
            };
            const ret = arg0.run(cb0);
            _assertBoolean(ret);
            return ret;
        } finally {
            state0.a = state0.b = 0;
        }
    }, arguments) };
    imports.wbg.__wbg_scheduler_48482a9974eeacbd = function() { return logError(function (arg0) {
        const ret = arg0.scheduler;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_scheduler_5156bb61cc1cf589 = function() { return logError(function (arg0) {
        const ret = arg0.scheduler;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_search_856af82f9dccb2ef = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.search;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_send_7cc36bb628044281 = function() { return handleError(function (arg0, arg1, arg2) {
        arg0.send(getStringFromWasm0(arg1, arg2));
    }, arguments) };
    imports.wbg.__wbg_setAttribute_34747dd193f45828 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.setAttribute(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_setBindGroup_0ae63a01a1ed4c73 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.setBindGroup(arg1 >>> 0, arg2);
    }, arguments) };
    imports.wbg.__wbg_setBindGroup_9cfe828fbb0563be = function() { return logError(function (arg0, arg1, arg2) {
        arg0.setBindGroup(arg1 >>> 0, arg2);
    }, arguments) };
    imports.wbg.__wbg_setBindGroup_b34a358ce3d07c2c = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        arg0.setBindGroup(arg1 >>> 0, arg2, getArrayU32FromWasm0(arg3, arg4), arg5, arg6 >>> 0);
    }, arguments) };
    imports.wbg.__wbg_setBindGroup_d906e4c5d8533957 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        arg0.setBindGroup(arg1 >>> 0, arg2, getArrayU32FromWasm0(arg3, arg4), arg5, arg6 >>> 0);
    }, arguments) };
    imports.wbg.__wbg_setBlendConstant_35937accbe201fdd = function() { return handleError(function (arg0, arg1) {
        arg0.setBlendConstant(arg1);
    }, arguments) };
    imports.wbg.__wbg_setIndexBuffer_c7ecba3588b25ce2 = function() { return logError(function (arg0, arg1, arg2, arg3) {
        arg0.setIndexBuffer(arg1, __wbindgen_enum_GpuIndexFormat[arg2], arg3);
    }, arguments) };
    imports.wbg.__wbg_setIndexBuffer_db41507e5114fad4 = function() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.setIndexBuffer(arg1, __wbindgen_enum_GpuIndexFormat[arg2], arg3, arg4);
    }, arguments) };
    imports.wbg.__wbg_setPipeline_a1632dc586e06e5a = function() { return logError(function (arg0, arg1) {
        arg0.setPipeline(arg1);
    }, arguments) };
    imports.wbg.__wbg_setPipeline_b010841b1ab020c5 = function() { return logError(function (arg0, arg1) {
        arg0.setPipeline(arg1);
    }, arguments) };
    imports.wbg.__wbg_setPointerCapture_c611f4bcb7e9081e = function() { return handleError(function (arg0, arg1) {
        arg0.setPointerCapture(arg1);
    }, arguments) };
    imports.wbg.__wbg_setProperty_f27b2c05323daf8a = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.setProperty(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_setScissorRect_48aad86f2b04be65 = function() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.setScissorRect(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
    }, arguments) };
    imports.wbg.__wbg_setStencilReference_0193bdfe3e999b05 = function() { return logError(function (arg0, arg1) {
        arg0.setStencilReference(arg1 >>> 0);
    }, arguments) };
    imports.wbg.__wbg_setTimeout_06477c23d31efef1 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.setTimeout(arg1, arg2);
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_setTimeout_780045617e4bd6d6 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.setTimeout(arg1);
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_setVertexBuffer_da6ef21c06e9c5ac = function() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.setVertexBuffer(arg1 >>> 0, arg2, arg3, arg4);
    }, arguments) };
    imports.wbg.__wbg_setVertexBuffer_f209d2bcc82ece37 = function() { return logError(function (arg0, arg1, arg2, arg3) {
        arg0.setVertexBuffer(arg1 >>> 0, arg2, arg3);
    }, arguments) };
    imports.wbg.__wbg_setViewport_bee857cbfc17f5bf = function() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        arg0.setViewport(arg1, arg2, arg3, arg4, arg5, arg6);
    }, arguments) };
    imports.wbg.__wbg_set_3f1d0b984ed272ed = function() { return logError(function (arg0, arg1, arg2) {
        arg0[arg1] = arg2;
    }, arguments) };
    imports.wbg.__wbg_set_781438a03c0c3c81 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = Reflect.set(arg0, arg1, arg2);
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_set_7df433eea03a5c14 = function() { return logError(function (arg0, arg1, arg2) {
        arg0[arg1 >>> 0] = arg2;
    }, arguments) };
    imports.wbg.__wbg_set_a_004bf5b9918b7a9d = function() { return logError(function (arg0, arg1) {
        arg0.a = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_accept_4af7309453c16421 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.accept = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_access_615d472480b556e8 = function() { return logError(function (arg0, arg1) {
        arg0.access = __wbindgen_enum_GpuStorageTextureAccess[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_address_mode_u_f8c82bdfe28ff814 = function() { return logError(function (arg0, arg1) {
        arg0.addressModeU = __wbindgen_enum_GpuAddressMode[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_address_mode_v_15cc0a4331c8a793 = function() { return logError(function (arg0, arg1) {
        arg0.addressModeV = __wbindgen_enum_GpuAddressMode[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_address_mode_w_b3ede4a69eef8df8 = function() { return logError(function (arg0, arg1) {
        arg0.addressModeW = __wbindgen_enum_GpuAddressMode[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_alpha_7c9ec1b9552caf33 = function() { return logError(function (arg0, arg1) {
        arg0.alpha = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_alpha_mode_d776091480150822 = function() { return logError(function (arg0, arg1) {
        arg0.alphaMode = __wbindgen_enum_GpuCanvasAlphaMode[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_alpha_to_coverage_enabled_97c65e8e0f0f97f0 = function() { return logError(function (arg0, arg1) {
        arg0.alphaToCoverageEnabled = arg1 !== 0;
    }, arguments) };
    imports.wbg.__wbg_set_array_layer_count_4b8708bd126ac758 = function() { return logError(function (arg0, arg1) {
        arg0.arrayLayerCount = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_array_stride_89addb9ef89545a3 = function() { return logError(function (arg0, arg1) {
        arg0.arrayStride = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_aspect_e672528231f771cb = function() { return logError(function (arg0, arg1) {
        arg0.aspect = __wbindgen_enum_GpuTextureAspect[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_aspect_f5c27f8e9589644d = function() { return logError(function (arg0, arg1) {
        arg0.aspect = __wbindgen_enum_GpuTextureAspect[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_attributes_2ab28c57eed0dc3a = function() { return logError(function (arg0, arg1) {
        arg0.attributes = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_auto_increment_e74eecac24052e96 = function() { return logError(function (arg0, arg1) {
        arg0.autoIncrement = arg1 !== 0;
    }, arguments) };
    imports.wbg.__wbg_set_b_b2b86286be8253f1 = function() { return logError(function (arg0, arg1) {
        arg0.b = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_base_array_layer_a3268c17b424196f = function() { return logError(function (arg0, arg1) {
        arg0.baseArrayLayer = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_base_mip_level_7ac60a20e24c81b1 = function() { return logError(function (arg0, arg1) {
        arg0.baseMipLevel = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_bc3a432bdcd60886 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.set(arg1, arg2 >>> 0);
    }, arguments) };
    imports.wbg.__wbg_set_beginning_of_pass_write_index_2de01bde51c7b0c4 = function() { return logError(function (arg0, arg1) {
        arg0.beginningOfPassWriteIndex = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_beginning_of_pass_write_index_87e36fb6887d3c1c = function() { return logError(function (arg0, arg1) {
        arg0.beginningOfPassWriteIndex = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_binaryType_73e8c75df97825f8 = function() { return logError(function (arg0, arg1) {
        arg0.binaryType = __wbindgen_enum_BinaryType[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_bind_group_layouts_7fedf360e81319eb = function() { return logError(function (arg0, arg1) {
        arg0.bindGroupLayouts = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_binding_030f427cbe0e3a55 = function() { return logError(function (arg0, arg1) {
        arg0.binding = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_binding_69fdec34b16b327b = function() { return logError(function (arg0, arg1) {
        arg0.binding = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_blend_c6896375c7f0119c = function() { return logError(function (arg0, arg1) {
        arg0.blend = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_box_d724bbbe6354cf86 = function() { return logError(function (arg0, arg1) {
        arg0.box = __wbindgen_enum_ResizeObserverBoxOptions[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_buffer_b70ef3f40d503e25 = function() { return logError(function (arg0, arg1) {
        arg0.buffer = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_buffer_b79f2efcb24ba844 = function() { return logError(function (arg0, arg1) {
        arg0.buffer = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_buffer_c23b131bfa95f222 = function() { return logError(function (arg0, arg1) {
        arg0.buffer = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_buffers_14ec06929ea541ec = function() { return logError(function (arg0, arg1) {
        arg0.buffers = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_bytes_per_row_279f81f686787a9f = function() { return logError(function (arg0, arg1) {
        arg0.bytesPerRow = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_bytes_per_row_fbb55671d2ba86f2 = function() { return logError(function (arg0, arg1) {
        arg0.bytesPerRow = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_clear_value_829dfd0db30aaeac = function() { return logError(function (arg0, arg1) {
        arg0.clearValue = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_code_09748e5373b711b2 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.code = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_color_96b2f28b4f51fceb = function() { return logError(function (arg0, arg1) {
        arg0.color = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_color_attachments_ee51f860224ee6dd = function() { return logError(function (arg0, arg1) {
        arg0.colorAttachments = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_color_formats_1ab6364cf6d288e9 = function() { return logError(function (arg0, arg1) {
        arg0.colorFormats = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_compare_61125878543846d0 = function() { return logError(function (arg0, arg1) {
        arg0.compare = __wbindgen_enum_GpuCompareFunction[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_compare_eb86f2890782b20b = function() { return logError(function (arg0, arg1) {
        arg0.compare = __wbindgen_enum_GpuCompareFunction[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_compute_e2902436ce2ed757 = function() { return logError(function (arg0, arg1) {
        arg0.compute = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_count_4d43f3f3ab7f952d = function() { return logError(function (arg0, arg1) {
        arg0.count = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_count_c555ce929443aa66 = function() { return logError(function (arg0, arg1) {
        arg0.count = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_cull_mode_4e0bb3799474c091 = function() { return logError(function (arg0, arg1) {
        arg0.cullMode = __wbindgen_enum_GpuCullMode[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_depth_bias_clamp_5375d337b8b35cd8 = function() { return logError(function (arg0, arg1) {
        arg0.depthBiasClamp = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_depth_bias_ea8b79f02442c9c7 = function() { return logError(function (arg0, arg1) {
        arg0.depthBias = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_depth_bias_slope_scale_0493feedbe6ad438 = function() { return logError(function (arg0, arg1) {
        arg0.depthBiasSlopeScale = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_depth_clear_value_20534499c6507e19 = function() { return logError(function (arg0, arg1) {
        arg0.depthClearValue = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_depth_compare_00e8b65c01d4bf03 = function() { return logError(function (arg0, arg1) {
        arg0.depthCompare = __wbindgen_enum_GpuCompareFunction[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_depth_fail_op_765de27464903fd0 = function() { return logError(function (arg0, arg1) {
        arg0.depthFailOp = __wbindgen_enum_GpuStencilOperation[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_depth_load_op_33c128108a7dc8f1 = function() { return logError(function (arg0, arg1) {
        arg0.depthLoadOp = __wbindgen_enum_GpuLoadOp[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_depth_or_array_layers_58d45a4c8cd4f655 = function() { return logError(function (arg0, arg1) {
        arg0.depthOrArrayLayers = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_depth_read_only_60990818c939df42 = function() { return logError(function (arg0, arg1) {
        arg0.depthReadOnly = arg1 !== 0;
    }, arguments) };
    imports.wbg.__wbg_set_depth_read_only_fae59572dd12c1c8 = function() { return logError(function (arg0, arg1) {
        arg0.depthReadOnly = arg1 !== 0;
    }, arguments) };
    imports.wbg.__wbg_set_depth_stencil_2e141a5dfe91878d = function() { return logError(function (arg0, arg1) {
        arg0.depthStencil = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_depth_stencil_attachment_47273ec480dd9bb3 = function() { return logError(function (arg0, arg1) {
        arg0.depthStencilAttachment = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_depth_stencil_format_c9a577086cb44854 = function() { return logError(function (arg0, arg1) {
        arg0.depthStencilFormat = __wbindgen_enum_GpuTextureFormat[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_depth_store_op_9cf32660e51edb87 = function() { return logError(function (arg0, arg1) {
        arg0.depthStoreOp = __wbindgen_enum_GpuStoreOp[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_depth_write_enabled_2757b4106a089684 = function() { return logError(function (arg0, arg1) {
        arg0.depthWriteEnabled = arg1 !== 0;
    }, arguments) };
    imports.wbg.__wbg_set_device_c2cb3231e445ef7c = function() { return logError(function (arg0, arg1) {
        arg0.device = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_dimension_0bc5536bd1965aea = function() { return logError(function (arg0, arg1) {
        arg0.dimension = __wbindgen_enum_GpuTextureDimension[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_dimension_c7429fee9721a104 = function() { return logError(function (arg0, arg1) {
        arg0.dimension = __wbindgen_enum_GpuTextureViewDimension[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_download_8403fd66b94b25a2 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.download = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_dst_factor_976f0a83fd6ab733 = function() { return logError(function (arg0, arg1) {
        arg0.dstFactor = __wbindgen_enum_GpuBlendFactor[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_efaaf145b9377369 = function() { return logError(function (arg0, arg1, arg2) {
        const ret = arg0.set(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_set_end_of_pass_write_index_3cc5a7a3f6819a03 = function() { return logError(function (arg0, arg1) {
        arg0.endOfPassWriteIndex = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_end_of_pass_write_index_f82ebc8ed8ebaa34 = function() { return logError(function (arg0, arg1) {
        arg0.endOfPassWriteIndex = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_entries_01031c155d815ef1 = function() { return logError(function (arg0, arg1) {
        arg0.entries = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_entries_8f49811ca79d7dbf = function() { return logError(function (arg0, arg1) {
        arg0.entries = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_entry_point_1da27599bf796782 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.entryPoint = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_entry_point_670e208336b80723 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.entryPoint = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_entry_point_7e39bf2abe77ebae = function() { return logError(function (arg0, arg1, arg2) {
        arg0.entryPoint = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_external_texture_66700d1d2537a6de = function() { return logError(function (arg0, arg1) {
        arg0.externalTexture = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_fail_op_9de9bf69ac6682e3 = function() { return logError(function (arg0, arg1) {
        arg0.failOp = __wbindgen_enum_GpuStencilOperation[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_flip_y_8e10258813c55af9 = function() { return logError(function (arg0, arg1) {
        arg0.flipY = arg1 !== 0;
    }, arguments) };
    imports.wbg.__wbg_set_format_10a5222e02236027 = function() { return logError(function (arg0, arg1) {
        arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_format_37627c6070d0ecfc = function() { return logError(function (arg0, arg1) {
        arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_format_3c7d4bce3fb94de5 = function() { return logError(function (arg0, arg1) {
        arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_format_47fd2845afca8e1a = function() { return logError(function (arg0, arg1) {
        arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_format_72e1ce883fb57e05 = function() { return logError(function (arg0, arg1) {
        arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_format_877a89e3431cb656 = function() { return logError(function (arg0, arg1) {
        arg0.format = __wbindgen_enum_GpuVertexFormat[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_format_ee418ce830040f4d = function() { return logError(function (arg0, arg1) {
        arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_fragment_616c1d1c0db9abd4 = function() { return logError(function (arg0, arg1) {
        arg0.fragment = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_front_face_a1a0e940bd9fa3d0 = function() { return logError(function (arg0, arg1) {
        arg0.frontFace = __wbindgen_enum_GpuFrontFace[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_g_9ab482dfe9422850 = function() { return logError(function (arg0, arg1) {
        arg0.g = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_has_dynamic_offset_21302a736944b6d9 = function() { return logError(function (arg0, arg1) {
        arg0.hasDynamicOffset = arg1 !== 0;
    }, arguments) };
    imports.wbg.__wbg_set_height_6f8f8ef4cb40e496 = function() { return logError(function (arg0, arg1) {
        arg0.height = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_height_afe09c24165867f7 = function() { return logError(function (arg0, arg1) {
        arg0.height = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_height_cd4d12f9029588ee = function() { return logError(function (arg0, arg1) {
        arg0.height = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_href_25c4bcdcbfb4459b = function() { return logError(function (arg0, arg1, arg2) {
        arg0.href = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_id_702da6e1bcec3b45 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.id = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_key_path_89e32059ab7dfaca = function() { return logError(function (arg0, arg1) {
        arg0.keyPath = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_label_0b21604c6a585153 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_label_1b7e4bc9d67c38b4 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_label_2e55e1407bac5ba2 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_label_407c8b09134f4f1d = function() { return logError(function (arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_label_5dc53fac7117f697 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_label_8e88157a8e30ddcd = function() { return logError(function (arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_label_8edbc05494bffe0e = function() { return logError(function (arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_label_a56a46194be79e8d = function() { return logError(function (arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_label_a6c76bf653812d73 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_label_ae972d3c351c79ec = function() { return logError(function (arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_label_b1b0d28716686810 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_label_cabc4eccde1e89fd = function() { return logError(function (arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_label_cf1bc810a3bd9a59 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_label_d90e07589bdb8f1a = function() { return logError(function (arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_label_e69d774bf38947d2 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_label_f401ffe5fc8acb94 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_label_ff7c2cb9af49bf08 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_layout_3a36319a5990c8b7 = function() { return logError(function (arg0, arg1) {
        arg0.layout = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_layout_89fac8ffd04a0d55 = function() { return logError(function (arg0, arg1) {
        arg0.layout = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_layout_ac044d38ca30f520 = function() { return logError(function (arg0, arg1) {
        arg0.layout = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_load_op_d48e31970a7bdf9b = function() { return logError(function (arg0, arg1) {
        arg0.loadOp = __wbindgen_enum_GpuLoadOp[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_lod_max_clamp_150813b458d7989c = function() { return logError(function (arg0, arg1) {
        arg0.lodMaxClamp = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_lod_min_clamp_444adbc1645f8521 = function() { return logError(function (arg0, arg1) {
        arg0.lodMinClamp = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_mag_filter_4ce311d0e097cca4 = function() { return logError(function (arg0, arg1) {
        arg0.magFilter = __wbindgen_enum_GpuFilterMode[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_mapped_at_creation_34e7f793131eefbb = function() { return logError(function (arg0, arg1) {
        arg0.mappedAtCreation = arg1 !== 0;
    }, arguments) };
    imports.wbg.__wbg_set_mask_a51cdf9e56393e94 = function() { return logError(function (arg0, arg1) {
        arg0.mask = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_max_anisotropy_5be6e383b6e6632b = function() { return logError(function (arg0, arg1) {
        arg0.maxAnisotropy = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_min_binding_size_f9a65ac1a20ab955 = function() { return logError(function (arg0, arg1) {
        arg0.minBindingSize = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_min_filter_87ee94d6dcfdc3d8 = function() { return logError(function (arg0, arg1) {
        arg0.minFilter = __wbindgen_enum_GpuFilterMode[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_mip_level_2d7e962e91fd1c33 = function() { return logError(function (arg0, arg1) {
        arg0.mipLevel = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_mip_level_82be44e699a9cabf = function() { return logError(function (arg0, arg1) {
        arg0.mipLevel = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_mip_level_count_32bbfdc1aebc8dd3 = function() { return logError(function (arg0, arg1) {
        arg0.mipLevelCount = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_mip_level_count_79f47bf6140098e5 = function() { return logError(function (arg0, arg1) {
        arg0.mipLevelCount = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_mipmap_filter_1739c7c215847dc1 = function() { return logError(function (arg0, arg1) {
        arg0.mipmapFilter = __wbindgen_enum_GpuMipmapFilterMode[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_module_74f3d1c47da25794 = function() { return logError(function (arg0, arg1) {
        arg0.module = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_module_8ff6ea5431317fde = function() { return logError(function (arg0, arg1) {
        arg0.module = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_module_dae95bb56c7d6ee9 = function() { return logError(function (arg0, arg1) {
        arg0.module = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_multi_entry_0b85da37f62042d7 = function() { return logError(function (arg0, arg1) {
        arg0.multiEntry = arg1 !== 0;
    }, arguments) };
    imports.wbg.__wbg_set_multisample_156e854358e208ff = function() { return logError(function (arg0, arg1) {
        arg0.multisample = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_multisampled_775f1e38d554a0f4 = function() { return logError(function (arg0, arg1) {
        arg0.multisampled = arg1 !== 0;
    }, arguments) };
    imports.wbg.__wbg_set_offset_25f624abc0979ae4 = function() { return logError(function (arg0, arg1) {
        arg0.offset = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_offset_9cf47ca05ec82222 = function() { return logError(function (arg0, arg1) {
        arg0.offset = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_offset_9ed8011d53037f93 = function() { return logError(function (arg0, arg1) {
        arg0.offset = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_offset_d27243aad0b0b017 = function() { return logError(function (arg0, arg1) {
        arg0.offset = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_onabort_e3f60791db69f136 = function() { return logError(function (arg0, arg1) {
        arg0.onabort = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_onchange_ceed61dcb89e1290 = function() { return logError(function (arg0, arg1) {
        arg0.onchange = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_onclose_032729b3d7ed7a9e = function() { return logError(function (arg0, arg1) {
        arg0.onclose = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_oncomplete_e4a04a9244826e8b = function() { return logError(function (arg0, arg1) {
        arg0.oncomplete = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_onerror_08fecec3bdc9d24d = function() { return logError(function (arg0, arg1) {
        arg0.onerror = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_onerror_7819daa6af176ddb = function() { return logError(function (arg0, arg1) {
        arg0.onerror = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_onerror_e6509e1998f7da91 = function() { return logError(function (arg0, arg1) {
        arg0.onerror = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_onerror_e7e40c62a55a0770 = function() { return logError(function (arg0, arg1) {
        arg0.onerror = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_onload_3ff2f72af5cc911d = function() { return logError(function (arg0, arg1) {
        arg0.onload = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_onload_5e2862e3453854de = function() { return logError(function (arg0, arg1) {
        arg0.onload = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_onmessage_71321d0bed69856c = function() { return logError(function (arg0, arg1) {
        arg0.onmessage = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_onmessage_f0d5bf805190d1d8 = function() { return logError(function (arg0, arg1) {
        arg0.onmessage = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_onopen_6d4abedb27ba5656 = function() { return logError(function (arg0, arg1) {
        arg0.onopen = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_onsuccess_94332a00452de699 = function() { return logError(function (arg0, arg1) {
        arg0.onsuccess = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_onuncapturederror_5abf5ded0c5c6c5f = function() { return logError(function (arg0, arg1) {
        arg0.onuncapturederror = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_onupgradeneeded_3dc6e233a6d13fe2 = function() { return logError(function (arg0, arg1) {
        arg0.onupgradeneeded = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_onversionchange_dc2c7cfa4b978f80 = function() { return logError(function (arg0, arg1) {
        arg0.onversionchange = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_operation_2ad26b5d94a70e63 = function() { return logError(function (arg0, arg1) {
        arg0.operation = __wbindgen_enum_GpuBlendOperation[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_origin_0b50b7c9d0cd0d2b = function() { return logError(function (arg0, arg1) {
        arg0.origin = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_origin_142f4ec35ba3f8da = function() { return logError(function (arg0, arg1) {
        arg0.origin = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_origin_39cb32dbeeb0475a = function() { return logError(function (arg0, arg1) {
        arg0.origin = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_pass_op_25209e5db7ec5d4b = function() { return logError(function (arg0, arg1) {
        arg0.passOp = __wbindgen_enum_GpuStencilOperation[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_power_preference_2f983dce6d983584 = function() { return logError(function (arg0, arg1) {
        arg0.powerPreference = __wbindgen_enum_GpuPowerPreference[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_premultiplied_alpha_16b28d8f8575df1b = function() { return logError(function (arg0, arg1) {
        arg0.premultipliedAlpha = arg1 !== 0;
    }, arguments) };
    imports.wbg.__wbg_set_primitive_cc91060b2752c577 = function() { return logError(function (arg0, arg1) {
        arg0.primitive = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_query_set_57ee4e9bc06075da = function() { return logError(function (arg0, arg1) {
        arg0.querySet = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_query_set_e258abc9e7072a65 = function() { return logError(function (arg0, arg1) {
        arg0.querySet = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_r_4943e4c720ff77ca = function() { return logError(function (arg0, arg1) {
        arg0.r = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_required_features_52447a9e50ed9b36 = function() { return logError(function (arg0, arg1) {
        arg0.requiredFeatures = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_resolve_target_28603a69bca08e48 = function() { return logError(function (arg0, arg1) {
        arg0.resolveTarget = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_resource_0b72a17db4105dcc = function() { return logError(function (arg0, arg1) {
        arg0.resource = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_rows_per_image_2388f2cfec4ea946 = function() { return logError(function (arg0, arg1) {
        arg0.rowsPerImage = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_rows_per_image_d6b2e6d0385b8e27 = function() { return logError(function (arg0, arg1) {
        arg0.rowsPerImage = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_sample_count_1cd165278e1081cb = function() { return logError(function (arg0, arg1) {
        arg0.sampleCount = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_sample_count_8b3966e653c36415 = function() { return logError(function (arg0, arg1) {
        arg0.sampleCount = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_sample_type_5656761d1d13c084 = function() { return logError(function (arg0, arg1) {
        arg0.sampleType = __wbindgen_enum_GpuTextureSampleType[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_sampler_9559ad3dd242f711 = function() { return logError(function (arg0, arg1) {
        arg0.sampler = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_shader_location_2ee098966925fd00 = function() { return logError(function (arg0, arg1) {
        arg0.shaderLocation = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_size_a43ef8b3ef024e2c = function() { return logError(function (arg0, arg1) {
        arg0.size = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_size_d3baf773adcc6357 = function() { return logError(function (arg0, arg1) {
        arg0.size = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_size_fadeb2bddc7e6f67 = function() { return logError(function (arg0, arg1) {
        arg0.size = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_source_d446ffccec7cce9a = function() { return logError(function (arg0, arg1) {
        arg0.source = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_src_84f27c5105946dce = function() { return logError(function (arg0, arg1, arg2) {
        arg0.src = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_src_factor_ebc4adbcb746fedc = function() { return logError(function (arg0, arg1) {
        arg0.srcFactor = __wbindgen_enum_GpuBlendFactor[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_stencil_back_51d5377faff8840b = function() { return logError(function (arg0, arg1) {
        arg0.stencilBack = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_stencil_clear_value_21847cbc9881e39b = function() { return logError(function (arg0, arg1) {
        arg0.stencilClearValue = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_stencil_front_115e8b375153cc55 = function() { return logError(function (arg0, arg1) {
        arg0.stencilFront = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_stencil_load_op_3531e7e23b9c735e = function() { return logError(function (arg0, arg1) {
        arg0.stencilLoadOp = __wbindgen_enum_GpuLoadOp[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_stencil_read_mask_6022bedf9e54ec0d = function() { return logError(function (arg0, arg1) {
        arg0.stencilReadMask = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_stencil_read_only_02efae715d872f3e = function() { return logError(function (arg0, arg1) {
        arg0.stencilReadOnly = arg1 !== 0;
    }, arguments) };
    imports.wbg.__wbg_set_stencil_read_only_beb27fbf4ca9b6e4 = function() { return logError(function (arg0, arg1) {
        arg0.stencilReadOnly = arg1 !== 0;
    }, arguments) };
    imports.wbg.__wbg_set_stencil_store_op_7b3259ed6b9d76ca = function() { return logError(function (arg0, arg1) {
        arg0.stencilStoreOp = __wbindgen_enum_GpuStoreOp[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_stencil_write_mask_294d575eb0e2fd6f = function() { return logError(function (arg0, arg1) {
        arg0.stencilWriteMask = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_step_mode_5b6d687e55df5dd0 = function() { return logError(function (arg0, arg1) {
        arg0.stepMode = __wbindgen_enum_GpuVertexStepMode[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_storage_texture_b2963724a23aca9b = function() { return logError(function (arg0, arg1) {
        arg0.storageTexture = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_store_op_e1b7633c5612534a = function() { return logError(function (arg0, arg1) {
        arg0.storeOp = __wbindgen_enum_GpuStoreOp[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_strip_index_format_6d0c95e2646c52d1 = function() { return logError(function (arg0, arg1) {
        arg0.stripIndexFormat = __wbindgen_enum_GpuIndexFormat[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_targets_9f867a93d09515a9 = function() { return logError(function (arg0, arg1) {
        arg0.targets = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_texture_08516f643ed9f7ef = function() { return logError(function (arg0, arg1) {
        arg0.texture = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_texture_5f5d866a27cda2f3 = function() { return logError(function (arg0, arg1) {
        arg0.texture = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_texture_fbeffa5f2e57db49 = function() { return logError(function (arg0, arg1) {
        arg0.texture = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_timestamp_writes_54b499e0902d7146 = function() { return logError(function (arg0, arg1) {
        arg0.timestampWrites = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_timestamp_writes_94da76b5f3fee792 = function() { return logError(function (arg0, arg1) {
        arg0.timestampWrites = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_topology_0ef9190b0c51fc78 = function() { return logError(function (arg0, arg1) {
        arg0.topology = __wbindgen_enum_GpuPrimitiveTopology[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_type_3b563491184d1c74 = function() { return logError(function (arg0, arg1) {
        arg0.type = __wbindgen_enum_GpuQueryType[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_type_466673d0a1ab874b = function() { return logError(function (arg0, arg1, arg2) {
        arg0.type = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_type_657cd6d704dbc037 = function() { return logError(function (arg0, arg1) {
        arg0.type = __wbindgen_enum_GpuBufferBindingType[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_type_7ce650670a34c68f = function() { return logError(function (arg0, arg1, arg2) {
        arg0.type = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_type_c9565dd4ebe21c60 = function() { return logError(function (arg0, arg1) {
        arg0.type = __wbindgen_enum_GpuSamplerBindingType[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_unclipped_depth_936bc9a32a318b94 = function() { return logError(function (arg0, arg1) {
        arg0.unclippedDepth = arg1 !== 0;
    }, arguments) };
    imports.wbg.__wbg_set_unique_3dd7b4ef717ec230 = function() { return logError(function (arg0, arg1) {
        arg0.unique = arg1 !== 0;
    }, arguments) };
    imports.wbg.__wbg_set_usage_500c45ebe8b0bbf2 = function() { return logError(function (arg0, arg1) {
        arg0.usage = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_usage_9c6ccd6bcc15f735 = function() { return logError(function (arg0, arg1) {
        arg0.usage = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_usage_b84e5d16af27594a = function() { return logError(function (arg0, arg1) {
        arg0.usage = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_usage_e2790ec1205a5e27 = function() { return logError(function (arg0, arg1) {
        arg0.usage = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_vertex_9c9752039687305f = function() { return logError(function (arg0, arg1) {
        arg0.vertex = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_view_5aa6ed9f881b63f2 = function() { return logError(function (arg0, arg1) {
        arg0.view = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_view_820375e4a740874f = function() { return logError(function (arg0, arg1) {
        arg0.view = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_view_dimension_6ba3ac8e6bedbcb4 = function() { return logError(function (arg0, arg1) {
        arg0.viewDimension = __wbindgen_enum_GpuTextureViewDimension[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_view_dimension_95e6461d131f7086 = function() { return logError(function (arg0, arg1) {
        arg0.viewDimension = __wbindgen_enum_GpuTextureViewDimension[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_view_formats_6533614c7017475e = function() { return logError(function (arg0, arg1) {
        arg0.viewFormats = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_view_formats_ff46db459c40096d = function() { return logError(function (arg0, arg1) {
        arg0.viewFormats = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_visibility_deca18896989c982 = function() { return logError(function (arg0, arg1) {
        arg0.visibility = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_width_07eabc802de7b030 = function() { return logError(function (arg0, arg1) {
        arg0.width = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_width_0a22c810f06a5152 = function() { return logError(function (arg0, arg1) {
        arg0.width = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_width_7ff7a22c6e9f423e = function() { return logError(function (arg0, arg1) {
        arg0.width = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_write_mask_122c167c45bb2d8e = function() { return logError(function (arg0, arg1) {
        arg0.writeMask = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_x_be1ec46ce6627cfc = function() { return logError(function (arg0, arg1) {
        arg0.x = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_x_cc281962ce68ef00 = function() { return logError(function (arg0, arg1) {
        arg0.x = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_y_71fc9939d0375491 = function() { return logError(function (arg0, arg1) {
        arg0.y = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_y_7d6f1f0a01ce4000 = function() { return logError(function (arg0, arg1) {
        arg0.y = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_z_b316da2a41e7822f = function() { return logError(function (arg0, arg1) {
        arg0.z = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_shiftKey_a6df227a917d203b = function() { return logError(function (arg0) {
        const ret = arg0.shiftKey;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_shiftKey_d2640abcfa98acec = function() { return logError(function (arg0) {
        const ret = arg0.shiftKey;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_signal_3c14fbdc89694b39 = function() { return logError(function (arg0) {
        const ret = arg0.signal;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_size_beea1890c315fb17 = function() { return logError(function (arg0) {
        const ret = arg0.size;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_stack_0ed75d68575b0f3c = function() { return logError(function (arg0, arg1) {
        const ret = arg1.stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_start_dd05b3be5674e9f3 = function() { return logError(function (arg0) {
        arg0.start();
    }, arguments) };
    imports.wbg.__wbg_static_accessor_GLOBAL_769e6b65d6557335 = function() { return logError(function () {
        const ret = typeof global === 'undefined' ? null : global;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_static_accessor_GLOBAL_THIS_60cf02db4de8e1c1 = function() { return logError(function () {
        const ret = typeof globalThis === 'undefined' ? null : globalThis;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_static_accessor_SELF_08f5a74c69739274 = function() { return logError(function () {
        const ret = typeof self === 'undefined' ? null : self;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_static_accessor_WINDOW_a8924b26aa92d024 = function() { return logError(function () {
        const ret = typeof window === 'undefined' ? null : window;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_style_521a717da50e53c6 = function() { return logError(function (arg0) {
        const ret = arg0.style;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_subarray_845f2f5bce7d061a = function() { return logError(function (arg0, arg1, arg2) {
        const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_submit_3ecd36be9abeba75 = function() { return logError(function (arg0, arg1) {
        arg0.submit(arg1);
    }, arguments) };
    imports.wbg.__wbg_target_0e3e05a6263c37a0 = function() { return logError(function (arg0) {
        const ret = arg0.target;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_then_429f7caf1026411d = function() { return logError(function (arg0, arg1, arg2) {
        const ret = arg0.then(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_then_4f95312d68691235 = function() { return logError(function (arg0, arg1) {
        const ret = arg0.then(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_transaction_257422def49a0094 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.transaction(arg1, __wbindgen_enum_IdbTransactionMode[arg2]);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_transaction_edb5bc8f37fa6aec = function() { return logError(function (arg0) {
        const ret = arg0.transaction;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_type_cb833fc71b5282fb = function() { return logError(function (arg0, arg1) {
        const ret = arg1.type;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_types_f80c57486535c4f2 = function() { return logError(function (arg0) {
        const ret = arg0.types;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_unique_7be9efa769c9d322 = function() { return logError(function (arg0) {
        const ret = arg0.unique;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_unmap_2903d5b193373f12 = function() { return logError(function (arg0) {
        arg0.unmap();
    }, arguments) };
    imports.wbg.__wbg_unobserve_0d3c5074b9205239 = function() { return logError(function (arg0, arg1) {
        arg0.unobserve(arg1);
    }, arguments) };
    imports.wbg.__wbg_usage_7b00ab14a235fa77 = function() { return logError(function (arg0) {
        const ret = arg0.usage;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_userAgentData_f7b0e61c05c54315 = function() { return logError(function (arg0) {
        const ret = arg0.userAgentData;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_userAgent_e18bc0cc9ad38ec1 = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.userAgent;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_valueOf_663ea9f1ad0d6eda = function() { return logError(function (arg0) {
        const ret = arg0.valueOf();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_value_57b7b035e117f7ee = function() { return logError(function (arg0) {
        const ret = arg0.value;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_versions_c01dfd4722a88165 = function() { return logError(function (arg0) {
        const ret = arg0.versions;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_visibilityState_2f27cbaac764b521 = function() { return logError(function (arg0) {
        const ret = arg0.visibilityState;
        return (__wbindgen_enum_VisibilityState.indexOf(ret) + 1 || 3) - 1;
    }, arguments) };
    imports.wbg.__wbg_warn_6e567d0d926ff881 = function() { return logError(function (arg0) {
        console.warn(arg0);
    }, arguments) };
    imports.wbg.__wbg_webkitExitFullscreen_85426cef5e755dfa = function() { return logError(function (arg0) {
        arg0.webkitExitFullscreen();
    }, arguments) };
    imports.wbg.__wbg_webkitFullscreenElement_a9ca38b7214d1567 = function() { return logError(function (arg0) {
        const ret = arg0.webkitFullscreenElement;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_webkitRequestFullscreen_23664c63833ff0e5 = function() { return logError(function (arg0) {
        arg0.webkitRequestFullscreen();
    }, arguments) };
    imports.wbg.__wbg_wgslLanguageFeatures_573953bc7ddeb467 = function() { return logError(function (arg0) {
        const ret = arg0.wgslLanguageFeatures;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_width_30d712cfe70e4fae = function() { return logError(function (arg0) {
        const ret = arg0.width;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_writeBuffer_1897edb8e6677e9a = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.writeBuffer(arg1, arg2, arg3, arg4, arg5);
    }, arguments) };
    imports.wbg.__wbg_writeText_c9776abb6826901c = function() { return logError(function (arg0, arg1, arg2) {
        const ret = arg0.writeText(getStringFromWasm0(arg1, arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_writeTexture_e6008247063eadbf = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.writeTexture(arg1, arg2, arg3, arg4);
    }, arguments) };
    imports.wbg.__wbg_write_b6b51422643b0ba7 = function() { return logError(function (arg0, arg1) {
        const ret = arg0.write(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_cast_2241b6af4c4b2941 = function() { return logError(function (arg0, arg1) {
        // Cast intrinsic for `Ref(String) -> Externref`.
        const ret = getStringFromWasm0(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_cast_39ee65c64765cc23 = function() { return logError(function (arg0, arg1) {
        // Cast intrinsic for `Closure(Closure { dtor_idx: 2590, function: Function { arguments: [NamedExternref("PointerEvent")], shim_idx: 2707, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
        const ret = makeMutClosure(arg0, arg1, wasm.wasm_bindgen__closure__destroy__h100da5e8b7244edf, wasm_bindgen__convert__closures_____invoke__h89cfc849b552b19b);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_cast_3bb43881b9eb9d15 = function() { return logError(function (arg0, arg1) {
        // Cast intrinsic for `Closure(Closure { dtor_idx: 1807, function: Function { arguments: [NamedExternref("GPUUncapturedErrorEvent")], shim_idx: 1802, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
        const ret = makeMutClosure(arg0, arg1, wasm.wasm_bindgen__closure__destroy__hfbae1b173b2b80e1, wasm_bindgen__convert__closures_____invoke__habb541a800c9a2b4);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_cast_423120d25cec75f1 = function() { return logError(function (arg0, arg1) {
        // Cast intrinsic for `Closure(Closure { dtor_idx: 2591, function: Function { arguments: [], shim_idx: 2700, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
        const ret = makeMutClosure(arg0, arg1, wasm.wasm_bindgen__closure__destroy__hbe574684e058e067, wasm_bindgen__convert__closures_____invoke__h7056fb3b0f0d5615);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_cast_4dbebe1c3593f895 = function() { return logError(function (arg0, arg1) {
        // Cast intrinsic for `Closure(Closure { dtor_idx: 2388, function: Function { arguments: [NamedExternref("IDBVersionChangeEvent")], shim_idx: 2457, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
        const ret = makeMutClosure(arg0, arg1, wasm.wasm_bindgen__closure__destroy__h2e6f0d1bc5b4eea8, wasm_bindgen__convert__closures_____invoke__hcdeee809ea8f37d3);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_cast_55ec69c982cb2f21 = function() { return logError(function (arg0, arg1) {
        // Cast intrinsic for `Closure(Closure { dtor_idx: 2593, function: Function { arguments: [NamedExternref("Array<any>")], shim_idx: 2706, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
        const ret = makeMutClosure(arg0, arg1, wasm.wasm_bindgen__closure__destroy__h93008def93b835f4, wasm_bindgen__convert__closures_____invoke__hac4421b78e6862e7);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_cast_63546429de0e9888 = function() { return logError(function (arg0, arg1) {
        // Cast intrinsic for `Closure(Closure { dtor_idx: 2511, function: Function { arguments: [NamedExternref("Event")], shim_idx: 2512, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
        const ret = makeMutClosure(arg0, arg1, wasm.wasm_bindgen__closure__destroy__hd0014f248c327c5e, wasm_bindgen__convert__closures_____invoke__h96fe359bdad60d2d);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_cast_7aa4e94ef91c9901 = function() { return logError(function (arg0, arg1) {
        // Cast intrinsic for `Closure(Closure { dtor_idx: 2597, function: Function { arguments: [NamedExternref("Event")], shim_idx: 2705, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
        const ret = makeMutClosure(arg0, arg1, wasm.wasm_bindgen__closure__destroy__ha8d280469c999073, wasm_bindgen__convert__closures_____invoke__hdc5e2b6e3d336e70);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_cast_89a236d47f823080 = function() { return logError(function (arg0, arg1) {
        // Cast intrinsic for `Closure(Closure { dtor_idx: 2595, function: Function { arguments: [NamedExternref("Array<any>"), NamedExternref("ResizeObserver")], shim_idx: 2708, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
        const ret = makeMutClosure(arg0, arg1, wasm.wasm_bindgen__closure__destroy__hde118feef513742b, wasm_bindgen__convert__closures_____invoke__hc60b8628c24971b4);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_cast_9992bd564c47efaf = function() { return logError(function (arg0, arg1) {
        // Cast intrinsic for `Closure(Closure { dtor_idx: 2387, function: Function { arguments: [NamedExternref("MessageEvent")], shim_idx: 2456, ret: Unit, inner_ret: Some(Unit) }, mutable: false }) -> Externref`.
        const ret = makeClosure(arg0, arg1, wasm.wasm_bindgen__closure__destroy__hf98ff6571d04f12e, wasm_bindgen__convert__closures_____invoke__hdbf621e1e726425e);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_cast_a8ed6861faa8c2f6 = function() { return logError(function (arg0, arg1) {
        // Cast intrinsic for `Closure(Closure { dtor_idx: 34, function: Function { arguments: [NamedExternref("DragEvent")], shim_idx: 184, ret: Unit, inner_ret: Some(Unit) }, mutable: false }) -> Externref`.
        const ret = makeClosure(arg0, arg1, wasm.wasm_bindgen__closure__destroy__h113c4cd32201cf5c, wasm_bindgen__convert__closures_____invoke__h1cc7e65e9e4e3b6f);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_cast_b6a75a687f082c1d = function() { return logError(function (arg0, arg1) {
        // Cast intrinsic for `Closure(Closure { dtor_idx: 2592, function: Function { arguments: [NamedExternref("KeyboardEvent")], shim_idx: 2703, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
        const ret = makeMutClosure(arg0, arg1, wasm.wasm_bindgen__closure__destroy__hbfc22787cf1765f1, wasm_bindgen__convert__closures_____invoke__hf2972596b9f4234f);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_cast_b6d1f037b36d1e22 = function() { return logError(function (arg0, arg1) {
        // Cast intrinsic for `Closure(Closure { dtor_idx: 2386, function: Function { arguments: [NamedExternref("CloseEvent")], shim_idx: 2454, ret: Unit, inner_ret: Some(Unit) }, mutable: false }) -> Externref`.
        const ret = makeClosure(arg0, arg1, wasm.wasm_bindgen__closure__destroy__h3cfcf4a4273d426f, wasm_bindgen__convert__closures_____invoke__h96c22d8053682eec);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_cast_cb9088102bce6b30 = function() { return logError(function (arg0, arg1) {
        // Cast intrinsic for `Ref(Slice(U8)) -> NamedExternref("Uint8Array")`.
        const ret = getArrayU8FromWasm0(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_cast_d2100868f22eaf67 = function() { return logError(function (arg0, arg1) {
        // Cast intrinsic for `Closure(Closure { dtor_idx: 2596, function: Function { arguments: [NamedExternref("PageTransitionEvent")], shim_idx: 2701, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
        const ret = makeMutClosure(arg0, arg1, wasm.wasm_bindgen__closure__destroy__hfb6629331d4dce7e, wasm_bindgen__convert__closures_____invoke__h3e2c67654a2d5277);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_cast_d6cd19b81560fd6e = function() { return logError(function (arg0) {
        // Cast intrinsic for `F64 -> Externref`.
        const ret = arg0;
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_cast_e02f5c661fc84ab9 = function() { return logError(function (arg0, arg1) {
        // Cast intrinsic for `Closure(Closure { dtor_idx: 2594, function: Function { arguments: [NamedExternref("FocusEvent")], shim_idx: 2702, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
        const ret = makeMutClosure(arg0, arg1, wasm.wasm_bindgen__closure__destroy__h51c0b3aaa7921153, wasm_bindgen__convert__closures_____invoke__hc76af966a592eb33);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_cast_ebfd7d9dd15a6c48 = function() { return logError(function (arg0, arg1) {
        // Cast intrinsic for `Closure(Closure { dtor_idx: 2734, function: Function { arguments: [Externref], shim_idx: 2735, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
        const ret = makeMutClosure(arg0, arg1, wasm.wasm_bindgen__closure__destroy__h4739c7a4cb3950fe, wasm_bindgen__convert__closures_____invoke__h1fad2bb8049b3dfb);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_cast_ed31101cbd221f36 = function() { return logError(function (arg0, arg1) {
        // Cast intrinsic for `Closure(Closure { dtor_idx: 2389, function: Function { arguments: [], shim_idx: 2453, ret: Unit, inner_ret: Some(Unit) }, mutable: false }) -> Externref`.
        const ret = makeClosure(arg0, arg1, wasm.wasm_bindgen__closure__destroy__hdfa6733916632639, wasm_bindgen__convert__closures_____invoke__h58c3fe630889d985);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_cast_eea5c93850aa6e20 = function() { return logError(function (arg0, arg1) {
        // Cast intrinsic for `Closure(Closure { dtor_idx: 2390, function: Function { arguments: [NamedExternref("ErrorEvent")], shim_idx: 2455, ret: Unit, inner_ret: Some(Unit) }, mutable: false }) -> Externref`.
        const ret = makeClosure(arg0, arg1, wasm.wasm_bindgen__closure__destroy__h39a389cf5588dbfa, wasm_bindgen__convert__closures_____invoke__h0ae20a6a123b01a1);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_cast_f94ff303afd582f5 = function() { return logError(function (arg0, arg1) {
        // Cast intrinsic for `Closure(Closure { dtor_idx: 2589, function: Function { arguments: [NamedExternref("WheelEvent")], shim_idx: 2704, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
        const ret = makeMutClosure(arg0, arg1, wasm.wasm_bindgen__closure__destroy__h68619ecbee1f5582, wasm_bindgen__convert__closures_____invoke__h69d907cbca5bfb7f);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_externrefs;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
    };

    return imports;
}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedUint32ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('drafftink_app_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
