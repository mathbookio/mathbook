const data = {
  'cancel': '\\(\\require{cancel}\\)',
  '#whatRootDefinition': [
    '$$',
    '\\text{A root of a polynomial $P(x)$, is a number $r$, where $P(r) = 0$.}',
    '$$'
  ],
  '#whatTheoremAlgebra': [
    '$$',
    '\\text{An $n$th degree polynomial has exactly $n$ roots}',
    '$$'
  ],
  '#whatPolyFactor': [
    '$$',
    'P(x) = F(x)G(x) \\quad | \\quad deg(F(x)), deg(G(x)) \\lt deg(P(x))',
    '$$'
  ],
  '#whatFactorExample': [
    '$$',
    'Q(x) = x^2 - 1 =\\underbrace{(x - 1)}_{F(x)}\\underbrace{(x + 1)}_{G(x)}',
    '$$'
  ],
  'basicsGCF': '$$\\text{Consider}\\quad p(x) = ax^2 + ax - ab \\quad | \\quad \\text{$b$ is a number}$$',
  'basicsGCFSolution': '$$p(x) = ax^2 + ax - ab = a(x^2 + x - b)$$',
  'basicsCommonVar': '$$\\text{Consider} \\quad P(x) = x^2 - x$$',
  '#basicsCommonVarSolution': [
    '\\begin{align}',
    'P(x) &= x^2 - x &&\\small\\text{$x$ is a common variable in each term}\\\\',
    "&= x\\cdot x - x &&\\small\\text{let's factor an $x$ out of each term}\\\\",
    '&= x(x -1)',
    '\\end{align}'
  ],
  '#basicsCommonVarFactored': [
    '$$',
    'P(x) = x^2 - x =\\underbrace{(x)}_{F(x)}\\underbrace{(x - 1)}_{G(x)}',
    '$$'
  ],
  '#howExample1': [
    '$$',
    '\\text{Find the root(s) of the following polynomial}',
    '\\quad ',
    'p(x) = 2x - 4',
    '$$'
  ],
  '#howBasicFactorExample1': [
    '\\begin{align}',
    'p(x) &= 2x - 4 &&\\small\\text{notice 2 is a G.C.F}\\\\',
    'p(x) &= 2x - 2\\cdot2 &&\\small\\text{factor out the 2}\\\\',
    'p(x) &= 2(x - 2)\\\\',
    '\\end{align}'
  ],
  '#howSolutionExample1': [
    '\\begin{align}',
    'p(x) &= 2(x - 2) &&\\small\\text{set $p(x) = 0$}\\\\',
    'p(x) &= 2(x - 2) = 0&&\\small\\text{solve for $x$}\\\\',
    '2(x - 2) &= 0 \\\\',
    '(x - 2) &= \\frac{0}{2} \\\\',
    'x - 2 &= 0\\\\',
    'x &= 2 &&\\small\\text{$\\square$}',
    '\\end{align}'
  ],
  'howFactoredExample1': '$$p(x) = 2(x - 2)$$',
  '#howSolutionPart1': [
    '\\begin{align}',
    'y - 2x &= -1 &&\\small{\\text{Step 1: isolate for $y$ in (2)}}\\\\',
    'y &= -1 + 2x &&\\small{\\text{(3)}}',
    '\\end{align}'
  ],
  '#howSolutionPart2': [
    '\\begin{align}',
    '2y - 3x &= 1 &&\\small{\\text{Step 2: sub. in $-1 + 2x$ for $y$ in (1)}}\\\\',
    '2(-1 + 2x) - 3x &= 1 &&\\small{\\text{Step 3: solve for $x$.}}\\\\',
    '-2 + 4x - 3x &= 1 \\\\',
    '-2 + x &= 1 \\\\',
    'x &= 1 + 2 \\\\',
    'x &= 3 &&\\small{\\text{$\\square$}}',
    '\\end{align}'
  ],
  '#howSolutionPart3': [
    '\\begin{align}',
    'y &= -1 + 2x &&\\small{\\text{Step 4: sub. in $3$ for $x$ in (3)}}\\\\',
    'y &= -1 + 2(3) &&\\small{\\text{solve for $y$}} \\\\',
    'y &= -1 + 6 \\\\',
    'y &= 5 &&\\small{\\text{$\\square$}}',
    '\\end{align}'
  ],
  '#howCheckPart1': [
    '\\begin{align}',
    '2y - 3x &= 1 &&\\small{\\text{sub. in $3$ for $x$ and $5$ for $y$ in (1)}}\\\\',
    '2(5) - 3(3) &= 1 &&\\small{\\text{evaluate}} \\\\',
    '10 - 9 &= 1 \\\\',
    '1 &= 1 &&\\small{\\text{$\\square$}}',
    '\\end{align}'
  ],
  '#howCheckPart2': [
    '\\begin{align}',
    'y - 2x &= -1 &&\\small{\\text{substitute in $3$ for $x$ and $5$ for $y$ in (2)}}\\\\',
    '(5) - 2(3) &= -1 &&\\small{\\text{evaluate}}\\\\',
    '5 - 6 &= -1 \\\\',
    '-1 &= -1 &&\\small{\\text{$\\square$}}',
    '\\end{align}'
  ],
  '#whyExample1': [
    '$$',
    '\\text{Consider} \\quad',
    '\\left\\{',
    '\\begin{array}{c}',
    'y - 2 = x & (1) \\\\',
    'y + x = 1 & (2)',
    '\\end{array}',
    '\\right.',
    '\\quad \\text{find solutions for $x$ and $y$}',
    '$$'
  ],
  '#whySolutionPart1': [
    '\\begin{align}',
    'y + x &= 1 &&\\small\\text{sub. in $y-2$ for $x$ in $(2)$}\\\\',
    'y + (y-2) &= 1 &&\\small\\text{$\\textit{equality principle}$}\\\\',
    '2y - 2 &= 1 \\\\',
    'y &= \\frac{3}{2} &&\\small\\text{$\\square$}',
    '\\end{align}'
  ],
  '#whySolutionPart2': [
    '\\begin{align}',
    'x &= y - 2 &&\\small\\text{sub. in $\\frac{3}{2}$ for $y$ in (1)}\\\\',
    'x &= \\left(\\frac{3}{2}\\right) - 2\\\\',
    'x &= -\\frac{1}{2} &&\\small\\text{$\\square$}',
    '\\end{align}'
  ],
  'whyExample1-y-value': '\\frac{3}{2}',
  'whyExample1-x-value': '-\\frac{1}{2}',
  '#threeVarExample': [
    '$$',
    '\\text{Consider} \\quad',
    '\\left\\{',
    '\\begin{array}{c}',
    'x - 2y + z = 1 & (1) \\\\',
    '2x + y - z = 3 & (2) \\\\',
    '4x + y + z = 4 & (3)',
    '\\end{array}',
    '\\right.',
    '\\quad \\text{find solutions for $x$, $y$ and $z$}',
    '$$'
  ],
  '#threeVarSolutionPart1': [
    '\\begin{align}',
    'x - 2y + z &= 1 &&\\small{\\text{Step 1: isolate for $z$ in (1)}}\\\\',
    'z &= 1 + 2y - x &&\\small{\\text{(4)}}\\\\',
    '\\end{align}'
  ],
  '#threeVarSolutionPart2': [
    '\\begin{align}',
    '2x + y - z &= 3 &&\\small{\\text{Step 2: sub. in $1 + 2y - x$ for $z$ in (2) }}\\\\',
    '2x + y - (1 + 2y - x) &= 3 &&\\small{\\text{evaluate}}\\\\',
    '3x - y &= 4 &&\\small{\\text{(5)}}',
    '\\end{align}'
  ],
  '#threeVarSolutionPart3': [
    '\\begin{align}',
    '4x + y + z &= 4 &&\\small{\\text{sub. in $1 + 2y - x$ for $z$ in (3) }}\\\\',
    '4x + y + (1 + 2y - x) &= 4 &&\\small{\\text{evaluate}}\\\\',
    '3x + 3y &= 3 &&\\small{\\text{(6)}}',
    '\\end{align}'
  ],
  '#threeVarSolutionPart4': [
    '$$',
    '\\text{Step 3: } \\quad',
    '\\left\\{',
    '\\begin{array}{c}',
    '3x - y = 4 & (5) \\\\',
    '3x + 3y = 3 & (6) \\\\',
    '\\end{array}',
    '\\right.',
    '$$'
  ],
  '#threeVarSolutionPart5': [
    '\\begin{align}',
    '3x - y &= 4 &&\\small{\\text{isolate for $y$ in (5)}}\\\\',
    'y &= 3x - 4 &&\\small{\\text{(7)}}',
    '\\end{align}'
  ],
  '#threeVarSolutionPart6': [
    '\\begin{align}',
    '3x + 3y &= 3 &&\\small{\\text{sub. in $3x - 4$ for $y$ in (6)}}\\\\',
    '3x + 3(3x - 4) &= 3 &&\\small{\\text{solve for $x$}}\\\\',
    '12x - 12 &= 3 \\\\',
    '12x &= 15\\\\',
    'x &= \\frac{15}{12} = \\frac{5}{4} &&\\small{\\text{$\\square$}}',
    '\\end{align}'
  ],
  '#threeVarSolutionPart7': [
    '\\begin{align}',
    'y &= 3x - 4 &&\\small{\\text{sub. in $\\frac{5}{4}$ for $x$ in (7)}}\\\\',
    'y &= 3\\left(\\frac{5}{4}\\right) - 4\\\\',
    'y &= -\\frac{1}{4} &&\\small{\\text{$\\square$}}',
    '\\end{align}'
  ],
  '#threeVarSolutionPart8': [
    '\\begin{align}',
    'z &= 1 + 2y - x &&\\small{\\text{Step 4: sub. in $\\frac{5}{4}$ for $x$ and $-\\frac{1}{4}$ for $y$ in (4)}}\\\\',
    'z &= 1 + 2\\left(-\\frac{1}{4}\\right) - \\left(\\frac{5}{4}\\right) &&\\small{\\text{solve for $z$}}\\\\',
    'z &= -\\frac{3}{4} &&\\small{\\text{$\\square$}}',
    '\\end{align}'
  ],
  '#threeVarCheckEquation1': [
    '\\begin{align}',
    'x - 2y + z &= 1 &&\\small{\\text{sub. in the values for $x$, $y$ and $z$ into (1)}}\\\\',
    '\\left(\\frac{5}{4}\\right) - 2\\left(-\\frac{1}{4}\\right) + \\left(-\\frac{3}{4}\\right) &= 1 &&\\small{\\text{evaluate}}\\\\',
    '\\frac{5}{4} + \\frac{1}{2} - \\frac{3}{4} &= 1\\\\',
    '\\frac{2}{4} + \\frac{1}{2} &= 1 \\\\',
    '1 &= 1 &&\\small{\\text{$\\square$}}',
    '\\end{align}'
  ],
  '#threeVarCheckEquation2': [
    '\\begin{align}',
    '2x + y - z &= 3 &&\\small{\\text{sub. in the values for $x$, $y$ and $z$ into (2)}}\\\\',
    '2\\left(\\frac{5}{4}\\right) + \\left(-\\frac{1}{4}\\right) - \\left(-\\frac{3}{4}\\right) &= 3 &&\\small{\\text{evaluate}}\\\\',
    '\\frac{10}{4} - \\frac{1}{4} + \\frac{3}{4} &= 3\\\\',
    '\\frac{12}{4} &= 3\\\\',
    '3 &= 3 &&\\small{\\text{$\\square$}}',
    '\\end{align}'
  ],
  '#threeVarCheckEquation3': [
    '\\begin{align}',
    '4x + y + z &= 4 &&\\small{\\text{sub. in the values for $x$, $y$ and $z$ into (3)}}\\\\',
    '4\\left(\\frac{5}{4}\\right) + \\left(-\\frac{1}{4}\\right) + \\left(-\\frac{3}{4}\\right) &= 4 &&\\small{\\text{evaluate}}\\\\',
    '5 - 1 &= 4 \\\\',
    '4 &= 4 &&\\small{\\text{$\\square$}}',
    '\\end{align}'
  ],
  'threeVarSolution': '$$x = \\frac{5}{4}, \\quad y = -\\frac{1}{4}, \\quad z = -\\frac{3}{4}$$'
}

const formatter = require('../formatter')
module.exports = formatter(data)
