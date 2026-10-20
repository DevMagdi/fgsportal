export interface QuestionGroup {
    id?:string;
    question_group_title:string;
    group_type_name?:string;
    group_sub_type_id:string;
    group_sub_type_name?:string;
    user_id?:string[];
    users?:QGUsers[];
    status?:boolean | string;
}

export interface QGUsers{
    user_id:string;
    user_name:string;
}

export interface QuestionGroupType{
    id?:string;
    group_type_name:string;
}

export interface QuestionGroupSub_Type{
    id?:string;
    group_type_id:string;
    group_sub_type:string;
}

export interface Question {
    id?:string;
    question:string;
    question_group_id:string;

    question_type_id:string;
    question_type_name?:string;
    
    isMulti?:boolean | string;
    answer?:string[];
    return_answer?:QuestionAnswers[];

    user_creator_id?:string;
    user_creator_name?:string;


    anss?:UserQuestionAnswers;

    // rate?:number;
    // comment?:string;
    // user_answers?:string[];
    // questions?:UserQuestionAnswers;
}

export interface UserQuestionAnswers{
    question_id:string;
    question_type_id:string;
    comment?:string;
    rate?:number;
    answer?:string[];
}

export interface RateAnswers{
    ask_to_rate_id?:string;
    user_to_rate_id?:string;
    question_group_id:string;
    questions:UserQuestionAnswers[];
    task_id?:string;
    ticket_id?:string;
}


export interface QuestionAnswers {
    id?:string;
    answer:string;
    user_creator_id?:string;
    user_creator_name?:string;
    created_at?:string;
}

export interface queestionType{
    id?:string;
    question_type:string;
}


export interface AskForRate {
    id?:string;
    question_group_id:string;
    question_group_title?:string;

    user_rate_id:string;
    user_rate_name?:string;

    user_to_rate_id:string[];
    user_to_rate_name?:string[];

    status?:string;

    created_at?:string;
    updated_at?:string;

    user_creator_id?:string;
    user_creator_name?:string;

    question?:Question[];
}

export interface QuestionRate{
    question_id?:string;
    comment?:string;
    rate?:number;
}

export interface Rating {
    id?:string;
    ask_to_rate_id:string;
    questions:QuestionRate[];
}

export interface QuestionForHistory {
    question_id: string;
    question: string;
    question_group_id: string;
    rate: number;
    comment: string;
    question_type_id:string;
    answer?:string[];
}

export interface RateHistory{
    ask_to_rate_id:string;
    user_creator_id:string;
    user_creator_name:string;
    user_rate_id: string;
    user_rate_name: string;
    user_to_rate_id: string;
    user_to_rate_name: string;
    total_rate: number;
    status: string;
    created_at: string;
    questions:QuestionForHistory[];

    task_id?:string;
    task_name?:string;
    ticket_id?:string;
    ticket_name?:string;
}
