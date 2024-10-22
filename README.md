# Rule Engine with AST

This project implements a simple 3-tier rule engine application using React for the frontend, Node.js with Express for the backend API, and MongoDB for data storage. The application uses an Abstract Syntax Tree (AST) to represent conditional rules and allows for dynamic creation, combination, and evaluation of these rules.

## Features

- Create and store rules with a user-friendly interface
- Evaluate user data against combined rules
- Visualize rule evaluation results
- RESTful API for rule management and evaluation
- MongoDB integration for persistent storage of rules

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or later)
- npm (v6 or later)
- MongoDB (v4 or later)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/rule-engine-ast.git
   cd rule-engine-ast
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/ruleEngine
   ```

## Usage

1. Start the MongoDB server (if not already running):
   ```
   mongod
   ```

2. Start the backend server:
   ```
   npm run server
   ```

3. In a new terminal, start the frontend development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the URL provided by Vite).

## Creating and Evaluating Rules

1. Enter a rule name and rule string in the provided form.
   Example rule string: `age > 30 AND department = 'Sales'`

2. Click "Create Rule" to add the rule to the system.

3. Create multiple rules to test different scenarios.

4. In the "Evaluate Rules" section, enter user data (age, department, salary, experience).

5. Click "Evaluate" to see if the user is eligible based on the combined rules.

## API Endpoints

- `POST /api/rules`: Create a new rule
- `GET /api/rules`: Retrieve all rules
- `POST /api/evaluate`: Evaluate user data against all rules

## Contributing

Contributions to the Rule Engine with AST project are welcome. Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contact

If you have any questions or feedback, please open an issue on the GitHub repository.
