import axios from "axios";

const api = axios.create({
  baseURL: "zappy-backend-production.up.railway.app",
  // baseURL: "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

interface startSessionResponse {
  message: string;
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
  async getStatus() {
    const { data } = await api.get("/status");
    return data;
  },

  async getSession() {
    console.log("chamou");
    const { data } = await api.get<startSessionResponse>("/session");
    return data;
  },

  async getGroups() {
    const { data } = await api.get<GroupsResponse>("/groups");
    return data;
  },

  async getExtractedMembers(groupId: string) {
    const { data } = await api.get<ExtractMembersResponse>(
      `groups/${groupId}/contacts`
    );
    return data;
  },

  async sendMessages(contacts: string[], message: string) {
    const { data } = await api.post("/send-messages", {
      contacts,
      message,
    });
    return data;
  },
};
