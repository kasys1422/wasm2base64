function arrayBufferToBase64(array) {
    let binary = "";
    let bytes = new Uint8Array(array);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function wasmBinaryArray2Base64(wasm_binary, compress = null){
    let array = new Uint8Array(wasm_binary);
    return new Promise(function (resolve) {
        if(typeof compress == "string" && compress != "none" && compress != "" && typeof CompressionStream == "function"){
            new Response(new Blob([array]).stream().pipeThrough(new CompressionStream(compress))).arrayBuffer().then(function(array_buf) {
                resolve(arrayBufferToBase64(array_buf)); 
            });
        }else{
            new Response(new Blob([array])).arrayBuffer().then(function(array_buf) {
                resolve(arrayBufferToBase64(array_buf)); 
            });
        }
    })
}

function wasmBinaryUrl2Base64(url, compress = null){
    return new Promise(function (resolve) {
        fetch(url).then(function(result) {
            return result.arrayBuffer();
        }).then(function(result) {
            wasmBinaryArray2Base64(result, compress)
        }).then(function(result) {
            resolve(result);
        });
    })
}