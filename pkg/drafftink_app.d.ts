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
  readonly wasm_bindgen__convert__closures_____invoke__h489b62424a61e723: (a: number, b: number, c: any) => void;
  readonly wasm_bindgen__closure__destroy__h13567a934634cf91: (a: number, b: number) => void;
  readonly wasm_bindgen__convert__closures_____invoke__h0f3b938cc576e16d: (a: number, b: number, c: any) => void;
  readonly wasm_bindgen__closure__destroy__h0e4b6504d983a31e: (a: number, b: number) => void;
  readonly wasm_bindgen__convert__closures_____invoke__haddfa11cf602942f: (a: number, b: number, c: any, d: any) => void;
  readonly wasm_bindgen__convert__closures_____invoke__hd703230defe4f49e: (a: number, b: number, c: any) => void;
  readonly wasm_bindgen__closure__destroy__hac9e788272f53f61: (a: number, b: number) => void;
  readonly wasm_bindgen__convert__closures_____invoke__h0518a71caba59af3: (a: number, b: number, c: any) => void;
  readonly wasm_bindgen__closure__destroy__h95af2bf67f560197: (a: number, b: number) => void;
  readonly wasm_bindgen__convert__closures_____invoke__hf86ab8fab5d0ff9b: (a: number, b: number) => void;
  readonly wasm_bindgen__convert__closures_____invoke__h45660e1793bcb87c: (a: number, b: number) => void;
  readonly wasm_bindgen__convert__closures_____invoke__h190b010050a380d8: (a: number, b: number, c: any) => void;
  readonly wasm_bindgen__closure__destroy__h01ea968f9b26b171: (a: number, b: number) => void;
  readonly wasm_bindgen__convert__closures_____invoke__hbc9ef48969043216: (a: number, b: number, c: any) => void;
  readonly wasm_bindgen__convert__closures_____invoke__h1411d391155fd4df: (a: number, b: number, c: any, d: any) => void;
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
