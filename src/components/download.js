const url =
  "https://hsld19.debatecoaches.org/download/Crossings%20School/Hanna%20Neg/Crossings%20School-Hanna-Neg-JW%20Patterson-Round2.docx?rev=1.1";
let dtype = url.slice(8).split(".")[0];
if (dtype.slice(0, -2) === "opencaselist") {
  dtype = "ndtceda" + dtype.slice(-2);
}
const school = url.split("/")[4].replace("%20", "");
let debater = url.split("/")[5];
if (debater.lastIndexOf("-") > 0) {
  debater =
    debater.slice(0, 2) +
    debater.slice(debater.lastIndexOf("-") + 1, debater.lastIndexOf("-") + 3);
} else if (dtype !== "openev") {
  debater = debater.slice(0, 2);
}

let round = url.split("/")[6].split("?")[0];
if (dtype !== "openev") {
  round = round.replaceAll("%20", "%2520");
  console.log(round);
}
console.log(
  "https://api.opencaselist.com/v1/download?path=" +
    dtype +
    "%2F" +
    school +
    "%2F" +
    debater +
    "%2F" +
    round
);
