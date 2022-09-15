let importObject = {
    imports: {
            imported_func: function(arg) {
                console.log(arg);
            }
        }
    };

const code = document.getElementById("text");
const compress = document.getElementById("compress");


function Run_A(){
    initBase64Wasm(code.value,compress.value,importObject).then(results => {
        console.log(results);
        results.exported_func();
    });
}

function Run_B(){
    base64Wasm2WasmObjectURL(code.value,compress.value).then(ObjectURL =>
        fetch(ObjectURL).then(response =>
            response.arrayBuffer()
        ).then(bytes =>
            WebAssembly.instantiate(bytes, importObject)
        ).then(results => {
            results.instance.exports.exported_func();
        })
    );
}

/*
[sample]
    let importObject = {
        imports: {
                imported_func: function(arg) {
                    console.log(arg);
                }
            }
        };

    //load sample A
    initBase64Wasm("[Base64 code of wasm]","[compress type]",importObject).then(results => {
        results.exported_func();
    });

    //load sample B
    base64Wasm2WasmObjectURL("[Base64 code of wasm]","[compress type]").then(ObjectURL =>
        fetch(ObjectURL).then(response =>
            response.arrayBuffer()
        ).then(bytes =>
            WebAssembly.instantiate(bytes, importObject)
        ).then(results => {
            results.instance.exports.exported_func();
        })
    );

[Base64 code of wasm] : write your encoded text.
[compress type] : choose type of compress ("none", "gzip", "deflate", "deflate-raw")

*/