import EmberObject, { computed } from "@ember/object";
import RSVP from "rsvp";

const targetWrappers = new WeakMap();

export default function(...keys) {
  const fn = keys.pop();
  return computed(...keys, {
    get(propertyName) {
      const target = this;
      if(!targetWrappers.has(target)) {
        targetWrappers.set(target, new Map());
      }

      const targetWrapper = targetWrappers.get(target);
      if(!targetWrapper.has(propertyName)) {
        const meta = { val: null };
        targetWrapper.set(propertyName, meta);

        meta.calculator = EmberObject.extend({
          cache: computed(...keys.map(a => `target.${a}`), {
            get() {
              meta.val = null;
              RSVP.resolve(fn.apply(target)).then(val => {
                meta.val = val;
                target.notifyPropertyChange(propertyName);
              });
            }
          })
        }).create({ target });
      }

      targetWrapper.get(propertyName).calculator.cache;
      return targetWrapper.get(propertyName).val;
    }
  });
}
