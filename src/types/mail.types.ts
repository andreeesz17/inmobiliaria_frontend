export interface MailPayload {
  to: string;
  subject: string;
  message: string;
}

export interface MailLog {
  id: string;
  to: string;
  subject: string;
  content?: string;
  status?: string;
  sentAt?: string;
}
