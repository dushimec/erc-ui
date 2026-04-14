export type Role = 'ADMIN' | 'MEMBER' | 'PASTOR' | 'DEACON';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: Role;
    avatarUrl?: string;
    isVerified: boolean;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    profileImage?: {
        url: string;
    };
}

export interface Member {
    id: string;
    names: string;
    email?: string;
    phoneNumber?: string;
    idNumber?: string;
    district?: string;
    sector?: string;
    cell?: string;
    churchCell?: string;
    dateOfBirth?: string;
    gender?: string;
    maritalStatus?: string;
    nationality?: string;
    occupation?: string;
    address?: string;
    baptismDate?: string;
    confirmationDate?: string;
    spiritualMaturity?: string;
    ministryPreferences: string[];
    dateJoined: string;
}

export interface Service {
    id: string;
    title: string;
    description?: string;
    serviceType: string;
    date: string;
    location: string;
    preacherId?: string;
    choirLeaderId?: string;
    startTime: string;
    endTime: string;
    attendanceCount: number;
    imageUrl?: string;
}


export interface Contribution {
    id: string;
    memberId: string;
    amount: number;
    contributionType: string;
    paymentMethod: string;
    transactionId: string;
    receiptUrl?: string;
    notes?: string;
    date: string;
    verified: boolean;
}

export interface Sermon {
    id: string;
    title: string;
    preacherId: string;
    serviceId?: string;
    date: string;
    theme?: string;
    scripture?: string;
    audioUrl?: string;
    videoUrl?: string;
    text?: string;
    tags?: string;
}

export interface PrayerRequest {
    id: string;
    memberId: string;
    request: string;
    isPrivate: boolean;
    responded: boolean;
    response?: string;
    pastorId?: string;
    respondedAt?: string;
    requesterName?: string;
    requesterEmail?: string;
    createdAt: string;
    member?: {
        firstName: string;
        lastName: string;
        email: string;
    };
}

export interface Event {
    id: string;
    title: string;
    description?: string;
    eventType: string;
    date: string;
    location: string;
    organizerId?: string;
    imageUrl?: string;
}


export interface CounselingAppointment {
    id: string;
    memberId: string;
    pastorId?: string;
    requesterName?: string;
    requesterEmail?: string;
    requesterPhone?: string;
    date: string;
    startTime: string; // Keep if still sent by backend or just empty string
    endTime: string;   // Keep if still sent by backend or just empty string
    reason: string;
    purpose?: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
    notes?: string;
    createdAt: string;
    member?: {
        firstName: string;
        lastName: string;
        email: string;
    };
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    require2FA?: boolean;
}
