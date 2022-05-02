var describe = require('mocha').describe
var it = require('mocha').it
var expect = require('chai').expect
var coercer = require('../')

describe('coercer', function () {
  it('should coerce values', function () {
    var output = coercer({
      'foo': 'true',
      'bar': '5',
      'baz': 'hello',
      'qux': {
        'quux': 'eight'
      },
      'corge': ['7', '93.2', 'false'],
      'grault': true,
      'garply': false,
      'waldo': 'undefined',
      'fred': [''],
      'string_number': '00001',
      'hex_number': '0x00001'
    })

    expect(output.foo).to.be.true
    expect(output.bar).to.equal(5)
    expect(output.baz).to.equal('hello')
    expect(output.qux.quux).to.equal('eight')
    expect(output.corge.length).to.equal(3)
    expect(output.corge[0]).to.equal(7)
    expect(output.corge[1]).to.equal(93.2)
    expect(output.corge[2]).to.be.false
    expect(output.grault).to.be.true
    expect(output.garply).to.be.false
    expect(output.waldo).to.be.undefined
    expect(output.fred[0]).to.equal('')
    expect(output.string_number).to.equal('00001')
    expect(output.hex_number).to.equal(0x00001)
  })
})
