window.onload = () => {
  let form = new FormData();
  let xhr = new XMLHttpRequest();
  // let form = new FormData(document.querySelector("form"));
  xhr.open("POST", '/', true);
  // xhr.setRequestHeader('Content-Type','multipart/form-data; boundary=---------------------------28816650126250');
  // xhr.setRequestHeader('Content-Type','multipart/form-data; boundary=AaB03x');
  form.append('test', new Blob([]));
  xhr.send(form);
}
