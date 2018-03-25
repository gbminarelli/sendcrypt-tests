const myApp = () => {
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
      console.log("\nKey:");
      console.log(key);
      const files = e.target.files;
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const iv = window.crypto.getRandomValues(new Uint8Array(12));
          console.log(file);
          // Updating the XHR header:
          xhr.setRequestHeader("IV-List", iv);
          // Encrypting file:
          window.crypto.subtle.encrypt(
            {
              name: "AES-GCM",
              iv: iv
            },
            key,
            e.target.result
          )
          .then((encrypted) => {
            // Returns an ArrayBuffer containing the encrypted data:
            // console.log("\nEncrypted data:");
            // console.log(new Uint8Array(encrypted));
            // Appending new data to form:
            form.append('encrypted', new Blob([encrypted], {type:"application/octet-stream"}));
            if (form.getAll("encrypted").length === files.length) {
              // Returns encrypted values on the form:
              // console.log("\nEncrypted blobs:");
              // console.log(form.getAll("encrypted"));
              // for (const key of form.keys()) {
              //   console.log(key);
              // }
              // for (const value of form.values()) {
              //   console.log(value);
              // }
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
        console.log("\nKeydata:");
        console.log(keydata);
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
  if (window.location.hash) {
    // Opening XHR:
    let xhr = new XMLHttpRequest();
    xhr.open("GET", '/decrypt', true);
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
