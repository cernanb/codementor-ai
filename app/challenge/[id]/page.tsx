import { createClient } from "@/lib/supabase/server";
import { CodeEditor } from "@/components/CodeEditor";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import Link from "next/link";
import Markdown from "react-markdown";
export default async function ChallengePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: challenge } = await supabase
    .from("challenges")
    .select("*")
    .eq("id", id)
    .single();
  if (!challenge) notFound();
  return (
    <div className="h-screen flex">
      <aside className="w-96 bg-slate-900 border-r border-slate-800 overflow-y-auto">
        <div className="p-6">
          <Link
            href="/dashboard"
            className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] text-sm flex items-center gap-2 mb-4 transition-colors"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="font-display text-2xl text-white mb-4">
            {challenge.title}
          </h1>
          <Badge>{challenge.difficulty}</Badge>
          <div className="prose prose-invert mt-6">
            <Markdown
              components={{
                code: ({ className, children, ...props }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code
                      className="bg-[var(--color-code-bg)] text-[var(--color-warning)] px-1.5 py-0.5 rounded text-sm font-mono"
                      {...props}
                    >
                      {children}
                    </code>
                  ) : (
                    <code
                      className="block bg-[var(--color-code-bg)] border border-[var(--color-border)] rounded-md p-4 text-sm font-mono overflow-x-auto"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => <>{children}</>,
              }}
            >
              {challenge.description}
            </Markdown>
          </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col">
        <CodeEditor
          challengeId={challenge.id}
          language={challenge.language}
          starterCode={challenge.starter_code}
        />
      </main>
    </div>
  );
}
