function addMessage() {
  const name = document.getElementById("name").value || "User";
  const text = document.getElementById("text").value;

  if (text.trim() === "") return;

  const chat = document.getElementById("chat");
  const msg = document.createElement("div");
  msg.className = "message";
  msg.innerHTML = "<strong>" + name + ":</strong> " + text;

  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;

  document.getElementById("text").value = "";
}

