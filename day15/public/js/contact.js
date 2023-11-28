function dataForm() {
  const inputName = document.querySelector("#inputName").value;
  const inputEmail = document.querySelector("#inputEmail").value;
  const inputPhone = document.querySelector("#inputPhone").value;
  const inputSubject = document.querySelector("#inputSubject").value;
  const inputMessage = document.querySelector("#inputMessage").value;

  const user = {
    inputName,
    inputEmail,
    inputPhone,
    inputSubject,
    inputMessage,
  };

  if (!user.inputName) {
    alert("Field Nama harus diisi!");
  } else if (!user.inputEmail) {
    alert("Field Email harus diisi!");
  } else if (!user.inputPhone) {
    alert("Field Phone Number harus diisi");
  } else if (!user.inputSubject) {
    alert("Field Subject harus dipilih!");
  } else if (!user.inputMessage) {
    alert("Field Message harus diisi!");
  } else {
    console.log(user);

    const a = document.createElement("a");
    a.href = `mailto:${user.inputEmail}?subject=${user.inputSubject}&body=${user.inputMessage}`;
    a.click();
  }
}
