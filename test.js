const uc = require('./index')

for (const reference of require('./test.json')) {
  console.log(uc(reference))
}
console.log(uc('Heyns', 'https://doi.org/10.1109/5.771073', 1970))
console.log(uc('Heyns', null, 1970, 'BBT'))
