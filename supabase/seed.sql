-- Seed challenges for CodeMentor AI

-- Challenge 1: FizzBuzz (Easy - Python)
INSERT INTO challenges (
  title,
  description,
  difficulty,
  language,
  starter_code,
  solution_code,
  test_cases,
  hints,
  order_index
) VALUES (
  'FizzBuzz Classic',
  'Write a function that returns "Fizz" for multiples of 3, "Buzz" for multiples of 5, "FizzBuzz" for multiples of both, and the number as a string otherwise.

## Requirements
- Function name: `fizzbuzz(n)`
- Input: integer `n` (1 ≤ n ≤ 100)
- Output: string

## Examples
```
fizzbuzz(3)  → "Fizz"
fizzbuzz(5)  → "Buzz"
fizzbuzz(15) → "FizzBuzz"
fizzbuzz(7)  → "7"
```',
  'easy',
  'python',
  'def fizzbuzz(n):
    # Your code here
    pass',
  'def fizzbuzz(n):
    if n % 15 == 0:
        return "FizzBuzz"
    elif n % 3 == 0:
        return "Fizz"
    elif n % 5 == 0:
        return "Buzz"
    else:
        return str(n)',
  '[
    {"name": "Multiple of 3", "input": "3", "expected": "Fizz"},
    {"name": "Multiple of 5", "input": "5", "expected": "Buzz"},
    {"name": "Multiple of both", "input": "15", "expected": "FizzBuzz"},
    {"name": "Not a multiple", "input": "7", "expected": "7"},
    {"name": "Edge case 1", "input": "1", "expected": "1"},
    {"name": "Large multiple", "input": "30", "expected": "FizzBuzz"}
  ]'::jsonb,
  '[
    "Start by checking if the number is divisible by both 3 and 5. What operator checks divisibility?",
    "Remember to check the combined condition (divisible by both) BEFORE checking individual conditions.",
    "The modulo operator (%) returns the remainder. If n % 3 == 0, n is divisible by 3.",
    "Don''t forget to convert numbers to strings when returning them!"
  ]'::jsonb,
  1
);

-- Challenge 2: Array Sum of Two (Medium - JavaScript)
INSERT INTO challenges (
  title,
  description,
  difficulty,
  language,
  starter_code,
  solution_code,
  test_cases,
  hints,
  order_index
) VALUES (
  'Two Sum Problem',
  'Given an array of integers and a target sum, return the indices of two numbers that add up to the target. You may assume each input has exactly one solution.

## Requirements
- Function name: `twoSum(nums, target)`
- Input: array of integers `nums`, integer `target`
- Output: array of two indices `[index1, index2]`
- You cannot use the same element twice

## Examples
```javascript
twoSum([2, 7, 11, 15], 9)  → [0, 1]  // nums[0] + nums[1] = 2 + 7 = 9
twoSum([3, 2, 4], 6)       → [1, 2]  // nums[1] + nums[2] = 2 + 4 = 6
```',
  'medium',
  'javascript',
  'function twoSum(nums, target) {
    // Your code here
}',
  'function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}',
  '[
    {"name": "Basic case", "input": "[[2, 7, 11, 15], 9]", "expected": "[0, 1]"},
    {"name": "Different order", "input": "[[3, 2, 4], 6]", "expected": "[1, 2]"},
    {"name": "Negative numbers", "input": "[[-1, -2, -3, -4], -6]", "expected": "[1, 3]"},
    {"name": "Zero included", "input": "[[0, 4, 3, 0], 0]", "expected": "[0, 3]"},
    {"name": "Large array", "input": "[[1, 2, 3, 4, 5, 6, 7, 8, 9], 17]", "expected": "[7, 8]"}
  ]'::jsonb,
  '[
    "Think about what you need to find for each number: if you have num, you need (target - num).",
    "A nested loop (checking every pair) works but is slow. Can you store information as you go?",
    "Consider using a Map or object to remember numbers you''ve seen and their indices.",
    "For each number, check if its complement (target - num) has been seen before."
  ]'::jsonb,
  2
);

