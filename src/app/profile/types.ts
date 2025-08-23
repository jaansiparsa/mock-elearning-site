export interface ProfileUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  avatarUrl?: string;
  role: string;
  notificationPreference: boolean;
  preferredStudyTime: string;
  createdAt: Date;
  updatedAt: Date;
}
