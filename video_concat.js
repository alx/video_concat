var fs     = require('fs');
var moment = require('moment');
var walk   = require('walk');
var exec = require('child_process').exec;
var files  = [];

var loop   = {min: 2, max: 4}

// Walker options
var walker  = walk.walk('./input', { followLinks: false });

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

walker.on('file', function(root, stat, next) {
  files.push({filename: stat.name, loop: getRandomInt(loop.min, loop.max)});
  next();
});


walker.on('end', function() {
  files = shuffle(files);
  var fileContent = files.map(function(file) {
    var content = [];
    for(i = 0; i < file.loop; i++) {
      content.push("file 'input/" + file.filename + "'");
    }
    return content.join('\n');
  }).join('\n');
  fs.writeFile("list_node.txt", fileContent);
  var output_filename = "./output/" + moment().format("YYYYMMDD_HHmmss") + ".mp4";
  exec('ffmpeg -f concat -i list_node.txt -c copy ' + output_filename, function (error, stdout, stderr) {
    exec('rm  list_node.txt');
    console.log(output_filename + " generated");
  });
});

