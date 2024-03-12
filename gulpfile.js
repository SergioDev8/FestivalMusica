/** src; para identificar un archivo
 * dest; para guardar el archivo
 */
const { src, dest, watch, parallel } = require("gulp");  // Extraemos la funcionalidad de gulp a nuestra variable
/** CSS */
//importamos sass
const sass = require("gulp-sass")(require('sass'));
// Importamos plumber
const plumber = require('gulp-plumber');
//para que funcione en distintos navegadores nuestro código css
const autoprefixer = require('autoprefixer');
// para comprimir el código css
const cssnano = require('cssnano');
// para transformaciones del código con ayuda de autoprefixer y cssnano
const postcss = require('gulp-postcss'); 
// para mapear la ubicación del código css de un elemento
const sourcemaps = require('gulp-sourcemaps') ;

//Imagenes
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');  // conversor de imagenes
const avif = require('gulp-avif');

//JavaScript
const terser = require('gulp-terser-js');

function css( done ) {

    src('src/scss/**/*.scss')      // Identificar el archivo SASS
        .pipe(sourcemaps.init())    //para iniciar el sourcemaps y que tenga la ubicación de la hoja de estilo de referencia 
        .pipe(plumber())           // Para evitar detenciones en la compilación por errores de escritura
        .pipe( sass())            //Compilar el archivo SASS
        .pipe( postcss([autoprefixer(), cssnano()]))  // comprimimos el código css
        .pipe(sourcemaps.write('.'))    // crea un archivo de mapeo en la misma ubicación (representada por '.') que el navegador es capaz de interpretar (muestra la ubicación del código original, no el compilado y comprimido), ésta herramienta tiene fallas, no siempre dará la ubicación exácta. Buscar por selector en dado caso
        .pipe(dest("build/css")); //Almacenarla en el disco duro en binario 

    done(); // Callback que avisa a gulp cuando llegamos al final

}

function imagenes( done ) {
    const opciones = {
        optimizationLevel: 3   // necesita ser un objeto con ese nombre ya que lo buscará la dependencia caché para su configuración
    }

    src('src/img/**/*.{png,PNG,jpg,JPG}')
        .pipe(cache( imagemin(opciones)))
        .pipe( dest('build/img'))

    done();
}

async function versionWebp(done) {
     
    const webp = await import("gulp-webp"); // para convertir imagenes a webp
 
    const opciones = {
        quality: 50 // Esto define que tanta calidad se le bajarán a las imágenes
    }
 
    src('src/img/**/*.{png,PNG,jpg,JPG}') // Busca recursivamente en todos los archivos y carpetas de la carpeta img con los formatos especificados
        .pipe(webp.default(opciones)) // Los convierte en formato WEBP y les baja la calidad especificada
        .pipe(dest('build/img')) // Los guarda en una nueva carpeta
    
    done(); // Callback que avisa a gulp cuando llegamos al final de la ejecución del script
}

function versionAvif(done) {
    const opciones = {
        quality: 50 
    }
    src('src/img/**/*.{png,jpg}') 
        .pipe(avif(opciones)) 
        .pipe(dest('build/img')) 
    
    done(); 
}

function javascript( done ) {
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())  //misma descripcion que en css arriba
        .pipe(terser())  // comprime el código js en el destino indicado a continuación
        .pipe(sourcemaps.write('.'))  // al mapear nuestros archivos .js el navegador reconocerá el archivo mapeado y podemos buscar la línea donde se ejecuta esa función, accedemos en el navegador; inspeccionar>depurador>fuentes>puntos de quiebre del detector de eventos>y habilitamos la opción de click, luego pinchamos donde queremos inspeccionar en nuestra página web y nos mostrará el código .js y la linea en que se está ejecutando (mozila dev edition me pidió habilitar mostrar nombres originales y lo habilité porque no me mostraba el código original)
        .pipe(dest('build/js')); // para compilar archivos .js (solo toma el original y lo guarda en el destino indicado)

    done();
}

function dev( done ) {
    watch('src/scss/**/*.scss', css); //** **/*.SCSS; para que observe los cambios de todos los archivos dentro de la carpeta scss y luego ejecuta la función css para compilar sass a css binario*/
    watch('src/js/**/*.js', javascript); //cuando watch detecta cambios en esta carpeta, ejecutala funcion "javascript" 
    done();
}

exports.css = css;  // compilar sass a css
exports.js = javascript;
exports.imagenes = imagenes;  // para reducir el peso a las imágenes manteniendo el formato
exports.versionWebp = versionWebp; // para convertir imagenes a . webp
exports.versionAvif = versionAvif; // para convertir imagenes a . webp
exports.dev =  parallel(imagenes, versionWebp, versionAvif, javascript, dev); // nos ejecuta las funciones una tras otra

/** PARA EJECUTAR CUALQUIER HERRAMIENTA (FUNCIONES) SE DEBE EJECUTAR EN LA LÍNEA DE COMANDO CMD DE LA SIGUIENTE MANERA;
 * 
 * npx gulp +nombreDeLaFuncionExports
 * 
 */