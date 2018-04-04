const myApp = () => {
  // ===
  // Encrypting and Uploading:
  // ===
  const handleEncryptFiles = (e) => {
    let form = new FormData();
    let xhr = new XMLHttpRequest();
    xhr.open("POST", '/', true);
    // xhr.setRequestHeader('Content-Type','multipart/form-data; boundary=AaB03x');
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
            console.log(encrypted);
            console.log(iv.buffer);
            console.log(new Blob([iv.buffer, encrypted], {type:"application/octet-stream"}));
            form.append('encrypted', new Blob([iv.buffer, encrypted], {type:"application/octet-stream"}));
            // Checking IV value:
            // const ivReader = new FileReader();
            // ivReader.onload = (e) => {
            //   console.log("\nIV blob result:");
            //   // console.log(e.target.result);
            //   console.log(new Uint8Array(e.target.result));
            // };
            // ivReader.readAsArrayBuffer(ivBlob);
            // if (form.getAll("encrypted").length === files.length) {
            if (form.getAll("encrypted").length === files.length) {
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
        document.getElementById("secure-link").innerText = `${window.location.origin}/#${keydata.k}`;
        document.getElementById("secure-link").parentElement.style.display = 'block';
      })
      .catch((err) => {
        console.error(err);
      });
    })
    .catch((err) => {
      console.error(err);
    });
  };
  // ===
  // Downloading and Decrypting:
  // ===
  const handleDecryptFile = (e) => {
    if (window.location.hash) {
      console.log(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log(e.target.result);
        console.log(e.target.result.slice(0,12));
        console.log(e.target.result.slice(12));
        const iv = e.target.result.slice(0,12);
        const data = e.target.result.slice(12);
        key.then((key) => {
          // console.log(Float64Array.from(fileObject.file));
          // console.log(Float64Array.from(fileObject.file).buffer);
          // const fileArrayBuffer = Uint8Array.from(fileObject.file).buffer;
          // console.log(fileArrayBuffer);
          window.crypto.subtle.decrypt(
            {
              name: "AES-GCM",
              iv: iv
            },
            key,
            data
          )
          .then(function(decrypted){
            // TODO MIME types.
            console.log('success');
            const linkDecryptedFile = (data) => {
              const file = new Blob([data], {type: 'image/jpeg'});
              return window.URL.createObjectURL(file);
            };
            document.getElementById('download-link').href = linkDecryptedFile(decrypted);
            document.getElementById('download-link').parentElement.style.display = 'block';
            // console.log(new Uint8Array(decrypted));
            // return decrypted;
          })
          .catch(function(err){
            console.error(err);
          });
        })
        .catch((err) => {
          console.error(err);
        });
      }
      reader.readAsArrayBuffer(e.target.files[0]);
      // const makeFile = (fileObject) => {
      //   const reader = new FileReader();
      //   reader.onload = (e) => {
      //     console.log(e.currentTarget.result);
      //     key.then((key) => {
      //       // console.log(Float64Array.from(fileObject.file));
      //       // console.log(Float64Array.from(fileObject.file).buffer);
      //       // const fileArrayBuffer = Uint8Array.from(fileObject.file).buffer;
      //       // console.log(fileArrayBuffer);
      //       // window.crypto.subtle.decrypt(
      //       //   {
      //       //     name: "AES-GCM",
      //       //     iv: fileObject.iv
      //       //   },
      //       //   key,
      //       //   fileArrayBuffer
      //       // )
      //       // .then(function(decrypted){
      //       //   console.log('success');
      //       //   // console.log(new Uint8Array(decrypted));
      //       //   // return decrypted;
      //       // })
      //       // .catch(function(err){
      //       //   console.error(err);
      //       // });
      //     })
      //     .catch((err) => {
      //       console.error(err);
      //     });
      //   };
      //   // TODO: fileObject is not a blob... where does it get coerced?
      //   // reader.readAsArrayBuffer(fileObject.file);
      // };
      // let xhr = new XMLHttpRequest(),
      // files = [];
      // xhr.open("GET", '/secret-folder', true);
      // xhr.onload = (e) => {
      //   const response = JSON.parse(xhr.response);
      //   console.log('\nJSON Response');
      //   console.log(response);
      //   // console.log('\nRaw Response');
      //   // console.log(xhr.response);
      //   // response is the whole database (all the folders).
      //   // response[0] is a reference to the first (and in this case, only) folder.
      //   // TODO: create a folder structure and reference a specific folder instead of getting the first one here.
      //   for (const [index, e] of response[0].entries()) {
      //     // Recovering and gouping IV and Encrypted File:
      //     console.log(e);
      //     const fileObject = {
      //       // iv: e.buffer.data,
      //       // file: response[0][index+1].buffer.data
      //       // file: response[0][index+1]
      //     };
      //     let newDiv = document.createElement('div');
      //     newButton = document.createElement('a'),
      //     fileName = document.createTextNode(`File ${index}`);
      //     newButton.dataset.fileIndex = index;
      //     newButton.appendChild(fileName);
      //     newButton.addEventListener('click', (e) => {
      //       // console.log(e.target.dataset.fileIndex);
      //       e.preventDefault();
      //       // e.target.href = makeFile(files[e.target.dataset.fileIndex]);
      //     });
      //     newDiv.appendChild(newButton);
      //     document.getElementById('root').appendChild(newDiv);
      //     // Updating files[]:
      //     files.push(fileObject);
      //   }
      //   console.log(files);
      // };
      // xhr.send();
      // Returns the secret key:
      console.log(`Secret key: ${window.location.hash.slice(1)}`);
      // Importing key:
      const key = window.crypto.subtle.importKey(
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
      );
      // .then((key) => {
      //   window.crypto.subtle.decrypt(
      //     {
      //       name: "AES-GCM",
      //       iv: ArrayBuffer(12), //The initialization vector you used to encrypt
      //       additionalData: ArrayBuffer, //The addtionalData you used to encrypt (if any)
      //       tagLength: 128, //The tagLength you used to encrypt (if any)
      //     },
      //     key, //from generateKey or importKey above
      //     data //ArrayBuffer of the data
      //   )
      //   .then(function(decrypted){
      //     //returns an ArrayBuffer containing the decrypted data
      //     console.log(new Uint8Array(decrypted));
      //   })
      //   .catch(function(err){
      //     console.error(err);
      //   });
      // })
      // .catch((err) => {
      //   console.error(err);
      // });
    }
  };
  document.getElementById('encrypt-files').addEventListener('change', handleEncryptFiles, false);
  document.getElementById('decrypt-file').addEventListener('change', handleDecryptFile, false);
}

window.onload = myApp;
