function getIP(json) {
  var ip = document.getElementById("ip")
  ip.innerHTML = "<h1>Your public IP address is: " + json.ip + "</h1>"
}