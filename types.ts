
export interface Song {
  id: string;
  title: string;
  youtubeLink?: string;
  spotifyLink?: string;
  videoUrl?: string;
}

export interface Social {
  id: string;
  name: 'Instagram' | 'YouTube' | 'Spotify' | 'Facebook' | 'TikTok' | 'X' | 'Snapchat';
  url: string;
}

export interface UpcomingProject {
  id: string;
  title: string;
  youtubeTrailer?: string;
  spotifyPreSave?: string;
  releaseDate?: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}

export interface Idea {
  id: string;
  author: string;
  content: string;
  date: string;
}

export interface AppData {
  about: string;
  headerLogo: string;
  artistCover: string;
  contactEmail: string;
  songs: Song[];
  socials: Social[];
  upcoming: UpcomingProject[];
  messages: Message[];
  ideas: Idea[];
  securityEmail?: string;
}
