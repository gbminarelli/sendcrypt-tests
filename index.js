const myApp = () => {
  // ===
  // Encrypting and Uploading:
  // ===
  const handleFileSelect = (e) => {
    // Creating form:
    let form = new FormData();
    // Opening XHR:
    let xhr = new XMLHttpRequest();
    xhr.open("POST", '/', true);
    // xhr.setRequestHeader('Content-Type','multipart/form-data; boundary=AaB03x');
    // Creating key for the selected files:
    window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    )
    .then((key) => {
      // Returns the key:
      // console.log("\nKey:");
      // console.log(key);
      const files = e.target.files;
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e) => {
          // const ivBuffer = window.crypto.getRandomValues(new ArrayBuffer(12));
          // const iv = new Uint8Array(ivBuffer);
          const iv = window.crypto.getRandomValues(new Uint8Array(12));
          console.log("\nOriginal IV:");
          console.log(iv);
          window.crypto.subtle.encrypt(
            {
              name: "AES-GCM",
              iv: iv
            },
            key,
            e.target.result
          )
          .then((encrypted) => {
            // const ivBlob = new Blob([iv], {type:"application/octet-stream"});
            // form.append('iv', ivBlob, 'Initialization Vector');
            // form.append('iv', new Blob([iv.buffer], {type:"application/octet-stream"}), 'Initialization Vector');
            form.append('encrypted', new Blob([iv.buffer], {type:"application/octet-stream"}), 'Initialization Vector');
            form.append('encrypted', new Blob([encrypted], {type:"application/octet-stream"}), 'Encrypted File');
            // Checking IV value:
            // const ivReader = new FileReader();
            // ivReader.onload = (e) => {
            //   console.log("\nIV blob result:");
            //   // console.log(e.target.result);
            //   console.log(new Uint8Array(e.target.result));
            // };
            // ivReader.readAsArrayBuffer(ivBlob);
            // if (form.getAll("encrypted").length === files.length) {
            if (form.getAll("encrypted").length === (2 * files.length)) {
              // Returns encrypted values on the form:
              // console.log("\nEncrypted Files:");
              // console.log(form.getAll("encrypted"));
              // Returns the IVs:
              // console.log("\nIVs:");
              // console.log(form.getAll("iv"));
              // Sending form:
              xhr.send(form);
            }
          })
          .catch(function(err){
              console.error(err);
          });
        }
        // Reading the file:
        reader.readAsArrayBuffer(file);
      }
      window.crypto.subtle.exportKey(
        "jwk",
        key
      )
      .then((keydata) => {
        // Returns the exported key data:
        // console.log("\nKeydata:");
        // console.log(keydata);
        document.getElementById("secure-link").innerText = `Your secure link is: ${window.location.origin}/#${keydata.k}`;
      })
      .catch((err) => {
        console.error(err);
      });
    })
    .catch((err) => {
      console.error(err);
    });
  };
  document.getElementById('files').addEventListener('change', handleFileSelect, false);
  // ===
  // Downloading and Decrypting:
  // ===
  if (window.location.hash) {
    let xhr = new XMLHttpRequest(),
    files = [];
    xhr.open("GET", '/folder', true);
    xhr.onload = (e) => {
      const response = JSON.parse(xhr.response);
      console.log(response);
      // response is the whole database (all the folders);
      // response[0] is a reference to the first (and in this case, only) folder.
      // TODO: create a folder structure and reference a specific folder instead of getting the first one here.
      for (const [index, e] of response[0].entries()) {
        // Recovering and gouping IV and Encrypted File:
        if (e.originalname === "Initialization Vector") {
          files.push({
            iv: e.buffer.data,
            file: response[0][index+1].buffer.data
          });
        }
      }
      console.log(files);
    };
    xhr.send();
    // Returns the secret key:
    console.log(`Secret key: ${window.location.hash.slice(1)}`);
    // Importing key:
    window.crypto.subtle.importKey(
      "jwk",
      {
          kty: "oct",
          k: window.location.hash.slice(1),
          alg: "A256GCM",
          ext: true,
      },
      {
          name: "AES-GCM",
      },
      false,
      ["encrypt", "decrypt"]
    )
    .then((key) => {
      // window.crypto.subtle.decrypt(
      //   {
      //     name: "AES-GCM",
      //     iv: ArrayBuffer(12), //The initialization vector you used to encrypt
      //     additionalData: ArrayBuffer, //The addtionalData you used to encrypt (if any)
      //     tagLength: 128, //The tagLength you used to encrypt (if any)
      //   },
      //   key, //from generateKey or importKey above
      //   data //ArrayBuffer of the data
      // )
      // .then(function(decrypted){
      //   //returns an ArrayBuffer containing the decrypted data
      //   console.log(new Uint8Array(decrypted));
      // })
      // .catch(function(err){
      //   console.error(err);
      // });
    })
    .catch((err) => {
      console.error(err);
    });
  }
}

window.onload = myApp;
