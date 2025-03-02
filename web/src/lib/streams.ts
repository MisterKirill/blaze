import axios from "./axios";

export interface StreamInfo {
  stream_name: string | null;
  stream_ready_time: string;
  display_name: string | null;
  username: string;
  viewers_count: number;
}

export async function getStreams() {
  try {
    const res = await axios.get("/streams");
    return res.data.streams as StreamInfo[];
  } catch {
    return null;
  }
}
