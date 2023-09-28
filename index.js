const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const fastcsv = require('fast-csv');
const NodeGeocoder = require('node-geocoder');

const options = {
    provider: 'openstreetmap',
};

const geocoder = NodeGeocoder(options);

const inputDirectory = './input';
const outputDirectory = './output';

const getAddressFromOSM = async (name) => {
    const response = await geocoder.geocode(name);
    if (response && response[0]) {
        return response[0].formattedAddress || `${response[0].streetName}, ${response[0].city}, ${response[0].country}`;
    } else {
        return null;
    }
};

const transformData = async (data) => {
    const transformed = [];
    for (const row of data) {
        let name = row[Object.keys(row)[0]];
        let address = row.Direccion;
        if (!address) {
            address = await getAddressFromOSM(name);
        }
        transformed.push({ Nombre: name, Dirección: address });
    }
    return transformed;
};

const processFile = async (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                const transformedData = await transformData(results);
                const outputPath = path.join(outputDirectory, path.basename(filePath));
                const writeStream = fs.createWriteStream(outputPath);
                fastcsv.write(transformedData, { headers: true }).pipe(writeStream);
                resolve();
            });
    });
};

(async () => {
    try {
        if (!fs.existsSync(outputDirectory)) {
            fs.mkdirSync(outputDirectory);
        }

        const files = fs.readdirSync(inputDirectory).filter(file => path.extname(file) === '.csv');
        for (const file of files) {
            const filePath = path.join(inputDirectory, file);
            await processFile(filePath);
        }

        console.log('Todos los archivos CSV han sido transformados y guardados exitosamente.');
    } catch (error) {
        console.error('Ocurrió un error:', error);
    }
})();
