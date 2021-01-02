<template>
  <v-text-field
    class="pa-3"
    v-model="newTaskTitle"
    @keyup.enter="addTask"
    outlined
    hide-details
    clearable
    label="Add Task"
  >
    <template v-slot:append>
      <v-icon @click="addTask" :disabled="newTaskTitleInvalid" color="primary"
        >mdi-plus</v-icon
      >
    </template>
  </v-text-field>
</template>

<script>
export default {
  data() {
    return {
      newTaskTitle: "",
    };
  },
  computed: {
    newTaskTitleInvalid() {
      return !this.newTaskTitle;
    }
  },
  methods: {
    addTask() {
      if(!this.newTaskTitleInvalid) {
        this.$store.dispatch("addTask", this.newTaskTitle);
        this.newTaskTitle = "";
      }
    },
  },
};
</script>

