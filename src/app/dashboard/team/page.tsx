import { Search, Plus, MoreHorizontal, Mail } from "lucide-react";

const TEAM_MEMBERS = [
  {
    id: 1,
    name: "Ayush Dongare",
    email: "dongareayush16@gmail.com",
    role: "Owner",
    joined: "Oct 24, 2023",
    avatar: "A",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Admin",
    joined: "Nov 2, 2023",
    avatar: "J",
  },
  {
    id: 3,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Member",
    joined: "Dec 15, 2023",
    avatar: "J",
  },
];

export default function TeamPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Team</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your workspace members and their access levels.
          </p>
        </div>
        <button className="h-9 px-4 flex items-center justify-center gap-2 bg-foreground text-background hover:opacity-90 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-zinc-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search members..."
              className="w-full h-9 pl-9 pr-4 bg-zinc-100 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{TEAM_MEMBERS.length} members</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground bg-zinc-50/50 dark:bg-white/5 border-b border-zinc-200 dark:border-white/10">
              <tr>
                <th scope="col" className="px-6 py-3 font-medium">User</th>
                <th scope="col" className="px-6 py-3 font-medium">Role</th>
                <th scope="col" className="px-6 py-3 font-medium">Joined</th>
                <th scope="col" className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-white/10">
              {TEAM_MEMBERS.map((member) => (
                <tr key={member.id} className="hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs font-medium text-foreground">
                        {member.avatar}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{member.name}</div>
                        <div className="text-muted-foreground text-[13px] flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3 h-3" />
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-medium bg-zinc-100 dark:bg-white/10 text-foreground">
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {member.joined}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-white/10 rounded-md transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
