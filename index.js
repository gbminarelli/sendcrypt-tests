const myApp = () => {
  const handleFileSelect = (e) => {
    // Creating form:
    let form = new FormData();
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
      for (const file of e.target.files) {
        const reader = new FileReader();
        reader.onload = (e) => {
          // Encrypting file:
          window.crypto.subtle.encrypt(
            {
              name: "AES-GCM",
              iv: window.crypto.getRandomValues(new Uint8Array(12))
            },
            key,
            e.target.result
          )
          .then((encrypted) => {
            // Returns an ArrayBuffer containing the encrypted data:
            console.log("\nEncrypted data:");
            console.log(new Uint8Array(encrypted));
            // Appending new data to form:
            form.append('encrypted', new Blob([encrypted], {type:"application/octet-stream"}));
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
