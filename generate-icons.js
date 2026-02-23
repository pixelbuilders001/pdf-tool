const fs = require('fs');
const path = require('path');

// Simple 1x1 Blue PNG Base64 as a base if needed, but we'll try to just write the files
const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// 192x192 Blue PNG Base64 (Transparent-ish/Solid Blue)
const icon192 = "iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAMAAABlS6LIAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABhQTFRFAAAALm9v////Z2dnR0dH////AAAAAAAAAAAAo8itLAAAAAd0Uk5T////////AFv96fQAAACPSURBVHja7NExDgAhDMNAs///ZxZGGpC4S9Vd3MREm0OAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPDpL8AAXF0At4C3XQ8AAAAASUVORK5CYII=";

// 512x512 Blue PNG Base64
const icon512 = "iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAMAAADD7hL7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABhQTFRFAAAALm9v////Z2dnR0dH////AAAAAAAAAAAAo8itLAAAAAd0Uk5T////////AFv96fQAAADKSURBVHja7NExDgAhDMNAs///ZxZGGpC4S9Vd3MREm0OAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPDpL8AAas0At7p8n70AAAAASUVORK5CYII=";

fs.writeFileSync(path.join(iconsDir, 'icon-192x192.png'), Buffer.from(icon192, 'base64'));
fs.writeFileSync(path.join(iconsDir, 'icon-512x512.png'), Buffer.from(icon512, 'base64'));

console.log('Icons generated successfully!');
