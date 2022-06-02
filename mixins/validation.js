const mixins = {
  methods: {
    rules(label, reqRules, customMessage = {}) {
      const rules = [];
      let rule;

      if (!Array.isArray(reqRules)) {
        reqRules = reqRules.split('|');
      }

      if (reqRules.find((val) => val == 'email')) {
        rules.push((value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return (
            pattern.test(value) || customMessage.email || this.$t('validation.email', { label })
          );
        });
      }

      if (reqRules.find((val) => val == 'required')) {
        rules.push(
          (value) =>
            (value != undefined && !!String(value).trim()) ||
            customMessage.required ||
            this.$t('validation.required', { label })
        );
      }

      rule = reqRules.find((val) => val.match('numeric'));
      if (rule) {
        rules.push(
          (value) =>
            value == undefined ||
            !String(value).trim() ||
            !isNaN(value) ||
            this.$t('validation.numeric', { label })
        );
      }

      rule = reqRules.find((val) => val.match('max.'));
      if (rule) {
        const val = rule.split(':')[1];
        rules.push(
          (value) =>
            (value || '').length <= val ||
            label + ' harus kurang dari atau sama dengan ' + val + ' karakter.'
        );
      }

      rule = reqRules.find((val) => val.match('min.'));
      if (rule) {
        const val = rule.split(':')[1];
        rules.push(
          (value) =>
            (value || '').length >= val ||
            label + ' harus lebih dari atau sama dengan ' + val + ' karakter.'
        );
      }

      rule = reqRules.find((val) => val.match('between.'));
      if (rule) {
        const min = rule.split(':')[1].split(',')[0];
        if (min == undefined) {
          throw new Error('min cannot undefined');
        }
        const max = rule.split(':')[1].split(',')[1];
        if (max == undefined) {
          throw new Error('max cannot undefined');
        }
        rules.push(
          (value) =>
            ((value || '').length >= min && (value || '').length <= max) ||
            label + ' harus berada diantara ' + min + ' dan ' + max + ' karakter'
        );
      }

      rule = reqRules.find((val) => val.match('array'));
      if (rule) {
        const count = rule.split(':')[1];
        rules.push(
          (value) =>
            (Array.isArray(value) && count && count == value.length) ||
            this.$t('validation.array', { label, count })
        );
      }

      return rules;
    },
  },
};

export default mixins;
