const express = require("express");
const Joi = require("joi");
const app = express();
const port = process.env.PORT_NUMBER || 5000;
app.use(express.json());

const courses = [
  { id: 1, name: "EDT334" },
  { id: 2, name: "EDT304" },
  { id: 3, name: "EDT311" },
  { id: 4, name: "EDT386" },
  { id: 5, name: "EDT3984" },
];

const courseSchema = (course) => {
  const Schema = Joi.object({
    name: Joi.string().required().min(3).max(30),
  });
  return Schema.validate(course);
};
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
  const queryId = parseInt(req.params.id);
  const course = courses.find((c) => c.id === queryId);
  if (!course) return res.status(404).send("No course match the ID given");

  res.send(course);
});

app.post("/api/courses", (req, res) => {
  const { error } = courseSchema(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const course = { id: courses.length + 1, name: req.body.name };
  courses.push(course);
  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
  const queryId = parseInt(req.params.id);
  const course = courses.find((c) => c.id === queryId);
  if (!course) return res.status(400).send("No Course ID matches");

  const { error } = courseSchema(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  course.name = req.body.name;
  res.send(course);
});

app.delete("/api/courses/:id", (req, res) => {
  const queryId = parseInt(req.params.id);
  const course = courses.find((c) => c.id === queryId);
  if (!course)
    return res.status(400).send("Course of the given ID was not found");

  const courseIndex = courses.indexOf(course);
  courses.splice(courseIndex, 1);
  res.send(course);
});

app.listen(port, () => console.log(`App is listening on port ${port}`));
