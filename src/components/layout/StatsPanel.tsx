import {
  Shield,
  BookOpen,
  TrendingUp,
  Users,
} from "lucide-react";

const stats = [
  {
    value: "12,842",
    label: "Games Analyzed",
    icon: Shield,
  },
  {
    value: "3.1M",
    label: "Variations Explored",
    icon: BookOpen,
  },
  {
    value: "1.6M",
    label: "Moves Evaluated",
    icon: TrendingUp,
  },
  {
    value: "97K+",
    label: "Seekers of the Game",
    icon: Users,
  },
];

function StatsPanel() {
  return (
    <section className="grid grid-cols-2 gap-4 px-10 py-8">

      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-xl border border-[#352819] bg-[#0c0e0d] p-6"
          >
            <div className="flex items-center gap-4">

              <Icon
                size={30}
                className="text-[#a67b36]"
              />

              <div>
                <p className="font-serif text-2xl text-[#b73527]">
                  {stat.value}
                </p>

                <p className="mt-1 font-serif text-sm text-[#8e806b]">
                  {stat.label}
                </p>
              </div>

            </div>
          </div>
        );
      })}

    </section>
  );
}

export default StatsPanel;