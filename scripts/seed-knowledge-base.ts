/**
 * Seed Knowledge Base with Embeddings
 *
 * This script:
 * 1. Defines documentation for each challenge
 * 2. Generates embeddings via OpenAI
 * 3. Inserts into Supabase knowledge_base table
 *
 * Usage: npm run seed:knowledge-base
 */

import { createClient } from "@supabase/supabase-js";
import { OpenAI } from "openai";

// Initialize clients
const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Need service role for seeding
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Knowledge base content
const knowledgeBase = [
  // ================================================================
  // Challenge 1: FizzBuzz (Python)
  // ================================================================
  {
    challengeTitle: "FizzBuzz Classic",
    documents: [
      {
        content: `The modulo operator (%) in Python returns the remainder of division. Example: 15 % 3 = 0 because 15 divided by 3 has no remainder. Example: 15 % 4 = 3 because 15 divided by 4 has remainder 3. When checking if a number is divisible by another, we check if the remainder equals 0.`,
        type: "language_docs",
        language: "python",
        metadata: {
          topic: "modulo_operator",
          source: {
            title: "Python Documentation: Numeric Types",
            url: "https://docs.python.org/3/library/stdtypes.html#numeric-types-int-float-complex",
            section: "Modulo Operation",
          },
          tags: ["beginner", "math", "operators"],
          difficulty: "easy",
        },
      },
      {
        content: `Order of conditions matters in if-elif-else statements. Always check the most specific condition first. For FizzBuzz, check divisibility by both 3 AND 5 before checking 3 or 5 individually. Example: if n % 15 == 0 checks for multiples of both (most specific), elif n % 3 == 0 checks for multiples of 3 only, elif n % 5 == 0 checks for multiples of 5 only.`,
        type: "common_patterns",
        language: "python",
        metadata: {
          topic: "conditional_ordering",
          source: {
            title: "Python Tutorial: Control Flow",
            url: "https://docs.python.org/3/tutorial/controlflow.html#if-statements",
            section: "if Statements",
          },
          tags: ["control-flow", "conditionals"],
          difficulty: "easy",
        },
      },
      {
        content: `Type conversion in Python: str() converts numbers to strings, for example str(7) returns "7". int() converts strings to numbers, for example int("7") returns 7. Remember to return strings when the function signature expects string output. Python will not automatically convert types for you.`,
        type: "best_practices",
        language: "python",
        metadata: {
          topic: "type_conversion",
          source: {
            title: "Python Built-in Functions",
            url: "https://docs.python.org/3/library/functions.html#func-str",
            section: "str()",
          },
          tags: ["types", "strings", "conversion"],
          difficulty: "easy",
        },
      },
    ],
  },

  // ================================================================
  // Challenge 2: Two Sum (JavaScript)
  // ================================================================
  {
    challengeTitle: "Two Sum Problem",
    documents: [
      {
        content: `JavaScript Map object provides O(1) key-value lookups. Map.set(key, value) adds entries, Map.get(key) retrieves values, Map.has(key) checks if a key exists. Maps are better than objects for frequent additions and lookups, and when keys might not be strings. They maintain insertion order and have a size property.`,
        type: "language_docs",
        language: "javascript",
        metadata: {
          topic: "map_usage",
          source: {
            title: "MDN Web Docs: Map",
            url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map",
            section: "Instance Methods",
          },
          tags: ["data-structures", "hash-map", "performance"],
          difficulty: "medium",
        },
      },
      {
        content: `The complement pattern for Two Sum: For each number in the array, calculate complement = target - current_number. If the complement has been seen before, you found the pair! Example: target = 9, current = 2, complement = 9 - 2 = 7. If we saw 7 earlier in the array, return those two indices. This pattern works in a single pass through the array.`,
        type: "common_patterns",
        language: "javascript",
        metadata: {
          topic: "complement_search",
          source: {
            title: "LeetCode Two Sum Discussion",
            url: "https://leetcode.com/problems/two-sum/solution/",
            section: "Approach 3: One-pass Hash Table",
          },
          tags: ["algorithm", "hash-table", "pattern"],
          difficulty: "medium",
        },
      },
      {
        content: `Common mistake: Using the same element twice. The problem states you cannot use the same element twice. To prevent this, store elements in your Map AFTER checking for their complement. This ensures you cannot use the current element as its own complement. Example: for array [3, 3] with target 6, the answer is [0, 1], not [0, 0].`,
        type: "best_practices",
        language: "javascript",
        metadata: {
          topic: "element_reuse_prevention",
          source: {
            title: "Common Coding Interview Mistakes",
            url: "https://www.techinterviewhandbook.org/algorithms/array/",
            section: "Two Sum Pitfalls",
          },
          tags: ["common-mistake", "edge-case"],
          difficulty: "medium",
        },
      },
    ],
  },

  // ================================================================
  // Challenge 3: Type-Safe Config Parser (TypeScript)
  // ================================================================
  {
    challengeTitle: "Generic Config Parser",
    documents: [
      {
        content: `TypeScript type guards validate types at runtime. Use typeof to check primitive types: typeof value === "string" checks for strings, typeof value === "number" checks for numbers, typeof value === "boolean" checks for booleans. Always validate types before using values from unknown sources. Type guards narrow the type within their scope.`,
        type: "language_docs",
        language: "typescript",
        metadata: {
          topic: "type_guards",
          source: {
            title: "TypeScript Handbook: Narrowing",
            url: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#typeof-type-guards",
            section: "typeof type guards",
          },
          tags: ["types", "runtime-validation"],
          difficulty: "hard",
        },
      },
      {
        content: `Parsing strings to numbers safely in TypeScript: parseFloat(value) converts a string to a number, but always check for NaN after parsing! Use isNaN(num) to validate. Example: parseFloat("abc") returns NaN, not an error. You must explicitly check: const num = parseFloat(value); if (isNaN(num)) throw new Error("Invalid number");`,
        type: "best_practices",
        language: "typescript",
        metadata: {
          topic: "safe_parsing",
          source: {
            title: "MDN Web Docs: parseFloat",
            url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat",
            section: "Return value",
          },
          tags: ["validation", "error-handling", "parsing"],
          difficulty: "hard",
        },
      },
      {
        content: `TypeScript generics create type-safe reusable functions. Example: function parseConfig<T>(schema: Schema<T>): T ensures the return type matches the schema type parameter. The generic T is constrained by the schema structure. This allows the compiler to verify that the returned object matches the expected type at compile time.`,
        type: "language_docs",
        language: "typescript",
        metadata: {
          topic: "generics",
          source: {
            title: "TypeScript Handbook: Generics",
            url: "https://www.typescriptlang.org/docs/handbook/2/generics.html",
            section: "Generic Types",
          },
          tags: ["generics", "type-safety", "advanced"],
          difficulty: "hard",
        },
      },
    ],
  },
];

