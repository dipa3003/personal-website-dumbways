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

  console.log(user);

  const a = document.createElement("a");
  a.href = `mailto:${user.inputEmail}?subject=${user.inputSubject}&body=${user.inputMessage}`;
  a.click();
}
