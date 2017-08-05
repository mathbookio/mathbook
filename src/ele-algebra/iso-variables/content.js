const data = {
  'cancel': '\\(\\require{cancel}\\)',
  'inversesStatement': '$$\\text{If an operator negates another, then the operator is the inverse of the other.}$$',
  'inverses1': '$$\\small + \\space \\text{negates} \\space - \\quad \\text{eg.} \\space 0 + 5 - 5 = 0$$',
  'inverses2': '$$\\small \\times \\space \\text{negates} \\space \\div \\quad \\text{eg.} \\space 1 \\times 5 \\div 5 = 1$$',
  'inverses3': '$$\\small \\sqrt{\\mathstrut \\space} \\space \\text{negates} \\space ^2 \\quad \\text{eg.} \\space \\sqrt{\\mathstrut5^2} = 5 $$',
  'inverses4': '$$\\small \\sqrt[x]{\\mathstrut \\space} \\space \\text{negates} \\space ^x \\quad \\text{eg.} \\space \\sqrt[x]{\\mathstrut 5^x} = 5 $$',
  'example1': '$$\\text{Given} \\quad y - x + 4 = 0 \\quad \\text{isolate for $y$.}$$',
  '#solve1': [
    '\\begin{align}',
    "y - x + 4 &= 0 &&\\small{\\text{ let's move $x$ to the other side}}\\\\",
    'y - x + 4 + x &= 0 + x &&\\small{\\text{ $+ \\space x$ to both sides}}\\\\',
    'y - \\cancel{x} + 4 + \\cancel{x} &= x \\\\',
    "y + 4 &= x &&\\small{\\text{ let's move 4 to the other side }}\\\\",
    'y + 4 - 4 &= x - 4 &&\\small{\\text{ $- \\space 4$ to both sides}}\\\\',
    'y + \\cancel{4} - \\cancel{4} &= x - 4 \\\\',
    'y &= x - 4 &&\\small{\\text{$\\square$}}\\\\',
    '\\end{align}'
  ],
  'example2': '$$\\text{Given} \\quad 2y + 5x + 1 = 0 \\quad \\text{isolate for $y$.}$$',
  '#solve2': [
    '\\begin{align}',
    "2y + 5x + 1 &= 0 &&\\small{\\text{let's move $5x$ to the other side}}\\\\",
    '2y + 5x + 1 - 5x &= 0 - 5x &&\\small{\\text{$- \\space 5x$ to both sides}}\\\\',
    '2y + \\cancel{5x} + 1 - \\cancel{5x} &= -5x\\\\',
    "2y + 1 &= -5x &&\\small{\\text{let's move 1 to the other side}}\\\\",
    '2y + 1 - 1 &= -5x - 1 &&\\small{\\text{$- \\space 1$ to both sides}}\\\\',
    '2y + \\cancel{1} - \\cancel{1} &= -5x - 1 \\\\',
    "2y &= -5x - 1 &&\\small{\\text{let's move 2 to the other side}}\\\\",
    '\\frac{2y}{2} &= \\frac{(-5x - 1)}{2} &&\\small{\\text{divide both sides by 2}} \\\\',
    '\\frac{\\cancel{2}y}{\\cancel{2}} &= \\frac{(-5x - 1)}{2} \\\\',
    'y &= \\frac{(-5x - 1)}{2} &&\\small{\\text{$\\square$}}\\\\',
    '\\end{align}'
  ],
  'example3': '$$\\text{Given} \\quad 2y + 5x + 1 = 0 \\quad \\text{evaluate at $x = 1, y = -3$}$$',
  '#solve3.0': [
    '\\begin{align}',
    '2y + 5x + 1 &= 0 &&\\small{\\text{sub. in -3 for $y$ and 1 for $x$}}\\\\',
    '2(-3) + 5(1) + 1 &= 0 &&\\small{\\text{now evaluate}}\\\\',
    '-6 + 5 + 1 &= 0\\\\',
    '0 &= 0 &&\\small{\\text{$\\square$}}\\\\',
    '\\end{align}'
  ],
  '#solve3.5': [
    '\\begin{align}',
    "2y + 5x + 1 &= 0 &&\\small{\\text{let's move -1 to the other side}}\\\\",
    '2y + 5x &= -1 &&\\small{\\text{sub. in -3 for $y$ and 1 for $x$}}\\\\',
    '2(-3) + 5(1) &= -1 &&\\small{\\text{now evaluate}}\\\\',
    '-6 + 5 &= -1\\\\',
    '-1 &= -1 &&\\small{\\text{$\\square$}}\\\\',
    '\\end{align}'
  ]
}

const formatter = require('../formatter')
module.exports = formatter(data)
