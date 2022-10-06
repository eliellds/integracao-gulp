const { series, parallel, src, dest } = require('gulp')
const del = require('del')
const browserify = require('browserify')
const source = require('vinyl-source-stream')
const tsify = require('tsify')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')

// limpa e exclui o diretório a cada build
function limparDist() {
    return del(['dist'])
}

// copia arquivos da pasta public para a pasta de destino
function copiarHTML(cb) {
    // filtro que seleciona os arquivos
    return src('public/**/*')
    // encadeia para novo filtro que joga o arquivo para a pasta de destino
    .pipe(dest('dist'))
}

function gerarJS(cb) {
    return browserify({
        basedir: '.',
        entries: ['src/main.ts'] // arquivo de entrada para encontrar os demais .ts
    })
    .plugin(tsify) // ler e interpretar o typescript e gerar o js
    .bundle()
    .pipe(source('app.js')) // arquivo gerado
    .pipe(dest('dist')) // manda para a pasta de destino
}

function gerarJSProducao() {
    return src('dist/app.js')
    .pipe(rename('app.min.js'))
    .pipe(uglify())
    .pipe(dest('dist'))
}

exports.default = series(
    limparDist,
    parallel(gerarJS, copiarHTML),
    gerarJSProducao
)