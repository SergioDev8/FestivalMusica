/** src; para identificar un archivo
 * dest; para guardar el archivo
 */
const { src, dest, watch } = require("gulp");  // Extraemos la funcionalidad de gulp a nuestra variable
//importamos sass
const sass = require("gulp-sass")(require('sass'));
// Importamo plumber
const plumber = require('gulp-plumber');

function css( done ) {

    src('src/scss/**/*.scss')      // Identificar el archivo SASS
        .pipe(plumber())           // Para evitar detenciones en la compilación por errores de escritura
        .pipe( sass())            //Compilar el archivo SASS
        .pipe(dest("build/css")); //Almacenarla en el disco duro en binario 

    done(); // Callback que avisa a gulp cuando llegamos al final

}

function dev( done ) {
    watch('src/scss/**/*.scss', css); //** **/*.SCSS; para que observe los cambios de todos los archivos dentro de la carpeta scss */
    done();
}

exports.css = css;
exports.dev = dev;