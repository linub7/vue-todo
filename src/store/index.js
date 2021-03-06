import Vue from 'vue'
import Vuex from 'vuex'

import Localbase from 'localbase';

const db = new Localbase('db');
db.config.debug = false;

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    appTitle: process.env.VUE_APP_TITLE,
    search: null,
    tasks: [
      // {
      //   id: 1,
      //   title: "Wake Up",
      //   done: false,
      //   dueDate: '2020-10-16'
      // },
      // {
      //   id: 2,
      //   title: "Get Banana",
      //   done: false,
      //   dueDate: '2020-10-17'
      // },
      // {
      //   id: 3,
      //   title: "Eat Banana",
      //   done: false,
      //   dueDate: null
      // },
    ],
    snackbar: {
      show: false,
      text: ''
    },
    sorting: false,
  },
  mutations: {
    setSearch(state, value) {
      state.search = value;
    },
    addTask(state, newTask) {

      state.tasks.push(newTask);
    },
    doneTask(state, id) {
      let task = state.tasks.filter((task) => task.id === id)[0];
      task.done = !task.done;
    },
    deleteTask(state, id) {
      state.tasks = state.tasks.filter((task) => task.id !== id);
    },
    editTask(state, payload) {
      let task = state.tasks.filter((task) => task.id === payload.id)[0];
      task.title = payload.title;
    },
    setTasks(state, tasks) {
      state.tasks = tasks;
    },
    updateTaskDueDate(state, payload) {
      let task = state.tasks.filter(task => task.id === payload.id)[0];
      task.dueDate = payload.dueDate;
    },
    showSnackbar(state, text) {
      let timeout = 0;
      if (state.snackbar.show) {
        state.snackbar.show = false;
        timeout = 300;
      }
      setTimeout(() => {
        state.snackbar.show = true;
        state.snackbar.text = text;
      }, timeout);
    },
    hideSnackbar(state) {
      state.snackbar.show = false;
    },
    toggleSorting(state) {
      state.sorting = !state.sorting;
    }
  },
  actions: {
    addTask({
      commit
    }, newTaskTitle) {
      let newTask = {
        id: Date.now(),
        title: newTaskTitle,
        done: false,
        dueDate: null
      };
      db.collection('tasks').add(newTask).then(() => {
        commit('addTask', newTask);
        commit('showSnackbar', 'Task Added!');
      }).catch((error) => console.log(error));
    },
    doneTask({
      state,
      commit
    }, id) {
      let task = state.tasks.filter(task => task.id === id)[0];
      db.collection('tasks').doc({
        id: id
      }).update({
        done: !task.done
      }).then(() => {
        commit('doneTask', id);
      }).catch(error => console.log(error));
    },
    deleteTask({
      commit
    }, id) {
      db.collection('tasks').doc({
        id: id
      }).delete().then(() => {
        commit('deleteTask', id);
        commit('showSnackbar', 'Task Deleted!');
      }).catch((error) => console.log(error));
    },
    editTask({
      commit
    }, payload) {
      db.collection('tasks').doc({
        id: payload.id
      }).update({
        title: payload.title
      }).then(() => {
        commit('editTask', payload);
        commit('showSnackbar', 'Task Updated!');
      }).catch((error) => console.log(error));
    },
    updateTaskDueDate({
      commit
    }, payload) {
      db.collection('tasks').doc({
        id: payload.id
      }).update({
        dueDate: payload.dueDate
      }).then(() => {
        commit('updateTaskDueDate', payload);
        commit('showSnackbar', 'Due Date Updated!');
      }).catch(error => console.log(error));
    },
    setTasks({ commit }, tasks) {
      db.collection('tasks').set(tasks);
      commit('setTasks', tasks);
    },
    getTasks({
      commit
    }) {
      db.collection('tasks').get().then(tasks => {
        commit('setTasks', tasks);
      }).catch((error) => console.log(error));
    }
  },
  getters: {
    taskFiltered(state) {
      if (!state.search) {
        return state.tasks;
      }
      return state.tasks.filter(task => task.title.toLowerCase().includes(state.search.toLowerCase()));
    }
  }
})