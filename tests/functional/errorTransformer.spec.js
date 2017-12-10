"use strict"

const chai = require("chai")
const expect = chai.expect
const errorTransformer = require("../../src/transformers/errorTransformer")

describe("errorTransformer functional tests", () => {
  it("should return an error with a details property that contains source and params properties", () => {
    const mockError = new Error("testing error") // mock error
    const mockSource = "source::of:truth" // mock source
    const mockParams = { foo: "hello", bar: "world" } // mock params

    const result = errorTransformer(mockError, mockSource, mockParams)
    expect(result).instanceOf(Error)
    expect(result).to.have.property("details")
    expect(result.details).to.have.property("source", mockSource) // the key is "source" and the value === mockSource
    expect(result.details).to.have.property("params", mockParams) // the key is "params" and the value === mockParams
  })
})
