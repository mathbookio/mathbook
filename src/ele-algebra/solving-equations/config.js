const data = {
  'title': 'Solving Equations',
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
    'For most, solving equations is a concept that needs a good amount ',
    'of practice in order to properly understand and grasp.',
    'This page is a resource to help you understand the concept.'
  ],
  'prerequisiteTopics': [
    {
      'title': 'How to evaluate expressions',
      'url': '/ele-algebra/eval-expressions'
    },
    {
      'title': 'How to isolate variables',
      'url': '/ele-algebra/iso-variables'
    }
  ],
  'contentsList': [
    {
      'title': 'What does it mean to solve an equation',
      'fragment': 'what'
    },
    {
      'title': 'How to solve a basic equation',
      'fragment': 'how'
    },
    {
      'title': 'Tips and tricks on how to solve challenging equations',
      'fragment': 'tips',
      'children': [
        {
          'title': 'Expanding',
          'fragment': 'expanding'
        },
        {
          'title': 'Absolute Values',
          'fragment': 'absvals'
        },
        {
          'title': 'Denominator',
          'fragment': 'denom'
        }
      ]
    }
  ],
  'exercisesStatement': 'Given the following equations, solve for \\(y\\)',
  'resources': [
    {
      'title': 'How to expand expressions',
      'url': 'http://www.mathcentre.ac.uk/resources/Algebra%20leaflets/mc-expandbrack-2009-1.pdf'
    },
    {
      'title': 'How to evaluate absolute values',
      'url': 'http://tutorial.math.lamar.edu/Classes/Alg/SolveAbsValueEqns.aspx'
    }
  ],
  'keywords': 'mathbook,math,book,help,algebra,solving equations,solving,equations'
}

const formatter = require('../formatter')
module.exports = formatter(data)
