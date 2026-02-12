import { Card } from "@/components/ui/card";

interface StatsProps {
  savedCount: number;
  searchCount: number;
  hasCompany: boolean;
}

export function StatsOverview({ savedCount, searchCount, hasCompany }: StatsProps) {
  const stats = [
    {
      name: "Saved Grants",
      value: savedCount,
      icon: (
        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
        </svg>
      ),
    },
    {
      name: "Searches Made",
      value: searchCount,
      icon: (
        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      ),
    },
    {
      name: "Company Linked",
      value: hasCompany ? "Yes" : "No",
      icon: (
        <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card key={stat.name}>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-gray-50 p-3">{stat.icon}</div>
            <div>
              <p className="text-sm text-gray-500">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
