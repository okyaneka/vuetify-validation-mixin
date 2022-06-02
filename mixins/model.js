export default {
  model: { prop: "modelData", event: "change" },
  props: { modelData: { type: [Boolean, String, Number, Object, File] } },
  computed: {
    model: {
      get() {
        return this.modelData;
      },
      set(val) {
        this.$emit("change", val);
      }
    }
  }
};
