var Gherkin = require('gherkin');
var jp = require('jsonpath');
var fs = require('fs-extra');
var recursive = require('recursive-readdir');

function getContentBetweenLine(fileString, start, end) {
  var lines = fileString.split('\n');
  return lines.slice(start, end + 1).join('\n');
}

module.exports.read = function (callback) {
  recursive('./bdd', function(err, files) {
    // Files is an array of filename
    var target = files.filter((i) => i.endsWith('feature')).map((i) => {
      console.log(i);
      let fileString = fs.readFileSync(i).toString();
      let parseResult = parse(fileString)
      return parseResult;
    }).filter((i) => i !== null);
    callback(target);
  });
}


function parse(input) {
  try{
    var parser = new Gherkin.Parser();
    var gherkinDocument = parser.parse(input);
    return {
      feature: gherkinDocument.feature.name,
      content: input,
      scenario: gherkinDocument.feature.children.map((i) => {
        if (i.type === 'Scenario') {
          const lines = jp.query(i, '$..line');
          const start = Math.min(...lines);
          const end = Math.max(...lines);
          return {
            name: i.name,
            tags: i.tags.map((tag) => tag.name),
            line: getContentBetweenLine(input, start-1, end-1)
          };
        }
        return null;
      }).filter((i) => i !== null)
    };
  }
  catch(err){
    console.log('err', err);
    return null;
  }

}
