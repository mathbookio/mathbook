const data = {
  'goodTerms': [
    '\\(4x\\)',
    '\\(12\\)',
    '\\(y^2\\)',
    '\\(\\frac{7}{12}\\)'
  ],
  'badTerms': [
    '\\(4 + x\\)',
    '\\(6 - k\\)',
    '\\( (6 - x)x^2\\)',
    '\\((x-2)(x+2)\\)'
  ],
  'expressions': [
    '\\(x^2 - x + 1\\)',
    '\\(xy - x + 5\\)',
    '\\(0 + 23\\)'
  ],
  '#expression1': [
    '$$4x + 12 + y^2 - \\frac{7}{12}$$'
  ],
  '#expression2': [
    '$$5 + 4\\times 2^3 - 1$$'
  ],
  '#solveExpression2': [
    '\\begin{align}',
    '5 + 4\\times 2^3 - 1 &= 5 + 4\\times 8 - 1 &&\\text{Exponent}\\\\',
    '&= 5 + 32 - 1 &&\\text{Multiplication}\\\\',
    '&= 37 - 1 &&\\text{Addition}\\\\',
    '&= 36 &&\\text{$\\square$}\\\\',
    '\\end{align}'
  ],
  '#expression3': [
    '\\begin{align}',
    'x^2 - 5x + 8 &&\\text{at $x = 3$}\\\\',
    '\\end{align}'
  ],
  '#solveExpression3': [
    '\\begin{align}',
    'x^2 - 5x + 8 &= (3)^2 - 5(3) + 8 &&\\text{substitute in 3 wherever you see $x$}\\\\',
    '&= 3^2 - 5 \\times 3 + 8 &&\\text{apply BEDMAS}\\\\',
    '&= 9 - 5 \\times 3 + 8 &&\\text{Exponent}\\\\',
    '&= 9 - 15 + 8 &&\\text{Multiplication}\\\\',
    '&= -6 + 8 &&\\text{Subtraction}\\\\',
    '&= 2 &&\\text{$\\square$}\\\\',
    '\\end{align}'
  ]
}

for (let key in data) {
  if (key.includes('#')) {
    const newKey = key.replace('#', '')
    data[newKey] = data[key].join('')
    delete data[key]
  }
}

module.exports = data
