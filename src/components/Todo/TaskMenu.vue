<template>
  <div>
    <v-menu bottom left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          @click="handleClick(index)"
        >
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <dialog-edit
      v-if="dialog.edit"
      :task="task"
      @close="dialog.edit = false"
    />
    <dialog-due-date
      v-if="dialog.dueDate"
      :task="task"
      @close="dialog.dueDate = false"
    />
    <dialog-delete
      v-if="dialog.delete"
      :task="task"
      @close="dialog.delete = false"
    />
  </div>
</template>

<script>
export default {
    props: ['task'],
  data: () => ({
    dialog: {
      edit: false,
      dueDate: false,
      delete: false,
    },
    items: [
      {
        title: "Edit",
        icon: "mdi-pencil",
        click() {
          this.dialog.edit = true;
        },
      },
      {
        title: "Due Date",
        icon: "mdi-calendar",
        click() {
          this.dialog.dueDate = true;
        },
      },
      {
        title: "Delete",
        icon: "mdi-delete",
        click(index) {
          this.dialog.delete = true;
        },
      },
      {
        title: "Sorting",
        icon: "mdi-drag-horizontal-variant",
        click(index) {
          if(!this.$store.state.search) {
            this.$store.commit('toggleSorting');
          } else {
            this.$store.commit('showSnackbar', 'How DARE you try to srot while sorting');
          }
        },
      },
    ],
  }),
  components: {
    "dialog-edit": require("@/components/Todo/Dialog/DialogEdit.vue")
      .default,
    "dialog-due-date": require("@/components/Todo/Dialog/DialogDueDate.vue")
      .default,
    "dialog-delete": require("@/components/Todo/Dialog/DialogDelete.vue")
      .default,
  },
  methods: {
    handleClick(index) {
      this.items[index].click.call(this);
    },
  },
};
</script>

<style></style>
