import { createClient } from "@/lib/supabase/server";
import { ChallengeCard } from "@/components/ChallengeCard";
import { ProgressBar } from "@/components/ProgressBar";
import { LogoutButton } from "@/components/LogoutButton";
export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: challenges } = await supabase
    .from("challenges")
    .select(
      `
      *,
      user_progress!left(*)
    `
    )
    .order("order_index");
  const completed =
    challenges?.filter((c) => c.user_progress?.[0]?.status === "completed")
      .length || 0;
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-display text-4xl text-white">
              Your Challenges
            </h1>
            <LogoutButton />
          </div>
          <ProgressBar completed={completed} total={challenges?.length || 0} />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges?.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      </div>
    </div>
  );
}
