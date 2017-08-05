const data = {
  'title': 'Substitution',
  'breadCrumbs': [
    {
      'title': 'Home',
      'url': '/'
    },
    {
      'title': 'Elementary Algebra',
      'url': '/ele-algebra'
    }
  ],
  '#openingSentence': [
    'Substitution is an algorithm for solving two or more equations.',
    'Its applications can be found in different areas of mathematics like number theory and calculus.'
  ],
  'prerequisiteTopics': [
    {
      'title': 'Solving Equations',
      'url': '/ele-algebra/solving-equations'
    }
  ],
  'contentsList': [
    {
      'title': 'What is Substitution',
      'fragment': 'what'
    },
    {
      'title': 'How to apply Substitution',
      'fragment': 'how'
    },
    {
      'title': 'Why Substitution works',
      'fragment': 'why'
    },
    {
      'title': 'Substitution for 3 variables',
      'fragment': 'threevar'
    }
  ],
  'exercisesStatement': 'Solve the following systems of equations by applying the Substitution method.',
  'resources': [
    {
      'title': 'Desmos Graphing Calculator',
      'url': 'https://www.desmos.com/calculator'
    },
    {
      'title': 'Equality Principle',
      'url': 'https://en.wikipedia.org/wiki/Equality_(mathematics)'
    }
  ],
  'keywords': 'mathbook,math,book,help,algebra,evaluating expressions,evaluating,expressions'
}

const formatter = require('../formatter')
module.exports = formatter(data)
