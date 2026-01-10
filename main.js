document.addEventListener("DOMContentLoaded", () => {

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
        opacity: 0;
        transition: opacity 1.5s ease;
    `;

    const image = document.createElement("img");
    image.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOPmXKmtdnJoAEiPUq5_UPxJbuRcatI2GCWQ&s"; // replace with your image URL
    image.alt = "Center Image";
    image.style.cssText = `
        width: 300px;
        max-width: 80%;
        opacity: 0;
        transition: opacity 1.5s ease;
    `;

    const footerText = document.createElement("div");
    footerText.innerText = "[Info : Ami jani ami AHONKARI noi but, Eisob jaygai amar OVIMAN ektu Besi beriye ase ! I know i am not the best, but I am trying to do my best!]";
    footerText.style.cssText = `
        margin-bottom: 30px;
        font-size: 16px;
        color: #aaa;
        text-align: center;
        opacity: 0;
        transition: opacity 1.5s ease;
    `;
    document.body.innerHTML= "";

 
    document.body.appendChild(topText);
    document.body.appendChild(image);
    document.body.appendChild(footerText);

    setTimeout(() => {
        topText.style.opacity = "1";
        image.style.opacity = "1";
        footerText.style.opacity = "1";
    }, 100);
});
