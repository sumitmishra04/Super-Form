import { ISkill } from './ISkill';

export interface IEmployee {
    id: number;
    dp: string;
    fullName: string;
    email: string;
    phone?: number;
    contactPreference: string;
    skills: ISkill[];
}

