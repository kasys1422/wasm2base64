export function base64Wasm2WasmBinary(wasm_base64, compress = null){
    let array = Uint8Array.from(Array.prototype.map.call(atob(wasm_base64), (x) => {return x.charCodeAt(0)}));
    if(typeof compress == "string" && compress != "none" &&  compress != "" && typeof DecompressionStream == "function"){
        return new Response(new Blob([array]).stream().pipeThrough(new DecompressionStream(compress))).arrayBuffer().then(function(array_buf) {
            return new Uint8Array(array_buf)
        });
    }else{
        return new Response(new Blob([array]).stream()).arrayBuffer().then(function(array_buf) {
            return new Uint8Array(array_buf)
        });
    }
}

export function wasmBinary2WasmObjectURL(wasm_binary){
    return URL.createObjectURL(new Blob([wasm_binary], {type : 'application/wasm'}));
}

export async function base64Wasm2WasmObjectURL(wasm_base64, compress = null){
    const binary = await base64Wasm2WasmBinary(wasm_base64, compress)
    return wasmBinary2WasmObjectURL(binary);
}

export async function initBase64Wasm(wasm_raw_data, compress = null, imports = null){
    if(typeof wasm_raw_data == "string")wasm_raw_data = await base64Wasm2WasmBinary(wasm_raw_data, compress);
    const data = fetch(wasmBinary2WasmObjectURL(Uint8Array.from(wasm_raw_data).buffer));
    return new Promise(function (resolve) {
        (async () => {
            let instance;
            const module = await WebAssembly.compileStreaming(data);
            if (imports == null){
                instance = await WebAssembly.instantiate(module);
            }else{
                instance = await WebAssembly.instantiate(module, imports);
            }
            resolve(instance.exports);
        })();
    });
}