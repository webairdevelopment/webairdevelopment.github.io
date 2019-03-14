document.addEventListener("DOMContentLoaded", function () {

    var printer = document.querySelector('.printer'),
    printBtn = document.querySelector('.print-btn'),
    dogImage = document.querySelector('.dog-image'),
    lightbox = document.querySelector('.lightbox'),
    lightboxImage = document.querySelector('.lightbox-image');

    var printing = false;

    //Fetch dog image
    fetch('https://dog.ceo/api/breeds/image/random').
    then(function (res) {return res.json();}).
    then(function (data) {
        var dogURL = data.message;
        dogImage.src = dogURL;
        lightboxImage.src = dogURL;
    });

    printBtn.addEventListener('click', function () {
        if (!printing) printer.classList.add('printing');
    });

    dogImage.addEventListener('click', function () {return lightbox.classList.add('show');});

    lightbox.addEventListener('click', function () {return lightbox.classList.remove('show');});

    lightboxImage.addEventListener('click', function (e) {return e.stopPropagation();});

    //CodePen preview window
    if (location.pathname.includes('fullcpgrid')) printer.classList.add('printing');

});