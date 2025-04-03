export default function Hello(app) {
    app.get("/hello", (req, res) => {
      res.send("<h1>Life is good!</h1>");
    });
    app.get("/", (req, res) => {
      res.send("Welcome to Full Stack Development!");
    });
  }
  