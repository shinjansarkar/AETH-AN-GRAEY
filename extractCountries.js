const fs = require('fs');
const topojson = require('topojson-client');
const world = require('world-atlas/countries-110m.json');
const d3 = require('d3-geo');

const projection = d3.geoMercator()
    .scale(280) // Larger scale for more detailed view
    .translate([400, 360]); // Translate to center Eurasia roughly

const pathGenerator = d3.geoPath().projection(projection);

const countries = topojson.feature(world, world.objects.countries).features;

const allowed = [
    "India", "France", "Spain", "Germany", "Poland", "Italy", "United Kingdom",
    "Ireland", "Portugal", "Ukraine", "Romania", "Belarus", "Greece",
    "Bulgaria", "Iceland", "Hungary", "Austria", "Czechia", "Serbia",
    "Switzerland", "Netherlands", "Belgium", "Moldova", "Croatia",
    "Bosnia and Herz.", "Albania", "Lithuania", "N. Macedonia", "Slovenia",
    "Latvia", "Estonia", "Montenegro", "Luxembourg", "Andorra", "Malta",
    "Liechtenstein", "San Marino", "Monaco", "Slovakia", "Denmark",
    "Norway", "Sweden", "Finland"
];

const filtered = countries.filter(c => {
    return allowed.includes(c.properties.name);
});

const featureCollection = {
    type: "FeatureCollection",
    features: filtered
};

const svgPath = pathGenerator(featureCollection);
fs.writeFileSync('src/components/mapPath.ts', `export const worldLandPath = "${svgPath}";`);
console.log("Written filtered map path.");
