import axios from "axios";

const api = axios.create({
  baseURL: "https://zappy-backend.fly.dev/",
  headers: {
    "Content-Type": "application/json",
  },
});

interface startSessionResponse {
  message: string;
  userId: string;
  qrCode?: string;
}
export interface Group {
  id: string;
  name: string;
}

interface GroupsResponse {
  groups: Group[];
}
interface Contact {
  id: string;
  name: string;
  number: string;
}

export interface ExtractMembersResponse {
  contacts: Contact[];
}

export const WhastappService = {
  async getStatus(userId: string) {
    const { data } = await api.get(`/status/${userId}`);
    return data;
  },

  async startSession(userId: string) {
    const { data } = await api.post<startSessionResponse>("/session", {
      userId,
    });
    return data;
  },
  async getGroups(userId: string) {
    const { data } = await api.post<GroupsResponse>("/groups", {
      userId,
    });
    return data;
  },

  async extractMembers(groupId: string, userId: string) {
    const { data } = await api.post<ExtractMembersResponse>(
      `groups/${groupId}/contacts`,
      {
        userId,
      }
    );
    return data;
  },
  async sendMessages(userId: string, contacts: string[], message: string) {
    const { data } = await api.post("/send-messages", {
      userId,
      contacts,
      message,
    });
    return data;
  },
};
