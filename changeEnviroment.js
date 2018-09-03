console.log('changing env');
const fs = require('fs');
let config = null;
let enviroment = process.argv[2];
try {
    let configFile = fs.readFileSync('./config/enviroment.json');
    config = JSON.parse(configFile)
} catch (error) {
   throw new Error(`Hubo un error al cambiar el enviroment ver detalle ${error}`)
}
if (!enviroment) {
    throw new Error(`Por Favor especificar enviroment: prod o dev`)
} else if (enviroment === 'prod') {
    config.currentEnviroment = 'CORE-PRODUCTION'
    fs.writeFileSync('./config/enviroment.json', JSON.stringify(config));
    console.log('Enviroment cambiado con exito a produccion ****MAPAS MENTALES***!!!');
} else if (enviroment === 'dev') {
    config.currentEnviroment = 'CORE-DEVELOPMENT';
    fs.writeFileSync('./config/enviroment.json', JSON.stringify(config));
    console.log('Enviroment cambiado con exito a desarrollo ****MAPAS MENTALES***!!!');
}