async function seedKnowledgeBase() {
  console.log("🌱 Starting knowledge base seeding...\n");

  let totalDocuments = 0;
  let successCount = 0;
  let errorCount = 0;

  for (const challenge of knowledgeBase) {
    console.log(`📚 Processing: ${challenge.challengeTitle}`);

    // Get challenge ID from database
    const { data: challengeData, error: challengeError } = await supabase
      .from("challenges")
      .select("id")
      .eq("title", challenge.challengeTitle)
      .single();

    if (challengeError || !challengeData) {
      console.error(`  ❌ Challenge not found: ${challenge.challengeTitle}`);
      errorCount += challenge.documents.length;
      continue;
    }

    const challengeId = challengeData.id;

    for (const doc of challenge.documents) {
      totalDocuments++;

      try {
        // 1. Generate embedding
        console.log(`  🔄 Generating embedding for: ${doc.metadata.topic}`);

        const embeddingResponse = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: doc.content,
        });

        const embedding = embeddingResponse.data[0].embedding;

        // 2. Insert into database
        const { error: insertError } = await supabase
          .from("knowledge_base")
          .insert({
            challenge_id: challengeId,
            content: doc.content,
            embedding: embedding,
            type: doc.type,
            language: doc.language,
            metadata: doc.metadata,
          });

        if (insertError) {
          console.error(`  ❌ Error inserting: ${insertError.message}`);
          errorCount++;
        } else {
          console.log(`  ✅ Inserted: ${doc.metadata.topic}`);
          successCount++;
        }

        // Rate limiting (OpenAI has limits)
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`  ❌ Error processing doc:`, error);
        errorCount++;
      }
    }

    console.log(""); // Blank line between challenges
  }

  // Summary
  console.log(
    "================================================================"
  );
  console.log("📊 Seeding Summary");
  console.log(
    "================================================================"
  );
  console.log(`Total documents: ${totalDocuments}`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  console.log("");

  // Verify
  const { data: stats } = await supabase
    .from("knowledge_base")
    .select("type, language", { count: "exact" });

  if (stats) {
    console.log("📈 Database Stats:");
    console.log(`Total rows in knowledge_base: ${stats.length}`);

    // Group by type
    const byType = stats.reduce((acc, row) => {
      acc[row.type] = (acc[row.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log("By type:", byType);

    // Group by language
    const byLanguage = stats.reduce((acc, row) => {
      acc[row.language] = (acc[row.language] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log("By language:", byLanguage);
  }

  console.log("");
  console.log("✅ Knowledge base seeding complete!");
  console.log("");
  console.log("Next steps:");
  console.log("1. Test vector search: SELECT * FROM match_knowledge(...);");
  console.log("2. Update hint generation to use RAG");
  console.log("3. Deploy and monitor effectiveness");
}

// Run it
seedKnowledgeBase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
