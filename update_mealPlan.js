const fs = require('fs');

let content = fs.readFileSync('/Users/rahul/web/meal-planner/data/mealPlan.ts', 'utf8');

// I will do replacements safely manually. Wait, a script replacing directly on the file contents could be fragile. 
// A safer approach is to completely write the new mealPlan array.
