var data = {
  'title': 'Isolating Variables',
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
    'Isolating variables is a fundamental tool that is applied in all areas of mathematics.',
    'The idea and process of isolating a variable is an interesting one.'
  ],
  'prerequisiteTopics': [
    {
      'title': 'How to evaluate expressions',
      'url': '/ele-algebra/eval-expressions'
    }
  ],
  'contentsList': [
    {
      'title': 'Why do we isolate for variables?',
      'fragment': 'why'
    },
    {
      'title': 'How to isolate for a variable',
      'fragment': 'how'
    },
    {
      'title': 'Why isolating variables Works',
      'fragment': 'works'
    }
  ],
  'exercisesStatement': 'Isolate the following equations with respect to \\(y\\).',
  'resources': [
    {
      'title': 'What is Transposition?',
      'url': 'http://www.staff.vu.edu.au/mcaonline/units/algebra/algtrans.html'
    }
  ],
  'keywords': 'mathbook,math,book,help,algebra,isolating variables,isolating,variables'
}

const formatter = require('../formatter')
module.exports = formatter(data)
