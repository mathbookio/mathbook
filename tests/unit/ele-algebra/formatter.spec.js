const formatter = require('../../../src/ele-algebra/formatter')
const chai = require('chai')
const _ = require('lodash')
const expect = chai.expect

describe('Elementary Algebra', () => {
  describe('formatter', () => {
    it('should convert an array of strings to a single string when the key has a "#" (hashtag)', () => {
      const mockExercises = [
        {
          'question': [
            '1-question'
          ],
          '#answer': [
            '1-answer-line-1',
            '1-answer-line-2',
            '1-answer-line-3'
          ]
        }
      ]

      const result = formatter(mockExercises)
      result.forEach(function (item) {
        expect(_.isString(item.answer)).to.be.true
      })
    })

    it('should remove the "#" from the key (if it has one) for an array of strings', () => {
      const mockContent = {
        '#solutionForExpression': [
          'first',
          'second',
          'third'
        ]
      }

      const result = formatter(mockContent)
      expect(result).to.not.have.property('#solutionForExpression')
      expect(result).to.have.property('solutionForExpression')
      expect(_.isString(result.solutionForExpression)).to.be.true
    })

    it('should not modify an array of strings if the key does NOT have a "#" (hashtag)', () => {
      const mockContent = {
        expressions: [
          'first',
          'second',
          'third'
        ]
      }

      const result = formatter(mockContent)
      expect(result).to.have.property('expressions')
      expect(result.expressions).to.eql(mockContent.expressions)
    })
  })
})
