var math = require('mathjs')
var functions = require('./aux_func.js')

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////Base de dados ////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const U_L =   [0,  100,  200,  300,  400,  500,  600,  700,  800,  900,  1000] // Universo dos valores de Luminosidade
const VL_L = [[1,  0.2,    0,    0,    0,    0,    0,    0,    0,    0,     0], //0 baixa
              [0,  0.8,  0.2,    0,    0,    0,    0,    0,    0,    0,     0], //1 baixa media
              [0,    0,  0.4,  0.8,  0.1,    0,    0,    0,    0,    0,     0], //2 baixa alta
              [0,    0,    0,    0,  0.6,    1,  0.2,    0,    0,    0,     0], //3 media
              [0,    0,    0,    0,    0,    0,  0.4,    0,  0.3,    0,     0], //4 alta baixa
              [0,    0,    0,    0,    0,    0,    0,  0.8,  0.5,  0.8,     0], //5 alta media
              [0,    0,    0,    0,    0,    0,    0,    0,    0,    0,     1]] //6 alta


const U_V =   [-10,   -8,   -6,   -4,   -2,   0,   2,   4,   6,   8,   10] // Universo dos valores de Variação da Luminosidade
const VL_V = [[1,    0.8,  0.6,  0.4,  0.2,   0,   0,   0,   0,   0,    0], //0 alta p baixo
              [0,      0,    0,  0.2,  0.6,   1, 0.8, 0.4, 0.2,   0,    0], //1 baixa
              [0,      0,    0,    0,    0,   0,   0, 0.2, 0.6, 0.8,    1]] //2 alta p cima


const U_A =   [0,     31,   63,   95,  127, 159, 191, 223, 255] // Universo dos valores de Ação(pwm)
const VL_A = [[1,      0,    0,    0,    0,   0,   0,   0,   0], //0 baixo
              [0,    0.2,  0.4,  0.6,  0.3,   0,   0,   0,   0], //1 medio baixo
              [0,      0,    0,  0.3,    1, 0.5,   0,   0,   0], //2 medio
              [0,      0,    0,    0,    0, 0.2, 0.5, 0.8,   0], //3 medio alto
              [0,      0,    0,    0,    0,   0,   0,   0,   1]] //4 alto

//Base de Regras
const BR = [[0, 0, 4],
            [1, 0, 4],
            [2, 0, 4],
            [3, 0, 2],
            [4, 0, 0],
            [5, 0, 0],
            [6, 0, 0],

            [0, 1, 3],
            [1, 1, 3],
            [2, 1, 2],
            [3, 1, 2],
            [4, 1, 2],
            [5, 1, 1],
            [6, 1, 0],

            [0, 2, 4],
            [1, 2, 4],
            [2, 2, 3],
            [3, 2, 2],
            [4, 2, 1],
            [5, 2, 0],
            [6, 2, 0]]


const INFERENCES = {004: [ 0.2,    0.2,  0.2,   0.2,  0.2,    0,    0,     0,    0,    0,    0],
                    104: [ 0.2,    0.2,  0.2,   0.2,  0.2,    0,    0,     0,    0,    0,    0],
                    204: [ 0.1,    0.1,  0.1,   0.1,  0.1,    0,    0,     0,    0,    0,    0],
                    302: [ 0.2,    0.2,  0.2,   0.2,  0.2,    0,    0,     0,    0,    0,    0],
                    400: [ 0.3,    0.3,  0.3,   0.3,  0.2,    0,    0,     0,    0,    0,    0],
                    500: [ 0.5,    0.5,  0.5,   0.4,  0.2,    0,    0,     0,    0,    0,    0],
                    600: [   1,    0.8,  0.6,   0.4,  0.2,    0,    0,     0,    0,    0,    0],
                    013: [   0,      0,    0,   0.2,  0.2,  0.2,  0.2,   0.2,  0.2,    0,    0],
                    113: [   0,      0,    0,   0.2,  0.2,  0.2,  0.2,   0.2,  0.2,    0,    0],
                    212: [   0,      0,    0,   0.1,  0.1,  0.1,  0.1,   0.1,  0.1,    0,    0],
                    312: [   0,      0,    0,   0.2,  0.2,  0.2,  0.2,   0.2,  0.2,    0,    0],
                    412: [   0,      0,    0,   0.2,  0.3,  0.3,  0.3,   0.3,  0.2,    0,    0],
                    511: [   0,      0,    0,   0.2,  0.5,  0.5,  0.5,   0.4,  0.2,    0,    0],
                    610: [   0,      0,    0,   0.2,  0.6,    1,  0.8,   0.4,  0.2,    0,    0],
                    024: [   0,      0,    0,     0,    0,    0,    0,   0.2,  0.2,  0.2,  0.2],
                    124: [   0,      0,    0,     0,    0,    0,    0,   0.2,  0.2,  0.2,  0.2],
                    223: [   0,      0,    0,     0,    0,    0,    0,   0.1,  0.1,  0.1,  0.1],
                    322: [   0,      0,    0,     0,    0,    0,    0,   0.2,  0.2,  0.2,  0.2],
                    421: [   0,      0,    0,     0,    0,    0,    0,   0.2,  0.3,  0.3,  0.3],
                    520: [   0,      0,    0,     0,    0,    0,    0,   0.2,  0.5,  0.5,  0.5],
                    620: [   0,      0,    0,     0,    0,    0,    0,   0.2,  0.6,  0.8,    1]}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////Fuzificação////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//Achar qual dos valores do universo o valor medido de luminosidade faz parte

var Lum_medida = 800

var medida_aprox = 100*math.floor((Lum_medida+50)/100)
var posicao_lum = U_L.indexOf(medida_aprox)

var lum_fuzzy = VL_L.map(function(value, index) { return value[posicao_lum]})
console.log(posicao_lum)
console.log(lum_fuzzy)

var lum_fuzzy_sig = functions.get_sig(lum_fuzzy)
console.log(lum_fuzzy_sig);

//Achar qual dos valores do universo o valor da variação da mediada faz parte

var lum_medida_atual = 803

var variacao = lum_medida_atual - Lum_medida

var variacao_aprox = 2*math.floor(variacao/2)

var posicao_variacao = U_V.indexOf(variacao_aprox)

console.log(posicao_variacao)

var variacao_fuzzy = VL_V.map(function(value, index) { return value[posicao_variacao]})

console.log(variacao_fuzzy)

var variacao_fuzzy_sig = functions.get_sig(variacao_fuzzy)

console.log(variacao_fuzzy_sig)

// Encontrar Regras Válidas

var regras = []

for(var i = 0; i < lum_fuzzy_sig.length; i++) {
    for (var j = 0; j < variacao_fuzzy_sig.length; j++) {
        var LV = [lum_fuzzy_sig[i], variacao_fuzzy_sig[j]]

        for(var k = 0; k < BR.length; k++) {
            var br = [BR[k][0], BR[k][1], BR[k][2]]

            if(LV[0] == br[0] && LV[1] == br[1]) {
                regras.push([LV[0], LV[1], br[2] ])
            }
        }
    }
}

var INFERENCE_OUT = []
for (regra in regras) {
  var number = parseInt(regras[regra].join(""))
  console.log(number)
  if (number in INFERENCES) {
    INFERENCE_OUT.push(INFERENCES[number])
  }
}

var FUZZY_OUT = math.max(INFERENCE_OUT,0)
console.log(INFERENCE_OUT)
console.log(FUZZY_OUT)
