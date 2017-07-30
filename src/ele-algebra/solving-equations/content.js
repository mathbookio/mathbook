const data = {
  'cancel': '\\(\\require{cancel}\\)',
  'basicExample': '$$\\text{Consider} \\quad 3y - 11 = 10 \\quad \\text{solve for $y$}$$',
  '#basicExampleSolution': [
    '\\begin{align}',
    "3y - 11 &= 10 &&\\small{\\text{let's move the 11 over to the other side}}\\\\",
    '3y &= 10 + 11 \\\\',
    "3y &= 21 &&\\small{\\text{let's move the 3 to the other side}}\\\\",
    '\\frac{\\cancel{3}y}{\\cancel{3}} &= \\frac{21}{3}\\\\',
    'y &= \\frac{21}{3}\\\\',
    'y &= 7 &&\\small{\\text{$\\square$}}\\\\:',
    '\\end{align}'
  ],
  '#basicExampleCheck': [
    '\\begin{align}',
    '3y - 11 &= 10 &&\\small{\\text{sub. in $7$ everywhere you see $y$}}\\\\',
    '3(7) - 11 &= 10 &&\\small{\\text{now simply evaluate both sides}}\\\\',
    '21 - 11 &= 10 \\\\',
    '10 &= 10 &&\\small{\\text{$\\square$}}\\\\',
    '\\end{align}'
  ],
  'tip1': '$$\\text{Consider} \\quad 2(y - 4) = 12 \\quad \\text{solve for $y$}$$',
  'expanding': '$$\\text{eg.} \\quad 3(x + y) = 3x + 3y$$',
  '#tip1Solution': [
    '\\begin{align}',
    "2(y - 4) &= 12 &&\\small{\\text{let's expand the left side}}\\\\",
    "2y - 2\\cdot 4 &= 12 &&\\small{\\text{let's evaluate}}\\\\",
    "2y - 8 &= 12 &&\\small{\\text{let's move 8 to the other side}}\\\\",
    '2y &= 12 + 8 \\\\',
    "2y &= 20 &&\\small{\\text{let's move 2 to the other side}}\\\\",
    'y &= \\frac{20}{2} \\\\',
    'y &= 10 &&\\small{\\text{$\\square$}}\\\\',
    '\\end{align}'
  ],
  '#tip1Check': [
    '\\begin{align}',
    '2(y - 4) &= 12 &&\\small{\\text{sub. in $10$ everywhere you see $y$}}\\\\',
    '2((10) - 4) &= 12\\\\',
    '2(6) &= 12\\\\',
    '12 &= 12 &&\\small{\\text{$\\square$}}\\\\',
    '\\end{align}'
  ],
  'tip2': '$$\\text{Consider} \\quad 5 \\space \\lvert \\space y - 2 \\space \\rvert = 15 \\quad \\text{solve for $y$}$$',
  '#absval': [
    '$$\\lvert x \\rvert =  \\sqrt{\\mathstrut (x)^2} \\quad or \\quad',
    '\\lvert x \\pm y \\rvert =  \\sqrt{\\mathstrut (x \\pm y)^2}$$'
  ],
  'absvalequation': '$$\\text{if $x \\pm y = -a$ then $\\lvert x \\pm y \\rvert = \\lvert - a \\rvert = a$}$$',
  '#tip2Solution': [
    '\\begin{align}',
    "5 \\space \\lvert \\space y - 2 \\space \\rvert &= 15 &&\\small{\\text{let's expand the left side}}\\\\",
    '\\lvert \\space 5y - 5 \\cdot 2 \\space \\rvert &= 15 \\\\',
    "\\lvert \\space 5y - 10 \\space \\rvert &= 15 &&\\small{\\text{let's rewrite the left side}}\\\\",
    "\\sqrt{\\mathstrut (5y - 10)^2} &= 15 &&\\small{\\text{let's shift $\\sqrt{\\space}$ to the right side}}\\\\",
    "(5y - 10)^2 &= 15^2 &&\\small{\\text{let's move the $^2$ to the right side}}\\\\",
    '5y - 10 &= \\pm \\sqrt{\\mathstrut 15^2} &&\\small{\\text{$\\sqrt{\\space}$ and $^2$ negate each other}}\\\\',
    '5y - 10 &= \\pm 15 &&\\small{\\text{isolate and evaluate for y}}\\\\',
    '5y &= \\pm 15 + 10\\\\',
    '\\frac{\\cancel{5}y}{\\cancel{5}} &= \\frac{\\pm 15 + 10}{5}\\\\',
    'y &= \\frac{\\pm 15 + 10}{5} &&\\small{\\text{there are 2 unique solutions}}\\\\',
    'y &= \\frac{15 + 10}{5} = \\frac{25}{5} = 5 &&\\small{\\text{ $\\square$ (1)}}\\\\',
    'y &= \\frac{-15 + 10}{5} = \\frac{-5}{5} = -1 &&\\small{\\text{ $\\square$ (2)}}\\\\',
    '\\end{align}'
  ],
  '#tip2CheckFirst': [
    '\\begin{align}',
    '5 \\space \\lvert \\space y - 2 \\space \\rvert &= 15 &&\\small{\\text{ sub. in $5$ everywhere you see $y$ }}\\\\',
    '5 \\space \\lvert \\space (5) - 2 \\space \\rvert &= 15 &&\\small{\\text{ now evaluate both sides }}\\\\',
    '5 \\space \\lvert \\space 3 \\space \\rvert &= 15\\\\',
    '5 \\cdot 3 &= 15\\\\',
    '15 &= 15 &&\\small{\\text{$\\square$}}\\\\',
    '\\end{align}'
  ],
  '#tip2CheckSecond': [
    '\\begin{align}',
    '5 \\space \\lvert \\space y - 2 \\space \\rvert &= 15 &&\\small{\\text{ sub. in $-1$ everywhere you see $y$ }}\\\\',
    '5 \\space \\lvert \\space (-1) - 2 \\space \\rvert &= 15 &&\\small{\\text{ now evaluate both sides }}\\\\',
    '5 \\space \\lvert  -3 \\rvert &= 15\\\\',
    '5 \\cdot 3 &= 15\\\\',
    '15 &= 15 &&\\small{\\text{$\\square$}}\\\\',
    '\\end{align}'
  ],
  'tip3': '$$\\text{Consider} \\quad \\frac{12y - 1}{y} = 10 \\quad \\text{solve for $y$}$$',
  '#tip3Solution': [
    '\\begin{align}',
    "\\frac{12y - 1}{y} &= 10 &&\\small{\\text{let's bring $y$ over to the right side}}\\\\",
    "\\frac{(12y - 1)}{\\cancel{y}} \\cdot \\cancel{y} &= 10y &&\\small{\\text{now let's isolate for $y$}}\\\\",
    "12y - 1 &= 10y &&\\small{\\text{let's bring $12y$ over to the right side}}\\\\",
    '-1 &= 10y - 12y &&\\small{\\text{evaluate both sides}}\\\\',
    "-1 &= -2y &&\\small{\\text{let's bring -2 over to the left side}}\\\\",
    "\\frac{-1}{-2} &= y &&\\small{\\text{evaluate the left side (cancel -'s)}}\\\\",
    '\\frac{1}{2} &= y &&\\small{\\text{$\\square$}}',
    '\\end{align}'
  ],
  'tip3Answer': '\\(y = \\frac{1}{2}\\)',
  '#tip3Check': [
    '\\begin{align}',
    '\\frac{12y - 1}{y} &= 10 &&\\small{\\text{sub. in  $\\frac{1}{2}$ everywhere you see $y$}}\\\\',
    '\\frac{12(\\frac{1}{2}) - 1}{\\frac{1}{2}} &= 10 &&\\small{\\text{evaluate both sides}}\\\\',
    '\\frac{\\frac{12}{2} - 1}{\\frac{1}{2}} &= 10\\\\',
    '\\frac{6 - 1}{\\frac{1}{2}} &= 10 &&\\small{\\text{flip the fraction in the denominator and flip $\\div$ to $\\times$ }}\\\\',
    '\\frac{5}{1}\\cdot \\frac{2}{1} &= 10\\\\',
    '5 \\cdot 2 &= 10\\\\',
    '10 &= 10 &&\\small{\\text{$\\square$}}\\\\',
    '\\end{align}'
  ]
}

const formatter = require('../formatter')
module.exports = formatter(data)
