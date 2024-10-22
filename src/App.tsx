import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Rule, UserData } from './types/RuleTypes';

const API_URL = 'http://localhost:3001/api';

function App() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleString, setNewRuleString] = useState('');
  const [userData, setUserData] = useState<UserData>({
    age: 0,
    department: '',
    salary: 0,
    experience: 0
  });
  const [evaluationResult, setEvaluationResult] = useState<boolean | null>(null);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await axios.get(`${API_URL}/rules`);
      setRules(response.data);
    } catch (error) {
      console.error('Error fetching rules:', error);
    }
  };

  const handleCreateRule = async () => {
    try {
      await axios.post(`${API_URL}/rules`, { name: newRuleName, ruleString: newRuleString });
      setNewRuleName('');
      setNewRuleString('');
      fetchRules();
    } catch (error) {
      console.error('Error creating rule:', error);
    }
  };

  const handleEvaluate = async () => {
    try {
      const response = await axios.post(`${API_URL}/evaluate`, {
        ruleIds: rules.map(rule => rule._id),
        userData
      });
      setEvaluationResult(response.data.result);
    } catch (error) {
      console.error('Error evaluating rules:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">Rule Engine</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex flex-col">
                  <label className="leading-loose">Rule Name</label>
                  <input
                    type="text"
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    placeholder="Enter rule name"
                    value={newRuleName}
                    onChange={(e) => setNewRuleName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="leading-loose">Rule String</label>
                  <input
                    type="text"
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    placeholder="Enter rule string"
                    value={newRuleString}
                    onChange={(e) => setNewRuleString(e.target.value)}
                  />
                </div>
                <button
                  className="bg-blue-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
                  onClick={handleCreateRule}
                >
                  <PlusCircle className="w-6 h-6 mr-2" /> Create Rule
                </button>
              </div>
              <div className="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
                <p>Existing Rules:</p>
                <ul className="list-disc space-y-2 ml-4 mt-2">
                  {rules.map((rule) => (
                    <li key={rule._id}>{rule.name}</li>
                  ))}
                </ul>
              </div>
              <div className="pt-6 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <p className="font-bold">Evaluate Rules:</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="leading-loose">Age</label>
                    <input
                      type="number"
                      className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                      value={userData.age}
                      onChange={(e) => setUserData({ ...userData, age: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="leading-loose">Department</label>
                    <input
                      type="text"
                      className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                      value={userData.department}
                      onChange={(e) => setUserData({ ...userData, department: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="leading-loose">Salary</label>
                    <input
                      type="number"
                      className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                      value={userData.salary}
                      onChange={(e) => setUserData({ ...userData, salary: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="leading-loose">Experience</label>
                    <input
                      type="number"
                      className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                      value={userData.experience}
                      onChange={(e) => setUserData({ ...userData, experience: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <button
                  className="bg-green-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
                  onClick={handleEvaluate}
                >
                  Evaluate
                </button>
                {evaluationResult !== null && (
                  <div className={`flex items-center justify-center p-4 ${evaluationResult ? 'bg-green-100' : 'bg-red-100'} rounded-md`}>
                    {evaluationResult ? (
                      <><CheckCircle2 className="w-6 h-6 text-green-500 mr-2" /> User is eligible</>
                    ) : (
                      <><XCircle className="w-6 h-6 text-red-500 mr-2" /> User is not eligible</>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;