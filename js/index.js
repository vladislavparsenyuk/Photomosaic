; (function () { 
    'use strict';

    var fileInput = document.getElementById('file-input');
    var numberInput = document.getElementById('number-input');
    var numberOutput = document.getElementById('number-output');
    var canvas = document.getElementById('output');
    var mosaic = new Photomosaic({
        tileWidth: numberInput.value,
        tileHeight: numberInput.value,
        canvas: canvas,
    });

    fileInput.addEventListener('change', e => {
        var file = fileInput.files[0];

        if (!file || !/^image/.test(file.type)) {
            alert('Please select image');
            return;
        }

        readFile(file).then(dataUrl => {
            var img = document.createElement('img');
            img.onload = () => {
                mosaic.setOptions({ image: img });
                mosaic.render();
            }
            img.src = dataUrl;
        });
    });

    numberInput.addEventListener('input', e => {
        numberOutput.innerText = numberInput.value;
        mosaic.setOptions({
            tileWidth: numberInput.value,
            tileHeight: numberInput.value,
        });
        mosaic.render();
    });

    function readFile(file) {
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
    }

})();