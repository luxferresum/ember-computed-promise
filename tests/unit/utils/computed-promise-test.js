import computedPromise from 'ember-computed-promise/computed-promise';
import { module, test } from 'qunit';
import EmberObject, { set } from '@ember/object';
import RSVP from 'rsvp';
import { run } from '@ember/runloop';

module('Unit | Utility | computed-promise', function() {

  // Replace this with your real tests.
  test('it works', function(assert) {
    const target = EmberObject.extend({
      foo: 'one',
      bar: 'two',
      computedPromise: computedPromise('foo', 'bar', function() {
        return RSVP.resolve(this.foo + this.bar);
      }),
    });

    const instance = run(() => target.create());
    run(() => assert.equal(instance.computedPromise, null));
    run(() => assert.equal(instance.computedPromise, 'onetwo'));
    run(() => set(instance, 'foo', 'other'));
    run(() => assert.equal(instance.computedPromise, null));
    run(() => assert.equal(instance.computedPromise, 'othertwo'));
  });

  test('it caches the promis', function(assert) {
    assert.expect(4);
    const target = EmberObject.extend({
      foo: 'one',
      bar: 'two',
      computedPromise: computedPromise('foo', 'bar', function() {
        assert.ok(true);
        return RSVP.resolve(this.foo + this.bar);
      }),
    });
    const instance = run(() => target.create());
    run(() => assert.equal(instance.computedPromise, null));
    run(() => assert.equal(instance.computedPromise, 'onetwo'));
    run(() => assert.equal(instance.computedPromise, 'onetwo'));
  });
});
