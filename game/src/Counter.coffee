class Counter
  constructor: ->
    @reset(4)

  reset: (@count) ->
    @health = new Array(@count).fill(20)

  import: (str) ->

  export: ->
    return ""

module.exports = Counter
