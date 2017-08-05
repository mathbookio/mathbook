const data = {
  'title': 'Factoring',
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
    'Factoring is a process used to extract factors (roots) of a polynomial.'
  ],
  'prerequisiteTopics': [
    {
      'title': 'Isolating Variables',
      'url': '/ele-algebra/iso-variables'
    },
    {
      'title': 'Polynomials',
      'url': 'http://tutorial.math.lamar.edu/Classes/Alg/Polynomials.aspx'
    }
  ],
  'contentsList': [
    {
      'title': 'What is a root',
      'fragment': 'whatRoot'
    },
    {
      'title': 'What is factoring',
      'fragment': 'whatFactoring'
    },
    {
      'title': 'Factoring basics',
      'fragment': 'basics'
    },
    {
      'title': 'How to find roots',
      'fragment': 'how'
    }
  ],
  'exercisesStatement': 'Factor the following expressions.',
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
  'keywords': 'mathbook,math,book,help,algebra,factor,factoring'
}

const formatter = require('../formatter')
module.exports = formatter(data)
