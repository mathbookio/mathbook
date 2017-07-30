const data = [
  {
    'question': [
      '4y - 44 = 0'
    ],
    '#answer': [
      '\\begin{align}',
      "4y - 44 &= 0 &&\\text{let's bring 44 over to the right side}\\\\",
      "4y &= 44 &&\\text{let's bring 4 over to the right side}\\\\",
      '\\frac{\\cancel{4}y}{\\cancel{4}} &= \\frac{44}{4}\\\\',
      'y &= 11 &&\\text{$\\square$}\\\\',
      '\\end{align}'
    ]
  },
  {
    'question': [
      '\\frac{7y}{4} + 12 = 3y'
    ],
    '#answer': [
      '\\begin{align}',
      "\\frac{7y}{4} + 12 &= 3y &&\\text{let's bring $\\frac{7y}{4}$ over to the right side }\\\\",
      '12 &= 3y - \\frac{7y}{4} &&\\text{evaluate the right side}\\\\',
      '12 &= \\frac{12y}{4} - \\frac{7y}{4}\\\\',
      "12 &= \\frac{5y}{4} &&\\text{let's bring the 4 over to the left side}\\\\",
      '12 \\cdot 4 &= \\cancel{4} \\cdot \\frac{5y}{\\cancel{4}} \\\\',
      "48 &= 5y &&\\text{let's bring the 5 to the left side}\\\\",
      '\\frac{48}{5} &= \\frac{\\cancel{5}y}{\\cancel{5}}\\\\',
      '\\frac{48}{5} &= y &&\\text{$\\square$}\\\\',
      '\\end{align}'
    ]
  },
  {
    'question': [
      '\\lvert 3y - 7 \\rvert = 2'
    ],
    '#answer': [
      '\\begin{align}',
      "\\lvert 3y - 7 \\rvert &= 2 &&\\text{let's rewrite the left side}\\\\",
      "\\sqrt{\\mathstrut (3y - 7)^2} &= 2 &&\\text{let's bring the $\\sqrt{\\space}$ over to the right side}\\\\",
      "(3y - 7)^2 &= 2^2 &&\\text{let's bring the $^2$ to the right side}\\\\",
      "(3y - 7) &= \\pm \\sqrt{\\mathstrut 2^2} &&\\text{let's evaluate the right side}\\\\",
      "3y - 7 &= \\pm 2 &&\\text{let's bring the 7 over to the right side}\\\\",
      "3y &= \\pm 2 + 7 &&\\text{let's bring the 3 over to the right side}\\\\",
      '\\frac{\\cancel{3}y}{\\cancel{3}} &= \\frac{(\\pm 2 + 7)}{3} \\\\',
      'y &= \\frac{(\\pm 2 + 7)}{3} &&\\text{there are 2 unique solutions}\\\\',
      'y &= \\frac{2 + 7}{3} = \\frac{9}{3} = 3 &&\\text{$\\square$ (1)}\\\\',
      'y &= \\frac{-2 + 7}{3} = \\frac{5}{3}  &&\\text{$\\square$ (2)}\\\\',
      '\\end{align}'
    ]
  },
  {
    'question': [
      '4(y + 9) = 6y'
    ],
    '#answer': [
      '\\begin{align}',
      '4(y + 9) &= 6y &&\\text{expand the left side}\\\\',
      '4 \\cdot y + 4 \\cdot 9 &= 6y &&\\text{evaluate the left side}\\\\',
      "4y + 36 &= 6y &&\\text{let's bring $4y$ over to the right side}\\\\",
      '36 &= 6y - 4y \\\\',
      "36 &= 2y &&\\text{let's bring 2 over to the left side}\\\\",
      '\\frac{36}{2} &= \\frac{\\cancel{2}y}{\\cancel{2}}\\\\',
      '18 &= y &&\\text{$\\square$}\\\\',
      '\\end{align}'
    ]
  },
  {
    'question': [
      '\\frac{4}{y} + \\frac{6}{5y} = 3y'
    ],
    '#answer': [
      '\\begin{align}',
      "\\frac{4}{y} + \\frac{6}{5y} &= 3y &&\\text{let's evaluate the left side}\\\\",
      '\\frac{4\\cdot 5}{5y} + \\frac{6}{5y} &= 3y\\\\',
      '\\frac{20}{5y} + \\frac{6}{5y} &= 3y\\\\',
      "\\frac{26}{5y} &= 3y &&\\text{let's move the $5y$ over to the right side}\\\\",
      '\\frac{26}{\\cancel{5y}}\\cdot \\cancel{5y} &= 3y \\cdot 5y \\\\',
      "26 &= 15y^2 &&\\text{let's move the 15 over to the left side}\\\\",
      '\\frac{26}{15} &= \\frac{\\cancel{15}y^2}{\\cancel{15}}\\\\',
      "\\frac{26}{15} &= y^2 &&\\text{let's move the $^2$ to the left side}\\\\",
      '\\pm\\sqrt{\\mathstrut \\frac{26}{15}} &= y &&\\text{there are 2 unique solutions}\\\\',
      '\\sqrt{\\mathstrut \\frac{26}{15}} &= y &&\\text{$\\square$ (1)}\\\\',
      '-\\sqrt{\\mathstrut \\frac{26}{15}} &= y &&\\text{$\\square$ (2)}\\\\',
      '\\end{align}'
    ]
  }
]

const formatter = require('../formatter')
module.exports = formatter(data)
