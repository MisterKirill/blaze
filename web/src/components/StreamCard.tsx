import { StreamInfo } from "@/lib/streams";
import moment from "moment";
import Link from "next/link";

function convertNumber(n: number): string {
  if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(2) + "k";
  if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(2) + "M";
  if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(2) + "B";
  if (n >= 1e12) return +(n / 1e12).toFixed(2) + "T";
  else return n.toString();
}

export default function StreamCard({ stream }: { stream: StreamInfo }) {
  return (
    <Link href={`/${stream.username}`} className="flex flex-col p-4 bg-slate-800 rounded-xl hover:bg-slate-700">
      {stream.stream_name && (
        <span className="text-slate-200 font-bold text-xl">{stream.stream_name}</span>
      )}
      
      <span className="text-slate-400 font-medium">
        {convertNumber(stream.viewers_count)} viewers • {moment(stream.stream_ready_time).fromNow()}
      </span>

      <span className="text-slate-400 font-medium">
        {stream.display_name ? stream.display_name : `@${stream.username}`}
      </span>
    </Link>
  );
}
