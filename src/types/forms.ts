// Type definitions for church management forms and certifications
// Certification Types
export interface MarriageRequestData {
    brideId?: string;
    groomId?: string;
    brideName: string;
    bridePhone: string;
    brideEmail?: string;
    brideNationalId: string; // Added
    groomName: string;
    groomPhone: string;
    groomEmail?: string;
    groomNationalId: string; // Added
    requesterName?: string;
    requesterPhone?: string;
    requesterEmail: string;
    requesterNationalId?: string; // Added
    weddingDate: string;
    location?: string;
    witness1Name: string;
    witness1Phone: string;
    witness2Name: string;
    witness2Phone: string;
}

export interface BaptismRequestData {
    childName: string;
    dateOfBirth: string;
    requesterName?: string;
    requesterPhone?: string;
    requesterEmail: string;
    requesterNationalId?: string; // Added
    requesterId?: string;
}

// Form Types
export interface YouthFormData {
    name: string;
    idNumber: string;
    phone: string;
    email: string;
    district: string;
    sector: string;
    churchCell: string;
    youthFamily: string;
}

export interface CellRecommendationData {
    names: string;
    idNumber: string;
    phone: string;
    email: string;
    district: string;
    sector: string;
    churchCellName: string;
}

export interface ChurchRecommendationData {
    type: 'YOUTH' | 'OLD';
    idNumber: string;
    name: string;
    email?: string;
    phone?: string;
    district: string;
    sector: string;
    cellRecommendation: string;
    youthRecommendation?: string;
    passportPhoto?: string;
}

export interface BaptismCertificationData {
    name: string;
    email: string;
    phone: string;
    baptismDate: string;
}

export interface MarriageCertificateData {
    brideName: string;
    groomName: string;
    brideEmail: string;
    groomEmail: string;
    bridePhone: string;
    groomPhone: string;
    brideAddress: string;
    groomAddress: string;
}

export interface WeddingRequestData {
    brideName: string;
    groomName: string;
    brideEmail: string;
    groomEmail: string;
    bridePhone: string;
    groomPhone: string;
    marenName: string;
    parenName: string;
    idCopies?: string[];
}

export interface ChildDedicationData {
    parentNames: string;
    childNames: string;
    dateOfBirth: string;
    parentPhone: string;
    parentEmail: string;
    dedicationDate: string;
    churchService: string;
}

export interface PrayerRequestData {
    requesterName: string;
    requesterEmail: string;
    request: string;
    isPrivate: boolean;
}

export interface AppointmentRequestData {
    requesterName: string;
    requesterEmail: string;
    requesterPhone: string;
    preferredDate: string;
    preferredTime: string;
    reason: string;
    pastorId?: string;
}


// Form Status Types
export type FormStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

