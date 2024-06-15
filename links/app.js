const container = document.querySelector('.links-container');

container.addEventListener('click', function(event) {
    const shareButton = event.target.closest('.title-share-button');
    if (shareButton) {
        event.preventDefault(); // Verhindert das Standardverhalten des Links
        const link = shareButton.getAttribute('link');
        if (isMobileDevice()) {
            openShareMenu(link);
        } else {
            copyText(link);
        }
    }
});

async function copyText(link) {
    try {
        await navigator.clipboard.writeText(link);
        alert("Link copied to clipboard: " + link);
    } catch (err) {
        console.error(err);
    }
}

function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

function openShareMenu(link) {
    const shareMenu = document.createElement('div');
    shareMenu.classList.add('share-menu');

    const whatsappButton = createShareButton('WhatsApp', 'fab fa-whatsapp', () => {
        // Hier könnte die Logik für das Teilen über WhatsApp eingefügt werden
        alert("Sharing via WhatsApp: " + link);
    });

    const facebookButton = createShareButton('Facebook', 'fab fa-facebook', () => {
        // Hier könnte die Logik für das Teilen über Facebook eingefügt werden
        alert("Sharing via Facebook: " + link);
    });

    const twitterButton = createShareButton('Twitter', 'fab fa-twitter', () => {
        // Hier könnte die Logik für das Teilen über Twitter eingefügt werden
        alert("Sharing via Twitter: " + link);
    });

    shareMenu.appendChild(whatsappButton);
    shareMenu.appendChild(facebookButton);
    shareMenu.appendChild(twitterButton);

    // Beispiel: Anhängen des Share-Menüs an den Body
    document.body.appendChild(shareMenu);
}

function createShareButton(title, iconClass, onClick) {
    const button = document.createElement('button');
    button.classList.add('share-button');
    button.innerHTML = `<i class="${iconClass}"></i> ${title}`;
    button.addEventListener('click', onClick);
    return button;
}

function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'links.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == 200) {
            callback(JSON.parse(xobj.responseText));
        }
    };
    xobj.send(null);
}

function createLinks(links) {
    const container = document.querySelector('.links-container');

    links.forEach(link => {
        const title = document.createElement('a');
        title.classList.add('title');
        title.setAttribute('href', link.url);

        const icon = document.createElement('i');
        icon.classList.add('fab', link.icon, 'fa-2x');

        const text = document.createElement('p');
        text.textContent = link.name;

        const shareButton = document.createElement('div');
        shareButton.classList.add('title-share-button');
        shareButton.setAttribute('link', link.url);

        if (link.shareButton) {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '16');
            svg.setAttribute('height', '16');
            svg.setAttribute('viewBox', '0 0 16 16');
            svg.setAttribute('enable-background', 'new 0 0 24 24');
            svg.classList.add('sc-gKsewC', 'iPWGYb');

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('fill-rule', 'evenodd');
            path.setAttribute('clip-rule', 'evenodd');
            path.setAttribute('d', 'M10.6464 3.85347L11 4.20702L11.7071 3.49992L11.3536 3.14636L8.35355 0.146362H7.64645L4.64645 3.14636L4.29289 3.49992L5 4.20702L5.35355 3.85347L7.5 1.70702V9.49992V9.99992H8.5V9.49992V1.70702L10.6464 3.85347ZM1 5.49994L1.5 4.99994H4V5.99994H2V14.9999H14V5.99994H12V4.99994H14.5L15 5.49994V15.4999L14.5 15.9999H1.5L1 15.4999V5.49994Z');
            path.setAttribute('fill', 'currentColor');

            svg.appendChild(path);
            shareButton.appendChild(svg);
        }

        title.appendChild(icon);
        title.appendChild(text);
        title.appendChild(shareButton);
        container.appendChild(title);
    });
}

loadJSON(function(response) {
    createLinks(response);
});
