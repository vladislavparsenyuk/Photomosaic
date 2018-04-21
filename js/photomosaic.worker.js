onmessage = function (e) {
    postMessage(calculate(e.data));
}

function calculate(data) {
    const { width, height, tileWidth, tileHeight, imageData } = data;
    const rows = Math.floor(height / tileHeight);
    const cols = Math.floor(width / tileWidth);
    const result = [];

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let y = i * tileHeight;
            let x = j * tileWidth;
            let pixelInterval = 4; // Based on imageData structure
            let pixelEvery = 5; // Inspect every 5th pixel
            let pixels = 0;
            let tile = { x, y, r: 0, g: 0, b: 0, a: 0 };

            for (let k = 0; k < tileHeight; k++) {
                let yPos = (y + k) * pixelInterval * width;

                for (let m = 0; m < tileWidth; m += pixelEvery) {
                    let xPos = (x + m) * pixelInterval;
                    pixels++;
                    tile.r += imageData[yPos + xPos + 0];
                    tile.g += imageData[yPos + xPos + 1];
                    tile.b += imageData[yPos + xPos + 2];
                    tile.a += imageData[yPos + xPos + 3];
                }
            }
            
            // floor the average values to give correct rgba values
            tile.r = Math.floor(tile.r / pixels);
            tile.g = Math.floor(tile.g / pixels);
            tile.b = Math.floor(tile.b / pixels);
            tile.a = Math.floor(tile.a / pixels);

            result.push(tile);
        }
    }

    return result;
}