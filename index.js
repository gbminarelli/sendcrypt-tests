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
      // console.log("\nKey:");
      // console.log(key);
      const files = e.target.files;
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const iv = window.crypto.getRandomValues(new Uint8Array(12));
          // Updating the XHR header:
          xhr.setRequestHeader("iv-list", iv);
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
        // console.log("\nKeydata:");
        // console.log(keydata);
        document.getElementById("secure-link").innerText = `Your secure link is: ${window.location.href}#${keydata.k}`;
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
}

window.onload = myApp;
