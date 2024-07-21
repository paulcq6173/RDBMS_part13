require('dotenv').config();
const { Sequelize, Model, DataTypes } = require('sequelize');
const express = require('express');
const app = express();
app.use(express.json());

const sequelize = new Sequelize(process.env.DATABASE_URL);

// Declare a Blog Model for Sequelize
class Blog extends Model {}
Blog.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    author: { type: DataTypes.TEXT, allowNull: true },
    url: { type: DataTypes.TEXT, allowNull: false },
    title: { type: DataTypes.TEXT, allowNull: false },
    likes: { type: DataTypes.INTEGER, default: 0 },
  },
  { sequelize, underscored: true, timestamps: false, modelName: 'blog' }
);

app.get('/api/blogs', async (_req, res) => {
  const blogs = await Blog.findAll();
  console.log(JSON.stringify(blogs, null, 2));
  res.json(blogs);
});

app.get('/api/blogs/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
    console.log(blog.toJSON());
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

app.post('/api/blogs', async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    return res.json(blog);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

// Only title allowed to change for now.
app.put('/api/blogs/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
    blog.title = req.body.title;
    await blog.save();
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/blogs/:id', async (req, res) => {
  const reqId = req.params.id;

  try {
    const foundBlog = await Blog.findByPk(reqId);

    if (foundBlog) {
      await foundBlog.destroy();

      res.json({ message: `ID:${reqId} blog deleted.` });
    } else {
      res.status(404).end();
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
