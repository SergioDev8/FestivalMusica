/** src; para identificar un archivo
 * dest; para guardar el archivo
 */
const { src, dest, watch, parallel } = require("gulp");  // Extraemos la funcionalidad de gulp a nuestra variable
/** CSS */
//importamos sass
const sass = require("gulp-sass")(require('sass'));
// Importamos plumber
const plumber = require('gulp-plumber');

function css( done ) {

    src('src/scss/**/*.scss')      // Identificar el archivo SASS
        .pipe(plumber())           // Para evitar detenciones en la compilación por errores de escritura
        .pipe( sass())            //Compilar el archivo SASS
        .pipe(dest("build/css")); //Almacenarla en el disco duro en binario 

    done(); // Callback que avisa a gulp cuando llegamos al final

}

async function versionWebp(done) {
     
    const webp = await import("gulp-webp"); // Manda a traer la dependencia instalada con "npm install --save-dev gulp-webp" desde la terminal"
 
    const opciones = {
        quality: 50 // Esto define que tanta calidad se le bajarán a las imágenes
    }
 
    src('src/img/**/*.{png,PNG,jpg,JPG}') // Busca recursivamente en todos los archivos y carpetas de la carpeta img con los formatos especificados
        .pipe(webp.default(opciones)) // Los convierte en formato WEBP y les baja la calidad especificada
        .pipe(dest('build/img')) // Los guarda en una nueva carpeta
    
    done(); // Callback que avisa a gulp cuando llegamos al final de la ejecución del script
}

function dev( done ) {
    watch('src/scss/**/*.scss', css); //** **/*.SCSS; para que observe los cambios de todos los archivos dentro de la carpeta scss */
    done();
}

exports.css = css;
exports.versionWebp = versionWebp;
exports.dev =  parallel(versionWebp, dev); // nos ejecuta versionWebp y luego dev

