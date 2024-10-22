import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { createRule, combineRules, evaluateRule } from '../src/utils/ruleParser.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ruleEngine', { useNewUrlParser: true, useUnifiedTopology: true });

// Define Rule Schema
const ruleSchema = new mongoose.Schema({
  name: String,
  ast: Object
});

const Rule = mongoose.model('Rule', ruleSchema);

// API Routes
app.post('/api/rules', async (req, res) => {
  try {
    const { name, ruleString } = req.body;
    const ast = createRule(ruleString);
    const rule = new Rule({ name, ast });
    await rule.save();
    res.status(201).json(rule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/rules', async (req, res) => {
  try {
    const rules = await Rule.find();
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/evaluate', async (req, res) => {
  try {
    const { ruleIds, userData } = req.body;
    const rules = await Rule.find({ _id: { $in: ruleIds } });
    const combinedRule = combineRules(rules.map(rule => rule.ast));
    const result = evaluateRule(combinedRule, userData);
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});