-- Challenge 3: Type-Safe Config Parser (Hard - TypeScript)
INSERT INTO challenges (
  title,
  description,
  difficulty,
  language,
  starter_code,
  solution_code,
  test_cases,
  hints,
  order_index
) VALUES (
  'Generic Config Parser',
  'Create a type-safe configuration parser that validates and transforms config objects. Use TypeScript generics to ensure type safety.

## Requirements
- Function name: `parseConfig<T>(raw: unknown, schema: Schema<T>): T`
- Validate that raw data matches the schema
- Transform string numbers to actual numbers
- Throw error if validation fails
- Return properly typed result

## Schema Format
```typescript
type Schema<T> = {
  [K in keyof T]: {
    type: "string" | "number" | "boolean";
    required: boolean;
  };
};
```

## Example
```typescript
const schema = {
  port: { type: "number", required: true },
  host: { type: "string", required: true },
  debug: { type: "boolean", required: false }
};

parseConfig({ port: "3000", host: "localhost" }, schema)
// → { port: 3000, host: "localhost", debug: undefined }
```',
  'hard',
  'typescript',
  'type Schema<T> = {
  [K in keyof T]: {
    type: "string" | "number" | "boolean";
    required: boolean;
  };
};

function parseConfig<T>(raw: unknown, schema: Schema<T>): T {
    // Your code here
}',
  'type Schema<T> = {
  [K in keyof T]: {
    type: "string" | "number" | "boolean";
    required: boolean;
  };
};

function parseConfig<T>(raw: unknown, schema: Schema<T>): T {
    if (typeof raw !== "object" || raw === null) {
        throw new Error("Config must be an object");
    }

    const result: any = {};
    const config = raw as Record<string, any>;

    for (const key in schema) {
        const field = schema[key];
        const value = config[key];

        if (field.required && value === undefined) {
            throw new Error(`Missing required field: ${key}`);
        }

        if (value === undefined) {
            result[key] = undefined;
            continue;
        }

        if (field.type === "number") {
            const num = typeof value === "string" ? parseFloat(value) : value;
            if (typeof num !== "number" || isNaN(num)) {
                throw new Error(`Field ${key} must be a number`);
            }
            result[key] = num;
        } else if (field.type === "string") {
            if (typeof value !== "string") {
                throw new Error(`Field ${key} must be a string`);
            }
            result[key] = value;
        } else if (field.type === "boolean") {
            if (typeof value !== "boolean") {
                throw new Error(`Field ${key} must be a boolean`);
            }
            result[key] = value;
        }
    }

    return result as T;
}',
  '[
    {
      "name": "Basic parsing",
      "input": "[{\"port\": \"3000\", \"host\": \"localhost\"}, {\"port\": {\"type\": \"number\", \"required\": true}, \"host\": {\"type\": \"string\", \"required\": true}}]",
      "expected": "{\"port\": 3000, \"host\": \"localhost\"}"
    },
    {
      "name": "Missing required field",
      "input": "[{\"host\": \"localhost\"}, {\"port\": {\"type\": \"number\", \"required\": true}, \"host\": {\"type\": \"string\", \"required\": true}}]",
      "expected": "Error: Missing required field: port"
    },
    {
      "name": "Type conversion",
      "input": "[{\"port\": \"8080\", \"debug\": true}, {\"port\": {\"type\": \"number\", \"required\": true}, \"debug\": {\"type\": \"boolean\", \"required\": false}}]",
      "expected": "{\"port\": 8080, \"debug\": true}"
    },
    {
      "name": "Invalid type",
      "input": "[{\"port\": \"abc\"}, {\"port\": {\"type\": \"number\", \"required\": true}}]",
      "expected": "Error: Field port must be a number"
    }
  ]'::jsonb,
  '[
    "Start by validating that raw is actually an object, not null or undefined.",
    "Iterate through each key in the schema to validate and transform.",
    "For required fields, check if the value exists before processing.",
    "Use parseFloat() to convert string numbers, but remember to check for NaN.",
    "The return type should be properly cast as T for type safety."
  ]'::jsonb,
  3
);

-- =============================================================================
-- CREATING TEST USERS
-- =============================================================================
-- Supabase Auth users cannot be seeded via SQL. Create test users using:
--
-- Option 1: Supabase Dashboard
--   1. Go to Authentication > Users in your Supabase project
--   2. Click "Add user" > "Create new user"
--   3. Enter email: demo@codementor.dev, password: demo123
--   4. The profile will be auto-created via the handle_new_user() trigger
--
-- Option 2: Supabase Auth API (in your app code)
--   const { data, error } = await supabase.auth.signUp({
--     email: 'demo@codementor.dev',
--     password: 'demo123',
--     options: { data: { username: 'demo_user' } }
--   });
--
-- Option 3: Supabase Admin API (requires service role key)
--   const { data, error } = await supabase.auth.admin.createUser({
--     email: 'demo@codementor.dev',
--     password: 'demo123',
--     email_confirm: true,
--     user_metadata: { username: 'demo_user' }
--   });
-- =============================================================================