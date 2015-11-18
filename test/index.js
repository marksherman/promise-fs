var chai            = require('chai'),
    chaiAsPromised  = require('chai-as-promised');

chai.use(chaiAsPromised);

var fs = require('fs');

var should      = chai.should(),
    promisefs   = require('../index'),
    readFile    = promisefs.readFile,
    writeFile   = promisefs.writeFile,
    readdir     = promisefs.readdir;

var testdir = 'testdir';
var setupTestDir = function() {
  content = new Date().toString() + ' ' + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  fs.mkdirSync(testdir);
  fs.writeFileSync(testdir + '/a', "a\n" + content + "\n");
  fs.writeFileSync(testdir + '/b', "b\n" + content + "\n");
  return content;
};

var destroyTestDir = function(newFiles) {
  if( Array.isArray(newFiles) ){
    newFiles.forEach(function(currentValue, i, a) {
      fs.unlinkSync(currentValue);
    });
  }
  if( typeof newFiles === 'string' ){
    fs.unlinkSync(newFiles);
  }
  fs.unlinkSync('testdir/a');
  fs.unlinkSync('testdir/b');
  fs.rmdir('testdir');
};

describe('readFile', function() {
  describe('default options', function() {
    it('should return the contents of the LICENSE file', function() {
      var file = 'LICENSE';
      var contents = fs.readFileSync(file, {encoding : 'utf-8'});
      p = readFile(file);
      p.should.eventually.equal(contents);
    });
  });
});

describe('readdir', function() {
  before('setup test dir', setupTestDir);
  after('destroy test dir', function(){ destroyTestDir(); });

  it('should list file names in testdir', function() {
    var p = readdir(testdir);
    p.should.eventually.equal([ 'a', 'b' ]);
  });
});

describe('writeFile', function() {
  var name = Math.floor(Math.random() * 99999).toString();

  before('setup test dir', setupTestDir);

  describe('create file', function() {
    it('should write a new file with a random name', function(done) {
      var p = writeFile(testdir + '/' + name, content);
      p.should.be.fulfilled.should.notify(done);
    });
  });

  describe('check file in dir listing', function() {
    it('should show new file in listing', function() {
      var wasread = fs.readdirSync(testdir);
      wasread.should.include.members([name]);
    });
  });

  describe('check contents of new file', function() {
    it('should read the contents back', function() {
      var wasread = fs.readFileSync(testdir + '/' + name, {encoding : 'utf-8'});
      wasread.should.equal(content);
    });
  });

  after('destroy directory with new file', function() {
    destroyTestDir(testdir + '/' + name);
  });
});
