
Vue.component("single-book", {
  template: "#book-template",
  props: ["bookdata"]
});

new Vue({
  el: "#app",
  data: {
    books: [
      {
        authLast: "DeMarco",
        authFirst: "Tom",
        title: "PeopleWare: Productive Projects and Teams"
      },
      {
        authLast: "Spolsky",
        authFirst: "Joel",
        title:
          "Joel on Software: And on Diverse and Occasionally Related Matters That Will Prove of Interest to Software Developers, Designers, and Managers, and to Those Who, Whether by Good Fortune or Ill Luck, Work with Them in Some Capacity"
      },
      { authLast: "Thomas", authFirst: "Angie", title: "The Hate U Give" },
      { authLast: "Lind", authFirst: "Ma", title: "Severance" },
      {
        authLast: "Whitehead",
        authFirst: "Colson",
        title: "Underground Railroad"
      }
    ],
    newAuthFirst: "",
    newAuthLast: "",
    newTitle: "",
    errors: []
  },
  methods: {
    sortBooks() {
      this.books.sort(
        (a, b) => (a.authLast.toUpperCase() > b.authLast.toUpperCase() ? 1 : -1)
      );
    },
    addBook() {
      if (!this.newAuthFirst || !this.newAuthLast || !this.newTitle) {
        return (this.errors = 1);
      } else {
        this.errors = [];
        const newBookObj = {
          authFirst: this.newAuthFirst,
          authLast: this.newAuthLast,
          title: this.newTitle
        };
        this.books.push(newBookObj);
        this.newAuthFirst = "";
        this.newAuthLast = "";
        this.newTitle = "";
      }
      this.sortBooks();
    },
    removeBook(index) {
      this.books.splice(index, 1);
    }
  },
  mounted() {
    this.sortBooks();
  }
});