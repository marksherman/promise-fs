var chai            = require('chai'),
    chaiAsPromised  = require('chai-as-promised');

chai.use(chaiAsPromised);

var fs = require('fs');

var should      = chai.should(),
    promisefs   = require('../index'),
    readFile    = promisefs.readFile;


describe('readFile', function() {
  describe('NoOptions', function() {
    it('should return the contents of the LICENSE file', function() {
      var file = 'LICENSE';
      var contents = fs.readFile(file);
      p = readFile(file);
      p.should.eventually.equal(contents);
    });
  });
});
