const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      activeTab: "dashboard",
      greeting: "",
    };
  },

  watch: {
    activeTab(newTab) {
      if (newTab === "informasi") {
        document
          .getElementById("dynamic-css")
          .setAttribute("href", "assets/css/stok.css");
      } else if (newTab === "tracking") {
        document
          .getElementById("dynamic-css")
          .setAttribute("href", "assets/css/tracking.css");
      }
    },
  },

  mounted() {
    this.greeting = this.getGreeting();
  },

  methods: {
    getGreeting() {
      const now = new Date();
      const hour = now.getHours();

      if (hour < 11) return "Selamat pagi";
      if (hour < 15) return "Selamat siang";
      if (hour < 18) return "Selamat sore";

      return "Selamat malam";
    },
  },
});

app.component("tracking-pengiriman", TrackingPengirimanComponent);
app.component("stok-table", StokComponent);

app.mount("#app");
