const data = [
  {
    'question': [
      'y - x - 9 = 0'
    ],
    '#answer': [
      '\\begin{align}',
      "y - x - 9 &= 0 &&\\text{let's move $x$ to the right side}\\\\",
      'y - x - 9 + x &= 0 + x &&\\text{ $+ x$ to both sides}\\\\',
      'y - \\cancel{x} - 9 + \\cancel{x} &= x \\\\',
      "y - 9 &= x &&\\text{let's move $9$ to the right side}\\\\",
      'y - 9 + 9 &= x + 9 &&\\text{$+ 9$ to both sides}\\\\',
      'y - \\cancel{9} + \\cancel{9} &= x + 9\\\\',
      'y &= x + 9 &&\\text{$\\square$}\\\\',
      '\\end{align}'
    ]
  },
  {
    'question': [
      'y + 5x = 3x'
    ],
    '#answer': [
      '\\begin{align}',
      "y + 5x &= 3x &&\\text{let's move $5x$ to the right side}\\\\",
      'y + 5x - 5x &= 3x - 5x &&\\text{$- 5x$ to both sides}\\\\',
      'y + \\cancel{5x} - \\cancel{5x} &= -2x\\\\',
      'y &= -2x &&\\text{$\\square$}\\\\',
      '\\end{align}'
    ]
  },
  {
    'question': [
      '4x^2 - 3x - 2y = 0'
    ],
    '#answer': [
      '\\begin{align}',
      "4x^2 - 3x - 2y &= 0 &&\\text{let's move $2y$ to the right side}\\\\",
      '4x^2 - 3x - 2y + 2y &= 0 + 2y &&\\text{$+ 2y$ to both sides}\\\\',
      '4x^2 - 3x - \\cancel{2y} + \\cancel{2y} &= 2y \\\\',
      "4x^2 - 3x &= 2y &&\\text{let's move 2 back to the left side} \\\\",
      '\\frac{4x^2 - 3x}{2} &= \\frac{2y}{2} &&\\text{divide both sides by 2}\\\\',
      '\\frac{4x^2 - 3x}{2} &= \\frac{\\cancel{2}y}{\\cancel{2}}\\\\',
      '\\frac{4x^2 - 3x}{2} &= y &&\\text{$\\square$}\\\\',
      '\\end{align}'
    ]
  },
  {
    'question': [
      '\\sqrt{\\mathstrut y - 5x} = 3'
    ],
    '#answer': [
      '\\begin{align}',
      "\\sqrt{\\mathstrut y - 5x} &= 3 &&\\text{let's move the $\\sqrt{\\space}$ to the right side}\\\\",
      '(\\sqrt{\\mathstrut y - 5x})^2 &= (3)^2  &&\\text{$^2$ both sides}\\\\',
      '(\\sqrt{\\mathstrut y - 5x})^2 &= 9 &&\\text{$\\sqrt{\\space}$ and $^2$ negate each other}\\\\',
      "y - 5x &= 9 &&\\text{let's move the $5x$ to the right side}\\\\",
      'y - 5x + 5x &= 9 + 5x &&\\text{$+ 5x$ to both sides}\\\\',
      'y - \\cancel{5x} + \\cancel{5x} &= 9 + 5x \\\\',
      'y &= 9 + 5x &&\\text{$\\square$}\\\\',
      '\\end{align}'
    ]
  }
]

const formatter = require('../formatter')
module.exports = formatter(data)
