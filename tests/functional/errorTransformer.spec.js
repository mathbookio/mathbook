"use strict"
const test = require("ava")
const expect = require("chai").expect
const errorTransformer = require("../../src/server/transformers/errorTransformer")

test("should return an error with a details property that contains source and params properties", t => {
  const mockError = new Error("testing error") // mock error
  const mockSource = "source::of:truth" // mock source
  const mockParams = {
    foo: "hello",
    bar: "world"
  } // mock params

  const result = errorTransformer(mockError, mockSource, mockParams)
  t.true(result instanceof Error)
  t.pass(expect(result).to.have.property("details"))
  t.pass(expect(result.details).to.have.property("source", mockSource)) // the key is "source" and the value === mockSource
  t.pass(expect(result.details).to.have.property("params", mockParams)) // the key is "params" and the value === mockParams
})
