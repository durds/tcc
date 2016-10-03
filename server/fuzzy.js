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


const U_A =   [0,25,50,75,100,125,150,175,200,225,250] // Universo dos valores de Ação(pwm)
const VL_A = [[1.0,0.9,0.8,0.6,0.2,0.0,0.0,0.0,0.0,0.0,0.0], //baixo
              [0.0,0.1,0.2,0.2,0.4,0.3,0.1,0.0,0.0,0.0,0.0], //medio baixo
              [0.0,0.0,0.1,0.1,0.2,0.4,0.4,0.5,0.4,0.2,0.0], // medio
              [0.0,0.0,0.0,0.0,0.0,0.1,0.3,0.4,0.6,0.7,0.8], // medio alto
              [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.1,0.3,0.5,1.0]] //4 alto

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


const INFERENCES = {"004":[0.2,0.2,0.2,0.2,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
                    "104":[0.2,0.2,0.2,0.2,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
                    "204":[0.1,0.1,0.1,0.1,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
                    "302":[0.2,0.2,0.2,0.2,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
                    "400":[0.3,0.3,0.3,0.2,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
                    "500":[0.5,0.5,0.5,0.2,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
                    "600":[1.0,0.8,0.6,0.2,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
                    "013":[0.0,0.0,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.0,0.0],
                    "113":[0.0,0.0,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.0,0.0],
                    "212":[0.0,0.0,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.0,0.0],
                    "312":[0.0,0.0,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.0,0.0],
                    "412":[0.0,0.0,0.2,0.3,0.3,0.3,0.3,0.3,0.2,0.0,0.0],
                    "511":[0.0,0.0,0.2,0.4,0.4,0.4,0.4,0.4,0.2,0.0,0.0],
                    "610":[0.0,0.0,0.2,0.4,0.6,1.0,0.8,0.4,0.2,0.0,0.0],
                    "024":[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.2,0.2,0.2,0.2],
                    "124":[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.2,0.2,0.2,0.2],
                    "223":[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.1,0.1,0.1,0.1],
                    "322":[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.2,0.2,0.2,0.2],
                    "421":[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.2,0.3,0.3,0.3],
                    "520":[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.2,0.5,0.5,0.5],
                    "620":[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.2,0.6,0.8,1.0]}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////Fuzificação////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//Achar qual dos valores do universo o valor medido de luminosidade faz parte
var firstTime = true

//fuzifica a entrada que veio do sensor
function lum_f(lum_m) {
  var medida_aprox = 100*math.floor((lum_m+50)/100)
  console.log("Medida aprox " + medida_aprox)
  var posicao_lum = U_L.indexOf(medida_aprox)

  var lum_fuzzy = VL_L.map(function(value, index) { return value[posicao_lum]})

  return lum_fuzzy
}

function lum_fuzzy_sig(lum_fuzzy) {
  return functions.get_sig(lum_fuzzy)
}

//fuzzifica a variação da leitura atual com a anterior
function vari(lum_m) {
  var variacao = 0
  console.log("firstTime: " + firstTime)
  if(firstTime) {
      lum_medida_anterior = 0
      variacao = lum_m - lum_medida_anterior
      lum_medida_anterior = lum_m
      firstTime = false
  } else {
      variacao = lum_m - lum_medida_anterior
      lum_medida_anterior = lum_m
  }

  var variacao_aprox = 2*math.floor((variacao+1)/2)
  if(variacao_aprox < -10) variacao_aprox = -10
  if(variacao_aprox > 10) variacao_aprox = 10
  console.log("aprox Variation: " + variacao_aprox)
  var posicao_variacao = U_V.indexOf(variacao_aprox)

  var variacao_fuzzy = VL_V.map(function(value, index) { return value[posicao_variacao]})

  return variacao_fuzzy
}

function variacao_fuzzy_sig(variacao_fuzzy) {
  return functions.get_sig(variacao_fuzzy)
}

// Encontrar Regras Válidas para a entrada dada
function regras_validas(lum_fuzzy_sig, variacao_fuzzy_sig) {
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

  return regras;
}

//usa as regras válidas para realizar a inferência
function inference(regras) {
  var INFERENCE_OUT = []
  for (regra in regras) {
    console.log("rule: " + regras[regra])
    var number = regras[regra].join("")

    //console.log("inference number: " + number)
    if (number in INFERENCES) {
      INFERENCE_OUT.push(INFERENCES[number])
    }
  }

  return INFERENCE_OUT
}

function fuzz_out(inference_out) {
  return math.max(inference_out,0)
}

//defuzifica os valores fuzzy para um pwm válido
function deffuz(fuzzy_out) {

  var soma = 0;
  var n = 0;
  for(var i = 0; i < fuzzy_out.length; i++) {
      soma = soma + fuzzy_out[i]*U_A[i]
      n = n + fuzzy_out[i]
  }
  //console.log(soma)
  //console.log(n)
  // return result

  return soma/n
}

//
// //pipelien do controlador debbug
// exports.run = function(val) {
//   console.log("Initial Value: " + val)
//   //fuzificação
//   var lum_fuzzy = lum_f(val)
//   console.log("Fuzzified Value: " + lum_fuzzy)
//   var lum_sig = lum_fuzzy_sig(lum_fuzzy)
//   console.log("Non zero Values: " + lum_sig)
//   var vari_fuzzy = vari(val)
//   console.log("Variation Fuzzified: " + vari_fuzzy)
//   var variacao_sig = variacao_fuzzy_sig(vari_fuzzy)
//   console.log("Non Zero values:" + variacao_sig)
//   //regras válidas
//   var regras = regras_validas(lum_sig, variacao_sig)
//   console.log("Valid Rules: " + regras)
//   //inferencia
//
//   var inference_out = inference(regras)
//   console.log("Inference: " + inference_out)
//   var fuzzy_o = fuzz_out(inference_out)
//   console.log("Fuzzy out: " + fuzzy_o)
//   //defuzificação
//
//   var result = deffuz(fuzzy_o)
//   console.log("Deffuzified: " + result);
//   return result
// }



// pipelien do controlador production
exports.run = function(val) {

  //fuzificação
  var lum_fuzzy = lum_f(val)

  var lum_sig = lum_fuzzy_sig(lum_fuzzy)

  var vari_fuzzy = vari(val)

  var variacao_sig = variacao_fuzzy_sig(vari_fuzzy)

  //regras válidas
  var regras = regras_validas(lum_sig, variacao_sig)

  //inferencia

  var inference_out = inference(regras)

  var fuzzy_o = fuzz_out(inference_out)

  //defuzificação

  var result = deffuz(fuzzy_o)

  return result
}
