export interface Candidate {

    id: string;
    Job_title: JobProfile[];

    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    file_name: string;
    file_path: string;

    note: string;
    address: string;
    experience: string;
    graduated_year: string;

    uploaded_by_id: number;
    uploaded_by_name: string;
    uploaded_photoURL: string;

    comment: string;

    job_skills_id?:JobProfileSkill[];


    updatedAt: Date | string;
    createdAt: Date | string;
}

export interface CandidateFilter {

  id: string;
  job_title_id: string;

  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  file_name: string;
  file_path: string;

  note: string;
  address: string;
  experience: string;
  graduated_year: string;

  job_skills_id?:string;

}


export interface JobProfile {

    id?: string;
    job_title_id?: string;
    hr_job_title?: string;
    description?:string;
    status?:JobProfileStatus;
    job_status?:string;
    job_skills_id?:JobProfileSkill[];
}
export interface JobProfileSkill {
  job_skill_id: number;
  hr_job_title: string;
  deleted: boolean;
}
export interface JobSkill {
    id: number;
    job_skill?: string;

  }

export enum JobProfileStatus{
    ACTIVE='1',
    NOT_ACTIVE='0',
}