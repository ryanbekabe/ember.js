import { moduleFor, AbstractTestCase } from 'internal-test-helpers';

import { SafeString, htmlSafe, isHTMLSafe } from './helpers';

moduleFor(
  'SafeString',
  class extends AbstractTestCase {
    ['@test htmlSafe should return an instance of SafeString']() {
      let safeString = htmlSafe('you need to be more <b>bold</b>');

      this.assert.ok(safeString instanceof SafeString, 'should be a SafeString');
    }

    ['@test htmlSafe should return an empty string for null']() {
      let safeString = htmlSafe(null);

      this.assert.equal(safeString instanceof SafeString, true, 'should be a SafeString');
      this.assert.equal(safeString.toString(), '', 'should return an empty string');
    }

    ['@test htmlSafe should return an instance of SafeString for an empty string']() {
      let safeString = htmlSafe();

      this.assert.equal(safeString instanceof SafeString, true, 'should be a SafeString');
      this.assert.equal(safeString.toString(), '', 'should return an empty string');
    }
  }
);

moduleFor(
  'SafeString isHTMLSafe',
  class extends AbstractTestCase {
    ['@test isHTMLSafe should detect SafeString']() {
      let safeString = htmlSafe('<em>Emphasize</em> the important things.');

      this.assert.ok(isHTMLSafe(safeString));
    }

    ['@test isHTMLSafe should not detect SafeString on primatives']() {
      this.assert.notOk(isHTMLSafe('Hello World'));
      this.assert.notOk(isHTMLSafe({}));
      this.assert.notOk(isHTMLSafe([]));
      this.assert.notOk(isHTMLSafe(10));
      this.assert.notOk(isHTMLSafe(null));
    }
  }
);
