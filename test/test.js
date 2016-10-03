var fuzzy = require('../server/fuzzy.js')



var valor = [920,830,828,822,270,120,137,480]

for(v in valor) {
  var result = fuzzy.run(valor[v])

  console.log("PWM: " + result)
  console.log("")
}
