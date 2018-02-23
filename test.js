const uc = require('./index')

for (const reference of require('./test.json')) {
  console.log(uc(reference))
}
console.log(uc('Heyns', 'BBT', 1970))
