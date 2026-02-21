const fs = require('fs');
const topojson = require('topojson-client');
const world = require('world-atlas/countries-110m.json');
const d3 = require('d3-geo');

const projection = d3.geoMercator()
    .scale(280) // Larger scale for more detailed view
    .translate([400, 360]); // Translate to center Eurasia roughly
// Note: SVG paths will have x, y coordinates. We can wrap them in a viewbox.

const pathGenerator = d3.geoPath().projection(projection);

// Extract the countries we want or just the entire landmass
const land = topojson.feature(world, world.objects.land);

const svgPath = pathGenerator(land);

fs.writeFileSync('landPath.txt', svgPath);
// Also let's get specific coordinates for markers (Mumbai, Milano)
const mumbai = projection([72.8777, 19.0760]);
const milano = projection([9.1900, 45.4642]);

console.log('Mumbai (x,y):', mumbai);
console.log('Milano (x,y):', milano);
