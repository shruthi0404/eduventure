import { formatNumber } from "@/lib/utils";

interface LeaderboardItemProps {
  rank: number;
  username: string;
  avatar?: string;
  level: number;
  xpPoints: number;
}

const LeaderboardItem: React.FC<LeaderboardItemProps> = ({
  rank,
  username,
  avatar,
  level,
  xpPoints,
}) => {
  // Determine badge color based on rank
  const getBadgeColor = () => {
    if (rank === 1) return "bg-accent text-dark";
    if (rank === 2) return "bg-gray-500 text-white";
    if (rank === 3) return "bg-orange-600 text-white";
    return "bg-gray-700 text-white";
  };

  return (
    <tr className="border-b border-gray-700 hover:bg-gray-700">
      <td className="py-3 px-2">
        <span 
          className={`${getBadgeColor()} rounded-full w-6 h-6 inline-flex items-center justify-center font-bold`}
        >
          {rank}
        </span>
      </td>
      <td className="py-3 flex items-center">
        <img 
          src={avatar || `https://ui-avatars.com/api/?name=${username}&background=random`} 
          alt="Avatar" 
          className="w-8 h-8 rounded-full mr-3" 
        />
        <span>{username}</span>
      </td>
      <td className="py-3">
        <span className="bg-primary bg-opacity-20 text-primary px-2 py-1 rounded">Level {level}</span>
      </td>
      <td className="py-3 text-right font-bold text-accent">{formatNumber(xpPoints)}</td>
    </tr>
  );
};

export default LeaderboardItem;
