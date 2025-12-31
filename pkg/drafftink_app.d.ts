/* tslint:disable */
/* eslint-disable */

/**
 * Initialize and run the WASM application.
 */
export function run_wasm(): Promise<void>;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly run_wasm: () => void;
  readonly wasm_bindgen__convert__closures_____invoke__hd3b04db3772bab97: (a: number, b: number, c: any) => void;
  readonly wasm_bindgen__closure__destroy__h717cf0e5847ec7b6: (a: number, b: number) => void;
  readonly wasm_bindgen__convert__closures_____invoke__h6f700808b778e301: (a: number, b: number, c: any) => void;
  readonly wasm_bindgen__closure__destroy__h104e7e0ef866fa3c: (a: number, b: number) => void;
  readonly wasm_bindgen__convert__closures_____invoke__h1bc9c6d4bef58241: (a: number, b: number) => void;
  readonly wasm_bindgen__closure__destroy__h1913345a1064760d: (a: number, b: number) => void;
  readonly wasm_bindgen__convert__closures_____invoke__hb7e1412cedd8eaae: (a: number, b: number, c: any) => void;
  readonly wasm_bindgen__closure__destroy__hbb36a44d5d7fe2b5: (a: number, b: number) => void;
  readonly wasm_bindgen__convert__closures_____invoke__h79f2f32feea07643: (a: number, b: number, c: any) => void;
  readonly wasm_bindgen__convert__closures_____invoke__h0cb8e97ef38a13f6: (a: number, b: number, c: any, d: any) => void;
  readonly wasm_bindgen__convert__closures_____invoke__h73d7e8e951556a4f: (a: number, b: number) => void;
  readonly wasm_bindgen__convert__closures_____invoke__h60ae814bfeeb69b4: (a: number, b: number, c: any) => void;
  readonly wasm_bindgen__closure__destroy__hb23464428ca0319f: (a: number, b: number) => void;
  readonly wasm_bindgen__convert__closures_____invoke__h46bce26f971b40f8: (a: number, b: number, c: any) => void;
  readonly wasm_bindgen__convert__closures_____invoke__h0d5dbd490d56a89b: (a: number, b: number, c: any, d: any) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_externrefs: WebAssembly.Table;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
