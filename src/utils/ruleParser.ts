import { Node } from '../types/RuleTypes';

const operators = ['AND', 'OR'];
const comparators = ['>', '<', '=', '>=', '<=', '!='];

export function createRule(ruleString: string): Node {
  const tokens = tokenize(ruleString);
  return parseExpression(tokens);
}

function tokenize(ruleString: string): string[] {
  return ruleString.replace(/[()]/g, ' $& ').split(/\s+/).filter(Boolean);
}

function parseExpression(tokens: string[]): Node {
  if (tokens.length === 0) {
    throw new Error('Invalid rule: Empty expression');
  }

  if (tokens[0] === '(') {
    const closingIndex = findClosingParenthesis(tokens);
    if (closingIndex === -1) {
      throw new Error('Invalid rule: Mismatched parentheses');
    }

    const subExpression = tokens.slice(1, closingIndex);
    const node = parseExpression(subExpression);

    if (closingIndex + 1 < tokens.length) {
      const operator = tokens[closingIndex + 1];
      if (operators.includes(operator)) {
        return {
          type: 'operator',
          value: operator,
          left: node,
          right: parseExpression(tokens.slice(closingIndex + 2))
        };
      }
    }

    return node;
  }

  const operatorIndex = tokens.findIndex(token => operators.includes(token));
  if (operatorIndex !== -1) {
    return {
      type: 'operator',
      value: tokens[operatorIndex],
      left: parseExpression(tokens.slice(0, operatorIndex)),
      right: parseExpression(tokens.slice(operatorIndex + 1))
    };
  }

  // Handle leaf nodes (conditions)
  const comparatorIndex = tokens.findIndex(token => comparators.includes(token));
  if (comparatorIndex === -1) {
    throw new Error('Invalid rule: No comparator found');
  }

  return {
    type: 'operand',
    value: `${tokens[comparatorIndex - 1]} ${tokens[comparatorIndex]} ${tokens[comparatorIndex + 1]}`
  };
}

function findClosingParenthesis(tokens: string[]): number {
  let count = 0;
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === '(') count++;
    if (tokens[i] === ')') count--;
    if (count === 0) return i;
  }
  return -1;
}

export function combineRules(rules: Node[]): Node {
  if (rules.length === 0) {
    throw new Error('No rules to combine');
  }
  if (rules.length === 1) {
    return rules[0];
  }
  return rules.reduce((combined, rule) => ({
    type: 'operator',
    value: 'AND',
    left: combined,
    right: rule
  }));
}

export function evaluateRule(node: Node, data: Record<string, any>): boolean {
  if (node.type === 'operand') {
    const [attribute, comparator, value] = (node.value as string).split(' ');
    const dataValue = data[attribute];
    const compareValue = isNaN(Number(value)) ? value : Number(value);

    switch (comparator) {
      case '>': return dataValue > compareValue;
      case '<': return dataValue < compareValue;
      case '=': return dataValue === compareValue;
      case '>=': return dataValue >= compareValue;
      case '<=': return dataValue <= compareValue;
      case '!=': return dataValue !== compareValue;
      default: throw new Error(`Invalid comparator: ${comparator}`);
    }
  }

  if (node.type === 'operator') {
    switch (node.value) {
      case 'AND':
        return evaluateRule(node.left!, data) && evaluateRule(node.right!, data);
      case 'OR':
        return evaluateRule(node.left!, data) || evaluateRule(node.right!, data);
      default:
        throw new Error(`Invalid operator: ${node.value}`);
    }
  }

  throw new Error('Invalid node type');
}