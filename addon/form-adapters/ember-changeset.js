import Base from './base';
import { all } from 'rsvp';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

const EmberChangesetAdapter = Base.extend({
  changesets: readOnly('models'),

  isDirty: computed('changesets.@each.isDirty', function() {
    return this.get('changesets').some(c => c.get('isDirty'));
  }),

  isInvalid: computed('changesets.@each.isInvalid', function() {
    return this.get('changesets').some(c => c.get('isInvalid'));
  }),

  oncancel(){
    const form = arguments[arguments.length - 1];
    const changesets = form.get('changesets');
    changesets.forEach(c => c.rollback());
  },

  onsubmit(){
    const form = arguments[arguments.length - 1];
    const changesets = form.get('changesets');
    const submitting = changesets.map(c => c.save());

    return all(submitting);
  },

  onvalidate(){
    const form = arguments[arguments.length - 1];
    const changesets = form.get('changesets');
    const validating = changesets.map(c => c.validate());

    return all(validating).then(() => {
      return form.get('isValid');
    });
  }
});

export default EmberChangesetAdapter;
